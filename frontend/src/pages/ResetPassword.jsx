import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ResetPassword({ setActivePage, resetToken = '' }) {
  const { resetPassword } = useAuth();
  const [token, setToken] = useState(resetToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = useMemo(() => {
    if (!newPassword) return { label: '', color: '', percent: 0 };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500 text-red-400', percent: 33 };
    if (score === 2 || score === 3) return { label: 'Medium', color: 'bg-amber-500 text-amber-400', percent: 66 };
    return { label: 'Strong', color: 'bg-emerald-500 text-emerald-400', percent: 100 };
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) { setError('Reset token is required'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters long'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }

    setSubmitting(true);
    try {
      const res = await resetPassword({ token, newPassword, confirmPassword });
      setMessage(res.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl border border-slate-800 max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400">
            Set a new secure password for your account.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-200 font-bold">{message}</p>
            <button
              onClick={() => setActivePage('login')}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl transition-all"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reset Security Token *
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter reset token from email"
                className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl px-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-10 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-bold ${passwordStrength.color.split(' ')[1]}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color.split(' ')[0]}`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <span>Resetting Password...</span> : <span>[Reset Password]</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
