import { Download, ExternalLink, Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { pdfBelgesiYukle, pdfSayfasiCiz } from '../servisler/pdfBelgesi';

export default function SertifikaGoruntuleyici({
  sertifika,
  siteAyarlari = {},
  belgeYukleyici = pdfBelgesiYukle,
  sayfaCizici = pdfSayfasiCiz
}) {
  const [pdf, setPdf] = useState(null);
  const [olcek, setOlcek] = useState(0.9);
  const [durum, setDurum] = useState('yukleniyor');
  const canvasRef = useRef(null);
  const ayar = (anahtar, yedek) => siteAyarlari?.[anahtar] || yedek;

  useEffect(() => {
    let etkin = true;
    let yuklenenPdf = null;
    setPdf(null);
    setOlcek(0.9);
    setDurum('yukleniyor');

    // Ağır PDF.js yalnız seçili sertifika için çalışır; listedeki diğer belgeler hafif PNG önizlemesi kullanır.
    belgeYukleyici(sertifika.dosya_adresi)
      .then((belge) => {
        yuklenenPdf = belge;
        if (!etkin) return belge.destroy?.();
        setPdf(belge);
        setDurum('hazir');
      })
      .catch(() => etkin && setDurum('hata'));

    return () => {
      etkin = false;
      yuklenenPdf?.destroy?.();
    };
  }, [sertifika.dosya_adresi, belgeYukleyici]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return undefined;
    let etkin = true;
    sayfaCizici(pdf, 1, canvasRef.current, olcek).catch(() => etkin && setDurum('hata'));
    return () => { etkin = false; };
  }, [pdf, olcek, sayfaCizici]);

  return (
    <section className="sertifika-goruntuleyici" data-testid="sertifika-goruntuleyici" aria-label={`${sertifika.baslik} PDF görüntüleyici`}>
      <header className="sertifika-goruntuleyici__ust">
        <div className="sertifika-goruntuleyici__baslik">
          <h2>{sertifika.baslik}</h2>
          <p>{sertifika.aciklama}</p>
        </div>
        <div className="sertifika-goruntuleyici__eylemler">
          {Number(sertifika.yeni_sekmede_acmaya_izin_var_mi) === 1 && (
            <a className="sertifika-dugme sertifika-dugme--ikincil" href={sertifika.dosya_adresi} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" /> {ayar('sertifika_pdf_ac_metni', 'PDF Aç')}
            </a>
          )}
          {Number(sertifika.indirmeye_izin_var_mi) === 1 && (
            <a className="sertifika-dugme" href={sertifika.dosya_adresi} download={sertifika.orijinal_dosya_adi}>
              <Download aria-hidden="true" /> {ayar('sertifika_pdf_indir_metni', 'İndir')}
            </a>
          )}
        </div>
      </header>

      <div className="sertifika-goruntuleyici__araclar" aria-label="PDF araçları">
        <span>1 / {pdf?.numPages ?? sertifika.sayfa_sayisi ?? 1}</span>
        <button type="button" aria-label="Uzaklaştır" disabled={olcek <= 0.5} onClick={() => setOlcek((deger) => Math.max(0.5, Number((deger - 0.1).toFixed(1))))}><Minus aria-hidden="true" /></button>
        <strong>%{Math.round(olcek * 100)}</strong>
        <button type="button" aria-label="Yakınlaştır" disabled={olcek >= 1.6} onClick={() => setOlcek((deger) => Math.min(1.6, Number((deger + 0.1).toFixed(1))))}><Plus aria-hidden="true" /></button>
      </div>

      <div className="sertifika-goruntuleyici__belge">
        {durum === 'yukleniyor' && <p aria-live="polite">{ayar('sertifika_pdf_yukleniyor_metni', 'Sertifika yükleniyor…')}</p>}
        {durum === 'hata' && (
          <div role="alert"><h3>{ayar('sertifika_pdf_hata_basligi', 'Sertifika görüntülenemedi')}</h3><p>{ayar('sertifika_pdf_hata_aciklamasi', 'Belge şu anda açılamıyor.')}</p></div>
        )}
        <canvas ref={canvasRef} className={durum === 'hazir' ? '' : 'sertifika-goruntuleyici__canvas--gizli'} aria-label={`${sertifika.baslik} belgesi`} />
      </div>
    </section>
  );
}
