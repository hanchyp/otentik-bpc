import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { works, quote, tiers, baseline } from '../lib/data.js';
import ts from 'typescript';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';

for(const w of works){
  await access(new URL('../public/assets/'+w.image,import.meta.url));
  for(const tier of Object.keys(tiers)){const q=quote(w.id,tier);assert.equal(q.total,q.creator+q.platform);assert.equal(q.creator,q.total*.8);}
}
assert.throws(()=>quote('missing','umkm'));assert.throws(()=>quote(works[0].id,'invalid'));
assert.equal(baseline.reduce((s,p)=>s+p.amount*.8,0),172000);
const source=await readFile(new URL('../lib/purchases.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const data=await import('../lib/data.js');
function store(initial='[]',blocked=false){
  let saved=initial;
  const exports={};
  const context=vm.createContext({exports,require:name=>name==='react'?{useSyncExternalStore:(_,get)=>get()}:name==='./data'?data:{isTier:v=>typeof v==='string'&&Object.hasOwn(tiers,v)},
    localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;},setItem(_,v){if(blocked)throw Error('blocked');saved=v;},removeItem(){saved=null;}},
    window:{addEventListener(){},removeEventListener(){}},crypto:{randomUUID}});
  vm.runInContext(compiled,context);return {api:exports,saved:()=>saved};
}
const s=store();assert.equal(s.api.usePurchases().length,0);
const p=s.api.purchase('rona-tropis','umkm');assert.equal(p.amount,75000);
assert.equal(s.api.purchase('rona-tropis','umkm').id,p.id);assert.equal(s.api.usePurchases().length,1);
const restored=store(s.saved());assert.equal(restored.api.usePurchases()[0].id,p.id);
assert.equal(store('{broken').api.usePurchases().length,0);
assert.equal(store(JSON.stringify([{...p,amount:1}])).api.usePurchases().length,0);
assert.equal(store(JSON.stringify([p,p])).api.usePurchases().length,1);
const blocked=store('[]',true);blocked.api.purchase('ruang-warna','personal');assert.equal(blocked.api.usePurchases().length,1);assert.equal(blocked.api.storageAvailable,false);
s.api.resetPurchases();assert.equal(s.api.usePurchases().length,0);assert.equal(s.saved(),null);
console.log('PASS: assets, all 9 quotes, 80/20, storage migration, persistence, duplicate prevention, malformed data, memory fallback, reset.');

// Exercise the actual React counter effect without changing OS motion preferences.
const motionSource=await readFile(new URL('../components/motion.tsx',import.meta.url),'utf8');
const motionJS=ts.transpileModule(motionSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
function counter(reduce=false){
  const visual={textContent:''},refs=[{current:visual},{current:null}],effects=[],frames=new Map();
  let index=0,id=0,intersection;
  const preference={matches:reduce,addEventListener:(_,fn)=>preference.changed=fn,removeEventListener(){}};
  class Observer{constructor(fn){intersection=fn;}observe(){}disconnect(){}}
  const exports={};
  vm.runInNewContext(motionJS,{exports,require:name=>name==='react'?{useRef:()=>refs[index++],useLayoutEffect:fn=>effects.push(fn),useEffect(){}}:name==='next/navigation'?{}:name==='react/jsx-runtime'?{jsx:()=>null,jsxs:()=>null}:data,
    matchMedia:()=>preference,window:{IntersectionObserver:Observer},IntersectionObserver:Observer,
    performance:{now:()=>100},requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)});
  exports.AnimatedNumber({value:232000,onView:true});
  return {visual,effects,frames,preference,show:()=>intersection([{isIntersecting:true}]),tick(time){const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(time));}};
}
const reducedCounter=counter(true);reducedCounter.effects[0]();assert.equal(reducedCounter.visual.textContent,data.money(232000));assert.equal(reducedCounter.frames.size,0);
const animated=counter();const firstCleanup=animated.effects[0]();firstCleanup();animated.effects[0]();animated.show();
animated.tick(99);assert.equal(animated.visual.textContent,data.money(0));
animated.tick(400);assert.ok(animated.frames.size>0);
animated.preference.matches=true;animated.preference.changed();assert.equal(animated.visual.textContent,data.money(232000));assert.equal(animated.frames.size,0);
console.log('PASS: React Strict Mode replay, reduced-motion startup/live change, counter bounds, final values and animation cleanup.');
