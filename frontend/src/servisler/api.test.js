import { describe, expect, it } from 'vitest';
import { veriGetir } from './api';

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
