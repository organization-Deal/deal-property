'use client';
import { useLanguage } from "./language";
import { LockKeyhole } from 'lucide-react';
import { PROJECT } from '../lib/project';
export function OwnershipProgress() {
    const { translate, localizedHref } = useLanguage();
    const owned = 100 - PROJECT.remainingPercent;
    return <div className="ownership-progress">
  <div className="ownership-progress-labels"><span>{translate("มีเจ้าของแล้ว ")}<strong>{translate(owned)}{translate("%")}</strong></span><span>{translate("เหลือเปิดรับ ")}<strong>{translate(PROJECT.remainingPercent)}{translate("%")}</strong></span></div>
  <div className="ownership-progress-track" role="progressbar" aria-label={translate("สัดส่วนที่มีเจ้าของแล้ว")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={owned} aria-valuetext={translate(`มีเจ้าของแล้ว ${owned}% เหลือเปิดรับ ${PROJECT.remainingPercent}%`)}><span style={{ width: `${owned}%` }}/></div>
  <p>{translate("สถานะ ณ ")}<time dateTime={PROJECT.updated}>{translate(PROJECT.updatedLabel)}</time>{translate(" \u00B7 ยืนยันสัดส่วนล่าสุดกับทีม")}</p>
 </div>;
}
export function ComingSoonCard() {
    const { translate, localizedHref } = useLanguage();
    return <article className="coming-project" aria-label={translate("โครงการใหม่ Coming Soon ยังไม่เปิดให้เป็นเจ้าของ")}>
 <div className="coming-visual coming-photo"><img src="/assets/house.webp" width="1448" height="1086" loading="lazy" alt={translate("ภาพจำลองแบบบ้านเดิม แสดงขาวดำเพื่อประกอบประกาศโครงการใหม่")}/><span className="coming-badge">{translate("NEXT PROJECT")}</span><div><LockKeyhole size={22}/><p><strong>{translate("Coming Soon.")}</strong></p><span>{translate("เตรียมพบโครงการใหม่")}</span></div><small>{translate("ภาพประกอบ \u00B7 ยังไม่ใช่แบบยืนยันของโครงการใหม่")}</small></div>
 <div className="coming-content">
  <div className="card-title-row"><div><p className="location-line coming-status"><LockKeyhole size={14}/>{translate(" เตรียมเปิดตัว")}</p><h3>{translate("โครงการใหม่จาก DEAL!")}</h3><p>{translate("อีกหนึ่งโครงการบ้านพักที่กำลังจะมา")}</p></div></div>
  <div className="coming-summary"><span>{translate("รายละเอียดเมื่อเปิดตัว")}</span><p>{translate("ชื่อโครงการ ทำเล และราคา")}<br />{translate("จะประกาศพร้อมข้อมูลการเป็นเจ้าของ")}</p><small>{translate("ยังไม่เปิดรับจองหรือชำระเงิน")}</small></div>
  <div className="coming-locked"><LockKeyhole size={16}/><span>{translate("ยังไม่เปิดให้เป็นเจ้าของ")}</span></div>
 </div>
 </article>;
}
export function UpcomingProjects() { const { translate, localizedHref } = useLanguage(); return <section className="section container upcoming-projects" aria-labelledby="upcoming-title"><div className="section-title"><div><p className="eyebrow"><span />{translate("COMING SOON")}</p><h2 id="upcoming-title">{translate("โครงการที่กำลังจะมา")}</h2></div><p className="section-side">{translate("อีกหนึ่งโครงการจาก DEAL!")}<br />{translate("ยังไม่เปิดให้เป็นเจ้าของ")}</p></div><div className="upcoming-grid"><ComingSoonCard /></div></section>; }
