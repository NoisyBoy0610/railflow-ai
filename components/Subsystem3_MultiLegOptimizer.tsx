'use client';

import React, { useState } from 'react';
import { GitFork, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { MOCK_MULTI_LEG_ROUTES } from '@/lib/mockData';
import { MultiLegRouteOption } from '@/lib/types';
import { soundEffects } from '@/lib/audio';

export const Subsystem3_MultiLegOptimizer: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<MultiLegRouteOption>(MOCK_MULTI_LEG_ROUTES[0]);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  const handleBookMultiLeg = () => {
    setIsBooked(true);
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 3
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Smart Multi-Leg & Break-Journey Routing Optimizer
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Graph pathfinder for guaranteed confirmed seats via Split-Seat & Junction Transfer when direct trains are WL/Regret
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Confirmed Berth Guarantee</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Route Selector Tabs */}
        <div className="flex flex-wrap gap-3">
          {MOCK_MULTI_LEG_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => {
                setSelectedRoute(route);
                setIsBooked(false);
              }}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                selectedRoute.id === route.id
                  ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  route.type === 'SPLIT_SEAT' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {route.type === 'SPLIT_SEAT' ? 'Option A: Same Train Split' : 'Option B: Junction Transfer'}
                </span>
                <span className="text-xs font-bold text-slate-900">{route.overallSource} ➔ {route.overallDestination}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {route.type === 'SPLIT_SEAT'
                  ? 'Zero train change • Change berth at Katpadi Jn • 100% CNF'
                  : 'Howrah Rajdhani + Vande Bharat via Kanpur • 100% CNF'}
              </p>
            </button>
          ))}
        </div>

        {/* Side-by-Side Comparison: Direct WL vs RailFlow Multi-Leg Route */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Legacy Direct Booking (Stuck in Waitlist) */}
          <div className="md:col-span-5 p-5 bg-rose-50/70 rounded-2xl border border-rose-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Legacy IRCTC Direct Ticket
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                HIGH RISK WL
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-rose-200 space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Direct Single Ticket ({selectedRoute.overallSource} to {selectedRoute.overallDestination})
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600 font-mono">
                  {selectedRoute.type === 'SPLIT_SEAT' ? 'GNWL 34' : 'GNWL 55'}
                </span>
                <span className="text-xs text-rose-700 font-medium">
                  {selectedRoute.type === 'SPLIT_SEAT' ? '(42% Confirmation Odds)' : '(30% Confirmation Odds)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cannot board if chart prepares with WL. Heavy risk of last-minute ticket cancellation.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tatkal Premium (If Available):</span>
                <span className="font-mono text-rose-600">+₹{selectedRoute.savingsVsTatkal || 450}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Guarantee:</span>
                <span className="font-bold text-rose-600">NO (WL Drop Risk)</span>
              </div>
            </div>
          </div>

          {/* RailFlow AI Multi-Leg Optimizer (100% Confirmed) */}
          <div className="md:col-span-7 p-5 bg-emerald-50/80 rounded-2xl border border-emerald-300 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                RailFlow Smart Multi-Leg Route
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-300" />
                100% Confirmed CNF
              </span>
            </div>

            {/* Legs detail */}
            <div className="space-y-2.5">
              {selectedRoute.legs.map((leg, index) => (
                <div key={index} className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{leg.trainName} ({leg.trainNumber})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {leg.seatStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">From</span>
                      <span className="font-bold text-slate-800">{leg.fromStation}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">{leg.departureTime}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">Allocated Berth</span>
                      <span className="font-bold text-emerald-700 text-xs block">{leg.allocatedCoachBerth}</span>
                      <span className="text-[10px] text-slate-400">Class {leg.classType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">To</span>
                      <span className="font-bold text-slate-800">{leg.toStation}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">{leg.arrivalTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Layover / Advantages */}
            {selectedRoute.layoverStation && (
              <div className="p-2.5 bg-purple-50 text-purple-900 rounded-xl border border-purple-200 text-xs flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                <span><strong>Station Layover:</strong> {selectedRoute.layoverDuration}</span>
              </div>
            )}

            <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                Why this route wins:
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {selectedRoute.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="pt-2 flex items-center justify-between border-t border-emerald-200">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Combined Fare:</span>
                <span className="text-lg font-black font-mono text-emerald-700">₹{selectedRoute.totalFare}</span>
              </div>

              {!isBooked ? (
                <button
                  onClick={handleBookMultiLeg}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>1-Click Multi-Leg Instant Book</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>2 Linked Tickets Confirmed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
