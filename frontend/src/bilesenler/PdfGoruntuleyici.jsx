import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Minus,
  Plus,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { pdfBelgesiYukle, pdfSayfasiCiz } from '../servisler/pdfBelgesi';

function dosyaBoyutunuBicimlendir(bayt) {
  const sayi = Number(bayt) || 0;
  const birim = sayi >= 1024 * 1024 ? 'MB' : 'KB';
  const deger = birim === 'MB' ? sayi / (1024 * 1024) : sayi / 1024;
  return `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(deger)} ${birim}`;
}

export default function PdfGoruntuleyici({
  dokuman,
  siteAyarlari,
  belgeYukleyici = pdfBelgesiYukle,
  sayfaCizici = pdfSayfasiCiz,
  onKapat
}) {
  const [pdf, setPdf] = useState(null);
  const [sayfa, setSayfa] = useState(1);
  const [olcek, setOlcek] = useState(1);
  const [durum, setDurum] = useState('yukleniyor');
  const anaCanvasRef = useRef(null);
  const kucukCanvaslarRef = useRef(new Map());
  const oncekiOdakRef = useRef(document.activeElement);

  useEffect(() => {
    let etkin = true;
    let yuklenenPdf = null;

    setPdf(null);
    setSayfa(1);
    setOlcek(1);
    setDurum('yukleniyor');

    belgeYukleyici(dokuman.dosya_adresi)
      .then((belge) => {
        yuklenenPdf = belge;
        if (!etkin) {
          belge.destroy?.();
          return;
        }
        setPdf(belge);
        setDurum('hazir');
      })
      .catch(() => {
        if (etkin) setDurum('hata');
      });

    return () => {
      etkin = false;
      yuklenenPdf?.destroy?.();
    };
  }, [dokuman.dosya_adresi, belgeYukleyici]);

  useEffect(() => {
    if (!pdf || !anaCanvasRef.current) return undefined;
    let etkin = true;

    sayfaCizici(pdf, sayfa, anaCanvasRef.current, olcek).catch(() => {
      if (etkin) setDurum('hata');
    });
    return () => { etkin = false; };
  }, [pdf, sayfa, olcek, sayfaCizici]);

  useEffect(() => {
    if (!pdf) return undefined;
    let etkin = true;

    // Küçük önizlemeler belge içinde hızlı gezinmeyi sağlar; ana canvas ölçeğinden bağımsız çizilir.
    Array.from({ length: pdf.numPages }, (_, indeks) => indeks + 1).forEach((sayfaNo) => {
      const canvas = kucukCanvaslarRef.current.get(sayfaNo);
      if (canvas) sayfaCizici(pdf, sayfaNo, canvas, 0.22).catch(() => { etkin = false; });
    });
    return () => { etkin = false; };
  }, [pdf, sayfaCizici]);

  useEffect(() => {
    const klavyeDinle = (olay) => {
      if (olay.key === 'Escape') onKapat();
    };
    document.addEventListener('keydown', klavyeDinle);

    return () => {
      document.removeEventListener('keydown', klavyeDinle);
      // Görüntüleyici kapanınca klavye kullanıcısı kaldığı doküman satırına geri döner.
      oncekiOdakRef.current?.focus?.();
    };
  }, [onKapat]);

  const sayfaSayisi = pdf?.numPages ?? 0;
  const ayar = (anahtar, yedek) => siteAyarlari?.[anahtar] || yedek;

  return (
    <section className="pdf-goruntuleyici" data-testid="pdf-goruntuleyici" aria-label={`${dokuman.baslik} PDF görüntüleyici`}>
      <header className="pdf-goruntuleyici__ust">
        <div>
          <h2>{dokuman.baslik}</h2>
          <p>{dokuman.orijinal_dosya_adi} <span aria-hidden="true">·</span> {dosyaBoyutunuBicimlendir(dokuman.dosya_boyutu)}</p>
        </div>

        <div className="pdf-goruntuleyici__araclar" aria-label="PDF araçları">
          <button type="button" aria-label="Önceki sayfa" disabled={!pdf || sayfa <= 1} onClick={() => setSayfa((deger) => Math.max(1, deger - 1))}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <span className="pdf-goruntuleyici__sayfa">{pdf ? `${sayfa} / ${sayfaSayisi}` : '— / —'}</span>
          <button type="button" aria-label="Sonraki sayfa" disabled={!pdf || sayfa >= sayfaSayisi} onClick={() => setSayfa((deger) => Math.min(sayfaSayisi, deger + 1))}>
            <ChevronRight aria-hidden="true" />
          </button>
          <span className="pdf-goruntuleyici__ayirici" aria-hidden="true" />
          <button type="button" aria-label="Uzaklaştır" disabled={olcek <= 0.5} onClick={() => setOlcek((deger) => Math.max(0.5, Number((deger - 0.1).toFixed(1))))}>
            <Minus aria-hidden="true" />
          </button>
          <span className="pdf-goruntuleyici__olcek">{Math.round(olcek * 100)}%</span>
          <button type="button" aria-label="Yakınlaştır" disabled={olcek >= 2} onClick={() => setOlcek((deger) => Math.min(2, Number((deger + 0.1).toFixed(1))))}>
            <Plus aria-hidden="true" />
          </button>
          <span className="pdf-goruntuleyici__ayirici" aria-hidden="true" />
          {Number(dokuman.indirmeye_izin_var_mi) === 1 && (
            <a href={dokuman.dosya_adresi} download={dokuman.orijinal_dosya_adi}>
              <Download aria-hidden="true" /> {ayar('teknik_pdf_indir_metni', 'İndir')}
            </a>
          )}
          {Number(dokuman.yeni_sekmede_acmaya_izin_var_mi) === 1 && (
            <a href={dokuman.dosya_adresi} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" /> {ayar('teknik_pdf_yeni_sekme_metni', 'Yeni sekmede aç')}
            </a>
          )}
          <button type="button" aria-label={ayar('teknik_pdf_kapat_etiketi', 'PDF görüntüleyiciyi kapat')} onClick={onKapat}>
            <X aria-hidden="true" />
          </button>
        </div>
      </header>

      {durum === 'yukleniyor' && <p className="pdf-goruntuleyici__durum" aria-live="polite">{ayar('teknik_pdf_yukleniyor_metni', 'PDF yükleniyor…')}</p>}
      {durum === 'hata' && (
        <div className="pdf-goruntuleyici__durum" role="alert" aria-live="polite">
          <h3>{ayar('teknik_pdf_hata_basligi', 'PDF görüntülenemedi')}</h3>
          <p>{ayar('teknik_pdf_hata_aciklamasi', 'Doküman şu anda açılamıyor.')}</p>
        </div>
      )}
      {pdf && durum === 'hazir' && (
        <div className="pdf-goruntuleyici__govde">
          <nav className="pdf-goruntuleyici__kucukler" aria-label="PDF sayfaları">
            {Array.from({ length: sayfaSayisi }, (_, indeks) => indeks + 1).map((sayfaNo) => (
              <button
                type="button"
                key={sayfaNo}
                aria-label={`${sayfaNo}. sayfaya git`}
                aria-current={sayfa === sayfaNo ? 'page' : undefined}
                onClick={() => setSayfa(sayfaNo)}
              >
                <canvas ref={(eleman) => eleman ? kucukCanvaslarRef.current.set(sayfaNo, eleman) : kucukCanvaslarRef.current.delete(sayfaNo)} />
                <span>{sayfaNo}</span>
              </button>
            ))}
          </nav>
          <div className="pdf-goruntuleyici__sayfa-alani">
            <canvas ref={anaCanvasRef} aria-label={`${sayfa}. PDF sayfası`} />
          </div>
        </div>
      )}
    </section>
  );
}
