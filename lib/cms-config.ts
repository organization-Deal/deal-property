import { z } from 'zod';
export const textFields = [
 'บ้านพักที่คุณ','เป็นเจ้าของ','เราดูแลให้','จากทำเลที่ใช่ สู่บ้านพักพร้อมดำเนินงาน',
 'เลือกเป็นเจ้าของทั้งหลัง หรือเริ่มต้นเป็นเจ้าของร่วม','พร้อมทีมดูแลการปล่อยเช่าตามข้อตกลง',
 'ดูโครงการของเรา','โครงการบ้านพัก','DEAL! ดูแลอะไรบ้าง','เลือกทำเล','สำรวจและประเมินพื้นที่สำหรับบ้านพัก',
 'ประสานงานโครงการ','ที่ดินเช่า เอกสาร แบบบ้าน และผู้รับเหมา','สร้างและตกแต่ง','ดูแลบ้านให้พร้อมเปิดรับผู้เข้าพัก',
 'ดูแลการปล่อยเช่า','การจอง ผู้เข้าพัก ทำความสะอาด และสรุปรายได้','ผลงานที่ผ่านมา',
] as const;
export const imageFields = ['/assets/house.webp','/assets/completed-2672.webp'] as const;
const imageURL = z.string().max(2048).refine(v => /^\/assets\/[a-zA-Z0-9_.-]+$/.test(v) || /^\/api\/media\/[a-f0-9-]+$/.test(v) || (()=>{try{return new URL(v).protocol==='https:'}catch{return false}})());
export const contentSchema = z.object({
 texts: z.record(z.object({th:z.string().trim().min(1).max(500),en:z.string().trim().min(1).max(500),zh:z.string().trim().min(1).max(500)}).strict()).default({}),
 images:z.record(imageURL).default({}), density:z.enum(['normal','compact']).default('normal')
}).strict().superRefine((v,ctx)=>{for(const k of Object.keys(v.texts))if(!(textFields as readonly string[]).includes(k))ctx.addIssue({code:'custom',message:'ข้อความนี้ไม่อยู่ในรายการที่แก้ได้'});for(const k of Object.keys(v.images))if(!(imageFields as readonly string[]).includes(k))ctx.addIssue({code:'custom',message:'รูปนี้ไม่อยู่ในรายการที่แก้ได้'});});
export type SiteContent=z.infer<typeof contentSchema>;
export const emptyContent:SiteContent={texts:{},images:{},density:'normal'};
