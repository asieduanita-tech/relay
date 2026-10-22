'use client';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {RefreshCw} from 'lucide-react';
import {WorkspaceProvider,useWorkspace} from './workspace';
import {Shell} from './shell';
import {Dashboard} from './dashboard';
import {Feedback} from './feedback';
import {ImportFeedback} from './import';
import {Partners,IssueDetail} from './partners';
import {Opportunities,OpportunityDetail} from './opportunities';
import {Demo} from './demo';
export function App(){return <WorkspaceProvider><Shell><Route/></Shell></WorkspaceProvider>}
function Route(){const path=usePathname();const {w,loading,error,refresh}=useWorkspace();if(loading&&!w)return <div className="page-skeleton" aria-busy="true" aria-label="Loading demo workspace" role="status"><span className="sr-only">Loading synthetic workspace…</span><div/><div/><div/></div>;if(!w)return <div className="empty"><h1>Relay needs a connection.</h1><p>{error||'Your workspace could not be loaded.'}</p><button className="button primary" onClick={refresh}><RefreshCw size={16}/>Retry loading</button></div>;if(path==='/')return <Dashboard/>;if(path==='/feedback/import')return <ImportFeedback/>;if(path==='/feedback')return <Feedback/>;if(path==='/partners')return <Partners/>;if(path.startsWith('/partners/'))return <Partners id={path.split('/')[2]}/>;if(path.startsWith('/issues/'))return <IssueDetail id={path.split('/')[2]}/>;if(path==='/opportunities')return <Opportunities/>;if(path.startsWith('/opportunities/'))return <OpportunityDetail key={path} id={path.split('/')[2]}/>;if(path==='/demo')return <Demo/>;return <div className="empty"><h1>This view does not exist.</h1><Link href="/">Return to overview</Link></div>}
