// One-time project configuration. Secrets are generated in memory and sent via stdin.
import {randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
const entries=[['SESSION_SECRET',randomBytes(48).toString('hex'),true],['CRON_SECRET',randomBytes(32).toString('hex'),true],['AI_PROVIDER','vercel',false],['AI_ENABLED','false',false],['AI_DAILY_GLOBAL_LIMIT','100',false]];
for(const [name,value,sensitive] of entries){
 const args=['--yes','vercel@latest','env','add',name,'--environment',sensitive?'production,preview':'production,preview,development',sensitive?'--sensitive':'--no-sensitive','--yes'];
 const child=spawn('npx',args,{stdio:['pipe','pipe','pipe']});
 let output='';child.stdout.on('data',x=>output+=x);child.stderr.on('data',x=>output+=x);child.stdin.end(value+'\n');
 const code=await new Promise(resolve=>child.on('close',resolve));
 // CLI output should never include the value; scrub defensively before reporting.
 console.log(output.replaceAll(value,'[redacted]'));
 if(code!==0)throw new Error(`Could not configure ${name}; check its existing environment settings.`);
}
