export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'civilian' | 'admin' | 'authority';
  location: {
    lat: number;
    lng: number;
  };
  isOnline: boolean;
  phone?: string;
  availableRoles?: Array<{
    role: 'civilian' | 'admin' | 'authority';
    department?: string;
    jurisdiction?: string;
    is_primary: boolean;
  }>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    phone?: string;
  };
  roles?: Array<{
    role: 'civilian' | 'admin' | 'authority';
    department?: string;
    jurisdiction?: string;
    is_primary: boolean;
  }>;
  error?: string;
}

interface SessionData {
  success: boolean;
  session_id?: string;
  token?: string;
  expires_at?: string;
  selected_role?: string;
}

export interface Alert {
  id: string;
  type: 'traffic' | 'disaster' | 'emergency' | 'health' | 'security';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: Date;
  isActive: boolean;
  affectedRadius: number; // in kilometers
}

export interface Amenity {
  id: string;
  name: string;
  type: 'bus_stand' | 'railway_station' | 'hotel' | 'hospital' | 'police_station' | 'park' | 'toilet' | 'food_court';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  isOperational: boolean;
  capacity?: number;
  currentOccupancy?: number;
  contact?: string;
  amenities?: string[];
}

export interface RouteData {
  id: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  distance: string;
  duration: string;
  trafficLevel: 'low' | 'medium' | 'high';
  alternativeRoutes: number;
  lastUpdated: Date;
}

export interface CrowdData {
  location: { lat: number; lng: number };
  density: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  timestamp: Date;
}

export interface EmergencyReport {
  id: string;
  type: 'lost_person' | 'medical' | 'security' | 'infrastructure';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedBy: string;
  status: 'reported' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  assignedTo?: string;
}

interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface EmergencyPost {
  id: string;
  userId: string;
  userName: string;
  type: 'lost_person' | 'medical' | 'security' | 'infrastructure' | 'other';
  title: string;
  description: string;
  location: MapLocation;
  timestamp: Date;
  status: 'active' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  images?: string[];
  contact?: string;
}