import React from 'react';
import { AlertTriangle, Clock, MapPin, User, Phone, CheckCircle } from 'lucide-react';
import { EmergencyPost } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EmergencyPostCardProps {
  post: EmergencyPost;
  userRole?: 'civilian' | 'admin' | 'authority';
  onContact?: (post: EmergencyPost) => void;
  onMarkResolved?: (post: EmergencyPost) => void;
  showActions?: boolean;
}

export const EmergencyPostCard: React.FC<EmergencyPostCardProps> = ({
  post,
  userRole = 'civilian',
  onContact,
  onMarkResolved,
  showActions = true,
}) => {
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
    other: 'Other Emergency',
  };

  const typeIcons = {
    lost_person: '👤',
    medical: '🏥',
    security: '🚨',
    infrastructure: '🔧',
    other: '⚠️',
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${
      post.status === 'resolved' ? 'opacity-75' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{typeIcons[post.type]}</div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {post.title}
              </h3>
              <div className="flex items-center space-x-1">
                <Badge variant={priorityColors[post.priority]} size="sm">
                  {post.priority.toUpperCase()}
                </Badge>
                {post.status === 'resolved' && (
                  <Badge variant="success" size="sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    RESOLVED
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
            
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{post.location.address}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>By: {post.userName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeAgo(post.timestamp)}</span>
                </div>
              </div>
              
              {post.contact && (
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>{post.contact}</span>
                </div>
              )}
            </div>
            
            {showActions && post.status === 'active' && (
              <div className="flex space-x-2 mt-3">
                {post.contact && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onContact?.(post)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                )}
                {(userRole === 'admin' || userRole === 'authority') && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => onMarkResolved?.(post)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark Resolved
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};