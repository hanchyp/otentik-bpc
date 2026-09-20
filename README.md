# OTENTIK — Next.js

Prototipe marketplace lisensi karya lokal. Menggunakan setup Next.js 16.3.5, React 19, TypeScript, dan App Router yang sudah tersedia. Tidak menambah dependency.

## Menjalankan

```powershell
cd D:\Kuliah\lomba\BPC\OTENTIK\otentik-bpc
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Alternatif Windows: `./start-preview.ps1`. Preview: http://127.0.0.1:4173.
Gunakan hostname dan port yang sama dengan versi lama agar data localStorage tetap terbaca. `npm run dev` tanpa argumen memakai port 3000 dengan penyimpanan browser terpisah.

```powershell
npm run build
npm start -- --hostname 127.0.0.1 --port 4173
node scripts/check.mjs
npm run lint
```

## Struktur aktif

- `app/`: halaman server, metadata, stylesheet, dan route Next.js.
- `components/`: komponen React untuk katalog, pilihan tier, checkout, lisensi, studio, navigasi, dan motion.
- `lib/data.js`: tiga karya, harga tier, aturan contoh, serta pembagian 80/20.
- `lib/purchases.ts`: penyimpanan browser yang aman untuk SSR/hydration, validasi data lama, deduplikasi, sinkronisasi tab, dan fallback memori.
- `public/assets/`: logo O, Orbit, ilustrasi, font Jakarta lokal dan lisensinya.
- `docs/`: brief serta referensi identitas merek.

Route: `/`, `/katalog`, `/karya/[id]`, `/checkout/[id]?tier=umkm`, `/lisensi`, `/lisensi/[id]`, `/studio`. Tautan lama `#/...` dialihkan di client. Route detail dan checkout memvalidasi karya/tier; halaman lisensi membaca data lokal setelah hydration.

`dist/`, `server.mjs`, dan `scripts/motion-check.mjs` adalah arsip prototipe statis sebelumnya, bukan runtime atau hasil build Next.js. Jangan mengeditnya untuk pengembangan baru. Build Next.js ada di `.next/`. Konfigurasi Sites statis lama telah dinonaktifkan; belum ada deployment baru.

## Motion dan aksesibilitas

IntersectionObserver bersama dan CSS mengatur reveal, stagger, parallax maksimum 16px (desktop), hover kartu, serta bar royalti. AnimatedNumber menangani angka dengan nilai final tetap tersedia bagi pembaca layar. Efek membersihkan observer/listener/frame saat route berubah. Konten tetap terlihat sebelum JavaScript berjalan.

Untuk menonaktifkan animasi, gunakan preferensi sistem **Reduce motion** / matikan **Animation effects**. Website mengikuti `prefers-reduced-motion`, termasuk perubahan preferensi saat halaman terbuka.

## Batas prototipe

Transaksi, kreator, harga dan lisensi tetap simulasi. Belum ada autentikasi, backend, pembayaran, kontrak, AI, atau blockchain nyata. Data memakai key `otentik-demo-v1`, dapat hilang jika browser dibersihkan, dan tidak lintas perangkat. Pembelian karya+tier yang sama membuka lisensi yang sudah ada. Studio menghitung semua kreator contoh.

Tool WebMCP opsional `read_otentik_catalog` tetap tersedia pada browser pendukung; hanya membaca data katalog.
