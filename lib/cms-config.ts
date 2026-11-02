import { z } from 'zod';
import {catalogProjectSchema} from './project-catalog';
import sectionFields from './cms-fields.json';
export const cmsSections=sectionFields;
const legacyTextFields=['บ้านพักที่คุณ','เป็นเจ้าของ','เราดูแลให้','จากทำเลที่ใช่ สู่บ้านพักพร้อมดำเนินงาน','เลือกเป็นเจ้าของทั้งหลัง หรือเริ่มต้นเป็นเจ้าของร่วม','พร้อมทีมดูแลการปล่อยเช่าตามข้อตกลง','ดูโครงการของเรา','โครงการบ้านพัก','DEAL! ดูแลอะไรบ้าง','เลือกทำเล','สำรวจและประเมินพื้นที่สำหรับบ้านพัก','ประสานงานโครงการ','ที่ดินเช่า เอกสาร แบบบ้าน และผู้รับเหมา','สร้างและตกแต่ง','ดูแลบ้านให้พร้อมเปิดรับผู้เข้าพัก','ดูแลการปล่อยเช่า','การจอง ผู้เข้าพัก ทำความสะอาด และสรุปรายได้','ผลงานที่ผ่านมา'];
export const textFields=[...new Set([...legacyTextFields,...cmsSections.flatMap(s=>s.fields.map(f=>f.key))])];
export const imageFields=[...new Set(['/assets/house.webp','/assets/completed-2672.webp',...cmsSections.flatMap(s=>s.images.map(i=>i.src))])];
export const homeSections=['hero','projects','portfolio','about','care','faq','contact'] as const;
export const homeSectionTitles:Record<string,string>={hero:'ภาพและคำพาดหัวแรก',projects:'โครงการบ้านพัก',portfolio:'ผลงานที่ผ่านมา',about:'รู้จัก DEAL!',care:'บริการ 4 ขั้นตอน',faq:'คำถามที่พบบ่อย',contact:'ติดต่อและฟอร์ม'};
const imageURL = z.string().max(2048).refine(v => /^\/assets\/[a-zA-Z0-9_.-]+$/.test(v) || /^\/api\/media\/[a-f0-9-]+$/.test(v) || (()=>{try{return new URL(v).protocol==='https:'}catch{return false}})());
export const contentSchema = z.object({
 faqItems:z.array(z.object({id:z.string().min(1).max(80),question:z.object({th:z.string().trim().min(1).max(500),en:z.string().max(500),zh:z.string().max(500)}).strict(),answer:z.object({th:z.string().trim().min(1).max(3000),en:z.string().max(3000),zh:z.string().max(3000)}).strict()}).strict()).max(30).refine(v=>new Set(v.map(i=>i.id)).size===v.length).optional(),
 appearance:z.object({accent:z.enum(['red','charcoal','olive']).default('red'),radius:z.enum(['soft','sharp']).default('soft'),textSize:z.enum(['normal','large']).default('normal')}).strict().default({accent:'red',radius:'soft',textSize:'normal'}),
 homeLayout:z.array(z.object({id:z.enum(homeSections),visible:z.boolean()}).strict()).length(7).refine(v=>new Set(v.map(x=>x.id)).size===7,'ส่วนหน้าแรกซ้ำหรือขาดหาย').default(homeSections.map(id=>({id,visible:true}))),
 projects:z.array(catalogProjectSchema).max(50).default([]),
 availability:z.object({ownedPercent:z.number().min(0).max(100).multipleOf(0.01),updated:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'วันที่ไม่ถูกต้อง')}).strict().default({ownedPercent:40,updated:'2026-10-11'}),
 texts: z.record(z.object({th:z.string().trim().min(1).max(3000),en:z.string().trim().min(1).max(3000),zh:z.string().trim().min(1).max(3000)}).strict()).default({}),
 images:z.record(imageURL).default({}), density:z.enum(['normal','compact']).default('normal')
}).strict().superRefine((v,ctx)=>{if(new Set(v.projects.map(p=>p.slug)).size!==v.projects.length||new Set(v.projects.map(p=>p.id)).size!==v.projects.length)ctx.addIssue({code:'custom',message:'รหัสหรือ URL โครงการซ้ำ'});for(const k of Object.keys(v.texts))if(!(textFields as readonly string[]).includes(k))ctx.addIssue({code:'custom',message:'ข้อความนี้ไม่อยู่ในรายการที่แก้ได้'});for(const k of Object.keys(v.images))if(!(imageFields as readonly string[]).includes(k))ctx.addIssue({code:'custom',message:'รูปนี้ไม่อยู่ในรายการที่แก้ได้'});});
export type SiteContent=z.infer<typeof contentSchema>;
export const emptyContent:SiteContent={appearance:{accent:'red',radius:'soft',textSize:'normal'},homeLayout:homeSections.map(id=>({id,visible:true})),projects:[],texts:{},images:{},density:'normal',availability:{ownedPercent:40,updated:'2026-10-11'}};
