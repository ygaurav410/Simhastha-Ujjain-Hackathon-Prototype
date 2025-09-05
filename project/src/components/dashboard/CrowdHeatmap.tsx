import React from 'react';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { CrowdData } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CrowdHeatmapProps {
  data: CrowdData[];
}

export const CrowdHeatmap: React.FC<CrowdHeatmapProps> = ({ data }) => {
  const getDensityColor = (density: CrowdData['density']) => {
    switch (density) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDensityVariant = (density: CrowdData['density']) => {
    switch (density) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'warning';
      case 'critical': return 'danger';
      default: return 'default';
    }
  };

  const totalCrowd = data.reduce((sum, item) => sum + item.count, 0);
  const avgDensity = data.length > 0 ? Math.round(totalCrowd / data.length) : 0;
  const criticalAreas = data.filter(item => item.density === 'critical').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Live Crowd Monitoring</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>Real-time</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalCrowd.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total People</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{avgDensity.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Avg per Area</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{criticalAreas}</p>
            <p className="text-sm text-gray-500">Critical Areas</p>
          </div>
        </div>

        {/* Crowd Density Areas */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Area Status</h4>
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${getDensityColor(item.density)}`} />
                <div>
                  <p className="font-medium text-gray-900">
                    Area {index + 1} ({item.location.lat.toFixed(3)}, {item.location.lng.toFixed(3)})
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.count.toLocaleString()} people
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getDensityVariant(item.density)} size="sm">
                  {item.density.toUpperCase()}
                </Badge>
                {item.density === 'critical' && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">Density Levels:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Low (&lt;5K people)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Medium (5K-10K)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>High (10K-20K)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Critical (&gt;20K)</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Last updated: {new Date().toLocaleTimeString()} • Data from IoT sensors and mobile analytics
        </p>
      </CardContent>
    </Card>
  );
};