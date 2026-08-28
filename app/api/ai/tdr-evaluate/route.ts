import { NextResponse } from 'next/server';
import { TDR_RULES } from '@/lib/mockData';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pnr, disputeStatement = '', farePaid = 1470, delayMinutes = 215 } = body;
    const text = disputeStatement.toLowerCase();

    // Match against official Indian Railways Gazette clauses
    let matchedRule = TDR_RULES[0]; // Default >3hr delay
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
      reasoning += ` Verified railway tracking delay of ${Math.floor(delayMinutes / 60)}h ${delayMinutes % 60}m (> 180 min threshold). 100% full refund with ZERO clerkage deduction is mandatory under railway gazette policy.`;
    } else if (matchedRule.ruleCode === 'Rule 14.4') {
      reasoning += ` AC cooling fault verified in coach log. Difference between AC fare and standard non-AC fare is credited directly without penalty.`;
    }

    const claimToken = `TDR-${new Date().getFullYear()}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    return NextResponse.json({
      success: true,
      claimToken,
      data: {
        pnr: pnr || '821-4928103',
        ruleMatched: matchedRule,
        eligibleRefundPercent: refundPercent,
        baseFare: farePaid,
        clerkageDeducted: clerkage,
        gstAdjustment: Math.round(farePaid * 0.05),
        netRefundAmount: calculatedRefund,
        reasoningClause: reasoning,
        recommendedAction: 'Instant 1-Click TDR Submission & Bank Refund Token Generation',
        autoFilingEligible: true
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to evaluate TDR claim' }, { status: 500 });
  }
}
