import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { metinler } from '../metinler/tr';
import '../stiller/header.css';

export default function Header({ menu, logoYolu }) {
  const [menuAcik, setMenuAcik] = useState(false);
  const konum = useLocation();

  useEffect(() => {
    setMenuAcik(false);
  }, [konum.pathname]);

  return (
    <header className="site-header">
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
          id="ana-menu"
          className={`site-header__nav${menuAcik ? ' site-header__nav--acik' : ''}`}
          aria-label="Ana menü"
        >
          {menu.map((oge) => (
            <NavLink
              key={oge.id}
              to={oge.baglanti}
              className={({ isActive }) =>
                `site-header__baglanti${isActive ? ' site-header__baglanti--aktif' : ''}`
              }
            >
              {oge.baslik}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

