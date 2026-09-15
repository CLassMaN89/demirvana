import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SeoMerkeziSayfasi from './SeoMerkeziSayfasi';

const seoVerisi = { site_sagligi: { saglik_puani: 86, toplam_url: 24, sorun_sayisi: 2 }, sorunlar: [{ id: 1, onem: 'orta', aciklama: 'SEO başlığı uzun.', url_yolu: '/urunler/vana' }], rakip_analizleri: [{ id: 1, ad: 'Demir Vana', bizim_sitemiz_mi: 1, http_durumu: 200, yanit_suresi_ms: 420, seo_puani: 86, sitemap_url_sayisi: 24, kelime_sayisi: 900, schema_sayisi: 2, h1_sayisi: 1, tarama_tarihi: '2026-09-14 12:00:00' }] };
vi.mock('../servisler/api', () => ({ seoGenelBakisGetir: vi.fn(() => Promise.resolve(seoVerisi)), seoSiteyiTara: vi.fn(() => Promise.resolve(seoVerisi)), seoRakipleriTara: vi.fn(() => Promise.resolve(seoVerisi)), ziyaretYonetimVerisiniGetir: vi.fn(() => Promise.resolve({ kayitlar: [{ olusturulma_tarihi: '2026-09-14 12:00:00', kullanici_ajani: 'Chrome Windows' }] })) }));

describe('SeoMerkeziSayfasi', () => {
  beforeEach(() => vi.clearAllMocks());
  test('yedi SEO sekmesini gösterir ve seçimi URL sorgusuna yazar', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=genel-bakis']}><SeoMerkeziSayfasi /></MemoryRouter>);
    const sekmeler = screen.getByRole('navigation', { name: 'SEO Merkezi bölümleri' });
    expect(sekmeler.querySelectorAll('button')).toHaveLength(7);
    expect(screen.getByRole('button', { name: 'İçerik Fırsatları' })).toHaveAttribute('title', expect.stringContaining('SEO geliştirmelerini'));
    fireEvent.click(screen.getByRole('button', { name: 'Site Sağlığı' }));
    expect(await screen.findByRole('heading', { name: 'Site Sağlığı' })).toBeInTheDocument();
  });

  test('genel bakışta gerçek site denetimi sonucunu gösterir', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=bilinmeyen']}><SeoMerkeziSayfasi /></MemoryRouter>);
    expect(await screen.findByText('Google Görünürlüğü')).toBeInTheDocument();
    expect(await screen.findAllByText('86/100')).toHaveLength(2);
    expect(screen.getByText('SEO başlığı uzun.')).toBeInTheDocument();
    expect(screen.getByText('Vana')).toBeInTheDocument();
    expect(screen.getByText('Önemli Fırsatlar (AI Önerileri)')).toHaveAttribute('data-tooltip', expect.stringContaining('öncelikli SEO'));
    expect(screen.getByText('Son Rakip Hareketleri')).toBeInTheDocument();
    expect(screen.getByText('Sıralama Değişimi')).toBeInTheDocument();
    expect(screen.getAllByText('SEO analizi güncellendi')).toHaveLength(1);
    expect(screen.getByText('92')).toBeInTheDocument();
  });
});
