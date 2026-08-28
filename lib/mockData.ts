import { Station, Train, PNRRecord, TDRRuleClause, MultiLegRouteOption } from './types';

export const STATIONS: Station[] = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR', platforms: 16 },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', platforms: 10 },
  { code: 'MAS', name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', platforms: 12 },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', platforms: 8 },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', platforms: 18 },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER', platforms: 23 },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'ECR', platforms: 10 },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', platforms: 12 },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', platforms: 6 },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana', zone: 'SCR', platforms: 10 },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR', platforms: 6 },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'NER', platforms: 10 },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR', platforms: 10 },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR', platforms: 9 },
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh', zone: 'SCR', platforms: 10 },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', platforms: 6 },
  { code: 'JHS', name: 'VGL Jhansi Junction', city: 'Jhansi', state: 'Uttar Pradesh', zone: 'NCR', platforms: 8 },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR', platforms: 8 },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu & Kashmir', zone: 'NR', platforms: 5 },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NR', platforms: 9 },
  { code: 'MYS', name: 'Mysuru Junction', city: 'Mysuru', state: 'Karnataka', zone: 'SWR', platforms: 6 },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR', platforms: 6 },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR', platforms: 5 },
  { code: 'ERS', name: 'Ernakulam Junction (South)', city: 'Kochi', state: 'Kerala', zone: 'SR', platforms: 6 },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR', platforms: 6 },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR', platforms: 7 },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR', platforms: 8 },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'NR', platforms: 6 },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh', zone: 'NCR', platforms: 6 },
  { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', zone: 'SECR', platforms: 7 }
];

