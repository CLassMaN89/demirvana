import Header from './Header';
import Footer from './Footer';
import YuzenWhatsapp from './YuzenWhatsapp';

export default function SayfaIskeleti({ menu, kategoriler = [], siteAyarlari = {}, aramaKaynaklari, children }) {
  return (
    <div className="site-uygulama">
      <Header menu={menu} logoYolu={siteAyarlari.logo_yolu ?? '/assets/logo.png'} aramaKaynaklari={aramaKaynaklari} />
      <main id="ana-icerik">{children}</main>
      <Footer siteAyarlari={siteAyarlari} menu={menu} kategoriler={kategoriler} />
      <YuzenWhatsapp siteAyarlari={siteAyarlari} />
    </div>
  );
}
