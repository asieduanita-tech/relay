import 'server-only';
import {cookies} from 'next/headers';
import {randomBytes,createHmac,timingSafeEqual} from 'node:crypto';
import {createWorkspace,readWorkspace,AppError,durable} from './store';
const localGlobal=globalThis as typeof globalThis & {relayLocalSecret?:string};
const localSecret=localGlobal.relayLocalSecret??=randomBytes(32).toString('hex');
function secret(){const s=process.env.SESSION_SECRET;if(process.env.NODE_ENV==='production'&&(!s||s.length<32))throw new AppError('Configure a SESSION_SECRET with at least 32 characters.',503);return s||localSecret}
const sign=(v:string)=>createHmac('sha256',secret()).update(v).digest('hex');
export async function session(create=false){
 const jar=await cookies();const value=jar.get('relay_session')?.value;let token='',expiresAt='';
 if(value){const [t,exp,sig]=value.split('.');const payload=`${t}.${exp}`;const expected=sign(payload);if(/^[a-f0-9]{48}$/.test(t||'')&&sig?.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected))&&Number(exp)>Date.now()){token=t;expiresAt=new Date(Number(exp)).toISOString()}}
 if(token){try{await readWorkspace(token);return {token,expiresAt}}catch(e){if(!(e instanceof AppError)||e.status!==401)throw e}}
 if(!create)throw new AppError('Start a demo session before making changes.',401);
 token=randomBytes(24).toString('hex');expiresAt=new Date(Date.now()+86400000).toISOString();await createWorkspace(token,expiresAt);const payload=`${token}.${new Date(expiresAt).getTime()}`;
 jar.set('relay_session',`${payload}.${sign(payload)}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:86400,path:'/'});return {token,expiresAt};
}
// User requires no card and no spending. Environment changes alone cannot enable calls.
export const aiAvailable=()=>false;
