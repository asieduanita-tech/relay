import 'server-only';
import postgres from 'postgres';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import {Workspace} from './types';
import {seed} from './seed';
const root=path.join(process.cwd(),'.data');
export const durable=!!process.env.DATABASE_URL;
let database:ReturnType<typeof postgres>|undefined;
export function db(){if(!process.env.DATABASE_URL)throw new Error('Database is not configured.');return database??=postgres(process.env.DATABASE_URL,{max:3,idle_timeout:20,connect_timeout:10,prepare:false});}
export class AppError extends Error {constructor(message:string,public status=400){super(message)}}
const locks=new Map<string,Promise<unknown>>();
async function serial<T>(key:string,fn:()=>Promise<T>):Promise<T>{
 const prev=locks.get(key)||Promise.resolve();const next=prev.catch(()=>{}).then(fn);locks.set(key,next);
 try{return await next}finally{if(locks.get(key)===next)locks.delete(key)}
}
export async function createWorkspace(token:string,expiresAt:string){
 const data=seed();if(durable){await db()`INSERT INTO relay_workspaces (id, data, expires_at) VALUES (${token},${db().json(data)},${expiresAt})`}
 else{if(process.env.NODE_ENV==='production')throw new AppError('Set DATABASE_URL before serving the public demo.',503);await mkdir(root,{recursive:true});await writeFile(path.join(root,token+'.json'),JSON.stringify({data,expiresAt}));}
 return data;
}
export async function readWorkspace(token:string):Promise<Workspace>{
 if(durable){const rows=await db()`SELECT data FROM relay_workspaces WHERE id=${token} AND expires_at > now()`;if(!rows[0])throw new AppError('Your demo session expired. Reload to start a fresh workspace.',401);return rows[0].data as Workspace}
 try{const record=JSON.parse(await readFile(path.join(root,token+'.json'),'utf8'));if(new Date(record.expiresAt)<new Date())throw new Error();return record.data}catch{throw new AppError('Your demo session expired. Reload to start a fresh workspace.',401)}
}
export async function changeWorkspace<T>(token:string,fn:(w:Workspace)=>T|Promise<T>):Promise<T>{
 if(durable){return await db().begin(async sql=>{const rows=await sql`SELECT data FROM relay_workspaces WHERE id=${token} AND expires_at>now() FOR UPDATE`;if(!rows[0])throw new AppError('Your demo session expired. Reload to start again.',401);const w=rows[0].data as Workspace;const result=await fn(w);await sql`UPDATE relay_workspaces SET data=${sql.json(w)} WHERE id=${token}`;return result}) as T}
 return serial(token,async()=>{const w=await readWorkspace(token);const result=await fn(w);const old=JSON.parse(await readFile(path.join(root,token+'.json'),'utf8'));const target=path.join(root,token+'.json');await writeFile(target+'.tmp',JSON.stringify({...old,data:w}));await rename(target+'.tmp',target);return result});
}
export async function reserveQuota(scopes:{key:string;limit:number}[]){
 const day=new Date().toISOString().slice(0,10);
 if(durable){await db().begin(async sql=>{for(const s of scopes){const rows=await sql`INSERT INTO relay_usage (bucket, day, count) VALUES (${s.key},${day},1) ON CONFLICT(bucket, day) DO UPDATE SET count=relay_usage.count+1 WHERE relay_usage.count<${s.limit} RETURNING count`;if(!rows.length)throw new AppError('The demo analysis limit has been reached. Explore the reviewed synthetic evidence or try again tomorrow.',429)}});return}
 await serial('quota',async()=>{await mkdir(root,{recursive:true});let records:Record<string,number>={};try{records=JSON.parse(await readFile(path.join(root,'usage.json'),'utf8'))}catch{}
 for(const s of scopes){if((records[`${day}|${s.key}`]||0)>=s.limit)throw new AppError('The demo analysis limit has been reached. Try again tomorrow.',429)}for(const s of scopes)records[`${day}|${s.key}`]=(records[`${day}|${s.key}`]||0)+1;await writeFile(path.join(root,'usage.json'),JSON.stringify(records));});
}
