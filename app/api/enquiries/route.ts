import { getDb } from '@/db';
import { enquiries } from '@/db/schema';
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
  await getDb().insert(enquiries).values({...data,visitDate:data.purpose==='visit'?data.visitDate:'',id,createdAt:Date.now(),consentVersion:'enquiry-2026-10-v1'}).onConflictDoNothing({target:enquiries.id});
  return Response.json({id},{status:201,headers:{'Cache-Control':'no-store'}});
 } catch {return Response.json({error:'ยังบันทึกข้อมูลไม่สำเร็จ ข้อมูลที่กรอกยังอยู่ กรุณาลองอีกครั้ง'},{status:503});}
}
