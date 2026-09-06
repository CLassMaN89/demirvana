import { Link } from 'react-router-dom';

export default function KategoriKarti({ kategori, tumUrunler = false }) {
  const baglanti = tumUrunler ? '/urunler' : `/kategoriler/${kategori.slug}`;

  return (
    <Link
      className={`kategori-karti${tumUrunler ? ' kategori-karti--tum' : ''}`}
      to={baglanti}
      data-testid="kategori-karti"
      aria-label={tumUrunler ? 'Tüm Ürünler' : kategori.ad}
    >
      {!tumUrunler && (
        <div className="kategori-karti__gorsel-alani">
          <img
            src={kategori.gorsel_yolu}
            alt={kategori.alternatif_metin}
            loading="lazy"
          />
        </div>
      )}

      {tumUrunler && (
        <span className="kategori-karti__noktalar" aria-hidden="true">•••</span>
      )}

      <div className="kategori-karti__alt">
        <span>{tumUrunler ? 'Tüm Ürünler' : kategori.ad}</span>
        <span className="kategori-karti__ok" aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
