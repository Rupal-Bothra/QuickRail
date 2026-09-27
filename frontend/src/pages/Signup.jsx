import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Train, Lock, Mail, User, Phone, AlertCircle, Loader2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.signup({ name, email, phone, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-100 flex items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1a3c6e] text-white flex items-center justify-center mx-auto shadow-md border-2 border-amber-500">
            <Train className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#1a3c6e] uppercase tracking-tight">Create QuickRail Account</h1>
          <p className="text-xs text-slate-500 font-semibold">Official Railway Reservation System Registration</p>
        </div>

        {/* Signup Box */}
        <div className="bg-white p-8 rounded border border-slate-300 shadow-lg space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1a3c6e] uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1a3c6e] uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1a3c6e] uppercase tracking-wider block">Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3c6e] hover:bg-[#122b52] text-white font-extrabold py-3 px-6 rounded shadow uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'REGISTER NOW'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#1a3c6e] hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
