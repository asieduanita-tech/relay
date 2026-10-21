import {AREAS, Workspace, Source, Finding, Opportunity} from './types';
export function seed():Workspace {
 const issues = [
  {id:'i1',title:'Payment status leaves partners in the dark',area:AREAS[0]},
  {id:'i2',title:'Dispute evidence is difficult to track',area:AREAS[2]},
  {id:'i3',title:'KYC rejections lack actionable reasons',area:AREAS[3]},
  {id:'i4',title:'Account exports delay reconciliation',area:AREAS[1]},
  {id:'i5',title:'Risk reviews have no visible owner',area:AREAS[4]},
  {id:'i6',title:'FX quotes expire before approval',area:AREAS[0]}
 ];
 const entries:[string,string,string,string,number,'High'|'Medium'|'Low'][] = [
 ['moss','2026-10-20','Email','We cannot tell whether a cross-border payment is held or still processing. Our support team has to ask for an update manually every time.',0,'High'],
 ['meridian','2026-10-19','Meeting','Cross-border payment statuses stay on processing even when a compliance check is needed. We need a clear reason and expected next step.',0,'High'],
 ['cape','2026-10-18','Slack','Payment tracking gives us no indication of where the transfer is stuck. Can we expose the last completed step to our operations team?',0,'High'],
 ['nuvia','2026-10-16','Email','We need more detail when a payment is pending. Customers keep asking for an update and we have nothing useful to share.',0,'Medium'],
 ['union','2026-10-14','Meeting','The payment status does not explain delays. A visible hold reason would save our operations team a manual escalation.',0,'High'],
 ['moss','2026-10-19','Slack','Dispute evidence uploads have no confirmation receipt. We cannot confidently tell if a submission reached the review team.',1,'High'],
 ['nuvia','2026-10-17','Email','Our disputes team cannot see which evidence has been received or what is still missing. We maintain a separate spreadsheet.',1,'High'],
 ['cape','2026-10-12','Meeting','We need a single view of submitted dispute documents and upcoming evidence deadlines. Today we track this outside the portal.',1,'Medium'],
 ['union','2026-10-09','Email','There is no clear status after uploading dispute evidence. We are following up manually to avoid missing deadlines.',1,'Medium'],
 ['cape','2026-10-20','Email','KYC rejection messages only say verification failed. Applicants do not know which document to correct and submit the same thing again.',2,'High'],
 ['nuvia','2026-10-15','Slack','We need actionable KYC rejection reasons. The current generic error causes repeated attempts without fixing the underlying issue.',2,'High'],
 ['moss','2026-10-07','Meeting','When end-user KYC fails, our support agents need to know which document needs correction. A generic failure message is not enough.',2,'Medium'],
 ['meridian','2026-10-18','Email','Multi-currency account statement exports are missing the settlement reference. Matching transactions requires a separate lookup.',3,'Medium'],
 ['union','2026-10-11','Meeting','The multi-currency account CSV does not include a settlement reference. Our reconciliation process requires manual matching.',3,'Medium'],
 ['cape','2026-10-05','Slack','Multi-currency statement exports lack settlement references, so we cannot match rows to our internal ledger reliably.',3,'Medium'],
 ['meridian','2026-10-16','Meeting','When a transaction enters risk review, we cannot see an owner or the next review date. Our team does not know who to contact.',4,'High'],
 ['union','2026-10-08','Email','Risk review cases have no named point of contact. We need an owner and a next update date to manage escalations.',4,'Medium'],
 ['meridian','2026-10-06','Email','The FX quote expires before our internal approval is complete. We need to understand the validity period before starting the approval.',5,'Low'],
 ['moss','2026-10-21','Slack','Cross-border payment tracking needs to show the last completed step. We still ask operations for status updates by email.',0,'Medium'],
 ['nuvia','2026-10-21','Email','We cannot tell which dispute evidence documents have arrived. A receipt and missing-document checklist would help.',1,'Medium'],
 ['union','2026-10-21','Meeting','For KYC rejections, please identify which document failed and what the applicant should change.',2,'Medium'],
 ];
 const sources:Source[]=entries.map((e,n)=>({id:`s${n+1}`,partnerId:e[0],date:e[1],channel:e[2] as Source['channel'],text:e[3],hash:'',synthetic:true,analysis:'succeeded',provenance:'Precomputed synthetic analysis · fixture v1'}));
 const findings:Finding[]=entries.map((e,n)=>({id:`f${n+1}`,sourceId:`s${n+1}`,title:issues[e[4]].title,area:issues[e[4]].area,quote:e[3],start:0,end:e[3].length,severity:e[5],rationale:e[5]==='High'?'Synthetic source describes a repeated operational blocker.':'Synthetic source describes manual work or unclear information.',uncertainty:n>=18?'Confirm whether this belongs to the existing issue.':'Reviewed synthetic fixture; no real-world validation.',issueId:issues[e[4]].id,status:n>=18?'suggested':'accepted'}));
 const names=['Make payment status explain the next step','Give partners a dispute evidence trail','Turn KYC failures into clear next steps','Include settlement references in exports','Make risk review ownership visible','Clarify FX quote validity'];
 const outcomes=['Partners can see hold reasons and the next step without requesting a manual update.','Partners can confirm receipt, identify missing evidence, and track dispute deadlines.','Applicants can correct the right document on their next attempt.','Operations teams can reconcile account exports without separate reference lookups.','Partners know who owns each review and when to expect an update.','Partners can plan approval around an explicit quote validity period.'];
 const opportunities:Opportunity[]=issues.map((i,n)=>({id:`o${n+1}`,title:names[n],outcome:outcomes[n],issueIds:[i.id],priority:n<3?'High':n<5?'Medium':'Low',priorityRationale:'Illustrative human priority based on synthetic operational impact; no commercial value has been estimated.',status:n===1?'Planned':n===3?'Deferred':'Under review',owner:['Avery Chen','Jordan Ellis','Priya Shah','Sam Okafor','Sam Okafor',''][n],reviewDate:n===1?'2026-10-20':'2026-10-26',decisions:n===1?[{id:'d1',status:'Planned',rationale:'Validate an evidence receipt and checklist with the four affected fictional partners before scoping delivery.',owner:'Jordan Ellis',reviewDate:'2026-10-20',at:'2026-10-19T10:30:00Z'}]:n===3?[{id:'d2',status:'Deferred',rationale:'Confirm export requirements with the three fictional partners before allocating implementation capacity.',owner:'Sam Okafor',reviewDate:'2026-10-26',at:'2026-10-18T11:00:00Z'}]:[],actions:n===0?[{id:'a1',title:'Review the proposed status vocabulary with partner operations',owner:'Avery Chen',due:'2026-10-23',done:false}]:n===1?[{id:'a2',title:'Map evidence receipt and missing-document states',owner:'Jordan Ellis',due:'2026-10-20',done:false}]:[],updates:[]}));
 return {version:1,createdAt:new Date().toISOString(),sources,findings,issues,opportunities};
}
