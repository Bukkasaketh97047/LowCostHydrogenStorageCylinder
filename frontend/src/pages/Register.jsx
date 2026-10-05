import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function Register({ setActivePage }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Live password strength indicator algorithm
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { label: '', color: '', percent: 0 };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500 text-red-400', percent: 33 };
    if (score === 2 || score === 3) return { label: 'Medium', color: 'bg-amber-500 text-amber-400', percent: 66 };
    return { label: 'Strong', color: 'bg-emerald-500 text-emerald-400', percent: 100 };
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      errs.termsAccepted = 'You must agree to the Terms & Conditions';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(formData);
      setActivePage('login');
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl border border-slate-800 max-w-xl w-full p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Create Engineering Account
          </h1>
          <p className="text-xs text-slate-400">
            Register to save calculations, compare materials, and export custom reports.
          </p>
        </div>

        {errors.form && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Alex Mercer"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-3 border ${
                  errors.fullName ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
            </div>
            {errors.fullName && <span className="text-[11px] text-red-400 mt-1 block">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Academic / Professional Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex.mercer@university.edu"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-3 border ${
                  errors.email ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
            </div>
            {errors.email && <span className="text-[11px] text-red-400 mt-1 block">{errors.email}</span>}
          </div>



          {/* Password & Strength Indicator */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

            {/* Password Strength Meter */}
            {formData.password && (
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500/80' : 'border-slate-800 focus:border-cyan-500/50'
                } focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
              />
            </div>
            {errors.confirmPassword && <span className="text-[11px] text-red-400 mt-1 block">{errors.confirmPassword}</span>}
          </div>

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/30"
              />
              <span>
                I agree to the <strong>Terms &amp; Conditions</strong> and acknowledge that this system is for preliminary evaluation purposes only.
              </span>
            </label>
            {errors.termsAccepted && <span className="text-[11px] text-red-400 mt-1 block">{errors.termsAccepted}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>[Create Account]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => setActivePage('login')}
            className="text-cyan-400 font-bold hover:underline"
          >
            [Sign In]
          </button>
        </div>
      </div>
    </div>
  );
}
