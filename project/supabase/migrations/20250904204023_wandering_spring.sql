-- =====================================================
-- USER ROLES AND PERMISSIONS FOR NAVIMITRA SYSTEM
-- =====================================================
-- Role-based access control (RBAC) implementation
-- for emergency management database
-- =====================================================

-- =====================================================
-- 1. CREATE DATABASE ROLES
-- =====================================================

-- Create roles for different user types
CREATE ROLE navimitra_civilian;
CREATE ROLE navimitra_admin;
CREATE ROLE navimitra_authority;
CREATE ROLE navimitra_responder;
CREATE ROLE navimitra_readonly;

-- =====================================================
-- 2. CIVILIAN USER PERMISSIONS
-- =====================================================

-- Civilians can:
-- - View their own reports and public information
-- - Create new emergency reports
-- - Update their own profile
-- - View public alerts and locations

-- Grant basic connection rights
GRANT CONNECT ON DATABASE navimitra TO navimitra_civilian;
GRANT USAGE ON SCHEMA public TO navimitra_civilian;

-- User management - own profile only
GRANT SELECT ON users TO navimitra_civilian;
GRANT UPDATE (full_name, phone, emergency_contact, preferred_language, location_sharing_enabled, push_notifications_enabled) ON users TO navimitra_civilian;

-- Emergency reports - can create and view own reports
GRANT SELECT, INSERT ON emergency_reports TO navimitra_civilian;
GRANT UPDATE (description, incident_address) ON emergency_reports TO navimitra_civilian;
GRANT USAGE, SELECT ON SEQUENCE report_number_seq TO navimitra_civilian;

-- Report attachments - can upload to own reports
GRANT SELECT, INSERT ON report_attachments TO navimitra_civilian;

-- Locations - read-only access to public locations
GRANT SELECT ON locations TO navimitra_civilian;

-- Alerts - can view public alerts
GRANT SELECT ON alerts TO navimitra_civilian;
GRANT SELECT, INSERT ON alert_acknowledgments TO navimitra_civilian;

-- User location tracking
GRANT SELECT, INSERT ON user_locations TO navimitra_civilian;

-- Response teams - read-only for contact information
GRANT SELECT (team_name, team_type, contact_number, status) ON response_teams TO navimitra_civilian;

-- Views access
GRANT SELECT ON active_emergency_reports TO navimitra_civilian;

-- =====================================================
-- 3. ADMIN USER PERMISSIONS
-- =====================================================

-- Admins have full access to manage the system
-- except for sensitive authority operations

GRANT CONNECT ON DATABASE navimitra TO navimitra_admin;
GRANT USAGE ON SCHEMA public TO navimitra_admin;

-- Full access to most tables
GRANT ALL PRIVILEGES ON users TO navimitra_admin;
GRANT ALL PRIVILEGES ON user_sessions TO navimitra_admin;
GRANT ALL PRIVILEGES ON emergency_reports TO navimitra_admin;
GRANT ALL PRIVILEGES ON report_status_history TO navimitra_admin;
GRANT ALL PRIVILEGES ON report_assignments TO navimitra_admin;
GRANT ALL PRIVILEGES ON report_attachments TO navimitra_admin;
GRANT ALL PRIVILEGES ON locations TO navimitra_admin;
GRANT ALL PRIVILEGES ON user_locations TO navimitra_admin;
GRANT ALL PRIVILEGES ON response_teams TO navimitra_admin;
GRANT ALL PRIVILEGES ON team_members TO navimitra_admin;
GRANT ALL PRIVILEGES ON team_deployments TO navimitra_admin;
GRANT ALL PRIVILEGES ON alerts TO navimitra_admin;
GRANT ALL PRIVILEGES ON alert_acknowledgments TO navimitra_admin;
GRANT ALL PRIVILEGES ON audit_logs TO navimitra_admin;
GRANT ALL PRIVILEGES ON system_metrics TO navimitra_admin;
GRANT ALL PRIVILEGES ON response_analytics TO navimitra_admin;

-- Limited access to authority profiles (read-only)
GRANT SELECT ON authority_profiles TO navimitra_admin;

-- Sequence access
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO navimitra_admin;

-- Views access
GRANT SELECT ON active_emergency_reports TO navimitra_admin;
GRANT SELECT ON user_dashboard_summary TO navimitra_admin;
GRANT SELECT ON team_availability TO navimitra_admin;

-- =====================================================
-- 4. AUTHORITY USER PERMISSIONS
-- =====================================================

-- Authorities can manage emergency responses and access sensitive data

GRANT CONNECT ON DATABASE navimitra TO navimitra_authority;
GRANT USAGE ON SCHEMA public TO navimitra_authority;

-- User management - can view all users, update own profile
GRANT SELECT ON users TO navimitra_authority;
GRANT UPDATE (full_name, phone, emergency_contact, preferred_language) ON users TO navimitra_authority;

