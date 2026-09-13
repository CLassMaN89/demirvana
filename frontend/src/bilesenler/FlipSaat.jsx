import { useEffect, useState } from 'react';
import { FlipIkiHane } from './FlipKart';

// Üst bar için canlı saat: her saniye günceller, saat/dakika/saniye pqina.nl/flip
// örneğindeki gibi koyu antrasit "split-flap" kartlarla gösterilir.
export default function FlipSaat() {
  const [simdi, setSimdi] = useState(() => new Date());

  useEffect(() => {
    const zamanlayici = setInterval(() => setSimdi(new Date()), 1000);
    return () => clearInterval(zamanlayici);
  }, []);

  return (
    <div className="flip-saat" aria-label={`Saat: ${simdi.toLocaleTimeString('tr-TR')}`}>
      <FlipIkiHane deger={simdi.getHours()} />
      <FlipIkiHane deger={simdi.getMinutes()} />
      <FlipIkiHane deger={simdi.getSeconds()} />
    </div>
  );
}
