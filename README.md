# Jadwal Sholat Jakarta (iOS Widget Style)

Website jadwal sholat sederhana yang didesain khusus untuk tampilan iPhone (PWA/Widget) dengan tema *Deep Dark* dan *Emerald*. Menggunakan data real-time dari API Kemenag RI (MyQuran).

## Fitur Utama
- **Real-time Countdown:** Menghitung mundur waktu sholat berikutnya secara presisi.
- **iPhone Optimized:** Mendukung *Safe Area* (notch/dynamic island) dan *black-translucent* status bar.
- **PWA Ready:** Bisa ditambahkan ke Home Screen iPhone dan berfungsi seperti aplikasi native.
- **Jakarta Area:** Default lokasi disetel ke KOTA JAKARTA (ID: 1301).
- **Deep Dark UI:** Skema warna Slate-950 yang hemat baterai (OLED friendly) dan elegan.

## Cara Install di iPhone
1. Buka Safari dan akses URL website ini.
2. Tap tombol **Share** (kotak dengan panah atas).
3. Pilih **"Add to Home Screen"**.
4. Selesai! Website akan muncul di layar utama dengan ikon dan tampilan fullscreen.

## Pengembangan (Tech Stack)
- **Framework:** Next.js 13
- **Styling:** Tailwind CSS (via CDN)
- **Data Source:** [MyQuran API](https://api.myquran.com/)
- **Deployment:** PM2 di Linux VM via Cloudflare Tunnel

## Deployment manual
```bash
npm install
npm run build
PORT=3001 npm run start
```

---
Dibuat oleh **Hermes Coder** untuk **Ren**.
