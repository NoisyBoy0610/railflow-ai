'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Mic, GitFork, Users, Zap, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeft, Train, Clock, IndianRupee, Bed, Scale, Camera, Accessibility, Fingerprint
} from 'lucide-react';
import { soundEffects, speakMessage } from '@/lib/audio';
import { aiEngine } from '@/lib/aiEngine';
import confetti from 'canvas-confetti';

export const EndToEndJourneyWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Shared Journey State across steps
  const [journeyState, setJourneyState] = useState({
    voicePrompt: 'बेंगलुरु से चेन्नई कल 2 टिकट बुक करो मेरी 64 साल की माँ के साथ (3AC)',
    source: 'KSR Bengaluru (SBC)',
    sourceCode: 'SBC',
    dest: 'MGR Chennai Central (MAS)',
    destCode: 'MAS',
    travelDate: '2026-08-28',
    passengers: [
      { name: 'Ramesh Sundaram', age: 34, gender: 'M', berth: 'B2-18 (MB)', isSenior: false },
      { name: 'Kalyani Sundaram', age: 64, gender: 'F', berth: 'B2-17 (Lower Berth - SS Quota)', isSenior: true }
    ],
    selectedOption: 'MULTI_LEG', // Direct WL vs Multi-Leg 100% CNF
    pnr: '821-4928103',
    farePaid: 1470,
    porterBooked: true,
    mealBooked: true,
    delayMinutes: 215,
    rescheduledTrain: '20607 Vande Bharat Express',
    grievanceToken: 'MADAD-819204',
    tdrRefundAmount: 1543
  });

  const nextStep = () => {
    soundEffects.playConfirmationChime();
    setCurrentStep(prev => Math.min(prev + 1, 5));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    soundEffects.playTick();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
      {/* Wizard Master Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] via-[#1A407A] to-[#081730] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon Golden Flow Showcase
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">10 Subsystems Connected End-to-End</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              The Complete Passenger Lifecycle Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Experience the entire railway lifecycle: Voice booking ➔ AI Routing & Senior Berth Allocator ➔ Sub-300ms Biometric Checkout ➔ Live Delay Copilot & Concierge ➔ Automated TDR Gazette Refund.
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
            { num: 1, title: 'Voice & Intent', sub: 'Subsystem 2 & 5' },
            { num: 2, title: 'Routing & Berths', sub: 'Subsystem 3 & 6' },
            { num: 3, title: 'Biometric Pay', sub: 'Subsystem 4 & 7' },
            { num: 4, title: 'Live Journey', sub: 'Subsystem 8 & 9' },
            { num: 5, title: 'AI TDR & Grievance', sub: 'Subsystem 1 & 10' }
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

      {/* Step Content Arena */}
      <div className="p-6 sm:p-8">
        {/* ================= STEP 1: VOICE INTENT & QUOTA PREDICTOR ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Phase 1: Discovery & Speech NLP</span>
                <h3 className="text-lg font-black text-slate-900">Indic Voice Booking & Cryptic Quota Predictor</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                Subsystems 2 & 5 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spoken Voice Input */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-orange-500" />
                    Captured Voice Input (Hindi):
                  </span>
                  <button
                    onClick={() => {
                      speakMessage('बेंगलुरु से चेन्नई कल 2 टिकट बुक करो मेरी 64 साल की माँ के साथ 3AC में', 'hi');
                      soundEffects.playConfirmationChime();
                    }}
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    🔊 Play Audio
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed">
                  &quot;{journeyState.voicePrompt}&quot;
                </div>

                {/* Parsed Output */}
                <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-orange-400 font-bold text-[11px]">
                    <span>AI Extracted Entities:</span>
                    <span className="text-emerald-400">Confidence: 98%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>Route: <strong className="text-white">SBC ➔ MAS</strong></div>
                    <div>Class: <strong className="text-white">3AC</strong></div>
                    <div>Passengers: <strong className="text-white">2 Adults</strong></div>
                    <div>Special: <strong className="text-emerald-400">Senior Citizen (F64)</strong></div>
                  </div>
                </div>
              </div>

              {/* Quota Predictor Advice */}
              <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase">
                    Legacy Direct Route Status:
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                    HIGH RISK
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-800">Train 12658 (Direct Ticket)</div>
                  <div className="text-2xl font-black font-mono text-rose-600">GNWL 34 (42% Odds)</div>
                  <p className="text-[11px] text-slate-500">
                    Direct booking risks last-minute chart drop and no lower berth guarantee for senior citizen.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>RailFlow AI Recommendation: Trigger Subsystem 3 (Smart Multi-Leg) & Subsystem 6 (Senior SS Quota).</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <span>Proceed to Smart Routing & Berth Allocation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SMART ROUTING & SENIOR ALLOCATION ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Phase 2: Intelligent Fulfillment</span>
                <h3 className="text-lg font-black text-slate-900">Smart Split-Seat Route + Senior Citizen SS Lower Berth</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Subsystems 3 & 6 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Split-Seat Guaranteed Route */}
              <div className="md:col-span-6 p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-emerald-600" />
                    Subsystem 3: Split-Seat Pathfinder
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                    100% Confirmed
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Leg 1: SBC ➔ Katpadi Jn (KPD)</span>
                      <span className="text-emerald-700 font-mono">CONFIRMED (CNF)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Train 12658 • Coach B2, Berth 17 & 18</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Leg 2: Katpadi Jn (KPD) ➔ MAS</span>
                      <span className="text-emerald-700 font-mono">CONFIRMED (CNF)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Same Train 12658 • Just walk to Coach B3 at Katpadi</p>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-900 font-medium">
                  ✨ Zero risk of waitlist drop! Saves ₹450 compared to Tatkal premium.
                </p>
              </div>

              {/* Senior Citizen Proximity Allocation */}
              <div className="md:col-span-6 p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400 uppercase flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Subsystem 6: Senior Berth Allocator
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">
                    SS Quota Lower Berth
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-emerald-900/40 border border-emerald-500/60 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Kalyani Sundaram (F64)</span>
                      <span className="text-emerald-400">Coach B2 - Berth 17 (Lower Berth)</span>
                    </div>
                    <p className="text-[10px] text-emerald-200">Automatically allocated Lower Berth under Senior Citizen Quota (SS).</p>
                  </div>

                  <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>Ramesh Sundaram (M34)</span>
                      <span className="text-slate-300">Coach B2 - Berth 18 (Middle Berth)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Co-located in adjacent berth in the exact same coach compartment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button onClick={prevStep} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <span>Proceed to Biometric Passkey Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BIOMETRIC CHECKOUT ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Phase 3: Sub-Second Transaction</span>
                <h3 className="text-lg font-black text-slate-900">Biometric Passkey (WebAuthn) & Zero-Friction Booking</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                Subsystems 4 & 7 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Biometric Verification Card */}
              <div className="md:col-span-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                  <Fingerprint className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Touch ID / Face ID Pre-Flight Verified</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hardware cryptographic token signed in 28ms • No visual CAPTCHA • No OTP delays
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Aadhaar Master Verified: Ramesh Sundaram (UID XXXX-9182)</span>
                </div>
              </div>

              {/* Transparent Unbundled Fare Breakdown */}
              <div className="md:col-span-6 p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="font-bold text-orange-400">Transparent Fare Ledger (2 Passengers):</span>
                  <span className="font-mono text-emerald-400">Class: 3AC</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Distance Fare (2x):</span>
                    <span className="font-mono text-white">₹1,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Superfast & Reservation Charge:</span>
                    <span className="font-mono text-white">₹170</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span className="font-mono text-white">₹70</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                    <span className="text-orange-400">Total Net Fare Paid:</span>
                    <span className="text-xl font-black font-mono text-emerald-400">₹{journeyState.farePaid}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-600 text-white rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>PNR Generated:</span>
                    <span className="font-mono text-base">{journeyState.pnr}</span>
                  </div>
                  <p className="text-[10px] text-emerald-100">Confirmed seats in Coach B2, Berths 17 (LB) & 18 (MB).</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button onClick={prevStep} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <span>Proceed to Live Journey & Disruption Radar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: LIVE JOURNEY & DISRUPTION COPILOT ================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Phase 4: In-Transit Intelligence</span>
                <h3 className="text-lg font-black text-slate-900">Station Concierge & Live Disruption Copilot (&gt;3hr Delay)</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                Subsystems 8 & 9 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Station Concierge Service */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4 text-orange-500" />
                    Subsystem 9: Station Concierge
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    DISPATCHED
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Licensed Coolie Assigned:</span>
                    <span className="text-orange-600">Manoj Kumar (Badge #142)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Meeting passenger at Coach B2 on Platform 4 (Regulated Tariff ₹120).</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Hot Meal to Seat:</span>
                    <span className="text-emerald-700">IRCTC Executive Veg Thali</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Delivered directly to Coach B2, Berth 17.</p>
                </div>
              </div>

              {/* Dynamic Disruption Trigger */}
              <div className="p-5 bg-rose-50/70 border border-rose-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-950 uppercase flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-600" />
                    Subsystem 8: Live Disruption Radar
                  </span>
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded uppercase animate-pulse">
                    3h 35m DELAY DETECTED
                  </span>
                </div>

                <p className="text-xs text-rose-900 leading-relaxed">
                  Train 12658 delayed by <strong>215 minutes</strong> at Jolarpettai Junction due to signal failure.
                </p>

                <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Copilot Proactive Actions:</span>
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>1. Free Reschedule to Vande Bharat:</span>
                    <span>CONFIRMED (Seat C3-14)</span>
                  </div>
                  <div className="flex items-center justify-between text-purple-700 font-bold">
                    <span>2. Station Retiring Room at SBC:</span>
                    <span>Executive Pod #12 Booked</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button onClick={prevStep} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <span>Proceed to Post-Journey AI TDR & Vision Grievance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: AI TDR & GRIEVANCE TRIAGE ================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Phase 5: Resolution & Settlement</span>
                <h3 className="text-lg font-black text-slate-900">Multimodal RailMadad Vision + AI TDR Gazette Refund</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Subsystems 1 & 10 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RailMadad Vision AI */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-orange-500" />
                    Subsystem 10: Multimodal RailMadad
                  </span>
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded uppercase">
                    CRITICAL SEVERITY
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Incident Photo Classified:</span>
                    <span className="text-rose-600 font-mono">OBHS Escalation</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    AC water leakage & unhygienic washroom detected in Coach B2. Auto-dispatched OBHS team with resolution token <strong>{journeyState.grievanceToken}</strong>.
                  </p>
                </div>
              </div>

              {/* AI TDR Gazette Refund */}
              <div className="p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    Subsystem 1: Gazette Rule 14.1 Refund
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                    100% APPROVED
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Rule Matched:</span>
                    <strong className="text-slate-900">Rule 14.1 (&gt;3hr Train Delay)</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Clerkage Deducted:</span>
                    <strong className="text-emerald-700">₹0 (Waived Under Gazette Exemption)</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST Credit:</span>
                    <strong className="text-emerald-700">+₹73</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-[#0F2C59]">
                    <span>Total Bank Credit:</span>
                    <span className="text-lg font-black font-mono text-emerald-600">₹{journeyState.tdrRefundAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Fanfare */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-black text-white">
                End-to-End Passenger Lifecycle Completed!
              </h4>
              <p className="text-xs text-emerald-100 max-w-xl mx-auto leading-relaxed">
                All 10 agentic subsystems harmoniously executed across booking, routing, accessibility, disruption monitoring, and automated refund settlement.
              </p>
              <button
                onClick={() => {
                  soundEffects.playConfirmationChime();
                  try {
                    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
                  } catch (e) {}
                }}
                className="px-6 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-md transition-all"
              >
                🎉 Celebrate Hackathon Demo Success!
              </button>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button onClick={prevStep} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
                Back
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition-colors"
              >
                Restart Journey Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
