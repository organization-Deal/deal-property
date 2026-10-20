'use client';
import { useLanguage, LanguageSelector } from "./language";
import React, { createContext, useContext, useEffect, useRef, useState, useId, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, MapPin, Menu, X, Plus, Check, ChevronRight, ChevronLeft, Heart, Share2, Play, Expand, Download, BedDouble, Bath, Layers2, House, Compass, KeyRound, ClipboardList, Sparkles, CalendarDays, CircleCheck, LoaderCircle, Building2, SlidersHorizontal, Search } from 'lucide-react';
import { OwnershipProgress, ComingSoonCard } from './project-availability';
import { ProjectRail } from './project-rail';
import { ConstructionProjects } from './construction';
import { InvestorBrief } from './investor-brief';
import { OwnershipPicker } from './ownership-picker';
import { OwnershipDetails } from './ownership-details';
import { EnquiryForm } from './enquiry-form';
import { ProjectSummary } from './project-summary';
import { HousePlans } from './house-plans';
import { PROJECT, money, ownershipPrice, type Interest } from '../lib/project';
const projectPath = PROJECT.path;
const mapSearch = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('18 เชียงใหม่-ลำพูน ซอย 1 เชียงใหม่');
type Media = 'house' | 'map' | 'deal';
type Popup = {
    type: 'enquiry';
    interest?: Interest;
} | {
    type: 'media';
    media: Media;
} | null;
const UI = createContext<{
    inquire: (i?: Interest) => void;
    media: (m: Media) => void;
    toast: (m: string) => void;
    selection: Interest;
    setSelection: (i: Interest) => void;
}>({ inquire: () => { }, media: () => { }, toast: () => { }, selection: { ownership: 'undecided' }, setSelection: () => { } });
const useUI = () => useContext(UI);
function Brand({ light = false }: {
    light?: boolean;
}) { const { translate, localizedHref } = useLanguage(); return <a className={`brand brand-image ${light ? 'light' : ''}`} href={localizedHref("/")} aria-label={translate("DEAL! หน้าหลัก")}><img src="/assets/deal-logo-red.png" alt={translate("DEAL!")} width="720" height="174"/></a>; }
function Button({ children, onClick, href, light = false, outline = false, className = '' }: {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    light?: boolean;
    outline?: boolean;
    className?: string;
}) { const { translate, localizedHref } = useLanguage(); const cls = `btn ${light ? 'btn-light' : ''} ${outline ? 'btn-outline' : ''} ${className}`; return href ? <a className={cls} href={localizedHref(href)}>{translate(children)}</a> : <button className={cls} data-enquiry-action={children === 'สอบถามโครงการ' ? 'true' : undefined} onClick={onClick}>{translate(children)}</button>; }
function Eyebrow({ children, light = false }: {
    children: ReactNode;
    light?: boolean;
}) { const { translate, localizedHref } = useLanguage(); return <p className={`eyebrow ${light ? 'on-dark' : ''}`}><span />{translate(children)}</p>; }
function Photo({ className = '', priority = false, alt = 'ภาพจำลองแบบบ้าน Human Allowed สองชั้น สีขาว หลังคาสีดำ และบันไดภายนอก' }: {
    className?: string;
    priority?: boolean;
    alt?: string;
}) { const { translate, localizedHref } = useLanguage(); return <img className={className} src="/assets/house.webp" width="1448" height="1086" alt={translate(alt)} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}/>; }
function Header({ active = 'home' }: {
    active?: string;
}) {
    const { translate, localizedHref } = useLanguage();
    const [menu, setMenu] = useState(false);
    const { inquire } = useUI();
    useEffect(() => { const cb = (e: KeyboardEvent) => { if (e.key === 'Escape')
        setMenu(false); }; window.addEventListener('keydown', cb); return () => window.removeEventListener('keydown', cb); }, []);
    return <>
    <a className="skip-link" href={localizedHref("#main")}>{translate("ข้ามไปเนื้อหา")}</a>
    <header className="header"><div className="header-inner"><Brand /><nav className="desktop-nav" aria-label={translate("เมนูหลัก")}><a href={localizedHref("/projects")} className={active === 'projects' ? 'current' : ''}>{translate("โครงการของเรา")}</a><a href={localizedHref("/#about")}>{translate("รู้จัก DEAL!")}</a><a href={localizedHref("/#care")}>{translate("เราดูแลอะไรให้")}</a><a href={localizedHref("/#faq")}>{translate("คำถามที่พบบ่อย")}</a></nav><div className="header-end"><LanguageSelector/><button className="header-contact" onClick={() => inquire()}>{translate("สอบถามโครงการ")}</button><button className="menu-button icon-button" aria-label={translate(menu ? 'ปิดเมนู' : 'เปิดเมนู')} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(!menu)}><span className={`menu-glyph ${menu ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span></button></div></div>
    {translate(menu && <nav className="mobile-menu" id="mobile-menu" aria-label={translate("เมนูมือถือ")}><a href={localizedHref("/projects")} onClick={() => setMenu(false)}>{translate("โครงการของเรา ")}<ChevronRight /></a><a href={localizedHref("/#about")} onClick={() => setMenu(false)}>{translate("รู้จัก DEAL!")}</a><a href={localizedHref("/#care")} onClick={() => setMenu(false)}>{translate("เราดูแลอะไรให้")}</a><a href={localizedHref("/#faq")} onClick={() => setMenu(false)}>{translate("คำถามที่พบบ่อย")}</a><button onClick={() => { setMenu(false); inquire(); }}>{translate("สอบถามโครงการ ")}<ArrowRight /></button><small>{translate("บ้านพักที่คุณเป็นเจ้าของ เราดูแลให้")}</small></nav>)}
    </header></>;
}
function Footer() { const { translate, localizedHref } = useLanguage(); const { inquire } = useUI(); return <footer className="footer"><div className="container footer-top"><div><Brand light/><p>{translate("ทำให้การเป็นเจ้าของธุรกิจ")}<br />{translate("เป็นเรื่องที่ใกล้ตัวคุณมากขึ้น")}</p></div><div><span className="footer-label">{translate("DISCOVER")}</span><a href={localizedHref("/projects")}>{translate("โครงการบ้านพัก")}</a><a href={localizedHref(projectPath)}>{translate("Human Allowed เชียงใหม่")}</a><a href={localizedHref("/#about")}>{translate("รู้จัก DEAL!")}</a></div><div><span className="footer-label">{translate("LET'S TALK")}</span><button onClick={() => inquire()}>{translate("สอบถามโครงการ ")}<ChevronRight size={15}/></button><button onClick={() => inquire({ purpose: 'visit' })}>{translate("นัดหมายเยี่ยมชม ")}<ChevronRight size={15}/></button><a href={localizedHref("/#faq")}>{translate("คำถามที่พบบ่อย")}</a></div></div><div className="container footer-bottom"><span>{translate("\u00A9 ")}{translate(new Date().getFullYear())} {translate(PROJECT.company)}{translate(" \u00B7 DEAL INVEST CO., LTD.")}</span><span>{translate("THE ART OF OWNERSHIP")}</span><a href={localizedHref("/privacy")}>{translate("การใช้ข้อมูลในแบบฟอร์ม")}</a></div></footer>; }
function Shell({ children, active = 'home', project = false }: {
    children: ReactNode;
    active?: string;
    project?: boolean;
}) {
    const { translate, localizedHref } = useLanguage();
    const [selection, setSelection] = useState<Interest>(project ? { ownership: 'co-owner', sharePct: 10 } : { ownership: 'undecided' });
    const [dockHidden, setDockHidden] = useState(false);
    const [popup, setPopup] = useState<Popup>(null);
    const [notice, setNotice] = useState('');
    const dialog = useRef<HTMLDialogElement>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => { if (popup) {
        dialog.current?.showModal();
        document.body.style.overflow = 'hidden';
    }
    else {
        dialog.current?.close();
        document.body.style.overflow = '';
    } return () => { document.body.style.overflow = ''; }; }, [popup]);
    useEffect(() => () => { if (toastTimer.current)
        clearTimeout(toastTimer.current); }, []);
    const toast = (m: string) => { setNotice(m); if (toastTimer.current)
        clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setNotice(''), 3500); };
    useEffect(() => { const visible = new Set<Element>(); const observer = new IntersectionObserver(entries => { for (const entry of entries) {
        if (entry.isIntersecting)
            visible.add(entry.target);
        else
            visible.delete(entry.target);
    } setDockHidden(visible.size > 0); }, { threshold: 0 }); document.querySelectorAll('[data-enquiry-action], .ownership-section, .contact-form, .header-contact, .footer').forEach(el => observer.observe(el)); return () => observer.disconnect(); }, []);
    const close = () => setPopup(null);
    const title = popup?.type === 'enquiry' ? (popup.interest?.purpose === 'visit' ? 'นัดชมโครงการ' : popup.interest?.purpose === 'plans' ? 'ขอแบบบ้านฉบับรายละเอียด' : 'ขอข้อมูลประกอบการตัดสินใจ') : popup?.media === 'house' ? 'Human Allowed — ภาพจำลองแบบบ้าน' : popup?.media === 'map' ? 'ทำเล Human Allowed เชียงใหม่' : 'DEAL! คืออะไร?';
    return <UI.Provider value={{ inquire: (interest) => setPopup({ type: 'enquiry', interest: { ...(project ? selection : {}), ...interest } }), media: (media) => setPopup({ type: 'media', media }), toast, selection, setSelection }}><Header active={active}/>{translate(children)}<Footer />
 {translate(project && <div className={`mobile-action ${dockHidden || popup || (project && (selection.shareInvalid || selection.ownership === 'whole')) ? 'is-hidden' : ''}`} aria-hidden={dockHidden || !!popup || (project && (!!selection.shareInvalid || selection.ownership === 'whole'))} inert={dockHidden || !!popup || (project && (!!selection.shareInvalid || selection.ownership === 'whole'))}><div><small>{translate(project ? (selection.ownership === 'whole' ? 'ทั้งหลัง · รวมภาษี' : `เจ้าของร่วม ${selection.sharePct ?? 10}% · รวมภาษี`) : 'บ้านพักเชียงใหม่')}</small><strong>{translate(project ? `${money(ownershipPrice(selection.ownership, selection.sharePct ?? 10))} บาท` : 'Human Allowed')}</strong></div><button onClick={() => setPopup({ type: 'enquiry', interest: project ? selection : undefined })}>{translate("สอบถามโครงการ")}</button></div>)}
 <dialog ref={dialog} className={`modal ${popup?.type === 'media' ? 'media-modal' : ''}`} onCancel={close} onClick={e => { if (e.target === dialog.current)
        close(); }} aria-labelledby="dialog-title"><div className="modal-inner"><div className="modal-head"><h2 id="dialog-title">{translate(title)}</h2><button className="icon-button" onClick={close} aria-label={translate("ปิดหน้าต่าง")}><X /></button></div>
 {translate(popup?.type === 'enquiry' ? <EnquiryForm initial={popup.interest}/> : popup?.type === 'media' && (popup.media === 'house' || popup.media === 'map' ? <><img className="lightbox-image" src={`/assets/${popup.media === 'house' ? 'house' : 'location'}.webp`} alt={translate(title)}/><p className="image-note">{translate(popup.media === 'house' ? 'ภาพจำลองเพื่อแสดงแนวทางการออกแบบ รายละเอียดจริงให้ยึดตามแบบและสัญญาของโครงการ' : 'แผนที่กราฟิกและระยะทางโดยประมาณตามข้อมูลโครงการ')}</p></> : <video className="video-player" controls autoPlay playsInline preload="metadata" src="/assets/deal_what_is_9x16.mp4"/>))}
 </div></dialog><div className={`toast ${notice ? 'visible' : ''}`} role="status">{translate(notice)}</div></UI.Provider>;
}
function HomeHero() { const { translate, localizedHref } = useLanguage(); const { media } = useUI(); return <section className="home-hero"><div className="hero-copy"><Eyebrow>{translate("THE ART OF OWNERSHIP")}</Eyebrow><h1>{translate("บ้านพักที่คุณ")}<br />{translate("เป็นเจ้าของ")}<span className="headline-red">{translate(".")}</span><br /><span className="soft-line">{translate("เราดูแลให้")}</span></h1><p className="hero-description">{translate("จากทำเลที่ใช่ สู่บ้านพักพร้อมดำเนินงาน")}<br />{translate("เลือกเป็นเจ้าของทั้งหลัง หรือเริ่มต้นเป็นเจ้าของร่วม")}<br />{translate("พร้อมทีมดูแลการปล่อยเช่าตามข้อตกลง")}</p><div className="hero-actions"><Button href={localizedHref("/projects")}>{translate("ดูโครงการของเรา")}</Button><button className="text-button" onClick={() => media('deal')}>{translate("รู้จัก DEAL! ใน 1 นาที")}<span className="play-small"><Play size={11} fill="currentColor"/></span></button></div><div className="hero-footnote"><span className="small-line"/>{translate(" บ้านพักปล่อยเช่า \u00B7 บริหารโดย DEAL!")}</div></div><div className="hero-photo"><Photo priority/><div className="hero-photo-top"><span className="white-tag"><MapPin size={13}/>{translate(" CHIANG MAI, THAILAND")}</span><span className="vertical-text">{translate("A NEW WAY TO OWN.")}</span></div><div className="hero-photo-bottom"><div><small>{translate("OUR SIGNATURE PROJECT")}</small><h2>{translate("Human Allowed")}</h2><span>{translate("บ้านพักเชียงใหม่ ใกล้แม่น้ำปิง")}</span></div><a className="round-arrow" href={localizedHref(projectPath)} aria-label={translate("ดูโครงการ Human Allowed")}><ChevronRight /></a></div><span className="render-label">{translate("ภาพจำลองแบบบ้าน")}</span></div></section>; }
function ProjectCard() { const { translate, localizedHref } = useLanguage(); return <article className="project-card"><div className="project-card-image"><a href={localizedHref(projectPath)}><Photo /></a><span className="project-tag"><span />{translate(" HUMAN ALLOWED")}</span><small className="photo-caption">{translate("ภาพจำลองแบบบ้าน")}</small></div><div className="project-card-content"><div className="card-title-row"><div><p className="location-line"><MapPin size={14}/>{translate(" เมืองเชียงใหม่ \u00B7 ใกล้แม่น้ำปิง")}</p><h3><a href={localizedHref(projectPath)}>{translate("Human Allowed")}</a></h3><p>{translate("บ้านพักปล่อยเช่าบนที่ดินเช่า")}</p></div></div><div className="card-spec"><span><Layers2 size={17}/>{translate(" 2 ชั้น")}</span><span><BedDouble size={17}/>{translate(" 2 ห้องนอน")}</span><span><Bath size={17}/>{translate(" 2 ห้องน้ำ")}</span><span className="managed">{translate("DEAL! ดูแลให้")}</span></div><div className="card-ownership-summary"><div className="card-price"><div><small>{translate("เจ้าของร่วม 10% เริ่มต้น \u00B7 รวมภาษี")}</small><strong>{translate("171,200 ")}<span>{translate("บาท")}</span></strong></div><span className="card-open-status"><i />{translate(" เปิดรับผู้สนใจ")}</span></div><OwnershipProgress /></div><a className="card-details-button" href={localizedHref(projectPath)}>{translate("ดูรายละเอียดโครงการ ")}<ChevronRight size={17}/></a></div></article>; }
function Featured() { const { translate, localizedHref } = useLanguage(); return <section className="section container" id="projects"><div className="section-title"><div className="project-section-heading"><h2>{translate("โครงการบ้านพัก")}</h2><p className="project-count">{translate("เปิดรับ 1 \u00B7 เร็ว ๆ นี้ 1")}</p></div><a className="text-link" href={localizedHref("/projects")}>{translate("ดูทั้งหมด ")}<ChevronRight size={18}/></a></div><ProjectRail><ProjectCard /><ComingSoonCard /></ProjectRail></section>; }
function About() {
 const {translate,localizedHref}=useLanguage();
 return <section id="about" className="about-section about-explained" aria-labelledby="about-title"><div className="container">
  <div className="about-introduction"><div><p className="eyebrow on-dark"><span/>{translate('รู้จัก DEAL!')}</p><h2 id="about-title">{translate('คุณเป็นเจ้าของบ้านพัก')}<br/><span>{translate('มีทีมดูแลการดำเนินงานให้')}</span></h2></div><p className="about-definition">{translate('DEAL! โดยบริษัท ดีลอินเวส จำกัด เป็นตัวกลางในการเป็นเจ้าของธุรกิจบ้านพักปล่อยเช่า เชื่อมการจัดหาและพัฒนาโครงการเข้ากับทีมดูแลการดำเนินงาน ตั้งแต่ก่อนเริ่มจนถึงหลังเปิดให้พัก')}</p></div>
  <div className="about-explanation-grid">
   <figure className="about-project-photo"><img src="/assets/completed-2672.webp" alt={translate('ภาพจริง Human Around (1) โครงการแรกที่สร้างเสร็จและเปิดดำเนินงานแล้ว')} width="1122" height="1402" loading="lazy"/><figcaption><span>{translate('จากโครงการที่ทำจริง')}</span><strong>Human Around (1)</strong><span>{translate('สร้างเสร็จแล้ว · เปิดดำเนินงานและมีรายได้แล้ว')}</span></figcaption></figure>
   <div className="about-roles"><h3>{translate('เข้าใจบทบาท ก่อนเป็นเจ้าของ')}</h3>
    <article><span className="about-role-icon"><House size={22}/></span><div><h4>{translate('คุณถือสิทธิในบ้านตามสัญญา')}</h4><p>{translate('เลือกหน่วยและสัดส่วนที่สนใจ ตรวจสิทธิและค่าใช้จ่ายก่อนทำสัญญา สำหรับ Human Allowed เป็นบ้านบนที่ดินเช่า ไม่รวมกรรมสิทธิ์ที่ดิน')}</p></div></article>
    <article><span className="about-role-icon"><KeyRound size={22}/></span><div><h4>{translate('DEAL! ดูแลงานที่ต้องทำต่อ')}</h4><p>{translate('ทีมประสานงานพัฒนาโครงการ และดูแลการจอง ผู้เข้าพัก การทำความสะอาดและซ่อมบำรุงตามข้อตกลง พร้อมรายงานรายรับ–รายจ่าย')}</p></div></article>
    <article><span className="about-role-icon"><Building2 size={22}/></span><div><h4>{translate('รายได้มาจากการเข้าพักจริง')}</h4><p>{translate('เมื่อเปิดดำเนินงาน รายได้จากผู้เข้าพักจะถูกหักค่าบริหารและค่าใช้จ่าย ก่อนจัดสรรตามหน่วยทรัพย์และสิทธิในสัญญาของคุณ')}</p></div></article>
   </div>
  </div>
  <div className="about-income"><div className="about-income-heading"><h3>{translate('DEAL! ได้ค่าบริหารอย่างไร?')}</h3><span>{translate('เงื่อนไขของ Human Allowed ที่เปิดรับอยู่')}</span></div><ol className="about-income-steps"><li><span>01</span><p>{translate('รายได้จากหน่วยที่คุณถือสิทธิ')}</p></li><li><span>02</span><p>{translate('หักค่าบริหาร 30% และค่าใช้จ่ายดำเนินงาน')}</p></li><li><span>03</span><p>{translate('จัดสรรเงินสุทธิตามสิทธิในสัญญา')}</p></li></ol><p className="about-income-note">{translate('ค่าบริหารคิดจากรายได้รวม ค่าใช้จ่ายดำเนินงานแยกต่างหาก รายได้ขึ้นกับผลดำเนินงานจริง ไม่รับประกันผลตอบแทนหรือระยะคืนทุน')}</p></div>
  <div className="about-next"><a className="btn btn-light" href={localizedHref(projectPath+'#decision-title')}>{translate('ดูสิทธิและค่าใช้จ่ายของโครงการ')}<ArrowRight size={17}/></a><a className="about-proof-link" href="#construction">{translate('ดูผลงานที่ผ่านมาของ DEAL!')}<ArrowUpRight size={17}/></a></div>
 </div></section>;
}
const careSteps = [
    { icon: Compass, title: 'เลือกทำเล', text: 'สำรวจและประเมินพื้นที่สำหรับบ้านพัก' },
    { icon: ClipboardList, title: 'ประสานงานโครงการ', text: 'ที่ดินเช่า เอกสาร แบบบ้าน และผู้รับเหมา' },
    { icon: House, title: 'สร้างและตกแต่ง', text: 'ดูแลบ้านให้พร้อมเปิดรับผู้เข้าพัก' },
    { icon: KeyRound, title: 'ดูแลการปล่อยเช่า', text: 'การจอง ผู้เข้าพัก ทำความสะอาด และสรุปรายได้' },
];
function Care() { const { translate, localizedHref } = useLanguage(); return <section className="section container" id="care"><div className="section-title"><div><h2>{translate("DEAL! ดูแลอะไรบ้าง")}</h2></div></div><div className="care-grid">{translate(careSteps.map(s => <article className="care-item" key={s.title}><div className="care-item-top"><s.icon strokeWidth={1.6} size={22} aria-hidden="true"/></div><div className="care-item-copy"><h3>{translate(s.title)}</h3><p>{translate(s.text)}</p></div></article>))}</div></section>; }
const faqs = [
    ['DEAL! คืออะไร และทำอะไรให้เจ้าของบ้าน?', 'DEAL! ช่วยจัดการเส้นทางการเป็นเจ้าของธุรกิจบ้านพัก ตั้งแต่ทำเลและเอกสาร การออกแบบ ก่อสร้าง ตกแต่ง ไปจนถึงการนำบ้านเข้าสู่ระบบปล่อยเช่าและดูแลการดำเนินงาน ขอบเขตบริการและค่าใช้จ่ายให้ยึดตามแพ็กเกจและสัญญาของแต่ละโครงการ'],
    ['เป็นเจ้าของทั้งหลังกับเจ้าของร่วมต่างกันอย่างไร?', 'แบบทั้งหลังคือการเป็นเจ้าของบ้านตามสิทธิที่ระบุในสัญญาของโครงการ ส่วนแบบเจ้าของร่วมเป็นการเข้าร่วมตามสัดส่วน โดย Human Allowed ในข้อมูลโครงการนี้เริ่มต้นที่ 171,200 บาท รวมภาษี จากราคาเต็ม 1,712,000 บาท รวมภาษี สิทธิรับรายได้ผูกกับหน่วยและสัดส่วนในสัญญา โปรดตรวจสอบสัดส่วนที่เปิดรับกับทีม'],
    ['ราคานี้รวมกรรมสิทธิ์ในที่ดินด้วยไหม?', 'Human Allowed ที่นำเสนอเป็นบ้านพักบนที่ดินเช่า การเป็นเจ้าของบ้านไม่ใช่การซื้อกรรมสิทธิ์ที่ดิน โปรดขอรายละเอียดระยะเวลาเช่า เงื่อนไขต่ออายุ สิทธิในตัวบ้าน และค่าใช้จ่ายที่เกี่ยวข้องจากทีมก่อนตัดสินใจ'],
    ['ต้องดูแลผู้เข้าพักหรือทำความสะอาดเองหรือไม่?', 'DEAL! ดูแลการดำเนินงานบ้านพัก รวมถึงประสานงานการจอง ผู้เข้าพัก และงานทำความสะอาดตามแพ็กเกจที่ตกลง คุณสามารถขอรายการบริการและค่าใช้จ่ายฉบับเต็มก่อนเข้าร่วมโครงการ'],
    ['รายได้จากการปล่อยเช่าคิดอย่างไร?', 'รายได้จริงหักค่าบริหาร 30% ของรายได้รวมและค่าใช้จ่ายดำเนินงาน ก่อนจัดสรรตามชั้นและสัดส่วนที่ระบุในสัญญา ต้องยืนยันฐานรายได้ ค่าใช้จ่าย และรอบจ่ายของหน่วยที่เลือก มีรายงานรายรับ–รายจ่าย และไม่มีการรับประกันผลตอบแทน'],
    ['อยู่ต่างจังหวัดหรือต่างประเทศ เป็นเจ้าของได้ไหม?', 'คุณสามารถเริ่มพูดคุยและขอข้อมูลโครงการจากระยะไกลได้ ทีมจะอธิบายขั้นตอน เอกสาร และรูปแบบการดูแลที่เหมาะกับคุณ รวมถึงนัดหมายเข้าเยี่ยมชมเมื่อสะดวก'],
    ['จะขอแปลน รายละเอียดสัญญา หรือนัดชมได้อย่างไร?', 'เลือกปุ่มสอบถามโครงการและระบุว่าต้องการข้อมูลเพิ่มเติม แปลน หรือเข้าเยี่ยมชม การส่งแบบฟอร์มเป็นการแจ้งความสนใจเท่านั้น ยังไม่ใช่การจอง ชำระเงิน หรือยืนยันวันนัด'],
];
function FAQ() { const { translate, localizedHref } = useLanguage(); return <section className="section container faq-section" id="faq"><div><Eyebrow>{translate("GOOD QUESTIONS")}</Eyebrow><h2>{translate("คำถามที่คุณ")}<br />{translate("อาจกำลังสงสัย")}</h2><p>{translate("รู้รายละเอียดให้ชัด")}<br />{translate("ก่อนเริ่มเป็นเจ้าของ")}</p></div><div className="faq-list">{translate(faqs.map(([q, a], i) => <details key={q}><summary><span className="faq-number">{translate("0")}{translate(i + 1)}</span><span>{translate(q)}</span><Plus size={19}/></summary><p>{translate(a)}</p></details>))}</div></section>; }
function Contact() {
 const {translate,localizedHref}=useLanguage(); const {selection}=useUI();
 return <section className="contact-section contact-compact contact-reference" id="contact" aria-labelledby="contact-title">
  <div className="container contact-section-title"><h2 id="contact-title">{translate('ติดต่อ DEAL!')}</h2><p>{translate('สอบถามรายละเอียดโครงการ หรือแจ้งความสนใจนัดชม')}</p></div>
  <div className="container contact-grid">
   <div className="contact-form"><EnquiryForm initial={selection}/></div>
   <aside className="contact-company" aria-labelledby="company-contact-title">
    <h3 id="company-contact-title">{translate('ข้อมูลบริษัท')}</h3><p className="contact-company-name">{translate(PROJECT.company)}</p><span className="contact-company-brand">DEAL! · THE ART OF OWNERSHIP</span>
    <div className="contact-company-section"><h4>{translate('โครงการที่สอบถาม')}</h4><strong>Human Allowed</strong><p>{translate('เมืองเชียงใหม่ · ใกล้แม่น้ำปิง')}</p><a className="contact-map-link" href={localizedHref(projectPath+'#location')}><MapPin size={17}/>{translate('ดูทำเลโครงการ')}<ArrowUpRight size={16}/></a></div>
    <div className="contact-company-section"><h4>{translate('ต้องการข้อมูลอะไรเพิ่มเติม?')}</h4><ul><li>{translate('ราคาและสัดส่วนที่เปิดรับ')}</li><li>{translate('สิทธิ สัญญา และค่าใช้จ่าย')}</li><li>{translate('แบบบ้านและการนัดชม')}</li></ul></div>
    <p className="contact-company-note">{translate('แบบฟอร์มนี้เป็นการแจ้งความสนใจ ไม่ใช่การจองหรือชำระเงิน')}</p>
   </aside>
  </div>
 </section>;
}
export function HomePage() { const { translate, localizedHref } = useLanguage(); return <Shell><main id="main"><HomeHero /><div className="intro-strip"><span><House size={18}/>{translate(" บ้านพักปล่อยเช่า")}</span><i /><span><KeyRound size={18}/>{translate(" เจ้าของทั้งหลัง / เจ้าของร่วม")}</span><i /><span><Sparkles size={18}/>{translate(" ดูแลโดย DEAL!")}</span><a href={localizedHref("#projects")} aria-label={translate("เลื่อนลงไปดูโครงการ")}><ArrowDown size={19}/></a></div><Featured /><ConstructionProjects compact/><About /><Care /><FAQ /><Contact /></main></Shell>; }
export function ProjectsPage() { const { translate, localizedHref } = useLanguage(); return <Shell active="projects"><main id="main"><section className="catalog-head container"><div className="breadcrumb"><a href={localizedHref("/")}>{translate("หน้าหลัก")}</a><ChevronRight size={13}/><span>{translate("โครงการของเรา")}</span></div><h1>{translate("โครงการบ้านพัก")}</h1><p className="project-count">{translate("เปิดรับ 1 \u00B7 เร็ว ๆ นี้ 1")}</p></section><section className="container catalog-section"><ProjectRail><ProjectCard /><ComingSoonCard /></ProjectRail></section><ConstructionProjects /><Contact /></main></Shell>; }
function ProjectHero() { const { translate, localizedHref } = useLanguage(); const { media, toast } = useUI(); async function share() { const url = location.origin + projectPath; try {
    if (navigator.share) {
        await navigator.share({ title: 'Human Allowed เชียงใหม่ | DEAL!', url });
    }
    else {
        await navigator.clipboard.writeText(url);
        toast('คัดลอกลิงก์โครงการแล้ว');
    }
}
catch (e) {
    if (e instanceof Error && e.name === 'AbortError')
        return;
    toast('ลิงก์โครงการอยู่ในแถบที่อยู่ของเบราว์เซอร์');
} } return <><div className="container project-heading"><div className="breadcrumb"><a href={localizedHref("/")}>{translate("หน้าหลัก")}</a><ChevronRight size={13}/><a href={localizedHref("/projects")}>{translate("โครงการของเรา")}</a><ChevronRight size={13}/><span>{translate("Human Allowed")}</span></div><div className="project-heading-row"><div><Eyebrow>{translate("CHIANG MAI COLLECTION")}</Eyebrow><h1>{translate("Human Allowed")}<span className="headline-red">{translate(".")}</span></h1><p><MapPin size={16}/>{translate(" เมืองเชียงใหม่ \u00B7 ใกล้แม่น้ำปิง")}</p></div><div className="project-tools" aria-label={translate("แชร์โครงการ")}><button className="icon-button" onClick={share} aria-label={translate("แชร์โครงการ")}><Share2 size={18}/>{translate(" แชร์")}</button></div></div></div><section className="project-hero-photo"><Photo priority/><div className="project-hero-caption"><span>{translate("DESIGNED TO STAY. MADE TO OWN.")}</span><h2>{translate("พื้นที่ของการพักผ่อน")}<br />{translate("และการเป็นเจ้าของ")}</h2></div><button className="image-expand" onClick={() => media('house')}><Expand size={16}/>{translate(" ดูภาพเต็ม")}</button><small>{translate("ภาพจำลองแบบบ้าน")}</small></section></>; }
function HouseDetails() { const { translate, localizedHref } = useLanguage(); return <section className="house-section plans-only" id="house"><div className="container"><div className="section-title"><h2>{translate("แบบบ้านและโครงสร้าง")}</h2></div><HousePlans /><p className="evidence-caption">{translate("ภาพชุดนี้แสดงโครงสร้างและมุมภายนอก ส่วนผังห้อง พื้นที่ใช้สอย และรายการวัสดุ ให้ตรวจจากแบบฉบับยืนยัน")}</p></div></section>; }
const landmarks = [{ name: 'วัดเกตการาม', distance: '0.95', category: 'culture' }, { name: 'ไนท์บาซาร์เชียงใหม่', distance: '1.0', category: 'lifestyle' }, { name: 'ตลาดวโรรส (กาดหลวง)', distance: '1.4', category: 'lifestyle' }, { name: 'อนุสารไนท์มาร์เก็ต', distance: '1.4', category: 'lifestyle' }, { name: 'ประตูท่าแพ', distance: '2.2', category: 'culture' }, { name: 'ถนนคนเดินท่าแพ', distance: '2.2', category: 'lifestyle' }, { name: 'คูเมืองเชียงใหม่', distance: '2.7', category: 'culture' }, { name: 'ถนนคนเดินวัวลาย', distance: '3.3', category: 'lifestyle' }];
function Location() { const { translate, localizedHref } = useLanguage(); const [category, setCategory] = useState('all'); const { media } = useUI(); return <section className="section container" id="location"><div className="section-title"><div><Eyebrow>{translate("THE NEIGHBOURHOOD")}</Eyebrow><h2>{translate("ใกล้แม่น้ำปิง")}<br />{translate("ใกล้เสน่ห์ของเชียงใหม่")}</h2></div><p className="section-side">{translate("ทำเล 18 เชียงใหม่\u2013ลำพูน ซอย 1")}<br />{translate("อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่")}</p></div><div className="location-grid"><button className="location-map" onClick={() => media('map')} aria-label={translate("ขยายแผนที่โครงการและหมุดบ้าน")}><img src="/assets/location.webp" alt={translate("แผนที่โครงการ หมุดสีแดงแสดงตำแหน่งบ้านใกล้แม่น้ำปิงและสถานที่ท่องเที่ยวเชียงใหม่")} width="1408" height="1760" loading="lazy"/><span className="map-expand"><Expand size={15}/>{translate(" ขยายแผนที่โครงการ")}</span></button><div className="location-info"><span className="map-pin-label"><MapPin size={21}/>{translate(" YOUR PLACE IN CHIANG MAI")}</span><h3>{translate("เที่ยว ชิม ช้อป")}<br />{translate("และใช้ชีวิตในย่านเดียวกัน")}</h3><div className="tabs small-tabs" aria-label={translate("ประเภทสถานที่ใกล้เคียง")}>{translate([['all', 'ทั้งหมด'], ['culture', 'วัฒนธรรม'], ['lifestyle', 'ไลฟ์สไตล์']].map(([id, title]) => <button key={id} aria-pressed={category === id} className={category === id ? 'active' : ''} onClick={() => setCategory(id)}>{translate(title)}</button>))}</div><div className="landmarks" aria-live="polite">{translate(landmarks.filter(l => category === 'all' || l.category === category).map((l, i) => <div key={l.name}><span><small>{translate(String(i + 1).padStart(2, '0'))}</small>{translate(l.name)}</span><strong>{translate(l.distance)} <small>{translate("กม.")}</small></strong></div>))}</div><p className="fine-print">{translate("ระยะทางโดยประมาณตามแผนที่กราฟิกที่โครงการให้ไว้ โปรดตรวจสอบเส้นทางจริงก่อนเดินทาง")}</p><div className="map-actions"><a className="btn btn-outline" href={localizedHref(mapSearch)} target="_blank" rel="noopener noreferrer">{translate("ดูพื้นที่บน Google Maps ")}<ArrowUpRight size={15}/></a><a className="icon-button" href={localizedHref("/assets/location.webp")} download="Human-Allowed-Location.webp" aria-label={translate("ดาวน์โหลดแผนที่โครงการ")}><Download size={20}/></a></div></div></div></section>; }
function DecisionDetails() { const { translate, localizedHref } = useLanguage(); const { inquire } = useUI(); return <OwnershipDetails onEnquire={() => inquire({ purpose: 'details', message: 'ขอเอกสารระบุหน่วยทรัพย์และสิทธิ สัญญาเช่าที่ดิน เงื่อนไขขายต่อ และรายการค่าใช้จ่ายประกอบการตัดสินใจ' })}/>; }
function Ownership() { const { translate, localizedHref } = useLanguage(); const { inquire, selection, setSelection } = useUI(); return <section className="ownership-section"><div className="container ownership-grid"><div className="calculator-intro"><h2>{translate("คำนวณสัดส่วนที่สนใจ")}</h2></div><OwnershipPicker selection={selection} onChange={setSelection} onEnquire={inquire}/></div></section>; }
export function ProjectPage() { const { translate, localizedHref } = useLanguage(); return <Shell active="projects" project><main id="main" className="project-detail"><div className="project-opening"><ProjectHero /><ProjectSummary /></div><div className="project-decision" id="ownership"><Ownership /><InvestorBrief /></div><DecisionDetails /><HouseDetails /><Location /><Contact /></main></Shell>; }
export function PrivacyPage() { const { translate, localizedHref } = useLanguage(); return <Shell><main id="main" className="container privacy-page"><Eyebrow>{translate("YOUR INFORMATION")}</Eyebrow><h1>{translate("การใช้ข้อมูลในแบบฟอร์ม")}</h1><p>{translate("แบบฟอร์มนี้ใช้เพื่อแจ้งความสนใจในโครงการ Human Allowed เชียงใหม่กับ DEAL! บริษัท ดีลอินเวส จำกัด")}</p><h2>{translate("ข้อมูลที่จัดเก็บ")}</h2><p>{translate("ชื่อ–นามสกุล เบอร์โทรศัพท์ อีเมลและ LINE ID ที่คุณเลือกให้ งบประมาณ รูปแบบและสัดส่วนที่สนใจ รายละเอียดคำขอ วันและช่วงเวลานัดชม เวลาติดต่อ รหัสแนะนำ ข้อความเพิ่มเติม ภาษาที่เลือก หน้าที่ใช้ลงทะเบียน และวันเวลาที่ส่งข้อมูล")}</p><h2>{translate("วัตถุประสงค์")}</h2><p>{translate("ข้อมูลถูกบันทึกในระบบของเว็บไซต์ เพื่อใช้ประกอบการติดต่อกลับ ให้ข้อมูลโครงการ และประสานนัดหมายตามคำขอ การลงทะเบียนไม่ใช่การจอง ชำระเงิน หรือการยืนยันนัดหมาย")}</p><h2>{translate("การเข้าถึงและคำขอเกี่ยวกับข้อมูล")}</h2><p>{translate("หน้าเว็บไซต์ไม่มีรายการข้อมูลผู้สนใจให้บุคคลทั่วไปเปิดดู หากต้องการสอบถาม แก้ไข หรือขอให้ลบข้อมูล ให้แจ้งทีม DEAL! พร้อมรหัสอ้างอิงที่ได้รับหลังลงทะเบียน หรือส่งคำขอผ่านแบบฟอร์มโดยไม่ใส่ข้อมูลอ่อนไหวเพิ่มเติม")}</p><p className="fine-print">{translate("ข้อมูลเกี่ยวกับแบบฟอร์มเว็บไซต์ฉบับ 11 ตุลาคม 2569")}</p><a className="text-link" href={localizedHref("/")}>{translate("กลับหน้าหลัก ")}<ArrowRight size={17}/></a></main></Shell>; }
