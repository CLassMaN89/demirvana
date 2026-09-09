import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Box,
  Clock3,
  Link2,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const sosyalBaglantilar = [
    { ad: 'LinkedIn', baglanti: siteAyarlari.footer_linkedin_baglantisi ?? 'https://www.linkedin.com', ikon: faLinkedinIn },
    { ad: 'YouTube', baglanti: siteAyarlari.footer_youtube_baglantisi ?? 'https://www.youtube.com', ikon: faYoutube },
    { ad: 'Instagram', baglanti: siteAyarlari.footer_instagram_baglantisi ?? 'https://www.instagram.com', ikon: faInstagram }
  ].filter((oge) => oge.baglanti);

  return (
    <footer className="site-footer">
      <img
        className="site-footer__teknik-cizim"
        src={siteAyarlari.footer_teknik_cizim_yolu ?? '/assets/footer/teknik-vana-cizimi.svg'}
        alt="Teknik vana çizimi"
      />
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
          <div className="site-footer__guvenler" aria-label="Demirvana hizmet değerleri">
            <span><ShieldCheck aria-hidden="true" /><small>Güvenilir<br />Çözümler</small></span>
            <span><Settings aria-hidden="true" /><small>Mühendislik<br />Desteği</small></span>
            <span><BarChart3 aria-hidden="true" /><small>Sürdürülebilir<br />Endüstri</small></span>
          </div>
          <Link className="site-footer__iletisim" to={siteAyarlari.footer_iletisim_buton_baglantisi ?? '/iletisim'}>
            <Mail aria-hidden="true" />
            <span>{siteAyarlari.footer_iletisim_buton_metni ?? 'Bizimle iletişime geçin'}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
        ) : null}

        {ayarAcikMi(siteAyarlari.footer_hizli_baglantilar_aktif_mi) ? (
        <nav
          className="site-footer__sutun"
          aria-label="Footer hızlı bağlantılar"
          style={{ order: siraDegeri(siteAyarlari.footer_hizli_baglantilar_sirasi, 2) }}
        >
          <h2><Link2 aria-hidden="true" />{siteAyarlari.footer_hizli_baglantilar_basligi ?? 'Hızlı Bağlantılar'}</h2>
          <ul>
            {menu.map((oge) => (
              <li key={oge.id}><Link to={oge.baglanti}><span>{oge.baslik}</span><ArrowRight aria-hidden="true" /></Link></li>
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
          <h2><Box aria-hidden="true" />{siteAyarlari.footer_urunler_basligi ?? 'Ürün Grupları'}</h2>
          <ul>
            {kategoriler.map((kategori) => (
              <li key={kategori.id}>
                <Link to={`/kategoriler/${kategori.slug}`}><span>{kategori.ad}</span><ArrowRight aria-hidden="true" /></Link>
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
          <h2 id="footer-destek-basligi"><Phone aria-hidden="true" />{siteAyarlari.footer_destek_basligi ?? 'Destek & İletişim'}</h2>
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
          <div className="site-footer__mesai">
            <Clock3 aria-hidden="true" />
            <span><strong>Çalışma Saatleri</strong>{siteAyarlari.footer_calisma_saatleri ?? 'Pzt - Cum 08:00 - 18:00'}</span>
          </div>
        </section>
        ) : null}
      </div>

      <div className="site-footer__alt">
        <div className="site-footer__alt-ic icerik-kapsayici">
          <div className="site-footer__sosyal">
            <span>{siteAyarlari.footer_sosyal_basligi ?? 'Bizi takip edin'}</span>
            {sosyalBaglantilar.map(({ ad, baglanti, ikon }) => (
              <a key={ad} href={baglanti} target="_blank" rel="noreferrer" aria-label={ad}><FontAwesomeIcon icon={ikon} aria-hidden="true" /></a>
            ))}
          </div>
          <p>{telifMetni}</p>
          <div className="site-footer__slogan">
            <i aria-hidden="true"><span /><span /><span /></i>
            <span>{siteAyarlari.footer_slogan_metni ?? 'Endüstrinin her noktasında, daha güvenli bir akış için.'}</span>
          </div>
          <button type="button" aria-label="Sayfanın başına dön" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
