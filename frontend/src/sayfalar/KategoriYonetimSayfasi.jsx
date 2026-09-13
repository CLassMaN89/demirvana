import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Boxes, Eye, FolderTree, Home, LayoutGrid, MoreVertical,
  Pencil, Plus, Search, Trash2
} from 'lucide-react';
import { altOgeIkonuGetir, grupIkonuGetir } from '../bilesenler/UrunMenuIkonlari';
import Modal from '../bilesenler/Modal';
import { kategoriEkle, kategoriGuncelle, kategoriSil, kategoriYonetimVerisiniGetir } from '../servisler/api';
import '../stiller/yonetim-kategori.css';

// Grup kartlarının fotoğrafı ve arkaplan rengi; bu bilgiler menu_alt_ogeleri tablosunda tutulmadığı
// (yalnızca başlık/bağlantı/sıralama içerir) için üç ana grup adına göre eşlenir.
const GRUP_META = {
  Vana: {
    aciklama: 'Su, buhar, gaz ve endüstriyel akışkanlar için vana çözümleri',
    arkaplan: '#ecf3fd',
    gorsel: '/assets/kategori-yonetimi/vana.png'
  },
  Aktüatör: {
    aciklama: 'Pnömatik ve elektrikli aktüatör çözümleri',
    arkaplan: '#fdf6ef',
    gorsel: '/assets/kategori-yonetimi/aktuator.png'
  },
  Otomasyon: {
    aciklama: 'Vana otomasyon ve kontrol sistemleri',
    arkaplan: '#f2fbf7',
    gorsel: '/assets/kategori-yonetimi/otomasyon.png'
  }
};

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

function GrupKarti({ grup, onDuzenle, onEkle, onSil, onGrupDuzenle }) {
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
      </div>
      <div className="yonetim-kategori__kart-bilgi">
        <span className="yonetim-kategori__kart-ikon"><GrupIkonu aria-hidden="true" /></span>
        <div className="yonetim-kategori__kart-metin">
          <h3>{grup.baslik}</h3>
          <p>{meta.aciklama}</p>
          <Link to={`/urunler?grup=${encodeURIComponent(grup.baslik)}`} target="_blank" rel="noopener noreferrer" className="yonetim-kategori__kart-ozet">
            {kategoriler.length} kategori • {urunToplami} ürün
          </Link>
        </div>
      </div>

      <label className="yonetim-kategori__kart-arama">
        <Search aria-hidden="true" size={14} />
        <input type="text" value={arama} onChange={(olay) => setArama(olay.target.value)} placeholder="Kategori ara…" />
      </label>

      <div className="yonetim-tablo-kaydir">
        <table className="yonetim-tablo">
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>Ürün</th>
              <th>Son Güncelleme</th>
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
                        <Link className="yonetim-tablo__eylem-ikon yonetim-tablo__eylem-ikon--goruntule" to={`/urunler?kategori=${encodeURIComponent(kategori.baslik)}`} target="_blank" rel="noopener noreferrer" aria-label="Görüntüle">
                          <Eye aria-hidden="true" size={14} />
                        </Link>
                        <button type="button" className="yonetim-tablo__eylem-ikon yonetim-tablo__eylem-ikon--duzenle" onClick={() => onDuzenle(kategori)} aria-label="Düzenle">
                          <Pencil aria-hidden="true" size={14} />
                        </button>
                        <button type="button" className="yonetim-tablo__eylem-ikon yonetim-tablo__eylem-ikon--sil" onClick={() => onSil(kategori)} aria-label="Sil">
                          <Trash2 aria-hidden="true" size={14} />
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
        <Link to={`/urunler?grup=${encodeURIComponent(grup.baslik)}`} target="_blank" rel="noopener noreferrer" className="yonetim-kategori__kart-tumunu-gor">
          Tümünü Gör →
        </Link>
        <button type="button" className="yonetim-kategori__kart-ekle" onClick={() => onEkle(grup.id)}>
          <Plus aria-hidden="true" size={14} /> Alt Kategori Ekle
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

  async function veriyiYukle() {
    setYuklemeHatasi(null);
    try {
      const sonuc = await kategoriYonetimVerisiniGetir();
      setGruplar(sonuc ?? []);
    } catch (istisna) {
      setYuklemeHatasi(istisna.message || 'Kategoriler yüklenemedi.');
    } finally {
      setYukleniyorMu(false);
    }
  }

  useEffect(() => {
    veriyiYukle();
  }, []);

  const istatistikler = useMemo(() => {
    const tumKategoriler = gruplar.flatMap((grup) => grup.alt_ogeler ?? []);
    return {
      anaKategori: gruplar.length,
      toplamAltKategori: tumKategoriler.length,
      toplamUrun: tumKategoriler.reduce((toplam, kategori) => toplam + (kategori.urun_sayisi ?? 0), 0)
    };
  }, [gruplar]);

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
      <div className="yonetim-kategori__ust-satir">
        <div className="yonetim-kategori__baslik">
          <h1>Kategori Yönetimi</h1>
          <p>Tüm ürün kategorilerinizi yönetin, düzenleyin ve yeni kategoriler ekleyin.</p>
        </div>
        <div className="yonetim-kategori__ust-sag">
          <nav className="yonetim-kategori__yol-izi" aria-label="Sayfa yolu">
            <Link to="/admin"><Home aria-hidden="true" size={13} /> Anasayfa</Link>
            <span>›</span>
            <span>Kategoriler</span>
          </nav>
          <button
            type="button"
            className="yonetim-kategori__ekle-buton"
            onClick={() => { setHata(null); setForm({ mod: 'ekle', grupId: gruplar[0]?.id }); }}
            disabled={!gruplar[0]}
          >
            <Plus aria-hidden="true" size={16} /> Yeni Kategori Ekle
          </button>
        </div>
      </div>

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
            onDuzenle={(kategori) => { setHata(null); setForm({ mod: 'duzenle', kategori }); }}
            onEkle={(grupId) => { setHata(null); setForm({ mod: 'ekle', grupId }); }}
            onSil={(kategori) => { setHata(null); setSilinecek(kategori); }}
            onGrupDuzenle={(grup) => { setHata(null); setForm({ mod: 'duzenle', kategori: grup }); }}
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
