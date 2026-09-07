import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Worker uygulamayla birlikte paketlenir; PDF içeriği üçüncü taraf bir CDN'ye gönderilmez.
GlobalWorkerOptions.workerSrc = pdfWorker;

export async function pdfBelgesiYukle(adres) {
  return getDocument({ url: adres, withCredentials: false }).promise;
}

export async function pdfSayfasiCiz(pdf, sayfaNo, canvas, olcek) {
  const sayfa = await pdf.getPage(sayfaNo);
  const gorunum = sayfa.getViewport({ scale: olcek });
  const baglam = canvas.getContext('2d', { alpha: false });

  canvas.width = Math.ceil(gorunum.width);
  canvas.height = Math.ceil(gorunum.height);
  await sayfa.render({ canvasContext: baglam, viewport: gorunum }).promise;
}
