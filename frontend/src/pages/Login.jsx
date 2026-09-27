import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Train, Lock, Mail, AlertCircle, Loader2, UserCheck, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login({ email, password });
      login(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = () => {
    setEmail('john@example.com');
    setPassword('user123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@quickrail.com');
    setPassword('admin123');
  };

  return (
    <div className="flex-1 bg-slate-100 flex items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1a3c6e] text-white flex items-center justify-center mx-auto shadow-md border-2 border-amber-500">
            <Train className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#1a3c6e] uppercase tracking-tight">Sign in to QuickRail</h1>
          <p className="text-xs text-slate-500 font-semibold">Official Railway Reservation & Ticket Management Portal</p>
        </div>

        {/* Login Box */}
        <div className="bg-white p-8 rounded border border-slate-300 shadow-lg space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1a3c6e] uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1a3c6e] uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3c6e] hover:bg-[#122b52] text-white font-extrabold py-3 px-6 rounded shadow uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SIGN IN'}
            </button>
          </form>

          {/* Quick Demo Login Credentials Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block text-center">
              Quick One-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoUser}
                className="py-2 px-3 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center justify-center gap-1 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#1a3c6e]" /> Demo User
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-2 px-3 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 flex items-center justify-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Demo Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 font-semibold">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-[#1a3c6e] hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
