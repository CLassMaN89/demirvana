import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Eye, Fingerprint, Globe, Search, TrendingUp } from 'lucide-react';
import { ipSayfalariniGetir, ziyaretYonetimVerisiniGetir } from '../servisler/api';
import '../stiller/yonetim-kategori.css';
import '../stiller/istatistikler.css';

function gunEtiketiUret(tarihMetni) {
  const tarih = new Date(tarihMetni.replace(' ', 'T'));
  if (Number.isNaN(tarih.getTime())) return 'Bilinmeyen tarih';
  const bugun = new Date();
  const dun = new Date(bugun);
  dun.setDate(dun.getDate() - 1);
  const gunEsit = (a, b) => a.toDateString() === b.toDateString();
  if (gunEsit(tarih, bugun)) return 'Bugün';
  if (gunEsit(tarih, dun)) return 'Dün';
  return tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function tarihiFormatla(deger) {
  if (!deger) return '—';
  const tarih = new Date(deger.replace(' ', 'T'));
  if (Number.isNaN(tarih.getTime())) return '—';
  return tarih.toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Kısa, kaba bir user-agent özetleyici: tam dizeyi tabloya sığdırmak yerine tarayıcı adı+sürümü
// ve işletim sistemini çıkarır. Kesin cihaz tespiti hedeflenmez, yalnızca okunabilir bir özet sunar.
function tarayiciOzetle(ajan) {
  if (!ajan) return 'Bilinmiyor';
  if (/curl|postman|python-requests/i.test(ajan)) return 'Otomasyon/Araç';
  const surumBul = (desen) => ajan.match(desen)?.[1] ?? '';
  const [tarayici, surum] = /Edg\/([\d.]+)/.test(ajan) ? ['Edge', surumBul(/Edg\/([\d.]+)/)]
    : /Chrome\/([\d.]+)/.test(ajan) ? ['Chrome', surumBul(/Chrome\/([\d.]+)/)]
    : /Firefox\/([\d.]+)/.test(ajan) ? ['Firefox', surumBul(/Firefox\/([\d.]+)/)]
    : /Version\/([\d.]+).*Safari/.test(ajan) ? ['Safari', surumBul(/Version\/([\d.]+)/)]
    : ['Diğer', ''];
  const sistem = /Windows/.test(ajan) ? 'Windows'
    : /Android/.test(ajan) ? 'Android'
    : /iPhone|iPad/.test(ajan) ? 'iOS'
    : /Mac OS/.test(ajan) ? 'macOS'
    : /Linux/.test(ajan) ? 'Linux'
    : '';
  const adSurum = surum ? `${tarayici} ${surum.split('.').slice(0, 2).join('.')}` : tarayici;
  return sistem ? `${adSurum} · ${sistem}` : adSurum;
}

// Cihaz tipi: Tablet önce kontrol edilir çünkü iPad/Android tablet UA'ları genelde "Mobile"
// dizesini de içermeyebilir/içerebilir, bu yüzden ayrım "Tablet" ipuçlarına öncelik verir.
function cihazTipiBelirle(ajan) {
  if (!ajan) return 'Bilinmiyor';
  if (/iPad|Tablet(?!.*Mobile)/i.test(ajan)) return 'Tablet';
  if (/Mobi|Android|iPhone/i.test(ajan)) return 'Mobil';
  return 'Masaüstü';
}

const CIHAZ_ROZET_SINIFI = {
  'Masaüstü': 'rozet--cihaz-masaustu',
  Mobil: 'rozet--cihaz-mobil',
  Tablet: 'rozet--cihaz-tablet'
};

function IpRozeti({ ip }) {
  return <span className="rozet rozet--ip">{ip}</span>;
}

function CihazRozeti({ ajan }) {
  const cihaz = cihazTipiBelirle(ajan);
  return <span className={`rozet ${CIHAZ_ROZET_SINIFI[cihaz] ?? ''}`}>{cihaz}</span>;
}

function kalmaSuresiniFormatla(saniye) {
  if (saniye === null || saniye === undefined) return '—';
  if (saniye < 60) return `${saniye} sn`;
  const dakika = Math.floor(saniye / 60);
  const kalanSaniye = saniye % 60;
  return `${dakika} dk ${kalanSaniye} sn`;
}

function AramaKutusu({ deger, onDegisim, yerTutucu }) {
  return (
    <label className="arama-kutusu">
      <Search aria-hidden="true" size={13} />
      <input
        type="search"
        value={deger}
        onChange={(olay) => onDegisim(olay.target.value)}
        placeholder={yerTutucu}
      />
    </label>
  );
}

function IstatistikKarti({ ikon: Ikon, renk, etiket, deger }) {
  return (
    <div className="yonetim-kategori__istatistik">
      <span className="yonetim-kategori__istatistik-ikon" style={{ '--kart-renk': renk }}>
        <Ikon aria-hidden="true" size={18} />
      </span>
      <span className="yonetim-kategori__istatistik-metin">
        <strong>{deger}</strong>
        <small>{etiket}</small>
      </span>
    </div>
  );
}

export default function IstatistiklerSayfasi() {
  const [veri, setVeri] = useState(null);
  const [yukleniyorMu, setYukleniyorMu] = useState(true);
  const [hata, setHata] = useState(null);
  const [acikGunler, setAcikGunler] = useState(() => new Set());
  const [ziyaretArama, setZiyaretArama] = useState('');
  const [ipArama, setIpArama] = useState('');
  const [acikIpler, setAcikIpler] = useState(() => new Set());
  const [ipSayfalari, setIpSayfalari] = useState({});

  const filtrelenmisKayitlar = useMemo(() => {
    if (!veri) return [];
    const terim = ziyaretArama.trim().toLowerCase();
    if (!terim) return veri.kayitlar;
    return veri.kayitlar.filter((kayit) => [
      kayit.ip_adresi, kayit.yol, kayit.referans, kayit.dil, kayit.kullanici_ajani, kayit.saat_dilimi
    ].some((deger) => (deger || '').toLowerCase().includes(terim)));
  }, [veri, ziyaretArama]);

  const gunlereGoreGruplu = useMemo(() => {
    const gruplar = new Map();
    for (const kayit of filtrelenmisKayitlar) {
      const etiket = gunEtiketiUret(kayit.olusturulma_tarihi);
      if (!gruplar.has(etiket)) gruplar.set(etiket, []);
      gruplar.get(etiket).push(kayit);
    }
    // Her gün için özet çıkarılır: saat aralığı ve en çok görüntülenen sayfa.
    return [...gruplar.entries()].map(([etiket, gununKayitlari]) => {
      const saatler = gununKayitlari.map((k) => tarihiFormatla(k.olusturulma_tarihi).split(' ').pop());
      const sayfaSayaci = new Map();
      for (const kayit of gununKayitlari) sayfaSayaci.set(kayit.yol, (sayfaSayaci.get(kayit.yol) ?? 0) + 1);
      const [enCokYol, enCokAdet] = [...sayfaSayaci.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['—', 0];
      return {
        etiket,
        kayitlar: gununKayitlari,
        ilkSaat: saatler[saatler.length - 1],
        sonSaat: saatler[0],
        enCokYol,
        enCokAdet
      };
    });
  }, [filtrelenmisKayitlar]);

  useEffect(() => {
    if (gunlereGoreGruplu.length > 0) {
      setAcikGunler((mevcut) => (mevcut.size > 0 ? mevcut : new Set([gunlereGoreGruplu[0].etiket])));
    }
  }, [gunlereGoreGruplu]);

  function gunAcikKapatmayiDegistir(etiket) {
    setAcikGunler((mevcut) => {
      const yeni = new Set(mevcut);
      if (yeni.has(etiket)) yeni.delete(etiket); else yeni.add(etiket);
      return yeni;
    });
  }

  // Bir IP satırı ilk açıldığında sayfa dökümü istek üzerine (lazy) çekilir ve tekrar
  // kapatılıp açılsa da yeniden istek atılmaz; sonuç ipSayfalari önbelleğinde tutulur.
  function ipAcikKapatmayiDegistir(ip) {
    setAcikIpler((mevcut) => {
      const yeni = new Set(mevcut);
      if (yeni.has(ip)) yeni.delete(ip); else yeni.add(ip);
      return yeni;
    });
    setIpSayfalari((mevcut) => {
      if (mevcut[ip]) return mevcut;
      ipSayfalariniGetir(ip)
        .then((sonuc) => setIpSayfalari((guncel) => ({ ...guncel, [ip]: { yukleniyor: false, veri: sonuc ?? [] } })))
        .catch((istisna) => setIpSayfalari((guncel) => ({
          ...guncel, [ip]: { yukleniyor: false, hata: istisna.message || 'Sayfalar yüklenemedi.' }
        })));
      return { ...mevcut, [ip]: { yukleniyor: true } };
    });
  }

  const filtrelenmisIpToplamlari = useMemo(() => {
    if (!veri) return [];
    const terim = ipArama.trim().toLowerCase();
    if (!terim) return veri.istatistikler.ip_toplam_sureleri;
    return veri.istatistikler.ip_toplam_sureleri.filter((satir) => satir.ip_adresi.toLowerCase().includes(terim));
  }, [veri, ipArama]);

  // Bir IP genişletildiğinde altında açılan "hangi sayfalara girmiş" dökümü de kalabalık
  // olabildiği için kendi içinde ayrıca sayfalanır; her IP'nin sayfa numarası ayrı tutulur.
  const SAYFA_DOKUM_BOYUTU = 8;
  const [ipSayfaDokumSayfaNo, setIpSayfaDokumSayfaNo] = useState({});

  const IP_SAYFA_BOYUTU = 8;
  const [ipSayfaNo, setIpSayfaNo] = useState(1);
  const ipSayfaSayisi = Math.max(1, Math.ceil(filtrelenmisIpToplamlari.length / IP_SAYFA_BOYUTU));
  const gecerliIpSayfaNo = Math.min(ipSayfaNo, ipSayfaSayisi);
  const sayfalanmisIpToplamlari = filtrelenmisIpToplamlari.slice(
    (gecerliIpSayfaNo - 1) * IP_SAYFA_BOYUTU,
    gecerliIpSayfaNo * IP_SAYFA_BOYUTU
  );

  useEffect(() => {
    setIpSayfaNo(1);
  }, [ipArama]);

  useEffect(() => {
    let etkin = true;
    async function yukle() {
      try {
        const sonuc = await ziyaretYonetimVerisiniGetir(1);
        if (etkin) setVeri(sonuc);
      } catch (istisna) {
        if (etkin) setHata(istisna.message || 'İstatistikler yüklenemedi.');
      } finally {
        if (etkin) setYukleniyorMu(false);
      }
    }
    yukle();
    const zamanlayici = setInterval(yukle, 3000);
    return () => { etkin = false; clearInterval(zamanlayici); };
  }, []);

  if (yukleniyorMu) return <div className="yonetim-kategori yonetim-kategori__durum">İstatistikler yükleniyor…</div>;
  if (hata) return <div className="yonetim-kategori yonetim-kategori__durum yonetim-kategori__durum--hata">{hata}</div>;

  const { istatistikler } = veri;

  return (
    <div className="yonetim-kategori">
      <div className="yonetim-kategori__istatistikler">
        <IstatistikKarti ikon={Eye} renk="var(--yonetim-mavi)" etiket="Toplam Sayfa Görüntüleme" deger={istatistikler.toplam_goruntuleme} />
        <IstatistikKarti ikon={Fingerprint} renk="var(--yonetim-mavi)" etiket="Benzersiz IP" deger={istatistikler.benzersiz_ip_sayisi} />
        <IstatistikKarti ikon={TrendingUp} renk="var(--yonetim-yesil)" etiket="Bugünkü Görüntüleme" deger={istatistikler.bugunku_goruntuleme} />
      </div>

      <div className="istatistik-yan-yana">
        <div className="yonetim-kategori__kart istatistik-kart">
          <div className="istatistik-kart__baslik">
            <Globe aria-hidden="true" size={16} />
            <h3>En Çok Görüntülenen Sayfalar</h3>
          </div>
          <div className="yonetim-tablo-kaydir">
            <table className="yonetim-tablo">
              <thead><tr><th>Sayfa</th><th>Görüntüleme</th></tr></thead>
              <tbody>
                {istatistikler.en_cok_goruntulenen_sayfalar.map((satir) => (
                  <tr key={satir.yol}><td>{satir.yol}</td><td>{satir.adet}</td></tr>
                ))}
                {istatistikler.en_cok_goruntulenen_sayfalar.length === 0 && (
                  <tr><td colSpan={2} className="yonetim-tablo__bos">Henüz kayıt yok.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="yonetim-kategori__kart istatistik-kart">
          <div className="istatistik-kart__baslik">
            <Fingerprint aria-hidden="true" size={16} />
            <h3>IP Bazında Toplam Kalma Süresi</h3>
            <AramaKutusu deger={ipArama} onDegisim={setIpArama} yerTutucu="IP ara…" />
            <p className="istatistik-kart__not">
              Bir IP'nin sitede toplam ne kadar kaldığı; o IP'ye ait tüm sayfa görüntülemelerinin kalma
              sürelerinin toplamıdır (sekme başka bir sekmeye geçilse/arka plana alınsa da bu süre işlemeye devam
              eder). Bir satıra tıklayınca o IP'nin hangi sayfalara girdiğini görebilirsiniz.
            </p>
          </div>
          {sayfalanmisIpToplamlari.map((satir) => {
            const acik = acikIpler.has(satir.ip_adresi);
            const sayfaDurumu = ipSayfalari[satir.ip_adresi];
            const tumSayfalar = sayfaDurumu?.veri ?? [];
            const dokumSayfaSayisi = Math.max(1, Math.ceil(tumSayfalar.length / SAYFA_DOKUM_BOYUTU));
            const gecerliDokumSayfaNo = Math.min(ipSayfaDokumSayfaNo[satir.ip_adresi] ?? 1, dokumSayfaSayisi);
            const sayfalanmisSayfalar = tumSayfalar.slice(
              (gecerliDokumSayfaNo - 1) * SAYFA_DOKUM_BOYUTU,
              gecerliDokumSayfaNo * SAYFA_DOKUM_BOYUTU
            );
            return (
              <div className="ziyaret-grubu" key={satir.ip_adresi}>
                <button
                  type="button"
                  className="ziyaret-satiri"
                  onClick={() => ipAcikKapatmayiDegistir(satir.ip_adresi)}
                  aria-expanded={acik}
                >
                  <motion.span className="ziyaret-satiri__ok" animate={{ rotate: acik ? 90 : 0 }} transition={{ duration: .18 }}>
                    <ChevronRight aria-hidden="true" size={15} />
                  </motion.span>
                  <IpRozeti ip={satir.ip_adresi} />
                  <span className="ziyaret-satiri__bilgi"><strong>Toplam Süre:</strong> {kalmaSuresiniFormatla(Number(satir.toplam_saniye))}</span>
                  <span className="ziyaret-satiri__bilgi">{satir.goruntuleme_sayisi} görüntüleme</span>
                  <span className="ziyaret-satiri__aksiyon">{acik ? 'Kapatmak için tıklayın' : 'Açmak için tıklayın'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {acik && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .2, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="yonetim-tablo-kaydir">
                        <table className="yonetim-tablo istatistik-tablo">
                          <thead><tr><th>Sayfa</th><th>Ziyaret Sayısı</th><th>Toplam Süre</th><th>Son Ziyaret</th></tr></thead>
                          <tbody>
                            {sayfaDurumu?.yukleniyor && (
                              <tr><td colSpan={4} className="yonetim-tablo__bos">Yükleniyor…</td></tr>
                            )}
                            {sayfaDurumu?.hata && (
                              <tr><td colSpan={4} className="yonetim-tablo__bos">{sayfaDurumu.hata}</td></tr>
                            )}
                            {sayfalanmisSayfalar.map((sayfa) => (
                              <tr key={sayfa.yol}>
                                <td title={sayfa.yol}>{sayfa.yol}</td>
                                <td>{sayfa.adet}</td>
                                <td>{kalmaSuresiniFormatla(Number(sayfa.toplam_saniye))}</td>
                                <td>{tarihiFormatla(sayfa.son_ziyaret)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {dokumSayfaSayisi > 1 && (
                        <div className="sayfalama">
                          <button
                            type="button"
                            disabled={gecerliDokumSayfaNo <= 1}
                            onClick={() => setIpSayfaDokumSayfaNo((mevcut) => ({ ...mevcut, [satir.ip_adresi]: gecerliDokumSayfaNo - 1 }))}
                          >
                            Önceki
                          </button>
                          <span>{gecerliDokumSayfaNo} / {dokumSayfaSayisi}</span>
                          <button
                            type="button"
                            disabled={gecerliDokumSayfaNo >= dokumSayfaSayisi}
                            onClick={() => setIpSayfaDokumSayfaNo((mevcut) => ({ ...mevcut, [satir.ip_adresi]: gecerliDokumSayfaNo + 1 }))}
                          >
                            Sonraki
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {filtrelenmisIpToplamlari.length === 0 && (
            <p className="yonetim-tablo__bos">Henüz kalma süresi ölçülmüş kayıt yok.</p>
          )}
          {ipSayfaSayisi > 1 && (
            <div className="sayfalama">
              <button type="button" disabled={gecerliIpSayfaNo <= 1} onClick={() => setIpSayfaNo((n) => n - 1)}>
                Önceki
              </button>
              <span>{gecerliIpSayfaNo} / {ipSayfaSayisi}</span>
              <button type="button" disabled={gecerliIpSayfaNo >= ipSayfaSayisi} onClick={() => setIpSayfaNo((n) => n + 1)}>
                Sonraki
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="yonetim-kategori__kart istatistik-kart">
        <div className="istatistik-kart__baslik">
          <Eye aria-hidden="true" size={16} />
          <h3>Son Ziyaretler</h3>
          <AramaKutusu deger={ziyaretArama} onDegisim={setZiyaretArama} yerTutucu="IP, sayfa, tarayıcı ara…" />
          <p className="istatistik-kart__not">
            Tarayıcılar hiçbir web sitesine MAC adresini vermez (donanım katmanı, HTTP dışı); bu yüzden yalnızca IP
            adresi, tarayıcı bilgisi ve gezinme kaydı tutulur.
          </p>
        </div>
        {gunlereGoreGruplu.map((gun) => {
          const acik = acikGunler.has(gun.etiket);
          return (
            <div className="ziyaret-grubu" key={gun.etiket}>
              <button
                type="button"
                className="ziyaret-satiri"
                onClick={() => gunAcikKapatmayiDegistir(gun.etiket)}
                aria-expanded={acik}
              >
                <motion.span className="ziyaret-satiri__ok" animate={{ rotate: acik ? 90 : 0 }} transition={{ duration: .18 }}>
                  <ChevronRight aria-hidden="true" size={15} />
                </motion.span>
                <span className="ziyaret-satiri__tarih">{gun.etiket}</span>
                <span className="ziyaret-satiri__etiket">Ziyaret</span>
                <span className="ziyaret-satiri__bilgi">{gun.kayitlar.length} kayıt</span>
                <span className="ziyaret-satiri__bilgi"><strong>Saat aralığı:</strong> {gun.ilkSaat} – {gun.sonSaat}</span>
                <span className="ziyaret-satiri__bilgi"><strong>En çok:</strong> {gun.enCokYol} ({gun.enCokAdet})</span>
                <span className="ziyaret-satiri__aksiyon">{acik ? 'Kapatmak için tıklayın' : 'Açmak için tıklayın'}</span>
              </button>
              <AnimatePresence initial={false}>
                {acik && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="yonetim-tablo-kaydir">
                      <table className="yonetim-tablo istatistik-tablo istatistik-tablo--sola-yasli">
                        <thead>
                          <tr>
                            <th>Saat</th><th>IP Adresi</th><th>Geldiği Yer</th><th>Sayfa</th>
                            <th>Tarayıcı</th><th>Cihaz</th><th>Dil</th><th>Ekran</th><th>Saat Dilimi</th>
                            <th>Kalma Süresi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gun.kayitlar.map((kayit) => (
                            <tr key={kayit.id}>
                              <td>{tarihiFormatla(kayit.olusturulma_tarihi).split(' ').pop()}</td>
                              <td><IpRozeti ip={kayit.ip_adresi} /></td>
                              <td title={kayit.referans || ''}>{kayit.referans || '—'}</td>
                              <td title={kayit.yol}>{kayit.yol}</td>
                              <td>{tarayiciOzetle(kayit.kullanici_ajani)}</td>
                              <td><CihazRozeti ajan={kayit.kullanici_ajani} /></td>
                              <td>{kayit.dil || '—'}</td>
                              <td>{kayit.ekran_cozunurlugu || '—'}</td>
                              <td>{kayit.saat_dilimi || '—'}</td>
                              <td>{kalmaSuresiniFormatla(kayit.kalma_suresi_sn)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {gunlereGoreGruplu.length === 0 && <p className="yonetim-tablo__bos">Henüz ziyaret kaydı yok.</p>}
      </div>
    </div>
  );
}
