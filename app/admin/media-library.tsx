'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Check,Copy,ImagePlus,Search,Upload,Image as ImageIcon,RefreshCw} from 'lucide-react';
import {imageFields} from '@/lib/cms-config';

type MediaItem={id:string;url:string;mime:string;size:number;created_at:number};
type MediaResponse={items:MediaItem[];total:number;page:number;pageSize:number;error?:string};
type Selected={url:string;label:string;size?:number;mime?:string;created_at?:number};
type Dimensions={width:number;height:number};
const maxBytes=512000;

async function browserImage(file:File):Promise<HTMLImageElement>{
 const url=URL.createObjectURL(file);
 try{return await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('เปิดรูปนี้ไม่ได้ กรุณาใช้ JPG, PNG หรือ WebP'));image.src=url})}
 finally{URL.revokeObjectURL(url)}
}
async function canvasBlob(canvas:HTMLCanvasElement,quality:number):Promise<Blob>{
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('เตรียมรูปไม่ได้ กรุณาลองอีกรูป')),'image/webp',quality));
}
/** Rasterizes the chosen image before upload: reduces size and excludes EXIF metadata. */
export async function prepareMediaFile(file:File):Promise<File>{
 if(!/^image\/(jpeg|png|webp)$/i.test(file.type))throw new Error('รองรับ JPG, PNG และ WebP หากเป็น HEIC ให้แปลงเป็น JPG ก่อน');
 if(file.size>40*1024*1024)throw new Error('รูปต้นฉบับต้องไม่เกิน 40 MB');
 const image=await browserImage(file);
 if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth*image.naturalHeight>80000000)throw new Error('รูปมีขนาดใหญ่เกินไป กรุณาย่อรูปก่อน');
 let scale=Math.min(1,2000/Math.max(image.naturalWidth,image.naturalHeight));
 for(let pass=0;pass<5;pass++){
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const context=canvas.getContext('2d');
  if(!context)throw new Error('เบราว์เซอร์นี้เตรียมรูปไม่ได้ กรุณาใช้ Chrome หรือ Safari รุ่นปัจจุบัน');
  context.drawImage(image,0,0,canvas.width,canvas.height);
  for(const quality of [.88,.72,.55,.4]){const blob=await canvasBlob(canvas,quality);if(blob.size<=maxBytes){const extension=blob.type==='image/webp'?'webp':blob.type==='image/png'?'png':'jpg';return new File([blob],'website-image.'+extension,{type:blob.type})}}
  scale*=.75;
 }
 throw new Error('ยังย่อรูปให้ต่ำกว่า 500 KB ไม่ได้ กรุณาเลือกรูปอื่น');
}
export async function uploadMediaFile(file:File):Promise<string>{
 const prepared=await prepareMediaFile(file);const body=new FormData();body.append('file',prepared);
 const response=await fetch('/api/admin/media',{method:'POST',body});const data=await response.json() as {url?:string;error?:string};
 if(!response.ok||!data.url)throw new Error(data.error||'อัปโหลดไม่ได้ กรุณาลองใหม่');return data.url;
}
const bytesLabel=(bytes?:number)=>bytes===undefined?'':bytes<1024?bytes+' B':Math.round(bytes/1024)+' KB';

