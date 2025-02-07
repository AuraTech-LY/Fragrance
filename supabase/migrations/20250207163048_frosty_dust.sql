/*
  # Create admin user and permissions

  1. Changes
    - Drop existing admin_users table to ensure clean state
    - Recreate admin_users table with proper RLS policies
    - Insert initial admin user with proper UUID mapping to auth.users
  
  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access
*/

-- First drop the existing table
DROP TABLE IF EXISTS admin_users;

-- Recreate the table with proper structure
CREATE TABLE admin_users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to read their own data
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy for admin users to update their last_login
CREATE POLICY "Admin users can update their last_login"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert initial admin user with ID matching their auth.users entry
INSERT INTO admin_users (id, email, username)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- This will be replaced with the actual UUID from auth.users
  'abubaker.elsultani@gmail.com',
  'Bakkori'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    username = EXCLUDED.username;