import {PARTNERS} from './types';
import {PerformanceDataset,MetricDefinition} from './metrics';
export const OVERVIEW_METRICS=['payment-success','payment-reversal','dispute-success','card-timeout','inbound-flagged'];
export type PerformanceQuery={partner?:string;area?:string;period?:string;metric?:string};
export function performanceSelection(data:PerformanceDataset,query:PerformanceQuery,fixedPartner?:string){
 const partner=fixedPartner||query.partner||'';
 const period=query.period||data.periods.at(-1)?.id||'';
 const errors:string[]=[];
 if(partner&&!PARTNERS.some(p=>p.id===partner))errors.push('Choose one of the five fictional partners.');
 if(query.area&&!data.products.some(p=>p.area===query.area))errors.push('Choose a listed product area.');
 if(!data.periods.some(p=>p.id===period))errors.push('Choose a complete reporting month from April to September 2026.');
 const definitions=data.definitions.filter(d=>!query.area||data.products.some(p=>p.id===d.productId&&p.area===query.area));
 const requested=query.metric?data.definitions.find(d=>d.id===query.metric):undefined;
 if(query.metric&&!requested)errors.push('Choose a listed metric.');
 const metric:MetricDefinition|undefined=definitions.find(d=>d.id===requested?.id)||definitions[0];
 return {partner,partnerIds:partner?[partner]:PARTNERS.map(p=>p.id),period,definitions,metric,errors};
}
export const formatRate=(rate:number|null)=>rate===null?'Unavailable':`${rate.toFixed(2)}%`;
export function formatChange(change:number|null){if(change===null)return 'No comparison';const rounded=change.toFixed(2);return Number(rounded)===0?'0.00 pp':`${change>0?'+':''}${rounded} pp`}
export function periodLabel(period:string,short=false){return new Intl.DateTimeFormat('en-GB',{month:short?'short':'long',...(short?{}:{year:'numeric' as const}),timeZone:'UTC'}).format(new Date(`${period}-01T00:00:00Z`));}
export const countLabel=(n:number)=>n.toLocaleString('en-GB');
