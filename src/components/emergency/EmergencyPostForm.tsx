import React, { useState } from 'react';
import { AlertTriangle, MapPin, Phone, Camera, Send, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmergencyPost } from '../../types';

interface EmergencyPostFormProps {
  onSubmit: (post: Omit<EmergencyPost, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
  userLocation?: { lat: number; lng: number };
}

export const EmergencyPostForm: React.FC<EmergencyPostFormProps> = ({
  onSubmit,
  onCancel,
  userLocation,
}) => {
  const [formData, setFormData] = useState({
    type: 'other' as EmergencyPost['type'],
    title: '',
    description: '',
    priority: 'medium' as EmergencyPost['priority'],
    contact: '',
    location: {
      lat: userLocation?.lat || 25.4358,
      lng: userLocation?.lng || 81.8463,
      address: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyTypes = [
    { id: 'lost_person', label: 'Lost Person', icon: '👤', color: 'bg-red-100 text-red-800' },
    { id: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'bg-red-100 text-red-800' },
    { id: 'security', label: 'Security Issue', icon: '🚨', color: 'bg-orange-100 text-orange-800' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🔧', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'other', label: 'Other Emergency', icon: '⚠️', color: 'bg-gray-100 text-gray-800' },
  ];

  const priorityLevels = [
    { id: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        userId: '1', // Current user ID
        userName: 'Current User',
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: {
          ...formData.location,
          address: formData.location.address || `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}`,
        },
        status: 'active',
        priority: formData.priority,
        contact: formData.contact,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Report Emergency</h2>
              </div>
              <Button variant="secondary" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-600">
              Report an emergency situation to alert authorities and nearby users
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emergency Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Emergency Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {emergencyTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.type === type.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Brief description of the emergency"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Provide detailed information about the emergency situation..."
                />
              </div>

              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Priority Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorityLevels.map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: priority.id as any })}
                      className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                        formData.priority === priority.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Badge variant={formData.priority === priority.id ? 'danger' : 'default'}>
                        {priority.label}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: { ...formData.location, address: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter location or address"
                    />
                    <Button type="button" variant="secondary" onClick={getCurrentLocation}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={formData.location.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: { ...formData.location, lat: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      step="any"
                      value={formData.location.lng}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: { ...formData.location, lng: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Longitude"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>

              {/* Photo Upload Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to add photos of the emergency situation
                  </p>
                  <Button type="button" variant="secondary" size="sm" className="mt-2">
                    Choose Photos
                  </Button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  variant="danger"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Report Emergency
                    </>
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>

            {/* Emergency Notice */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    For Life-Threatening Emergencies
                  </p>
                  <p className="text-sm text-red-700">
                    Call <strong>108</strong> immediately for ambulance or <strong>100</strong> for police.
                    This form is for community alerts and non-critical emergencies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};