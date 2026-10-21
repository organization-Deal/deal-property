# DEAL! House Admin — v1 (21 October 2026)

ชุดโค้ดอัปเดตสำหรับ repository เว็บบ้าน Human Allowed เดิม ไม่ใช่เว็บไซต์ standalone
รวม UI เดิม v3 และแก้ชื่อ v4 แล้ว ไม่รวมเว็บไซต์ตู้ชกมวยและไม่เพิ่มหน้าจัดการ Lead
ยังไม่ได้ deploy หรือเปลี่ยนข้อมูลใน D1 production ของคุณ

## เปิดใช้งาน 3 ขั้นตอน
1. แตก ZIP แล้ววาง app / lib / migrations / tests ทับใน root ของ repository เดิม โดยคงไฟล์อื่นไว้ หากมีงานใหม่ในไฟล์เดียวกันหลัง ZIP เดิม ต้อง merge ก่อน
2. ใน D1 ฐานข้อมูลเดิมของเว็บบ้าน รัน SQL ทั้งไฟล์ migrations/20261021_admin.sql หนึ่งครั้ง (รันซ้ำได้) ตาราง enquiries เดิมไม่ถูกแก้หรือลบ สามารถวาง SQL ใน D1 Console ของฐานข้อมูลที่ใช้งานจริงได้ ไม่ต้องเปลี่ยน Database ID หรือ DB binding
3. ตั้ง Worker Secret ชื่อ ADMIN_PASSWORD เป็นรหัสสุ่มยาวอย่างน้อย 16 ตัวอักษร (แนะนำ 32 ตัวอักษร) ด้วยตัวเอง ห้าม commit รหัสใน GitHub จากนั้น deploy โค้ดและเปิด https://โดเมนเว็บบ้านของคุณ/admin

ระบบต้องใช้ HTTPS เพื่อให้ session cookie แบบ Secure ทำงาน
ไม่มีรหัสผ่านเริ่มต้น หากไม่ตั้ง secret ระบบจะปฏิเสธ login
ชื่อ secret นี้เป็นรหัสผู้ดูแลหนึ่งชุดสำหรับเจ้าของเว็บ รอบนี้ยังไม่มีบัญชีพนักงาน/แยกบทบาท/MFA
หากต้องการยกเลิก session ทุกอุปกรณ์ ให้รัน DELETE FROM admin_sessions; ใน D1 จากนั้นตั้งรหัสใหม่ตามต้องการ
ไม่ต้องส่งรหัสผ่านในแชต

## ฟีเจอร์ที่ทำแล้ว
- /admin: ล็อกอิน 8 ชั่วโมง, HttpOnly/Secure/SameSite session cookie, จำกัด login 10 ครั้งต่อ IP ต่อ 15 นาที, ตรวจ origin สำหรับคำสั่งเขียน, ตรวจ session ฝั่ง API
- Dashboard: 7/30/90 วัน, จำนวนเปิดหน้า, เซสชัน, คลิก, กราฟรายวันเวลาไทย, หน้ายอดนิยม, แหล่งที่มา, อุปกรณ์, scroll 25/50/75/100%
- Event tracking: เปิดหน้า คลิก navigation/project/enquiry/share และระดับการเลื่อน หลังผู้เข้าชมอนุญาตเท่านั้น ไม่เก็บข้อความฟอร์ม ไม่เก็บ query string หรือ referrer เต็ม ไม่เก็บ Lead
- สถิติคือเหตุการณ์จาก browser ไม่ใช่รายงานบัญชี/จำนวนบุคคลหรือข้อมูลที่ตรวจว่าเป็นมนุษย์ทั้งหมด อาจมี bot หรือ event ที่ปลอมส่งได้ หน้าแอดมินและ cms-preview ไม่นับ
- เคารพ Do Not Track; ผู้ใช้เปลี่ยนความยินยอมได้จากปุ่ม Privacy ด้านล่าง; session เป็น browser tab/session ไม่ใช่ unique person; การลบ event เก่ากว่า 90 วันทำเมื่อมี event ใหม่
- CMS ข้อความ 18 รายการที่กำหนดไว้: hero, ข้อความแนะนำ, CTA, หัวข้อโครงการ, workflow และผลงาน ทั้ง TH/EN/ZH
- CMS รูปหลักบ้านและรูปผลงานในส่วนรู้จัก DEAL!: ใช้ HTTPS URL หรืออัปโหลด PNG/JPEG/WebP สูงสุด 500 KB ต่อรูป เก็บใน D1 เดิมสำหรับการใช้งานเบื้องต้น รูปเหล่านี้เป็นสาธารณะ ห้ามอัปโหลดเอกสารส่วนตัว
- ปรับความหนาแน่น section ระหว่าง normal/compact; ไม่ใช่ page builder ลากวางอิสระ ยังไม่ได้เปิดให้เพิ่ม/ลบ/เรียงส่วน หรือแก้ทุกภาพในแกลเลอรี
- บันทึกร่าง → พรีวิวที่บันทึก → ยืนยันเผยแพร่; ระบบปฏิเสธการบันทึกทับเมื่อมีการแก้จากอีกหน้าต่างด้วย revision conflict
- ประวัติเผยแพร่ล่าสุด 20 ครั้งใน UI; เรียกคืนเป็น draft แล้วพรีวิว/เผยแพร่อีกครั้ง
- ราคา สัดส่วน สิทธิและสถานะธุรกิจไม่เปิดแก้ใน CMS นี้
- เนื้อหา CMS โหลด client-side หลังหน้าเริ่มทำงาน รอบนี้ไม่ได้เปลี่ยน SEO/OpenGraph ตาม CMS อัตโนมัติ

