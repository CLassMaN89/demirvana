import HeroCarousel from '../bilesenler/HeroCarousel';
import KategoriBolumu from '../bilesenler/KategoriBolumu';

export default function AnaSayfa({ sliderlar, kategoriler, siteAyarlari }) {
  return (
    <>
      <HeroCarousel sliderlar={sliderlar} />
      <KategoriBolumu kategoriler={kategoriler} siteAyarlari={siteAyarlari} />
    </>
  );
}
