import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Train, Home, User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Live ticking clock state
  const [timeStr, setTimeStr] = useState('');
  const [fontSize, setFontSize] = useState('normal');
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');

      setTimeStr(`${day}-${month}-${year} [${hours}:${mins}:${secs}]`);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b border-slate-300 font-sans shadow-sm">
      {/* 1. TOP UTILITY BAR (Thin White/Light Gray Bar) */}
      <div className="bg-slate-100 border-b border-slate-200 text-[11px] text-slate-700 py-1 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 font-mono font-semibold text-slate-800">
          <span>{timeStr || '08-Sep-2026 [00:41:07]'}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Font Size Adjusters */}
          <div className="flex items-center gap-1 font-bold">
            <button
              onClick={() => setFontSize('small')}
              className={`px-1.5 py-0.5 border rounded ${fontSize === 'small' ? 'bg-[#1a3c6e] text-white' : 'bg-white text-slate-700'}`}
              title="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 border rounded ${fontSize === 'normal' ? 'bg-[#1a3c6e] text-white' : 'bg-white text-slate-700'}`}
              title="Default font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 border rounded ${fontSize === 'large' ? 'bg-[#1a3c6e] text-white' : 'bg-white text-slate-700'}`}
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="font-bold text-slate-800 hover:text-[#1a3c6e] flex items-center gap-1 px-2 py-0.5 border border-slate-300 rounded bg-white"
          >
            {lang === 'EN' ? 'English' : 'हिन्दी'}
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER & LOGO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Circular Logo + QUICKRAIL */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-[#1a3c6e] border-2 border-amber-500 flex items-center justify-center shadow-md">
            <Train className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1a3c6e] uppercase leading-none">
              QUICKRAIL
            </h1>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mt-0.5">
              INDIAN RAILWAY RESERVATION SYSTEM
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex flex-wrap items-center justify-center gap-1 text-xs font-bold uppercase text-[#1a3c6e]">
          <Link
            to="/"
            className={`p-2 rounded hover:bg-slate-100 flex items-center ${location.pathname === '/' ? 'text-amber-600 border-b-2 border-amber-600' : ''}`}
            title="Home"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* LOGIN / REGISTER Solid Navy Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 px-2">
              <span className="bg-slate-100 px-3 py-1.5 rounded border border-slate-300 text-slate-800 font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#1a3c6e]" /> {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1.5 rounded font-bold transition-colors flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" /> LOGOUT
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#1a3c6e] hover:bg-[#122b52] text-white px-4 py-1.5 rounded font-bold shadow-sm transition-colors mx-1"
            >
              LOGIN / REGISTER
            </Link>
          )}

          <Link
            to="/"
            className="px-2.5 py-1.5 hover:text-amber-600 hover:bg-slate-50 rounded border-b-2 border-amber-600 text-amber-700"
          >
            TRAINS
          </Link>

          <Link
            to="/pnr-status"
            className="px-2.5 py-1.5 hover:text-amber-600 hover:bg-slate-50 rounded"
          >
            PNR STATUS
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className="px-2.5 py-1.5 hover:text-amber-600 hover:bg-slate-50 rounded"
            >
              MY BOOKINGS
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded font-bold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" /> ADMIN
            </Link>
          )}

          <span className="px-2.5 py-1.5 text-slate-400 cursor-not-allowed hidden lg:inline">MEALS</span>

          {/* Orange Promo Button */}
          <span className="bg-[#f5820a] text-white px-3 py-1.5 rounded font-extrabold text-[11px] shadow-sm tracking-wide mx-1">
            UPTO 10% CASHBACK
          </span>

          <span className="px-2 py-1.5 text-slate-400 cursor-not-allowed hidden xl:inline">E-WALLET</span>
          <span className="px-2 py-1.5 text-slate-400 cursor-not-allowed hidden xl:inline">CONTACT US</span>
        </nav>

        {/* Right Side: Emblem / Secondary Logo Placeholder */}
        <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-4 text-right">
          <div className="w-10 h-10 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center text-[#1a3c6e] font-black text-xs">
            GOV
          </div>
        </div>
      </div>
    </header>
  );
}
