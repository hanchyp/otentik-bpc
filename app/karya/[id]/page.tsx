import { notFound } from 'next/navigation';
import { getWork } from '@/lib/data';
import { isTier } from '@/lib/types';
import { Detail } from '@/components/detail';
type Props = {params: Promise<{id:string}>; searchParams: Promise<{tier?:string}>};
export async function generateMetadata({params}:Props) {const w=getWork((await params).id);return {title:w?.title || 'Karya tidak ditemukan'};}
export default async function Page({params,searchParams}:Props) {const w=getWork((await params).id);if(!w)notFound();const tier=(await searchParams).tier;return <Detail key={w.id+':'+tier} work={w} initialTier={isTier(tier)?tier:'umkm'}/>;}
