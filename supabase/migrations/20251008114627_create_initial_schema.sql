/*
  # Hall Dining Management System - Initial Schema

  ## Overview
  This migration creates the complete database schema for the Hall Dining Management System,
  including all tables, relationships, RLS policies, and initial setup.

  ## Tables Created

  ### 1. profiles
  - Extends Supabase auth.users with additional profile information
  - Links to user_roles for role-based access control
  - Fields: id (uuid), email, full_name, phone_number, profile_photo, created_at, updated_at

  ### 2. user_roles
  - Manages user roles (student, manager, admin)
  - One user can have multiple roles
  - Fields: id, user_id, role, assigned_by, assigned_at

  ### 3. students
  - Student-specific information
  - Links to profiles table
  - Fields: id, user_id, hall_id, registration_number, student_id, department, room_number, balance, created_at

  ### 4. dining_months
  - 30-day dining periods
  - Only one active at a time
  - Fields: id, name, start_date, end_date, is_active, created_by, created_at

  ### 5. managers
  - Manager assignments for dining months
  - Links students who are assigned as managers
  - Fields: id, user_id, dining_month_id, assigned_by, assigned_at

  ### 6. tokens
  - Meal tokens purchased by students
  - Fields: id, student_id, dining_month_id, duration, meal_type, start_date, end_date, total_cost, is_active, purchase_date

  ### 7. cancelled_days
  - Meal cancellation requests with approval workflow
  - Fields: id, student_id, token_id, cancelled_date, meal_type, refund_amount, request_date, status, approved_by, approved_at

  ### 8. payment_transactions
  - Payment history for balance top-ups
  - Fields: id, student_id, amount, method, transaction_id, status, created_at

  ## Security
  - RLS enabled on all tables
  - Role-based access policies for students, managers, and admins
  - Policies check authentication and ownership/membership

  ## Important Notes
  - Uses auth.uid() for authentication checks
  - All timestamps use timestamptz
  - Foreign keys ensure referential integrity
  - Indexes added for frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone_number text,
  profile_photo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- USER ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('student', 'manager', 'admin')),
  assigned_by uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- =====================================================
-- STUDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hall_id text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  student_id text UNIQUE NOT NULL,
  department text NOT NULL,
  room_number text NOT NULL,
  balance numeric(10, 2) DEFAULT 0 CHECK (balance >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own data"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update own data"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- =====================================================
-- DINING MONTHS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS dining_months (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  CHECK (end_date > start_date)
);

ALTER TABLE dining_months ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active dining months"
  ON dining_months FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage dining months"
  ON dining_months FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- =====================================================
-- MANAGERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS managers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dining_month_id uuid NOT NULL REFERENCES dining_months(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dining_month_id)
);

ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view own assignments"
  ON managers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view managers"
  ON managers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage manager assignments"
  ON managers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- =====================================================
-- TOKENS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  dining_month_id uuid NOT NULL REFERENCES dining_months(id) ON DELETE CASCADE,
  duration integer NOT NULL CHECK (duration IN (5, 7, 15, 30)),
  meal_type text NOT NULL CHECK (meal_type IN ('lunch', 'lunch_dinner')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_cost numeric(10, 2) NOT NULL CHECK (total_cost > 0),
  is_active boolean DEFAULT true,
  purchase_date timestamptz DEFAULT now(),
  CHECK (end_date > start_date)
);

ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own tokens"
  ON tokens FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create tokens"
  ON tokens FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all tokens"
  ON tokens FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'admin')
    )
  );

-- =====================================================
-- CANCELLED DAYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cancelled_days (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  token_id uuid NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  cancelled_date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('lunch', 'dinner', 'both')),
  refund_amount numeric(10, 2) NOT NULL CHECK (refund_amount >= 0),
  request_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz
);

ALTER TABLE cancelled_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own cancellations"
  ON cancelled_days FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create cancellation requests"
  ON cancelled_days FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all cancellations"
  ON cancelled_days FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'admin')
    )
  );

CREATE POLICY "Managers can update cancellation status"
  ON cancelled_days FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'admin')
    )
  );

-- =====================================================
-- PAYMENT TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  method text NOT NULL CHECK (method IN ('bkash', 'nagad', 'rocket', 'card')),
  transaction_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create transactions"
  ON payment_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role IN ('manager', 'admin')
    )
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_tokens_student_id ON tokens(student_id);
CREATE INDEX IF NOT EXISTS idx_tokens_dining_month_id ON tokens(dining_month_id);
CREATE INDEX IF NOT EXISTS idx_tokens_is_active ON tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_cancelled_days_student_id ON cancelled_days(student_id);
CREATE INDEX IF NOT EXISTS idx_cancelled_days_status ON cancelled_days(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_student_id ON payment_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_managers_user_id ON managers(user_id);
CREATE INDEX IF NOT EXISTS idx_managers_dining_month_id ON managers(dining_month_id);
CREATE INDEX IF NOT EXISTS idx_dining_months_is_active ON dining_months(is_active);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one active dining month
CREATE OR REPLACE FUNCTION ensure_single_active_dining_month()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE dining_months SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_dining_month_trigger
  BEFORE INSERT OR UPDATE ON dining_months
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION ensure_single_active_dining_month();

-- Function to process approved cancellation refunds
CREATE OR REPLACE FUNCTION process_cancellation_refund()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    UPDATE students
    SET balance = balance + NEW.refund_amount
    WHERE id = NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_cancellation_refund_trigger
  AFTER UPDATE ON cancelled_days
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status = 'pending')
  EXECUTE FUNCTION process_cancellation_refund();

-- Function to update balance on completed payment
CREATE OR REPLACE FUNCTION process_completed_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status = 'pending' THEN
    UPDATE students
    SET balance = balance + NEW.amount
    WHERE id = NEW.student_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_completed_payment_trigger
  AFTER UPDATE ON payment_transactions
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status = 'pending')
  EXECUTE FUNCTION process_completed_payment();