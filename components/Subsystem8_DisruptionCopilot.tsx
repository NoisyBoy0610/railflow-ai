'use client';

import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Bed, ArrowRight, ShieldCheck, Clock, CheckCircle2, Train, MapPin, Zap, Utensils, Hotel, Check } from 'lucide-react';
import { TRAINS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';
import confetti from 'canvas-confetti';

export const Subsystem8_DisruptionCopilot: React.FC = () => {
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12658');
  const [delayMinutes, setDelayMinutes] = useState<number>(215);
  const [rescheduledTrain, setRescheduledTrain] = useState<string | null>(null);
  const [retiringRoomVoucher, setRetiringRoomVoucher] = useState<string | null>(null);
  const [mealVoucher, setMealVoucher] = useState<string | null>(null);

  const matchedTrain = TRAINS.find(t => t.number === selectedTrainNumber) || TRAINS[1];
  const isGazetteLate = delayMinutes >= 180;

  const handleReschedule = (targetTrainName: string) => {
    setRescheduledTrain(targetTrainName);
    confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    soundEffects.playConfirmationChime();
  };

  const handleBookRoom = () => {
    const voucher = 'ROOM-SBC-' + Math.floor(10000 + Math.random() * 90000);
    setRetiringRoomVoucher(voucher);
    soundEffects.playConfirmationChime();
  };

  const handleClaimMeal = () => {
    const voucher = 'MEAL-IRCTC-' + Math.floor(10000 + Math.random() * 90000);
    setMealVoucher(voucher);
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold uppercase">
                  Real-Time Protection
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Live Train Disruption & Rescheduling Copilot
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Proactive intelligence triggered on &gt;3hr delays or route diversions with 1-tap free rescheduling & retiring rooms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-rose-500/20 px-3.5 py-1.5 rounded-xl border border-rose-400/30 text-rose-300 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>LIVE TELEMETRY ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Train & Delay Parameter Controls */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <span className="text-xs font-bold text-slate-800 uppercase block">
            1. Select Active Train & Adjust Live Delay Minutes:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Monitored Train</label>
              <select
                value={selectedTrainNumber}
                onChange={(e) => {
                  setSelectedTrainNumber(e.target.value);
                  setRescheduledTrain(null);
                  setRetiringRoomVoucher(null);
                  setMealVoucher(null);
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                {TRAINS.map(t => (
                  <option key={t.number} value={t.number}>
                    {t.number} - {t.name} ({t.source} ➔ {t.destination})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Live Running Delay</label>
                <span className={`text-xs font-mono font-bold ${delayMinutes >= 180 ? 'text-rose-600' : 'text-amber-600'}`}>
                  {Math.floor(delayMinutes / 60)}h {delayMinutes % 60}m Delay ({delayMinutes} Mins)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={5}
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Live Disruption Reaction Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Status Card */}
          <div className="lg:col-span-5 p-5 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Current Train Telemetry</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                isGazetteLate ? 'bg-rose-600 text-white' : delayMinutes > 30 ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {isGazetteLate ? 'CRITICAL DELAY (>3H)' : delayMinutes > 30 ? 'MODERATE DELAY' : 'ON TIME'}
              </span>
            </div>

            <div>
              <h3 className="font-black text-sm text-white">{matchedTrain.name}</h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Train #{matchedTrain.number} • Current Location: {matchedTrain.currentLocationStation || 'CNB'}
              </p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Scheduled Departure:</span>
                <span className="font-mono text-white">{matchedTrain.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Rescheduled Departure:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {delayMinutes > 0 ? `+${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m Revised` : 'Nominal'}
                </span>
              </div>
            </div>

            {isGazetteLate ? (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 space-y-1">
                <div className="font-bold">⚠️ Gazette Rule 14.1 Threshold Triggered:</div>
                <p className="text-[11px] text-rose-200">
                  Delay exceeds 3 hours. Passenger qualifies for 100% full refund with 0 clerkage fee or free 1-tap transfer.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                ✅ Train running within normal operational variance.
              </div>
            )}
          </div>

          {/* Actionable Remedies */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase block">
              Automated Disruption Protections Available:
            </span>

            {/* Remedy 1: Free Reschedule */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-xs text-slate-900">1. Free Rescheduling to Alternative Superfast</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                  ₹0 Surcharge Waived
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Transfer your confirmed booking to <strong>20607 Vande Bharat Express</strong> departing at next available slot.
              </p>

              {rescheduledTrain ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Rescheduled to {rescheduledTrain}! New Boarding Pass Issued.</span>
                </div>
              ) : (
                <button
                  onClick={() => handleReschedule('20607 Vande Bharat Express')}
                  disabled={!isGazetteLate}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <span>1-Tap Free Reschedule to Vande Bharat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Remedy 2: Retiring Room Voucher */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900">2. Free Station AC Retiring Room Voucher</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">
                  Comfort Transit
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Claim free AC Executive Lounge / Retiring Room bed at origin station during long delay halt.
              </p>

              {retiringRoomVoucher ? (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-bold flex items-center justify-between">
                  <span>Room #12 Assigned • Keyless Voucher: {retiringRoomVoucher}</span>
                </div>
              ) : (
                <button
                  onClick={handleBookRoom}
                  disabled={!isGazetteLate}
                  className="px-4 py-2 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Bed className="w-3.5 h-3.5" />
                  <span>Claim Free Retiring Room Voucher</span>
                </button>
              )}
            </div>

            {/* Remedy 3: Free Meal Voucher */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900">3. IRCTC Delay Catering Meal Token</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                  Free Refreshment
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Under Railway Board circular, delays &gt;2 hours entitle passengers to complimentary pantry meal & tea.
              </p>

              {mealVoucher ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-bold">
                  <span>Meal Token Redeemed! Token: {mealVoucher} (Present at Pantry Car)</span>
                </div>
              ) : (
                <button
                  onClick={handleClaimMeal}
                  disabled={delayMinutes < 120}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Claim Complimentary Meal Token</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
