import { ChevronRight, FileBadge2, Search } from 'lucide-react';
import { lazy, Suspense, useMemo, useState } from 'react';
import '../stiller/sertifikalar.css';

const SertifikaGoruntuleyici = lazy(() => import('../bilesenler/SertifikaGoruntuleyici'));

function aranabilirMetin(metin) {
  return String(metin ?? '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function SertifikalarSayfasi({ sertifikalar = {}, siteAyarlari = {} }) {
  const kategoriler = sertifikalar.kategoriler ?? [];
  const kayitlar = sertifikalar.kayitlar ?? [];
  const [kategori, setKategori] = useState('tumu');
  const [arama, setArama] = useState('');
  const [seciliSlug, setSeciliSlug] = useState(kayitlar[0]?.slug ?? null);
  const ayar = (anahtar, yedek) => siteAyarlari?.[anahtar] || yedek;

  const gorunenler = useMemo(() => {
    const sorgu = aranabilirMetin(arama.trim());
    return kayitlar.filter((kayit) => {
      const kategoriUyar = kategori === 'tumu' || kayit.kategori_slug === kategori;
      const metinUyar = !sorgu || aranabilirMetin(`${kayit.baslik} ${kayit.aciklama} ${kayit.kategori_adi}`).includes(sorgu);
      return kategoriUyar && metinUyar;
    });
  }, [arama, kategori, kayitlar]);

  const seciliSertifika = kayitlar.find((kayit) => kayit.slug === seciliSlug) ?? kayitlar[0] ?? null;
  const kategoriSayisi = (slug) => kayitlar.filter((kayit) => kayit.kategori_slug === slug).length;

  return (
    <section className="sertifikalar-sayfasi">
      <header className="sertifikalar-hero">
        <div className="icerik-kapsayici sertifikalar-hero__icerik">
          <div>
            <h1>{ayar('sertifika_hero_basligi', 'Sertifikalar')}</h1>
            <p>{ayar('sertifika_hero_aciklamasi', 'Kaliteli üretim, güvenilir çözümler. Ulusal ve uluslararası geçerliliğe sahip sertifikalarımızla standartlara bağlılığımızı belgeliyoruz.')}</p>
          </div>
          <div className="sertifikalar-hero__slogan" aria-label="Kalite yaklaşımımız">
            <span>{ayar('sertifika_slogan_satir_1', 'Güven')}</span>
            <span>{ayar('sertifika_slogan_satir_2', 'Kalite')}</span>
            <span>{ayar('sertifika_slogan_satir_3', 'Sürdürülebilirlik')}</span>
          </div>
        </div>
      </header>

      <main className="sertifikalar-ana">
        <div className="icerik-kapsayici sertifikalar-yerlesim">
          <aside className="sertifika-kutuphanesi" aria-label="Sertifika kütüphanesi">
            <h2><FileBadge2 aria-hidden="true" /> {ayar('sertifika_kutuphane_basligi', 'Sertifika Kütüphanesi')}</h2>
            <label className="sertifika-arama">
              <Search aria-hidden="true" />
              <span className="ekran-okuyucu">Sertifika ara</span>
              <input type="search" aria-label="Sertifika ara" value={arama} placeholder={ayar('sertifika_arama_yertutucusu', 'Sertifika ara...')} onChange={(olay) => setArama(olay.target.value)} />
            </label>

            <div className="sertifika-filtreleri" aria-label="Sertifika kategorileri">
              <button type="button" className={kategori === 'tumu' ? 'aktif' : ''} aria-pressed={kategori === 'tumu'} onClick={() => setKategori('tumu')}>{ayar('sertifika_tumu_metni', 'Tümü')} {kayitlar.length}</button>
              {kategoriler.map((oge) => <button type="button" key={oge.slug} className={kategori === oge.slug ? 'aktif' : ''} aria-pressed={kategori === oge.slug} onClick={() => setKategori(oge.slug)}>{oge.ad} {kategoriSayisi(oge.slug)}</button>)}
            </div>

            <div className="sertifika-listesi">
              {gorunenler.map((sertifika) => (
                <button type="button" key={sertifika.slug} className={seciliSertifika?.slug === sertifika.slug ? 'sertifika-karti sertifika-karti--secili' : 'sertifika-karti'} onClick={() => setSeciliSlug(sertifika.slug)}>
                  <img src={sertifika.onizleme_yolu} alt="" loading="lazy" />
                  <span><strong>{sertifika.baslik}</strong><small>{sertifika.aciklama}</small><em>{sertifika.kategori_adi}</em></span>
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
              {gorunenler.length === 0 && <p className="sertifika-listesi__bos">{ayar('sertifika_bos_metni', 'Aramanızla eşleşen bir sertifika bulunamadı.')}</p>}
            </div>
          </aside>

          <div className="sertifika-onizleme">
            {seciliSertifika ? (
              <Suspense fallback={<p className="sertifika-yukleniyor">{ayar('sertifika_pdf_yukleniyor_metni', 'Sertifika yükleniyor…')}</p>}>
                <SertifikaGoruntuleyici key={seciliSertifika.slug} sertifika={seciliSertifika} siteAyarlari={siteAyarlari} />
              </Suspense>
            ) : <p className="sertifika-yukleniyor">{ayar('sertifika_bos_metni', 'Henüz sertifika bulunmuyor.')}</p>}
          </div>
        </div>
      </main>
    </section>
  );
}
