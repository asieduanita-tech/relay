import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seed} from '../src/lib/seed';
import {evidenceFor,evidenceQuery} from '../src/lib/evidence';
import {mutate} from '../src/lib/domain';
test('metric associations resolve exact accepted evidence and opportunities without changing source counts',()=>{
 const w=seed(),before=structuredClone(w);const payments=evidenceFor(w,{metric:'payment-success'});assert.deepEqual(payments.issueIds,['i1','i3']);assert.equal(payments.sources.length,9);assert.deepEqual(payments.opportunities.map(o=>o.id),['o1','o3']);assert.equal(evidenceFor(w,{metric:'dispute-success'}).sources.length,4);assert.deepEqual(w,before);
});
test('partner scope, dismissal, quote integrity and legacy workspaces prevent misleading evidence links',()=>{
 const w=seed();assert.equal(evidenceFor(w,{metric:'payment-success',partner:'moss'}).sources.length,2);assert.equal(evidenceFor(w,{metric:'dispute-success',partner:'meridian'}).sources.length,0);w.findings[0].status='dismissed';assert.equal(evidenceFor(w,{metric:'payment-success',partner:'moss'}).sources.length,1);w.findings[11].quote='Invented quotation';assert.equal(evidenceFor(w,{metric:'payment-success',partner:'moss'}).sources.length,0);assert.equal(evidenceFor(w,{metric:'unknown'}).sources.length,0);assert.equal(evidenceFor(w,{metric:'payment-success',issue:'i2'}).sources.length,0);delete w.demoContentVersion;assert.equal(evidenceFor(w,{metric:'payment-success'}).sources.length,0);
});
test('decision and action updates preserve metric evidence, persist history and require completed follow-through',()=>{
 const w=seed(),performance=structuredClone(w.performance);mutate(w,{type:'decision',opportunityId:'o2',status:'Planned',owner:'Jordan Ellis',reviewDate:'2026-10-26',rationale:'Test reason-specific evidence guidance with four fictional partners.',priority:'Medium',priorityRationale:'Weak evidence remains a medium severity issue despite improving outcomes.'});mutate(w,{type:'action',opportunityId:'o2',title:'Review evidence examples with partner operations',owner:'Sam Okafor',due:'2026-10-26'});assert.equal(w.opportunities[1].decisions.length,2);assert.equal(w.opportunities[1].actions.at(-1)!.owner,'Sam Okafor');assert.deepEqual(w.performance,performance);assert.equal(evidenceFor(w,{metric:'dispute-success'}).sources.length,4);assert.equal(evidenceQuery({partner:'moss',period:'2026-09',metric:'payment-success'}),'partner=moss&period=2026-09&metric=payment-success');
});
