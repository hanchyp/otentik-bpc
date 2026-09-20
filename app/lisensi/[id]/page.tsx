import { License } from '@/components/licenses';
export const metadata={title:'Ringkasan lisensi'};
export default async function Page({params}:{params:Promise<{id:string}>}){return <License id={(await params).id}/>;}
