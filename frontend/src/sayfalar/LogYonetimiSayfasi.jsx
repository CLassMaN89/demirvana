import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Eye, FilePlus2, Pencil, RotateCcw, ScrollText, Trash2 } from 'lucide-react';
import Bildirimler from '../bilesenler/Bildirimler';
import { FlipIkiHane, FlipKart } from '../bilesenler/FlipKart';
import { islemYonetimVerisiniGetir, kategoriGeriAl, silinenKategorileriGetir } from '../servisler/api';
import '../stiller/yonetim-kategori.css';
import '../stiller/istatistikler.css';
import '../stiller/yonetim.css';

const EYLEM_META = {
  kategori_ekle: { etiket: 'Kategori eklendi', ikon: FilePlus2, sinif: 'log-eylem--ekle' },
  kategori_guncelle: { etiket: 'Kategori güncellendi', ikon: Pencil, sinif: 'log-eylem--guncelle' },
  kategori_sil: { etiket: 'Kategori silindi', ikon: Trash2, sinif: 'log-eylem--sil' },
  kategori_geri_al: { etiket: 'Kategori geri alındı', ikon: RotateCcw, sinif: 'log-eylem--ekle' }
};

function tarihiFormatla(deger) {
  if (!deger) return '—';
  const tarih = new Date(deger.replace(' ', 'T'));
  if (Number.isNaN(tarih.getTime())) return '—';
  return tarih.toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

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

function yoluUret(kategori) {
  return kategori.grup_baslik
    ? `Kategori Yönetimi > ${kategori.grup_baslik} > ${kategori.baslik}`
    : `Kategori Yönetimi > ${kategori.baslik}`;
}

// Kategori kalıcı olarak silinmişse (Çöp Kutusu'ndaki 7 günlük süre de dolmuşsa) backend bu
// alanı NULL döndürür; o durumda gösterilecek gerçek bir sayfa olmadığı için ikon render edilmez.
function KategoriGoruntuleLinki({ baglanti }) {
  if (!baglanti) return <span className="istatistik-tablo__bos-ikon" aria-hidden="true">—</span>;
  const yol = `/urunler/${baglanti}`;
  return (
    <a
      className="sayfa-goruntule-linki"
      href={yol}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${yol} kategorisini web sitesinde aç`}
      title="Kategoriyi web sitesinde aç"
    >
      <Eye aria-hidden="true" size={15} />
    </a>
  );
}

const GUN_MS = 24 * 60 * 60 * 1000;

// 7 günlük kalıcı silme süresine kalan zamanı gün/saat/dk/sn olarak her saniye güncelleyen canlı
// sayaç; saat/dakika/saniye üst bardaki saatle aynı (siyah/antrasit) flip-kartlarla, gün ise
// ayırt edilmesi için ayrı (mavi) renkte gösterilir — bkz. FlipKart.jsx.
function GeriSayim({ silinmeTarihi }) {
  const bitisZamani = new Date(silinmeTarihi.replace(' ', 'T')).getTime() + 7 * GUN_MS;
  const [kalanMs, setKalanMs] = useState(() => bitisZamani - Date.now());

  useEffect(() => {
    const zamanlayici = setInterval(() => setKalanMs(bitisZamani - Date.now()), 1000);
    return () => clearInterval(zamanlayici);
  }, [bitisZamani]);

  if (kalanMs <= 0) return <span className="geri-sayim geri-sayim--doldu">Süresi doldu</span>;

  const toplamSaniye = Math.floor(kalanMs / 1000);
  const gun = Math.floor(toplamSaniye / 86400);
  const saat = Math.floor((toplamSaniye % 86400) / 3600);
  const dakika = Math.floor((toplamSaniye % 3600) / 60);
  const saniye = toplamSaniye % 60;

  return (
    <span className="geri-sayim">
      <span className="sayac-birim">
        <FlipKart deger={String(gun)} renk="var(--yonetim-mavi)" kucuk />
        <small>gün</small>
      </span>
      <span className="flip-kart-grup flip-kart-grup--saat">
        <FlipIkiHane deger={saat} kucuk />
        <FlipIkiHane deger={dakika} kucuk />
        <FlipIkiHane deger={saniye} kucuk />
      </span>
    </span>
  );
}

export default function LogYonetimiSayfasi() {
  const [kayitlar, setKayitlar] = useState([]);
  const [silinenler, setSilinenler] = useState([]);
  const [yukleniyorMu, setYukleniyorMu] = useState(true);
  const [hata, setHata] = useState(null);
  const [gonderiliyorId, setGonderiliyorId] = useState(null);
  const [bildirimler, setBildirimler] = useState([]);
  const [acikGunler, setAcikGunler] = useState(() => new Set());

  const gunlereGoreGruplu = useMemo(() => {
    const gruplar = new Map();
    for (const kayit of kayitlar) {
      const etiket = gunEtiketiUret(kayit.olusturulma_tarihi);
      if (!gruplar.has(etiket)) gruplar.set(etiket, []);
      gruplar.get(etiket).push(kayit);
    }
    return [...gruplar.entries()].map(([etiket, gununKayitlari]) => {
      const eylemSayaci = new Map();
      for (const kayit of gununKayitlari) eylemSayaci.set(kayit.eylem, (eylemSayaci.get(kayit.eylem) ?? 0) + 1);
      const [enCokEylem, enCokAdet] = [...eylemSayaci.entries()].sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
      const enCokMeta = EYLEM_META[enCokEylem] ?? { etiket: enCokEylem ?? '—' };
      return { etiket, kayitlar: gununKayitlari, enCokEtiket: enCokMeta.etiket, enCokAdet };
    });
  }, [kayitlar]);

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

  function bildirimEkle(tur, baslik, mesaj) {
    const id = `${Date.now()}-${Math.random()}`;
    setBildirimler((mevcut) => [...mevcut, { id, tur, baslik, mesaj }]);
    setTimeout(() => setBildirimler((mevcut) => mevcut.filter((b) => b.id !== id)), 4000);
  }
  function bildirimKapat(id) {
    setBildirimler((mevcut) => mevcut.filter((b) => b.id !== id));
  }

  async function yukle() {
    try {
      const [logSonucu, silinenSonucu] = await Promise.all([
        islemYonetimVerisiniGetir(1),
        silinenKategorileriGetir()
      ]);
      setKayitlar(logSonucu.kayitlar ?? []);
      setSilinenler(silinenSonucu ?? []);
    } catch (istisna) {
      setHata(istisna.message || 'Loglar yüklenemedi.');
    } finally {
      setYukleniyorMu(false);
    }
  }

  useEffect(() => {
    yukle();
    const zamanlayici = setInterval(yukle, 3000);
    return () => clearInterval(zamanlayici);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function geriAl(id) {
    setGonderiliyorId(id);
    try {
      await kategoriGeriAl(id);
      await yukle();
      bildirimEkle('uyari', 'Kategori geri alındı', 'Kategori işlemi geri alınmıştır.');
    } catch (istisna) {
      const mesaj = istisna.message || 'Kategori geri alınamadı.';
      setHata(mesaj);
      bildirimEkle('hata', 'Geri alma başarısız', mesaj);
    } finally {
      setGonderiliyorId(null);
    }
  }

  if (yukleniyorMu) return <div className="yonetim-kategori yonetim-kategori__durum">Loglar yükleniyor…</div>;
  if (hata) return <div className="yonetim-kategori yonetim-kategori__durum yonetim-kategori__durum--hata">{hata}</div>;

  return (
    <div className="yonetim-kategori">
      <Bildirimler bildirimler={bildirimler} onKapat={bildirimKapat} />

      {silinenler.length > 0 && (
        <div className="yonetim-kategori__kart istatistik-kart">
          <div className="istatistik-kart__baslik">
            <Trash2 aria-hidden="true" size={16} />
            <h3>Çöp Kutusu</h3>
            <p className="istatistik-kart__not">
              Silinen kategoriler 7 gün boyunca burada tutulur ve geri alınabilir; süre dolunca kalıcı olarak silinir.
            </p>
          </div>
          <div className="yonetim-tablo-kaydir">
            <table className="yonetim-tablo istatistik-tablo">
              <thead>
                <tr><th>Kategori</th><th>Silinme Tarihi</th><th>Kalan Süre</th><th>İşlem</th></tr>
              </thead>
              <tbody>
                {silinenler.map((kategori) => (
                  <tr key={kategori.id}>
                    <td>{yoluUret(kategori)}</td>
                    <td>{tarihiFormatla(kategori.silinme_tarihi)}</td>
                    <td><GeriSayim silinmeTarihi={kategori.silinme_tarihi} /></td>
                    <td>
                      <button
                        type="button"
                        className="yonetim-pill-buton"
                        disabled={gonderiliyorId === kategori.id}
                        onClick={() => geriAl(kategori.id)}
                      >
                        <RotateCcw aria-hidden="true" size={13} />
                        <span>{gonderiliyorId === kategori.id ? 'Geri alınıyor…' : 'Geri Al'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="yonetim-kategori__kart istatistik-kart">
        <div className="istatistik-kart__baslik">
          <ScrollText aria-hidden="true" size={16} />
          <h3>Admin İşlem Logları</h3>
          <p className="istatistik-kart__not">
            Henüz bir giriş/oturum sistemi olmadığı için işlemler bir kullanıcı adına değil, yalnızca isteğin
            geldiği IP adresine bağlanır.
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
                <span className="ziyaret-satiri__etiket">İşlem</span>
                <span className="ziyaret-satiri__bilgi">{gun.kayitlar.length} kayıt</span>
                <span className="ziyaret-satiri__bilgi"><strong>En çok:</strong> {gun.enCokEtiket} ({gun.enCokAdet})</span>
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
                        <thead>
                          <tr><th>Tarih</th><th>IP Adresi</th><th>Eylem</th><th>Detay</th><th>Kategoriyi Görüntüle</th></tr>
                        </thead>
                        <tbody>
                          {gun.kayitlar.map((kayit) => {
                            const meta = EYLEM_META[kayit.eylem] ?? { etiket: kayit.eylem, ikon: ScrollText, sinif: '' };
                            const Ikon = meta.ikon;
                            return (
                              <tr key={kayit.id}>
                                <td>{tarihiFormatla(kayit.olusturulma_tarihi)}</td>
                                <td>{kayit.ip_adresi}</td>
                                <td>
                                  <span className={`log-eylem ${meta.sinif}`}>
                                    <Ikon aria-hidden="true" size={13} /> {meta.etiket}
                                  </span>
                                </td>
                                <td className="istatistik-tablo__sol-hucre" title={kayit.detay || ''}>{kayit.detay || '—'}</td>
                                <td><KategoriGoruntuleLinki baglanti={kayit.kategori_baglantisi} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {gunlereGoreGruplu.length === 0 && <p className="yonetim-tablo__bos">Henüz işlem kaydı yok.</p>}
      </div>
    </div>
  );
}
