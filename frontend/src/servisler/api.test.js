import { describe, expect, it } from 'vitest';
import { siteVerileriniGetir, veriGetir } from './api';

describe('veriGetir', () => {
  it('başarılı API yanıtındaki veriyi döndürür', async () => {
    const fetchFn = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ basarili: true, veri: ['menü'] })
    });

    await expect(veriGetir('/api/menu', { fetchFn })).resolves.toEqual(['menü']);
  });

  it('geliştirme ortamında bağlantı kurulamazsa örnek veriyi döndürür', async () => {
    const fetchFn = async () => {
      throw new Error('bağlantı yok');
    };

    await expect(
      veriGetir('/api/menu', {
        fetchFn,
        gelistirme: true,
        yedekVeri: ['yerel menü']
      })
    ).resolves.toEqual(['yerel menü']);
  });

  it('üretim ortamında başarısız yanıtı kullanıcıya uygun hataya dönüştürür', async () => {
    const fetchFn = async () => ({
      ok: false,
      status: 500,
      json: async () => ({ basarili: false, veri: null, mesaj: 'Dahili ayrıntı' })
    });

    await expect(veriGetir('/api/menu', { fetchFn, gelistirme: false })).rejects.toThrow(
      'İçerik şu anda yüklenemiyor.'
    );
  });
});

describe('siteVerileriniGetir', () => {
  it('ilk ekranı tek başlangıç isteğiyle yükler', async () => {
    const istenenYollar = [];
    const fetchFn = async (yol) => {
      istenenYollar.push(yol);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          basarili: true,
          veri: {
            referanslar: { kayitlar: [{ id: 1, baslik: 'Test projesi' }], gorseller: [] },
            teknik_dokumanlar: [{ id: 1, ad: 'Teknik Tablolar', dokumanlar: [{ baslik: 'Çeviri Tablosu' }] }],
            kurumsal: { degerler: [], urun_gruplari: [], ekip: [] }
          }
        })
      };
    };

    const veri = await siteVerileriniGetir({ fetchFn, gelistirme: false });

    expect(istenenYollar).toEqual(['/api/baslangic']);
    expect(veri.referanslar.kayitlar[0].baslik).toBe('Test projesi');
    expect(veri.teknik_dokumanlar[0].dokumanlar[0].baslik).toBe('Çeviri Tablosu');
  });
});
