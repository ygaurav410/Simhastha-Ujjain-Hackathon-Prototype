import React, { useState } from 'react';
import { Menu, X, Bell, User, MapPin, Shield, Phone, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentUser?: {
    name: string;
    role: 'civilian' | 'admin' | 'authority';
  };
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'civilian': return 'Civilian';
      case 'admin': return 'Admin';
      case 'authority': return 'Authority';
      default: return 'User';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NaviMitra</h1>
              <p className="text-xs text-gray-500">Smart Event Navigation</p>
            </div>
          </div>

          {/* Navigation */}
          {currentUser?.role === 'civilian' && (
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'navigation' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Navigation
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'amenities' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Amenities
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'alerts' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Alerts
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'emergency' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Report Emergency
              </button>
            </nav>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'authority') && (
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'alerts' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Alerts
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'reports' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Reports
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'crowd' }))}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Crowd Monitor
              </button>
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Emergency Hotline */}
            <div className="hidden md:flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
              <Phone className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">108</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                {currentUser?.role === 'admin' || currentUser?.role === 'authority' ? (
                  <Shield className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Guest User'}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName(currentUser?.role || 'civilian')}</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {currentUser?.role === 'civilian' && (
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'navigation' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Navigation
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'amenities' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Amenities
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'alerts' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Alerts
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'emergency' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Report Emergency
                </button>
              </nav>
            )}

            {(currentUser?.role === 'admin' || currentUser?.role === 'authority') && (
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'alerts' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Alerts
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'reports' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Reports
                </button>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'crowd' }))}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  Crowd Monitor
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </header>
  );
};