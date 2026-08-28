'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Zap, Trophy, CheckCircle2, AlertTriangle, ShieldCheck, Play, RotateCcw, Clock, Lock } from 'lucide-react';
import { soundEffects } from '@/lib/audio';
import confetti from 'canvas-confetti';

export const Subsystem7_TatkalSpeedrun: React.FC = () => {
  const [gameState, setGameState] = useState<'IDLE' | 'COUNTDOWN' | 'RUSH_ACTIVE' | 'COMPLETED' | 'FAILED'>('IDLE');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3);
  const [timerMs, setTimerMs] = useState<number>(0);
  const [tatkalSeatsLeft, setTatkalSeatsLeft] = useState<number>(24);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  // Steps in pre-flight
  const steps = [
    { title: 'Autofill Master Passenger Details', desc: 'Pre-verified Aadhaar tokens injected in 0.2s' },
    { title: 'Bypass CAPTCHA via Pre-Flight Challenge', desc: 'Sub-second cryptographic verification' },
    { title: 'Pre-Authorized Instant Synthetic Pay', desc: 'Tokenized 1-tap fast debit clearance' }
  ];

  // Rush countdown ticker
  useEffect(() => {
    let interval: any;
    if (gameState === 'COUNTDOWN') {
      interval = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            startRushMode();
            return 0;
          }
          soundEffects.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Active rush stopwatch
  useEffect(() => {
    let timer: any;
    let seatDrain: any;
    if (gameState === 'RUSH_ACTIVE') {
      const startTime = Date.now();
      timer = setInterval(() => {
        setTimerMs(Date.now() - startTime);
      }, 10);

      // Seats deplete rapidly every 400ms
      seatDrain = setInterval(() => {
        setTatkalSeatsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(seatDrain);
            return 0;
          }
          return prev - 1;
        });
      }, 350);
    }
    return () => {
      clearInterval(timer);
      clearInterval(seatDrain);
    };
  }, [gameState]);

  const handleStartSimulation = () => {
    setGameState('COUNTDOWN');
    setCountdownSeconds(3);
    setTimerMs(0);
    setTatkalSeatsLeft(24);
    setCurrentStep(0);
    soundEffects.playTick();
  };

  const startRushMode = () => {
    setGameState('RUSH_ACTIVE');
    soundEffects.playTrainHorn();
  };

  const handleExecuteStep = (stepIdx: number) => {
    if (gameState !== 'RUSH_ACTIVE') return;

    soundEffects.playTick();
    if (stepIdx === currentStep) {
      if (stepIdx === steps.length - 1) {
        // Finished!
        setGameState('COMPLETED');
        soundEffects.playConfirmationChime();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}

        setBestTime((prev) => (prev ? Math.min(prev, timerMs) : timerMs));
      } else {
        setCurrentStep(stepIdx + 1);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Subsystem Header */}
      <div className="bg-gradient-to-r from-[#0F2C59] to-[#1A407A] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold uppercase">
                  Subsystem 7
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Tatkal Rush Rapid-Form Pre-Flight Sandbox
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Local pre-flight builder for sub-10-second booking when the 10:00 / 11:00 AM Tatkal window opens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Target: &lt; 5.0 Seconds</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Pre-Flight Sandbox Arena */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Simulator Header Card */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                  Simulated 10:00:00 AM AC Tatkal Rush
                </span>
                <h4 className="text-sm font-bold text-white">Train 12658 (SBC ➔ MAS • 3A Tatkal)</h4>
              </div>

              {/* Seats Remaining Counter */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Tatkal Quota Pool</span>
                <span className={`text-xl font-black font-mono ${
                  tatkalSeatsLeft > 10 ? 'text-emerald-400' : tatkalSeatsLeft > 3 ? 'text-amber-400 animate-pulse' : 'text-rose-500 font-extrabold'
                }`}>
                  {tatkalSeatsLeft} Seats Left
                </span>
              </div>
            </div>

            {/* Stopwatch Meter */}
            <div className="my-4 p-4 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Speedrun Stopwatch</span>
                <span className="text-3xl font-black font-mono text-orange-400">
                  {(timerMs / 1000).toFixed(2)}s
                </span>
              </div>

              {bestTime && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Personal Best Record</span>
                  <span className="text-sm font-black font-mono text-emerald-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    {(bestTime / 1000).toFixed(2)}s
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Steps */}
            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const isCurrent = currentStep === idx && gameState === 'RUSH_ACTIVE';
                const isPassed = currentStep > idx || gameState === 'COMPLETED';

                return (
                  <button
                    key={idx}
                    disabled={!isCurrent}
                    onClick={() => handleExecuteStep(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isPassed
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : isCurrent
                        ? 'bg-orange-500/20 border-orange-500 text-white ring-2 ring-orange-500/40 animate-pulse'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                        isPassed ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{step.title}</div>
                        <div className="text-[10px] text-slate-400">{step.desc}</div>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs rounded-lg shadow-sm">
                        CLICK NOW!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            {gameState === 'IDLE' || gameState === 'COMPLETED' ? (
              <button
                onClick={handleStartSimulation}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{gameState === 'COMPLETED' ? 'Run Speedrun Again' : 'Start 10:00 AM Tatkal Simulation'}</span>
              </button>
            ) : gameState === 'COUNTDOWN' ? (
              <div className="w-full py-3.5 bg-rose-600 text-white rounded-xl font-black text-sm text-center animate-pulse">
                Window Opens in {countdownSeconds}s... GET READY!
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Pre-Flight Advantages & Explanations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Why Legacy IRCTC Fails at 10:00 AM:
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2 text-rose-700">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span><strong>Manual Typing:</strong> Takes 45-90 seconds to enter passenger names and captcha.</span>
              </div>
              <div className="flex items-start gap-2 text-rose-700">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span><strong>Payment Gateway Drops:</strong> 3D Secure OTP latencies cause quota to exhaust mid-transaction.</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              RailFlow AI Pre-Flight Solution:
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span><strong>Pre-Staged Token:</strong> Master passenger list is pre-verified in local cache 15 mins before 10:00 AM.</span>
              </div>
              <div className="flex items-start gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span><strong>Pre-Authorized Intent:</strong> Bank payment token is held in escrow and executed in 40ms upon quota release.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