export const TRAINS: Train[] = [
  {
    number: '20607',
    name: 'MGR Chennai - Mysuru Vande Bharat Express',
    type: 'Vande Bharat',
    source: 'MAS',
    destination: 'MYS',
    departureTime: '05:50',
    arrivalTime: '12:20',
    duration: '06h 30m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    schedule: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: 'Start', departureTime: '05:50', haltMinutes: 0, distanceKm: 0, day: 1, platform: 2 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrivalTime: '07:13', departureTime: '07:15', haltMinutes: 2, distanceKm: 130, day: 1, platform: 1 },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '10:15', departureTime: '10:20', haltMinutes: 5, distanceKm: 359, day: 1, platform: 7 },
      { stationCode: 'MYS', stationName: 'Mysuru Jn', arrivalTime: '12:20', departureTime: 'Ends', haltMinutes: 0, distanceKm: 496, day: 1, platform: 1 },
    ],
    classes: ['CC', 'EC'],
    availability: {
      CC: {
        classType: 'CC',
        status: 'AVAILABLE',
        count: 48,
        probability: 98,
        quota: 'GN',
        fare: { baseFare: 865, superfastCharge: 45, reservationFee: 40, gst: 48, total: 998 }
      },
      EC: {
        classType: 'EC',
        status: 'AVAILABLE',
        count: 14,
        probability: 95,
        quota: 'GN',
        fare: { baseFare: 1680, superfastCharge: 75, reservationFee: 60, gst: 91, total: 1906 }
      },
      '1A': { classType: '1A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2A': { classType: '2A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '3A': { classType: '3A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '3E': { classType: '3E', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'SL': { classType: 'SL', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2S': { classType: '2S', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } }
    },
    currentDelayMinutes: 0,
    currentStatus: 'ON_TIME',
    currentLocationStation: 'SBC',
    speedKmph: 115,
    isPantryAvailable: true
  },
  {
    number: '12658',
    name: 'Chennai Mail Express',
    type: 'Superfast',
    source: 'SBC',
    destination: 'MAS',
    departureTime: '22:40',
    arrivalTime: '04:15',
    duration: '05h 35m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    schedule: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: 'Start', departureTime: '22:40', haltMinutes: 0, distanceKm: 0, day: 1, platform: 4 },
      { stationCode: 'BNC', stationName: 'Bengaluru Cantt', arrivalTime: '22:50', departureTime: '22:52', haltMinutes: 2, distanceKm: 5, day: 1, platform: 2 },
      { stationCode: 'BWT', stationName: 'Bangarapet', arrivalTime: '23:45', departureTime: '23:47', haltMinutes: 2, distanceKm: 70, day: 1, platform: 3 },
      { stationCode: 'JTJ', stationName: 'Jolarpettai Jn', arrivalTime: '01:10', departureTime: '01:15', haltMinutes: 5, distanceKm: 145, day: 2, platform: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrivalTime: '02:25', departureTime: '02:30', haltMinutes: 5, distanceKm: 230, day: 2, platform: 2 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '04:15', departureTime: 'Ends', haltMinutes: 0, distanceKm: 359, day: 2, platform: 8 }
    ],
    classes: ['1A', '2A', '3A', 'SL'],
    availability: {
      '3A': {
        classType: '3A',
        status: 'WL',
        count: 34,
        probability: 42,
        quota: 'GN',
        waitlistType: 'GNWL',
        fare: { baseFare: 615, superfastCharge: 45, reservationFee: 40, gst: 35, total: 735 }
      },
      '2A': {
        classType: '2A',
        status: 'RAC',
        count: 6,
        probability: 88,
        quota: 'GN',
        fare: { baseFare: 890, superfastCharge: 45, reservationFee: 50, gst: 49, total: 1034 }
      },
      '1A': {
        classType: '1A',
        status: 'AVAILABLE',
        count: 2,
        probability: 99,
        quota: 'GN',
        fare: { baseFare: 1490, superfastCharge: 45, reservationFee: 60, gst: 80, total: 1675 }
      },
      'SL': {
        classType: 'SL',
        status: 'WL',
        count: 112,
        probability: 18,
        quota: 'GN',
        waitlistType: 'GNWL',
        fare: { baseFare: 230, superfastCharge: 30, reservationFee: 20, gst: 0, total: 280 }
      },
      '3E': { classType: '3E', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'CC': { classType: 'CC', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'EC': { classType: 'EC', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2S': { classType: '2S', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } }
    },
    currentDelayMinutes: 215, // 3.5 hrs delay for TDR testing
    currentStatus: 'DELAYED',
    currentLocationStation: 'JTJ',
    speedKmph: 78,
    isPantryAvailable: false
  },
  {
    number: '22436',
    name: 'Vande Bharat Express (New Delhi - Varanasi)',
    type: 'Vande Bharat',
    source: 'NDLS',
    destination: 'BSB',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '08h 00m',
    runningDays: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    schedule: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '06:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 16 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '10:08', departureTime: '10:10', haltMinutes: 2, distanceKm: 440, day: 1, platform: 5 },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn', arrivalTime: '12:08', departureTime: '12:10', haltMinutes: 2, distanceKm: 635, day: 1, platform: 6 },
      { stationCode: 'BSB', stationName: 'Varanasi Jn', arrivalTime: '14:00', departureTime: 'Ends', haltMinutes: 0, distanceKm: 759, day: 1, platform: 1 }
    ],
    classes: ['CC', 'EC'],
    availability: {
      CC: {
        classType: 'CC',
        status: 'AVAILABLE',
        count: 22,
        probability: 96,
        quota: 'GN',
        fare: { baseFare: 1450, superfastCharge: 45, reservationFee: 40, gst: 77, total: 1612 }
      },
      EC: {
        classType: 'EC',
        status: 'RAC',
        count: 4,
        probability: 85,
        quota: 'GN',
        fare: { baseFare: 2900, superfastCharge: 75, reservationFee: 60, gst: 152, total: 3187 }
      },
      '1A': { classType: '1A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2A': { classType: '2A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '3A': { classType: '3A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '3E': { classType: '3E', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'SL': { classType: 'SL', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2S': { classType: '2S', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } }
    },
    currentDelayMinutes: 0,
    currentStatus: 'ON_TIME',
    currentLocationStation: 'CNB',
    speedKmph: 130,
    isPantryAvailable: true
  },
  {
    number: '12952',
    name: 'Mumbai Tejas Rajdhani Express',
    type: 'Rajdhani',
    source: 'NDLS',
    destination: 'MMCT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    schedule: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '16:55', haltMinutes: 0, distanceKm: 0, day: 1, platform: 3 },
      { stationCode: 'KOTA', stationName: 'Kota Jn', arrivalTime: '21:30', departureTime: '21:40', haltMinutes: 10, distanceKm: 465, day: 1, platform: 2 },
      { stationCode: 'RTM', stationName: 'Ratlam Jn', arrivalTime: '00:35', departureTime: '00:38', haltMinutes: 3, distanceKm: 730, day: 2, platform: 4 },
      { stationCode: 'BRC', stationName: 'Vadodara Jn', arrivalTime: '03:50', departureTime: '04:00', haltMinutes: 10, distanceKm: 991, day: 2, platform: 1 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '05:13', departureTime: '05:18', haltMinutes: 5, distanceKm: 1120, day: 2, platform: 2 },
      { stationCode: 'BVI', stationName: 'Borivali', arrivalTime: '07:58', departureTime: '08:00', haltMinutes: 2, distanceKm: 1355, day: 2, platform: 7 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '08:35', departureTime: 'Ends', haltMinutes: 0, distanceKm: 1384, day: 2, platform: 1 }
    ],
    classes: ['1A', '2A', '3A'],
    availability: {
      '3A': {
        classType: '3A',
        status: 'AVAILABLE',
        count: 65,
        probability: 99,
        quota: 'GN',
        fare: { baseFare: 2150, superfastCharge: 45, reservationFee: 40, dynamicFare: 350, gst: 130, total: 2715 }
      },
      '2A': {
        classType: '2A',
        status: 'AVAILABLE',
        count: 18,
        probability: 95,
        quota: 'GN',
        fare: { baseFare: 3200, superfastCharge: 45, reservationFee: 50, dynamicFare: 450, gst: 187, total: 3932 }
      },
      '1A': {
        classType: '1A',
        status: 'WL',
        count: 3,
        probability: 72,
        quota: 'GN',
        waitlistType: 'GNWL',
        fare: { baseFare: 4850, superfastCharge: 45, reservationFee: 60, gst: 248, total: 5203 }
      },
      '3E': { classType: '3E', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'SL': { classType: 'SL', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'CC': { classType: 'CC', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'EC': { classType: 'EC', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2S': { classType: '2S', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } }
    },
    currentDelayMinutes: 10,
    currentStatus: 'ON_TIME',
    currentLocationStation: 'BRC',
    speedKmph: 125,
    isPantryAvailable: true
  },
  {
    number: '12301',
    name: 'Howrah Rajdhani Express',
    type: 'Rajdhani',
    source: 'HWH',
    destination: 'NDLS',
    departureTime: '16:50',
    arrivalTime: '10:05',
    duration: '17h 15m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    schedule: [
      { stationCode: 'HWH', stationName: 'Howrah Jn', arrivalTime: 'Start', departureTime: '16:50', haltMinutes: 0, distanceKm: 0, day: 1, platform: 9 },
      { stationCode: 'ASN', stationName: 'Asansol Jn', arrivalTime: '18:55', departureTime: '18:57', haltMinutes: 2, distanceKm: 200, day: 1, platform: 4 },
      { stationCode: 'DHN', stationName: 'Dhanbad Jn', arrivalTime: '19:50', departureTime: '19:55', haltMinutes: 5, distanceKm: 259, day: 1, platform: 3 },
      { stationCode: 'GAYA', stationName: 'Gaya Jn', arrivalTime: '22:15', departureTime: '22:18', haltMinutes: 3, distanceKm: 459, day: 1, platform: 1 },
      { stationCode: 'DDU', stationName: 'Pt Deen Dayal Upadhyaya Jn', arrivalTime: '00:45', departureTime: '00:55', haltMinutes: 10, distanceKm: 664, day: 2, platform: 7 },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Jn', arrivalTime: '02:43', departureTime: '02:45', haltMinutes: 2, distanceKm: 816, day: 2, platform: 1 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '04:50', departureTime: '04:55', haltMinutes: 5, distanceKm: 1010, day: 2, platform: 1 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '10:05', departureTime: 'Ends', haltMinutes: 0, distanceKm: 1450, day: 2, platform: 4 }
    ],
    classes: ['1A', '2A', '3A'],
    availability: {
      '3A': {
        classType: '3A',
        status: 'WL',
        count: 55,
        probability: 30,
        quota: 'GN',
        waitlistType: 'GNWL',
        fare: { baseFare: 2280, superfastCharge: 45, reservationFee: 40, dynamicFare: 400, gst: 138, total: 2903 }
      },
      '2A': {
        classType: '2A',
        status: 'WL',
        count: 14,
        probability: 58,
        quota: 'GN',
        waitlistType: 'GNWL',
        fare: { baseFare: 3450, superfastCharge: 45, reservationFee: 50, dynamicFare: 550, gst: 204, total: 4299 }
      },
      '1A': {
        classType: '1A',
        status: 'AVAILABLE',
        count: 1,
        probability: 99,
        quota: 'GN',
        fare: { baseFare: 5120, superfastCharge: 45, reservationFee: 60, gst: 261, total: 5486 }
      },
      '3E': { classType: '3E', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'SL': { classType: 'SL', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'CC': { classType: 'CC', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'EC': { classType: 'EC', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2S': { classType: '2S', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } }
    },
    currentDelayMinutes: 0,
    currentStatus: 'ON_TIME',
    currentLocationStation: 'GAYA',
    speedKmph: 110,
    isPantryAvailable: true
  },
  {
    number: '12002',
    name: 'New Delhi - Bhopal Shatabdi Express',
    type: 'Shatabdi',
    source: 'NDLS',
    destination: 'BPL',
    departureTime: '06:00',
    arrivalTime: '14:40',
    duration: '08h 40m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    schedule: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Start', departureTime: '06:00', haltMinutes: 0, distanceKm: 0, day: 1, platform: 1 },
      { stationCode: 'AGC', stationName: 'Agra Cantt', arrivalTime: '07:50', departureTime: '07:55', haltMinutes: 5, distanceKm: 195, day: 1, platform: 1 },
      { stationCode: 'GWL', stationName: 'Gwalior Jn', arrivalTime: '09:23', departureTime: '09:28', haltMinutes: 5, distanceKm: 313, day: 1, platform: 2 },
      { stationCode: 'JHS', stationName: 'VGL Jhansi', arrivalTime: '10:45', departureTime: '10:50', haltMinutes: 5, distanceKm: 410, day: 1, platform: 1 },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrivalTime: '14:40', departureTime: 'Ends', haltMinutes: 0, distanceKm: 701, day: 1, platform: 1 }
    ],
    classes: ['CC', 'EC'],
    availability: {
      CC: {
        classType: 'CC',
        status: 'AVAILABLE',
        count: 76,
        probability: 99,
        quota: 'GN',
        fare: { baseFare: 1120, superfastCharge: 45, reservationFee: 40, gst: 60, total: 1265 }
      },
      EC: {
        classType: 'EC',
        status: 'AVAILABLE',
        count: 19,
        probability: 97,
        quota: 'GN',
        fare: { baseFare: 2190, superfastCharge: 75, reservationFee: 60, gst: 116, total: 2441 }
      },
      '1A': { classType: '1A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2A': { classType: '2A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '3A': { classType: '3A', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '3E': { classType: '3E', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      'SL': { classType: 'SL', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } },
      '2S': { classType: '2S', status: 'REGRET', count: 0, quota: 'GN', fare: { baseFare: 0, superfastCharge: 0, reservationFee: 0, gst: 0, total: 0 } }
    },
    currentDelayMinutes: 0,
    currentStatus: 'ON_TIME',
    currentLocationStation: 'GWL',
    speedKmph: 110,
    isPantryAvailable: true
  }
];

export const MOCK_PNRS: Record<string, PNRRecord> = {
  '821-4928103': {
    pnr: '821-4928103',
    trainNumber: '12658',
    trainName: 'Chennai Mail Express',
    source: 'SBC',
    destination: 'MAS',
    travelDate: '2026-08-28',
    classType: '3A',
    quota: 'GN',
    bookingStatus: 'CNF',
    chartPrepared: true,
    farePaid: 1470,
    passengers: [
      { id: 'P1', name: 'Ramesh Sundaram', age: 67, gender: 'M', berthPreference: 'L', allocatedBerth: 'B2-12 (LB)', allocatedCoach: 'B2', isSeniorCitizen: true, isOptedSeniorQuota: true, foodPreference: 'Veg', aadhaarLast4: '9182' },
      { id: 'P2', name: 'Kalyani Sundaram', age: 63, gender: 'F', berthPreference: 'L', allocatedBerth: 'B2-15 (MB)', allocatedCoach: 'B2', isSeniorCitizen: true, isOptedSeniorQuota: true, foodPreference: 'Veg', aadhaarLast4: '4831' }
    ]
  },
  '412-9850123': {
    pnr: '412-9850123',
    trainNumber: '20607',
    trainName: 'Vande Bharat Express',
    source: 'MAS',
    destination: 'SBC',
    travelDate: '2026-08-29',
    classType: 'CC',
    quota: 'GN',
    bookingStatus: 'CNF',
    chartPrepared: false,
    farePaid: 1996,
    passengers: [
      { id: 'P3', name: 'Aarav Sharma', age: 29, gender: 'M', berthPreference: 'WS', allocatedBerth: 'C3-24 (Window)', allocatedCoach: 'C3', foodPreference: 'Non-Veg', aadhaarLast4: '1094' },
      { id: 'P4', name: 'Priya Sharma', age: 27, gender: 'F', berthPreference: 'WS', allocatedBerth: 'C3-25 (Aisle)', allocatedCoach: 'C3', foodPreference: 'Veg', aadhaarLast4: '8821' }
    ]
  },
  '654-1029384': {
    pnr: '654-1029384',
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express',
    source: 'HWH',
    destination: 'NDLS',
    travelDate: '2026-08-30',
    classType: '3A',
    quota: 'GN',
    bookingStatus: 'WL',
    chartPrepared: false,
    farePaid: 2903,
    passengers: [
      { id: 'P5', name: 'Vikramjit Roy', age: 34, gender: 'M', berthPreference: 'SL', allocatedBerth: 'WL 14 (GNWL)', allocatedCoach: 'WL', foodPreference: 'Non-Veg', aadhaarLast4: '5512' }
    ]
  }
};

export const TDR_RULES: TDRRuleClause[] = [
  {
    ruleCode: 'Rule 14.1',
    title: 'Train Delayed > 3 Hours at Journey Origin / Boarding Station',
    timeWindowDescription: 'File before actual departure of train',
    eligibleRefundPercent: 100,
    clerkageFee: 0,
    description: 'Full refund of fare without any clerkage charge deduction when train is delayed by more than 3 hours and passenger does not travel.',
    conditionCheck: (delayMins, _chart, reason) => delayMins >= 180 || reason.toLowerCase().includes('delay') || reason.toLowerCase().includes('late')
  },
  {
    ruleCode: 'Rule 14.4',
    title: 'AC Failure in Air-Conditioned Coach',
    timeWindowDescription: 'File within 72 hours of reaching destination with Guard Certificate / TTE endorse',
    eligibleRefundPercent: 100,
    clerkageFee: 0,
    description: 'Difference between AC fare and Non-AC/Sleeper fare refunded for the distance travel took place without AC cooling.',
    conditionCheck: (_d, _c, reason) => reason.toLowerCase().includes('ac') || reason.toLowerCase().includes('cooling') || reason.toLowerCase().includes('air conditioning')
  },
  {
    ruleCode: 'Rule 14.7',
    title: 'Train Diverted and Passenger Did Not Travel',
    timeWindowDescription: 'File up to 72 hours after scheduled departure',
    eligibleRefundPercent: 100,
    clerkageFee: 0,
    description: 'Full refund of fare when train is diverted via alternative route and passenger chooses not to travel.',
    conditionCheck: (_d, _c, reason) => reason.toLowerCase().includes('divert') || reason.toLowerCase().includes('route changed')
  },
  {
    ruleCode: 'Rule 14.11',
    title: 'Train Cancelled by Railways',
    timeWindowDescription: 'Automatic or within 72 hours of scheduled departure',
    eligibleRefundPercent: 100,
    clerkageFee: 0,
    description: '100% full refund credited without filing or filing TDR ifPRS counter ticket.',
    conditionCheck: (_d, _c, reason) => reason.toLowerCase().includes('cancel')
  },
  {
    ruleCode: 'Rule 14.16',
    title: 'Passenger Did Not Travel (Party Partially Confirmed / RAC / WL)',
    timeWindowDescription: 'File up to 30 mins before scheduled departure',
    eligibleRefundPercent: 90,
    clerkageFee: 60,
    description: 'Refund granted for all passengers on ticket with standard clerkage per passenger deduction.',
    conditionCheck: (_d, _c, reason) => reason.toLowerCase().includes('party') || reason.toLowerCase().includes('partial') || reason.toLowerCase().includes('did not travel')
  },
  {
    ruleCode: 'Rule 14.22',
    title: 'Lower Class Accommodation Provided by Railways',
    timeWindowDescription: 'File within 72 hours with TTE excess fare receipt',
    eligibleRefundPercent: 100,
    clerkageFee: 0,
    description: 'Difference between higher class paid fare and lower class allocated fare refunded directly.',
    conditionCheck: (_d, _c, reason) => reason.toLowerCase().includes('lower class') || reason.toLowerCase().includes('downgrade')
  }
];

export const MOCK_MULTI_LEG_ROUTES: MultiLegRouteOption[] = [
  {
    id: 'ML-SBC-MAS-01',
    type: 'SPLIT_SEAT',
    overallSource: 'SBC (Bengaluru)',
    overallDestination: 'MAS (Chennai)',
    totalDuration: '05h 35m (Same Train!)',
    totalFare: 735,
    status: '100% CONFIRMED',
    legs: [
      {
        trainNumber: '12658',
        trainName: 'Chennai Mail Express',
        fromStation: 'SBC',
        toStation: 'KPD (Katpadi Jn)',
        departureTime: '22:40',
        arrivalTime: '02:25',
        classType: '3A',
        seatStatus: 'CONFIRMED (CNF)',
        allocatedCoachBerth: 'Coach B3 - Berth 18 (Lower)',
        fare: 450
      },
      {
        trainNumber: '12658',
        trainName: 'Chennai Mail Express',
        fromStation: 'KPD (Katpadi Jn)',
        toStation: 'MAS (Chennai)',
        departureTime: '02:30',
        arrivalTime: '04:15',
        classType: '3A',
        seatStatus: 'CONFIRMED (CNF)',
        allocatedCoachBerth: 'Coach B4 - Berth 42 (Side Lower)',
        fare: 285
      }
    ],
    savingsVsTatkal: 450,
    advantages: [
      'Zero train switching needed! Just walk to coach B4 at Katpadi junction.',
      'Direct ticket shows GNWL 34, while this split gives 100% confirmed berths.',
      'No Tatkal premium charge needed (saves ₹450).'
    ]
  },
  {
    id: 'ML-HWH-NDLS-02',
    type: 'JUNCTION_TRANSFER',
    overallSource: 'HWH (Howrah / Kolkata)',
    overallDestination: 'NDLS (New Delhi)',
    totalDuration: '17h 45m',
    totalFare: 3120,
    status: '100% CONFIRMED',
    layoverStation: 'CNB (Kanpur Central)',
    layoverDuration: '1h 15m Buffer Layover (Platform 1 to 5)',
    legs: [
      {
        trainNumber: '12301',
        trainName: 'Howrah Rajdhani Express',
        fromStation: 'HWH',
        toStation: 'CNB',
        departureTime: '16:50',
        arrivalTime: '04:50',
        classType: '3A',
        seatStatus: 'CONFIRMED (CNF)',
        allocatedCoachBerth: 'Coach B2 - Berth 22 (Upper)',
        fare: 2280
      },
      {
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        fromStation: 'CNB',
        toStation: 'NDLS',
        departureTime: '06:05',
        arrivalTime: '10:35',
        classType: 'CC',
        seatStatus: 'CONFIRMED (CNF)',
        allocatedCoachBerth: 'Coach C4 - Berth 31 (Window)',
        fare: 840
      }
    ],
    savingsVsTatkal: 600,
    advantages: [
      'Guaranteed 100% confirmed seats when direct Rajdhani is GNWL 55.',
      'Safe 75-minute layover at Kanpur Central with station lounge access.',
      'Experience Vande Bharat high-speed for the morning leg into New Delhi.'
    ]
  }
];

export const COOLIE_TARIFFS = [
  { slab: 'Up to 25 kg (1 Luggage Trolley/Bag)', rate: 120, timeLimit: 'Platform to Coach / Taxi stand' },
  { slab: '25 kg to 40 kg (2 Heavy Bags)', rate: 200, timeLimit: 'Platform to Coach / Taxi stand' },
  { slab: 'Wheelchair with Attendant / Porter', rate: 250, timeLimit: 'Full Station Transit' },
  { slab: 'Battery Operated Buggy (Per Seat)', rate: 50, timeLimit: 'Gate 1 to Platform 1-10' }
];

export const MOCK_MEALS = [
  { id: 'M1', name: 'IRCTC Executive Veg Thali (Paneer Butter Masala, Dal Makhani, 3 Parathas, Jeera Rice, Gulab Jamun)', price: 210, veg: true, vendor: 'Comesum Rail Kitchen' },
  { id: 'M2', name: 'Hyderabadi Chicken Dum Biryani with Mirchi ka Salan & Raita', price: 280, veg: false, vendor: 'Paradise Railway Outlet' },
  { id: 'M3', name: 'South Indian Tiffin Combo (2 Idli, 1 Vada, Kesari Bath, Filter Coffee)', price: 140, veg: true, vendor: 'Saravana Bhavan On Wheels' },
  { id: 'M4', name: 'Jain Special Satvik Thali (No Onion / Garlic, Shahi Paneer, Dal Fry, 3 Rotis, Kheer)', price: 220, veg: true, vendor: 'Haldirams Rail Express' }
];

export const MOCK_GRIEVANCE_SAMPLES = [
  {
    title: 'Unhygienic Toilet in Coach B2',
    category: 'Cleanliness / Toilet' as const,
    coach: 'B2',
    berth: 'Berth 12-18 area',
    pnr: '821-4928103',
    description: 'Western toilet flush choked, water overflowing onto aisle, handwash dispenser empty since departure from SBC.',
    severity: 'CRITICAL' as const,
    assignedDivision: 'SBC Division (South Western Railway)',
    sampleImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'AC Blower Not Cooling & Water Dripping',
    category: 'Electrical / AC' as const,
    coach: 'A1',
    berth: 'Berth 24',
    pnr: '412-9850123',
    description: 'AC thermostat reading 31°C, water condensate dripping continuously onto passenger bedding.',
    severity: 'HIGH' as const,
    assignedDivision: 'MAS Division (Southern Railway)',
    sampleImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Cold / Unsealed Pantry Food Delivered',
    category: 'Catering / Pantry' as const,
    coach: 'C3',
    berth: 'Berth 42',
    pnr: '206-8819204',
    description: 'Standard dinner thali delivered without FSSAI seal, rice cold, curd expired yesterday.',
    severity: 'NORMAL' as const,
    assignedDivision: 'IRCTC West Zone Catering Hub',
    sampleImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  }
];
