'use client';

import React, { useState } from 'react';
import { HelpCircle, Sparkles, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { aiEngine, QuotaWLInsight } from '@/lib/aiEngine';
import { soundEffects } from '@/lib/audio';

export const Subsystem5_QuotaWLAdvisor: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<string>('GNWL');
  const [wlNumber, setWlNumber] = useState<number>(34);
  const [insight, setInsight] = useState<QuotaWLInsight>(aiEngine.explainWaitlistQuota('GNWL', 34));

  const handleUpdate = (code: string, num: number) => {
    setSelectedCode(code);
    setWlNumber(num);
    const res = aiEngine.explainWaitlistQuota(code, num);
    setInsight(res);
    soundEffects.playTick();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 5
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Explainable Quota & Waitlist (WL/RAC) Predictor
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Demystifying cryptic IRCTC codes (GNWL, RLWL, PQWL, RAC) with confirmation probability & quota recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>AI Probabilistic Engine</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Selector & Number Slider */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Waitlist Code to Explain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['GNWL', 'RLWL', 'PQWL', 'RAC'].map((code) => (
                <button
                  key={code}
                  onClick={() => handleUpdate(code, wlNumber)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold text-center border transition-all ${
                    selectedCode === code
                      ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Waitlist Position:
              </label>
              <span className="text-sm font-black font-mono text-orange-600">
                {selectedCode} {wlNumber}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={wlNumber}
              onChange={(e) => handleUpdate(selectedCode, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>WL 1 (Near Chart Conversion)</span>
              <span>WL 50</span>
              <span>WL 100 (Regret Zone)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Common Test Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleUpdate('GNWL', 12)}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
              >
                🟢 GNWL 12 (High Chance)
              </button>
              <button
                onClick={() => handleUpdate('RLWL', 18)}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
              >
                🟡 RLWL 18 (Moderate)
              </button>
              <button
                onClick={() => handleUpdate('PQWL', 35)}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
              >
                🔴 PQWL 35 (Low Chance)
              </button>
              <button
                onClick={() => handleUpdate('RAC', 8)}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
              >
                🟢 RAC 8 (Guaranteed Travel)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Explainer Card & Probability Meter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-xs">
                    {insight.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {insight.fullName}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Priority Rank: #{insight.priorityLevel === 0 ? 'Guaranteed Boarding' : insight.priorityLevel + ' in Indian Railways Quota Order'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Confirmation Odds</span>
                <span className={`text-2xl font-black font-mono ${
                  insight.confirmationChancePercent >= 75
                    ? 'text-emerald-600'
                    : insight.confirmationChancePercent >= 45
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}>
                  {insight.confirmationChancePercent}%
                </span>
              </div>
            </div>

            {/* Probability Progress Bar */}
            <div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    insight.confirmationChancePercent >= 75
                      ? 'bg-emerald-500'
                      : insight.confirmationChancePercent >= 45
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${insight.confirmationChancePercent}%` }}
                />
              </div>
            </div>

            {/* AI Deep Explanation */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">Why does this quota behave this way?</p>
              {insight.explanation}
            </div>

            {/* Pro Tip */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pro-Tip / Insider Strategy:</span> {insight.proTip}
              </div>
            </div>

            {/* Alternative suggestion */}
            {insight.alternativeSuggestion && (
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Recommended Alternative:</strong> {insight.alternativeSuggestion}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
