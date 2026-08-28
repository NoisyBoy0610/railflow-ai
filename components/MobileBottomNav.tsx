'use client';

import React, { useState } from 'react';
import { Search, Mic, GitFork, Timer, Menu, X, Scale, Users, AlertCircle, Accessibility, Camera, Compass, Radio, Sparkles, Award, QrCode, Bed } from 'lucide-react';
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

    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch (e) {}
    }
  };

  const allServices = [
    { id: 'golden_flow', title: 'Unified Booking Lifecycle', desc: 'Step-by-Step Ticket Journey', icon: Award, badge: 'Unified' },
    { id: 'ticket_wallet', title: 'Electronic Reservation Slip (ERS)', desc: 'Official QR Code E-Ticket', icon: QrCode, badge: 'E-Ticket' },
    { id: 'seat_map', title: 'Visual Coach Blueprint & Seat Map', desc: 'LHB Berth Selection Grid', icon: Bed, badge: 'Seat Map' },
    { id: 'track_radar', title: 'Live Geo-Spatial Track Radar', desc: 'Locomotive Milestones & Speed', icon: Compass, badge: 'Track GPS' },
    { id: 'subsystem1', title: 'TDR & Gazette Auto-Refund Claims', desc: 'Rule 14.1-14.22 Dispute Adjudication', icon: Scale, badge: 'Refunds' },
    { id: 'subsystem3', title: 'Connecting Route & Split-Seat Finder', desc: 'Guaranteed 100% CNF Routing', icon: GitFork, badge: 'Routing' },
    { id: 'subsystem4', title: 'Instant Express Checkout', desc: 'Zero Dark-Patterns & 1-Click Pay', icon: Sparkles, badge: 'Fast Pay' },
    { id: 'subsystem5', title: 'Waitlist & RAC Predictor', desc: 'GNWL, RLWL & RAC Clearance Odds', icon: Compass, badge: 'Predictor' },
    { id: 'subsystem6', title: 'Senior SS Lower Berth Allocator', desc: 'Lower Berth Co-Location Engine', icon: Users, badge: 'Senior SS' },
    { id: 'subsystem7', title: 'Tatkal Fast-Track Portal', desc: '10 AM / 11 AM Rapid Booking', icon: Timer, badge: 'Tatkal' },
    { id: 'subsystem8', title: 'Live Disruption & Delay Copilot', desc: '>3hr Delay Radar & Free Reschedule', icon: AlertCircle, badge: 'Copilot' },
    { id: 'subsystem9', title: 'Station Concierge & Buggy Services', desc: 'Standardized Coolie Tariff & Wheelchair', icon: Accessibility, badge: 'Station' },
    { id: 'subsystem10', title: 'RailMadad Grievance Redressal', desc: 'Vision AI Photo Complaint Triage', icon: Camera, badge: 'Grievance' },
    { id: 'pnr_tracker', title: 'Live PNR Status & Coach Position', desc: 'Chart Status & Train Rake Map', icon: Compass, badge: 'PNR' },
    { id: 'live_radar', title: 'GPS Live Train Running Status', desc: 'Live Train Timeline & Halts', icon: Radio, badge: 'Live GPS' },
    { id: 'station_board', title: 'Live Station Platform Display Board', desc: 'Real-time Arrivals & Departures', icon: Radio, badge: 'Platform' },
  ];

  return (
    <>
      {/* Services Bottom Sheet Drawer for Mobile */}
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
                <h3 className="text-sm font-black text-slate-900">All Passenger Services</h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {allServices.map((sub) => {
                const Icon = sub.icon;
                const isActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleNavClick(sub.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
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
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0B2545]/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        {/* Book */}
        <button
          onClick={() => handleNavClick('overview')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">Book</span>
        </button>

        {/* PNR */}
        <button
          onClick={() => handleNavClick('pnr_tracker')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pnr_tracker' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold">PNR</span>
        </button>

        {/* Center Floating Voice Assistant Button */}
        <div className="relative -top-5">
          <button
            onClick={() => handleNavClick('subsystem2')}
            className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/50 ring-4 ring-[#0B2545] active:scale-95 transition-transform cursor-pointer"
          >
            <Mic className="w-6 h-6" />
          </button>
          <span className="block text-center text-[9px] font-black text-orange-300 mt-1 uppercase tracking-tight">
            AskDISHA
          </span>
        </div>

        {/* Tatkal Portal */}
        <button
          onClick={() => handleNavClick('subsystem7')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'subsystem7' ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tatkal</span>
        </button>

        {/* More Services */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isMoreMenuOpen ? 'text-orange-400' : 'text-slate-400'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold">Services</span>
        </button>
      </nav>
    </>
  );
};
