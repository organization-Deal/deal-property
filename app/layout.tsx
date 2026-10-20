import { LanguageProvider } from './language';
import type { Metadata } from 'next';
import './globals.css';
import './controls.css';
import './affordance.css';
import './handoff.css';
import './investor.css';
import './compact-design.css';
import './reading-layout.css';
import './desktop-layout.css';
import './language.css';
import './enquiry-form.css';
import './about.css';
export const metadata: Metadata = {
 metadataBase: new URL('https://deal-human-allowed.teechanaphat.chatgpt.site'),
 title: { default: 'DEAL! — บ้านพักที่คุณเป็นเจ้าของ เราดูแลให้', template: '%s | DEAL!' },
 description: 'สำรวจโครงการบ้านพัก Human Allowed เชียงใหม่ เลือกเป็นเจ้าของทั้งหลังหรือเจ้าของร่วม พร้อมการดูแลโดย DEAL! ตั้งแต่ทำเลจนถึงการดำเนินงานบ้านพัก',
 openGraph: { title: 'DEAL! — The Art of Ownership', description: 'เป็นเจ้าของบ้านพัก ให้ DEAL! ดูแลต่อ', images: ['/assets/house.webp'], locale: 'th_TH', type: 'website' },
 icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
 return <html lang="th"><body><LanguageProvider>{children}</LanguageProvider></body></html>;
}
