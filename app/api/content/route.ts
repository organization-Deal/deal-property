import {db,json} from '@/lib/admin-server';
export async function GET(){try{const row=await db().prepare('SELECT published FROM site_content WHERE id=1').first<{published:string}>();return json(row?JSON.parse(row.published):{});}catch{return json({});}}
