'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import { usePurchases } from '@/lib/purchases';
import { works } from '@/lib/data';
import { Motion } from './motion';

export function SiteShell({children}: {children: ReactNode}) {
  const path = usePathname(); const router = useRouter(); const purchases = usePurchases(); const previous = useRef(path);
  useEffect(() => {
    // Keep links saved from the original hash router usable on the same origin.
    const migrateHash = () => { const hash = window.location.hash; if (hash.startsWith('#/')) router.replace(hash.slice(1)); };
    migrateHash(); window.addEventListener('hashchange', migrateHash);
    return () => window.removeEventListener('hashchange', migrateHash);
  }, [router]);
  useEffect(() => { if (previous.current !== path) { document.getElementById('main')?.focus({preventScroll:true}); previous.current = path; } }, [path]);
  useEffect(() => {
    type ModelContext = {registerTool: (tool: object) => void | Promise<void>; unregisterTool?: (name: string) => void};
    const context = (document as Document & {modelContext?: ModelContext}).modelContext;
    if (!context) return;
    const name = 'read_otentik_catalog';
    try { Promise.resolve(context.registerTool({name, description:'Read demo artworks and simulated tier prices. Does not create licenses or transactions.', inputSchema:{type:'object',properties:{query:{type:'string'}},additionalProperties:false}, annotations:{readOnlyHint:true}, execute:(input: {query?: string}) => {
      if (!input || typeof input !== 'object' || (input.query !== undefined && typeof input.query !== 'string') || Object.keys(input).some(k => k !== 'query')) throw new Error('Expected optional string query.');
      const q = (input.query || '').toLowerCase(); return works.filter(w => (w.title+' '+w.category+' '+w.tags).toLowerCase().includes(q)).map(({id,title,category,prices}) => ({id,title,category,prices,simulation:true}));
    }})).catch(() => {}); } catch {}
    return () => context.unregisterTool?.(name);
  }, []);
  return <><a href="#main" className="skip" onClick={e => {e.preventDefault(); document.getElementById('main')?.focus();}}>Lewati ke konten</a><header className="header"><div className="nav-wrap"><Link className="brand" href="/" aria-label="OTENTIK beranda"><Image src="/assets/logo.svg" width={156} height={38} alt="OTENTIK" loading="eager"/></Link><nav aria-label="Navigasi utama">{[['/','Beranda'],['/katalog','Jelajahi karya'],['/lisensi','Lisensi saya']].map(([href,label]) => {const active = href === '/' ? path === '/' : path.startsWith(href); return <Link key={href} href={href} className={active?'active':''} aria-current={active?'page':undefined}>{label}{href === '/lisensi' && <> <span className="count" id="license-count">{purchases.length}</span></>}</Link>;})}</nav><Link className="button small studio-nav" href="/studio" aria-current={path==='/studio'?'page':undefined}>Studio kreator <span aria-hidden="true">↗</span></Link></div></header><main id="main" tabIndex={-1}>{children}</main><footer><div className="container footer-inner"><div><Image src="/assets/logo.svg" width={126} height={31} alt="OTENTIK"/><p>Karya punya cerita. Kreator punya hak.</p></div></div></footer><Motion/></>;
}
