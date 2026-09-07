import Header from './Header';
import Footer from './Footer';

export default function SayfaIskeleti({ menu, kategoriler = [], siteAyarlari = {}, aramaKaynaklari, children }) {
  return (
    <>
      <Header menu={menu} logoYolu={siteAyarlari.logo_yolu ?? '/assets/logo.png'} aramaKaynaklari={aramaKaynaklari} />
      <main id="ana-icerik">{children}</main>
      <Footer siteAyarlari={siteAyarlari} menu={menu} kategoriler={kategoriler} />
    </>
  );
}
