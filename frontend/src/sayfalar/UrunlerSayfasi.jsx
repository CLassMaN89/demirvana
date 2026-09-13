import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Grid2X2, Headphones, Info, List, Minus, Plus, SlidersHorizontal } from 'lucide-react';
import { altOgeIkonuGetir, grupIkonuGetir } from '../bilesenler/UrunMenuIkonlari';
import '../stiller/urun-katalog.css';

function teknikBilgileriOku(urun) {
  if (urun.katalog_bilgileri) return urun.katalog_bilgileri;
  try {
    const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
    return teknik?.katalog_bilgileri ?? { dn: teknik?.dn, standart: teknik?.standart, basinc: teknik?.basinc };
  } catch {
    return {};
  }
}

function urunGorseliniBul(urun) {
  // Gerçek sitede fotoğrafı bulunmayan ürünler yanıltıcı bir kategori görseli yerine soluk site logosu (hologram) gösterir.
  try {
    const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
    return urun.gorsel_yolu || teknik?.katalog_bilgileri?.gorsel_yolu || '/assets/vana-placeholder-ikon.svg';
  } catch {
    return urun.gorsel_yolu || '/assets/vana-placeholder-ikon.svg';
  }
}

function urunGorseliVarMi(urun) {
  try {
    const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
    return Boolean(urun.gorsel_yolu || teknik?.katalog_bilgileri?.gorsel_yolu);
  } catch {
    return Boolean(urun.gorsel_yolu);
  }
}

function detayHazirMi(urun) {
  if (urun.detay_hazir_mi === false) return false;
  try {
    const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
    return teknik?.detay_hazir_mi !== false;
  } catch {
    return true;
  }
}

