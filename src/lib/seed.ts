import {performanceSeed} from './performance-seed';
import {AREAS, Workspace, Source, Finding, Opportunity} from './types';
export function seed():Workspace {
 const issues = [
  {id:'i1',title:'Customers sending payments to closed beneficiary accounts',area:AREAS[0]},
  {id:'i2',title:'Dispute evidence is often weak as submission guidelines are broad',area:AREAS[2]},
  {id:'i3',title:'Customers sending payments to wrong beneficiary accounts (account details mismatch)',area:AREAS[0]},
  {id:'i4',title:'Customers receiving F&F inbound payments to business multicurrency accounts',area:AREAS[1]},
  {id:'i5',title:'Customers not receiving OTPs in time for card payments',area:AREAS[2]},
 ];
 const closed=[
 'Customers are sending payments to closed beneficiary accounts. Please remind them to confirm the account is open before submitting a payment.',
 'Payments to closed beneficiary accounts are being reversed. Our team needs a clear account-open reminder and a visible return reason.',
 'We see customers attempting transfers to beneficiary accounts that have closed. Please make the confirmation prompt clearer.',
 'Customers need to confirm beneficiary accounts are open. Transfers to closed accounts create avoidable reversals and support follow-up.',
 'Payments sent to closed beneficiary accounts require manual follow-up. Show the reversal reason and ask customers to confirm account status.',
 ];
 const dispute=[
 'Dispute evidence is often weak because submission guidelines are broad. Please specify the documents and transaction details needed for each dispute type.',
 'Customers submit incomplete dispute narratives under the broad guidelines. Stronger examples and a case-specific evidence checklist would help.',
 'Our escalation guide is improving, but dispute submission guidelines remain broad. Customers still need specific examples of strong evidence.',
 'Weak evidence is reducing the quality of dispute submissions. Please explain what supporting documents are required for each reason code.',
 ];
 const mismatch=[
 'Customers send payments to the wrong beneficiary accounts when the account details do not match. We need a clearer review step before confirmation.',
 'Account details mismatch is causing failed payments. Please highlight beneficiary details and require customers to check them before sending.',
 'We are investigating payments sent to incorrect beneficiary accounts. Clearer detail validation and correction instructions would help customers.',
 ];
 const inbound=[
 'Business multicurrency accounts are receiving suspected friends-and-family inbound payments. These receipts appear inconsistent with the purpose declared at account opening.',
 'We need to review suspected F&F inbound payments to business multicurrency accounts. Ask customers to explain the payment purpose before concluding misuse.',
 'More business account receipts appear to be friends-and-family payments. Please show the declared account purpose and give reviewers a consistent follow-up process.',
 ];
 const otp=[
 'Customers are not receiving OTPs in time for card payments. Codes arrive after the authentication window, leaving payment attempts timed out.',
 'Delayed OTP delivery is interrupting card payments. Please show code expiry, safe resend guidance and the next step when the code arrives too late.',
 ];
 const entries:[string,string,string,string,number,'High'|'Medium'|'Low'][] = [
 ...closed.map((text,n)=>[['moss','meridian','cape','nuvia','union'][n],['2026-10-20','2026-10-19','2026-10-18','2026-10-16','2026-10-14'][n],['Email','Meeting','Slack','Email','Meeting'][n],text,0,'High'] as [string,string,string,string,number,'High']),
 ...dispute.map((text,n)=>[['moss','nuvia','cape','union'][n],['2026-10-19','2026-10-17','2026-10-12','2026-10-09'][n],'Email',text,1,'Medium'] as [string,string,string,string,number,'Medium']),
 ...mismatch.map((text,n)=>[['cape','nuvia','moss'][n],['2026-10-20','2026-10-15','2026-10-07'][n],'Email',text,2,'High'] as [string,string,string,string,number,'High']),
 ...inbound.map((text,n)=>[['meridian','union','cape'][n],['2026-10-18','2026-10-11','2026-10-05'][n],'Meeting',text,3,'Medium'] as [string,string,string,string,number,'Medium']),
 ...otp.map((text,n)=>[['meridian','union'][n],['2026-10-16','2026-10-08'][n],'Email',text,4,'High'] as [string,string,string,string,number,'High']),
 ['meridian','2026-10-06','Email','A beneficiary account details mismatch caused a failed payment. Add a final review of account details before customers confirm the transfer.',2,'High'],
 ['moss','2026-10-21','Slack',closed[0],0,'High'],
 ['nuvia','2026-10-21','Email',dispute[0],1,'Medium'],
 ['union','2026-10-21','Meeting',otp[0],4,'High'],
 ];
 const sources:Source[]=entries.map((e,n)=>({id:`s${n+1}`,partnerId:e[0],date:e[1],channel:e[2] as Source['channel'],text:e[3],hash:'',synthetic:true,analysis:'succeeded',provenance:'Precomputed synthetic analysis · fixture v1'}));
 const findings:Finding[]=entries.map((e,n)=>({id:`f${n+1}`,sourceId:`s${n+1}`,title:issues[e[4]].title,area:issues[e[4]].area,quote:e[3],start:0,end:e[3].length,severity:e[5],rationale:e[5]==='High'?'Synthetic source describes a repeated operational blocker.':'Synthetic source describes manual work or unclear information.',uncertainty:n>=18?'Confirm whether this belongs to the existing issue.':'Reviewed synthetic fixture; no real-world validation.',issueId:issues[e[4]].id,status:n>=18?'suggested':'accepted'}));
 const names=['Help customers confirm beneficiary accounts are open','Make dispute evidence guidance specific','Help customers check beneficiary account details','Review business account receipts against declared purpose','Improve OTP delivery and recovery for card payments'];
 const outcomes=['Customers confirm the beneficiary account is open and understand reversal reasons.','Customers submit stronger evidence using reason-specific checklists and examples.','Customers verify account details before sending and receive actionable mismatch guidance.','Reviewers investigate suspected F&F receipts against declared purpose without treating flags as confirmed misuse.','Customers receive OTPs within the authentication window and can safely recover from expiry.'];
 const opportunities:Opportunity[]=issues.map((i,n)=>({id:`o${n+1}`,title:names[n],outcome:outcomes[n],issueIds:[i.id],priority:[0,2,4].includes(n)?'High':'Medium',priorityRationale:'Illustrative human priority based on synthetic operational impact; no commercial value has been estimated.',status:n===1?'Planned':n===3?'Deferred':'Under review',owner:['Avery Chen','Jordan Ellis','Priya Shah','Sam Okafor','Sam Okafor',''][n],reviewDate:n===1?'2026-10-20':'2026-10-26',decisions:n===1?[{id:'d1',status:'Planned',rationale:'Validate reason-specific evidence guidelines with the four affected fictional partners before scoping delivery.',owner:'Jordan Ellis',reviewDate:'2026-10-20',at:'2026-10-19T10:30:00Z'}]:n===3?[{id:'d2',status:'Deferred',rationale:'Confirm declared-purpose review requirements with the three fictional partners before allocating implementation capacity.',owner:'Sam Okafor',reviewDate:'2026-10-26',at:'2026-10-18T11:00:00Z'}]:[],actions:n===0?[{id:'a1',title:'Review beneficiary account-open reminders with partner operations',owner:'Avery Chen',due:'2026-10-23',done:false}]:n===1?[{id:'a2',title:'Draft reason-specific evidence checklists and examples',owner:'Jordan Ellis',due:'2026-10-20',done:false}]:[],updates:[]}));
 return {demoContentVersion:2,schemaVersion:2,performance:performanceSeed(),version:1,createdAt:new Date().toISOString(),sources,findings,issues,opportunities};
}
