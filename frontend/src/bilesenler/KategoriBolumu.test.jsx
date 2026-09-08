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
  gorsel_yolu: `/assets/kategoriler/${slug}.webp`,
  alternatif_metin: `${ad} ürün grubu`,
  aciklama: `${ad} için endüstriyel çözümler`
}));

describe('KategoriBolumu', () => {
  it('yedi kategori ve Tüm Ürünler bağlantısıyla tam sekiz kart gösterir', () => {
    render(
      <MemoryRouter>
        <KategoriBolumu
          kategoriler={yediKategori}
          siteAyarlari={{ kategori_kart_varsayilan_alt_metni: 'Ürün grubu' }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'ÜRÜN KATEGORİLERİMİZ' })).toBeInTheDocument();
    expect(screen.getAllByTestId('kategori-karti')).toHaveLength(8);
    expect(screen.getByRole('link', { name: /küresel vanalar/i })).toHaveAttribute(
      'href',
      '/kategoriler/kuresel-vanalar'
    );
    expect(screen.getByRole('img', { name: 'Küresel Vanalar ürün grubu' })).toHaveAttribute(
      'src',
      '/assets/kategoriler/kuresel-vanalar.webp'
    );
    expect(screen.getByText('Küresel Vanalar için endüstriyel çözümler')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tüm Ürünler' })).toHaveAttribute(
      'href',
      '/urunler'
    );
    expect(screen.getByRole('link', { name: 'Tüm ürünleri gör' })).toHaveAttribute(
      'href',
      '/urunler'
    );
  });

  it('admin görünürlük ayarı kapalıyken bölümü çizmez', () => {
    const { container } = render(<MemoryRouter><KategoriBolumu kategoriler={yediKategori} siteAyarlari={{ kategori_bolumu_aktif_mi: '0' }} /></MemoryRouter>);
    expect(container).toBeEmptyDOMElement();
  });
});
