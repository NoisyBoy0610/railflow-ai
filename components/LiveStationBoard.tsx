'use client';

import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, Train, ArrowDownLeft, ArrowUpRight, Clock, AlertTriangle, ShieldCheck, Search, MapPin } from 'lucide-react';
import { STATIONS } from '@/lib/mockData';
import { soundEffects } from '@/lib/audio';

export interface StationTrainItem {
  trainNumber: string;
  trainName: string;
  type: 'ARRIVAL' | 'DEPARTURE';
  scheduledTime: string;
  expectedTime: string;
  delayMinutes: number;
  platform: string;
  originStation: string;
  destStation: string;
  status: 'ON_TIME' | 'DELAYED' | 'ARRIVED' | 'DEPARTED' | 'PLATFORM_CHANGE';
}

export const LiveStationBoard: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string>('NDLS');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ARRIVAL' | 'DEPARTURE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trains, setTrains] = useState<StationTrainItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('');

  const fetchStationData = async (stationCode: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/rail/station-board?station=${stationCode}`);
      if (res.ok) {
        const json = await res.json();
        setTrains(json.trains || []);
        setLastUpdated(json.lastUpdated || new Date().toLocaleTimeString('en-IN'));
        setDataSource(json.source || 'NTES_STATION_RADAR');
      }
    } catch (err) {
      console.error('Failed to fetch station board:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStationData(selectedStation);
  }, [selectedStation]);

  const handleRefresh = () => {
    soundEffects.playTick();
    fetchStationData(selectedStation);
  };

  const filteredTrains = trains.filter(t => {
    const matchesTab = activeTab === 'ALL' || t.type === activeTab;
    const matchesSearch =
      t.trainNumber.includes(searchQuery) ||
      t.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destStation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stationName = STATIONS.find(s => s.code === selectedStation)?.name || selectedStation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500 text-slate-950 text-[10px] font-black uppercase">
                  Live Station Radar
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Live Station Platform Display Board
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time train arrivals, departures, assigned platform numbers, and NTES delay telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Last Radar Sync</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{lastUpdated || 'Live Syncing'}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-white"
              title="Refresh Station Board"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Filter & Station Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Station:</label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
            >
              {STATIONS.map(s => (
                <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Tab Filters */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ALL' ? 'bg-[#0B2545] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Movements
            </button>
            <button
              onClick={() => setActiveTab('ARRIVAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'ARRIVAL' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Arrivals</span>
            </button>
            <button
              onClick={() => setActiveTab('DEPARTURE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'DEPARTURE' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Departures</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search train # or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Real-World LED Style Station Display Board */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              {stationName.toUpperCase()} STATION ELECTRONIC TRAIN INDICATOR
            </span>
            <span className="text-slate-400 text-[11px]">
              DATA FEED: {dataSource}
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900/50">
                <th className="py-3 px-4">Train #</th>
                <th className="py-3 px-4">Train Name</th>
                <th className="py-3 px-4">Origin ➔ Destination</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-center">Sched / Expected</th>
                <th className="py-3 px-4 text-center">Platform</th>
                <th className="py-3 px-4 text-right">Running Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-400" />
                    <span>Fetching live NTES station platform telemetry...</span>
                  </td>
                </tr>
              ) : filteredTrains.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No scheduled train movements found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTrains.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/80 transition-colors">
                    {/* Train # */}
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {t.trainNumber}
                    </td>

                    {/* Train Name */}
                    <td className="py-3 px-4 font-bold text-white">
                      {t.trainName}
                    </td>

                    {/* Route */}
                    <td className="py-3 px-4 text-slate-300 text-[11px]">
                      {t.originStation} ➔ {t.destStation}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        t.type === 'ARRIVAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-orange-950 text-orange-400 border border-orange-800'
                      }`}>
                        {t.type}
                      </span>
                    </td>

                    {/* Timings */}
                    <td className="py-3 px-4 text-center">
                      <span className="text-slate-400 block text-[10px]">{t.scheduledTime} (Sched)</span>
                      <span className={`font-bold ${t.delayMinutes > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {t.expectedTime}
                      </span>
                    </td>

                    {/* Platform */}
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-black text-xs inline-block shadow-sm">
                        {t.platform}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-right">
                      {t.status === 'ON_TIME' && (
                        <span className="text-emerald-400 font-bold text-xs">● Right Time</span>
                      )}
                      {t.status === 'DELAYED' && (
                        <span className="text-rose-400 font-bold text-xs">
                          ● Late by {t.delayMinutes}m
                        </span>
                      )}
                      {t.status === 'ARRIVED' && (
                        <span className="text-blue-400 font-bold text-xs">● Arrived at Platform</span>
                      )}
                      {t.status === 'PLATFORM_CHANGE' && (
                        <span className="text-amber-300 font-bold text-xs animate-pulse">
                          ⚠️ PF Changed ({t.platform})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
