import { z } from 'zod';
import { PROJECT, validShare } from './project';
export const enquirySchema = z.object({
 firstName: z.string().trim().min(1,'กรุณาระบุชื่อ').max(59).optional(),
 lastName: z.string().trim().min(1,'กรุณาระบุนามสกุล').max(59).optional(),
 lineId: z.string().trim().max(100).default(''),
 budget: z.enum(['undecided','under-200k','200k-500k','500k-1m','1m-2m','over-2m']).default('undecided'),
 referralCode: z.string().trim().max(80).default(''),
 visitTime: z.enum(['any','morning','afternoon']).default('any'),
 language: z.enum(['th','zh','en']).default('th'),
 sharePct: z.number().refine(validShare,'กรุณาระบุสัดส่วน 10–100% ทศนิยมไม่เกิน 2 ตำแหน่ง').optional(),
 requestId: z.string().uuid('รหัสคำขอไม่ถูกต้อง').optional(),
 name: z.string().trim().min(2, 'กรุณาระบุชื่ออย่างน้อย 2 ตัวอักษร').max(120),
 phone: z.string().transform(v => v.replace(/[\s()-]/g, '')).refine(v => /^(0\d{8,9}|\+\d{8,15})$/.test(v), 'กรุณาตรวจสอบเบอร์โทรศัพท์'),
 email: z.union([z.literal(''), z.string().trim().email('กรุณาตรวจสอบอีเมล').max(200)]).default(''),
 project: z.literal('human-allowed-chiang-mai'), ownership: z.enum(['co-owner','whole','undecided']), purpose: z.enum(['details','visit','plans']),
 visitDate: z.string().max(10).default(''), contactTime: z.enum(['any','morning','afternoon','evening']), message: z.string().trim().max(1500).default(''),
 source: z.string().max(500).default('website'), consent: z.literal(true), website: z.string().max(0).default(''),
}).superRefine((v,ctx) => {
 if(v.firstName!==undefined&&v.lastName===undefined)ctx.addIssue({code:'custom',path:['lastName'],message:'กรุณาระบุนามสกุล'});
 if(v.lastName!==undefined&&v.firstName===undefined)ctx.addIssue({code:'custom',path:['firstName'],message:'กรุณาระบุชื่อ'});
 if(v.ownership==='co-owner' && v.sharePct !== undefined && v.sharePct > PROJECT.remainingPercent) ctx.addIssue({code:'custom',path:['sharePct'],message:'สัดส่วนที่ระบุมากกว่ายอดเปิดรับ 60% กรุณาเลือกใหม่'});
 if (v.purpose === 'visit') {
  const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date());
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(v.visitDate) && !isNaN(Date.parse(v.visitDate)) && new Date(v.visitDate).toISOString().slice(0,10) === v.visitDate;
  if (!valid || v.visitDate < today) ctx.addIssue({code:'custom',path:['visitDate'],message:'กรุณาเลือกวันนัดตั้งแต่วันนี้เป็นต้นไป'});
 }
});
