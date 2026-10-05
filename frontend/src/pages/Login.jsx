import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Login({ setActivePage, redirectAfterLogin }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        setActivePage(redirectAfterLogin || 'dashboard');
      }
    } catch (err) {
      setErrors({ form: err.message || 'Invalid email or password' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl border border-slate-800 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl">
        
        {/* LEFT SIDE: Futuristic Visualizer Hero */}
        <div className="lg:col-span-6 p-8 sm:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Flame className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-100 tracking-tight">
                  HYDRO<span className="text-cyan-400">CYL</span>
                </h2>
                <span className="text-[10px] text-slate-400 font-medium block">
                  Hydrogen Systems Platform
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Decision Support Platform</span>
              </div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight leading-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sign in to continue your hydrogen storage cylinder design, material comparison, and sensitivity analysis.
              </p>
            </div>
          </div>

          {/* Animated Hydrogen Cylinder Visual Component */}
          <div className="my-8 relative z-10 flex items-center justify-center">
            <div className="w-56 h-32 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/40 p-4 shadow-xl relative flex flex-col justify-between overflow-hidden animate-float">
              <div className="flex justify-between items-center text-[10px] font-bold text-cyan-400">
                <span>35 MPa H₂ Storage</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Type I / III</span>
              </div>
              <div className="text-center my-auto">
                <span className="text-xl font-black text-slate-100 block">t = 24.58 mm</span>
                <span className="text-[10px] text-slate-400">Aluminium 6061-T6</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 border-t border-slate-700/60 pt-1">
                <span>Capacity: 50 L</span>
                <span>Mass: ~46.9 kg</span>
              </div>
            </div>
          </div>

          {/* Demo User Helper Box */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1.5 relative z-10">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Demo Quick Sign-In Credentials:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => { setEmail('user@hydrogen.edu'); setPassword('Password123!'); }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700"
              >
                User Demo
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@hydrogen.sys'); setPassword('AdminSecret123!'); }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your registered email and password</p>
          </div>

          {errors.form && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@hydrogen.edu"
                  className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-3 border ${
                    errors.email ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500/50'
                  } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
                />
              </div>
              {errors.email && <span className="text-[11px] text-red-400 mt-1 block">{errors.email}</span>}
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500/50'
                  } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-red-400 mt-1 block">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => setActivePage('forgot-password')}
                className="text-cyan-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>[Sign In]</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Create Account Link */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => setActivePage('register')}
              className="text-cyan-400 font-bold hover:underline"
            >
              [Create Account]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
