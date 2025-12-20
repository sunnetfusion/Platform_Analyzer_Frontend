import React, { useState, useEffect } from 'react';
import { Globe, Briefcase, Shield, Menu, X } from 'lucide-react';
import LegitimacyAnalyzer from './LegitimacyAnalyzer.tsx';
import JobAnalyzer from './JobAnalyzer.tsx';
import DynamicStats from './DynamicStats.tsx';

type ServiceType = 'website' | 'job';

const App: React.FC = () => {
  const [activeService, setActiveService] = useState<ServiceType>('website');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  const API_BASE_URL = 'https://platform-analyzer-backend.onrender.com';

  // Check authentication on mount (SHARED ACROSS ALL FEATURES)
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      fetch(`${API_BASE_URL}/auth/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          throw new Error('Invalid token');
        }
      })
      .then(data => {
        setUser(data.user);
        setAuthChecked(true);
      })
      .catch(error => {
        console.log('Auth verification failed:', error);
        setUser(null);
        setAuthChecked(true);
      });
    } else {
      setAuthChecked(true);
    }
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (authUser: any) => {
    setUser(authUser);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const services = [
    {
      id: 'website' as ServiceType,
      name: 'Website Analyzer',
      icon: Globe,
      description: 'Check website legitimacy & detect scams',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'job' as ServiceType,
      name: 'Job Offer Analyzer',
      icon: Briefcase,
      description: 'Verify job postings & spot fake recruiters',
      color: 'from-indigo-600 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Navigation */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="w-10 h-10 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Platform Analyzer
                </h1>
                <p className="text-xs text-gray-500 font-medium">AI-Powered Scam Detection</p>
              </div>
            </div>

            {/* User Info & Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* User Badge */}
              {user && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 border-2 border-indigo-200 flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{user.name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold ml-1"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Service Tabs */}
              <nav className="flex items-center gap-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isActive = activeService === service.id;
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service.id)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        isActive
                          ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{service.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-slide-down">
              {/* User Info Mobile */}
              {user && (
                <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 py-3 border-2 border-indigo-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{user.name || user.email}</p>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Tabs Mobile */}
              <div className="space-y-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isActive = activeService === service.id;
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => {
                        setActiveService(service.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <div>{service.name}</div>
                        <div className="text-xs opacity-90">{service.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Service Cards (visible when no service selected - for better UX) */}
      {!activeService && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Choose Your Service
            </h2>
            <p className="text-xl text-gray-600">
              Select a service to start analyzing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon;
              
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`bg-gradient-to-br ${service.color} rounded-3xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all hover:shadow-3xl`}
                >
                  <Icon className="w-20 h-20 mx-auto mb-6 animate-bounce" />
                  <h3 className="text-3xl font-bold mb-4">{service.name}</h3>
                  <p className="text-lg opacity-90 mb-6">{service.description}</p>
                  <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all">
                    Get Started →
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Service Content - Pass shared auth state */}
      <main>
        {activeService === 'website' && (
          <LegitimacyAnalyzer 
            sharedUser={user} 
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
          />
        )}
        {activeService === 'job' && (
          <JobAnalyzer 
            sharedUser={user} 
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Global dynamic stats & testimonials */}
      <DynamicStats />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Platform Analyzer
              </h3>
              <p className="text-sm text-gray-300">
                AI-powered scam detection to protect you from online fraud.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">Services</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Website Legitimacy Check</li>
                <li>• Job Offer Verification</li>
                <li>• Email Domain Analysis</li>
                <li>• Red Flag Detection</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                  <span>Websites Analyzed</span>
                  <span className="font-bold text-green-400">10,000+</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                  <span>Jobs Verified</span>
                  <span className="font-bold text-blue-400">5,000+</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                  <span>Scams Detected</span>
                  <span className="font-bold text-red-400">2,500+</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2025 Platform Analyzer. Built with AI to keep you safe online.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;