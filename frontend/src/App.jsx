import { Navigate, Route, Routes } from 'react-router-dom';
import SayfaIskeleti from './bilesenler/SayfaIskeleti';
import AnaSayfa from './sayfalar/AnaSayfa';
import IcerikSayfasi from './sayfalar/IcerikSayfasi';
import KategoriSayfasi from './sayfalar/KategoriSayfasi';
import UrunDetaySayfasi from './sayfalar/UrunDetaySayfasi';
import UrunlerSayfasi from './sayfalar/UrunlerSayfasi';
import { ornekVeriler } from './veri/ornekVeriler';

export default function App({ veri = ornekVeriler }) {
  // Router tek bir iskelet içinde çalışır; böylece navbar sayfa geçişlerinde yeniden kurulmaz.
  return (
    <SayfaIskeleti menu={veri.menu}>
      <Routes>
        <Route path="/" element={<AnaSayfa sliderlar={veri.sliderlar} kategoriler={veri.kategoriler} />} />
        <Route path="/urunler" element={<UrunlerSayfasi kategoriler={veri.kategoriler} />} />
        <Route path="/kategoriler/:slug" element={<KategoriSayfasi kategoriler={veri.kategoriler} />} />
        <Route path="/urunler/:slug" element={<UrunDetaySayfasi urunler={veri.urunler} />} />
        <Route path="/hakkimizda" element={<IcerikSayfasi tur="hakkimizda" />} />
        <Route path="/uretim" element={<IcerikSayfasi tur="uretim" />} />
        <Route path="/iletisim" element={<IcerikSayfasi tur="iletisim" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SayfaIskeleti>
  );
}
