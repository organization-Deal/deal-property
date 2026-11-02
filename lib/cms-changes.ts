import {cmsSections,homeSectionTitles,type SiteContent} from './cms-config';
export function contentChanges(before:SiteContent,after:SiteContent){const rows:{label:string;detail:string}[]=[];const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
 if(!same(before.faqItems,after.faqItems))rows.push({label:'คำถามที่พบบ่อย',detail:'แก้คำถาม/คำตอบหรือลำดับคำถาม'});
 for(const key of new Set([...Object.keys(before.texts),...Object.keys(after.texts)])){if(same(before.texts[key],after.texts[key]))continue;const section=cmsSections.find(s=>s.fields.some(f=>f.key===key));const field=section?.fields.find(f=>f.key===key);const langs=['th','en','zh'].filter(l=>before.texts[key]?.[l as 'th']!==after.texts[key]?.[l as 'th']);rows.push({label:section?.title||'ข้อความเว็บไซต์',detail:`${field?.label||key.slice(0,55)} · ${langs.join(', ')}`})}
 for(const key of new Set([...Object.keys(before.images),...Object.keys(after.images)]))if(before.images[key]!==after.images[key]){const section=cmsSections.find(s=>s.images.some(i=>i.src===key));rows.push({label:section?.title||'รูปเว็บไซต์',detail:section?.images.find(i=>i.src===key)?.label||key})}
 if(!same(before.availability,after.availability))rows.push({label:'Human Allowed Rimping',detail:`มีเจ้าของแล้ว ${before.availability.ownedPercent}% → ${after.availability.ownedPercent}% · วันที่ ${after.availability.updated}`});
 for(const p of after.projects){const old=before.projects.find(o=>o.id===p.id);if(!same(old,p))rows.push({label:p.name.th,detail:old?`แก้ข้อมูลโครงการ · ${p.hidden?'ซ่อน':p.status}`:'เพิ่มโครงการใหม่ · '+(p.hidden?'ซ่อน':p.status)})}
 for(const p of before.projects)if(!after.projects.some(o=>o.id===p.id))rows.push({label:p.name.th,detail:'นำโครงการออกจากรายการ'});
 if(!same(before.projects.map(p=>p.id),after.projects.map(p=>p.id)))rows.push({label:'รายการโปรเจกต์',detail:'เพิ่ม/เปลี่ยนลำดับรายการ'});
 if(!same(before.homeLayout,after.homeLayout))rows.push({label:'หน้าแรก',detail:'ลำดับและการแสดงส่วน: '+after.homeLayout.filter(s=>s.visible).map(s=>homeSectionTitles[s.id]).join(' → ')});
 if(!same(before.appearance,after.appearance)||before.density!==after.density)rows.push({label:'รูปแบบเว็บไซต์',detail:'ปรับรูปแบบร่วมทั้งเว็บ'});
 return rows;
}
