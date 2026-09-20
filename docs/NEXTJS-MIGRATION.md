# Migrasi Next.js — 19 September 2026

Menggunakan setup pengguna di `D:\Kuliah\lomba\BPC\OTENTIK\otentik-bpc`. Folder `frontend` sudah kosong ketika migrasi dimulai. Versi Next.js/React dan dependency yang tersedia dipertahankan; tidak menambah library.

## Implementasi

- App Router nyata dengan halaman React, Next Link, metadata per route, validasi parameter server, serta gambar melalui Next Image.
- Layout, identitas merek, font lokal, konten, katalog/filter, tiga tier, persetujuan checkout, ringkasan lisensi, studio, reset, dan WebMCP dipertahankan.
- Key `otentik-demo-v1` dan origin preview `http://127.0.0.1:4173` tetap sama. Pembacaan localStorage memakai snapshot server kosong yang stabil dan snapshot browser tervalidasi.
- Observer motion dan callback animasi dibersihkan saat komponen/route berubah. Boundary client menunggu hydration sebelum atribut animasi dipasang; perbaikan ini menghilangkan hydration warning pada Suspense katalog.
- Angka final tersedia bagi pembaca layar. Harga tetap dalam radio memakai teks biasa agar aturan CSS label mobile tidak memperlebar elemen tersembunyi.
- Arsip statis dalam `dist/` tetap tersedia tetapi tidak dijalankan oleh Next.js. Script preview Windows sekarang menjalankan Next dev. Konfigurasi hosting statis lama tidak lagi menunjuk `dist/`.

## Pemeriksaan yang selesai

- `next build`: lulus, termasuk TypeScript dan prerender halaman.
- ESLint seluruh proyek: lulus; arsip `dist/` dikecualikan.
- `node scripts/check.mjs`: seluruh 9 harga, pembagian 80/20, validasi karya/tier, aset, pemulihan data lama, deduplikasi, data rusak, fallback memori, serta reset lulus.
- Counter React: pengujian terisolasi untuk Strict Mode, reduced-motion saat mulai dan berubah, batas nilai, serta cleanup callback lulus. Preferensi OS/browser tidak diubah untuk pengujian; reduced-motion ini diuji pada logika efek, bukan emulasi browser.
- Browser Next.js: pencarian kosong, reset filter, filter Motif, pencarian kuliner, perubahan tiga tier, validasi checkbox, checkout, ringkasan lisensi, persistensi reload, dan pembaruan royalti Rp232.000 lulus.
- Reset dibatalkan mempertahankan nilai; reset dikonfirmasi mengembalikan Rp172.000 dan jumlah lisensi 0. Data transaksi uji dibersihkan lewat UI.
- Route utama diperiksa pada 320/390/768/1440 px. Overflow detail mobile ditemukan pada span pembaca layar, diperbaiki, lalu detail 320/390 diuji ulang tanpa overflow. Tidak ditemukan aset gambar rusak.
- Scroll reveal terlihat aktif, parallax desktop dibatasi 16px, parallax mobile 0px. Keyboard skip link memfokuskan `main`.
- Tautan `#/katalog?q=kuliner` berpindah ke route baru dengan hasil yang benar. Tier checkout tidak valid menampilkan halaman tidak ditemukan; karya tidak valid mengembalikan HTTP404.
- WebMCP query `kuliner` mengembalikan Cerita Pasar. Tidak ada error console baru pada pengujian ulang setelah perbaikan hydration.

Belum ada publikasi/deployment. Backend, autentikasi dan pembayaran tetap di luar cakupan prototipe.