-- Authority profiles - full access to own profile
GRANT SELECT ON authority_profiles TO navimitra_authority;
GRANT UPDATE (department, designation, jurisdiction_area) ON authority_profiles TO navimitra_authority;

-- Emergency reports - full access for response management
GRANT ALL PRIVILEGES ON emergency_reports TO navimitra_authority;
GRANT ALL PRIVILEGES ON report_status_history TO navimitra_authority;
GRANT ALL PRIVILEGES ON report_assignments TO navimitra_authority;
GRANT SELECT ON report_attachments TO navimitra_authority;

-- Locations - full access
GRANT SELECT, INSERT, UPDATE ON locations TO navimitra_authority;

-- User locations - can view for emergency response
GRANT SELECT ON user_locations TO navimitra_authority;

-- Response teams - full management access
GRANT ALL PRIVILEGES ON response_teams TO navimitra_authority;
GRANT ALL PRIVILEGES ON team_members TO navimitra_authority;
GRANT ALL PRIVILEGES ON team_deployments TO navimitra_authority;

-- Alerts - can create and manage alerts
GRANT ALL PRIVILEGES ON alerts TO navimitra_authority;
GRANT SELECT ON alert_acknowledgments TO navimitra_authority;

-- Analytics and metrics - read access
GRANT SELECT ON system_metrics TO navimitra_authority;
GRANT SELECT ON response_analytics TO navimitra_authority;

-- Audit logs - can view for accountability
GRANT SELECT ON audit_logs TO navimitra_authority;

-- Views access
GRANT SELECT ON active_emergency_reports TO navimitra_authority;
GRANT SELECT ON user_dashboard_summary TO navimitra_authority;
GRANT SELECT ON team_availability TO navimitra_authority;

-- =====================================================
-- 5. RESPONDER USER PERMISSIONS
-- =====================================================

-- Responders need access to assigned reports and team information

GRANT CONNECT ON DATABASE navimitra TO navimitra_responder;
GRANT USAGE ON SCHEMA public TO navimitra_responder;

-- User management - own profile only
GRANT SELECT ON users TO navimitra_responder;
GRANT UPDATE (full_name, phone, emergency_contact, preferred_language) ON users TO navimitra_responder;

-- Emergency reports - can view assigned reports and update status
GRANT SELECT ON emergency_reports TO navimitra_responder;
GRANT UPDATE (status, notes) ON emergency_reports TO navimitra_responder;
GRANT SELECT, INSERT ON report_status_history TO navimitra_responder;

-- Report attachments - can view evidence
GRANT SELECT ON report_attachments TO navimitra_responder;

-- Locations - read access
GRANT SELECT ON locations TO navimitra_responder;

-- User locations - can update own location
GRANT SELECT, INSERT ON user_locations TO navimitra_responder;

-- Response teams - can view team information
GRANT SELECT ON response_teams TO navimitra_responder;
GRANT SELECT ON team_members TO navimitra_responder;
GRANT SELECT ON team_deployments TO navimitra_responder;

-- Alerts - can view relevant alerts
GRANT SELECT ON alerts TO navimitra_responder;
GRANT SELECT, INSERT ON alert_acknowledgments TO navimitra_responder;

-- Views access
GRANT SELECT ON active_emergency_reports TO navimitra_responder;
GRANT SELECT ON team_availability TO navimitra_responder;

-- =====================================================
-- 6. READ-ONLY USER PERMISSIONS
-- =====================================================

-- For reporting, analytics, and monitoring systems

GRANT CONNECT ON DATABASE navimitra TO navimitra_readonly;
GRANT USAGE ON SCHEMA public TO navimitra_readonly;

-- Read-only access to all tables (except sensitive user data)
GRANT SELECT ON emergency_reports TO navimitra_readonly;
GRANT SELECT ON report_status_history TO navimitra_readonly;
GRANT SELECT ON locations TO navimitra_readonly;
GRANT SELECT ON response_teams TO navimitra_readonly;
GRANT SELECT ON team_deployments TO navimitra_readonly;
GRANT SELECT ON alerts TO navimitra_readonly;
GRANT SELECT ON system_metrics TO navimitra_readonly;
GRANT SELECT ON response_analytics TO navimitra_readonly;
GRANT SELECT ON audit_logs TO navimitra_readonly;

-- Views access
GRANT SELECT ON active_emergency_reports TO navimitra_readonly;
GRANT SELECT ON user_dashboard_summary TO navimitra_readonly;
GRANT SELECT ON team_availability TO navimitra_readonly;

-- =====================================================
-- 7. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY user_own_profile ON users
    FOR ALL TO navimitra_civilian
    USING (user_id = current_setting('app.current_user_id')::uuid);

-- Admins and authorities can see all users
CREATE POLICY user_admin_access ON users
    FOR ALL TO navimitra_admin, navimitra_authority
    USING (true);

