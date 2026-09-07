function tamAdreseDonustur(deger, anaAdres) {
  if (!deger) return null;

  try {
    return new URL(deger, `${anaAdres}/`).href;
  } catch {
    return null;
  }
}

function canonicalOlustur(yol, canonicalYolu, anaAdres) {
  const guvenliAnaAdres = String(anaAdres || 'https://www.demirvana.com').replace(/\/$/, '');

  try {
    const anaUrl = new URL(guvenliAnaAdres);
    const aday = new URL(canonicalYolu || yol, `${guvenliAnaAdres}/`);
    // Admin alanına yanlışlıkla harici URL girilse bile canonical kendi alan adından çıkmaz.
    return aday.origin === anaUrl.origin ? aday.href : new URL(yol, `${guvenliAnaAdres}/`).href;
  } catch {
    return `${guvenliAnaAdres}${yol === '/' ? '/' : yol}`;
  }
}

function dinamikIcerikBul(yol, icerik) {
  const kategoriEslesmesi = yol.match(/^\/kategoriler\/([^/]+)$/);
  if (kategoriEslesmesi) {
    const kayit = (icerik.kategoriler ?? []).find((kategori) => kategori.slug === kategoriEslesmesi[1]);
    if (kayit) return { tur: 'CollectionPage', ad: kayit.ad, aciklama: kayit.aciklama, gorsel: kayit.gorsel_yolu };
  }

  const urunEslesmesi = yol.match(/^\/urunler\/([^/]+)$/);
  if (urunEslesmesi) {
    const kayit = (icerik.urunler ?? []).find((urun) => urun.slug === urunEslesmesi[1]);
    if (kayit) {
      return {
        tur: 'Product', ad: kayit.ad, aciklama: kayit.kisa_aciklama || kayit.uzun_aciklama,
        gorsel: kayit.gorseller?.[0]?.gorsel_yolu
      };
    }
  }

  return null;
}

function kirintiListesiOlustur(yol, baslik, anaAdres) {
  if (yol === '/') return null;

  const parcalar = yol.split('/').filter(Boolean);
  const ogeler = [{ '@type': 'ListItem', position: 1, name: 'Anasayfa', item: `${anaAdres}/` }];
  let birikenYol = '';

  parcalar.forEach((parca, indeks) => {
    birikenYol += `/${parca}`;
    const sonOge = indeks === parcalar.length - 1;
    ogeler.push({
      '@type': 'ListItem',
      position: indeks + 2,
      name: sonOge ? baslik.split('|')[0].trim() : parca.replaceAll('-', ' ').replace(/^./, (harf) => harf.toLocaleUpperCase('tr-TR')),
      item: `${anaAdres}${birikenYol}`
    });
  });

  return { '@type': 'BreadcrumbList', itemListElement: ogeler };
}

function yapilandirilmisVeriOlustur({ yol, baslik, aciklama, canonical, gorsel, tur, genel, dinamik }) {
  const anaAdres = String(genel.site_ana_adresi || 'https://www.demirvana.com').replace(/\/$/, '');
  const organizasyonId = `${anaAdres}/#organizasyon`;
  const graph = [];

  if (yol === '/') {
    graph.push({
      '@type': genel.seo_organizasyon_turu || 'Organization',
      '@id': organizasyonId,
      name: genel.site_adi || 'Demirvana',
      url: `${anaAdres}/`,
      logo: tamAdreseDonustur(genel.logo_yolu || genel.seo_varsayilan_gorsel, anaAdres),
      telephone: genel.destek_telefonu || undefined,
      email: genel.destek_eposta || undefined,
      address: genel.firma_adresi || undefined
    });
    graph.push({
      '@type': 'WebSite', '@id': `${anaAdres}/#website`, name: genel.site_adi || 'Demirvana',
      url: `${anaAdres}/`, inLanguage: genel.site_varsayilan_dil || 'tr', publisher: { '@id': organizasyonId }
    });
  }

  if (tur === 'Product' && dinamik) {
    graph.push({
      '@type': 'Product', name: dinamik.ad, description: aciklama, url: canonical,
      image: gorsel ? [gorsel] : undefined,
      brand: { '@type': 'Brand', name: genel.site_adi || 'Demirvana' }
    });
  } else {
    graph.push({
      '@type': tur || 'WebPage', name: baslik, description: aciklama, url: canonical,
      inLanguage: genel.site_varsayilan_dil || 'tr', isPartOf: { '@id': `${anaAdres}/#website` }
    });
  }

  const kirintilar = kirintiListesiOlustur(yol, baslik, anaAdres);
  if (kirintilar) graph.push(kirintilar);
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function seoVerisiOlustur(yol, seo = {}, icerik = {}, bulunamadi = false) {
  const temizYol = String(yol || '/').split(/[?#]/)[0] || '/';
  const genel = seo.genel ?? {};
  const dil = genel.site_varsayilan_dil || 'tr';
  const kayit = seo.sayfalar?.[dil]?.[temizYol] ?? null;
  const dinamik = kayit ? null : dinamikIcerikBul(temizYol, icerik);
  const siteAdi = genel.site_adi || 'Demirvana';
  const sablon = genel.seo_baslik_sablonu || `%s | ${siteAdi}`;
  const baslik = bulunamadi
    ? `Sayfa bulunamadı | ${siteAdi}`
    : kayit?.seo_basligi || (dinamik ? sablon.replace('%s', dinamik.ad) : genel.seo_varsayilan_baslik || siteAdi);
  const aciklama = kayit?.meta_aciklama || dinamik?.aciklama
    || (dinamik ? `${dinamik.ad} ürün ve teknik çözüm seçeneklerini Demirvana güvencesiyle inceleyin.` : genel.seo_varsayilan_aciklama || '');
  const canonical = canonicalOlustur(temizYol, kayit?.canonical_yolu, genel.site_ana_adresi);
  const gorsel = tamAdreseDonustur(kayit?.sosyal_gorsel_yolu || dinamik?.gorsel || genel.seo_varsayilan_gorsel, genel.site_ana_adresi);
  const robotlar = bulunamadi ? 'noindex, nofollow' : kayit?.robotlar || genel.seo_varsayilan_robotlar || 'index, follow';
  const tur = kayit?.yapilandirilmis_veri_turu || dinamik?.tur || 'WebPage';

  return {
    baslik,
    aciklama,
    anahtarKelimeler: kayit?.anahtar_kelimeler || '',
    canonical,
    robotlar,
    sosyalBaslik: kayit?.sosyal_baslik || baslik,
    sosyalAciklama: kayit?.sosyal_aciklama || aciklama,
    sosyalGorsel: gorsel,
    dil,
    yapilandirilmisVeri: yapilandirilmisVeriOlustur({
      yol: temizYol, baslik, aciklama, canonical, gorsel, tur, genel, dinamik
    })
  };
}
