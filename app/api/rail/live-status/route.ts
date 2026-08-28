import { NextResponse } from 'next/server';
import { TRAINS } from '@/lib/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trainNumber = searchParams.get('trainNumber') || '12658';

  const matchedTrain = TRAINS.find(t => t.number === trainNumber) || TRAINS[0];

  return NextResponse.json({
    success: true,
    data: {
      trainNumber: matchedTrain.number,
      trainName: matchedTrain.name,
      currentStation: matchedTrain.currentLocationStation,
      delayMinutes: matchedTrain.currentDelayMinutes,
      status: matchedTrain.currentStatus,
      speedKmph: matchedTrain.speedKmph,
      schedule: matchedTrain.schedule,
      isPantryAvailable: matchedTrain.isPantryAvailable,
      nextHalt: matchedTrain.schedule[1]?.stationName || 'Katpadi Jn',
      etaNextHaltMinutes: 35,
      gpsTimestamp: new Date().toISOString()
    }
  });
}
