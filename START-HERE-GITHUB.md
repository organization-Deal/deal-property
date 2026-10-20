# DEAL! Human Allowed — GitHub source export

ส่งออก 16 ตุลาคม 2569 จากเว็บไซต์โปรเจกต์บ้าน (ไม่ใช่เว็บตู้ชก)
Source version: 36
Source commit: 64730f039e6a6c7c74bf7447f6c184705f68c357
Website: https://deal-human-allowed.teechanaphat.chatgpt.site

## ขึ้น GitHub
1. แตก ZIP แล้วเปิดโฟลเดอร์ DEAL-Human-Allowed
2. สร้าง repository ใหม่ใน GitHub
3. นำไฟล์และโฟลเดอร์ทั้งหมดในนี้ขึ้นเป็น root ของ repository รวม .gitignore, .npmrc และ .openai/hosting.json
4. หากใช้ Git บนเครื่อง ให้รันจากโฟลเดอร์นี้:

```bash
git init
git add .
git commit -m "Import DEAL Human Allowed website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## รันและ build
ใช้ Node.js >=22.13 และ pnpm ตาม packageManager ใน package.json (11.25.0)

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

ใช้ README.md สำหรับรายละเอียดของ Vinext/Cloudflare และคำสั่ง migration

## โครงสร้าง
- app/: หน้าเว็บบ้าน หน้าโครงการ เครื่องคำนวณ สามภาษา ฟอร์ม และ API
- public/assets/: รูปบ้านจริง รูประหว่างก่อสร้าง แปลน โลโก้ ฟอนต์ และวิดีโอ
- db/ และ drizzle/: schema และ SQL migrations
- build/, scripts/, vite.config.ts: เครื่องมือ build และ runtime
- pnpm-lock.yaml: dependency lockfile
- HANDOFF.md / CONTENT_NOTES.md: บันทึกการส่งมอบและที่มาข้อมูล บางรายการเป็นบันทึกย้อนหลัง ให้ดูโค้ดล่าสุดประกอบ

## การนำขึ้นใช้งานจริง
นี่คือซอร์สโค้ด ไม่ใช่เว็บ HTML ที่ใช้ GitHub Pages ได้ทันที เพราะมี API รับลีดและ Cloudflare D1
การนำขึ้น GitHub ไม่ได้ย้ายโฮสติ้ง ฐานข้อมูล หรือข้อมูลลีดเดิม
ต้องตั้งค่า Cloudflare Workers/D1 หรือโฮสต์ที่รองรับ runtime นี้ และผูกฐานข้อมูลชื่อ DB พร้อมใช้ migrations ตามลำดับ
vite.config.ts มี database ID ตัวอย่างสำหรับ local development ต้องกำหนดฐานข้อมูล production ของคุณก่อน deploy
.openai/hosting.json เก็บ Site ID เดิมเพื่ออ้างอิง เป็น metadata ไม่ใช่รหัสลับ อย่านำไปผูกโครงการอื่นโดยไม่ได้ตั้งค่าใหม่
ไม่มี node_modules, build output, Git history, รหัสลับ, .env หรือข้อมูลฐานข้อมูลลูกค้าใน ZIP

## ขอบเขตการตรวจไฟล์ส่งออก
ตรวจว่า commit ตรงกับ Site version 36, รวมไฟล์ tracked source และ assets, ตรวจรูปแบบ credential ที่พบบ่อย และตรวจความสมบูรณ์ ZIP
ไม่ได้ติดตั้ง dependencies ใหม่หรือทดสอบ deploy ไป GitHub/Cloudflare บัญชีใหม่ในขั้นตอนส่งออกนี้
