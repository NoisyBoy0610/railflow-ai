'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { AuthModal, UserProfile } from '@/components/AuthModal';
import { EndToEndJourneyWizard } from '@/components/EndToEndJourneyWizard';
import { Subsystem1_TDRRefund } from '@/components/Subsystem1_TDRRefund';
import { Subsystem2_VoiceBooking } from '@/components/Subsystem2_VoiceBooking';
import { Subsystem3_MultiLegOptimizer } from '@/components/Subsystem3_MultiLegOptimizer';
import { Subsystem4_ZeroFrictionBooking } from '@/components/Subsystem4_ZeroFrictionBooking';
import { Subsystem5_QuotaWLAdvisor } from '@/components/Subsystem5_QuotaWLAdvisor';
import { Subsystem6_SeniorBerthAllocator } from '@/components/Subsystem6_SeniorBerthAllocator';
import { Subsystem7_TatkalSpeedrun } from '@/components/Subsystem7_TatkalSpeedrun';
import { Subsystem8_DisruptionCopilot } from '@/components/Subsystem8_DisruptionCopilot';
import { Subsystem9_StationConcierge } from '@/components/Subsystem9_StationConcierge';
import { Subsystem10_RailMadadVision } from '@/components/Subsystem10_RailMadadVision';
import { TrainSearchAndList } from '@/components/TrainSearchAndList';
import { PNRTracker } from '@/components/PNRTracker';
import { LiveTrainRadar } from '@/components/LiveTrainRadar';
import { IndicLanguage, TravelClass, QuotaType } from '@/lib/types';
import { soundEffects } from '@/lib/audio';
import { 
  Sparkles, Train as TrainIcon, Mic, GitFork, Zap, HelpCircle, Users, 
  Timer, Scale, AlertCircle, Accessibility, Camera, Search, Radio, Compass, ShieldCheck, Smartphone, Fingerprint, Award
} from 'lucide-react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<IndicLanguage>('en');
  const [activeTab, setActiveTab] = useState<string>('golden_flow');
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Train Search pre-fills from voice
  const [searchSource, setSearchSource] = useState<string>('SBC');
  const [searchDest, setSearchDest] = useState<string>('MAS');
  const [searchClass, setSearchClass] = useState<TravelClass>('3A');
  const [searchQuota, setSearchQuota] = useState<QuotaType>('GN');

  const subsystems = [
    { id: 'golden_flow', title: '🚀 End-to-End Golden Flow', short: 'Golden Flow', icon: Award, badge: 'Judge Showcase' },
    { id: 'overview', title: 'Train Search & Booking', short: 'Search', icon: Search, badge: 'Main Hub' },
    { id: 'subsystem2', title: 'Indic Voice Booking', short: 'Voice AI', icon: Mic, badge: 'Subsystem 2' },
    { id: 'subsystem3', title: 'Smart Multi-Leg Pathfinder', short: 'Split Seat', icon: GitFork, badge: 'Subsystem 3' },
    { id: 'subsystem4', title: 'Zero-Friction Checkout', short: 'Anti-Dark-Pattern', icon: Zap, badge: 'Subsystem 4' },
    { id: 'subsystem5', title: 'Quota & WL Predictor', short: 'WL Odds', icon: HelpCircle, badge: 'Subsystem 5' },
    { id: 'subsystem6', title: 'Senior Berth Allocator', short: 'Senior SS', icon: Users, badge: 'Subsystem 6' },
    { id: 'subsystem7', title: 'Tatkal Speedrun Sandbox', short: 'Tatkal Rush', icon: Timer, badge: 'Subsystem 7' },
    { id: 'subsystem1', title: 'AI TDR & Auto-Refund', short: 'TDR Dispute', icon: Scale, badge: 'Subsystem 1' },
    { id: 'subsystem8', title: 'Disruption Copilot', short: 'Delay Radar', icon: AlertCircle, badge: 'Subsystem 8' },
    { id: 'subsystem9', title: 'Station Concierge', short: 'Coolie & Buggy', icon: Accessibility, badge: 'Subsystem 9' },
    { id: 'subsystem10', title: 'RailMadad Vision AI', short: 'Vision Triage', icon: Camera, badge: 'Subsystem 10' },
    { id: 'pnr_tracker', title: 'Live PNR Radar', short: 'PNR Status', icon: Compass, badge: 'Utility' },
    { id: 'live_radar', title: 'GPS Running Status', short: 'Train GPS', icon: Radio, badge: 'Utility' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    soundEffects.playTick();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isLowBandwidth ? 'bg-slate-100' : 'bg-[#F8F9FA]'}`}>
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        isLowBandwidth={isLowBandwidth}
        onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Hero Banner with Subsystem Quick Selector */}
      <div className="bg-[#0F2C59] text-white pt-5 pb-8 sm:pt-8 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        {/* Background Subtle Gradient Lights */}
        {!isLowBandwidth && (
          <>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-[10px] sm:text-xs border border-orange-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Public Digital Infrastructure 2.0
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono hidden sm:inline">Build What Moves India</span>
              </div>
              <h1 className="text-xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                RailFlow AI: IRCTC Autonomous Passenger OS
              </h1>
              <p className="text-[11px] sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Complete End-to-End Railway Passenger Lifecycle with 10 integrated agentic subsystems — Indic voice booking, smart multi-leg break-journeys, biometric passkey checkouts, and AI TDR gazette refunds.
              </p>
            </div>

            {/* Quick stats badge */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-lg font-black font-mono text-orange-400">10</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Subsystems</div>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-lg font-black font-mono text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">End-to-End</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black font-mono text-blue-400">10</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Indic Langs</div>
              </div>
            </div>
          </div>

          {/* Subsystem Carousel / Tab Scroller */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {subsystems.map((sub) => {
                const Icon = sub.icon;
                const isActive = activeTab === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => handleTabChange(sub.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                        : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                    <span className="hidden sm:inline">{sub.title}</span>
                    <span className="sm:hidden">{sub.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-8">
        {activeTab === 'golden_flow' && <EndToEndJourneyWizard />}

        {activeTab === 'overview' && (
          <TrainSearchAndList
            initialSource={searchSource}
            initialDest={searchDest}
            initialClass={searchClass}
            initialQuota={searchQuota}
            onSelectBookTrain={() => {
              setActiveTab('subsystem4');
              soundEffects.playConfirmationChime();
            }}
          />
        )}

        {activeTab === 'subsystem1' && <Subsystem1_TDRRefund />}

        {activeTab === 'subsystem2' && (
          <Subsystem2_VoiceBooking
            currentLang={currentLang}
            onApplySearch={(intent) => {
              setSearchSource(intent.sourceCode);
              setSearchDest(intent.destCode);
              setSearchClass(intent.classType);
              setSearchQuota(intent.quota);
              setActiveTab('overview');
              soundEffects.playConfirmationChime();
            }}
          />
        )}

        {activeTab === 'subsystem3' && <Subsystem3_MultiLegOptimizer />}
        {activeTab === 'subsystem4' && <Subsystem4_ZeroFrictionBooking />}
        {activeTab === 'subsystem5' && <Subsystem5_QuotaWLAdvisor />}
        {activeTab === 'subsystem6' && <Subsystem6_SeniorBerthAllocator />}
        {activeTab === 'subsystem7' && <Subsystem7_TatkalSpeedrun />}
        {activeTab === 'subsystem8' && <Subsystem8_DisruptionCopilot />}
        {activeTab === 'subsystem9' && <Subsystem9_StationConcierge />}
        {activeTab === 'subsystem10' && <Subsystem10_RailMadadVision />}
        {activeTab === 'pnr_tracker' && <PNRTracker />}
        {activeTab === 'live_radar' && <LiveTrainRadar />}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={handleTabChange}
      />

      {/* Footer */}
      <footer className="hidden md:block bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
              <TrainIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">RailFlow AI (IRCTC 2.0)</p>
              <p className="text-[11px] text-slate-500">Autonomous Public Digital Railway Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile App PWA Ready
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Fingerprint className="w-3.5 h-3.5" />
              WebAuthn Passkeys Active
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Award className="w-3.5 h-3.5" />
              100% End-to-End Flow Connected
            </span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* OpenAI Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}
