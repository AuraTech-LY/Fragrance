/*
  # Create perfumes table

  1. New Tables
    - `perfumes`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `category` (text, not null)
      - `price` (numeric, not null)
      - `image_url` (text, not null)
      - `description` (text)
      - `notes` (text array)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on perfumes table
    - Add policies for admin CRUD operations
    - Add policies for public read access
*/

-- Create the perfumes table
CREATE TABLE IF NOT EXISTS perfumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  image_url text NOT NULL,
  description text,
  notes text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_perfumes_updated_at
    BEFORE UPDATE ON perfumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Policies
-- Allow public read access
CREATE POLICY "Allow public read access"
  ON perfumes
  FOR SELECT
  USING (true);

-- Allow admin users to perform all operations
CREATE POLICY "Allow admin users full access"
  ON perfumes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insert some initial perfumes
INSERT INTO perfumes (name, category, price, image_url, description, notes)
VALUES
  ('L''Essence du Printemps', 'Floral', 285.00, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80', 'A fresh and vibrant scent that captures the essence of spring blooms.', ARRAY['Rose', 'Jasmine', 'Bergamot']),
  ('Nuit Mystérieuse', 'Oriental', 320.00, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80', 'An enchanting evening fragrance with deep, mysterious notes.', ARRAY['Vanilla', 'Amber', 'Musk']),
  ('Jardin Secret', 'Fresh', 295.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80', 'A secret garden captured in a bottle, fresh and enchanting.', ARRAY['Green Tea', 'Lily', 'Cedar'])
ON CONFLICT DO NOTHING;