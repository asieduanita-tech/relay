import {test} from 'node:test';
import assert from 'node:assert/strict';
import {performanceSeed} from '../src/lib/performance-seed';
import {performanceSelection} from '../src/lib/performance-view';
import {calculateMetric} from '../src/lib/metrics';
test('performance view defaults to latest complete month and retains all nine separate definitions',()=>{const d=performanceSeed(),v=performanceSelection(d,{});assert.equal(v.period,'2026-09');assert.equal(v.partnerIds.length,5);assert.equal(v.definitions.length,9);assert.deepEqual(v.errors,[])});
test('product and partner selections use the matching definition and exact denominator',()=>{const d=performanceSeed();const v=performanceSelection(d,{partner:'moss',area:'Cards, including disputes',period:'2026-08',metric:'payment-success'});assert.equal(v.metric!.id,'dispute-deadline');assert.equal(v.definitions.length,3);const result=calculateMetric(d,v.metric!.id,v.period,v.partnerIds);const raw=d.observations.find(o=>o.partnerId==='moss'&&o.productId==='cards'&&o.periodId==='2026-08')!;assert.equal(result.denominator,raw.denominator)});
test('a partner detail path scopes calculations even when query names a different partner',()=>{const d=performanceSeed(),v=performanceSelection(d,{partner:'nuvia',area:'End-user KYC'},'moss');assert.deepEqual(v.partnerIds,['moss']);assert.equal(v.metric!.id,'kyc-first-approval')});
test('unknown URL dimensions are rejected before dashboard calculation',()=>{const v=performanceSelection(performanceSeed(),{partner:'unknown',area:'unknown',period:'2026-10',metric:'unknown'});assert.equal(v.errors.length,4);assert.equal(v.definitions.length,0)});
