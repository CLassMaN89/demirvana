import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Boxes, ChevronRight, Eye, FolderTree, LayoutGrid, MoreVertical,
  Pencil, Plus, Search, Trash2
} from 'lucide-react';
import { altOgeIkonuGetir, grupIkonuGetir } from '../bilesenler/UrunMenuIkonlari';
import Bildirimler from '../bilesenler/Bildirimler';
import Modal from '../bilesenler/Modal';
import { kategoriEkle, kategoriGuncelle, kategoriSil, kategoriYonetimVerisiniGetir } from '../servisler/api';
import '../stiller/yonetim-kategori.css';

// Grup kartlarının fotoğrafı ve arkaplan rengi; bu bilgiler menu_alt_ogeleri tablosunda tutulmadığı
// (yalnızca başlık/bağlantı/sıralama içerir) için üç ana grup adına göre eşlenir.
const GRUP_META = {
  Vana: {
    aciklama: 'Su, buhar, gaz ve endüstriyel akışkanlar için vana çözümleri',
    arkaplan: '#ecf3fd',
    gorsel: '/assets/kategori21.png'
  },
  Aktüatör: {
    aciklama: 'Pnömatik ve elektrikli aktüatör çözümleri',
    arkaplan: '#fdf6ef',
    gorsel: '/assets/kategori-1.png'
  },
  Otomasyon: {
    aciklama: 'Vana otomasyon ve kontrol sistemleri',
    arkaplan: '#f2fbf7',
    gorsel: '/assets/kategori3.png'
  }
};

