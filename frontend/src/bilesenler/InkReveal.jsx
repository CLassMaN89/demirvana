import { useCallback, useEffect, useRef } from 'react';

// Slayt her döndüğünde bileşen yeniden mount olsa da Sobel çizimi görsel başına
// yalnız bir kez hesaplanır; aksi halde her geçişte ana thread bloke olup kasma yaratırdı.
const teknikCizimOnbellegi = new Map();

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
  const teknikCizimRef = useRef(null);
  const damgalarRef = useRef([]);
  const calisiyorRef = useRef(false);
  const sonKonumRef = useRef(null);
  const boyutRef = useRef({ genislik: 0, yukseklik: 0 });
  const animasyonRef = useRef(null);

  const teknikCizimiCiz = useCallback((baglam) => {
    const { genislik, yukseklik } = boyutRef.current;
    const teknikCizim = teknikCizimRef.current;
    if (!teknikCizim?.width || !teknikCizim?.height) return;

    // DOM görselindeki object-fit: cover hesabını tekrar ederek teknik çizgileri fotoğrafla tam çakıştırırız.
    const olcek = Math.max(
      genislik / teknikCizim.width,
      yukseklik / teknikCizim.height
    );
    const cizimGenisligi = teknikCizim.width * olcek;
    const cizimYuksekligi = teknikCizim.height * olcek;
    const x = (genislik - cizimGenisligi) * (odakX / 100);
    const y = (yukseklik - cizimYuksekligi) * (odakY / 100);

    baglam.drawImage(teknikCizim, x, y, cizimGenisligi, cizimYuksekligi);
  }, [odakX, odakY]);

  const teknikCizimOlustur = useCallback((gorsel) => {
    const cizim = document.createElement('canvas');
    // Hesaplama yükünü sınırlarken geniş hero görselindeki vana detaylarını koruyacak çözünürlük kullanılır.
    const azamiGenislik = 1400;
    const olcek = Math.min(1, azamiGenislik / gorsel.naturalWidth);
    cizim.width = Math.max(1, Math.round(gorsel.naturalWidth * olcek));
    cizim.height = Math.max(1, Math.round(gorsel.naturalHeight * olcek));

    const baglam = cizim.getContext('2d', { willReadFrequently: true });
    if (!baglam) return null;
    baglam.drawImage(gorsel, 0, 0, cizim.width, cizim.height);

    const goruntuVerisi = baglam.getImageData(0, 0, cizim.width, cizim.height);
    const pikseller = goruntuVerisi.data;
    const parlaklik = new Float32Array(cizim.width * cizim.height);

    for (let piksel = 0; piksel < parlaklik.length; piksel += 1) {
      const kanal = piksel * 4;
      parlaklik[piksel] = pikseller[kanal] * 0.299
        + pikseller[kanal + 1] * 0.587
        + pikseller[kanal + 2] * 0.114;
    }

    // Sobel kenar algılama gölgelendirmeyi değil, vana ve teknik parçaların gerçek sınırlarını çıkarır.
    for (let y = 0; y < cizim.height; y += 1) {
      for (let x = 0; x < cizim.width; x += 1) {
        const piksel = y * cizim.width + x;
        const kanal = piksel * 4;
        let kenarGucu = 0;

        if (x > 0 && x < cizim.width - 1 && y > 0 && y < cizim.height - 1) {
          const ust = piksel - cizim.width;
          const alt = piksel + cizim.width;
          const yatay = -parlaklik[ust - 1] + parlaklik[ust + 1]
            - 2 * parlaklik[piksel - 1] + 2 * parlaklik[piksel + 1]
            - parlaklik[alt - 1] + parlaklik[alt + 1];
          const dikey = -parlaklik[ust - 1] - 2 * parlaklik[ust] - parlaklik[ust + 1]
            + parlaklik[alt - 1] + 2 * parlaklik[alt] + parlaklik[alt + 1];
          kenarGucu = Math.hypot(yatay, dikey);
        }

        // Zayıf doku ve fotoğraf grenini eleyip güçlü hatları koyu mavi-gri teknik çizgiye dönüştürürüz.
        const cizgiOrani = Math.min(1, Math.max(0, (kenarGucu - 42) / 150));
        pikseller[kanal] = Math.round(248 - cizgiOrani * 210);
        pikseller[kanal + 1] = Math.round(249 - cizgiOrani * 202);
        pikseller[kanal + 2] = Math.round(250 - cizgiOrani * 190);
        pikseller[kanal + 3] = 255;
      }
    }

    baglam.putImageData(goruntuVerisi, 0, 0);
    return cizim;
  }, []);

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
    // Başlangıçta canvas şeffaftır; böylece alttaki hero kendi renkleriyle görünür.
    baglam.clearRect(0, 0, dikdortgen.width, dikdortgen.height);
  }, []);

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
    const { genislik, yukseklik } = boyutRef.current;
    baglam.globalCompositeOperation = 'source-over';
    baglam.clearRect(0, 0, genislik, yukseklik);

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

    if (damgalar.length > 0) {
      // Teknik çizim yalnız imlecin açtığı alfa alanında kalır; geri kalan canvas şeffaftır.
      baglam.globalCompositeOperation = 'source-in';
      teknikCizimiCiz(baglam);
      animasyonRef.current = requestAnimationFrame(animasyon);
    } else calisiyorRef.current = false;
  }, [baslangicYaricapi, murekkepAc, teknikCizimiCiz, yasamSuresi]);

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

    // Aynı hero görselinden bir kez teknik çizim üretilir; çizim yalnız fare damgalarında görünür.
    const onbellektekiCizim = teknikCizimOnbellegi.get(gorselYolu);
    if (onbellektekiCizim) {
      teknikCizimRef.current = onbellektekiCizim;
      yenidenBoyutlandir();
      return () => {
        window.removeEventListener('resize', yenidenBoyutlandir);
        if (animasyonRef.current) cancelAnimationFrame(animasyonRef.current);
      };
    }

    const gorsel = new Image();
    gorsel.decoding = 'async';
    gorsel.onload = () => {
      const cizim = teknikCizimOlustur(gorsel);
      if (cizim) teknikCizimOnbellegi.set(gorselYolu, cizim);
      teknikCizimRef.current = cizim;
      yenidenBoyutlandir();
    };
    gorsel.src = gorselYolu;

    return () => {
      gorsel.onload = null;
      window.removeEventListener('resize', yenidenBoyutlandir);
      if (animasyonRef.current) cancelAnimationFrame(animasyonRef.current);
    };
  }, [gorselYolu, yenidenBoyutlandir, teknikCizimOlustur]);

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
      data-efekt="teknik-cizim"
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
