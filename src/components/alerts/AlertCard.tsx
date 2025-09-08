import React from 'react';
import { AlertTriangle, Clock, MapPin, Users } from 'lucide-react';
import { Alert } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface AlertCardProps {
  alert: Alert;
  onViewDetails?: (alert: Alert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewDetails }) => {
  const severityColors = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  } as const;

  const typeIcons = {
    traffic: Users,
    disaster: AlertTriangle,
    emergency: AlertTriangle,
    health: AlertTriangle,
    security: AlertTriangle,
  };

  const Icon = typeIcons[alert.type] || AlertTriangle;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => onViewDetails?.(alert)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${
            alert.severity === 'critical' ? 'bg-red-100 text-red-600' :
            alert.severity === 'high' ? 'bg-orange-100 text-orange-600' :
            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{alert.title}</h3>
              <Badge variant={severityColors[alert.severity]} size="sm">
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{alert.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{alert.location.address}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            
            {alert.affectedRadius && (
              <div className="mt-2 text-xs text-gray-500">
                Affected radius: {alert.affectedRadius} km
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};