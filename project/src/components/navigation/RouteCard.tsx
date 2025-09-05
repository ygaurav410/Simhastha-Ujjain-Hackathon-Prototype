import React from 'react';
import { Navigation, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { RouteData } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RouteCardProps {
  route: RouteData;
  onSelectRoute?: (route: RouteData) => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onSelectRoute }) => {
  const trafficColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  } as const;

  const trafficLabels = {
    low: 'Light Traffic',
    medium: 'Moderate Traffic',
    high: 'Heavy Traffic',
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Recommended Route</span>
          </div>
          <Badge variant={trafficColors[route.trafficLevel]}>
            {trafficLabels[route.trafficLevel]}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{route.distance}</p>
              <p className="text-xs text-gray-500">Distance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{route.duration}</p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>
        </div>
        
        {route.alternativeRoutes > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-gray-600">
              {route.alternativeRoutes} alternative routes available
            </p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1"
            onClick={() => onSelectRoute?.(route)}
          >
            Start Navigation
          </Button>
          <Button variant="secondary" size="sm">
            View Alternatives
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {new Date(route.lastUpdated).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
};