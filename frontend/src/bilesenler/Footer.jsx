import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../stiller/footer.css';

function telefonBaglantisiOlustur(telefon) {
  return `tel:${String(telefon ?? '').replace(/[^\d+]/g, '')}`;
}

function ayarAcikMi(deger) {
  return !['0', 0, false].includes(deger);
}

function siraDegeri(deger, varsayilan) {
  const sira = Number.parseInt(deger, 10);
  return Number.isFinite(sira) ? sira : varsayilan;
}

export default function Footer({ siteAyarlari = {}, menu = [], kategoriler = [] }) {
  if (!ayarAcikMi(siteAyarlari.footer_aktif_mi)) return null;

  const yil = new Date().getFullYear();
  const telifMetni = (siteAyarlari.footer_telif_metni ?? '© {yil} Demirvana.')
    .replace('{yil}', String(yil));

  return (
    <footer className="site-footer">
      <div className="site-footer__ic icerik-kapsayici">
        {ayarAcikMi(siteAyarlari.footer_marka_aktif_mi) ? (
        <section
          className="site-footer__marka"
          aria-label="Firma bilgileri"
          style={{ order: siraDegeri(siteAyarlari.footer_marka_sirasi, 1) }}
        >
          <Link className="site-footer__logo" to="/" aria-label={`${siteAyarlari.site_adi ?? 'Demirvana'} ana sayfa`}>
            <img src={siteAyarlari.logo_yolu ?? '/assets/logo.png'} alt={siteAyarlari.site_adi ?? 'Demirvana'} />
          </Link>
          <p>{siteAyarlari.footer_sirket_aciklamasi}</p>
        </section>
        ) : null}

        {ayarAcikMi(siteAyarlari.footer_hizli_baglantilar_aktif_mi) ? (
        <nav
          className="site-footer__sutun"
          aria-label="Footer hızlı bağlantılar"
          style={{ order: siraDegeri(siteAyarlari.footer_hizli_baglantilar_sirasi, 2) }}
        >
          <h2>{siteAyarlari.footer_hizli_baglantilar_basligi ?? 'Hızlı Bağlantılar'}</h2>
          <ul>
            {menu.map((oge) => (
              <li key={oge.id}><Link to={oge.baglanti}>{oge.baslik}</Link></li>
            ))}
          </ul>
        </nav>
        ) : null}

        {ayarAcikMi(siteAyarlari.footer_urunler_aktif_mi) ? (
        <nav
          className="site-footer__sutun"
          aria-label="Footer ürün grupları"
          style={{ order: siraDegeri(siteAyarlari.footer_urunler_sirasi, 3) }}
        >
          <h2>{siteAyarlari.footer_urunler_basligi ?? 'Ürün Grupları'}</h2>
          <ul>
            {kategoriler.map((kategori) => (
              <li key={kategori.id}>
                <Link to={`/kategoriler/${kategori.slug}`}>{kategori.ad}</Link>
              </li>
            ))}
          </ul>
        </nav>
        ) : null}

        {ayarAcikMi(siteAyarlari.footer_destek_aktif_mi) ? (
        <section
          className="site-footer__destek"
          aria-labelledby="footer-destek-basligi"
          style={{ order: siraDegeri(siteAyarlari.footer_destek_sirasi, 4) }}
        >
          <h2 id="footer-destek-basligi">{siteAyarlari.footer_destek_basligi ?? 'Destek & İletişim'}</h2>
          <address>
            {siteAyarlari.destek_telefonu ? (
              <a href={telefonBaglantisiOlustur(siteAyarlari.destek_telefonu)}>
                <Phone size={17} aria-hidden="true" />
                <span>{siteAyarlari.destek_telefonu}</span>
              </a>
            ) : null}
            {siteAyarlari.destek_eposta ? (
              <a href={`mailto:${siteAyarlari.destek_eposta}`}>
                <Mail size={17} aria-hidden="true" />
                <span>{siteAyarlari.destek_eposta}</span>
              </a>
            ) : null}
            {siteAyarlari.firma_adresi ? (
              <p><MapPin size={17} aria-hidden="true" /><span>{siteAyarlari.firma_adresi}</span></p>
            ) : null}
          </address>
          <Link className="site-footer__iletisim" to={siteAyarlari.footer_iletisim_buton_baglantisi ?? '/iletisim'}>
            {siteAyarlari.footer_iletisim_buton_metni ?? 'Bizimle iletişime geçin'}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
        ) : null}
      </div>

      <div className="site-footer__alt">
        <div className="icerik-kapsayici"><p>{telifMetni}</p></div>
      </div>
    </footer>
  );
}
