import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SertifikalarSayfasi from './SertifikalarSayfasi';

vi.mock('../bilesenler/SertifikaGoruntuleyici', () => ({
  default: ({ sertifika }) => <div data-testid="sertifika-goruntuleyici">{sertifika.baslik} açık</div>
}));

const veri = {
  kategoriler: [
    { id: 1, ad: 'ISO', slug: 'iso', siralama: 1 },
    { id: 2, ad: 'Resmi Belgeler', slug: 'resmi-belgeler', siralama: 2 },
    { id: 3, ad: 'Marka', slug: 'marka', siralama: 3 }
  ],
  kayitlar: [
    { id: 1, kategori_id: 1, kategori_adi: 'ISO', kategori_slug: 'iso', baslik: 'ISO 9001 ENG', slug: 'iso-9001-eng', aciklama: 'İngilizce kalite belgesi', onizleme_yolu: '/iso-eng.png' },
    { id: 2, kategori_id: 1, kategori_adi: 'ISO', kategori_slug: 'iso', baslik: 'ISO 9001 TR', slug: 'iso-9001-tr', aciklama: 'Türkçe kalite belgesi', onizleme_yolu: '/iso-tr.png' },
    { id: 3, kategori_id: 3, kategori_adi: 'Marka', kategori_slug: 'marka', baslik: 'Marka Tescil Belgesi', slug: 'marka-tescil-belgesi', aciklama: 'Marka tescil belgesi', onizleme_yolu: '/marka.png' },
    { id: 4, kategori_id: 2, kategori_adi: 'Resmi Belgeler', kategori_slug: 'resmi-belgeler', baslik: 'Sanayi Sicil Belgesi', slug: 'sanayi-sicil-belgesi', aciklama: 'Resmi sanayi belgesi', onizleme_yolu: '/sanayi.png' }
  ]
};

describe('SertifikalarSayfasi', () => {
  it('kütüphaneyi gösterir ve ilk sertifikayı başlangıçta seçer', async () => {
    render(<SertifikalarSayfasi sertifikalar={veri} siteAyarlari={{}} />);

    expect(screen.getByRole('heading', { name: 'Sertifikalar', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /ISO 9001/ })).toHaveLength(2);
    expect(await screen.findByTestId('sertifika-goruntuleyici')).toHaveTextContent('ISO 9001 ENG açık');
  });

  it('arama, kategori filtresi ve belge seçimini birlikte çalıştırır', async () => {
    const kullanici = userEvent.setup();
    render(<SertifikalarSayfasi sertifikalar={veri} siteAyarlari={{}} />);

    await kullanici.click(screen.getByRole('button', { name: 'Marka 1' }));
    expect(screen.getByRole('button', { name: /Marka Tescil Belgesi/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ISO 9001 ENG/ })).not.toBeInTheDocument();

    await kullanici.click(screen.getByRole('button', { name: 'Tümü 4' }));
    await kullanici.type(screen.getByRole('searchbox', { name: 'Sertifika ara' }), 'sanayi');
    await kullanici.click(screen.getByRole('button', { name: /Sanayi Sicil Belgesi/ }));
    expect(screen.getByTestId('sertifika-goruntuleyici')).toHaveTextContent('Sanayi Sicil Belgesi açık');
  });

  it('eşleşme olmadığında yönetilebilir boş durum metnini gösterir', async () => {
    const kullanici = userEvent.setup();
    render(<SertifikalarSayfasi sertifikalar={veri} siteAyarlari={{ sertifika_bos_metni: 'Belge bulunamadı.' }} />);
    await kullanici.type(screen.getByRole('searchbox', { name: 'Sertifika ara' }), 'yok');
    expect(screen.getByText('Belge bulunamadı.')).toBeInTheDocument();
  });
});
