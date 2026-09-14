import { BarChart3, Database, FileBarChart, HeartPulse, Lightbulb, Megaphone, Search, Users } from 'lucide-react';

function VeriBekleniyor({ ikon: Ikon, baslik, aciklama }) {
  return (
    <div className="seo-bos-durum">
      <span><Ikon aria-hidden="true" size={22} /></span>
      <h2>{baslik}</h2>
      <p>{aciklama}</p>
    </div>
  );
}

export function GenelBakisSekmesi() {
  const kartlar = [
    ['Google Görünürlüğü', Search], ['Top 3 Kelime', BarChart3], ['Top 10 Kelime', BarChart3],
    ['Top 20 Kelime', BarChart3], ['Site Sağlığı', HeartPulse]
  ];
  return (
    <div className="seo-genel-bakis">
      <div className="seo-kpi-grid">
        {kartlar.map(([etiket, Ikon]) => <article className="seo-kpi" key={etiket}><Ikon aria-hidden="true" size={20} /><div><span>{etiket}</span><strong>—</strong><small>Henüz veri toplanmadı</small></div></article>)}
      </div>
      <VeriBekleniyor ikon={Database} baslik="SEO verileri bekleniyor" aciklama="İlk site taraması ve veri toplama servisleri tamamlandığında gerçek sonuçlar burada gösterilecek." />
    </div>
  );
}

export const AnahtarKelimelerSekmesi = () => <VeriBekleniyor ikon={Search} baslik="Anahtar Kelimeler" aciklama="Takip edilen anahtar kelime bulunmuyor." />;
export const RakiplerSekmesi = () => <VeriBekleniyor ikon={Users} baslik="Rakip Intelligence" aciklama="Henüz takip edilen rakip bulunmuyor." />;
export const ReklamlarSekmesi = () => <VeriBekleniyor ikon={Megaphone} baslik="Reklam Takibi" aciklama="Reklam veri sağlayıcısı henüz bağlı değil." />;
export const FirsatlarSekmesi = () => <VeriBekleniyor ikon={Lightbulb} baslik="İçerik Fırsatları" aciklama="Fırsat analizi için önce gerçek SEO verileri toplanmalıdır." />;
export const SiteSagligiSekmesi = () => <VeriBekleniyor ikon={HeartPulse} baslik="Site Sağlığı" aciklama="Henüz site taraması yapılmadı." />;
export const RaporlarSekmesi = () => <VeriBekleniyor ikon={FileBarChart} baslik="Raporlar" aciklama="Rapor oluşturmak için tarihsel veri bulunmuyor." />;
