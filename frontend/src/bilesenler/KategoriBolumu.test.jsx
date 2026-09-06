import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KategoriBolumu from './KategoriBolumu';

const yediKategori = [
  ['Küresel Vanalar', 'kuresel-vanalar'],
  ['Kelebek Vanalar', 'kelebek-vanalar'],
  ['Sürgülü Vanalar', 'surgulu-vanalar'],
  ['Çekvalfler', 'cekvalfler'],
  ['Globe Vanalar', 'globe-vanalar'],
  ['Pislik Tutucular', 'pislik-tutucular'],
  ['Kontrol Vanaları', 'kontrol-vanalari']
].map(([ad, slug], indeks) => ({
  id: indeks + 1,
  ad,
  slug,
  gorsel_yolu: '/assets/urun-placeholder.svg',
  alternatif_metin: `${ad} ürün grubu`
}));

describe('KategoriBolumu', () => {
  it('yedi kategori ve Tüm Ürünler bağlantısıyla tam sekiz kart gösterir', () => {
    render(
      <MemoryRouter>
        <KategoriBolumu kategoriler={yediKategori} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'ÜRÜN KATEGORİLERİMİZ' })).toBeInTheDocument();
    expect(screen.getAllByTestId('kategori-karti')).toHaveLength(8);
    expect(screen.getByRole('link', { name: /küresel vanalar/i })).toHaveAttribute(
      'href',
      '/kategoriler/kuresel-vanalar'
    );
    expect(screen.getByRole('link', { name: /tüm ürünler/i })).toHaveAttribute(
      'href',
      '/urunler'
    );
  });
});
