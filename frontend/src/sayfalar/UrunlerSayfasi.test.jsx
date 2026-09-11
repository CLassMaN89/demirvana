import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import UrunlerSayfasi from './UrunlerSayfasi';

const menu = [{
  id: 1,
  baslik: 'Ürünler',
  baglanti: '/urunler',
  alt_ogeler: [
    {
      id: 11,
      baslik: 'Vana',
      baglanti: '/urunler/vana',
      alt_ogeler: [
        { id: 111, baslik: 'Su Grubu Vanaları', baglanti: '/urunler/su-grubu-vanalari' },
        { id: 112, baslik: 'Buhar Grubu Vanaları', baglanti: '/urunler/buhar-grubu-vanalari' }
      ]
    },
    { id: 12, baslik: 'Aktüatör', baglanti: '/urunler/aktuator', alt_ogeler: [{ id: 121, baslik: 'Pnömatik Aktüatör', baglanti: '/urunler/pnomatik-aktuator' }] },
    { id: 13, baslik: 'Otomasyon', baglanti: '/urunler/otomasyon', alt_ogeler: [{ id: 131, baslik: 'Debi (Akış)', baglanti: '/urunler/debi-akis' }] }
  ]
}];

const urunler = [
  { id: 1, kategori_adi: 'Su Grubu Vanaları', ad: 'Metal Sitli Sürgülü Vana F4 D-001', slug: 'metal-sitli-surgulu-vana-f4-d-001', stok_kodu: 'D-001', katalog_bilgileri: { dn: 'DN 40 - 900', standart: 'TS 457/1', basinc: 'PN 10 / PN 6' } },
  { id: 2, kategori_adi: 'Su Grubu Vanaları', ad: 'Metal Sitli Sürgülü Vana F5 D-003', slug: 'metal-sitli-surgulu-vana-f5-d-003', stok_kodu: 'D-003', detay_hazir_mi: false, katalog_bilgileri: { dn: 'DN 50 - 600' } },
  { id: 3, kategori_adi: 'Su Grubu Vanaları', ad: 'Elastomer Sitli Sürgülü Vana F4 D-010', slug: 'elastomer-sitli-surgulu-vana-f4-d-010', stok_kodu: 'D-010', detay_hazir_mi: false, katalog_bilgileri: { dn: 'DN 40 - 600' } },
  { id: 4, kategori_adi: 'Su Grubu Vanaları', ad: 'Elastomer Sitli Sürgülü Vana F5 D-385', slug: 'elastomer-sitli-surgulu-vana-f5-d-385', stok_kodu: 'D-385', detay_hazir_mi: false, katalog_bilgileri: { dn: 'DN 50 - 600' } },
  { id: 5, kategori_adi: 'Su Grubu Vanaları', ad: 'Yükselen Milli Sürgülü Vana F4/S D-000', slug: 'yukselen-milli-surgulu-vana-f4-s-d-000', stok_kodu: 'D-000', detay_hazir_mi: false, katalog_bilgileri: { dn: 'DN 50 - 600' } },
  { id: 6, kategori_adi: 'Buhar Grubu Vanaları', ad: 'Buhar Basınç Düşürücü D-066', slug: 'buhar-basinc-dusurucu-d-066', stok_kodu: 'D-066', detay_hazir_mi: false, katalog_bilgileri: {} }
];

function sayfayiAc() {
  return render(
    <MemoryRouter initialEntries={['/urunler/su-grubu-vanalari']}>
      <UrunlerSayfasi menu={menu} urunler={urunler} />
    </MemoryRouter>
  );
}

describe('Ürün kataloğu sayfası', () => {
  it('su grubu kataloğunda beş ürünü ve yalnız hazır ürünün detay bağlantısını gösterir', () => {
    sayfayiAc();

    expect(screen.getByRole('heading', { name: 'Su Grubu Vanaları' })).toBeInTheDocument();
    expect(screen.getAllByTestId('urun-katalog-karti')).toHaveLength(5);
    expect(screen.getByRole('link', { name: /Metal Sitli Sürgülü Vana F4 D-001 detayını gör/i })).toHaveAttribute('href', '/urunler/metal-sitli-surgulu-vana-f4-d-001');
    expect(screen.getAllByText('Detay hazırlanıyor')).toHaveLength(4);
    expect(screen.queryByText('Buhar Basınç Düşürücü D-066')).not.toBeInTheDocument();
  });

  it('liste görünümü düğmesine basınca ürünleri liste düzenine geçirir', async () => {
    const kullanici = userEvent.setup();
    sayfayiAc();

    await kullanici.click(screen.getByRole('button', { name: 'Liste görünümü' }));

    expect(screen.getByTestId('urun-katalog-listesi')).toHaveClass('urun-katalog__urunler--liste');
    expect(screen.getByRole('button', { name: 'Liste görünümü' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('sol menü grubu hem kapanır hem yeniden açılır', async () => {
    const kullanici = userEvent.setup();
    sayfayiAc();
    const vanaDugmesi = screen.getByRole('button', { name: 'Vana menüsünü aç veya kapat' });

    expect(vanaDugmesi).toHaveAttribute('aria-expanded', 'true');
    await kullanici.click(vanaDugmesi);
    expect(vanaDugmesi).toHaveAttribute('aria-expanded', 'false');
    await kullanici.click(vanaDugmesi);
    expect(vanaDugmesi).toHaveAttribute('aria-expanded', 'true');
  });
});
