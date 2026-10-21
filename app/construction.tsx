'use client';
import { useLanguage } from "./language";
import { useEffect, useRef, useState } from 'react';
import { PROJECT } from '../lib/project';
import { ChevronLeft, ChevronRight, Expand, MapPin, X } from 'lucide-react';
const photos = [
    { id: '2456', alt: 'อาคารบ้านพัก Human Allowed Airport Chiangmai และบันไดภายนอกระหว่างก่อสร้าง' },
    { id: '2451', alt: 'แนวบ้านพักและหลังคา Human Allowed Airport Chiangmai' },
    { id: '2452', alt: 'รายละเอียดระเบียงและผนังภายนอกบ้านพัก' },
    { id: '2454', alt: 'ทีมช่างทำงานบริเวณผนังภายนอกและนั่งร้าน' },
    { id: '2453', alt: 'การทำงานบริเวณทางเดินด้านข้างอาคาร' },
    { id: '2449', alt: 'นั่งร้านและงานก่อสร้างภายนอกอาคาร' },
    { id: '2448', alt: 'ทีมงานขนย้ายวัสดุในพื้นที่ก่อสร้าง' },
];
const completedPhotos = [
    { id: '2672', alt: 'บ้านพักหลังแรกที่สร้างเสร็จแล้ว พร้อมระเบียงและพื้นที่หน้าบ้าน' },
    { id: '2673', alt: 'บรรยากาศบริเวณทางเข้าบ้านพักหลังแรก' },
    { id: '2674', alt: 'บรรยากาศมุมนั่งเล่นภายในบ้านพัก' },
    { id: '2675', alt: 'การตกแต่งมุมโทรทัศน์และชั้นวางของภายในบ้านพัก' },
    { id: '2676', alt: 'มุมโต๊ะทำงานริมหน้าต่างของบ้านพัก' },
    { id: '2677', alt: 'พื้นที่พักผ่อนและอ่านหนังสือภายในบ้านพัก' },
];
const projects = [
    { title: 'Human Allowed Chiangmai Gate', label: 'โครงการแรกของ DEAL!', status: 'สร้างเสร็จแล้ว', detail: 'เปิดดำเนินงานและมีรายได้แล้ว', note: 'ภาพจริงของบ้านและบรรยากาศภายใน', prefix: 'completed', photos: completedPhotos },
    { title: 'Human Allowed Airport Chiangmai', label: 'อำเภอเมืองเชียงใหม่', status: 'ปิดรับการเป็นเจ้าของแล้ว', detail: 'อยู่ระหว่างก่อสร้าง', note: 'ภาพหน้างานจริง · ชุดบันทึก Day 37/45', prefix: 'construction', photos },
];
export function ConstructionProjects({ compact = false }: {
    compact?: boolean;
}) {
    const { translate, localizedHref } = useLanguage();
    const [selected, setSelected] = useState<number | null>(null);
    const [projectIndex, setProjectIndex] = useState(0);
    const project = projects[projectIndex];
    const galleryPhotos = project.photos;
    const openGallery = (index: number) => { setProjectIndex(index); setSelected(0); };
    const dialog = useRef<HTMLDialogElement>(null);
    const portfolioList = useRef<HTMLDivElement>(null);
    const scrollProjects = (direction: number) => {
        const list = portfolioList.current;
        if (!list)
            return;
        const card = list.firstElementChild as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
        list.scrollBy({ left: direction * ((card?.offsetWidth ?? list.clientWidth) + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    useEffect(() => {
        if (selected !== null) {
            dialog.current?.showModal();
            document.body.style.overflow = 'hidden';
        }
        else {
            dialog.current?.close();
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selected]);
    const current = selected === null ? null : galleryPhotos[selected];
    return <section className={`construction-section portfolio-section ${compact ? 'portfolio-home' : ''}`} id="construction">
    <div className="container">
      <div className="section-title">
        <div><p className="eyebrow"><span />{translate(" OUR TRACK RECORD")}</p><h2>{translate("ผลงานที่ผ่านมา")}</h2></div>
        <div className="portfolio-scroll-controls"><span>{translate("เลื่อนดูผลงาน")}</span><button className="icon-button" onClick={() => scrollProjects(-1)} aria-label={translate("เลื่อนผลงานไปทางซ้าย")}><ChevronLeft size={18}/></button><button className="icon-button" onClick={() => scrollProjects(1)} aria-label={translate("เลื่อนผลงานไปทางขวา")}><ChevronRight size={18}/></button></div>
      </div>
      <div className="portfolio-list" ref={portfolioList} role="region" aria-label={translate("ผลงานที่ผ่านมา เลื่อนซ้ายขวาเพื่อดูโครงการ")} tabIndex={0}>{translate(projects.map((item, index) => <article className="portfolio-card" key={item.prefix}>
        <button className="portfolio-cover" onClick={() => openGallery(index)} aria-label={translate(`ดูภาพ ${item.title} ทั้งหมด ${item.photos.length} รูป`)}>
          <img src={`/assets/${item.prefix}-${item.photos[0].id}.webp`} alt={translate(item.photos[0].alt)} loading="lazy"/>
          <span className="construction-expand"><Expand size={17}/> {translate(item.photos.length)}{translate(" รูป")}</span>
        </button>
        <div className="portfolio-content">
          <p className="location-line">{translate(index === 1 && <MapPin size={14}/>)} {translate(item.label)}</p>
          <h3>{translate(item.title)}</h3>
          <p className="portfolio-status">{translate(item.status)} <span>{translate("\u00B7 ")}{translate(item.detail)}</span></p>
          <p className="portfolio-note">{translate(item.note)}</p><p className="portfolio-updated">{translate("ข้อมูลสถานะ ")}<time dateTime={PROJECT.updated}>{translate(PROJECT.updatedLabel)}</time></p>
          <button className="btn btn-outline" onClick={() => openGallery(index)}>{translate("ดูภาพจริง ")}{translate(item.photos.length)}{translate(" รูป ")}<ChevronRight size={16}/></button>
        </div>
      </article>))}</div>
      <p className="portfolio-evidence-note">{translate("ภาพจริงแสดงตัวบ้านและความคืบหน้าของแต่ละโครงการ ไม่ใช่หลักฐานผลตอบแทนของโครงการที่เปิดรับอยู่ ขณะนี้หน้าเว็บยังไม่แสดงรายงานรายรับ\u2013รายจ่ายหรือผลดำเนินงานย้อนหลัง")}</p>
    </div>
    <dialog ref={dialog} className="construction-dialog" onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelected(((selected ?? 0) + (e.key === 'ArrowRight' ? 1 : -1) + galleryPhotos.length) % galleryPhotos.length);
    } }} aria-label={translate(`ภาพผลงาน ${project.title}`)} onCancel={() => setSelected(null)} onClick={e => { if (e.target === dialog.current)
        setSelected(null); }}>
      {translate(current && <><div className="construction-dialog-head"><span>{translate(project.title)}{translate(" \u00B7 ")}{translate((selected ?? 0) + 1)}{translate(" / ")}{translate(galleryPhotos.length)}</span><button className="icon-button" onClick={() => setSelected(null)} aria-label={translate("ปิดภาพ")}><X /></button></div><img src={`/assets/${project.prefix}-${current.id}.webp`} alt={translate(current.alt)}/><div className="construction-dialog-nav"><button className="btn btn-outline" onClick={() => setSelected(((selected ?? 0) + galleryPhotos.length - 1) % galleryPhotos.length)}>{translate("ภาพก่อนหน้า")}</button><button className="btn" onClick={() => setSelected(((selected ?? 0) + 1) % galleryPhotos.length)}>{translate("ภาพถัดไป")}</button></div></>)}
    </dialog>
  </section>;
}
