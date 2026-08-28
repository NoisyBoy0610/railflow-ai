'use client';

import React, { useState } from 'react';
import { Train, Clock, MapPin, CheckCircle2, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import { TRAINS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';

export const LiveTrainRadar: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState(TRAINS[0]); // 20607 Vande Bharat

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Live Synthetic GPS & Running Status Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Simulated real-time tracking with platform numbers, scheduled vs actual arrival, and delay metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {TRAINS.map((t) => (
              <button
                key={t.number}
                onClick={() => {
                  setSelectedTrain(t);
                  soundEffects.playTick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedTrain.number === t.number
                    ? 'bg-[#0F2C59] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.number} ({t.type})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Running Map & Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base text-white">{selectedTrain.number}</span>
                <h3 className="font-bold text-sm text-white">{selectedTrain.name}</h3>
              </div>
              <p className="text-xs text-slate-300">
                {selectedTrain.source} ➔ {selectedTrain.destination} • Speed: {selectedTrain.speedKmph} km/h
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              selectedTrain.currentDelayMinutes === 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {selectedTrain.currentDelayMinutes === 0 ? '🟢 ON TIME' : `🔴 DELAYED (+${selectedTrain.currentDelayMinutes}m)`}
            </span>
          </div>
        </div>

        {/* Station Stops Timeline */}
        <div className="p-6">
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
            {selectedTrain.schedule.map((stop, index) => {
              const isCurrent = stop.stationCode === selectedTrain.currentLocationStation;
              const isPast = index <= 1; // Simulated passed station

              return (
                <div key={stop.stationCode} className="relative group">
                  {/* Timeline bullet */}
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-orange-500 border-white ring-4 ring-orange-500/30 animate-ping'
                      : isPast
                      ? 'bg-emerald-600 border-white'
                      : 'bg-slate-300 border-white'
                  }`} />
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                    isCurrent
                      ? 'bg-orange-500 border-white'
                      : isPast
                      ? 'bg-emerald-600 border-white'
                      : 'bg-slate-300 border-white'
                  }`} />

                  <div className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-orange-50/70 border-orange-300 shadow-sm'
                      : isPast
                      ? 'bg-slate-50/60 border-slate-200'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-[#0F2C59]">{stop.stationCode}</span>
                        <h4 className="font-bold text-xs text-slate-900">{stop.stationName}</h4>
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-mono">
                          PF #{stop.platform}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold uppercase animate-pulse">
                            Current Location
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Arr / Dep</span>
                          <span className="font-bold text-slate-800">{stop.arrivalTime} / {stop.departureTime}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Distance</span>
                          <span className="text-slate-600">{stop.distanceKm} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
