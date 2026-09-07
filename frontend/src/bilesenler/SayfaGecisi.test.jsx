import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SayfaGecisi from './SayfaGecisi';

function RotaDegistirici() {
  const git = useNavigate();
  return <button type="button" onClick={() => git('/teknik')}>Tekniğe geç</button>;
}

describe('SayfaGecisi', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('aktif rota yolunu animasyon sarmalayıcısına taşır', () => {
    render(
      <MemoryRouter initialEntries={['/referanslar']}>
        <SayfaGecisi><p>Sayfa içeriği</p></SayfaGecisi>
      </MemoryRouter>
    );

    expect(screen.getByTestId('sayfa-gecisi')).toHaveAttribute('data-yol', '/referanslar');
  });

  it('rota değiştiğinde yeni sayfayı en üstten başlatır', async () => {
    const kullanici = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/referanslar']}>
        <RotaDegistirici />
        <SayfaGecisi><p>Sayfa içeriği</p></SayfaGecisi>
      </MemoryRouter>
    );
    window.scrollTo.mockClear();

    await kullanici.click(screen.getByRole('button', { name: 'Tekniğe geç' }));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  });
});
