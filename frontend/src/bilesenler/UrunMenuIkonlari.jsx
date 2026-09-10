// Ürünler sayfasının sol kategori menüsü için ikon eşlemesi. Lucide kütüphanesinde
// karşılığı olan kategoriler hazır ikonları kullanır; karşılığı olmayan vana/aktüatör
// tipleri için kullanıcının referans görseline uygun, aynı çizgi stilinde özel SVG'ler tanımlanır.
import {
  Droplet, Wind, Settings, Gauge, Flame, Layers, Ship, Scale, Zap, Wrench,
  Waves, Thermometer, SlidersHorizontal, Network
} from 'lucide-react';

const ozelIkonOzellikleri = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true'
};

export function VanaGrubuIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <rect x="3" y="10" width="4" height="4" rx="1" />
      <rect x="17" y="10" width="4" height="4" rx="1" />
      <rect x="8" y="9" width="8" height="6" rx="1" />
      <path d="M12 9V5" />
      <path d="M9 5h6" />
    </svg>
  );
}

export function AktuatorGrubuIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <rect x="7" y="3" width="10" height="7" rx="2" />
      <path d="M12 10v3" />
      <rect x="9" y="13" width="6" height="4" rx="1" />
      <path d="M7 17h10" />
    </svg>
  );
}

export function HidrolikIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <rect x="2" y="13" width="4" height="4" rx="1" />
      <rect x="12" y="2" width="4" height="4" rx="1" />
      <path d="M6 15v-3a4 4 0 0 1 4-4h4" />
    </svg>
  );
}

export function KompansatorIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <path d="M5 12h2M17 12h2" />
      <path d="M9 8v8M12 8v8M15 8v8" />
    </svg>
  );
}

export function BaglantiParcalariIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <path d="M9 2h6v5h5v6h-5v9H9v-9H4V7h5Z" />
    </svg>
  );
}

export function PnomatikAktuatorIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <rect x="3" y="8" width="14" height="8" rx="2" />
      <rect x="17" y="10" width="4" height="4" rx="1" />
      <path d="M7 8V6M11 8V6" />
    </svg>
  );
}

export function SeviyeIkonu(props) {
  return (
    <svg {...ozelIkonOzellikleri} {...props}>
      <rect x="7" y="3" width="10" height="18" rx="5" />
      <path d="M7 12h10" />
    </svg>
  );
}

// Menü grubu başlıklarının (Vana, Aktüatör, Otomasyon) ikonları.
export const GRUP_IKONLARI = {
  Vana: VanaGrubuIkonu,
  Aktüatör: AktuatorGrubuIkonu,
  Otomasyon: Network
};

// Alt kategori başlıklarının ikonları; anahtarlar veritabanından gelen tam Türkçe başlıklardır.
const ALT_OGE_IKONLARI = {
  'Su Grubu Vanaları': Droplet,
  'Buhar Grubu Vanaları': Wind,
  'Kontrol Vanaları': Settings,
  'Hidrolik Vanalar': HidrolikIkonu,
  'Basınç Düşürücü Vanalar': Gauge,
  'Yangın Vanaları': Flame,
  'Paslanmaz Vanalar': Layers,
  'Gemi Vanaları': Ship,
  'Balans Vanaları': Scale,
  'Solenoid Patlaç Pistonlu': Zap,
  'Kompansatörler': KompansatorIkonu,
  'Bağlantı Parçaları': BaglantiParcalariIkonu,
  'Pnömatik Aktüatör': PnomatikAktuatorIkonu,
  'Elektrik Aktüatörler': Zap,
  'Aktüatörlü Vanalar': Settings,
  'Aksesuarlar': Wrench,
  'Debi (Akış)': Waves,
  'Basınç': Gauge,
  'Seviye': SeviyeIkonu,
  'Sıcaklık': Thermometer,
  'Proses Kontrol': SlidersHorizontal
};

export function grupIkonuGetir(baslik) {
  return GRUP_IKONLARI[baslik] ?? Settings;
}

export function altOgeIkonuGetir(baslik) {
  return ALT_OGE_IKONLARI[baslik] ?? Settings;
}
