'use client';
import Link from 'next/link';
import {EvidenceContext} from './evidence';
import {useSearchParams} from 'next/navigation';
import {ArrowUpRight,ArrowDownRight,Minus,ArrowRight} from 'lucide-react';
import {useWorkspace} from './workspace';
import {Badge,Empty,SectionTitle,Avatar} from './ui';
import {PARTNERS} from '@/lib/types';
import {calculateMetric,monthOverMonth,MetricDefinition,PerformanceDataset} from '@/lib/metrics';
import {OVERVIEW_METRICS,performanceSelection,periodLabel,formatRate,formatChange,countLabel} from '@/lib/performance-view';

function usePerformance(fixedPartner?:string){
 const {w}=useWorkspace();const params=useSearchParams();
 const data=w!.performance;
 const selection=performanceSelection(data,{partner:params.get('partner')||'',area:params.get('area')||'',period:params.get('period')||'',metric:params.get('metric')||''},fixedPartner);
 function replace(query:URLSearchParams){window.history.replaceState(null,'',window.location.pathname+(query.size?'?'+query.toString():'')+window.location.hash)}
 function update(key:string,value:string){const query=new URLSearchParams(window.location.search);if(value)query.set(key,value);else query.delete(key);if(key==='area')query.delete('metric');replace(query)}
 function clear(){const query=new URLSearchParams(window.location.search);for(const key of ['partner','area','period','metric'])query.delete(key);replace(query)}
 return {data,...selection,area:params.get('area')||'',update,clear};
}
function PerformanceFilters({view,fixedPartner,metricSelect=false}:{view:ReturnType<typeof usePerformance>;fixedPartner?:string;metricSelect?:boolean}){
 return <div className={`performance-filters ${metricSelect?'comparison-filters':''}`} aria-label="Performance filters">
  {!fixedPartner&&<label>Partner<select aria-label="Performance partner" value={view.partner} onChange={e=>view.update('partner',e.target.value)}><option value="">All fictional partners</option>{PARTNERS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
  <label>Product area<select aria-label="Performance product area" value={view.area} onChange={e=>view.update('area',e.target.value)}><option value="">All product areas</option>{view.data.products.map(p=><option key={p.id} value={p.area}>{p.area}</option>)}</select></label>
  <label>Reporting month<select aria-label="Performance reporting month" value={view.period} onChange={e=>view.update('period',e.target.value)}>{view.data.periods.map(p=><option key={p.id} value={p.id}>{periodLabel(p.id)}</option>)}</select></label>
  {metricSelect&&<label>Compare metric<select aria-label="Partner comparison metric" value={view.metric?.id||''} onChange={e=>view.update('metric',e.target.value)}>{view.definitions.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>}
  <button className="button ghost" onClick={view.clear}>Reset performance filters</button>
 </div>
}
export function Change({value,direction='higher-is-better'}:{value:number|null;direction?:MetricDefinition['direction']}){
 const Icon=value===null||Math.abs(value)<.005?Minus:value>0?ArrowUpRight:ArrowDownRight;
 return <span className={`metric-change ${value===null?'unavailable':(direction==='higher-is-better'?value<0:value>0)?'falling':value!==0?'rising':'stable'}`}><Icon aria-hidden="true" size={14}/>{formatChange(value)}</span>
}
export function PerformancePanel({partnerId}:{partnerId?:string}){
 const view=usePerformance(partnerId);const {data,metric,period,partnerIds}=view;
 const definitions=!partnerId&&!view.area?view.definitions.filter(d=>OVERVIEW_METRICS.includes(d.id)):view.definitions;
 return <section className="performance-section" aria-label="Synthetic product performance">
  <SectionTitle title="Product performance" detail="Six complete months · April–September 2026 · authored synthetic metrics" action={<Badge>Synthetic data</Badge>}/>
  <PerformanceFilters view={view} fixedPartner={partnerId}/>
  {view.errors.length?<FilterErrors errors={view.errors} clear={view.clear}/>:<>
   <div className="performance-summary-line"><p><strong>{periodLabel(period)}</strong><span> · {partnerId?PARTNERS.find(p=>p.id===partnerId)?.name:view.partner?PARTNERS.find(p=>p.id===view.partner)?.name:'All five fictional partners'}</span></p><span>Changes vs {data.periods.findIndex(p=>p.id===period)>0?periodLabel(data.periods[data.periods.findIndex(p=>p.id===period)-1].id):'no earlier month in the dataset'}</span></div>
   <p className="performance-scroll-hint">Scroll the table horizontally for changes, counts and trend controls.</p><div className="table-scroll" tabIndex={0} aria-label="Product performance table; scroll horizontally if needed"><table className="performance-table"><caption className="sr-only">Synthetic product metrics for {periodLabel(period)}. Changes are against the previous complete month; all changes use percentage points.</caption><thead><tr><th>Product / metric</th><th className="numeric">Rate</th><th>Month-over-month</th><th className="numeric">Numerator / denominator</th><th><span className="sr-only">Trend selection</span></th></tr></thead><tbody>{definitions.map(d=>{
    const comparison=monthOverMonth(data,d.id,period,partnerIds),current=comparison.current;
    return <tr key={d.id} className={d.id===metric?.id?'selected-metric':''}><td><span className="cell-secondary">{data.products.find(p=>p.id===d.productId)?.area}</span><strong className="performance-metric-name">{d.name}</strong></td><td className="numeric metric-rate">{formatRate(current.rate)}</td><td><Change value={comparison.changePercentagePoints} direction={d.direction}/>{!current.complete&&<span className="cell-secondary">Coverage: {current.availablePartners}/{current.expectedPartners} partners</span>}</td><td className="numeric">{countLabel(current.numerator)} / {countLabel(current.denominator)}</td><td><button className="button ghost compact" aria-label={`Show trend for ${d.name}`} aria-pressed={d.id===metric?.id} onClick={()=>view.update('metric',d.id)}>View trend<ArrowRight size={13}/></button></td></tr>;
   })}</tbody></table></div>
   <p className="performance-note">Rates use summed counts, not averaged percentages. Changes are percentage points (pp). April has no prior-month comparison. Metrics describe different populations and are not combined into a score.</p>
   <PerformanceNotes data={data} period={period} partnerIds={partnerIds} metricIds={definitions.map(d=>d.id)}/>
   {metric&&<><MetricTrend data={data} definition={metric} period={period} partnerIds={partnerIds}/><EvidenceContext metricId={metric.id} partnerId={partnerId}/></>}
  </>}
 </section>
}
function FilterErrors({errors,clear}:{errors:string[];clear:()=>void}){return <Empty title="Performance filters need attention" action={<button className="button secondary" onClick={clear}>Reset performance filters</button>}>{errors.join(' ')}</Empty>}
function MetricTrend({data,definition,period,partnerIds}:{data:PerformanceDataset;definition:MetricDefinition;period:string;partnerIds:string[]}){
 const months=data.periods.map(p=>({period:p.id,...calculateMetric(data,definition.id,p.id,partnerIds)}));
 return <div className="performance-trend"><div className="section-heading"><div><h3>{definition.name}</h3><p>April–September 2026 · each month has its own denominator · full 0–100% scale</p></div><span className="trend-selection">Selected: {periodLabel(period)}</span></div>
  <figure className="trend-figure"><div className="trend-axis" aria-hidden="true"><span>100%</span><span>50%</span><span>0%</span></div><div className="trend-columns">{months.map(m=><div key={m.period} className={`trend-column ${m.period===period?'current-month':''}`}><span className="trend-value">{m.rate===null?'N/A':formatRate(m.rate)}</span><div className="trend-track"><div className="trend-bar" style={{height:m.rate===null?'0%':`${m.rate}%`}}/>{m.rate===null&&<span className="trend-missing">No rate</span>}</div><span className="trend-month">{periodLabel(m.period,true)}</span></div>)}</div><figcaption>Synthetic monthly rates for {PARTNERS.filter(p=>partnerIds.includes(p.id)).map(p=>p.name).join(', ')}. Missing values are not shown as zero.</figcaption></figure>
  <details className="performance-details"><summary>View monthly counts and calculation</summary><div className="table-scroll" tabIndex={0} aria-label="Monthly metric counts; scroll horizontally if needed"><table><caption>{definition.name} · synthetic monthly data</caption><thead><tr><th>Month</th><th className="numeric">Numerator</th><th className="numeric">Denominator</th><th className="numeric">Excluded</th><th className="numeric">Rate</th><th>Partner coverage</th></tr></thead><tbody>{months.map(m=><tr key={m.period}><th scope="row">{periodLabel(m.period)}</th><td className="numeric">{countLabel(m.numerator)}</td><td className="numeric">{countLabel(m.denominator)}</td><td className="numeric">{countLabel(m.excludedCount)}</td><td className="numeric">{formatRate(m.rate)}</td><td>{m.availablePartners} / {m.expectedPartners}{!m.complete?' · incomplete':''}</td></tr>)}</tbody></table></div><MetricDefinitionText definition={definition}/></details>
 </div>
}
function MetricDefinitionText({definition:d}:{definition:MetricDefinition}){return <dl className="metric-definition"><div><dt>Numerator</dt><dd>{d.numerator}</dd></div><div><dt>Denominator</dt><dd>{d.denominator}</dd></div><div><dt>Excluded</dt><dd>{d.exclusions}</dd></div><div><dt>Reporting rule</dt><dd>{d.cohort}</dd></div><div><dt>Change</dt><dd>Current rate minus previous rate, in percentage points.</dd></div><div><dt>Calculation</dt><dd>Sum of numerators ÷ sum of denominators × 100. Unavailable when coverage is incomplete or the eligible denominator is zero.</dd></div></dl>}
export function PartnerComparison(){
 const view=usePerformance();const {data,metric,period}=view;
 const partners=PARTNERS.filter(p=>!view.partner||p.id===view.partner);
 return <section className="performance-section" aria-label="Synthetic partner performance comparison"><SectionTitle title="Compare partner performance" detail="One metric at a time · same complete reporting month · all figures synthetic"/>
  <PerformanceFilters view={view} metricSelect/>
  {view.errors.length?<FilterErrors errors={view.errors} clear={view.clear}/>:metric&&<>
   <div className="performance-summary-line"><h3>{metric.name}</h3><span>{periodLabel(period)} · change vs previous complete month</span></div>
   <p className="performance-scroll-hint">Scroll the table horizontally to view changes and eligible counts.</p><div className="table-scroll" tabIndex={0} aria-label="Partner performance comparison; scroll horizontally if needed"><table className="partner-performance-table"><thead><tr><th>Fictional partner</th><th className="numeric">Rate</th><th>Month-over-month</th><th className="numeric">Numerator / denominator</th><th className="numeric">Excluded</th></tr></thead><tbody>{partners.map(p=>{
    const c=monthOverMonth(data,metric.id,period,[p.id]);const query=new URLSearchParams({period,metric:metric.id});const area=data.products.find(x=>x.id===metric.productId)?.area;if(area)query.set('area',area);
    return <tr key={p.id}><td><Link className="partner-name" href={`/partners/${p.id}?${query}`}><Avatar partner={p}/><span><strong>{p.name}</strong><small>Inspired by {p.inspiredBy} · no affiliation</small></span></Link></td><td className="numeric metric-rate">{formatRate(c.current.rate)}</td><td><Change value={c.changePercentagePoints} direction={metric.direction}/></td><td className="numeric">{countLabel(c.current.numerator)} / {countLabel(c.current.denominator)}</td><td className="numeric">{countLabel(c.current.excludedCount)}</td></tr>;
   })}</tbody></table></div>
   <p className="performance-note">These rates describe the selected metric only, not overall partner health. No real-company performance is represented.</p><details className="performance-details"><summary>Metric definition and reporting rules</summary><MetricDefinitionText definition={metric}/></details>
  </>}
 </section>
}

export function PerformanceNotes({data,period,partnerIds,metricIds}:{data:PerformanceDataset;period:string;partnerIds:string[];metricIds?:string[]}){
 const notes=data.feedback.filter(f=>f.periodId===period&&partnerIds.includes(f.partnerId)&&(!metricIds||metricIds.includes(data.observations.find(o=>o.id===f.observationId)?.metricId||'')));
 return notes.length?<details className="performance-details"><summary>Synthetic partner context · {periodLabel(period)}</summary><p className="performance-note">Authored fictional observations, not verified explanations of metric changes. Separate from reviewed source counts.</p>{notes.map(f=><article className="source-entry" key={f.id}><div className="source-meta"><strong>{PARTNERS.find(p=>p.id===f.partnerId)?.name}</strong><time dateTime={f.date}>{f.date}</time><Badge>Synthetic</Badge></div><p>{f.text}</p></article>)}</details>:null;
}
