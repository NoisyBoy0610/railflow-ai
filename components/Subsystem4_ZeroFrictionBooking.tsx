'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ShieldCheck, Zap, Lock, IndianRupee, FileText, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { soundEffects } from '@/lib/audio';
import confetti from 'canvas-confetti';

export const Subsystem4_ZeroFrictionBooking: React.FC = () => {
  const [optInInsurance, setOptInInsurance] = useState<boolean>(false);
  const [optInMeal, setOptInMeal] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [ticketToken, setTicketToken] = useState<string>('');

  const baseFare = 1450;
  const superfastCharge = 45;
  const reservationFee = 40;
  const mealCharge = optInMeal ? 210 : 0;
  const insuranceFee = optInInsurance ? 0.45 : 0;
  const gst = Math.round((baseFare + superfastCharge + reservationFee + mealCharge) * 0.05);
  const totalAmount = baseFare + superfastCharge + reservationFee + mealCharge + insuranceFee + gst;

  const handleInstantCheckout = () => {
    setIsProcessing(true);
    soundEffects.playTick();

    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      const generatedPnr = '821-' + Math.floor(1000000 + Math.random() * 9000000);
      setTicketToken(generatedPnr);
      soundEffects.playConfirmationChime();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 4
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Zero-Friction & Anti-Dark-Pattern Booking UI
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                No 5-min timeout drops, invisible background bot-proof challenge (No CAPTCHA), transparent unbundled pricing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Dark-Patterns Certified</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Anti-Dark Pattern Feature Highlights */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Key Frictionless Innovations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Feature 1 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Visual CAPTCHA</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Replaced cryptic, slow image CAPTCHAs with sub-second client-side cryptographic proof-of-work challenge.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Persistent Session State</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                IndexedDB & LocalStorage keep passenger forms alive even if page refreshes or connection stutters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>No Sneaky Pre-Checked Insurance</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Travel insurance is completely unbundled with an explicit opt-in toggle to prevent deceptive checkout charges.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Transparent Fare Ledger</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Clear distinction between Indian Railways base fare, superfast fee, catering, dynamic surge, and GST.
              </p>
            </div>
          </div>

          {/* Explicit Opt-in Add-ons */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Transparent Optional Add-Ons (Unbundled)
            </span>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={optInMeal}
                onChange={(e) => setOptInMeal(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800">IRCTC Executive Veg Meal / Breakfast (+₹210)</span>
                <p className="text-[11px] text-slate-500">Fresh hot breakfast served on train 22436 Vande Bharat.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={optInInsurance}
                onChange={(e) => setOptInInsurance(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-800">Travel Insurance Coverage (+₹0.45 per passenger)</span>
                <p className="text-[11px] text-slate-500">₹10 Lakh accidental insurance coverage (Explicit Opt-in).</p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Transparent Checkout Ledger & Fast Book */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-orange-400 font-bold uppercase tracking-wider block">Train 22436</span>
                <h4 className="text-sm font-bold text-white">Vande Bharat Express (NDLS ➔ BSB)</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                Class: CC (Available 22)
              </span>
            </div>

            {/* Fare Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Distance Fare:</span>
                <span className="font-mono text-white font-semibold">₹{baseFare}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Superfast Train Surcharge:</span>
                <span className="font-mono text-white font-semibold">₹{superfastCharge}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reservation Fee:</span>
                <span className="font-mono text-white font-semibold">₹{reservationFee}</span>
              </div>
              {optInMeal && (
                <div className="flex justify-between text-slate-300">
                  <span>Executive Catering (Veg):</span>
                  <span className="font-mono text-white font-semibold">+₹{mealCharge}</span>
                </div>
              )}
              {optInInsurance && (
                <div className="flex justify-between text-slate-300">
                  <span>Travel Accidental Insurance:</span>
                  <span className="font-mono text-white font-semibold">+₹{insuranceFee}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>GST (5% on AC Services):</span>
                <span className="font-mono text-white font-semibold">₹{gst}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span className="text-orange-400">Total Net Amount Payable:</span>
                <span className="text-xl font-black font-mono text-emerald-400">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Invisible Bot Proof Indicator */}
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Invisible Client Proof-of-Work:</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">PASSED (4ms)</span>
            </div>

            {/* Checkout Button or Confirmation Token */}
            {!isConfirmed ? (
              <button
                onClick={handleInstantCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Instant Sub-Second Token Booking...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>1-Click Zero-Friction Booking (₹{totalAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-4 bg-emerald-600 text-white rounded-xl space-y-2 animate-fadeIn shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">Ticket Confirmed Instantly!</span>
                  </div>
                  <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded font-mono">CNF</span>
                </div>
                <div className="text-xs text-emerald-100 flex items-center justify-between pt-1">
                  <span>Synthetic PNR:</span>
                  <span className="font-mono font-bold text-white text-sm">{ticketToken}</span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Seat: Coach C4, Berth 12 (Window) • Sent via instant SMS & WhatsApp simulation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
