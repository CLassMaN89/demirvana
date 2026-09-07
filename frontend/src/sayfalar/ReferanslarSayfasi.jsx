import { useEffect, useMemo, useRef, useState } from 'react';
import '../stiller/referanslar.css';

const FILTRELER = [
  { deger: 'tumu', etiket: 'Tümü' },
  { deger: 'yurtici', etiket: 'Yurtiçi' },
  { deger: 'yurtdisi', etiket: 'Yurtdışı' }
];

function GaleriGorseli({ gorsel, sinifAdi }) {
  const gorselStili = {
    backgroundImage: `url("${gorsel.gorsel_yolu}")`,
    backgroundPosition: `${gorsel.odak_x ?? 50}% ${gorsel.odak_y ?? 50}%`,
    backgroundSize: `${gorsel.gorsel_olcegi ?? 100}% auto`
  };

  // Arka plan kullanımı, başlangıçtaki tek fotoğraf şeridinden üç ayrı kadraj almamızı; admin yüklemelerinde aynı alanı korumamızı sağlar.
  return <span className={sinifAdi} style={gorselStili} role="img" aria-label={gorsel.alternatif_metin} />;
}

function BuyutSimgesi() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReferanslarSayfasi({ referanslar = { kayitlar: [], gorseller: [] } }) {
  const [etkinFiltre, setEtkinFiltre] = useState('tumu');
  const [seciliGorsel, setSeciliGorsel] = useState(null);
  const kapatmaDugmesi = useRef(null);
  const oncekiOdak = useRef(null);
  const kayitlar = referanslar?.kayitlar ?? [];
  const gorseller = referanslar?.gorseller ?? [];

  const yurticiSayisi = kayitlar.filter((kayit) => kayit.bolge === 'yurtici').length;
  const yurtdisiSayisi = kayitlar.filter((kayit) => kayit.bolge === 'yurtdisi').length;
  const gorunenKayitlar = useMemo(
    () => etkinFiltre === 'tumu' ? kayitlar : kayitlar.filter((kayit) => kayit.bolge === etkinFiltre),
    [etkinFiltre, kayitlar]
  );

  useEffect(() => {
    if (!seciliGorsel) return undefined;

    const oncekiTasima = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    kapatmaDugmesi.current?.focus();

    const klavyeDinle = (olay) => {
      if (olay.key === 'Escape') setSeciliGorsel(null);
    };
    document.addEventListener('keydown', klavyeDinle);

    // Modal kapanınca sayfa kaydırmasını ve kullanıcının önceki klavye odağını geri getiririz.
    return () => {
      document.body.style.overflow = oncekiTasima;
      document.removeEventListener('keydown', klavyeDinle);
      oncekiOdak.current?.focus();
    };
  }, [seciliGorsel]);

  const gorseliAc = (gorsel, dugme) => {
    oncekiOdak.current = dugme;
    setSeciliGorsel(gorsel);
  };

  return (
    <section className="referans-sayfasi">
      <div className="icerik-kapsayici">
        <header className="referans-giris">
          <div className="referans-giris__metin">
            <span className="referans-giris__isaret" aria-hidden="true" />
            <h1>Referanslarımız</h1>
            <p>
              Su, enerji ve endüstriyel tesislerde üstlendiğimiz projeleri; kurum, konum ve uygulama yılıyla birlikte inceleyin.
            </p>
          </div>

          <dl className="referans-ozet" aria-label="Referans özeti">
            <div className="referans-ozet__ana">
              <dt>Tamamlanan referans</dt>
              <dd className="referans-ozet__sayi">{kayitlar.length}</dd>
            </div>
            <div>
              <dt>Yurtiçi</dt>
              <dd>{yurticiSayisi}</dd>
            </div>
            <div>
              <dt>Yurtdışı</dt>
              <dd>{yurtdisiSayisi}</dd>
            </div>
          </dl>
        </header>

        <div className="referans-arac-cubugu">
          <div className="referans-filtreleri" aria-label="Referans bölgesi filtresi">
            {FILTRELER.map((filtre) => (
              <button
                key={filtre.deger}
                type="button"
                aria-pressed={etkinFiltre === filtre.deger}
                onClick={() => setEtkinFiltre(filtre.deger)}
              >
                {filtre.etiket}
              </button>
            ))}
          </div>
          <p className="referans-sonuc" aria-live="polite">{gorunenKayitlar.length} referans gösteriliyor</p>
        </div>

        {gorunenKayitlar.length > 0 ? (
          <ol className="referans-listesi">
            {gorunenKayitlar.map((kayit) => (
              <li key={kayit.id} className="referans-kaydi">
                <span className="referans-kaydi__numara" aria-hidden="true">
                  {String(kayit.siralama ?? kayit.id).padStart(2, '0')}
                </span>
                <div className="referans-kaydi__icerik">
                  <div className="referans-kaydi__ust">
                    <h2>{kayit.baslik}</h2>
                    {kayit.yil && <span className="referans-kaydi__yil">{kayit.yil}</span>}
                  </div>
                  <p>{kayit.kurum}</p>
                  <span className="referans-kaydi__konum">{kayit.konum}</span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="referans-bos">Bu filtreye ait yayınlanmış referans bulunmuyor.</p>
        )}

        {gorseller.length > 0 && (
          <section className="referans-galeri" aria-labelledby="referans-galeri-basligi">
            <div className="referans-galeri__baslik">
              <div>
                <h2 id="referans-galeri-basligi">Sahadan görüntüler</h2>
                <p>Ürünlerimizin tesis uygulamalarından seçilmiş kareler.</p>
              </div>
              <span>{gorseller.length} fotoğraf</span>
            </div>
            <div className="referans-galeri__grid">
              {gorseller.map((gorsel) => (
                <button
                  key={gorsel.id}
                  className="referans-galeri__kart"
                  type="button"
                  aria-label={`${gorsel.alternatif_metin} görselini büyüt`}
                  onClick={(olay) => gorseliAc(gorsel, olay.currentTarget)}
                >
                  <GaleriGorseli gorsel={gorsel} sinifAdi="referans-galeri__gorsel" />
                  <span className="referans-galeri__buyut"><BuyutSimgesi /></span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {seciliGorsel && (
        <div className="referans-modal" role="dialog" aria-modal="true" aria-label={seciliGorsel.alternatif_metin}>
          <button className="referans-modal__zemin" type="button" aria-label="Büyütülmüş görseli kapat" onClick={() => setSeciliGorsel(null)} />
          <div className="referans-modal__icerik">
            <GaleriGorseli gorsel={seciliGorsel} sinifAdi="referans-modal__gorsel" />
            <p>{seciliGorsel.alternatif_metin}</p>
            <button ref={kapatmaDugmesi} className="referans-modal__kapat" type="button" onClick={() => setSeciliGorsel(null)} aria-label="Kapat">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
