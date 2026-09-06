import { Link, useParams } from 'react-router-dom';
import DurumMesaji from '../bilesenler/DurumMesaji';

export default function UrunDetaySayfasi({ urunler = [] }) {
  const { slug } = useParams();
  const urun = urunler.find((kayit) => kayit.slug === slug);

  if (!urun) {
    return (
      <DurumMesaji
        baslik="Ürün bulunamadı"
        aciklama="Ürün bilgisi henüz eklenmemiş veya adresi değişmiş olabilir."
        eylem={<Link to="/urunler">Ürün kataloğuna dön</Link>}
      />
    );
  }

  return (
    <article className="alt-sayfa icerik-kapsayici">
      <header className="alt-sayfa__baslik">
        <h1>{urun.ad}</h1>
        <p>{urun.kisa_aciklama}</p>
      </header>
    </article>
  );
}

