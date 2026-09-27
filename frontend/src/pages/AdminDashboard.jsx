import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Shield, Train, Users, Ticket, IndianRupee, Plus, Trash2, Edit2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trains, setTrains] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('trains'); // 'trains' or 'bookings'
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for creating new train
  const [newTrain, setNewTrain] = useState({
    train_number: '',
    name: '',
    source: '',
    destination: '',
    departure_time: '08:00',
    arrival_time: '18:00',
    duration: '10h 00m',
    classes_available: '1A,2A,3A,SL',
    distance: 500,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const statsRes = await adminService.getStats();
      setStats(statsRes.data.stats);

      const trainsRes = await adminService.getAllTrains();
      setTrains(trainsRes.data);

      const bookingsRes = await adminService.getAllBookings();
      setAllBookings(bookingsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateTrain = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createTrain(newTrain);
      setShowAddModal(false);
      setNewTrain({
        train_number: '',
        name: '',
        source: '',
        destination: '',
        departure_time: '08:00',
        arrival_time: '18:00',
        duration: '10h 00m',
        classes_available: '1A,2A,3A,SL',
        distance: 500,
      });
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to create train');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrain = async (id) => {
    if (!window.confirm('Delete this train service and its route schedule?')) return;
    try {
      await adminService.deleteTrain(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete train');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-amber-600" /> Admin Control Center
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Railway Operational Dashboard</h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Train Service
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Total Revenue</span>
              <span className="text-2xl font-black text-slate-900">₹{stats?.totalRevenue || 0}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Total Bookings</span>
              <span className="text-2xl font-black text-slate-900">{stats?.totalBookings || 0}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Active Trains</span>
              <span className="text-2xl font-black text-slate-900">{stats?.totalTrains || 0}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Registered Users</span>
              <span className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('trains')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'trains'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Train Fleet & Inventory ({trains.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            System Bookings Audit ({allBookings.length})
          </button>
        </div>

        {/* Tab 1: Trains Management */}
        {activeTab === 'trains' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Train #</th>
                    <th className="px-4 py-3">Train Name</th>
                    <th className="px-4 py-3">Source & Dep</th>
                    <th className="px-4 py-3">Dest & Arr</th>
                    <th className="px-4 py-3">Classes</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trains.map((train) => (
                    <tr key={train.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-bold text-brand-700">#{train.train_number}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{train.name}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{train.source}</span>
                        <span className="block text-[11px] text-slate-400">{train.departure_time}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{train.destination}</span>
                        <span className="block text-[11px] text-slate-400">{train.arrival_time}</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-600">{train.classes_available}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteTrain(train.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Train"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: System Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">PNR</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Train</th>
                    <th className="px-4 py-3">Journey Date</th>
                    <th className="px-4 py-3">Fare</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{b.pnr}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-800 block">{b.user.name}</span>
                        <span className="text-[11px] text-slate-400">{b.user.email}</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{b.train.name} (#{b.train.train_number})</td>
                      <td className="px-4 py-3.5 font-medium">{b.journey_date} ({b.class})</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">₹{b.total_fare}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : b.status === 'CANCELLED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for adding new train */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-slate-900">Add New Train Service</h2>
              <form onSubmit={handleCreateTrain} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block text-slate-700 mb-1">Train Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 12901"
                    value={newTrain.train_number}
                    onChange={(e) => setNewTrain({ ...newTrain, train_number: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold block text-slate-700 mb-1">Train Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat Mail Express"
                    value={newTrain.name}
                    onChange={(e) => setNewTrain({ ...newTrain, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Source Station</label>
                    <input
                      type="text"
                      placeholder="Mumbai Central (MMCT)"
                      value={newTrain.source}
                      onChange={(e) => setNewTrain({ ...newTrain, source: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Destination Station</label>
                    <input
                      type="text"
                      placeholder="Ahmedabad (ADI)"
                      value={newTrain.destination}
                      onChange={(e) => setNewTrain({ ...newTrain, destination: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Departure Time</label>
                    <input
                      type="text"
                      value={newTrain.departure_time}
                      onChange={(e) => setNewTrain({ ...newTrain, departure_time: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Arrival Time</label>
                    <input
                      type="text"
                      value={newTrain.arrival_time}
                      onChange={(e) => setNewTrain({ ...newTrain, arrival_time: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newTrain.duration}
                      onChange={(e) => setNewTrain({ ...newTrain, duration: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Classes (Comma-separated)</label>
                    <input
                      type="text"
                      value={newTrain.classes_available}
                      onChange={(e) => setNewTrain({ ...newTrain, classes_available: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold block text-slate-700 mb-1">Distance (KM)</label>
                    <input
                      type="number"
                      value={newTrain.distance}
                      onChange={(e) => setNewTrain({ ...newTrain, distance: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold"
                  >
                    {submitting ? 'Creating...' : 'Create Train'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
