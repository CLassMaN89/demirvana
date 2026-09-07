import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DurumMesaji from './bilesenler/DurumMesaji';
import SayfaGecisi from './bilesenler/SayfaGecisi';
import SayfaIskeleti from './bilesenler/SayfaIskeleti';
import SeoYoneticisi from './bilesenler/SeoYoneticisi';
import AnaSayfa from './sayfalar/AnaSayfa';
import IcerikSayfasi from './sayfalar/IcerikSayfasi';
import KategoriSayfasi from './sayfalar/KategoriSayfasi';
import ReferanslarSayfasi from './sayfalar/ReferanslarSayfasi';
import BulunamadiSayfasi from './sayfalar/BulunamadiSayfasi';
import UrunDetaySayfasi from './sayfalar/UrunDetaySayfasi';
import UrunlerSayfasi from './sayfalar/UrunlerSayfasi';
import { siteVerileriniGetir } from './servisler/api';
import { temaUygula } from './tema/temaUygula';
import { metinler } from './metinler/tr';

const SABIT_YOLLAR = new Set(['/', '/urunler', '/kurumsal', '/teknik', '/referanslar', '/sertifikalar', '/iletisim']);

function menuBaglantisiVar(menu, yol) {
  return (menu ?? []).some((oge) => oge.baglanti === yol || menuBaglantisiVar(oge.alt_ogeler, yol));
}

function yolMevcutMu(yol, veri) {
  if (SABIT_YOLLAR.has(yol) || menuBaglantisiVar(veri.menu, yol)) return true;
  if (yol.startsWith('/kategoriler/')) return veri.kategoriler.some((oge) => `/kategoriler/${oge.slug}` === yol);
  if (yol.startsWith('/urunler/')) return (veri.urunler ?? []).some((oge) => `/urunler/${oge.slug}` === yol);
  return false;
}

export default function App({ veriKaynagi = siteVerileriniGetir }) {
  const konum = useLocation();
  const [durum, setDurum] = useState({ yukleniyor: true, veri: null, hata: null });
  const [yenileme, setYenileme] = useState(0);

  useEffect(() => {
    let etkin = true;

    setDurum({ yukleniyor: true, veri: null, hata: null });
    // Veri kaynağını prop olarak alabilmek, üretimde gerçek API'yi; testte dış ağa çıkmayan sabit veriyi kullanmamızı sağlar.
    veriKaynagi()
      .then((veri) => {
        if (!etkin) return;
        temaUygula(veri.tema);
        setDurum({ yukleniyor: false, veri, hata: null });
      })
      .catch((hata) => {
        if (etkin) setDurum({ yukleniyor: false, veri: null, hata });
      });

    // Yavaş istek sayfa değiştikten sonra tamamlanırsa eski bileşenin state'ini güncellemesini önleriz.
    return () => {
      etkin = false;
    };
  }, [veriKaynagi, yenileme]);

  if (durum.yukleniyor) {
    return (
      <SayfaIskeleti menu={[]}>
        <DurumMesaji baslik={metinler.yukleniyor} />
      </SayfaIskeleti>
    );
  }

  if (durum.hata) {
    return (
      <SayfaIskeleti menu={[]}>
        <DurumMesaji
          baslik={metinler.yuklemeHatasi}
          aciklama="Bağlantınızı kontrol edip yeniden deneyin."
          eylem={(
            <button className="birincil-dugme" type="button" onClick={() => setYenileme((deger) => deger + 1)}>
              {metinler.tekrarDene}
            </button>
          )}
        />
      </SayfaIskeleti>
    );
  }

  const veri = durum.veri;
  const sayfaBulunamadi = !yolMevcutMu(konum.pathname, veri);

  // Router tek bir iskelet içinde çalışır; böylece navbar sayfa geçişlerinde yeniden kurulmaz.
  return (
    <SayfaIskeleti
      menu={veri.menu}
      kategoriler={veri.kategoriler}
      siteAyarlari={veri.site_ayarlari}
      aramaKaynaklari={{ kategoriler: veri.kategoriler, urunler: veri.urunler, referanslar: veri.referanslar }}
    >
      <SeoYoneticisi
        seo={veri.seo}
        icerik={veri}
        bulunamadi={sayfaBulunamadi}
      />
      <SayfaGecisi>
        <Routes>
          <Route path="/" element={<AnaSayfa sliderlar={veri.sliderlar} kategoriler={veri.kategoriler} />} />
          <Route path="/urunler" element={<UrunlerSayfasi kategoriler={veri.kategoriler} />} />
          <Route path="/kategoriler/:slug" element={<KategoriSayfasi kategoriler={veri.kategoriler} />} />
          <Route path="/urunler/:slug" element={<UrunDetaySayfasi urunler={veri.urunler ?? []} />} />
          <Route path="/kurumsal" element={<IcerikSayfasi tur="kurumsal" />} />
          <Route path="/teknik" element={<IcerikSayfasi tur="teknik" />} />
          <Route path="/referanslar" element={<ReferanslarSayfasi referanslar={veri.referanslar} />} />
          <Route path="/sertifikalar" element={<IcerikSayfasi tur="sertifikalar" />} />
          <Route path="/iletisim" element={<IcerikSayfasi tur="iletisim" />} />
          <Route path="*" element={<BulunamadiSayfasi />} />
        </Routes>
      </SayfaGecisi>
    </SayfaIskeleti>
  );
}
