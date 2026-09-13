import { useEffect, useState } from 'react';
import { FilePlus2, Pencil, RotateCcw, ScrollText, Trash2 } from 'lucide-react';
import Bildirimler from '../bilesenler/Bildirimler';
import { islemYonetimVerisiniGetir, kategoriGeriAl, silinenKategorileriGetir } from '../servisler/api';
import '../stiller/yonetim-kategori.css';
import '../stiller/istatistikler.css';

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

function yoluUret(kategori) {
  return kategori.grup_baslik
    ? `Kategori Yönetimi > ${kategori.grup_baslik} > ${kategori.baslik}`
    : `Kategori Yönetimi > ${kategori.baslik}`;
}

const GUN_MS = 24 * 60 * 60 * 1000;

// 7 günlük kalıcı silme süresine kalan zamanı gün/saat/dk/sn olarak her saniye güncelleyen canlı sayaç.
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
      {gun} gün {String(saat).padStart(2, '0')} sa {String(dakika).padStart(2, '0')} dk {String(saniye).padStart(2, '0')} sn
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
    const zamanlayici = setInterval(yukle, 20000);
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
          <h3>Admin İşlem Kayıtları</h3>
          <p className="istatistik-kart__not">
            Henüz bir giriş/oturum sistemi olmadığı için işlemler bir kullanıcı adına değil, yalnızca isteğin
            geldiği IP adresine bağlanır.
          </p>
        </div>
        <div className="yonetim-tablo-kaydir">
          <table className="yonetim-tablo istatistik-tablo">
            <thead>
              <tr><th>Tarih</th><th>IP Adresi</th><th>Eylem</th><th>Detay</th></tr>
            </thead>
            <tbody>
              {kayitlar.map((kayit) => {
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
                    <td title={kayit.detay || ''}>{kayit.detay || '—'}</td>
                  </tr>
                );
              })}
              {kayitlar.length === 0 && (
                <tr><td colSpan={4} className="yonetim-tablo__bos">Henüz işlem kaydı yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