export default function MediaLibrary({onChoose,compact=false}:{onChoose?:(url:string)=>void;compact?:boolean}){
 const uid=useId(),fileInput=useRef<HTMLInputElement>(null);const [source,setSource]=useState<'uploaded'|'built-in'>('uploaded');const [search,setSearch]=useState(''),[query,setQuery]=useState(''),[page,setPage]=useState(1),[refresh,setRefresh]=useState(0);
 const [items,setItems]=useState<MediaItem[]>([]),[total,setTotal]=useState(0),[loading,setLoading]=useState(false),[uploading,setUploading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[selected,setSelected]=useState<Selected|null>(null),[dimensions,setDimensions]=useState<Record<string,Dimensions>>({}),[copied,setCopied]=useState(false);
 const active=useRef(true);useEffect(()=>{active.current=true;return()=>{active.current=false}},[]);
 useEffect(()=>{if(source!=='uploaded')return;const abort=new AbortController();setLoading(true);setError('');fetch('/api/admin/media?'+new URLSearchParams({page:String(page),q:query}),{signal:abort.signal}).then(async response=>{const data=await response.json() as MediaResponse;if(!response.ok)throw new Error(data.error||'โหลดรูปไม่ได้');setItems(data.items);setTotal(data.total)}).catch(error=>{if(error.name!=='AbortError')setError(error instanceof Error?error.message:'โหลดรูปไม่ได้')}).finally(()=>{if(!abort.signal.aborted)setLoading(false)});return()=>abort.abort()},[source,page,query,refresh]);
 const recordSize=(url:string,image:HTMLImageElement)=>{if(!image.naturalWidth)return;setDimensions(previous=>previous[url]?previous:{...previous,[url]:{width:image.naturalWidth,height:image.naturalHeight}})};
 const select=(item:Selected)=>{setSelected(item);setCopied(false);setNotice('')};
 const upload=async(file?:File)=>{if(!file||uploading)return;setUploading(true);setError('');setNotice('');try{const url=await uploadMediaFile(file);if(!active.current)return;setSource('uploaded');setPage(1);setQuery('');setSearch('');setRefresh(x=>x+1);setSelected({url,label:'รูปที่อัปโหลดล่าสุด'});setNotice('อัปโหลดแล้ว เลือกรูปไปใช้ได้เลย — ยังไม่เปลี่ยนหน้าเว็บไซต์จนกว่าจะบันทึกและเผยแพร่')}catch(error){if(active.current)setError(error instanceof Error?error.message:'อัปโหลดรูปไม่ได้')}finally{if(active.current)setUploading(false);if(fileInput.current)fileInput.current.value=''}};
 const builtins=[...new Set(imageFields)].filter(url=>url.toLowerCase().includes(query.toLowerCase()));
 const choices:Selected[]=source==='uploaded'?items.map((item,index)=>({...item,label:'รูปอัปโหลด '+((page-1)*24+index+1)})):builtins.map(url=>({url,label:url.split('/').pop()||'รูปเดิม'}));
 const selectedDimensions=selected?dimensions[selected.url]:undefined;
 return <section className={'cms-media-library'+(compact?' cms-media-compact':'')} aria-label="คลังรูปเว็บไซต์">
  <div className="cms-media-heading"><div><h2>{compact?'เลือกรูปจากคลัง':'คลังรูปเว็บไซต์'}</h2><p>อัปโหลดครั้งเดียว เลือกใช้ซ้ำได้หลายส่วน ระบบย่อภาพให้ก่อนอัปโหลด</p></div><button type="button" className="primary" disabled={uploading} onClick={()=>fileInput.current?.click()}><Upload size={17}/>{uploading?'กำลังเตรียมและอัปโหลด…':'อัปโหลดรูป'}</button><input ref={fileInput} id={uid+'-file'} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event=>void upload(event.currentTarget.files?.[0])}/></div>
  <p className="admin-muted">JPG, PNG, WebP · รูปต้นฉบับสูงสุด 40 MB · ย่อด้านยาวไม่เกิน 2,000 px และไฟล์ไม่เกิน 500 KB</p>
  <div className="cms-media-toolbar"><div role="group" aria-label="แหล่งรูป"><button type="button" aria-pressed={source==='uploaded'} onClick={()=>{setSource('uploaded');setPage(1);setQuery('');setSearch('')}}><ImagePlus size={16}/>รูปที่อัปโหลด</button><button type="button" aria-pressed={source==='built-in'} onClick={()=>{setSource('built-in');setPage(1);setQuery('');setSearch('')}}><ImageIcon size={16}/>รูปเดิมของเว็บไซต์</button></div><form onSubmit={event=>{event.preventDefault();setQuery(search.trim());setPage(1)}}><label className="sr-only" htmlFor={uid+'-search'}>{source==='uploaded'?'ค้นหารหัสรูปหรือชนิดไฟล์':'ค้นหาชื่อไฟล์รูปเดิม'}</label><input id={uid+'-search'} maxLength={80} value={search} placeholder={source==='uploaded'?'ค้นหารหัสรูป หรือ image/webp':'ค้นหาชื่อไฟล์รูปเดิม'} onChange={event=>setSearch(event.target.value)}/><button type="submit"><Search size={16}/>ค้นหา</button></form><button type="button" disabled={loading} onClick={()=>setRefresh(x=>x+1)} aria-label="โหลดคลังรูปใหม่"><RefreshCw size={17}/></button></div>
  {error&&<div className="admin-error" role="alert">{error}</div>}{notice&&<div className="admin-notice" role="status">{notice}</div>}
  <div className="cms-media-layout"><div>{loading?<p role="status">กำลังโหลดรูป…</p>:choices.length?<div className="cms-media-grid">{choices.map(item=><button type="button" className={'cms-media-tile'+(selected?.url===item.url?' selected':'')} aria-pressed={selected?.url===item.url} key={item.url} onClick={()=>select(item)}><img loading="lazy" src={item.url} alt={item.label} onLoad={event=>recordSize(item.url,event.currentTarget)}/><span>{item.label}</span><small>{dimensions[item.url]?`${dimensions[item.url].width} × ${dimensions[item.url].height} px`:'รูปเว็บไซต์'} {bytesLabel(item.size)}</small></button>)}</div>:<div className="cms-media-empty"><ImagePlus size={36}/><h3>{query?'ไม่พบรูปที่ค้นหา':'ยังไม่มีรูปอัปโหลด'}</h3><p>{query?'ลองค้นหาคำอื่น หรือเปลี่ยนแหล่งรูป':'กดอัปโหลดรูป หรือเลือกจากรูปเดิมของเว็บไซต์'}</p></div>}
  {source==='uploaded'&&<div className="cms-media-pagination"><button type="button" disabled={loading||page<=1} onClick={()=>setPage(x=>x-1)}>ก่อนหน้า</button><span>หน้า {page} / {Math.max(1,Math.ceil(total/24))} · {total} รูป</span><button type="button" disabled={loading||page*24>=total} onClick={()=>setPage(x=>x+1)}>ถัดไป</button></div>}</div>
  {selected&&<aside className="cms-media-inspector" aria-label="รูปที่เลือก"><img src={selected.url} alt={selected.label} onLoad={event=>recordSize(selected.url,event.currentTarget)}/><h3>รูปที่เลือก</h3>{selectedDimensions&&<p>{selectedDimensions.width.toLocaleString()} × {selectedDimensions.height.toLocaleString()} px</p>}<p>{bytesLabel(selected.size)} {selected.mime}</p>{selected.created_at&&<p>{new Date(selected.created_at).toLocaleString('th-TH',{timeZone:'Asia/Bangkok'})}</p>}<label>ลิงก์รูป<input readOnly value={selected.url} onFocus={event=>event.currentTarget.select()}/></label><div className="cms-media-actions">{onChoose&&<button className="primary" type="button" onClick={()=>onChoose(selected.url)}><Check size={17}/>ใช้รูปนี้</button>}<button type="button" onClick={async()=>{try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(selected.url);setCopied(true)}catch{setError('คัดลอกอัตโนมัติไม่ได้ ให้เลือกลิงก์ด้านบนแล้วคัดลอก')}}}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'คัดลอกแล้ว':'คัดลอกลิงก์'}</button><a href={selected.url} target="_blank" rel="noreferrer">ดูรูปเต็ม ↗</a></div></aside>}</div>
 </section>;
}
export function MediaPicker({onChoose}:{onChoose:(url:string)=>void}){return <MediaLibrary compact onChoose={onChoose}/>}
