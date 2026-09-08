import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EtkilesimliDunya, { dunyaKameraMesafesi } from './EtkilesimliDunya';

describe('EtkilesimliDunya kadrajı', () => {
  it('geniş ekranda dünyayı daha yakın, telefonda güvenli mesafede gösterir', () => {
    expect(dunyaKameraMesafesi(1.8)).toBe(2.42);
    expect(dunyaKameraMesafesi(0.6)).toBe(3.28);
  });

  it('alt yarıyı doğal biçimde doldurmak için dört bulut katmanı oluşturur', () => {
    const { container } = render(<EtkilesimliDunya />);

    expect(container.querySelectorAll('.iletisim-dunya__bulutlar i')).toHaveLength(4);
  });
});
