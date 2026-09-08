import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import IcerikSayfasi from './IcerikSayfasi';

const ayarlar = {
  iletisim_basligi: 'İletişim',
  iletisim_harita_adresi: 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi, İstanbul',
  firma_adresi: 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi CA Blok No:3, İstanbul',
  destek_telefonu: '+90 (212) 297 57 30',
  iletisim_whatsapp: '+90 (555) 978 18 00',
  iletisim_faks: '+90 (212) 297 57 33',
  destek_eposta: 'dv@demirvana.com'
};

describe('IcerikSayfasi iletişim görünümü', () => {
  it('konuma bağlı haritayı ve görseldeki iletişim kanallarını gösterir', () => {
    render(<IcerikSayfasi tur="iletisim" siteAyarlari={ayarlar} />);

    expect(screen.getByTitle('Demirvana konumu')).toHaveAttribute('src', expect.stringContaining('%C4%B0kitelli%20OSB'));
    expect(screen.getByText('+90 (212) 297 57 30')).toBeInTheDocument();
    expect(screen.getByText('+90 (555) 978 18 00')).toBeInTheDocument();
    expect(screen.getByText('+90 (212) 297 57 33')).toBeInTheDocument();
    expect(screen.getByText('dv@demirvana.com')).toBeInTheDocument();
  });

  it('geçerli formu API üzerinden gönderip başarı bildirimini gösterir', async () => {
    const mesajGonder = vi.fn().mockResolvedValue({ mesaj: 'Mesajınız başarıyla alındı.' });
    render(<IcerikSayfasi tur="iletisim" siteAyarlari={ayarlar} mesajGonder={mesajGonder} />);

    fireEvent.change(screen.getByLabelText('İsim Soyisim'), { target: { value: 'Sinan Demir' } });
    fireEvent.change(screen.getByLabelText('E-posta'), { target: { value: 'sinan@example.com' } });
    fireEvent.change(screen.getByLabelText('Telefon'), { target: { value: '+90 555 111 22 33' } });
    fireEvent.change(screen.getByLabelText('Firma'), { target: { value: 'Demirvana' } });
    fireEvent.change(screen.getByLabelText('Mesajınız'), { target: { value: 'Ürünler hakkında bilgi almak istiyorum.' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /kişisel verilerimin/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Gönder' }));

    await waitFor(() => expect(mesajGonder).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole('status')).toHaveTextContent('Mesajınız başarıyla alındı.');
  });

  it('doğrulanmış banka hesaplarını para birimine göre kartlarda gösterir', () => {
    const hesaplar = [{ id: 1, banka_adi: 'QNB Finansbank', para_birimi: 'TL', iban: 'TR33 0011', sube: 'İstanbul Enpara 03663', hesap_no: '80393611' }];
    render(<IcerikSayfasi tur="iletisim" siteAyarlari={ayarlar} bankaHesaplari={hesaplar} />);
    expect(screen.getByRole('heading', { name: 'QNB Finansbank TL hesabı' })).toBeInTheDocument();
    expect(screen.getByText('TR33 0011')).toBeInTheDocument();
  });

  it('hesapların altında yönetilebilir etkileşimli dünya alanını gösterir', () => {
    render(<IcerikSayfasi tur="iletisim" siteAyarlari={{ ...ayarlar, iletisim_dunya_basligi: 'Dünyaya güvenilir akış çözümleri' }} />);

    expect(screen.getByRole('heading', { name: 'Dünyaya güvenilir akış çözümleri' })).toBeInTheDocument();
    expect(screen.getByLabelText('Demirvana küresel çözüm ağı')).toBeInTheDocument();
    expect(screen.queryByText(/döndürmek için sürükleyin/i)).not.toBeInTheDocument();
  });
});
