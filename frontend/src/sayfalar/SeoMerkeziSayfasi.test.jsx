import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SeoMerkeziSayfasi from './SeoMerkeziSayfasi';

const seoVerisi = { site_sagligi: { saglik_puani: 86, toplam_url: 24, sorun_sayisi: 2 }, sorunlar: [{ id: 1, onem: 'orta', aciklama: 'SEO başlığı uzun.', url_yolu: '/urunler/vana', onerilen_duzeltme: 'Başlığı 60 karakterin altına indirin.' }], rakip_analizleri: [{ id: 1, ad: 'Demir Vana', bizim_sitemiz_mi: 1, http_durumu: 200, yanit_suresi_ms: 420, seo_puani: 86, sitemap_url_sayisi: 24, kelime_sayisi: 900, schema_sayisi: 2, h1_sayisi: 1, tarama_tarihi: '2026-09-14 12:00:00' }, { id: 2, ad: 'Duyar', bizim_sitemiz_mi: 0, http_durumu: 200, yanit_suresi_ms: 610, seo_puani: 82, sitemap_url_sayisi: 18, kelime_sayisi: 750, schema_sayisi: 1, h1_sayisi: 1, tarama_tarihi: '2026-09-14 12:05:00' }], rakip_gecmisi: [{ rakip_id: 1, ad: 'Demir Vana', seo_puani: 84, tarama_tarihi: '2026-09-13 12:00:00' }, { rakip_id: 1, ad: 'Demir Vana', seo_puani: 86, tarama_tarihi: '2026-09-14 12:00:00' }], dis_kaynaklar: { reklam_saglayicisi: 'bagli', siralama_saglayicisi: 'bagli_degil' } };
vi.mock('../servisler/api', () => ({ seoGenelBakisGetir: vi.fn(() => Promise.resolve(seoVerisi)), seoSiteyiTara: vi.fn(() => Promise.resolve(seoVerisi)), seoRakipleriTara: vi.fn(() => Promise.resolve(seoVerisi)) }));

describe('SeoMerkeziSayfasi', () => {
  beforeEach(() => vi.clearAllMocks());
  test('yedi SEO sekmesini gösterir ve seçimi URL sorgusuna yazar', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=genel-bakis']}><SeoMerkeziSayfasi /></MemoryRouter>);
    const sekmeler = screen.getByRole('navigation', { name: 'SEO Merkezi bölümleri' });
    expect(sekmeler.querySelectorAll('button')).toHaveLength(7);
    const siteSagligiSekmesi = screen.getByRole('button', { name: 'Site Sağlığı' });
    Object.defineProperties(siteSagligiSekmesi, { offsetLeft: { value: 420 }, offsetWidth: { value: 120 } });
    fireEvent.mouseEnter(siteSagligiSekmesi);
    expect(screen.getByTestId('seo-sekme-hover')).toHaveStyle({ left: '420px', width: '120px', opacity: '1' });
    fireEvent.mouseLeave(sekmeler);
    expect(screen.getByTestId('seo-sekme-hover')).toHaveStyle({ opacity: '0' });
    expect(screen.getByRole('button', { name: 'İçerik Fırsatları' })).toHaveAttribute('title', expect.stringContaining('SEO geliştirmelerini'));
    fireEvent.click(siteSagligiSekmesi);
    expect(await screen.findByRole('heading', { name: 'Site Sağlığı' })).toBeInTheDocument();
  });

  test('genel bakışta gerçek site denetimi sonucunu gösterir', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=bilinmeyen']}><SeoMerkeziSayfasi /></MemoryRouter>);
    expect(await screen.findByText('Google Görünürlüğü')).toBeInTheDocument();
    expect(await screen.findAllByText('86/100')).toHaveLength(2);
    expect(screen.getAllByText('Başlığı 60 karakterin altına indirin.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vana').length).toBeGreaterThan(0);
    expect(screen.getByText('Önemli Fırsatlar (AI Önerileri)')).toHaveAttribute('data-tooltip', expect.stringContaining('öncelikli SEO'));
    expect(screen.getByText('Son Rakip Hareketleri')).toBeInTheDocument();
    expect(screen.getByText('Sıralama Değişimi')).toBeInTheDocument();
    expect(screen.getAllByText('Demir Vana').length).toBeGreaterThan(0);
    expect(screen.queryByText('Masaüstü')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobil')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Detaylı Görev Listesi/ })).toHaveAttribute('href', '?tab=firsatlar');
    expect(screen.getByText('orta')).toBeInTheDocument();
    expect(screen.getAllByText('SEO analizi güncellendi')).toHaveLength(2);
    expect(screen.getByText('92')).toBeInTheDocument();
  });

  test('alt SEO sekmelerini mevcut gerçek verilerle doldurur', async () => {
    render(<MemoryRouter initialEntries={['/admin/seo?tab=anahtar-kelimeler']}><SeoMerkeziSayfasi /></MemoryRouter>);
    expect(await screen.findByText('Sıralama sağlayıcısı bağlı değil')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Rakip Intelligence' }));
    expect(await screen.findByRole('heading', { name: 'Rakip Intelligence' })).toBeInTheDocument();
    expect(screen.getByText('Duyar')).toBeInTheDocument();
    expect(screen.getByText('610 ms')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reklam Takibi' }));
    expect(await screen.findByText('Google Ads bağlı')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'İçerik Fırsatları' }));
    expect(await screen.findByText('Başlığı 60 karakterin altına indirin.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Raporlar' }));
    expect(await screen.findByRole('button', { name: 'CSV raporunu indir' })).toBeEnabled();
    expect(screen.getByText('24 URL')).toBeInTheDocument();
  });
});
