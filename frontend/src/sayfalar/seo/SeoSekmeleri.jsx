import { BarChart3, CircleAlert, FileBarChart, HeartPulse, Lightbulb, Megaphone, Search, ShieldCheck, Target, TrendingUp, Users } from 'lucide-react';

function VeriBekleniyor({ ikon: Ikon, baslik, aciklama }) {
  return (
    <div className="seo-bos-durum">
      <span><Ikon aria-hidden="true" size={22} /></span>
      <h2>{baslik}</h2>
      <p>{aciklama}</p>
    </div>
  );
}

function BaglantiBekliyor({ metin }) { return <div className="seo-mini-bos">{metin}</div>; }

function SorunListesi({ sorunlar = [], sinir = 5 }) {
  if (!sorunlar.length) return <BaglantiBekliyor metin="Açık site sorunu bulunmuyor." />;
  return <div className="seo-sorun-listesi">{sorunlar.slice(0, sinir).map((sorun) => <div key={sorun.id}><span className={`seo-onem seo-onem--${sorun.onem}`}>{sorun.onem}</span><p><strong>{sorun.aciklama}</strong><small>{sorun.url_yolu}</small></p></div>)}</div>;
}

export function GenelBakisSekmesi({ veri, yukleniyor, hata, onSiteyiTara, onYenidenDene }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="SEO verileri alınamadı" aciklama={hata}><button onClick={onYenidenDene}>Tekrar dene</button></VeriBekleniyor>;
  const tarama = veri?.site_sagligi;
  const kartlar = [
    ['Google Görünürlüğü', Search, '—', 'Search Console bağlı değil', 'google'],
    ['Top 3 Kelime', Target, '—', 'Sıralama sağlayıcısı bağlı değil'],
    ['Top 10 Kelime', BarChart3, '—', 'Sıralama sağlayıcısı bağlı değil'],
    ['Top 20 Kelime', TrendingUp, '—', 'Sıralama sağlayıcısı bağlı değil'],
    ['Site Sağlığı', HeartPulse, tarama ? `${tarama.saglik_puani}/100` : '—', tarama ? `${tarama.toplam_url} URL tarandı` : 'Henüz tarama yapılmadı', 'saglik']
  ];
  return (
    <div className="seo-genel-bakis">
      <div className="seo-kpi-grid">
        {kartlar.map(([etiket, Ikon, deger, bilgi, gorsel]) => <article className="seo-kpi" key={etiket}><span className={gorsel ? `seo-kpi__ikon seo-gorsel-ikon seo-gorsel-ikon--${gorsel}` : 'seo-kpi__ikon'}>{!gorsel && <Ikon aria-hidden="true" size={22} />}</span><div><span>{etiket}</span><strong>{deger}</strong><small>{bilgi}</small></div></article>)}
      </div>
      <div className="seo-ana-grid">
        <article className="seo-panel seo-panel--genis"><header><div><TrendingUp /><h2>Sıralama Değişimi</h2></div><span>Son 30 gün</span></header><BaglantiBekliyor metin="Gerçek sıralama grafiği için veri sağlayıcısı bağlantısı gerekli." /></article>
        <article className="seo-panel"><header><div><Users /><h2>Rakip Karşılaştırması</h2></div></header><BaglantiBekliyor metin="Henüz takip edilen rakip bulunmuyor." /></article>
      </div>
      <div className="seo-hareket-grid">
        <article className="seo-panel"><header><div><Users /><h2>Son Rakip Hareketleri</h2></div></header><BaglantiBekliyor metin="Rakip hareketi bulunmuyor." /></article>
        <article className="seo-panel"><header><div><Megaphone /><h2>Son Reklam Hareketleri</h2></div></header><BaglantiBekliyor metin="Reklam sağlayıcısı bağlı değil." /></article>
        <article className="seo-panel"><header><div><Lightbulb /><h2>Önemli Fırsatlar</h2></div></header><SorunListesi sorunlar={veri?.sorunlar} sinir={4} /></article>
      </div>
      <article className="seo-gorev-seridi"><div><ShieldCheck /><div><strong>Bugün Ne Yapmalıyım?</strong><small>{tarama ? `${tarama.sorun_sayisi} gerçek site sorunu tespit edildi.` : 'İlk denetimi başlatarak teknik SEO sorunlarını belirleyin.'}</small></div></div><button type="button" onClick={onSiteyiTara}>{tarama ? 'Siteyi yeniden tara' : 'Siteyi tara'}</button></article>
    </div>
  );
}

export const AnahtarKelimelerSekmesi = () => <VeriBekleniyor ikon={Search} baslik="Anahtar Kelimeler" aciklama="Takip edilen anahtar kelime bulunmuyor." />;
export const RakiplerSekmesi = () => <VeriBekleniyor ikon={Users} baslik="Rakip Intelligence" aciklama="Henüz takip edilen rakip bulunmuyor." />;
export const ReklamlarSekmesi = () => <VeriBekleniyor ikon={Megaphone} baslik="Reklam Takibi" aciklama="Reklam veri sağlayıcısı henüz bağlı değil." />;
export const FirsatlarSekmesi = () => <VeriBekleniyor ikon={Lightbulb} baslik="İçerik Fırsatları" aciklama="Fırsat analizi için önce gerçek SEO verileri toplanmalıdır." />;
export function SiteSagligiSekmesi({ veri, yukleniyor, hata, onSiteyiTara, taraniyor }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  const tarama = veri?.site_sagligi;
  return <div className="seo-site-sagligi"><article className="seo-panel"><header><div><HeartPulse /><h2>Site Sağlığı</h2></div><button type="button" onClick={onSiteyiTara} disabled={taraniyor}>{taraniyor ? 'Taranıyor…' : 'Siteyi tara'}</button></header>{hata && <p className="seo-hata">{hata}</p>}<div className="seo-saglik-ozeti"><strong>{tarama ? `${tarama.saglik_puani}/100` : '—'}</strong><span>{tarama ? `${tarama.toplam_url} URL tarandı · ${tarama.sorun_sayisi} sorun` : 'Henüz site taraması yapılmadı.'}</span></div><SorunListesi sorunlar={veri?.sorunlar} sinir={50} /></article></div>;
}
export const RaporlarSekmesi = () => <VeriBekleniyor ikon={FileBarChart} baslik="Raporlar" aciklama="Rapor oluşturmak için tarihsel veri bulunmuyor." />;
