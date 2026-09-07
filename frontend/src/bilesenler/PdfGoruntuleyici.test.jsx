import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import PdfGoruntuleyici from './PdfGoruntuleyici';

const dokuman = {
  baslik: 'Çeviri Tablosu',
  dosya_adresi: '/dokumanlar/ceviri-tablosu',
  orijinal_dosya_adi: 'ceviri_tablosu.pdf',
  dosya_boyutu: 297187,
  indirmeye_izin_var_mi: 1,
  yeni_sekmede_acmaya_izin_var_mi: 1
};

const ayarlar = {
  teknik_pdf_yukleniyor_metni: 'PDF yükleniyor…',
  teknik_pdf_hata_basligi: 'PDF görüntülenemedi',
  teknik_pdf_hata_aciklamasi: 'Daha sonra deneyin.',
  teknik_pdf_indir_metni: 'İndir',
  teknik_pdf_yeni_sekme_metni: 'Yeni sekmede aç',
  teknik_pdf_kapat_etiketi: 'PDF görüntüleyiciyi kapat'
};

function sahtePdf(sayfaSayisi = 2) {
  return { numPages: sayfaSayisi, destroy: vi.fn() };
}

describe('PdfGoruntuleyici', () => {
  it('sayfa ve yakınlaştırma kontrollerini çalıştırır, izin verilen bağlantıları gösterir', async () => {
    const kullanici = userEvent.setup();
    const belge = sahtePdf();
    const cizici = vi.fn().mockResolvedValue(undefined);

    render(
      <PdfGoruntuleyici
        dokuman={dokuman}
        siteAyarlari={ayarlar}
        belgeYukleyici={vi.fn().mockResolvedValue(belge)}
        sayfaCizici={cizici}
        onKapat={vi.fn()}
      />
    );

    expect(await screen.findByRole('heading', { name: 'Çeviri Tablosu' })).toBeInTheDocument();
    expect(await screen.findByText('1 / 2')).toBeInTheDocument();
    await kullanici.click(screen.getByRole('button', { name: 'Sonraki sayfa' }));
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    await kullanici.click(screen.getByRole('button', { name: 'Yakınlaştır' }));
    expect(screen.getByText('110%')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'İndir' })).toHaveAttribute('download', 'ceviri_tablosu.pdf');
    expect(screen.getByRole('link', { name: 'Yeni sekmede aç' })).toHaveAttribute('target', '_blank');
  });

  it('indirme izni kapalıysa indirme bağlantısını üretmez', async () => {
    render(
      <PdfGoruntuleyici
        dokuman={{ ...dokuman, indirmeye_izin_var_mi: 0 }}
        siteAyarlari={ayarlar}
        belgeYukleyici={vi.fn().mockResolvedValue(sahtePdf(1))}
        sayfaCizici={vi.fn().mockResolvedValue(undefined)}
        onKapat={vi.fn()}
      />
    );

    await screen.findByText('1 / 1');
    expect(screen.queryByRole('link', { name: 'İndir' })).not.toBeInTheDocument();
  });

  it('yükleme hatasını kullanıcıya anlaşılır metinle bildirir', async () => {
    render(
      <PdfGoruntuleyici
        dokuman={dokuman}
        siteAyarlari={ayarlar}
        belgeYukleyici={vi.fn().mockRejectedValue(new Error('ağ ayrıntısı'))}
        sayfaCizici={vi.fn()}
        onKapat={vi.fn()}
      />
    );

    expect(await screen.findByRole('heading', { name: 'PDF görüntülenemedi' })).toBeInTheDocument();
    expect(screen.getByText('Daha sonra deneyin.')).toBeInTheDocument();
  });

  it('Escape ile kapanır ve açılıştan önceki odağı geri getirir', async () => {
    const kullanici = userEvent.setup();

    function Deneme() {
      const [acik, setAcik] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setAcik(true)}>Belgeyi aç</button>
          {acik && (
            <PdfGoruntuleyici
              dokuman={dokuman}
              siteAyarlari={ayarlar}
              belgeYukleyici={vi.fn().mockResolvedValue(sahtePdf(1))}
              sayfaCizici={vi.fn().mockResolvedValue(undefined)}
              onKapat={() => setAcik(false)}
            />
          )}
        </>
      );
    }

    render(<Deneme />);
    const acmaDugmesi = screen.getByRole('button', { name: 'Belgeyi aç' });
    await kullanici.click(acmaDugmesi);
    await screen.findByText('1 / 1');
    await kullanici.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByTestId('pdf-goruntuleyici')).not.toBeInTheDocument());
    expect(acmaDugmesi).toHaveFocus();
  });
});
