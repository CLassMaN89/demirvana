import { Link } from 'react-router-dom';
import '../stiller/vana-vitrini.css';

export default function VanaVitrini({ kategoriler = [] }) {
  const vitrinKayitlari = kategoriler.slice(0, 7);

  if (vitrinKayitlari.length === 0) return null;

  return (
    <section className="vana-vitrini" aria-label="Vana ürün vitrini">
      <div className="vana-vitrini__maske">
        {/* Aynı veri dizisi yalnızca kesintisiz hareket için iki kez çizilir; içerik yönetiminde tek kayıt korunur. */}
        <div className="vana-vitrini__serit">
          {[0, 1].map((kopya) => (
            <div className="vana-vitrini__grup" key={kopya} aria-hidden={kopya === 1 ? 'true' : undefined}>
              {vitrinKayitlari.map((kategori) => (
                <Link className="vana-vitrini__kart" to={`/kategoriler/${kategori.slug}`} key={`${kopya}-${kategori.id}`} tabIndex={kopya === 1 ? -1 : undefined}>
                  <img src={kategori.gorsel_yolu} alt={kopya === 0 ? kategori.alternatif_metin : ''} loading="lazy" />
                  <span className="vana-vitrini__bilgi">
                    <strong>{kategori.ad}</strong>
                    <i aria-hidden="true">↗</i>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
