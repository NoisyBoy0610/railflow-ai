'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Key, Wifi, Clock, Train, Volume2, Globe, Fingerprint, UserCheck, LogIn } from 'lucide-react';
import { INDIC_LANGUAGES, soundEffects } from '@/lib/audio';
import { IndicLanguage } from '@/lib/types';
import { aiEngine } from '@/lib/aiEngine';
import { UserProfile } from './AuthModal';

interface NavbarProps {
  currentLang: IndicLanguage;
  onLanguageChange: (lang: IndicLanguage) => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isLowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  onOpenApiKeyModal: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab: _activeTab,
  onSelectTab,
  isLowBandwidth,
  onToggleLowBandwidth,
  onOpenApiKeyModal,
  currentUser,
  onOpenAuthModal,
}) => {
  const [time, setTime] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    setHasApiKey(aiEngine.hasCustomKey());
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F2C59] text-white shadow-xl border-b border-slate-700/50">
      {/* Top micro-bar for Hackathon badge & system status */}
      <div className="bg-[#081730] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 font-semibold border border-orange-500/30">
            <Sparkles className="w-3 h-3 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            Hackathon Build: Build What Moves India (Public Digital Infrastructure)
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Synthetic PRS Engine: ONLINE
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1 font-mono text-orange-300 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>IST {time || '00:00:00'}</span>
          </div>

          <button
            onClick={onToggleLowBandwidth}
            title="Toggle Low Bandwidth Mode for Tier-2/3 Network Resilience"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
              isLowBandwidth ? 'bg-amber-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span>{isLowBandwidth ? '2G Lite' : 'High Speed'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0F2C59] rounded-[10px] flex items-center justify-center">
              <Train className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-300 bg-clip-text text-transparent">
                RailFlow AI
              </h1>
              <span className="px-1 py-0.2 rounded bg-orange-500 text-white text-[9px] font-black tracking-wider uppercase">
                IRCTC 2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Next-Gen Autonomous Railway Passenger OS
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Indic Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-orange-400 absolute left-2 pointer-events-none" />
            <select
              value={currentLang}
              onChange={(e) => {
                const newLang = e.target.value as IndicLanguage;
                onLanguageChange(newLang);
                soundEffects.playConfirmationChime();
              }}
              className="pl-7 pr-2.5 py-1.5 text-xs font-medium bg-slate-800/90 text-white rounded-lg border border-slate-700 hover:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer appearance-none"
            >
              {INDIC_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Biometric / Fast Login Button */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              currentUser
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
            }`}
          >
            {currentUser ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                <span className="sm:hidden">Profile</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fast Biometric Login</span>
                <span className="sm:hidden">Login</span>
              </>
            )}
          </button>

          {/* OpenAI Key modal trigger */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm hidden sm:flex ${
              hasApiKey
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{hasApiKey ? 'GPT-4o Ready' : 'AI Key'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
