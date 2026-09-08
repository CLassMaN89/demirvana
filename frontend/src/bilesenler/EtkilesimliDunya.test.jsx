import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EtkilesimliDunya, { dunyaDikeyKonumu, dunyaKameraMesafesi } from './EtkilesimliDunya';

describe('EtkilesimliDunya kadrajı', () => {
  it('geniş ekranda dünyayı daha yakın, telefonda güvenli mesafede gösterir', () => {
    expect(dunyaKameraMesafesi(1.8)).toBe(1.95);
    expect(dunyaKameraMesafesi(0.6)).toBe(3.08);
    expect(dunyaDikeyKonumu(1.95)).toBeCloseTo(-0.306, 3);
    expect(dunyaDikeyKonumu(3.08)).toBeCloseTo(0.083, 3);
  });

  it('alt yarıyı doğal biçimde doldurmak için dört bulut katmanı oluşturur', () => {
    const { container } = render(<EtkilesimliDunya />);

    expect(container.querySelectorAll('.iletisim-dunya__bulutlar i')).toHaveLength(4);
  });
});
