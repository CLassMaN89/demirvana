const ICERIKLER = {
  hakkimizda: {
    baslik: 'Hakkımızda',
    aciklama: 'Demirvana’nın üretim yaklaşımı ve kurumsal bilgileri bu alandan yönetilecek.'
  },
  uretim: {
    baslik: 'Üretim',
    aciklama: 'Üretim kabiliyetleri, kalite süreçleri ve tesis bilgileri bu alanda yayınlanacak.'
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

