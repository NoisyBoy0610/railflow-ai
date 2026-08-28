'use client';

import React, { useState } from 'react';
import { Scale, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw, Calculator, IndianRupee, AlertCircle, Check } from 'lucide-react';
import { aiEngine, TDRRefundEvaluation } from '@/lib/aiEngine';
import { soundEffects } from '@/lib/audio';
import { TDR_RULES, MOCK_PNRS } from '@/lib/mockData';
import { validateTDRFiling } from '@/lib/validation';
import confetti from 'canvas-confetti';

export const Subsystem1_TDRRefund: React.FC = () => {
  const [pnrInput, setPnrInput] = useState<string>('821-4928103');
  const [selectedRuleCode, setSelectedRuleCode] = useState<string>('Rule 14.1');
  const [delayMinutes, setDelayMinutes] = useState<number>(215);
  const [passengerStatement, setPassengerStatement] = useState<string>(
    'Train 12658 delayed by 3.5 hours at origin station. Did not board and requesting 100% full refund without clerkage deduction under Gazette Rule 14.1.'
  );
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>(['1', '2']);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<TDRRefundEvaluation | null>(null);
  const [isFiled, setIsFiled] = useState<boolean>(false);
  const [refundToken, setRefundToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availablePassengers = [
    { id: '1', name: 'Ramesh Sundaram', age: 34, gender: 'M', berth: 'B2-18 (MB)' },
    { id: '2', name: 'Kalyani Sundaram', age: 64, gender: 'F', berth: 'B2-17 (LB)' }
  ];

  const handleTogglePassenger = (id: string) => {
    if (selectedPassengers.includes(id)) {
      if (selectedPassengers.length === 1) {
        setErrorMessage('At least one passenger must be selected for TDR filing.');
        soundEffects.playAlert();
        return;
      }
      setSelectedPassengers(selectedPassengers.filter(pId => pId !== id));
    } else {
      setSelectedPassengers([...selectedPassengers, id]);
    }
    setErrorMessage(null);
    setEvaluation(null);
    setIsFiled(false);
    soundEffects.playTick();
  };

  const handleEvaluateClaim = () => {
    setErrorMessage(null);
    setIsFiled(false);

    const val = validateTDRFiling(pnrInput, delayMinutes, passengerStatement);
    if (!val.isValid) {
      setErrorMessage(val.error || 'Invalid TDR claim');
      soundEffects.playAlert();
      return;
    }

    setIsAnalyzing(true);
    soundEffects.playTick();

    setTimeout(() => {
      const baseFarePerPax = 735;
      const totalFare = baseFarePerPax * selectedPassengers.length;
      const res = aiEngine.evaluateTDRClaim(pnrInput, passengerStatement, totalFare, delayMinutes);
      setEvaluation(res);
      setIsAnalyzing(false);
      soundEffects.playConfirmationChime();
    }, 600);
  };

  const handleSubmitClaim = () => {
    setIsFiled(true);
    const token = 'TDR-CRIS-' + Math.floor(100000 + Math.random() * 900000);
    setRefundToken(token);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  Official Gazette Policy
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Ticket Deposit Receipt (TDR) & Automated Refund Claims
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Indian Railways Gazette Rules (Rule 14.1 - 14.22) automated dispute evaluation & zero-clerkage refund claims
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ministry of Railways Gazette Compliance</span>
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
          {/* Left Column: Form & Parameters */}
          <div className="lg:col-span-6 space-y-4">
            {/* PNR & Gazette Reason */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase block">1. PNR & Official Dispute Clause</span>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Booked PNR Number</label>
                <input
                  type="text"
                  value={pnrInput}
                  onChange={(e) => {
                    setPnrInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 821-4928103"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Official IRCTC TDR Clause</label>
                <select
                  value={selectedRuleCode}
                  onChange={(e) => {
                    setSelectedRuleCode(e.target.value);
                    const rule = TDR_RULES.find(r => r.ruleCode === e.target.value);
                    if (rule) {
                      setPassengerStatement(`Filing claim under ${rule.ruleCode}: "${rule.title}". Demanding eligible refund.`);
                    }
                  }}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                >
                  {TDR_RULES.map((rule) => (
                    <option key={rule.ruleCode} value={rule.ruleCode}>
                      {rule.ruleCode} - {rule.title} ({rule.eligibleRefundPercent}% Refund)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Verified Train Delay</label>
                  <span className="text-xs font-mono font-bold text-orange-600">{delayMinutes} Minutes ({Math.floor(delayMinutes / 60)}h {delayMinutes % 60}m)</span>
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
              </div>
            </div>

            {/* Select Passengers */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase block">
                2. Select Passengers for Cancellation / TDR ({selectedPassengers.length} Selected)
              </span>

              <div className="space-y-2">
                {availablePassengers.map((p) => (
                  <label
                    key={p.id}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedPassengers.includes(p.id) ? 'bg-orange-50/80 border-orange-400' : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPassengers.includes(p.id)}
                        onChange={() => handleTogglePassenger(p.id)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{p.name} ({p.age}y / {p.gender})</div>
                        <div className="text-[11px] text-slate-500">Allocated Berth: {p.berth}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700">₹735 Fare</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Statement */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Passenger Dispute Explanation Statement:
              </label>
              <textarea
                rows={3}
                value={passengerStatement}
                onChange={(e) => setPassengerStatement(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl leading-relaxed"
              />
            </div>

            <button
              onClick={handleEvaluateClaim}
              disabled={isAnalyzing}
              className="w-full py-3 bg-[#0B2545] hover:bg-[#133E6E] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Claim against Railway Gazette Rules...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 text-orange-400" />
                  <span>Evaluate TDR Claim per Gazette Policy</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Dynamic Gazette Outcome & Claim Submission */}
          <div className="lg:col-span-6 space-y-4">
            {evaluation ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Rule Matched Banner */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950">Gazette Adjudication Result:</span>
                    <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-black uppercase">
                      {evaluation.ruleMatched.ruleCode} APPROVED
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{evaluation.ruleMatched.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {evaluation.reasoningClause}
                  </p>
                </div>

                {/* Refund Breakdown */}
                <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Calculated Refund Settlement
                  </span>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Total Fare Paid ({selectedPassengers.length} pax)</span>
                      <span className="font-mono text-white">₹{evaluation.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eligible Gazette Refund Percentage</span>
                      <span className="font-mono text-emerald-400">{evaluation.eligibleRefundPercent}%</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Clerkage Fee Deduction</span>
                      <span className="font-mono">
                        {evaluation.clerkageDeducted === 0 ? '₹0 (Zero Clerkage Waived under Rule 14.1)' : `₹${evaluation.clerkageDeducted}`}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-bold text-white">
                      <span>Net Refund Payable to Source Account</span>
                      <span className="font-mono text-emerald-400">₹{evaluation.netRefundAmount}</span>
                    </div>
                  </div>

                  {isFiled ? (
                    <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center space-y-1">
                      <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-emerald-300">TDR Claim Transmitted to CRiS Gateway!</div>
                      <p className="text-[11px] text-slate-300 font-mono">Receipt Token: {refundToken}</p>
                      <p className="text-[10px] text-emerald-400 mt-1">Direct Bank Account Credit expected within 5-7 business days.</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmitClaim}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Instant 1-Click TDR Claim (₹{evaluation.netRefundAmount})</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-2">
                <Scale className="w-10 h-10 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No Claim Evaluated Yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  Select your PNR, choose the official Gazette Clause, and click &quot;Evaluate TDR Claim&quot; to calculate your net refund.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
