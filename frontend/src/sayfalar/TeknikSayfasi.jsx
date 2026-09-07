import { BookOpen, FileSpreadsheet, FileText, ArrowRight } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import MetinDongusu from '../bilesenler/MetinDongusu';
import '../stiller/teknik.css';

// Ağır PDF.js paketi yalnız ziyaretçi bir belge açtığında indirilerek ilk sayfa yükü hafif tutulur.
const PdfGoruntuleyici = lazy(() => import('../bilesenler/PdfGoruntuleyici'));

const KATEGORI_IKONLARI = {
  'dosya-hesaplama': FileSpreadsheet,
  'kitap-acik': BookOpen
};

export default function TeknikSayfasi({ kategoriler = [], siteAyarlari = {} }) {
  const [seciliDokuman, setSeciliDokuman] = useState(null);
  const goruntuleyiciRef = useRef(null);
  const ayar = (anahtar, yedek) => siteAyarlari?.[anahtar] || yedek;
  const heroBasligi = ayar('teknik_hero_basligi', 'Teknik');
  const donenBasliklar = kategoriler.map((kategori) =>
    kategori.ad.replace(/^TEKNİK\s+/i, '')
  );
  const erisilebilirBaslik = `${heroBasligi} ${donenBasliklar.join(' ve ').toLocaleLowerCase('tr-TR')}`;

  useEffect(() => {
    if (!seciliDokuman || !goruntuleyiciRef.current) return;
    const hareketAz = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Görüntüleyici kategori kartlarının altında açılır; kullanıcı seçtiği belgenin sonucunu hemen görür.
    goruntuleyiciRef.current.scrollIntoView?.({ behavior: hareketAz ? 'auto' : 'smooth', block: 'start' });
  }, [seciliDokuman]);

  return (
    <section className="teknik-sayfasi">
      <header className="teknik-hero">
        <div className="icerik-kapsayici teknik-hero__icerik">
          <div className="teknik-hero__metin">
            <span className="teknik-hero__etiket">Teknik Doküman Merkezi</span>
            <h1 aria-label={erisilebilirBaslik}>
              <span className="teknik-hero__sabit-baslik">{heroBasligi}</span>
              <MetinDongusu
                metinler={donenBasliklar}
                gecisSuresi={ayar('teknik_baslik_gecis_suresi', '2600')}
              />
            </h1>
            <p>{ayar('teknik_hero_aciklamasi', 'Ürünlerimize ait teknik tabloları ve kullanım talimatlarını buradan inceleyebilirsiniz.')}</p>
          </div>
          <div className="teknik-hero__gorsel" aria-hidden="true">
            <div className="teknik-hero__cizim"><span /><span /><span /></div>
            <p>{ayar('teknik_slogan_satir_1', 'Güvenli Akış')}<strong>{ayar('teknik_slogan_satir_2', 'Daha Güçlü Yarınlar')}</strong></p>
          </div>
        </div>
      </header>

      <main className="teknik-ana">
        <div className="icerik-kapsayici">
          <div className="teknik-kategorileri">
            {kategoriler.map((kategori) => {
              const KategoriIkonu = KATEGORI_IKONLARI[kategori.ikon_adi] ?? FileText;
              const dokumanlar = kategori.dokumanlar ?? [];
              return (
                <section className="teknik-kategori" key={kategori.id ?? kategori.slug} aria-labelledby={`teknik-kategori-${kategori.id}`}>
                  <header className="teknik-kategori__ust">
                    <span className="teknik-kategori__ikon"><KategoriIkonu aria-hidden="true" /></span>
                    <div>
                      <h2 id={`teknik-kategori-${kategori.id}`}>{kategori.ad}</h2>
                      <p>{kategori.aciklama}</p>
                    </div>
                    <span className="teknik-kategori__sayac">{dokumanlar.length} doküman</span>
                  </header>

                  {dokumanlar.length > 0 ? (
                    <ul className="teknik-dokumanlar">
                      {dokumanlar.map((dokuman, indeks) => (
                        <li key={dokuman.id ?? dokuman.slug}>
                          <button
                            type="button"
                            className={seciliDokuman?.slug === dokuman.slug ? 'teknik-dokuman teknik-dokuman--secili' : 'teknik-dokuman'}
                            aria-pressed={seciliDokuman?.slug === dokuman.slug}
                            onClick={() => setSeciliDokuman(dokuman)}
                            style={{ '--teknik-gecikme': `${Math.min(indeks, 7) * 45}ms` }}
                          >
                            <span className="teknik-dokuman__pdf">
                              <img src={ayar('teknik_pdf_ikon_yolu', '/assets/ikonlar/pdf-ikonu.png')} alt="PDF" />
                            </span>
                            <span className="teknik-dokuman__metin">
                              <strong>{dokuman.baslik}</strong>
                            </span>
                            <span className="teknik-dokuman__eylem">
                              {ayar('teknik_pdf_goruntule_metni', 'PDF Görüntüle')} <ArrowRight aria-hidden="true" />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="teknik-kategori__bos">{ayar('teknik_bos_kategori_metni', 'Bu kategoride henüz doküman bulunmuyor.')}</p>
                  )}
                </section>
              );
            })}
          </div>

          {seciliDokuman && (
            <div className="teknik-goruntuleyici-konumu" ref={goruntuleyiciRef}>
              <Suspense fallback={<p className="pdf-goruntuleyici__durum" aria-live="polite">{ayar('teknik_pdf_yukleniyor_metni', 'PDF yükleniyor…')}</p>}>
                <PdfGoruntuleyici
                  dokuman={seciliDokuman}
                  siteAyarlari={siteAyarlari}
                  onKapat={() => setSeciliDokuman(null)}
                />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
