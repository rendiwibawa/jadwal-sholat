import Head from 'next/head';
import { useState, useEffect } from 'react';

const KOTA_ID = '1301'; // KOTA JAKARTA

export default function Home() {
  const [jadwal, setJadwal] = useState(null);
  const [now, setNow] = useState(new Date());
  const [next, setNext] = useState(null);
  const [countdown, setCountdown] = useState('');

  const SHOLAT = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
  const ICONS = { subuh: '🌙', dzuhur: '☀️', ashar: '🌤️', maghrib: '🌅', isya: '🌃' };
  const LABELS = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };

  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    fetch(`https://api.myquran.com/v2/sholat/jadwal/${KOTA_ID}/${y}/${m}/${d}`)
      .then(r => r.json())
      .then(data => { if (data.status) setJadwal(data.data.jadwal); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!jadwal) return;
    const today = new Date();
    for (const s of SHOLAT) {
      const [h, m] = jadwal[s].split(':').map(Number);
      const t = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, 0);
      if (t > now) {
        setNext(s);
        const diff = t - now;
        const hh = Math.floor(diff / 3600000);
        const mm = Math.floor((diff % 3600000) / 60000);
        const ss = Math.floor((diff % 60000) / 1000);
        setCountdown(`${hh > 0 ? hh + 'j ' : ''}${mm}m ${ss}d`);
        return;
      }
    }
    setNext(null);
    setCountdown('Selesai hari ini');
  }, [now, jadwal]);

  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Head>
        <title>Jadwal Sholat Jakarta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#020617" />
        
        {/* iPhone Widget / PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sholat JKT" />
        {/* URL Logo yang kamu berikan diubah jadi apple-touch-icon */}
        <link rel="apple-touch-icon" href="https://wismakos.melonnode.my.id/favicon.svg" />
        
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <style jsx global>{`
        body { background-color: #020617 !important; margin: 0; padding: 0; }
        html { background-color: #020617 !important; }
      `}</style>

      <div className="w-full max-w-sm space-y-4 pt-safe">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 text-center border border-white/10 shadow-2xl">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Jakarta & Sekitarnya</p>
          <p className="text-6xl font-black text-white tabular-nums tracking-tighter">{timeStr}</p>
          <p className="text-white/40 text-xs font-medium mt-3">{dateStr}</p>
        </div>

        {next && jadwal && (
          <div className="bg-emerald-500 rounded-[2rem] p-6 shadow-lg shadow-emerald-500/20 flex items-center justify-between overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-20 text-7xl select-none">{ICONS[next]}</div>
            <div className="relative z-10">
              <p className="text-emerald-950/60 text-[10px] font-black uppercase tracking-widest">Berikutnya</p>
              <p className="text-emerald-950 font-black text-2xl">{LABELS[next]}</p>
              <p className="text-emerald-900 font-bold text-sm mt-0.5">Pukul {jadwal[next]}</p>
            </div>
            <div className="text-right relative z-10">
              <p className="text-emerald-950 font-black text-2xl tabular-nums">-{countdown}</p>
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden px-2 py-2">
          {jadwal ? SHOLAT.map(s => {
            const isNext = s === next;
            const [h, m] = jadwal[s].split(':').map(Number);
            const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
            const isPast = now > t;
            return (
              <div key={s} className={`flex items-center justify-between px-6 py-4 rounded-[1.8rem] transition-all duration-500 ${isNext ? 'bg-white/10 scale-[0.98]' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className={`text-2xl transition-opacity ${isPast && !isNext ? 'opacity-30' : 'opacity-100'}`}>{ICONS[s]}</span>
                  <span className={`font-bold tracking-tight ${isNext ? 'text-emerald-400' : isPast ? 'text-white/20' : 'text-white/80'}`}>
                    {LABELS[s]}
                  </span>
                </div>
                <span className={`font-black text-lg tabular-nums ${isNext ? 'text-emerald-400' : isPast ? 'text-white/20' : 'text-white/80'}`}>
                  {jadwal[s]}
                </span>
              </div>
            );
          }) : (
            <div className="py-12 text-center text-white/20 font-medium">Sinkronisasi data...</div>
          )}
        </div>

        {jadwal && (
          <div className="grid grid-cols-3 gap-3">
            {[ {k: 'imsak', l: 'Imsak'}, {k: 'terbit', l: 'Terbit'}, {k: 'dhuha', l: 'Dhuha'} ].map(item => (
                <div key={item.k} className="bg-white/5 backdrop-blur-xl rounded-3xl py-4 text-center border border-white/5">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-tighter mb-1">{item.l}</p>
                    <p className="text-white/80 font-black text-base tabular-nums">{jadwal[item.k]}</p>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
