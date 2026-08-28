import { STATIONS, TDR_RULES } from './mockData';
import { IndicLanguage, TravelClass, QuotaType, TDRRuleClause } from './types';

export interface ParsedVoiceBookingIntent {
  sourceStation: string;
  sourceCode: string;
  destinationStation: string;
  destCode: string;
  date: string;
  classType: TravelClass;
  quota: QuotaType;
  passengerCount: number;
  confidence: number;
  explanation: string;
}

export interface TDRRefundEvaluation {
  ruleMatched: TDRRuleClause;
  eligibleRefundPercent: number;
  baseFare: number;
  clerkageDeducted: number;
  gstAdjustment: number;
  netRefundAmount: number;
  reasoningClause: string;
  recommendedAction: string;
  autoFilingEligible: boolean;
}

export interface QuotaWLInsight {
  code: string;
  fullName: string;
  priorityLevel: number;
  confirmationChancePercent: number;
  explanation: string;
  proTip: string;
  alternativeSuggestion?: string;
}

export interface GrievanceAIResult {
  category: 'Cleanliness / Toilet' | 'Electrical / AC' | 'Catering / Pantry' | 'Bedroll / Linen' | 'Security / Medical' | 'Mechanical';
  severity: 'CRITICAL' | 'HIGH' | 'NORMAL';
  detectedIssues: string[];
  assignedDivision: string;
  targetResolutionMinutes: number;
  suggestedAction: string;
  confidence: number;
}

class RailFlowAIEngine {
  private customOpenAiKey: string | null = null;

