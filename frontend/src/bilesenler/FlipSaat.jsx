import { useEffect, useRef, useState } from 'react';

// Gerçek "split-flap" kart animasyonu (pqina.nl/flip örneğindeki gibi): her hanenin altında
// her zaman GÜNCEL rakamı gösteren sabit üst/alt yarım katman durur; değişim anında üstte eski
// rakamı taşıyan bir "yaprak" yukarıdan aşağı katlanıp kaybolur, ardından altta yeni rakamı
// taşıyan başka bir yaprak yukarıdan katlanarak yerine oturur. Yapraklar yalnızca gerçek bir
// değişiklikte (key değişince) yeniden monte edilip animasyonu baştan oynatır; ilk yüklemede
// (henüz bir değişim yokken) hiç render edilmez, böylece sayfa açılışında gereksiz bir flip
// oynamaz.
function FlipKart({ deger }) {
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
    <span className="flip-kart">
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

function IkiHane({ deger }) {
  const metin = String(deger).padStart(2, '0');
  return (
    <span className="flip-saat__grup">
      <FlipKart deger={metin[0]} />
      <FlipKart deger={metin[1]} />
    </span>
  );
}

// Üst bar için canlı saat: her saniye günceller, saat/dakika/saniye site renginde (mavi)
// kartların döndüğü bir flip-clock görünümünde gösterilir.
export default function FlipSaat() {
  const [simdi, setSimdi] = useState(() => new Date());

  useEffect(() => {
    const zamanlayici = setInterval(() => setSimdi(new Date()), 1000);
    return () => clearInterval(zamanlayici);
  }, []);

  return (
    <div className="flip-saat" aria-label={`Saat: ${simdi.toLocaleTimeString('tr-TR')}`}>
      <IkiHane deger={simdi.getHours()} />
      <IkiHane deger={simdi.getMinutes()} />
      <IkiHane deger={simdi.getSeconds()} />
    </div>
  );
}
