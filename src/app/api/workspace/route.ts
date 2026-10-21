import {NextRequest,NextResponse} from 'next/server';
import {session,aiAvailable} from '@/lib/session';
import {readWorkspace,changeWorkspace,durable,AppError} from '@/lib/store';
import {mutationSchema,mutate} from '@/lib/domain';
import {checkOrigin,body,failure} from '@/lib/http';
import {seed} from '@/lib/seed';
import {modelName} from '@/lib/ai-config';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){try{const s=await session(true);return NextResponse.json({workspace:await readWorkspace(s.token),capabilities:{storage:durable?'postgres':'local',ai:aiAvailable(),model:modelName(),expiresAt:s.expiresAt}},{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
export async function POST(req:NextRequest){try{checkOrigin(req);const {token}=await session();const m=mutationSchema.parse(await body(req));const result=await changeWorkspace(token,w=>{if(m.type==='reset'){const fresh=seed();fresh.version=w.version+1;Object.assign(w,fresh);return {workspace:w,message:'Your demo was reset. Other visitors are unaffected.'}}try{return mutate(w,m)}catch(e){throw new AppError((e as Error).message,400)}});return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
