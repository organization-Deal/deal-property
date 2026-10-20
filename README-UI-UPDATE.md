# DEAL! / Human Allowed — UI Update (20 October 2026)

## วิธีใช้งาน
ไฟล์นี้เป็นชุดอัปเดตเฉพาะไฟล์ที่แก้ ไม่ใช่เว็บไซต์เต็มที่เปิดใช้งานเดี่ยวได้
แตก ZIP แล้วนำโฟลเดอร์ app และ lib ไปวางทับใน root ของ repository เว็บไซต์บ้านเดิม โดยรักษาไฟล์อื่นทั้งหมดไว้
สำรองหรือ commit งานเดิมก่อนวางทับ หากไฟล์เดียวกันถูกแก้หลังส่งออก ZIP ต้นฉบับ ให้ merge การเปลี่ยนแปลงก่อน
ไม่มีไฟล์ตั้งค่า Cloudflare, Database ID, deployment, dependencies หรือ schema ในชุดนี้ จึงไม่ทับการตั้งค่าที่แก้ไว้แล้ว
ไม่เกี่ยวข้องกับเว็บไซต์ตู้ชกมวย

## สิ่งที่แก้
- โลโก้บนพื้นเข้มใช้ artwork โปร่งใสเดิมพร้อมแสดงเป็นสีขาว เอาพื้นรองและเงาออก
- native select รวมถึงภาษาและฟอร์มใช้พื้นเรียบ เส้นบาง และ chevron เดียว
- คง native keyboard interaction และฟอร์ม 2 คอลัมน์บน Desktop / 1 คอลัมน์บนมือถือ
- ปุ่มแชร์ใช้รูปแบบปุ่ม enquiry พร้อมไอคอนและข้อความ และ fallback คัดลอกเมื่อ native share ใช้ไม่ได้
- กรอบไอคอน workflow ขนาดคงที่ ไม่หดใน flex และใช้ขนาด/น้ำหนักเส้นร่วมกัน
- ปรับการตัดบรรทัดชื่อโครงการบน Desktop
- ชื่อโครงการริมปิงที่เปิดรับอยู่แสดง Human Allowed Rimping โดยไม่เปลี่ยน ID, URL, สถานะ หรือข้อมูลการเงิน
- คง API, D1 schema, กฎฟอร์ม, ตัวเลือก และการคำนวณเดิม

## ผลตรวจ
ผ่าน: production build (pnpm run build), TypeScript, สูตรราคา 10%=171,200 / 13%=222,560 / ทั้งหลัง=1,712,000 บาท
ผ่าน: การตรวจ payload ฟอร์ม, ปฏิเสธสัดส่วนเกิน 60%, consent บังคับ, ชื่อแบรนด์และ URL ภาษาไทย/อังกฤษ/จีน
ผ่านระดับ logic: คัดลอกเมื่อไม่มี native share, fallback เมื่อ share ล้มเหลว, ไม่คัดลอกเมื่อผู้ใช้ยกเลิก

ยังตรวจไม่ได้: preview browser เชื่อมต่อไม่ได้ (ERR_CONNECTION_REFUSED) จึงไม่มีภาพหลังแก้ และยังไม่ยืนยัน visual QA ที่ 390/768/1280/1440 px หรือ Chrome/Safari
ยังตรวจไม่ได้: interaction เปลี่ยนภาษาและส่งฟอร์มผ่าน browser จริง รวมถึงการตรวจ record ใน D1 จริง ไม่ถือว่าทดสอบ end-to-end ผ่าน
ต้องทดสอบใน staging ก่อนนำขึ้น production โดยส่ง lead ทดสอบและตรวจ record จริง พร้อมลบข้อมูลทดสอบหลังตรวจ

## รอข้อมูลยืนยัน
- Human Around (1): ข้อมูลเดิมไม่ได้ยืนยันทำเล จึงยังไม่เปลี่ยนเป็น Chiang Mai Gate หรือ Airport
- Human Allowed (2): มีเพียงอำเภอเมืองเชียงใหม่ จึงยังไม่จับคู่ทำเล
- ต้องยืนยันสองโครงการนี้จากเจ้าของข้อมูลก่อนเปลี่ยนชื่อทุกภาษาและ metadata
- ไม่มี moodboard ที่ตรวจสอบใช้ได้ในรอบนี้ จึงไม่ได้สร้างเอกลักษณ์ทำเลใหม่หรือเพิ่มภาพอ้างอิงเป็นภาพทรัพย์สิน

## ไฟล์ที่แก้
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
