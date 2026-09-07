function aramaIcinNormallestir(metin) {
  return String(metin ?? '').toLocaleLowerCase('tr-TR').trim();
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

  // Aynı başlık farklı veri kümelerinde yer alsa bile bağlantısı farklıysa gerçek bir ayrı sonuç olarak korunur.
  return sonuclar.filter((sonuc) => aramaIcinNormallestir(`${sonuc.baslik} ${sonuc.altMetin ?? ''}`).includes(aranan)).slice(0, 8);
}
