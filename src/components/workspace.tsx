'use client';
import {createContext,useContext,useState,useEffect,useCallback,ReactNode} from 'react';
import {Workspace,Capabilities} from '@/lib/types';
import type {Mutation} from '@/lib/domain';
type State={w:Workspace|null;cap:Capabilities|null;loading:boolean;error:string;notice:string;busy:boolean;refresh:()=>Promise<void>;mutate:(m:Mutation)=>Promise<boolean>;analyze:(sourceId:string)=>Promise<boolean>;dismiss:()=>void};
const Context=createContext<State|null>(null);
async function request(url:string,body?:unknown){const res=await fetch(url,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store'});const data=await res.json();if(!res.ok)throw new Error(data.error||'The request failed. Please retry.');return data}
export function WorkspaceProvider({children}:{children:ReactNode}){
 const [w,setW]=useState<Workspace|null>(null),[cap,setCap]=useState<Capabilities|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const refresh=useCallback(async()=>{setLoading(true);setError('');try{const d=await request('/api/workspace');setW(d.workspace);setCap(d.capabilities)}catch(e){setError((e as Error).message)}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 async function run(url:string,m:unknown){if(busy)return false;setBusy(true);setError('');setNotice('');try{const d=await request(url,m);setW(d.workspace);setNotice(d.message);return true}catch(e){setError((e as Error).message);if(url==='/api/analyze'){try{const d=await request('/api/workspace');setW(d.workspace)}catch{}}return false}finally{setBusy(false)}}
 return <Context.Provider value={{w,cap,loading,error,notice,busy,refresh,mutate:m=>run('/api/workspace',m),analyze:sourceId=>run('/api/analyze',{sourceId}),dismiss:()=>{setNotice('');setError('')}}}>{children}</Context.Provider>
}
export function useWorkspace(){const c=useContext(Context);if(!c)throw new Error('Missing WorkspaceProvider');return c}
