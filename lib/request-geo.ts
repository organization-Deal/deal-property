import {AsyncLocalStorage} from 'node:async_hooks';
type Geo={country?:unknown;region?:unknown;city?:unknown};
const storage=new AsyncLocalStorage<Geo>();
export function withRequestGeo<T>(request:Request,fn:()=>T):T{return storage.run((request as Request & {cf?:Geo}).cf||{},fn)}
export function requestGeo(request:Request){const cf=storage.getStore()||(request as Request & {cf?:Geo}).cf||{};const clean=(v:unknown,n:number)=>typeof v==='string'?v.replace(/[<>\x00-\x1f]/g,'').slice(0,n):'';return {country:/^[A-Z]{2}$/.test(String(cf.country))?String(cf.country):'',region:clean(cf.region,100),city:clean(cf.city,100)}}
