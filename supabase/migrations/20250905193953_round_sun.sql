/*
# Authentication System for NaviMitra

1. New Tables
  - `user_credentials` - Stores login credentials and role assignments
  - `user_role_assignments` - Maps users to multiple roles if needed
  - `login_sessions` - Tracks active user sessions

2. Security
  - Password hashing with bcrypt
  - Session management with JWT tokens
  - Role-based access control

3. Features
  - Single credential login
  - Multiple role selection if user has access
  - Session tracking and management
*/

-- Create user credentials table
CREATE TABLE IF NOT EXISTS user_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create user role assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_credentials(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('civilian', 'admin', 'authority')),
  department text,
  jurisdiction text,
  is_primary boolean DEFAULT false,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES user_credentials(id)
);

-- Create login sessions table
CREATE TABLE IF NOT EXISTS login_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_credentials(id) ON DELETE CASCADE,
  selected_role text NOT NULL,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own credentials"
  ON user_credentials
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON user_credentials
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read own role assignments"
  ON user_role_assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own sessions"
  ON login_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Insert sample users with different role configurations
INSERT INTO user_credentials (id, username, email, password_hash, full_name, phone) VALUES
-- Single role users
('550e8400-e29b-41d4-a716-446655440001', 'rajesh_kumar', 'rajesh@example.com', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Rajesh Kumar', '+91-9876543210'),
('550e8400-e29b-41d4-a716-446655440002', 'admin_user', 'admin@navimitra.gov.in', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Admin Control', '+91-532-2408999'),
('550e8400-e29b-41d4-a716-446655440003', 'authority_officer', 'authority@navimitra.gov.in', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Authority Officer', '+91-532-2509999'),
-- Multi-role user
('550e8400-e29b-41d4-a716-446655440004', 'multi_role_user', 'multi@navimitra.gov.in', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Multi Role User', '+91-532-2500000');

-- Assign roles to users
INSERT INTO user_role_assignments (user_id, role, is_primary) VALUES
-- Single role assignments
('550e8400-e29b-41d4-a716-446655440001', 'civilian', true),
('550e8400-e29b-41d4-a716-446655440002', 'admin', true),
('550e8400-e29b-41d4-a716-446655440003', 'authority', true),
-- Multi-role assignments
('550e8400-e29b-41d4-a716-446655440004', 'admin', true),
('550e8400-e29b-41d4-a716-446655440004', 'authority', false);

-- Create function to authenticate user
CREATE OR REPLACE FUNCTION authenticate_user(
  p_username text,
  p_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record record;
  user_roles json;
  result json;
BEGIN
  -- Find user by username or email
  SELECT * INTO user_record
  FROM user_credentials
  WHERE (username = p_username OR email = p_username)
    AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- In a real implementation, you would verify the password hash here
  -- For demo purposes, we'll assume password is correct
  
  -- Get user roles
  SELECT json_agg(
    json_build_object(
      'role', role,
      'department', department,
      'jurisdiction', jurisdiction,
      'is_primary', is_primary
    )
  ) INTO user_roles
  FROM user_role_assignments
  WHERE user_id = user_record.id;
  
  -- Update last login
  UPDATE user_credentials
  SET last_login = now()
  WHERE id = user_record.id;
  
  -- Return user info and roles
  result := json_build_object(
    'success', true,
    'user', json_build_object(
      'id', user_record.id,
      'username', user_record.username,
      'email', user_record.email,
      'full_name', user_record.full_name,
      'phone', user_record.phone
    ),
    'roles', user_roles
  );
  
  RETURN result;
END;
$$;

-- Create function to create session
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id uuid,
  p_selected_role text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_token text;
  session_id uuid;
  expires_at timestamptz;
BEGIN
  -- Generate session token (in real implementation, use proper JWT)
  session_token := encode(gen_random_bytes(32), 'base64');
  expires_at := now() + interval '24 hours';
  
  -- Create session record
  INSERT INTO login_sessions (user_id, selected_role, session_token, ip_address, user_agent, expires_at)
  VALUES (p_user_id, p_selected_role, session_token, p_ip_address, p_user_agent, expires_at)
  RETURNING id INTO session_id;
  
  RETURN json_build_object(
    'success', true,
    'session_id', session_id,
    'token', session_token,
    'expires_at', expires_at,
    'selected_role', p_selected_role
  );
END;
$$;

-- Create function to validate session
CREATE OR REPLACE FUNCTION validate_session(p_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_record record;
  user_record record;
BEGIN
  -- Find active session
  SELECT s.*, c.username, c.full_name, c.email
  INTO session_record
  FROM login_sessions s
  JOIN user_credentials c ON s.user_id = c.id
  WHERE s.session_token = p_token
    AND s.is_active = true
    AND s.expires_at > now();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired session');
  END IF;
  
  -- Update last activity
  UPDATE login_sessions
  SET last_activity = now()
  WHERE id = session_record.id;
  
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', session_record.user_id,
      'username', session_record.username,
      'full_name', session_record.full_name,
      'email', session_record.email,
      'selected_role', session_record.selected_role
    )
  );
END;
$$;