function tarihiFormatla(deger) {
  if (!deger) return '—';
  const tarih = new Date(deger.replace(' ', 'T'));
  if (Number.isNaN(tarih.getTime())) return '—';
  return tarih.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

function KategoriFormu({ baslangicDegeri, gonderiliyorMu, hata, onIptal, onKaydet }) {
  const [baslik, setBaslik] = useState(baslangicDegeri?.baslik ?? '');

  return (
    <form
      className="yonetim-form"
      onSubmit={(olay) => {
        olay.preventDefault();
        onKaydet({ baslik: baslik.trim() });
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
        <strong>{kategori.baslik}</strong> kategorisini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri
        alınamaz.
      </p>
      {hata && <p className="yonetim-form__hata">{hata}</p>}
      <div className="yonetim-form__eylemler">
        <button type="button" className="yonetim-form__iptal" onClick={onIptal} disabled={gonderiliyorMu}>
          Vazgeç
        </button>
        <button type="button" className="yonetim-form__sil" onClick={onOnayla} disabled={gonderiliyorMu}>
          {gonderiliyorMu ? 'Siliniyor…' : 'Evet, Sil'}
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

function DurumDugmesi({ pasif, gonderiliyorMu, onDegistir }) {
  return (
    <button
      type="button"
      className="yonetim-durum-hucre"
      onClick={onDegistir}
      disabled={gonderiliyorMu}
      role="switch"
      aria-checked={!pasif}
      aria-label={pasif ? 'Pasif — aktif yapmak için tıklayın' : 'Aktif — pasif yapmak için tıklayın'}
    >
      <span className={`yonetim-toggle${pasif ? '' : ' yonetim-toggle--acik'}`}>
        <motion.span className="yonetim-toggle__topuz" layout transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
      </span>
      <span className={`yonetim-durum-etiket${pasif ? ' yonetim-durum-etiket--pasif' : ''}`}>{pasif ? 'Pasif' : 'Aktif'}</span>
    </button>
  );
}

function GrupKarti({ grup, gonderiliyorMu, onDuzenle, onEkle, onSil, onGrupDuzenle, onDurumDegistir }) {
  const [arama, setArama] = useState('');
  const meta = GRUP_META[grup.baslik] ?? { aciklama: '', arkaplan: '#f4f7fc', gorsel: null };
  const GrupIkonu = grupIkonuGetir(grup.baslik);
  const kategoriler = grup.alt_ogeler ?? [];
  const urunToplami = kategoriler.reduce((toplam, kategori) => toplam + (kategori.urun_sayisi ?? 0), 0);

  const aramaKucuk = arama.trim().toLocaleLowerCase('tr-TR');
  const filtrelenmis = aramaKucuk
    ? kategoriler.filter((kategori) => kategori.baslik.toLocaleLowerCase('tr-TR').includes(aramaKucuk))
    : kategoriler;

  return (
    <article className="yonetim-kategori__kart">
      <div className="yonetim-kategori__kart-gorsel" style={{ background: meta.arkaplan }}>
        <button type="button" className="yonetim-kategori__kart-kebab" aria-label={`${grup.baslik} grubunu düzenle`} onClick={() => onGrupDuzenle(grup)}>
          <MoreVertical aria-hidden="true" size={16} />
        </button>
        {meta.gorsel && <img src={meta.gorsel} alt="" />}
        <div className="yonetim-kategori__kart-bilgi">
          <span className="yonetim-kategori__kart-ikon"><GrupIkonu aria-hidden="true" /></span>
          <div className="yonetim-kategori__kart-metin">
            <h3>{grup.baslik}</h3>
            <p>{meta.aciklama}</p>
            <Link to={`/urunler?grup=${encodeURIComponent(grup.baslik)}`} target="_blank" rel="noopener noreferrer" className="yonetim-kategori__kart-ozet">
              <ChevronRight aria-hidden="true" size={12} /> {kategoriler.length} kategori • {urunToplami} ürün
            </Link>
          </div>
        </div>
      </div>

      <label className="yonetim-kategori__kart-arama">
        <Search aria-hidden="true" size={14} />
        <input type="text" value={arama} onChange={(olay) => setArama(olay.target.value)} placeholder="Kategori ara…" />
      </label>

      <div className="yonetim-tablo-kaydir">
        <table className="yonetim-tablo">
          <colgroup>
            <col style={{ width: '27%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '24%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>Ürün</th>
              <th>Güncelleme</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtrelenmis.map((kategori) => {
                const Ikon = altOgeIkonuGetir(kategori.baslik);
                const pasif = kategori.aktif_mi === 0;
                return (
                  <motion.tr key={kategori.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: .25 }}>
                    <td>
                      <div className="yonetim-tablo__ad-hucre" title={kategori.baslik}>
                        <span className="yonetim-tablo__ikon"><Ikon aria-hidden="true" /></span>
                        <span className="yonetim-tablo__ad-metin">{kategori.baslik}</span>
                      </div>
                    </td>
                    <td>{kategori.urun_sayisi}</td>
                    <td>{tarihiFormatla(kategori.guncellenme_tarihi)}</td>
                    <td>
                      <DurumDugmesi pasif={pasif} gonderiliyorMu={gonderiliyorMu} onDegistir={() => onDurumDegistir(kategori)} />
                    </td>
                    <td>
                      <div className="yonetim-tablo__eylemler">
                        <Link className="yonetim-tablo__eylem-ikon yonetim-tablo__eylem-ikon--goruntule" to={`/urunler?kategori=${encodeURIComponent(kategori.baslik)}`} target="_blank" rel="noopener noreferrer" aria-label="Görüntüle">
                          <Eye aria-hidden="true" size={13} />
                        </Link>
                        <button type="button" className="yonetim-tablo__eylem-ikon yonetim-tablo__eylem-ikon--duzenle" onClick={() => onDuzenle(kategori)} aria-label="Düzenle">
                          <Pencil aria-hidden="true" size={13} />
                        </button>
                        <button type="button" className="yonetim-tablo__eylem-ikon yonetim-tablo__eylem-ikon--sil" onClick={() => onSil(kategori)} aria-label="Sil">
                          <Trash2 aria-hidden="true" size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {filtrelenmis.length === 0 && (
              <tr>
                <td colSpan={5} className="yonetim-tablo__bos">
                  {arama ? 'Bu aramayla eşleşen kategori yok.' : 'Bu grupta henüz kategori yok.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="yonetim-kategori__kart-alt">
        <Link to={`/urunler?grup=${encodeURIComponent(grup.baslik)}`} target="_blank" rel="noopener noreferrer" className="yonetim-pill-buton">
          <span>Tümünü Gör</span><ChevronRight aria-hidden="true" />
        </Link>
        <button type="button" className="yonetim-pill-buton" onClick={() => onEkle(grup.id)}>
          <span>Alt Kategori Ekle</span><Plus aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function KategoriYonetimSayfasi({ veriYenile } = {}) {
  const [gruplar, setGruplar] = useState([]);
  const [yukleniyorMu, setYukleniyorMu] = useState(true);
  const [yuklemeHatasi, setYuklemeHatasi] = useState(null);
  const [form, setForm] = useState(null); // { mod: 'ekle'|'duzenle', grupId, kategori }
  const [silinecek, setSilinecek] = useState(null);
  const [gonderiliyorMu, setGonderiliyorMu] = useState(false);
  const [hata, setHata] = useState(null);
  const [bildirimler, setBildirimler] = useState([]);

  function bildirimEkle(tur, baslik, mesaj) {
    const id = `${Date.now()}-${Math.random()}`;
    setBildirimler((mevcut) => [...mevcut, { id, tur, baslik, mesaj }]);
    setTimeout(() => setBildirimler((mevcut) => mevcut.filter((b) => b.id !== id)), 4000);
  }
  function bildirimKapat(id) {
    setBildirimler((mevcut) => mevcut.filter((b) => b.id !== id));
  }

  useEffect(() => {
    let etkin = true;

    async function ilkYukleme() {
      try {
        const sonuc = await kategoriYonetimVerisiniGetir();
        if (etkin) setGruplar(sonuc ?? []);
      } catch (istisna) {
        if (etkin) setYuklemeHatasi(istisna.message || 'Kategoriler yüklenemedi.');
      } finally {
        if (etkin) setYukleniyorMu(false);
      }
    }

    // İlk yüklemeden sonra, başka bir sekmede/kullanıcıda yapılan değişiklikleri de yansıtmak için
    // liste sessizce arka planda periyodik tazelenir; "yukleniyor" durumuna dönülmediğinden
    // kullanıcı hiçbir yenileme/flaş hissetmez, sayfayı elle yenilemesi gerekmez.
    async function arkaPlandaTazele() {
      try {
        const sonuc = await kategoriYonetimVerisiniGetir();
        if (etkin) setGruplar(sonuc ?? []);
      } catch {
        // Ağ hatası sessizce yok sayılır; bir sonraki denemede tekrar toparlanır.
      }
    }

    ilkYukleme();
    const zamanlayici = setInterval(arkaPlandaTazele, 15000);
    return () => {
      etkin = false;
      clearInterval(zamanlayici);
    };
  }, []);

  const istatistikler = useMemo(() => {
    const tumKategoriler = gruplar.flatMap((grup) => grup.alt_ogeler ?? []);
    return {
      anaKategori: gruplar.length,
      toplamAltKategori: tumKategoriler.length,
      toplamUrun: tumKategoriler.reduce((toplam, kategori) => toplam + (kategori.urun_sayisi ?? 0), 0)
    };
  }, [gruplar]);

  // Bir mutasyondan sonra TÜM kategori ağacını tekrar çekmek yerine (sayfanın "yenilenmiş" hissi
  // vermesine yol açar), yalnızca ilgili grup/kategoriyi yerel state içinde güncelleriz. Halka açık
  // sayfaların kullandığı App.jsx'teki veri ise arka planda veriYenile ile ayrıca tazelenir.
  function grupGuncelle(grupId, donusturucu) {
    setGruplar((mevcut) => mevcut.map((grup) => (grup.id === grupId ? donusturucu(grup) : grup)));
  }

  async function formuGonder(alanlar) {
    setGonderiliyorMu(true);
    setHata(null);
    try {
      if (form.mod === 'ekle') {
        const yeniKategori = await kategoriEkle(form.grupId, alanlar);
        grupGuncelle(form.grupId, (grup) => ({ ...grup, alt_ogeler: [...(grup.alt_ogeler ?? []), yeniKategori] }));
        bildirimEkle('basari', 'Kategori eklendi', `"${yeniKategori.baslik}" listeye eklendi.`);
      } else if (form.kategori.ust_alt_oge_id == null) {
        // Kebab menüsünden grubun kendi başlığı düzenleniyor.
        const guncellenenGrup = await kategoriGuncelle(form.kategori.id, alanlar);
        setGruplar((mevcut) => mevcut.map((grup) => (grup.id === form.kategori.id ? { ...grup, ...guncellenenGrup, alt_ogeler: grup.alt_ogeler } : grup)));
        bildirimEkle('uyari', 'Değişiklikler kaydedildi', `"${guncellenenGrup.baslik}" grubu güncellendi.`);
      } else {
        const guncellenenKategori = await kategoriGuncelle(form.kategori.id, alanlar);
        grupGuncelle(form.kategori.ust_alt_oge_id, (grup) => ({
          ...grup,
          alt_ogeler: (grup.alt_ogeler ?? []).map((kategori) => (kategori.id === guncellenenKategori.id ? guncellenenKategori : kategori))
        }));
        bildirimEkle('uyari', 'Değişiklikler kaydedildi', `"${guncellenenKategori.baslik}" başarıyla güncellendi.`);
      }
      setForm(null);
      veriYenile?.();
    } catch (istisna) {
      const mesaj = istisna.message || 'İşlem tamamlanamadı.';
      setHata(mesaj);
      bildirimEkle('hata', 'İşlem başarısız', mesaj);
    } finally {
      setGonderiliyorMu(false);
    }
  }

  async function durumuDegistir(kategori) {
    setGonderiliyorMu(true);
    try {
      const guncellenen = await kategoriGuncelle(kategori.id, { aktif_mi: kategori.aktif_mi === 0 ? 1 : 0 });
      grupGuncelle(kategori.ust_alt_oge_id, (grup) => ({
        ...grup,
        alt_ogeler: (grup.alt_ogeler ?? []).map((k) => (k.id === guncellenen.id ? guncellenen : k))
      }));
      veriYenile?.();
    } catch (istisna) {
      setHata(istisna.message || 'Durum değiştirilemedi.');
    } finally {
      setGonderiliyorMu(false);
    }
  }

  async function silmeyiOnayla() {
    setGonderiliyorMu(true);
    setHata(null);
    try {
      await kategoriSil(silinecek.id);
      grupGuncelle(silinecek.ust_alt_oge_id, (grup) => ({
        ...grup,
        alt_ogeler: (grup.alt_ogeler ?? []).filter((kategori) => kategori.id !== silinecek.id)
      }));
      bildirimEkle('silme', 'Kategori silindi', `"${silinecek.baslik}" kalıcı olarak silindi.`);
      setSilinecek(null);
      veriYenile?.();
    } catch (istisna) {
      const mesaj = istisna.message || 'Kategori silinemedi.';
      setHata(mesaj);
      bildirimEkle('hata', 'Silme başarısız', mesaj);
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
      <Bildirimler bildirimler={bildirimler} onKapat={bildirimKapat} />

      <div className="yonetim-kategori__istatistikler">
        <IstatistikKarti ikon={LayoutGrid} renk="var(--yonetim-mavi)" etiket="Ana Kategori" deger={istatistikler.anaKategori} />
        <IstatistikKarti ikon={FolderTree} renk="var(--yonetim-mavi)" etiket="Toplam Alt Kategori" deger={istatistikler.toplamAltKategori} />
        <IstatistikKarti ikon={Boxes} renk="var(--yonetim-yesil)" etiket="Toplam Ürün" deger={istatistikler.toplamUrun} />
      </div>

      <div className="yonetim-kategori__kartlar">
        {gruplar.map((grup) => (
          <GrupKarti
            key={grup.id}
            grup={grup}
            gonderiliyorMu={gonderiliyorMu}
            onDuzenle={(kategori) => { setHata(null); setForm({ mod: 'duzenle', kategori }); }}
            onEkle={(grupId) => { setHata(null); setForm({ mod: 'ekle', grupId }); }}
            onSil={(kategori) => { setHata(null); setSilinecek(kategori); }}
            onGrupDuzenle={(grup) => { setHata(null); setForm({ mod: 'duzenle', kategori: grup }); }}
            onDurumDegistir={durumuDegistir}
          />
        ))}
      </div>

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
        <Modal baslik="Kategoriyi Sil" onKapat={() => setSilinecek(null)}>
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
