'use client';
import {createContext,useContext,useEffect,useState,type ReactNode,type CSSProperties} from 'react';
import {contentSchema,emptyContent,type SiteContent} from '@/lib/cms-config';
const ReadyContext=createContext(false);
export const useContentReady=()=>useContext(ReadyContext);
const Context=createContext<SiteContent>(emptyContent);
export function SiteContentProvider({children}:{children:ReactNode}){
 const [value,setValue]=useState(emptyContent),[ready,setReady]=useState(false),[error,setError]=useState(false),[retry,setRetry]=useState(0),[preview,setPreview]=useState(false);
 useEffect(()=>{let live=true;const preview=new URLSearchParams(location.search).get('cms-preview')==='1';setPreview(preview);setError(false);fetch(preview?'/api/admin/content':'/api/content').then(r=>r.ok?r.json():Promise.reject()).then(d=>{const parsed=contentSchema.safeParse(preview?JSON.parse((d as {state:{draft:string}}).state.draft):d);if(!parsed.success)throw Error();if(live)setValue(parsed.data)}).catch(()=>{if(live)setError(true)}).finally(()=>{if(live)setReady(true)});return()=>{live=false}},[retry]);
 useEffect(()=>{if(!preview)return;const block=(e:Event)=>{e.preventDefault();e.stopPropagation()};const links=(e:MouseEvent)=>{const a=(e.target as Element)?.closest('a');if(!a)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&!url.pathname.startsWith('/api/')&&!url.pathname.startsWith('/assets/')){url.searchParams.set('cms-preview','1');a.href=url.href}};document.addEventListener('click',links,true);document.addEventListener('submit',block,true);return()=>{document.removeEventListener('submit',block,true);document.removeEventListener('click',links,true)}},[preview]);
 const accent={red:'#ae2824',charcoal:'#292d2b',olive:'#59684c'}[value.appearance.accent];
 return <ReadyContext.Provider value={ready}><Context.Provider value={value}><div data-site-density={value.density} data-site-radius={value.appearance.radius} data-site-text-size={value.appearance.textSize} style={{'--cms-accent':accent} as CSSProperties}>{preview&&<div className="cms-preview-banner" role="status">ตัวอย่างฉบับร่าง · ยังไม่เผยแพร่ · ปิดการส่งฟอร์มในโหมดนี้</div>}{error&&<div className="cms-load-warning" role="status">โหลดข้อมูลอัปเดตไม่สำเร็จ กรุณายืนยันข้อมูลล่าสุดกับทีม <button onClick={()=>setRetry(v=>v+1)}>ลองใหม่</button></div>}{children}</div></Context.Provider></ReadyContext.Provider>;
}
export const useSiteContent=()=>useContext(Context);
export function CmsImage(props:React.ImgHTMLAttributes<HTMLImageElement>){const content=useSiteContent();return <img {...props} src={content.images[typeof props.src==='string'?props.src:'']||props.src}/>}
export function useAvailability(){const {availability}=useSiteContent();return {remainingPercent:Math.round((100-availability.ownedPercent)*100)/100,updated:availability.updated,updatedLabel:availability.updated};}
export function HomeSections({slots}:{slots:Record<string,ReactNode>}){const {homeLayout}=useSiteContent();return <>{homeLayout.filter(s=>s.visible).map(s=><div key={s.id} data-cms-section={s.id} style={{display:'contents'}}>{slots[s.id]}</div>)}</>}

export function HomeLink({section,...props}:React.AnchorHTMLAttributes<HTMLAnchorElement>&{section:string}){const {homeLayout}=useSiteContent();return homeLayout.some(s=>s.id===section&&s.visible)?<a {...props}/>:null}