  setApiKey(key: string) {
    this.customOpenAiKey = key ? key.trim() : null;
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('railflow_openai_key', key);
      } else {
        localStorage.removeItem('railflow_openai_key');
      }
    }
  }

  getApiKey(): string | null {
    if (this.customOpenAiKey) return this.customOpenAiKey;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('railflow_openai_key');
    }
    return null;
  }

  hasCustomKey(): boolean {
    return !!this.getApiKey();
  }

  // Subsystem 2: Voice & Natural Language Booking Parser (Server First with Local Fallback)
  async parseBookingPrompt(prompt: string, lang: IndicLanguage = 'en'): Promise<ParsedVoiceBookingIntent> {
    try {
      const response = await fetch('/api/ai/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language: lang })
      });
      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          return resJson.data;
        }
      }
    } catch (err) {
      console.warn('Server API unavailable, executing client-side NLP parser:', err);
    }

    // High-Precision Local Deterministic Parser
    const text = prompt.toLowerCase();
    let source = STATIONS.find(s => s.code === 'SBC') || STATIONS[1];
    let destination = STATIONS.find(s => s.code === 'MAS') || STATIONS[2];

    for (const station of STATIONS) {
      const matchName = station.name.toLowerCase();
      const matchCity = station.city.toLowerCase();
      const matchCode = station.code.toLowerCase();

      if (
        text.includes(`from ${matchName}`) || text.includes(`from ${matchCity}`) || text.includes(`from ${matchCode}`) ||
        text.includes(`from ${matchName.split(' ')[0]}`) || text.includes(`से ${matchName}`) || text.includes(`इंदा ${matchName}`) ||
        text.includes(`லிருந்து ${matchName}`) || text.includes(`నుండి ${matchName}`)
      ) {
        source = station;
      }
      if (
        text.includes(`to ${matchName}`) || text.includes(`to ${matchCity}`) || text.includes(`to ${matchCode}`) ||
        text.includes(`to ${matchName.split(' ')[0]}`) || text.includes(`तक ${matchName}`) || text.includes(`गे ${matchName}`) ||
        text.includes(`க்கு ${matchName}`) || text.includes(`వరకు ${matchName}`)
      ) {
        destination = station;
      }
    }

    if (text.includes('delhi') || text.includes('new delhi')) {
      if (text.includes('to delhi') || text.includes('to new delhi')) destination = STATIONS.find(s => s.code === 'NDLS')!;
      else source = STATIONS.find(s => s.code === 'NDLS')!;
    }
    if (text.includes('bangalore') || text.includes('bengaluru') || text.includes('sbc')) {
      if (text.includes('to bangalore') || text.includes('to bengaluru')) destination = STATIONS.find(s => s.code === 'SBC')!;
      else source = STATIONS.find(s => s.code === 'SBC')!;
    }
    if (text.includes('chennai') || text.includes('mas') || text.includes('madras')) {
      if (text.includes('from chennai')) source = STATIONS.find(s => s.code === 'MAS')!;
      else destination = STATIONS.find(s => s.code === 'MAS')!;
    }
    if (text.includes('mumbai') || text.includes('bombay') || text.includes('mmct')) {
      if (text.includes('to mumbai')) destination = STATIONS.find(s => s.code === 'MMCT')!;
      else source = STATIONS.find(s => s.code === 'MMCT')!;
    }
    if (text.includes('kolkata') || text.includes('howrah') || text.includes('hwh')) {
      if (text.includes('to kolkata') || text.includes('to howrah')) destination = STATIONS.find(s => s.code === 'HWH')!;
      else source = STATIONS.find(s => s.code === 'HWH')!;
    }
    if (text.includes('varanasi') || text.includes('banaras') || text.includes('bsb')) {
      destination = STATIONS.find(s => s.code === 'BSB') || destination;
    }

    let classType: TravelClass = '3A';
    if (text.includes('1a') || text.includes('first ac') || text.includes('1st ac')) classType = '1A';
    else if (text.includes('2a') || text.includes('second ac') || text.includes('2nd ac')) classType = '2A';
    else if (text.includes('3a') || text.includes('third ac') || text.includes('3rd ac')) classType = '3A';
    else if (text.includes('sleeper') || text.includes('sl') || text.includes('non-ac')) classType = 'SL';
    else if (text.includes('chair car') || text.includes('cc') || text.includes('vande bharat')) classType = 'CC';
    else if (text.includes('executive') || text.includes('ec')) classType = 'EC';

    let quota: QuotaType = 'GN';
    if (text.includes('tatkal') || text.includes('urgent')) quota = 'TQ';
    else if (text.includes('senior') || text.includes('elderly') || text.includes('old age')) quota = 'SS';
    else if (text.includes('ladies') || text.includes('women')) quota = 'LD';
    else if (text.includes('premium tatkal')) quota = 'PT';

    let passengerCount = 1;
    if (text.includes('2 passenger') || text.includes('2 tickets') || text.includes('two') || text.includes('two tickets') || text.includes('दो टिकट') || text.includes('ಎರಡು')) passengerCount = 2;
    else if (text.includes('3 passenger') || text.includes('3 tickets') || text.includes('three') || text.includes('तीन')) passengerCount = 3;
    else if (text.includes('4 passenger') || text.includes('4 tickets') || text.includes('four') || text.includes('चार')) passengerCount = 4;

    const travelDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return {
      sourceStation: source.name,
      sourceCode: source.code,
      destinationStation: destination.name,
      destCode: destination.code,
      date: travelDate,
      classType,
      quota,
      passengerCount,
      confidence: 0.94,
      explanation: `Extracted journey from ${source.name} (${source.code}) to ${destination.name} (${destination.code}) for ${passengerCount} passenger(s) in ${classType} class under ${quota} quota.`
    };
  }

  // Subsystem 1: AI TDR & Auto-Refund Dispute Engine
  evaluateTDRClaim(pnr: string, disputeStatement: string, farePaid: number = 1470, delayMinutes: number = 215): TDRRefundEvaluation {
    const text = disputeStatement.toLowerCase();

    let matchedRule = TDR_RULES[0];
    for (const rule of TDR_RULES) {
      if (rule.conditionCheck(delayMinutes, true, text)) {
        matchedRule = rule;
        break;
      }
    }

    const refundPercent = matchedRule.eligibleRefundPercent;
    const clerkage = matchedRule.clerkageFee;
    let calculatedRefund = Math.round((farePaid * refundPercent) / 100) - clerkage;
    if (calculatedRefund < 0) calculatedRefund = 0;

    let reasoning = `Matched against IRCTC ${matchedRule.ruleCode}: "${matchedRule.title}".`;
    if (matchedRule.ruleCode === 'Rule 14.1') {
      reasoning += ` Verified simulated train delay of ${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m (> 180 min threshold). 100% full refund with ZERO clerkage deduction is mandatory under railway gazette policy.`;
    } else if (matchedRule.ruleCode === 'Rule 14.4') {
      reasoning += ` AC cooling fault verified in coach log. Difference between AC fare and standard non-AC fare is credited directly without penalty.`;
    }

    return {
      ruleMatched: matchedRule,
      eligibleRefundPercent: refundPercent,
      baseFare: farePaid,
      clerkageDeducted: clerkage,
      gstAdjustment: Math.round(farePaid * 0.05),
      netRefundAmount: calculatedRefund,
      reasoningClause: reasoning,
      recommendedAction: 'Instant 1-Click TDR Submission & Bank Refund Token Generation',
      autoFilingEligible: true
    };
  }

  // Subsystem 5: Explainable Quota & Waitlist Predictor
  explainWaitlistQuota(code: string, currentNumber: number): QuotaWLInsight {
    switch (code) {
      case 'GNWL':
        return {
          code: 'GNWL',
          fullName: 'General Waitlist',
          priorityLevel: 1,
          confirmationChancePercent: Math.max(15, Math.min(95, Math.round(100 - currentNumber * 1.6))),
          explanation: 'GNWL is issued for passengers starting from the origin station. It holds the HIGHEST clearance priority across all Indian Railways quotas and clears first as cancellations occur.',
          proTip: 'GNWL up to 40 in 3A usually clears 4 hours before departure during first chart preparation.',
          alternativeSuggestion: 'Check Tatkal (TQ) or Senior Citizen (SS) quota for immediate confirmation.'
        };
      case 'RLWL':
        return {
          code: 'RLWL',
          fullName: 'Remote Location Waitlist',
          priorityLevel: 2,
          confirmationChancePercent: Math.max(10, Math.min(80, Math.round(85 - currentNumber * 2.2))),
          explanation: 'RLWL is issued for intermediate junction stations along the train route that have a dedicated smaller sub-quota. Clears only if passengers boarding that specific station cancel.',
          proTip: 'Clears significantly slower than GNWL. Book from origin station with Boarding Point set to intermediate station to switch to GNWL priority!',
          alternativeSuggestion: 'Try Break-Journey / Split-Seat Multi-Leg route.'
        };
      case 'PQWL':
        return {
          code: 'PQWL',
          fullName: 'Pooled Quota Waitlist',
          priorityLevel: 3,
          confirmationChancePercent: Math.max(5, Math.min(65, Math.round(70 - currentNumber * 3.0))),
          explanation: 'PQWL is pooled across multiple minor stations. It has the lowest cancellation priority in the entire train reservation hierarchy.',
          proTip: 'PQWL above 15 rarely clears. Strongly consider our Smart Multi-Leg Break-Journey optimizer.',
          alternativeSuggestion: 'Use RailFlow Smart Multi-Leg optimizer to split your journey.'
        };
      case 'RAC':
      default:
        return {
          code: 'RAC',
          fullName: 'Reservation Against Cancellation',
          priorityLevel: 0,
          confirmationChancePercent: 96,
          explanation: 'RAC guarantees boarding rights on the train with a shared Side-Lower seat (2 passengers per berth). At chart preparation, RAC passengers are automatically upgraded to full sleeper berths as CNF cancellations occur.',
          proTip: 'RAC 1 to 20 almost ALWAYS converts to full confirmed berth before train chart preparation.',
          alternativeSuggestion: 'Safe to travel without worries!'
        };
    }
  }

  // Subsystem 10: Multimodal RailMadad Grievance Classifier
  async classifyGrievanceImageAsync(categoryInput?: string, descriptionInput?: string, imageBase64?: string): Promise<GrievanceAIResult> {
    try {
      const response = await fetch('/api/ai/vision-triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryInput, description: descriptionInput, imageBase64 })
      });
      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          return resJson.data;
        }
      }
    } catch (err) {
      console.warn('Server Vision API failed, using local classifier fallback:', err);
    }
    return this.classifyGrievanceImage(categoryInput, descriptionInput);
  }

  classifyGrievanceImage(categoryInput?: string, descriptionInput?: string): GrievanceAIResult {
    const text = ((categoryInput || '') + ' ' + (descriptionInput || '')).toLowerCase();

    if (text.includes('toilet') || text.includes('washroom') || text.includes('choke') || text.includes('water overflow') || text.includes('dirty') || text.includes('smell')) {
      return {
        category: 'Cleanliness / Toilet',
        severity: 'CRITICAL',
        detectedIssues: ['Choked drainage basin', 'Floor waterlogging', 'Empty soap dispenser', 'Foul odor'],
        assignedDivision: 'On-Board Housekeeping Staff (OBHS) & Base Division DRM',
        targetResolutionMinutes: 20,
        suggestedAction: 'Auto-dispatch OBHS janitorial team with portable vacuum pump at next scheduled halt.',
        confidence: 0.96
      };
    } else if (text.includes('ac') || text.includes('cooling') || text.includes('leak') || text.includes('fan') || text.includes('light') || text.includes('switch')) {
      return {
        category: 'Electrical / AC',
        severity: 'HIGH',
        detectedIssues: ['AC condenser thermal trip', 'Drip tray overflow', 'Thermostat offset > +6°C'],
        assignedDivision: 'Electrical Coach Escort (AC Mechanic)',
        targetResolutionMinutes: 30,
        suggestedAction: 'Alert on-train AC mechanic with berth coordinates for immediate relay check and refrigerant pressure test.',
        confidence: 0.92
      };
    } else if (text.includes('food') || text.includes('pantry') || text.includes('meal') || text.includes('hygiene') || text.includes('cater')) {
      return {
        category: 'Catering / Pantry',
        severity: 'HIGH',
        detectedIssues: ['FSSAI hologram missing', 'Sub-standard thermal packaging', 'Pantry temperature anomaly'],
        assignedDivision: 'IRCTC Quality Control Inspector & Pantry Manager',
        targetResolutionMinutes: 45,
        suggestedAction: 'Initiate instant replacement thali from base kitchen and issue pantry inspection notice.',
        confidence: 0.91
      };
    }

    return {
      category: 'Mechanical',
      severity: 'NORMAL',
      detectedIssues: ['Berth latch loose', 'Window blind tension slack'],
      assignedDivision: 'Carriage & Wagon (C&W) Mechanical Wing',
      targetResolutionMinutes: 60,
      suggestedAction: 'Queue maintenance token for terminal station maintenance turn-around.',
      confidence: 0.88
    };
  }
}

export const aiEngine = new RailFlowAIEngine();
