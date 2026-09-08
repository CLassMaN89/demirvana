import { Link } from 'react-router-dom';
import '../stiller/vana-vitrini.css';

export default function VanaVitrini({ kategoriler = [], siteAyarlari = {} }) {
  const vitrinKayitlari = kategoriler.slice(0, 7);

  if (vitrinKayitlari.length === 0) return null;

  const baslik = siteAyarlari.vana_vitrini_basligi || 'Akışın Her Noktasına Güvenilir Çözümler';
  const aciklama = siteAyarlari.vana_vitrini_aciklamasi || 'Farklı tesis ihtiyaçları için geliştirdiğimiz vana gruplarını yakından inceleyin.';

  return (
    <section className="vana-vitrini" aria-labelledby="vana-vitrini-basligi">
      <div className="icerik-kapsayici vana-vitrini__ust">
        <span className="vana-vitrini__etiket">{siteAyarlari.vana_vitrini_etiketi || 'DEMİRVANA ÜRÜNLERİ'}</span>
        <h2 id="vana-vitrini-basligi">{baslik}</h2>
        <p>{aciklama}</p>
      </div>

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
                    <small>{kategori.aciklama || siteAyarlari.kategori_kart_varsayilan_alt_metni || 'Endüstriyel vana çözümleri'}</small>
                    <i aria-hidden="true">↗</i>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="icerik-kapsayici vana-vitrini__alt">
        <p>{siteAyarlari.vana_vitrini_alt_metni || 'Projeniz için doğru vana çözümünü birlikte belirleyelim.'}</p>
        <Link to={siteAyarlari.vana_vitrini_buton_baglantisi || '/iletisim'}>
          {siteAyarlari.vana_vitrini_buton_metni || 'Teknik destek alın'} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
