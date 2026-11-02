import {db,json} from '@/lib/admin-server';
export async function GET(){try{const row=await db().prepare('SELECT published FROM site_content WHERE id=1').first<{published:string}>();const value=row?JSON.parse(row.published):{};if(Array.isArray(value.projects))value.projects=value.projects.filter((p:{hidden:boolean})=>!p.hidden);return json(value);}catch{return json({});}}
