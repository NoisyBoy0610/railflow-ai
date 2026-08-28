'use client';

import React, { useState } from 'react';
import { Search, Mic, GitFork, Timer, Menu, X, Scale, Users, AlertCircle, Accessibility, Camera, Compass, Radio, Sparkles, Award } from 'lucide-react';
import { soundEffects } from '@/lib/audio';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);

  const handleNavClick = (tabId: string) => {
    soundEffects.playTick();
    onSelectTab(tabId);
    setIsMoreMenuOpen(false);

    // Haptic feedback for mobile devices
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch (e) {}
    }
  };

  const moreSubsystems = [
    { id: 'golden_flow', title: '🚀 End-to-End Golden Flow', desc: 'Complete 5-Step Hackathon Demo', icon: Award, badge: 'Judges' },
    { id: 'subsystem1', title: 'AI TDR & Auto-Refund', desc: 'Rule 14.1-14.22 Dispute Adjudication', icon: Scale, badge: 'Subsystem 1' },
    { id: 'subsystem4', title: 'Zero-Friction Checkout', desc: 'No Captcha & Transparent Fares', icon: Sparkles, badge: 'Subsystem 4' },
    { id: 'subsystem5', title: 'Quota & WL Predictor', desc: 'GNWL, RLWL & RAC Odds', icon: Compass, badge: 'Subsystem 5' },
    { id: 'subsystem6', title: 'Senior Berth Allocator', desc: 'Lower Berth (SS) Co-Location', icon: Users, badge: 'Subsystem 6' },
    { id: 'subsystem8', title: 'Disruption Copilot', desc: '>3hr Delay Radar & Free Reschedule', icon: AlertCircle, badge: 'Subsystem 8' },
    { id: 'subsystem9', title: 'Station Concierge', desc: 'Coolie Tariff, Buggy & Meals', icon: Accessibility, badge: 'Subsystem 9' },
    { id: 'subsystem10', title: 'RailMadad Vision AI', desc: 'Photo Grievance Triage', icon: Camera, badge: 'Subsystem 10' },
    { id: 'pnr_tracker', title: 'Live PNR Radar', desc: 'Chart Status & Seat Map', icon: Compass, badge: 'Utility' },
    { id: 'live_radar', title: 'GPS Running Status', desc: 'Live Train Timeline', icon: Radio, badge: 'Utility' },
  ];

  return (
    <>
      {/* More Services Bottom Sheet Drawer for Mobile */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div 
            onClick={() => setIsMoreMenuOpen(false)}
            className="flex-1 w-full"
          />
          <div className="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 max-h-[80vh] overflow-y-auto space-y-4 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <h3 className="text-sm font-black text-slate-900">All 10 RailFlow Subsystems</h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreSubsystems.map((sub) => {
                const Icon = sub.icon;
                const isActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleNavClick(sub.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{sub.title}</div>
                        <div className="text-[10px] text-slate-500">{sub.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {sub.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0F2C59]/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        {/* Golden Flow */}
        <button
          onClick={() => handleNavClick('golden_flow')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'golden_flow' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-bold">Journey</span>
        </button>

        {/* Search */}
        <button
          onClick={() => handleNavClick('overview')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'overview' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">Search</span>
        </button>

        {/* Center Floating Voice Button */}
        <div className="relative -top-5">
          <button
            onClick={() => handleNavClick('subsystem2')}
            className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/50 ring-4 ring-[#0F2C59] active:scale-95 transition-transform"
          >
            <Mic className="w-6 h-6" />
          </button>
          <span className="block text-center text-[9px] font-black text-orange-300 mt-1 uppercase tracking-tight">
            Voice AI
          </span>
        </div>

        {/* Tatkal Speedrun */}
        <button
          onClick={() => handleNavClick('subsystem7')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'subsystem7' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tatkal</span>
        </button>

        {/* More Drawer */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
            isMoreMenuOpen ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold">More (10)</span>
        </button>
      </nav>
    </>
  );
};
