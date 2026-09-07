import { useEffect, useMemo, useRef, useState } from 'react';
import '../stiller/referanslar.css';

function aramaMetniniNormallestir(metin) {
  return String(metin ?? '').toLocaleLowerCase('tr-TR').trim();
}

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
  const [etkinSektor, setEtkinSektor] = useState('tumu');
  const [arama, setArama] = useState('');
  const [seciliGorsel, setSeciliGorsel] = useState(null);
  const kapatmaDugmesi = useRef(null);
  const oncekiOdak = useRef(null);
  const kayitlar = referanslar?.kayitlar ?? [];
  const gorseller = referanslar?.gorseller ?? [];
  const sektorler = referanslar?.sektorler ?? [];
  const gorunenKayitlar = useMemo(
    () => {
      const aranan = aramaMetniniNormallestir(arama);
      return kayitlar.filter((kayit) => {
        const sektorUygun = etkinSektor === 'tumu' || kayit.sektor_slug === etkinSektor;
        const aranabilirMetin = aramaMetniniNormallestir(
          `${kayit.baslik} ${kayit.konum} ${kayit.kurum} ${kayit.sektor_adi}`
        );
        return sektorUygun && (!aranan || aranabilirMetin.includes(aranan));
      });
    },
    [arama, etkinSektor, kayitlar]
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
            <span className="referans-giris__etiket">Projeler</span>
            <h1>Referanslarımız</h1>
            <p>Sektörlere göre filtreleyerek projelerimizi inceleyebilirsiniz.</p>
          </div>
          <p className="referans-sonuc" aria-live="polite">
            <strong className="referans-sonuc__sayi">{gorunenKayitlar.length}</strong> referans gösteriliyor
          </p>
        </header>

        <div className="referans-arac-cubugu">
          <div className="referans-filtre-kaydirma">
            <div className="referans-filtreleri" aria-label="Referans sektör filtresi">
            {[{ id: 0, ad: 'Tümü', slug: 'tumu' }, ...sektorler].map((sektor) => (
              <button
                key={sektor.slug}
                type="button"
                aria-pressed={etkinSektor === sektor.slug}
                onClick={() => setEtkinSektor(sektor.slug)}
              >
                {sektor.ad}
              </button>
            ))}
            </div>
          </div>
          <label className="referans-arama">
            <span className="ekran-okuyucu">Referanslarda ara</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              aria-label="Referanslarda ara"
              value={arama}
              onChange={(olay) => setArama(olay.target.value)}
              placeholder="Kurum, şehir veya proje ara"
            />
          </label>
        </div>

        {gorunenKayitlar.length > 0 ? (
          <ol className="referans-listesi">
            {gorunenKayitlar.map((kayit) => (
              <li key={kayit.id} id={`referans-${kayit.id}`} className="referans-kaydi">
                <span className="referans-kaydi__numara" aria-hidden="true">
                  {String(kayit.siralama ?? kayit.id).padStart(2, '0')}
                </span>
                <div className="referans-kaydi__icerik">
                  <span className="referans-kaydi__sektor">{kayit.sektor_adi}</span>
                  <h2>{kayit.baslik}</h2>
                  <p><span>{kayit.konum}</span><span aria-hidden="true"> • </span>{kayit.kurum}</p>
                </div>
                {kayit.yil && <span className="referans-kaydi__yil">{kayit.yil}</span>}
                <span className="referans-kaydi__ok" aria-hidden="true">→</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="referans-bos">Aramanızla eşleşen bir referans bulunamadı.</p>
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
