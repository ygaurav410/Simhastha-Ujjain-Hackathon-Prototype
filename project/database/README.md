# NaviMitra Emergency Management Database

## Overview

This database system is designed to support a comprehensive emergency management platform for large-scale events like Kumbh Mela. It provides real-time synchronization across civilian, admin, and authority user panels with robust security and audit capabilities.

## Architecture

### Database Technology
- **Primary Database**: PostgreSQL 14+
- **Real-time Features**: PostgreSQL with WebSocket integration
- **Caching Layer**: Redis for session management and real-time data
- **File Storage**: AWS S3 or compatible object storage
- **Search Engine**: Elasticsearch for advanced search capabilities

### Key Features
- **Role-based Access Control (RBAC)** with row-level security
- **Real-time Data Synchronization** across all user panels
- **Comprehensive Audit Trail** for all operations
- **Geospatial Indexing** for location-based queries
- **Scalable Architecture** supporting thousands of concurrent users
- **Data Integrity** with foreign key constraints and validation

## Database Schema

### Core Tables

#### 1. User Management
- `users` - Core user information with role-based access
- `user_sessions` - Authentication session tracking
- `authority_profiles` - Extended information for authority users
- `user_locations` - GPS tracking history

#### 2. Emergency Management
- `emergency_reports` - Core emergency incident data
- `report_status_history` - Complete audit trail of status changes
- `report_assignments` - User and team assignments to reports
- `report_attachments` - Media files and evidence

#### 3. Response Coordination
- `response_teams` - Emergency response team information
- `team_members` - Team composition and roles
- `team_deployments` - Team assignments to incidents

#### 4. Location Services
- `locations` - Geographic points of interest
- `alerts` - System-wide notifications and warnings
- `alert_acknowledgments` - User acknowledgment tracking

#### 5. System Management
- `audit_logs` - Comprehensive system audit trail
- `system_metrics` - Performance and usage analytics
- `response_analytics` - Emergency response effectiveness metrics

## User Roles and Permissions

### 1. Civilian Users
**Capabilities:**
- Submit emergency reports
- View own reports and public information
- Receive alerts and notifications
- Update personal profile and location
- Access public amenity information

**Database Access:**
- Read: Own reports, public alerts, locations, team contact info
- Write: Emergency reports, personal profile, location updates
- Restrictions: Cannot access other users' private data

### 2. Admin Users
**Capabilities:**
- Full system management and configuration
- User account management
- System analytics and reporting
- Alert creation and management
- Location and amenity management

**Database Access:**
- Read: All data except sensitive authority operations
- Write: Most tables with full CRUD operations
- Restrictions: Limited access to authority-specific data

### 3. Authority Users
**Capabilities:**
- Emergency response coordination
- Report assignment and status management
- Team deployment and resource allocation
- Alert creation for their jurisdiction
- Access to sensitive operational data

**Database Access:**
- Read: All emergency reports, user locations, team information
- Write: Report status, assignments, team deployments, alerts
- Special: Can access sensitive data for emergency response

### 4. Responder Users
**Capabilities:**
- View assigned emergency reports
- Update report status and progress
- Access team coordination information
- Receive deployment notifications

**Database Access:**
- Read: Assigned reports, team information, relevant alerts
- Write: Report status updates, location tracking
- Restrictions: Limited to assigned incidents and team data

## Security Implementation

### Row Level Security (RLS)
- **Users Table**: Users can only access their own profile
- **Emergency Reports**: Civilians see only their reports + public ones
- **User Locations**: Private location data protected per user
- **Report Attachments**: Access tied to report visibility permissions

### Data Encryption
- **Passwords**: bcrypt hashing with salt
- **Sensitive Data**: AES-256 encryption for PII
- **API Communications**: TLS 1.3 encryption
- **Database Connections**: SSL/TLS encrypted connections

### Audit Trail
- **Complete Logging**: All CRUD operations logged with user context
- **Change Tracking**: Before/after values for all updates
- **Session Tracking**: User activity and authentication events
- **Performance Monitoring**: Query performance and system metrics

## Installation and Setup

### Prerequisites
```bash
# PostgreSQL 14+
sudo apt-get install postgresql-14 postgresql-contrib-14

# Required extensions
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### Database Creation
```bash
# Create database
sudo -u postgres createdb navimitra

