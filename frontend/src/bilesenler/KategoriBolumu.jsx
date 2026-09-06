import KategoriKarti from './KategoriKarti';
import { metinler } from '../metinler/tr';
import '../stiller/kategoriler.css';

export default function KategoriBolumu({ kategoriler }) {
  // Ana sayfanın sekizli kompozisyonunu korumak için API daha fazla kayıt döndürse de ilk yedi aktif kategori kullanılır.
  const vitrinKategorileri = kategoriler.slice(0, 7);

  return (
    <section className="kategori-bolumu" aria-labelledby="kategori-basligi">
      <div className="icerik-kapsayici">
        <div className="kategori-bolumu__baslik-satiri">
          <h2 id="kategori-basligi">{metinler.kategoriBasligi}</h2>
          <span aria-hidden="true" className="kategori-bolumu__teknik-cizgi" />
        </div>

        <div className="kategori-bolumu__grid">
          {vitrinKategorileri.map((kategori) => (
            <KategoriKarti key={kategori.id} kategori={kategori} />
          ))}
          <KategoriKarti kategori={{}} tumUrunler />
        </div>
      </div>
    </section>
  );
}

