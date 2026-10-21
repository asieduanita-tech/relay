import {z} from 'zod';
import {PARTNERS} from './types';
export const sourceInput=z.object({partnerId:z.enum(PARTNERS.map(p=>p.id) as [string,...string[]]),text:z.string().trim().min(10).max(5000),channel:z.enum(['Email','Slack','Meeting']),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(v);return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===v},'Use a valid date')});
