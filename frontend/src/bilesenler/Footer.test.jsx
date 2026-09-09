import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('dinamik logo, bağlantılar ve destek iletişimini gösterir', () => {
    const siteAyarlari = {
      site_adi: 'Demirvana',
      logo_yolu: '/assets/logo.png',
      footer_sirket_aciklamasi: 'Endüstriyel akış için güvenilir çözümler.',
      footer_hizli_baglantilar_basligi: 'Hızlı Bağlantılar',
      footer_urunler_basligi: 'Ürün Grupları',
      footer_destek_basligi: 'Destek & İletişim',
      destek_telefonu: '+90 (212) 297 57 30',
      destek_eposta: 'dv@demirvana.com',
      firma_adresi: 'İkitelli, İstanbul / Türkiye',
      footer_teknik_cizim_yolu: '/assets/footer-vana2.png',
      footer_teknik_cizim_ikincil_yolu: '/assets/footer-vana.png',
      footer_teknik_cizim_detay_yolu: '/assets/footer-vana3.png',
      footer_ikon_dizini: '/assets/footer-icons',
      footer_linkedin_baglantisi: 'https://linkedin.com/company/demirvana',
      footer_slogan_metni: 'Endüstrinin her noktasında, daha güvenli bir akış için.',
      footer_iletisim_buton_metni: 'Bizimle iletişime geçin',
      footer_iletisim_buton_baglantisi: '/iletisim',
      footer_telif_metni: '© {yil} Demirvana. Tüm hakları saklıdır.'
    };

    render(
      <MemoryRouter>
        <Footer
          siteAyarlari={siteAyarlari}
          menu={[{ id: 1, baslik: 'Kurumsal', baglanti: '/kurumsal' }]}
          kategoriler={[{ id: 1, ad: 'Küresel Vanalar', slug: 'kuresel-vanalar' }]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Demirvana' })).toHaveAttribute('src', '/assets/logo.png');
    expect(screen.getByRole('link', { name: 'Kurumsal' })).toHaveAttribute('href', '/kurumsal');
    expect(screen.getByRole('link', { name: 'Küresel Vanalar' })).toHaveAttribute('href', '/kategoriler/kuresel-vanalar');
    expect(screen.getByRole('link', { name: '+90 (212) 297 57 30' })).toHaveAttribute('href', 'tel:+902122975730');
    expect(screen.getByRole('link', { name: 'dv@demirvana.com' })).toHaveAttribute('href', 'mailto:dv@demirvana.com');
    expect(screen.getByRole('img', { name: 'Teknik vana ana görünüşü' })).toHaveAttribute('src', '/assets/footer-vana2.png');
    expect(screen.getByRole('img', { name: 'Teknik vana yan görünüşü' })).toHaveAttribute('src', '/assets/footer-vana.png');
    expect(screen.getByRole('img', { name: 'Teknik vana detay görünüşü' })).toHaveAttribute('src', '/assets/footer-vana3.png');
    expect(document.querySelector('.site-footer__iletisim-ikon')?.tagName).toBe('svg');
    expect(document.querySelector('.site-footer__guven-ikon')?.tagName).toBe('svg');
    expect(document.querySelector('.site-footer__sosyal-ikon')?.tagName).toBe('svg');
    expect(screen.queryByText('Çalışma Saatleri')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/company/demirvana');
    expect(screen.getByText('Endüstrinin her noktasında, daha güvenli bir akış için.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sayfanın başına dön' })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()} Demirvana`))).toBeInTheDocument();
  });

  it('sütun görünürlüğünü ve sırasını site ayarlarından yönetir', () => {
    render(
      <MemoryRouter>
        <Footer
          siteAyarlari={{
            footer_aktif_mi: '1',
            footer_marka_sirasi: '4',
            footer_hizli_baglantilar_aktif_mi: '0'
          }}
          menu={[{ id: 1, baslik: 'Kurumsal', baglanti: '/kurumsal' }]}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Firma bilgileri')).toHaveStyle({ order: '4' });
    expect(screen.queryByRole('navigation', { name: 'Footer hızlı bağlantılar' })).not.toBeInTheDocument();
  });
});
