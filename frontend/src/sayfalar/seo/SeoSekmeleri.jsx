import { BarChart3, CircleAlert, CircleHelp, Clock3, Crown, Download, FileBarChart, FileText, Globe2, HeartPulse, Image, Lightbulb, Link2, Megaphone, Search, Target, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
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
  const okunabilirBaslik = (yol = '') => decodeURIComponent(yol.split('/').filter(Boolean).pop() ?? 'SEO fırsatı').replace(/-d-?\d+$/i, '').replaceAll('-', ' ').replace(/^./, (harf) => harf.toLocaleUpperCase('tr-TR'));
  return <div className="seo-firsat-listesi">{sorunlar.slice(0, sinir).map((sorun) => <div key={sorun.id}><span className={`seo-firsat-listesi__ikon seo-firsat-listesi__ikon--${sorun.onem}`}><Search aria-hidden="true" /></span><p><strong>{okunabilirBaslik(sorun.url_yolu)}</strong><small>{sorun.url_yolu}</small></p><span className={`seo-firsat-etiketi seo-firsat-etiketi--${sorun.onem}`}>{etiketler[sorun.onem] ?? 'İncele'}</span></div>)}</div>;
}

function AciklamaliBaslik({ children, aciklama }) {
  return <h2 className="seo-baslik-tooltip" tabIndex="0" data-tooltip={aciklama}>{children}</h2>;
}

function tarihYaz(tarih) {
  if (!tarih) return '';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(tarih.replace(' ', 'T')));
}

function gecenSureYaz(tarih) { if (!tarih) return '—'; const dakika = Math.floor(Math.max(0, Date.now() - new Date(tarih.replace(' ', 'T')).getTime()) / 60000); if (dakika < 1) return 'Şimdi'; if (dakika < 60) return `${dakika} dk önce`; const saat = Math.floor(dakika / 60); return saat < 24 ? `${saat} saat önce` : `${Math.floor(saat / 24)} gün önce`; }
function alanAdiYaz(adres = '') { try { return new URL(adres).hostname.replace(/^www\./, ''); } catch { return adres || '—'; } }
function gorevAdiYaz(yol = '') { return decodeURIComponent(yol.split('/').filter(Boolean).pop() ?? 'SEO görevi').replace(/-d-?\d+$/i, '').replaceAll('-', ' ').replace(/^./, (harf) => harf.toLocaleUpperCase('tr-TR')); }
function gorevRozetiYaz(sorun) { const sayi = sorun.aciklama?.match(/\d+/)?.[0]; return sayi ? `${sayi} karakter` : sorun.onem; }

function SiralamaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="seo-siralama-tooltip">
      <strong>{label}</strong>
      {payload.filter((kayit) => kayit.value != null).map((kayit) => (
        <span key={kayit.dataKey}>
          <i style={{ backgroundColor: kayit.color }} />
          <em>{kayit.name}</em>
          <b>{kayit.value}/100</b>
        </span>
      ))}
    </div>
  );
}

