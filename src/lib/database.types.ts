export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone_number: string | null
          profile_photo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone_number?: string | null
          profile_photo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone_number?: string | null
          profile_photo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'student' | 'manager' | 'admin'
          assigned_by: string | null
          assigned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'student' | 'manager' | 'admin'
          assigned_by?: string | null
          assigned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'student' | 'manager' | 'admin'
          assigned_by?: string | null
          assigned_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          hall_id: string
          registration_number: string
          student_id: string
          department: string
          room_number: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hall_id: string
          registration_number: string
          student_id: string
          department: string
          room_number: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hall_id?: string
          registration_number?: string
          student_id?: string
          department?: string
          room_number?: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      dining_months: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_active: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_by?: string
          created_at?: string
        }
      }
      managers: {
        Row: {
          id: string
          user_id: string
          dining_month_id: string
          assigned_by: string
          assigned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dining_month_id: string
          assigned_by: string
          assigned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dining_month_id?: string
          assigned_by?: string
          assigned_at?: string
        }
      }
      tokens: {
        Row: {
          id: string
          student_id: string
          dining_month_id: string
          duration: 5 | 7 | 15 | 30
          meal_type: 'lunch' | 'lunch_dinner'
          start_date: string
          end_date: string
          total_cost: number
          is_active: boolean
          purchase_date: string
        }
        Insert: {
          id?: string
          student_id: string
          dining_month_id: string
          duration: 5 | 7 | 15 | 30
          meal_type: 'lunch' | 'lunch_dinner'
          start_date: string
          end_date: string
          total_cost: number
          is_active?: boolean
          purchase_date?: string
        }
        Update: {
          id?: string
          student_id?: string
          dining_month_id?: string
          duration?: 5 | 7 | 15 | 30
          meal_type?: 'lunch' | 'lunch_dinner'
          start_date?: string
          end_date?: string
          total_cost?: number
          is_active?: boolean
          purchase_date?: string
        }
      }
      cancelled_days: {
        Row: {
          id: string
          student_id: string
          token_id: string
          cancelled_date: string
          meal_type: 'lunch' | 'dinner' | 'both'
          refund_amount: number
          request_date: string
          status: 'pending' | 'approved' | 'denied'
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          token_id: string
          cancelled_date: string
          meal_type: 'lunch' | 'dinner' | 'both'
          refund_amount: number
          request_date?: string
          status?: 'pending' | 'approved' | 'denied'
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          token_id?: string
          cancelled_date?: string
          meal_type?: 'lunch' | 'dinner' | 'both'
          refund_amount?: number
          request_date?: string
          status?: 'pending' | 'approved' | 'denied'
          approved_by?: string | null
          approved_at?: string | null
        }
      }
      payment_transactions: {
        Row: {
          id: string
          student_id: string
          amount: number
          method: 'bkash' | 'nagad' | 'rocket' | 'card'
          transaction_id: string
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          method: 'bkash' | 'nagad' | 'rocket' | 'card'
          transaction_id: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          method?: 'bkash' | 'nagad' | 'rocket' | 'card'
          transaction_id?: string
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
