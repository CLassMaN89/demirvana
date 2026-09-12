import { useMemo } from 'react';
import {
  Package, FolderTree, FileClock, MessageCircle, Award, Image as ImageIcon,
  BarChart3, PieChart, Zap, ListTree, Layers, Calendar, Plus, TrendingUp, TrendingDown,
  Clock, Mail, Images
} from 'lucide-react';
import '../stiller/yonetim.css';

function urunMenuKategorisi(urun) {
  return urun.menu_kategori_adi ?? urun.kategori_adi;
}

function detayHazirlaniyorMu(urun) {
  if (urun.detay_hazir_mi === false) return true;
  try {
    const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
    return teknik?.detay_hazir_mi === false;
  } catch {
    return false;
  }
}

// Ziyaretçi trafiği ve "son aktiviteler" gibi alanlar için henüz bir analitik/aktivite kaydı sistemi yok;
// bu bölüm kurulana kadar tasarımı tamamlamak amacıyla örnek değerler kullanılır.
const ZIYARETCI_ORNEK_VERISI = [820, 960, 1120, 980, 1340, 1180, 1482];
const SON_AKTIVITELER_ORNEK = [
  { metin: 'Yeni ürün eklendi', detay: 'Metal Sitli Sürgülü Vana F4 D-001', zaman: '2 saat önce' },
  { metin: 'Ürün güncellendi', detay: 'Çamur Sandığı Köşe Tip D-205', zaman: '3 saat önce' },
  { metin: 'Yeni iletişim formu', detay: 'ornek@firma.com', zaman: '1 gün önce' },
  { metin: 'Sayfa güncellendi', detay: 'Teknik Dokümanlar', zaman: '2 gün önce' }
];

function IstatistikKarti({ ikon: Ikon, baslik, deger, degisim, notu }) {
  const YonIkonu = degisim?.yon === 'asagi' ? TrendingDown : TrendingUp;
  return (
    <div className="yonetim-panel__kart">
      <span className="yonetim-panel__kart-ikon"><Ikon aria-hidden="true" /></span>
      <span className="yonetim-panel__kart-baslik">{baslik}</span>
      <strong className="yonetim-panel__kart-deger">{deger}</strong>
      {degisim && (
        <span className={`yonetim-panel__kart-degisim yonetim-panel__kart-degisim--${degisim.yon}`}>
          <YonIkonu aria-hidden="true" /> {degisim.metin}
        </span>
      )}
      {notu && <span className="yonetim-panel__kart-notu">{notu}</span>}
    </div>
  );
}

