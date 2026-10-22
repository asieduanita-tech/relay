'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useWorkspace} from './workspace';
import {evidenceFor,evidenceQuery,METRIC_ISSUES} from '@/lib/evidence';
import {monthOverMonth} from '@/lib/metrics';
import {formatRate,formatChange,periodLabel} from '@/lib/performance-view';
import {PARTNERS} from '@/lib/types';
export function EvidenceContext({metricId,issueIds,partnerId,compact=false}:{metricId?:string;issueIds?:string[];partnerId?:string;compact?:boolean}){
 const {w}=useWorkspace(),params=useSearchParams();if(!w)return null;
 const partner=partnerId||params.get('partner')||'',period=params.get('period')||'2026-09';
 const definitions=w.performance.definitions.filter(d=>metricId?d.id===metricId:issueIds?.some(id=>w.demoContentVersion===2&&METRIC_ISSUES[d.id]?.includes(id)));
 if(!definitions.length)return null;
 const validPartner=!partner||PARTNERS.some(p=>p.id===partner),validPeriod=w.performance.periods.some(p=>p.id===period);
 if(!validPartner||!validPeriod)return <section className="evidence-context"><h3>Performance context unavailable</h3><p>Choose a valid partner and complete reporting month on <Link href="/">Overview</Link>.</p></section>;
 const content=<><p className="help-text">Synthetic {periodLabel(period)} metrics alongside saved feedback (sample sources are from October). These are different reporting periods; the quotations support investigation, not a measured explanation of the monthly change.</p>{definitions.map(d=>{
 const e=evidenceFor(w,{metric:d.id,partner}),c=monthOverMonth(w.performance,d.id,period,partner?[partner]:undefined),q=evidenceQuery({metric:d.id,period,partner});
 return <div className="evidence-context-item" key={d.id}><h4>{d.name}</h4><p>{formatRate(c.current.rate)} · {formatChange(c.changePercentagePoints)} · {c.current.numerator.toLocaleString('en-GB')} / {c.current.denominator.toLocaleString('en-GB')}</p><div className="button-row"><Link className="text-link" href={`/?${q}`}>Overview trend</Link><Link className="text-link" href={`/partners?${q}`}>Compare partners</Link><Link className="text-link" href={`/feedback?${q}`}>Inspect supporting sources ({e.sources.length})</Link></div>{!e.sources.length&&<p className="help-text">No accepted source evidence for this selection. The metric alone does not establish a partner problem.</p>}{e.issueIds.map(id=>{const issue=w.issues.find(i=>i.id===id);return issue&&<p key={id}><Link className="text-link" href={`/issues/${id}?${q}`}>{issue.title}</Link></p>})}{e.opportunities.map(o=><p key={o.id}><Link className="text-link" href={`/opportunities/${o.id}?${q}`}>Review opportunity: {o.title}</Link></p>)}<details><summary>Original source records</summary>{e.sources.map(s=><article className="evidence-entry" key={s.id}><strong>{PARTNERS.find(p=>p.id===s.partnerId)?.name} · {s.date} · {s.channel}</strong>{e.findings.filter(f=>f.sourceId===s.id).map(f=><blockquote key={f.id}>“{f.quote}”</blockquote>)}<Link className="text-link" href={`/feedback?${evidenceQuery({partner,period,metric:d.id,source:s.id})}`}>Open original source</Link></article>)}</details></div>;
 })}</>;
 return <section className="evidence-context" aria-label="Connected evidence">{compact?<details className="context-disclosure"><summary>Performance and source context</summary>{content}</details>:<><h3>Performance and source context</h3>{content}</>}</section>;
}
