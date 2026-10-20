'use client';
import { useLanguage } from "./language";
import { useId, useState } from 'react';
import { PROJECT, money, ownershipPrice, parseShare, type Interest } from '../lib/project';
export function OwnershipPicker({ selection, onChange, onEnquire }: {
    selection: Interest;
    onChange: (value: Interest) => void;
    onEnquire: (value: Interest) => void;
}) {
    const { translate, localizedHref } = useLanguage();
    const id = useId();
    const [input, setInput] = useState(String(selection.sharePct ?? 10));
    const mode = selection.ownership === 'whole' ? 'whole' : 'co-owner';
    const parsed = parseShare(input);
    const unavailable = parsed !== null && parsed > PROJECT.remainingPercent;
    const invalid = mode === 'co-owner' && (parsed === null || unavailable);
    const choose = (share: number) => { setInput(String(share)); onChange({ ownership: 'co-owner', sharePct: share }); };
    return <div className="ownership-card compact-calculator" data-mode={mode}>
    <div className="ownership-tabs" role="group" aria-label={translate("รูปแบบการเป็นเจ้าของ")}>{translate([['co-owner', 'เจ้าของร่วม'], ['whole', 'ราคาทั้งหลังอ้างอิง']].map(([value, label]) => <button key={value} aria-pressed={mode === value} onClick={() => onChange({ ownership: value as 'co-owner' | 'whole', sharePct: parsed ?? undefined, shareInvalid: value === 'co-owner' && (parsed === null || unavailable) })}>{translate(label)}</button>))}</div>
    <div className="ownership-card-inner">
      <p className="calculator-availability">{translate("เหลือเปิดรับ ")}<strong>{translate(PROJECT.remainingPercent)}{translate("%")}</strong> <span>{translate("\u00B7 ยืนยันล่าสุดกับทีม")}</span></p>
      {translate(mode === 'co-owner' ? <div className="share-calculator">
        <label htmlFor={`${id}-share`}>{translate("เลือกหรือกรอกสัดส่วน")}</label>
        <div className="share-presets" role="group" aria-label={translate("เลือกเปอร์เซ็นต์ด่วน")}>{translate([10, 20, 30, 50].map(value => <button key={value} type="button" aria-pressed={parsed === value} onClick={() => choose(value)}>{translate(value)}{translate("%")}</button>))}</div>
        <div className="share-input-wrap"><input id={`${id}-share`} type="text" inputMode="decimal" value={input} maxLength={6} aria-invalid={invalid} aria-describedby={`${id}-help`} onChange={e => { setInput(e.target.value); const next = parseShare(e.target.value); onChange({ ownership: 'co-owner', sharePct: next ?? undefined, shareInvalid: next === null || next > PROJECT.remainingPercent }); }}/><span aria-hidden="true">{translate("%")}</span></div>
        <p id={`${id}-help`} className={invalid ? 'share-error' : 'share-help'}>{translate(invalid ? 'กรอก 10–60% ทศนิยมไม่เกิน 2 ตำแหน่ง' : 'กรอกเองได้ เช่น 13% · ขั้นต่ำ 10%')}</p>
      </div> : <p className="whole-reference">{translate("มูลค่าทั้งหลังใช้เป็นฐานคำนวณสัดส่วน")}<br /><strong>{translate("ยังไม่เปิดให้เลือก 100% จากยอดคงเหลือปัจจุบัน")}</strong></p>)}
      <div className="calculator-quote"><div className="calculator-result"><p className="calculation-label">{translate(mode === 'whole' ? 'มูลค่าทั้งหลังอ้างอิง · รวมภาษี' : 'ราคาตามสัดส่วน · รวมภาษี')}</p>
      <div className="ownership-price" aria-live="polite" aria-atomic="true">{translate(invalid ? '—' : money(ownershipPrice(mode, parsed ?? 10)))}<span>{translate("บาท")}</span></div>
      </div>
      {translate(mode === 'co-owner' && <button className="btn" data-enquiry-action="true" disabled={invalid} onClick={() => onEnquire({ ownership: 'co-owner', sharePct: parsed ?? 10 })}>{translate(invalid ? 'เลือกสัดส่วนระหว่าง 10–60%' : `ขอข้อมูลสำหรับสัดส่วน ${parsed}%`)}</button>)}
      </div>
      <p className="share-rights-note">{translate("ราคาเป็นการคำนวณจากมูลค่าทั้งหลัง สิทธิในหน่วยทรัพย์และฐานแบ่งรายได้ต้องยืนยันในข้อเสนอของคุณ")}</p>
      <div className="calculator-foot">
      <a className="calculator-secondary" href={localizedHref("#decision-title")}>{translate("ดูสิทธิ เงื่อนไข และค่าใช้จ่าย")}</a>
      <p className="fine-print">{translate("ค่าบริหาร 30% ของรายได้รวม + ค่าใช้จ่ายดำเนินงานแยกต่างหาก")}</p>
      <details className="calculator-notes"><summary>{translate("วิธีคำนวณและเงื่อนไข")}</summary><p>{translate("ราคาเต็ม ")}{translate(money(PROJECT.fullPrice))}{translate(" บาท \u00D7 สัดส่วนที่เลือก เป็นตัวอย่างราคาเพื่อสอบถาม ไม่ใช่การยืนยันสิทธิหรือสัดส่วนที่เปิดรับ โปรดตรวจสอบกับทีมก่อนตัดสินใจ")}</p><p>{translate("ไม่รวมกรรมสิทธิ์ที่ดิน ไม่มีการรับประกันผลตอบแทนหรือระยะคืนทุน")}</p></details>
      </div>
    </div>
  </div>;
}
