export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  hallId: string;
  registrationNumber: string;
  studentId: string;
  department: string;
  roomNumber: string;
  phoneNumber: string;
  profilePhoto?: string;
  balance: number;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  password: string;
  hallId: string;
  studentId?: string; // Reference to student if manager is a student
  assignedBy?: string; // Admin who assigned this role
  assignedAt?: string;
  diningMonthId?: string; // Which dining month they're managing
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  hallId: string;
  profilePhoto?: string;
}

export interface DiningMonth {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  managers: string[]; // Array of manager IDs assigned to this dining month
}

export interface Token {
  id: string;
  studentId: string;
  duration: 5 | 7 | 15 | 30;
  mealType: 'lunch' | 'lunch_dinner';
  startDate: string;
  endDate: string;
  totalCost: number;
  isActive: boolean;
  purchaseDate: string;
  diningMonthId: string;
}

export interface CancelledDay {
  id: string;
  studentId: string;
  tokenId: string;
  cancelledDate: string;
  mealType: 'lunch' | 'dinner' | 'both';
  refundAmount: number;
  requestDate: string;
  status: 'approved' | 'denied' | 'pending';
  approvedBy?: string;
  approvedAt?: string;
}

export interface MealPricing {
  lunchOnly: number;
  lunchDinner: number;
  special15Day: number;
  special30Day: number;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket' | 'card';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface DashboardStats {
  totalActiveTokens: number;
  totalRevenue: number;
  totalRefunds: number;
  dailyMealCount: number;
  totalStudents: number;
  pendingCancellations: number;
}