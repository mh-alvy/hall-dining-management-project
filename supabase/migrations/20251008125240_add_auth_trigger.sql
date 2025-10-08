/*
  # Add Auth Trigger for Profile Creation

  ## Overview
  This migration adds a trigger that automatically creates a profile entry
  when a new user signs up via Supabase Auth.

  ## Changes
  1. Creates a function to handle new user signups
  2. Adds a trigger on auth.users table
  3. Automatically creates profile from auth metadata
*/

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, profile_photo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'profile_photo'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();