import type { Metadata, Viewport } from 'next';
import { SiteShell } from '@/components/site-shell';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'OTENTIK — Karya lokal, peluang baru', template: '%s — OTENTIK' },
  description: 'Jelajahi karya lokal, pilih lisensi sesuai kebutuhan, dan lihat pembagian royalti.',
  icons: { icon: '/assets/mark.svg' },
};
export const viewport: Viewport = { themeColor: '#1677FF' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body><SiteShell>{children}</SiteShell></body></html>;
}
