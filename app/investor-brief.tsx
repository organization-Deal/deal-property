'use client';
import { useLanguage } from "./language";
import { PROJECT } from '../lib/project';
import { House, Wallet, Headset } from 'lucide-react';
export function InvestorBrief() {
    const { translate, localizedHref } = useLanguage();
    return <section className="investor-brief container" aria-labelledby="buy-title">
  <h2 id="buy-title">{translate("เงินที่จ่าย ซื้ออะไร?")}</h2>
  <p className="brief-lead">{translate("ตัวบ้านพักสำหรับปล่อยเช่า ไม่รวมกรรมสิทธิ์ที่ดิน")}</p>
  <div className="brief-grid">
    <article><span className="brief-number" aria-hidden="true"><House size={19}/></span><div><h3>{translate("บ้านพร้อมอุปกรณ์")}</h3><p>{translate("2 ชั้น \u00B7 2 ห้องนอน \u00B7 2 ห้องน้ำ พร้อมเฟอร์นิเจอร์ตามแพ็กเกจ")}</p></div></article>
    <article><span className="brief-number" aria-hidden="true"><Wallet size={19}/></span><div><h3>{translate("สิทธิรับรายได้")}</h3><p>{translate("จัดสรรหลังหักค่าใช้จ่าย ตามหน่วยทรัพย์และสัญญาของคุณ")}</p></div></article>
    <article><span className="brief-number" aria-hidden="true"><Headset size={19}/></span><div><h3>{translate("ทีมดูแลการปล่อยเช่า")}</h3><p>{translate("ค่าบริหาร 30% ของรายได้รวม ไม่ใช่การรับประกันรายได้")}</p></div></article>
  </div>
  <div className="brief-note brief-disclosure"><strong>{translate("ต้องยืนยันก่อนตัดสินใจ")}</strong><p>{translate("เครื่องคำนวณใช้ราคาเต็ม ")}{translate(PROJECT.fullPrice.toLocaleString('th-TH'))}{translate(" บาทเป็นฐาน ไม่ยืนยันว่าเปอร์เซ็นต์นั้นเปิดรับอยู่ หรือรับรายได้จากทุกห้องในสัดส่วนเดียวกัน ต้องระบุหน่วยทรัพย์ ฐานแบ่งรายได้ และสิทธิใช้บ้านในเอกสารของคุณ")}</p></div>
    </section>;
}
export function MoneyAndTerms() {
    const { translate, localizedHref } = useLanguage();
    return <>
 <div className="decision-visible">
  <h3>{translate("จากยอดจอง ถึงเงินที่จัดสรร")}</h3>
  <ol className="money-steps">
   <li><span>{translate("01")}</span><div><strong>{translate("รายได้ของหน่วยทรัพย์ที่คุณมีสิทธิ")}</strong><p>{translate("ยืนยันก่อนว่าคิดจากบ้านทั้งหลัง ชั้น หรือหน่วยใด")}</p></div></li>
   <li><span>{translate("02")}</span><div><strong>{translate("หักค่าบริหาร 30% ของรายได้รวม")}</strong><p>{translate("ให้ทีมระบุฐานคำนวณและรายการหักให้ชัดในข้อตกลง")}</p></div></li>
   <li><span>{translate("03")}</span><div><strong>{translate("หักค่าใช้จ่ายดำเนินงานที่รับผิดชอบ")}</strong><p>{translate("เช่น ค่าเช่า น้ำ ไฟ ทำความสะอาด และค่าใช้จ่ายอื่นตามสัญญา")}</p></div></li>
   <li><span>{translate("04")}</span><div><strong>{translate("จัดสรรเงินสุทธิตามสิทธิของคุณ")}</strong><p>{translate("มีรายงานรายรับ\u2013รายจ่าย ส่วนวันโอนและภาระเมื่อขาดทุนต้องยืนยันก่อนเข้าร่วม")}</p></div></li>
  </ol>
  <p className="brief-note">{translate("ยังไม่แสดงประมาณการรายได้ต่อเดือน เพราะต้องยืนยันฐานรายได้และหน่วยคิดค่าใช้จ่ายก่อน ตัวเลขราคาซื้อไม่ใช่ตัวเลขผลตอบแทน")}</p>
 </div>
 <div className="decision-visible terms-summary"><h3>{translate("เงื่อนไขที่ต้องชัด ก่อนชำระเงิน")}</h3><p>{translate("ข้อมูลด้านล่างยังไม่มีรายละเอียดฉบับยืนยันบนหน้าเว็บ ควรได้รับเป็นลายลักษณ์อักษรประกอบการตัดสินใจ")}</p>
  <dl><div><dt>{translate("ระยะเวลาและสิทธิในที่ดิน")}</dt><dd>{translate("จำนวนปีเช่า การต่ออายุ และสิทธิในตัวบ้านเมื่อหมดสัญญา")}</dd></div><div><dt>{translate("ขายต่อหรือถอนตัว")}</dt><dd>{translate("เงื่อนไขโอนสิทธิ ผู้รับโอน ค่าธรรมเนียม และข้อจำกัด")}</dd></div><div><dt>{translate("กำหนดดำเนินงาน")}</dt><dd>{translate("วันชำระ ก่อสร้าง ส่งมอบ และเริ่มปล่อยเช่าของหน่วยที่เลือก")}</dd></div><div><dt>{translate("เดือนที่รายได้ไม่พอ")}</dt><dd>{translate("ผู้รับผิดชอบส่วนขาดทุน เงินสำรอง และเกณฑ์อนุมัติซ่อม")}</dd></div></dl>
  <p className="risk-line"><strong>{translate("ความเสี่ยงหลัก:")}</strong>{translate(" ผู้พักต่ำกว่าคาด ค่าซ่อมเกินงบ น้ำท่วม เงื่อนไขที่ดิน และความต่อเนื่องของทีมบริหาร ไม่มีการรับประกันรายได้หรือระยะคืนทุน")}</p>
 </div>
    </>;
}
