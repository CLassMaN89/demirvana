import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TemsilciliklerSayfasi from './TemsilciliklerSayfasi';

const markalar = [{
  id: 1, marka_adi: 'Genebre', baslik: 'Genebre', urun_grubu: 'Vana ve Akış Kontrol Ürünleri',
  aciklama: 'Endüstriyel vana çözümleri.', etiketler: 'Vana,Akış Kontrol', logo_yolu: null,
  urun_baglantisi: '/urunler', katalog_baglantisi: '/iletisim', katalog_buton_metni: 'Katalog talep et'
}];

describe('TemsilciliklerSayfasi', () => {
  it('marka, etiket ve yönetilebilir bağlantıları gösterir', () => {
    render(<MemoryRouter><TemsilciliklerSayfasi temsilcilikler={markalar} siteAyarlari={{ temsilcilik_hero_basligi: 'Temsilcilikler' }} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Temsilcilikler' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Genebre' })).toBeInTheDocument();
    expect(screen.getByText('Akış Kontrol')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Marka ürünleri/i })).toHaveAttribute('href', '/urunler');
    expect(screen.getByRole('link', { name: /Katalog talep et/i })).toHaveAttribute('href', '/iletisim');
  });
});
