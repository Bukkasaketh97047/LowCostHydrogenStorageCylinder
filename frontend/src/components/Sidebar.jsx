import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  LayoutDashboard,
  Calculator,
  Database,
  GitCompare,
  Award,
  Sliders,
  History,
  Info,
  ChevronRight,
  Flame,
  User,
  Shield
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'Design Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Design Calculator', icon: Calculator },
    { id: 'materials', label: 'Material Database', icon: Database },
    { id: 'comparison', label: 'Material Comparison', icon: GitCompare },
    { id: 'recommendation', label: 'Recommendation Engine', icon: Award },
    { id: 'sensitivity', label: 'Sensitivity Analysis', icon: Sliders },
    { id: 'history', label: 'My Calculations', icon: History },
    { id: 'about', label: 'About & Scope', icon: Info },
  ];

  if (user) {
    menuItems.push({ id: 'profile', label: 'User Profile', icon: User });
    if (user.role === 'ADMIN') {
      menuItems.push({ id: 'admin', label: 'Admin Console', icon: Shield });
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Flame className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-100 tracking-tight leading-tight">
              HYDRO<span className="text-cyan-400">CYL</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-medium block">
              Design &amp; Material System
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Secured Auth v2.0
            </div>
            <span>Spring Security + JWT Auth</span>
          </div>
        </div>
      </aside>
    </>
  );
}
