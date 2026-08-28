'use client';

import React, { useState } from 'react';
import { Accessibility, ShoppingBag, Truck, Utensils, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Phone, MapPin, IndianRupee } from 'lucide-react';
import { STATIONS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';
import { validateIndianMobile } from '@/lib/validation';
import confetti from 'canvas-confetti';

export const Subsystem9_StationConcierge: React.FC = () => {
  const [selectedStationCode, setSelectedStationCode] = useState<string>('SBC');
  const [selectedService, setSelectedService] = useState<'COOLIE' | 'BUGGY' | 'WHEELCHAIR' | 'MEAL'>('COOLIE');
  const [luggageWeightKg, setLuggageWeightKg] = useState<number>(40);
  const [platformNumber, setPlatformNumber] = useState<string>('PF 1');
  const [coachNumber, setCoachNumber] = useState<string>('B2');
  const [phone, setPhone] = useState<string>('9876543210');

  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingToken, setBookingToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Regulated government tariff rates
  const getTariff = () => {
    if (selectedService === 'COOLIE') {
      return luggageWeightKg <= 40 ? 150 : 280;
    }
    if (selectedService === 'BUGGY') return 50;
    if (selectedService === 'WHEELCHAIR') return 0;
    return 180;
  };

  const handleBook = () => {
    setErrorMessage(null);
    const phoneVal = validateIndianMobile(phone);
    if (!phoneVal.isValid) {
      setErrorMessage(phoneVal.error || 'Invalid phone');
      soundEffects.playAlert();
      return;
    }

    const token = 'CONCIERGE-' + selectedStationCode + '-' + Math.floor(1000 + Math.random() * 9000);
    setBookingToken(token);
    setIsBooked(true);
    confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    soundEffects.playConfirmationChime();
  };

  const stationName = STATIONS.find(s => s.code === selectedStationCode)?.name || selectedStationCode;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Accessibility className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold uppercase">
                  Station Services
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Station Concierge, Buggy & Coolie Porter Booking
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
        {/* Left Column: Service Selector Form */}
        <div className="lg:col-span-7 space-y-4">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Station & Service Selection */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase block">1. Select Station & Service</span>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Railway Station</label>
              <select
                value={selectedStationCode}
                onChange={(e) => {
                  setSelectedStationCode(e.target.value);
                  setIsBooked(false);
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                {STATIONS.map(s => (
                  <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setSelectedService('COOLIE'); setIsBooked(false); soundEffects.playTick(); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedService === 'COOLIE' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200'
                }`}
              >
                <ShoppingBag className={`w-5 h-5 mb-1 ${selectedService === 'COOLIE' ? 'text-orange-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-800">Licensed Coolie / Porter</div>
                <div className="text-[10px] text-slate-500">Regulated Weight Tariff</div>
              </button>

              <button
                onClick={() => { setSelectedService('BUGGY'); setIsBooked(false); soundEffects.playTick(); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedService === 'BUGGY' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200'
                }`}
              >
                <Truck className={`w-5 h-5 mb-1 ${selectedService === 'BUGGY' ? 'text-orange-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-800">Electric Battery Buggy</div>
                <div className="text-[10px] text-slate-500">Seniors / Divyang Transit</div>
              </button>

              <button
                onClick={() => { setSelectedService('WHEELCHAIR'); setIsBooked(false); soundEffects.playTick(); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedService === 'WHEELCHAIR' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200'
                }`}
              >
                <Accessibility className={`w-5 h-5 mb-1 ${selectedService === 'WHEELCHAIR' ? 'text-orange-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-800">Wheelchair Assistance</div>
                <div className="text-[10px] text-slate-500">Free Ministry Service</div>
              </button>

              <button
                onClick={() => { setSelectedService('MEAL'); setIsBooked(false); soundEffects.playTick(); }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedService === 'MEAL' ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20' : 'bg-white border-slate-200'
                }`}
              >
                <Utensils className={`w-5 h-5 mb-1 ${selectedService === 'MEAL' ? 'text-orange-600' : 'text-slate-500'}`} />
                <div className="text-xs font-bold text-slate-800">Seat e-Catering Delivery</div>
                <div className="text-[10px] text-slate-500">IRCTC Food Platter</div>
              </button>
            </div>
          </div>

          {/* Location & Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase block">2. Meetup Location & Contact</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Platform #</label>
                <select
                  value={platformNumber}
                  onChange={(e) => setPlatformNumber(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                >
                  <option value="PF 1">Platform 1 (Main Concourse)</option>
                  <option value="PF 2">Platform 2</option>
                  <option value="PF 3">Platform 3</option>
                  <option value="PF 4">Platform 4</option>
                  <option value="PF 5">Platform 5</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Coach Code</label>
                <input
                  type="text"
                  value={coachNumber}
                  onChange={(e) => setCoachNumber(e.target.value)}
                  placeholder="e.g. B2, S4, HA1"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Passenger Contact Mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Tariff & Confirmation Receipt */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
              Govt Regulated Tariff Summary
            </span>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Selected Service:</span>
                <span className="font-bold text-white uppercase">{selectedService}</span>
              </div>
              <div className="flex justify-between">
                <span>Station:</span>
                <span className="text-white">{stationName}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform & Coach:</span>
                <span className="font-mono text-white">{platformNumber} • Coach {coachNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                <span>Regulated Fee:</span>
                <span className="font-mono text-emerald-400">
                  {getTariff() === 0 ? 'FREE (Govt Sponsored)' : `₹${getTariff()}`}
                </span>
              </div>
            </div>

            {isBooked ? (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl space-y-1 text-center animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-emerald-300">Concierge Service Booked!</div>
                <p className="text-[11px] text-white font-mono">Token: {bookingToken}</p>
                <p className="text-[10px] text-slate-300 mt-1">
                  Verified Porter (Badge #842) will meet you at Coach {coachNumber} on {platformNumber}.
                </p>
              </div>
            ) : (
              <button
                onClick={handleBook}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Confirm & Book Concierge ({getTariff() === 0 ? 'Free' : `₹${getTariff()}`})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
