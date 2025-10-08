import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { AuthUser } from '../lib/auth';
import { getCurrentUser, signOut as authSignOut } from '../lib/auth';
import { supabase } from '../lib/supabase';

export interface Student {
  id: string;
  user_id: string;
  name: string;
  email: string;
  hall_id: string;
  registration_number: string;
  student_id: string;
  department: string;
  room_number: string;
  balance: number;
  profile_photo: string | null;
  phone_number: string | null;
}

export interface AppState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: 'student' | 'manager' | 'admin' | null;
  studentData: Student | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_STUDENT_DATA'; payload: Student | null };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userRole: null,
  studentData: null
};

function getPrimaryRole(roles: Array<'student' | 'manager' | 'admin'>): 'student' | 'manager' | 'admin' | null {
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('manager')) return 'manager';
  if (roles.includes('student')) return 'student';
  return null;
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'LOGIN_SUCCESS':
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        userRole: action.payload ? getPrimaryRole(action.payload.roles) : null,
        isLoading: false
      };

    case 'SET_STUDENT_DATA':
      return {
        ...state,
        studentData: action.payload
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false
      };

    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  logout: () => Promise<void>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        await loadUserData();
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state.user && state.user.roles.includes('student')) {
      loadStudentData();
    }
  }, [state.user]);

  async function checkUser() {
    try {
      const { user } = await getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Error checking user:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  async function loadUserData() {
    const { user } = await getCurrentUser();
    dispatch({ type: 'SET_USER', payload: user });
  }

  async function loadStudentData() {
    if (!state.user) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(
            email,
            full_name,
            phone_number,
            profile_photo
          )
        `)
        .eq('user_id', state.user.id)
        .single();

      if (error) throw error;

      if (data) {
        const studentData: Student = {
          id: data.id,
          user_id: data.user_id,
          name: (data.profiles as any).full_name,
          email: (data.profiles as any).email,
          hall_id: data.hall_id,
          registration_number: data.registration_number,
          student_id: data.student_id,
          department: data.department,
          room_number: data.room_number,
          balance: parseFloat(data.balance as any),
          profile_photo: (data.profiles as any).profile_photo,
          phone_number: (data.profiles as any).phone_number
        };

        dispatch({ type: 'SET_STUDENT_DATA', payload: studentData });
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  async function logout() {
    await authSignOut();
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AppContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
