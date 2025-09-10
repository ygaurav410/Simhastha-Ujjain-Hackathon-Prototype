import React, { useState } from 'react';
import { MapPin, User, Shield, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { User as UserType, LoginCredentials, AuthResponse } from '../../types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<'civilian' | 'admin' | 'authority' | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: ''
  });

  // Mock authentication function (replace with actual API call)
  const authenticateUser = async (creds: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user database
    const mockUsers = {
      'rajesh': {
        success: true,
        user: {
          id: '1',
          username: 'rajesh',
          email: 'rajesh@example.com',
          full_name: 'Rajesh Kumar',
          phone: '+91-9876543210'
        },
        roles: [{ role: 'civilian' as const, is_primary: true }]
      },
      'admin': {
        success: true,
        user: {
          id: '2',
          username: 'admin',
          email: 'admin@navimitra.gov.in',
          full_name: 'Admin Control',
          phone: '+91-532-2408999'
        },
        roles: [{ role: 'admin' as const, is_primary: true }]
      },
      'authority': {
        success: true,
        user: {
          id: '3',
          username: 'authority',
          email: 'authority@navimitra.gov.in',
          full_name: 'Authority Officer',
          phone: '+91-532-2509999'
        },
        roles: [{ role: 'authority' as const, is_primary: true }]
      },
      'multi': {
        success: true,
        user: {
          id: '4',
          username: 'multi',
          email: 'multi@navimitra.gov.in',
          full_name: 'Multi Role User',
          phone: '+91-532-2500000'
        },
        roles: [
          { role: 'admin' as const, department: 'System Administration', is_primary: true },
          { role: 'authority' as const, department: 'Emergency Response', is_primary: false }
        ]
      }
    };

    const user = mockUsers[creds.username as keyof typeof mockUsers];
    if (user && creds.password === 'password') {
      return user;
    }

    return { success: false, error: 'Invalid username or password' };
  };

  // Mock social login function
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful social login for civilians
      const socialUser: UserType = {
        id: Date.now().toString(),
        name: `${provider} User`,
        username: `${provider.toLowerCase()}_user`,
        email: `user@${provider.toLowerCase()}.com`,
        role: 'civilian',
        location: { lat: 25.4358, lng: 81.8463 },
        isOnline: true,
        phone: '+91-9876543210',
        availableRoles: [{ role: 'civilian', is_primary: true }]
      };
      
      onLogin(socialUser);
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new civilian user
      const newUser: UserType = {
        id: Date.now().toString(),
        name: signupData.fullName,
        username: signupData.email.split('@')[0],
        email: signupData.email,
        role: 'civilian',
        location: { lat: 25.4358, lng: 81.8463 },
        isOnline: true,
        phone: signupData.phone,
        availableRoles: [{ role: 'civilian', is_primary: true }]
      };
      
      onLogin(newUser);
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authenticateUser(credentials);
      
      if (response.success && response.user && response.roles) {
        if (response.roles.length === 1) {
          // Single role - login directly
          const role = response.roles[0].role;
          const user: UserType = {
            id: response.user.id,
            name: response.user.full_name,
            username: response.user.username,
            email: response.user.email,
            role: role,
            location: { lat: 25.4358, lng: 81.8463 },
            isOnline: true,
            phone: response.user.phone,
            availableRoles: response.roles
          };
          onLogin(user);
        } else {
          // Multiple roles - show role selection
          setAuthResponse(response);
        }
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = (role: 'civilian' | 'admin' | 'authority') => {
    if (authResponse?.user) {
      const user: UserType = {
        id: authResponse.user.id,
        name: authResponse.user.full_name,
        username: authResponse.user.username,
        email: authResponse.user.email,
        role: role,
        location: { lat: 25.4358, lng: 81.8463 },
        isOnline: true,
        phone: authResponse.user.phone,
        availableRoles: authResponse.roles
      };
      onLogin(user);
    }
  };

  // Signup form
  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NaviMitra</h1>
                <p className="text-gray-600">Smart Event Navigation</p>
              </div>
            </div>
            <p className="text-gray-500">Kumbh Mela 2025 - Ujjain</p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Create Civilian Account
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Join NaviMitra for safe navigation and emergency alerts
              </p>
            </CardHeader>
            <CardContent>
              {/* Social Login Options */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700 text-center">Sign up with</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleSocialLogin('Facebook')}
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Already have an account? Sign In
                </button>
              </div>

              {/* Terms */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Role selection screen
  if (authResponse && authResponse.roles && authResponse.roles.length > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NaviMitra</h1>
                <p className="text-gray-600">Smart Event Navigation</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Welcome, {authResponse.user?.full_name}
              </h2>
              <p className="text-gray-600 text-center text-sm">
                You have access to multiple roles. Please select one to continue.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {authResponse.roles.map((roleData, index) => {
                  const roleConfig = {
                    civilian: {
                      label: 'Civilian',
                      description: 'Navigate and get alerts',
                      icon: User,
                      color: 'bg-blue-100 text-blue-600',
                    },
                    admin: {
                      label: 'Admin',
                      description: 'Manage system and alerts',
                      icon: Shield,
                      color: 'bg-red-100 text-red-600',
                    },
                    authority: {
                      label: 'Authority',
                      description: 'Monitor and respond',
                      icon: Shield,
                      color: 'bg-green-100 text-green-600',
                    },
                  }[roleData.role];

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleRoleSelection(roleData.role)}
                      className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${roleConfig.color}`}>
                          <roleConfig.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {roleConfig.label}
                            {roleData.is_primary && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Primary
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">{roleConfig.description}</p>
                          {roleData.department && (
                            <p className="text-xs text-gray-400">{roleData.department}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthResponse(null);
                    setCredentials({ username: '', password: '' });
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Back to Login
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NaviMitra</h1>
              <p className="text-gray-600">Smart Event Navigation</p>
            </div>
          </div>
          <p className="text-gray-500">Kumbh Mela 2025 - Ujjain</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Sign In to NaviMitra
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Enter your credentials to access the platform
            </p>
          </CardHeader>
          <CardContent>
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing In...'
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Signup Option for Civilians */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                New to NaviMitra?
              </p>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => setShowSignup(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Civilian Account
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-blue-800">
                <p><strong>Civilian:</strong> rajesh / password</p>
                <p><strong>Admin:</strong> admin / password</p>
                <p><strong>Authority:</strong> authority / password</p>
                <p><strong>Multi-Role:</strong> multi / password</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Emergency: <span className="font-medium text-red-600">108</span> | 
                Control Room: <span className="font-medium text-blue-600">1077</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};