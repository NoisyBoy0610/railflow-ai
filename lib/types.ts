export type IndicLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'kn' // Kannada
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'ml' // Malayalam
  | 'or'; // Odia

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  platforms: number;
}

export type TravelClass = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | 'EC' | '2S';
export type QuotaType = 'GN' | 'TQ' | 'PT' | 'LD' | 'SS' | 'HP' | 'DP';

export interface TrainSeatAvailability {
  classType: TravelClass;
  status: 'AVAILABLE' | 'RAC' | 'WL' | 'REGRET';
  count: number;
  probability?: number;
  fare: {
    baseFare: number;
    superfastCharge: number;
    reservationFee: number;
    tatkalCharge?: number;
    dynamicFare?: number;
    gst: number;
    total: number;
  };
  quota: QuotaType;
  waitlistType?: 'GNWL' | 'RLWL' | 'PQWL' | 'TQWL';
}

export interface TrainScheduleStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform: number;
}

export interface Train {
  number: string;
  name: string;
  type: 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Duronto' | 'Superfast' | 'Express' | 'Garib Rath';
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  schedule: TrainScheduleStop[];
  classes: TravelClass[];
  availability: Record<TravelClass, TrainSeatAvailability>;
  currentDelayMinutes: number;
  currentStatus: 'ON_TIME' | 'DELAYED' | 'DIVERTED' | 'CANCELLED';
  currentLocationStation?: string;
  speedKmph: number;
  isPantryAvailable: boolean;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'T';
  berthPreference: 'L' | 'M' | 'U' | 'SL' | 'SU' | 'WS' | 'NONE';
  allocatedBerth?: string;
  allocatedCoach?: string;
  isSeniorCitizen?: boolean;
  isOptedSeniorQuota?: boolean;
  foodPreference?: 'Veg' | 'Non-Veg' | 'Jain' | 'None';
  aadhaarLast4?: string;
}

export interface PNRRecord {
  pnr: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  travelDate: string;
  classType: TravelClass;
  quota: QuotaType;
  bookingStatus: 'CNF' | 'RAC' | 'WL' | 'CHARTING_PREPARED';
  chartPrepared: boolean;
  passengers: Passenger[];
  farePaid: number;
  tdrFiled?: boolean;
  tdrStatus?: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REFUNDED';
  tdrRefundAmount?: number;
}

export interface TDRRuleClause {
  ruleCode: string;
  title: string;
  timeWindowDescription: string;
  eligibleRefundPercent: number;
  clerkageFee: number;
  description: string;
  conditionCheck: (delayMins: number, chartPrepared: boolean, reasonKey: string) => boolean;
}

export interface MultiLegRouteOption {
  id: string;
  type: 'SPLIT_SEAT' | 'JUNCTION_TRANSFER';
  overallSource: string;
  overallDestination: string;
  totalDuration: string;
  totalFare: number;
  status: '100% CONFIRMED' | 'HIGH_CONFIRMATION';
  legs: {
    trainNumber: string;
    trainName: string;
    fromStation: string;
    toStation: string;
    departureTime: string;
    arrivalTime: string;
    classType: TravelClass;
    seatStatus: string;
    allocatedCoachBerth: string;
    fare: number;
  }[];
  layoverDuration?: string;
  layoverStation?: string;
  savingsVsTatkal?: number;
  advantages: string[];
}

export interface RailMadadGrievance {
  ticketId: string;
  pnr: string;
  trainNumber: string;
  coach: string;
  berth: string;
  category: 'Cleanliness / Toilet' | 'Electrical / AC' | 'Catering / Pantry' | 'Bedroll / Linen' | 'Security / Medical' | 'Mechanical';
  severity: 'CRITICAL' | 'HIGH' | 'NORMAL';
  description: string;
  imageUrl?: string;
  detectedIssues: string[];
  assignedDivision: string;
  targetResolutionMinutes: number;
  status: 'REGISTERED' | 'DISPATCHED_TO_OBHS' | 'IN_PROGRESS' | 'RESOLVED';
  timestamp: string;
  aiConfidence: number;
}

export interface StationConciergeBooking {
  id: string;
  stationCode: string;
  pnr: string;
  serviceType: 'COOLIE' | 'BATTERY_BUGGY' | 'WHEELCHAIR' | 'E_CATERING';
  details: {
    bagsCount?: number;
    tariffAmount: number;
    platformNumber: number;
    coachNumber: string;
    passengerName: string;
    specialAssistanceNote?: string;
    foodItems?: { name: string; quantity: number; price: number }[];
  };
  assignedStaff?: {
    name: string;
    badgeNumber: string;
    phone: string;
  };
  status: 'CONFIRMED' | 'ASSIGNED' | 'DELIVERED';
}
