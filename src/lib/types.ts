export const AREAS = ['Cross-border payments','Multi-currency accounts','Cards, including disputes','End-user KYC','Risk & Compliance'] as const;
export type Area = typeof AREAS[number];
export type Partner = {id:string;name:string;initials:string;inspiredBy:string;region:string;color:string};
export type Source = {id:string;partnerId:string;text:string;channel:'Email'|'Slack'|'Meeting';date:string;hash:string;synthetic:true;analysis:'pending'|'running'|'succeeded'|'failed';analysisError?:string;provenance:string};
export type Finding = {id:string;sourceId:string;title:string;area:Area;quote:string;start:number;end:number;severity:'High'|'Medium'|'Low';rationale:string;uncertainty:string;issueId:string;status:'suggested'|'accepted'|'dismissed'};
export type Issue = {id:string;title:string;area:Area};
export type DecisionStatus = 'Under review'|'Planned'|'Deferred'|'Declined'|'Delivered';
export type Decision = {id:string;status:DecisionStatus;rationale:string;owner:string;reviewDate:string;at:string};
export type Action = {id:string;title:string;owner:string;due:string;done:boolean};
export type PartnerUpdate = {id:string;partnerId:string;text:string;communicatedAt:string|null};
export type Opportunity = {id:string;title:string;outcome:string;issueIds:string[];priority:'High'|'Medium'|'Low';priorityRationale:string;status:DecisionStatus;owner:string;reviewDate:string;decisions:Decision[];actions:Action[];updates:PartnerUpdate[]};
export type Workspace = {version:number;createdAt:string;sources:Source[];findings:Finding[];issues:Issue[];opportunities:Opportunity[]};
export type Filters = {partner:string;area:string;from:string;to:string;search:string};
export type Capabilities = {storage:'local'|'postgres';ai:boolean;model:string;expiresAt:string};
export const OWNERS = ['Avery Chen','Jordan Ellis','Sam Okafor','Priya Shah'];
export const PARTNERS:Partner[] = [
{id:'moss',name:'Moss Bank',initials:'MB',inspiredBy:'Monzo',region:'United Kingdom',color:'coral'},
{id:'meridian',name:'Meridian Institutional',initials:'MI',inspiredBy:'Morgan Stanley',region:'United States',color:'blue'},
{id:'cape',name:'CapeBridge Bank',initials:'CB',inspiredBy:'Capitec',region:'South Africa',color:'gold'},
{id:'nuvia',name:'Nuvia Bank',initials:'NB',inspiredBy:'Nubank',region:'Brazil',color:'violet'},
{id:'union',name:'Union Continental',initials:'UC',inspiredBy:'UniCredit',region:'Italy',color:'green'}
];
