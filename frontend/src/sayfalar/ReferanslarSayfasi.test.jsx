import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ReferanslarSayfasi from './ReferanslarSayfasi';

const referanslar = {
  sektorler: [
    { id: 1, ad: 'Su ve Atıksu', slug: 'su-ve-atiksu', siralama: 1 },
    { id: 2, ad: 'Belediye', slug: 'belediye', siralama: 2 }
  ],
  kayitlar: [
    { id: 1, baslik: 'Antalya Arıtma Tesisi', konum: 'Antalya', kurum: 'İller Bankası', yil: '2012', bolge: 'yurtici', sektor_adi: 'Su ve Atıksu', sektor_slug: 'su-ve-atiksu' },
    { id: 2, baslik: 'Kütahya Altyapı Projesi', konum: 'Kütahya', kurum: 'Kütahya Belediyesi', yil: null, bolge: 'yurtici', sektor_adi: 'Belediye', sektor_slug: 'belediye' },
    { id: 3, baslik: 'Water Administration', konum: 'Gürcistan', kurum: 'Georgia Water Administration', yil: '2014', bolge: 'yurtdisi', sektor_adi: 'Su ve Atıksu', sektor_slug: 'su-ve-atiksu' }
  ],
  gorseller: [
    { id: 1, gorsel_yolu: '/galeri.png', alternatif_metin: 'Arıtma tesisindeki vana sistemi', odak_x: 0, odak_y: 100 }
  ]
};

describe('ReferanslarSayfasi', () => {
  it('referans özetini ve bütün kayıtları ilk görünümde sunar', () => {
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    expect(screen.getByRole('heading', { name: 'Referanslarımız' })).toBeInTheDocument();
    expect(screen.getByText('3', { selector: '.referans-sonuc__sayi' })).toBeInTheDocument();
    expect(screen.getByText('Antalya Arıtma Tesisi')).toBeInTheDocument();
    expect(screen.getByText('Water Administration')).toBeInTheDocument();
  });

  it('sektör filtresi seçildiğinde listeyi ve sonuç bilgisini birlikte günceller', async () => {
    const kullanici = userEvent.setup();
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    await kullanici.click(screen.getByRole('button', { name: 'Belediye' }));

    expect(screen.getByRole('button', { name: 'Belediye' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Antalya Arıtma Tesisi')).not.toBeInTheDocument();
    expect(screen.getByText('Kütahya Altyapı Projesi')).toBeInTheDocument();
    expect(screen.getByText('1', { selector: '.referans-sonuc__sayi' }).closest('.referans-sonuc')).toHaveTextContent('1 referans gösteriliyor');
  });

  it('arama metnini sektör filtresiyle birlikte uygular ve Türkçe karakterleri eşleştirir', async () => {
    const kullanici = userEvent.setup();
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    await kullanici.click(screen.getByRole('button', { name: 'Su ve Atıksu' }));
    await kullanici.type(screen.getByRole('searchbox', { name: 'Referanslarda ara' }), 'gürcistan');

    expect(screen.queryByText('Antalya Arıtma Tesisi')).not.toBeInTheDocument();
    expect(screen.getByText('Water Administration')).toBeInTheDocument();
    expect(screen.getByText('1', { selector: '.referans-sonuc__sayi' }).closest('.referans-sonuc')).toHaveTextContent('1 referans gösteriliyor');
  });

  it('arama eşleşmediğinde açıklayıcı boş durum gösterir', async () => {
    const kullanici = userEvent.setup();
    render(<ReferanslarSayfasi referanslar={referanslar} />);

    await kullanici.type(screen.getByRole('searchbox', { name: 'Referanslarda ara' }), 'bulunmayan proje');

    expect(screen.getByText('Aramanızla eşleşen bir referans bulunamadı.')).toBeInTheDocument();
    expect(screen.getByText('0', { selector: '.referans-sonuc__sayi' }).closest('.referans-sonuc')).toHaveTextContent('0 referans gösteriliyor');
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
