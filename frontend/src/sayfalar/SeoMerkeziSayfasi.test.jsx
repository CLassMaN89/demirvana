import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SeoMerkeziSayfasi from './SeoMerkeziSayfasi';

const seoVerisi = { site_sagligi: { saglik_puani: 86, toplam_url: 24, sorun_sayisi: 2 }, sorunlar: [{ id: 1, onem: 'orta', aciklama: 'SEO başlığı uzun.', url_yolu: '/urunler/vana' }] };
vi.mock('../servisler/api', () => ({ seoGenelBakisGetir: vi.fn(() => Promise.resolve(seoVerisi)), seoSiteyiTara: vi.fn(() => Promise.resolve(seoVerisi)) }));

describe('SeoMerkeziSayfasi', () => {
  beforeEach(() => vi.clearAllMocks());
  test('yedi SEO sekmesini gösterir ve seçimi URL sorgusuna yazar', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=genel-bakis']}><SeoMerkeziSayfasi /></MemoryRouter>);
    const sekmeler = screen.getByRole('navigation', { name: 'SEO Merkezi bölümleri' });
    expect(sekmeler.querySelectorAll('button')).toHaveLength(7);
    fireEvent.click(screen.getByRole('button', { name: 'Site Sağlığı' }));
    expect(await screen.findByRole('heading', { name: 'Site Sağlığı' })).toBeInTheDocument();
  });

  test('genel bakışta gerçek site denetimi sonucunu gösterir', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=bilinmeyen']}><SeoMerkeziSayfasi /></MemoryRouter>);
    expect(await screen.findByText('Google Görünürlüğü')).toBeInTheDocument();
    expect(await screen.findByText('86/100')).toBeInTheDocument();
    expect(screen.getByText('SEO başlığı uzun.')).toBeInTheDocument();
  });
});
