import {z} from 'zod';
import {AREAS,PARTNERS} from './types';

export const PRODUCT_IDS = ['payments','accounts','cards','kyc','risk'] as const;
export const METRIC_IDS = ['payment-success','reference-completeness','dispute-deadline','kyc-first-approval','risk-sla','payment-reversal','dispute-success','card-timeout','inbound-flagged'] as const;
export type ProductId = typeof PRODUCT_IDS[number];
export type MetricId = typeof METRIC_IDS[number];
export type Product = {id:ProductId;area:typeof AREAS[number];synthetic:true};
export type ReportingPeriod = {id:string;start:string;endExclusive:string;status:'complete';timezone:'UTC'};
export type MetricDefinition = {
  id:MetricId;productId:ProductId;name:string;unit:'percent';direction:'higher-is-better'|'lower-is-better';
  numerator:string;denominator:string;exclusions:string;cohort:string;
};
export type MetricObservation = {
  id:string;partnerId:string;productId:ProductId;metricId:MetricId;periodId:string;
  numerator:number;denominator:number;excludedCount:number;synthetic:true;provenance:string;
};
export type HistoricalFeedback = {
  id:string;partnerId:string;productId:ProductId;periodId:string;observationId:string;
  date:string;channel:'Email'|'Slack'|'Meeting';text:string;synthetic:true;provenance:string;
};
export type PerformanceDataset = {
  fixtureVersion:4;asOf:string;synthetic:true;products:Product[];periods:ReportingPeriod[];
  definitions:MetricDefinition[];observations:MetricObservation[];feedback:HistoricalFeedback[];
};
export const METRIC_DEFINITIONS:MetricDefinition[] = [
 {id:'payment-success',productId:'payments',name:'Successful payments',unit:'percent',direction:'higher-is-better',numerator:'Successful payment attempts reaching terminal status in the period.',denominator:'All eligible successful or failed terminal payment attempts in the period.',exclusions:'Attempts initiated in the month still pending at month-end; attempts cancelled before acceptance with cancellation timestamp in the month.',cohort:'UTC terminal-status timestamp; a retry is a separate attempt, not a unique payment.'},
 {id:'reference-completeness',productId:'accounts',name:'Settlement reference completeness',unit:'percent',direction:'higher-is-better',numerator:'Eligible statement rows containing a non-empty settlement reference.',denominator:'Posted settlement transaction rows exported in the period.',exclusions:'Opening balances, summaries and non-settlement rows.',cohort:'UTC export timestamp; export rows, not unique transactions or accounts.'},
 {id:'dispute-deadline',productId:'cards',name:'Dispute evidence deadline adherence',unit:'percent',direction:'higher-is-better',numerator:'Eligible dispute cases with complete evidence submitted at or before their evidence deadline.',denominator:'Cases requiring evidence whose evidence deadline falls in the period.',exclusions:'Withdrawn cases and cases not requiring evidence, assigned by original evidence deadline in the month.',cohort:'UTC evidence deadline; one case once. Missing evidence at deadline is a failure, even if still open.'},
 {id:'kyc-first-approval',productId:'kyc',name:'First-attempt KYC approval rate',unit:'percent',direction:'higher-is-better',numerator:'Approved completed first verification attempts.',denominator:'Eligible approved or rejected first attempts completed in the period.',exclusions:'Pending first attempts initiated in the month and still pending at month-end; abandoned first attempts by abandonment date; retries and test identities by decision date. Each excluded record belongs to one mutually exclusive category.',cohort:'UTC first-attempt decision timestamp; a first attempt is counted once, not every document upload.'},
 {id:'risk-sla',productId:'risk',name:'Risk review SLA adherence',unit:'percent',direction:'higher-is-better',numerator:'Eligible reviews completed at or before their two-business-day SLA deadline.',denominator:'Eligible reviews with an SLA deadline in the period, including open overdue reviews.',exclusions:'Duplicate and cancelled reviews, assigned by their original nominal SLA deadline in the month.',cohort:'UTC SLA deadline. Synthetic deadlines assume Monday–Friday, no public holidays, no pauses; due timestamps are preclassified fixture inputs, not calculated from real cases.'},
 {id:'payment-reversal',productId:'payments',name:'Reversed payment rate',unit:'percent',direction:'lower-is-better',numerator:'Payments reversed during the 30-day observation window after settlement.',denominator:'Settled cross-border payments whose 30-day observation window closes in the reporting month.',exclusions:'Unsettled, cancelled and test payments.',cohort:'UTC observation-window close; one settled payment once. Different cohort from terminal-attempt success; rates are not complements.'},
 {id:'dispute-success',productId:'cards',name:'Successful disputes',unit:'percent',direction:'higher-is-better',numerator:'Closed eligible disputes decided in favour of the customer.',denominator:'Eligible disputes with a final won or lost outcome in the reporting month.',exclusions:'Open, withdrawn and duplicate disputes.',cohort:'UTC final outcome timestamp; one dispute once. Evidence submission alone is not a successful outcome.'},
 {id:'card-timeout',productId:'cards',name:'Timed out payment attempts',unit:'percent',direction:'lower-is-better',numerator:'Eligible card payment attempts ending in a timeout.',denominator:'All eligible card payment attempts initiated in the reporting month, including timed-out attempts.',exclusions:'Test attempts and attempts cancelled before submission.',cohort:'UTC initiation timestamp; each retry counts separately. Incorrect details are a fictional partner-reported explanation, not a measured timeout cause.'},
 {id:'inbound-flagged',productId:'accounts',name:'Flagged inbound payments (Risk & Compliance)',unit:'percent',direction:'lower-is-better',numerator:'Inbound payments flagged for suspected use inconsistent with the declared account purpose.',denominator:'All eligible inbound payments received in the reporting month.',exclusions:'Test, duplicate and rejected-before-receipt records.',cohort:'UTC receipt timestamp; one payment once. A flag indicates review, not confirmed misconduct. A lower rate is a monitoring preference, not a reason to suppress legitimate flags.'},
];
const observationSchema=z.object({id:z.string().min(1),partnerId:z.string().min(1),productId:z.enum(PRODUCT_IDS),metricId:z.enum(METRIC_IDS),periodId:z.string().regex(/^2026-(04|05|06|07|08|09)$/),numerator:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),denominator:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),excludedCount:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),synthetic:z.literal(true),provenance:z.string().min(1)}).refine(o=>o.numerator<=o.denominator,'Numerator exceeds denominator');
const feedbackSchema=z.object({id:z.string().min(1),partnerId:z.string(),productId:z.enum(PRODUCT_IDS),periodId:z.string(),observationId:z.string(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),channel:z.enum(['Email','Slack','Meeting']),text:z.string().min(10),synthetic:z.literal(true),provenance:z.string().min(1)});
export function validatePerformance(data:PerformanceDataset):void {
 if(data.fixtureVersion!==4||data.synthetic!==true)throw new Error('Unsupported or unlabelled performance fixture');
 if(data.asOf!=='2026-10-21T00:00:00Z')throw new Error('Unexpected synthetic reporting snapshot');
 const unique=(xs:string[],label:string)=>{if(new Set(xs).size!==xs.length)throw new Error(`Duplicate ${label}`)};
 unique(data.products.map(p=>p.id),'product');unique(data.periods.map(p=>p.id),'period');unique(data.definitions.map(d=>d.id),'definition');unique(data.observations.map(o=>o.id),'observation ID');unique(data.feedback.map(f=>f.id),'feedback ID');
 if(data.products.length!==5||data.definitions.length!==METRIC_DEFINITIONS.length||data.periods.length!==6)throw new Error('Expected five products, nine definitions and six periods');
 for(const [n,p] of data.products.entries())if(p.id!==PRODUCT_IDS[n]||p.area!==AREAS[n]||p.synthetic!==true)throw new Error('Invalid canonical product');
 for(const [n,p] of data.periods.entries()){
  const start=`2026-${String(n+4).padStart(2,'0')}-01T00:00:00Z`,end=`2026-${String(n+5).padStart(2,'0')}-01T00:00:00Z`;
  if(p.id!==start.slice(0,7)||p.start!==start||p.endExclusive!==end||p.status!=='complete'||p.timezone!=='UTC')throw new Error('Invalid reporting period boundaries');
 }
 for(const d of data.definitions){const expected=METRIC_DEFINITIONS.find(x=>x.id===d.id);if(!expected||!Object.entries(expected).every(([key,value])=>d[key as keyof MetricDefinition]===value))throw new Error('Invalid metric definition');}
 const partners=new Set(PARTNERS.map(p=>p.id));
 unique(data.observations.map(o=>`${o.partnerId}|${o.metricId}|${o.periodId}`),'observation grain');
 if(data.observations.length!==PARTNERS.length*METRIC_DEFINITIONS.length*6)throw new Error('Expected complete 5 × 9 × 6 observation coverage');
 for(const o of data.observations){observationSchema.parse(o);if(!partners.has(o.partnerId)||!data.periods.some(p=>p.id===o.periodId)||!data.definitions.some(d=>d.id===o.metricId&&d.productId===o.productId))throw new Error('Invalid observation relationship');}
 if(data.feedback.length!==METRIC_DEFINITIONS.length*6)throw new Error('Expected one historical feedback record per metric and month');
 unique(data.feedback.map(f=>`${data.observations.find(o=>o.id===f.observationId)?.metricId}|${f.periodId}`),'historical product/month feedback');
 for(const f of data.feedback){feedbackSchema.parse(f);const observation=data.observations.find(o=>o.id===f.observationId);if(!observation||observation.partnerId!==f.partnerId||observation.productId!==f.productId||observation.periodId!==f.periodId)throw new Error('Invalid feedback context');const p=data.periods.find(p=>p.id===f.periodId);const date=new Date(f.date);if(!p||isNaN(date.getTime())||date.toISOString().slice(0,10)!==f.date||date<new Date(p.start)||date>=new Date(p.endExclusive))throw new Error('Feedback date outside reporting period');}
}
export type MetricResult={numerator:number;denominator:number;excludedCount:number;rate:number|null;availablePartners:number;expectedPartners:number;complete:boolean};
export function calculateMetric(data:PerformanceDataset,metricId:MetricId,periodId:string,partnerIds?:readonly string[]):MetricResult {
 if(!data.definitions.some(d=>d.id===metricId))throw new Error('Unknown metric');
 if(!data.periods.some(p=>p.id===periodId))throw new Error('Unknown reporting period');
 const ids=partnerIds===undefined?PARTNERS.map(p=>p.id):[...new Set(partnerIds)];
 if(ids.some(id=>!PARTNERS.some(p=>p.id===id)))throw new Error('Unknown partner');
 const rows=data.observations.filter(o=>o.metricId===metricId&&o.periodId===periodId&&ids.includes(o.partnerId));
 const seen=new Set<string>();let numerator=0,denominator=0,excludedCount=0;
 for(const row of rows){observationSchema.parse(row);if(seen.has(row.partnerId))throw new Error('Duplicate partner observation');seen.add(row.partnerId);if(!data.definitions.some(d=>d.id===row.metricId&&d.productId===row.productId))throw new Error('Observation product mismatch');numerator+=row.numerator;denominator+=row.denominator;excludedCount+=row.excludedCount;}
 if(![numerator,denominator,excludedCount].every(Number.isSafeInteger))throw new Error('Aggregated counts exceed safe integer range');
 const complete=ids.length>0&&seen.size===ids.length;
 return {numerator,denominator,excludedCount,rate:complete&&denominator>0?numerator/denominator*100:null,availablePartners:seen.size,expectedPartners:ids.length,complete};
}
export function monthOverMonth(data:PerformanceDataset,metricId:MetricId,periodId:string,partnerIds?:readonly string[]){
 const index=data.periods.findIndex(p=>p.id===periodId);if(index<0)throw new Error('Unknown reporting period');
 const current=calculateMetric(data,metricId,periodId,partnerIds);
 const previous=index>0?calculateMetric(data,metricId,data.periods[index-1].id,partnerIds):null;
 return {current,previous,changePercentagePoints:current.rate!==null&&previous?.rate!=null?current.rate-previous.rate:null};
}
