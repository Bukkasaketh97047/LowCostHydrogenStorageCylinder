import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Activity,
  Award,
  RefreshCw,
  Search
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  fetchAdminUsersApi,
  toggleAdminUserStatusApi,
  updateAdminUserRoleApi,
  fetchAdminStatsApi
} from '../services/api';

export default function AdminUsers({ setActivePage }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const userList = await fetchAdminUsersApi();
      setUsers(userList);
      const systemStats = await fetchAdminStatsApi();
      setStats(systemStats);
    } catch (e) {
      console.warn('Unable to load admin data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center max-w-md mx-auto space-y-4">
        <Shield className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">Access Restricted</h3>
        <p className="text-xs text-slate-400">
          This area is restricted to System Administrators only.
        </p>
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-6 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleToggleStatus = async (id) => {
    try {
      await toggleAdminUserStatusApi(id);
      loadData();
    } catch (e) {}
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateAdminUserRoleApi(id, newRole);
      loadData();
    } catch (e) {}
  };

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-amber-400" />
            System Administration Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage user accounts, roles, account status, and system telemetry.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <DisclaimerBanner compact />

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 border-t-2 border-t-cyan-400">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Accounts</span>
          <div className="text-2xl font-black text-slate-100 mt-1">{stats?.totalUsers ?? users.length}</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border-t-2 border-t-blue-400">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Users</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{stats?.usersCount ?? 0}</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border-t-2 border-t-amber-400">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Calculations Logged</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats?.totalCalculationsCount ?? 0}</div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:outline-none"
          />
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          Registered User Directory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="p-3 font-semibold">User</th>
                <th className="p-3 font-semibold">Role</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Registered Date</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-slate-100 block">{u.fullName}</span>
                    <span className="text-[11px] text-slate-400">{u.email}</span>
                  </td>

                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-900 text-cyan-300 text-xs rounded-lg px-2.5 py-1 border border-slate-800 font-bold focus:outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="p-3">
                    {u.enabled ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Disabled
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-slate-400 font-mono text-[11px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        u.enabled
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {u.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
