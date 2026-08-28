'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Wifi, Clock, Train, Globe, Fingerprint, UserCheck, LogIn, Sparkles, Key } from 'lucide-react';
import { INDIC_LANGUAGES, soundEffects } from '@/lib/audio';
import { IndicLanguage } from '@/lib/types';
import { aiEngine } from '@/lib/aiEngine';
import { TRANSLATIONS } from '@/lib/translations';
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
  activeTab,
  onSelectTab,
  isLowBandwidth,
  onToggleLowBandwidth,
  onOpenApiKeyModal,
  currentUser,
  onOpenAuthModal,
}) => {
  const [time, setTime] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

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
    <header className="sticky top-0 z-50 w-full bg-[#0B2545] text-white shadow-xl border-b border-slate-700/50">
      {/* Top Official Railway Service Status Bar */}
      <div className="bg-[#06182E] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex items-center gap-1.5 text-orange-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.prsStatus}</span>
          </div>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-300 text-[11px]">
            {t.crisConnected}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1 font-mono text-orange-300 text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>IST {time || '00:00:00'}</span>
          </div>

          <button
            onClick={onToggleLowBandwidth}
            title="Toggle Network Optimization for Low Bandwidth"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
              isLowBandwidth ? 'bg-amber-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span>{isLowBandwidth ? 'Lite 2G Mode' : 'High Speed'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Official Railway Identity */}
        <div 
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B2545] rounded-[10px] flex items-center justify-center">
              <Train className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                RailFlow
              </h1>
              <span className="px-1.5 py-0.2 rounded bg-orange-500 text-white text-[9px] font-black tracking-wider uppercase">
                IRCTC 2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium hidden sm:block">
              Next-Gen Indian Railways Passenger Portal
            </p>
          </div>
        </div>

        {/* Primary Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-200">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.bookTrains}
          </button>
          <button
            onClick={() => onSelectTab('pnr_tracker')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pnr_tracker' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.pnrStatus}
          </button>
          <button
            onClick={() => onSelectTab('ticket_wallet')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ticket_wallet' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.ticketWallet}
          </button>
          <button
            onClick={() => onSelectTab('seat_map')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'seat_map' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.coachSeatMap}
          </button>
          <button
            onClick={() => onSelectTab('live_radar')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'live_radar' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.liveTrainGps}
          </button>
          <button
            onClick={() => onSelectTab('station_board')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'station_board' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.stationBoard}
          </button>
          <button
            onClick={() => onSelectTab('subsystem10')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'subsystem10' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.railMadad}
          </button>
          <button
            onClick={() => onSelectTab('subsystem1')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'subsystem1' ? 'bg-white/15 text-white' : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            {t.tdrRefunds}
          </button>
        </nav>

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

          {/* User Account / Profile */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              currentUser
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
            }`}
          >
            {currentUser ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                <span className="sm:hidden">Account</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">IRCTC Sign In</span>
                <span className="sm:hidden">Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
