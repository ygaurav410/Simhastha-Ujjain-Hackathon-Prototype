-- =====================================================
-- NAVIMITRA EMERGENCY MANAGEMENT DATABASE SCHEMA
-- =====================================================
-- Comprehensive database design for emergency management
-- with role-based access control and real-time synchronization
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER MANAGEMENT TABLES
-- =====================================================

-- User roles enumeration
CREATE TYPE user_role AS ENUM ('civilian', 'admin', 'authority', 'responder');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Users table - Core user information
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'civilian',
    status user_status NOT NULL DEFAULT 'active',
    profile_image_url TEXT,
    emergency_contact VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'en',
    location_sharing_enabled BOOLEAN DEFAULT true,
    push_notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    last_location_update TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[1-9]\d{1,14}$')
);

-- User sessions for authentication tracking
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Authority/Admin specific information
CREATE TABLE authority_profiles (
    profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    jurisdiction_area TEXT,
    authority_level INTEGER DEFAULT 1,
    badge_number VARCHAR(50),
    supervisor_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_authority UNIQUE(user_id)
);

-- =====================================================
-- 2. LOCATION AND GEOGRAPHICAL DATA
-- =====================================================

-- Location types enumeration
CREATE TYPE location_type AS ENUM ('point', 'area', 'route', 'landmark');

-- Locations table - Geographical reference points
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    type location_type NOT NULL DEFAULT 'point',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    landmark_description TEXT,
    geofence_radius INTEGER, -- in meters
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Spatial index for location queries
    CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- User location history for tracking
CREATE TABLE user_locations (
    location_history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(8, 2), -- GPS accuracy in meters
    altitude DECIMAL(8, 2),
    speed DECIMAL(8, 2), -- in km/h
    heading DECIMAL(5, 2), -- compass direction
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Partition by date for performance
    CONSTRAINT valid_coordinates CHECK (
        latitude >= -90 AND latitude <= 90 AND 
        longitude >= -180 AND longitude <= 180
    )
);

-- =====================================================
-- 3. EMERGENCY MANAGEMENT CORE TABLES
-- =====================================================

-- Emergency types and categories
CREATE TYPE emergency_type AS ENUM (
    'medical', 'fire', 'accident', 'natural_disaster', 'security', 
    'lost_person', 'infrastructure', 'crowd_control', 'other'
);

CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE report_status AS ENUM (
    'submitted', 'acknowledged', 'assigned', 'in_progress', 
    'resolved', 'closed', 'cancelled', 'duplicate'
);

-- Emergency reports - Core emergency information
CREATE TABLE emergency_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable ID
    reporter_id UUID NOT NULL REFERENCES users(user_id),
    location_id UUID REFERENCES locations(location_id),
    
    -- Emergency details
    emergency_type emergency_type NOT NULL,
    severity severity_level NOT NULL DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status report_status NOT NULL DEFAULT 'submitted',
    
    -- Location information (can be different from location_id)
    incident_latitude DECIMAL(10, 8) NOT NULL,
    incident_longitude DECIMAL(11, 8) NOT NULL,
    incident_address TEXT,
    
    -- Timing information
    incident_time TIMESTAMP WITH TIME ZONE,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Assignment and response
    assigned_to UUID REFERENCES users(user_id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    priority_score INTEGER DEFAULT 50, -- 0-100 scale
    
    -- Additional metadata
    affected_people_count INTEGER DEFAULT 0,
    estimated_damage_cost DECIMAL(12, 2),
    weather_conditions JSONB,
    crowd_density VARCHAR(20),
    
    -- System fields
    is_public BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_incident_coordinates CHECK (
        incident_latitude >= -90 AND incident_latitude <= 90 AND 
        incident_longitude >= -180 AND incident_longitude <= 180
    ),
    CONSTRAINT valid_priority CHECK (priority_score >= 0 AND priority_score <= 100),
    CONSTRAINT valid_people_count CHECK (affected_people_count >= 0)
);

-- Emergency report status history for audit trail
CREATE TABLE report_status_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES emergency_reports(report_id) ON DELETE CASCADE,
    previous_status report_status,
    new_status report_status NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(user_id),
    change_reason TEXT,
    notes TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency report assignments
CREATE TABLE report_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES emergency_reports(report_id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES users(user_id),
    assigned_by UUID NOT NULL REFERENCES users(user_id),
    assignment_type VARCHAR(50) DEFAULT 'primary', -- primary, secondary, observer
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT
);

