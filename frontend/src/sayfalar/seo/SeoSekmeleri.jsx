import { BarChart3, CircleAlert, CircleHelp, Crown, FileBarChart, HeartPulse, Lightbulb, Megaphone, Search, ShieldCheck, Target, TrendingUp, Users } from 'lucide-react';
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

function FirsatListesi({ sorunlar = [], sinir = 5 }) {
  if (!sorunlar.length) return <BaglantiBekliyor metin="Açık SEO fırsatı bulunmuyor." />;
  const etiketler = { kritik: 'Acil Düzeltme', yuksek: 'Yüksek Potansiyel', orta: 'İçerik Fırsatı', dusuk: 'Hızlı Kazanım' };
  return <div className="seo-firsat-listesi">{sorunlar.slice(0, sinir).map((sorun) => <div key={sorun.id}><span className={`seo-firsat-listesi__ikon seo-firsat-listesi__ikon--${sorun.onem}`}><Search aria-hidden="true" /></span><p><strong>{sorun.aciklama}</strong><small>{sorun.url_yolu}</small></p><span className={`seo-firsat-etiketi seo-firsat-etiketi--${sorun.onem}`}>{etiketler[sorun.onem] ?? 'İncele'}</span></div>)}</div>;
}

function AciklamaliBaslik({ children, aciklama }) {
  return <h2 className="seo-baslik-tooltip" tabIndex="0" data-tooltip={aciklama}>{children}</h2>;
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

function performansPuani(rakip) { return Math.max(45, Math.min(100, Math.round(100 - Number(rakip.yanit_suresi_ms || 5000) / 55))); }
function erisilebilirlikPuani(rakip) { return Number(rakip.h1_sayisi) === 1 ? 95 : Math.max(50, 90 - Math.abs(Number(rakip.h1_sayisi) - 1) * 5); }
function uygulamaPuani(rakip) { return Math.max(55, Math.min(100, 65 + (Number(rakip.http_durumu) === 200 ? 15 : 0) + (Number(rakip.schema_sayisi) > 0 ? 10 : 0) + (Number(rakip.sitemap_url_sayisi) > 0 ? 10 : 0))); }
function puanSinifi(puan) { return puan >= 87 ? 'iyi' : puan >= 70 ? 'orta' : 'zayif'; }

function MiniCizgi({ renk, veriler = [] }) {
  const sayilar = veriler.length ? veriler.map(Number) : [50, 50];
  const enAz = Math.min(...sayilar); const enCok = Math.max(...sayilar); const aralik = Math.max(1, enCok - enAz);
  const noktalar = sayilar.map((deger, sira) => `${(sira / Math.max(1, sayilar.length - 1)) * 100},${26 - ((deger - enAz) / aralik) * 20}`).join(' ');
  return <svg className="seo-mini-cizgi" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points={noktalar} fill="none" stroke={renk} strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
}

export function GenelBakisSekmesi({ veri, yukleniyor, hata, onSiteyiTara, onYenidenDene }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="SEO verileri alınamadı" aciklama={hata}><button onClick={onYenidenDene}>Tekrar dene</button></VeriBekleniyor>;
  const tarama = veri?.site_sagligi;
  const rakipler = veri?.rakip_analizleri ?? [];
  const bizimSite = rakipler.find((rakip) => Number(rakip.bizim_sitemiz_mi) === 1);
  const saglikGecmisi = (veri?.tarama_gecmisi ?? []).map((kayit) => kayit.saglik_puani);
  const kartlar = [
    ['Google Görünürlüğü', 'google', bizimSite ? `${bizimSite.seo_puani}/100` : '—', 'Canlı teknik ölçüm', 'mavi', '#1677ff', saglikGecmisi],
    ['Top 3 Kelime', 'siralama', '—', 'Sıralama kaynağı gerekli', 'yesil', '#13ad68', []],
    ['Top 10 Kelime', 'top10', '—', 'Sıralama kaynağı gerekli', 'mor', '#9747ff', []],
    ['Top 20 Kelime', 'top20', '—', 'Sıralama kaynağı gerekli', 'turuncu', '#ff9200', []],
    ['Site Sağlığı', 'saglik', tarama ? `${tarama.saglik_puani}/100` : '—', tarama ? 'Sağlıklı' : 'Henüz taranmadı', 'yesil', '#13ad68', saglikGecmisi]
  ];
  return (
    <div className="seo-genel-bakis">
      <div className="seo-kpi-grid">
        {kartlar.map(([etiket, ikon, deger, bilgi, renk, cizgiRengi, gecmis]) => <article className={`seo-kpi seo-kpi--${renk}`} key={etiket}><span className="seo-kpi__ikon-cerceve"><SeoGorselIkonu tur={ikon} boyut={28} className={`seo-kpi__ikon seo-kpi__ikon--${ikon}`} /></span><div><span>{etiket} <CircleHelp aria-hidden="true" /></span><strong>{deger}</strong><small>{bilgi}</small></div><MiniCizgi renk={cizgiRengi} veriler={gecmis} /></article>)}
      </div>
      <div className="seo-ana-grid">
        <article className="seo-panel seo-panel--genis"><header><div><TrendingUp /><AciklamaliBaslik aciklama="Site taramalarından alınan sağlık puanının zaman içindeki değişimini gösterir.">Site Sağlığı Değişimi</AciklamaliBaslik></div><span>Gerçek tarama geçmişi</span></header><SaglikGrafigi gecmis={veri?.tarama_gecmisi} /></article>
        <article className="seo-panel seo-panel--karsilastirma"><header><div><Users /><AciklamaliBaslik aciklama="Demir Vana ile takip edilen rakiplerin performans ve teknik SEO puanlarını karşılaştırır.">Rakip Karşılaştırması</AciklamaliBaslik></div><a href="?tab=rakipler">Detaylı Karşılaştırma <span>→</span></a></header><div className="seo-karsilastirma"><div className="seo-karsilastirma__baslik"><span>Site</span><span>Performans</span><span>SEO</span><span>Erişilebilirlik</span><span>En İyi Uygulamalar</span></div>{rakipler.map((rakip) => { const puanlar = [performansPuani(rakip), Number(rakip.seo_puani), erisilebilirlikPuani(rakip), uygulamaPuani(rakip)]; return <div key={rakip.id}><strong>{rakip.ad}{Number(rakip.bizim_sitemiz_mi) === 1 && <Crown aria-label="Demir Vana" />}</strong>{puanlar.map((puan, sira) => <b className={`seo-puan seo-puan--${puanSinifi(puan)}`} key={sira}>{puan}</b>)}</div>; })}</div></article>
      </div>
      <div className="seo-hareket-grid">
        <article className="seo-panel"><header><div><Users /><AciklamaliBaslik aciklama="Rakip sitelerde yapılan son canlı ölçümlerin özetini gösterir.">Son Rakip Analizleri</AciklamaliBaslik></div><span>Canlı ölçümler</span></header><div className="seo-hareket-listesi">{rakipler.slice(0, 5).map((rakip) => <div key={rakip.id}><Search /><p><strong>{rakip.ad} · {rakip.seo_puani}/100</strong><small>{rakip.kelime_sayisi} kelime · {rakip.schema_sayisi} schema · {rakip.h1_sayisi} H1</small></p><time>{tarihYaz(rakip.tarama_tarihi)}</time></div>)}</div></article>
        <article className="seo-panel"><header><div><Megaphone /><AciklamaliBaslik aciklama="Google Ads bağlantısı kurulduğunda rakiplerin ve hesabın son reklam hareketlerini gösterir.">Son Reklam Hareketleri</AciklamaliBaslik></div></header><div className="seo-baglanti-karti"><SeoGorselIkonu tur="reklam" boyut={34} /><div><strong>Google Ads bağlı değil</strong><small>Bağlantı kurulduğunda gerçek reklam hareketleri burada görünür.</small></div></div></article>
        <article className="seo-panel"><header><div><Lightbulb /><AciklamaliBaslik aciklama="Site taramasında bulunan ve görünürlüğü artırmak için uygulanabilecek öncelikli SEO geliştirmelerini gösterir.">Önemli Fırsatlar (AI Önerileri)</AciklamaliBaslik></div><a href="?tab=firsatlar">Tümünü Gör <span>→</span></a></header><FirsatListesi sorunlar={veri?.sorunlar} sinir={5} /></article>
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
  return <div className="seo-site-sagligi"><article className="seo-panel"><header><div><HeartPulse /><AciklamaliBaslik aciklama="Taranan sayfalardaki teknik SEO sorunlarını ve genel site sağlık puanını gösterir.">Site Sağlığı</AciklamaliBaslik></div><button type="button" onClick={onSiteyiTara} disabled={taraniyor}>{taraniyor ? 'Taranıyor…' : 'Siteyi tara'}</button></header>{hata && <p className="seo-hata">{hata}</p>}<div className="seo-saglik-ozeti"><strong>{tarama ? `${tarama.saglik_puani}/100` : '—'}</strong><span>{tarama ? `${tarama.toplam_url} URL tarandı · ${tarama.sorun_sayisi} sorun` : 'Henüz site taraması yapılmadı.'}</span></div><SorunListesi sorunlar={veri?.sorunlar} sinir={50} /></article></div>;
}
export const RaporlarSekmesi = () => <VeriBekleniyor ikon={FileBarChart} baslik="Raporlar" aciklama="Rapor oluşturmak için tarihsel veri bulunmuyor." />;
