import { notFound } from 'next/navigation';
import { getWork } from '@/lib/data';
import { isTier } from '@/lib/types';
import { Checkout } from '@/components/checkout';
export const metadata={title:'Simulasi checkout'};
export default async function Page({params,searchParams}: {params:Promise<{id:string}>;searchParams:Promise<{tier?:string}>}) {const w=getWork((await params).id),tier=(await searchParams).tier;if(!w||!isTier(tier))notFound();return <Checkout key={w.id+':'+tier} work={w} tier={tier}/>;}