function SiralamaGrafigi({ rakipler = [], gecmis = [] }) {
  if (!rakipler.length) return <BaglantiBekliyor metin="Grafik için henüz rakip analizi bulunmuyor." />;
  const zamanlar = new Map();
  for (const kayit of gecmis) { const anahtar = kayit.tarama_tarihi?.slice(0, 16); if (!anahtar) continue; const nokta = zamanlar.get(anahtar) ?? { zaman: anahtar }; nokta[`site_${kayit.rakip_id}`] = Number(kayit.seo_puani); zamanlar.set(anahtar, nokta); }
  const tarihEtiketi = (deger) => new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(deger.replace(' ', 'T')));
  const veriler = [...zamanlar.values()].map((nokta) => ({ ...nokta, etiket: tarihEtiketi(nokta.zaman) }));
  if (!veriler.length) veriler.push({ etiket: 'Son ölçüm', ...Object.fromEntries(rakipler.map((rakip) => [`site_${rakip.id}`, Number(rakip.seo_puani)])) });
  const renkler = ['#0052ff', '#ef4444', '#f59e0b', '#12b76a', '#8b5cf6'];
  return <div className="seo-grafik"><ResponsiveContainer width="100%" height="100%"><AreaChart accessibilityLayer data={veriler} margin={{ top: 8, right: 12, bottom: 2, left: 12 }}><CartesianGrid vertical={false} stroke="#dfe5ee" strokeDasharray="3 3" /><XAxis dataKey="etiket" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tick={{ fontSize: 10, fill: '#667085' }} /><Tooltip content={<SiralamaTooltip />} cursor={false} /><defs>{rakipler.map((rakip, sira) => <linearGradient key={rakip.id} id={`seo-gradient-${rakip.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={renkler[sira % renkler.length]} stopOpacity={0.5} /><stop offset="95%" stopColor={renkler[sira % renkler.length]} stopOpacity={0.1} /></linearGradient>)}</defs>{rakipler.map((rakip, sira) => <Area key={rakip.id} type="natural" dataKey={`site_${rakip.id}`} name={rakip.ad} connectNulls fill={`url(#seo-gradient-${rakip.id})`} fillOpacity={0.4} stroke={renkler[sira % renkler.length]} stackId="a" strokeWidth={0.8} strokeDasharray="3 3" />)}</AreaChart></ResponsiveContainer></div>;
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
  const googleAdsBagli = veri?.dis_kaynaklar?.reklam_saglayicisi === 'bagli';
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
        <article className="seo-panel seo-panel--genis"><header><div><TrendingUp /><AciklamaliBaslik aciklama="Demir Vana ve rakip sitelerin geçmiş canlı taramalardaki SEO puanı değişimini tarih ekseninde gösterir.">Sıralama Değişimi</AciklamaliBaslik></div><span>Canlı rakip ölçümleri</span></header><SiralamaGrafigi rakipler={rakipler} gecmis={veri?.rakip_gecmisi} /></article>
        <article className="seo-panel seo-panel--karsilastirma"><header><div><Users /><AciklamaliBaslik aciklama="Demir Vana ile takip edilen rakiplerin performans ve teknik SEO puanlarını karşılaştırır.">Rakip Karşılaştırması</AciklamaliBaslik></div><a href="?tab=rakipler">Detaylı Karşılaştırma <span>→</span></a></header><div className="seo-karsilastirma"><div className="seo-karsilastirma__baslik"><span>Site</span><span>Performans</span><span>SEO</span><span>Erişilebilirlik</span><span>En İyi Uygulamalar</span></div>{rakipler.map((rakip) => { const puanlar = [performansPuani(rakip), Number(rakip.seo_puani), erisilebilirlikPuani(rakip), uygulamaPuani(rakip)]; return <div key={rakip.id}><strong>{rakip.ad}{Number(rakip.bizim_sitemiz_mi) === 1 && <Crown aria-label="Demir Vana" />}</strong>{puanlar.map((puan, sira) => <b className={`seo-puan seo-puan--${puanSinifi(puan)}`} key={sira}>{puan}</b>)}</div>; })}</div></article>
      </div>
      <div className="seo-hareket-grid">
        <article className="seo-panel"><header><div><Users /><AciklamaliBaslik aciklama="Rakip sitelerde tespit edilen son içerik ve SEO hareketlerini gösterir; veri yoksa son canlı analiz güncellemesini listeler.">Son Rakip Hareketleri</AciklamaliBaslik></div><a href="?tab=rakipler">Tümünü Gör <span>→</span></a></header><div className="seo-rakip-hareketleri">{rakipler.slice(0, 5).map((rakip, sira) => { const Ikon = [Globe2, FileText, Image, Globe2, Link2][sira]; return <div key={rakip.id}><Ikon aria-hidden="true" /><strong>{rakip.ad}</strong><p><b>SEO analizi güncellendi</b><small>{alanAdiYaz(rakip.ana_adres)}</small></p><span><time>{gecenSureYaz(rakip.tarama_tarihi)}</time><em>Yeni</em></span></div>; })}</div></article>
        <article className="seo-panel"><header><div><Megaphone /><AciklamaliBaslik aciklama="Google Ads bağlantısı kurulduğunda hesabın son reklam hareketlerini gösterir.">Son Reklam Hareketleri</AciklamaliBaslik></div></header><div className="seo-baglanti-karti"><SeoGorselIkonu tur="reklam" boyut={34} /><div><strong>{googleAdsBagli ? 'Google Ads bağlandı' : 'Google Ads bağlı değil'}</strong><small>{googleAdsBagli ? 'Hesap yetkisi alındı; reklam verileri alınmaya hazır.' : 'Bağlantı kurulduğunda gerçek reklam hareketleri burada görünür.'}</small>{!googleAdsBagli && <a href="/api/admin/google-ads/oauth/baslat">Google Ads’i bağla</a>}</div></div></article>
        <article className="seo-panel"><header><div><Lightbulb /><AciklamaliBaslik aciklama="Site taramasında bulunan ve görünürlüğü artırmak için uygulanabilecek öncelikli SEO geliştirmelerini gösterir.">Önemli Fırsatlar (AI Önerileri)</AciklamaliBaslik></div><a href="?tab=firsatlar">Tümünü Gör <span>→</span></a></header><FirsatListesi sorunlar={veri?.sorunlar} sinir={5} /></article>
      </div>
      <article className="seo-gorev-seridi"><div className="seo-gorev-seridi__baslik"><Target aria-hidden="true" /><div><strong>Bugün Ne Yapmalıyım?</strong><small>{tarama ? `${tarama.sorun_sayisi} gerçek site sorunu tespit edildi.` : 'İlk denetimi başlatın.'}</small></div></div><div className="seo-gorevler">{(veri?.sorunlar ?? []).slice(0, 5).map((sorun, sira) => <div key={sorun.id}><b>{sira + 1}</b><span><strong>{gorevAdiYaz(sorun.url_yolu)}</strong><small>{sorun.onerilen_duzeltme ?? sorun.aciklama}</small><em className={`seo-gorev-rozeti seo-gorev-rozeti--${sorun.onem}`}>{gorevRozetiYaz(sorun)}</em></span></div>)}</div><a className="seo-gorev-seridi__buton" href="?tab=firsatlar">Detaylı Görev Listesi <span>→</span></a></article>
    </div>
  );
}

export function AnahtarKelimelerSekmesi({ veri, yukleniyor, hata }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="Anahtar kelime verileri alınamadı" aciklama={hata} />;
  return <div className="seo-alt-sekme"><article className="seo-panel"><header><div><Search /><AciklamaliBaslik aciklama="Google aramalarındaki sorgu, gösterim, tıklama ve sıralama verilerini Search Console veya bir sıralama sağlayıcısından getirir.">Anahtar Kelimeler</AciklamaliBaslik></div></header><div className="seo-entegrasyon-durumu"><span><Search aria-hidden="true" /></span><div><strong>Sıralama sağlayıcısı bağlı değil</strong><p>Gerçek konum, gösterim ve tıklama değerleri için Search Console veya bir sıralama sağlayıcısı bağlanmalıdır. Bağlantı kurulmadan anahtar kelime değeri üretilmez.</p></div><em>Bağlantı gerekli</em></div></article></div>;
}

export function RakiplerSekmesi({ veri, yukleniyor, hata, onSiteyiTara, taraniyor }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="Rakip verileri alınamadı" aciklama={hata} />;
  const rakipler = veri?.rakip_analizleri ?? [];
  return <div className="seo-alt-sekme"><article className="seo-panel"><header><div><Users /><AciklamaliBaslik aciklama="Demir Vana ve takip edilen rakiplerin son canlı teknik SEO ölçümlerini karşılaştırır.">Rakip Intelligence</AciklamaliBaslik></div><button type="button" onClick={onSiteyiTara} disabled={taraniyor}>{taraniyor ? 'Taranıyor…' : 'Rakipleri yeniden tara'}</button></header>{rakipler.length ? <div className="seo-alt-tablo"><div className="seo-alt-tablo__baslik"><span>Site</span><span>SEO puanı</span><span>Yanıt süresi</span><span>Kelime</span><span>Schema</span><span>Son ölçüm</span></div>{rakipler.map((rakip) => <div key={rakip.id}><strong>{rakip.ad}{Number(rakip.bizim_sitemiz_mi) === 1 && <Crown aria-label="Demir Vana" />}</strong><b className={`seo-puan seo-puan--${puanSinifi(Number(rakip.seo_puani))}`}>{rakip.seo_puani}</b><span>{Number(rakip.yanit_suresi_ms).toLocaleString('tr-TR')} ms</span><span>{Number(rakip.kelime_sayisi).toLocaleString('tr-TR')}</span><span>{rakip.schema_sayisi}</span><time>{tarihYaz(rakip.tarama_tarihi)}</time></div>)}</div> : <BaglantiBekliyor metin="Henüz takip edilen rakip ölçümü bulunmuyor." />}</article></div>;
}

export function ReklamlarSekmesi({ veri, yukleniyor, hata }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="Reklam bağlantısı kontrol edilemedi" aciklama={hata} />;
  const bagli = veri?.dis_kaynaklar?.reklam_saglayicisi === 'bagli';
  return <div className="seo-alt-sekme"><article className="seo-panel"><header><div><Megaphone /><AciklamaliBaslik aciklama="Yetki verilen Google Ads hesabının reklam hareketlerini gösterir; başka firmaların özel hesap verilerine erişmez.">Reklam Takibi</AciklamaliBaslik></div></header><div className="seo-entegrasyon-durumu"><span><SeoGorselIkonu tur="reklam" boyut={30} /></span><div><strong>{bagli ? 'Google Ads bağlı' : 'Google Ads bağlı değil'}</strong><p>{bagli ? 'Hesap yetkisi hazır. Henüz alınmış reklam hareketi bulunmadığında bu alan boş kalır.' : 'Kendi Google Ads hesabınızdaki gerçek reklam hareketlerini görmek için bağlantı kurun.'}</p></div><em className={bagli ? 'bagli' : ''}>{bagli ? 'Bağlı' : 'Bağlantı gerekli'}</em></div></article></div>;
}

export function FirsatlarSekmesi({ veri, yukleniyor, hata }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="Fırsatlar alınamadı" aciklama={hata} />;
  const sorunlar = veri?.sorunlar ?? [];
  return <div className="seo-alt-sekme"><article className="seo-panel"><header><div><Lightbulb /><AciklamaliBaslik aciklama="Gerçek site taramasındaki sorunları, uygulanabilir düzeltme önerileri olarak öncelik sırasıyla gösterir.">İçerik Fırsatları</AciklamaliBaslik></div><span>{sorunlar.length} fırsat</span></header>{sorunlar.length ? <div className="seo-firsat-detaylari">{sorunlar.map((sorun) => <div key={sorun.id}><span className={`seo-firsat-listesi__ikon seo-firsat-listesi__ikon--${sorun.onem}`}><Search aria-hidden="true" /></span><div><strong>{gorevAdiYaz(sorun.url_yolu)}</strong><small>{sorun.url_yolu}</small><p>{sorun.onerilen_duzeltme ?? sorun.aciklama}</p></div><em className={`seo-onem seo-onem--${sorun.onem}`}>{sorun.onem}</em></div>)}</div> : <BaglantiBekliyor metin="Açık içerik fırsatı bulunmuyor." />}</article></div>;
}
export function SiteSagligiSekmesi({ veri, yukleniyor, hata, onSiteyiTara, taraniyor }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  const tarama = veri?.site_sagligi;
  return <div className="seo-site-sagligi"><article className="seo-panel"><header><div><HeartPulse /><AciklamaliBaslik aciklama="Taranan sayfalardaki teknik SEO sorunlarını ve genel site sağlık puanını gösterir.">Site Sağlığı</AciklamaliBaslik></div><button type="button" onClick={onSiteyiTara} disabled={taraniyor}>{taraniyor ? 'Taranıyor…' : 'Siteyi tara'}</button></header>{hata && <p className="seo-hata">{hata}</p>}<div className="seo-saglik-ozeti"><strong>{tarama ? `${tarama.saglik_puani}/100` : '—'}</strong><span>{tarama ? `${tarama.toplam_url} URL tarandı · ${tarama.sorun_sayisi} sorun` : 'Henüz site taraması yapılmadı.'}</span></div><SorunListesi sorunlar={veri?.sorunlar} sinir={50} /></article></div>;
}
export function RaporlarSekmesi({ veri, yukleniyor, hata }) {
  if (yukleniyor) return <div className="seo-merkezi__yukleniyor" />;
  if (hata) return <VeriBekleniyor ikon={CircleAlert} baslik="Rapor verileri alınamadı" aciklama={hata} />;
  const tarama = veri?.site_sagligi;
  const rakipler = veri?.rakip_analizleri ?? [];
  const raporIndir = () => {
    const satirlar = [['Tür', 'Ad', 'Değer', 'Tarih'], ['Site sağlığı', 'Sağlık puanı', tarama?.saglik_puani ?? '—', tarama?.tarama_tarihi ?? ''], ['Site sağlığı', 'Taranan URL', tarama?.toplam_url ?? 0, tarama?.tarama_tarihi ?? ''], ...rakipler.map((rakip) => ['Rakip', rakip.ad, `${rakip.seo_puani}/100`, rakip.tarama_tarihi ?? ''])];
    const csv = `\uFEFF${satirlar.map((satir) => satir.map((deger) => `"${String(deger).replaceAll('"', '""')}"`).join(';')).join('\n')}`;
    const adres = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const baglanti = document.createElement('a'); baglanti.href = adres; baglanti.download = `seo-raporu-${new Date().toISOString().slice(0, 10)}.csv`; baglanti.click(); URL.revokeObjectURL(adres);
  };
  return <div className="seo-alt-sekme"><article className="seo-panel"><header><div><FileBarChart /><AciklamaliBaslik aciklama="Mevcut site sağlığı ve son rakip ölçümlerini indirilebilir bir raporda birleştirir.">Raporlar</AciklamaliBaslik></div><button type="button" onClick={raporIndir} disabled={!tarama}>CSV raporunu indir <Download aria-hidden="true" /></button></header><div className="seo-rapor-ozeti"><div><HeartPulse /><span>Site Sağlığı<strong>{tarama ? `${tarama.saglik_puani}/100` : '—'}</strong></span></div><div><Globe2 /><span>Taranan Sayfa<strong>{tarama ? `${tarama.toplam_url} URL` : '—'}</strong></span></div><div><Users /><span>Ölçülen Site<strong>{rakipler.length}</strong></span></div><div><Clock3 /><span>Son Ölçüm<strong>{tarihYaz(tarama?.tarama_tarihi ?? rakipler[0]?.tarama_tarihi) || '—'}</strong></span></div></div></article></div>;
}
