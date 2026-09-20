'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useHydrated } from '@/lib/purchases';
import { works } from '@/lib/data';
import { Card, Icon, Orbit } from './ui';

export function HomeSearch() {
  const router = useRouter();
  return <form className="search" onSubmit={e => {e.preventDefault(); const q = String(new FormData(e.currentTarget).get('q') || '').trim(); router.push('/katalog?q=' + encodeURIComponent(q));}}><Icon name="search"/><label htmlFor="search" className="sr-only">Cari karya lokal</label><input type="search" id="search" name="q" placeholder="Cari motif, ilustrasi, atau kebutuhan brandmu…" autoComplete="off"/><button className="button" type="submit">Temukan karya</button></form>;
}
export function Catalog() {
  const ready = useHydrated(); const params = useSearchParams(); const input = useRef<HTMLInputElement>(null);
  const q = params.get('q') || '';
  const requested = params.get('kategori') || 'Semua';
  const category = ['Semua','Motif','Ilustrasi'].includes(requested) ? requested : 'Semua';
  function update(query: string, cat: string) {
    const next = new URLSearchParams(); if (query) next.set('q',query); if(cat !== 'Semua') next.set('kategori',cat);
    // Next integrates the native history API with useSearchParams without a server roundtrip.
    window.history.replaceState(null, '', '/katalog' + (next.size ? '?' + next : ''));
  }
  const filtered = works.filter(w => (category === 'Semua' || w.category === category) && `${w.title} ${w.creator} ${w.city} ${w.category} ${w.tags}`.toLowerCase().includes(q.trim().toLowerCase()));
  return <div className="container page" data-motion-ready={ready}><div className="page-heading"><div className="eyebrow">Jelajahi karya</div><h1>Ide bagus dimulai<br/>dari <span>karya yang tepat.</span></h1><p>Temukan warna, bentuk, dan cerita untuk kebutuhanmu.</p></div><form className="search" onSubmit={e=>{e.preventDefault();update(q,category);}}><Icon name="search"/><label htmlFor="search" className="sr-only">Cari karya lokal</label><input ref={input} type="search" id="search" name="q" value={q} onChange={e=>update(e.target.value,category)} placeholder="Cari motif, ilustrasi, atau kebutuhan brandmu…" autoComplete="off"/><button className="button" type="submit">Cari</button></form><div className="catalog-toolbar"><div className="filters" role="group" aria-label="Filter kategori">{['Semua','Motif','Ilustrasi'].map(c => <button key={c} className={`chip ${c===category?'selected':''}`} aria-pressed={c===category} onClick={()=>update(q,c)}>{c==='Semua'?'Semua karya':c}</button>)}</div><p className="muted" role="status">{filtered.length} karya contoh</p></div><div id="results">{filtered.length ? <div className="art-grid">{filtered.map(work=><Card work={work} key={work.id}/>)}</div> : <div className="empty"><Orbit/><h2>Belum menemukan yang pas?</h2><p>Tidak ada karya untuk “{q}” dalam kategori ini.<br/>Coba kata lain atau tampilkan semua karya.</p><button className="button secondary" onClick={()=>{update('','Semua');input.current?.focus();}}>Reset filter</button></div>}</div><p className="footnote">Seluruh karya dan profil pada katalog ini merupakan contoh untuk demonstrasi.</p></div>;
}
