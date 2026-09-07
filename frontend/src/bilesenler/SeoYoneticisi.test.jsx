import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import SeoYoneticisi from './SeoYoneticisi';

describe('SeoYoneticisi', () => {
  afterEach(() => {
    document.head.querySelectorAll('[data-demirvana-seo]').forEach((oge) => oge.remove());
  });

  it('rota verisini head etiketlerine tekil olarak uygular', () => {
    const seo = {
      genel: {
        site_adi: 'Demirvana', site_ana_adresi: 'https://www.demirvana.com', site_varsayilan_dil: 'tr',
        seo_varsayilan_baslik: 'Demirvana', seo_varsayilan_aciklama: 'Açıklama',
        seo_varsayilan_robotlar: 'index, follow', google_site_dogrulama: 'dogrulama-kodu'
      },
      sayfalar: { tr: { '/teknik': {
        seo_basligi: 'Teknik | Demirvana', meta_aciklama: 'Teknik açıklama', canonical_yolu: '/teknik',
        robotlar: 'index, follow', yapilandirilmis_veri_turu: 'WebPage'
      } } }
    };

    render(
      <MemoryRouter initialEntries={['/teknik']}>
        <SeoYoneticisi seo={seo} icerik={{}} />
      </MemoryRouter>
    );

    expect(document.title).toBe('Teknik | Demirvana');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', 'Teknik açıklama');
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.demirvana.com/teknik');
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(document.querySelector('meta[name="google-site-verification"]')).toHaveAttribute('content', 'dogrulama-kodu');
  });
});
