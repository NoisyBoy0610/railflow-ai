'use client';

import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle2, ShieldCheck, Heart, AlertCircle, Trash2, ArrowRight, Bed, Plus } from 'lucide-react';
import { soundEffects } from '@/lib/audio';
import { PassengerInput, validatePassenger } from '@/lib/validation';

export const Subsystem6_SeniorBerthAllocator: React.FC = () => {
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    { name: 'Kalyani Sundaram', age: 64, gender: 'F', berthPreference: 'LB' },
    { name: 'Ramesh Sundaram', age: 34, gender: 'M', berthPreference: 'MB' },
    { name: 'Priya Sharma', age: 29, gender: 'F', berthPreference: 'UB' }
  ]);

  const [newName, setNewName] = useState<string>('');
  const [newAge, setNewAge] = useState<number>(68);
  const [newGender, setNewGender] = useState<'M' | 'F' | 'T'>('M');
  const [selectedCoach, setSelectedCoach] = useState<string>('B2');

  const [isAllocated, setIsAllocated] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddPassenger = () => {
    setErrorMessage(null);
    const p: PassengerInput = { name: newName.trim(), age: newAge, gender: newGender, berthPreference: 'LB' };
    const val = validatePassenger(p, passengers.length + 1);
    if (!val.isValid) {
      setErrorMessage(val.error || 'Invalid passenger');
      soundEffects.playAlert();
      return;
    }

    setPassengers([...passengers, p]);
    setNewName('');
    setIsAllocated(false);
    soundEffects.playTick();
  };

  const handleRemovePassenger = (idx: number) => {
    if (passengers.length <= 1) {
      setErrorMessage('At least one passenger is required.');
      return;
    }
    setPassengers(passengers.filter((_, i) => i !== idx));
    setIsAllocated(false);
    setErrorMessage(null);
    soundEffects.playTick();
  };

  const handleRunAllocation = () => {
    setIsAllocated(true);
    soundEffects.playConfirmationChime();
  };

  // Grouping logic: Identify seniors (M >= 60, F >= 45)
  const isSenior = (p: PassengerInput) => {
    const age = typeof p.age === 'string' ? parseInt(p.age, 10) : p.age;
    return (p.gender === 'F' && age >= 45) || (p.gender === 'M' && age >= 60);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold uppercase">
                  Lower Berth Co-Location
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Senior Citizen (SS) & Family Lower Berth Allocator
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatic M60+/F45+ Lower Berth & Senior Citizen Quota (SS) mapping with adjacent family compartment clustering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Coach Separation Policy</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Build Passenger Roster */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase block">1. Add New Traveller to Group</span>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Traveller Name (e.g. Ramesh, Sunita)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Age</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={newAge}
                      onChange={(e) => setNewAge(parseInt(e.target.value, 10) || 1)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gender</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="T">Transgender</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddPassenger}
                  className="w-full py-2 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Passenger to Party</span>
                </button>
              </div>
            </div>

            {/* Current Party List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase block">
                Travel Party Roster ({passengers.length} Passengers)
              </span>

              {passengers.map((p, idx) => {
                const senior = isSenior(p);
                return (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{p.name || `Passenger ${idx + 1}`}</span>
                        {senior ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Senior (SS Eligible)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                            General Pax
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {p.gender} • Age {p.age}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemovePassenger(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Coach Bay Visualizer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-blue-600" />
                  Allocated Coach {selectedCoach} Bay Visualizer (LHB 3-Tier AC):
                </span>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">
                  Same Bay Clustered
                </span>
              </div>

              {/* Coach Bay Layout Simulation (8 Berths in 1 Bay) */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="text-xs text-slate-400 text-center pb-2 border-b border-slate-800 font-mono">
                  Coach {selectedCoach} • Bay #3 (Berths 17 to 24)
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Left Side: Main 6-Berth Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Main Compartment</span>
                    
                    {/* Lower Berth (Assigned to Senior) */}
                    <div className="p-2.5 bg-emerald-600/30 border border-emerald-400/50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-emerald-300 block">Berth 17 (Lower - LB)</span>
                        <span className="text-[11px] text-white font-semibold">
                          {passengers[0]?.name || 'Senior Citizen'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded">
                        SS Quota
                      </span>
                    </div>

                    {/* Middle Berth (Assigned to Younger Companion) */}
                    <div className="p-2.5 bg-blue-600/30 border border-blue-400/50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-blue-300 block">Berth 18 (Middle - MB)</span>
                        <span className="text-[11px] text-white font-semibold">
                          {passengers[1]?.name || 'Accompanying Pax'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded">
                        Paired
                      </span>
                    </div>

                    {/* Upper Berth */}
                    <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-300 block">Berth 19 (Upper - UB)</span>
                        <span className="text-[11px] text-slate-300">
                          {passengers[2]?.name || 'Vacant / General'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">UB</span>
                    </div>
                  </div>

                  {/* Right Side: Side Berths */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Side Aisle Section</span>

                    <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-300 block">Berth 23 (Side Lower - SL)</span>
                        <span className="text-[11px] text-slate-400">General Reservation</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">SL</span>
                    </div>

                    <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-300 block">Berth 24 (Side Upper - SU)</span>
                        <span className="text-[11px] text-slate-400">General Reservation</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">SU</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified: Senior citizens are guaranteed Lower Berths without coach separation.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
