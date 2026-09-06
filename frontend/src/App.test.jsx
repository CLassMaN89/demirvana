import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

const kategoriler = Array.from({ length: 7 }, (_, indeks) => ({
  id: indeks + 1,
  ad: indeks === 0 ? 'Test Vanaları' : `Kategori ${indeks + 1}`,
  slug: indeks === 0 ? 'test-vanalari' : `kategori-${indeks + 1}`,
  gorsel_yolu: '/assets/urun-placeholder.svg',
  alternatif_metin: `Kategori ${indeks + 1} görseli`
}));

const sabitTestVerisi = {
  tema: {
    ana_mavi: '#123456', koyu_mavi: '#102030', acik_mavi: '#EDF3FF',
    beyaz: '#FFFFFF', metin: '#111827', ikincil_metin: '#667085'
  },
  menu: [{ id: 1, baslik: 'Test Ürünleri', baglanti: '/urunler', siralama: 1 }],
  sliderlar: [{
    id: 1,
    baslik: 'API içeriği hazır',
    aciklama: 'Entegrasyon testi',
    gorsel_yolu: '/assets/carousel/1.png',
    alternatif_metin: 'Test slider görseli',
    buton_metni: 'Ürünleri aç',
    buton_baglantisi: '/urunler',
    animasyon_turu: 'kaydir',
    odak_x: 50,
    odak_y: 50
  }],
  kategoriler,
  urunler: []
};

describe('App veri entegrasyonu', () => {
  it('veri kaynağından gelen içeriği ana sayfanın bütün bölümlerine bağlar', async () => {
    const veriKaynagi = async () => sabitTestVerisi;

    render(
      <MemoryRouter initialEntries={['/']}>
        <App veriKaynagi={veriKaynagi} />
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: 'Test Ürünleri' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'API içeriği hazır' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /öne çıkan içerikler/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ÜRÜN KATEGORİLERİMİZ' })).toBeInTheDocument();
    expect(screen.getAllByTestId('kategori-karti')).toHaveLength(8);
  });
});
