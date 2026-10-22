import {test} from 'node:test';
import assert from 'node:assert/strict';
import {performanceSeed} from '../src/lib/performance-seed';
import {calculateMetric,monthOverMonth,validatePerformance} from '../src/lib/metrics';
import {seed} from '../src/lib/seed';
import {upgradeWorkspace,LegacyWorkspace} from '../src/lib/workspace-upgrade';
import {mutate} from '../src/lib/domain';

test('fixture covers every partner, product and complete calendar month with synthetic provenance',()=>{
 const d=performanceSeed();validatePerformance(d);assert.equal(d.observations.length,270);assert.equal(d.feedback.length,54);assert.deepEqual(d.periods.map(p=>p.id),['2026-04','2026-05','2026-06','2026-07','2026-08','2026-09']);
 for(const metric of d.definitions){assert.equal(d.observations.filter(o=>o.metricId===metric.id).length,30);assert.equal(d.feedback.filter(f=>d.observations.find(o=>o.id===f.observationId)?.metricId===metric.id).length,6)}
 assert.equal(d.periods[0].start,'2026-04-01T00:00:00Z');assert.equal(d.periods[5].endExclusive,'2026-10-01T00:00:00Z');
 assert.ok(d.observations.every(o=>o.synthetic&&o.provenance));assert.ok(d.feedback.every(f=>f.synthetic&&f.provenance));
});
test('fixture generation is deterministic and returns independent copies',()=>{const a=performanceSeed(),b=performanceSeed();assert.deepEqual(a,b);a.observations[0].numerator=0;a.definitions[0].name='Changed';assert.notDeepEqual(a,b);assert.deepEqual(b,performanceSeed())});
test('rates weight raw counts rather than averaging partner percentages; rounding is not stored',()=>{
 const d=performanceSeed();const rows=d.observations.filter(o=>o.metricId==='payment-success'&&o.periodId==='2026-04');
 rows[0].numerator=1;rows[0].denominator=2;rows[1].numerator=98;rows[1].denominator=100;
 const r=calculateMetric(d,'payment-success','2026-04',['moss','meridian']);assert.equal(r.numerator,99);assert.equal(r.denominator,102);assert.equal(r.rate,99/102*100);assert.notEqual(r.rate,74);
});
test('partner selection deduplicates IDs, empty selection stays unavailable, and unknown keys fail',()=>{const d=performanceSeed();assert.deepEqual(calculateMetric(d,'risk-sla','2026-09',['moss','moss']),calculateMetric(d,'risk-sla','2026-09',['moss']));assert.equal(calculateMetric(d,'risk-sla','2026-09',[]).rate,null);assert.throws(()=>calculateMetric(d,'risk-sla','2026-09',['unknown']));assert.throws(()=>calculateMetric(d,'risk-sla','2026-10'))});
test('zero denominator and missing partners produce null, never a fabricated zero or partial aggregate rate',()=>{
 const d=performanceSeed();const row=d.observations.find(o=>o.partnerId==='moss'&&o.metricId==='risk-sla'&&o.periodId==='2026-09')!;row.numerator=0;row.denominator=0;
 assert.equal(calculateMetric(d,'risk-sla','2026-09',['moss']).rate,null);
 d.observations=d.observations.filter(o=>o!==row);const r=calculateMetric(d,'risk-sla','2026-09');assert.equal(r.rate,null);assert.equal(r.complete,false);assert.equal(r.availablePartners,4);assert.equal(r.expectedPartners,5);
});
test('month-over-month compares the same partner cohort in percentage points; April has no baseline',()=>{
 const d=performanceSeed();const r=monthOverMonth(d,'dispute-deadline','2026-09',['nuvia']);assert.equal(r.changePercentagePoints,r.current.rate!-r.previous!.rate!);assert.ok(r.changePercentagePoints!<0);assert.equal(monthOverMonth(d,'dispute-deadline','2026-04').changePercentagePoints,null);
 d.observations=d.observations.filter(o=>!(o.periodId==='2026-08'&&o.partnerId==='nuvia'&&o.metricId==='dispute-deadline'));assert.equal(monthOverMonth(d,'dispute-deadline','2026-09',['nuvia']).changePercentagePoints,null);
});
test('validation rejects negative, fractional, impossible, unsafe and unlabelled counts',()=>{
 for(const patch of [{numerator:-1},{numerator:1.5},{numerator:999999999},{denominator:NaN},{denominator:Infinity},{excludedCount:-1},{synthetic:false},{numerator:Number.MAX_SAFE_INTEGER+1}]){const d=performanceSeed();Object.assign(d.observations[0],patch);assert.throws(()=>validatePerformance(d))}
});
test('duplicate IDs, duplicate grains, missing coverage, invalid partner and product references fail',()=>{
 for(const patch of [(d:ReturnType<typeof performanceSeed>)=>{d.observations[1].id=d.observations[0].id},(d:ReturnType<typeof performanceSeed>)=>{d.observations[1]={...d.observations[0],id:'different-id'}},(d:ReturnType<typeof performanceSeed>)=>{d.observations.pop()},(d:ReturnType<typeof performanceSeed>)=>{d.observations[0].partnerId='unknown'},(d:ReturnType<typeof performanceSeed>)=>{d.observations[0].productId='risk'}]){const d=performanceSeed();patch(d);assert.throws(()=>validatePerformance(d))}
});
test('historical feedback has valid partner/product/month context and original synthetic wording',()=>{
 const d=performanceSeed();for(const f of d.feedback){const o=d.observations.find(o=>o.id===f.observationId)!;assert.equal(o.partnerId,f.partnerId);assert.equal(o.productId,f.productId);assert.equal(o.periodId,f.periodId);assert.ok(f.text.length>30)}
 for(const patch of [{observationId:'unknown'},{partnerId:'unknown'},{date:'2026-04-31'},{date:'2026-05-01'},{synthetic:false}]){const x=performanceSeed();Object.assign(x.feedback[0],patch);assert.throws(()=>validatePerformance(x))}
});
test('invalid periods, definition changes and incomplete feedback coverage fail validation',()=>{
 const a=performanceSeed();a.periods[0].endExclusive='2026-05-02T00:00:00Z';assert.throws(()=>validatePerformance(a));
 const b=performanceSeed();b.definitions[0].denominator='Unreviewed replacement';assert.throws(()=>validatePerformance(b));
 const c=performanceSeed();c.feedback.pop();assert.throws(()=>validatePerformance(c));
});
test('calculations reject duplicate partner rows and impossible selected input',()=>{
 const d=performanceSeed();d.observations.push({...d.observations[0],id:'duplicate'});assert.throws(()=>calculateMetric(d,'payment-success','2026-04'));
 const e=performanceSeed();e.observations[0].numerator=e.observations[0].denominator+1;assert.throws(()=>calculateMetric(e,'payment-success','2026-04'));
});
test('legacy upgrade preserves decisions, reviews, actions, sources, timestamps and revision without mutating input',()=>{
 const {schemaVersion,performance,...record}=seed();void schemaVersion;void performance;const legacy:LegacyWorkspace=record;
 legacy.version=17;legacy.opportunities[0].actions[0].done=true;legacy.findings[18].status='accepted';legacy.opportunities[0].decisions.push({id:'saved-decision',status:'Deferred',rationale:'Preserve this operator decision.',owner:'Avery Chen',reviewDate:'2026-10-26',at:'2026-10-21T12:00:00Z'});
 const before=structuredClone(legacy);const w=upgradeWorkspace(legacy);assert.deepEqual(legacy,before);assert.equal(w.schemaVersion,2);assert.equal(w.version,17);assert.equal(w.createdAt,legacy.createdAt);assert.deepEqual(w.sources,legacy.sources);assert.deepEqual(w.findings,legacy.findings);assert.deepEqual(w.opportunities,legacy.opportunities);validatePerformance(w.performance);
});
test('upgrade is idempotent across persistence round-trips; future versions are refused',()=>{
 const w=seed();assert.equal(upgradeWorkspace(w),w);assert.deepEqual(upgradeWorkspace(JSON.parse(JSON.stringify(w))),w);assert.throws(()=>upgradeWorkspace({...w,schemaVersion:99} as unknown as typeof w));
});
test('new fixtures do not alter existing review analytics or get changed by operator actions',()=>{
 const w=seed();const before=structuredClone(w.performance);assert.equal(w.sources.length,21);assert.equal(w.findings.filter(f=>f.status==='accepted').length,18);mutate(w,{type:'toggleAction',opportunityId:'o1',actionId:'a1',done:true});assert.deepEqual(w.performance,before);assert.equal(w.version,2);
});

