'use client';
import { useLanguage } from "./language";
import { useId, useRef, useState, useEffect, type FormEvent } from 'react';
import { CircleCheck, LoaderCircle, Copy, Check } from 'lucide-react';
import { enquirySchema } from '../lib/enquiry';
import { PROJECT, money, ownershipPrice, parseShare, type Interest } from '../lib/project';
export function EnquiryForm({ initial = {} }: {
    initial?: Interest;
}) {
    const { translate, localizedHref, language } = useLanguage();
    const uid = useId();
    const [shareInput, setShareInput] = useState(String(initial.sharePct ?? 10));
    useEffect(() => setShareInput(String(initial.sharePct ?? 10)), [initial.sharePct]);
    const [ownership, setOwnership] = useState(initial.shareInvalid ? 'undecided' : initial.ownership || 'undecided');
    const [message,setMessage]=useState(initial.message||'');
    useEffect(()=>setMessage(initial.message||''),[initial.message]);
    const [purpose, setPurpose] = useState(initial.purpose || 'details');
    useEffect(() => setPurpose(initial.purpose || 'details'), [initial.purpose]);
    const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [reference, setReference] = useState('');
    const [copied, setCopied] = useState(false);
    const [today, setToday] = useState('');
    const requestId = useRef<string | null>(null);
    const submitting = useRef(false);
    const success = useRef<HTMLDivElement>(null);
    useEffect(() => { setToday(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date())); }, []);
    useEffect(() => { setOwnership(initial.shareInvalid ? 'undecided' : initial.ownership || 'undecided'); }, [initial.ownership, initial.shareInvalid]);
    useEffect(() => { if (status === 'success')
        success.current?.focus(); }, [status]);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting.current)
            return;
        const form = event.currentTarget;
        const fields = new FormData(form);
        requestId.current ??= crypto.randomUUID();
        const payload = {
            language, requestId: requestId.current, name: `${String(fields.get('firstName')||'').trim()} ${String(fields.get('lastName')||'').trim()}`.trim(), firstName: fields.get('firstName'), lastName: fields.get('lastName'), phone: fields.get('phone'),
            email: fields.get('email') || '', project: 'human-allowed-chiang-mai', ownership, purpose,
            sharePct: ownership === 'whole' ? 100 : ownership === 'co-owner' ? Number(shareInput.replace(',', '.')) : undefined,
            visitDate: fields.get('visitDate') || '', contactTime: fields.get('contactTime') || 'any',
            lineId: fields.get('lineId') || '', budget: fields.get('budget') || 'undecided', referralCode: fields.get('referralCode') || '', visitTime: fields.get('visitTime') || 'any',
            message: fields.get('message') || '', website: fields.get('website') || '',
            consent: fields.get('consent') === 'on', source: (location.pathname + location.search).slice(0, 500),
        };
        const parsed = enquirySchema.safeParse(payload);
        if (!parsed.success) {
            const next: Record<string, string> = {};
            for (const issue of parsed.error.issues)
                next[String(issue.path[0])] ??= issue.message;
            setErrors(next);
            setError('ตรวจสอบช่องที่ระบุก่อนส่งอีกครั้ง');
            const invalid = form.elements.namedItem(String(parsed.error.issues[0].path[0]));
            if (invalid instanceof HTMLElement) {
                invalid.closest('details')?.setAttribute('open', '');
                invalid.focus();
            }
            return;
        }
        setErrors({});
        setError('');
        setStatus('pending');
        submitting.current = true;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data), signal: controller.signal });
            const result = await response.json() as {
                id?: string;
                error?: string;
            };
            if (!response.ok || !result.id)
                throw new Error(result.error || 'ยังไม่ได้รับการยืนยัน กรุณาลองส่งอีกครั้ง');
            setReference(result.id);
            setStatus('success');
        }
        catch (err) {
            setError(err instanceof Error && err.name !== 'AbortError' ? err.message : 'ยังยืนยันการส่งไม่ได้ ข้อมูลที่กรอกยังอยู่ กดส่งอีกครั้งได้โดยไม่บันทึกซ้ำหากข้อมูลเดิมถูกบันทึกแล้ว');
            setStatus('idle');
        }
        finally {
            clearTimeout(timer);
            submitting.current = false;
        }
    }
    const fieldError = (name: string) => errors[name] ? <span className="field-error" id={`${uid}-${name}-error`}>{translate(errors[name])}</span> : null;
    if (status === 'success')
        return <div className="form-success enquiry-success" role="status" ref={success} tabIndex={-1}>
    <CircleCheck size={44} strokeWidth={1.4}/><h3>{translate("บันทึกคำขอแล้ว")}</h3>
    <p>{translate("เรื่อง ")}{translate(purpose === 'visit' ? 'นัดหมายเยี่ยมชม' : purpose === 'plans' ? 'ขอแปลนและรายละเอียดบ้าน' : 'สอบถามรายละเอียด')}<br />{translate(PROJECT.name)}{translate(" \u00B7 เชียงใหม่")}</p>
    <p className="success-next">{translate("สถานะ: บันทึกในระบบแล้ว \u00B7 ยังไม่ยืนยันการรับเรื่องโดยเจ้าหน้าที่")}<br />{translate("เก็บรหัสอ้างอิงไว้ติดตามกับทีมที่คุณติดต่อ")}</p><div className="reference"><span>{translate("รหัสอ้างอิงคำขอ")}</span><strong>{translate(reference)}</strong></div>
    <button className="btn btn-outline" onClick={async () => { try {
            await navigator.clipboard.writeText(reference);
            setCopied(true);
        }
        catch {
            setError('คัดลอกอัตโนมัติไม่ได้ โปรดจดรหัสอ้างอิงด้านบน');
        } }}>{translate(copied ? <Check size={16}/> : <Copy size={16}/>)} {translate(copied ? 'คัดลอกรหัสแล้ว' : 'คัดลอกรหัสอ้างอิง')}</button>
    {translate(error && <p className="form-error">{translate(error)}</p>)}
    <p className="fine-print">{translate("เก็บรหัสนี้ไว้เมื่อติดต่อกับทีม DEAL!")}<br />{translate("คำขอนี้ยังไม่ใช่การจอง ชำระเงิน หรือยืนยันวันนัดชม")}</p>
    <button className="text-button" onClick={() => { requestId.current = null; setStatus('idle'); setError(''); setCopied(false); }}>{translate("ส่งคำขอเรื่องอื่น")}</button>
  </div>;
    return <form className="enquiry-form enquiry-form-v2" onSubmit={submit} aria-busy={status === 'pending'}>
      <div className="form-project"><span className="small-red-dot"/><span>{translate('HUMAN ALLOWED · เชียงใหม่')}</span></div>
      <p className="form-intro">{translate('กรอกข้อมูลเพื่อติดต่อทีม DEAL! ไม่มีการชำระเงินในขั้นตอนนี้')}</p>
      <fieldset disabled={status === 'pending'} className="enquiry-fields">
        <section className="enquiry-group" aria-labelledby={`${uid}-contact-heading`}>
          <h3 id={`${uid}-contact-heading`}>{translate('ข้อมูลติดต่อ')}</h3>
          <div className="form-grid">
            <label htmlFor={`${uid}-firstName`}>{translate('ชื่อ')} <span className="required-mark">*</span><input id={`${uid}-firstName`} name="firstName" autoComplete="given-name" placeholder={translate('ชื่อ')} required minLength={1} maxLength={59} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName?`${uid}-firstName-error`:undefined}/>{fieldError('firstName')}</label>
            <label htmlFor={`${uid}-lastName`}>{translate('นามสกุล')} <span className="required-mark">*</span><input id={`${uid}-lastName`} name="lastName" autoComplete="family-name" placeholder={translate('นามสกุล')} required minLength={1} maxLength={59} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName?`${uid}-lastName-error`:undefined}/>{fieldError('lastName')}</label>
            <label htmlFor={`${uid}-phone`}>{translate('เบอร์โทรศัพท์')} <span className="required-mark">*</span><input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={translate('08x xxx xxxx หรือ +รหัสประเทศ')} required maxLength={24} aria-invalid={!!errors.phone} aria-describedby={`${uid}-phone-help${errors.phone?` ${uid}-phone-error`:''}`}/><small id={`${uid}-phone-help`}>{translate('รองรับเบอร์ไทยและเบอร์ต่างประเทศ เช่น +86 หรือ +852')}</small>{fieldError('phone')}</label>
            <label htmlFor={`${uid}-email`}>{translate('อีเมล')} <span className="optional-label">{translate('(ไม่บังคับ)')}</span><input id={`${uid}-email`} name="email" type="email" autoComplete="email" placeholder="your@email.com" maxLength={200} aria-invalid={!!errors.email} aria-describedby={errors.email?`${uid}-email-error`:undefined}/>{fieldError('email')}</label>
            <label htmlFor={`${uid}-lineId`}>LINE ID <span className="optional-label">{translate('(ไม่บังคับ)')}</span><input id={`${uid}-lineId`} name="lineId" autoCapitalize="none" spellCheck={false} placeholder={translate('LINE ID ของคุณ')} maxLength={100} aria-invalid={!!errors.lineId}/>{fieldError('lineId')}</label>
            <label htmlFor={`${uid}-time`}>{translate('ช่วงเวลาที่สะดวกให้ติดต่อกลับ')}<select id={`${uid}-time`} name="contactTime"><option value="any">{translate('ไม่ระบุช่วงเวลา')}</option><option value="morning">{translate('ช่วงเช้า')}</option><option value="afternoon">{translate('ช่วงบ่าย')}</option><option value="evening">{translate('ช่วงเย็น')}</option></select><small>{translate('เวลาประเทศไทย (UTC+7)')}</small></label>
          </div>
        </section>
        <section className="enquiry-group" aria-labelledby={`${uid}-interest-heading`}>
          <h3 id={`${uid}-interest-heading`}>{translate('เรื่องที่สนใจ')}</h3>
          <div className="form-grid">
            <label htmlFor={`${uid}-purpose`}>{translate('ต้องการข้อมูลเรื่องไหน')}<select id={`${uid}-purpose`} name="purpose" value={purpose} onChange={e=>setPurpose(e.target.value as typeof purpose)}><option value="details">{translate('รายละเอียดการเป็นเจ้าของ')}</option><option value="plans">{translate('แปลนและรายละเอียดบ้าน')}</option><option value="visit">{translate('นัดหมายเยี่ยมชมโครงการ')}</option></select></label>
            <label htmlFor={`${uid}-budget`}>{translate('งบประมาณที่สนใจ')}<select id={`${uid}-budget`} name="budget"><option value="undecided">{translate('ยังไม่กำหนด')}</option><option value="under-200k">{translate('ต่ำกว่า 200,000 บาท')}</option><option value="200k-500k">{translate('200,000–500,000 บาท')}</option><option value="500k-1m">{translate('มากกว่า 500,000–1,000,000 บาท')}</option><option value="1m-2m">{translate('มากกว่า 1,000,000–2,000,000 บาท')}</option><option value="over-2m">{translate('มากกว่า 2,000,000 บาท')}</option></select>{fieldError('budget')}</label>
            <label className={ownership==='co-owner'?'':'full'} htmlFor={`${uid}-own`}>{translate('รูปแบบที่สนใจ')}<select id={`${uid}-own`} name="ownership" value={ownership} onChange={e=>setOwnership(e.target.value as typeof ownership)}><option value="undecided">{translate('ขอคำแนะนำก่อน')}</option><option value="co-owner">{translate('เจ้าของร่วม เริ่ม 171,200 บาท')}</option><option value="whole">{translate('สอบถามทางเลือกทั้งหลัง · ยังไม่ยืนยันเปิดรับ')}</option></select></label>
            {ownership==='co-owner'&&<label htmlFor={`${uid}-share`}>{translate('สัดส่วนที่สนใจ (%)')}<input id={`${uid}-share`} name="sharePct" type="number" inputMode="decimal" min={10} max={PROJECT.remainingPercent} step="0.01" required value={shareInput} onChange={e=>setShareInput(e.target.value)} aria-invalid={!!errors.sharePct} aria-describedby={`${uid}-share-help`}/><small id={`${uid}-share-help`}>{translate(parseShare(shareInput)!==null?`${shareInput}% = ${money(ownershipPrice('co-owner',parseShare(shareInput)!))} บาท รวมภาษี`:'กรอกสัดส่วน 10–60% ทศนิยมได้ไม่เกิน 2 ตำแหน่ง')}</small>{fieldError('sharePct')}</label>}
            {purpose==='visit'&&<div className="full visit-fields"><div className="form-grid"><label htmlFor={`${uid}-visitDate`}>{translate('วันที่สะดวกเข้าเยี่ยมชม')} <span className="required-mark">*</span><input id={`${uid}-visitDate`} name="visitDate" type="date" min={today} required aria-invalid={!!errors.visitDate}/>{fieldError('visitDate')}</label><label htmlFor={`${uid}-visitTime`}>{translate('ช่วงเวลาที่ต้องการนัดชม')}<select id={`${uid}-visitTime`} name="visitTime"><option value="any">{translate('ให้ทีมเสนอเวลา')}</option><option value="morning">{translate('ช่วงเช้า')}</option><option value="afternoon">{translate('ช่วงบ่าย')}</option></select></label></div><p>{translate('เวลาประเทศไทย (UTC+7)')} · {translate('ทีมจะยืนยันวันและเวลาอีกครั้ง')}</p></div>}
            <label className="full enquiry-message" htmlFor={`${uid}-message`}>{translate('รายละเอียดเพิ่มเติม')} <span className="optional-label">{translate('(ไม่บังคับ)')}</span><textarea id={`${uid}-message`} name="message" value={message} onChange={e=>setMessage(e.target.value)} maxLength={1500} rows={4} placeholder={translate('เช่น อยากทราบสิทธิในตัวบ้าน เงื่อนไขเช่า หรือค่าใช้จ่าย')} aria-invalid={!!errors.message} aria-describedby={`${uid}-message-count`}/><small id={`${uid}-message-count`} className="message-count">{message.length}/1,500</small>{fieldError('message')}</label>
            <label className="full" htmlFor={`${uid}-referralCode`}>{translate('รหัสแนะนำ (ถ้ามี)')}<input id={`${uid}-referralCode`} name="referralCode" placeholder={translate('รหัสแนะนำ')} maxLength={80} autoCapitalize="none" aria-invalid={!!errors.referralCode}/>{fieldError('referralCode')}</label>
          </div>
        </section>
        <div className="honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
        <div className="enquiry-submit-area"><label className="consent"><input type="checkbox" name="consent" required/><span>{translate('ยินยอมให้ ')}{translate(PROJECT.company)}{translate(' ใช้ข้อมูลเพื่อติดต่อเรื่องโครงการตามคำขอนี้ ')}<a href={localizedHref('/privacy')} target="_blank" rel="noopener">{translate('อ่านรายละเอียดการใช้ข้อมูล')}</a></span></label>
        {error&&<p className="form-error" role="alert">{translate(error)}</p>}
        <button className="btn form-submit" disabled={status==='pending'} type="submit">{status==='pending'?<><LoaderCircle size={18} className="spin"/>{translate('กำลังบันทึก')}</>:translate('ส่งคำขอสอบถาม')}</button>
        <p className="form-note">{translate('เมื่อบันทึกสำเร็จ คุณจะได้รับรหัสอ้างอิงบนหน้าจอ')}</p></div>
      </fieldset>
    </form>;
}
