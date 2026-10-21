'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSiteContent } from './site-content';
import { Globe2 } from 'lucide-react';
import { isLanguage, languageHref, translateText, translateValue, type Language } from '../lib/i18n';
const storageKey = 'deal-language';
const LanguageContext = createContext({language:'th' as Language, setLanguage:(_language:Language)=>{}});
export function LanguageProvider({children,initialLanguage="th"}:{children:ReactNode;initialLanguage?:Language}) {
 const [language,setLanguage] = useState<Language>(initialLanguage);
 const [ready,setReady] = useState(false);
 useEffect(()=>{
  const requested = new URLSearchParams(window.location.search).get('lang');
  let saved: string | null = null;
  try { saved = localStorage.getItem(storageKey); } catch { /* Storage may be unavailable. URL still works. */ }
  setLanguage(isLanguage(requested) ? requested : isLanguage(saved) ? saved : 'th');
  setReady(true);
  const sync = () => { const next = new URLSearchParams(location.search).get('lang'); if(isLanguage(next)) setLanguage(next); };
  window.addEventListener('popstate',sync);
  return ()=>window.removeEventListener('popstate',sync);
 },[]);
 useEffect(()=>{
  if (!ready || location.pathname.startsWith('/admin')) return;
  document.documentElement.lang = language === 'zh' ? 'zh-Hans' : language;
  try { localStorage.setItem(storageKey,language); } catch { /* Keep switching usable without storage. */ }
  const url = new URL(location.href); url.searchParams.set('lang',language);
  history.replaceState(history.state,'',url.pathname+url.search+url.hash);
  const path=location.pathname;
  const title=path==='/privacy'?'การใช้ข้อมูลในแบบฟอร์ม':path==='/projects'?'โครงการบ้านพัก':path.startsWith('/projects/')?'Human Allowed เชียงใหม่':'บ้านพักที่คุณเป็นเจ้าของ เราดูแลให้';
  document.title=translateText(title,language)+' | DEAL!';
  const description=translateText('สำรวจโครงการบ้านพัก Human Allowed เชียงใหม่ เลือกเป็นเจ้าของทั้งหลังหรือเจ้าของร่วม พร้อมการดูแลโดย DEAL! ตั้งแต่ทำเลจนถึงการดำเนินงานบ้านพัก',language);
  document.querySelector('meta[name="description"]')?.setAttribute('content',description);
 },[language,ready]);
 const value=useMemo(()=>({language,setLanguage}),[language]);
 return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){
 const context=useContext(LanguageContext);
 const content=useSiteContent();
 return {...context,translate:<T,>(value:T):T=>(typeof value==='string' && content.texts[value]?.[context.language] ? content.texts[value][context.language] as T : translateValue(value,context.language)),localizedHref:(href:string)=>languageHref(href,context.language)};
}
export function LanguageSelector(){
 const {language,setLanguage}=useLanguage();
 const label=language==='th'?'เลือกภาษา':language==='zh'?'选择语言':'Choose language';
 return <label className="language-selector"><Globe2 size={16} aria-hidden="true"/><span className="sr-only">{label}</span><select aria-label={label} value={language} onChange={e=>{if(isLanguage(e.target.value))setLanguage(e.target.value)}}><option value="th" lang="th">ไทย</option><option value="zh" lang="zh-Hans">中文</option><option value="en" lang="en">English</option></select></label>;
}
