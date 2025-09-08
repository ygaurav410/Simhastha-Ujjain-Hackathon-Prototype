import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, AlertTriangle, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert, Amenity, CrowdData } from '../../types';

interface MapViewProps {
  alerts: Alert[];
  amenities: Amenity[];
  crowdData: CrowdData[];
  userLocation?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  alerts,
  amenities,
  crowdData,
  userLocation,
  onLocationSelect,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'alerts' | 'amenities' | 'crowd'>('all');
  const [mapCenter, setMapCenter] = useState({ lat: 25.4358, lng: 81.8463 });
  const [zoom, setZoom] = useState(13);

  // Simulate map interaction
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified)
    const lat = mapCenter.lat + (0.01 * (rect.height / 2 - y) / (rect.height / 2));
    const lng = mapCenter.lng + (0.01 * (x - rect.width / 2) / (rect.width / 2));
    
    onLocationSelect?.({ lat, lng });
  };

  const getMarkerPosition = (lat: number, lng: number) => {
    // Convert lat/lng to pixel position (simplified)
    const x = 50 + ((lng - mapCenter.lng) / 0.01) * 20;
    const y = 50 - ((lat - mapCenter.lat) / 0.01) * 20;
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <Card className="h-96">
      <CardContent className="p-0 relative h-full">
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex space-x-1">
              {[
                { id: 'all', label: 'All', icon: MapPin },
                { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
                { id: 'amenities', label: 'Places', icon: Navigation },
                { id: 'crowd', label: 'Crowd', icon: Users },
              ].map((layer) => (
                <Button
                  key={layer.id}
                  variant={selectedLayer === layer.id ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedLayer(layer.id as any)}
                  className="p-2"
                >
                  <layer.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="bg-white rounded-lg shadow-lg p-1">
            <div className="flex flex-col space-y-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(Math.min(18, zoom + 1))}
                className="p-2 text-lg font-bold"
              >
                +
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(Math.max(10, zoom - 1))}
                className="p-2 text-lg font-bold"
              >
                −
              </Button>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-3 max-w-xs">
            <h4 className="font-medium text-gray-900 mb-2">Map Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical Alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Amenities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>High Crowd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Map Background */}
        <div
          className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-yellow-50 cursor-crosshair relative overflow-hidden"
          onClick={handleMapClick}
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0%, transparent 100%)
            `,
          }}
        >
          {/* River representation */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 20 80 Q 40 60 60 70 T 90 50"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 15 85 Q 35 65 55 75 T 85 55"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="5"
                fill="none"
              />
            </svg>
          </div>

          {/* User Location */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${getMarkerPosition(userLocation.lat, userLocation.lng).x}%`,
                top: `${getMarkerPosition(userLocation.lat, userLocation.lng).y}%`,
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          )}

          {/* Alert Markers */}
          {(selectedLayer === 'all' || selectedLayer === 'alerts') &&
            alerts.map((alert) => {
              const position = getMarkerPosition(alert.location.lat, alert.location.lng);
              return (
                <div
                  key={alert.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      alert.severity === 'critical'
                        ? 'bg-red-500'
                        : alert.severity === 'high'
                        ? 'bg-orange-500'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {alert.title}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Amenity Markers */}
          {(selectedLayer === 'all' || selectedLayer === 'amenities') &&
            amenities.map((amenity) => {
              const position = getMarkerPosition(amenity.location.lat, amenity.location.lng);
              return (
                <div
                  key={amenity.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {amenity.name}
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Crowd Density Areas */}
          {(selectedLayer === 'all' || selectedLayer === 'crowd') &&
            crowdData.map((crowd, index) => {
              const position = getMarkerPosition(crowd.location.lat, crowd.location.lng);
              const densityColor = {
                low: 'bg-green-400',
                medium: 'bg-yellow-400',
                high: 'bg-orange-400',
                critical: 'bg-red-400',
              };
              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-5"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <div
                    className={`w-12 h-12 rounded-full opacity-60 ${densityColor[crowd.density]}`}
                  ></div>
                </div>
              );
            })}

          {/* Grid overlay for better visualization */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Map Status */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white rounded-lg shadow-lg px-3 py-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Live Map • Zoom: {zoom}</span>
            </div>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg px-3 py-2">
            <div className="text-xs text-gray-600">
              {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};