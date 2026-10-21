import {Workspace,Filters} from './types';
export function filteredFindings(w:Workspace,f:Partial<Filters>={},reviewed=true){
 return w.findings.filter(x=>{
  const s=w.sources.find(s=>s.id===x.sourceId);if(!s)return false;
  return (!reviewed||x.status==='accepted')&&(!f.partner||s.partnerId===f.partner)&&(!f.area||x.area===f.area)&&(!f.from||s.date>=f.from)&&(!f.to||s.date<=f.to)&&(!f.search||`${x.title} ${s.text}`.toLowerCase().includes(f.search.toLowerCase()));
 });
}
export function issueStats(w:Workspace,f:Partial<Filters>={}){
 const all=filteredFindings(w,f);
 return w.issues.map(i=>{
  const findings=all.filter(x=>x.issueId===i.id);const sourceIds=[...new Set(findings.map(x=>x.sourceId))];
  const partnerIds=[...new Set(sourceIds.map(id=>w.sources.find(s=>s.id===id)!.partnerId))];
  return {...i,findings,sourceIds,partnerIds,high:findings.some(f=>f.severity==='High')};
 }).filter(i=>i.findings.length>0).sort((a,b)=>b.partnerIds.length-a.partnerIds.length||b.sourceIds.length-a.sourceIds.length||a.title.localeCompare(b.title));
}
