import {createHash,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {AREAS,PARTNERS,Workspace,OWNERS} from './types';
export const id=()=>randomUUID();
export const hash=(partner:string,text:string)=>createHash('sha256').update(partner+'\n'+text.trim().replace(/\s+/g,' ').toLowerCase()).digest('hex');
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v);return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===v},'Use a valid date');
export const sourceInput=z.object({partnerId:z.enum(PARTNERS.map(p=>p.id) as [string,...string[]]),text:z.string().trim().min(10).max(5000),channel:z.enum(['Email','Slack','Meeting']),date});
export const extractionSchema=z.object({findings:z.array(z.object({title:z.string().min(3).max(180),area:z.enum(AREAS),quote:z.string().min(1).max(5000),severity:z.enum(['High','Medium','Low']),rationale:z.string().min(5).max(600),uncertainty:z.string().max(600),issueId:z.string().nullable()})).max(8)});
export function verifyExtraction(raw:unknown,text:string,w:Workspace){
 const result=extractionSchema.parse(raw);
 const seen=new Set<string>();
 return result.findings.map(f=>{
  const start=text.indexOf(f.quote);
  if(start<0)throw new Error('The model returned a quotation that does not appear in the source. Retry analysis.');
  const key=f.area+'|'+f.quote;if(seen.has(key))throw new Error('The model returned duplicate findings. Retry analysis.');seen.add(key);
  if(f.issueId&&!w.issues.some(i=>i.id===f.issueId&&i.area===f.area))throw new Error('The model returned an invalid issue match. Retry analysis.');
  return {...f,start,end:start+f.quote.length};
 });
}
const review=z.object({type:z.literal('review'),findingId:z.string(),status:z.enum(['accepted','dismissed']),title:z.string().trim().min(3).max(180),area:z.enum(AREAS),severity:z.enum(['High','Medium','Low']),rationale:z.string().trim().min(5).max(600),issueId:z.string().min(1)});
const decision=z.object({type:z.literal('decision'),opportunityId:z.string(),status:z.enum(['Under review','Planned','Deferred','Declined','Delivered']),rationale:z.string().trim().min(10).max(2000),owner:z.enum(OWNERS as [string,...string[]]),reviewDate:date,priority:z.enum(['High','Medium','Low']),priorityRationale:z.string().trim().min(10).max(1000)});
export const mutationSchema=z.discriminatedUnion('type',[
 z.object({type:z.literal('import'),rows:z.array(sourceInput).min(1).max(25),synthetic:z.literal(true)}),review,decision,
 z.object({type:z.literal('action'),opportunityId:z.string(),title:z.string().trim().min(3).max(200),owner:z.enum(OWNERS as [string,...string[]]),due:date}),
 z.object({type:z.literal('toggleAction'),opportunityId:z.string(),actionId:z.string(),done:z.boolean()}),
 z.object({type:z.literal('update'),opportunityId:z.string(),partnerId:z.enum(PARTNERS.map(p=>p.id) as [string,...string[]]),text:z.string().trim().min(10).max(2000)}),
 z.object({type:z.literal('communicated'),opportunityId:z.string(),updateId:z.string()}),
 z.object({type:z.literal('opportunity'),issueId:z.string(),title:z.string().trim().min(5).max(180),outcome:z.string().trim().min(10).max(800)}),
 z.object({type:z.literal('reset')})
]);
export type Mutation=z.infer<typeof mutationSchema>;
export function mutate(w:Workspace,m:Mutation):{workspace:Workspace;message:string}{
 let message='Saved';
 if(m.type==='import'){
  if(w.sources.length+m.rows.length>150)throw new Error('This demo supports 150 sources. Reset your demo to start again.');
  let added=0;
  for(const row of m.rows){const h=hash(row.partnerId,row.text);if(w.sources.some(s=>(s.hash||hash(s.partnerId,s.text))===h))continue;
   w.sources.push({...row,id:id(),hash:h,synthetic:true,analysis:'pending',provenance:'Awaiting live AI analysis'});added++;
  }message=`${added} sources imported; ${m.rows.length-added} duplicates skipped.`;
 }else if(m.type==='review'){
  const finding=w.findings.find(f=>f.id===m.findingId);if(!finding)throw new Error('Finding not found in this workspace.');
  let issueId=m.issueId;
  if(m.status==='accepted'){
   if(issueId==='new'){issueId=id();w.issues.push({id:issueId,title:m.title,area:m.area})}
   if(!w.issues.some(i=>i.id===issueId&&i.area===m.area))throw new Error('Choose an issue in the selected product area.');
  }
  Object.assign(finding,{status:m.status,title:m.title,area:m.area,severity:m.severity,rationale:m.rationale,issueId});
  message=m.status==='accepted'?'Finding accepted. Reviewed analytics updated.':'Finding dismissed.';
 }else if(m.type==='opportunity'){
  const issue=w.issues.find(i=>i.id===m.issueId);if(!issue)throw new Error('Issue not found.');
  w.opportunities.push({id:id(),title:m.title,outcome:m.outcome,issueIds:[issue.id],priority:'Medium',priorityRationale:'Pending human prioritisation.',status:'Under review',owner:'',reviewDate:'',decisions:[],actions:[],updates:[]});message='Opportunity created.';
 }else if(m.type!=='reset'){
  const o=w.opportunities.find(o=>o.id===m.opportunityId);if(!o)throw new Error('Opportunity not found in this workspace.');
  if(m.type==='decision'){
   if(m.status==='Delivered'&&o.actions.some(a=>!a.done))throw new Error('Complete outstanding actions before marking this opportunity delivered.');
   o.decisions.push({id:id(),status:m.status,rationale:m.rationale,owner:m.owner,reviewDate:m.reviewDate,at:new Date().toISOString()});
   Object.assign(o,{status:m.status,owner:m.owner,reviewDate:m.reviewDate,priority:m.priority,priorityRationale:m.priorityRationale});message='Decision recorded in the history.';
  }else if(m.type==='action'){o.actions.push({id:id(),title:m.title,owner:m.owner,due:m.due,done:false});message='Action assigned.'}
  else if(m.type==='toggleAction'){const a=o.actions.find(a=>a.id===m.actionId);if(!a)throw new Error('Action not found.');if(o.status==='Delivered'&&!m.done)throw new Error('Record a new decision before reopening delivered work.');a.done=m.done;message=m.done?'Action completed.':'Action reopened.'}
  else if(m.type==='update'){o.updates.push({id:id(),partnerId:m.partnerId,text:m.text,communicatedAt:null});message='Partner update saved as a draft. Nothing has been sent.'}
  else if(m.type==='communicated'){const u=o.updates.find(u=>u.id===m.updateId);if(!u)throw new Error('Update not found.');u.communicatedAt=new Date().toISOString();message='Communication manually recorded. Relay did not send a message.'}
 }
 w.version++;return {workspace:w,message};
}
