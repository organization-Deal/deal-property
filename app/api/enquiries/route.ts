import {contentSchema} from '@/lib/cms-config';
import { ensureDatabase } from '@/lib/database-ready';
import { db } from '@/lib/admin-server';
import { enquirySchema } from '@/lib/enquiry';
import { enquiryReference } from '@/lib/enquiry-reference';
import { money, ownershipPrice } from '@/lib/project';
export async function POST(request: Request) {
 const origin=request.headers.get('origin');
 if(origin && origin!==new URL(request.url).origin) return Response.json({error:'ไม่สามารถส่งจากเว็บไซต์ภายนอกได้'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'รูปแบบข้อมูลไม่ถูกต้อง'},{status:415});
 let payload:unknown;
 try {const body=await request.text();if(body.length>12000) return Response.json({error:'ข้อมูลยาวเกินไป'},{status:413});payload=JSON.parse(body);}
 catch{return Response.json({error:'กรุณาตรวจสอบข้อมูลแล้วลองใหม่'},{status:400});}
 const parsed=enquirySchema.safeParse(payload);
 if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
 const {consent,website,requestId,sharePct,language,firstName,lastName,lineId,budget,referralCode,visitTime,...data}=parsed.data;
 if(firstName&&lastName)data.name=`${firstName} ${lastName}`;
 const extra={firstName:firstName||'',lastName:lastName||'',lineId,budget,referralCode,visitTime:data.purpose==='visit'?visitTime:''};
 data.message=`Contact details: ${JSON.stringify(extra)}\n${data.message}`;
 const share=data.ownership==='whole'?100:data.ownership==='co-owner'?(sharePct??10):undefined;
 if(share!==undefined)data.message=`สนใจสัดส่วน ${share}% · จำนวนเงินคำนวณ ${money(ownershipPrice(data.ownership,share))} บาท รวมภาษี\n${data.message}`;
 if(data.ownership==='whole')data.message='สอบถามทางเลือกทั้งหลังเท่านั้น · ยังไม่ยืนยันเปิดรับ 100%\n'+data.message;
 data.message=`Preferred language: ${{th:'Thai',zh:'Chinese (Simplified)',en:'English'}[language]}\n${data.message}`;
 const id=await enquiryReference(requestId??crypto.randomUUID(),data);
 try {
  await ensureDatabase();
  const state=await db().prepare('SELECT published FROM site_content WHERE id=1').first<{published:string}>();
  const current=contentSchema.parse(state?JSON.parse(state.published):{});
  const remaining=Math.round((100-current.availability.ownedPercent)*100)/100;
  if(data.ownership==='co-owner' && (share??10)>remaining)return Response.json({error:`สัดส่วนเปิดรับล่าสุดเหลือ ${remaining}% กรุณาปรับสัดส่วนหรือติดต่อทีม`},{status:400});
  await db().prepare('INSERT INTO enquiries(id,name,phone,email,project,ownership,purpose,visit_date,contact_time,message,source,consent_version,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,data.name,data.phone,data.email,data.project,data.ownership,data.purpose,data.purpose==='visit'?data.visitDate:'',data.contactTime,data.message,data.source,'enquiry-2026-10-v1',Date.now()).run();
  const saved=await db().prepare('SELECT id FROM enquiries WHERE id=?').bind(id).first();
  if(!saved)throw new Error('Persistence verification failed');
  return Response.json({id},{status:201,headers:{'Cache-Control':'no-store'}});
 } catch {return Response.json({error:'ยังบันทึกข้อมูลไม่สำเร็จ ข้อมูลที่กรอกยังอยู่ กรุณาลองอีกครั้ง'},{status:503});}
}
