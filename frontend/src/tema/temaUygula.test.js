import { describe, expect, it } from 'vitest';
import { temaUygula } from './temaUygula';

describe('temaUygula', () => {
  it('yalnızca izin verilen tema değerlerini CSS değişkenlerine aktarır', () => {
    const hedef = document.createElement('div');

    temaUygula(
      {
        ana_mavi: '#28469D',
        zararli_deger: 'url(javascript:x)'
      },
      hedef
    );

    expect(hedef.style.getPropertyValue('--renk-ana')).toBe('#28469D');
    expect(hedef.style.getPropertyValue('--zararli-deger')).toBe('');
  });
});