-- Emergency reports visibility
CREATE POLICY emergency_reports_civilian ON emergency_reports
    FOR SELECT TO navimitra_civilian
    USING (
        reporter_id = current_setting('app.current_user_id')::uuid 
        OR is_public = true
    );

CREATE POLICY emergency_reports_civilian_insert ON emergency_reports
    FOR INSERT TO navimitra_civilian
    WITH CHECK (reporter_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY emergency_reports_admin_authority ON emergency_reports
    FOR ALL TO navimitra_admin, navimitra_authority
    USING (true);

-- User locations - users can only see their own locations
CREATE POLICY user_locations_own ON user_locations
    FOR ALL TO navimitra_civilian
    USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY user_locations_authority ON user_locations
    FOR SELECT TO navimitra_authority, navimitra_admin
    USING (true);

-- Report attachments - can only access attachments for reports they can see
CREATE POLICY report_attachments_access ON report_attachments
    FOR SELECT TO navimitra_civilian
    USING (
        report_id IN (
            SELECT report_id FROM emergency_reports 
            WHERE reporter_id = current_setting('app.current_user_id')::uuid 
            OR is_public = true
        )
    );

CREATE POLICY report_attachments_admin_authority ON report_attachments
    FOR ALL TO navimitra_admin, navimitra_authority
    USING (true);

-- User sessions - users can only see their own sessions
CREATE POLICY user_sessions_own ON user_sessions
    FOR ALL TO navimitra_civilian
    USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY user_sessions_admin ON user_sessions
    FOR ALL TO navimitra_admin
    USING (true);

-- =====================================================
-- 8. FUNCTIONS FOR ROLE MANAGEMENT
-- =====================================================

-- Function to set current user context for RLS
CREATE OR REPLACE FUNCTION set_current_user_id(user_uuid UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_uuid::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
DECLARE
    user_role_result user_role;
BEGIN
    SELECT role INTO user_role_result 
    FROM users 
    WHERE user_id = current_setting('app.current_user_id')::uuid;
    
    RETURN user_role_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access report
CREATE OR REPLACE FUNCTION can_access_report(report_uuid UUID, user_uuid UUID)
RETURNS boolean AS $$
DECLARE
    user_role_val user_role;
    report_public boolean;
    is_reporter boolean;
    is_assigned boolean;
BEGIN
    -- Get user role
    SELECT role INTO user_role_val FROM users WHERE user_id = user_uuid;
    
    -- Admins and authorities can access all reports
    IF user_role_val IN ('admin', 'authority') THEN
        RETURN true;
    END IF;
    
    -- Check if report is public or user is reporter/assigned
    SELECT 
        is_public,
        (reporter_id = user_uuid),
        (assigned_to = user_uuid)
    INTO report_public, is_reporter, is_assigned
    FROM emergency_reports 
    WHERE report_id = report_uuid;
    
    RETURN report_public OR is_reporter OR is_assigned;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. AUDIT TRIGGER FUNCTION
-- =====================================================

-- Function to log all changes for audit trail
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger AS $$
DECLARE
    user_id_val UUID;
BEGIN
    -- Get current user ID from session
    BEGIN
        user_id_val := current_setting('app.current_user_id')::uuid;
    EXCEPTION WHEN OTHERS THEN
        user_id_val := NULL;
    END;
    
    -- Log the change
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values)
        VALUES (user_id_val, 'delete', TG_TABLE_NAME, (OLD.*)::text::uuid, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
        VALUES (user_id_val, 'update', TG_TABLE_NAME, (NEW.*)::text::uuid, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
        VALUES (user_id_val, 'create', TG_TABLE_NAME, (NEW.*)::text::uuid, row_to_json(NEW));
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_emergency_reports AFTER INSERT OR UPDATE OR DELETE ON emergency_reports
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_report_assignments AFTER INSERT OR UPDATE OR DELETE ON report_assignments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =====================================================
-- 10. EXAMPLE USER CREATION
-- =====================================================

-- Example of creating database users and assigning roles
-- (These would typically be created by the application)

/*
-- Create database users for each application user
CREATE USER civilian_user_1 WITH PASSWORD 'secure_password_1';
CREATE USER admin_user_1 WITH PASSWORD 'secure_password_2';
CREATE USER authority_user_1 WITH PASSWORD 'secure_password_3';

-- Grant roles to users
GRANT navimitra_civilian TO civilian_user_1;
GRANT navimitra_admin TO admin_user_1;
GRANT navimitra_authority TO authority_user_1;

-- Set default role
ALTER USER civilian_user_1 SET ROLE navimitra_civilian;
ALTER USER admin_user_1 SET ROLE navimitra_admin;
ALTER USER authority_user_1 SET ROLE navimitra_authority;
*/

-- =====================================================
-- END OF PERMISSIONS CONFIGURATION
-- =====================================================