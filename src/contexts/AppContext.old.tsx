import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Student, Manager, Admin, Token, CancelledDay, DashboardStats, DiningMonth, PaymentTransaction } from '../types';

interface AppState {
  currentUser: Student | null;
  currentManager: Manager | null;
  currentAdmin: Admin | null;
  userRole: 'student' | 'manager' | 'admin' | null;
  isAuthenticated: boolean;
  students: Student[];
  managers: Manager[];
  admins: Admin[];
  tokens: Token[];
  cancelledDays: CancelledDay[];
  diningMonths: DiningMonth[];
  paymentTransactions: PaymentTransaction[];
  dashboardStats: DashboardStats;
}

type AppAction =
  | { type: 'LOGIN_STUDENT'; payload: Student }
  | { type: 'LOGIN_MANAGER'; payload: Manager }
  | { type: 'LOGIN_ADMIN'; payload: Admin }
  | { type: 'LOGOUT' }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'ADD_TOKEN'; payload: Token }
  | { type: 'ADD_DINING_MONTH'; payload: DiningMonth }
  | { type: 'ADD_CANCELLED_DAY'; payload: CancelledDay }
  | { type: 'ADD_PAYMENT_TRANSACTION'; payload: PaymentTransaction }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT_PHOTO'; payload: { studentId: string; profilePhoto: string } }
  | { type: 'ASSIGN_MANAGERS'; payload: { diningMonthId: string; managerIds: string[] } }
  | { type: 'UPDATE_STUDENT_BALANCE'; payload: { studentId: string; amount: number } }
  | { type: 'UPDATE_CANCELLED_DAY_STATUS'; payload: { id: string; status: 'approved' | 'denied'; approvedBy: string } }
  | { type: 'UPDATE_DASHBOARD_STATS'; payload: Partial<DashboardStats> };

