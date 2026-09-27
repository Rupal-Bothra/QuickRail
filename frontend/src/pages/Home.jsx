import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainService } from '../services/api';
import vandeBharatImg from '../assets/vande_bharat.jpg';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Ticket,
  ArrowUpDown,
  Bell,
  X,
  Grid,
  ShieldCheck,
  AlertTriangle,
  FileText,
  HelpCircle,
  Briefcase
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [quota, setQuota] = useState('GENERAL');

  // Checkboxes
  const [disabilityConcession, setDisabilityConcession] = useState(false);
  const [flexibleWithDate, setFlexibleWithDate] = useState(false);
  const [railwayPassConcession, setRailwayPassConcession] = useState(false);

  // Notification Banner dismiss
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await trainService.getStations();
        setStations(res.data || []);
      } catch (err) {
        console.error('Failed to load stations', err);
      }
    }
    fetchStations();
  }, []);

  const handleSwap = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source) params.append('source', source);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="flex-1 bg-slate-100 font-sans">
      {/* 1. NOTIFICATION BANNER (Light Lavender/Blue) */}
      {showBanner && (
        <div className="bg-[#eef0fb] border-b border-indigo-100 py-2 px-4 text-xs text-[#1a3c6e] flex items-center justify-between gap-4 font-semibold">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <span className="bg-rose-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Bell className="w-3 h-3" /> NEW
            </span>
            <span className="truncate">
              QuickRail Express Ticketing & Live Seat Reservation System is active for all routes. Please check latest travel advisories before booking.
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate('/pnr-status')}
              className="bg-[#1a3c6e] hover:bg-[#122b52] text-white px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              Check PNR Status <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="text-slate-500 hover:text-slate-800 p-0.5"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION WITH VANDE BHARAT HIGH-RES TRAIN PHOTO & GRADIENT OVERLAY */}
      <section className="relative min-h-[600px] bg-slate-950 overflow-hidden">
        {/* Crisp, high-resolution Vande Bharat express train photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all"
          style={{
            backgroundImage: `url(${vandeBharatImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }}
        ></div>
        
        {/* Subtle dark gradient overlay (Darker on the left where text/search box sits, lighter on right to keep train vivid) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-900/25"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 items-start justify-between">
          
          {/* FLOATING SEARCH CARD (LEFT SIDE OVERLAPPING HERO) */}
          <div className="w-full lg:w-[480px] bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-300 z-10">
            
            {/* Dark Navy Top Tabs */}
            <div className="grid grid-cols-2 bg-[#1a3c6e] text-white text-xs font-bold uppercase tracking-wider text-center">
              <button
                type="button"
                onClick={() => navigate('/pnr-status')}
                className="py-3 px-2 flex items-center justify-center gap-2 border-r border-slate-700 hover:bg-[#122b52] transition-colors"
              >
                <Ticket className="w-4 h-4 text-amber-400" /> PNR STATUS
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="py-3 px-2 flex items-center justify-center gap-2 hover:bg-[#122b52] transition-colors bg-[#122b52]"
              >
                <Grid className="w-4 h-4 text-amber-400" /> CHARTS / VACANCY
              </button>
            </div>

            {/* Book Ticket Card Body */}
            <div className="p-6 space-y-4">
              <div className="text-center border-b border-slate-200 pb-3">
                <h2 className="text-xl font-extrabold text-[#1a3c6e] uppercase tracking-tight">
                  BOOK TICKET
                </h2>
              </div>

              <form onSubmit={handleSearch} className="space-y-4 text-xs font-bold text-slate-700">
                {/* From & To Fields with Swap Button */}
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  
                  {/* From Station */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a3c6e] uppercase block">
                      From Station *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#1a3c6e] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Jaipur Jn (JP)"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        list="source-list"
                        className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                        required
                      />
                      <datalist id="source-list">
                        {stations.map((st, i) => (
                          <option key={i} value={st} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="hidden sm:flex absolute left-1/2 top-7 -translate-x-1/2 z-10">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center justify-center transition-transform hover:scale-110 border border-white"
                      title="Swap From & To stations"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* To Station */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a3c6e] uppercase block">
                      To Station *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#1a3c6e] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. Ajmer Jn (AII)"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        list="dest-list"
                        className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                        required
                      />
                      <datalist id="dest-list">
                        {stations.map((st, i) => (
                          <option key={i} value={st} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>

                {/* Date & All Classes Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a3c6e] uppercase block">
                      DD/MM/YYYY *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#1a3c6e] absolute left-3 top-3" />
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a3c6e] uppercase block">
                      All Classes
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                    >
                      <option value="All Classes">All Classes</option>
                      <option value="1A">Anubhuti Class (EA)</option>
                      <option value="1A">AC First Class (1A)</option>
                      <option value="2A">AC 2 Tier (2A)</option>
                      <option value="3A">AC 3 Tier (3A)</option>
                      <option value="CC">AC Chair Car (CC)</option>
                      <option value="SL">Sleeper (SL)</option>
                      <option value="2S">Second Sitting (2S)</option>
                    </select>
                  </div>
                </div>

                {/* Quota Row */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1a3c6e] uppercase block">
                    Quota
                  </label>
                  <div className="relative">
                    <Grid className="w-4 h-4 text-[#1a3c6e] absolute left-3 top-3" />
                    <select
                      value={quota}
                      onChange={(e) => setQuota(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-[#1a3c6e]"
                    >
                      <option value="GENERAL">GENERAL</option>
                      <option value="LADIES">LADIES</option>
                      <option value="LOWER BERTH/SR.CITIZEN">LOWER BERTH / SR. CITIZEN</option>
                      <option value="PERSON WITH DISABILITY">PERSON WITH DISABILITY</option>
                      <option value="TATKAL">TATKAL</option>
                      <option value="PREMIUM TATKAL">PREMIUM TATKAL</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-1 text-[11px] font-bold text-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disabilityConcession}
                        onChange={(e) => setDisabilityConcession(e.target.checked)}
                        className="rounded border-slate-300 text-[#1a3c6e] focus:ring-0"
                      />
                      Person With Disability Concession
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flexibleWithDate}
                        onChange={(e) => setFlexibleWithDate(e.target.checked)}
                        className="rounded border-slate-300 text-[#1a3c6e] focus:ring-0"
                      />
                      Flexible With Date
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={railwayPassConcession}
                        onChange={(e) => setRailwayPassConcession(e.target.checked)}
                        className="rounded border-slate-300 text-[#1a3c6e] focus:ring-0"
                      />
                      Railway Pass Concession
                    </label>
                  </div>
                </div>

                {/* Large Orange Search Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#f5820a] hover:bg-[#e07505] text-white font-black py-3 px-4 rounded shadow-md uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" /> Search Trains
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE HERO TEXT OVERLAY WITH SHARP VANDE BHARAT TRAIN PHOTO */}
          <div className="lg:w-[600px] text-white space-y-6 pt-6 z-10">
            <div className="border-l-4 border-amber-500 pl-4 space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 block drop-shadow-md">
                OFFICIAL RESERVATION PORTAL
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase leading-tight text-white drop-shadow-lg">
                QUICKRAIL
              </h1>
              <p className="text-sm font-semibold text-slate-100 tracking-wider drop-shadow-md">
                Safety | Security | Punctuality
              </p>
            </div>

            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 p-5 rounded space-y-3 text-xs text-slate-200 shadow-2xl">
              <h3 className="font-bold text-amber-400 uppercase text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Important Travel Directives
              </h3>
              <ul className="space-y-2 list-disc list-inside text-slate-300 leading-relaxed">
                <li>Passengers must carry original photo identity cards during journey.</li>
                <li>Live seat availability status is updated in real-time across all classes.</li>
                <li>Simulated 1-click refund system is active for instant cancellation processing.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 3. OFFICIAL ANNOUNCEMENTS & NOTICES SECTION */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b-2 border-[#1a3c6e] pb-2 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1a3c6e] uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" /> Important Notices & Information
          </h2>
          <span className="text-xs text-slate-500 font-bold">Government Travel Advisories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notice Card 1 */}
          <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200">
              <AlertTriangle className="w-4 h-4" /> ADVISORY FOR PASSENGERS
            </div>
            <h3 className="font-bold text-sm text-[#1a3c6e]">Identity Proof Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Valid Govt photo ID (Aadhaar, Passport, Voter ID, Driving License) is mandatory for all ticket holders during ticket inspection on train services.
            </p>
          </div>

          {/* Notice Card 2 */}
          <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded border border-sky-200">
              <Briefcase className="w-4 h-4" /> REFUND RULES
            </div>
            <h3 className="font-bold text-sm text-[#1a3c6e]">Instant Cancellation Policy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cancellations initiated via My Bookings tab trigger instant simulated refund processing with clear line-item cancellation fee audit.
            </p>
          </div>

          {/* Notice Card 3 */}
          <div className="bg-white p-5 rounded border border-slate-300 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <HelpCircle className="w-4 h-4" /> 24/7 HELPLINE
            </div>
            <h3 className="font-bold text-sm text-[#1a3c6e]">Passenger Support Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For PNR verification, seat availability, or special concessions, access the Help Desk or enter your 10-digit PNR on the PNR Status page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
