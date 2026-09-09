import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import UrunDetaySayfasi from './UrunDetaySayfasi';

const urun = {
  id: 1,
  ad: 'Metal Sitli Sürgülü Vana F4 D-001',
  slug: 'metal-sitli-surgulu-vana-f4-d-001',
  kisa_aciklama: 'Endüstriyel akışkan kontrolünde güvenilir performans.',
  kategori_adi: 'Su Grubu Vanaları',
  teknik_bilgiler: JSON.stringify({
    grup_adi: 'Sürgülü Vanalar',
    teknik_cizim_yolu: '/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/teknik-cizim.png',
    parcalar: [{ no: '1', ad: 'Gövde', malzeme: 'GG 25 / GGG-40' }],
    olcu_basliklari: ['40', '50'],
    anma_basinci_degerleri: ['10', '6'],
    olculer: [{ grup: 'Vana Boyutları', kod: 'L', degerler: ['140', '150'] }],
    dokumanlar: [
      { baslik: 'Birim Fiyat Excel', tur: 'XLSX', belge_turu: 'excel', dosya_yolu: '/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001 Birim Fiyat.xlsx' },
      { baslik: 'Ürün PDF', tur: 'PDF', dosya_yolu: '/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001.pdf' }
    ]
  })
};

describe('UrunDetaySayfasi', () => {
  it('ürünün teknik çizimini, tablolarını ve yerel dokümanını gösterir', () => {
    render(
      <MemoryRouter initialEntries={[`/urunler/${urun.slug}`]}>
        <Routes>
          <Route path="/urunler/:slug" element={<UrunDetaySayfasi urunler={[urun]} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: urun.ad })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /metal sitli sürgülü vana teknik çizimi/i })).toHaveAttribute('src', expect.stringContaining('teknik-cizim.png'));
    expect(screen.getByRole('heading', { name: 'Parça Listesi ve Malzeme Yapısı' })).toBeInTheDocument();
    expect(screen.getByText('GG 25 / GGG-40')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Teknik Ölçüler ve Boyutlar' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: 'Anma Basıncı PN 10 6' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Birim Fiyat Excel/i })).toHaveAttribute('href', expect.stringContaining('Birim Fiyat.xlsx'));
    expect(screen.getByRole('link', { name: /Ürün PDF/i })).toHaveAttribute('href', expect.stringContaining('Metal Sitli Sürgülü Vana F4 D-001.pdf'));
  });
});
