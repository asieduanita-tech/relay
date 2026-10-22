import {performanceSeed} from '../src/lib/performance-seed';
import {calculateMetric,monthOverMonth} from '../src/lib/metrics';
const data=performanceSeed();
const samples=data.definitions.map(d=>{
 const feedback=data.feedback.find(f=>data.observations.find(o=>o.id===f.observationId)?.metricId===d.id&&f.periodId==='2026-09')!;
 return {definition:d,observation:data.observations.find(o=>o.id===feedback.observationId),feedback};
});
console.log(JSON.stringify({label:'SYNTHETIC DEMO DATA — no real-company performance',schemaVersion:2,fixtureVersion:data.fixtureVersion,asOf:data.asOf,counts:{products:data.products.length,partners:5,periods:data.periods.length,observations:data.observations.length,historicalFeedback:data.feedback.length},periods:data.periods,samples,monthlyMetrics:data.definitions.map(d=>({metricId:d.id,months:data.periods.map(p=>({period:p.id,...calculateMetric(data,d.id,p.id)})),septemberChangePercentagePoints:monthOverMonth(data,d.id,'2026-09').changePercentagePoints}))},null,2));