const initialState: AppState = {
  currentUser: null,
  currentManager: null,
  currentAdmin: null,
  userRole: null,
  isAuthenticated: false,
  students: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@university.edu',
      password: 'student123',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-001',
      studentId: 'STU-2024-001',
      department: 'Computer Science',
      roomNumber: '101',
      phoneNumber: '+880123456789',
      profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      balance: 5000
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@university.edu',
      password: 'student456',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-002',
      studentId: 'STU-2024-002',
      department: 'Electrical Engineering',
      roomNumber: '205',
      phoneNumber: '+880123456790',
      profilePhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      balance: 3500
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      password: 'student789',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-003',
      studentId: 'STU-2024-003',
      department: 'Mechanical Engineering',
      roomNumber: '312',
      phoneNumber: '+880123456791',
      profilePhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      balance: 2800
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@university.edu',
      password: 'student101',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-004',
      studentId: 'STU-2024-004',
      department: 'Civil Engineering',
      roomNumber: '408',
      phoneNumber: '+880123456792',
      profilePhoto: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      balance: 4200
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@university.edu',
      password: 'student202',
      hallId: 'HALL-001',
      registrationNumber: 'REG-2024-005',
      studentId: 'STU-2024-005',
      department: 'Business Administration',
      roomNumber: '515',
      phoneNumber: '+880123456793',
      profilePhoto: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      balance: 3800
    }
  ],
  managers: [
    {
      id: '4', // Sarah Wilson as manager
      name: 'Sarah Wilson',
      email: 'sarah.wilson@university.edu',
      password: 'student101',
      hallId: 'HALL-001',
      studentId: '4',
      assignedBy: 'admin-1',
      assignedAt: '2024-12-25T00:00:00Z',
      diningMonthId: 'dm-1'
    },
    {
      id: '5', // David Brown as manager
      name: 'David Brown',
      email: 'david.brown@university.edu',
      password: 'student202',
      hallId: 'HALL-001',
      studentId: '5',
      assignedBy: 'admin-1',
      assignedAt: '2024-12-25T00:00:00Z',
      diningMonthId: 'dm-1'
    }
  ],
  admins: [
    {
      id: 'admin-1',
      name: 'Dr. Ahmed Rahman',
      email: 'admin@university.edu',
      password: 'admin123',
      hallId: 'HALL-001',
      profilePhoto: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ],
  tokens: [],
  cancelledDays: [],
  diningMonths: [
    {
      id: 'dm-1',
      name: 'January 2025',
      startDate: '2025-01-01',
      endDate: '2025-01-30',
      isActive: true,
      createdBy: 'admin-1',
      createdAt: '2024-12-25T00:00:00Z',
      managers: ['4', '5']
    }
  ],
  paymentTransactions: [],
  dashboardStats: {
    totalActiveTokens: 0,
    totalRevenue: 0,
    totalRefunds: 0,
    dailyMealCount: 0,
    totalStudents: 5,
    pendingCancellations: 0
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN_STUDENT':
      return {
        ...state,
        currentUser: action.payload,
        currentManager: null,
        currentAdmin: null,
        userRole: 'student',
        isAuthenticated: true
      };
    
    case 'LOGIN_MANAGER':
      return {
        ...state,
        currentUser: null,
        currentManager: action.payload,
        currentAdmin: null,
        userRole: 'manager',
        isAuthenticated: true
      };
    
    case 'LOGIN_ADMIN':
      return {
        ...state,
        currentUser: null,
        currentManager: null,
        currentAdmin: action.payload,
        userRole: 'admin',
        isAuthenticated: true
      };
    
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        currentManager: null,
        currentAdmin: null,
        userRole: null,
        isAuthenticated: false
      };
    
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload]
      };
    
    case 'ADD_TOKEN':
      return {
        ...state,
        tokens: [...state.tokens, action.payload]
      };
    
    case 'ADD_DINING_MONTH':
      return {
        ...state,
        diningMonths: state.diningMonths.map(dm => ({ ...dm, isActive: false })),
        diningMonths: [...state.diningMonths.map(dm => ({ ...dm, isActive: false })), action.payload]
      };
    
    case 'ADD_CANCELLED_DAY':
      return {
        ...state,
        cancelledDays: [...state.cancelledDays, action.payload]
      };
    
    case 'ADD_PAYMENT_TRANSACTION':
      return {
        ...state,
        paymentTransactions: [...state.paymentTransactions, action.payload]
      };
    
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id ? action.payload : student
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    
    case 'UPDATE_STUDENT_PHOTO':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.studentId
            ? { ...student, profilePhoto: action.payload.profilePhoto }
            : student
        ),
        currentUser: state.currentUser?.id === action.payload.studentId
          ? { ...state.currentUser, profilePhoto: action.payload.profilePhoto }
          : state.currentUser
      };
    
    case 'ASSIGN_MANAGERS':
      return {
        ...state,
        diningMonths: state.diningMonths.map(dm =>
          dm.id === action.payload.diningMonthId
            ? { ...dm, managers: action.payload.managerIds }
            : dm
        ),
        managers: state.managers.filter(m => !m.diningMonthId || m.diningMonthId !== action.payload.diningMonthId)
          .concat(
            action.payload.managerIds.map(studentId => {
              const student = state.students.find(s => s.id === studentId);
              return {
                id: studentId,
                name: student?.name || '',
                email: student?.email || '',
                password: student?.password || '',
                hallId: student?.hallId || '',
                studentId,
                assignedBy: state.currentAdmin?.id || '',
                assignedAt: new Date().toISOString(),
                diningMonthId: action.payload.diningMonthId
              };
            })
          )
      };
    
    case 'UPDATE_STUDENT_BALANCE':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.studentId
            ? { ...student, balance: student.balance + action.payload.amount }
            : student
        ),
        currentUser: state.currentUser?.id === action.payload.studentId
          ? { ...state.currentUser, balance: state.currentUser.balance + action.payload.amount }
          : state.currentUser
      };
    
    case 'UPDATE_CANCELLED_DAY_STATUS':
      return {
        ...state,
        cancelledDays: state.cancelledDays.map(day =>
          day.id === action.payload.id
            ? { 
                ...day, 
                status: action.payload.status,
                approvedBy: action.payload.approvedBy,
                approvedAt: new Date().toISOString()
              }
            : day
        )
      };
    
    case 'UPDATE_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: { ...state.dashboardStats, ...action.payload }
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};