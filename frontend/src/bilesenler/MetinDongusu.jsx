import { useEffect, useMemo, useState } from 'react';

export default function MetinDongusu({ metinler = [], gecisSuresi = 2600 }) {
  const temizMetinler = useMemo(() => metinler.filter(Boolean), [metinler]);
  const [etkinIndeks, setEtkinIndeks] = useState(0);
  const etkinMetin = temizMetinler[etkinIndeks] ?? '';
  const enUzunMetin = temizMetinler.reduce(
    (enUzun, metin) => metin.length > enUzun.length ? metin : enUzun,
    ''
  );

  useEffect(() => {
    setEtkinIndeks(0);
    const hareketAz = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (hareketAz || temizMetinler.length < 2) return undefined;

    // Tek zamanlayıcı bütün harfleri birlikte değiştirir; harflerin gecikmesi yalnız CSS tarafından yönetilir.
    const zamanlayici = globalThis.setInterval(() => {
      setEtkinIndeks((indeks) => (indeks + 1) % temizMetinler.length);
    }, Math.max(1400, Number(gecisSuresi) || 2600));

    return () => globalThis.clearInterval(zamanlayici);
  }, [gecisSuresi, temizMetinler]);

  return (
    <span className="metin-dongusu" aria-hidden="true">
      {/* En uzun metin görünmeden yer tutar; admin metni değiştirince başlık sağa sola sıçramaz. */}
      <span className="metin-dongusu__olcu">{enUzunMetin}</span>
      <span className="metin-dongusu__metin" data-testid="donen-metin" key={`${etkinIndeks}-${etkinMetin}`}>
        {Array.from(etkinMetin).map((karakter, indeks) => (
          <span
            className="metin-dongusu__karakter"
            style={{ '--karakter-sirasi': indeks }}
            key={`${karakter}-${indeks}`}
          >
            {karakter === ' ' ? '\u00A0' : karakter}
          </span>
        ))}
      </span>
    </span>
  );
}
