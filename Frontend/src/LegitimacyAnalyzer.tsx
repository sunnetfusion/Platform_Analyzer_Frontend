// src/LegitimacyAnalyzer.tsx
import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Calendar, Shield, Users, TrendingDown, Database, Globe, Image, DollarSign, FileText, Activity, Sparkles, Zap, Lock } from 'lucide-react';
import CommentsSection from './CommentsSection';
import AuthModal from './AuthModal';

interface LegitimacyAnalyzerProps {
  sharedUser?: any;
  onAuthSuccess?: (user: any) => void;
  onLogout?: () => void;
}

interface AnalysisStep {
  icon: React.ComponentType<any>;
  label: string;
  delay: number;
}

interface Finding {
  type: 'critical' | 'warning' | 'info';
  text: string;
}

interface WHOISData {
  registrar: string;
  owner: string;
  email: string;
  lastUpdated: string;
}

interface ContentAnalysis {
  aboutUsFound: boolean;
  termsOfServiceFound: boolean;
  contactInfoFound: boolean;
  physicalAddressFound: boolean;
  teamPhotosAnalyzed: boolean;
  stockImagesDetected: boolean;
}

interface SocialData {
  redditMentions: number;
  twitterMentions: number;
  trustpilotScore: number;
  scamAdvisorScore: number;
}

interface PonziCalculation {
  promisedReturn: string;
  yearlyEquivalent: string;
  sustainability: string;
  collapseDays: string;
}

