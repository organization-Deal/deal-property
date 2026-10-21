// Executes the actual route handlers against an in-memory SQLite D1 adapter.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');const ts=require('typescript');
const root=path.resolve(__dirname,'..');const sqlite=new DatabaseSync(':memory:');
sqlite.exec(fs.readFileSync(path.join(root,'migrations/20261021_admin.sql'),'utf8'));
function statement(sql,values=[]){return {bind(...v){return statement(sql,v.map(x=>x instanceof ArrayBuffer?new Uint8Array(x):x))},async first(){return sqlite.prepare(sql).get(...values)||null},async all(){return {results:sqlite.prepare(sql).all(...values)}},async run(){return sqlite.prepare(sql).run(...values)},sql,values};}
const env={DB:{prepare:statement,async batch(list){sqlite.exec('BEGIN');try{const rows=list.map(s=>{const prepared=sqlite.prepare(s.sql);return /RETURNING|^SELECT/i.test(s.sql)?{results:prepared.all(...s.values)}:{results:[],meta:prepared.run(...s.values)}});sqlite.exec('COMMIT');return rows}catch(e){sqlite.exec('ROLLBACK');throw e}}},ADMIN_PASSWORD:'test-only-not-a-real-secret-2026'};
const cache=new Map();function load(file){file=path.resolve(root,file);if(cache.has(file))return cache.get(file).exports;const mod={exports:{}};cache.set(file,mod);const src=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',src)((id)=>{if(id==='cloudflare:workers')return {env};if(id.startsWith('@/'))return load(id.slice(2)+'.ts');return require(id)},mod,mod.exports);return mod.exports;}
const session=load('app/api/admin/session/route.ts'),content=load('app/api/admin/content/route.ts'),publicContent=load('app/api/content/route.ts'),events=load('app/api/events/route.ts'),stats=load('app/api/admin/stats/route.ts'),media=load('app/api/admin/media/route.ts'),serveMedia=load('app/api/media/[id]/route.ts');
let cookie='';function req(route,method='GET',data,origin='https://test.local'){return new Request('https://test.local'+route,{method,headers:{origin,cookie,'Content-Type':'application/json','cf-connecting-ip':'192.0.2.1'},...(data===undefined?{}:{body:JSON.stringify(data)})})}
(async()=>{
 assert.equal((await content.GET(req('/api/admin/content'))).status,401);
 assert.equal((await stats.GET(req('/api/admin/stats'))).status,401);
 assert.equal((await session.POST(req('/api/admin/session','POST',{password:env.ADMIN_PASSWORD},'https://other.local'))).status,403);
 assert.equal((await session.POST(req('/api/admin/session','POST',{password:'wrong'}))).status,401);
 const login=await session.POST(req('/api/admin/session','POST',{password:env.ADMIN_PASSWORD}));assert.equal(login.status,200);assert.match(login.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Strict/);cookie=login.headers.get('set-cookie').split(';')[0];
 assert.equal((await (await session.GET(req('/api/admin/session'))).json()).authenticated,true);
 const draft={texts:{'เราดูแลให้':{th:'ทีมดูแลบ้าน',en:'We care for your home',zh:'我们照顾您的房屋'}},images:{},density:'compact'};
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:0,content:draft}))).status,200);
 assert.deepEqual(await (await publicContent.GET()).json(),{});
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'save',revision:0,content:draft}))).status,409);
 assert.equal((await content.POST(req('/api/admin/content','POST',{action:'publish',revision:1}))).status,200);
 assert.deepEqual(await (await publicContent.GET()).json(),draft);
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
 const s=await (await stats.GET(req('/api/admin/stats?days=7'))).json();assert.equal(s.totals.views,1);assert.equal(s.totals.sessions,1);assert.equal(s.clicks[0].value,1);
 const form=new FormData();form.append('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9p8AAAAASUVORK5CYII=','base64')],'test.png',{type:'image/png'}));
 const upload=await media.POST(new Request('https://test.local/api/admin/media',{method:'POST',headers:{origin:'https://test.local',cookie},body:form}));assert.equal(upload.status,200);const uploaded=await upload.json();const image=await serveMedia.GET(req(uploaded.url));assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');assert.ok((await image.arrayBuffer()).byteLength>12);
 assert.equal((await session.DELETE(req('/api/admin/session','DELETE'))).status,200);assert.equal((await content.GET(req('/api/admin/content'))).status,401);
 for(let i=0;i<8;i++)await session.POST(req('/api/admin/session','POST',{password:'wrong'}));
 assert.equal((await session.POST(req('/api/admin/session','POST',{password:'wrong'}))).status,429);
 console.log('PASS: auth/CSRF/logout/rate limit; draft isolation; publish persistence; stale-version rejection; unsafe content rejection; analytics aggregation; image upload/read.');
})().catch(e=>{console.error(e);process.exit(1)});
