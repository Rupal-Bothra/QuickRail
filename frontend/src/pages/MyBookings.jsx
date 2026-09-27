import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { Ticket, Train, Calendar, User, RefreshCw, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchUserBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingService.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Simulated 90% refund will be credited.')) return;

    setCancellingId(bookingId);
    try {
      const res = await bookingService.cancelBooking(bookingId);
      alert(res.message);
      fetchUserBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">My Booking History</h1>
            <p className="text-xs text-slate-500">View past and upcoming reservations, manage cancellations, and track refund status.</p>
          </div>
          <button
            onClick={fetchUserBookings}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="min-h-[300px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No bookings yet</h3>
                <p className="text-xs text-slate-500">When you book tickets, they will appear here.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-brand-50 text-brand-700 px-2.5 py-1 rounded border border-brand-200">
                        PNR: {booking.pnr}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{booking.train.name} (#{booking.train.train_number})</h3>
                        <span className="text-[11px] text-slate-400">Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
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

                      {booking.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                        >
                          {cancellingId === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                          Cancel Ticket
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route & Class Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">From</span>
                      <span className="font-bold text-slate-800">{booking.train.source}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">To</span>
                      <span className="font-bold text-slate-800">{booking.train.destination}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Journey Date</span>
                      <span className="font-bold text-slate-800">{booking.journey_date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Class & Fare</span>
                      <span className="font-bold text-slate-800">{booking.class} | ₹{booking.total_fare}</span>
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Passengers:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {booking.passengers.map((p, i) => (
                        <div key={i} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-800">{p.name} ({p.age}y, {p.gender})</span>
                          <span className="font-bold text-brand-700 text-[11px]">{p.seat_number || booking.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payments / Refunds audit */}
                  {booking.payments && booking.payments.length > 0 && (
                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100">
                      <span>Transaction ID: <code className="font-mono text-slate-700">{booking.payments[0].transaction_id}</code></span>
                      <span className="font-semibold text-slate-700">Payment: {booking.payments[0].status} ({booking.payments[0].method})</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
