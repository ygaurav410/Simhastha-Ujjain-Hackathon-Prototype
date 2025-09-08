import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { CivilianDashboard } from './components/civilian/CivilianDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { User } from './types';
import { globalState } from './utils/globalState';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize global state when app starts
  useEffect(() => {
    // Global state is already initialized in globalState.ts
    // This ensures all components have access to synchronized data
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Show login form if no user is logged in
  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main>
        {currentUser.role === 'civilian' ? (
          <CivilianDashboard />
        ) : currentUser.role === 'admin' || currentUser.role === 'authority' ? (
          <AdminDashboard />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Invalid user role</p>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NaviMitra</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive navigation and safety platform for large-scale events. 
                Built with AI-powered routing, real-time crowd monitoring, and emergency response systems.
              </p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>Kumbh Mela 2025</span>
                <span>•</span>
                <span>Powered by IoT & AI</span>
                <span>•</span>
                <span>24/7 Support</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Real-time Navigation</li>
                <li>Crowd Monitoring</li>
                <li>Emergency Alerts</li>
                <li>Offline GPS</li>
                <li>Multilingual Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Emergency</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Emergency: 108</li>
                <li>Police: 100</li>
                <li>Fire: 101</li>
                <li>Control Room: 1077</li>
                <li>Medical: +91-532-2408999</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2025 NaviMitra. Built for Kumbh Mela 2025. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">API Documentation</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;