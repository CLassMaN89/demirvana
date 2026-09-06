import Header from './Header';

export default function SayfaIskeleti({ menu, children }) {
  return (
    <>
      <Header menu={menu} logoYolu="/assets/logo.png" />
      <main id="ana-icerik">{children}</main>
    </>
  );
}

