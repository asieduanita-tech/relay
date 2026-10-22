import {AREAS,PARTNERS} from './types';
import {METRIC_DEFINITIONS,PRODUCT_IDS,PerformanceDataset,validatePerformance} from './metrics';

// Authored deterministic fixtures, never telemetry or inferred company performance.
// Rate targets are basis points. Counts remain the authoritative calculation inputs.
const TARGETS = [
 [9860,9820,9760,9670,9490,9230],
 [9480,9520,9580,9620,9700,9770],
 [9520,9450,9280,9060,8740,8420],
 [8130,8240,8370,8490,8620,8780],
 [8930,9010,9120,9240,9370,9490],
];
const BASE_VOLUMES=[12000,24000,180,3200,420];
const PARTNER_WEIGHTS=[100,180,70,140,120];
const NOTES = [
 [
  'Most transfers completed, but failed payment attempts still needed a manual explanation from operations.',
  'We saw failed cross-border attempts without a clear reason. Can the terminal status include a failure code?',
  'Retrying failed payments is becoming part of our daily workflow. Please make failure reasons visible.',
  'Our team is spending more time investigating failed transfers. We need a clearer route to resolution.',
  'Payment failures are disrupting the partner workflow. We need to understand which failures are safe to retry.',
  'Failed cross-border attempts need investigation before retrying. Please give operations a failure reason and a next step.',
 ],
 [
  'Some posted settlement rows arrive without a reference, so we match those statement rows manually.',
  'Reference coverage looks more complete, but missing settlement references still create reconciliation work.',
  'The export is easier to reconcile now. A few posted rows still lack a settlement reference.',
  'We can match more settlement rows automatically, but need a consistent reference on every eligible row.',
  'Statement reference coverage has improved. Please help us identify the remaining incomplete rows.',
  'Most exported settlement rows include references now. The exceptions still need a manual ledger lookup.',
 ],
 [
  'Evidence submissions usually meet their deadlines. We still need confirmation that complete files were received.',
  'The dispute evidence checklist is hard to track. We cannot easily see whether a case is ready before its deadline.',
  'We missed evidence deadlines while chasing missing documents. Please show the outstanding items per case.',
  'More dispute cases need last-minute evidence follow-up. A receipt and deadline queue would help.',
  'We need earlier visibility of missing dispute evidence. Manual checks are not keeping cases ahead of deadlines.',
  'Evidence deadlines are being missed while documents are tracked in spreadsheets. We need a receipt, completeness checklist and named next step.',
 ],
 [
  'First KYC attempts are sometimes rejected without enough detail for an applicant to correct the document.',
  'More applicants pass the first check, but rejected first attempts still need a specific explanation.',
  'Document guidance is helping first attempts. We still need actionable reasons when a check fails.',
  'The first-attempt journey is improving. Please make remaining rejection reasons easier for support to explain.',
  'Applicants are getting through the first check more often. Rejected cases still need a clear document correction.',
  'First-attempt approvals look healthier in this synthetic review. Keep the document guidance and clarify the remaining rejection reasons.',
 ],
 [
  'Risk reviews can pass their update deadline without a visible owner. We need to know who is handling each case.',
  'Review follow-up is becoming more predictable, but overdue cases still need a named contact.',
  'The review queue is moving more consistently. Please make the next update date visible on open cases.',
  'We receive more timely risk decisions now. Overdue reviews still need a clearer escalation owner.',
  'Most risk reviews meet the expected window. An owner and next update date would help with the exceptions.',
  'Timely review completion has improved. Please keep ownership visible for the remaining overdue cases.',
 ],
];
export function performanceSeed():PerformanceDataset {
 const periods=Array.from({length:6},(_,n)=>({id:`2026-${String(n+4).padStart(2,'0')}`,start:`2026-${String(n+4).padStart(2,'0')}-01T00:00:00Z`,endExclusive:`2026-${String(n+5).padStart(2,'0')}-01T00:00:00Z`,status:'complete' as const,timezone:'UTC' as const}));
 const extraTargets:Record<string,number[]>={
  'payment-success':[9750,9770,9790,9800,9820,9970],
  'payment-reversal':[240,220,195,175,151,16],
  'dispute-success':[3200,3400,3600,3800,3977,4352],
  'card-timeout':[650,700,760,820,881,150],
  'inbound-flagged':[950,1010,1090,1140,1192,143],
 };
 const notes:Record<string,string>={
  'payment-success':'Payment success is improving as the rate of reversed payments decreases. Closed beneficiary accounts and account details mismatches remain high-severity problems. We are reminding customers to confirm accounts are open and check beneficiary details. Failed payments also affect the success rate; a separate failed-payment rate is not displayed. This is our synthetic operational interpretation, not a proven causal relationship.',
  'payment-reversal':'Fewer cross-border payments are being reversed. We remind customers to confirm beneficiary accounts are open before sending; please keep the reversal reason visible for the remaining cases.',
  'dispute-success':'Dispute success is increasing. Our escalation guide is improving, but evidence is still often weak because submission guidelines are broad. We need reason-specific checklists and examples; this is a medium-severity issue.',
  'card-timeout':'Customers are not receiving OTPs in time for card payments. Late codes can leave authentication attempts timed out; this is a high-severity partner concern. The monthly timeout rate has fallen, but the remaining cases still need investigation.',
  'inbound-flagged':'Business multicurrency accounts are receiving suspected friends-and-family inbound payments inconsistent with their declared purpose. This remains a medium-severity review concern even as the flagged rate falls. These are review flags, not confirmed misuse; clarify the declared purpose and investigate each case.',
 };
 const observations=METRIC_DEFINITIONS.flatMap((definition,a)=>periods.flatMap((period,m)=>PARTNERS.map((partner,p)=>{
  const target=extraTargets[definition.id]?.[m];
  const denominator=definition.id==='dispute-success'&&m===4?10323*PARTNER_WEIGHTS[p]:target!==undefined?10000*PARTNER_WEIGHTS[p]:Math.round(BASE_VOLUMES[a]*PARTNER_WEIGHTS[p]/100*(1+m*.04));
  const numerator=definition.id==='dispute-success'&&m===4?4300*PARTNER_WEIGHTS[p]:target!==undefined?target*PARTNER_WEIGHTS[p]:Math.round(denominator*(TARGETS[a][m]+(p-2)*17)/10000);
  return {id:`metric-v2:${partner.id}:${definition.id}:${period.id}`,partnerId:partner.id,productId:definition.productId,metricId:definition.id,periodId:period.id,numerator,denominator,excludedCount:Math.round(denominator*(a===0?.025:a===3?.08:.015)),synthetic:true as const,provenance:'Authored synthetic aggregate · performance-v2; no real banking telemetry'};
 })));
 const feedback=METRIC_DEFINITIONS.flatMap((definition,a)=>periods.map((period,m)=>{
  const partner=PARTNERS[(a+m)%PARTNERS.length];
  const text=notes[definition.id]?(m===5?notes[definition.id]:`Synthetic ${period.id} monitoring note: track ${definition.name.toLowerCase()} and review exceptions. September follow-up is recorded separately.`):NOTES[a][m];
  return {id:`history-v2:${definition.id}:${period.id}`,partnerId:partner.id,productId:definition.productId,periodId:period.id,observationId:`metric-v2:${partner.id}:${definition.id}:${period.id}`,date:`${period.id}-24`,channel:['Email','Slack','Meeting'][m%3] as 'Email'|'Slack'|'Meeting',text,synthetic:true as const,provenance:'Authored historical synthetic feedback · performance-v2; contextual association, not causal evidence'};
 }));
 const result:PerformanceDataset={fixtureVersion:4,asOf:'2026-10-21T00:00:00Z',synthetic:true,products:PRODUCT_IDS.map((id,i)=>({id,area:AREAS[i],synthetic:true})),periods,definitions:structuredClone(METRIC_DEFINITIONS),observations,feedback};
 validatePerformance(result);return result;
}
