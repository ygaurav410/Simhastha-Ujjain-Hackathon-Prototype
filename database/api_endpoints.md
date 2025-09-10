# NaviMitra Emergency Management API Documentation

## Overview
This document outlines the RESTful API endpoints for the NaviMitra Emergency Management System, designed to synchronize data across civilian, admin, and authority panels.

## Base URL
```
https://api.navimitra.gov.in/v1
```

## Authentication
All API endpoints require authentication using JWT tokens.

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### POST /auth/login
Login user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "device_info": {
    "device_type": "mobile",
    "device_id": "unique_device_id",
    "app_version": "1.0.0"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "rajesh_kumar",
      "full_name": "Rajesh Kumar",
      "role": "civilian",
      "email": "rajesh.kumar@email.com",
      "phone": "+919876543210"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2024-01-16T10:30:00Z"
  }
}
```

### POST /auth/logout
Logout user and invalidate token.

### POST /auth/refresh
Refresh JWT token.

---

## 2. User Management Endpoints

### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440001",
    "username": "rajesh_kumar",
    "full_name": "Rajesh Kumar",
    "role": "civilian",
    "email": "rajesh.kumar@email.com",
    "phone": "+919876543210",
    "emergency_contact": "+919876543211",
    "preferred_language": "hi",
    "location_sharing_enabled": true,
    "push_notifications_enabled": true,
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-15T10:30:00Z"
  }
}
```

### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "full_name": "Rajesh Kumar Singh",
  "phone": "+919876543210",
  "emergency_contact": "+919876543211",
  "preferred_language": "en",
  "location_sharing_enabled": true,
  "push_notifications_enabled": false
}
```

### POST /users/location
Update user location.

**Request Body:**
```json
{
  "latitude": 25.4358,
  "longitude": 81.8463,
  "accuracy": 5.0,
  "altitude": 98.5,
  "speed": 0.0,
  "heading": 180.0
}
```

---

## 3. Emergency Report Endpoints

### GET /reports
Get emergency reports (filtered by user role).

**Query Parameters:**
- `status`: Filter by status (submitted, acknowledged, assigned, in_progress, resolved, closed)
- `type`: Filter by emergency type (medical, fire, accident, etc.)
- `severity`: Filter by severity (low, medium, high, critical)
- `assigned_to`: Filter by assigned user (authorities only)
- `reporter_id`: Filter by reporter (admin only)
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)
- `sort`: Sort field (reported_at, priority_score, severity)
- `order`: Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "report_id": "a50e8400-e29b-41d4-a716-446655440001",
        "report_number": "EMR-20240115-0001",
        "emergency_type": "lost_person",
        "severity": "high",
        "title": "Missing Child - Urgent Help Needed",
        "description": "My 8-year-old son went missing...",
        "status": "assigned",
        "incident_latitude": 25.4280,
        "incident_longitude": 81.8430,
        "incident_address": "Near Main Gate, Sector 12",
        "incident_time": "2024-01-15T14:30:00+05:30",
        "reported_at": "2024-01-15T14:35:00+05:30",
        "priority_score": 85,
        "affected_people_count": 1,
        "reporter": {
          "user_id": "550e8400-e29b-41d4-a716-446655440001",
          "full_name": "Rajesh Kumar",
          "phone": "+919876543210"
        },
        "assigned_to": {
          "user_id": "550e8400-e29b-41d4-a716-446655440020",
          "full_name": "Inspector Rajesh Kumar",
          "phone": "+915322509999"
        },
        "attachments": [
          {
            "attachment_id": "e50e8400-e29b-41d4-a716-446655440001",
            "file_name": "missing_child_photo.jpg",
            "file_type": "image",
            "file_url": "/uploads/reports/missing_child_photo.jpg",
            "description": "Recent photo of missing child"
          }
        ]
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### POST /reports
Create new emergency report.

**Request Body:**
```json
{
  "emergency_type": "lost_person",
  "severity": "high",
  "title": "Missing Child - Urgent Help Needed",
  "description": "My 8-year-old son went missing near the main gate...",
  "incident_latitude": 25.4280,
  "incident_longitude": 81.8430,
  "incident_address": "Near Main Gate, Sector 12, Kumbh Mela",
  "incident_time": "2024-01-15T14:30:00+05:30",
  "affected_people_count": 1,
  "location_id": "750e8400-e29b-41d4-a716-446655440003"
}
```

### GET /reports/{report_id}
Get specific emergency report details.

### PUT /reports/{report_id}
Update emergency report (authorities only).

**Request Body:**
```json
{
  "status": "in_progress",
  "assigned_to": "550e8400-e29b-41d4-a716-446655440020",
  "priority_score": 90,
  "notes": "Search operation initiated"
}
```

### POST /reports/{report_id}/status
Update report status with history tracking.

**Request Body:**
```json
{
  "new_status": "in_progress",
  "change_reason": "Medical team dispatched",
  "notes": "Ambulance en route, ETA 5 minutes"
}
```

### POST /reports/{report_id}/assign
Assign report to user or team.

**Request Body:**
```json
{
  "assigned_to": "550e8400-e29b-41d4-a716-446655440020",
  "assignment_type": "primary",
  "notes": "Assigned to local police unit for immediate response"
}
```

---

## 4. File Upload Endpoints

### POST /reports/{report_id}/attachments
Upload attachment to emergency report.

**Request:** Multipart form data
- `file`: File to upload (max 100MB)
- `description`: File description
- `is_evidence`: Boolean indicating if file is evidence

**Response:**
```json
{
  "success": true,
  "data": {
    "attachment_id": "e50e8400-e29b-41d4-a716-446655440001",
    "file_name": "evidence_photo.jpg",
    "file_type": "image",
    "file_size": 245760,
    "file_url": "/uploads/reports/evidence_photo.jpg",
    "thumbnail_url": "/uploads/reports/thumbs/evidence_photo_thumb.jpg"
  }
}
```

### DELETE /reports/{report_id}/attachments/{attachment_id}
Delete attachment from report.

---

## 5. Alert Management Endpoints

### GET /alerts
Get active alerts for user.

**Query Parameters:**
- `alert_type`: Filter by type (emergency_broadcast, weather_warning, etc.)
- `priority`: Filter by priority (low, medium, high, urgent)
- `is_emergency`: Filter emergency alerts only
- `limit`: Number of results

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "alert_id": "d50e8400-e29b-41d4-a716-446655440001",
        "alert_type": "weather_warning",
        "priority": "high",
        "title": "High Temperature Alert",
        "message": "Temperature expected to reach 42°C today...",
        "created_at": "2024-01-15T08:00:00+05:30",
        "valid_until": "2024-01-15T23:59:59+05:30",
        "is_emergency": false,
        "acknowledgment_required": false
      }
    ]
  }
}
```

