import type {Workspace} from './types';
import type {MetricId} from './metrics';
// Authored contextual associations, not causal claims or AI-generated matches.
export const METRIC_ISSUES:Partial<Record<MetricId,string[]>>={
 'payment-success':['i1','i3'],'payment-reversal':['i1','i3'],
 'dispute-success':['i2'],'card-timeout':['i5'],'inbound-flagged':['i4'],
};
export function evidenceFor(w:Workspace,scope:{metric?:string;issue?:string;partner?:string}){
 const mapped=w.demoContentVersion===2?METRIC_ISSUES[scope.metric as MetricId]||[]:[];
 const issueIds=scope.issue?[scope.issue].filter(id=>!scope.metric||mapped.includes(id)):mapped;
 const findings=w.findings.filter(f=>issueIds.includes(f.issueId)&&f.status==='accepted'&&w.sources.some(s=>s.id===f.sourceId&&(!scope.partner||s.partnerId===scope.partner)&&s.text.slice(f.start,f.end)===f.quote));
 const sourceIds=[...new Set(findings.map(f=>f.sourceId))];
 return {issueIds,findings,sources:w.sources.filter(s=>sourceIds.includes(s.id)),opportunities:w.opportunities.filter(o=>o.issueIds.some(id=>issueIds.includes(id)))};
}
export function evidenceQuery(scope:{partner?:string;period?:string;metric?:string;issue?:string;source?:string}){return new URLSearchParams(Object.entries(scope).filter(([,v])=>!!v) as [string,string][]).toString()}
