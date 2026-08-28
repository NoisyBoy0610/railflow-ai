'use client';

import React, { useState } from 'react';
import { HelpCircle, Sparkles, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Calculator, Compass } from 'lucide-react';
import { aiEngine, QuotaWLInsight } from '@/lib/aiEngine';
import { soundEffects } from '@/lib/audio';

export const Subsystem5_QuotaWLAdvisor: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string>('GNWL');
  const [selectedClass, setSelectedClass] = useState<string>('3A');
  const [wlNumber, setWlNumber] = useState<number>(34);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [insight, setInsight] = useState<QuotaWLInsight>(aiEngine.explainWaitlistQuota('GNWL', 34));

  const handleCalculate = () => {
    setIsCalculating(true);
    soundEffects.playTick();

    setTimeout(() => {
      setIsCalculating(false);
      const res = aiEngine.explainWaitlistQuota(selectedCode, wlNumber);
      setInsight(res);
      soundEffects.playConfirmationChime();
    }, 450);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold uppercase">
                  PRS Probability Engine
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Waitlist (GNWL / RLWL / PQWL) & RAC Confirmation Predictor
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Transparent confirmation probabilities, cancellation trends, and quota bypass recommendations based on historical charts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>AI Chart Velocity Model</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Interactive Query Card */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
          <span className="text-xs font-bold text-slate-800 uppercase block">
            Enter Current Waitlist Status to Predict Confirmation Odds:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Waitlist Quota Code</label>
              <select
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                <option value="GNWL">GNWL (General Waitlist - Clears 1st)</option>
                <option value="RLWL">RLWL (Remote Location Quota)</option>
                <option value="PQWL">PQWL (Pooled Quota - Low Clearance)</option>
                <option value="RAC">RAC (Reservation Against Cancellation)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Travel Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              >
                <option value="3A">3A (3-Tier AC)</option>
                <option value="2A">2A (2-Tier AC)</option>
                <option value="1A">1A (First AC)</option>
                <option value="SL">SL (Sleeper)</option>
                <option value="CC">CC (Chair Car)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Current Waitlist Position</label>
              <input
                type="number"
                min={1}
                max={250}
                value={wlNumber}
                onChange={(e) => setWlNumber(parseInt(e.target.value, 10) || 1)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full p-2.5 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isCalculating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Calculator className="w-3.5 h-3.5 text-orange-400" />
                )}
                <span>Analyze Odds</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
          {/* Probability Metric Card */}
          <div className="md:col-span-5 p-5 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Estimated Confirmation Odds</span>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded">
                Priority Rank #{insight.priorityLevel}
              </span>
            </div>

            <div className="text-center py-3">
              <div className={`text-4xl font-black font-mono ${
                insight.confirmationChancePercent >= 80
                  ? 'text-emerald-400'
                  : insight.confirmationChancePercent >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {insight.confirmationChancePercent}%
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedCode} Position #{wlNumber} in {selectedClass}
              </p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl space-y-1 text-xs text-slate-300">
              <div className="font-bold text-white">First Chart Preparation Window:</div>
              <p className="text-[11px] text-slate-400">
                4 hours before scheduled departure (clears RAC and vacant lower berths automatically).
              </p>
            </div>
          </div>

          {/* Detailed Explanation & Pro-Tip Card */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>What is {insight.code} ({insight.fullName})?</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {insight.explanation}
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>IRCTC Clearance Strategy Pro-Tip:</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {insight.proTip}
              </p>
            </div>

            {insight.alternativeSuggestion && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{insight.alternativeSuggestion}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
