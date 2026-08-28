'use client';

import React, { useState } from 'react';
import { Timer, Zap, CheckCircle2, AlertCircle, ShieldCheck, Clock, RefreshCw, ArrowRight, UserCheck, CreditCard, Lock, Sparkles } from 'lucide-react';
import { TRAINS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';
import { validateUPIId, validateCreditCard, PassengerInput } from '@/lib/validation';
import confetti from 'canvas-confetti';

export const Subsystem7_TatkalSpeedrun: React.FC = () => {
  // 1. Train & Quota Selection
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12952');
  const [selectedClass, setSelectedClass] = useState<string>('3A');
  const [tatkalType, setTatkalType] = useState<'TATKAL' | 'PREMIUM_TATKAL'>('TATKAL');

  // 2. Master Passenger List (Selectable checkboxes)
  const masterPassengers: (PassengerInput & { id: string; selected: boolean })[] = [
    { id: '1', name: 'Ramesh Sundaram', age: 34, gender: 'M', berthPreference: 'LB', aadhaar: '891234567890', selected: true },
    { id: '2', name: 'Kalyani Sundaram', age: 64, gender: 'F', berthPreference: 'LB', aadhaar: '541298761234', selected: true },
    { id: '3', name: 'Priya Sharma', age: 29, gender: 'F', berthPreference: 'SL', aadhaar: '901245673412', selected: false },
    { id: '4', name: 'Amit Verma', age: 38, gender: 'M', berthPreference: 'MB', aadhaar: '451298347612', selected: false }
  ];

  const [passengers, setPassengers] = useState(masterPassengers);

  // 3. Interactive CAPTCHA Box
  const captchaList = ['7K9X2', 'R4M8Q', 'B9V2W', 'X3N7P', 'H6T1K'];
  const [currentCaptcha, setCurrentCaptcha] = useState<string>('7K9X2');
  const [userCaptchaInput, setUserCaptchaInput] = useState<string>('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // 4. Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [upiId, setUpiId] = useState<string>('ramesh@okaxis');
  const [cardNumber, setCardNumber] = useState<string>('4532015012345678');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('782');

  // 5. Booking States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedTicket, setBookedTicket] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTrain = TRAINS.find(t => t.number === selectedTrainNumber) || TRAINS[0];
  const selectedCount = passengers.filter(p => p.selected).length;

  const handleTogglePassenger = (id: string) => {
    const updated = passengers.map(p => p.id === id ? { ...p, selected: !p.selected } : p);
    const count = updated.filter(p => p.selected).length;
    if (count > 4) {
      setErrorMessage('IRCTC Rule: Maximum 4 passengers allowed per Tatkal booking.');
      soundEffects.playAlert();
      return;
    }
    setErrorMessage(null);
    setPassengers(updated);
    soundEffects.playTick();
  };

  const handleAutoSolveCaptcha = () => {
    setUserCaptchaInput(currentCaptcha);
    setCaptchaError(null);
    soundEffects.playConfirmationChime();
  };

  const handleRefreshCaptcha = () => {
    const next = captchaList[(captchaList.indexOf(currentCaptcha) + 1) % captchaList.length];
    setCurrentCaptcha(next);
    setUserCaptchaInput('');
    setCaptchaError(null);
    soundEffects.playTick();
  };

  const handleBookTatkal = () => {
    setErrorMessage(null);
    setCaptchaError(null);

    // Validate Passenger Selection
    if (selectedCount === 0) {
      setErrorMessage('Please select at least 1 passenger from your Master List.');
      soundEffects.playAlert();
      return;
    }

    // Validate CAPTCHA
    if (userCaptchaInput.trim().toUpperCase() !== currentCaptcha) {
      setCaptchaError('Incorrect CAPTCHA entered. Please enter the exact characters shown.');
      soundEffects.playAlert();
      return;
    }

    // Validate Payment
    if (paymentMethod === 'UPI') {
      const upiVal = validateUPIId(upiId);
      if (!upiVal.isValid) {
        setErrorMessage(upiVal.error || 'Invalid UPI ID');
        soundEffects.playAlert();
        return;
      }
    } else {
      const cardVal = validateCreditCard(cardNumber, cardExpiry, cardCvv);
      if (!cardVal.isValid) {
        setErrorMessage(cardVal.error || 'Invalid card information');
        soundEffects.playAlert();
        return;
      }
    }

    setIsSubmitting(true);
    soundEffects.playTick();

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedPnr = '821-' + Math.floor(1000000 + Math.random() * 9000000);
      const selectedPaxList = passengers.filter(p => p.selected);

      setBookedTicket({
        pnr: generatedPnr,
        trainNumber: activeTrain.number,
        trainName: activeTrain.name,
        source: activeTrain.source,
        destination: activeTrain.destination,
        classType: selectedClass,
        quota: tatkalType === 'TATKAL' ? 'TQ' : 'PT',
        bookingTime: new Date().toLocaleTimeString('en-IN'),
        fare: (1450 + 350) * selectedPaxList.length,
        passengers: selectedPaxList.map((p, idx) => ({
          name: p.name,
          age: p.age,
          gender: p.gender,
          berth: `B2 - ${15 + idx} (${p.berthPreference})`,
          status: 'CNF (Confirmed Tatkal)'
        }))
      });

      confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
      soundEffects.playConfirmationChime();
    }, 900);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                  Official Tatkal Window
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Tatkal Fast-Track Booking Portal
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                10:00 AM (AC Classes) & 11:00 AM (Non-AC) Rapid Checkout with Master Passenger Pre-Injection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>TATKAL QUOTA: OPEN</span>
          </div>
        </div>
      </div>

      {bookedTicket ? (
        /* Confirmed Ticket Receipt */
        <div className="p-6 space-y-6 animate-fadeIn">
          <div className="p-5 bg-emerald-500 text-white rounded-2xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <h3 className="text-base font-black">Tatkal Booking Confirmed! PNR: {bookedTicket.pnr}</h3>
                <p className="text-xs text-emerald-100">
                  {bookedTicket.trainName} (#{bookedTicket.trainNumber}) • {bookedTicket.source} ➔ {bookedTicket.destination}
                </p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-emerald-200 block uppercase">Total Fare Paid</span>
              <span className="text-lg font-black">₹{bookedTicket.fare}</span>
            </div>
          </div>

          {/* Passenger Roster */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Allocated Tatkal Berths ({bookedTicket.passengers.length} Passengers)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bookedTicket.passengers.map((p: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{p.name} ({p.age}y / {p.gender})</div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-0.5">{p.status}</div>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-black text-slate-800">
                    {p.berth}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setBookedTicket(null);
                setUserCaptchaInput('');
                soundEffects.playTick();
              }}
              className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Book Another Tatkal Ticket
            </button>
          </div>
        </div>
      ) : (
        /* Real Interactive Tatkal Form */
        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Train & Passenger Selector */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Train & Class */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">1. Select Train & Tatkal Quota</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Train</label>
                    <select
                      value={selectedTrainNumber}
                      onChange={(e) => setSelectedTrainNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                    >
                      {TRAINS.map(t => (
                        <option key={t.number} value={t.number}>
                          {t.number} - {t.name} ({t.source} ➔ {t.destination})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                    >
                      <option value="3A">3A (3-Tier AC)</option>
                      <option value="2A">2A (2-Tier AC)</option>
                      <option value="1A">1A (First AC)</option>
                      <option value="CC">CC (Chair Car)</option>
                      <option value="EC">EC (Executive)</option>
                      <option value="SL">SL (Sleeper)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setTatkalType('TATKAL')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      tatkalType === 'TATKAL' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Standard Tatkal (Fixed +₹350)
                  </button>
                  <button
                    onClick={() => setTatkalType('PREMIUM_TATKAL')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      tatkalType === 'PREMIUM_TATKAL' ? 'bg-orange-600 text-white border-orange-700' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Premium Tatkal (Dynamic Fare)
                  </button>
                </div>
              </div>

              {/* 2. Select Passengers from Master List */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-600" />
                    2. Select Passengers from Master List ({selectedCount}/4 Selected)
                  </span>
                  <span className="text-[11px] text-slate-500">Max 4 in Tatkal</span>
                </div>

                <div className="space-y-2">
                  {passengers.map((p) => (
                    <label
                      key={p.id}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        p.selected ? 'bg-amber-50/80 border-amber-400 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={p.selected}
                          onChange={() => handleTogglePassenger(p.id)}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {p.gender} • Age {p.age} • Aadhaar: ****{p.aadhaar?.slice(-4)} • Pref: {p.berthPreference}
                          </div>
                        </div>
                      </div>

                      <span className={`text-xs font-mono font-bold ${p.selected ? 'text-amber-900' : 'text-slate-400'}`}>
                        {p.selected ? 'Selected' : 'Unchecked'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive CAPTCHA & Payment Checkout */}
            <div className="lg:col-span-5 space-y-5">
              {/* 3. Real CAPTCHA Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase block">3. Security Verification (CAPTCHA)</span>

                <div className="flex items-center gap-3 bg-white p-3 border border-slate-300 rounded-xl">
                  {/* Visual CAPTCHA Canvas simulation */}
                  <div className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-amber-300 font-mono text-lg font-black tracking-widest rounded-lg select-none line-through decoration-slate-500">
                    {currentCaptcha}
                  </div>

                  <button
                    onClick={handleRefreshCaptcha}
                    title="Get New CAPTCHA"
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleAutoSolveCaptcha}
                    className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Solve</span>
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Enter CAPTCHA exactly as shown"
                    value={userCaptchaInput}
                    onChange={(e) => {
                      setUserCaptchaInput(e.target.value);
                      setCaptchaError(null);
                    }}
                    className={`w-full p-2 bg-white border rounded-lg text-xs font-mono font-bold uppercase ${
                      captchaError ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-500' : 'border-slate-300 focus:ring-amber-500'
                    }`}
                  />
                  {captchaError && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1">⚠️ {captchaError}</p>
                  )}
                </div>
              </div>

              {/* 4. Payment Method & 1-Click Checkout */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase">Fare Breakdown ({selectedCount} Pax)</span>
                  <span className="text-sm font-black font-mono text-white">
                    ₹{(1450 + 350) * Math.max(1, selectedCount)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Ticket Fare</span>
                    <span>₹{1450 * Math.max(1, selectedCount)}</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>Tatkal Premium Surcharge</span>
                    <span>₹{350 * Math.max(1, selectedCount)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Instant UPI VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white font-bold"
                  />
                </div>

                <button
                  onClick={handleBookTatkal}
                  disabled={isSubmitting || selectedCount === 0}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Locking Tatkal Berth in PRS Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Instant Book Tatkal (₹{(1450 + 350) * Math.max(1, selectedCount)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
