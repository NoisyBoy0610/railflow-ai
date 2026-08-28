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
import { LiveStationBoard } from '@/components/LiveStationBoard';
import { CoachSeatMapSelector } from '@/components/CoachSeatMapSelector';
import { LiveTrainRouteMap } from '@/components/LiveTrainRouteMap';
import { DigitalTicketWallet } from '@/components/DigitalTicketWallet';
import { IndicLanguage, TravelClass, QuotaType } from '@/lib/types';
import { soundEffects } from '@/lib/audio';
import { 
  Sparkles, Train as TrainIcon, Mic, GitFork, Zap, HelpCircle, Users, 
  Timer, Scale, AlertCircle, Accessibility, Camera, Search, Radio, Compass, ShieldCheck, Smartphone, Fingerprint, Award, Tv, Bed, QrCode
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

  const navigationServices = [
    { id: 'golden_flow', title: 'Unified Booking Lifecycle', short: 'Booking Flow', icon: Award },
    { id: 'ticket_wallet', title: 'Electronic Reservation Slip (ERS) & Digital Wallet', short: 'E-Ticket', icon: QrCode },
    { id: 'seat_map', title: 'Visual Coach Blueprint & Berth Selector', short: 'Seat Map', icon: Bed },
    { id: 'track_radar', title: 'Geo-Spatial Track Radar & Route Milestones', short: 'Track Radar', icon: Compass },
    { id: 'overview', title: 'Train Search & Seat Availability', short: 'Search', icon: Search },
    { id: 'station_board', title: 'Live Station Platform Display Board', short: 'Station Board', icon: Tv },
    { id: 'subsystem7', title: 'Tatkal Fast-Track Portal (10 AM / 11 AM)', short: 'Tatkal Express', icon: Timer },
    { id: 'subsystem2', title: 'AskDISHA 2.0 AI Voice Booking', short: 'Voice AI', icon: Mic },
    { id: 'subsystem3', title: 'Connecting Route & Split-Seat Finder', short: 'Split Seat', icon: GitFork },
    { id: 'subsystem4', title: 'Instant Express Checkout', short: 'Fast Checkout', icon: Zap },
    { id: 'subsystem5', title: 'Waitlist & RAC Confirmation Predictor', short: 'WL Predictor', icon: HelpCircle },
    { id: 'subsystem6', title: 'Senior Citizen & Family Lower Berth Allocator', short: 'Senior SS', icon: Users },
    { id: 'subsystem1', title: 'TDR & Gazette Auto-Refund Claims', short: 'TDR Refunds', icon: Scale },
    { id: 'subsystem8', title: 'Live Disruption & Delay Copilot', short: 'Delay Radar', icon: AlertCircle },
    { id: 'subsystem9', title: 'Station Concierge & Buggy Services', short: 'Porter & Buggy', icon: Accessibility },
    { id: 'subsystem10', title: 'RailMadad Grievance Redressal (Vision AI)', short: 'RailMadad', icon: Camera },
    { id: 'pnr_tracker', title: 'Live PNR Status & Coach Position', short: 'PNR Radar', icon: Compass },
    { id: 'live_radar', title: 'GPS Live Train Running Status', short: 'Live GPS', icon: Radio },
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

      {/* Official Railway Passenger Portal Header */}
      <div className="bg-[#0B2545] text-white pt-5 pb-8 sm:pt-7 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        {!isLowBandwidth && (
          <>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] sm:text-xs border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Indian Railways Official Digital Platform
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300 font-mono hidden sm:inline">CRiS PRS Connected</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                RailFlow — Next-Gen Railway Passenger Operating System
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 max-w-3xl leading-relaxed">
                Empowering millions of Indian Railways passengers with AskDISHA 2.0 voice bookings, guaranteed split-seat routing, instant Tatkal checkouts, live GPS train tracking, and automated Gazette TDR refunds.
              </p>
            </div>

            {/* Platform Trust Badges */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-sm font-black font-mono text-orange-400">1.5M+</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Daily Bookings</div>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <div className="text-sm font-black font-mono text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">IRCTC Gazette Compliant</div>
              </div>
              <div className="text-center px-3">
                <div className="text-sm font-black font-mono text-blue-400">10</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Indic Languages</div>
              </div>
            </div>
          </div>

          {/* Service Selector Tabs */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {navigationServices.map((service) => {
                const Icon = service.icon;
                const isActive = activeTab === service.id;

                return (
                  <button
                    key={service.id}
                    onClick={() => handleTabChange(service.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                        : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-400'}`} />
                    <span className="hidden sm:inline">{service.title}</span>
                    <span className="sm:hidden">{service.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Service Content Container */}
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
        {activeTab === 'station_board' && <LiveStationBoard />}
        {activeTab === 'seat_map' && <CoachSeatMapSelector />}
        {activeTab === 'track_radar' && <LiveTrainRouteMap />}
        {activeTab === 'ticket_wallet' && <DigitalTicketWallet />}
      </main>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Modals */}
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
}
