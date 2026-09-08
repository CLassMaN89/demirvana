import HeroCarousel from '../bilesenler/HeroCarousel';
import KategoriBolumu from '../bilesenler/KategoriBolumu';
import VanaVitrini from '../bilesenler/VanaVitrini';

export default function AnaSayfa({ sliderlar, kategoriler, siteAyarlari }) {
  return (
    <>
      <HeroCarousel sliderlar={sliderlar} />
      <VanaVitrini kategoriler={kategoriler} />
      <KategoriBolumu kategoriler={kategoriler} siteAyarlari={siteAyarlari} />
    </>
  );
}
