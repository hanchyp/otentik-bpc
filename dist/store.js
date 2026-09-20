import {getWork,tiers,quote} from './data.js';
const KEY='otentik-demo-v1';
let memory=[];
export let storageAvailable=true;
try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(raw))memory=raw.filter(x=>x&&typeof x.id==='string'&&/^OTK-[a-f0-9-]+$/.test(x.id)&&getWork(x.workId)&&Object.hasOwn(tiers,x.tier)&&Number.isFinite(Date.parse(x.date))&&x.amount===quote(x.workId,x.tier).total).filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i).map(({id,workId,tier,date,amount})=>({id,workId,tier,date,amount,buyer:'Pembeli demo'}));}catch{storageAvailable=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(memory));storageAvailable=true;}catch{storageAvailable=false;}}
export const purchases=()=>memory.map(x=>({...x}));
export function purchase(workId,tier){const q=quote(workId,tier);const existing=memory.find(x=>x.workId===workId&&x.tier===tier);if(existing)return {...existing};const item={id:'OTK-'+crypto.randomUUID(),workId,tier,date:new Date().toISOString(),amount:q.total,buyer:'Pembeli demo'};memory=[item,...memory];save();return {...item};}
export function reset(){memory=[];try{localStorage.removeItem(KEY);}catch{storageAvailable=false;}}
