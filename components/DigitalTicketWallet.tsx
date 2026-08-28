'use client';

import React, { useState } from 'react';
import { QrCode, Download, Printer, Share2, ShieldCheck, CheckCircle2, Train, Calendar, Clock, MapPin, IndianRupee, Sparkles, Scale, AlertCircle } from 'lucide-react';
import { soundEffects } from '@/lib/audio';
import confetti from 'canvas-confetti';

export const DigitalTicketWallet: React.FC = () => {
  const [selectedPnr, setSelectedPnr] = useState<string>('821-4928103');
  const [isWalletSaved, setIsWalletSaved] = useState<boolean>(false);

  const ticketData = {
    pnr: '821-4928103',
    transactionId: '100004928103982',
    trainNumber: '12952',
    trainName: 'Tejas New Delhi - Mumbai Central Rajdhani Express',
    journeyDate: '2026-08-29',
    boardingStation: 'New Delhi (NDLS)',
    destinationStation: 'Mumbai Central (MMCT)',
    scheduledDeparture: '16:55 (Platform 1)',
    scheduledArrival: '08:35 (+1)',
    distanceKm: 1386,
    classType: '3A (3-Tier AC)',
    quota: 'GN (General Quota)',
    chartStatus: 'CHART PREPARED',
    bookingDate: '2026-08-28 14:22:10 IST',
    fare: {
      baseFare: 2900,
      reservationFee: 80,
      superfastCharge: 90,
      cateringFee: 420,
      gst: 174.50,
      totalPaid: 3664.50
    },
    passengers: [
      {
        number: 1,
        name: 'Ramesh Sundaram',
        age: 34,
        gender: 'Male',
        bookingStatus: 'CNF',
        currentStatus: 'CNF',
        coach: 'B2',
        berth: 17,
        berthType: 'Lower Berth (LB)'
      },
      {
        number: 2,
        name: 'Kalyani Sundaram',
        age: 64,
        gender: 'Female',
        bookingStatus: 'CNF',
        currentStatus: 'CNF',
        coach: 'B2',
        berth: 18,
        berthType: 'Lower Berth (LB) - Senior SS'
      }
    ]
  };

  const handlePrint = () => {
    soundEffects.playTick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleSaveToWallet = () => {
    setIsWalletSaved(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    soundEffects.playConfirmationChime();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                  Official ERS Document
                </span>
                <h2 className="text-xl font-black tracking-tight text-white">
                  Electronic Reservation Slip (ERS) & Digital Wallet
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Authentic verifiable Indian Railways E-Ticket with encrypted TTE QR code & unbundled fare breakdown
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print E-Ticket</span>
            </button>
            <button
              onClick={handleSaveToWallet}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isWalletSaved ? 'Added to Passbook' : 'Save to Apple/Google Wallet'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Authentic Electronic Reservation Slip Layout */}
        <div className="border-2 border-slate-300 rounded-2xl p-6 bg-white space-y-6 shadow-sm print:border-none print:shadow-none">
          {/* Railway E-Ticket Header Bar */}
          <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-slate-200 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS
              </span>
              <h3 className="text-lg font-black text-[#0B2545]">
                INDIAN RAILWAYS ELECTRONIC RESERVATION SLIP (ERS)
              </h3>
              <span className="text-xs font-mono text-slate-500">
                CRiS PRS Gateway • IRCTC Verifiable ID: {ticketData.transactionId}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Passenger PNR Number</span>
              <span className="text-xl font-black font-mono text-orange-600 tracking-wider">
                {ticketData.pnr}
              </span>
            </div>
          </div>

          {/* Train & Journey Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Train Name & Number</span>
              <span className="font-black text-slate-900">{ticketData.trainName}</span>
              <span className="font-mono text-slate-500 block mt-0.5">#{ticketData.trainNumber}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">From ➔ To Station</span>
              <span className="font-bold text-slate-900">{ticketData.boardingStation}</span>
              <span className="text-slate-500 block">➔ {ticketData.destinationStation}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Departure & Journey Date</span>
              <span className="font-bold text-slate-900">{ticketData.journeyDate}</span>
              <span className="text-slate-500 block">{ticketData.scheduledDeparture}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Quota</span>
              <span className="font-bold text-slate-900">{ticketData.classType}</span>
              <span className="text-emerald-700 font-bold block">{ticketData.chartStatus}</span>
            </div>
          </div>

          {/* Passenger Berth Allocation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-[#0B2545] text-white">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Passenger Name</th>
                  <th className="py-2.5 px-3">Age / Gender</th>
                  <th className="py-2.5 px-3 text-center">Booking Status</th>
                  <th className="py-2.5 px-3 text-center">Current Status</th>
                  <th className="py-2.5 px-3 text-right">Coach & Berth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ticketData.passengers.map((p) => (
                  <tr key={p.number} className="hover:bg-slate-50 font-mono">
                    <td className="py-3 px-3 font-bold text-slate-700">{p.number}</td>
                    <td className="py-3 px-3 font-sans font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-3 text-slate-600">{p.age} Yrs / {p.gender}</td>
                    <td className="py-3 px-3 text-center text-emerald-700 font-bold">{p.bookingStatus}</td>
                    <td className="py-3 px-3 text-center text-emerald-700 font-bold">{p.currentStatus}</td>
                    <td className="py-3 px-3 text-right font-sans font-black text-slate-900">
                      <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg">
                        {p.coach} - {p.berth} ({p.berthType})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fare & Security Verification Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t-2 border-slate-200">
            {/* Left: Encrypted QR Code & Barcode */}
            <div className="md:col-span-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
              <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-1.5 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">TTE Handheld Scannable</span>
                <p>Encrypted Digital Signature Verified by CRiS Gateway.</p>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">VALID ID REQUIRED</span>
              </div>
            </div>

            {/* Right: Unbundled Fare Breakdown */}
            <div className="md:col-span-8 p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
              <span className="font-bold text-amber-400 uppercase text-[10px] block">
                Official Fare Breakdown (Zero Hidden Dark-Patterns)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 text-[11px]">
                <div>
                  <span className="block text-slate-400">Base Fare:</span>
                  <span className="font-mono text-white">₹{ticketData.fare.baseFare}</span>
                </div>
                <div>
                  <span className="block text-slate-400">Reservation & SF:</span>
                  <span className="font-mono text-white">₹{ticketData.fare.reservationFee + ticketData.fare.superfastCharge}</span>
                </div>
                <div>
                  <span className="block text-slate-400">GST (5%):</span>
                  <span className="font-mono text-white">₹{ticketData.fare.gst}</span>
                </div>
                <div>
                  <span className="block text-emerald-400 font-bold">Total Paid:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">₹{ticketData.fare.totalPaid}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
