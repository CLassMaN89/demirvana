import HeroCarousel from '../bilesenler/HeroCarousel';
import KategoriBolumu from '../bilesenler/KategoriBolumu';

export default function AnaSayfa({ sliderlar, kategoriler }) {
  return (
    <>
      <HeroCarousel sliderlar={sliderlar} />
      <KategoriBolumu kategoriler={kategoriler} />
    </>
  );
}

