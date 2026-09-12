import { useMemo, useState } from 'react';
import {
  Package, FolderTree, FileClock, MessageCircle, Award, Image as ImageIcon,
  BarChart3, PieChart, Zap, ListTree, Layers, TrendingUp, TrendingDown,
  Clock, Mail, Images, ChevronRight, PackagePlus, RefreshCw, UserPlus, FileEdit, Eye, Users,
  Home, Building2, Handshake, FileText, GripVertical
} from 'lucide-react';
import { altOgeIkonuGetir } from '../bilesenler/UrunMenuIkonlari';
import '../stiller/yonetim.css';

// Kategori rozetleri sırayla bu renk paletinden döner; belirli bir kategoriye sabit renk atamak yerine
// görsel çeşitlilik sağlar.
const ROZET_RENKLERI = [
  { zemin: '#EAF2FF', renk: '#2F6FED' },
  { zemin: '#F3EAFE', renk: '#8B3FE8' },
  { zemin: '#FCEAEA', renk: '#E5484D' },
  { zemin: '#FFF4E5', renk: '#F79009' },
  { zemin: '#E6F9F0', renk: '#12B76A' },
  { zemin: '#FFF9E5', renk: '#B98900' },
  { zemin: '#E8F7FA', renk: '#06AED4' },
  { zemin: '#F1F2F6', renk: '#667085' }
];

const SON_AKTIVITELER_ORNEK = [
  { ikon: PackagePlus, renk: ROZET_RENKLERI[0], metin: 'Yeni ürün eklendi', detay: 'Metal Sitli Sürgülü Vana F4 D-001', zaman: '2 saat önce' },
  { ikon: RefreshCw, renk: ROZET_RENKLERI[4], metin: 'Ürün güncellendi', detay: 'Çamur Sandığı Köşe Tip D-205', zaman: '3 saat önce' },
  { ikon: Mail, renk: ROZET_RENKLERI[2], metin: 'Yeni iletişim formu', detay: 'Ahmet Kaya · ornek@firma.com', zaman: '5 saat önce' },
  { ikon: Award, renk: ROZET_RENKLERI[1], metin: 'Sertifika eklendi', detay: 'ISO 9001:2015', zaman: '1 gün önce' },
  { ikon: ImageIcon, renk: ROZET_RENKLERI[3], metin: 'Medya dosyası yüklendi', detay: 'vana-d-001.jpg', zaman: '1 gün önce' },
  { ikon: FileEdit, renk: ROZET_RENKLERI[7], metin: 'Sayfa güncellendi', detay: 'Teknik Dokümanlar', zaman: '2 gün önce' },
  { ikon: UserPlus, renk: ROZET_RENKLERI[6], metin: 'Yeni kullanıcı eklendi', detay: 'Mehmet Demir (Editör)', zaman: '2 gün önce' }
];

// Üst menü öğelerinin ikonu; site menüsündeki tam Türkçe başlıklarla eşleşir.
const ANA_MENU_IKONLARI = {
  Anasayfa: Home,
  Kurumsal: Building2,
  Ürünler: Package,
  Temsilcilikler: Handshake,
  Teknik: FileText,
  Referanslar: Handshake,
  Sertifikalar: Award,
  İletişim: Mail
};

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

