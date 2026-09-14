import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ipSayfalariniGetir, ziyaretYonetimVerisiniGetir } from '../servisler/api';
import IstatistiklerSayfasi from './IstatistiklerSayfasi';

vi.mock('../servisler/api', () => ({
  ziyaretYonetimVerisiniGetir: vi.fn(),
  ipSayfalariniGetir: vi.fn()
}));

const ORNEK_KAYIT = {
  ip_adresi: '127.0.0.1',
  referans: '',
  yol: '/',
  dil: 'tr',
  kullanici_ajani: 'Mozilla/5.0 (Windows NT 10.0) Chrome/153.0.0.0',
  ekran_cozunurlugu: '1920x1080',
  saat_dilimi: 'Europe/Istanbul',
  kalma_suresi_sn: 10
};

const BUGUN = new Date().toLocaleDateString('sv-SE');

function ornekVeri() {
  return {
    istatistikler: {
      toplam_goruntuleme: 2,
      benzersiz_ip_sayisi: 1,
      bugunku_goruntuleme: 2,
      en_cok_goruntulenen_sayfalar: [],
      ip_toplam_sureleri: [
        { tarih: BUGUN, ip_adresi: '127.0.0.1', toplam_saniye: 70, goruntuleme_sayisi: 2 },
        { tarih: '2020-01-02', ip_adresi: '10.0.0.2', toplam_saniye: 30, goruntuleme_sayisi: 1 }
      ],
      ip_gunluk_sureleri: [
        { tarih: BUGUN, ip_adresi: '127.0.0.1', toplam_saniye: 70, goruntuleme_sayisi: 2 },
        { tarih: '2020-01-02', ip_adresi: '10.0.0.2', toplam_saniye: 30, goruntuleme_sayisi: 1 }
      ]
    },
    kayitlar: [
      { ...ORNEK_KAYIT, id: 1, olusturulma_tarihi: '2020-01-02 18:27:00' },
      { ...ORNEK_KAYIT, id: 2, olusturulma_tarihi: '2020-01-02 18:26:00' }
    ]
  };
}

describe('IstatistiklerSayfasi', () => {
  beforeEach(() => {
    ziyaretYonetimVerisiniGetir.mockResolvedValue(ornekVeri());
    ipSayfalariniGetir.mockResolvedValue([]);
  });

  test('Son Ziyaretler tablosunda yalnız gerçek kayıtlar kadar gövde satırı gösterir', async () => {
    render(<IstatistiklerSayfasi />);
    const baslik = await screen.findByRole('heading', { name: 'Son Ziyaretler' });
    const kart = baslik.closest('.istatistik-kart');
    const tablo = await within(kart).findByRole('table');
    expect(tablo.tBodies[0].rows).toHaveLength(2);
  });

  test('Bugün dışındaki gün başlıklarını anlaşılır tam tarihle gösterir', async () => {
    render(<IstatistiklerSayfasi />);
    expect(await screen.findAllByText('02 Ocak 2020')).toHaveLength(2);
    expect(screen.queryByText('Dün')).not.toBeInTheDocument();
  });

  test('IP toplamlarını Son Ziyaretler gibi günlük açılır gruplarda gösterir', async () => {
    render(<IstatistiklerSayfasi />);
    const baslik = await screen.findByRole('heading', { name: 'IP Bazında Toplam Kalma Süresi' });
    const kart = baslik.closest('.istatistik-kart');

    const bugun = within(kart).getByRole('button', { name: /Bugün.*1 IP.*2 görüntüleme/ });
    const eskiGun = within(kart).getByRole('button', { name: /02 Ocak 2020.*1 IP.*1 görüntüleme/ });
    await waitFor(() => expect(bugun).toHaveAttribute('aria-expanded', 'true'));

    fireEvent.click(eskiGun);

    expect(bugun).toHaveAttribute('aria-expanded', 'false');
    expect(eskiGun).toHaveAttribute('aria-expanded', 'true');
  });

  test('IP sayfa dökümünü seçilen günle sınırlar', async () => {
    render(<IstatistiklerSayfasi />);
    const baslik = await screen.findByRole('heading', { name: 'IP Bazında Toplam Kalma Süresi' });
    const kart = baslik.closest('.istatistik-kart');
    const ipSatiri = await within(kart).findByRole('button', { name: /127\.0\.0\.1.*Toplam Süre/ });

    fireEvent.click(ipSatiri);

    await waitFor(() => expect(ipSayfalariniGetir).toHaveBeenCalledWith('127.0.0.1', BUGUN));
  });

  test('yan yana istatistik kartlarında iç kaydırma kullanmaz', async () => {
    const { container } = render(<IstatistiklerSayfasi />);
    await screen.findByRole('heading', { name: 'IP Bazında Toplam Kalma Süresi' });

    const govdeler = container.querySelectorAll('.istatistik-yan-yana .istatistik-kart__govde');
    expect(govdeler).toHaveLength(2);
    govdeler.forEach((govde) => expect(getComputedStyle(govde).overflowY).toBe('visible'));
  });
});
