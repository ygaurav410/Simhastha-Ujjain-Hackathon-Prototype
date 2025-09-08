import React, { useState } from 'react';
import { useEffect } from 'react';
import { Navigation, MapPin, AlertTriangle, Phone, Search, Compass, Wifi, WifiOff, Plus, Bell } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';
import { AlertCard } from '../alerts/AlertCard';
import { RouteCard } from '../navigation/RouteCard';
import { AmenityCard } from '../amenities/AmenityCard';
import { EmergencyPostCard } from '../emergency/EmergencyPostCard';
import { EmergencyPostForm } from '../emergency/EmergencyPostForm';
import { MapView } from '../maps/MapView';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockAlerts, mockRouteData, mockAmenities, mockEmergencyPosts, mockCrowdData } from '../../utils/mockData';
import { EmergencyPost } from '../../types';
import { globalState } from '../../utils/globalState';

export const CivilianDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyPosts, setEmergencyPosts] = useState(mockEmergencyPosts);
  const [activeTab, setActiveTab] = useState<'navigation' | 'alerts' | 'emergency' | 'amenities'>('navigation');
  const [userLocation] = useState({ lat: 25.4358, lng: 81.8463 });

  // Listen for navigation events from header
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const section = event.detail;
      switch (section) {
        case 'navigation':
          setActiveTab('navigation');
          break;
        case 'amenities':
          setActiveTab('amenities');
          break;
        case 'alerts':
          setActiveTab('alerts');
          break;
        case 'emergency':
          setActiveTab('emergency');
          break;
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  // Subscribe to global state changes
  useEffect(() => {
    const handlePostsUpdate = (posts: EmergencyPost[]) => {
      setEmergencyPosts(posts);
    };

    globalState.subscribe('emergencyPostsUpdated', handlePostsUpdate);
    
    // Initialize with current state
    setEmergencyPosts(globalState.getEmergencyPosts());

    return () => {
      globalState.unsubscribe('emergencyPostsUpdated', handlePostsUpdate);
    };
  }, []);

  const activeAlerts = mockAlerts.filter(a => a.isActive);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const activePosts = emergencyPosts.filter(p => p.status === 'active');
  
  const amenityCategories = [
    { id: 'all', label: 'All Services' },
    { id: 'transport', label: 'Transport' },
    { id: 'accommodation', label: 'Hotels' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'facilities', label: 'Facilities' },
  ];

  const filteredAmenities = selectedCategory === 'all' 
    ? mockAmenities 
    : mockAmenities.filter(a => {
        switch (selectedCategory) {
          case 'transport': return ['bus_stand', 'railway_station'].includes(a.type);
          case 'accommodation': return a.type === 'hotel';
          case 'emergency': return ['hospital', 'police_station'].includes(a.type);
          case 'facilities': return ['park', 'toilet', 'food_court'].includes(a.type);
          default: return true;
        }
      });

  const handleEmergencySubmit = (postData: Omit<EmergencyPost, 'id' | 'timestamp'>) => {
    const newPost: EmergencyPost = {
      ...postData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    // Add to global state (will sync across all panels)
    globalState.addEmergencyPost(newPost);
    globalState.syncPostsToReports();
    
    setShowEmergencyForm(false);
  };

  const handleContactPost = (post: EmergencyPost) => {
    if (post.contact) {
      window.open(`tel:${post.contact}`, '_self');
    }
  };

  const handleMarkResolved = (post: EmergencyPost) => {
    // Only authorities can mark as resolved - this should not be available to civilians
    // But if somehow called, we'll update the global state
    globalState.updateEmergencyPost(post.id, { status: 'resolved' });
    globalState.syncPostsToReports();
  };

  // Quick action handlers
  const handleEmergencyCall = () => {
    window.open('tel:108', '_self');
  };

  const handleReportEmergency = () => {
    setShowEmergencyForm(true);
  };

  const handleFindAmenities = () => {
    setActiveTab('amenities');
  };

  const handleGetDirections = () => {
    setActiveTab('navigation');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Kumbh Mela</h1>
            <p className="text-gray-600">Navigate safely with real-time guidance and alerts</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {isOnline ? 'Online Mode' : 'Offline Mode'}
              </span>
            </div>
            <Button
              variant={isOnline ? "secondary" : "primary"}
              size="sm"
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
            <Phone className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">Emergency: 108</span>
          </div>
          <Badge variant="info" size="md">
            <MapPin className="h-3 w-3 mr-1" />
            Current: Prayagraj, Kumbh Mela
          </Badge>
          {!isOnline && (
            <Badge variant="warning" size="md">
              GPS Navigation Available
            </Badge>
          )}
        </div>
      </div>

      {/* Key Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Alerts"
          value={criticalAlerts.length}
          change="Near your location"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Weather"
          value="28°C"
          change="Clear sky"
          changeType="neutral"
          icon={Compass}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Crowd Level"
          value="High"
          change="Peak hours"
          changeType="increase"
          icon={Navigation}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Amenities Nearby"
          value={mockAmenities.length}
          change="Within 2 km"
          changeType="neutral"
          icon={MapPin}
          iconColor="text-green-600"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'navigation', label: 'Navigation & Map', icon: Navigation },
            { id: 'alerts', label: 'Alerts & Safety', icon: AlertTriangle },
            { id: 'emergency', label: 'Emergency Posts', icon: Bell },
            { id: 'amenities', label: 'Nearby Services', icon: MapPin },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'navigation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Map View */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
                  </div>
                  {!isOnline && <Badge variant="warning" size="sm">Offline GPS</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <MapView
                  alerts={activeAlerts}
                  amenities={mockAmenities}
                  crowdData={mockCrowdData}
                  userLocation={userLocation}
                />
              </CardContent>
            </Card>

            {/* Navigation Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Smart Navigation</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter destination..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button variant="primary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Sangam Ghat
                    </Button>
                    <Button variant="secondary" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Main Gate
                    </Button>
                  </div>
                </div>
                
                {mockRouteData.length > 0 && (
                  <div className="mt-6">
                    <RouteCard route={mockRouteData[0]} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="danger" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Call
                </Button>
                <Button 
                  variant="warning" 
                  className="w-full"
                  onClick={handleFindAmenities}
                  onClick={handleReportEmergency}
                  onClick={handleEmergencyCall}
                  onClick={() => setShowEmergencyForm(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Emergency
                </Button>
                <Button variant="primary" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Amenities
                </Button>
                  onClick={handleGetDirections}
                <Button variant="secondary" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Safety Tips</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Stay Connected</p>
                    <p className="text-blue-700">Keep your phone charged and use offline maps when needed.</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">Hydration</p>
                    <p className="text-green-700">Drink water regularly and seek shade during peak hours.</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-900">Stay Together</p>
                    <p className="text-yellow-700">Keep family members close in crowded areas.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Critical Alerts</h3>
                  <Badge variant="danger" size="sm">{criticalAlerts.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criticalAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">All Active Alerts</h3>
                <Badge variant="info" size="sm">{activeAlerts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Community Emergency Posts</h2>
              <p className="text-gray-600">Help others by sharing and responding to emergency situations</p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowEmergencyForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Emergency
            </Button>
          </div>

          {activePosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyPosts.map(post => (
                <EmergencyPostCard
                  key={post.id}
                  post={post}
                  onContact={handleContactPost}
                  onMarkResolved={handleMarkResolved}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Emergency Posts</h3>
                <p className="text-gray-600 mb-4">
                  No emergency situations reported in your area at this time.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowEmergencyForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Report Emergency
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'amenities' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Nearby Services</h3>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {amenityCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            {/* Amenities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAmenities.map(amenity => (
                <AmenityCard key={amenity.id} amenity={amenity} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Emergency Post Form Modal */}
      {showEmergencyForm && (
        <EmergencyPostForm
          onSubmit={handleEmergencySubmit}
          onCancel={() => setShowEmergencyForm(false)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
};