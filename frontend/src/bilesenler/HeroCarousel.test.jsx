import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HeroCarousel from './HeroCarousel';

const ikiSlider = [
  {
    id: 1,
    baslik: 'Birinci',
    aciklama: 'Birinci açıklama',
    gorsel_yolu: '/assets/carousel/1.png',
    alternatif_metin: 'Birinci vana',
    buton_metni: 'Ürünleri incele',
    buton_baglantisi: '/urunler',
    animasyon_turu: 'kaydir',
    odak_x: 40,
    odak_y: 50
  },
  {
    id: 2,
    baslik: 'İkinci',
    aciklama: 'İkinci açıklama',
    gorsel_yolu: '/assets/carousel/2.png',
    alternatif_metin: 'İkinci vana',
    buton_metni: 'İletişime geçin',
    buton_baglantisi: '/iletisim',
    animasyon_turu: 'yaklas',
    odak_x: 60,
    odak_y: 50
  }
];

describe('HeroCarousel', () => {
  it('hero görselinin üzerinde etkileşimli mürekkep maskesi oluşturur', () => {
    render(
      <MemoryRouter>
        <HeroCarousel sliderlar={ikiSlider} otomatikGecisMs={0} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('murekkep-maskesi')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('murekkep-maskesi')).toHaveAttribute(
      'data-gorsel-yolu',
      '/assets/carousel/1.png'
    );
    expect(screen.getByTestId('murekkep-maskesi')).toHaveAttribute(
      'data-efekt',
      'teknik-cizim'
    );
  });

  it('oklar ve klavye ile slaytlar arasında geçiş yapar', async () => {
    const kullanici = userEvent.setup();
    render(
      <MemoryRouter>
        <HeroCarousel sliderlar={ikiSlider} otomatikGecisMs={0} />
      </MemoryRouter>
    );

    const bolge = screen.getByRole('region', { name: /öne çıkan içerikler/i });
    expect(screen.getByRole('heading', { name: 'Birinci' })).toBeInTheDocument();

    await kullanici.click(screen.getByRole('button', { name: /sonraki slayt/i }));
    expect(screen.getByRole('heading', { name: 'İkinci' })).toBeInTheDocument();

    bolge.focus();
    await kullanici.keyboard('{ArrowLeft}');
    expect(screen.getByRole('heading', { name: 'Birinci' })).toBeInTheDocument();
  });

  it('gösterge düğmesi seçilen slayta gider', async () => {
    const kullanici = userEvent.setup();
    render(
      <MemoryRouter>
        <HeroCarousel sliderlar={ikiSlider} otomatikGecisMs={0} />
      </MemoryRouter>
    );

    await kullanici.click(screen.getByRole('button', { name: "Slayt 2'ye git" }));

    expect(screen.getByRole('heading', { name: 'İkinci' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'İkinci vana' })).toHaveStyle({
      objectPosition: '60% 50%'
    });
    expect(
      screen.getByRole('button', { name: "Slayt 1'e git" }).querySelector('img')
    ).toHaveAttribute('src', '/assets/carousel/1.png');
  });
});
