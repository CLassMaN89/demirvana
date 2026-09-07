import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoVerisiOlustur } from '../seo/seoOlustur';

function metaEkle(ad, icerik, ozellik = false) {
  if (!icerik) return;
  const meta = document.createElement('meta');
  meta.setAttribute(ozellik ? 'property' : 'name', ad);
  meta.setAttribute('content', icerik);
  meta.dataset.demirvanaSeo = 'true';
  document.head.append(meta);
}

export default function SeoYoneticisi({ seo, icerik, bulunamadi = false }) {
  const konum = useLocation();

  useEffect(() => {
    const sonuc = seoVerisiOlustur(konum.pathname, seo, icerik, bulunamadi);
    document.head.querySelectorAll('[data-demirvana-seo]').forEach((oge) => oge.remove());
    document.title = sonuc.baslik;
    document.documentElement.lang = sonuc.dil;

    metaEkle('description', sonuc.aciklama);
    metaEkle('keywords', sonuc.anahtarKelimeler);
    metaEkle('robots', sonuc.robotlar);
    metaEkle('og:type', 'website', true);
    metaEkle('og:site_name', seo?.genel?.site_adi || 'Demirvana', true);
    metaEkle('og:title', sonuc.sosyalBaslik, true);
    metaEkle('og:description', sonuc.sosyalAciklama, true);
    metaEkle('og:url', sonuc.canonical, true);
    metaEkle('og:image', sonuc.sosyalGorsel, true);
    metaEkle('twitter:card', sonuc.sosyalGorsel ? 'summary_large_image' : 'summary');
    metaEkle('twitter:title', sonuc.sosyalBaslik);
    metaEkle('twitter:description', sonuc.sosyalAciklama);
    metaEkle('twitter:image', sonuc.sosyalGorsel);
    metaEkle('google-site-verification', seo?.genel?.google_site_dogrulama);

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = sonuc.canonical;
    canonical.dataset.demirvanaSeo = 'true';
    document.head.append(canonical);

    const jsonLd = document.createElement('script');
    jsonLd.type = 'application/ld+json';
    jsonLd.textContent = JSON.stringify(sonuc.yapilandirilmisVeri);
    jsonLd.dataset.demirvanaSeo = 'true';
    document.head.append(jsonLd);
  }, [bulunamadi, icerik, konum.pathname, seo]);

  return null;
}
