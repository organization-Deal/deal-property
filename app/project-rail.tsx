'use client';
import { useLanguage } from "./language";
import { useRef, useId, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export function ProjectRail({ children }: {
    children: ReactNode;
}) {
    const { translate, localizedHref } = useLanguage();
    const rail = useRef<HTMLDivElement>(null);
    const id = useId();
    const move = (direction: number) => { const el = rail.current; if (!el)
        return; const card = el.firstElementChild as HTMLElement | null; const gap = parseFloat(getComputedStyle(el).columnGap) || 0; el.scrollBy({ left: direction * ((card?.offsetWidth ?? el.clientWidth) + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
    return <div className="project-rail-wrap"><div className="project-rail-controls"><span>{translate("เลื่อนดูโครงการ")}</span><button type="button" className="icon-button" aria-label={translate("เลื่อนโครงการไปทางซ้าย")} aria-controls={id} onClick={() => move(-1)}><ChevronLeft size={18}/></button><button type="button" className="icon-button" aria-label={translate("เลื่อนโครงการไปทางขวา")} aria-controls={id} onClick={() => move(1)}><ChevronRight size={18}/></button></div><div ref={rail} id={id} className="project-rail" role="region" aria-label={translate("โครงการที่เปิดรับและโครงการ Coming Soon เลื่อนซ้ายขวา")} tabIndex={0} onKeyDown={e => { if (e.target !== e.currentTarget)
        return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        move(e.key === 'ArrowLeft' ? -1 : 1);
    } }}>{translate(children)}</div></div>;
}
