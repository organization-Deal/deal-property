import { env } from 'cloudflare:workers';
export function db(){if(!env.DB)throw new Error('Database unavailable');return env.DB;}
export function adminPassword(){return (env as unknown as {ADMIN_PASSWORD?:string}).ADMIN_PASSWORD;}
export const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join('');}
export async function equalSecret(a:string,b:string){const x=await digest(a),y=await digest(b);let diff=0;for(let i=0;i<x.length;i++)diff|=x.charCodeAt(i)^y.charCodeAt(i);return diff===0;}
export async function authorized(req:Request){const t=req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith('deal_admin='))?.slice(11);if(!t||t.length>200)return false;return !!await db().prepare('SELECT token FROM admin_sessions WHERE token=? AND expires>?').bind(await digest(t),Date.now()).first();}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
export async function guard(req:Request){if(req.method!=='GET'&&!sameOrigin(req))return json({error:'Origin ไม่ถูกต้อง'},403);if(!await authorized(req))return json({error:'กรุณาเข้าสู่ระบบ'},401);return null;}
export async function limited(key:string,max:number,windowMs:number){const now=Date.now();await db().prepare('DELETE FROM admin_limits WHERE expires<?').bind(now).run();const result=await db().prepare('INSERT INTO admin_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+windowMs).first<{count:number}>();return !result||result.count>max;}
export async function body(req:Request){const text=await req.text();if(text.length>60000)throw new Error('ข้อมูลใหญ่เกินไป');return JSON.parse(text);}
