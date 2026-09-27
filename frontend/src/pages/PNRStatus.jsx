import React, { useState } from 'react';
import { bookingService } from '../services/api';
import { Search, Ticket, Train, User, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function PNRStatus() {
  const [pnr, setPnr] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearchPNR = async (e) => {
    e.preventDefault();
    if (!pnr.trim()) return;

    setLoading(true);
    setError('');
    setBooking(null);
    setSearched(true);

    try {
      const res = await bookingService.getBookingByPNR(pnr.trim());
      setBooking(res.data);
    } catch (err) {
      setError(err.message || 'PNR not found or invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Check PNR Status</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Enter your 10-digit PNR number to inspect live booking status, seat allocation, and journey details.
          </p>
        </div>

        {/* PNR Input Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <form onSubmit={handleSearchPNR} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter 10-digit PNR Number (e.g. 4218392041)"
              value={pnr}
              maxLength={10}
              onChange={(e) => setPnr(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-slate-50/50"
              required
            />
            <button
              type="submit"
              disabled={loading || pnr.length !== 10}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Checking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Check Status
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Booking Details Card */}
        {booking && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
            {/* Ticket Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block">PNR Number</span>
                <span className="text-2xl font-black text-slate-900 tracking-wider">{booking.pnr}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Booking Status:</span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : booking.status === 'CANCELLED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Train Info */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400">#{booking.train.train_number} - {booking.train.name}</span>
                <span>Class: {booking.class}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-bold">{booking.train.departure_time}</div>
                  <div className="text-xs text-slate-400">{booking.train.source}</div>
                </div>
                <div className="text-center text-xs text-slate-400">
                  <span>{booking.journey_date}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{booking.train.arrival_time}</div>
                  <div className="text-xs text-slate-400">{booking.train.destination}</div>
                </div>
              </div>
            </div>

            {/* Passenger Seat Allocation */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Passenger Allocation Details</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {booking.passengers.map((p, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-slate-500 text-[11px]">{p.age} yrs | {p.gender} | {p.berth_preference}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Status / Seat</span>
                      <span className="font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                        {p.seat_number || booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