### POST /alerts
Create new alert (admin/authority only).

**Request Body:**
```json
{
  "alert_type": "emergency_broadcast",
  "priority": "urgent",
  "title": "Missing Child Alert",
  "message": "MISSING CHILD: 8-year-old boy named Arjun...",
  "target_audience": ["civilian", "authority"],
  "geographical_scope": {
    "type": "circle",
    "center": {"lat": 25.4280, "lng": 81.8430},
    "radius": 2000
  },
  "valid_until": "2024-01-16T23:59:59+05:30",
  "is_emergency": true,
  "acknowledgment_required": true
}
```

### POST /alerts/{alert_id}/acknowledge
Acknowledge alert.

---

## 6. Location and Mapping Endpoints

### GET /locations
Get locations and points of interest.

**Query Parameters:**
- `type`: Filter by location type (point, area, route, landmark)
- `lat`: Center latitude for proximity search
- `lng`: Center longitude for proximity search
- `radius`: Search radius in meters
- `verified_only`: Show only verified locations

**Response:**
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "location_id": "750e8400-e29b-41d4-a716-446655440001",
        "name": "Sangam Ghat",
        "type": "landmark",
        "latitude": 25.4470,
        "longitude": 81.8420,
        "address": "Sangam Ghat, Triveni Sangam",
        "city": "Ujjain",
        "landmark_description": "Holy confluence of three rivers",
        "is_verified": true
      }
    ]
  }
}
```

### POST /locations
Add new location (admin/authority only).

### GET /locations/nearby
Get nearby locations based on user's current location.

---

## 7. Response Team Management Endpoints

### GET /teams
Get response teams information.

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "team_id": "850e8400-e29b-41d4-a716-446655440001",
        "team_name": "Medical Response Team Alpha",
        "team_type": "medical",
        "department": "Health Department",
        "contact_number": "+915322507777",
        "status": "available",
        "capacity": 6,
        "current_assignments": 1,
        "available_capacity": 5,
        "specializations": ["emergency_medicine", "trauma_care"],
        "base_location": {
          "name": "Emergency Medical Center",
          "latitude": 25.4400,
          "longitude": 81.8400
        }
      }
    ]
  }
}
```

