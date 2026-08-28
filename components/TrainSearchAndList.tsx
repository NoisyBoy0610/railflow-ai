'use client';

import React, { useState } from 'react';
import { Search, Train as TrainIcon, ArrowRightLeft, Calendar, UserCheck, ShieldCheck, Zap, ArrowRight, CheckCircle2, Clock, Sparkles, Filter } from 'lucide-react';
import { STATIONS, TRAINS } from '@/lib/mockData';
import { Train, TravelClass, QuotaType } from '@/lib/types';
import { soundEffects } from '@/lib/audio';

interface TrainSearchProps {
  initialSource?: string;
  initialDest?: string;
  initialClass?: TravelClass;
  initialQuota?: QuotaType;
  onSelectBookTrain?: (train: Train, travelClass: TravelClass) => void;
}

export const TrainSearchAndList: React.FC<TrainSearchProps> = ({
  initialSource = 'SBC',
  initialDest = 'MAS',
  initialClass = '3A',
  initialQuota = 'GN',
  onSelectBookTrain,
}) => {
  const [sourceCode, setSourceCode] = useState<string>(initialSource);
  const [destCode, setDestCode] = useState<string>(initialDest);
  const [travelDate, setTravelDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<TravelClass>(initialClass);
  const [selectedQuota, setSelectedQuota] = useState<QuotaType>(initialQuota);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSwapStations = () => {
    soundEffects.playTick();
    const temp = sourceCode;
    setSourceCode(destCode);
    setDestCode(temp);
  };

  // Filter matching trains
  const filteredTrains = TRAINS.filter(train => {
    const matchesSource = train.source === sourceCode || train.schedule.some(s => s.stationCode === sourceCode);
    const matchesDest = train.destination === destCode || train.schedule.some(s => s.stationCode === destCode);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        train.name.toLowerCase().includes(q) ||
        train.number.includes(q) ||
        train.type.toLowerCase().includes(q)
      );
    }
    return matchesSource && matchesDest;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin Station */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              From Station
            </label>
            <select
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {STATIONS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwapStations}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors shadow-xs"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Station */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              To Destination
            </label>
            <select
              value={destCode}
              onChange={(e) => setDestCode(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {STATIONS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Journey Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Quota */}
          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Reservation Quota
            </label>
            <select
              value={selectedQuota}
              onChange={(e) => setSelectedQuota(e.target.value as QuotaType)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="GN">General (GN)</option>
              <option value="TQ">Tatkal (TQ)</option>
              <option value="PT">Premium Tatkal (PT)</option>
              <option value="SS">Senior Citizen (SS)</option>
              <option value="LD">Ladies Quota (LD)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" /> Class:
            </span>
            {(['ALL', '3A', '2A', '1A', 'CC', 'EC', 'SL'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls === 'ALL' ? '3A' : cls)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  (cls === 'ALL' && selectedClass === '3A') || selectedClass === cls
                    ? 'bg-[#0F2C59] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredTrains.length || TRAINS.length}</strong> Superfast & Express Trains
          </div>
        </div>
      </div>

      {/* Train Cards List */}
      <div className="space-y-4">
        {(filteredTrains.length > 0 ? filteredTrains : TRAINS).map((train) => {
          const avail = train.availability[selectedClass] || Object.values(train.availability)[0];

          return (
            <div
              key={train.number}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 font-bold">
                    <TrainIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#0F2C59]">{train.number}</span>
                      <h3 className="font-bold text-sm text-slate-900">{train.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        train.type === 'Vande Bharat'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : train.type === 'Rajdhani'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {train.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Runs On: {train.runningDays.join(', ')} • Speed: {train.speedKmph} km/h • {train.isPantryAvailable ? '🍱 Pantry Car Available' : 'No Pantry'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    train.currentDelayMinutes === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {train.currentDelayMinutes === 0 ? '🟢 Running On Time' : `🔴 Delayed by ${train.currentDelayMinutes} mins`}
                  </span>
                </div>
              </div>

              {/* Card Body: Timings & Classes */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Timings & Duration */}
                <div className="md:col-span-4 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black font-mono text-slate-900">{train.departureTime}</span>
                    <span className="text-xs text-slate-500 block font-semibold">{train.source}</span>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{train.duration}</span>
                    <div className="w-20 h-0.5 bg-slate-300 relative my-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5 right-0"></div>
                    </div>
                    <span className="text-[10px] text-slate-400">Direct Route</span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-slate-900">{train.arrivalTime}</span>
                    <span className="text-xs text-slate-500 block font-semibold">{train.destination}</span>
                  </div>
                </div>

                {/* Class Availability Tiles */}
                <div className="md:col-span-8 flex flex-wrap items-center justify-end gap-2">
                  {train.classes.map((cls) => {
                    const classAvail = train.availability[cls];
                    if (!classAvail || classAvail.status === 'REGRET') return null;

                    const isAvailable = classAvail.status === 'AVAILABLE';
                    const isRac = classAvail.status === 'RAC';

                    return (
                      <div
                        key={cls}
                        onClick={() => {
                          if (onSelectBookTrain) {
                            onSelectBookTrain(train, cls);
                          }
                        }}
                        className={`p-3 rounded-xl border cursor-pointer min-w-[130px] transition-all hover:scale-[1.02] ${
                          isAvailable
                            ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
                            : isRac
                            ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                            : 'bg-rose-50/70 border-rose-300 hover:border-rose-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-black text-xs text-slate-900">{cls}</span>
                          <span className="font-mono font-bold text-xs text-slate-900">₹{classAvail.fare.total}</span>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className={`text-xs font-bold ${
                            isAvailable ? 'text-emerald-700' : isRac ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {isAvailable ? `AVL ${classAvail.count}` : isRac ? `RAC ${classAvail.count}` : `${classAvail.waitlistType || 'WL'} ${classAvail.count}`}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Chance: {classAvail.probability || 90}%</span>
                          <span className="font-semibold text-orange-600 hover:underline">Book ➔</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
