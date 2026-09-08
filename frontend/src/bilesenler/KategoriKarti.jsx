import { Link } from 'react-router-dom';

export default function KategoriKarti({ kategori, tumUrunler = false, varsayilanAltMetin = 'Endüstriyel vana çözümleri', tumUrunlerAltMetni = 'Ürün kataloğu' }) {
  const baglanti = tumUrunler ? '/urunler' : `/kategoriler/${kategori.slug}`;
  const baslik = tumUrunler ? 'Tüm Ürünler' : kategori.ad;
  const altMetin = tumUrunler ? tumUrunlerAltMetni : (kategori.aciklama || varsayilanAltMetin);

  return (
    <Link
      className={`kategori-karti${tumUrunler ? ' kategori-karti--tum' : ''}`}
      to={baglanti}
      data-testid="kategori-karti"
      aria-label={baslik}
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
        <span className="kategori-karti__noktalar" aria-hidden="true"><i /><i /><i /></span>
      )}

      {/* Koyu alt geçiş, değişken ürün fotoğrafları üzerinde metnin her zaman okunabilmesini sağlar. */}
      <div className="kategori-karti__alt">
        <span className="kategori-karti__metin">
          <small>{altMetin}</small>
          <strong>{baslik}</strong>
        </span>
        <span className="kategori-karti__ok" aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
