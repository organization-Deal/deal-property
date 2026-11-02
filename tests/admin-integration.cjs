// Executes the actual route handlers against an in-memory SQLite D1 adapter.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const root=path.resolve(__dirname,'..');const sqlite=new DatabaseSync(':memory:');
// Start with an empty database to verify automatic bootstrap.
function statement(sql,values=[]){return {bind(...v){return statement(sql,v.map(x=>x instanceof ArrayBuffer?new Uint8Array(x):x))},async first(){return sqlite.prepare(sql).get(...values)||null},async all(){return {results:sqlite.prepare(sql).all(...values)}},async run(){return sqlite.prepare(sql).run(...values)},sql,values};}
const env={DB:{prepare:statement,async batch(list){sqlite.exec('BEGIN');try{const rows=list.map(s=>{const prepared=sqlite.prepare(s.sql);return /RETURNING|^SELECT|^WITH/i.test(s.sql)?{results:prepared.all(...s.values)}:{results:[],meta:prepared.run(...s.values)}});sqlite.exec('COMMIT');return rows}catch(e){sqlite.exec('ROLLBACK');throw e}}},ADMIN_PASSWORD:'test-only-not-a-real-secret-2026'};
const cache=new Map();function load(file){file=path.resolve(root,file);if(cache.has(file))return cache.get(file).exports;const mod={exports:{}};cache.set(file,mod);const src=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',src)((id)=>{if(id==='cloudflare:workers')return {env};if(id.startsWith('.'))return load(path.resolve(path.dirname(file),id)+'.ts');if(id.startsWith('@/'))return load(id.slice(2)+'.ts');return require(id)},mod,mod.exports);return mod.exports;}
const leads=load('app/api/admin/leads/route.ts'),submit=load('app/api/enquiries/route.ts');
const session=load('app/api/admin/session/route.ts'),content=load('app/api/admin/content/route.ts'),publicContent=load('app/api/content/route.ts'),events=load('app/api/events/route.ts'),stats=load('app/api/admin/stats/route.ts'),media=load('app/api/admin/media/route.ts'),serveMedia=load('app/api/media/[id]/route.ts');
let cookie='';function req(route,method='GET',data,origin='https://test.local'){return new Request('https://test.local'+route,{method,headers:{origin,cookie,'Content-Type':'application/json','cf-connecting-ip':'192.0.2.1'},...(data===undefined?{}:{body:JSON.stringify(data)})})}
(async()=>{
 assert.equal((await content.GET(req('/api/admin/content'))).status,401);
 assert.equal((await stats.GET(req('/api/admin/stats'))).status,401);
 assert.equal((await session.POST(req('/api/admin/session','POST',{password:env.ADMIN_PASSWORD},'https://other.local'))).status,403);
 assert.equal((await session.POST(req('/api/admin/session','POST',{password:'wrong'}))).status,401);
 const login=await session.POST(req('/api/admin/session','POST',{password:env.ADMIN_PASSWORD}));assert.equal(login.status,200);assert.match(login.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Strict/);cookie=login.headers.get('set-cookie').split(';')[0];
 assert.equal((await (await session.GET(req('/api/admin/session'))).json()).authenticated,true);
 const payload={name:'TEST Lead',phone:'0800000000',project:'human-allowed-chiang-mai',ownership:'co-owner',purpose:'details',contactTime:'any',sharePct:13,consent:true,requestId:crypto.randomUUID()};
 const sent=await submit.POST(req('/api/enquiries','POST',payload));assert.equal(sent.status,201);const ref=(await sent.json()).id;
 assert.ok(sqlite.prepare('SELECT * FROM enquiries WHERE id=?').get(ref));
 assert.equal((await (await submit.POST(req('/api/enquiries','POST',payload))).json()).id,ref);
 assert.equal(sqlite.prepare('SELECT count(*) n FROM enquiries').get().n,1);
 let listing=await (await leads.GET(req('/api/admin/leads'))).json();assert.equal(listing.total,1);assert.equal(listing.items[0].id,ref);assert.match(listing.items[0].message,/222,560/);
 const patch={id:ref,revision:0,status:'contacted',assignee:'TEST Sales',notes:'TEST note'};
 assert.equal((await leads.PATCH(req('/api/admin/leads','PATCH',patch))).status,200);
 assert.equal((await leads.PATCH(req('/api/admin/leads','PATCH',patch))).status,409);
 assert.equal((await leads.PATCH(req('/api/admin/leads','PATCH',{...patch,revision:1,notes:'TEST updated'}))).status,200);
 assert.equal((await (await leads.GET(req('/api/admin/leads?status=contacted&q=TEST'))).json()).total,1);
 assert.equal((await (await leads.GET(req('/api/admin/leads?status=new'))).json()).total,0);
 const csv=await leads.GET(req('/api/admin/leads?export=csv'));assert.equal(csv.status,200);assert.match(await csv.text(),/TEST Lead/);
 assert.equal((await submit.POST(req('/api/enquiries','POST',{...payload,consent:false}))).status,400);
 const draft={texts:{'เราดูแลให้':{th:'ทีมดูแลบ้าน',en:'We care for your home',zh:'我们照顾您的房屋'}},images:{},density:'compact'};
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:0,content:draft}))).status,200);
 assert.deepEqual(await (await publicContent.GET()).json(),{});
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:0,content:draft}))).status,409);
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'publish',revision:1}))).status,200);
 assert.deepEqual(await (await publicContent.GET()).json(),load('lib/cms-config.ts').contentSchema.parse(draft));
 assert.equal((await (await content.GET(req('/api/admin/content'))).json()).history.length,1);
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'publish',revision:1}))).status,409);
 assert.equal((await (await content.GET(req('/api/admin/content'))).json()).history.length,1);
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:2,content:{...draft,images:{'/assets/house.webp':'javascript:alert(1)'}}}))).status,400);
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:2,content:{...draft,texts:{price:{th:'1',en:'1',zh:'1'}}}}))).status,400);
 const e={session:crypto.randomUUID(),kind:'page',path:'/',target:'page',source:'direct',device:'mobile'};
 assert.equal((await events.POST(req('/api/events','POST',e))).status,200);
 assert.equal((await events.POST(req('/api/events','POST',{...e,kind:'click',target:'project'}))).status,200);
 assert.equal((await events.POST(req('/api/events','POST',{...e,path:'/admin'}))).status,400);
 assert.equal((await events.POST(req('/api/events','POST',{...e,kind:'scroll',target:'project'}))).status,400);
 const s=await (await stats.GET(req('/api/admin/stats?days=7'))).json();assert.equal(s.leads.total,1);assert.equal(s.totals.views,1);assert.equal(s.totals.sessions,1);assert.equal(s.clicks[0].value,1);
 const form=new FormData();form.append('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9p8AAAAASUVORK5CYII=','base64')],'test.png',{type:'image/png'}));
 const upload=await media.POST(new Request('https://test.local/api/admin/media',{method:'POST',headers:{origin:'https://test.local',cookie},body:form}));assert.equal(upload.status,200);const uploaded=await upload.json();const image=await serveMedia.GET(req(uploaded.url));assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');assert.ok((await image.arrayBuffer()).byteLength>12);

 const advanced=load('app/api/analytics/events/route.ts'),report=load('app/api/admin/analytics/route.ts');
 const sid=crypto.randomUUID(),pageId=crypto.randomUUID();
 let seq=0;const baseTime=Date.now()-10000;
 async function track(kind,target,extra={}){const e={id:crypto.randomUUID(),session:sid,pageId,kind,target,path:'/',source:'facebook',medium:'paid',campaign:'rimping_nov',device:'mobile',value:0,...extra};const request=req('/api/analytics/events','POST',e);Object.defineProperty(request,'cf',{value:{country:'TH',region:'Chiang Mai',city:'Chiang Mai'}});const response=await advanced.POST(request);assert.equal(response.status,200);sqlite.prepare('UPDATE analytics_events_v2 SET created_at=? WHERE id=?').run(baseTime+(++seq)*100,e.id);return e;}
 const first=await track('page','page');
 const retry=req('/api/analytics/events','POST',first);assert.equal((await advanced.POST(retry)).status,200);
 assert.equal(sqlite.prepare('SELECT count(*) n FROM analytics_events_v2 WHERE id=?').get(first.id).n,1);
 await track('page','page',{path:'/projects/human-allowed-chiang-mai'});await track('click','enquiry');await track('form_start','enquiry');await track('form_success','enquiry');await track('share_select','co-owner',{value:13});await track('engagement','active_seconds',{value:15});await track('performance','load_ms',{value:800});
 const rpt=await report.GET(req('/api/admin/analytics?days=7&country=TH&source=facebook'));assert.equal(rpt.status,200);const rd=await rpt.json();assert.equal(rd.totals.sessions,1);assert.equal(rd.totals.views,2);assert.equal(rd.totals.completed,1);assert.equal(rd.totals.activeSeconds,15);assert.equal(rd.regions[0].label,'TH / Chiang Mai');assert.equal(rd.campaigns[0].label,'rimping_nov');assert.deepEqual(rd.funnel.map(r=>r.value),[1,1,1,1,1]);assert.equal(rd.performance.avgMs,800);
 const timeline=await (await report.GET(req('/api/admin/analytics?days=7&session='+sid))).json();assert.equal(timeline.timeline.length,8);
 const empty=await (await report.GET(req('/api/admin/analytics?country=US'))).json();assert.equal(empty.totals.sessions,0);
 assert.equal((await report.GET(req('/api/admin/analytics?start=2026-02-30&end=2026-03-01'))).status,400);
 const exported=await report.GET(req('/api/admin/analytics?export=csv'));assert.equal(exported.status,200);assert.match(await exported.text(),/Chiang Mai/);
 const {campaignLabel}=load('lib/analytics-contract.ts');assert.equal(campaignLabel('private@example.com'),'');assert.equal(campaignLabel('0800000000'),'');assert.equal(campaignLabel('rimping_nov'),'rimping_nov');
 assert.equal((await advanced.POST(req('/api/analytics/events','POST',{...first,id:crypto.randomUUID(),country:'US'}))).status,400);
 const geo=load('lib/request-geo.ts');assert.equal(geo.requestGeo(req('/')).country,'');
 const next={...draft,availability:{ownedPercent:80,updated:'2026-11-02'}};
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:2,content:next}))).status,200);
 assert.equal((await publicContent.GET()).status,200);
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'publish',revision:3}))).status,200);
 assert.equal((await (await publicContent.GET()).json()).availability.ownedPercent,80);
 assert.equal((await submit.POST(req('/api/enquiries','POST',{...payload,requestId:crypto.randomUUID(),sharePct:30}))).status,400);
 assert.equal((await submit.POST(req('/api/enquiries','POST',{...payload,requestId:crypto.randomUUID(),sharePct:20}))).status,201);
 const schema=load('lib/cms-config.ts').contentSchema;
 assert.equal(schema.safeParse({...next,availability:{ownedPercent:101,updated:'2026-11-02'}}).success,false);
 assert.equal(schema.safeParse({...next,availability:{ownedPercent:80,updated:'2026-02-30'}}).success,false);
 console.log('PASS: availability save/publish, limits on actual lead endpoint, invalid percentage/date rejection');
 assert.equal((await session.DELETE(req('/api/admin/session','DELETE'))).status,200);assert.equal((await content.GET(req('/api/admin/content'))).status,401);
 for(let i=0;i<8;i++)await session.POST(req('/api/admin/session','POST',{password:'wrong'}));
 assert.equal((await session.POST(req('/api/admin/session','POST',{password:'wrong'}))).status,429);
 assert.equal((await leads.GET(req('/api/admin/leads'))).status,401);
 assert.equal((await report.GET(req('/api/admin/analytics'))).status,401);
 console.log('PASS: geo metadata; event idempotency; ordered funnel; campaign/geo filters; timeline; CSV;  empty DB bootstrap; actual form -> persisted lead -> admin read; retries deduplicated; workflow CAS; filters/CSV;  auth/CSRF/logout/rate limit; draft isolation; publish persistence; stale-version rejection; unsafe content rejection; analytics aggregation; image upload/read.');
})().catch(e=>{console.error(e);process.exit(1)});
