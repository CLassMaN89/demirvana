import KategoriKarti from '../bilesenler/KategoriKarti';

export default function UrunlerSayfasi({ kategoriler }) {
  return (
    <section className="alt-sayfa icerik-kapsayici">
      <header className="alt-sayfa__baslik">
        <h1>Ürün kataloğu</h1>
        <p>Uygulamanıza uygun vana ve akış kontrol ürün grubunu seçin.</p>
      </header>
      <div className="kategori-bolumu__grid">
        {kategoriler.map((kategori) => (
          <KategoriKarti key={kategori.id} kategori={kategori} />
        ))}
      </div>
    </section>
  );
}