test('validation accepts JSONB-style object key reordering without changing fixture meaning',()=>{
 const reorder=(value:unknown):unknown=>Array.isArray(value)?value.map(reorder):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).reverse().map(([key,v])=>[key,reorder(v)])):value;
 const reordered=reorder(seed()) as ReturnType<typeof seed>;assert.doesNotThrow(()=>upgradeWorkspace(reordered));assert.deepEqual(calculateMetric(reordered.performance,'payment-success','2026-09'),calculateMetric(seed().performance,'payment-success','2026-09'));
});

test('requested September rates and signed percentage-point changes reconcile exactly from raw counts',()=>{
 const d=performanceSeed();for(const [id,rate,change] of [['payment-success',99.7,1.5],['payment-reversal',.16,-1.35],['card-timeout',1.5,-7.31],['inbound-flagged',1.43,-10.49]] as const){const c=monthOverMonth(d,id,'2026-09');assert.ok(Math.abs(c.current.rate!-rate)<1e-10);assert.ok(Math.abs(c.changePercentagePoints!-change)<1e-10);assert.equal(c.current.numerator/c.current.denominator*100,c.current.rate)}
});
test('fixture v1 upgrade replaces synthetic performance only and preserves operator data',()=>{const w=seed();const old={...w,performance:{...w.performance,fixtureVersion:1}} as unknown as typeof w;const upgraded=upgradeWorkspace(old);assert.equal(upgraded.performance.fixtureVersion,4);assert.deepEqual(upgraded.sources,w.sources);assert.deepEqual(upgraded.findings,w.findings);assert.deepEqual(upgraded.opportunities,w.opportunities);assert.equal(upgraded.version,w.version);assert.equal((old.performance.fixtureVersion as number),1)});

