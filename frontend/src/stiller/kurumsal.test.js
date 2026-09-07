import { describe, expect, it } from 'vitest';
import kurumsalStilleri from './kurumsal.css?raw';

describe('Kurumsal sayfası responsive stilleri', () => {
  it('değerleri masaüstünde beş, küçük ekranlarda tek sütun gösterir', () => {
    expect(kurumsalStilleri).toMatch(/\.kurumsal-degerler[^}]*grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
    expect(kurumsalStilleri).toMatch(/@media \(max-width: 639px\)[\s\S]*?\.kurumsal-degerler[^}]*grid-template-columns: 1fr/);
    expect(kurumsalStilleri).toMatch(/prefers-reduced-motion: reduce/);
  });

  it('içerik girişini tek bir düzenlenmiş animasyonla yapar', () => {
    expect(kurumsalStilleri).toMatch(/\.kurumsal-sayfasi[^}]*animation: kurumsal-giris/);
  });
});
