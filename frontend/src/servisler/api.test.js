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
  it('referans kayıtlarını ve galeri verisini başlangıç verilerine ekler', async () => {
    const istenenYollar = [];
    const fetchFn = async (yol) => {
      istenenYollar.push(yol);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          basarili: true,
          veri: yol.endsWith('/referanslar')
            ? { kayitlar: [{ id: 1, baslik: 'Test projesi' }], gorseller: [] }
            : []
        })
      };
    };

    const veri = await siteVerileriniGetir({ fetchFn, gelistirme: false });

    expect(istenenYollar).toContain('/api/referanslar');
    expect(veri.referanslar.kayitlar[0].baslik).toBe('Test projesi');
  });
});
