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
});
