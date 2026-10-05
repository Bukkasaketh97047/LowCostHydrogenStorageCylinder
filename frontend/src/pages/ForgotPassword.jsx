import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ setActivePage }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Request failed');
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
            Forgot Password?
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Password recovery is not configured in this academic prototype.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto" />
            <p className="text-xs text-slate-200 leading-relaxed">{message}</p>
            <button
              onClick={() => setActivePage('login')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="student@hydrogen.edu"
                  className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:border-cyan-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <span>Sending Link...</span> : <span>[Send Reset Link]</span>}
            </button>

            <button
              type="button"
              onClick={() => setActivePage('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-200 pt-2"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
