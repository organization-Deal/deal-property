const fs=require('node:fs');const ts=require('typescript');const assert=require('node:assert/strict');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,filename);
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const {LanguageProvider}=require('../app/language.tsx');const pages=require('../app/site.tsx');
const {translateText,languageHref}=require('../lib/i18n.ts');const {translations}=require('../lib/translations.ts');const {ownershipPrice}=require('../lib/project.ts');const {OwnershipPicker}=require('../app/ownership-picker.tsx');const {EnquiryForm}=require('../app/enquiry-form.tsx');
let checks=0;function check(c,m){assert.ok(c,m);checks++}
const render=(language,element)=>renderToStaticMarkup(React.createElement(LanguageProvider,{initialLanguage:language},element));
for(const language of ['th','zh','en']){
 for(const name of ['HomePage','ProjectsPage','ProjectPage','PrivacyPage']){
  const html=render(language,React.createElement(pages[name]));
  check(html.includes('DEAL!')&&html.includes('id="main"'),name+' rendered '+language);
  check(new RegExp('<option[^>]*value="'+language+'"[^>]*selected=""').test(html), 'Selected language '+language);
  check(html.includes('lang='+language),'Links retain language');
  if(language!=='th'){
   const text=html.replace(/<option[^>]*lang="th"[^>]*>ไทย<\/option>/g,'').replace(/<[^>]*>/g,'');
   const thai=text.match(/[^<>]{0,40}[\u0e00-\u0e7f][^<>]{0,80}/g);
   check(!thai, name+' untranslated '+language+': '+JSON.stringify(thai));
   for(const [,value] of html.matchAll(/(?:aria-label|aria-valuetext|placeholder|alt)="([^"]*)"/g))check(!/[\u0e00-\u0e7f]/.test(value),'untranslated accessible text: '+value);
  }
 }
 const picker=render(language,React.createElement(OwnershipPicker,{selection:{ownership:'co-owner',sharePct:13},onChange:()=>{},onEnquire:()=>{}}));
 check(picker.includes('222,560'),'13% calculation unchanged '+language);
 check(picker.includes(translateText('ขอข้อมูลสำหรับสัดส่วน 13%',language)),'dynamic CTA translated '+language);
 const invalid=render(language,React.createElement(OwnershipPicker,{selection:{ownership:'co-owner',sharePct:61},onChange:()=>{},onEnquire:()=>{}}));
 check(invalid.includes('disabled=""'),'61% remains unavailable '+language);
 const form=render(language,React.createElement(EnquiryForm,{initial:{purpose:'visit',ownership:'co-owner',sharePct:13}}));
 check(form.includes('222,560'),'form preserves amount '+language);
 check(form.includes('name="visitDate"'),'visit field retained '+language);
 if(language!=='th')check(!/[\u0e00-\u0e7f]/.test(form.replace(/<[^>]*>/g,'')),'translated form '+language);
}
for(const [key,values] of Object.entries(translations))for(const language of ['en','zh']){
 const result=translateText(key,language);check(result&&result!==undefined,'translation exists');
 check(!/[\u0e00-\u0e7f]/.test(result),'Thai in translation '+key);
 const placeholders=v=>[...v.matchAll(/\{\d+\}/g)].map(m=>m[0]).sort().join(',');
 check(placeholders(key)===placeholders(values[language==='en'?0:1]),'placeholder integrity '+key);
}
check(translateText('มีเจ้าของแล้ว 40% เหลือเปิดรับ 60%','en')==='40% allocated, 60% still available','dynamic availability');
check(translateText('ขยายแบบบ้าน มุมเฉียงด้านหน้า','zh')==='放大房屋图纸：正面斜视图','nested translated parameter');
check(languageHref('/projects?x=1#house','zh')==='/projects?x=1&lang=zh#house','URL keeps query and hash');
check(languageHref('/assets/house.webp','en')==='/assets/house.webp','assets unchanged');
check(languageHref('https://example.com','zh')==='https://example.com','external links unchanged');
check(ownershipPrice('co-owner',13)===222560,'shared calculation');
console.log(`PASS: ${checks} multilingual rendering, translation and calculation checks. Browser layout not tested.`);
