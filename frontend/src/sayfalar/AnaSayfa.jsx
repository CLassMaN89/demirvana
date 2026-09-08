import HeroCarousel from '../bilesenler/HeroCarousel';
import KategoriBolumu from '../bilesenler/KategoriBolumu';
import VanaVitrini from '../bilesenler/VanaVitrini';

export default function AnaSayfa({ sliderlar, kategoriler, siteAyarlari }) {
  return (
    <>
      <HeroCarousel sliderlar={sliderlar} />
      <KategoriBolumu kategoriler={kategoriler} siteAyarlari={siteAyarlari} />
      <VanaVitrini kategoriler={kategoriler} siteAyarlari={siteAyarlari} />
    </>
  );
}
