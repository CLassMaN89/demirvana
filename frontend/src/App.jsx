import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DurumMesaji from './bilesenler/DurumMesaji';
import SayfaGecisi from './bilesenler/SayfaGecisi';
import SayfaIskeleti from './bilesenler/SayfaIskeleti';
import SeoYoneticisi from './bilesenler/SeoYoneticisi';
import AnaSayfa from './sayfalar/AnaSayfa';
import IcerikSayfasi from './sayfalar/IcerikSayfasi';
import KategoriSayfasi from './sayfalar/KategoriSayfasi';
import KurumsalSayfasi from './sayfalar/KurumsalSayfasi';
import ReferanslarSayfasi from './sayfalar/ReferanslarSayfasi';
import TeknikSayfasi from './sayfalar/TeknikSayfasi';
import SertifikalarSayfasi from './sayfalar/SertifikalarSayfasi';
import BulunamadiSayfasi from './sayfalar/BulunamadiSayfasi';
import UrunDetaySayfasi from './sayfalar/UrunDetaySayfasi';
import UrunlerSayfasi from './sayfalar/UrunlerSayfasi';
import TemsilciliklerSayfasi from './sayfalar/TemsilciliklerSayfasi';
import YonetimDuzeni from './bilesenler/YonetimDuzeni';
import YonetimPaneliSayfasi from './sayfalar/YonetimPaneliSayfasi';
import KategoriYonetimSayfasi from './sayfalar/KategoriYonetimSayfasi';
import IstatistiklerSayfasi from './sayfalar/IstatistiklerSayfasi';
import LogYonetimiSayfasi from './sayfalar/LogYonetimiSayfasi';
import SeoMerkeziSayfasi from './sayfalar/SeoMerkeziSayfasi';
import { kalmaSuresiKaydet, sayfaGoruntulemeKaydet, siteVerileriniGetir } from './servisler/api';
import { temaUygula } from './tema/temaUygula';
import { metinler } from './metinler/tr';

const SABIT_YOLLAR = new Set(['/', '/urunler', '/kurumsal', '/temsilcilikler', '/teknik', '/referanslar', '/sertifikalar', '/iletisim']);

function menuBaglantisiVar(menu, yol) {
  return (menu ?? []).some((oge) => oge.baglanti === yol || menuBaglantisiVar(oge.alt_ogeler, yol));
}

// /urunler/:slug adresinin bir ürün kategorisi mi yoksa tekil ürün detayı mı olduğunu menu verisine bakarak ayırt eder.
function urunKategoriYoluMu(menu, yol) {
  const urunMenusu = (menu ?? []).find((oge) => oge.baglanti === '/urunler');
  for (const grup of urunMenusu?.alt_ogeler ?? []) {
    if (grup.baglanti === yol) return true;
    if ((grup.alt_ogeler ?? []).some((alt) => alt.baglanti === yol)) return true;
  }
  return false;
}

