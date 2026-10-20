import { translations } from './translations';
export type Language = 'th' | 'zh' | 'en';
export const isLanguage = (value: unknown): value is Language => value === 'th' || value === 'zh' || value === 'en';
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = Object.entries(translations).filter(([key]) => /\{\d+\}/.test(key)).map(([key, values]) => {
 const indices: string[] = [];
 const parts = key.split(/(\{\d+\})/g);
 const pattern = parts.map(part => /^\{\d+\}$/.test(part) ? (indices.push(part), '(.+?)') : escape(part)).join('');
 return {regex: new RegExp('^' + pattern + '$'), indices, values};
});
export function translateText(text: string, language: Language): string {
 if (language === 'th') return text;
 const key = text.replace(/\s+/g, ' ').trim();
 const index = language === 'en' ? 0 : 1;
 let result = translations[key]?.[index];
 if (!result) for (const template of templates) {
  const match = key.match(template.regex);
  if (!match) continue;
  result = template.values[index].replace(/\{\d+\}/g, token => {
   const position = template.indices.indexOf(token);
   return position < 0 ? token : translateText(match[position + 1], language);
  });
  break;
 }
 return result === undefined ? text : (text.match(/^\s*/)?.[0] ?? '') + result + (text.match(/\s*$/)?.[0] ?? '');
}
// Translate display values only. React elements, IDs and form values keep their identity.
export function translateValue<T>(value: T, language: Language): T {
 if (typeof value === 'string') return translateText(value, language) as T;
 if (Array.isArray(value)) return value.map(item => translateValue(item, language)) as T;
 return value;
}
export function languageHref(href: string, language: Language): string {
 if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/assets/') || href.startsWith('/api/')) return href;
 const url = new URL(href, 'https://local.invalid');
 url.searchParams.set('lang', language);
 return url.pathname + url.search + url.hash;
}
