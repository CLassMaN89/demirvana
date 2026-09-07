import { LoaderCircle, Mic, Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

export default function AramaAlani({ deger, degerDegisti, inputRef, placeholder }) {
  const alanId = useId();
  const [yukleniyor, setYukleniyor] = useState(false);
  const [dinliyor, setDinliyor] = useState(false);
  const sesTanimaRef = useRef(null);
  const SesTanima = typeof window !== 'undefined'
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : null;

  useEffect(() => {
    if (!deger) {
      setYukleniyor(false);
      return undefined;
    }

    // Kısa gösterge, kullanıcıya yazdığı sorgunun sonuçlara işlendiğini görsel olarak bildirir.
    setYukleniyor(true);
    const zamanlayici = window.setTimeout(() => setYukleniyor(false), 500);
    return () => window.clearTimeout(zamanlayici);
  }, [deger]);

  useEffect(() => () => sesTanimaRef.current?.abort?.(), []);

  const sesliAramayiBaslat = () => {
    if (!SesTanima || dinliyor) return;

    const sesTanima = new SesTanima();
    sesTanima.lang = 'tr-TR';
    sesTanima.interimResults = false;
    sesTanima.maxAlternatives = 1;
    sesTanima.onresult = (olay) => {
      const metin = olay.results?.[0]?.[0]?.transcript?.trim();
      if (metin) degerDegisti(metin);
    };
    sesTanima.onerror = () => setDinliyor(false);
    sesTanima.onend = () => setDinliyor(false);
    sesTanimaRef.current = sesTanima;
    setDinliyor(true);
    sesTanima.start();
  };

  return (
    <div className="site-header__arama-bileseni">
      <label className="site-header__arama-etiketi" htmlFor={alanId}>Sitede ara</label>
      <div className="site-header__arama-alani">
        <span className="site-header__arama-sol-simge" aria-hidden={!yukleniyor}>
          {yukleniyor ? (
            <LoaderCircle
              className="site-header__arama-yukleniyor"
              size={16}
              strokeWidth={2}
              role="status"
              aria-label="Arama yapılıyor"
            />
          ) : (
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </span>

        <input
          id={alanId}
          ref={inputRef}
          type="search"
          aria-label="Sitede ara"
          placeholder={placeholder}
          value={deger}
          onChange={(olay) => degerDegisti(olay.target.value)}
        />

        {SesTanima ? (
          <button
            className={`site-header__sesli-arama${dinliyor ? ' site-header__sesli-arama--dinliyor' : ''}`}
            type="button"
            aria-label={dinliyor ? 'Sesli arama dinleniyor' : 'Sesli aramayı başlat'}
            onClick={sesliAramayiBaslat}
          >
            <Mic size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
