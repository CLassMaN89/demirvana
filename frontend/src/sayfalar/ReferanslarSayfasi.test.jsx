import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ReferanslarSayfasi from './ReferanslarSayfasi';

const referanslar = {
  kayitlar: [
    { id: 1, baslik: 'Antalya Arıtma Tesisi', konum: 'Antalya', kurum: 'İller Bankası', yil: '2012', bolge: 'yurtici' },
    { id: 2, baslik: 'Kütahya Altyapı Projesi', konum: 'Kütahya', kurum: 'Kütahya Belediyesi', yil: null, bolge: 'yurtici' },
    { id: 3, baslik: 'Water Administration', konum: 'Gürcistan', kurum: 'Georgia Water Administration', yil: '2014', bolge: 'yurtdisi' }
  ],
  gorseller: [
    { id: 1, gorsel_yolu: '/galeri.png', alternatif_metin: 'Arıtma tesisindeki vana sistemi', odak_x: 0, odak_y: 100 }
  ]
};

describe('ReferanslarSayfasi', () => {
  it('referans özetini ve bütün kayıtları ilk görünümde sunar', () => {
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    expect(screen.getByRole('heading', { name: 'Referanslarımız' })).toBeInTheDocument();
    expect(screen.getByText('3', { selector: '.referans-ozet__sayi' })).toBeInTheDocument();
    expect(screen.getByText('Antalya Arıtma Tesisi')).toBeInTheDocument();
    expect(screen.getByText('Water Administration')).toBeInTheDocument();
  });

  it('bölge filtresi seçildiğinde listeyi ve sonuç bilgisini birlikte günceller', async () => {
    const kullanici = userEvent.setup();
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    await kullanici.click(screen.getByRole('button', { name: 'Yurtdışı' }));

    expect(screen.getByRole('button', { name: 'Yurtdışı' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Antalya Arıtma Tesisi')).not.toBeInTheDocument();
    expect(screen.getByText('Water Administration')).toBeInTheDocument();
    expect(screen.getByText('1 referans gösteriliyor')).toBeInTheDocument();
  });

  it('galeri görselini büyütür ve Escape tuşuyla kapatır', async () => {
    const kullanici = userEvent.setup();
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    await kullanici.click(screen.getByRole('button', { name: 'Arıtma tesisindeki vana sistemi görselini büyüt' }));
    expect(screen.getByRole('dialog', { name: 'Arıtma tesisindeki vana sistemi' })).toBeInTheDocument();

    await kullanici.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
