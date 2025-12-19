import React, { useEffect, useState, useRef } from 'react';
import { Activity, Shield, TrendingUp, Users, Sparkles, Quote, Briefcase, XCircle } from 'lucide-react';

type StatKey = 'websitesAnalyzed' | 'jobsVerified' | 'scamsDetected' | 'usersProtected';

interface Stats {
  websitesAnalyzed: number;
  jobsVerified: number;
  scamsDetected: number;
  usersProtected: number;
}

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

const defaultStats: Stats = {
  websitesAnalyzed: 10000,
  jobsVerified: 5000,
  scamsDetected: 2500,
  usersProtected: 120000,
};

const testimonials: Testimonial[] = [
  {
    quote: 'Platform Analyzer helped our team avoid a high‑risk vendor in minutes.',
    author: 'Alex P.',
    role: 'Security Lead',
  },
  {
    quote: 'The job offer checker caught subtle red flags I would have missed.',
    author: 'Maria L.',
    role: 'Job Seeker',
  },
  {
    quote: 'We use it before every big investment decision. Huge peace of mind.',
    author: 'James K.',
    role: 'Retail Investor',
  },
];

// Format numbers as 10K, 1.5M, etc.
const formatCompact = (value: number): string => {
  try {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    // Fallback for environments without Intl support
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return String(value);
  }
};

const refreshIntervalMs = 5 * 60 * 1000; // 5 minutes

const DynamicStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true); // initial load only
  const [refreshing, setRefreshing] = useState(false); // periodic refresh indicator
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialPausedRef = useRef(false);

  // Simulated fetch – you can replace this with a real API call later.
  const fetchStats = async (): Promise<Stats> => {
    // TODO: Replace with real backend endpoint when available.
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Slightly vary numbers to make refresh feel alive.
    const jitter = (base: number, key: StatKey): number => {
      const delta = key === 'scamsDetected' ? 5 : 25;
      return base + Math.floor(Math.random() * delta);
    };

    return {
      websitesAnalyzed: jitter(defaultStats.websitesAnalyzed, 'websitesAnalyzed'),
      jobsVerified: jitter(defaultStats.jobsVerified, 'jobsVerified'),
      scamsDetected: jitter(defaultStats.scamsDetected, 'scamsDetected'),
      usersProtected: jitter(defaultStats.usersProtected, 'usersProtected'),
    };
  };

  useEffect(() => {
    let isMounted = true;

    const load = async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);
        const data = await fetchStats();
        if (!isMounted) return;
        setStats(data);
        setLastUpdated(new Date());
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load stats.');
      } finally {
        if (!isMounted) return;
        if (isInitial) setLoading(false);
        else setRefreshing(false);
      }
    };

    load(true);

    const intervalId = window.setInterval(() => load(false), refreshIntervalMs);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  // Rotating testimonials
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (testimonialPausedRef.current) return;
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, []);

  const current = testimonials[currentTestimonial];

  return (
    <section className="mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[3fr,2fr] items-stretch">
          {/* Stats Panel */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-24 -right-16 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 -left-20 w-80 h-80 bg-black/30 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/70 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Live Platform Stats
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Protection you can measure.
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{loading ? 'Updating…' : 'Auto‑refresh every 5 min'}</span>
              </div>
            </div>

            {error && (
              <div className="relative z-10 mb-6 rounded-2xl bg-red-500/20 border border-red-300/60 px-4 py-3 text-sm flex items-start gap-3">
                <XCircle className="w-4 h-4 mt-0.5 text-red-100" />
                <div>
                  <p className="font-semibold">Unable to load latest stats</p>
                  <p className="text-red-50/90">{error}</p>
                </div>
              </div>
            )}

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {(['websitesAnalyzed', 'jobsVerified', 'scamsDetected', 'usersProtected'] as StatKey[]).map(
                (key) => {
                  const value = stats?.[key] ?? defaultStats[key];
                  const labelMap: Record<StatKey, string> = {
                    websitesAnalyzed: 'Websites Analyzed',
                    jobsVerified: 'Jobs Verified',
                    scamsDetected: 'Scams Detected',
                    usersProtected: 'Users Protected',
                  };

                  const IconMap: Record<StatKey, React.ComponentType<any>> = {
                    websitesAnalyzed: Shield,
                    jobsVerified: BriefcaseIcon,
                    scamsDetected: TrendingUp,
                    usersProtected: Users,
                  };

                  const Icon = IconMap[key];

                  return (
                    <div
                      key={key}
                      className="rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-4 sm:px-5 sm:py-5 border border-white/15 shadow-lg flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                          {labelMap[key]}
                        </span>
                        <Icon className="w-4 h-4 text-white/80" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold">
                        {loading ? (
                          <span className="inline-flex animate-pulse text-white/70">—</span>
                        ) : (
                          formatCompact(value)
                        )}
                      </div>
                      <span className="text-[0.7rem] text-white/60">
                        {key === 'scamsDetected'
                          ? 'Flagged as high‑risk or fraudulent'
                          : 'Analyzed with AI‑powered heuristics'}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Stats refresh automatically every 5 minutes.</span>
              </div>
              {lastUpdated && (
                <span>
                  Last updated:{' '}
                  {lastUpdated.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
          </div>

          <div
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-7 sm:p-8 flex flex-col justify-between"
            onMouseEnter={() => (testimonialPausedRef.current = true)}
            onMouseLeave={() => (testimonialPausedRef.current = false)}
            onFocus={() => (testimonialPausedRef.current = true)}
            onBlur={() => (testimonialPausedRef.current = false)}
          >
            {/* Testimonial Panel */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Real user stories
                </p>
                <h3 className="text-lg font-bold text-slate-900">Trusted by cautious users worldwide</h3>
              </div>
            </div>

            <div className="relative flex-1 flex items-center">
              <div className="absolute -top-2 -left-1 text-indigo-100">
                <Quote className="w-10 h-10" />
              </div>
              <div className="relative pl-6">
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed">
                  “{current.quote}”
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900">{current.author}</p>
                  {current.role && (
                    <p className="text-xs text-slate-500">{current.role}</p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-300'
                      }`}
                      aria-label={`Show testimonial ${index + 1}`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple Briefcase icon using lucide-react "Briefcase" without importing entire set again.
const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Briefcase width={16} height={16} {...props} />
);

export default DynamicStats;


