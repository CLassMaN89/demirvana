import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import FuarlarBolumu from './FuarlarBolumu';

const gorseller = [
  { id: 1, gorsel_yolu: '/fuar-1.jpg', alternatif_metin: 'Fuar bir', siralama: 1 },
  { id: 2, gorsel_yolu: '/fuar-2.jpg', alternatif_metin: 'Fuar iki', siralama: 2 }
];

describe('FuarlarBolumu', () => {
  it('yönetilebilir metinleri ve yerel fuar görsellerini gösterir', () => {
    render(<MemoryRouter><FuarlarBolumu fuarlar={gorseller} siteAyarlari={{ fuarlar_basligi: 'Fuarlar', fuarlar_buton_metni: 'Bize ulaşın' }} /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Fuarlar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Bize ulaşın/i })).toHaveAttribute('href', '/iletisim');
    expect(screen.getByRole('img', { name: 'Fuar bir' })).toHaveAttribute('src', '/fuar-1.jpg');
    expect(screen.getByRole('img', { name: 'Fuar iki' })).toHaveAttribute('src', '/fuar-2.jpg');
  });

  it('bölüm kapatıldığında içerik çizmez', () => {
    const { container } = render(<MemoryRouter><FuarlarBolumu fuarlar={gorseller} siteAyarlari={{ fuarlar_aktif_mi: '0' }} /></MemoryRouter>);
    expect(container).toBeEmptyDOMElement();
  });
});
