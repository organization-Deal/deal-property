'use client';
import { useLanguage } from "./language";
import { useEffect, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';
const views = ['มุมเฉียงด้านหน้า', 'มุมเฉียงด้านหลัง', 'ด้านบันไดภายนอก', 'ด้านหน้า'];
export function HousePlans() {
    const { translate, localizedHref } = useLanguage();
    const [selected, setSelected] = useState<number | null>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (selected === null)
            return;
        const previous = document.body.style.overflow;
        dialog.current?.showModal();
        document.body.style.overflow = 'hidden';
        return () => { dialog.current?.close(); document.body.style.overflow = previous; };
    }, [selected === null]);
    const move = (direction: number) => setSelected(index => ((index ?? 0) + direction + views.length) % views.length);
    return <div className="house-plans">
    <p className="plan-hint">{translate("แบบโครงสร้าง 4 มุม ")}<span>{translate("กดภาพเพื่อขยาย")}</span></p>
    <div className="plan-rail" role="region" aria-label={translate("ภาพแบบบ้าน 4 มุม เลื่อนซ้ายขวา")} tabIndex={0}>
      {translate(views.map((view, index) => <button className="plan-card" key={view} onClick={() => setSelected(index)} aria-label={translate(`ขยายแบบบ้าน ${view}`)}>
        <img src={`/assets/house-plan-${index + 1}.jpeg`} alt={translate(`แบบโครงสร้างบ้าน Human Allowed ${view} พร้อมเส้นบอกขนาด`)} loading="lazy"/>
        <span>{translate(index + 1)}{translate("/4 \u00B7 ")}{translate(view)}<Expand size={16} aria-hidden="true"/></span>
      </button>))}
    </div>
    <dialog ref={dialog} className="construction-dialog plan-dialog" aria-label={translate("แบบบ้านและโครงสร้าง")} onCancel={() => setSelected(null)} onClick={event => { if (event.target === dialog.current)
        setSelected(null); }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
    } }}>
      {translate(selected !== null && <><div className="construction-dialog-head"><span>{translate(views[selected])}{translate(" \u00B7 ")}{translate(selected + 1)}{translate("/4")}</span><button className="icon-button" onClick={() => setSelected(null)} aria-label={translate("ปิดภาพแบบบ้าน")}><X /></button></div>
      <img src={`/assets/house-plan-${selected + 1}.jpeg`} alt={translate(`แบบโครงสร้างบ้าน ${views[selected]} พร้อมเส้นบอกขนาด`)}/>
      <a className="plan-download" href={localizedHref(`/assets/house-plan-${selected + 1}.jpeg`)} download>{translate("ดาวน์โหลดภาพแบบนี้")}</a><div className="construction-dialog-nav"><button className="btn btn-outline" onClick={() => move(-1)}>{translate("ภาพก่อนหน้า")}</button><button className="btn" onClick={() => move(1)}>{translate("ภาพถัดไป")}</button></div></>)}
    </dialog>
  </div>;
}
