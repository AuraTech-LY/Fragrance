/*
  # Fix admin user setup and permissions

  1. Changes
    - Create admin_users table if it doesn't exist
    - Add proper RLS policies
    - Insert initial admin user with proper UUID mapping to auth.users
  
  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access and updates
*/

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can update their last_login" ON admin_users;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create policies
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  USING (true);  -- Allow reading all admin users

CREATE POLICY "Admin users can update their last_login"
  ON admin_users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to ensure admin user exists
CREATE OR REPLACE FUNCTION ensure_admin_user()
RETURNS void AS $$
BEGIN
    INSERT INTO admin_users (id, email, username)
    VALUES (
        auth.uid(), -- This will use the actual authenticated user's UUID
        'abubaker.elsultani@gmail.com',
        'Bakkori'
    )
    ON CONFLICT (email) DO UPDATE
    SET id = auth.uid(),
        username = EXCLUDED.username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;