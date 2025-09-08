import React from 'react';
import { MapPin, Phone, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Amenity } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AmenityCardProps {
  amenity: Amenity;
  onGetDirections?: (amenity: Amenity) => void;
}

export const AmenityCard: React.FC<AmenityCardProps> = ({ amenity, onGetDirections }) => {
  const typeLabels = {
    bus_stand: 'Bus Stand',
    railway_station: 'Railway Station',
    hotel: 'Hotel',
    hospital: 'Hospital',
    police_station: 'Police Station',
    park: 'Park',
    toilet: 'Restroom',
    food_court: 'Food Court',
  };

  const getCapacityPercentage = () => {
    if (!amenity.capacity || !amenity.currentOccupancy) return 0;
    return (amenity.currentOccupancy / amenity.capacity) * 100;
  };

  const capacityPercentage = getCapacityPercentage();

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{amenity.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="info" size="sm">
                {typeLabels[amenity.type]}
              </Badge>
              {amenity.isOperational ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs">Operational</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <XCircle className="h-3 w-3" />
                  <span className="text-xs">Closed</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mb-3 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{amenity.location.address}</span>
        </div>
        
        {amenity.contact && (
          <div className="flex items-center space-x-1 mb-3 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{amenity.contact}</span>
          </div>
        )}
        
        {amenity.capacity && amenity.currentOccupancy && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Occupancy</span>
              <span className="font-medium text-gray-900">
                {amenity.currentOccupancy}/{amenity.capacity}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  capacityPercentage < 50 ? 'bg-green-500' :
                  capacityPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        {amenity.amenities && amenity.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Available Services:</p>
            <div className="flex flex-wrap gap-1">
              {amenity.amenities.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="default" size="sm">
                  {service}
                </Badge>
              ))}
              {amenity.amenities.length > 3 && (
                <Badge variant="default" size="sm">
                  +{amenity.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <Button 
          variant="primary" 
          size="sm" 
          className="w-full"
          onClick={() => onGetDirections?.(amenity)}
          disabled={!amenity.isOperational}
        >
          Get Directions
        </Button>
      </CardContent>
    </Card>
  );
};