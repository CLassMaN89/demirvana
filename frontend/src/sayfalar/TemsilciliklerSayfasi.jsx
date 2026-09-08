import { ArrowRight, Box, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../stiller/temsilcilikler.css';

export default function TemsilciliklerSayfasi({ temsilcilikler = [], siteAyarlari = {} }) {
  const ayar = (anahtar, yedek) => siteAyarlari[anahtar] || yedek;

  return (
    <article className="temsilcilikler-sayfasi">
      <header className="temsilcilikler-hero">
        <div className="icerik-kapsayici">
          <h1>{ayar('temsilcilik_hero_basligi', 'Temsilcilikler')}</h1>
          <p>{ayar('temsilcilik_hero_aciklamasi', 'Dünya çapında kalite ve güvenilirliğiyle öne çıkan markalarla, endüstriyel tesisler için güvenilir çözüm ortaklıkları sunuyoruz.')}</p>
        </div>
      </header>

      <section className="temsilcilik-listesi icerik-kapsayici" aria-label="Temsilcilik markaları">
        {temsilcilikler.map((marka, indeks) => (
          <article className="temsilcilik-karti" key={marka.id} style={{ '--kart-gecikmesi': `${indeks * 90}ms` }}>
            <div className="temsilcilik-karti__logo">
              {marka.logo_yolu ? <img src={marka.logo_yolu} alt={marka.logo_alternatif_metin || marka.marka_adi} /> : <strong>{marka.marka_adi}</strong>}
              {marka.logo_alt_metni ? <small>{marka.logo_alt_metni}</small> : null}
            </div>
            <div className="temsilcilik-karti__icerik">
              <h2>{marka.baslik}</h2>
              <span className="temsilcilik-karti__grup">{marka.urun_grubu}</span>
              <div className="temsilcilik-karti__etiketler">
                {(marka.etiketler || '').split(',').filter(Boolean).map((etiket) => <span key={etiket}>{etiket.trim()}</span>)}
              </div>
              <p>{marka.aciklama}</p>
              <div className="temsilcilik-karti__eylemler">
                <Link to={marka.urun_baglantisi || '/urunler'}><Box size={17} aria-hidden="true" />{marka.urun_buton_metni || 'Marka ürünleri'} <ArrowRight size={16} aria-hidden="true" /></Link>
                {marka.katalog_baglantisi ? <Link className="ikincil" to={marka.katalog_baglantisi}><FileText size={17} aria-hidden="true" />{marka.katalog_buton_metni || 'Katalog talep et'} <ArrowRight size={16} aria-hidden="true" /></Link> : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </article>
  );
}
