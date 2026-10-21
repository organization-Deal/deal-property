'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {contentSchema,emptyContent,type SiteContent} from '@/lib/cms-config';
const Context=createContext<SiteContent>(emptyContent);
export function SiteContentProvider({children}:{children:ReactNode}){const [value,setValue]=useState(emptyContent);useEffect(()=>{let live=true;const preview=new URLSearchParams(location.search).get('cms-preview')==='1';fetch(preview?'/api/admin/content':'/api/content').then(r=>r.ok?r.json():Promise.reject()).then(d=>{const parsed=contentSchema.safeParse(preview?JSON.parse((d as {state:{draft:string}}).state.draft):d);if(live&&parsed.success)setValue(parsed.data)}).catch(()=>{});return()=>{live=false}},[]);return <Context.Provider value={value}><div data-site-density={value.density}>{children}</div></Context.Provider>}
export const useSiteContent=()=>useContext(Context);
export function CmsImage(props:React.ImgHTMLAttributes<HTMLImageElement>){const content=useSiteContent();return <img {...props} src={content.images[typeof props.src==='string'?props.src:'']||props.src}/>}
