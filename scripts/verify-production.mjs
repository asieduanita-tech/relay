import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {once} from 'node:events';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function check({port,secret,expected}){
 const origin=`http://127.0.0.1:${port}`;
 const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_ENV:'production',DATABASE_URL:'',SESSION_SECRET:secret,CRON_SECRET:'',AI_ENABLED:'false'},stdio:'ignore'});
 try{
  let response;
  for(let n=0;n<60;n++){if(child.exitCode!==null)throw new Error('Production verification server exited before readiness');try{response=await fetch(origin);if(response.ok)break}catch{}await delay(250)}
  assert.equal(response?.status,200);assert.equal(response.headers.get('x-frame-options'),'DENY');assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  const workspace=await fetch(origin+'/api/workspace',{headers:secret?{}:{cookie:'relay_session=invalid.9999999999999.invalid'}});assert.equal(workspace.status,503);assert.match((await workspace.json()).error,expected);
  console.log(JSON.stringify({check:secret?'database required; no production file fallback':'session secret required',status:'passed',pageStatus:200,workspaceStatus:503}));
 }finally{const exited=once(child,'exit');child.kill('SIGTERM');await Promise.race([exited,delay(3000).then(()=>{if(child.exitCode===null)child.kill('SIGKILL')})])}
}
// Deliberately blank database and non-secret test strings. No real store or provider is contacted.
await check({port:4311,secret:'',expected:/SESSION_SECRET/});
await check({port:4312,secret:'local-verification-only-not-a-real-secret',expected:/DATABASE_URL/});
