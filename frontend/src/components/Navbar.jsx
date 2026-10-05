import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  Search,
  Bell,
  User,
  ShieldAlert,
  Cpu,
  LogOut,
  History,
  Shield,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ isDark, toggleTheme, activePage, setActivePage, notificationCount = 2 }) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('calc') || q.includes('design')) setActivePage('calculator');
    else if (q.includes('mat')) setActivePage('materials');
    else if (q.includes('comp')) setActivePage('comparison');
    else if (q.includes('rec') || q.includes('opt')) setActivePage('recommendation');
    else if (q.includes('sens') || q.includes('press')) setActivePage('sensitivity');
    else if (q.includes('hist') || q.includes('my calc')) setActivePage('history');
    else if (q.includes('prof') || q.includes('user')) setActivePage('profile');
    else if (q.includes('admin')) setActivePage('admin');
    else if (q.includes('arch')) setActivePage('architecture');
    else if (q.includes('method')) setActivePage('methodology');
    else setActivePage('dashboard');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search engineering calculations, materials, sensitivity..."
          className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
        />
      </form>

      {/* Center Status Disclaimer Pill */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/20 rounded-full text-xs text-cyan-300">
        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="font-semibold">PRELIMINARY ENGINEERING EVALUATION SYSTEM</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">System Telemetry</h4>
                <span className="text-[10px] text-cyan-400 font-medium">Live Status</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">Security Layer Active</p>
                    <p className="text-[11px] text-slate-400">Spring Security + BCrypt password hashing active.</p>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-200">ASME Barlow Validation</p>
                    <p className="text-[11px] text-slate-400">All preliminary wall calculations check SE - 0.6P &gt; 0.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center text-slate-950 font-bold text-xs">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-200 block leading-tight truncate max-w-[120px]">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold block">{user.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-2">
                  <span className="text-xs font-bold text-slate-200 block">{user.fullName}</span>
                  <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">
                    {user.role}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { setActivePage('profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition-all font-medium text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={() => { setActivePage('history'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition-all font-medium text-left"
                  >
                    <History className="w-4 h-4 text-slate-400" />
                    <span>My Calculations</span>
                  </button>

                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => { setActivePage('admin'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-amber-300 hover:bg-amber-500/10 rounded-xl transition-all font-semibold text-left"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin Console</span>
                    </button>
                  )}

                  <button
                    onClick={() => { setShowUserMenu(false); logout(); setActivePage('login'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold text-left border-t border-slate-800/80 mt-1 pt-2"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setActivePage('login')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