// Ziyaretçi trafiği için henüz bir analitik sistemi yok; tasarımı tamamlamak amacıyla örnek değerler kullanılır.
const ZIYARETCI_ORNEK_VERISI = [820, 960, 1120, 980, 1340, 1180, 1482];
const ZIYARETCI_OZET_ORNEK = [
  { ikon: Eye, baslik: 'Toplam Ziyaretçi', deger: '28.532', degisim: '%18' },
  { ikon: Users, baslik: 'Tekil Ziyaretçi', deger: '17.421', degisim: '%14' },
  { ikon: BarChart3, baslik: 'Sayfa Görüntüleme', deger: '64.320', degisim: '%22' }
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

const GRUP_BASINA_GOSTERIM = 12;

export default function YonetimPaneliSayfasi({ veri }) {
  const [grupTumu, setGrupTumu] = useState(false);
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

  return (
    <div className="yonetim-panel">
      <div className="yonetim-panel__kartlar">
        {kartlar.map((kart) => <IstatistikKarti key={kart.baslik} {...kart} />)}
      </div>

      <div className="yonetim-panel__izgara">
        <div className="yonetim-panel__uc-sutun">
          <section className="yonetim-panel__panel">
            <div className="yonetim-panel__panel-baslik">
              <h3><TrendingUp aria-hidden="true" /> Site Ziyaretçi İstatistikleri</h3>
              <span className="yonetim-panel__panel-etiket">Son 30 Gün</span>
            </div>
            <svg className="yonetim-panel__alan-grafik" viewBox="0 0 700 200" preserveAspectRatio="none" role="img" aria-label="Ziyaretçi trendi">
              <defs>
                <linearGradient id="ziyaretciDegrade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0052FF" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const noktalar = ZIYARETCI_ORNEK_VERISI.map((deger, i) => [
                  (i / (ZIYARETCI_ORNEK_VERISI.length - 1)) * 700,
                  180 - (deger / enBuyukZiyaretci) * 160
                ]);
                const cizgi = noktalar.map((n) => n.join(',')).join(' ');
                const alan = `0,200 ${cizgi} 700,200`;
                return (
                  <>
                    <polygon points={alan} fill="url(#ziyaretciDegrade)" />
                    <polyline points={cizgi} fill="none" stroke="#0052FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                );
              })()}
            </svg>
            <p className="yonetim-panel__panel-not">Analitik entegrasyonu kurulana kadar örnek veri gösterilir.</p>
            <div className="yonetim-panel__ozet-satiri">
              {ZIYARETCI_OZET_ORNEK.map((ozet) => (
                <div className="yonetim-panel__ozet" key={ozet.baslik}>
                  <span className="yonetim-panel__ozet-ikon"><ozet.ikon aria-hidden="true" /></span>
                  <span className="yonetim-panel__ozet-metin">
                    <small>{ozet.baslik}</small>
                    <strong>{ozet.deger}</strong>
                  </span>
                  <span className="yonetim-panel__ozet-degisim"><TrendingUp aria-hidden="true" /> {ozet.degisim}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="yonetim-panel__panel">
            <div className="yonetim-panel__panel-baslik">
              <h3><PieChart aria-hidden="true" /> İçerik Dağılımı</h3>
              <span className="yonetim-panel__panel-etiket">Ürün Gruplarına Göre</span>
            </div>
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
              {[
                { etiket: 'Yeni Ürün Ekle', ikon: Package },
                { etiket: 'Yeni Kategori Ekle', ikon: Layers },
                { etiket: 'Yeni Sertifika Ekle', ikon: Award },
                { etiket: 'Yeni Referans Ekle', ikon: Building2 },
                { etiket: 'Banner Düzenle', ikon: ImageIcon }
              ].map(({ etiket, ikon: Ikon }, indeks) => {
                const renk = ROZET_RENKLERI[indeks % ROZET_RENKLERI.length];
                return (
                  <button type="button" key={etiket} disabled title="Bu işlem henüz bağlanmadı">
                    <span className="yonetim-panel__rozet yonetim-panel__rozet--kucuk" style={{ background: renk.zemin, color: renk.renk }}><Ikon aria-hidden="true" /></span>
                    <span className="yonetim-panel__hizli-etiket">{etiket}</span>
                    <ChevronRight aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="yonetim-panel__uc-sutun">
          <section className="yonetim-panel__panel">
            <div className="yonetim-panel__panel-baslik">
              <h3><ListTree aria-hidden="true" /> Site Menü Yapısı</h3>
              <button type="button" className="yonetim-panel__tumunu-gor" disabled title="Menü Yönetimi ekranı henüz eklenmedi">Menüyü Düzenle</button>
            </div>
            <ul className="yonetim-panel__menu-listesi">
              {(veri.menu ?? []).map((oge, indeks) => {
                const Ikon = ANA_MENU_IKONLARI[oge.baslik] ?? FileText;
                const renk = ROZET_RENKLERI[indeks % ROZET_RENKLERI.length];
                return (
                  <li key={oge.id}>
                    <GripVertical className="yonetim-panel__menu-tutamak" aria-hidden="true" />
                    <span className="yonetim-panel__menu-sira">{indeks + 1}</span>
                    <span className="yonetim-panel__rozet yonetim-panel__rozet--kucuk" style={{ background: renk.zemin, color: renk.renk }}><Ikon aria-hidden="true" /></span>
                    <span className="yonetim-panel__menu-ad">{oge.baslik}</span>
                    <ChevronRight aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="yonetim-panel__panel">
            <div className="yonetim-panel__panel-baslik">
              <h3><Layers aria-hidden="true" /> Ürün Grupları</h3>
              <button type="button" className="yonetim-panel__tumunu-gor" disabled title="Kategori Yönetimi ekranı henüz eklenmedi">
                Tüm Kategorileri Gör
              </button>
            </div>
            <ul className="yonetim-panel__rozet-listesi">
              {(grupTumu ? kategoriDagilimi : kategoriDagilimi.slice(0, GRUP_BASINA_GOSTERIM)).map(([ad, sayi], indeks) => {
                const Ikon = altOgeIkonuGetir(ad);
                const renk = ROZET_RENKLERI[indeks % ROZET_RENKLERI.length];
                return (
                  <li key={ad}>
                    <span className="yonetim-panel__rozet" style={{ background: renk.zemin, color: renk.renk }}><Ikon aria-hidden="true" /></span>
                    <span className="yonetim-panel__rozet-ad">{ad}</span>
                    <strong>{sayi}</strong>
                  </li>
                );
              })}
            </ul>
            {!grupTumu && kategoriDagilimi.length > GRUP_BASINA_GOSTERIM && (
              <button type="button" className="yonetim-panel__daha-fazla-kucuk" onClick={() => setGrupTumu(true)}>
                Daha Fazla Göster ({kategoriDagilimi.length - GRUP_BASINA_GOSTERIM})
              </button>
            )}
            <button type="button" className="yonetim-panel__toplam" disabled title="Kategori Yönetimi ekranı henüz eklenmedi">
              <Layers aria-hidden="true" /> Toplam {urunler.length} ürün, {toplamKategori} kategori <ChevronRight aria-hidden="true" />
            </button>
          </section>

          <section className="yonetim-panel__panel">
            <div className="yonetim-panel__panel-baslik">
              <h3><Clock aria-hidden="true" /> Son Aktiviteler</h3>
              <button type="button" className="yonetim-panel__tumunu-gor" disabled title="Aktivite günlüğü henüz eklenmedi">Tümünü Gör</button>
            </div>
            <ul className="yonetim-panel__zaman-cizelgesi">
              {SON_AKTIVITELER_ORNEK.map((olay) => {
                const Ikon = olay.ikon;
                return (
                  <li key={olay.detay}>
                    <span className="yonetim-panel__zaman-rozet" style={{ background: olay.renk.zemin, color: olay.renk.renk }}><Ikon aria-hidden="true" /></span>
                    <span className="yonetim-panel__zaman-metin">
                      <strong>{olay.metin}</strong>
                      <span>{olay.detay}</span>
                    </span>
                    <small>{olay.zaman}</small>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

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
