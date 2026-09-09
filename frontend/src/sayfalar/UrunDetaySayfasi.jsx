import { BarChart3, Download, FileText, Layers3, Maximize2, Settings, ShieldCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
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

export default function UrunDetaySayfasi({ urunler = [] }) {
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
  const basincGruplari = teknik.anma_basinci_gruplari || (teknik.anma_basinci_degerleri || []).filter(Boolean).map((deger) => ({ deger, sutun: 1 }));
  const cizimAlternatifMetni = teknik.teknik_cizim_alt
    || `${urun.ad.replace(/\s+F\d+\s+D-\d+$/i, '')} teknik çizimi`;
  const guvenDegerleri = [
    { ikon: ShieldCheck, baslik: 'Yüksek Dayanım' },
    { ikon: Settings, baslik: 'Güvenilir Performans' },
    { ikon: BarChart3, baslik: 'Endüstriyel Kullanım' }
  ];

  return (
    <article className="urun-detay">
      <header className="urun-detay__hero">
        <div>
          <span className="urun-detay__etiket">{teknik.grup_adi || urun.kategori_adi}</span>
          <h1>{urun.ad}</h1>
          <p>{urun.kisa_aciklama}</p>
        </div>
        <div className="urun-detay__guven" aria-label="Ürün özellikleri">
          {guvenDegerleri.map(({ ikon: Ikon, baslik }) => (
            <div key={baslik} className="urun-detay__guven-oge">
              <span><Ikon aria-hidden="true" /></span>
              <strong>{baslik}</strong>
            </div>
          ))}
        </div>
      </header>

      <div className="urun-detay__ust-grid">
        <section className="urun-detay__panel urun-detay__cizim-paneli">
          <div className="urun-detay__panel-baslik">
            <h2><Layers3 aria-hidden="true" /> Teknik Çizim</h2>
            <Maximize2 aria-hidden="true" />
          </div>
          <div className="urun-detay__cizim">
            <img src={teknik.teknik_cizim_yolu} alt={cizimAlternatifMetni} />
          </div>
          <p className="urun-detay__not">Teknik resim bilgilendirme amaçlıdır. Ölçüler üretim toleranslarına göre değişiklik gösterebilir.</p>
        </section>

        <section className="urun-detay__panel">
          <div className="urun-detay__panel-baslik">
            <h2><Layers3 aria-hidden="true" /> Parça Listesi ve Malzeme Yapısı</h2>
          </div>
          <div className="urun-detay__tablo-kaydir">
            <table className="urun-detay__tablo">
              <thead><tr><th>No</th><th>Parça Adı</th><th>Malzeme</th></tr></thead>
              <tbody>
                {(teknik.parcalar || []).map((parca, indeks) => (
                  <tr key={`${parca.no}-${indeks}`}><td>{parca.no}</td><td>{parca.ad}</td><td>{parca.malzeme}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="urun-detay__panel urun-detay__olculer">
        <div className="urun-detay__panel-baslik">
          <h2><BarChart3 aria-hidden="true" /> Teknik Ölçüler ve Boyutlar</h2>
          {teknik.basinc && <strong>{teknik.basinc}</strong>}
        </div>
        <div className="urun-detay__tablo-kaydir">
          <table className="urun-detay__tablo urun-detay__tablo--olcu">
            <thead>
              <tr><th>Anma Basıncı</th><th>PN</th>{basincGruplari.map(({ deger, sutun }) => <th key={deger} colSpan={sutun}>{deger}</th>)}</tr>
            </thead>
            <tbody>
              <tr className="urun-detay__cap-satiri"><th scope="row">Anma Çapı</th><th scope="row">DN</th>{(teknik.olcu_basliklari || []).map((baslik) => <td key={baslik}>{baslik}</td>)}</tr>
              {(teknik.olculer || []).map((satir, satirIndeksi, satirlar) => (
                <tr key={`${satir.grup}-${satir.kod}`}>
                  {grupSatirSayisi(satirlar, satirIndeksi) > 0 && <th scope="rowgroup" rowSpan={grupSatirSayisi(satirlar, satirIndeksi)}>{satir.grup}</th>}
                  <th scope="row">{satir.kod}</th>
                  {satir.degerler.map((deger, indeks) => <td key={`${satir.kod}-${indeks}`}>{deger}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="urun-detay__panel urun-detay__dokumanlar">
        <div className="urun-detay__panel-baslik">
          <h2><FileText aria-hidden="true" /> Teknik Dokümanlar</h2>
          <p>Ürünle ilgili teknik dokümanları buradan indirebilirsiniz.</p>
        </div>
        <div className="urun-detay__dokuman-grid">
          {(teknik.dokumanlar || []).map((dokuman) => (
            <a key={dokuman.baslik} href={dokuman.dosya_yolu} download className="urun-detay__dokuman">
              <span className={`urun-detay__dokuman-ikon${dokuman.belge_turu === 'excel' ? ' urun-detay__dokuman-ikon--excel' : ''}`}><FileText aria-hidden="true" /></span>
              <span><strong>{dokuman.baslik}</strong><small>{dokuman.aciklama || 'Teknik ürün dokümanı'}</small><em>{dokuman.tur || 'PDF'}</em></span>
              <span className="urun-detay__indir"><Download aria-hidden="true" /> İndir</span>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
