const IKON_MERKEZLERI = {
  merkez: [910, 70],
  'genel-bakis': [82, 201],
  'anahtar-kelimeler': [210, 201],
  rakipler: [332, 201],
  reklamlar: [457, 201],
  firsatlar: [600, 201],
  'site-sagligi': [735, 201],
  raporlar: [850, 201],
  google: [76, 832],
  siralama: [443, 458],
  grafik: [80, 458],
  performans: [320, 458],
  saglik: [76, 704],
  yenile: [950, 342],
  indir: [705, 342],
  tarih: [75, 590],
  reklam: [1450, 832]
};

/** Tek kaynak görseldeki ikonları oranını bozmadan, etiket kısmını göstermeden ortalar. */
export default function SeoGorselIkonu({ tur, boyut = 28, className = '' }) {
  const [x, y] = IKON_MERKEZLERI[tur] ?? IKON_MERKEZLERI.merkez;
  const olcek = boyut / 72;
  return (
    <span className={`seo-sprite-ikon ${className}`} style={{ '--ikon-boyutu': `${boyut}px` }} aria-hidden="true">
      <img src="/assets/seo.png" alt="" style={{ width: `${1536 * olcek}px`, height: `${1024 * olcek}px`, left: `${boyut / 2 - x * olcek}px`, top: `${boyut / 2 - y * olcek}px` }} />
    </span>
  );
}
