import React, { useState } from 'react';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://platform-analyzer-backend.onrender.com';

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      // For Supabase, redirect to Google OAuth
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (err) {
      setError('Google authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (isSignUp && !formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      
      console.log(`Attempting ${isSignUp ? 'signup' : 'login'} for:`, formData.email);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        if (data.needs_verification) {
          // Email verification required
          alert('✅ Account created! Please check your email to verify your account before signing in.');
          setIsSignUp(false); // Switch to sign in mode
          setFormData({ name: '', email: formData.email, password: '' });
        } else if (data.token) {
          // Successful auth with token
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          onAuthSuccess(data.user);
          onClose();
          
          if (data.message) {
            console.log(data.message);
          }
        } else {
          setError('Authentication completed but no token received. Please try signing in.');
        }
      } else {
        // Error response
        setError(data.detail || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-6 animate-slide-up border-4 border-purple-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center transform rotate-12">
            <Lock className="w-7 h-7 text-white transform -rotate-12" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Sign up to unlock full analysis' : 'Sign in to view complete analysis'}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full mb-4 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg text-sm"
          title="Google OAuth needs to be configured in Supabase"
        >
          <Chrome className="w-5 h-5 text-blue-600" />
          Continue with Google
        </button>

        <div className="text-xs text-gray-500 text-center mb-4">
          Note: Google sign-in requires additional setup
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-sm"
                  placeholder="John Doe"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        {/* Toggle Sign Up/Sign In */}
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Features List - Compact */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">What you'll get:</p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-sm">✓</span>
              Full detailed analysis results
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-sm">✓</span>
              AI-powered insights
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-sm">✓</span>
              Access to user reviews
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;