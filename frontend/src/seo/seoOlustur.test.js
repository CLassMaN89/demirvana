import { describe, expect, it } from 'vitest';
import { seoVerisiOlustur } from './seoOlustur';

const seo = {
  genel: {
    site_adi: 'Demirvana',
    site_ana_adresi: 'https://www.demirvana.com',
    site_varsayilan_dil: 'tr',
    seo_baslik_sablonu: '%s | Demirvana',
    seo_varsayilan_baslik: 'Demirvana',
    seo_varsayilan_aciklama: 'Varsayılan açıklama',
    seo_varsayilan_robotlar: 'index, follow'
  },
  sayfalar: {
    tr: {
      '/': {
        rota: '/', seo_basligi: 'Ana Sayfa | Demirvana', meta_aciklama: 'Ana sayfa açıklaması',
        canonical_yolu: '/', robotlar: 'index, follow', yapilandirilmis_veri_turu: 'WebSite'
      }
    }
  }
};

describe('seoVerisiOlustur', () => {
  it('kayıtlı rotanın benzersiz meta ve canonical verisini üretir', () => {
    const sonuc = seoVerisiOlustur('/', seo, {});

    expect(sonuc.baslik).toBe('Ana Sayfa | Demirvana');
    expect(sonuc.aciklama).toBe('Ana sayfa açıklaması');
    expect(sonuc.canonical).toBe('https://www.demirvana.com/');
    expect(sonuc.robotlar).toBe('index, follow');
  });

  it('kategori içeriğinden güvenli dinamik SEO ve breadcrumb üretir', () => {
    const sonuc = seoVerisiOlustur('/kategoriler/kuresel-vanalar', seo, {
      kategoriler: [{
        ad: 'Küresel Vanalar', slug: 'kuresel-vanalar', aciklama: 'Endüstriyel küresel vana çözümleri.',
        gorsel_yolu: '/assets/kuresel.png'
      }]
    });

    expect(sonuc.baslik).toBe('Küresel Vanalar | Demirvana');
    expect(sonuc.canonical).toBe('https://www.demirvana.com/kategoriler/kuresel-vanalar');
    expect(sonuc.yapilandirilmisVeri['@graph'].some((oge) => oge['@type'] === 'BreadcrumbList')).toBe(true);
  });

  it('bulunamayan rotayı indeks dışı bırakır', () => {
    const sonuc = seoVerisiOlustur('/olmayan', seo, {}, true);
    expect(sonuc.robotlar).toBe('noindex, nofollow');
  });
});
