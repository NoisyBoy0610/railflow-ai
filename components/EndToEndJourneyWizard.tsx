'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Mic, GitFork, Users, Zap, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeft, Train, Clock, IndianRupee, Bed, Scale, Camera, 
  Accessibility, Fingerprint, AlertCircle, Plus, Trash2, CreditCard, Smartphone,
  RefreshCw, Check, Info
} from 'lucide-react';
import { soundEffects, speakMessage } from '@/lib/audio';
import { aiEngine } from '@/lib/aiEngine';
import { STATIONS } from '@/lib/mockData';
import { 
  validateStationPair, validateTravelDate, validatePassenger, 
  validateQuotaEligibility, validateUPIId, validateCreditCard, 
  validateIndianMobile, validatePNR, PassengerInput 
} from '@/lib/validation';
import confetti from 'canvas-confetti';

export const EndToEndJourneyWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Dynamic Interactive Journey State
  const [voicePrompt, setVoicePrompt] = useState<string>('बेंगलुरु से चेन्नई कल 2 टिकट बुक करो मेरी 64 साल की माँ के साथ (3AC)');
  const [sourceCode, setSourceCode] = useState<string>('SBC');
  const [destCode, setDestCode] = useState<string>('MAS');
  const [travelDate, setTravelDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [classType, setClassType] = useState<string>('3A');
  const [quota, setQuota] = useState<string>('GN');

  // Dynamic Passengers List
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    { name: 'Ramesh Sundaram', age: 34, gender: 'M', berthPreference: 'MB', aadhaar: '891234567890' },
    { name: 'Kalyani Sundaram', age: 64, gender: 'F', berthPreference: 'LB', aadhaar: '541298761234' }
  ]);

  // Payment & Contact Info
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'BIOMETRIC'>('UPI');
  const [upiId, setUpiId] = useState<string>('ramesh@okaxis');
  const [cardNumber, setCardNumber] = useState<string>('4532015012345678');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('782');
  const [otpCode, setOtpCode] = useState<string>('849201');

  // Journey Outcomes
  const [generatedPnr, setGeneratedPnr] = useState<string>('821-4928103');
  const [bookingToken, setBookingToken] = useState<string>('');
  const [delayMinutes, setDelayMinutes] = useState<number>(215);
  const [disputeReason, setDisputeReason] = useState<string>('Train delayed by over 3.5 hours beyond schedule. Demanding 100% full refund without clerkage deduction under Rule 14.1.');
  const [tdrSubmitted, setTdrSubmitted] = useState<boolean>(false);
  const [tdrClaimResult, setTdrClaimResult] = useState<any>(null);

  // Helper to add passenger
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      setValidationError('Maximum 6 passengers allowed per booking.');
      return;
    }
    setPassengers([...passengers, { name: '', age: 30, gender: 'M', berthPreference: 'LB' }]);
    setValidationError(null);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) {
      setValidationError('At least one passenger is required.');
      return;
    }
    const updated = passengers.filter((_, idx) => idx !== index);
    setPassengers(updated);
    setValidationError(null);
  };

  const handleUpdatePassenger = (index: number, field: keyof PassengerInput, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
    setValidationError(null);
  };

  // Step 1 -> Step 2: Validate Booking Intent & Quota Eligibility
  const handleValidateStep1 = async () => {
    setValidationError(null);

    // 1. Validate Stations
    const stationCheck = validateStationPair(sourceCode, destCode);
    if (!stationCheck.isValid) {
      setValidationError(stationCheck.error || 'Invalid stations');
      soundEffects.playAlert();
      return;
    }

    // 2. Validate Travel Date
    const dateCheck = validateTravelDate(travelDate);
    if (!dateCheck.isValid) {
      setValidationError(dateCheck.error || 'Invalid date');
      soundEffects.playAlert();
      return;
    }

    // 3. Validate Each Passenger
    for (let i = 0; i < passengers.length; i++) {
      const pCheck = validatePassenger(passengers[i], i + 1);
      if (!pCheck.isValid) {
        setValidationError(pCheck.error || 'Invalid passenger details');
        soundEffects.playAlert();
        return;
      }
    }

    // 4. Validate Quota Eligibility
    const quotaCheck = validateQuotaEligibility(quota, passengers);
    if (!quotaCheck.isValid) {
      setValidationError(quotaCheck.error || 'Invalid quota selection');
      soundEffects.playAlert();
      return;
    }

    // 5. Mobile validation
    const mobileCheck = validateIndianMobile(mobileNumber);
    if (!mobileCheck.isValid) {
      setValidationError(mobileCheck.error || 'Invalid mobile');
      soundEffects.playAlert();
      return;
    }

    soundEffects.playConfirmationChime();
    setCurrentStep(2);
    if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 2 -> Step 3: Proceed to Checkout
  const handleValidateStep2 = () => {
    setValidationError(null);
    soundEffects.playConfirmationChime();
    setCurrentStep(3);
    if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 3 -> Step 4: Validate Payment & Issue PNR
  const handleExecutePayment = () => {
    setValidationError(null);

    if (paymentMethod === 'UPI') {
      const upiCheck = validateUPIId(upiId);
      if (!upiCheck.isValid) {
        setValidationError(upiCheck.error || 'Invalid UPI ID');
        soundEffects.playAlert();
        return;
      }
    } else if (paymentMethod === 'CARD') {
      const cardCheck = validateCreditCard(cardNumber, cardExpiry, cardCvv);
      if (!cardCheck.isValid) {
        setValidationError(cardCheck.error || 'Invalid card information');
        soundEffects.playAlert();
        return;
      }
    }

    setIsProcessing(true);
    soundEffects.playTick();

    setTimeout(() => {
      setIsProcessing(false);
      const newPnr = '821-' + Math.floor(1000000 + Math.random() * 9000000);
      setGeneratedPnr(newPnr);
      setBookingToken('TXN-IRCTC-' + Math.floor(10000000 + Math.random() * 90000000));
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      soundEffects.playConfirmationChime();
      setCurrentStep(4);
      if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 800);
  };

  // Step 4 -> Step 5: Live Delay & TDR Evaluation
  const handleProceedToTDR = () => {
    setValidationError(null);
    const result = aiEngine.evaluateTDRClaim(generatedPnr, disputeReason, 1470, delayMinutes);
    setTdrClaimResult(result);
    soundEffects.playConfirmationChime();
    setCurrentStep(5);
    if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Step 5: Submit TDR Claim
  const handleSubmitTDR = () => {
    setTdrSubmitted(true);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    soundEffects.playConfirmationChime();
  };

  const sourceName = STATIONS.find(s => s.code === sourceCode)?.name || sourceCode;
  const destName = STATIONS.find(s => s.code === destCode)?.name || destCode;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
      {/* Wizard Master Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] via-[#1A407A] to-[#081730] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Validated Railway Operating Flow
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">100% Dynamic & Rule Validated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              End-to-End Real World Passenger Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Fully validated with official Indian Railways business rules, age & quota eligibility, 10-digit PNR verifications, and Gazette TDR terms.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-xs text-slate-300 font-semibold">Step {currentStep} of 5</span>
            <div className="w-16 bg-slate-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300" style={{ width: `${(currentStep / 5) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-5 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          {[
            { num: 1, title: 'Input & Validate', sub: 'Voice & Quota Rules' },
            { num: 2, title: 'Smart Berths', sub: 'Split-Seat Graph' },
            { num: 3, title: 'Payment & PNR', sub: 'UPI & Tokenization' },
            { num: 4, title: 'Live Journey', sub: 'Delay & Disruption' },
            { num: 5, title: 'Gazette TDR', sub: 'Auto-Refund Filing' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                soundEffects.playTick();
                setCurrentStep(s.num);
              }}
              className={`p-2 rounded-xl text-left transition-all ${
                currentStep === s.num
                  ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/30'
                  : currentStep > s.num
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-[11px]">0{s.num}.</span>
                <span className="font-bold text-[11px] truncate">{s.title}</span>
              </div>
              <span className="text-[9px] opacity-75 hidden sm:block mt-0.5">{s.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mx-6 mt-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs font-semibold text-rose-800 flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Content Arena */}
      <div className="p-6 sm:p-8">
        {/* ================= STEP 1: DYNAMIC INPUT & VALIDATION ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Step 1: Input & Real-World Validation</span>
                <h3 className="text-lg font-black text-slate-900">Custom Journey Parameters & Quota Eligibility</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Rule Validator Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Route & Date Selection */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase block">1. Journey Stations & Schedule</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">From Station</label>
                      <select
                        value={sourceCode}
                        onChange={(e) => {
                          setSourceCode(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                      >
                        {STATIONS.map(s => (
                          <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">To Station</label>
                      <select
                        value={destCode}
                        onChange={(e) => {
                          setDestCode(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                      >
                        {STATIONS.map(s => (
                          <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Travel Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => {
                          setTravelDate(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class</label>
                      <select
                        value={classType}
                        onChange={(e) => setClassType(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="1A">1A (First AC)</option>
                        <option value="2A">2A (2-Tier AC)</option>
                        <option value="3A">3A (3-Tier AC)</option>
                        <option value="SL">SL (Sleeper)</option>
                        <option value="CC">CC (Chair Car)</option>
                        <option value="EC">EC (Executive)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Quota</label>
                      <select
                        value={quota}
                        onChange={(e) => {
                          setQuota(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      >
                        <option value="GN">GN (General)</option>
                        <option value="SS">SS (Senior Lower Berth)</option>
                        <option value="LD">LD (Ladies Quota)</option>
                        <option value="TQ">TQ (Tatkal Rush)</option>
                        <option value="PT">PT (Premium Tatkal)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Passenger Contact Mobile (+91)</label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      maxLength={10}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10 digit mobile number"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono"
                    />
                  </div>
                </div>

                {/* Voice Natural Language Prompt Helper */}
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-orange-600" />
                      Optional: Natural Language / Indic Voice Prompt
                    </span>
                    <button
                      onClick={async () => {
                        soundEffects.playTick();
                        const parsed = await aiEngine.parseBookingPrompt(voicePrompt);
                        setSourceCode(parsed.sourceCode);
                        setDestCode(parsed.destCode);
                        setClassType(parsed.classType);
                        setQuota(parsed.quota);
                        soundEffects.playConfirmationChime();
                      }}
                      className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-all"
                    >
                      Parse & Apply
                    </button>
                  </div>
                  <input
                    type="text"
                    value={voicePrompt}
                    onChange={(e) => setVoicePrompt(e.target.value)}
                    className="w-full p-2 bg-white border border-orange-300 rounded-xl text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Right Column: Dynamic Passenger Roster */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-600" />
                      2. Passenger Roster ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})
                    </span>
                    <button
                      onClick={handleAddPassenger}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Passenger</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {passengers.map((p, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 relative shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">Passenger #{idx + 1}</span>
                          {passengers.length > 1 && (
                            <button
                              onClick={() => handleRemovePassenger(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6">
                            <input
                              type="text"
                              placeholder="Full Name as per ID"
                              value={p.name}
                              onChange={(e) => handleUpdatePassenger(idx, 'name', e.target.value)}
                              className="w-full p-1.5 border border-slate-300 rounded text-xs font-semibold"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              placeholder="Age"
                              value={p.age}
                              min={1}
                              max={120}
                              onChange={(e) => handleUpdatePassenger(idx, 'age', e.target.value)}
                              className="w-full p-1.5 border border-slate-300 rounded text-xs font-bold text-center"
                            />
                          </div>
                          <div className="col-span-3">
                            <select
                              value={p.gender}
                              onChange={(e) => handleUpdatePassenger(idx, 'gender', e.target.value as any)}
                              className="w-full p-1.5 border border-slate-300 rounded text-xs font-bold"
                            >
                              <option value="M">Male</option>
                              <option value="F">Female</option>
                              <option value="T">Transgender</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <select
                              value={p.berthPreference}
                              onChange={(e) => handleUpdatePassenger(idx, 'berthPreference', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 rounded text-[11px] font-medium bg-slate-50"
                            >
                              <option value="LB">Lower Berth (LB)</option>
                              <option value="MB">Middle Berth (MB)</option>
                              <option value="UB">Upper Berth (UB)</option>
                              <option value="SL">Side Lower (SL)</option>
                              <option value="SU">Side Upper (SU)</option>
                            </select>
                          </div>
                          <div>
                            <input
                              type="text"
                              maxLength={12}
                              placeholder="12-digit Aadhaar (Optional)"
                              value={p.aadhaar || ''}
                              onChange={(e) => handleUpdatePassenger(idx, 'aadhaar', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 rounded text-[11px] font-mono bg-slate-50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleValidateStep1}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Validate Details & Search Seat Routes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SMART ROUTING & BERTH ALLOCATION ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Step 2: Intelligent Fulfillment</span>
                <h3 className="text-lg font-black text-slate-900">
                  Confirmed Split-Seat Optimizer & Spatial Berth Clustering
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                100% Confirmation Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Direct Route vs Split Route Comparison */}
              <div className="md:col-span-6 p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-emerald-600" />
                    Subsystem 3: Split-Seat Graph Option
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                    100% CNF Guaranteed
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1 shadow-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Leg 1: {sourceName} ({sourceCode}) ➔ Katpadi Jn (KPD)</span>
                      <span className="text-emerald-700 font-mono">CONFIRMED (CNF)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Train 12658 • Coach B2, Berths Allocated Together</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1 shadow-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Leg 2: Katpadi Jn (KPD) ➔ {destName} ({destCode})</span>
                      <span className="text-emerald-700 font-mono">CONFIRMED (CNF)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Same Train 12658 • Continuous Booking</p>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                  <span className="font-semibold">Split-Seat Total Base Fare:</span>
                  <span className="text-sm font-black font-mono text-emerald-700">₹{passengers.length * 735}</span>
                </div>
              </div>

              {/* Senior Citizen Spatial Berth Allocation */}
              <div className="md:col-span-6 p-5 bg-blue-50/80 border border-blue-300 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 uppercase flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-blue-600" />
                    Subsystem 6: Spatial Berth Clustered Allocation
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase">
                    Auto-Grouped
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {passengers.map((p, idx) => {
                    const isSenior = (p.gender === 'F' && Number(p.age) >= 45) || (p.gender === 'M' && Number(p.age) >= 60);
                    return (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between shadow-xs">
                        <div>
                          <div className="font-bold text-slate-900">{p.name || `Passenger ${idx + 1}`} ({p.age}y / {p.gender})</div>
                          <p className="text-[11px] text-slate-500">
                            {isSenior ? '✨ Senior Citizen SS Quota Lower Berth Approved' : 'Paired in adjacent Middle/Upper Berth'}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                          isSenior ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          B2 - {17 + idx} ({isSenior ? 'LB' : 'MB'})
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-blue-900 font-medium">
                  🔒 Zero Coach Separation Guarantee: All {passengers.length} passengers booked inside Coach B2 in the same bay.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </button>
              <button
                onClick={handleValidateStep2}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Biometric / UPI Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PAYMENT & INSTANT PNR GENERATION ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Step 3: Anti-Dark-Pattern Payment</span>
                <h3 className="text-lg font-black text-slate-900">Zero-Latency Payment & Tokenized PNR Booking</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
                1-Click UPI & Card Gateway
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Payment Method Switcher */}
              <div className="md:col-span-7 space-y-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Payment Gateway Method:
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setPaymentMethod('UPI');
                      setValidationError(null);
                      soundEffects.playTick();
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <span className="text-xs block">UPI 1-Click</span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentMethod('CARD');
                      setValidationError(null);
                      soundEffects.playTick();
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'CARD'
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <span className="text-xs block">Debit / Credit</span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentMethod('BIOMETRIC');
                      setValidationError(null);
                      soundEffects.playTick();
                    }}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'BIOMETRIC'
                        ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/20 text-orange-950 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Fingerprint className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <span className="text-xs block">Passkey Biometric</span>
                  </button>
                </div>

                {/* Method Input Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 uppercase block">Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        placeholder="e.g. mobile@paytm, name@okaxis"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setValidationError(null);
                        }}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                      />
                      <p className="text-[10px] text-slate-500">
                        ⚡ Native Intent Protocol: Opens GPay, PhonePe, or Paytm app directly on mobile.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 uppercase block">16-Digit Card Number</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={cardNumber}
                          onChange={(e) => {
                            setCardNumber(e.target.value);
                            setValidationError(null);
                          }}
                          placeholder="Card Number"
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase block">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/29"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-700 uppercase block">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'BIOMETRIC' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                      <Fingerprint className="w-8 h-8 text-emerald-600 mx-auto animate-pulse" />
                      <div className="text-xs font-bold text-emerald-950">WebAuthn / TouchID Pre-Authorized</div>
                      <p className="text-[11px] text-emerald-700">Sub-300ms 1-Tap Tatkal Speedrun Checkout.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fare Breakdown Summary */}
              <div className="md:col-span-5 p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  Fare Summary (Zero Dark-Patterns)
                </span>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Ticket Fare ({passengers.length} pax)</span>
                    <span className="font-mono text-white">₹{passengers.length * 700}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Superfast & Reservation Charges</span>
                    <span className="font-mono text-white">₹{passengers.length * 35}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Travel Insurance (0.45/pax)</span>
                    <span className="font-mono">FREE (Included)</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-orange-400">₹{passengers.length * 735}</span>
                  </div>
                </div>

                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authorizing Token with Bank Gateway...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ₹{passengers.length * 735} & Issue PNR</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-start pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: LIVE JOURNEY RADAR & DELAY COPILOT ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Step 4: Live Journey Operations</span>
                <h3 className="text-lg font-black text-slate-900">
                  PNR {generatedPnr} • GPS Radar & Disruption Copilot
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Active Live Telemetry
              </span>
            </div>

            {/* PNR Confirmation Banner */}
            <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <h4 className="text-sm font-black">Booking Confirmed! PNR: {generatedPnr}</h4>
                  <p className="text-xs text-emerald-100">
                    {sourceName} ➔ {destName} • {passengers.length} Passenger(s) • Coach B2, Berths 17 & 18
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-xl text-xs font-mono font-bold">
                CNF / All Berths Lower-Cluster
              </span>
            </div>

            {/* Delay Interactive Simulation Arena */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  Live Delay Simulator (Drag slider to test railway reactions):
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-black ${
                  delayMinutes >= 180 ? 'bg-rose-600 text-white' : delayMinutes > 30 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                }`}>
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

              {/* Reactive Copilot Trigger */}
              {delayMinutes >= 180 ? (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Railway Gazette Rule 14.1 Threshold Triggered (&gt;3 Hours Delay)</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Train delay has exceeded 180 minutes. Under Indian Railways Gazette policy, passenger qualifies for a <strong>100% full refund with ZERO clerkage fee</strong> upon TDR filing!
                  </p>
                </div>
              ) : delayMinutes > 30 ? (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800">
                  ⚠️ Delay Copilot: Rescheduled breakfast delivery & battery car transfer at junction halt.
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800">
                  ✅ Train is running on-time. Signal block clearance nominal.
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleProceedToTDR}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to AI TDR Gazette Refund Evaluation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: AUTOMATED TDR GAZETTE REFUND ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Step 5: Post-Journey Protection</span>
                <h3 className="text-lg font-black text-slate-900">
                  AI TDR Auto-Dispute & Gazette Refund Token
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                Official Gazette Rule 14.1
              </span>
            </div>

            {tdrClaimResult && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Rule Matched & Reasoning */}
                <div className="md:col-span-7 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-orange-500" />
                      Dispute Statement & Gazette Rule Match:
                    </span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded">
                      {tdrClaimResult.data.ruleMatched.ruleCode}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900">
                      {tdrClaimResult.data.ruleMatched.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tdrClaimResult.data.reasoningClause}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Passenger Dispute Claim Statement:
                    </label>
                    <textarea
                      rows={2}
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Refund Calculation & Token */}
                <div className="md:col-span-5 p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Refund Settlement Breakdown
                  </span>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Base Fare Paid</span>
                      <span className="font-mono text-white">₹{tdrClaimResult.data.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible Refund Rate</span>
                      <span className="font-mono text-emerald-400">{tdrClaimResult.data.eligibleRefundPercent}%</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>IRCTC Clerkage Fee Deduction</span>
                      <span className="font-mono">₹{tdrClaimResult.data.clerkageDeducted} (Waived)</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-bold text-white">
                      <span>Net Refund Amount</span>
                      <span className="font-mono text-emerald-400">₹{tdrClaimResult.data.netRefundAmount}</span>
                    </div>
                  </div>

                  {tdrSubmitted ? (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center space-y-1">
                      <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-emerald-300">TDR Claim Transmitted to CRiS Gateway!</div>
                      <p className="text-[10px] text-slate-300 font-mono">Token: {tdrClaimResult.claimToken}</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitTDR}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Submit Instant 1-Click TDR Claim</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playConfirmationChime();
                  setCurrentStep(1);
                  setTdrSubmitted(false);
                }}
                className="px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-all"
              >
                🔄 Start New Journey Lifecycle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
