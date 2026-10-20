'use client';
import { useLanguage } from "./language";
import { ArrowRight, Check, MapPin, House, KeyRound, Receipt } from 'lucide-react';
import { PROJECT, money } from '../lib/project';
import { OwnershipProgress } from './project-availability';
export function ProjectSummary() {
    const { translate, localizedHref } = useLanguage();
    return <section id="overview" className="project-summary container" aria-label={translate("สรุปโครงการ")}>
    <div className="summary-panel">
    <div className="summary-status"><span className="status-label"><span />{translate("เปิดรับผู้สนใจเป็นเจ้าของ")}</span><small>{translate("ข้อมูลโครงการ ")}<time dateTime={PROJECT.updated}>{translate(PROJECT.updatedLabel)}</time></small></div>
    <div className="summary-price"><div><span>{translate("เจ้าของร่วม 10% \u00B7 รวมภาษี")}</span><strong>{translate(money(PROJECT.startingPrice))} <small>{translate("บาท")}</small></strong></div><div><span>{translate("มูลค่าทั้งหลัง \u00B7 ฐานคำนวณ")}</span><strong>{translate(money(PROJECT.fullPrice))} <small>{translate("บาท")}</small></strong></div><a href={localizedHref("#ownership")} className="btn btn-outline">{translate("เลือกสัดส่วนและดูราคา ")}<ArrowRight size={17}/></a></div>
    <dl className="summary-facts"><div><dt><MapPin size={16} aria-hidden="true"/>{translate("ทำเล")}</dt><dd>{translate("เมืองเชียงใหม่ \u00B7 ใกล้แม่น้ำปิง")}</dd></div><div><dt><House size={16} aria-hidden="true"/>{translate("แบบบ้าน")}</dt><dd>{translate("2 ชั้น \u00B7 2 ห้องนอน \u00B7 2 ห้องน้ำ")}</dd></div><div><dt><KeyRound size={16} aria-hidden="true"/>{translate("การถือครอง")}</dt><dd>{translate("สิทธิในตัวบ้านบนที่ดินเช่า")}</dd></div><div><dt><Receipt size={16} aria-hidden="true"/>{translate("ค่าบริหาร")}</dt><dd>{translate("30% ของรายได้รวม")}</dd></div></dl>
    <p className="summary-footnote">{translate("ไม่รวมกรรมสิทธิ์ที่ดิน \u00B7 มีค่าใช้จ่ายดำเนินงานแยกต่างหาก \u00B7 ตรวจสอบสัดส่วนที่เปิดรับกับทีม")}</p>
    <OwnershipProgress />
    </div>
  </section>;
}
export function NextSteps() {
    const { translate, localizedHref } = useLanguage();
    return <div className="next-steps" aria-label={translate("ขั้นตอนการสอบถาม")}>
    <p className="next-steps-title">{translate("เริ่มต้นอย่างไร")}</p>
    <ol><li><span>{translate("01")}</span><div><strong>{translate("ขอรายละเอียด")}</strong><p>{translate("ฝากคำถามและช่องทางที่สะดวกให้ติดต่อ")}</p></div></li><li><span>{translate("02")}</span><div><strong>{translate("ทำความเข้าใจสิทธิและค่าใช้จ่าย")}</strong><p>{translate("พูดคุยเรื่องรูปแบบการเป็นเจ้าของและเงื่อนไขสัญญา")}</p></div></li><li><span>{translate("03")}</span><div><strong>{translate("ตัดสินใจเมื่อข้อมูลครบ")}</strong><p>{translate("ตรวจรายละเอียดก่อนตกลงเข้าร่วมโครงการ")}</p></div></li></ol>
    <p className="next-steps-note"><Check size={15}/>{translate(" สอบถามได้โดยยังไม่ต้องตัดสินใจซื้อ")}</p>
  </div>;
}
