'use client';

import React, { useState } from 'react';
import { Accessibility, CheckCircle2, ShieldCheck, ShoppingBag, Utensils, Zap, User, ArrowRight, IndianRupee } from 'lucide-react';
import { COOLIE_TARIFFS, MOCK_MEALS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';

export const Subsystem9_StationConcierge: React.FC = () => {
  const [selectedService, setSelectedService] = useState<'COOLIE' | 'BUGGY' | 'WHEELCHAIR' | 'MEAL'>('COOLIE');
  const [selectedTariff, setSelectedTariff] = useState(COOLIE_TARIFFS[0]);
  const [selectedMeal, setSelectedMeal] = useState(MOCK_MEALS[0]);
  const [pnr, setPnr] = useState<string>('821-4928103');
  const [coachBerth, setCoachBerth] = useState<string>('B2 - Berth 17');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingToken, setBookingToken] = useState<string>('');

  const handleBookService = () => {
    setIsBooked(true);
    const token = 'SC-' + Math.floor(10000 + Math.random() * 90000);
    setBookingToken(token);
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 9
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Single-Window Station Accessibility & Last-Mile Concierge
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Official Coolie tariff booking, battery transit buggies, wheelchair assistance, and seat-delivered IRCTC e-catering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Govt Regulated Tariff & Verified Badges</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Service Type Tabs */}
        <div className="lg:col-span-5 space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Station Service
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setSelectedService('COOLIE'); setIsBooked(false); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === 'COOLIE'
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className={`w-5 h-5 mb-1 ${selectedService === 'COOLIE' ? 'text-orange-600' : 'text-slate-500'}`} />
              <div className="text-xs font-bold text-slate-800">Licensed Coolie / Porter</div>
              <div className="text-[10px] text-slate-500">Official Weight Slab Tariff</div>
            </button>

            <button
              onClick={() => { setSelectedService('BUGGY'); setIsBooked(false); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === 'BUGGY'
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Zap className={`w-5 h-5 mb-1 ${selectedService === 'BUGGY' ? 'text-orange-600' : 'text-slate-500'}`} />
              <div className="text-xs font-bold text-slate-800">Electric Transit Buggy</div>
              <div className="text-[10px] text-slate-500">For Seniors & Disabled</div>
            </button>

            <button
              onClick={() => { setSelectedService('WHEELCHAIR'); setIsBooked(false); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === 'WHEELCHAIR'
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Accessibility className={`w-5 h-5 mb-1 ${selectedService === 'WHEELCHAIR' ? 'text-orange-600' : 'text-slate-500'}`} />
              <div className="text-xs font-bold text-slate-800">Wheelchair Assistance</div>
              <div className="text-[10px] text-slate-500">With Dedicated Attendant</div>
            </button>

            <button
              onClick={() => { setSelectedService('MEAL'); setIsBooked(false); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedService === 'MEAL'
                  ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Utensils className={`w-5 h-5 mb-1 ${selectedService === 'MEAL' ? 'text-orange-600' : 'text-slate-500'}`} />
              <div className="text-xs font-bold text-slate-800">Seat e-Catering</div>
              <div className="text-[10px] text-slate-500">Hot Meals to Your Berth</div>
            </button>
          </div>

          {/* Service Details Form */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Passenger PNR & Berth Details:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="PNR Number"
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                />
                <input
                  type="text"
                  value={coachBerth}
                  onChange={(e) => setCoachBerth(e.target.value)}
                  placeholder="Coach & Berth (e.g. B2-17)"
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tariff Card & Booking Confirmation */}
        <div className="lg:col-span-7 space-y-4">
          {selectedService === 'COOLIE' || selectedService === 'BUGGY' || selectedService === 'WHEELCHAIR' ? (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Regulated Railway Tariff Matrix
              </h4>

              <div className="space-y-2">
                {COOLIE_TARIFFS.map((t, idx) => (
                  <label
                    key={idx}
                    onClick={() => setSelectedTariff(t)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedTariff.slab === t.slab
                        ? 'bg-orange-50/80 border-orange-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.slab}</div>
                      <div className="text-[11px] text-slate-500">{t.timeLimit}</div>
                    </div>
                    <span className="text-sm font-black font-mono text-orange-600">
                      ₹{t.rate}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Hot Meal for Direct Seat Delivery
              </h4>

              <div className="space-y-2">
                {MOCK_MEALS.map((meal) => (
                  <label
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedMeal.id === meal.id
                        ? 'bg-orange-50/80 border-orange-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${meal.veg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                        <span className="text-xs font-bold text-slate-900">{meal.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Vendor: {meal.vendor}</span>
                    </div>
                    <span className="text-sm font-black font-mono text-orange-600 shrink-0 ml-2">
                      ₹{meal.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Trigger */}
          {!isBooked ? (
            <button
              onClick={handleBookService}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Confirm 1-Tap Booking & Assign Staff</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-md space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Station Service Dispatched</span>
                </div>
                <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  {bookingToken}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Assigned Porter: <strong>Manoj Kumar (Badge #142)</strong> • Meeting passenger at Coach {coachBerth} on Arrival.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
