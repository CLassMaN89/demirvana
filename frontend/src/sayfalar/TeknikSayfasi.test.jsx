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
    ad: 'TEKNİK TABLOLAR',
    aciklama: 'Teknik değerleri inceleyin.',
    ikon_adi: 'dosya-hesaplama',
    dokumanlar: [
      { id: 1, baslik: 'Çeviri Tablosu', alternatif_aciklama: 'Birim çevirileri' },
      { id: 2, baslik: 'Basınç Sıcaklık Tablosu', alternatif_aciklama: 'Basınç değerleri' }
    ]
  },
  {
    id: 2,
    ad: 'KULLANMA TALİMATLARI',
    aciklama: 'Kullanım belgeleri.',
    ikon_adi: 'kitap-acik',
    dokumanlar: []
  }
];

describe('TeknikSayfasi', () => {
  it('yönetilebilir kategorileri gösterir ve seçilen PDF görüntüleyicisini açar', async () => {
    const kullanici = userEvent.setup();
    render(<TeknikSayfasi kategoriler={kategoriler} siteAyarlari={{ teknik_hero_basligi: 'Teknik' }} />);

    expect(screen.getByRole('heading', { name: 'Teknik tablolar ve kullanma talimatları', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'TEKNİK TABLOLAR' })).toBeInTheDocument();
    expect(screen.getByText('2 doküman')).toBeInTheDocument();
    expect(screen.getByText('0 doküman')).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'PDF' })).toHaveLength(2);
    await kullanici.click(screen.getByRole('button', { name: /Çeviri Tablosu/ }));
    expect(await screen.findByTestId('pdf-goruntuleyici')).toBeInTheDocument();
  });
});
