import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { metinler } from '../metinler/tr';
import '../stiller/header.css';

export default function Header({ menu, logoYolu }) {
  const [menuAcik, setMenuAcik] = useState(false);
  const [acikMenuId, setAcikMenuId] = useState(null);
  const [acikAltMenuId, setAcikAltMenuId] = useState(null);
  const [vurgu, setVurgu] = useState(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const konum = useLocation();

  useEffect(() => {
    // Yeni sayfaya geçildiğinde mobil paneli kapatarak açık menünün içeriği örtmesini önleriz.
    setMenuAcik(false);
    setAcikMenuId(null);
    setAcikAltMenuId(null);
  }, [konum.pathname]);

  useEffect(() => {
    const disTiklamayiKapat = (olay) => {
      if (headerRef.current && !headerRef.current.contains(olay.target)) {
        setAcikMenuId(null);
        setAcikAltMenuId(null);
      }
    };

    document.addEventListener('pointerdown', disTiklamayiKapat);
    return () => document.removeEventListener('pointerdown', disTiklamayiKapat);
  }, []);

  const vurguyuTasi = (hedef) => {
    const nav = navRef.current;
    if (!nav || !hedef) return;
    const navKutusu = nav.getBoundingClientRect();
    const hedefKutusu = hedef.getBoundingClientRect();
    setVurgu({ sol: hedefKutusu.left - navKutusu.left, genislik: hedefKutusu.width });
  };

  const altMenusuOlanOgeyiAc = (oge) => {
    setAcikMenuId(oge.id);
    // İlk iç grubu önden seçmek, masaüstünde Vana kategorilerinin boş panel olmadan açılmasını sağlar.
    setAcikAltMenuId(oge.alt_ogeler.find((altOge) => altOge.alt_ogeler?.length)?.id ?? null);
  };

  const menuleriKapat = () => {
    setAcikMenuId(null);
    setAcikAltMenuId(null);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__ic icerik-kapsayici">
        <NavLink className="site-header__logo" to="/" aria-label={`${metinler.siteAdi} ana sayfa`}>
          <img src={logoYolu} alt={metinler.siteAdi} />
        </NavLink>

        <button
          className="site-header__menu-dugmesi"
          type="button"
          aria-expanded={menuAcik}
          aria-controls="ana-menu"
          aria-label={menuAcik ? metinler.menuKapat : metinler.menuAc}
          onClick={() => setMenuAcik((acik) => !acik)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          ref={navRef}
          id="ana-menu"
          className={`site-header__nav${menuAcik ? ' site-header__nav--acik' : ''}`}
          aria-label="Ana menü"
          onPointerLeave={() => {
            setVurgu(null);
            menuleriKapat();
          }}
          onBlur={(olay) => {
            if (!olay.currentTarget.contains(olay.relatedTarget)) menuleriKapat();
          }}
          onKeyDown={(olay) => {
            if (olay.key === 'Escape') {
              menuleriKapat();
              olay.stopPropagation();
            }
          }}
        >
          <span
            className={`site-header__vurgu${vurgu ? ' site-header__vurgu--gorunur' : ''}`}
            style={vurgu ? { width: vurgu.genislik, transform: `translateX(${vurgu.sol}px)` } : undefined}
            aria-hidden="true"
          />

          {menu.map((oge) => {
            const altOgeler = oge.alt_ogeler ?? [];
            const altMenuVar = altOgeler.length > 0;
            const acik = acikMenuId === oge.id;
            const seciliAltOge = altOgeler.find((altOge) => altOge.id === acikAltMenuId);

            return (
              <div
                className={`site-header__oge${altMenuVar ? ' site-header__oge--alt-menulu' : ''}`}
                key={oge.id}
                onPointerEnter={(olay) => {
                  vurguyuTasi(olay.currentTarget.querySelector('.site-header__baglanti'));
                  if (altMenuVar && olay.pointerType !== 'touch') altMenusuOlanOgeyiAc(oge);
                }}
              >
                {altMenuVar ? (
                  <button
                    className={`site-header__baglanti${acik ? ' site-header__baglanti--acik' : ''}`}
                    type="button"
                    aria-expanded={acik}
                    aria-controls={`alt-menu-${oge.id}`}
                    aria-label={`${oge.baslik} alt menüsünü ${acik ? 'kapat' : 'aç'}`}
                    onFocus={(olay) => vurguyuTasi(olay.currentTarget)}
                    onClick={() => {
                      // Masaüstünde hover ile açılmış panel tıklanınca kapanmaz; dokunmatik düzende aynı düğme aç/kapatır.
                      const dokunmatikDuzen = window.matchMedia?.('(hover: none)').matches;
                      if (dokunmatikDuzen && acik) menuleriKapat();
                      else altMenusuOlanOgeyiAc(oge);
                    }}
                  >
                    <span>{oge.baslik}</span>
                    <span className="site-header__asagi-ok" aria-hidden="true" />
                  </button>
                ) : (
                  <NavLink
                    to={oge.baglanti}
                    className={({ isActive }) =>
                      `site-header__baglanti${isActive ? ' site-header__baglanti--aktif' : ''}`
                    }
                    onFocus={(olay) => vurguyuTasi(olay.currentTarget)}
                  >
                    {oge.baslik}
                  </NavLink>
                )}

                {altMenuVar && acik && (
                  <div className="site-header__mega-menu" id={`alt-menu-${oge.id}`}>
                    <div className="site-header__mega-ic">
                      <div className="site-header__ana-alt-menu" aria-label={`${oge.baslik} grupları`}>
                        {altOgeler.map((altOge) => {
                          const ucuncuSeviyeVar = (altOge.alt_ogeler?.length ?? 0) > 0;
                          const altAcik = acikAltMenuId === altOge.id;

                          if (!ucuncuSeviyeVar) {
                            return (
                              <Link className="site-header__alt-baglanti" key={altOge.id} to={altOge.baglanti}>
                                {altOge.baslik}<span aria-hidden="true">↗</span>
                              </Link>
                            );
                          }

                          return (
                            <button
                              className={`site-header__alt-baglanti${altAcik ? ' site-header__alt-baglanti--aktif' : ''}`}
                              key={altOge.id}
                              type="button"
                              aria-expanded={altAcik}
                              aria-controls={`ucuncu-menu-${altOge.id}`}
                              aria-label={`${altOge.baslik} alt menüsünü ${altAcik ? 'kapat' : 'aç'}`}
                              onPointerEnter={() => setAcikAltMenuId(altOge.id)}
                              onClick={() => setAcikAltMenuId(altAcik ? null : altOge.id)}
                            >
                              {altOge.baslik}<span aria-hidden="true">→</span>
                            </button>
                          );
                        })}
                      </div>

                      {seciliAltOge?.alt_ogeler?.length > 0 && (
                        <div
                          className="site-header__vana-menusu"
                          id={`ucuncu-menu-${seciliAltOge.id}`}
                          aria-label={`${seciliAltOge.baslik} kategorileri`}
                        >
                          {seciliAltOge.alt_ogeler.map((kategori) => (
                            <Link className="site-header__vana-baglanti" key={kategori.id} to={kategori.baglanti}>
                              <span>{kategori.baslik}</span><span aria-hidden="true">↗</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Link className="site-header__teklif" to="/iletisim">
          Teklif Al
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
