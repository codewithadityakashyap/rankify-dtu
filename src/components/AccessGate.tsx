'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, ArrowRight, Loader2, CheckCircle2, UserCircle, Calculator } from 'lucide-react';

export default function AccessGate() {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [showGate, setShowGate] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [sgpa, setSgpa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localStorage.getItem('dtu_auth_v4') === 'true') {
          return;
        }
        const res = await fetch('/api/auth/check?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        
        if (!data.authorized) {
          setIsAuthorized(false);
          setTimeout(() => {
            setShowGate(true);
            document.body.style.overflow = 'hidden';
          }, 30000);
        } else {
          localStorage.setItem('dtu_auth_v4', 'true');
        }
      } catch (err) {
        console.error('Failed to verify access:', err);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber, sgpa }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        localStorage.setItem('dtu_auth_v4', 'true');
        setTimeout(() => {
          setShowGate(false);
          setIsAuthorized(true);
          document.body.style.overflow = 'unset';
        }, 1500);
      } else {
        setError(data.error || 'Verification Failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showGate) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white mb-6">
            {success ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Lock className="w-8 h-8" />}
          </div>
          
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2">
            {success ? 'Access Granted' : 'Session Expired'}
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed text-sm">
            {success 
              ? 'Your device has been securely authorized. Redirecting...'
              : 'Please verify your DTU identity to continue.'}
          </p>

          {!success && (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="relative flex items-center">
                <UserCircle className="w-5 h-5 absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Roll number (e.g. 24/CS/101)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative flex items-center mb-2">
                <Calculator className="w-5 h-5 absolute left-4 text-slate-400" />
                <input
                  type="number"
                  step="0.01"
                  value={sgpa}
                  onChange={(e) => setSgpa(e.target.value)}
                  placeholder="Latest SGPA (e.g. 8.42)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1.5 text-red-500 text-xs font-semibold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !rollNumber || !sgpa}
                className="w-full bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify Identity
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
