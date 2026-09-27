import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { CheckCircle2, Ticket, Printer, ArrowRight, Train, User, Loader2 } from 'lucide-react';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { pnr } = location.state || {};
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!pnr) {
        setLoading(false);
        return;
      }
      try {
        const res = await bookingService.getBookingByPNR(pnr);
        setBookingData(res.data);
      } catch (err) {
        console.error('Failed to load PNR confirmation details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookingDetails();
  }, [pnr]);

  if (loading) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking confirmation not found</h2>
        <Link to="/" className="inline-block bg-brand-600 text-white font-semibold px-4 py-2 rounded-xl text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  const { train, passengers, status, total_fare, class: travelClass, journey_date } = bookingData;

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Success Banner */}
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-200 mx-auto" />
          <h1 className="text-2xl font-extrabold">Booking Confirmed!</h1>
          <p className="text-emerald-100 text-xs">Your train reservation has been successfully completed.</p>

          <div className="pt-3">
            <span className="text-xs uppercase tracking-widest text-emerald-200 block">Your PNR Number</span>
            <span className="text-3xl font-black tracking-wider bg-white text-emerald-800 px-4 py-1 rounded-xl inline-block mt-1 shadow">
              {pnr}
            </span>
          </div>
        </div>

        {/* Digital Ticket Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          {/* Train Summary */}
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded border border-brand-200">
                  #{train.train_number}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{train.name}</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div>
                <span className="text-slate-400 block">From</span>
                <span className="font-bold text-slate-800">{train.source}</span>
                <span className="block text-slate-500">{train.departure_time}</span>
              </div>
              <div>
                <span className="text-slate-400 block">To</span>
                <span className="font-bold text-slate-800">{train.destination}</span>
                <span className="block text-slate-500">{train.arrival_time}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Journey Date</span>
                <span className="font-bold text-slate-800">{journey_date}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Class</span>
                <span className="font-bold text-slate-800">{travelClass}</span>
              </div>
            </div>
          </div>

          {/* Passenger List with Assigned Seat Numbers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Passenger Allocation</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {passengers.map((p, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-slate-500 text-[11px]">{p.age} yrs | {p.gender} | {p.berth_preference}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Seat / Berth</span>
                    <span className="font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
                      {p.seat_number || 'Confirmed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Fare & Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">Total Amount Paid</span>
              <span className="text-xl font-extrabold text-slate-900">₹{total_fare}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print Ticket
              </button>
              <Link
                to="/my-bookings"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors"
              >
                View My Bookings <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
