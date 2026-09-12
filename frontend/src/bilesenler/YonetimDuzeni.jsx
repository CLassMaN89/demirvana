import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Monitor, ListTree, FolderTree, Package, Cog, Sliders,
  FileText, Handshake, Award, Building2, Mail, Image, Search as SearchIcon,
  Users, Settings, Bell, ChevronRight, Zap
} from 'lucide-react';
import '../stiller/yonetim.css';

// Şu an yalnızca Dashboard gerçek bir sayfa; diğer bağlantılar tasarımı tamamlamak için görünür ama
// henüz kendi sayfaları yapılmadığından tıklanınca panelin ana ekranına döner.
const MENU_BOLUMLERI = [
  {
    baslik: null,
    ogeler: [
      { ad: 'Dashboard', ikon: LayoutDashboard, aktif: true },
      { ad: 'Web Sitesini Önizle', ikon: Monitor }
    ]
  },
  {
    baslik: 'İçerik Yönetimi',
    ogeler: [
      { ad: 'Menü Yönetimi', ikon: ListTree },
      { ad: 'Kategori Yönetimi', ikon: FolderTree },
      { ad: 'Ürün Yönetimi', ikon: Package }
    ]
  },
  {
    baslik: 'Ürün Grupları',
    ogeler: [
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
                return (
                  <Link
                    className={`yonetim__nav-baglanti${oge.aktif ? ' yonetim__nav-baglanti--aktif' : ''}`}
                    to="/admin"
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
            <span className="yonetim__kullanici-avatar" aria-hidden="true">AY</span>
            <span>
              <strong>Ahmet Yılmaz</strong>
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
