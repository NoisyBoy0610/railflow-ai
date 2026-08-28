'use client';

import React, { useState } from 'react';
import { Search, Train as TrainIcon, ArrowRightLeft, Calendar, UserCheck, ShieldCheck, Zap, ArrowRight, CheckCircle2, Clock, Sparkles, Filter, AlertCircle } from 'lucide-react';
import { STATIONS, TRAINS } from '@/lib/mockData';
import { Train, TravelClass, QuotaType } from '@/lib/types';
import { soundEffects } from '@/lib/audio';
import { validateStationPair, validateTravelDate } from '@/lib/validation';

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

  const stationValidation = validateStationPair(sourceCode, destCode);
  const dateValidation = validateTravelDate(travelDate);

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
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors shadow-xs cursor-pointer"
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
              <option value="TQ">Tatkal (TQ - Opens 10 AM/11 AM)</option>
              <option value="PT">Premium Tatkal (PT - Dynamic Fare)</option>
              <option value="SS">Senior Citizen (SS - Lower Berth)</option>
              <option value="LD">Ladies Quota (LD - Female Only)</option>
            </select>
          </div>
        </div>

        {/* Validation Errors */}
        {!stationValidation.isValid && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{stationValidation.error}</span>
          </div>
        )}

        {!dateValidation.isValid && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{dateValidation.error}</span>
          </div>
        )}

        {/* Quota Hints */}
        {selectedQuota === 'SS' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
            ℹ️ <strong>Senior Citizen Lower Berth Quota (SS):</strong> Applicable for Male passengers aged 60+ and Female passengers aged 45+ traveling alone or in pairs.
          </div>
        )}
        {selectedQuota === 'TQ' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
            ⚡ <strong>Tatkal Booking Protocol:</strong> AC Classes (1A/2A/3A/CC/EC) open at 10:00 AM. Non-AC Classes (SL/2S) open at 11:00 AM one day prior to journey.
          </div>
        )}

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
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
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
                      <h3 className="font-black text-sm text-slate-900">
                        {train.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                        #{train.number}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Runs on: {train.runningDays.join(', ')} • {train.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                    train.currentStatus === 'ON_TIME'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {train.currentStatus === 'ON_TIME' ? 'On Time' : `${train.currentDelayMinutes}m Delay`}
                  </span>
                </div>
              </div>

              {/* Schedule Timing Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 grid grid-cols-3 gap-2 text-center items-center">
                  <div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {train.departureTime}
                    </div>
                    <div className="text-xs font-bold text-slate-700">{train.source}</div>
                    <div className="text-[10px] text-slate-400">Scheduled Departure</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400">{train.duration}</span>
                    <div className="w-full flex items-center gap-1 my-1">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <div className="flex-1 border-t-2 border-dashed border-slate-300" />
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-[9px] text-emerald-600 font-semibold">Direct Route</span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {train.arrivalTime}
                    </div>
                    <div className="text-xs font-bold text-slate-700">{train.destination}</div>
                    <div className="text-[10px] text-slate-400">Arrival Next Day</div>
                  </div>
                </div>

                {/* Class Availability Matrix */}
                <div className="md:col-span-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{selectedClass} Availability</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black font-mono ${
                      avail?.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : avail?.status === 'RAC'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {avail?.status === 'AVAILABLE' ? `AVL ${avail.count}` : avail?.status === 'RAC' ? `RAC ${avail.count}` : 'WL / REGRET'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-900">₹{avail?.fare.total || 1450}</span>
                    <button
                      onClick={() => onSelectBookTrain ? onSelectBookTrain(train, selectedClass) : soundEffects.playConfirmationChime()}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
