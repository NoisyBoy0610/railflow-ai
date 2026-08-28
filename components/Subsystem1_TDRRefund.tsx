'use client';

import React, { useState } from 'react';
import { Scale, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw, Calculator, IndianRupee } from 'lucide-react';
import { aiEngine, TDRRefundEvaluation } from '@/lib/aiEngine';
import { soundEffects } from '@/lib/audio';
import { TDR_RULES, MOCK_PNRS } from '@/lib/mockData';

export const Subsystem1_TDRRefund: React.FC = () => {
  const [selectedPnr, setSelectedPnr] = useState<string>('821-4928103');
  const [customPnr, setCustomPnr] = useState<string>('');
  const [passengerStatement, setPassengerStatement] = useState<string>(
    'Train 12658 delayed by 3.5 hours at Bengaluru (SBC), did not board and booked a cab instead. Requesting full refund.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<TDRRefundEvaluation | null>(null);
  const [isFiled, setIsFiled] = useState<boolean>(false);
  const [refundToken, setRefundToken] = useState<string>('');

  const handleEvaluate = () => {
    setIsAnalyzing(true);
    setIsFiled(false);
    
    setTimeout(() => {
      const activePnr = customPnr.trim() || selectedPnr;
      const pnrData = MOCK_PNRS[activePnr];
      const fare = pnrData ? pnrData.farePaid : 1470;
      
      const res = aiEngine.evaluateTDRClaim(activePnr, passengerStatement, fare, 215);
      setEvaluation(res);
      setIsAnalyzing(false);
      soundEffects.playConfirmationChime();
    }, 600);
  };

  const handle1ClickFiling = () => {
    setIsFiled(true);
    const token = 'TDR-IRCTC-' + Math.floor(100000 + Math.random() * 900000);
    setRefundToken(token);
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 1
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  AI TDR & Auto-Refund Dispute Engine
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated IRCTC Gazette Rule 14.1–14.22 clause deduction & net refund adjudication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Gazette Rulebase (2026 Rules)</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select or Enter Synthetic PNR
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {Object.keys(MOCK_PNRS).map((pnrKey) => (
                <button
                  key={pnrKey}
                  onClick={() => {
                    setSelectedPnr(pnrKey);
                    setCustomPnr('');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono text-center transition-all ${
                    selectedPnr === pnrKey && !customPnr
                      ? 'bg-orange-500 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pnrKey}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or enter custom 10-digit PNR..."
              value={customPnr}
              onChange={(e) => setCustomPnr(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Passenger Dispute Statement / Cause of Cancellation
            </label>
            <textarea
              rows={4}
              value={passengerStatement}
              onChange={(e) => setPassengerStatement(e.target.value)}
              placeholder="Describe the journey issue e.g. Train delayed > 3 hours, AC coach cooling failed, train diverted..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
            />
          </div>

          {/* Quick Scenario Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Instant Hackathon Test Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setPassengerStatement('Train 12658 delayed by 3.5 hours at origin station SBC. Passenger did not travel.');
                }}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
              >
                ⏱️ &gt; 3hr Train Delay (Rule 14.1)
              </button>
              <button
                onClick={() => {
                  setPassengerStatement('AC coach B2 compressor failed throughout overnight journey, no cooling provided.');
                }}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
              >
                ❄️ AC Failure in 3A (Rule 14.4)
              </button>
              <button
                onClick={() => {
                  setPassengerStatement('Train diverted via longer alternative loop line, passenger refused to travel.');
                }}
                className="text-[11px] bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
              >
                🔄 Train Diverted (Rule 14.7)
              </button>
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Against IRCTC Gazette Rules...</span>
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>Adjudicate TDR Claim & Calculate Net Refund</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Adjudication Results & Calculation */}
        <div className="lg:col-span-7">
          {evaluation ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Rule Card */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-mono font-bold text-xs">
                      {evaluation.ruleMatched.ruleCode}
                    </span>
                    <h4 className="text-sm font-bold text-emerald-950">
                      {evaluation.ruleMatched.title}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    {evaluation.eligibleRefundPercent}% Refund Eligible
                  </span>
                </div>
                <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                  {evaluation.reasoningClause}
                </p>
                <div className="mt-2 text-[11px] text-emerald-700 font-medium">
                  🕒 Filing Window: {evaluation.ruleMatched.timeWindowDescription}
                </div>
              </div>

              {/* Net Refund Calculation Ledger */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-orange-500" />
                  Itemized Transparent Refund Breakdown
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Original Base Fare Paid (PNR {selectedPnr}):</span>
                    <span className="font-mono font-semibold text-slate-900">₹{evaluation.baseFare}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Eligible Adjudication Percentage:</span>
                    <span className="font-semibold text-emerald-600">{evaluation.eligibleRefundPercent}%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IRCTC Clerkage Charge Deducted:</span>
                    <span className="font-mono text-slate-900">
                      {evaluation.clerkageDeducted === 0 ? '₹0 (Waived Under Gazette Exemption)' : `-₹${evaluation.clerkageDeducted}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST Adjustment Credit:</span>
                    <span className="font-mono text-emerald-600">+₹{evaluation.gstAdjustment}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-extrabold text-[#0F2C59]">Total Net Bank Credit:</span>
                    <span className="text-lg font-black font-mono text-emerald-600">
                      ₹{evaluation.netRefundAmount + evaluation.gstAdjustment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              {!isFiled ? (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between gap-4">
                  <div className="text-xs text-orange-950">
                    <p className="font-bold">Instant 1-Click TDR Submission</p>
                    <p className="text-[11px] text-orange-800">Auto-routes to CRIS PRS Refund Clearinghouse via synthetic token.</p>
                  </div>
                  <button
                    onClick={handle1ClickFiling}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>Confirm & File TDR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-md space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <h5 className="font-bold text-sm">TDR Successfully Filed & Verified</h5>
                  </div>
                  <div className="text-xs text-emerald-100">
                    Dispute Reference Token: <span className="font-mono font-bold text-white px-1.5 py-0.5 rounded bg-emerald-800">{refundToken}</span>
                  </div>
                  <p className="text-[11px] text-emerald-100">
                    ₹{evaluation.netRefundAmount + evaluation.gstAdjustment} will be credited to source payment instrument within 24-48 banking hours.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No Dispute Adjudication Yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Select a sample PNR or customize the cancellation reason to run the AI Gazette Adjudication Engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
