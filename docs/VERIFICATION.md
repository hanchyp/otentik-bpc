# Pemeriksaan prototipe

Diperiksa 19 September 2026 melalui browser Edge headless dan preview Codex lokal.

## Lulus

- Katalog tiga karya, filter Motif, pencarian kata kunci `kuliner`, hasil kosong, dan reset filter.
- Rona Tropis: Personal Rp35.000, UMKM Rp75.000, Nasional Rp450.000.
- Pembagian UMKM: kreator Rp60.000 dan platform Rp15.000.
- Checkout memerlukan persetujuan simulasi; tanpa persetujuan transaksi tidak dibuat.
- Konfirmasi membuat ringkasan lisensi, dan hasil bertahan setelah reload.
- Royalti studio berubah dari baseline Rp172.000 menjadi Rp232.000 setelah contoh transaksi UMKM.
- Batal reset mempertahankan data; konfirmasi reset memulihkan baseline serta mengosongkan lisensi pembeli.
- Seluruh tampilan utama pada 390 px diperiksa; overflow tabel studio ditemukan dan diperbaiki.
- Setelah perbaikan: beranda, katalog, detail, checkout, dan studio tidak meluber secara horizontal pada 320 px.
- Tautan lewati-ke-konten dapat diakses melalui keyboard tanpa merusak rute.
- Tier checkout tidak valid menampilkan halaman tidak ditemukan.
- Struktur localStorage yang tidak valid diabaikan dengan aman.
- Tidak ada error JavaScript atau respons aset gagal selama pemeriksaan akhir.
- WebMCP read_otentik_catalog ditemukan pada browser pendukung. Query kuliner mengembalikan Cerita Pasar; input query numerik ditolak.
- `node scripts/check.mjs`: syntax, referensi aset/font, perhitungan 80/20 semua karya/tier, baseline, dan validasi tier lulus.

Pemeriksaan ini untuk prototipe, bukan audit aksesibilitas atau keamanan produksi. Studio adalah agregat persona contoh. Website tetap lokal dan tidak dipublikasikan.
