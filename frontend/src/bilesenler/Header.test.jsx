import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('menüyü gösterir ve mobil menü düğmesinin durumunu değiştirir', async () => {
    const kullanici = userEvent.setup();

    render(
      <MemoryRouter>
        <Header
          menu={[{ id: 1, baslik: 'Ürünler', baglanti: '/urunler' }]}
          logoYolu="/assets/logo.png"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ürünler/i })).toHaveAttribute('href', '/urunler');
    expect(screen.getByRole('link', { name: 'Teklif Al' })).toHaveAttribute('href', '/iletisim');

    const dugme = screen.getByRole('button', { name: /menüyü aç/i });
    expect(dugme).toHaveAttribute('aria-expanded', 'false');

    await kullanici.click(dugme);

    expect(screen.getByRole('button', { name: /menüyü kapat/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('Ürünler alt menüsünü açar ve Escape tuşuyla kapatır', async () => {
    const kullanici = userEvent.setup();
    const menu = [
      { id: 1, baslik: 'Anasayfa', baglanti: '/', siralama: 1, alt_ogeler: [] },
      {
        id: 2,
        baslik: 'Ürünler',
        baglanti: '/urunler',
        siralama: 2,
        alt_ogeler: [
          {
            id: 21,
            baslik: 'Vana',
            baglanti: '/urunler/vana',
            alt_ogeler: [
              { id: 211, baslik: 'Yangın Vanaları', baglanti: '/urunler/yangin-vanalari' },
              { id: 212, baslik: 'Su Grubu Vanaları', baglanti: '/urunler/su-grubu-vanalari' }
            ]
          },
          { id: 22, baslik: 'Aktüatör', baglanti: '/urunler/aktuator', alt_ogeler: [] },
          { id: 23, baslik: 'Otomasyon', baglanti: '/urunler/otomasyon', alt_ogeler: [] },
          { id: 24, baslik: 'Temsilcilikler', baglanti: '/urunler/temsilcilikler', alt_ogeler: [] }
        ]
      }
    ];

    render(
      <MemoryRouter>
        <Header menu={menu} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    const urunlerDugmesi = screen.getByRole('button', { name: /ürünler alt menüsünü aç/i });
    expect(urunlerDugmesi).toHaveAttribute('aria-expanded', 'false');

    await kullanici.click(urunlerDugmesi);

    expect(urunlerDugmesi).toHaveAttribute('aria-expanded', 'true');
    const vanaDugmesi = screen.getByRole('button', { name: /vana alt menüsünü kapat/i });
    expect(vanaDugmesi).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Yangın Vanaları' })).toHaveAttribute(
      'href',
      '/urunler/yangin-vanalari'
    );
    expect(screen.getByRole('link', { name: 'Su Grubu Vanaları' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aktüatör' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Otomasyon' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Temsilcilikler' })).toBeInTheDocument();

    await kullanici.keyboard('{Escape}');
    expect(urunlerDugmesi).toHaveAttribute('aria-expanded', 'false');
  });
});
