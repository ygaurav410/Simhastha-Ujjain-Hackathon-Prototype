import React, { useState } from 'react';
import { useEffect } from 'react';
import { Users, AlertTriangle, MapPin, Activity, Phone, Shield, Settings } from 'lucide-react';
import { StatsCard } from '../dashboard/StatsCard';
import { EmergencyReportCard } from '../emergency/EmergencyReportCard';
import { AlertCard } from '../alerts/AlertCard';
import { CrowdHeatmap } from '../dashboard/CrowdHeatmap';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockEmergencyReports, mockAlerts, mockCrowdData } from '../../utils/mockData';
import { globalState } from '../../utils/globalState';
import { EmergencyReport } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'reports' | 'crowd'>('overview');
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>([]);

  // Listen for navigation events from header
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      const section = event.detail;
      switch (section) {
        case 'dashboard':
          setActiveTab('overview');
          break;
        case 'alerts':
          setActiveTab('alerts');
          break;
        case 'reports':
          setActiveTab('reports');
          break;
        case 'crowd':
          setActiveTab('crowd');
          break;
      }
    };

    window.addEventListener('navigate', handleNavigate as EventListener);
    return () => window.removeEventListener('navigate', handleNavigate as EventListener);
  }, []);

  // Subscribe to global state changes
  useEffect(() => {
    const handleReportsUpdate = (reports: EmergencyReport[]) => {
      setEmergencyReports(reports);
    };

    globalState.subscribe('emergencyReportsUpdated', handleReportsUpdate);
    
    // Initialize with current state
    setEmergencyReports(globalState.getEmergencyReports());

    return () => {
      globalState.unsubscribe('emergencyReportsUpdated', handleReportsUpdate);
    };
  }, []);

  const pendingReports = emergencyReports.filter(r => r.status !== 'resolved');
  const activeAlerts = mockAlerts.filter(a => a.isActive);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Command Center</h1>
            <p className="text-gray-600">Real-time monitoring and emergency management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="success" size="md">System Online</Badge>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="h-4 w-4" />
            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
            <Phone className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">Emergency: 108</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Alerts"
          value={activeAlerts.length}
          change={`${criticalAlerts.length} critical`}
          changeType="decrease"
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Pending Reports"
          value={pendingReports.length}
          change="2 high priority"
          changeType="increase"
          icon={Users}
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Total Crowd"
          value="46.5K"
          change="+15% from yesterday"
          changeType="increase"
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Response Teams"
          value="24"
          change="All deployed"
          changeType="neutral"
          icon={Shield}
          iconColor="text-green-600"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
            { id: 'reports', label: 'Emergency Reports', icon: Phone },
            { id: 'crowd', label: 'Crowd Monitoring', icon: Users },
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
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Critical Alerts</h3>
                <Badge variant="danger" size="sm">{criticalAlerts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalAlerts.slice(0, 3).map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
                {criticalAlerts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No critical alerts at this time
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Emergency Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                <Badge variant="warning" size="sm">{pendingReports.length} Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyReports.slice(0, 3).map(report => (
                  <EmergencyReportCard 
                    key={report.id} 
                    report={report} 
                    isAdmin={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Emergency Reports Management</h2>
            <div className="flex space-x-2">
              <Button variant="primary" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Configure Alerts
              </Button>
              <Button variant="secondary" size="sm">Export Report</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyReports.map(report => (
              <EmergencyReportCard 
                key={report.id} 
                report={report} 
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'crowd' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CrowdHeatmap data={mockCrowdData} />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="danger" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Broadcast Emergency Alert
                </Button>
                <Button variant="warning" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Close Route/Area
                </Button>
                <Button variant="primary" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Deploy Response Team
                </Button>
                <Button variant="secondary" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">IoT Sensors</span>
                    <Badge variant="success" size="sm">98% Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mobile App Users</span>
                    <Badge variant="success" size="sm">15.2K Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Teams</span>
                    <Badge variant="success" size="sm">24/24 Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <Badge variant="success" size="sm">All Systems Go</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};