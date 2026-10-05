import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, CheckCircle2, Award, History, LogOut } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function Profile({ setActivePage }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center max-w-md mx-auto space-y-4">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">Not Authenticated</h3>
        <p className="text-xs text-slate-400">Please sign in to view your profile and account settings.</p>
        <button
          onClick={() => setActivePage('login')}
          className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  const roleColors = {
    USER: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    ADMIN: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <User className="w-7 h-7 text-cyan-400" />
            User Account Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your credentials, role designation, and saved engineering preferences.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-red-500/40 text-xs font-bold text-red-400 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <DisclaimerBanner compact />

      {/* USER PROFILE CARD */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-cyan-500/20">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-100">{user.fullName}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleColors[user.role] || roleColors.STUDENT}`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Full Name</span>
            </div>
            <p className="text-sm font-bold text-slate-100">{user.fullName}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Registered Email</span>
            </div>
            <p className="text-sm font-bold text-slate-100">{user.email}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Account Status</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified &amp; Active</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Account Created Date</span>
            </div>
            <p className="text-sm font-bold text-slate-100">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </p>
          </div>
        </div>

        {/* QUICK NAVIGATION LINKS */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
          <button
            onClick={() => setActivePage('history')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-cyan-300 font-semibold rounded-xl transition-all"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>My Calculation History</span>
          </button>

          {user.role === 'ADMIN' && (
            <button
              onClick={() => setActivePage('admin')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs rounded-xl transition-all"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Open System Admin Console</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
