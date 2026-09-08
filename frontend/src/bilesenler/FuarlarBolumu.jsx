import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../stiller/fuarlar.css';

function FuarSutunu({ gorseller, ters = false }) {
  return (
    <div className="fuarlar-bolumu__sutun">
      <div className={`fuarlar-bolumu__akis${ters ? ' fuarlar-bolumu__akis--ters' : ''}`}>
        {[0, 1].map((kopya) => (
          <div className="fuarlar-bolumu__grup" key={kopya} aria-hidden={kopya === 1 ? 'true' : undefined}>
            {gorseller.map((gorsel) => (
              <figure key={`${kopya}-${gorsel.id}`}>
                <img src={gorsel.gorsel_yolu} alt={kopya === 0 ? gorsel.alternatif_metin : ''} loading="lazy" />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FuarlarBolumu({ fuarlar = [], siteAyarlari = {} }) {
  if (fuarlar.length === 0 || siteAyarlari.fuarlar_aktif_mi === '0') return null;

  const ortaNokta = Math.ceil(fuarlar.length / 2);
  const ilkSutun = fuarlar.slice(0, ortaNokta);
  const ikinciSutun = fuarlar.slice(ortaNokta);

  return (
    <section className="fuarlar-bolumu" aria-labelledby="fuarlar-basligi">
      <div className="icerik-kapsayici fuarlar-bolumu__yerlesim">
        <header className="fuarlar-bolumu__metin">
          <span>{siteAyarlari.fuarlar_etiketi || 'SEKTÖREL BULUŞMALAR'}</span>
          <h2 id="fuarlar-basligi">{siteAyarlari.fuarlar_basligi || 'Fuarlar'}</h2>
          <p>{siteAyarlari.fuarlar_aciklamasi || 'Sektör profesyonelleriyle buluştuğumuz fuarlardan ve ürün tanıtımlarımızdan kareler.'}</p>
          <Link to={siteAyarlari.fuarlar_buton_baglantisi || '/iletisim'}>
            {siteAyarlari.fuarlar_buton_metni || 'Fuar programı için iletişime geçin'}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </header>

        {/* İki ters yönlü sütun prompttaki hareketi korur; görsellerin tamamı veri katmanından gelir. */}
        <div className="fuarlar-bolumu__galeri" aria-label="Fuar fotoğrafları">
          <FuarSutunu gorseller={ilkSutun} />
          <FuarSutunu gorseller={ikinciSutun.length > 0 ? ikinciSutun : ilkSutun} ters />
        </div>
      </div>
    </section>
  );
}
