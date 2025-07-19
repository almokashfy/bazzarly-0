import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/Loading';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    identifier: '', // email or phone
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.post('/auth/login', {
        identifier: formData.identifier,
        password: formData.password
      });

      if (response.success) {
        // Store authentication data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (formData.rememberMe) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        setSuccess('Login successful! Redirecting...');

        // Redirect based on user role
        const user = response.data.user;
        let redirectPath = from;

        if (user.role === 'admin' || user.role === 'super_admin') {
          redirectPath = '/admin/dashboard';
        } else if (user.role === 'store_owner' && user.storeId) {
          redirectPath = `/store/${user.storeId}/dashboard`;
        } else if (user.role === 'user') {
          redirectPath = '/profile'; // Individual users go to profile page
        } else if (from === '/dashboard') {
          redirectPath = '/'; // Redirect to home if trying to access dashboard without proper role
        }

        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1000);
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.identifier.trim() && formData.password.length >= 6;

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-800">Welcome Back</h2>
          <p className="text-secondary-600 mt-2">
            Sign in to your Bazzarly account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Email/Phone Input */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Email or Phone Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={(e) => handleChange('identifier', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email or phone number"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-secondary-600">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link 
              to="/register" 
              className="w-full btn-secondary inline-block text-center"
            >
              Create New Account
            </Link>
          </div>

          {/* Quick Login Options (Demo) */}
          <div className="mt-6">
            <div className="text-center text-sm text-secondary-500 mb-3">
              Quick Demo Login
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    identifier: 'admin@bazzarly.com',
                    password: 'admin123',
                    rememberMe: false
                  });
                }}
                className="w-full px-4 py-2 text-xs bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition-colors"
              >
                Demo Admin Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    identifier: 'store@bazzarly.com',
                    password: 'store123',
                    rememberMe: false
                  });
                }}
                className="w-full px-4 py-2 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                Demo Store Owner Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    identifier: 'user@bazzarly.com',
                    password: 'user123',
                    rememberMe: false
                  });
                }}
                className="w-full px-4 py-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
              >
                Demo User Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4 text-sm text-secondary-500">
            <Link to="/terms" className="hover:text-secondary-700">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-secondary-700">Privacy</Link>
            <span>•</span>
            <Link to="/help" className="hover:text-secondary-700">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 