import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { trainService } from '../services/api';
import SeatBadge from '../components/SeatBadge';
import { Train, Clock, ArrowRight, MapPin, Filter, AlertCircle, Loader2, Info, ChevronDown } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrainId, setSelectedTrainId] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [activeStopsTrain, setActiveStopsTrain] = useState(null);

  useEffect(() => {
    async function fetchTrains() {
      setLoading(true);
      setError('');
      try {
        const res = await trainService.searchTrains({ source, destination, date });
        setTrains(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    }
    fetchTrains();
  }, [source, destination, date]);

  const handleSelectBooking = (train, clsInfo) => {
    navigate('/booking', {
      state: {
        train,
        selectedClass: clsInfo.class,
        fare: clsInfo.fare,
        date,
      },
    });
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search Header Summary */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                <span>{source || 'All Stations'}</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
                <span>{destination || 'All Destinations'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Journey Date: <span className="text-white font-semibold">{date}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-sky-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-all self-start md:self-auto"
          >
            Modify Search
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">Fetching live train schedules & seats...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results List */}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Found {trains.length} Trains
              </span>
            </div>

            {trains.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                <Train className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No trains found for this route</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try searching with broader station names or choose a different journey date.
                </p>
              </div>
            ) : (
              trains.map((train) => (
                <div
                  key={train.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  {/* Train Header Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md border border-brand-200">
                          #{train.train_number}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{train.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {train.source} to {train.destination} ({train.distance} KM)
                      </p>
                    </div>

                    {/* Departure / Arrival Timeline */}
                    <div className="flex items-center gap-6 text-slate-800">
                      <div>
                        <div className="text-lg font-extrabold text-slate-900">{train.departure_time}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{train.source.split(' ')[0]}</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-semibold text-slate-400">{train.duration}</span>
                        <div className="w-24 h-0.5 bg-slate-200 relative my-1">
                          <div className="w-2 h-2 rounded-full bg-brand-600 absolute -top-0.5 left-0"></div>
                          <div className="w-2 h-2 rounded-full bg-brand-600 absolute -top-0.5 right-0"></div>
                        </div>
                        <span className="text-[10px] text-slate-400">Direct</span>
                      </div>

                      <div>
                        <div className="text-lg font-extrabold text-slate-900">{train.arrival_time}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{train.destination.split(' ')[0]}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveStopsTrain(activeStopsTrain?.id === train.id ? null : train)}
                      className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1 self-start md:self-auto"
                    >
                      <Info className="w-3.5 h-3.5" /> Route & Stops
                    </button>
                  </div>

                  {/* Intermediate Stops Drawer */}
                  {activeStopsTrain?.id === train.id && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Intermediate Stations & Timing</h4>
                      {train.stops && train.stops.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                          {train.stops.map((st, i) => (
                            <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="font-semibold text-slate-900 block">{st.station}</span>
                              <span className="text-slate-500 text-[11px]">Arr: {st.arrival} | Dep: {st.departure}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Non-stop express service.</p>
                      )}
                    </div>
                  )}

                  {/* Seat Classes Selection Badges */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Class & Check Fare:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {train.availability.map((clsInfo, idx) => (
                        <SeatBadge
                          key={idx}
                          classInfo={clsInfo}
                          isSelected={selectedTrainId === train.id && selectedClass === clsInfo.class}
                          onClick={() => {
                            setSelectedTrainId(train.id);
                            setSelectedClass(clsInfo.class);
                            handleSelectBooking(train, clsInfo);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