-- =====================================================
-- 4. MULTIMEDIA AND ATTACHMENTS
-- =====================================================

CREATE TYPE attachment_type AS ENUM ('image', 'video', 'audio', 'document');

-- Media attachments for emergency reports
CREATE TABLE report_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES emergency_reports(report_id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(user_id),
    
    -- File information
    file_name VARCHAR(255) NOT NULL,
    file_type attachment_type NOT NULL,
    file_size BIGINT NOT NULL, -- in bytes
    mime_type VARCHAR(100),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    
    -- Metadata
    description TEXT,
    is_evidence BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 104857600) -- 100MB limit
);

-- =====================================================
-- 5. RESPONSE TEAMS AND RESOURCES
-- =====================================================

CREATE TYPE team_type AS ENUM (
    'medical', 'fire', 'police', 'rescue', 'maintenance', 
    'security', 'traffic', 'disaster_response'
);

CREATE TYPE team_status AS ENUM ('available', 'deployed', 'busy', 'offline');

-- Response teams
CREATE TABLE response_teams (
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_name VARCHAR(255) NOT NULL,
    team_type team_type NOT NULL,
    department VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(255),
    base_location_id UUID REFERENCES locations(location_id),
    current_location_id UUID REFERENCES locations(location_id),
    status team_status DEFAULT 'available',
    capacity INTEGER DEFAULT 1,
    current_assignments INTEGER DEFAULT 0,
    specializations TEXT[],
    equipment_list JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_capacity CHECK (capacity > 0),
    CONSTRAINT valid_assignments CHECK (current_assignments >= 0 AND current_assignments <= capacity)
);

-- Team members
CREATE TABLE team_members (
    member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES response_teams(team_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id),
    role_in_team VARCHAR(100) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT unique_team_member UNIQUE(team_id, user_id)
);

-- Team deployments to emergency reports
CREATE TABLE team_deployments (
    deployment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES emergency_reports(report_id),
    team_id UUID NOT NULL REFERENCES response_teams(team_id),
    deployed_by UUID NOT NULL REFERENCES users(user_id),
    
    -- Deployment details
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estimated_arrival TIMESTAMP WITH TIME ZONE,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    deployment_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and notes
    deployment_status VARCHAR(50) DEFAULT 'dispatched',
    notes TEXT,
    outcome_summary TEXT
);

-- =====================================================
-- 6. ALERTS AND NOTIFICATIONS
-- =====================================================

CREATE TYPE alert_type AS ENUM (
    'emergency_broadcast', 'weather_warning', 'traffic_alert', 
    'security_alert', 'system_maintenance', 'general_info'
);

CREATE TYPE alert_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- System-wide alerts
CREATE TABLE alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID NOT NULL REFERENCES users(user_id),
    alert_type alert_type NOT NULL,
    priority alert_priority NOT NULL DEFAULT 'medium',
    
    -- Alert content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required TEXT,
    
    -- Targeting and geography
    target_audience user_role[],
    geographical_scope JSONB, -- Can define areas, circles, or specific locations
    affected_location_ids UUID[],
    
    -- Timing
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_emergency BOOLEAN DEFAULT false,
    acknowledgment_required BOOLEAN DEFAULT false
);

