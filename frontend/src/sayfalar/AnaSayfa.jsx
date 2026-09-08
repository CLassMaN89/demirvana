import HeroCarousel from '../bilesenler/HeroCarousel';
import KategoriBolumu from '../bilesenler/KategoriBolumu';
import VanaVitrini from '../bilesenler/VanaVitrini';
import FuarlarBolumu from '../bilesenler/FuarlarBolumu';

export default function AnaSayfa({ sliderlar, kategoriler, fuarlar, siteAyarlari }) {
  return (
    <>
      <HeroCarousel sliderlar={sliderlar} />
      <VanaVitrini kategoriler={kategoriler} />
      <KategoriBolumu kategoriler={kategoriler} siteAyarlari={siteAyarlari} />
      <FuarlarBolumu fuarlar={fuarlar} siteAyarlari={siteAyarlari} />
    </>
  );
}
