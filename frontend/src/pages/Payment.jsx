import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/api';
import { CreditCard, QrCode, Building2, CheckCircle2, XCircle, ShieldCheck, Loader2 } from 'lucide-react';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking, grandTotal } = location.state || {};
  const [method, setMethod] = useState('UPI');
  const [simulateStatus, setSimulateStatus] = useState('SUCCESS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!booking) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">No active booking to pay for</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-sm bg-brand-600 text-white px-4 py-2 rounded-xl">
          Go to Home
        </button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await paymentService.processPayment({
        booking_id: booking.id,
        method,
        simulate_status: simulateStatus,
      });

      if (simulateStatus === 'SUCCESS') {
        navigate('/confirmation', {
          state: {
            pnr: res.data.pnr,
            payment: res.data.payment,
          },
        });
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Mock Payment Gateway Sandbox
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Ticket Payment</h1>
          <p className="text-xs text-slate-500">
            Total Amount Due: <span className="text-slate-900 font-extrabold text-base">₹{grandTotal || booking.total_fare}</span>
          </p>
        </div>

        {/* Payment Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          <form onSubmit={handlePayment} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs font-medium flex items-center gap-2">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                  { id: 'CARD', label: 'Card', icon: CreditCard },
                  { id: 'NET_BANKING', label: 'NetBanking', icon: Building2 },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = method === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sandbox Simulation Mode Options */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Simulate Gateway Outcome:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSimulateStatus('SUCCESS')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    simulateStatus === 'SUCCESS'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Success Mode
                </button>
                <button
                  type="button"
                  onClick={() => setSimulateStatus('FAILED')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    simulateStatus === 'FAILED'
                      ? 'border-rose-600 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-rose-600" /> Failure Mode
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 text-base ${
                simulateStatus === 'SUCCESS' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                </>
              ) : (
                `Simulate ${simulateStatus === 'SUCCESS' ? 'Successful' : 'Failed'} Payment (₹${grandTotal || booking.total_fare})`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
