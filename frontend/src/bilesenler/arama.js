function aramaIcinNormallestir(metin) {
  return String(metin ?? '').toLocaleLowerCase('tr-TR').trim();
}

function kelimelereAyir(metin) {
  return aramaIcinNormallestir(metin).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function eslesmePuani(sonuc, aranan) {
  const baslik = aramaIcinNormallestir(sonuc.baslik);
  const altMetin = aramaIcinNormallestir(sonuc.altMetin);

  if (baslik === aranan) return 0;
  if (baslik.startsWith(aranan)) return 1;
  if (kelimelereAyir(baslik).some((kelime) => kelime.startsWith(aranan))) return 2;
  if (kelimelereAyir(altMetin).some((kelime) => kelime.startsWith(aranan))) return 3;

  // İki harfte metin ortası eşleşmesi çok gürültülü olduğundan yalnız daha uzun sorgularda kullanılır.
  if (aranan.length >= 3 && baslik.includes(aranan)) return 4;
  if (aranan.length >= 3 && altMetin.includes(aranan)) return 5;
  return null;
}

export function aramaSonuclariOlustur(menu, kaynaklar, sorgu) {
  const aranan = aramaIcinNormallestir(sorgu);
  if (aranan.length < 2) return [];

  const sonuclar = [
    ...menu.map((oge) => ({ id: `sayfa-${oge.id}`, baslik: oge.baslik, tur: 'Sayfa', baglanti: oge.baglanti })),
    ...(kaynaklar.kategoriler ?? []).map((oge) => ({ id: `kategori-${oge.id}`, baslik: oge.ad, tur: 'Ürün kategorisi', baglanti: `/kategoriler/${oge.slug}` })),
    ...(kaynaklar.urunler ?? []).map((oge) => ({ id: `urun-${oge.id}`, baslik: oge.ad, tur: 'Ürün', baglanti: `/urunler/${oge.slug}` })),
    ...(kaynaklar.referanslar?.kayitlar ?? []).map((oge) => ({ id: `referans-${oge.id}`, baslik: oge.baslik, altMetin: `${oge.konum} ${oge.kurum}`, tur: 'Referans', baglanti: `/referanslar#referans-${oge.id}` }))
  ];

  // En anlamlı eşleşmeler önce gösterilir; kısa liste dar navbar alanında okunabilirliği korur.
  return sonuclar
    .map((sonuc) => ({ sonuc, puan: eslesmePuani(sonuc, aranan) }))
    .filter(({ puan }) => puan !== null)
    .sort((a, b) => a.puan - b.puan || a.sonuc.baslik.localeCompare(b.sonuc.baslik, 'tr-TR'))
    .slice(0, 5)
    .map(({ sonuc }) => sonuc);
}