### POST /teams/{team_id}/deploy
Deploy team to emergency (authority only).

**Request Body:**
```json
{
  "report_id": "a50e8400-e29b-41d4-a716-446655440001",
  "estimated_arrival": "2024-01-15T15:00:00+05:30",
  "notes": "Dispatching medical team for heat stroke case"
}
```

---

## 8. Analytics and Reporting Endpoints

### GET /analytics/dashboard
Get dashboard analytics (admin/authority only).

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "active_reports": 4,
      "resolved_today": 12,
      "average_response_time": 8.5,
      "active_users": 1247,
      "teams_deployed": 3
    },
    "reports_by_type": {
      "medical": 15,
      "lost_person": 8,
      "security": 5,
      "infrastructure": 3
    },
    "severity_distribution": {
      "critical": 2,
      "high": 6,
      "medium": 18,
      "low": 25
    }
  }
}
```

### GET /analytics/reports
Get detailed report analytics.

### GET /analytics/response-times
Get response time analytics.

---

## 9. Real-time WebSocket Events

### Connection
```
wss://api.navimitra.gov.in/v1/ws?token=<jwt_token>
```

### Event Types

#### New Emergency Report
```json
{
  "event": "new_report",
  "data": {
    "report_id": "a50e8400-e29b-41d4-a716-446655440001",
    "emergency_type": "medical",
    "severity": "critical",
    "location": {"lat": 25.4470, "lng": 81.8420},
    "title": "Medical Emergency"
  }
}
```

#### Report Status Update
```json
{
  "event": "report_status_update",
  "data": {
    "report_id": "a50e8400-e29b-41d4-a716-446655440001",
    "old_status": "submitted",
    "new_status": "assigned",
    "assigned_to": "Inspector Kumar"
  }
}
```

#### New Alert
```json
{
  "event": "new_alert",
  "data": {
    "alert_id": "d50e8400-e29b-41d4-a716-446655440001",
    "alert_type": "emergency_broadcast",
    "priority": "urgent",
    "title": "Emergency Alert",
    "message": "Immediate evacuation required..."
  }
}
```

#### Team Deployment
```json
{
  "event": "team_deployed",
  "data": {
    "deployment_id": "c50e8400-e29b-41d4-a716-446655440001",
    "team_name": "Medical Response Team Alpha",
    "report_id": "a50e8400-e29b-41d4-a716-446655440001",
    "estimated_arrival": "2024-01-15T15:00:00+05:30"
  }
}
```

---

## 10. Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "emergency_type",
      "message": "Emergency type is required"
    }
  }
}
```

### Common Error Codes
- `AUTHENTICATION_REQUIRED`: Missing or invalid authentication
- `AUTHORIZATION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error

---

## 11. Rate Limiting

- **Civilian Users**: 100 requests per minute
- **Authority Users**: 500 requests per minute
- **Admin Users**: 1000 requests per minute
- **File Uploads**: 10 uploads per minute per user

---

## 12. Data Synchronization

### Sync Status Endpoint
```
GET /sync/status
```

Returns the last synchronization timestamp for different data types:

```json
{
  "success": true,
  "data": {
    "last_sync": {
      "reports": "2024-01-15T16:30:00Z",
      "alerts": "2024-01-15T16:25:00Z",
      "locations": "2024-01-15T10:00:00Z",
      "teams": "2024-01-15T15:45:00Z"
    }
  }
}
```

### Incremental Sync
```
GET /sync/incremental?since=2024-01-15T16:00:00Z&types=reports,alerts
```

Returns only data modified since the specified timestamp.

---

This API documentation provides a comprehensive foundation for building the NaviMitra Emergency Management System with proper role-based access control and real-time synchronization capabilities.