import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SayfaIskeleti from './SayfaIskeleti';

describe('SayfaIskeleti', () => {
  it('kısa içerikte footerı ekranın altına taşıyan uygulama kabını kullanır', () => {
    const { container } = render(
      <MemoryRouter>
        <SayfaIskeleti menu={[]} siteAyarlari={{ footer_aktif_mi: 0 }}>
          <p>Kısa içerik</p>
        </SayfaIskeleti>
      </MemoryRouter>
    );

    expect(container.firstElementChild).toHaveClass('site-uygulama');
    expect(container.querySelector('#ana-icerik')).toBeInTheDocument();
  });
});
