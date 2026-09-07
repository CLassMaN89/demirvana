const ICERIKLER = {
  kurumsal: {
    baslik: 'Kurumsal',
    aciklama: 'Demirvana’nın üretim yaklaşımı ve kurumsal bilgileri bu alandan yönetilecek.'
  },
  teknik: {
    baslik: 'Teknik',
    aciklama: 'Teknik dokümanlar, mühendislik bilgileri ve ürün destek içerikleri bu alanda yayınlanacak.'
  },
  referanslar: {
    baslik: 'Referanslar',
    aciklama: 'Tamamlanan projeler ve çözüm ortaklıkları bu alandan yönetilecek.'
  },
  sertifikalar: {
    baslik: 'Sertifikalar',
    aciklama: 'Kalite belgeleri ve ürün sertifikaları bu alandan yönetilecek.'
  },
  iletisim: {
    baslik: 'İletişim',
    aciklama: 'Teklif ve ürün talepleri için iletişim bilgileri bu alandan yönetilecek.'
  }
};

export default function IcerikSayfasi({ tur }) {
  const icerik = ICERIKLER[tur];

  return (
    <section className="alt-sayfa icerik-kapsayici">
      <header className="alt-sayfa__baslik">
        <h1>{icerik.baslik}</h1>
        <p>{icerik.aciklama}</p>
      </header>
    </section>
  );
}
