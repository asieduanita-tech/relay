import 'server-only';
import {getVercelOidcToken} from '@vercel/oidc';
export const usingGateway=()=>process.env.AI_PROVIDER==='vercel';
export const modelName=()=>process.env.OPENAI_MODEL||(usingGateway()?'openai/gpt-4.1-mini':'gpt-4.1-mini');
export function modelConfigured(){return usingGateway()?!!(process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN||process.env.VERCEL):!!process.env.OPENAI_API_KEY}
export async function modelCredentials(){return usingGateway()?{apiKey:process.env.AI_GATEWAY_API_KEY||await getVercelOidcToken(),baseURL:'https://ai-gateway.vercel.sh/v1'}:{apiKey:process.env.OPENAI_API_KEY}}
