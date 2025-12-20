import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Briefcase, Mail, DollarSign, Building, Link as LinkIcon, Shield, FileText, Activity, Sparkles, TrendingUp, Lock } from 'lucide-react';
import AuthModal from './AuthModal';

interface Finding {
  type: 'critical' | 'warning' | 'info';
  text: string;
}

interface RedFlag {
  type: 'critical' | 'warning';
  category: string;
  text: string;
}

interface JobAnalysisResult {
  trustScore: number;
  verdict: string;
  riskLevel: string;
  recommendation: string;
  findings: Finding[];
  aiAnalysis?: string;
  aiEnhanced?: boolean;
  emailAnalysis: {
    email: string;
    isCorporate: boolean;
    domain: string;
    provider: string;
    risk: string;
  };
  salaryAnalysis: {
    providedSalary: string;
    isReasonable: boolean;
    assessment: string;
    yearlyEquivalent: string;
    risk: string;
  };
  companyVerification: {
    companyName: string;
    hasWebsite: boolean;
    legitimacyScore: number;
  };
  platformAnalysis: {
    jobUrl: string;
    isLegitimate: boolean;
    platform: string;
    trustLevel: string;
  };
  redFlags: RedFlag[];
  totalRedFlags: number;
  criticalFlags: number;
}

interface JobAnalyzerProps {
  sharedUser?: any;
  onAuthSuccess?: (user: any) => void;
  onLogout?: () => void;
}

