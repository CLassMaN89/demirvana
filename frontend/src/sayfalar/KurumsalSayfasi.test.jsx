import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KurumsalSayfasi from './KurumsalSayfasi';

const kurumsal = {
  degerler: [
    { id: 1, baslik: 'Şirket Profili', aciklama: 'Köklü bir çözüm ortağıyız.' },
    { id: 2, baslik: 'Felsefemiz', aciklama: 'Güvene dayalı ilişkiler kurarız.' },
    { id: 3, baslik: 'İlkemiz', aciklama: 'Kalite çalışma biçimimizdir.' },
    { id: 4, baslik: 'Misyonumuz', aciklama: 'Doğru çözüm sunarız.' },
    { id: 5, baslik: 'Vizyonumuz', aciklama: 'Tercih edilen çözüm ortağı olmak.' }
  ],
  urun_gruplari: Array.from({ length: 13 }, (_, indeks) => ({
    id: indeks + 1,
    ad: `Ürün grubu ${indeks + 1}`,
    sutun_no: (indeks % 3) + 1,
    siralama: indeks + 1
  })),
  ekip: [
    { id: 1, ad_soyad: 'Deniz Demir', gorev: 'Şirket Müdürü', eposta: 'dd@demirvana.com' },
    { id: 2, ad_soyad: 'Murat Aslan', gorev: 'Muhasebe Sorumlusu', eposta: 'dv@demirvana.com' }
  ]
};

const siteAyarlari = {
  kurumsal_etiket: 'Kurumsal',
  kurumsal_baslik_satir_1: 'Güvenilir çözümler.',
  kurumsal_baslik_satir_2: 'Sürdürülebilir iş ortaklıkları.',
  kurumsal_giris_metni: 'Demirvana uzun vadeli iş ortaklıkları kurar.',
  kurumsal_urunler_basligi: 'Ana Ürün Gruplarımız',
  kurumsal_cozum_basligi: 'Projeye Özel Çözümler',
  kurumsal_cozum_aciklamasi: 'Uzman mühendis kadromuzla çözüm geliştiriyoruz.',
  kurumsal_cozum_buton_metni: 'Teknik ekibimizle iletişime geçin',
  kurumsal_cozum_buton_baglantisi: '/iletisim',
  kurumsal_ekip_basligi: 'Ekibimiz',
  kurumsal_ekip_aciklamasi: 'Doğru insanlarla, daha güçlü çözümler.'
};

describe('KurumsalSayfasi', () => {
  it('yönetilebilir kurumsal içeriği semantik ve erişilebilir biçimde gösterir', () => {
    render(
      <MemoryRouter>
        <KurumsalSayfasi kurumsal={kurumsal} siteAyarlari={siteAyarlari} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Güvenilir çözümler. Sürdürülebilir iş ortaklıkları.'
    );
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Şirket Profili' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(13);
    expect(screen.getByRole('link', { name: 'Teknik ekibimizle iletişime geçin' })).toHaveAttribute('href', '/iletisim');
    expect(screen.getByRole('link', { name: 'dd@demirvana.com' })).toHaveAttribute('href', 'mailto:dd@demirvana.com');
    expect(screen.getByRole('link', { name: 'dv@demirvana.com' })).toHaveAttribute('href', 'mailto:dv@demirvana.com');
  });
});
