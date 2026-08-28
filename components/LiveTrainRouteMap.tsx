'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Train, MapPin, Gauge, Radio, CloudRain, ShieldCheck, Clock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { TRAINS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';

export const LiveTrainRouteMap: React.FC = () => {
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12952');
  const [currentProgress, setCurrentProgress] = useState<number>(62); // percentage along route
  const [speedKmh, setSpeedKmh] = useState<number>(128);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const train = TRAINS.find(t => t.number === selectedTrainNumber) || TRAINS[0];

  // Route milestones for selected train
  const milestones = [
    { code: 'NDLS', name: 'New Delhi', km: 0, time: '16:55', status: 'DEPARTED' },
    { code: 'MTJ', name: 'Mathura Jn', km: 141, time: '18:03', status: 'DEPARTED' },
    { code: 'KOTA', name: 'Kota Jn', km: 465, time: '21:30', status: 'PASSED' },
    { code: 'RTM', name: 'Ratlam Jn', km: 732, time: '00:25', status: 'CURRENT_APPROACH' },
    { code: 'BRC', name: 'Vadodara Jn', km: 992, time: '03:40', status: 'UPCOMING' },
    { code: 'ST', name: 'Surat', km: 1122, time: '05:18', status: 'UPCOMING' },
    { code: 'MMCT', name: 'Mumbai Central', km: 1386, time: '08:35', status: 'UPCOMING' },
  ];

  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      timer = setInterval(() => {
        setSpeedKmh(Math.floor(124 + Math.random() * 12));
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-slate-950 text-[10px] font-black uppercase">
                  ISRO RTIS Telemetry
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Live Geo-Spatial Train Radar & Track Map
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time locomotive GPS tracking, live speed gauge, route milestones, and block signal status
              </p>
            </div>
          </div>

          {/* Speed & Signal Badges */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Live Speed</span>
              <span className="text-base font-black text-amber-400">{speedKmh} km/h</span>
            </div>

            <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-700 text-center font-mono">
              <span className="text-[10px] text-emerald-400 uppercase block">Signal Aspect</span>
              <span className="text-xs font-black text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> GREEN (Clear)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Train Selector & Telemetry Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700 uppercase">Monitored Train:</label>
            <select
              value={selectedTrainNumber}
              onChange={(e) => {
                setSelectedTrainNumber(e.target.value);
                soundEffects.playTick();
              }}
              className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
            >
              {TRAINS.map(t => (
                <option key={t.number} value={t.number}>
                  {t.number} - {t.name} ({t.source} ➔ {t.destination})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-600">
              Loco Engine: <strong className="text-slate-900">WAP-7 #30482 (GZB)</strong>
            </span>
            <span className="text-slate-600">
              Rake Type: <strong className="text-slate-900">22 LHB Coaches</strong>
            </span>
          </div>
        </div>

        {/* Geo-Spatial Visual Track Progression Card */}
        <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
            <span className="text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE TRACK POSITION: 732 KM FROM ORIGIN
            </span>
            <span className="text-slate-400">
              NEXT HALT: RATLAM JN (RTM) • IN 14 MINS (22 KM)
            </span>
          </div>

          {/* Track Progression Line with Halts */}
          <div className="relative py-8 px-4">
            {/* The Track Line */}
            <div className="absolute top-1/2 left-4 right-4 h-2 bg-slate-800 rounded-full -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-4 h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-orange-500 rounded-full -translate-y-1/2 transition-all duration-1000"
              style={{ width: `${currentProgress}%` }}
            ></div>

            {/* Milestones Markers */}
            <div className="relative flex items-center justify-between">
              {milestones.map((m, idx) => {
                const isPassed = m.status === 'DEPARTED' || m.status === 'PASSED';
                const isCurrent = m.status === 'CURRENT_APPROACH';
                return (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-black border-2 transition-all ${
                      isCurrent
                        ? 'bg-orange-500 text-white border-white ring-4 ring-orange-500/50 scale-125'
                        : isPassed
                        ? 'bg-emerald-500 text-white border-emerald-300'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {isCurrent ? <Train className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="text-center mt-3">
                      <span className="font-bold text-xs text-white block">{m.code}</span>
                      <span className="text-[10px] text-slate-400 block">{m.name}</span>
                      <span className="text-[9px] font-mono text-amber-300 block mt-0.5">{m.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environmental Telemetry Sensors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Weather & Visibility</span>
                <span className="font-bold text-white">Clear • 4.8 km Visibility</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl flex items-center gap-3">
              <Gauge className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">KAVACH Collision Shield</span>
                <span className="font-bold text-emerald-400">ACTIVE & SYNCED</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl flex items-center gap-3">
              <Radio className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Section Controller</span>
                <span className="font-bold text-white">Western Railway (Vadodara Div)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