## วิธีทดสอบหลัง deploy
1. เข้า /admin แบบยังไม่ล็อกอิน ต้องเห็นหน้ารหัสผ่าน; เปิด /api/admin/content หรือ /api/admin/stats ต้องได้ 401
2. login ตั้งข้อความ draft แล้วบันทึก เปิดเว็บจริงในหน้าต่างใหม่ต้องยังไม่เปลี่ยน; กดพรีวิวให้เห็น draft
3. กดเผยแพร่แล้วเปิดเว็บจริงใหม่ ต้องแสดงข้อความที่เผยแพร่; ดูประวัติแล้วเรียกคืนเป็น draft และเผยแพร่เพื่อตรวจย้อนกลับ
4. อัปโหลดรูปไม่เกิน 500 KB กดบันทึกและพรีวิวก่อนเผยแพร่ รูปเดิมใน gallery อื่นไม่เปลี่ยนโดยอัตโนมัติ
5. เข้าเว็บจริง อนุญาตสถิติ เปิดหน้าโครงการ/คลิก/เลื่อน จากนั้นกลับ Dashboard ให้ตรวจจำนวนที่เพิ่มและตรวจแถว site_events ใน D1 จริง
6. บันทึกข้อมูลทดสอบให้แยกจากข้อมูลจริง; ตรวจบนมือถือและคอมก่อนส่งลูกค้า

## ผลตรวจในสภาพแวดล้อมพัฒนา
- pnpm exec tsc --noEmit: ผ่าน
- pnpm run build: ผ่าน
- node tests/admin-integration.cjs: ผ่าน โดย execute route handlers จริงกับ SQLite adapter ในหน่วยความจำ ไม่ใช่ D1 production
- ทดสอบ unauthorized/CSRF/login/logout/rate limit, draft isolation, publish persistence, stale save/publish, unsafe URL/uneditable fields rejection, analytics aggregation, image upload/read
- Browser visual QA: ยังไม่ผ่านการตรวจ เนื่องจาก supervisor พรีวิวแจ้ง vinext server เดิม /site PID14 จึงเปิดพรีวิวชุดนี้ไม่ได้ ไม่ได้ฆ่า server ของงานอื่น ไม่มี screenshot หลังแก้
- ยังไม่ได้ทดสอบ cookie login และภาพพรีวิวผ่าน browser จริง หรือการ deploy, D1 remote, migration บนบัญชีผู้ใช้

## ไฟล์
ไม่มี vite.config.ts, hosting config, wrangler config, package.json, lockfile หรือ Database ID ใน ZIP
- app/admin/admin.css
- app/admin/page.tsx
- app/admin/panel.tsx
- app/api/admin/content/route.ts
- app/api/admin/media/route.ts
- app/api/admin/session/route.ts
- app/api/admin/stats/route.ts
- app/api/content/route.ts
- app/api/events/route.ts
- app/api/media/[id]/route.ts
- app/construction.tsx
- app/controls.css
- app/desktop-layout.css
- app/enquiry-form.css
- app/enquiry-form.tsx
- app/handoff.css
- app/language.css
- app/language.tsx
- app/layout.tsx
- app/projects/human-allowed-chiang-mai/page.tsx
- app/reading-layout.css
- app/site-analytics.tsx
- app/site-content.tsx
- app/site.tsx
- lib/admin-server.ts
- lib/cms-config.ts
- lib/project.ts
- lib/translations.ts
- migrations/20261021_admin.sql
- tests/admin-integration.cjs
