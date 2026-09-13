import { ArrowLeft, BarChart3, Download, FileText, Home, Layers3, Maximize2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DurumMesaji from '../bilesenler/DurumMesaji';
import '../stiller/urun-detay.css';

function teknikBilgileriOku(deger) {
  if (!deger) return {};
  if (typeof deger === 'object') return deger;

  try {
    return JSON.parse(deger);
  } catch {
    return {};
  }
}

function grupSatirSayisi(satirlar, indeks) {
  if (!satirlar[indeks]?.grup) return 0;
  let satirSayisi = 1;
  while (satirlar[indeks + satirSayisi] && !satirlar[indeks + satirSayisi].grup) satirSayisi += 1;
  return satirSayisi;
}

function GeriDon({ yedekBaglanti }) {
  const navigate = useNavigate();
  const geriGit = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(yedekBaglanti);
  };
  return (
    <button type="button" className="urun-detay__geri" onClick={geriGit}>
      <ArrowLeft aria-hidden="true" /> Ürünlere Geri Dön
    </button>
  );
}

// Ürünün menu_kategori_adi/kategori_adi'sine karşılık gelen menü linkini (varsa) menu verisinden bulur.
function kategoriBaglantisiBul(menu, kategoriAdi) {
  const urunMenusu = (menu ?? []).find((oge) => oge.baglanti === '/urunler');
  for (const grup of urunMenusu?.alt_ogeler ?? []) {
    if (grup.baslik === kategoriAdi) return grup.baglanti;
    const altOge = (grup.alt_ogeler ?? []).find((alt) => alt.baslik === kategoriAdi);
    if (altOge) return altOge.baglanti;
  }
  return null;
}