// Kart ekranda görünür olana kadar "IntersectionObserver" ile bekler; göründüğü anda CSS geçişiyle
// belirip yukarı doğru kayarak yerine oturur (scroll-reveal / kaydırdıkça beliren animasyon).
function useGorunurlukAnimasyonu() {
  const ref = useRef(null);
  const [gorunur, setGorunur] = useState(false);

  useEffect(() => {
    const eleman = ref.current;
    if (!eleman) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setGorunur(true);
      return undefined;
    }
    const gozlemci = new IntersectionObserver(
      ([giris]) => {
        if (giris.isIntersecting) {
          setGorunur(true);
          gozlemci.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    gozlemci.observe(eleman);
    return () => gozlemci.disconnect();
  }, []);

  return [ref, gorunur];
}

function UrunKarti({ urun, sira }) {
  const bilgiler = teknikBilgileriOku(urun);
  const hazir = detayHazirMi(urun);
  const detayAdresi = `/urunler/${urun.slug}`;
  const kartRef = useRef(null);
  const [gorunurRef, gorunur] = useGorunurlukAnimasyonu();

  // Fare kart üzerindeyken ışık halkasının açısını günceller; CSS geçişi açı değişimini yumuşak biçimde canlandırır.
  const isikAcisiniGuncelle = (olay) => {
    const kart = kartRef.current;
    if (!kart) return;
    const { left, top, width, height } = kart.getBoundingClientRect();
    const aci = (180 * Math.atan2(olay.clientY - (top + height / 2), olay.clientX - (left + width / 2))) / Math.PI + 90;
    kart.style.setProperty('--isik-acisi', `${aci}deg`);
  };

  const birlesikRef = (dugum) => {
    kartRef.current = dugum;
    gorunurRef.current = dugum;
  };

  return (
    <article
      className={`urun-katalog__kart${gorunur ? ' urun-katalog__kart--gorunur' : ''}`}
      data-testid="urun-katalog-karti"
      ref={birlesikRef}
      onPointerMove={isikAcisiniGuncelle}
    >
      <span className="urun-katalog__isik" aria-hidden="true" />
      <span className="urun-katalog__sira">{String(sira).padStart(2, '0')}</span>
      {hazir ? (
        <Link className={`urun-katalog__gorsel${urunGorseliVarMi(urun) ? '' : ' urun-katalog__gorsel--bos'}`} to={detayAdresi} aria-label={`${urun.ad} görselini aç`}><img src={urunGorseliniBul(urun)} alt={`${urun.ad} ürün görseli`} /></Link>
      ) : (
        <div className={`urun-katalog__gorsel${urunGorseliVarMi(urun) ? '' : ' urun-katalog__gorsel--bos'}`}><img src={urunGorseliniBul(urun)} alt={`${urun.ad} ürün görseli`} /></div>
      )}
      <div className="urun-katalog__kart-metin">
        <h2>{urun.ad}</h2>
        <dl>
          {bilgiler.dn && <div><dt className="ekran-okuyucu">Anma çapı</dt><dd>{bilgiler.dn}</dd></div>}
          {bilgiler.standart && <div><dt className="ekran-okuyucu">Standart</dt><dd>{bilgiler.standart}</dd></div>}
          {bilgiler.basinc && <div><dt className="ekran-okuyucu">Basınç</dt><dd>{bilgiler.basinc}</dd></div>}
        </dl>
      </div>
      {hazir ? (
        <Link className="urun-katalog__detay" to={detayAdresi} aria-label={`${urun.ad} detayını gör`}><span>Detayı Gör</span><ChevronRight aria-hidden="true" /></Link>
      ) : <span className="urun-katalog__hazirlaniyor">Detay hazırlanıyor</span>}
    </article>
  );
}

function YanMenuGrubu({ grup, acik, onAcikDegistir, etkinYol }) {
  // Fare menü öğeleri arasında gezinirken tek bir vurgu şeridi konum/yükseklik değiştirerek kayar;
  // her satırın kendi arka planını ayrı ayrı açıp kapatması yerine tek bir öğe animasyon yapar.
  const [hoverKonumu, setHoverKonumu] = useState(null);
  const GrupIkonu = grupIkonuGetir(grup.baslik);

  return (
    <section className={`urun-katalog__menu-grubu${acik ? ' urun-katalog__menu-grubu--acik' : ''}`}>
      <button type="button" aria-expanded={acik} aria-label={`${grup.baslik} menüsünü aç veya kapat`} onClick={onAcikDegistir}>
        <span><GrupIkonu className="urun-katalog__menu-baslik-ikon" />{grup.baslik}</span>
        {/* Aç/kapat göstergesi her durum değişiminde yeniden monte olarak kısa bir giriş animasyonu oynatır. */}
        <span className="urun-katalog__menu-ok" key={acik ? 'kapat' : 'ac'}>{acik ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}</span>
      </button>
      <div className="urun-katalog__menu-gecis"><div>
        <nav aria-label={`${grup.baslik} kategorileri`} onMouseLeave={() => setHoverKonumu(null)}>
          <span
            className="urun-katalog__menu-hover"
            aria-hidden="true"
            style={hoverKonumu ? { top: `${hoverKonumu.top}px`, height: `${hoverKonumu.height}px`, opacity: 1 } : { opacity: 0 }}
          />
          {(grup.alt_ogeler ?? []).map((oge) => {
            const OgeIkonu = altOgeIkonuGetir(oge.baslik);
            return (
              <Link
                className={etkinYol === oge.baglanti ? 'aktif' : ''}
                to={oge.baglanti}
                key={oge.id}
                onMouseEnter={(olay) => setHoverKonumu({ top: olay.currentTarget.offsetTop, height: olay.currentTarget.offsetHeight })}
              >
                <OgeIkonu className="urun-katalog__menu-ikon" /><span>{oge.baslik}</span>
              </Link>
            );
          })}
        </nav>
      </div></div>
    </section>
  );
}

const ADIM_BASINA_URUN = 15;

// Canlı API'de kategori_adi, kategori_id'nin bağlı olduğu 7 genel gruptan gelir (menu_kategori_adi ile aynı olmayabilir);
// 21 gerçek menü kategorisi menu_kategori_adi alanında tutulur, örnek veri ise doğrudan kategori_adi kullanır.
function urunMenuKategorisi(urun) {
  return urun.menu_kategori_adi ?? urun.kategori_adi;
}

export default function UrunlerSayfasi({ menu = [], urunler = [] }) {
  const konum = useLocation();
  const [gorunum, setGorunum] = useState('kart');
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const [gosterilenSayisi, setGosterilenSayisi] = useState(ADIM_BASINA_URUN);

  const urunMenusu = useMemo(() => menu.find((oge) => oge.baglanti === '/urunler'), [menu]);
  const gruplar = urunMenusu?.alt_ogeler ?? [];

  // Admin > Kategori Yönetimi'ndeki "Görüntüle"/"Tümünü Gör" linkleri gibi doğrudan bir sayfa rotası
  // olmayan yerlerden gelen seçimler için ?kategori=<başlık> ve ?grup=<başlık> sorgu parametreleri desteklenir.
  const sorguParametreleri = new URLSearchParams(konum.search);
  const kategoriParametresi = sorguParametreleri.get('kategori');
  const grupParametresi = sorguParametreleri.get('grup');

  // Etkin kategori değiştiğinde onu içeren grup otomatik açılır; kullanıcının açtığı diğer gruplar kapanmaz.
  const aktifGrup = useMemo(
    () => gruplar.find((grup) => grup.baglanti === konum.pathname || grup.baslik === grupParametresi
      || (grup.alt_ogeler ?? []).some((alt) => alt.baglanti === konum.pathname || alt.baslik === kategoriParametresi)),
    [gruplar, konum.pathname, kategoriParametresi, grupParametresi]
  );
  const [acikGruplar, setAcikGruplar] = useState(() => new Set([aktifGrup?.id ?? gruplar[0]?.id].filter(Boolean)));
  useEffect(() => {
    const hedef = aktifGrup?.id ?? gruplar[0]?.id;
    if (!hedef) return;
    setAcikGruplar((mevcut) => (mevcut.has(hedef) ? mevcut : new Set(mevcut).add(hedef)));
  }, [aktifGrup, gruplar]);
  const grupAcikKapatmayiDegistir = (grupId) => {
    setAcikGruplar((mevcut) => {
      const yeni = new Set(mevcut);
      if (yeni.has(grupId)) yeni.delete(grupId); else yeni.add(grupId);
      return yeni;
    });
  };

  // Adres yoluna göre etkin grup ve/veya alt kategoriyi bulur; hiçbiri eşleşmezse (örn. /urunler) tüm ürünler gösterilir.
  const { baslik, aciklama, gosterilecekUrunler } = useMemo(() => {
    if (konum.pathname === '/urunler' && kategoriParametresi) {
      return {
        baslik: kategoriParametresi,
        aciklama: 'Endüstriyel vana sistemleri için yüksek performanslı çözümler.',
        gosterilecekUrunler: urunler.filter((urun) => urunMenuKategorisi(urun) === kategoriParametresi),
      };
    }
    if (konum.pathname === '/urunler' && grupParametresi) {
      const grup = gruplar.find((g) => g.baslik === grupParametresi);
      if (grup) {
        const altBasliklar = new Set((grup.alt_ogeler ?? []).map((alt) => alt.baslik));
        return {
          baslik: grup.baslik,
          aciklama: `${grup.baslik} kategorisindeki tüm ürünler.`,
          gosterilecekUrunler: urunler.filter((urun) => altBasliklar.has(urunMenuKategorisi(urun))),
        };
      }
    }
    for (const grup of gruplar) {
      if (grup.baglanti === konum.pathname) {
        const altBasliklar = new Set((grup.alt_ogeler ?? []).map((alt) => alt.baslik));
        return {
          baslik: grup.baslik,
          aciklama: `${grup.baslik} kategorisindeki tüm ürünler.`,
          gosterilecekUrunler: urunler.filter((urun) => altBasliklar.has(urunMenuKategorisi(urun))),
        };
      }
      for (const alt of grup.alt_ogeler ?? []) {
        if (alt.baglanti === konum.pathname) {
          return {
            baslik: alt.baslik,
            aciklama: 'Endüstriyel vana sistemleri için yüksek performanslı çözümler.',
            gosterilecekUrunler: urunler.filter((urun) => urunMenuKategorisi(urun) === alt.baslik),
          };
        }
      }
    }
    return { baslik: 'Tüm Ürünler', aciklama: 'Endüstriyel vana sistemleri için yüksek performanslı çözümler.', gosterilecekUrunler: urunler };
  }, [gruplar, konum.pathname, kategoriParametresi, grupParametresi, urunler]);

  const gosterilenUrunler = gosterilecekUrunler.slice(0, gosterilenSayisi);
  const dahaFazlaVar = gosterilenSayisi < gosterilecekUrunler.length;
  const mevcutSayfa = Math.ceil(gosterilenUrunler.length / ADIM_BASINA_URUN);
  const toplamSayfa = Math.max(1, Math.ceil(gosterilecekUrunler.length / ADIM_BASINA_URUN));

  // Kategori değiştiğinde bir önceki kategoriden kalan "gösterilen ürün sayısı" sıfırlanır.
  useEffect(() => {
    setGosterilenSayisi(ADIM_BASINA_URUN);
  }, [konum.pathname, kategoriParametresi, grupParametresi]);

  return (
    <main className="urun-katalog">
      <div className="urun-katalog__yerlesim icerik-kapsayici">
        <aside className={`urun-katalog__yan-menu${mobilMenuAcik ? ' urun-katalog__yan-menu--mobil-acik' : ''}`}>
          <button className="urun-katalog__mobil-menu" type="button" aria-expanded={mobilMenuAcik} onClick={() => setMobilMenuAcik((deger) => !deger)}>
            <SlidersHorizontal aria-hidden="true" /><span>Ürün grupları</span><ChevronDown aria-hidden="true" />
          </button>
          <div className="urun-katalog__yan-menu-icerik">
            {gruplar.slice(0, 3).map((grup) => (
              <YanMenuGrubu
                grup={grup}
                acik={acikGruplar.has(grup.id)}
                onAcikDegistir={() => grupAcikKapatmayiDegistir(grup.id)}
                etkinYol={konum.pathname}
                key={grup.id}
              />
            ))}
            <Link className="urun-katalog__teklif" to="/iletisim"><Headphones aria-hidden="true" /><span>Doğru vana çözümü için<br /><strong>size yardımcı olalım.</strong></span><ChevronRight aria-hidden="true" /></Link>
          </div>
        </aside>

        <section className="urun-katalog__icerik" aria-labelledby="urun-katalog-basligi">
          <nav className="urun-katalog__kirinti" aria-label="Sayfa yolu"><Link to="/">Anasayfa</Link><span>/</span><Link to="/urunler">Ürünler</Link><span>/</span><span>{baslik}</span></nav>
          <header className="urun-katalog__hero">
            <div><h1 id="urun-katalog-basligi">{baslik}</h1><p>{aciklama}</p></div>
            <p className="urun-katalog__hero-soz">Güvenilir Akış<br />Daha Güçlü Yarınlar</p>
          </header>
          <div className="urun-katalog__bilgi"><Info aria-hidden="true" /><span>Teknik detaylar, sertifikalar ve dokümanlar için lütfen ilgili ürünün detay sayfasını ziyaret ediniz.</span></div>
          <div className="urun-katalog__araclar">
            <span>{gosterilenUrunler.length} / {gosterilecekUrunler.length} ürün gösteriliyor · Sayfa {mevcutSayfa} / {toplamSayfa}</span>
            <label><span className="ekran-okuyucu">Ürün sıralaması</span><select defaultValue="varsayilan"><option value="varsayilan">Varsayılan Sıralama</option><option value="ad">Ürün adına göre</option></select></label>
            <div className="urun-katalog__gorunum" aria-label="Görünüm seçimi">
              <button type="button" aria-label="Kart görünümü" aria-pressed={gorunum === 'kart'} onClick={() => setGorunum('kart')}><Grid2X2 aria-hidden="true" /></button>
              <button type="button" aria-label="Liste görünümü" aria-pressed={gorunum === 'liste'} onClick={() => setGorunum('liste')}><List aria-hidden="true" /></button>
            </div>
          </div>
          <div className={`urun-katalog__urunler${gorunum === 'liste' ? ' urun-katalog__urunler--liste' : ''}`} data-testid="urun-katalog-listesi">
            {gosterilenUrunler.map((urun, indeks) => <UrunKarti urun={urun} sira={indeks + 1} key={urun.id} />)}
          </div>
          {dahaFazlaVar && (
            <div className="urun-katalog__daha-fazla">
              <button type="button" onClick={() => setGosterilenSayisi((deger) => deger + ADIM_BASINA_URUN)}>
                Daha Fazla Göster
              </button>
              <span>{gosterilenUrunler.length} / {gosterilecekUrunler.length} ürün · Sayfa {mevcutSayfa} / {toplamSayfa}</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