interface AnalysisResult {
  url: string;
  trustScore: number;
  verdict: string;
  domainAge: string;
  domainRegistered: string;
  sslStatus: string;
  serverLocation: string;
  whoisData: WHOISData;
  contentAnalysis: ContentAnalysis;
  socialData: SocialData;
  withdrawalComplaints: number;
  findings: Finding[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  redFlags: string[];
  ponziCalculation: PonziCalculation | null;
  scamProbability: string;
  recommendation: string;
  aiAnalysis?: string;
  peopleExperience?: {
    experienceScore: number;
    userExperienceRating: string;
    hasTestimonials: boolean;
    hasSocialProof: boolean;
    hasSupport: boolean;
  };
}

const LegitimacyAnalyzer: React.FC<LegitimacyAnalyzerProps> = ({ 
  sharedUser, 
  onAuthSuccess, 
  onLogout: propOnLogout 
}) => {
  const [url, setUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(sharedUser || null);
  const [hasScrolledToResults, setHasScrolledToResults] = useState(false);
  
  const API_BASE_URL = 'https://platform-analyzer-backend.onrender.com';

  const testimonials = [
    { text: "This tool saved me from losing $5,000 to a fake investment platform!", author: "Sarah M.", rating: 5 },
    { text: "Detected a Ponzi scheme in seconds. Absolutely incredible AI analysis!", author: "Michael R.", rating: 5 },
    { text: "The best scam detection tool I've ever used. Highly recommended!", author: "Jennifer L.", rating: 5 },
    { text: "Caught red flags I completely missed. This platform is a lifesaver!", author: "David K.", rating: 5 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sharedUser) {
      setUser(sharedUser);
      return;
    }

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
      })
      .catch(error => {
        console.log('Auth verification failed:', error);
        setUser(null);
      });
    }
  }, [sharedUser]);

  useEffect(() => {
    if (!result || user || hasScrolledToResults) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const trustScoreElement = document.getElementById('trust-score-section');
      
      if (trustScoreElement) {
        const elementPosition = trustScoreElement.offsetTop;
        
        if (scrollPosition > elementPosition + 400 && !user) {
          setShowAuthModal(true);
          setHasScrolledToResults(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [result, user, hasScrolledToResults]);

  const handleAuthSuccess = (authUser: any) => {
    setUser(authUser);
    setShowAuthModal(false);
    if (onAuthSuccess) {
      onAuthSuccess(authUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setResult(null);
    if (propOnLogout) {
      propOnLogout();
    }
  };

  const analyzeWebsite = async () => {
    if (!url) return;
    
    setAnalyzing(true);
    setAnalysisSteps([]);
    setResult(null);
    setError(null);
    
    const steps: AnalysisStep[] = [
      { icon: Globe, label: 'Performing WHOIS lookup...', delay: 500 },
      { icon: Shield, label: 'Checking SSL certificate...', delay: 700 },
      { icon: Database, label: 'Analyzing domain history...', delay: 900 },
      { icon: Image, label: 'Scanning for stock images...', delay: 1100 },
      { icon: Users, label: 'Scraping social media mentions...', delay: 1300 },
      { icon: FileText, label: 'Extracting website content...', delay: 1500 },
      { icon: Activity, label: 'Running AI sentiment analysis...', delay: 1700 },
      { icon: DollarSign, label: 'Calculating financial viability...', delay: 1900 }
    ];
    
    const stepPromises = steps.map((step, index) => 
      new Promise<void>(resolve => setTimeout(() => {
        setAnalysisSteps(prev => [...prev, step]);
        resolve();
      }, step.delay))
    );
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });
      
      await Promise.all(stepPromises);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data: AnalysisResult = await response.json();
      
      setResult(data);
      setAnalyzing(false);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze website. Please check if the backend is running and the URL is correct.');
      setAnalyzing(false);
      setAnalysisSteps([]);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'from-emerald-500 to-green-600';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getVerdictColor = (verdict: string): string => {
    if (verdict === 'Legit') return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-400';
    if (verdict === 'Caution') return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400';
  };

  const getFindingIcon = (type: 'critical' | 'warning' | 'info') => {
    if (type === 'critical') return <XCircle className="w-5 h-5 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-blue-500" />;
  };

  const resultAsAny = result as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-600 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Platform Legitimacy Analyzer
            </h1>
          </div>
          <p className="text-slate-700 text-xl font-medium flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI-Powered Scam Detection & Trust Verification
            <Zap className="w-5 h-5 text-yellow-500" />
          </p>
          
          {user && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="bg-white/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-purple-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <span className="font-semibold text-gray-700">{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold ml-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-white/20 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="Enter platform URL (e.g., https://example.com)"
                className="w-full px-6 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all text-lg"
                onKeyPress={(e) => e.key === 'Enter' && analyzeWebsite()}
              />
            </div>
            <button
              onClick={analyzeWebsite}
              disabled={analyzing || !url}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            >
              {analyzing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-800 font-bold text-lg mb-2">Analysis Failed</h3>
                <p className="text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Make sure the backend server is running on {API_BASE_URL}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {analyzing && analysisSteps.length > 0 && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
              Analysis in Progress...
            </h3>
            <div className="space-y-3">
              {analysisSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg animate-slide-in-left" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <step.icon className="w-6 h-6 text-purple-600 animate-bounce" />
                  <span className="font-medium">{step.label}</span>
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto animate-ping" />
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-fade-in-up">
            <div id="trust-score-section" className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-200 transform hover:scale-[1.01] transition-all">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Trust Score</h2>
                  <p className="text-slate-600 font-medium">{result.url}</p>
                </div>
                <div className="text-center">
                  <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreColor(result.trustScore)} bg-clip-text text-transparent animate-pulse`}>
                    {result.trustScore}
                  </div>
                  <div className="text-slate-500 text-sm font-semibold">out of 100</div>
                </div>
              </div>
              
              <div className={`inline-block px-6 py-3 rounded-xl border-2 font-bold text-lg shadow-lg transform hover:scale-105 transition-all ${getVerdictColor(result.verdict)}`}>
                {result.verdict}
              </div>
            </div>

            <div className={!user ? 'relative' : ''}>
              {!user && (
                <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-white/30 rounded-2xl">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center border-4 border-purple-300">
                    <Lock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Sign In to View Full Analysis
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create a free account to access detailed results, AI insights, and more!
                    </p>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 hover:rotate-1 transition-all">
                <Calendar className="w-8 h-8 mb-3 animate-bounce" />
                <h3 className="font-bold text-lg mb-2">Domain Age</h3>
                <p className="text-3xl font-bold">{result.domainAge}</p>
                <p className="text-sm opacity-90 mt-1">Registered: {result.domainRegistered}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 hover:rotate-1 transition-all">
                <Shield className="w-8 h-8 mb-3 animate-pulse" />
                <h3 className="font-bold text-lg mb-2">Security</h3>
                <p className="text-sm font-medium">{result.sslStatus}</p>
                <p className="text-sm opacity-90 mt-1">Server: {result.serverLocation}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 hover:rotate-1 transition-all">
                <Shield className="w-8 h-8 mb-3 animate-pulse" />
                <h3 className="font-bold text-lg mb-2">Threat Status</h3>
                <p className="text-2xl font-bold">
                  {result.scamProbability === "CRITICAL - 100%" ? "🚨 DANGER" : 
                   result.trustScore >= 70 ? "✅ Clean" : 
                   result.trustScore >= 40 ? "⚠️ Caution" : "🔴 High Risk"}
                </p>
                <p className="text-sm opacity-90 mt-1">Malware Scan Complete</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 hover:rotate-1 transition-all">
                <TrendingDown className="w-8 h-8 mb-3 animate-pulse" />
                <h3 className="font-bold text-lg mb-2">Risk Level</h3>
                <p className="text-3xl font-bold">{result.scamProbability}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  What Our Users Say
                  <Sparkles className="w-6 h-6" />
                </h3>
                <div className="transition-all duration-500 transform">
                  <p className="text-xl italic mb-4 text-center">"{testimonials[currentTestimonial].text}"</p>
                  <p className="text-center font-semibold">— {testimonials[currentTestimonial].author}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <span key={i} className="text-yellow-300 text-2xl">★</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-all ${idx === currentTestimonial ? 'bg-white w-8' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {result.aiAnalysis && (
              <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                    </div>
                    🤖 AI-Powered Analysis
                    <span className="text-sm bg-yellow-400 text-purple-900 px-3 py-1 rounded-full font-bold">
                      Powered by Groq
                    </span>
                  </h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {result.aiAnalysis}
                    </p>
                  </div>
                  <div className="mt-4 text-sm opacity-75 text-center">
                    ⚡ Advanced AI analysis using Llama 3.3 70B model
                  </div>
                </div>
              </div>
            )}

            {resultAsAny.peopleExperience && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  People Discovery & Experience Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4">User Experience Rating</h4>
                    <div className="text-4xl font-bold mb-2">
                      {resultAsAny.peopleExperience.experienceScore || 50}/100
                    </div>
                    <p className="text-sm opacity-90">
                      Rating: {resultAsAny.peopleExperience.userExperienceRating || 'Fair'}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4">Experience Indicators</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {resultAsAny.peopleExperience.hasTestimonials ? (
                          <CheckCircle className="w-5 h-5 text-green-300" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-300" />
                        )}
                        <span>User Testimonials Found</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {resultAsAny.peopleExperience.hasSocialProof ? (
                          <CheckCircle className="w-5 h-5 text-green-300" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-300" />
                        )}
                        <span>Social Proof Indicators</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {resultAsAny.peopleExperience.hasSupport ? (
                          <CheckCircle className="w-5 h-5 text-green-300" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-300" />
                        )}
                        <span>Customer Support Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-purple-200">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Security Analysis & Key Findings
              </h3>
              
              {result.trustScore === 0 && (
                <div className="mb-6 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl p-6 border-4 border-red-800 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">🚨</div>
                    <div>
                      <h4 className="text-2xl font-bold mb-2">CRITICAL SECURITY THREAT DETECTED</h4>
                      <p className="text-lg">This website has been flagged as malicious. Close this page immediately!</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {result.findings.map((finding, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-4 rounded-xl hover:shadow-md transition-all ${
                    finding.type === 'critical' ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300' :
                    finding.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-orange-50' :
                    'bg-gradient-to-r from-slate-50 to-purple-50'
                  }`}>
                    {getFindingIcon(finding.type as 'critical' | 'warning' | 'info')}
                    <span className={`font-medium ${
                      finding.type === 'critical' ? 'text-red-800' :
                      finding.type === 'warning' ? 'text-orange-800' :
                      'text-slate-700'
                    }`}>{finding.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl p-8 shadow-2xl transform hover:scale-[1.02] transition-all ${
              result.trustScore === 0 ? 'bg-gradient-to-r from-red-900 to-rose-900' :
              result.verdict === 'Scam' ? 'bg-gradient-to-r from-red-800 to-rose-800' :
              'bg-gradient-to-r from-slate-900 to-purple-900'
            } text-white`}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {result.trustScore === 0 ? (
                  <>
                    <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                    🚨 CRITICAL SECURITY WARNING
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Final Recommendation
                  </>
                )}
              </h3>
              <p className="text-xl leading-relaxed">{result.recommendation}</p>
              
              {result.trustScore === 0 && (
                <div className="mt-6 p-4 bg-red-800 rounded-lg border-2 border-red-600">
                  <p className="font-bold text-lg">⚠️ DO NOT:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Enter any passwords or personal information</li>
                    <li>Download any files from this site</li>
                    <li>Click any links on this page</li>
                    <li>Make any payments or provide financial details</li>
                  </ul>
                </div>
              )}
            </div>
    
            <CommentsSection url={result.url} />
            </div>
          </div>
        )}
    
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
    
        {!result && !analyzing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[
              { icon: Shield, title: 'Malware Detection', desc: 'Google Safe Browsing protection against phishing & malware', color: 'from-red-500 to-rose-500' },
              { icon: AlertTriangle, title: 'Pattern Analysis', desc: 'Detects typosquatting, suspicious TLDs, and phishing patterns', color: 'from-orange-500 to-red-500' },
              { icon: Calendar, title: 'Domain Analysis', desc: 'Check registration date and ownership history', color: 'from-blue-500 to-cyan-500' },
              { icon: Users, title: 'User Reviews', desc: 'Community-driven trust signals and scam reports', color: 'from-purple-500 to-pink-500' }
            ].map((feature, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${feature.color} rounded-2xl shadow-xl p-6 text-white text-center transform hover:scale-105 hover:rotate-1 transition-all cursor-pointer`}>
                <feature.icon className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LegitimacyAnalyzer;