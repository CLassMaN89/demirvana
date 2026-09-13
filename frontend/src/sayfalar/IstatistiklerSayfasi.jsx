import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Eye, Fingerprint, Globe, TrendingUp } from 'lucide-react';
import { ziyaretYonetimVerisiniGetir } from '../servisler/api';
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

// Kısa, kaba bir user-agent özetleyici: tam dizeyi tabloya sığdırmak yerine tarayıcı/işletim
// sistemi adını çıkarır. Kesin cihaz tespiti hedeflenmez, yalnızca okunabilir bir özet sunar.
function tarayiciOzetle(ajan) {
  if (!ajan) return 'Bilinmiyor';
  if (/curl|postman|python-requests/i.test(ajan)) return 'Otomasyon/Araç';
  const tarayici = /Edg\//.test(ajan) ? 'Edge'
    : /Chrome\//.test(ajan) ? 'Chrome'
    : /Firefox\//.test(ajan) ? 'Firefox'
    : /Safari\//.test(ajan) ? 'Safari'
    : 'Diğer';
  const sistem = /Windows/.test(ajan) ? 'Windows'
    : /Android/.test(ajan) ? 'Android'
    : /iPhone|iPad/.test(ajan) ? 'iOS'
    : /Mac OS/.test(ajan) ? 'macOS'
    : /Linux/.test(ajan) ? 'Linux'
    : '';
  return sistem ? `${tarayici} · ${sistem}` : tarayici;
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

  const gunlereGoreGruplu = useMemo(() => {
    if (!veri) return [];
    const gruplar = new Map();
    for (const kayit of veri.kayitlar) {
      const etiket = gunEtiketiUret(kayit.olusturulma_tarihi);
      if (!gruplar.has(etiket)) gruplar.set(etiket, []);
      gruplar.get(etiket).push(kayit);
    }
    return [...gruplar.entries()];
  }, [veri]);

  useEffect(() => {
    if (gunlereGoreGruplu.length > 0) {
      setAcikGunler((mevcut) => (mevcut.size > 0 ? mevcut : new Set([gunlereGoreGruplu[0][0]])));
    }
  }, [gunlereGoreGruplu]);

  function gunAcikKapatmayiDegistir(etiket) {
    setAcikGunler((mevcut) => {
      const yeni = new Set(mevcut);
      if (yeni.has(etiket)) yeni.delete(etiket); else yeni.add(etiket);
      return yeni;
    });
  }

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
    const zamanlayici = setInterval(yukle, 20000);
    return () => { etkin = false; clearInterval(zamanlayici); };
  }, []);

  if (yukleniyorMu) return <div className="yonetim-kategori yonetim-kategori__durum">İstatistikler yükleniyor…</div>;
  if (hata) return <div className="yonetim-kategori yonetim-kategori__durum yonetim-kategori__durum--hata">{hata}</div>;

  const { istatistikler, kayitlar } = veri;

  return (
    <div className="yonetim-kategori">
      <div className="yonetim-kategori__istatistikler">
        <IstatistikKarti ikon={Eye} renk="var(--yonetim-mavi)" etiket="Toplam Sayfa Görüntüleme" deger={istatistikler.toplam_goruntuleme} />
        <IstatistikKarti ikon={Fingerprint} renk="var(--yonetim-mavi)" etiket="Benzersiz IP" deger={istatistikler.benzersiz_ip_sayisi} />
        <IstatistikKarti ikon={TrendingUp} renk="var(--yonetim-yesil)" etiket="Bugünkü Görüntüleme" deger={istatistikler.bugunku_goruntuleme} />
      </div>

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
          <Eye aria-hidden="true" size={16} />
          <h3>Son Ziyaretler</h3>
          <p className="istatistik-kart__not">
            Tarayıcılar hiçbir web sitesine MAC adresini vermez (donanım katmanı, HTTP dışı); bu yüzden yalnızca IP
            adresi, tarayıcı bilgisi ve gezinme kaydı tutulur.
          </p>
        </div>
        {gunlereGoreGruplu.map(([etiket, gununKayitlari]) => {
          const acik = acikGunler.has(etiket);
          return (
            <div className="istatistik-akordiyon" key={etiket}>
              <button
                type="button"
                className="istatistik-akordiyon__baslik"
                onClick={() => gunAcikKapatmayiDegistir(etiket)}
                aria-expanded={acik}
              >
                <motion.span className="istatistik-akordiyon__ok" animate={{ rotate: acik ? 0 : -90 }} transition={{ duration: .18 }}>
                  <ChevronDown aria-hidden="true" size={15} />
                </motion.span>
                <strong>{etiket}</strong>
                <span className="istatistik-akordiyon__sayi">{gununKayitlari.length} ziyaret</span>
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
                          <tr><th>Saat</th><th>IP Adresi</th><th>Sayfa</th><th>Geldiği Yer</th><th>Tarayıcı</th></tr>
                        </thead>
                        <tbody>
                          {gununKayitlari.map((kayit) => (
                            <tr key={kayit.id}>
                              <td>{tarihiFormatla(kayit.olusturulma_tarihi).split(' ').pop()}</td>
                              <td>{kayit.ip_adresi}</td>
                              <td title={kayit.yol}>{kayit.yol}</td>
                              <td title={kayit.referans || ''}>{kayit.referans || '—'}</td>
                              <td>{tarayiciOzetle(kayit.kullanici_ajani)}</td>
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
