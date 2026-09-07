import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SayfaGecisi from './SayfaGecisi';

describe('SayfaGecisi', () => {
  it('aktif rota yolunu animasyon sarmalayıcısına taşır', () => {
    render(
      <MemoryRouter initialEntries={['/referanslar']}>
        <SayfaGecisi><p>Sayfa içeriği</p></SayfaGecisi>
      </MemoryRouter>
    );

    expect(screen.getByTestId('sayfa-gecisi')).toHaveAttribute('data-yol', '/referanslar');
  });
});
