'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ReactNode,useState,useEffect,useRef} from 'react';
import {Activity,LayoutDashboard,MessageSquareText,Users,Layers3,ArrowUpRight,Plus,PanelLeftClose,Menu,X,Check,AlertCircle,FlaskConical,ArrowRight} from 'lucide-react';
import {useWorkspace} from './workspace';
const nav=[{href:'/',label:'Overview',icon:LayoutDashboard},{href:'/feedback',label:'Feedback',icon:MessageSquareText},{href:'/partners',label:'Partners',icon:Users},{href:'/opportunities',label:'Opportunities',icon:Layers3}];
export function Shell({children}:{children:ReactNode}){
 const navRef=useRef<HTMLElement>(null),menuRef=useRef<HTMLButtonElement>(null);
 const path=usePathname(),[open,setOpen]=useState(false);const {w,cap,error,notice,dismiss}=useWorkspace();const pending=w?.findings.filter(f=>f.status==='suggested').length||0;
 useEffect(()=>{
  if(!open)return;const opener=menuRef.current;
  const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const focusable=()=>Array.from(navRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')||[]).filter(el=>el.getClientRects().length);
  const initial=navRef.current?.querySelector<HTMLElement>('.sidebar-close');initial?.focus();
  function keydown(event:KeyboardEvent){
   if(event.key==='Escape'){event.preventDefault();setOpen(false);return}
   if(event.key!=='Tab')return;const items=focusable(),first=items[0],last=items.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
  }
  const desktop=window.matchMedia('(min-width:761px)');const closeOnDesktop=()=>{if(desktop.matches)setOpen(false)};desktop.addEventListener('change',closeOnDesktop);
  document.addEventListener('keydown',keydown);
  return ()=>{document.body.style.overflow=previousOverflow;document.removeEventListener('keydown',keydown);desktop.removeEventListener('change',closeOnDesktop);opener?.focus()};
 },[open]);
 return <div className="app-shell"><a className="skip-link" href="#main">Skip to content</a><aside ref={navRef} id="relay-navigation" role={open?'dialog':undefined} aria-modal={open||undefined} aria-label="Workspace navigation" className={`sidebar ${open?'is-open':''}`}><Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark"><Activity size={23}/></span>relay<span className="brand-dot">.</span></Link><button className="sidebar-close icon-button" aria-label="Close navigation" onClick={()=>setOpen(false)}><X size={19}/></button><div className="workspace-label"><span className="workspace-square">R</span><div>Relay workspace<span>Product Operations</span></div><PanelLeftClose size={15}/></div><nav aria-label="Main navigation">{nav.map(n=><Link key={n.href} href={n.href} onClick={()=>setOpen(false)} aria-current={(n.href==='/'?path==='/':path.startsWith(n.href))?'page':undefined} className={`nav-link ${(n.href==='/'?path==='/':path.startsWith(n.href))?'active':''}`}><n.icon size={18}/>{n.label}{n.href==='/feedback'&&pending>0&&<span className="nav-count">{pending}</span>}</Link>)}</nav><div className="sidebar-bottom"><Link href="/demo" onClick={()=>setOpen(false)}><FlaskConical size={17}/>Demo guide<ArrowUpRight size={14}/></Link><div className="profile"><span className="profile-avatar">DO</span><div>Demo operator</div><BadgeDemo/></div></div></aside>{open&&<button className="nav-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<div className="main-column" inert={open||undefined}><header className="topbar"><div className="breadcrumb"><button ref={menuRef} aria-expanded={open} aria-controls="relay-navigation" className="mobile-menu icon-button" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu size={20}/></button><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{path==='/'?'Overview':path.startsWith('/issues')?'Issue evidence':nav.find(n=>n.href!=='/'&&path.startsWith(n.href))?.label||'Demo guide'}</strong></div><div className="topbar-right"><span className="synthetic-indicator"><span/>Synthetic data</span><Link className="button primary compact" href="/feedback/import"><Plus size={16}/>Add feedback</Link></div></header><div className="demo-banner"><FlaskConical size={14}/><span>Fictional partners. Synthetic feedback and metrics. No affiliation with real banks.</span><Link href="/demo">About this demo<ArrowRight size={13}/></Link></div><main id="main" tabIndex={-1}>{error&&<div role="alert" className="notice error"><AlertCircle size={18}/><span>{error}</span><button aria-label="Dismiss error" className="icon-button" onClick={dismiss}><X size={16}/></button></div>}{notice&&<div role="status" className="notice success"><Check size={18}/><span>{notice}</span><button aria-label="Dismiss notification" className="icon-button" onClick={dismiss}><X size={16}/></button></div>}{children}</main><footer className="page-footer"><span>Relay · Partner intelligence, connected to action.</span><span>{cap?.storage==='local'?'Local development workspace':'Isolated demo workspace'}<span className="footer-dot">·</span>All data synthetic</span></footer></div></div>
}
function BadgeDemo(){return <span className="demo-chip">Demo</span>}
