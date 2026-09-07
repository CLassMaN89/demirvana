import Header from './Header';

export default function SayfaIskeleti({ menu, aramaKaynaklari, children }) {
  return (
    <>
      <Header menu={menu} logoYolu="/assets/logo.png" aramaKaynaklari={aramaKaynaklari} />
      <main id="ana-icerik">{children}</main>
    </>
  );
}
