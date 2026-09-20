import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { money, tiers } from '@/lib/data';
import type { Work, Tier } from '@/lib/types';
import { AnimatedNumber } from './motion';

export function Icon({ name = 'file' }: { name?: string }) {
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>, spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>,
    file: <path d="M6 3h9l4 4v14H6Z M14 3v5h5 M9 12h7 M9 16h5"/>, chart: <path d="M4 20V10m8 10V4m8 16v-8"/>,
    check: <path d="m5 12 4 4L19 6"/>, back: <path d="M19 12H5m6-6-6 6 6 6"/>,
  };
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.file}</svg>;
}
export function ButtonLink({href, children, variant = ''}: {href: string; children: ReactNode; variant?: string}) { return <Link href={href} className={`button ${variant}`}>{children}</Link>; }
export function Art({work, priority = false}: {work: Work; priority?: boolean}) { return <Image src={`/assets/${work.image}`} alt={`${work.title} — ilustrasi contoh ${work.category.toLowerCase()}`} width={1024} height={1024} sizes="(max-width: 520px) 90vw, (max-width: 800px) 45vw, 520px" loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined}/>; }
export function Orbit({className = ''}: {className?: string}) { return <Image className={`orbit ${className}`} src="/assets/orbit.png" alt="Orbit, maskot O pixel OTENTIK" width={1024} height={1024} sizes="160px"/>; }
export function Back({href, children}: {href: string; children: ReactNode}) { return <Link href={href} className="back-link"><Icon name="back"/>{children}</Link>; }
export function Card({work: w}: {work: Work}) { return <article className="art-card"><Link href={`/karya/${w.id}`} className="art-link" aria-label={`Lihat ${w.title}`}><div className="art-image" style={{background:w.color}}><Art work={w}/><span className="art-category">{w.category}</span><span className="art-open"><Icon name="arrow"/></span></div><div className="art-info"><div className="creator"><span className="avatar">{w.creator[0]}</span>{w.creator}<span>· {w.city}</span></div><h3>{w.title}</h3><div className="card-bottom"><span>Mulai <strong>{money(w.prices.personal)}</strong></span><span className="tiny">Contoh karya</span></div></div></Link></article>; }
export function Split({quote: q, animate = false}: {quote: {creator: number; platform: number}; animate?: boolean}) { return <div className="split"><div><span>Untuk kreator <b>80%</b></span><strong>{animate ? <AnimatedNumber value={q.creator}/> : money(q.creator)}</strong></div><div><span>Platform <b>20%</b></span><strong>{animate ? <AnimatedNumber value={q.platform}/> : money(q.platform)}</strong></div><div className="split-track"><span/></div></div>; }
export function Rules({tier}: {tier: Tier}) { return <ul className="check-list">{tiers[tier].rules.map(rule => <li key={rule}><Icon name="check"/>{rule}</li>)}</ul>; }
export function DemoNote() { return <div className="notice"><Icon/><p><strong>Ruang simulasi.</strong> Karya dan profil kreator adalah contoh. Harga serta ketentuan belum menjadi penawaran atau kontrak nyata.</p></div>; }
export function Missing() { return <div className="container page empty"><Orbit/><h1>Halaman tidak ditemukan.</h1><p>Karya atau lisensi ini belum tersedia pada demo.</p><ButtonLink href="/katalog">Kembali ke katalog</ButtonLink></div>; }
