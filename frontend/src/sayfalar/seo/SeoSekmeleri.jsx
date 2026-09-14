import { BarChart3, CircleAlert, FileBarChart, HeartPulse, Lightbulb, Megaphone, Search, ShieldCheck, Target, TrendingUp, Users } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SeoGorselIkonu from './SeoGorselIkonu';

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

function tarihYaz(tarih) {
  if (!tarih) return '';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(tarih.replace(' ', 'T')));
}

function SaglikGrafigi({ gecmis = [] }) {
  if (!gecmis.length) return <BaglantiBekliyor metin="Grafik için ilk site taramasını çalıştırın." />;
  const veriler = gecmis.map((kayit) => ({ tarih: tarihYaz(kayit.bitis_tarihi).split(' ').slice(0, 2).join(' '), puan: Number(kayit.saglik_puani), sorun: Number(kayit.sorun_sayisi) }));
  return <div className="seo-grafik"><ResponsiveContainer width="100%" height="100%"><LineChart data={veriler} margin={{ top: 12, right: 18, bottom: 4, left: -18 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="tarih" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="puan" name="Sağlık puanı" stroke="#1677ff" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>;
}

export function GenelBakisSekmesi({ veri, yukleniyor, hata, onSiteyiTara, onYenidenDene }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="SEO verileri alınamadı" aciklama={hata}><button onClick={onYenidenDene}>Tekrar dene</button></VeriBekleniyor>;
  const tarama = veri?.site_sagligi;
  const rakipler = veri?.rakip_analizleri ?? [];
  const kartlar = [
    ['Google Görünürlüğü', 'google', '—', 'Search Console bağlı değil', 'mavi'],
    ['Top 3 Kelime', 'siralama', '—', 'Sıralama sağlayıcısı bağlı değil', 'yesil'],
    ['Top 10 Kelime', 'grafik', '—', 'Sıralama sağlayıcısı bağlı değil', 'mor'],
    ['Top 20 Kelime', 'performans', '—', 'Sıralama sağlayıcısı bağlı değil', 'turuncu'],
    ['Site Sağlığı', 'saglik', tarama ? `${tarama.saglik_puani}/100` : '—', tarama ? `${tarama.toplam_url} URL tarandı` : 'Henüz tarama yapılmadı', 'yesil']
  ];
  return (
    <div className="seo-genel-bakis">
      <div className="seo-kpi-grid">
        {kartlar.map(([etiket, ikon, deger, bilgi, renk]) => <article className={`seo-kpi seo-kpi--${renk}`} key={etiket}><SeoGorselIkonu tur={ikon} boyut={34} className="seo-kpi__ikon" /><div><span>{etiket}</span><strong>{deger}</strong><small>{bilgi}</small></div><i aria-hidden="true" /></article>)}
      </div>
      <div className="seo-ana-grid">
        <article className="seo-panel seo-panel--genis"><header><div><TrendingUp /><h2>Site Sağlığı Değişimi</h2></div><span>Gerçek tarama geçmişi</span></header><SaglikGrafigi gecmis={veri?.tarama_gecmisi} /></article>
        <article className="seo-panel"><header><div><Users /><h2>Rakip Karşılaştırması</h2></div><span>Canlı site ölçümü</span></header><div className="seo-karsilastirma"><div className="seo-karsilastirma__baslik"><span>Site</span><span>Yanıt</span><span>SEO</span><span>Sitemap URL</span></div>{rakipler.map((rakip) => <div key={rakip.id}><strong>{rakip.ad}{Number(rakip.bizim_sitemiz_mi) === 1 ? ' ★' : ''}</strong><b>{rakip.http_durumu === 200 ? `${rakip.yanit_suresi_ms} ms` : 'Hata'}</b><b>{rakip.seo_puani}</b><b>{rakip.sitemap_url_sayisi}</b></div>)}</div></article>
      </div>
      <div className="seo-hareket-grid">
        <article className="seo-panel"><header><div><Users /><h2>Son Rakip Analizleri</h2></div><span>Canlı ölçümler</span></header><div className="seo-hareket-listesi">{rakipler.slice(0, 5).map((rakip) => <div key={rakip.id}><Search /><p><strong>{rakip.ad} · {rakip.seo_puani}/100</strong><small>{rakip.kelime_sayisi} kelime · {rakip.schema_sayisi} schema · {rakip.h1_sayisi} H1</small></p><time>{tarihYaz(rakip.tarama_tarihi)}</time></div>)}</div></article>
        <article className="seo-panel"><header><div><Megaphone /><h2>Son Reklam Hareketleri</h2></div></header><div className="seo-baglanti-karti"><SeoGorselIkonu tur="reklam" boyut={38} /><div><strong>Google Ads bağlı değil</strong><small>Bağlantı kurulduğunda gerçek reklam hareketleri burada görünür.</small></div></div></article>
        <article className="seo-panel"><header><div><Lightbulb /><h2>Önemli Fırsatlar</h2></div></header><SorunListesi sorunlar={veri?.sorunlar} sinir={4} /></article>
      </div>
      <article className="seo-gorev-seridi"><div className="seo-gorev-seridi__baslik"><ShieldCheck /><div><strong>Bugün Ne Yapmalıyım?</strong><small>{tarama ? `${tarama.sorun_sayisi} gerçek site sorunu tespit edildi.` : 'İlk denetimi başlatın.'}</small></div></div><div className="seo-gorevler">{(veri?.sorunlar ?? []).slice(0, 5).map((sorun, sira) => <div key={sorun.id}><b>{sira + 1}</b><span>{sorun.aciklama}<small>{sorun.url_yolu}</small></span></div>)}</div><button type="button" onClick={onSiteyiTara}>{tarama ? 'Yeniden tara' : 'Siteyi tara'}</button></article>
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
