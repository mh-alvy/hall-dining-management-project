import React, { useState } from 'react';
import { User, Lock, LogIn, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Login: React.FC = () => {
  const { state, dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'manager' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      if (userType === 'student') {
        const student = state.students.find(s => s.email === email && s.password === password);
        if (student) {
          dispatch({ type: 'LOGIN_STUDENT', payload: student });
        } else {
          setError('Invalid email or password');
        }
      } else if (userType === 'admin') {
        const admin = state.admins.find(a => a.email === email && a.password === password);
        if (admin) {
          dispatch({ type: 'LOGIN_ADMIN', payload: admin });
        } else {
          setError('Invalid email or password');
        }
      } else {
        const manager = state.managers.find(m => m.email === email && m.password === password);
        if (manager) {
          dispatch({ type: 'LOGIN_MANAGER', payload: manager });
        } else {
          setError('Invalid email or password');
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Hall Dining System</h1>
            <p className="text-blue-100 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Login as
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`p-2 rounded-lg border-2 text-center transition-all duration-200 ${
                      userType === 'student'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <User className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-xs font-medium">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('manager')}
                    className={`p-2 rounded-lg border-2 text-center transition-all duration-200 ${
                      userType === 'manager'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Users className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-xs font-medium">Manager</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`p-2 rounded-lg border-2 text-center transition-all duration-200 ${
                      userType === 'admin'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <User className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-xs font-medium">Admin</span>
                  </button>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign In
                  </div>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Student:</strong> john.doe@university.edu / student123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Manager:</strong> sarah.wilson@university.edu / student101
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <strong>Admin:</strong> admin@university.edu / admin123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;