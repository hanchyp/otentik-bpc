# OTENTIK — panduan identitas dan UI

Status: konsep untuk prototipe. Maskot B dipilih pengguna; nama “Orbit” adalah nama kerja. Panduan ini mengembangkan keputusan visual percakapan, bukan ketentuan dari dokumen bisnis.

## Logo dan ikon

Huruf O berupa cincin pixel biru, dengan ruang negatif persegi yang selalu terbuka dan satu pixel kuning di kanan atas. Gabungkan O dengan tulisan TENTIK sehingga terbaca OTENTIK. Ikon aplikasi menggunakan O saja, tanpa wajah atau anggota tubuh.

Sediakan versi warna, navy satu warna, dan putih pada latar gelap. Pertahankan proporsi; sisakan ruang kosong minimal satu modul pixel di sekeliling logo. Ukuran minimum awal: logo horizontal 120 px; ikon 24 px. Favicon 16 px perlu versi yang disederhanakan dan diperiksa pada ukuran sebenarnya.

## Maskot B / Orbit

Tubuh mengikuti cincin O: dua mata persegi putih berada di bidang biru bagian atas, pusat O tetap terbuka, aksen kuning selalu di kanan atas, tangan dan kaki navy. Pose awal: menyapa, merayakan, membantu. Hadirkan pada onboarding, keadaan kosong, bantuan, atau keberhasilan. Jangan menghalangi tombol maupun isi karya. Nama Orbit belum merupakan keputusan penamaan final.

## Palet resmi

| Token | Hex | Penggunaan |
|---|---|---|
| brand-blue | #1677FF | Logo, maskot, aksen |
| mango | #FFD447 | Aksen karakter, sorotan dengan teks navy |
| coral | #FF785F | Aksen sekunder, ilustrasi |
| ink | #142640 | Teks, wordmark, anggota tubuh maskot |
| white | #FFFFFF | Latar utama dan ruang negatif |
| action | #075CCF | Tombol utama dengan teks putih |
| action-hover | #064EB0 | Tombol utama saat hover |
| surface | #F5F8FC | Latar bidang pendukung |
| border | #DCE5EF | Pemisah dekoratif dan batas kartu |
| muted | #526176 | Teks sekunder |

Kode di tabel merupakan acuan implementasi jika label atau warna pada gambar generatif berbeda. Gunakan mayoritas bidang putih; biru membentuk hierarki tindakan, kuning dan coral sebagai aksen. Jangan menggunakan kuning atau coral untuk teks kecil di atas putih. Status selalu menggunakan kata atau ikon selain warna.

## Tipografi

Rekomendasi: Plus Jakarta Sans, fallback system-ui, sans-serif. Font di canvas hanya pendekatan visual; gunakan font asli saat implementasi.

| Peran | Desktop | Mobile | Bobot |
|---|---|---|---|
| Judul utama | 48 px | 32 px | 700 |
| Judul bagian | 32 px | 26 px | 700 |
| Subjudul | 24 px | 20 px | 600 |
| Isi | 16 px | 16 px | 400 |
| Label | 14 px | 14 px | 600 |

Line-height isi 1.5–1.6; judul 1.15–1.25. Hindari font pixel untuk teks panjang; karakter pixel dipusatkan pada logo dan maskot.

## Komponen website

- Tombol utama: action blue, teks putih, tinggi minimal 44 px, radius 12 px. Label menyebut tindakan, misalnya “Lihat lisensi”.
- Tombol sekunder: latar putih, garis dan teks action blue. Fokus keyboard terlihat, dengan outline 3 px dan offset 3 px.
- Input pencarian: label yang tetap tersedia, placeholder sebagai contoh, tinggi minimal 48 px, border yang cukup jelas. Jangan mengandalkan placeholder sebagai satu-satunya label.
- Kartu karya: gambar rasio 4:3, judul, kreator, jenis karya, harga awal, tautan detail. Bedakan karya contoh dari karya nyata.
- Kategori aktif: action blue dengan teks putih. Pilihan aktif juga dinyatakan melalui state aksesibilitas.
- Spasi dasar: 4, 8, 12, 16, 24, 32, 48, 64 px. Lebar konten maksimal awal 1200 px; margin mobile 20 px.
- Grid katalog: 1 kolom pada layar sempit, 2 pada tablet, 3–4 pada desktop sesuai ruang. Jangan mengecilkan teks agar kartu muat.

## Elemen grafis

Pola persegi dan jalur bertangga mengikuti geometri O. Gunakan untuk menghubungkan Karya → Lisensi → Royalti dengan hemat. Ikon fungsi konsisten dalam ukuran dan ketebalan garis; beri label jika maknanya belum jelas.

## Batas hasil saat ini

Canvas adalah gambar referensi, bukan file vektor atau komponen website yang sudah berfungsi. Sebelum produksi: rapikan logo dan karakter menjadi SVG, periksa ukuran kecil, cek kontras komponen final serta tampilan mobile. Status pembayaran, verifikasi, dan royalti dalam prototipe perlu jelas jika masih simulasi.
