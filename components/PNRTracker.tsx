'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, ShieldCheck, UserCheck, Train, MapPin, QrCode, ArrowRight, Share2 } from 'lucide-react';
import { MOCK_PNRS } from '@/lib/mockData';
import { PNRRecord } from '@/lib/types';
import { soundEffects } from '@/lib/audio';

export const PNRTracker: React.FC = () => {
  const [inputPnr, setInputPnr] = useState<string>('821-4928103');
  const [activeRecord, setActiveRecord] = useState<PNRRecord | null>(MOCK_PNRS['821-4928103']);
  const [searched, setSearched] = useState<boolean>(true);

  const handleSearch = () => {
    soundEffects.playTick();
    const clean = inputPnr.trim();
    if (MOCK_PNRS[clean]) {
      setActiveRecord(MOCK_PNRS[clean]);
    } else {
      // Generate synthetic record
      setActiveRecord({
        pnr: clean,
        trainNumber: '12658',
        trainName: 'Chennai Mail Express',
        source: 'SBC',
        destination: 'MAS',
        travelDate: '2026-08-28',
        classType: '3A',
        quota: 'GN',
        bookingStatus: 'CNF',
        chartPrepared: true,
        farePaid: 1470,
        passengers: [
          { id: '1', name: 'Ramesh Sundaram', age: 67, gender: 'M', berthPreference: 'L', allocatedBerth: 'B2-12 (LB)', allocatedCoach: 'B2', isSeniorCitizen: true, foodPreference: 'Veg' }
        ]
      });
    }
    setSearched(true);
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="space-y-6">
      {/* PNR Search Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="max-w-xl mx-auto space-y-3 text-center">
          <h3 className="text-base font-black text-slate-900">
            Synthetic PNR & Coach Visualizer Radar
          </h3>
          <p className="text-xs text-slate-500">
            Enter any 10-digit PNR to inspect live chart status, coach berth placement, and passenger allocations.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 821-4928103, 412-9850123, 654-1029384"
              value={inputPnr}
              onChange={(e) => setInputPnr(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup PNR</span>
            </button>
          </div>

          {/* Preset chips */}
          <div className="flex flex-wrap justify-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">Quick Demos:</span>
            {Object.keys(MOCK_PNRS).map((pnrKey) => (
              <button
                key={pnrKey}
                onClick={() => {
                  setInputPnr(pnrKey);
                  setActiveRecord(MOCK_PNRS[pnrKey]);
                  soundEffects.playTick();
                }}
                className="font-mono text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 transition-colors"
              >
                {pnrKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PNR Details Display */}
      {activeRecord && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#0F2C59] p-5 text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                PNR: {activeRecord.pnr}
              </span>
              <h2 className="text-lg font-black text-white">
                {activeRecord.trainName} ({activeRecord.trainNumber})
              </h2>
              <p className="text-xs text-slate-300">
                {activeRecord.source} ➔ {activeRecord.destination} • Date: {activeRecord.travelDate} • Class {activeRecord.classType} ({activeRecord.quota})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1 ${
                activeRecord.bookingStatus === 'CNF'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                STATUS: {activeRecord.bookingStatus}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeRecord.chartPrepared
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {activeRecord.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}
              </span>
            </div>
          </div>

          {/* Passenger Ledger */}
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Passenger Manifest ({activeRecord.passengers.length} Passengers)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeRecord.passengers.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F2C59] text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{p.name}</span>
                      {p.isSeniorCitizen && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold text-[9px] uppercase">
                          Senior
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {p.gender} • Age {p.age} • Meal: {p.foodPreference}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Seat Status</span>
                    <span className="font-mono font-black text-sm text-emerald-700 block">
                      {p.allocatedBerth}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Coach {p.allocatedCoach}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coach Visual Placement */}
            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
                <span className="text-orange-400 font-bold">Interactive Coach Position on Train Rake:</span>
                <span className="text-slate-400 font-mono text-[11px]">Loco ➔ SLR ➔ GEN ➔ S1 ➔ B1 ➔ [B2] ➔ B3 ➔ A1</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Coach <strong>B2</strong> will halt approximately 110 meters from the station main entrance foot-over-bridge (Platform 4).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
