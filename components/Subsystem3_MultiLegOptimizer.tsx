'use client';

import React, { useState } from 'react';
import { GitFork, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Sparkles, Clock, AlertCircle, RefreshCw, Train } from 'lucide-react';
import { STATIONS, TRAINS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';
import { validateStationPair } from '@/lib/validation';
import confetti from 'canvas-confetti';

export const Subsystem3_MultiLegOptimizer: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>('SBC');
  const [destCode, setDestCode] = useState<string>('MAS');
  const [selectedClass, setSelectedClass] = useState<string>('3A');
  const [travelDate, setTravelDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);
  const [bookedRoute, setBookedRoute] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sourceName = STATIONS.find(s => s.code === sourceCode)?.name || sourceCode;
  const destName = STATIONS.find(s => s.code === destCode)?.name || destCode;

  // Dynamic route options generated from selection
  const routeOptions = [
    {
      id: 'opt-1',
      type: 'SPLIT_SEAT',
      title: `Same Train Split-Seat Option (${sourceCode} ➔ ${destCode})`,
      badge: 'Zero Transfer Risk (Same Train 12658)',
      duration: '06h 15m',
      totalFare: 1470,
      savingVsTatkal: 450,
      legs: [
        {
          trainNumber: '12658',
          trainName: 'Chennai Mail Express',
          from: `${sourceName} (${sourceCode})`,
          to: 'Katpadi Jn (KPD)',
          dep: '22:40',
          arr: '02:35',
          status: 'CNF (Confirmed)',
          coachBerth: 'Coach B2, Berth 17 (Lower)',
          class: selectedClass
        },
        {
          trainNumber: '12658',
          trainName: 'Chennai Mail Express (Same Rake)',
          from: 'Katpadi Jn (KPD)',
          to: `${destName} (${destCode})`,
          dep: '02:40',
          arr: '04:55',
          status: 'CNF (Confirmed)',
          coachBerth: 'Coach B3, Berth 24 (Lower)',
          class: selectedClass
        }
      ]
    },
    {
      id: 'opt-2',
      type: 'JUNCTION_TRANSFER',
      title: `Junction Transfer via Jolarpettai (${sourceCode} ➔ JTJ ➔ ${destCode})`,
      badge: '45 Mins Safe Platform Transfer',
      duration: '05h 40m',
      totalFare: 1520,
      savingVsTatkal: 400,
      legs: [
        {
          trainNumber: '12028',
          trainName: 'Shatabdi Express',
          from: `${sourceName} (${sourceCode})`,
          to: 'Jolarpettai Jn (JTJ)',
          dep: '06:00',
          arr: '08:15',
          status: 'CNF (Confirmed)',
          coachBerth: 'Coach C2, Seat 14',
          class: selectedClass
        },
        {
          trainNumber: '20608',
          trainName: 'Vande Bharat Express',
          from: 'Jolarpettai Jn (JTJ)',
          to: `${destName} (${destCode})`,
          dep: '09:00',
          arr: '11:40',
          status: 'CNF (Confirmed)',
          coachBerth: 'Coach C1, Seat 22',
          class: selectedClass
        }
      ]
    }
  ];

  const handleSearchRoutes = () => {
    setErrorMessage(null);
    const stationCheck = validateStationPair(sourceCode, destCode);
    if (!stationCheck.isValid) {
      setErrorMessage(stationCheck.error || 'Invalid stations');
      soundEffects.playAlert();
      return;
    }

    setIsSearching(true);
    soundEffects.playTick();

    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setBookedRoute(null);
      soundEffects.playConfirmationChime();
    }, 600);
  };

  const handleBookSelectedRoute = () => {
    const route = routeOptions[selectedRouteIdx];
    const generatedPnr = '821-' + Math.floor(1000000 + Math.random() * 9000000);
    setBookedRoute({
      pnr: generatedPnr,
      route,
      bookingTime: new Date().toLocaleTimeString('en-IN')
    });
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
    soundEffects.playConfirmationChime();
  };

  const activeOption = routeOptions[selectedRouteIdx];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  Zero Waitlist Engine
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Smart Connecting Journey & Split-Seat Optimizer
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Graph pathfinder for guaranteed confirmed berths via Split-Seat & Junction Transfer when direct trains are WL/Regret
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Confirmed Berth Guarantee</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Parameters Form */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">From Station</label>
              <select
                value={sourceCode}
                onChange={(e) => {
                  setSourceCode(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                {STATIONS.map(s => (
                  <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">To Destination</label>
              <select
                value={destCode}
                onChange={(e) => {
                  setDestCode(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                {STATIONS.map(s => (
                  <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                <option value="3A">3A (3-Tier AC)</option>
                <option value="2A">2A (2-Tier AC)</option>
                <option value="1A">1A (First AC)</option>
                <option value="SL">SL (Sleeper)</option>
                <option value="CC">CC (Chair Car)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearchRoutes}
                disabled={isSearching}
                className="w-full p-2.5 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isSearching ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                )}
                <span>Scan Graph Paths</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {bookedRoute ? (
          /* Booked Confirmation View */
          <div className="p-5 bg-emerald-500 text-white rounded-2xl shadow-md space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                <div>
                  <h3 className="text-base font-black">Connecting Journey Confirmed! PNR: {bookedRoute.pnr}</h3>
                  <p className="text-xs text-emerald-100">{bookedRoute.route.title}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-emerald-200 block uppercase">Total Fare</span>
                <span className="text-lg font-black">₹{bookedRoute.route.totalFare}</span>
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-emerald-200 uppercase text-[11px]">Seat Continuity Voucher:</div>
              {bookedRoute.route.legs.map((leg: any, idx: number) => (
                <div key={idx} className="flex justify-between border-b border-white/10 pb-1">
                  <span>Leg {idx + 1}: {leg.from} ➔ {leg.to} ({leg.trainNumber})</span>
                  <span className="font-mono font-bold text-white">{leg.coachBerth}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setBookedRoute(null)}
              className="px-4 py-2 bg-white text-emerald-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Search Alternate Routes
            </button>
          </div>
        ) : (
          hasSearched && (
            <div className="space-y-4 animate-fadeIn">
              {/* Route Options Switcher */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {routeOptions.map((opt, idx) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedRouteIdx(idx);
                      soundEffects.playTick();
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRouteIdx === idx
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">
                        {opt.type === 'SPLIT_SEAT' ? 'Option A: Same Train Split' : 'Option B: Junction Transfer'}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 font-mono">₹{opt.totalFare}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{opt.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Duration: {opt.duration} • Saves ₹{opt.savingVsTatkal} vs Tatkal Premium
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Route Detailed Path */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Train className="w-4 h-4 text-orange-500" />
                    Detailed Leg Breakdown & Berth Assignments:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    100% CNF Guaranteed
                  </span>
                </div>

                <div className="space-y-3">
                  {activeOption.legs.map((leg, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-black text-xs text-slate-900">{leg.trainName} (#{leg.trainNumber})</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {leg.from} ({leg.dep}) ➔ {leg.to} ({leg.arr})
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Berth Allocation</span>
                        <span className="font-mono font-black text-xs text-emerald-700 block">
                          {leg.coachBerth}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{leg.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleBookSelectedRoute}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Book Confirmed Connecting Journey (₹{activeOption.totalFare})</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