function UrunYoluCozucu({ menu, urunler }) {
  const konum = useLocation();
  if (urunKategoriYoluMu(menu, konum.pathname)) {
    return <UrunlerSayfasi menu={menu} urunler={urunler} />;
  }
  return <UrunDetaySayfasi menu={menu} urunler={urunler} />;
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
  const ilkYuklemeYapildi = useRef(false);

  useEffect(() => {
    let etkin = true;

    // Admin panelinde bir kayıt eklenip/düzenlenip/silindiğinde veriYenile bu efekti tekrar
    // tetikler; ilk yüklemeden sonraki bu tazelemelerde "yukleniyor" ekranına dönülmez, aksi halde
    // her işlemde sanki sayfa yenileniyormuş gibi anlık bir tam ekran flaşı hissedilirdi.
    if (!ilkYuklemeYapildi.current) setDurum({ yukleniyor: true, veri: null, hata: null });

    // Veri kaynağını prop olarak alabilmek, üretimde gerçek API'yi; testte dış ağa çıkmayan sabit veriyi kullanmamızı sağlar.
    veriKaynagi()
      .then((veri) => {
        if (!etkin) return;
        ilkYuklemeYapildi.current = true;
        temaUygula(veri.tema);
        setDurum({ yukleniyor: false, veri, hata: null });
      })
      .catch((hata) => {
        if (!etkin) return;
        if (!ilkYuklemeYapildi.current) setDurum({ yukleniyor: false, veri: null, hata });
      });

    // Yavaş istek sayfa değiştikten sonra tamamlanırsa eski bileşenin state'ini güncellemesini önleriz.
    return () => {
      etkin = false;
    };
  }, [veriKaynagi, yenileme]);

  // Halka açık site ziyaretlerini (admin paneli hariç) sunucuya bildirir; İstatistikler sayfasının
  // "hangi sayfalar görüntülendi" verisinin kaynağı budur.
  const oncekiYolRef = useRef(null);
  // O an açık olan sayfanın ziyaret kaydı id'si ve İLK açıldığı an; kontrol noktası her
  // tetiklendiğinde bu ilk andan itibaren geçen TOPLAM süre gönderilir (girisZamani hiç
  // sıfırlanmaz) — böylece sekme başka bir sekmeye geçilse/arka plana alınsa bile o süre de
  // toplama dahil olur, yalnızca gerçekten farklı bir sayfaya geçildiğinde (route değişince)
  // veya sekme kapatılınca (pagehide) sayaç durdurulup sıfırlanır.
  const guncelZiyaretRef = useRef(null);

  function acikSayfaKontrolNoktasi(sayfaBittiMi = false) {
    if (!guncelZiyaretRef.current) return;
    const { id, girisZamani } = guncelZiyaretRef.current;
    kalmaSuresiKaydet(id, Math.round((Date.now() - girisZamani) / 1000));
    if (sayfaBittiMi) guncelZiyaretRef.current = null;
  }

  useEffect(() => {
    if (konum.pathname.startsWith('/admin')) return;
    acikSayfaKontrolNoktasi(true);

    let etkin = true;
    sayfaGoruntulemeKaydet(konum.pathname, oncekiYolRef.current).then((id) => {
      if (etkin) guncelZiyaretRef.current = { id, girisZamani: Date.now() };
    });
    oncekiYolRef.current = konum.pathname;

    return () => {
      etkin = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [konum.pathname]);

  // Sekme başka bir sekmeye geçilse/arka plana alınsa bile kalma süresi işlemeye devam eder
  // (yalnızca bir kontrol noktası atılır, sayaç durdurulmaz); admin panelinde sayının canlı
  // büyüdüğünü görebilmek için ayrıca periyodik bir kontrol noktası da atılır. Sekme
  // kapatılırken/gerçekten başka bir siteye geçilirken (pagehide) ise sayaç kesin olarak biter.
  useEffect(() => {
    const kontrolNoktasi = () => acikSayfaKontrolNoktasi(false);
    const sayfaBitti = () => acikSayfaKontrolNoktasi(true);
    const zamanlayici = setInterval(kontrolNoktasi, 20000);
    document.addEventListener('visibilitychange', kontrolNoktasi);
    window.addEventListener('pagehide', sayfaBitti);
    return () => {
      clearInterval(zamanlayici);
      document.removeEventListener('visibilitychange', kontrolNoktasi);
      window.removeEventListener('pagehide', sayfaBitti);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  // Kategori Yönetimi'nde bir kategori eklenip/düzenlenip/pasif yapıldığında, halka açık sayfaların
  // kullandığı bu veri (menu, urunler) da tazelenir; yoksa sitede sayfa yenilenene kadar eski hal görünür.
  const veriYenile = () => setYenileme((deger) => deger + 1);

  // Yönetim paneli, halka açık sitenin navbar/footer iskeletinden bağımsız kendi düzenini kullanır.
  if (konum.pathname.startsWith('/admin')) {
    return (
      <YonetimDuzeni>
        <Routes>
          <Route path="/admin" element={<YonetimPaneliSayfasi veri={veri} />} />
          <Route path="/admin/kategoriler" element={<KategoriYonetimSayfasi veriYenile={veriYenile} />} />
          <Route path="/admin/istatistikler" element={<IstatistiklerSayfasi />} />
          <Route path="/admin/loglar" element={<LogYonetimiSayfasi />} />
          <Route path="/admin/seo" element={<SeoMerkeziSayfasi />} />
          <Route path="/admin/*" element={<YonetimPaneliSayfasi veri={veri} />} />
        </Routes>
      </YonetimDuzeni>
    );
  }

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
          <Route path="/" element={<AnaSayfa sliderlar={veri.sliderlar} kategoriler={veri.kategoriler} fuarlar={veri.fuarlar ?? []} siteAyarlari={veri.site_ayarlari} />} />
          <Route path="/urunler" element={<UrunlerSayfasi menu={veri.menu} urunler={veri.urunler ?? []} />} />
          <Route path="/temsilcilikler" element={<TemsilciliklerSayfasi temsilcilikler={veri.temsilcilikler ?? []} siteAyarlari={veri.site_ayarlari} />} />
          <Route path="/kategoriler/:slug" element={<KategoriSayfasi kategoriler={veri.kategoriler} />} />
          <Route path="/urunler/:slug" element={<UrunYoluCozucu menu={veri.menu} urunler={veri.urunler ?? []} />} />
          <Route path="/kurumsal" element={<KurumsalSayfasi kurumsal={veri.kurumsal} siteAyarlari={veri.site_ayarlari} />} />
          <Route path="/teknik" element={<TeknikSayfasi kategoriler={veri.teknik_dokumanlar} siteAyarlari={veri.site_ayarlari} />} />
          <Route path="/referanslar" element={<ReferanslarSayfasi referanslar={veri.referanslar} siteAyarlari={veri.site_ayarlari} />} />
          <Route path="/sertifikalar" element={<SertifikalarSayfasi sertifikalar={veri.sertifikalar} siteAyarlari={veri.site_ayarlari} />} />
          <Route path="/iletisim" element={<IcerikSayfasi tur="iletisim" siteAyarlari={veri.site_ayarlari} bankaHesaplari={veri.banka_hesaplari ?? []} />} />
          <Route path="*" element={<BulunamadiSayfasi />} />
        </Routes>
      </SayfaGecisi>
    </SayfaIskeleti>
  );
}
