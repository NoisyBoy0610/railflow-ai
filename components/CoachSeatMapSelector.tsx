'use client';

import React, { useState } from 'react';
import { Bed, Users, ShieldCheck, CheckCircle2, Info, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { soundEffects } from '@/lib/audio';

export type CoachClassType = '3A' | '2A' | 'CC' | 'SL';

interface BerthInfo {
  number: number;
  type: 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WS' | 'MS' | 'AS';
  label: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'SENIOR_SS' | 'LADIES_LD' | 'SELECTED';
  fare: number;
}

export const CoachSeatMapSelector: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<CoachClassType>('3A');
  const [selectedCoachCode, setSelectedCoachCode] = useState<string>('B2');
  const [selectedBerths, setSelectedBerths] = useState<number[]>([17, 18]);
  const maxSelections = 4;

  // Generate 72-berth LHB 3-Tier AC coach layout
  const generateBerths = (coachClass: CoachClassType): BerthInfo[] => {
    const berths: BerthInfo[] = [];
    const count = coachClass === '2A' ? 54 : coachClass === 'CC' ? 78 : 72;

    for (let i = 1; i <= count; i++) {
      let type: BerthInfo['type'] = 'LB';
      let label = 'Lower';

      if (coachClass === '3A' || coachClass === 'SL') {
        const mod = i % 8;
        if (mod === 1 || mod === 4) { type = 'LB'; label = 'Lower'; }
        else if (mod === 2 || mod === 5) { type = 'MB'; label = 'Middle'; }
        else if (mod === 3 || mod === 6) { type = 'UB'; label = 'Upper'; }
        else if (mod === 7) { type = 'SL'; label = 'Side Lower'; }
        else if (mod === 0) { type = 'SU'; label = 'Side Upper'; }
      } else if (coachClass === '2A') {
        const mod = i % 6;
        if (mod === 1 || mod === 3) { type = 'LB'; label = 'Lower'; }
        else if (mod === 2 || mod === 4) { type = 'UB'; label = 'Upper'; }
        else if (mod === 5) { type = 'SL'; label = 'Side Lower'; }
        else if (mod === 0) { type = 'SU'; label = 'Side Upper'; }
      } else {
        // Chair Car
        const mod = i % 5;
        if (mod === 1 || mod === 0) { type = 'WS'; label = 'Window'; }
        else if (mod === 2 || mod === 4) { type = 'AS'; label = 'Aisle'; }
        else { type = 'MS'; label = 'Middle'; }
      }

      // Determine initial mock occupancy status
      let status: BerthInfo['status'] = 'AVAILABLE';
      if (selectedBerths.includes(i)) {
        status = 'SELECTED';
      } else if (i === 1 || i === 9 || i === 25 || i === 33 || i === 41) {
        status = 'SENIOR_SS';
      } else if (i === 5 || i === 21 || i === 37) {
        status = 'LADIES_LD';
      } else if (i % 3 === 0 || i === 12 || i === 19 || i === 44 || i === 52) {
        status = 'OCCUPIED';
      }

      const fare = coachClass === '2A' ? 2150 : coachClass === '3A' ? 1450 : coachClass === 'CC' ? 1120 : 540;

      berths.push({ number: i, type, label, status, fare });
    }
    return berths;
  };

  const berths = generateBerths(selectedClass);

  const handleBerthClick = (b: BerthInfo) => {
    if (b.status === 'OCCUPIED') {
      soundEffects.playAlert();
      return;
    }

    soundEffects.playTick();
    if (selectedBerths.includes(b.number)) {
      setSelectedBerths(selectedBerths.filter(n => n !== b.number));
    } else {
      if (selectedBerths.length >= maxSelections) {
        soundEffects.playAlert();
        return;
      }
      setSelectedBerths([...selectedBerths, b.number]);
    }
  };

  const baseFarePerBerth = selectedClass === '2A' ? 2150 : selectedClass === '3A' ? 1450 : selectedClass === 'CC' ? 1120 : 540;
  const totalAmount = baseFarePerBerth * selectedBerths.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  Interactive Rake Map
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Visual Coach Blueprint & Berth Selector
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time LHB Coach blueprint • Choose preferred Lower, Middle, Upper, or Side berths with quota tags
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-white">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-white">
              <span className="w-3 h-3 rounded-xs bg-orange-500 ring-2 ring-white"></span> Selected
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-white">
              <span className="w-3 h-3 rounded-xs bg-blue-500"></span> Senior SS
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-white">
              <span className="w-3 h-3 rounded-xs bg-purple-500"></span> Ladies LD
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-white">
              <span className="w-3 h-3 rounded-xs bg-slate-600"></span> Booked
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class Type</label>
              <div className="flex gap-1 bg-white p-1 border border-slate-300 rounded-lg">
                {(['3A', '2A', 'CC', 'SL'] as CoachClassType[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedClass(c);
                      setSelectedBerths([]);
                      soundEffects.playTick();
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      selectedClass === c ? 'bg-[#0B2545] text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Coach Number</label>
              <select
                value={selectedCoachCode}
                onChange={(e) => {
                  setSelectedCoachCode(e.target.value);
                  setSelectedBerths([]);
                  soundEffects.playTick();
                }}
                className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="B1">Coach B1</option>
                <option value="B2">Coach B2 (Selected Rake)</option>
                <option value="B3">Coach B3</option>
                <option value="B4">Coach B4</option>
                <option value="B5">Coach B5</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">
              Selected Berths: <strong className="text-slate-900">{selectedBerths.length} / {maxSelections} Max</strong>
            </span>
            <span className="text-xs font-mono font-black text-emerald-700">
              Total Fare: ₹{totalAmount}
            </span>
          </div>
        </div>

        {/* Realistic LHB Railway Coach Blueprint Viewport */}
        <div className="overflow-x-auto p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
          <div className="min-w-[850px] space-y-4">
            {/* Coach Exterior Frame Top */}
            <div className="flex items-center justify-between px-6 py-2 bg-slate-800 rounded-t-xl text-slate-400 text-xs font-mono">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                INDIAN RAILWAYS LHB COACH • [{selectedCoachCode}] • {selectedClass} TIER
              </span>
              <span>VESTIBULE DOOR ➔</span>
            </div>

            {/* Coach Bays Interior Grid */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-6">
              {/* 3A/SL Bay-by-Bay Layout */}
              <div className="grid grid-cols-9 gap-3">
                {Array.from({ length: Math.ceil(berths.length / 8) }).map((_, bayIdx) => {
                  const bayBerths = berths.slice(bayIdx * 8, bayIdx * 8 + 8);
                  return (
                    <div key={bayIdx} className="bg-slate-900/90 border border-slate-800 p-2 rounded-xl space-y-2">
                      <span className="text-[9px] font-mono font-bold text-slate-400 block text-center border-b border-slate-800 pb-1">
                        BAY #{bayIdx + 1}
                      </span>

                      {/* Main 6 Berths Section */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {bayBerths.slice(0, 6).map((b) => {
                          const isSelected = selectedBerths.includes(b.number);
                          return (
                            <button
                              key={b.number}
                              onClick={() => handleBerthClick(b)}
                              disabled={b.status === 'OCCUPIED'}
                              className={`p-2 rounded-lg text-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                isSelected
                                  ? 'bg-orange-500 text-white ring-2 ring-white shadow-md scale-105'
                                  : b.status === 'SENIOR_SS'
                                  ? 'bg-blue-600/40 text-blue-200 border border-blue-500/50 hover:bg-blue-600/60'
                                  : b.status === 'LADIES_LD'
                                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/50 hover:bg-purple-600/60'
                                  : b.status === 'OCCUPIED'
                                  ? 'bg-slate-800 text-slate-500'
                                  : 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/60'
                              }`}
                            >
                              <div className="font-mono font-black text-xs">{b.number}</div>
                              <div className="text-[9px] font-semibold opacity-90">{b.type}</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Gangway Aisle Gap */}
                      <div className="py-0.5 border-t border-dashed border-slate-800 text-[8px] font-mono text-slate-600 text-center uppercase">
                        Aisle
                      </div>

                      {/* Side 2 Berths Section */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {bayBerths.slice(6, 8).map((b) => {
                          const isSelected = selectedBerths.includes(b.number);
                          return (
                            <button
                              key={b.number}
                              onClick={() => handleBerthClick(b)}
                              disabled={b.status === 'OCCUPIED'}
                              className={`p-1.5 rounded-lg text-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                isSelected
                                  ? 'bg-orange-500 text-white ring-2 ring-white shadow-md scale-105'
                                  : b.status === 'OCCUPIED'
                                  ? 'bg-slate-800 text-slate-500'
                                  : 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/60'
                              }`}
                            >
                              <div className="font-mono font-black text-xs">{b.number}</div>
                              <div className="text-[9px] font-semibold opacity-90">{b.type}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coach Frame Bottom */}
            <div className="flex items-center justify-between px-6 py-2 bg-slate-800 rounded-b-xl text-slate-400 text-xs font-mono">
              <span>LAVATORY / EMERGENCY WINDOW</span>
              <span>EMERGENCY EXIT ➔</span>
            </div>
          </div>
        </div>

        {/* Selection Confirmation Bar */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs text-emerald-950 block">
                Selected Berths in Coach {selectedCoachCode}:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedBerths.length === 0 ? (
                  <span className="text-xs text-emerald-700 italic">No berths selected. Click any green berth on the coach map.</span>
                ) : (
                  selectedBerths.map((num) => {
                    const b = berths.find(item => item.number === num);
                    return (
                      <span key={num} className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-mono font-black rounded-lg">
                        Berth {num} ({b?.type} - {b?.label})
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => soundEffects.playConfirmationChime()}
            disabled={selectedBerths.length === 0}
            className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Lock Berths & Proceed (₹{totalAmount})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
