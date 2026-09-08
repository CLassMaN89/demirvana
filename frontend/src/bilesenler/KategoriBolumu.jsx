import KategoriKarti from './KategoriKarti';
import { Link } from 'react-router-dom';
import { metinler } from '../metinler/tr';
import '../stiller/kategoriler.css';

export default function KategoriBolumu({ kategoriler, siteAyarlari = {} }) {
  // Ana sayfanın sekizli kompozisyonunu korumak için API daha fazla kayıt döndürse de ilk yedi aktif kategori kullanılır.
  const vitrinKategorileri = kategoriler.slice(0, 7);

  // Bölüm silinmez; admin ayarı yeniden 1 yapıldığında bütün içeriğiyle anında geri açılır.
  if (siteAyarlari.kategori_bolumu_aktif_mi === '0') return null;

  return (
    <section className="kategori-bolumu" aria-labelledby="kategori-basligi">
      <div className="icerik-kapsayici">
        <div className="kategori-bolumu__baslik-satiri">
          <h2 id="kategori-basligi">{metinler.kategoriBasligi}</h2>
          <Link className="kategori-bolumu__tum-baglanti" to="/urunler">
            Tüm ürünleri gör <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="kategori-bolumu__grid">
          {vitrinKategorileri.map((kategori) => (
            <KategoriKarti key={kategori.id} kategori={kategori} varsayilanAltMetin={siteAyarlari.kategori_kart_varsayilan_alt_metni} />
          ))}
          <KategoriKarti kategori={{}} tumUrunler tumUrunlerAltMetni={siteAyarlari.kategori_tum_urunler_alt_metni} />
        </div>
      </div>
    </section>
  );
}
