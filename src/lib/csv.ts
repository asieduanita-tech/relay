import Papa from 'papaparse';
import {sourceInput} from './domain-input';
import {PARTNERS} from './types';
export type ImportRow={partnerId:string;text:string;channel:'Email'|'Slack'|'Meeting';date:string};
export function parseCsv(text:string):{rows:ImportRow[];errors:string[]}{
 if(new TextEncoder().encode(text).length>100000)return {rows:[],errors:['CSV must be smaller than 100 KB.']};
 const parsed=Papa.parse<Record<string,string>>(text,{header:true,skipEmptyLines:'greedy',transformHeader:h=>h.trim().toLowerCase().replace(/^\uFEFF/,'')});
 const errors=parsed.errors.map(e=>`Row ${(e.row??0)+2}: ${e.message}`);
 if(!['partner','text','channel','date'].every(h=>parsed.meta.fields?.includes(h)))return {rows:[],errors:['Required headers: partner,text,channel,date.']};
 if(parsed.data.length>25)return {rows:[],errors:['Import at most 25 rows at a time.']};
 const rows:ImportRow[]=[];
 parsed.data.forEach((r,i)=>{
  const partner=PARTNERS.find(p=>p.id===r.partner?.trim().toLowerCase()||p.name.toLowerCase()===r.partner?.trim().toLowerCase());
  const result=sourceInput.safeParse({partnerId:partner?.id,text:r.text,channel:r.channel?.trim(),date:r.date?.trim()});
  if(!result.success)errors.push(`Row ${i+2}: ${result.error.issues.map(e=>`${e.path.join('.')}: ${e.message}`).join('; ')}`);else rows.push(result.data);
 });return {rows,errors};
}
