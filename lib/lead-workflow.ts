import {z} from 'zod';
export const leadStatuses={new:'รับเรื่องใหม่',contacted:'ติดต่อแล้ว',following:'ติดตามต่อ',won:'ปิดการขาย',lost:'ไม่ดำเนินการ'} as const;
export const workflowSchema=z.object({id:z.string().min(1).max(200),revision:z.number().int().min(0),status:z.enum(['new','contacted','following','won','lost']),assignee:z.string().trim().max(100),notes:z.string().trim().max(5000)}).strict();
export function csvCell(value:unknown){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
