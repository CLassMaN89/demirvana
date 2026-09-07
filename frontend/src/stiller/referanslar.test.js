import { describe, expect, it } from 'vitest';
import referansStilleri from './referanslar.css?raw';

describe('Referanslar responsive stilleri', () => {
  it('uzun sayfa başlığını küçük telefon genişliğine sığdırır', () => {
    expect(referansStilleri).toMatch(
      /@media \(max-width: 639px\)[\s\S]*?\.referans-giris h1 \{[^}]*font-size: clamp\(2\.25rem, 10vw, 3rem\)/
    );
  });
});
