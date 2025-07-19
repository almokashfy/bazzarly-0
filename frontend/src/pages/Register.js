import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  Store,
  Users
} from 'lucide-react';
import { useFormValidation, validationSchemas } from '../utils/validation';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/Loading';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [userType, setUserType] = useState('individual'); // 'individual' or 'business'

  // Form validation
  const {
    data,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateAll
  } = useFormValidation({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  }, {
    ...validationSchemas.user,
    agreeToTerms: [(value) => value ? null : 'You must agree to the terms and conditions']
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateAll()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: userType === 'business' ? 'store_owner' : 'user'
      };

      const response = await apiService.post('/auth/register', registrationData);

      if (response.success) {
        setSuccess(true);
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to verification page or dashboard
        setTimeout(() => {
          navigate('/verify-account');
        }, 2000);
      }
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-4">
            Registration Successful!
          </h2>
          <p className="text-secondary-600 mb-6">
            We've sent verification codes to your email and phone number. 
            Please verify your account to get started.
          </p>
          <div className="text-center">
            <LoadingSpinner size="sm" />
            <p className="text-sm text-secondary-500 mt-2">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-800">Join Bazzarly</h2>
          <p className="text-secondary-600 mt-2">
            Create your account to start buying and selling
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-medium text-secondary-700 mb-3">Account Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType('individual')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                userType === 'individual'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-200 hover:border-secondary-300'
              }`}
            >
              <Users className={`h-6 w-6 mx-auto mb-2 ${
                userType === 'individual' ? 'text-primary-600' : 'text-secondary-400'
              }`} />
              <p className={`text-sm font-medium ${
                userType === 'individual' ? 'text-primary-600' : 'text-secondary-600'
              }`}>
                Individual
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                Start as a buyer, upgrade to sell later
              </p>
            </button>

            <button
              type="button"
              onClick={() => setUserType('business')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                userType === 'business'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-secondary-200 hover:border-secondary-300'
              }`}
            >
              <Store className={`h-6 w-6 mx-auto mb-2 ${
                userType === 'business' ? 'text-primary-600' : 'text-secondary-400'
              }`} />
              <p className={`text-sm font-medium ${
                userType === 'business' ? 'text-primary-600' : 'text-secondary-600'
              }`}>
                Business
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                Create and manage a store
              </p>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Error */}
            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{apiError}</span>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.firstName && touched.firstName ? 'border-red-500' : 'border-secondary-300'
                    }`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && touched.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                  <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.lastName && touched.lastName ? 'border-red-500' : 'border-secondary-300'
                    }`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && touched.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.email && touched.email ? 'border-red-500' : 'border-secondary-300'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.phone && touched.phone ? 'border-red-500' : 'border-secondary-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.password && touched.password ? 'border-red-500' : 'border-secondary-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={data.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-secondary-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={data.agreeToTerms}
                onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                className="mt-1 mr-3 h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-secondary-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && touched.agreeToTerms && (
              <p className="text-xs text-red-500">{errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 