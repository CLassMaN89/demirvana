import { describe, expect, it } from 'vitest';
import './tema.css';
import './genel.css';

describe('genel tipografi', () => {
  it('arayüzün okunabilirlik için Inter yazı tipini kullanmasını sağlar', () => {
    const kokStili = getComputedStyle(document.documentElement);
    const govdeStili = getComputedStyle(document.body);

    expect(kokStili.getPropertyValue('--yazi-tipi')).toContain('Inter');
    expect(govdeStili.fontFamily).toBe('var(--yazi-tipi)');
  });
});
