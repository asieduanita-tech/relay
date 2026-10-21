import {NextRequest,NextResponse} from 'next/server';
import {db,durable} from '@/lib/store';
export async function GET(req:NextRequest){if(!process.env.CRON_SECRET||req.headers.get('authorization')!==`Bearer ${process.env.CRON_SECRET}`)return new NextResponse('Unauthorized',{status:401});if(!durable)return NextResponse.json({error:'Database is not configured'},{status:503});await db()`DELETE FROM relay_workspaces WHERE expires_at<now()`;await db()`DELETE FROM relay_usage WHERE day < current_date - 2`;return NextResponse.json({cleaned:true})}
