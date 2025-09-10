-- =====================================================
-- SAMPLE DATA FOR NAVIMITRA EMERGENCY MANAGEMENT SYSTEM
-- =====================================================
-- This file contains realistic sample data for testing
-- and demonstration purposes
-- =====================================================

-- =====================================================
-- 1. SAMPLE USERS
-- =====================================================

-- Insert sample users with different roles
INSERT INTO users (user_id, username, email, phone, password_hash, full_name, role, status, emergency_contact, preferred_language) VALUES
-- Civilians
('550e8400-e29b-41d4-a716-446655440001', 'rajesh_kumar', 'rajesh.kumar@email.com', '+919876543210', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Rajesh Kumar', 'civilian', 'active', '+919876543211', 'hi'),
('550e8400-e29b-41d4-a716-446655440002', 'priya_sharma', 'priya.sharma@email.com', '+919876543212', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Priya Sharma', 'civilian', 'active', '+919876543213', 'en'),
('550e8400-e29b-41d4-a716-446655440003', 'amit_verma', 'amit.verma@email.com', '+919876543214', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Amit Verma', 'civilian', 'active', '+919876543215', 'hi'),
('550e8400-e29b-41d4-a716-446655440004', 'sunita_devi', 'sunita.devi@email.com', '+919876543216', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Sunita Devi', 'civilian', 'active', '+919876543217', 'hi'),

-- Admins
('550e8400-e29b-41d4-a716-446655440010', 'admin_control', 'admin@navimitra.gov.in', '+915322408999', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Admin Control Center', 'admin', 'active', '+915322408998', 'en'),
('550e8400-e29b-41d4-a716-446655440011', 'system_admin', 'sysadmin@navimitra.gov.in', '+915322408997', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'System Administrator', 'admin', 'active', '+915322408996', 'en'),

-- Authorities
('550e8400-e29b-41d4-a716-446655440020', 'inspector_kumar', 'inspector.kumar@up.police.gov.in', '+915322509999', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Inspector Rajesh Kumar', 'authority', 'active', '+915322509998', 'hi'),
('550e8400-e29b-41d4-a716-446655440021', 'dr_sharma', 'dr.sharma@kumbh.health.gov.in', '+915322507777', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Dr. Anjali Sharma', 'authority', 'active', '+915322507776', 'en'),
('550e8400-e29b-41d4-a716-446655440022', 'fire_chief', 'chief@Ujjain.fire.gov.in', '+915322506666', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Fire Chief Suresh Singh', 'authority', 'active', '+915322506665', 'hi'),

-- Responders
('550e8400-e29b-41d4-a716-446655440030', 'paramedic_raj', 'raj.paramedic@kumbh.health.gov.in', '+915322508888', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Raj Paramedic', 'responder', 'active', '+915322508887', 'hi'),
('550e8400-e29b-41d4-a716-446655440031', 'constable_singh', 'singh.constable@up.police.gov.in', '+915322509888', '$2b$12$LQv3c1yqBwLFaAK4Q7L.iOmeuki.9VkmtzmJW6QJgs4CV4Dlfm1qm', 'Constable Vikram Singh', 'responder', 'active', '+915322509887', 'hi');

-- =====================================================
-- 2. AUTHORITY PROFILES
-- =====================================================

INSERT INTO authority_profiles (profile_id, user_id, department, designation, jurisdiction_area, authority_level, badge_number) VALUES
('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440020', 'Uttar Pradesh Police', 'Inspector', 'Kumbh Mela Area - Sector 1-15', 3, 'UP-PRJ-001'),
('650e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440021', 'Health Department', 'Chief Medical Officer', 'Kumbh Mela Medical Services', 4, 'HEALTH-KM-001'),
('650e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440022', 'Fire Department', 'Fire Chief', 'Ujjain Fire Services', 4, 'FIRE-PRJ-001');

-- =====================================================
-- 3. LOCATIONS
-- =====================================================

INSERT INTO locations (location_id, name, type, latitude, longitude, address, city, state, country, landmark_description, is_verified) VALUES
-- Key Kumbh Mela locations
('750e8400-e29b-41d4-a716-446655440001', 'Sangam Ghat', 'landmark', 25.4470, 81.8420, 'Sangam Ghat, Triveni Sangam', 'Ujjain', 'Uttar Pradesh', 'India', 'Holy confluence of three rivers - Ganga, Yamuna, and Saraswati', true),
('750e8400-e29b-41d4-a716-446655440002', 'Main Parade Ground', 'area', 25.4358, 81.8463, 'Main Parade Ground, Kumbh Mela Area', 'Ujjain', 'Uttar Pradesh', 'India', 'Central gathering area for major events', true),
('750e8400-e29b-41d4-a716-446655440003', 'Sector 12 Main Gate', 'point', 25.4280, 81.8430, 'Sector 12, Main Gate, Kumbh Mela', 'Ujjain', 'Uttar Pradesh', 'India', 'Primary entry point for Sector 12', true),
('750e8400-e29b-41d4-a716-446655440004', 'Emergency Medical Center', 'point', 25.4400, 81.8400, 'Emergency Medical Center, Sector 8', 'Ujjain', 'Uttar Pradesh', 'India', '24/7 Emergency medical facility', true),
('750e8400-e29b-41d4-a716-446655440005', 'Police Control Room', 'point', 25.4390, 81.8410, 'Police Control Room, Sector 9', 'Ujjain', 'Uttar Pradesh', 'India', 'Central police coordination center', true),
('750e8400-e29b-41d4-a716-446655440006', 'Fire Station Alpha', 'point', 25.4320, 81.8380, 'Fire Station Alpha, Sector 14', 'Ujjain', 'Uttar Pradesh', 'India', 'Primary fire response station', true),
('750e8400-e29b-41d4-a716-446655440007', 'Parking Area C', 'area', 25.4250, 81.8350, 'Parking Area C, Sector 15', 'Ujjain', 'Uttar Pradesh', 'India', 'Large vehicle parking area', true),
('750e8400-e29b-41d4-a716-446655440008', 'Food Court Central', 'point', 25.4380, 81.8440, 'Central Food Court, Sector 10', 'Ujjain', 'Uttar Pradesh', 'India', 'Main food and refreshment area', true);

-- =====================================================
-- 4. RESPONSE TEAMS
-- =====================================================

INSERT INTO response_teams (team_id, team_name, team_type, department, contact_number, email, base_location_id, status, capacity, specializations, equipment_list) VALUES
-- Medical teams
('850e8400-e29b-41d4-a716-446655440001', 'Medical Response Team Alpha', 'medical', 'Health Department', '+915322507777', 'medical.alpha@kumbh.health.gov.in', '750e8400-e29b-41d4-a716-446655440004', 'available', 6, ARRAY['emergency_medicine', 'trauma_care', 'pediatrics'], '{"ambulances": 2, "stretchers": 6, "defibrillators": 3, "oxygen_tanks": 10}'),
('850e8400-e29b-41d4-a716-446655440002', 'Medical Response Team Beta', 'medical', 'Health Department', '+915322507778', 'medical.beta@kumbh.health.gov.in', '750e8400-e29b-41d4-a716-446655440004', 'available', 4, ARRAY['general_medicine', 'first_aid'], '{"ambulances": 1, "stretchers": 4, "first_aid_kits": 20}'),

-- Police teams
('850e8400-e29b-41d4-a716-446655440003', 'Police Response Unit 1', 'police', 'Uttar Pradesh Police', '+915322509999', 'unit1@up.police.gov.in', '750e8400-e29b-41d4-a716-446655440005', 'available', 8, ARRAY['crowd_control', 'traffic_management', 'security'], '{"vehicles": 3, "communication_radios": 8, "crowd_barriers": 50}'),
('850e8400-e29b-41d4-a716-446655440004', 'Police Response Unit 2', 'police', 'Uttar Pradesh Police', '+915322509998', 'unit2@up.police.gov.in', '750e8400-e29b-41d4-a716-446655440005', 'deployed', 6, ARRAY['investigation', 'security'], '{"vehicles": 2, "communication_radios": 6}'),

-- Fire teams
('850e8400-e29b-41d4-a716-446655440005', 'Fire Response Team Alpha', 'fire', 'Fire Department', '+915322506666', 'fire.alpha@Ujjain.fire.gov.in', '750e8400-e29b-41d4-a716-446655440006', 'available', 8, ARRAY['fire_suppression', 'rescue_operations', 'hazmat'], '{"fire_trucks": 2, "rescue_equipment": 1, "breathing_apparatus": 8}'),

-- Rescue teams
('850e8400-e29b-41d4-a716-446655440006', 'Search and Rescue Team', 'rescue', 'Disaster Management', '+915322505555', 'rescue@kumbh.disaster.gov.in', '750e8400-e29b-41d4-a716-446655440002', 'available', 10, ARRAY['search_rescue', 'water_rescue', 'technical_rescue'], '{"boats": 3, "diving_equipment": 4, "ropes_harnesses": 20}');

-- =====================================================
-- 5. TEAM MEMBERS
-- =====================================================

INSERT INTO team_members (member_id, team_id, user_id, role_in_team) VALUES
-- Medical Team Alpha
('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'team_leader'),
('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'paramedic'),

-- Police Unit 1
('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440020', 'team_leader'),
('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440031', 'constable'),

-- Fire Team Alpha
('950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440022', 'team_leader');

-- =====================================================
-- 6. EMERGENCY REPORTS
-- =====================================================

INSERT INTO emergency_reports (
    report_id, reporter_id, location_id, emergency_type, severity, title, description, 
    status, incident_latitude, incident_longitude, incident_address, incident_time, 
    assigned_to, priority_score, affected_people_count
) VALUES
-- Active emergency reports
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 'lost_person', 'high', 'Missing Child - Urgent Help Needed', 'My 8-year-old son Arjun went missing near the main gate of Sector 12. He was wearing a blue shirt and khaki shorts. Last seen around 2:30 PM. Please contact immediately if found.', 'assigned', 25.4280, 81.8430, 'Near Main Gate, Sector 12, Kumbh Mela', '2024-01-15 14:30:00+05:30', '550e8400-e29b-41d4-a716-446655440020', 85, 1),

('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'medical', 'critical', 'Elderly Person Collapsed - Heat Stroke', 'An elderly man (approximately 70 years old) collapsed due to heat stroke near Sangam Ghat. He is unconscious and needs immediate medical attention. Bystanders are providing shade and water.', 'in_progress', 25.4470, 81.8420, 'Sangam Ghat, Near Boat Stand', '2024-01-15 15:45:00+05:30', '550e8400-e29b-41d4-a716-446655440021', 95, 1),

('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440007', 'security', 'medium', 'Suspicious Activity in Parking Area', 'Noticed some suspicious individuals near the parking area. They seem to be monitoring people and vehicles. Reported to security but want to alert others in the area.', 'acknowledged', 25.4250, 81.8350, 'Parking Area C, Sector 15', '2024-01-15 13:15:00+05:30', '550e8400-e29b-41d4-a716-446655440020', 70, 0),

('a50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440008', 'infrastructure', 'medium', 'Water Pipeline Burst', 'Water pipeline has burst near the central food court causing flooding in the area. The water is ankle-deep and creating slippery conditions. Maintenance team needed urgently.', 'submitted', 25.4380, 81.8440, 'Central Food Court, Sector 10', '2024-01-15 16:20:00+05:30', NULL, 60, 50),

-- Resolved reports for analytics
('a50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'medical', 'low', 'Minor Injury - First Aid Required', 'Person slipped and got minor cuts on knee. First aid provided by volunteers. Situation resolved.', 'resolved', 25.4358, 81.8463, 'Main Parade Ground', '2024-01-15 11:30:00+05:30', '550e8400-e29b-41d4-a716-446655440030', 30, 1),

('a50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', 'crowd_control', 'high', 'Overcrowding at Entry Point', 'Severe overcrowding at main entry point causing safety concerns. Crowd control measures implemented successfully.', 'resolved', 25.4390, 81.8410, 'Main Entry Point', '2024-01-15 09:00:00+05:30', '550e8400-e29b-41d4-a716-446655440020', 80, 200);

-- =====================================================
-- 7. REPORT STATUS HISTORY
-- =====================================================

INSERT INTO report_status_history (history_id, report_id, previous_status, new_status, changed_by, change_reason, notes) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'submitted', 'acknowledged', '550e8400-e29b-41d4-a716-446655440020', 'Initial review completed', 'Report verified and prioritized as high due to missing child'),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'acknowledged', 'assigned', '550e8400-e29b-41d4-a716-446655440020', 'Assigned to search team', 'Search operation initiated with local police unit'),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440002', 'submitted', 'acknowledged', '550e8400-e29b-41d4-a716-446655440021', 'Medical emergency confirmed', 'Ambulance dispatched immediately'),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440002', 'acknowledged', 'in_progress', '550e8400-e29b-41d4-a716-446655440021', 'Medical team on site', 'Patient being treated on location');

-- =====================================================
-- 8. TEAM DEPLOYMENTS
-- =====================================================

INSERT INTO team_deployments (deployment_id, report_id, team_id, deployed_by, estimated_arrival, deployment_status, notes) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440020', '2024-01-15 15:00:00+05:30', 'on_site', 'Search operation for missing child in progress'),
('c50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '2024-01-15 15:50:00+05:30', 'on_site', 'Medical team treating heat stroke patient');

-- =====================================================
-- 9. ALERTS
-- =====================================================

INSERT INTO alerts (alert_id, created_by, alert_type, priority, title, message, target_audience, is_active, is_emergency, valid_until) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'weather_warning', 'high', 'High Temperature Alert', 'Temperature expected to reach 42°C today. Please stay hydrated, seek shade during peak hours (12 PM - 4 PM), and avoid prolonged sun exposure. Medical stations are available throughout the area.', ARRAY['civilian'], true, false, '2024-01-15 23:59:59+05:30'),

('d50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'traffic_alert', 'medium', 'Heavy Traffic on Main Route', 'Heavy traffic congestion on the main route to Sangam Ghat due to increased pilgrim flow. Alternative routes via Sector 8 and Sector 12 are recommended. Expected delay: 30-45 minutes.', ARRAY['civilian'], true, false, '2024-01-15 20:00:00+05:30'),

('d50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440020', 'security_alert', 'urgent', 'Missing Child Alert', 'MISSING CHILD: 8-year-old boy named Arjun, wearing blue shirt and khaki shorts. Last seen near Sector 12 main gate at 2:30 PM. If found, please contact +919876543210 or nearest police station immediately.', ARRAY['civilian', 'authority', 'responder'], true, true, '2024-01-16 23:59:59+05:30'),

('d50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440010', 'general_info', 'low', 'Lost and Found Center', 'Lost and Found center is operational 24/7 at the Main Control Room, Sector 9. If you have lost any belongings or found items, please visit or call +915322408999.', ARRAY['civilian'], true, false, '2024-01-20 23:59:59+05:30');

-- =====================================================
-- 10. REPORT ATTACHMENTS
-- =====================================================

INSERT INTO report_attachments (attachment_id, report_id, uploaded_by, file_name, file_type, file_size, mime_type, file_url, description, is_evidence) VALUES
('e50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'missing_child_photo.jpg', 'image', 245760, 'image/jpeg', '/uploads/reports/missing_child_photo.jpg', 'Recent photo of missing child Arjun', true),
('e50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'heat_stroke_incident.jpg', 'image', 189440, 'image/jpeg', '/uploads/reports/heat_stroke_incident.jpg', 'Photo of the incident location', true),
('e50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'suspicious_activity.mp4', 'video', 5242880, 'video/mp4', '/uploads/reports/suspicious_activity.mp4', 'Video recording of suspicious individuals', true);

-- =====================================================
-- 11. USER LOCATION HISTORY (Recent locations)
-- =====================================================

INSERT INTO user_locations (location_history_id, user_id, latitude, longitude, accuracy, timestamp) VALUES
-- Recent locations for active users
('f50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 25.4280, 81.8430, 5.0, '2024-01-15 16:30:00+05:30'),
('f50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 25.4470, 81.8420, 3.0, '2024-01-15 16:30:00+05:30'),
('f50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 25.4250, 81.8350, 8.0, '2024-01-15 16:30:00+05:30'),
('f50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440020', 25.4390, 81.8410, 2.0, '2024-01-15 16:30:00+05:30'),
('f50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440021', 25.4400, 81.8400, 2.0, '2024-01-15 16:30:00+05:30');

-- =====================================================
-- 12. SYSTEM METRICS
-- =====================================================

INSERT INTO system_metrics (metric_id, metric_name, metric_value, metric_unit, category) VALUES
('g50e8400-e29b-41d4-a716-446655440001', 'active_users', 1247, 'count', 'user_activity'),
('g50e8400-e29b-41d4-a716-446655440002', 'active_reports', 4, 'count', 'emergency_reports'),
('g50e8400-e29b-41d4-a716-446655440003', 'average_response_time', 8.5, 'minutes', 'performance'),
('g50e8400-e29b-41d4-a716-446655440004', 'system_uptime', 99.8, 'percentage', 'system_health'),
('g50e8400-e29b-41d4-a716-446655440005', 'database_size', 2.4, 'GB', 'storage'),
('g50e8400-e29b-41d4-a716-446655440006', 'api_requests_per_minute', 156, 'count', 'api_usage');

-- =====================================================
-- 13. RESPONSE ANALYTICS
-- =====================================================

INSERT INTO response_analytics (
    analytics_id, report_id, acknowledgment_time_seconds, assignment_time_seconds, 
    first_response_time_seconds, resolution_time_seconds, teams_deployed, 
    resources_used, public_satisfaction_score
) VALUES
('h50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440005', 120, 300, 480, 1800, 1, '{"first_aid_kit": 1, "bandages": 3}', 4.5),
('h50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440006', 180, 420, 600, 3600, 2, '{"barriers": 20, "personnel": 8}', 4.2);

-- =====================================================
-- END OF SAMPLE DATA
-- =====================================================