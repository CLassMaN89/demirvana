import { useEffect, useRef, useState } from 'react';

// Gerçek "split-flap" kart animasyonu (pqina.nl/flip örneğindeki gibi): her hanenin altında
// her zaman GÜNCEL rakamı gösteren sabit üst/alt yarım katman durur; değişim anında üstte eski
// rakamı taşıyan bir "yaprak" yukarıdan aşağı katlanıp kaybolur, ardından altta yeni rakamı
// taşıyan başka bir yaprak yukarıdan katlanarak yerine oturur. Yapraklar yalnızca gerçek bir
// değişiklikte (key değişince) yeniden monte edilip animasyonu baştan oynatır; ilk yüklemede
// (henüz bir değişim yokken) hiç render edilmez, böylece sayfa açılışında gereksiz bir flip
// oynamaz. `renk` verilmezse varsayılan koyu antrasit (site geneli flip-clock rengi) kullanılır.
export function FlipKart({ deger, renk, kucuk }) {
  const [onceki, setOnceki] = useState(deger);
  const [surum, setSurum] = useState(0);
  const oncekiDegerRef = useRef(deger);

  useEffect(() => {
    if (oncekiDegerRef.current !== deger) {
      setOnceki(oncekiDegerRef.current);
      oncekiDegerRef.current = deger;
      setSurum((s) => s + 1);
    }
  }, [deger]);

  return (
    <span
      className={`flip-kart${kucuk ? ' flip-kart--kucuk' : ''}`}
      style={renk ? { '--flip-kart-renk': renk } : undefined}
    >
      <span className="flip-kart__yari flip-kart__yari--ust"><span className="flip-kart__icerik">{deger}</span></span>
      <span className="flip-kart__yari flip-kart__yari--alt"><span className="flip-kart__icerik">{deger}</span></span>
      {surum > 0 && (
        <>
          <span key={`ust-${surum}`} className="flip-kart__yaprak flip-kart__yaprak--ust">
            <span className="flip-kart__icerik">{onceki}</span>
          </span>
          <span key={`alt-${surum}`} className="flip-kart__yaprak flip-kart__yaprak--alt">
            <span className="flip-kart__icerik">{deger}</span>
          </span>
        </>
      )}
    </span>
  );
}

// İki haneli bir sayının her hanesi kendi bağımsız FlipKart'ıdır (örn. 58→59'da yalnızca "9" döner).
export function FlipIkiHane({ deger, renk, kucuk }) {
  const metin = String(deger).padStart(2, '0');
  return (
    <span className="flip-kart-grup">
      <FlipKart deger={metin[0]} renk={renk} kucuk={kucuk} />
      <FlipKart deger={metin[1]} renk={renk} kucuk={kucuk} />
    </span>
  );
}
