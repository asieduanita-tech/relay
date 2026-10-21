'use client';
import {PARTNERS,Partner,Filters,AREAS} from '@/lib/types';
import {useRouter,useSearchParams} from 'next/navigation';
import {Search,X,ArrowUpRight,SlidersHorizontal} from 'lucide-react';
import Link from 'next/link';
import {ReactNode} from 'react';
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
export function statusTone(s:string){return s==='Planned'||s==='Delivered'||s==='accepted'?'green':s==='High'||s==='failed'?'red':s==='Deferred'||s==='suggested'||s==='Under review'?'amber':'neutral'}
export function Avatar({partner,small=false}:{partner:Partner;small?:boolean}){return <span className={`avatar ${partner.color} ${small?'small':''}`} title={partner.name}>{partner.initials}</span>}
export function PartnerGroup({ids}:{ids:string[]}){return <span className="partner-group">{ids.map(id=>{const p=PARTNERS.find(p=>p.id===id);return p?<Avatar key={id} partner={p} small/>:null})}</span>}
export function Empty({title,children,action}:{title:string;children:ReactNode;action?:ReactNode}){return <div className="empty"><SlidersHorizontal size={26}/><h3>{title}</h3><p>{children}</p>{action}</div>}
export function PageHeader({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>}
export function SectionTitle({title,detail,action}:{title:string;detail?:string;action?:ReactNode}){return <div className="section-heading"><div><h2>{title}</h2>{detail&&<p>{detail}</p>}</div>{action}</div>}
export function TextLink({href,children}:{href:string;children:ReactNode}){return <Link className="text-link" href={href}>{children}<ArrowUpRight size={14}/></Link>}
export function useFilters(){const p=useSearchParams();return {partner:p.get('partner')||'',area:p.get('area')||'',from:p.get('from')||'',to:p.get('to')||'',search:p.get('search')||''} satisfies Filters}
export function FilterBar({search=true}:{search?:boolean}){
 const p=useSearchParams(),router=useRouter(),f=useFilters();function update(key:string,value:string){const q=new URLSearchParams(p.toString());if(value)q.set(key,value);else q.delete(key);router.replace('?'+q.toString(),{scroll:false})}
 const active=Object.values(f).some(Boolean);
 return <div className="filter-bar"><div className="filter-selects"><label><span className="sr-only">Filter by partner</span><select value={f.partner} onChange={e=>update('partner',e.target.value)}><option value="">All partners</option>{PARTNERS.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label><label><span className="sr-only">Filter by product area</span><select className="area-select" value={f.area} onChange={e=>update('area',e.target.value)}><option value="">All product areas</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></label><label className="date-filter"><span>From</span><input aria-label="Feedback from date" type="date" value={f.from} max={f.to||undefined} onChange={e=>update('from',e.target.value)}/></label><label className="date-filter"><span>To</span><input aria-label="Feedback to date" type="date" min={f.from||undefined} value={f.to} onChange={e=>update('to',e.target.value)}/></label></div>{search&&<label className="search-field"><Search size={16}/><input aria-label="Search feedback" placeholder="Search feedback…" defaultValue={f.search} key={f.search} onKeyDown={e=>{if(e.key==='Enter')update('search',e.currentTarget.value)}} onBlur={e=>{if(e.target.value!==f.search)update('search',e.target.value)}}/></label>}{active&&<button className="button ghost compact" onClick={()=>router.replace('?',{scroll:false})}><X size={14}/>Clear</button>}</div>
}
export const dateLabel=(date:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'Europe/London'}).format(new Date(date));
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
