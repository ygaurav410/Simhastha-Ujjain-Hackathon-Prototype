import { Alert, Amenity, RouteData, CrowdData, EmergencyReport, User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    username: 'rajesh',
    email: 'rajesh@example.com',
    role: 'civilian',
    location: { lat: 25.4358, lng: 81.8463 },
    isOnline: true,
    phone: '+91-9876543210',
  },
  {
    id: '2',
    name: 'Admin Control',
    username: 'admin',
    email: 'admin@navimitra.gov.in',
    role: 'admin',
    location: { lat: 25.4470, lng: 81.8420 },
    isOnline: true,
    phone: '+91-532-2408999',
  },
  {
    id: '3',
    name: 'Authority Officer',
    username: 'authority',
    email: 'authority@navimitra.gov.in',
    role: 'authority',
    location: { lat: 25.4400, lng: 81.8400 },
    isOnline: true,
    phone: '+91-532-2509999',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'traffic',
    title: 'Heavy Traffic Congestion',
    description: 'Major traffic jam on Main Parade Ground route due to increased pilgrim flow',
    severity: 'high',
    location: {
      lat: 25.4358,
      lng: 81.8463,
      address: 'Main Parade Ground, Ujjain'
    },
    timestamp: new Date(),
    isActive: true,
    affectedRadius: 2,
  },
  {
    id: '2',
    type: 'disaster',
    title: 'River Level Rising',
    description: 'Ganga river level rising due to upstream discharge. Ghats may flood.',
    severity: 'critical',
    location: {
      lat: 25.4470,
      lng: 81.8420,
      address: 'Sangam Ghats, Ujjain'
    },
    timestamp: new Date(),
    isActive: true,
    affectedRadius: 5,
  },
  {
    id: '3',
    type: 'emergency',
    title: 'Medical Emergency Station',
    description: 'Temporary medical camp established for heat stroke patients',
    severity: 'medium',
    location: {
      lat: 25.4280,
      lng: 81.8430,
      address: 'Sector 12, Kumbh Area'
    },
    timestamp: new Date(),
    isActive: true,
    affectedRadius: 1,
  },
];

export const mockAmenities: Amenity[] = [
  {
    id: '1',
    name: 'Ujjain Junction Railway Station',
    type: 'railway_station',
    location: {
      lat: 25.4358,
      lng: 81.8463,
      address: 'Railway Station Road, Ujjain'
    },
    isOperational: true,
    capacity: 50000,
    currentOccupancy: 12000,
    contact: '+91-532-2408999',
    amenities: ['Waiting Room', 'Food Court', 'ATM', 'Restrooms']
  },
  {
    id: '2',
    name: 'Kumbh Central Bus Stand',
    type: 'bus_stand',
    location: {
      lat: 25.4470,
      lng: 81.8420,
      address: 'Kumbh Mela Area, Ujjain'
    },
    isOperational: true,
    capacity: 2000,
    currentOccupancy: 800,
    contact: '+91-532-2501234',
    amenities: ['Ticket Counter', 'Waiting Area', 'Refreshments']
  },
  {
    id: '3',
    name: 'Sangam Heritage Hotel',
    type: 'hotel',
    location: {
      lat: 25.4380,
      lng: 81.8450,
      address: 'Civil Lines, Ujjain'
    },
    isOperational: true,
    capacity: 200,
    currentOccupancy: 180,
    contact: '+91-532-2567890',
    amenities: ['AC Rooms', 'Restaurant', 'WiFi', 'Parking']
  },
  {
    id: '4',
    name: 'Kumbh Police Control Room',
    type: 'police_station',
    location: {
      lat: 25.4400,
      lng: 81.8400,
      address: 'Sector 8, Kumbh Mela Area'
    },
    isOperational: true,
    contact: '100 / +91-532-2509999',
    amenities: ['24/7 Service', 'Lost & Found', 'Emergency Response']
  },
];

export const mockRouteData: RouteData[] = [
  {
    id: '1',
    origin: { lat: 25.4358, lng: 81.8463 },
    destination: { lat: 25.4470, lng: 81.8420 },
    distance: '2.1 km',
    duration: '8 mins',
    trafficLevel: 'high',
    alternativeRoutes: 3,
    lastUpdated: new Date(),
  },
];

export const mockCrowdData: CrowdData[] = [
  { location: { lat: 25.4358, lng: 81.8463 }, density: 'high', count: 15000, timestamp: new Date() },
  { location: { lat: 25.4470, lng: 81.8420 }, density: 'critical', count: 25000, timestamp: new Date() },
  { location: { lat: 25.4280, lng: 81.8430 }, density: 'medium', count: 8000, timestamp: new Date() },
  { location: { lat: 25.4400, lng: 81.8400 }, density: 'low', count: 3000, timestamp: new Date() },
];

export const mockEmergencyReports: EmergencyReport[] = [
  {
    id: '1',
    type: 'lost_person',
    description: 'Missing child - Boy, 8 years old, wearing blue shirt',
    location: {
      lat: 25.4358,
      lng: 81.8463,
      address: 'Near Main Gate, Sector 12'
    },
    reportedBy: 'Sunita Devi (+91-9876543210)',
    status: 'investigating',
    priority: 'high',
    timestamp: new Date(),
    assignedTo: 'Inspector Kumar'
  },
  {
    id: '2',
    type: 'medical',
    description: 'Elderly person collapsed due to heat stroke',
    location: {
      lat: 25.4470,
      lng: 81.8420,
      address: 'Sangam Ghat Area'
    },
    reportedBy: 'Volunteer Team Alpha',
    status: 'resolved',
    priority: 'critical',
    timestamp: new Date(),
    assignedTo: 'Dr. Sharma'
  },
  {
    id: '3',
    type: 'infrastructure',
    description: 'Water pipeline burst causing flooding',
    location: {
      lat: 25.4280,
      lng: 81.8430,
      address: 'Sector 15, Block C'
    },
    reportedBy: 'Maintenance Team',
    status: 'reported',
    priority: 'medium',
    timestamp: new Date(),
  }
];

export const mockEmergencyPosts: EmergencyPost[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Rajesh Kumar',
    type: 'lost_person',
    title: 'Missing Child - Urgent Help Needed',
    description: 'My 8-year-old son went missing near the main gate. He is wearing a blue shirt and khaki shorts. Please contact if you see him.',
    location: {
      lat: 25.4358,
      lng: 81.8463,
      address: 'Main Gate, Sector 12, Kumbh Mela'
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'active',
    priority: 'critical',
    contact: '+91-9876543210'
  },
  {
    id: '2',
    userId: '4',
    userName: 'Priya Sharma',
    type: 'medical',
    title: 'Medical Emergency - Need Ambulance',
    description: 'Elderly person collapsed due to heat stroke. Need immediate medical assistance.',
    location: {
      lat: 25.4470,
      lng: 81.8420,
      address: 'Sangam Ghat, Near Boat Stand'
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'active',
    priority: 'critical',
    contact: '+91-9876543211'
  },
  {
    id: '3',
    userId: '5',
    userName: 'Amit Verma',
    type: 'security',
    title: 'Suspicious Activity Reported',
    description: 'Noticed some suspicious individuals near the parking area. They seem to be monitoring people and vehicles.',
    location: {
      lat: 25.4280,
      lng: 81.8430,
      address: 'Parking Area, Sector 15'
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'active',
    priority: 'high',
    contact: '+91-9876543212'
  }
];