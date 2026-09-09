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

function SpriteIkon({ kaynak, sinifAdi }) {
  const ikonAdi = ['guven', 'muhendislik', 'surdulebilir', 'telefon', 'eposta', 'konum', 'saat', 'baglanti', 'urun', 'linkedin', 'youtube', 'instagram']
    .find((ad) => sinifAdi.includes(`--${ad}`));

  if (!ikonAdi) return <i className={`site-footer__sprite ${sinifAdi}`} aria-hidden="true" />;

  return <img className={`site-footer__sprite ${sinifAdi}`} src={`${kaynak}/${ikonAdi}-clean.png`} alt="" aria-hidden="true" />;
}

export default function Footer({ siteAyarlari = {}, menu = [], kategoriler = [] }) {
  if (!ayarAcikMi(siteAyarlari.footer_aktif_mi)) return null;

  const yil = new Date().getFullYear();
  const telifMetni = (siteAyarlari.footer_telif_metni ?? '© {yil} Demirvana.')
    .replace('{yil}', String(yil));
  // Pafta görseli yerine alfa kanallı ikon setleri kullanılır; böylece koyu zeminde beyaz kutu oluşmaz.
  const footerIkonDizini = siteAyarlari.footer_ikon_dizini ?? '/assets/footer-icons';
  const footerIletisimIkonYolu = footerIkonDizini;
  const footerKurumsalIkonYolu = footerIkonDizini;
  const footerSosyalIkonYolu = footerIkonDizini;
  const sosyalBaglantilar = [
    { ad: 'LinkedIn', baglanti: siteAyarlari.footer_linkedin_baglantisi ?? 'https://www.linkedin.com', sinif: 'site-footer__sosyal-ikon site-footer__sosyal-ikon--linkedin' },
    { ad: 'YouTube', baglanti: siteAyarlari.footer_youtube_baglantisi ?? 'https://www.youtube.com', sinif: 'site-footer__sosyal-ikon site-footer__sosyal-ikon--youtube' },
    { ad: 'Instagram', baglanti: siteAyarlari.footer_instagram_baglantisi ?? 'https://www.instagram.com', sinif: 'site-footer__sosyal-ikon site-footer__sosyal-ikon--instagram' }
  ].filter((oge) => oge.baglanti);

  return (
    <footer className="site-footer">
      <div className="site-footer__teknik-cizimler">
        <img
          className="site-footer__teknik-cizim site-footer__teknik-cizim--ana"
          src={siteAyarlari.footer_teknik_cizim_yolu ?? '/assets/footer-vana2.png'}
          alt="Teknik vana ana görünüşü"
        />
        <img
          className="site-footer__teknik-cizim site-footer__teknik-cizim--yan"
          src={siteAyarlari.footer_teknik_cizim_ikincil_yolu ?? '/assets/footer-vana.png'}
          alt="Teknik vana yan görünüşü"
        />
        <img
          className="site-footer__teknik-cizim site-footer__teknik-cizim--detay"
          src={siteAyarlari.footer_teknik_cizim_detay_yolu ?? '/assets/footer-vana3.png'}
          alt="Teknik vana detay görünüşü"
        />
      </div>
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
            <span><SpriteIkon kaynak={footerKurumsalIkonYolu} sinifAdi="site-footer__guven-ikon site-footer__guven-ikon--guven" /><small>Güvenilir<br />Çözümler</small></span>
            <span><SpriteIkon kaynak={footerKurumsalIkonYolu} sinifAdi="site-footer__guven-ikon site-footer__guven-ikon--muhendislik" /><small>Mühendislik<br />Desteği</small></span>
            <span><SpriteIkon kaynak={footerKurumsalIkonYolu} sinifAdi="site-footer__guven-ikon site-footer__guven-ikon--surdulebilir" /><small>Sürdürülebilir<br />Endüstri</small></span>
          </div>
          <Link className="site-footer__iletisim" to={siteAyarlari.footer_iletisim_buton_baglantisi ?? '/iletisim'}>
            <SpriteIkon kaynak={footerIletisimIkonYolu} sinifAdi="site-footer__iletisim-ikon site-footer__iletisim-ikon--eposta" />
            <span>{siteAyarlari.footer_iletisim_buton_metni ?? 'Bizimle iletişime geçin'}</span>
            <SpriteIkon kaynak={footerSosyalIkonYolu} sinifAdi="site-footer__ok-ikon site-footer__ok-ikon--sag" />
          </Link>
        </section>
        ) : null}

        {ayarAcikMi(siteAyarlari.footer_hizli_baglantilar_aktif_mi) ? (
        <nav
          className="site-footer__sutun"
          aria-label="Footer hızlı bağlantılar"
          style={{ order: siraDegeri(siteAyarlari.footer_hizli_baglantilar_sirasi, 2) }}
        >
          <h2><SpriteIkon kaynak={footerKurumsalIkonYolu} sinifAdi="site-footer__baslik-ikon site-footer__baslik-ikon--baglanti" />{siteAyarlari.footer_hizli_baglantilar_basligi ?? 'Hızlı Bağlantılar'}</h2>
          <ul>
            {menu.map((oge) => (
              <li key={oge.id}><Link to={oge.baglanti}><span>{oge.baslik}</span><SpriteIkon kaynak={footerSosyalIkonYolu} sinifAdi="site-footer__ok-ikon site-footer__ok-ikon--sag" /></Link></li>
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
          <h2><SpriteIkon kaynak={footerKurumsalIkonYolu} sinifAdi="site-footer__baslik-ikon site-footer__baslik-ikon--urun" />{siteAyarlari.footer_urunler_basligi ?? 'Ürün Grupları'}</h2>
          <ul>
            {kategoriler.map((kategori) => (
              <li key={kategori.id}>
                <Link to={`/kategoriler/${kategori.slug}`}><span>{kategori.ad}</span><SpriteIkon kaynak={footerSosyalIkonYolu} sinifAdi="site-footer__ok-ikon site-footer__ok-ikon--sag" /></Link>
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
          <h2 id="footer-destek-basligi"><SpriteIkon kaynak={footerIletisimIkonYolu} sinifAdi="site-footer__baslik-ikon site-footer__iletisim-ikon--telefon" />{siteAyarlari.footer_destek_basligi ?? 'Destek & İletişim'}</h2>
          <address>
            {siteAyarlari.destek_telefonu ? (
              <a href={telefonBaglantisiOlustur(siteAyarlari.destek_telefonu)}>
                <SpriteIkon kaynak={footerIletisimIkonYolu} sinifAdi="site-footer__iletisim-ikon site-footer__iletisim-ikon--telefon" />
                <span>{siteAyarlari.destek_telefonu}</span>
              </a>
            ) : null}
            {siteAyarlari.destek_eposta ? (
              <a href={`mailto:${siteAyarlari.destek_eposta}`}>
                <SpriteIkon kaynak={footerIletisimIkonYolu} sinifAdi="site-footer__iletisim-ikon site-footer__iletisim-ikon--eposta" />
                <span>{siteAyarlari.destek_eposta}</span>
              </a>
            ) : null}
            {siteAyarlari.firma_adresi ? (
              <p><SpriteIkon kaynak={footerIletisimIkonYolu} sinifAdi="site-footer__iletisim-ikon site-footer__iletisim-ikon--konum" /><span>{siteAyarlari.firma_adresi}</span></p>
            ) : null}
          </address>
          <div className="site-footer__mesai">
            <SpriteIkon kaynak={footerIletisimIkonYolu} sinifAdi="site-footer__iletisim-ikon site-footer__iletisim-ikon--saat" />
            <span><strong>Çalışma Saatleri</strong>{siteAyarlari.footer_calisma_saatleri ?? 'Pzt - Cum 08:00 - 18:00'}</span>
          </div>
        </section>
        ) : null}
      </div>

      <div className="site-footer__alt">
        <div className="site-footer__alt-ic icerik-kapsayici">
          <div className="site-footer__sosyal">
            <span>{siteAyarlari.footer_sosyal_basligi ?? 'Bizi takip edin'}</span>
            {sosyalBaglantilar.map(({ ad, baglanti, sinif }) => (
              <a key={ad} href={baglanti} target="_blank" rel="noreferrer" aria-label={ad}><SpriteIkon kaynak={footerSosyalIkonYolu} sinifAdi={sinif} /></a>
            ))}
          </div>
          <p>{telifMetni}</p>
          <div className="site-footer__slogan">
            <i aria-hidden="true"><span /><span /><span /></i>
            <span>{siteAyarlari.footer_slogan_metni ?? 'Endüstrinin her noktasında, daha güvenli bir akış için.'}</span>
          </div>
          <button type="button" aria-label="Sayfanın başına dön" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <SpriteIkon kaynak={footerSosyalIkonYolu} sinifAdi="site-footer__ok-ikon site-footer__ok-ikon--yukari" />
          </button>
        </div>
      </div>
    </footer>
  );
}
