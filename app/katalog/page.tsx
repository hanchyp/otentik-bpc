import { Suspense } from 'react';
import { Catalog } from '@/components/catalog';
export const metadata = {title: 'Jelajahi karya'};
export default function Page() {return <Suspense fallback={<div className="container page" role="status">Memuat koleksi…</div>}><Catalog/></Suspense>;}
