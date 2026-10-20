# DEAL Human Allowed UI Update v2
ชุดอัปเดตนี้รวมการแก้จาก ZIP รอบก่อนแล้ว นำ app และ lib ไปวางทับใน repository เดิม ไม่ต้องลบไฟล์อื่น
ไม่มีการตั้งค่า Cloudflare/D1 หรือ deploy ใน ZIP นี้

รอบนี้แก้ไอคอน workflow ให้จัดกึ่งกลางแนวนอน/แนวตั้งโดยล้าง justify-content:space-between ที่สืบทอดจาก style เดิม
เปลี่ยนชื่อโครงการตามตัวสะกดที่ผู้ใช้ระบุ:
1. Human Alloewd Chiangmai Gate
2. Human Alloewd Airpod Chiangmai
อัปเดตการ์ด แกลเลอรี คำบรรยายภาพและข้อความแปลสามภาษา โดยคงรูปภาพ รหัสและสถานะโครงการเดิม
โครงการ 2 ยังคงสถานะปิดรับ/ระหว่างก่อสร้างตามข้อมูลเดิม ไม่ได้เปลี่ยนให้สร้างเสร็จ

การตรวจ: build และ TypeScript ต้องผ่านก่อนส่งชุดนี้
ยังไม่ยืนยัน browser visual QA เนื่องจาก preview รอบก่อนเชื่อมต่อไม่ได้ ไม่มี screenshots หลังแก้
รอบนี้ไม่เปลี่ยนฟอร์ม API หรือการเงิน และยังไม่ได้ทดสอบเขียนข้อมูล D1 จริง

ไฟล์ที่อัปเดต:
- app/controls.css
- app/desktop-layout.css
- app/enquiry-form.css
- app/enquiry-form.tsx
- app/handoff.css
- app/language.css
- app/projects/human-allowed-chiang-mai/page.tsx
- app/reading-layout.css
- app/site.tsx
- lib/project.ts
- app/construction.tsx
- lib/translations.ts
