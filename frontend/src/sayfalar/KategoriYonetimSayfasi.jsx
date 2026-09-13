import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { altOgeIkonuGetir } from '../bilesenler/UrunMenuIkonlari';
import Modal from '../bilesenler/Modal';
import { kategoriEkle, kategoriGuncelle, kategoriSil } from '../servisler/api';
import '../stiller/yonetim-kategori.css';

// Aynı isim string eşitliğiyle eşleştirme UrunlerSayfasi.jsx'teki urunMenuKategorisi ile birebir aynı olmalı;
// ürünler kategoriye kategori_id ile değil, menü yaprağının başlığıyla bağlanıyor.
function urunMenuKategorisi(urun) {
  return urun.menu_kategori_adi ?? urun.kategori_adi;
}

function KategoriFormu({ baslangicDegeri, gonderiliyorMu, hata, onIptal, onKaydet }) {
  const [baslik, setBaslik] = useState(baslangicDegeri?.baslik ?? '');

  return (
    <form
      className="yonetim-form"
      onSubmit={(olay) => {
        olay.preventDefault();
        onKaydet(baslik.trim());
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
        <strong>{kategori.baslik}</strong> kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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

export default function KategoriYonetimSayfasi({ veri, veriYenile }) {
  const [form, setForm] = useState(null); // { mod: 'ekle'|'duzenle', grupId, kategori }
  const [silinecek, setSilinecek] = useState(null);
  const [gonderiliyorMu, setGonderiliyorMu] = useState(false);
  const [hata, setHata] = useState(null);

  const urunler = veri.urunler ?? [];
  const urunMenusu = (veri.menu ?? []).find((oge) => oge.baglanti === '/urunler');
  const gruplar = urunMenusu?.alt_ogeler ?? [];

  function urunSayisi(baslik) {
    return urunler.filter((urun) => urunMenuKategorisi(urun) === baslik).length;
  }

  async function formuGonder(baslik) {
    setGonderiliyorMu(true);
    setHata(null);
    try {
      if (form.mod === 'ekle') {
        await kategoriEkle(form.grupId, { baslik });
      } else {
        await kategoriGuncelle(form.kategori.id, { baslik });
      }
      setForm(null);
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
      veriYenile?.();
    } catch (istisna) {
      setHata(istisna.message || 'Kategori silinemedi.');
    } finally {
      setGonderiliyorMu(false);
    }
  }

  return (
    <div className="yonetim-kategori">
      <div className="yonetim-kategori__baslik">
        <h1>Kategori Yönetimi</h1>
        <p>Ürünlerin filtrelendiği ürün gruplarını buradan ekleyip düzenleyebilir, kullanılmayanları silebilirsiniz.</p>
      </div>

      {gruplar.map((grup) => (
        <section className="yonetim-panel yonetim-kategori__grup" key={grup.id}>
          <div className="yonetim-panel__panel-baslik">
            <h3>{grup.baslik}</h3>
            <button
              type="button"
              className="yonetim-panel__tumunu-gor"
              onClick={() => { setHata(null); setForm({ mod: 'ekle', grupId: grup.id }); }}
            >
              <Plus aria-hidden="true" size={14} /> Yeni Kategori Ekle
            </button>
          </div>

          <div className="yonetim-tablo-kaydir">
            <table className="yonetim-tablo">
              <thead>
                <tr>
                  <th>Kategori Adı</th>
                  <th>Ürün Sayısı</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {(grup.alt_ogeler ?? []).map((kategori) => {
                  const Ikon = altOgeIkonuGetir(kategori.baslik);
                  return (
                    <tr key={kategori.id}>
                      <td className="yonetim-tablo__ad-hucre">
                        <span className="yonetim-tablo__ikon"><Ikon aria-hidden="true" /></span>
                        {kategori.baslik}
                      </td>
                      <td>{urunSayisi(kategori.baslik)}</td>
                      <td className="yonetim-tablo__eylemler">
                        <button
                          type="button"
                          aria-label="Düzenle"
                          onClick={() => { setHata(null); setForm({ mod: 'duzenle', kategori }); }}
                        >
                          <Pencil aria-hidden="true" size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Sil"
                          className="yonetim-tablo__sil-buton"
                          onClick={() => { setHata(null); setSilinecek(kategori); }}
                        >
                          <Trash2 aria-hidden="true" size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {(grup.alt_ogeler ?? []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="yonetim-tablo__bos">Bu grupta henüz kategori yok.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}

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
