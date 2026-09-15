import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarDays, Download, FileBarChart, HeartPulse, LayoutDashboard,
  Lightbulb, Megaphone, RefreshCw, Search, Users
} from 'lucide-react';
import '../stiller/seo-merkezi.css';
import { seoGenelBakisGetir, seoRakipleriTara, seoSiteyiTara, ziyaretYonetimVerisiniGetir } from '../servisler/api';
import SeoGorselIkonu from './seo/SeoGorselIkonu';

const SEKME_BILESENLERI = {
  'genel-bakis': lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.GenelBakisSekmesi }))),
  'anahtar-kelimeler': lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.AnahtarKelimelerSekmesi }))),
  rakipler: lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.RakiplerSekmesi }))),
  reklamlar: lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.ReklamlarSekmesi }))),
  firsatlar: lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.FirsatlarSekmesi }))),
  'site-sagligi': lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.SiteSagligiSekmesi }))),
  raporlar: lazy(() => import('./seo/SeoSekmeleri').then((modul) => ({ default: modul.RaporlarSekmesi })))
};

const SEKMELER = [
  { anahtar: 'genel-bakis', etiket: 'Genel Bakış', aciklama: 'SEO performansının, rakiplerin ve öncelikli fırsatların genel özetini gösterir.', ikon: LayoutDashboard },
  { anahtar: 'anahtar-kelimeler', etiket: 'Anahtar Kelimeler', aciklama: 'Arama sonuçlarında takip edilen kelimeleri ve sıralama değişimlerini gösterir.', ikon: Search },
  { anahtar: 'rakipler', etiket: 'Rakip Intelligence', aciklama: 'Rakip sitelerin teknik SEO ve içerik performansını karşılaştırır.', ikon: Users },
  { anahtar: 'reklamlar', etiket: 'Reklam Takibi', aciklama: 'Google Ads bağlantısından gelen reklam hareketlerini takip eder.', ikon: Megaphone },
  { anahtar: 'firsatlar', etiket: 'İçerik Fırsatları', aciklama: 'Site taramasından çıkan uygulanabilir SEO geliştirmelerini listeler.', ikon: Lightbulb },
  { anahtar: 'site-sagligi', etiket: 'Site Sağlığı', aciklama: 'Teknik SEO sorunlarını ve tarama sağlık puanını gösterir.', ikon: HeartPulse },
  { anahtar: 'raporlar', etiket: 'Raporlar', aciklama: 'SEO verilerini tarih aralığına göre raporlamaya hazırlar.', ikon: FileBarChart }
];

export default function SeoMerkeziSayfasi() {
  const [veri, setVeri] = useState(null);
  const [ziyaretVerisi, setZiyaretVerisi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [taraniyor, setTaraniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [aramaParametreleri, setAramaParametreleri] = useSearchParams();
  const istenenSekme = aramaParametreleri.get('tab') ?? 'genel-bakis';
  const etkinSekme = SEKME_BILESENLERI[istenenSekme] ? istenenSekme : 'genel-bakis';
  const EtkinSekmeBileseni = useMemo(() => SEKME_BILESENLERI[etkinSekme], [etkinSekme]);

  const genelBakisiYukle = useCallback(async () => {
    setYukleniyor(true);
    setHata('');
    try { const [seoVerisi, ziyaretSonucu] = await Promise.all([seoGenelBakisGetir(), ziyaretYonetimVerisiniGetir(1)]); setVeri(seoVerisi); setZiyaretVerisi(ziyaretSonucu); }
    catch (istekHatasi) { setHata(istekHatasi.message); }
    finally { setYukleniyor(false); }
  }, []);

  useEffect(() => { genelBakisiYukle(); }, [genelBakisiYukle]);

  async function siteyiTara() {
    setTaraniyor(true);
    setHata('');
    try {
      await seoSiteyiTara();
      setVeri(await seoRakipleriTara());
    }
    catch (istekHatasi) { setHata(istekHatasi.message); }
    finally { setTaraniyor(false); }
  }

  function sekmeDegistir(anahtar) {
    const yeniParametreler = new URLSearchParams(aramaParametreleri);
    yeniParametreler.set('tab', anahtar);
    setAramaParametreleri(yeniParametreler);
  }

  return (
    <section className="seo-merkezi">
      <header className="seo-merkezi__ust">
        <div className="seo-merkezi__kimlik">
          <SeoGorselIkonu tur="merkez" boyut={38} className="seo-merkezi__ana-ikon" />
          <div>
            <h1>SEO Merkezi</h1>
            <p>Google ve rakiplerinizin tüm hareketlerini tek merkezden takip edin. Fırsatları yakalayın, bir adım önde olun.</p>
          </div>
        </div>
        <div className="seo-merkezi__ust-islemler">
          <label className="seo-merkezi__tarih-secici">
            <CalendarDays aria-hidden="true" size={16} />
            <span className="sr-only">Tarih aralığı</span>
            <select defaultValue="30"><option value="7">Son 7 Gün</option><option value="30">Son 30 Gün</option><option value="90">Son 3 Ay</option><option value="180">Son 6 Ay</option><option value="365">Son 12 Ay</option></select>
          </label>
          <button className="seo-merkezi__ikon-buton" type="button" onClick={siteyiTara} disabled={taraniyor} title="Siteyi yeniden tara" aria-label="Siteyi yeniden tara">
            <RefreshCw aria-hidden="true" size={16} />
          </button>
          <button className="seo-merkezi__rapor-buton" type="button" disabled title="Rapor servisi henüz kurulmadı">
            <Download aria-hidden="true" size={16} />Rapor İndir
          </button>
        </div>
      </header>

      <nav className="seo-merkezi__sekmeler" aria-label="SEO Merkezi bölümleri">
        {SEKMELER.map(({ anahtar, etiket, aciklama }) => (
          <button key={anahtar} type="button" className={etkinSekme === anahtar ? 'aktif' : ''} onClick={() => sekmeDegistir(anahtar)} aria-current={etkinSekme === anahtar ? 'page' : undefined} title={aciklama}>
            <SeoGorselIkonu tur={anahtar} boyut={16} />{etiket}
          </button>
        ))}
      </nav>

      <Suspense fallback={<div className="seo-merkezi__yukleniyor" aria-label="SEO bölümü yükleniyor" />}>
        <EtkinSekmeBileseni veri={veri} ziyaretVerisi={ziyaretVerisi} yukleniyor={yukleniyor} hata={hata} onSiteyiTara={siteyiTara} taraniyor={taraniyor} onYenidenDene={genelBakisiYukle} />
      </Suspense>
    </section>
  );
}
