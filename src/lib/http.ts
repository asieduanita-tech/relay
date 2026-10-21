import {NextRequest,NextResponse} from 'next/server';
import {ZodError} from 'zod';
import {AppError} from './store';
export function checkOrigin(req:NextRequest){const origin=req.headers.get('origin');if(!origin||origin!==`${req.nextUrl.protocol}//${req.headers.get('host')}`)throw new AppError('Request origin was not accepted.',403);if(!req.headers.get('content-type')?.includes('application/json'))throw new AppError('Use a JSON request.',415)}
export async function body(req:NextRequest){const bytes=await req.text();if(Buffer.byteLength(bytes)>160000)throw new AppError('Request exceeds the demo size limit.',413);try{return JSON.parse(bytes)}catch{throw new AppError('Request body is not valid JSON.')}}
export function failure(e:unknown){if(e instanceof ZodError)return NextResponse.json({error:e.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')},{status:400});if(e instanceof AppError)return NextResponse.json({error:e.message},{status:e.status});console.error('Relay request failed:',e instanceof Error?e.name:'UnknownError');return NextResponse.json({error:'Relay could not complete this request. Your saved data is unchanged. Retry in a moment.'},{status:500})}