test('successful disputes preserve rates and show the difference in percentage points',()=>{const c=monthOverMonth(performanceSeed(),'dispute-success','2026-09');assert.ok(Math.abs(c.current.rate!-43.52)<1e-10);assert.equal(c.changePercentagePoints!.toFixed(2),'1.87');assert.ok(Math.abs(c.previous!.rate!-41.6545577836)<1e-8)});

test('revised content has five evidence-backed issues with requested severities and matching opportunities',()=>{const w=seed();assert.equal(w.issues.length,5);assert.equal(w.opportunities.length,5);for(const [id,severity] of [['i1','High'],['i2','Medium'],['i3','High'],['i4','Medium'],['i5','High']]){const fs=w.findings.filter(f=>f.issueId===id);assert.ok(fs.length>0);assert.ok(fs.every(f=>f.severity===severity));assert.ok(w.opportunities.some(o=>o.issueIds.includes(id)));for(const f of fs){const source=w.sources.find(s=>s.id===f.sourceId)!;assert.equal(source.text.slice(f.start,f.end),f.quote);assert.equal(f.title,w.issues.find(i=>i.id===id)!.title)}}});
test('untouched old demo content upgrades while modified workspaces keep their original evidence and decisions',()=>{const current=seed();const old={...current,demoContentVersion:undefined,performance:{...current.performance,fixtureVersion:3}} as unknown as typeof current;const upgraded=upgradeWorkspace(old);assert.equal(upgraded.demoContentVersion,2);assert.equal(upgraded.createdAt,old.createdAt);const changed={...old,version:9};const preserved=upgradeWorkspace(changed);assert.deepEqual(preserved.sources,changed.sources);assert.deepEqual(preserved.opportunities,changed.opportunities);assert.equal(preserved.version,9)});