# Create user
sudo -u postgres psql -c "CREATE USER navimitra_app WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE navimitra TO navimitra_app;"
```

### Schema Deployment
```bash
# Deploy schema
psql -U navimitra_app -d navimitra -f database/schema.sql

# Set up permissions
psql -U navimitra_app -d navimitra -f database/user_permissions.sql

# Load sample data (optional)
psql -U navimitra_app -d navimitra -f database/sample_data.sql
```

## Performance Optimization

### Indexing Strategy
- **Geospatial Indexes**: For location-based queries
- **Composite Indexes**: For common query patterns
- **Partial Indexes**: For filtered queries (e.g., active reports only)
- **Text Search Indexes**: For full-text search capabilities

### Query Optimization
- **Materialized Views**: For complex analytics queries
- **Partitioning**: Time-based partitioning for large tables
- **Connection Pooling**: PgBouncer for connection management
- **Query Caching**: Redis for frequently accessed data

### Scaling Considerations
- **Read Replicas**: For read-heavy workloads
- **Horizontal Partitioning**: For very large datasets
- **Caching Layer**: Redis for session and real-time data
- **CDN Integration**: For media file delivery

## Backup and Recovery

### Backup Strategy
```bash
# Daily full backup
pg_dump -U navimitra_app -h localhost navimitra > backup_$(date +%Y%m%d).sql

# Continuous WAL archiving
# Configure in postgresql.conf:
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /backup/wal/%f'
```

### Recovery Procedures
```bash
# Point-in-time recovery
pg_basebackup -U navimitra_app -h localhost -D /recovery/base -Ft -z -P

# Restore from backup
psql -U navimitra_app -d navimitra_restored < backup_20240115.sql
```

## Monitoring and Maintenance

### Health Checks
- **Connection Monitoring**: Active connection count and health
- **Query Performance**: Slow query identification and optimization
- **Storage Usage**: Database size and growth monitoring
- **Replication Lag**: For read replica configurations

### Maintenance Tasks
```sql
-- Regular maintenance queries
VACUUM ANALYZE; -- Weekly
REINDEX DATABASE navimitra; -- Monthly
UPDATE pg_stat_statements_reset(); -- Reset query stats
```

### Performance Metrics
- **Response Time**: Average query execution time
- **Throughput**: Queries per second
- **Resource Usage**: CPU, memory, and disk utilization
- **Error Rates**: Failed queries and connection errors

## API Integration

### Connection Configuration
```javascript
// Node.js example
const { Pool } = require('pg');

const pool = new Pool({
  user: 'navimitra_app',
  host: 'localhost',
  database: 'navimitra',
  password: 'secure_password',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Row Level Security Context
```javascript
// Set user context for RLS
await client.query('SELECT set_current_user_id($1)', [userId]);

// Now all queries will respect RLS policies
const result = await client.query('SELECT * FROM emergency_reports');
```

## Development Guidelines

### Code Standards
- **SQL Style**: Use consistent formatting and naming conventions
- **Migration Scripts**: Version-controlled schema changes
- **Testing**: Unit tests for all database functions
- **Documentation**: Comprehensive inline comments

### Best Practices
- **Parameterized Queries**: Prevent SQL injection
- **Transaction Management**: Proper ACID compliance
- **Error Handling**: Graceful degradation and recovery
- **Performance Testing**: Load testing for scalability

## Troubleshooting

### Common Issues
1. **Connection Limits**: Increase max_connections in postgresql.conf
2. **Slow Queries**: Use EXPLAIN ANALYZE to identify bottlenecks
3. **Lock Contention**: Monitor pg_locks for blocking queries
4. **Storage Issues**: Monitor disk space and implement archiving

### Debug Queries
```sql
-- Active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Slow queries
SELECT query, mean_time, calls FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Lock monitoring
SELECT * FROM pg_locks WHERE NOT granted;

-- Database size
SELECT pg_size_pretty(pg_database_size('navimitra'));
```

## Support and Maintenance

### Regular Tasks
- **Daily**: Monitor system health and performance
- **Weekly**: Review slow queries and optimize
- **Monthly**: Update statistics and reindex
- **Quarterly**: Review and update security policies

### Emergency Procedures
- **Data Recovery**: Point-in-time recovery procedures
- **Failover**: Switch to backup systems
- **Security Incident**: Immediate response protocols
- **Performance Issues**: Scaling and optimization procedures

---

This database system provides a robust foundation for the NaviMitra Emergency Management Platform, ensuring reliable, secure, and scalable operations for large-scale event management.