'use client';

import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Bed, ArrowRight, ShieldCheck, Clock, CheckCircle2, Train, MapPin, Zap } from 'lucide-react';
import { TRAINS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';

export const Subsystem8_DisruptionCopilot: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState(TRAINS[1]); // 12658 Chennai Mail (Delayed 215 mins)
  const [rescheduled, setRescheduled] = useState<boolean>(false);
  const [retiringRoomBooked, setRetiringRoomBooked] = useState<boolean>(false);

  const isCriticalDelay = selectedTrain.currentDelayMinutes >= 180;

  const handleReschedule = () => {
    setRescheduled(true);
    soundEffects.playConfirmationChime();
  };

  const handleBookRoom = () => {
    setRetiringRoomBooked(true);
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 8
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Dynamic Disruption & Rescheduling Copilot
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Proactive intelligence triggered on &gt;3hr delays or route diversions with 1-tap free rescheduling & retiring rooms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-400/30 text-rose-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>Live Radar: Disruption Detected</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Monitored Train Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {selectedTrain.number} • {selectedTrain.name}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isCriticalDelay ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedTrain.currentDelayMinutes} MIN DELAY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Route:</span>
                <span className="text-white font-medium">{selectedTrain.source} ➔ {selectedTrain.destination}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Reported Location:</span>
                <span className="text-orange-400 font-mono font-bold">Passed Jolarpettai Jn (JTJ)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Original Scheduled Arrival:</span>
                <span className="text-slate-300 font-mono">04:15 AM</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Revised Expected Arrival:</span>
                <span className="text-rose-400 font-mono font-bold">07:50 AM (+3h 35m)</span>
              </div>
            </div>

            {isCriticalDelay && (
              <div className="p-3 bg-rose-950/80 border border-rose-600/50 rounded-xl text-xs text-rose-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Rule 14.1 Threshold Exceeded (&gt; 180 Minutes)</span>
                </div>
                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  Under IRCTC policy, passenger is legally entitled to 100% full refund or free zero-penalty rescheduling to any available train on the same corridor.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Copilot Proactive Remediation Actions */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Copilot Proactive Remediation Suite
          </h3>

          {/* Action Card 1: Free Rescheduling to Alternative Corridor Train */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-950">
                  Option 1: Free 1-Tap Reschedule to Vande Bharat
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                ₹0 Reschedule Penalty
              </span>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed">
              Reschedule directly to <strong>Train 20607 Vande Bharat Express (Dep: 05:50 AM from MAS)</strong>.
              Automated seat exchange confirmed in Executive Chair Car with zero extra fare.
            </p>

            {!rescheduled ? (
              <button
                onClick={handleReschedule}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Confirm Free Reschedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Rescheduled to Vande Bharat Express (Seat C3-14)</span>
              </div>
            )}
          </div>

          {/* Action Card 2: Station Retiring Room / Pod Bed Booking */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-purple-950">
                  Option 2: 1-Tap Station Retiring Room / Waiting Lounge
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-200 text-purple-900 text-[10px] font-bold">
                Disruption Tariff: ₹150 / 3 hrs
              </span>
            </div>

            <p className="text-xs text-purple-900 leading-relaxed">
              Book an AC Executive Pod Bed or Retiring Room at KSR Bengaluru City (SBC) Platform 1 while awaiting revised departure.
            </p>

            {!retiringRoomBooked ? (
              <button
                onClick={handleBookRoom}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Book SBC Executive Pod (Bed #12)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="p-2.5 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pod Bed #12 Reserved at SBC Platform 1 (Keycard PIN: 8492)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
