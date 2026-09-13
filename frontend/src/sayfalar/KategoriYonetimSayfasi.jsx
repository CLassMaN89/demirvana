import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Boxes, ChevronDown, Eye, FolderTree, Grid2X2, Home,
  Pencil, Plus, Search, ShieldOff, Trash2
} from 'lucide-react';
import { altOgeIkonuGetir, grupIkonuGetir } from '../bilesenler/UrunMenuIkonlari';
import Modal from '../bilesenler/Modal';
import { kategoriEkle, kategoriGuncelle, kategoriSil, kategoriYonetimVerisiniGetir } from '../servisler/api';
import '../stiller/yonetim-kategori.css';

function tarihiFormatla(deger) {
  if (!deger) return '—';
  const tarih = new Date(deger.replace(' ', 'T'));
  if (Number.isNaN(tarih.getTime())) return '—';
  return tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function KategoriFormu({ baslangicDegeri, gonderiliyorMu, hata, onIptal, onKaydet }) {
  const [baslik, setBaslik] = useState(baslangicDegeri?.baslik ?? '');
  const [aktifMi, setAktifMi] = useState(baslangicDegeri ? baslangicDegeri.aktif_mi !== 0 : true);

  return (
    <form
      className="yonetim-form"
      onSubmit={(olay) => {
        olay.preventDefault();
        onKaydet({ baslik: baslik.trim(), aktif_mi: aktifMi ? 1 : 0 });
      }}
    >
      <label className="yonetim-form__alan">
        <span>Kategori Adı</span>
        <input
          type="text"
          value={baslik}
          onChange={(olay) => setBaslik(olay.target.value)}
          placeholder="Örn. Küresel Vanalar"
          autoFocus
          required
          minLength={2}
        />
      </label>
      {baslangicDegeri && (
        <label className="yonetim-form__onay">
          <input type="checkbox" checked={aktifMi} onChange={(olay) => setAktifMi(olay.target.checked)} />
          <span>Aktif (pasif kategoriler sitede ve filtrelerde görünmez)</span>
        </label>
      )}
      {hata && <p className="yonetim-form__hata">{hata}</p>}
      <div className="yonetim-form__eylemler">
        <button type="button" className="yonetim-form__iptal" onClick={onIptal} disabled={gonderiliyorMu}>
          Vazgeç
        </button>
        <button type="submit" className="yonetim-form__kaydet" disabled={gonderiliyorMu || baslik.trim().length < 2}>
          {gonderiliyorMu ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}

function SilmeOnayi({ kategori, gonderiliyorMu, hata, onIptal, onOnayla }) {
  return (
    <div className="yonetim-form">
      <p>
        <strong>{kategori.baslik}</strong> kategorisini pasif hale getirmek istediğinize emin misiniz? Kategori sitede
        ve ürün filtrelerinde görünmemeye başlar; daha sonra düzenle ekranından tekrar aktif edebilirsiniz.
      </p>
      {hata && <p className="yonetim-form__hata">{hata}</p>}
      <div className="yonetim-form__eylemler">
        <button type="button" className="yonetim-form__iptal" onClick={onIptal} disabled={gonderiliyorMu}>
          Vazgeç
        </button>
        <button type="button" className="yonetim-form__sil" onClick={onOnayla} disabled={gonderiliyorMu}>
          {gonderiliyorMu ? 'Siliniyor…' : 'Evet, Pasif Yap'}
        </button>
      </div>
    </div>
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

export default function KategoriYonetimSayfasi({ veriYenile } = {}) {
  const [gruplar, setGruplar] = useState([]);
  const [yukleniyorMu, setYukleniyorMu] = useState(true);
  const [yuklemeHatasi, setYuklemeHatasi] = useState(null);
  const [acikGruplar, setAcikGruplar] = useState(() => new Set());
  const [arama, setArama] = useState('');
  const [filtre, setFiltre] = useState('tumu');
  const [form, setForm] = useState(null); // { mod: 'ekle'|'duzenle', grupId, kategori }
  const [silinecek, setSilinecek] = useState(null);
  const [gonderiliyorMu, setGonderiliyorMu] = useState(false);
  const [hata, setHata] = useState(null);

  async function veriyiYukle() {
    setYuklemeHatasi(null);
    try {
      const sonuc = await kategoriYonetimVerisiniGetir();
      setGruplar(sonuc ?? []);
      setAcikGruplar((mevcut) => (mevcut.size > 0 ? mevcut : new Set(sonuc?.[0] ? [sonuc[0].id] : [])));
    } catch (istisna) {
      setYuklemeHatasi(istisna.message || 'Kategoriler yüklenemedi.');
    } finally {
      setYukleniyorMu(false);
    }
  }

  useEffect(() => {
    veriyiYukle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const istatistikler = useMemo(() => {
    const tumKategoriler = gruplar.flatMap((grup) => grup.alt_ogeler ?? []);
    return {
      toplamGrup: gruplar.length,
      toplamKategori: tumKategoriler.length,
      toplamUrun: tumKategoriler.reduce((toplam, kategori) => toplam + (kategori.urun_sayisi ?? 0), 0),
      pasifKategori: tumKategoriler.filter((kategori) => kategori.aktif_mi === 0).length
    };
  }, [gruplar]);

  const aramaKucuk = arama.trim().toLocaleLowerCase('tr-TR');
  function kategorileriFiltrele(kategoriler) {
    return (kategoriler ?? []).filter((kategori) => {
      if (filtre === 'aktif' && kategori.aktif_mi === 0) return false;
      if (filtre === 'pasif' && kategori.aktif_mi !== 0) return false;
      if (aramaKucuk && !kategori.baslik.toLocaleLowerCase('tr-TR').includes(aramaKucuk)) return false;
      return true;
    });
  }

  function grupAcikKapatmayiDegistir(grupId) {
    setAcikGruplar((mevcut) => {
      const yeni = new Set(mevcut);
      if (yeni.has(grupId)) yeni.delete(grupId); else yeni.add(grupId);
      return yeni;
    });
  }

  async function formuGonder(alanlar) {
    setGonderiliyorMu(true);
    setHata(null);
    try {
      if (form.mod === 'ekle') {
        await kategoriEkle(form.grupId, { baslik: alanlar.baslik });
      } else {
        await kategoriGuncelle(form.kategori.id, alanlar);
      }
      setForm(null);
      await veriyiYukle();
      veriYenile?.();
    } catch (istisna) {
      setHata(istisna.message || 'İşlem tamamlanamadı.');
    } finally {
      setGonderiliyorMu(false);
    }
  }

  async function silmeyiOnayla() {
    setGonderiliyorMu(true);
    setHata(null);
    try {
      await kategoriSil(silinecek.id);
      setSilinecek(null);
      await veriyiYukle();
      veriYenile?.();
    } catch (istisna) {
      setHata(istisna.message || 'Kategori pasif hale getirilemedi.');
    } finally {
      setGonderiliyorMu(false);
    }
  }

  if (yukleniyorMu) {
    return <div className="yonetim-kategori yonetim-kategori__durum">Kategoriler yükleniyor…</div>;
  }

  if (yuklemeHatasi) {
    return <div className="yonetim-kategori yonetim-kategori__durum yonetim-kategori__durum--hata">{yuklemeHatasi}</div>;
  }

  return (
    <div className="yonetim-kategori">
      <nav className="yonetim-kategori__yol-izi" aria-label="Sayfa yolu">
        <Link to="/admin"><Home aria-hidden="true" size={13} /> Ana Sayfa</Link>
        <span>/</span>
        <span>Kategoriler</span>
      </nav>

      <div className="yonetim-kategori__ust-satir">
        <div className="yonetim-kategori__baslik">
          <h1>Kategori Yönetimi</h1>
          <p>Ürün kategorilerinizi gruplar halinde yönetin, düzenleyin ve yeni kategoriler ekleyin.</p>
        </div>
        <button
          type="button"
          className="yonetim-kategori__ekle-buton"
          onClick={() => { setHata(null); setForm({ mod: 'ekle', grupId: gruplar[0]?.id }); }}
          disabled={!gruplar[0]}
        >
          <Plus aria-hidden="true" size={16} /> Yeni Kategori Ekle
        </button>
      </div>

      <div className="yonetim-kategori__istatistikler">
        <IstatistikKarti ikon={Grid2X2} renk="var(--yonetim-mavi)" etiket="Toplam Grup" deger={istatistikler.toplamGrup} />
        <IstatistikKarti ikon={FolderTree} renk="var(--yonetim-mavi)" etiket="Toplam Kategori" deger={istatistikler.toplamKategori} />
        <IstatistikKarti ikon={Boxes} renk="var(--yonetim-yesil)" etiket="Toplam Ürün" deger={istatistikler.toplamUrun} />
        <IstatistikKarti ikon={ShieldOff} renk="var(--yonetim-kirmizi)" etiket="Pasif Kategori" deger={istatistikler.pasifKategori} />
      </div>

      <div className="yonetim-kategori__arac-cubugu">
        <label className="yonetim-kategori__arama">
          <Search aria-hidden="true" size={16} />
          <input type="text" value={arama} onChange={(olay) => setArama(olay.target.value)} placeholder="Kategori ara…" />
        </label>
        <div className="yonetim-kategori__filtreler" role="tablist" aria-label="Duruma göre filtrele">
          {[
            ['tumu', `Tümü ${istatistikler.toplamKategori}`],
            ['aktif', `Sadece Aktif ${istatistikler.toplamKategori - istatistikler.pasifKategori}`],
            ['pasif', `Sadece Pasif ${istatistikler.pasifKategori}`]
          ].map(([deger, etiket]) => (
            <button
              key={deger}
              type="button"
              role="tab"
              aria-selected={filtre === deger}
              className={`yonetim-kategori__filtre${filtre === deger ? ' yonetim-kategori__filtre--aktif' : ''}`}
              onClick={() => setFiltre(deger)}
            >
              {etiket}
            </button>
          ))}
        </div>
      </div>

      {gruplar.map((grup) => {
        const GrupIkonu = grupIkonuGetir(grup.baslik);
        const kategoriler = kategorileriFiltrele(grup.alt_ogeler);
        const acik = acikGruplar.has(grup.id);
        const grupUrunToplami = (grup.alt_ogeler ?? []).reduce((toplam, kategori) => toplam + (kategori.urun_sayisi ?? 0), 0);

        return (
          <section className="yonetim-kategori__grup" key={grup.id}>
            <button
              type="button"
              className="yonetim-kategori__grup-baslik"
              onClick={() => grupAcikKapatmayiDegistir(grup.id)}
              aria-expanded={acik}
            >
              <motion.span
                className="yonetim-kategori__grup-ok"
                animate={{ rotate: acik ? 0 : -90 }}
                transition={{ duration: .2 }}
              >
                <ChevronDown aria-hidden="true" size={16} />
              </motion.span>
              <span className="yonetim-kategori__grup-ikon"><GrupIkonu aria-hidden="true" /></span>
              <span className="yonetim-kategori__grup-metin">
                <strong>{grup.baslik}</strong>
                <small>{(grup.alt_ogeler ?? []).length} kategori • {grupUrunToplami} ürün</small>
              </span>
              <span className={`yonetim-kategori__durum-rozeti${grup.aktif_mi === 0 ? ' yonetim-kategori__durum-rozeti--pasif' : ''}`}>
                <span className="yonetim-kategori__durum-noktasi" aria-hidden="true" /> {grup.aktif_mi === 0 ? 'Pasif' : 'Aktif'}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {acik && (
                <motion.div
                  key="icerik"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: .22, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                <div className="yonetim-tablo-kaydir">
                <table className="yonetim-tablo">
                  <thead>
                    <tr>
                      <th>Kategori Adı</th>
                      <th>Ürün Sayısı</th>
                      <th>Son Güncelleme</th>
                      <th>Durum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {kategoriler.map((kategori) => {
                        const Ikon = altOgeIkonuGetir(kategori.baslik);
                        const pasif = kategori.aktif_mi === 0;
                        return (
                          <motion.tr
                            key={kategori.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: .25 }}
                          >
                            <td>
                              <div className="yonetim-tablo__ad-hucre">
                                <span className="yonetim-tablo__ikon"><Ikon aria-hidden="true" /></span>
                                {kategori.baslik}
                              </div>
                            </td>
                            <td>{kategori.urun_sayisi}</td>
                            <td>{tarihiFormatla(kategori.guncellenme_tarihi)}</td>
                            <td>
                              <span className={`yonetim-kategori__durum-rozeti${pasif ? ' yonetim-kategori__durum-rozeti--pasif' : ''}`}>
                                <span className="yonetim-kategori__durum-noktasi" aria-hidden="true" /> {pasif ? 'Pasif' : 'Aktif'}
                              </span>
                            </td>
                            <td>
                              <div className="yonetim-tablo__eylemler">
                                <Link className="yonetim-tablo__eylem-buton yonetim-tablo__eylem-buton--goruntule" to={`/urunler?kategori=${encodeURIComponent(kategori.baslik)}`} target="_blank" rel="noopener noreferrer">
                                  <Eye aria-hidden="true" size={13} /> Görüntüle
                                </Link>
                                <button
                                  type="button"
                                  className="yonetim-tablo__eylem-buton yonetim-tablo__eylem-buton--duzenle"
                                  onClick={() => { setHata(null); setForm({ mod: 'duzenle', kategori }); }}
                                >
                                  <Pencil aria-hidden="true" size={13} /> Düzenle
                                </button>
                                <button
                                  type="button"
                                  className="yonetim-tablo__eylem-buton yonetim-tablo__eylem-buton--sil"
                                  onClick={() => { setHata(null); setSilinecek(kategori); }}
                                >
                                  <Trash2 aria-hidden="true" size={13} /> Sil
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                    {kategoriler.length === 0 && (
                      <tr>
                        <td colSpan={5} className="yonetim-tablo__bos">
                          {arama || filtre !== 'tumu' ? 'Bu filtreyle eşleşen kategori yok.' : 'Bu grupta henüz kategori yok.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}

      {form && (
        <Modal baslik={form.mod === 'ekle' ? 'Yeni Kategori Ekle' : 'Kategoriyi Düzenle'} onKapat={() => setForm(null)}>
          <KategoriFormu
            baslangicDegeri={form.kategori}
            gonderiliyorMu={gonderiliyorMu}
            hata={hata}
            onIptal={() => setForm(null)}
            onKaydet={formuGonder}
          />
        </Modal>
      )}

      {silinecek && (
        <Modal baslik="Kategoriyi Pasif Yap" onKapat={() => setSilinecek(null)}>
          <SilmeOnayi
            kategori={silinecek}
            gonderiliyorMu={gonderiliyorMu}
            hata={hata}
            onIptal={() => setSilinecek(null)}
            onOnayla={silmeyiOnayla}
          />
        </Modal>
      )}
    </div>
  );
}
