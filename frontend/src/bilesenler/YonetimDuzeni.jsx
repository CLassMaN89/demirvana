import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Monitor, ListTree, FolderTree, Package, Cog, Sliders,
  FileText, Handshake, Award, Building2, Mail, Image, Search as SearchIcon,
  Users, Settings, Bell, ChevronRight, Zap
} from 'lucide-react';
import { VanaGrubuIkonu } from './UrunMenuIkonlari';
import '../stiller/yonetim.css';

// "yol" alanı olan öğeler gerçek bir sayfaya gider; olmayanlar dürüstçe "Yakında" rozetiyle işaretlenir
// (önceden hepsi sessizce Dashboard'a dönüyordu, bu da çalışıyormuş izlenimi veren kırık bir davranıştı).
const MENU_BOLUMLERI = [
  {
    baslik: null,
    ogeler: [
      { ad: 'Dashboard', ikon: LayoutDashboard, yol: '/admin' },
      { ad: 'Web Sitesini Önizle', ikon: Monitor, disLink: '/' }
    ]
  },
  {
    baslik: 'İçerik Yönetimi',
    ogeler: [
      { ad: 'Menü Yönetimi', ikon: ListTree },
      { ad: 'Kategori Yönetimi', ikon: FolderTree, yol: '/admin/kategoriler' },
      { ad: 'Ürün Yönetimi', ikon: Package }
    ]
  },
  {
    baslik: 'Ürün Grupları',
    ogeler: [
      { ad: 'Vana', ikon: VanaGrubuIkonu },
      { ad: 'Aktüatörler', ikon: Cog },
      { ad: 'Otomasyon', ikon: Sliders }
    ]
  },
  {
    baslik: 'Diğer Yönetim',
    ogeler: [
      { ad: 'Teknik Sayfalar', ikon: FileText },
      { ad: 'Referanslar', ikon: Handshake },
      { ad: 'Sertifikalar', ikon: Award },
      { ad: 'Temsilcilikler', ikon: Building2 },
      { ad: 'İletişim Formları', ikon: Mail },
      { ad: 'Medya Kütüphanesi', ikon: Image },
      { ad: 'SEO Ayarları', ikon: SearchIcon }
    ]
  },
  {
    baslik: 'Sistem',
    ogeler: [
      { ad: 'Kullanıcılar', ikon: Users },
      { ad: 'Genel Ayarlar', ikon: Settings }
    ]
  }
];

export default function YonetimDuzeni({ children }) {
  const konum = useLocation();

  return (
    <div className="yonetim">
      <aside className="yonetim__yan-menu">
        <Link className="yonetim__logo" to="/admin">
          <span className="yonetim__logo-metin">DemirVana</span>
          <span className="yonetim__logo-etiketi">Admin</span>
        </Link>

        <nav className="yonetim__nav">
          {MENU_BOLUMLERI.map((bolum, indeks) => (
            <div className="yonetim__nav-bolumu" key={bolum.baslik ?? `bolum-${indeks}`}>
              {bolum.baslik && <span className="yonetim__nav-baslik">{bolum.baslik}</span>}
              {bolum.ogeler.map((oge) => {
                const Ikon = oge.ikon;

                if (oge.disLink) {
                  return (
                    <a className="yonetim__nav-baglanti" href={oge.disLink} target="_blank" rel="noopener noreferrer" key={oge.ad}>
                      <Ikon aria-hidden="true" /><span>{oge.ad}</span>
                    </a>
                  );
                }

                if (!oge.yol) {
                  return (
                    <span className="yonetim__nav-baglanti yonetim__nav-baglanti--yakinda" key={oge.ad}>
                      <Ikon aria-hidden="true" /><span>{oge.ad}</span>
                      <span className="yonetim__nav-yakinda">Yakında</span>
                    </span>
                  );
                }

                return (
                  <Link
                    className={`yonetim__nav-baglanti${konum.pathname === oge.yol ? ' yonetim__nav-baglanti--aktif' : ''}`}
                    to={oge.yol}
                    key={oge.ad}
                  >
                    <Ikon aria-hidden="true" /><span>{oge.ad}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="yonetim__tanitim">
          <Zap aria-hidden="true" />
          <p><strong>Güçlü Altyapı</strong><br />Daha Büyük Yarınlara</p>
        </div>
      </aside>

      <div className="yonetim__ana">
        <header className="yonetim__ust-bar">
          <div className="yonetim__karsilama">
            <strong>Hoş Geldiniz 👋</strong>
            <span>Demir Vana</span>
          </div>
          <label className="yonetim__arama">
            <SearchIcon aria-hidden="true" />
            <input type="search" placeholder="Ürün, kategori, sayfa veya içerik ara..." />
            <kbd>Ctrl+K</kbd>
          </label>
          <button className="yonetim__bildirim" type="button" aria-label="Bildirimler">
            <Bell aria-hidden="true" /><span>3</span>
          </button>
          {/* Kimlik doğrulama sistemi henüz kurulmadığı için kullanıcı bilgisi sabit bir yer tutucudur. */}
          <div className="yonetim__kullanici">
            <span className="yonetim__kullanici-avatar" aria-hidden="true">DV</span>
            <span>
              <strong>Demir Vana</strong>
              <small>Yönetici</small>
            </span>
            <ChevronRight aria-hidden="true" />
          </div>
        </header>

        <main className="yonetim__icerik">{children}</main>
      </div>
    </div>
  );
}
