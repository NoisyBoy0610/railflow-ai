'use client';

import React, { useState } from 'react';
import { Users, UserCheck, CheckCircle2, Sparkles, Heart, Plus, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Passenger } from '@/lib/types';
import { soundEffects } from '@/lib/audio';

export const Subsystem6_SeniorBerthAllocator: React.FC = () => {
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', name: 'Ramesh Sundaram', age: 68, gender: 'M', berthPreference: 'L', foodPreference: 'Veg' },
    { id: '2', name: 'Kalyani Sundaram', age: 64, gender: 'F', berthPreference: 'L', foodPreference: 'Veg' },
    { id: '3', name: 'Arjun Sundaram', age: 34, gender: 'M', berthPreference: 'U', foodPreference: 'Non-Veg' },
    { id: '4', name: 'Ananya Sundaram', age: 7, gender: 'F', berthPreference: 'M', foodPreference: 'Veg' },
  ]);

  const [isAllocated, setIsAllocated] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newAge, setNewAge] = useState<number>(30);
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');

  const addPassenger = () => {
    if (!newName.trim()) return;
    const p: Passenger = {
      id: Date.now().toString(),
      name: newName.trim(),
      age: newAge,
      gender: newGender,
      berthPreference: 'NONE',
      foodPreference: 'Veg'
    };
    setPassengers([...passengers, p]);
    setNewName('');
    setIsAllocated(false);
    soundEffects.playTick();
  };

  const removePassenger = (id: string) => {
    setPassengers(passengers.filter(p => p.id !== id));
    setIsAllocated(false);
  };

  const handleRunAllocation = () => {
    setIsAllocated(true);
    soundEffects.playConfirmationChime();
  };

  // Compute allocation logic
  const seniors = passengers.filter(p => (p.gender === 'M' && p.age >= 60) || (p.gender === 'F' && p.age >= 45));
  const younger = passengers.filter(p => !((p.gender === 'M' && p.age >= 60) || (p.gender === 'F' && p.age >= 45)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 6
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Senior Citizen & Family Berth Proximity Allocator
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatic M60+/F45+ Lower Berth & Senior Citizen Quota (SS) mapping with adjacent family compartment clustering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Senior Friendly Guarantee</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Passenger Management */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Passenger Matrix ({passengers.length} Booked)
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">
              {seniors.length} Senior Citizens Detected
            </span>
          </div>

          {/* Passenger list */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {passengers.map((p) => {
              const isSenior = (p.gender === 'M' && p.age >= 60) || (p.gender === 'F' && p.age >= 45);
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isSenior
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSenior ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {p.gender}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{p.name}</span>
                        {isSenior && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold text-[9px] uppercase">
                            Senior Citizen (SS)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Age {p.age} • {p.foodPreference}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removePassenger(p.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Add Form */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Add Another Passenger to Family Group:
            </span>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-6 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Age"
                value={newAge}
                onChange={(e) => setNewAge(parseInt(e.target.value) || 0)}
                className="col-span-3 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as 'M' | 'F')}
                className="col-span-3 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <button
              onClick={addPassenger}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Family Matrix</span>
            </button>
          </div>

          <button
            onClick={handleRunAllocation}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run AI Berth Proximity & Senior Quota Allocator</span>
          </button>
        </div>

        {/* Right Column: Visual Coach Compartment Map */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Coach B2 (3AC)</span>
                <h4 className="text-xs font-bold text-white">Compartment Bay 2 Co-location Plan</h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                Adjacent Berth Clustering: 100%
              </span>
            </div>

            {/* Coach Layout Visualizer */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
              {/* Left Bay (Main Cabin) */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block text-center">
                  Main 6-Berth Bay
                </span>
                
                {/* Lower Berth */}
                <div className="p-2 rounded bg-emerald-900/60 border border-emerald-500 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 block">Berth 17 (Lower Berth)</span>
                    <span className="font-semibold text-xs">
                      {seniors[0] ? seniors[0].name : 'Ramesh Sundaram (M68)'}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-[9px] font-bold">
                    AUTO LB
                  </span>
                </div>

                {/* Middle Berth */}
                <div className="p-2 rounded bg-slate-800 border border-slate-600 text-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Berth 18 (Middle Berth)</span>
                    <span className="font-semibold text-xs">
                      {seniors[1] ? seniors[1].name : 'Kalyani Sundaram (F64)'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">CO-LOCATED</span>
                </div>

                {/* Upper Berth */}
                <div className="p-2 rounded bg-slate-800 border border-slate-600 text-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Berth 19 (Upper Berth)</span>
                    <span className="font-semibold text-xs">
                      {younger[0] ? younger[0].name : 'Arjun Sundaram (M34)'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">UB</span>
                </div>
              </div>

              {/* Right Bay (Side Berths) */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block text-center">
                  Side Berth Bay
                </span>

                {/* Side Lower */}
                <div className="p-2 rounded bg-emerald-900/40 border border-emerald-600/60 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 block">Berth 23 (Side Lower)</span>
                    <span className="font-semibold text-xs">
                      {passengers[3] ? passengers[3].name : 'Ananya Sundaram (F7)'}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-800 text-[9px] font-bold">
                    ADJACENT
                  </span>
                </div>

                {/* Side Upper */}
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700 text-slate-400 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Berth 24 (Side Upper)</span>
                    <span className="text-xs italic">Other Passenger</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">VACANT</span>
                </div>
              </div>
            </div>

            {/* Smart Benefit Callouts */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero climbing for Senior Citizens (Guaranteed Lower Berths)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Entire family placed in same coach B2 within 2 feet of each other</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
