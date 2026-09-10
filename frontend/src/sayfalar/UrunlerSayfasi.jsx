import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Grid2X2, Headphones, Info, List, SlidersHorizontal } from 'lucide-react';
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
  try {
    const teknik = typeof urun.teknik_bilgiler === 'string' ? JSON.parse(urun.teknik_bilgiler) : urun.teknik_bilgiler;
    return urun.gorsel_yolu || teknik?.katalog_bilgileri?.gorsel_yolu || '/assets/kategoriler/surgulu-vanalar.webp';
  } catch {
    return urun.gorsel_yolu || '/assets/kategoriler/surgulu-vanalar.webp';
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

function UrunKarti({ urun, sira }) {
  const bilgiler = teknikBilgileriOku(urun);
  const hazir = detayHazirMi(urun);
  const detayAdresi = `/urunler/${urun.slug}`;

  return (
    <article className="urun-katalog__kart" data-testid="urun-katalog-karti">
      <span className="urun-katalog__sira">{String(sira).padStart(2, '0')}</span>
      {hazir ? (
        <Link className="urun-katalog__gorsel" to={detayAdresi} aria-label={`${urun.ad} görselini aç`}><img src={urunGorseliniBul(urun)} alt={`${urun.ad} ürün görseli`} /></Link>
      ) : (
        <div className="urun-katalog__gorsel"><img src={urunGorseliniBul(urun)} alt={`${urun.ad} ürün görseli`} /></div>
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

function YanMenuGrubu({ grup, varsayilanAcik, etkinYol }) {
  const [acik, setAcik] = useState(varsayilanAcik);
  return (
    <section className={`urun-katalog__menu-grubu${acik ? ' urun-katalog__menu-grubu--acik' : ''}`}>
      <button type="button" aria-expanded={acik} aria-label={`${grup.baslik} menüsünü aç veya kapat`} onClick={() => setAcik((deger) => !deger)}>
        <span>{grup.baslik}</span><ChevronDown aria-hidden="true" />
      </button>
      <div className="urun-katalog__menu-gecis"><div>
        <nav aria-label={`${grup.baslik} kategorileri`}>
          {(grup.alt_ogeler ?? []).map((oge) => <Link className={etkinYol === oge.baglanti ? 'aktif' : ''} to={oge.baglanti} key={oge.id}>{oge.baslik}</Link>)}
        </nav>
      </div></div>
    </section>
  );
}

export default function UrunlerSayfasi({ menu = [], urunler = [] }) {
  const konum = useLocation();
  const [gorunum, setGorunum] = useState('kart');
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const urunMenusu = useMemo(() => menu.find((oge) => oge.baglanti === '/urunler'), [menu]);
  const gruplar = urunMenusu?.alt_ogeler ?? [];

  return (
    <main className="urun-katalog">
      <div className="urun-katalog__yerlesim icerik-kapsayici">
        <aside className={`urun-katalog__yan-menu${mobilMenuAcik ? ' urun-katalog__yan-menu--mobil-acik' : ''}`}>
          <button className="urun-katalog__mobil-menu" type="button" aria-expanded={mobilMenuAcik} onClick={() => setMobilMenuAcik((deger) => !deger)}>
            <SlidersHorizontal aria-hidden="true" /><span>Ürün grupları</span><ChevronDown aria-hidden="true" />
          </button>
          <div className="urun-katalog__yan-menu-icerik">
            {gruplar.slice(0, 3).map((grup, indeks) => <YanMenuGrubu grup={grup} varsayilanAcik={indeks === 0} etkinYol={konum.pathname} key={grup.id} />)}
            <Link className="urun-katalog__teklif" to="/iletisim"><Headphones aria-hidden="true" /><span>Doğru vana çözümü için<br /><strong>size yardımcı olalım.</strong></span><ChevronRight aria-hidden="true" /></Link>
          </div>
        </aside>

        <section className="urun-katalog__icerik" aria-labelledby="urun-katalog-basligi">
          <nav className="urun-katalog__kirinti" aria-label="Sayfa yolu"><Link to="/">Anasayfa</Link><span>/</span><Link to="/urunler">Ürünler</Link><span>/</span><span>Su Grubu Vanaları</span></nav>
          <header className="urun-katalog__hero">
            <div><h1 id="urun-katalog-basligi">Su Grubu Vanaları</h1><p>Endüstriyel su sistemleri için yüksek performanslı vana çözümleri.</p></div>
            <p className="urun-katalog__hero-soz">Güvenilir Akış<br />Daha Güçlü Yarınlar</p>
          </header>
          <div className="urun-katalog__bilgi"><Info aria-hidden="true" /><span>Teknik detaylar, sertifikalar ve dokümanlar için lütfen ilgili ürünün detay sayfasını ziyaret ediniz.</span></div>
          <div className="urun-katalog__araclar">
            <span>{urunler.length} ürün listeleniyor</span>
            <label><span className="ekran-okuyucu">Ürün sıralaması</span><select defaultValue="varsayilan"><option value="varsayilan">Varsayılan Sıralama</option><option value="ad">Ürün adına göre</option></select></label>
            <div className="urun-katalog__gorunum" aria-label="Görünüm seçimi">
              <button type="button" aria-label="Kart görünümü" aria-pressed={gorunum === 'kart'} onClick={() => setGorunum('kart')}><Grid2X2 aria-hidden="true" /></button>
              <button type="button" aria-label="Liste görünümü" aria-pressed={gorunum === 'liste'} onClick={() => setGorunum('liste')}><List aria-hidden="true" /></button>
            </div>
          </div>
          <div className={`urun-katalog__urunler${gorunum === 'liste' ? ' urun-katalog__urunler--liste' : ''}`} data-testid="urun-katalog-listesi">
            {urunler.map((urun, indeks) => <UrunKarti urun={urun} sira={indeks + 1} key={urun.id} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
