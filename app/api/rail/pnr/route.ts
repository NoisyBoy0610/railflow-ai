import { NextResponse } from 'next/server';
import { TRAINS } from '@/lib/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pnr = searchParams.get('pnr') || '821-4928103';
  const cleanPnr = pnr.replace(/[^0-9]/g, '');

  const rapidApiKey = process.env.RAPIDAPI_IRCTC_KEY;

  if (rapidApiKey && cleanPnr.length === 10) {
    try {
      const response = await fetch(`https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${cleanPnr}`, {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'
        }
      });
      if (response.ok) {
        const liveData = await response.json();
        return NextResponse.json({ success: true, source: 'live_rail_api', data: liveData });
      }
    } catch (err) {
      console.warn('Live PNR API call error, falling back to simulated railway feed:', err);
    }
  }

  // High-Precision Railway Simulation / Mock Provider
  const train = TRAINS[0];
  const isCharterPrepared = cleanPnr.endsWith('3') || cleanPnr.endsWith('8') || cleanPnr.endsWith('1');

  return NextResponse.json({
    success: true,
    source: 'simulated_rail_feed',
    data: {
      pnr: pnr,
      trainNumber: train.number,
      trainName: train.name,
      journeyDate: new Date().toISOString().split('T')[0],
      source: train.source,
      destination: train.destination,
      boardingPoint: train.source,
      classType: '3A',
      quota: 'GN',
      chartPrepared: isCharterPrepared,
      passengers: [
        {
          number: 1,
          bookingStatus: 'RAC 4',
          currentStatus: isCharterPrepared ? 'CNF / B2 / 17 (Lower)' : 'RAC 2',
          confirmationProbability: 94
        },
        {
          number: 2,
          bookingStatus: 'RAC 5',
          currentStatus: isCharterPrepared ? 'CNF / B2 / 18 (Middle)' : 'RAC 3',
          confirmationProbability: 92
        }
      ],
      liveDelayMinutes: train.currentDelayMinutes,
      currentLocationStation: train.currentLocationStation,
      speedKmph: train.speedKmph
    }
  });
}
