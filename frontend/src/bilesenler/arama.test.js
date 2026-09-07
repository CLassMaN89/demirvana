import { describe, expect, it } from 'vitest';
import { aramaSonuclariOlustur } from './arama';

describe('aramaSonuclariOlustur', () => {
  it('iki harfli sorguda yalnız kelime başlangıçlarını eşleştirir', () => {
    const menu = [
      { id: 1, baslik: 'Anasayfa', baglanti: '/' },
      { id: 2, baslik: 'Asansör Vanaları', baglanti: '/asansor-vanalari' }
    ];

    expect(aramaSonuclariOlustur(menu, {}, 'as').map((sonuc) => sonuc.baslik)).toEqual(['Asansör Vanaları']);
  });

  it('tam başlık eşleşmesini öne alır ve sonuçları beş kayıtla sınırlar', () => {
    const kategoriler = [
      'Küresel Vanalar', 'Küresel Kontrol', 'Mini Küresel', 'Paslanmaz Küresel',
      'Flanşlı Küresel', 'Dişli Küresel', 'Üç Yollu Küresel'
    ].map((ad, indeks) => ({ id: indeks + 1, ad, slug: `kategori-${indeks + 1}` }));

    const sonuclar = aramaSonuclariOlustur([], { kategoriler }, 'küresel vanalar');
    expect(sonuclar).toHaveLength(1);
    expect(sonuclar[0].baslik).toBe('Küresel Vanalar');

    expect(aramaSonuclariOlustur([], { kategoriler }, 'küresel')).toHaveLength(5);
  });
});