-- User alert acknowledgments
CREATE TABLE alert_acknowledgments (
    acknowledgment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(alert_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_at_acknowledgment JSONB,
    
    CONSTRAINT unique_user_alert_ack UNIQUE(alert_id, user_id)
);

-- =====================================================
-- 7. SYSTEM AUDIT AND LOGGING
-- =====================================================

CREATE TYPE action_type AS ENUM (
    'create', 'read', 'update', 'delete', 'login', 'logout', 
    'assign', 'unassign', 'approve', 'reject', 'export'
);

-- Comprehensive audit log
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    action action_type NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- table name or resource type
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID REFERENCES user_sessions(session_id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- =====================================================
-- 8. PERFORMANCE AND ANALYTICS
-- =====================================================

-- System performance metrics
CREATE TABLE system_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 4) NOT NULL,
    metric_unit VARCHAR(20),
    category VARCHAR(50),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Emergency response analytics
CREATE TABLE response_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES emergency_reports(report_id),
    
    -- Response time metrics
    acknowledgment_time_seconds INTEGER,
    assignment_time_seconds INTEGER,
    first_response_time_seconds INTEGER,
    resolution_time_seconds INTEGER,
    
    -- Resource utilization
    teams_deployed INTEGER DEFAULT 0,
    resources_used JSONB,
    
    -- Outcome metrics
    lives_saved INTEGER DEFAULT 0,
    property_damage_prevented DECIMAL(12, 2),
    public_satisfaction_score DECIMAL(3, 2), -- 1-5 scale
    
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- User table indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Emergency reports indexes
CREATE INDEX idx_emergency_reports_status ON emergency_reports(status);
CREATE INDEX idx_emergency_reports_type ON emergency_reports(emergency_type);
CREATE INDEX idx_emergency_reports_severity ON emergency_reports(severity);
CREATE INDEX idx_emergency_reports_reporter ON emergency_reports(reporter_id);
CREATE INDEX idx_emergency_reports_assigned ON emergency_reports(assigned_to);
CREATE INDEX idx_emergency_reports_location ON emergency_reports(incident_latitude, incident_longitude);
CREATE INDEX idx_emergency_reports_time ON emergency_reports(reported_at);
CREATE INDEX idx_emergency_reports_public ON emergency_reports(is_public) WHERE is_public = true;

-- Location indexes
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_user_locations_user_time ON user_locations(user_id, timestamp);

-- Alert indexes
CREATE INDEX idx_alerts_active ON alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_valid_period ON alerts(valid_from, valid_until);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- =====================================================
-- 10. TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_reports_updated_at BEFORE UPDATE ON emergency_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_response_teams_updated_at BEFORE UPDATE ON response_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate report numbers
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.report_number = 'EMR-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                       LPAD(NEXTVAL('report_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for report numbers
CREATE SEQUENCE report_number_seq START 1;

-- Apply report number trigger
CREATE TRIGGER generate_emergency_report_number BEFORE INSERT ON emergency_reports
    FOR EACH ROW EXECUTE FUNCTION generate_report_number();

-- =====================================================
-- 11. VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active emergency reports with reporter and assignee details
CREATE VIEW active_emergency_reports AS
SELECT 
    er.report_id,
    er.report_number,
    er.emergency_type,
    er.severity,
    er.title,
    er.description,
    er.status,
    er.incident_latitude,
    er.incident_longitude,
    er.incident_address,
    er.reported_at,
    er.priority_score,
    
    -- Reporter information
    reporter.full_name as reporter_name,
    reporter.phone as reporter_phone,
    
    -- Assignee information
    assignee.full_name as assignee_name,
    assignee.phone as assignee_phone,
    
    -- Location information
    l.name as location_name,
    l.address as location_address
FROM emergency_reports er
LEFT JOIN users reporter ON er.reporter_id = reporter.user_id
LEFT JOIN users assignee ON er.assigned_to = assignee.user_id
LEFT JOIN locations l ON er.location_id = l.location_id
WHERE er.status NOT IN ('resolved', 'closed', 'cancelled');

-- User dashboard summary
CREATE VIEW user_dashboard_summary AS
SELECT 
    u.user_id,
    u.full_name,
    u.role,
    COUNT(CASE WHEN er.status IN ('submitted', 'acknowledged', 'assigned', 'in_progress') THEN 1 END) as active_reports,
    COUNT(CASE WHEN er.status IN ('resolved', 'closed') THEN 1 END) as resolved_reports,
    MAX(er.reported_at) as last_report_date
FROM users u
LEFT JOIN emergency_reports er ON u.user_id = er.reporter_id
GROUP BY u.user_id, u.full_name, u.role;

-- Team availability status
CREATE VIEW team_availability AS
SELECT 
    rt.team_id,
    rt.team_name,
    rt.team_type,
    rt.status,
    rt.capacity,
    rt.current_assignments,
    (rt.capacity - rt.current_assignments) as available_capacity,
    COUNT(tm.user_id) as total_members,
    COUNT(CASE WHEN tm.is_active THEN 1 END) as active_members
FROM response_teams rt
LEFT JOIN team_members tm ON rt.team_id = tm.team_id
GROUP BY rt.team_id, rt.team_name, rt.team_type, rt.status, rt.capacity, rt.current_assignments;

-- =====================================================
-- END OF SCHEMA DEFINITION
-- =====================================================