import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, expect, it } from 'vitest';
import TeknikSayfasi from './TeknikSayfasi';

vi.mock('../bilesenler/PdfGoruntuleyici', () => ({
  default: ({ dokuman }) => <div data-testid="pdf-goruntuleyici">{dokuman.baslik} açık</div>
}));

const kategoriler = [
  {
    id: 1,
    ad: 'Teknik Tablolar',
    aciklama: 'Teknik değerleri inceleyin.',
    ikon_adi: 'dosya-hesaplama',
    dokumanlar: [{ id: 1, baslik: 'Çeviri Tablosu', alternatif_aciklama: 'Birim çevirileri' }]
  },
  {
    id: 2,
    ad: 'Kullanma Talimatları',
    aciklama: 'Kullanım belgeleri.',
    ikon_adi: 'kitap-acik',
    dokumanlar: []
  }
];

describe('TeknikSayfasi', () => {
  it('yönetilebilir kategorileri gösterir ve seçilen PDF görüntüleyicisini açar', async () => {
    const kullanici = userEvent.setup();
    render(<TeknikSayfasi kategoriler={kategoriler} siteAyarlari={{ teknik_hero_basligi: 'Teknik' }} />);

    expect(screen.getByRole('heading', { name: 'Teknik', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Teknik Tablolar' })).toBeInTheDocument();
    expect(screen.getByText('1 doküman')).toBeInTheDocument();
    expect(screen.getByText('0 doküman')).toBeInTheDocument();
    await kullanici.click(screen.getByRole('button', { name: /Çeviri Tablosu/ }));
    expect(screen.getByTestId('pdf-goruntuleyici')).toBeInTheDocument();
  });
});
