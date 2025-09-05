import React from 'react';
import { AlertTriangle, Clock, MapPin, User, Shield } from 'lucide-react';
import { EmergencyReport } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EmergencyReportCardProps {
  report: EmergencyReport;
  isAdmin?: boolean;
  onTakeAction?: (report: EmergencyReport) => void;
  onViewDetails?: (report: EmergencyReport) => void;
}

export const EmergencyReportCard: React.FC<EmergencyReportCardProps> = ({ 
  report, 
  isAdmin = false,
  onTakeAction,
  onViewDetails 
}) => {
  const statusColors = {
    reported: 'warning',
    investigating: 'info',
    resolved: 'success',
  } as const;

  const priorityColors = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  } as const;

  const typeLabels = {
    lost_person: 'Lost Person',
    medical: 'Medical Emergency',
    security: 'Security Issue',
    infrastructure: 'Infrastructure',
  };

  const typeIcons = {
    lost_person: User,
    medical: AlertTriangle,
    security: Shield,
    infrastructure: AlertTriangle,
  };

  const Icon = typeIcons[report.type];

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${
            report.priority === 'critical' ? 'bg-red-100 text-red-600' :
            report.priority === 'high' ? 'bg-orange-100 text-orange-600' :
            report.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {typeLabels[report.type]}
              </h3>
              <div className="flex items-center space-x-1">
                <Badge variant={priorityColors[report.priority]} size="sm">
                  {report.priority.toUpperCase()}
                </Badge>
                <Badge variant={statusColors[report.status]} size="sm">
                  {report.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{report.description}</p>
            
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{report.location.address}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Reported by: {report.reportedBy}</span>
              </div>
              
              {report.assignedTo && (
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Assigned to: {report.assignedTo}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(report.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            {isAdmin && report.status !== 'resolved' && (
              <div className="flex space-x-2 mt-3">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => onTakeAction?.(report)}
                >
                  Take Action
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onViewDetails?.(report)}
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};