# DEAL Human Allowed Mobile Update v3
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

## รอบ v3: มือถือหน้ารายการโครงการ
ปรับเฉพาะ breakpoint ไม่เกิน 600px ใน app/desktop-layout.css ซึ่งเป็นไฟล์ layout ที่มี shared/mobile rules เดิม
- หัวข้อ/จำนวนโครงการอยู่ซ้าย ปุ่มดูทั้งหมดอยู่ขวาในแถวเดียว
- ลูกศรเลื่อนไปอยู่ใต้การ์ด ไม่กินพื้นที่ก่อนเห็นโครงการ
- ลด padding/gap และภาพเป็น 16:9 โดยยัง object-fit:contain เพื่อไม่ตัดตัวบ้าน
- ลดกรอบซ้อนข้อมูลห้องและจัดข้อมูลราคาให้กระชับ
- การ์ดไม่ยืดสูงตามการ์ดข้างเคียงบนมือถือ
- ยังคง swipe, keyboard และปุ่มเลื่อนที่มี touch target 44px
Desktop และข้อมูลธุรกิจคงเดิม ไม่แก้ Cloudflare/D1
Build และ TypeScript ผ่าน แต่ยังไม่ได้ยืนยันหน้าจอผ่าน browser หลังแก้เนื่องจาก preview ไม่พร้อม