const JobAnalyzer: React.FC<JobAnalyzerProps> = ({ 
  sharedUser, 
  onAuthSuccess, 
  onLogout: propOnLogout 
}) => {
  const [user, setUser] = useState<any>(sharedUser || null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasScrolledToResults, setHasScrolledToResults] = useState(false);
  
  const [formData, setFormData] = useState({
    job_url: '',
    job_description: '',
    company_name: '',
    salary: '',
    recruiter_email: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);

  const API_BASE_URL = 'https://platform-analyzer-backend.onrender.com';

  // Sync with shared user prop
  useEffect(() => {
    if (sharedUser) {
      setUser(sharedUser);
    }
  }, [sharedUser]);

  // Handle scroll to show auth modal
  useEffect(() => {
    if (!result || user || hasScrolledToResults) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const trustScoreElement = document.getElementById('job-trust-score-section');
      
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
    setFormData({ job_url: '', job_description: '', company_name: '', salary: '', recruiter_email: '' });
    if (propOnLogout) {
      propOnLogout();
    }
  };

  const analyzeJob = async () => {
    if (!formData.job_url && !formData.job_description) {
      setError('Please provide either a job URL or job description');
      return;
    }

    setAnalyzing(true);
    setAnalysisSteps([]);
    setResult(null);
    setError(null);
    setHasScrolledToResults(false);

    const steps = [
      'Scraping job posting details...',
      'Analyzing recruiter email...',
      'Checking job platform legitimacy...',
      'Scanning for red flag keywords...',
      'Verifying salary reasonableness...',
      'Checking company online presence...',
      'Running AI fraud detection...',
      'Calculating trust score...'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisSteps(prev => [...prev, step]);
      }, index * 500);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: JobAnalysisResult = await response.json();
      await new Promise(resolve => setTimeout(resolve, steps.length * 500 + 500));
      setResult(data);
      setAnalyzing(false);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze job posting. Please check if the backend is running.');
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
    if (verdict === 'Likely Legitimate') return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-400';
    if (verdict === 'Possibly Suspicious') return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400';
  };

  const getFindingIcon = (type: 'critical' | 'warning' | 'info') => {
    if (type === 'critical') return <XCircle className="w-5 h-5 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-blue-500" />;
  };

  const getRiskBadgeColor = (risk: string): string => {
    if (risk === 'Low' || risk === 'Low Risk') return 'bg-green-100 text-green-800 border-green-300';
    if (risk === 'Medium' || risk === 'Medium Risk') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (risk === 'High' || risk === 'High Risk' || risk === 'Critical') return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Briefcase className="w-16 h-16 text-indigo-600 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Job Offer Analyzer
            </h1>
          </div>
          <p className="text-slate-700 text-xl font-medium">
            🔍 Detect Fake Jobs, Scams & Fraudulent Recruiters with AI
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-white/20">
          <div className="space-y-4">
            {/* Job URL - PRIMARY INPUT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Job Posting URL (LinkedIn, Indeed, etc.) - Just paste the link!
              </label>
              <input
                type="text"
                value={formData.job_url}
                onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                placeholder="https://www.linkedin.com/jobs/view/..."
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                ✨ AI will automatically extract company name, salary, email, and description from the URL
              </p>
            </div>

            {/* Optional Fields */}
            <details className="border border-gray-200 rounded-xl p-4">
              <summary className="cursor-pointer font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Optional: Provide Additional Details (Or let AI extract them)
              </summary>
              
              <div className="mt-4 space-y-4">
                {/* Job Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={formData.job_description}
                    onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                    placeholder="Paste job description here (optional if URL provided)"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                  />
                </div>

                {/* Company Name & Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="ABC Corporation"
                      className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Salary Offered
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="$80,000/year or $5,000/week"
                      className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                    />
                  </div>
                </div>

                {/* Recruiter Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Recruiter Email
                  </label>
                  <input
                    type="email"
                    value={formData.recruiter_email}
                    onChange={(e) => setFormData({ ...formData, recruiter_email: e.target.value })}
                    placeholder="recruiter@company.com"
                    className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>
            </details>

            {/* Analyze Button */}
            <button
              onClick={analyzeJob}
              disabled={analyzing || (!formData.job_url && !formData.job_description)}
              className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {analyzing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Job with AI...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Analyze Job Offer with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-800 font-bold text-lg mb-2">Analysis Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Analysis Steps */}
        {analyzing && analysisSteps.length > 0 && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-indigo-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600 animate-pulse" />
              AI Analysis in Progress...
            </h3>
            <div className="space-y-3">
              {analysisSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-700 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg animate-slide-in-left">
                  <Activity className="w-5 h-5 text-indigo-600 animate-spin" />
                  <span className="font-medium">{step}</span>
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Trust Score Card */}
            <div id="job-trust-score-section" className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-indigo-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Job Legitimacy Score
                  </h2>
                  <p className="text-slate-600 font-medium">AI-Powered Scam Detection Analysis</p>
                </div>
                <div className="text-center">
                  <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreColor(result.trustScore)} bg-clip-text text-transparent animate-pulse`}>
                    {result.trustScore}
                  </div>
                  <div className="text-slate-500 text-sm font-semibold">out of 100</div>
                </div>
              </div>

              <div className={`inline-block px-6 py-3 rounded-xl border-2 font-bold text-lg shadow-lg ${getVerdictColor(result.verdict)}`}>
                {result.verdict}
              </div>

              <div className="mt-4">
                <span className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold ${getRiskBadgeColor(result.riskLevel)}`}>
                  Risk Level: {result.riskLevel}
                </span>
              </div>
            </div>

            {/* AUTH OVERLAY FOR DETAILED RESULTS */}
            <div className={!user ? 'relative' : ''}>
              {!user && (
                <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-white/30 rounded-2xl">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center border-4 border-indigo-300">
                    <Lock className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Sign In to View Full Job Analysis
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create a free account to access detailed AI insights, red flag analysis, and more!
                    </p>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* Critical Warning Banner */}
              {result.criticalFlags > 0 && (
                <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-6 border-4 border-red-800 animate-pulse mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">🚨</div>
                    <div>
                      <h4 className="text-2xl font-bold mb-2">CRITICAL WARNING DETECTED</h4>
                      <p className="text-lg">{result.criticalFlags} critical red flag(s) found! This job may be a scam.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Email Analysis */}
                <div className={`bg-gradient-to-br ${result.emailAnalysis.isCorporate ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} rounded-2xl shadow-xl p-6 text-white`}>
                  <Mail className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Recruiter Email</h3>
                  <p className="text-sm mb-2">{result.emailAnalysis.provider}</p>
                  <p className="text-xs opacity-90">{result.emailAnalysis.domain}</p>
                  <div className={`mt-3 px-3 py-1 rounded-lg text-xs font-bold ${getRiskBadgeColor(result.emailAnalysis.risk)}`}>
                    {result.emailAnalysis.risk} Risk
                  </div>
                </div>

                {/* Platform */}
                <div className={`bg-gradient-to-br ${result.platformAnalysis.isLegitimate ? 'from-blue-500 to-cyan-500' : 'from-orange-500 to-red-500'} rounded-2xl shadow-xl p-6 text-white`}>
                  <LinkIcon className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Job Platform</h3>
                  <p className="text-sm mb-2">{result.platformAnalysis.platform}</p>
                  <p className="text-xs opacity-90">Trust: {result.platformAnalysis.trustLevel}</p>
                </div>

                {/* Salary */}
                <div className={`bg-gradient-to-br ${result.salaryAnalysis.isReasonable ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500'} rounded-2xl shadow-xl p-6 text-white`}>
                  <DollarSign className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Salary Check</h3>
                  <p className="text-sm mb-2">{result.salaryAnalysis.yearlyEquivalent}</p>
                  <div className={`mt-3 px-3 py-1 rounded-lg text-xs font-bold ${getRiskBadgeColor(result.salaryAnalysis.risk)}`}>
                    {result.salaryAnalysis.risk} Risk
                  </div>
                </div>

                {/* Red Flags */}
                <div className={`bg-gradient-to-br ${result.totalRedFlags === 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} rounded-2xl shadow-xl p-6 text-white`}>
                  <AlertTriangle className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Red Flags</h3>
                  <p className="text-4xl font-bold">{result.totalRedFlags}</p>
                  <p className="text-xs opacity-90 mt-1">
                    {result.criticalFlags} Critical
                  </p>
                </div>
              </div>

              {/* Detailed Red Flags */}
              {result.redFlags.length > 0 && (
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-red-200 mb-6">
                  <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    Detected Red Flags
                  </h3>
                  <div className="space-y-3">
                    {result.redFlags.map((flag, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border-2 ${
                        flag.type === 'critical' ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'
                      }`}>
                        <div className="flex items-start gap-3">
                          {flag.type === 'critical' ? (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <div className={`text-xs font-bold mb-1 ${
                              flag.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {flag.category.toUpperCase()}
                            </div>
                            <p className={`font-medium ${
                              flag.type === 'critical' ? 'text-red-800' : 'text-yellow-800'
                            }`}>
                              {flag.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis Section */}
              {result.aiAnalysis && (
                <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden mb-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                      </div>
                      🤖 AI-Powered Job Analysis
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
                      ⚡ Advanced AI analysis using Llama 3.3 70B model - Employment fraud detection specialist
                    </div>
                  </div>
                </div>
              )}

              {/* Key Findings */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-indigo-200 mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Analysis Findings
                </h3>
                <div className="space-y-3">
                  {result.findings.map((finding, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-4 rounded-xl ${
                      finding.type === 'critical' ? 'bg-red-50 border-2 border-red-300' :
                      finding.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      {getFindingIcon(finding.type)}
                      <span className={`font-medium flex-1 ${
                        finding.type === 'critical' ? 'text-red-800' :
                        finding.type === 'warning' ? 'text-yellow-800' :
                        'text-blue-800'
                      }`}>
                        {finding.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Verification */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white mb-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  Company Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-2">Company Name</h4>
                    <p className="text-xl">{result.companyVerification.companyName || 'Not provided'}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-2">Legitimacy Score</h4>
                    <p className="text-4xl font-bold">{result.companyVerification.legitimacyScore}/100</p>
                  </div>
                </div>
              </div>

              {/* Final Recommendation */}
              <div className={`rounded-2xl p-8 shadow-2xl text-white ${
                result.trustScore >= 70 ? 'bg-gradient-to-r from-green-700 to-emerald-700' :
                result.trustScore >= 40 ? 'bg-gradient-to-r from-yellow-700 to-orange-700' :
                'bg-gradient-to-r from-red-800 to-rose-800'
              }`}>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-7 h-7" />
                  Final Recommendation
                </h3>
                <p className="text-xl leading-relaxed">{result.recommendation}</p>

                {result.trustScore < 40 && (
                  <div className="mt-6 p-4 bg-red-900/50 rounded-lg border-2 border-red-600">
                    <p className="font-bold text-lg mb-2">⚠️ DO NOT:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Send money or pay any fees upfront</li>
                      <li>Provide sensitive personal information (SSN, bank details)</li>
                      <li>Accept offers without thorough verification</li>
                      <li>Click suspicious links or download attachments</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        {!result && !analyzing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              { icon: Mail, title: 'Email Verification', desc: 'Check if recruiter uses corporate or free email', color: 'from-blue-500 to-cyan-500' },
              { icon: DollarSign, title: 'Salary Analysis', desc: 'Detect suspiciously high or low salary offers', color: 'from-green-500 to-emerald-500' },
              { icon: AlertTriangle, title: 'Red Flag Detection', desc: 'Scan for common job scam keywords and patterns', color: 'from-red-500 to-rose-500' },
              { icon: Building, title: 'Company Verification', desc: 'Verify company legitimacy and online presence', color: 'from-purple-500 to-pink-500' }
            ].map((feature, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${feature.color} rounded-2xl shadow-xl p-6 text-white text-center transform hover:scale-105 transition-all cursor-pointer`}>
                <feature.icon className="w-16 h-16 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <style>{`
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

export default JobAnalyzer;