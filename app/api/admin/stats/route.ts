import {db,guard,json} from '@/lib/admin-server';
export async function GET(req:Request){try{const denied=await guard(req);if(denied)return denied;const days=Number(new URL(req.url).searchParams.get('days')||7);if(![7,30,90].includes(days))return json({error:'Invalid range'},400);const since=Date.now()-days*86400000;const queries=[
"SELECT count(*) views,count(DISTINCT session) sessions FROM site_events WHERE kind='page' AND created_at>=?",
"SELECT date(created_at/1000,'unixepoch','+7 hours') label,count(*) value FROM site_events WHERE kind='page' AND created_at>=? GROUP BY label ORDER BY label",
"SELECT path label,count(*) value FROM site_events WHERE kind='page' AND created_at>=? GROUP BY path ORDER BY value DESC",
"SELECT target label,count(*) value FROM site_events WHERE kind='click' AND created_at>=? GROUP BY target ORDER BY value DESC",
"SELECT source label,count(DISTINCT session) value FROM site_events WHERE kind='page' AND created_at>=? GROUP BY source",
"SELECT device label,count(DISTINCT session) value FROM site_events WHERE kind='page' AND created_at>=? GROUP BY device",
"SELECT target label,count(DISTINCT session) value FROM site_events WHERE kind='scroll' AND created_at>=? GROUP BY target ORDER BY CAST(target AS INTEGER)"
];const results=await db().batch(queries.map(q=>db().prepare(q).bind(since)));return json({totals:results[0].results[0],daily:results[1].results,pages:results[2].results,clicks:results[3].results,sources:results[4].results,devices:results[5].results,scroll:results[6].results});}catch{return json({error:'อ่านสถิติไม่ได้ ตรวจ migration และ DB'},503);}}
