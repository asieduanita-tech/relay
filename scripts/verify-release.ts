import assert from 'node:assert/strict';
import {seed} from '../src/lib/seed';
import {validatePerformance,monthOverMonth,calculateMetric} from '../src/lib/metrics';
import {OVERVIEW_METRICS,formatRate,formatChange} from '../src/lib/performance-view';
import {evidenceFor} from '../src/lib/evidence';
import {PARTNERS} from '../src/lib/types';
const w=seed();validatePerformance(w.performance);
assert.ok(w.sources.every(s=>s.synthetic));assert.ok(w.performance.feedback.every(f=>f.synthetic));
for(const f of w.findings){const s=w.sources.find(s=>s.id===f.sourceId)!;assert.equal(s.text.slice(f.start,f.end),f.quote);assert.ok(w.issues.some(i=>i.id===f.issueId&&i.area===f.area))}
const expected=['99.70%','0.16%','43.52%','1.50%','1.43%'];
const metrics=OVERVIEW_METRICS.map((id,index)=>{const d=w.performance.definitions.find(d=>d.id===id)!;const c=monthOverMonth(w.performance,d.id,'2026-09');assert.equal(formatRate(c.current.rate),expected[index]);let numerator=0,denominator=0;for(const p of PARTNERS){const value=calculateMetric(w.performance,d.id,'2026-09',[p.id]);numerator+=value.numerator;denominator+=value.denominator}assert.equal(c.current.numerator,numerator);assert.equal(c.current.denominator,denominator);return {id,name:d.name,rate:formatRate(c.current.rate),change:formatChange(c.changePercentagePoints),numerator,denominator,acceptedSources:evidenceFor(w,{metric:id}).sources.length}});
console.log(JSON.stringify({label:'SYNTHETIC RELEASE RECONCILIATION — no real-company performance',fixture:w.performance.fixtureVersion,counts:{sources:w.sources.length,accepted:w.findings.filter(f=>f.status==='accepted').length,suggestions:w.findings.filter(f=>f.status==='suggested').length,issues:w.issues.length,opportunities:w.opportunities.length,observations:w.performance.observations.length,historicalNotes:w.performance.feedback.length},metrics},null,2));
