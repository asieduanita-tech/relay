import {test,expect} from '@playwright/test';
const origin=process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:3000';
test('public endpoints reject unsigned mutations, foreign objects and cross-origin requests; AI remains blocked',async({browser})=>{
 const a=await browser.newContext(),b=await browser.newContext();
 try{
  const unsigned=await a.request.post('/api/workspace',{headers:{origin},data:{type:'reset'}});expect(unsigned.status()).toBe(401);
  const unsignedAI=await a.request.post('/api/analyze',{headers:{origin},data:{sourceId:'s1'}});expect(unsignedAI.status()).toBe(401);
  const first=await a.request.get('/api/workspace'),second=await b.request.get('/api/workspace');expect(first.headers()['cache-control']).toContain('no-store');const before=(await second.json()).workspace;expect((await first.json()).capabilities.ai).toBe(false);
  const cookies=await a.cookies();const cookie=cookies.find(c=>c.name==='relay_session')!;expect(cookie.httpOnly).toBe(true);expect(cookie.sameSite).toBe('Strict');
  const added=await a.request.post('/api/workspace',{headers:{origin},data:{type:'action',opportunityId:'o1',title:'Isolated synthetic security check',owner:'Sam Okafor',due:'2026-10-26'}});expect(added.status()).toBe(200);const own=(await added.json()).workspace;const action=own.opportunities[0].actions.find((x:{title:string})=>x.title==='Isolated synthetic security check');
  const foreign=await b.request.post('/api/workspace',{headers:{origin},data:{type:'toggleAction',opportunityId:'o1',actionId:action.id,done:true}});expect(foreign.status()).toBe(400);
  const cross=await a.request.post('/api/analyze',{headers:{origin:'https://example.com'},data:{sourceId:'s1'}});expect(cross.status()).toBe(403);
  const wrongType=await a.request.post('/api/workspace',{headers:{origin,'content-type':'text/plain'},data:'{}'});expect(wrongType.status()).toBe(415);
  const large=await a.request.post('/api/workspace',{headers:{origin},data:{padding:'x'.repeat(160001)}});expect(large.status()).toBe(413);
  const ai=await a.request.post('/api/analyze',{headers:{origin},data:{sourceId:'s1'}});expect(ai.status()).toBe(503);expect((await ai.json()).error).toContain('no-spend');const after=await a.request.get('/api/workspace');expect((await after.json()).workspace).toEqual(own);
  const unchanged=await b.request.get('/api/workspace');expect((await unchanged.json()).workspace).toEqual(before);
  const cron=await a.request.get('/api/cron');expect(cron.status()).toBe(401);
  await a.addCookies([{name:'relay_session',value:'../invalid.9999999999999.invalid',url:origin}]);const forged=await a.request.post('/api/workspace',{headers:{origin},data:{type:'reset'}});expect(forged.status()).toBe(401);
 }finally{await a.close();await b.close()}
});
