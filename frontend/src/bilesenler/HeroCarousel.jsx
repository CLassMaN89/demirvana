import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { metinler } from '../metinler/tr';
import '../stiller/carousel.css';

// Ekran okuyucunun gösterge numaralarını doğal Türkçe eklerle seslendirmesi için sayı eklerini merkezi tutarız.
const SAYI_EKLERI = { 1: 'e', 2: 'ye', 3: 'e', 4: 'e', 5: 'e', 6: 'ya', 7: 'ye', 8: 'e', 9: 'a', 0: 'a' };

function slaytEtiketi(sayi) {
  const sonRakam = sayi % 10;
  return `Slayt ${sayi}'${SAYI_EKLERI[sonRakam]} git`;
}

export default function HeroCarousel({ sliderlar, otomatikGecisMs = 6500 }) {
  const [aktifIndeks, setAktifIndeks] = useState(0);
  const [duraklatildi, setDuraklatildi] = useState(false);
  const baslangicX = useRef(null);
  const toplam = sliderlar.length;

  const git = (indeks) => {
    if (toplam > 0) setAktifIndeks((indeks + toplam) % toplam);
  };

  useEffect(() => {
    // Kullanıcı hareketi azalttığında veya carousel ile etkileşirken otomatik geçiş çalışmaz.
    const hareketAz = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!otomatikGecisMs || toplam < 2 || duraklatildi || hareketAz) return undefined;

    const zamanlayici = window.setInterval(() => {
      setAktifIndeks((indeks) => (indeks + 1) % toplam);
    }, otomatikGecisMs);

    return () => window.clearInterval(zamanlayici);
  }, [duraklatildi, otomatikGecisMs, toplam]);

  if (toplam === 0) return null;

  const aktifSlider = sliderlar[aktifIndeks];

  const klavyeKontrolu = (olay) => {
    if (olay.key === 'ArrowLeft') git(aktifIndeks - 1);
    if (olay.key === 'ArrowRight') git(aktifIndeks + 1);
  };

  const kaydirmaBitir = (olay) => {
    // 45px eşiği küçük dokunma sapmalarının yanlışlıkla slayt değiştirmesini engeller.
    if (baslangicX.current === null) return;
    const fark = olay.clientX - baslangicX.current;
    if (Math.abs(fark) >= 45) git(fark > 0 ? aktifIndeks - 1 : aktifIndeks + 1);
    baslangicX.current = null;
  };

  return (
    <section
      className="hero-carousel"
      role="region"
      aria-label="Öne çıkan içerikler"
      aria-roledescription="carousel"
      tabIndex="0"
      onKeyDown={klavyeKontrolu}
      onMouseEnter={() => setDuraklatildi(true)}
      onMouseLeave={() => setDuraklatildi(false)}
      onFocus={() => setDuraklatildi(true)}
      onBlur={(olay) => {
        if (!olay.currentTarget.contains(olay.relatedTarget)) setDuraklatildi(false);
      }}
      onPointerDown={(olay) => {
        baslangicX.current = olay.clientX;
      }}
      onPointerUp={kaydirmaBitir}
      onPointerCancel={() => {
        baslangicX.current = null;
      }}
    >
      <div className={`hero-carousel__slayt hero-carousel__slayt--${aktifSlider.animasyon_turu}`}>
        <img
          className="hero-carousel__gorsel"
          src={aktifSlider.gorsel_yolu}
          alt={aktifSlider.alternatif_metin}
          style={{ objectPosition: `${aktifSlider.odak_x}% ${aktifSlider.odak_y}%` }}
          fetchPriority={aktifIndeks === 0 ? 'high' : 'auto'}
        />
        <div className="hero-carousel__golge" aria-hidden="true" />
        <div className="hero-carousel__icerik icerik-kapsayici" aria-live="polite">
          <div className="hero-carousel__metin">
            <h1>{aktifSlider.baslik}</h1>
            <p>{aktifSlider.aciklama}</p>
            <Link className="hero-carousel__cta" to={aktifSlider.buton_baglantisi}>
              {aktifSlider.buton_metni}
            </Link>
          </div>
        </div>
      </div>

      {toplam > 1 && (
        <>
          <button
            className="hero-carousel__ok hero-carousel__ok--onceki"
            type="button"
            aria-label={metinler.oncekiSlayt}
            onClick={() => git(aktifIndeks - 1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            className="hero-carousel__ok hero-carousel__ok--sonraki"
            type="button"
            aria-label={metinler.sonrakiSlayt}
            onClick={() => git(aktifIndeks + 1)}
          >
            <span aria-hidden="true">›</span>
          </button>
          <div className="hero-carousel__alt">
            <span className="hero-carousel__sayac" aria-hidden="true">
              {String(aktifIndeks + 1).padStart(2, '0')} / {String(toplam).padStart(2, '0')}
            </span>
            <div className="hero-carousel__gostergeler" aria-label="Slayt seçimi">
              {sliderlar.map((slider, indeks) => (
                <button
                  key={slider.id}
                  className={indeks === aktifIndeks ? 'hero-carousel__gosterge hero-carousel__gosterge--aktif' : 'hero-carousel__gosterge'}
                  type="button"
                  aria-label={slaytEtiketi(indeks + 1)}
                  aria-current={indeks === aktifIndeks ? 'true' : undefined}
                  onClick={() => git(indeks)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