export default function UrunDetaySayfasi({ menu = [], urunler = [] }) {
  const { slug } = useParams();
  const urun = urunler.find((kayit) => kayit.slug === slug);

  if (!urun) {
    return (
      <DurumMesaji
        baslik="Ürün bulunamadı"
        aciklama="Ürün bilgisi henüz eklenmemiş veya adresi değişmiş olabilir."
        eylem={<Link to="/urunler">Ürün kataloğuna dön</Link>}
      />
    );
  }

  const teknik = teknikBilgileriOku(urun.teknik_bilgiler);

  // Kaynağı doğrulanmayan ürünlerde boş veya tahmini teknik tablolar göstermiyoruz.
  if (teknik.detay_hazir_mi === false) {
    return (
      <DurumMesaji
        baslik="Ürün detayı hazırlanıyor"
        aciklama="Bu ürünün doğrulanmış teknik çizimi, tabloları ve dokümanları hazırlanıyor."
        eylem={<Link to="/urunler/su-grubu-vanalari">Su Grubu Vanalarına dön</Link>}
      />
    );
  }

  const basincGruplari = teknik.anma_basinci_gruplari || (teknik.anma_basinci_degerleri || []).filter(Boolean).map((deger) => ({ deger, sutun: 1 }));
  const cizimAlternatifMetni = teknik.teknik_cizim_alt
    || `${urun.ad.replace(/\s+F\d+\s+D-\d+$/i, '')} teknik çizimi`;

  // Bazı ürünlerde her basınç sınıfının (PN) DN aralığı farklıdır (ör. Glob Vana D-069'daki
  // FIG 1401/1430/1560/1570/1580 varyantları) — bu durumda tek ortak tablo yerine
  // olcu_tablolari dizisindeki her basınç sınıfı kendi ayrı tablosuyla gösterilir.
  const olcuTablolari = teknik.olcu_tablolari
    || ((teknik.olcu_basliklari?.length || teknik.olculer?.length)
      ? [{ baslik: null, basincGruplari, olcu_basliklari: teknik.olcu_basliklari || [], olculer: teknik.olculer || [] }]
      : []);

  const kategoriAdi = teknik.grup_adi || urun.kategori_adi;
  const kategoriBaglantisi = kategoriBaglantisiBul(menu, kategoriAdi);

  return (
    <article className="urun-detay">
      <header className="urun-detay__hero">
        <div>
          <span className="urun-detay__etiket">{kategoriAdi}</span>
          <h1>{urun.ad}</h1>
          <p>{urun.kisa_aciklama}</p>
        </div>
      </header>

      <div className="urun-detay__yol-bar">
        <GeriDon yedekBaglanti="/urunler" />
        <nav className="urun-detay__kirinti" aria-label="Sayfa yolu">
          <Link to="/"><Home aria-hidden="true" /> Ana Sayfa</Link>
          <span>/</span>
          <Link to="/urunler">Ürünler</Link>
          {kategoriAdi && (
            <>
              <span>/</span>
              {kategoriBaglantisi ? <Link to={kategoriBaglantisi}>{kategoriAdi}</Link> : <span>{kategoriAdi}</span>}
            </>
          )}
          <span>/</span>
          <strong>{urun.ad}</strong>
        </nav>
      </div>

      <div className="urun-detay__ust-grid">
        <section className={`urun-detay__panel urun-detay__cizim-paneli${teknik.parcalar?.length > 0 ? '' : ' urun-detay__panel--tam'}`}>
          <div className="urun-detay__panel-baslik">
            <h2><Layers3 aria-hidden="true" /> Teknik Çizim</h2>
            <Maximize2 aria-hidden="true" />
          </div>
          {teknik.teknik_cizim_yolu ? (
            <div className="urun-detay__cizim">
              <img src={teknik.teknik_cizim_yolu} alt={cizimAlternatifMetni} />
            </div>
          ) : (
            <div className="urun-detay__cizim urun-detay__cizim--bos">
              <img src="/assets/logo.png" alt="" aria-hidden="true" />
            </div>
          )}
          <p className="urun-detay__not">Teknik resim bilgilendirme amaçlıdır. Ölçüler üretim toleranslarına göre değişiklik gösterebilir.</p>
        </section>

        {teknik.parcalar?.length > 0 && (
          <section className="urun-detay__panel">
            <div className="urun-detay__panel-baslik">
              <h2><Layers3 aria-hidden="true" /> Parça Listesi ve Malzeme Yapısı</h2>
            </div>
            <div className="urun-detay__tablo-kaydir">
              <table className="urun-detay__tablo">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Parça Adı</th>
                    {teknik.parca_kolonlari
                      ? teknik.parca_kolonlari.map((kolon) => <th key={kolon} style={{ whiteSpace: 'pre-line' }}>{kolon}</th>)
                      : <th>Malzeme</th>}
                  </tr>
                </thead>
                <tbody>
                  {teknik.parcalar.map((parca, indeks) => (
                    <tr key={`${parca.no}-${indeks}`}>
                      <td>{parca.no}</td>
                      <td>{parca.ad}</td>
                      {parca.malzemeler
                        ? parca.malzemeler.map((malzeme, kolonIndeksi) => <td key={kolonIndeksi}>{malzeme}</td>)
                        : <td>{parca.malzeme}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {olcuTablolari.length > 0 && (
      <section className="urun-detay__panel urun-detay__olculer">
        <div className="urun-detay__panel-baslik">
          <h2><BarChart3 aria-hidden="true" /> Teknik Ölçüler ve Boyutlar</h2>
          {teknik.basinc && <strong>{teknik.basinc}</strong>}
        </div>
        {olcuTablolari.map((tablo, tabloIndeksi) => {
          // Bazı ürünlerde kaynak tablo DİKEY dizilidir (DN sütun değil satır: her satır bir
          // boy) — bunu yatay şemaya çevirmek yerine kaynaktaki yönünü aynen koruyarak,
          // basit bir başlık satırı + veri satırları tablosu olarak gösteriyoruz.
          if (tablo.yon === 'dikey') {
            return (
              <div className="urun-detay__tablo-kaydir" key={tablo.baslik ?? tabloIndeksi}>
                {tablo.baslik && <p className="urun-detay__olcu-tablo-baslik">{tablo.baslik}</p>}
                <table className="urun-detay__tablo urun-detay__tablo--olcu urun-detay__tablo--dikey">
                  <thead>
                    <tr>{tablo.kolonBasliklari.map((baslik, indeks) => <th key={indeks}>{baslik}</th>)}</tr>
                  </thead>
                  <tbody>
                    {tablo.satirlar.map((satir, satirIndeksi) => (
                      <tr key={satirIndeksi}>
                        {satir.map((deger, hucreIndeksi) => (
                          hucreIndeksi === 0
                            ? <th key={hucreIndeksi} scope="row">{deger}</th>
                            : <td key={hucreIndeksi}>{deger}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          // Kaynak sayfada her ürünün tablosu aynı değil: bazılarında "Anma Basıncı" satırı
          // ve "Vana Boyutları" grup sütunu hiç yok (yalnızca "SIZE DN" başlığı var) — bu
          // satır/sütunlar veri gerçekten varsa gösterilir, yoksa şablon olarak eklenmez.
          const grupVar = (tablo.olculer || []).some((satir) => satir.grup);
          const basincSatiriVar = Array.isArray(tablo.basincGruplari) && tablo.basincGruplari.length > 0;
          return (
            <div className="urun-detay__tablo-kaydir" key={tablo.baslik ?? tabloIndeksi}>
              {tablo.baslik && <p className="urun-detay__olcu-tablo-baslik">{tablo.baslik}</p>}
              <table
                className="urun-detay__tablo urun-detay__tablo--olcu"
                style={{ minWidth: (grupVar ? 165 : 0) + 84 + 56 * (tablo.olcu_basliklari?.length || 0) }}
              >
                <colgroup>
                  {grupVar && <col className="urun-detay__olcu-grup" />}
                  <col className="urun-detay__olcu-kod" />
                  {(tablo.olcu_basliklari || []).map((_, indeks) => <col key={indeks} />)}
                </colgroup>
                {basincSatiriVar && (
                  <thead>
                    <tr>
                      {grupVar && <th className="urun-detay__olcu-grup">Anma Basıncı</th>}
                      <th className="urun-detay__olcu-kod">PN</th>
                      {tablo.basincGruplari.map(({ deger, sutun }) => <th key={deger} colSpan={sutun}>{deger}</th>)}
                    </tr>
                  </thead>
                )}
                <tbody>
                  <tr className="urun-detay__cap-satiri">
                    {basincSatiriVar
                      ? (<>
                          {grupVar && <th className="urun-detay__olcu-grup" scope="row">Anma Çapı</th>}
                          <th className="urun-detay__olcu-kod" scope="row">DN</th>
                        </>)
                      : <th className="urun-detay__olcu-kod" scope="row" colSpan={grupVar ? 2 : 1}>SIZE DN</th>}
                    {(tablo.olcu_basliklari || []).map((baslik, indeks) => <td key={`${baslik}-${indeks}`}>{baslik}</td>)}
                  </tr>
                  {(tablo.olculer || []).map((satir, satirIndeksi, satirlar) => (
                    <tr key={`${satir.grup}-${satir.kod}`}>
                      {grupVar && grupSatirSayisi(satirlar, satirIndeksi) > 0 && <th className="urun-detay__olcu-grup" scope="rowgroup" rowSpan={grupSatirSayisi(satirlar, satirIndeksi)}>{satir.grup}</th>}
                      <th className="urun-detay__olcu-kod" scope="row">{satir.kod}</th>
                      {satir.gruplu_degerler
                        ? satir.gruplu_degerler.map(({ deger, sutun }, indeks) => <td key={`${satir.kod}-${indeks}`} colSpan={sutun}>{deger}</td>)
                        : satir.degerler.map((deger, indeks) => <td key={`${satir.kod}-${indeks}`}>{deger}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>
      )}

      {teknik.dokumanlar?.length > 0 && (
        <section className="urun-detay__panel urun-detay__dokumanlar">
          <div className="urun-detay__panel-baslik">
            <h2><FileText aria-hidden="true" /> Teknik Dokümanlar</h2>
            <p>Ürünle ilgili teknik dokümanları buradan indirebilirsiniz.</p>
          </div>
          <div className="urun-detay__dokuman-grid">
            {teknik.dokumanlar.map((dokuman) => (
              <a key={dokuman.baslik} href={dokuman.dosya_yolu} download className="urun-detay__dokuman">
                <span className="urun-detay__dokuman-ikon">
                  <img
                    src={dokuman.belge_turu === 'excel' ? '/assets/ikonlar/excel-ikonu-karti.png' : '/assets/ikonlar/pdf-ikonu-karti.png'}
                    alt=""
                    aria-hidden="true"
                  />
                  {/* Kaynak görseldeki rozet metni küçük boyutta okunmadığı için gerçek metin olarak eklendi; her boyutta net kalır. */}
                  <span className={`urun-detay__dokuman-rozet${dokuman.belge_turu === 'excel' ? ' urun-detay__dokuman-rozet--excel' : ''}`}>
                    {dokuman.belge_turu === 'excel' ? 'XLS' : 'PDF'}
                  </span>
                </span>
                <span><strong>{dokuman.baslik}</strong><small>{dokuman.aciklama || 'Teknik ürün dokümanı'}</small><em>{dokuman.tur || 'PDF'}</em></span>
                <span className="urun-detay__indir"><Download aria-hidden="true" /> İndir</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
