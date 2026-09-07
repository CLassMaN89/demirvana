import { beforeEach, describe, expect, it, vi } from 'vitest';

const { belgeGorevi, getDocument } = vi.hoisted(() => ({
  belgeGorevi: { promise: Promise.resolve({ numPages: 1 }) },
  getDocument: vi.fn()
}));

vi.mock('pdfjs-dist', () => ({
  getDocument,
  GlobalWorkerOptions: { workerSrc: '' }
}));

vi.mock('pdfjs-dist/build/pdf.worker.mjs?url', () => ({ default: '/pdf.worker.mjs' }));

import { pdfBelgesiYukle, pdfSayfasiCiz } from './pdfBelgesi';

describe('PDF.js adaptörü', () => {
  beforeEach(() => {
    getDocument.mockReset();
    getDocument.mockReturnValue(belgeGorevi);
  });

  it('kayıtlı doküman adresini kimlik bilgisi göndermeden PDF.js ile yükler', async () => {
    await pdfBelgesiYukle('/dokumanlar/ceviri-tablosu');

    expect(getDocument).toHaveBeenCalledWith({
      url: '/dokumanlar/ceviri-tablosu',
      withCredentials: false
    });
  });

  it('sayfa boyutunu ölçeklenmiş görünüme göre ayarlayıp canvas üzerine çizer', async () => {
    const render = vi.fn(() => ({ promise: Promise.resolve() }));
    const pdf = {
      getPage: vi.fn(async () => ({
        getViewport: vi.fn(() => ({ width: 612.2, height: 792.7 })),
        render
      }))
    };
    const baglam = {};
    const canvas = { width: 0, height: 0, getContext: vi.fn(() => baglam) };

    await pdfSayfasiCiz(pdf, 1, canvas, 1.1);

    expect(canvas.width).toBe(613);
    expect(canvas.height).toBe(793);
    expect(render).toHaveBeenCalledWith({
      canvasContext: baglam,
      viewport: { width: 612.2, height: 792.7 }
    });
  });
});
