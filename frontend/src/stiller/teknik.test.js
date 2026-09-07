import { describe, expect, it } from 'vitest';
import teknikStilleri from './teknik.css?raw';

describe('Teknik sayfası responsive stilleri', () => {
  it('kategori ve PDF önizlemelerini dar ekranlarda tek sütun/yatay şerit yapar', () => {
    expect(teknikStilleri).toMatch(/@media \(max-width: 1023px\)[\s\S]*?grid-template-columns: 1fr/);
    expect(teknikStilleri).toMatch(/@media \(max-width: 639px\)[\s\S]*?grid-auto-flow: column/);
    expect(teknikStilleri).toMatch(/prefers-reduced-motion: reduce/);
  });

  it('doküman satırının sol mavi çizgisini yukarıdan aşağıya doğru açar', () => {
    expect(teknikStilleri).toMatch(/\.teknik-dokuman::before[^}]*transform: scaleY\(0\)[^}]*transform-origin: top/);
    expect(teknikStilleri).toMatch(/\.teknik-dokuman:hover::before[^}]*transform: scaleY\(1\)/);
  });

  it('dönen başlığı merkezi tema renkleriyle ve harf geçişiyle gösterir', () => {
    expect(teknikStilleri).toMatch(/\.metin-dongusu__karakter[^}]*color: var\(--renk-ana\)/);
    expect(teknikStilleri).toMatch(/@keyframes metin-dongusu-karakter/);
    expect(teknikStilleri).toMatch(/prefers-reduced-motion: reduce[\s\S]*?\.metin-dongusu__karakter/);
  });
});
