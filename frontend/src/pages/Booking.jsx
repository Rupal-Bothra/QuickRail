import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Train, UserPlus, Trash2, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const bookingState = location.state || {};
  const { train, selectedClass, fare, date } = bookingState;

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'M', berth_preference: 'No Preference' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!train || !selectedClass) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">No train selected for booking</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
        >
          Return to Train Search
        </button>
      </div>
    );
  }

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return;
    setPassengers([
      ...passengers,
      { name: '', age: '', gender: 'M', berth_preference: 'No Preference' },
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const calculateTotalFare = () => {
    const baseTotal = (fare || 0) * passengers.length;
    const gstFee = Math.round(baseTotal * 0.05); // 5% GST
    return { baseTotal, gstFee, grandTotal: baseTotal + gstFee };
  };

  const { baseTotal, gstFee, grandTotal } = calculateTotalFare();

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Validate inputs
    for (let p of passengers) {
      if (!p.name.trim()) {
        setError('Please enter passenger name for all rows');
        return;
      }
      if (!p.age || isNaN(p.age) || Number(p.age) < 1 || Number(p.age) > 120) {
        setError('Please enter a valid age between 1 and 120');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        train_id: train.id,
        class: selectedClass,
        journey_date: date,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender,
          berth_preference: p.berth_preference,
        })),
      };

      const res = await bookingService.createBooking(payload);
      const booking = res.data.booking;

      // Navigate to Payment gateway simulation page
      navigate('/payment', {
        state: {
          booking,
          grandTotal,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to initialize booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Review Journey & Add Passengers</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Passenger Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Train Journey Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-brand-600 px-2 py-0.5 rounded text-white">
                    #{train.train_number}
                  </span>
                  <h3 className="font-bold text-base">{train.name}</h3>
                </div>
                <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20">
                  Class: {selectedClass}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-bold text-lg">{train.departure_time}</div>
                  <div className="text-xs text-slate-400">{train.source}</div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-slate-400 block">{train.duration}</span>
                  <div className="w-20 h-0.5 bg-slate-700 mx-auto my-1"></div>
                  <span className="text-[11px] text-slate-400">{date}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{train.arrival_time}</div>
                  <div className="text-xs text-slate-400">{train.destination}</div>
                </div>
              </div>
            </div>

            {/* Passenger Details Form */}
            <form onSubmit={handleSubmitBooking} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Passenger Information</h3>
                <span className="text-xs text-slate-500 font-medium">Max 6 passengers</span>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {passengers.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Passenger {idx + 1}</span>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePassenger(idx)}
                          className="text-rose-500 hover:text-rose-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Name as on Govt ID"
                          value={p.name}
                          onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Age</label>
                        <input
                          type="number"
                          placeholder="Age"
                          min="1"
                          max="120"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Gender</label>
                        <select
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Berth Preference</label>
                        <select
                          value={p.berth_preference}
                          onChange={(e) => handlePassengerChange(idx, 'berth_preference', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="No Preference">No Preference</option>
                          <option value="Lower">Lower Berth</option>
                          <option value="Middle">Middle Berth</option>
                          <option value="Upper">Upper Berth</option>
                          <option value="Side Lower">Side Lower</option>
                          <option value="Side Upper">Side Upper</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {passengers.length < 6 && (
                <button
                  type="button"
                  onClick={addPassenger}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-brand-600 hover:bg-brand-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-4 h-4" /> Add Another Passenger
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Booking...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Fare Summary Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Fare Breakdown</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Base Ticket Fare ({passengers.length} x ₹{fare})</span>
                <span className="font-semibold text-slate-800">₹{baseTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Reservation Fee (5%)</span>
                <span className="font-semibold text-slate-800">₹{gstFee}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-slate-900">
              <span className="font-bold text-sm">Total Payable</span>
              <span className="font-extrabold text-xl text-brand-700">₹{grandTotal}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Instant Refund Guarantee
              </div>
              <p>Simulated zero-hassle cancellations directly from your My Bookings tab.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