export default function YonetimPaneliSayfasi({ veri }) {
  const urunler = veri.urunler ?? [];
  const urunMenusu = veri.menu?.find((oge) => oge.baglanti === '/urunler');
  const gruplar = urunMenusu?.alt_ogeler ?? [];
  const toplamKategori = gruplar.reduce((toplam, grup) => toplam + (grup.alt_ogeler?.length ?? 0), 0);
  const aktifSertifika = veri.sertifikalar?.kayitlar?.length ?? 0;

  // İçerik dağılımı grafiği ve "Ürün Grupları" listesi, ürünlerin gerçek kategori adına göre gruplanmasından üretilir.
  const kategoriDagilimi = useMemo(() => {
    const sayaç = new Map();
    for (const urun of urunler) {
      const ad = urunMenuKategorisi(urun) ?? 'Diğer';
      sayaç.set(ad, (sayaç.get(ad) ?? 0) + 1);
    }
    return [...sayaç.entries()].sort((a, b) => b[1] - a[1]);
  }, [urunler]);

  const enBuyukDeger = Math.max(1, ...kategoriDagilimi.slice(0, 6).map(([, sayi]) => sayi));
  const enBuyukZiyaretci = Math.max(...ZIYARETCI_ORNEK_VERISI);

  const kartlar = [
    { ikon: Package, baslik: 'Toplam Ürün', deger: urunler.length, degisim: { yon: 'yukari', metin: '%12 geçen aya göre' } },
    { ikon: FolderTree, baslik: 'Kategori Sayısı', deger: toplamKategori, degisim: { yon: 'yukari', metin: 'değişiklik yok' } },
    { ikon: FileClock, baslik: 'Detay Hazırlanıyor', deger: urunler.filter(detayHazirlaniyorMu).length, notu: 'içerik bekliyor' },
    { ikon: MessageCircle, baslik: 'İletişim Formu', deger: '—', notu: "okuma API'si henüz yok" },
    { ikon: Award, baslik: 'Aktif Sertifika', deger: aktifSertifika, degisim: { yon: 'yukari', metin: '%6 son ay' } },
    { ikon: ImageIcon, baslik: 'Referans Kaydı', deger: veri.referanslar?.kayitlar?.length ?? 0, degisim: { yon: 'yukari', metin: '%18 bu ay' } }
  ];

  const bugun = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).format(new Date());

  return (
    <div className="yonetim-panel">
      <header className="yonetim-panel__karsilama">
        <div>
          <h1>Hoş Geldiniz 👋</h1>
          <p>Demir Vana yönetim paneline hoş geldiniz. Bugün neler yapmak istersiniz?</p>
        </div>
      </header>

      <div className="yonetim-panel__baslik-satiri">
        <div>
          <h2><BarChart3 aria-hidden="true" /> Dashboard</h2>
          <p>Web sitenizin genel durumu, istatistikler ve son aktiviteler</p>
        </div>
        <div className="yonetim-panel__tarih"><Calendar aria-hidden="true" /> {bugun}</div>
      </div>

      <div className="yonetim-panel__kartlar">
        {kartlar.map((kart) => <IstatistikKarti key={kart.baslik} {...kart} />)}
      </div>

      <div className="yonetim-panel__izgara">
        <section className="yonetim-panel__panel yonetim-panel__panel--genis">
          <h3><TrendingUp aria-hidden="true" /> Site Ziyaretçi İstatistikleri</h3>
          <p className="yonetim-panel__panel-not">Analitik entegrasyonu kurulana kadar örnek veri gösterilir.</p>
          <svg className="yonetim-panel__cizgi-grafik" viewBox="0 0 700 180" preserveAspectRatio="none" role="img" aria-label="Ziyaretçi trendi">
            <polyline
              points={ZIYARETCI_ORNEK_VERISI.map((deger, i) => `${(i / (ZIYARETCI_ORNEK_VERISI.length - 1)) * 700},${180 - (deger / enBuyukZiyaretci) * 160}`).join(' ')}
              fill="none" stroke="#0052FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </section>

        <section className="yonetim-panel__panel">
          <h3><PieChart aria-hidden="true" /> İçerik Dağılımı</h3>
          <p className="yonetim-panel__panel-not">Ürün gruplarına göre</p>
          <div className="yonetim-panel__cubuk-grafik">
            {kategoriDagilimi.slice(0, 6).map(([ad, sayi]) => (
              <div className="yonetim-panel__cubuk" key={ad}>
                <span className="yonetim-panel__cubuk-govde" style={{ height: `${(sayi / enBuyukDeger) * 100}%` }} title={`${ad}: ${sayi}`} />
                <span className="yonetim-panel__cubuk-deger">{sayi}</span>
                <span className="yonetim-panel__cubuk-etiket">{ad}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="yonetim-panel__panel">
          <h3><Zap aria-hidden="true" /> Hızlı İşlemler</h3>
          <div className="yonetim-panel__hizli-liste">
            {['Yeni Ürün Ekle', 'Yeni Kategori Ekle', 'Yeni Sertifika Ekle', 'Yeni Referans Ekle', 'Banner Düzenle'].map((etiket) => (
              <button type="button" key={etiket} disabled title="Bu işlem henüz bağlanmadı">
                <Plus aria-hidden="true" /> {etiket}
              </button>
            ))}
          </div>
        </section>

        <section className="yonetim-panel__panel">
          <h3><ListTree aria-hidden="true" /> Site Menü Yapısı</h3>
          <ol className="yonetim-panel__menu-listesi">
            {(veri.menu ?? []).map((oge, indeks) => <li key={oge.id}><span>{indeks + 1}</span>{oge.baslik}</li>)}
          </ol>
        </section>

        <section className="yonetim-panel__panel">
          <h3><Layers aria-hidden="true" /> Ürün Grupları</h3>
          <ul className="yonetim-panel__grup-listesi">
            {kategoriDagilimi.map(([ad, sayi]) => <li key={ad}><span>{ad}</span><strong>{sayi}</strong></li>)}
          </ul>
          <p className="yonetim-panel__toplam">Toplam {urunler.length} ürün, {toplamKategori} kategori</p>
        </section>

        <section className="yonetim-panel__panel">
          <h3><Clock aria-hidden="true" /> Son Aktiviteler</h3>
          <ul className="yonetim-panel__aktivite-listesi">
            {SON_AKTIVITELER_ORNEK.map((olay) => (
              <li key={olay.detay}><strong>{olay.metin}</strong><span>{olay.detay}</span><small>{olay.zaman}</small></li>
            ))}
          </ul>
        </section>

        <section className="yonetim-panel__panel">
          <h3><Mail aria-hidden="true" /> Son Gelen İletişim Formları</h3>
          <p className="yonetim-panel__panel-not">Formlar sunucuya kaydediliyor; panelden listelenmesi için okuma uç noktası eklenmesi gerekiyor.</p>
        </section>

        <section className="yonetim-panel__panel">
          <h3><Images aria-hidden="true" /> Son Eklenen Medya</h3>
          <div className="yonetim-panel__medya-izgara">
            {urunler.slice(0, 5).map((urun) => {
              let gorsel = '/assets/urun-placeholder.svg';
              try {
                const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
                gorsel = urun.gorsel_yolu || teknik?.katalog_bilgileri?.gorsel_yolu || gorsel;
              } catch { /* varsayılan görsel kullanılır */ }
              return <img key={urun.id} src={gorsel} alt={urun.ad} />;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
