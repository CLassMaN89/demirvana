import { Link, useParams } from 'react-router-dom';
import DurumMesaji from '../bilesenler/DurumMesaji';

export default function KategoriSayfasi({ kategoriler }) {
  const { slug } = useParams();
  const kategori = kategoriler.find((kayit) => kayit.slug === slug);

  if (!kategori) {
    return (
      <DurumMesaji
        baslik="Kategori bulunamadı"
        aciklama="Aradığınız kategori kaldırılmış veya adresi değişmiş olabilir."
        eylem={<Link to="/urunler">Ürün kataloğuna dön</Link>}
      />
    );
  }

  return (
    <section className="alt-sayfa icerik-kapsayici">
      <header className="alt-sayfa__baslik">
        <h1>{kategori.ad}</h1>
        <p>Bu kategorideki ürünler yönetim panelinden eklendiğinde burada listelenecek.</p>
      </header>
    </section>
  );
}

