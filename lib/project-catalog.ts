import {z} from 'zod';
export const localized=z.object({th:z.string().trim().max(3000),en:z.string().trim().max(3000),zh:z.string().trim().max(3000)}).strict();
export const catalogProjectSchema=z.object({
 id:z.string().uuid(),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80).refine(v=>v!=='human-allowed-chiang-mai'),
 name:localized.refine(v=>v.th.length>0,'กรุณาใส่ชื่อภาษาไทย'),location:localized,description:localized,terms:localized,
 status:z.enum(['coming-soon','open','paused','completed']),hidden:z.boolean(),
 image:z.string().max(2048).refine(v=>!v||/^\/assets\/[\w.-]+$/.test(v)||/^\/api\/media\/[a-f0-9-]+$/.test(v)||(()=>{try{return new URL(v).protocol==='https:'}catch{return false}})(),'URL รูปไม่ถูกต้อง'),
 fullPrice:z.number().int().min(0).max(1000000000),minShare:z.number().min(10).max(100).multipleOf(.01),ownedPercent:z.number().min(0).max(100).multipleOf(.01),updated:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v),
}).strict();
export function projectReadiness(v:z.infer<typeof catalogProjectSchema>){return v.hidden||v.status!=='open'?[]:[...(v.fullPrice<=0?['ระบุมูลค่าโครงการมากกว่า 0']:[]),...(!v.terms.th?['ระบุสิทธิ ค่าใช้จ่าย และเงื่อนไข']:[]),...(100-v.ownedPercent<v.minShare?['ยอดเหลือต้องไม่น้อยกว่าสัดส่วนขั้นต่ำ']:[])];}
export type CatalogProject=z.infer<typeof catalogProjectSchema>;
export const statusLabels={'coming-soon':'Coming Soon!','open':'เปิดให้เป็นเจ้าของ','paused':'พักการเปิดรับ','completed':'ดำเนินงานแล้ว'};
