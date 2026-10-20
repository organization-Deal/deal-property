// Non-browser checks: server-rendered pages and real SQLite with the production route.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  if (name.startsWith('@/')) name = path.join(root, name.slice(2));
  return originalResolve.call(this, name, parent, ...rest);
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  module._compile(result.outputText, filename);
};
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks++; };
async function main() {
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const pages = require('../app/site.tsx');
  const routeSet = new Set(['/', '/projects', '/projects/human-allowed-chiang-mai', '/privacy']);
  for (const name of ['HomePage', 'ProjectsPage', 'ProjectPage', 'PrivacyPage']) {
    const html = renderToString(React.createElement(pages[name]));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    check(ids.length === new Set(ids).size, `${name}: unique IDs`);
    check(html.includes('DEAL!') && html.includes('id="main"'), `${name}: rendered content`);
    if(name!=='PrivacyPage')check(html.includes('aria-valuenow="40"')&&html.includes('เหลือเปิดรับ'),'ownership availability shown');
    if(name==='HomePage'||name==='ProjectsPage')check(html.includes('Coming Soon.')&&html.includes('ยังไม่เปิดให้เป็นเจ้าของ'),'upcoming project clearly unavailable');
    if(name==='HomePage'||name==='ProjectsPage'){
      check(!html.includes('class="mobile-action '),'no floating enquiry dock covering project listing');
      check(html.includes('class="project-rail"')&&html.includes('เลื่อนโครงการไปทางขวา'),'current and upcoming in horizontal rail');
      check(html.includes('coming-photo')&&html.includes('ยังไม่ใช่แบบยืนยันของโครงการใหม่'),'grayscale teaser with illustrative image label');
      check(!html.includes('id="upcoming-title"'),'no separate stacked upcoming section');
    }
    for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) check(fs.existsSync(path.join(root, 'public', asset)), `${name}: asset ${asset}`);
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith('#')) check(ids.includes(href.slice(1)), `${name}: anchor ${href}`);
      else if (href.startsWith('/') && !href.startsWith('/assets/')) check(routeSet.has(new URL(href.replaceAll('&amp;','&'),'https://example.test').pathname), `${name}: route ${href}`);
    }
    if (name === 'ProjectPage') {
      check(html.includes('class="summary-panel"'),'overview has a bounded summary panel');
      check(html.includes('คำนวณสัดส่วนที่สนใจ')&&!html.includes('เริ่มต้นร่วมกัน'),'compact calculator heading');
      check(html.includes('calculator-availability'),'calculator retains remaining ownership context');
      check(html.includes('lucide-wallet')&&html.includes('lucide-headset'),'brief icons paired with labels');
      check(html.includes('171,200') && html.includes('1,712,000'), 'source prices present');
      check(html.includes('share-calculator') && html.includes('เลือกเปอร์เซ็นต์ด่วน'), 'custom share calculator rendered');
      check(html.indexOf('id="ownership"')<html.indexOf('id="house"'), 'ownership before house details');
      check(!html.includes('id="construction"')&&!html.includes('href="#construction"')&&!html.includes('Human Around (1)'),'other projects and proof tab excluded from project detail');
      check(html.includes('เงินที่จ่าย ซื้ออะไร?')&&html.includes('เงื่อนไขที่ต้องชัด ก่อนชำระเงิน'),'investor decision brief');
      check(!html.includes('รู้ครบ ก่อนเป็นเจ้าของ'),'no overclaim of complete terms');
      check(!html.includes('detail-switcher') && (html.match(/class="detail-row"/g)||[]).length===4,'four direct accordion categories without duplicate navigation');
      check((html.match(/hidden=""/g)||[]).length>=3,'inactive detail categories collapsed on initial render');
      check(html.includes('ค่าเช่าบ้าน / ที่ดิน')&&html.includes('ความเสี่ยงที่ควรพิจารณา'),'cost and risk details retained');
      check(!html.includes('รายเดือนและรายไตรมาส') && !html.includes('ฟรีค่าเช่า 1 ปี'), 'no unresolved public promotional claim');
      check(html.includes('ค่าบริหาร') && html.includes('ไม่รวมกรรมสิทธิ์ที่ดิน'), 'material terms visible');
    }
  }
  const { ownershipPrice, PROJECT, parseShare } = require('../lib/project.ts');
  check(ownershipPrice('whole') === PROJECT.fullPrice, 'whole price');
  check(PROJECT.remainingPercent===60,'remaining ownership from owner update');
  const {ComingSoonCard}=require('../app/project-availability.tsx');
  const teaser=renderToString(React.createElement(ComingSoonCard));
  check(!teaser.includes('<button')&&!teaser.includes('<a '),'coming soon has no purchase or enquiry action');
  check(ownershipPrice('co-owner') === PROJECT.startingPrice, 'co-owner starting price');
  check(ownershipPrice('co-owner',13)===222560,'13 percent price');
  check(ownershipPrice('co-owner',20)===342400 && ownershipPrice('co-owner',30)===513600,'preset prices');
  check(ownershipPrice('co-owner',13.25)===226840,'decimal price');
  check(parseShare('13.05')===13.05 && ownershipPrice('co-owner',13.05)===223416,'decimal with internal zero');
  const {OwnershipPicker}=require('../app/ownership-picker.tsx');
  const wholePicker=renderToString(React.createElement(OwnershipPicker,{selection:{ownership:'whole'},onChange:()=>{},onEnquire:()=>{}}));
  check(wholePicker.includes('ยังไม่เปิดให้เลือก 100%')&&!wholePicker.includes('data-enquiry-action'),'whole value is reference only, no purchase enquiry CTA');
  const excessivePicker=renderToString(React.createElement(OwnershipPicker,{selection:{ownership:'co-owner',sharePct:61},onChange:()=>{},onEnquire:()=>{}}));
  check(excessivePicker.includes('disabled=""')&&excessivePicker.includes('aria-invalid="true"'),'unavailable percentage disables request and exposes error');
  const catalog=renderToString(React.createElement(pages.ProjectsPage));
  check(!catalog.includes('deal-favorite')&&!catalog.includes('บันทึกโครงการ')&&!catalog.includes('ค้นหาโครงการ'),'catalog avoids unused saved/search controls');
  const pickerSource=fs.readFileSync(path.join(root,'app/ownership-picker.tsx'),'utf8');
  check(!pickerSource.includes('useEffect('),'draft percentage is not normalized while typing');
  check(/shareInvalid:\s*next\s*===\s*null/.test(pickerSource),'invalid draft propagates to dock');
  for(const invalid of ['', '9.99','100.01','13.333','abc','NaN'])check(parseShare(invalid)===null,'invalid percentage '+invalid);
  check(parseShare('100')===100 && parseShare('13,25')===13.25,'boundary and decimal parsing');
  const { EnquiryForm } = require('../app/enquiry-form.tsx');
  for (const purpose of ['details', 'plans', 'visit']) {
    const html = renderToString(React.createElement(EnquiryForm, { initial: { purpose, ownership: 'whole' } }));
    check(html.includes('value="whole" selected=""'), `form preserves whole mode: ${purpose}`);
    check(html.includes('name="visitDate"') === (purpose === 'visit'), `visit date shown only for visit: ${purpose}`);
  }
  const customForm=renderToString(React.createElement(EnquiryForm,{initial:{ownership:'co-owner',sharePct:13}}));
  check(customForm.includes('222,560')&&customForm.includes('value="13"'),'form preserves custom share and price');
  const { DatabaseSync } = require('node:sqlite');
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(fs.readFileSync(path.join(root, 'drizzle/0000_marvelous_william_stryker.sql'), 'utf8'));
  const { drizzle } = require('drizzle-orm/sqlite-proxy');
  let fail = false;
  const db = drizzle(async (sql, params, method) => {
    if (fail) throw new Error('simulated storage outage');
    const statement = sqlite.prepare(sql);
    if (method === 'run') { statement.run(...params); return { rows: [] }; }
    return { rows: statement.all(...params) };
  });
  const dbPath = path.join(root, 'db/index.ts');
  require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: { getDb: () => db } };
  const { POST } = require('../app/api/enquiries/route.ts');
  const url = 'https://example.test/api/enquiries';
  const base = { requestId: crypto.randomUUID(), name: 'QA fixture', phone: '0812345678', email: '', project: 'human-allowed-chiang-mai', ownership: 'co-owner', purpose: 'details', visitDate: '', contactTime: 'any', message: 'local test only', source: '/projects/human-allowed-chiang-mai', consent: true, website: '' };
  const send = (body, headers = {}) => POST(new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.test', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }));
  const first = await send(base); check(first.status === 201, 'valid enquiry saved');
  const firstBody = await first.json();
  const retry = await send(base); check(retry.status === 201 && (await retry.json()).id === firstBody.id, 'retry returns same reference');
  check(sqlite.prepare('select count(*) as n from enquiries').get().n === 1, 'one row after duplicate request');
  const changed = await send({ ...base, message: 'changed request' }); check(changed.status === 201 && (await changed.json()).id !== firstBody.id, 'changed request is separate');
  check((await send({ ...base, phone: 'not-a-phone' })).status === 400, 'invalid phone rejected');
  check((await send({ ...base, consent: false })).status === 400, 'consent required');
  check((await send({ ...base, website: 'bot' })).status === 400, 'honeypot rejected');
  check((await send({ ...base, requestId: 'invalid' })).status === 400, 'invalid request ID rejected');
  check((await send('{bad')).status === 400, 'invalid JSON rejected');
  check((await send(base, { Origin: 'https://outside.test' })).status === 403, 'foreign origin rejected');
  check((await send(base, { 'Content-Type': 'text/plain' })).status === 415, 'wrong content type rejected');
  check((await send('a'.repeat(12001))).status === 413, 'oversized payload rejected');
  check((await send({ ...base, purpose: 'visit', visitDate: '2000-01-01' })).status === 400, 'past visit rejected');
  check((await send({ ...base, purpose: 'visit', visitDate: '2099-02-30' })).status === 400, 'invalid calendar date rejected');
  check((await send({ ...base, requestId: crypto.randomUUID(), purpose: 'visit', visitDate: '2099-02-28', phone: '+8613812345678' })).status === 201, 'future visit and international phone accepted');
  const custom=await send({...base,sharePct:13,language:'zh'});const customBody=await custom.json();
  check(custom.status===201,'custom share accepted');
  const saved=sqlite.prepare('select message from enquiries where id=?').get(customBody.id);
  check(saved.message.includes('13%')&&saved.message.includes('222,560'),'server computed share saved');
  check(saved.message.includes('Preferred language: Chinese (Simplified)'),'language preference saved for the team');
  check((await send({...base,language:'xx'})).status===400,'unsupported language rejected');
  check(customBody.id!==firstBody.id,'different share has different request reference');
  for(const sharePct of [9,100.01,13.333,'13',null])check((await send({...base,sharePct})).status===400,'invalid share rejected');
  check((await send({...base,sharePct:60})).status===201,'remaining percentage boundary accepted');
  check((await send({...base,sharePct:60.01})).status===400,'percentage exceeding remaining allocation rejected server side');
  const extended={...base,requestId:crypto.randomUUID(),name:'client supplied display name',firstName:'Li',lastName:'Wang',phone:'+85291234567',lineId:'line.contact',budget:'1m-2m',referralCode:'DEAL-42',purpose:'visit',visitDate:'2099-02-28',visitTime:'afternoon',language:'en'};
  const extendedResponse=await send(extended);check(extendedResponse.status===201,'expanded international contact form accepted');
  const extendedId=(await extendedResponse.json()).id;
  const record=sqlite.prepare('select name,message,visit_date from enquiries where id=?').get(extendedId);
  check(record.name==='Li Wang','server uses separate validated first and last names');
  check(record.message.includes('line.contact')&&record.message.includes('1m-2m')&&record.message.includes('DEAL-42')&&record.message.includes('afternoon'),'new contact fields are stored');
  check(record.visit_date==='2099-02-28','visit date retained');
  check((await (await send(extended)).json()).id===extendedId,'expanded form retry remains idempotent');
  check((await send({...extended,lastName:''})).status===400,'empty surname rejected');
  check((await send({...extended,lineId:'x'.repeat(101)})).status===400,'long LINE ID rejected');
  check((await send({...extended,budget:'bogus'})).status===400,'invalid budget rejected');
  check((await send({...extended,visitTime:'bogus'})).status===400,'invalid visit time rejected');
  fail = true; check((await send({ ...base, requestId: crypto.randomUUID() })).status === 503, 'storage failure is not reported as success');
  sqlite.close();
  console.log(`PASS: ${checks} checks. SSR pages, local assets/anchors, form prefill, production POST logic with SQLite, duplicate retries, validation and failure handling. No live customer records created. Browser and live POST not tested.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
