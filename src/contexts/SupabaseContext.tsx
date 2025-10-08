import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { AuthUser } from '../lib/auth';
import { getCurrentUser, signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';

export interface AppState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  primaryRole: 'student' | 'manager' | 'admin' | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: AuthUser | null };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  primaryRole: null
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
        primaryRole: action.payload ? getPrimaryRole(action.payload.roles) : null,
        isLoading: false
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

export const SupabaseAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        const { user } = await getCurrentUser();
        dispatch({ type: 'SET_USER', payload: user });
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { user } = await getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Error checking user:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  async function logout() {
    await signOut();
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AppContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useSupabaseApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useSupabaseApp must be used within SupabaseAppProvider');
  }
  return context;
};
