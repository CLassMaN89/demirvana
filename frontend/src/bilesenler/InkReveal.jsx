import { useCallback, useEffect, useRef } from 'react';

export default function InkReveal({
  gorselYolu,
  odakX = 50,
  odakY = 50,
  fircaBoyutu = 128,
  yasamSuresi = 650,
  baslangicYaricapi = 10,
  yaricapDegisimi = 0.45,
  damgaAraligi = 10,
  azamiDamga = 180,
  parcaSayisi = 36,
  className = ''
}) {
  const canvasRef = useRef(null);
  const griGorselRef = useRef(null);
  const damgalarRef = useRef([]);
  const calisiyorRef = useRef(false);
  const sonKonumRef = useRef(null);
  const boyutRef = useRef({ genislik: 0, yukseklik: 0 });
  const animasyonRef = useRef(null);

  const griGorseliCiz = useCallback((baglam) => {
    const { genislik, yukseklik } = boyutRef.current;
    const gorsel = griGorselRef.current;
    baglam.globalCompositeOperation = 'source-over';
    baglam.clearRect(0, 0, genislik, yukseklik);
    if (!gorsel?.naturalWidth || !gorsel?.naturalHeight) return;

    // DOM görselindeki object-fit: cover davranışını tekrar ederek renkli ve gri katmanları çakıştırırız.
    const olcek = Math.max(
      genislik / gorsel.naturalWidth,
      yukseklik / gorsel.naturalHeight
    );
    const cizimGenisligi = gorsel.naturalWidth * olcek;
    const cizimYuksekligi = gorsel.naturalHeight * olcek;
    const x = (genislik - cizimGenisligi) * (odakX / 100);
    const y = (yukseklik - cizimYuksekligi) * (odakY / 100);

    baglam.save();
    baglam.filter = 'grayscale(1) contrast(1.05)';
    baglam.drawImage(gorsel, x, y, cizimGenisligi, cizimYuksekligi);
    baglam.restore();
  }, [odakX, odakY]);

  const yenidenBoyutlandir = useCallback(() => {
    const canvas = canvasRef.current;
    const ust = canvas?.parentElement;
    if (!canvas || !ust) return;

    const baglam = canvas.getContext?.('2d');
    if (!baglam) return;

    const oran = Math.min(window.devicePixelRatio || 1, 2);
    const dikdortgen = ust.getBoundingClientRect();
    boyutRef.current = { genislik: dikdortgen.width, yukseklik: dikdortgen.height };
    canvas.width = Math.round(dikdortgen.width * oran);
    canvas.height = Math.round(dikdortgen.height * oran);
    canvas.style.width = `${dikdortgen.width}px`;
    canvas.style.height = `${dikdortgen.height}px`;
    baglam.setTransform(oran, 0, 0, oran, 0, 0);
    griGorseliCiz(baglam);
  }, [griGorseliCiz]);

  const murekkepAc = useCallback((baglam, damga, yaricap, saydamlik) => {
    const gradyan = baglam.createRadialGradient(
      damga.x,
      damga.y,
      yaricap * 0.2,
      damga.x,
      damga.y,
      yaricap
    );
    gradyan.addColorStop(0, `rgba(0, 0, 0, ${0.95 * saydamlik})`);
    gradyan.addColorStop(0.5, `rgba(0, 0, 0, ${0.88 * saydamlik})`);
    gradyan.addColorStop(1, 'rgba(0, 0, 0, 0)');
    baglam.fillStyle = gradyan;
    baglam.beginPath();

    // Birden fazla sinüs dalgası, kusursuz daire yerine doğal mürekkep kenarı üretir.
    for (let sira = 0; sira <= parcaSayisi; sira += 1) {
      const aci = (sira / parcaSayisi) * Math.PI * 2;
      const oynama = 0.78
        + 0.14 * Math.sin(aci * 3 + damga.tohum)
        + 0.08 * Math.sin(aci * 5 + damga.tohum * 2.1)
        + 0.05 * Math.sin(aci * 7 + damga.tohum * 0.7);
      const x = damga.x + Math.cos(aci) * yaricap * oynama;
      const y = damga.y + Math.sin(aci) * yaricap * oynama;
      if (sira === 0) baglam.moveTo(x, y);
      else baglam.lineTo(x, y);
    }

    baglam.closePath();
    baglam.fill();
  }, [parcaSayisi]);

  const animasyon = useCallback(() => {
    const canvas = canvasRef.current;
    const baglam = canvas?.getContext?.('2d');
    if (!canvas || !baglam) {
      calisiyorRef.current = false;
      return;
    }

    const simdi = performance.now();
    const damgalar = damgalarRef.current;
    griGorseliCiz(baglam);
    baglam.globalCompositeOperation = 'destination-out';

    for (let sira = damgalar.length - 1; sira >= 0; sira -= 1) {
      const ilerleme = (simdi - damgalar[sira].dogum) / yasamSuresi;
      if (ilerleme >= 1) {
        damgalar.splice(sira, 1);
        continue;
      }

      const yumusatma = 1 - (1 - ilerleme) ** 3;
      const yaricap = baslangicYaricapi
        + (damgalar[sira].azamiYaricap - baslangicYaricapi) * yumusatma;
      murekkepAc(baglam, damgalar[sira], yaricap, 1 - ilerleme ** 2);
    }

    if (damgalar.length > 0) animasyonRef.current = requestAnimationFrame(animasyon);
    else calisiyorRef.current = false;
  }, [baslangicYaricapi, griGorseliCiz, murekkepAc, yasamSuresi]);

  const damgaEkle = useCallback((x, y) => {
    const damgalar = damgalarRef.current;
    if (damgalar.length >= azamiDamga) damgalar.shift();
    damgalar.push({
      x,
      y,
      dogum: performance.now(),
      tohum: Math.random() * Math.PI * 2,
      azamiYaricap: fircaBoyutu * (1 - yaricapDegisimi + Math.random() * yaricapDegisimi)
    });
  }, [azamiDamga, fircaBoyutu, yaricapDegisimi]);

  const yolBoyuncaDamgala = useCallback((x, y) => {
    const son = sonKonumRef.current;
    if (!son) damgaEkle(x, y);
    else {
      const xFarki = x - son.x;
      const yFarki = y - son.y;
      const mesafe = Math.hypot(xFarki, yFarki);
      const adim = Math.max(1, Math.ceil(mesafe / damgaAraligi));
      for (let sira = 1; sira <= adim; sira += 1) {
        damgaEkle(son.x + (xFarki * sira) / adim, son.y + (yFarki * sira) / adim);
      }
    }
    sonKonumRef.current = { x, y };
  }, [damgaAraligi, damgaEkle]);

  const animasyonuBaslat = useCallback(() => {
    if (!calisiyorRef.current) {
      calisiyorRef.current = true;
      animasyonRef.current = requestAnimationFrame(animasyon);
    }
  }, [animasyon]);

  useEffect(() => {
    yenidenBoyutlandir();
    window.addEventListener('resize', yenidenBoyutlandir);

    // Üst canvas aynı hero görselini gri çizer; silinen bölgelerde alttaki renkli img görünür.
    const gorsel = new Image();
    gorsel.decoding = 'async';
    gorsel.onload = () => {
      griGorselRef.current = gorsel;
      yenidenBoyutlandir();
    };
    gorsel.src = gorselYolu;

    return () => {
      gorsel.onload = null;
      window.removeEventListener('resize', yenidenBoyutlandir);
      if (animasyonRef.current) cancelAnimationFrame(animasyonRef.current);
    };
  }, [gorselYolu, yenidenBoyutlandir]);

  const goreliKonum = (olay) => {
    const dikdortgen = olay.currentTarget.getBoundingClientRect();
    return { x: olay.clientX - dikdortgen.left, y: olay.clientY - dikdortgen.top };
  };

  return (
    <canvas
      ref={canvasRef}
      className={`hero-carousel__murekkep ${className}`.trim()}
      data-testid="murekkep-maskesi"
      data-gorsel-yolu={gorselYolu}
      aria-hidden="true"
      onPointerEnter={(olay) => {
        if (olay.pointerType && olay.pointerType !== 'mouse') return;
        const konum = goreliKonum(olay);
        sonKonumRef.current = konum;
        yolBoyuncaDamgala(konum.x, konum.y);
        animasyonuBaslat();
      }}
      onPointerMove={(olay) => {
        if (olay.pointerType && olay.pointerType !== 'mouse') return;
        const konum = goreliKonum(olay);
        yolBoyuncaDamgala(konum.x, konum.y);
        animasyonuBaslat();
      }}
      onPointerLeave={() => {
        sonKonumRef.current = null;
      }}
    />
  );
}
