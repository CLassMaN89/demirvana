import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ornekVeriler } from '../veri/ornekVeriler';
import Header from './Header';

describe('Header', () => {
  afterEach(() => {
    vi.useRealTimers();
    delete window.webkitSpeechRecognition;
  });

  it('aramayı navbar içinde genişletir ve sonuçları yalnız kutunun altında gösterir', () => {
    render(
      <MemoryRouter>
        <Header
          menu={[{ id: 1, baslik: 'İletişim', baglanti: '/iletisim', alt_ogeler: [] }]}
          logoYolu="/assets/logo.png"
          aramaKaynaklari={{
            kategoriler: [{ id: 8, ad: 'Kelebek Vanalar', slug: 'kelebek-vanalar' }],
            urunler: [], referanslar: { kayitlar: [] }
          }}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    const arama = screen.getByRole('searchbox', { name: 'Sitede ara' });
    expect(screen.getByRole('banner')).toHaveClass('site-header--arama-acik');
    expect(arama.closest('nav')).toBe(screen.getByRole('navigation', { name: 'Ana menü' }));

    fireEvent.change(arama, { target: { value: 'kelebek' } });
    expect(screen.getByRole('link', { name: /Kelebek Vanalar/i }).closest('.site-header__arama-acilir')).not.toBeNull();
  });

  it('arama açıkken Teklif Al düğmesini görünür tutar', () => {
    render(
      <MemoryRouter>
        <Header menu={[]} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    expect(screen.getByRole('link', { name: 'Teklif Al' })).toBeVisible();
  });

  it('fare arama alanından ayrılsa bile tıklama yapılana kadar açık kalır', () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <Header menu={[]} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    const aramaKapsayici = screen.getByRole('searchbox', { name: 'Sitede ara' }).closest('.site-header__arama-kapsayici');
    fireEvent.pointerLeave(aramaKapsayici);

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('searchbox', { name: 'Sitede ara' })).toBeInTheDocument();
  });

  it('arama dışındaki bir alana sol tıklanınca aramayı kapatır', () => {
    render(
      <MemoryRouter>
        <Header menu={[]} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    const arama = screen.getByRole('searchbox', { name: 'Sitede ara' });

    // Arama alanının içindeki sol tıklama yazmaya devam edilebilmesi için paneli kapatmamalıdır.
    fireEvent.pointerDown(arama, { button: 0 });
    expect(arama).toBeInTheDocument();

    // Aynı header içindeki Teklif Al bağlantısı da arama alanının dışıdır ve paneli kapatmalıdır.
    fireEvent.pointerDown(screen.getByRole('link', { name: 'Teklif Al' }), { button: 0 });
    expect(screen.queryByRole('searchbox', { name: 'Sitede ara' })).not.toBeInTheDocument();
  });

  it('arama sonuçlarını animasyon sonrası net ve okunabilir ölçülerde gösterir', () => {
    render(
      <MemoryRouter>
        <Header
          menu={[]}
          logoYolu="/assets/logo.png"
          aramaKaynaklari={{
            kategoriler: [],
            urunler: [],
            referanslar: {
              kayitlar: [{
                id: 1,
                baslik: 'Antalya Gazipaşa Atıksu Arıtma Tesisi Vanaları',
                konum: 'Antalya / Gazipaşa',
                kurum: 'İller Bankası'
              }]
            }
          }}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    const arama = screen.getByRole('searchbox', { name: 'Sitede ara' });
    fireEvent.change(arama, { target: { value: 'gazipaşa' } });
    const sonucBaglantisi = screen.getByRole('link', { name: /Antalya Gazipaşa/i });
    const sonucBasligi = sonucBaglantisi.querySelector('strong');
    const sonucTuru = sonucBaglantisi.querySelector('em');
    const sonucAciklamasi = sonucBaglantisi.querySelector('small');
    const aramaPaneli = arama.closest('.site-header__arama-acilir');

    expect(getComputedStyle(arama).fontSize).toBe('14px');
    expect(getComputedStyle(arama).fontWeight).toBe('400');
    expect(getComputedStyle(sonucBasligi).fontSize).toBe('14px');
    expect(getComputedStyle(sonucBasligi).fontWeight).toBe('500');
    expect(getComputedStyle(sonucBasligi).lineHeight).toBe('1.45');
    expect(getComputedStyle(sonucTuru).fontSize).toBe('11px');
    expect(getComputedStyle(sonucAciklamasi).fontSize).toBe('12px');
    expect(getComputedStyle(sonucBaglantisi).display).toBe('grid');
    // Kalıcı compositing katmanı Chrome'da küçük metni bulanıklaştırdığı için animasyon sonrası korunmamalıdır.
    expect(getComputedStyle(aramaPaneli).willChange).toBe('auto');
    expect(getComputedStyle(aramaPaneli).animationFillMode).toBe('none');
  });

  it('arama yazılırken kısa süreli yükleme göstergesi sunar', () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <Header menu={[]} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Sitede ara' }), { target: { value: 'vana' } });
    expect(screen.getByRole('status', { name: 'Arama yapılıyor' })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole('status', { name: 'Arama yapılıyor' })).not.toBeInTheDocument();
  });

  it('tarayıcı destekliyorsa mikrofon sonucunu gerçek arama metnine aktarır', () => {
    class SahteSesTanima {
      start() {
        this.onresult?.({ results: [[{ transcript: 'kelebek vana' }]] });
        this.onend?.();
      }
    }
    window.webkitSpeechRecognition = SahteSesTanima;

    render(
      <MemoryRouter>
        <Header menu={[]} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sesli aramayı başlat' }));
    expect(screen.getByRole('searchbox', { name: 'Sitede ara' })).toHaveValue('kelebek vana');

  });

  it('arama panelini açar ve gerçek kategori sonucuna bağlantı verir', async () => {
    const kullanici = userEvent.setup();
    render(
      <MemoryRouter>
        <Header
          menu={[{ id: 1, baslik: 'İletişim', baglanti: '/iletisim', alt_ogeler: [] }]}
          logoYolu="/assets/logo.png"
          aramaKaynaklari={{
            kategoriler: [{ id: 8, ad: 'Kelebek Vanalar', slug: 'kelebek-vanalar' }],
            urunler: [], referanslar: { kayitlar: [] }
          }}
        />
      </MemoryRouter>
    );

    await kullanici.click(screen.getByRole('button', { name: 'Site aramasını aç' }));
    const arama = screen.getByRole('searchbox', { name: 'Sitede ara' });
    expect(arama).toHaveFocus();
    await kullanici.type(arama, 'kelebek');

    expect(screen.getByRole('link', { name: /Kelebek Vanalar/i })).toHaveAttribute('href', '/kategoriler/kelebek-vanalar');
    await kullanici.keyboard('{Escape}');
    expect(screen.queryByRole('searchbox', { name: 'Sitede ara' })).not.toBeInTheDocument();
  });

  it('üst menü metnini 12px ve masaüstü logoyu daha görünür ölçüde tutar', () => {
    render(
      <MemoryRouter>
        <Header menu={[{ id: 1, baslik: 'Anasayfa', baglanti: '/', alt_ogeler: [] }]} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    expect(getComputedStyle(screen.getByRole('link', { name: 'Anasayfa' })).fontSize).toBe('12px');
    expect(getComputedStyle(screen.getByRole('link', { name: /Demirvana ana sayfa/i })).width).toBe('118px');
  });

  it('menüyü gösterir ve mobil menü düğmesinin durumunu değiştirir', async () => {
    const kullanici = userEvent.setup();

    render(
      <MemoryRouter>
        <Header
          menu={[{ id: 1, baslik: 'Ürünler', baglanti: '/urunler' }]}
          logoYolu="/assets/logo.png"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ürünler/i })).toHaveAttribute('href', '/urunler');
    expect(screen.getByRole('link', { name: 'Teklif Al' })).toHaveAttribute('href', '/iletisim');

    const dugme = screen.getByRole('button', { name: /menüyü aç/i });
    expect(dugme).toHaveAttribute('aria-expanded', 'false');

    await kullanici.click(dugme);

    expect(screen.getByRole('button', { name: /menüyü kapat/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('Ürünler alt menüsünü açar ve Escape tuşuyla kapatır', async () => {
    const kullanici = userEvent.setup();
    const menu = [
      { id: 1, baslik: 'Anasayfa', baglanti: '/', siralama: 1, alt_ogeler: [] },
      {
        id: 2,
        baslik: 'Ürünler',
        baglanti: '/urunler',
        siralama: 2,
        alt_ogeler: [
          {
            id: 21,
            baslik: 'Vana',
            baglanti: '/urunler/vana',
            alt_ogeler: [
              { id: 211, baslik: 'Yangın Vanaları', baglanti: '/urunler/yangin-vanalari' },
              { id: 212, baslik: 'Su Grubu Vanaları', baglanti: '/urunler/su-grubu-vanalari' }
            ]
          },
          { id: 22, baslik: 'Aktüatör', baglanti: '/urunler/aktuator', alt_ogeler: [] },
          { id: 23, baslik: 'Otomasyon', baglanti: '/urunler/otomasyon', alt_ogeler: [] },
          { id: 24, baslik: 'Temsilcilikler', baglanti: '/urunler/temsilcilikler', alt_ogeler: [] }
        ]
      }
    ];

    render(
      <MemoryRouter>
        <Header menu={menu} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    const urunlerDugmesi = screen.getByRole('button', { name: /ürünler alt menüsünü aç/i });
    expect(urunlerDugmesi).toHaveAttribute('aria-expanded', 'false');

    await kullanici.click(urunlerDugmesi);

    expect(urunlerDugmesi).toHaveAttribute('aria-expanded', 'true');
    const vanaDugmesi = screen.getByRole('button', { name: /vana alt menüsünü kapat/i });
    expect(vanaDugmesi).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Yangın Vanaları' })).toHaveAttribute(
      'href',
      '/urunler/yangin-vanalari'
    );
    expect(screen.getByRole('link', { name: 'Su Grubu Vanaları' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aktüatör' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Otomasyon' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Temsilcilikler' })).toBeInTheDocument();
    // Ürün grupları ve açılan alt kategoriler aynı tema uyumlu vana ikonunu kullanır.
    expect(document.querySelectorAll('.site-header__menu-ikonu')).toHaveLength(6);

    await kullanici.keyboard('{Escape}');
    expect(urunlerDugmesi).toHaveAttribute('aria-expanded', 'false');
  });

  it('Aktüatör grubuna geçince dört alt kategoriyi gösterir', async () => {
    const kullanici = userEvent.setup();

    render(
      <MemoryRouter>
        <Header menu={ornekVeriler.menu} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    await kullanici.click(screen.getByRole('button', { name: /ürünler alt menüsünü aç/i }));
    fireEvent.click(screen.getByRole('button', { name: /aktüatör alt menüsünü aç/i }));

    expect(screen.getByRole('link', { name: 'Elektrik Aktüatörler' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pnömatik Aktüatör' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aktüatörlü Vanalar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Aksesuarlar' })).toBeInTheDocument();
  });

  it('Otomasyon grubunda canlı sitedeki beş alt kategoriyi gösterir', async () => {
    const kullanici = userEvent.setup();

    render(
      <MemoryRouter>
        <Header menu={ornekVeriler.menu} logoYolu="/assets/logo.png" />
      </MemoryRouter>
    );

    await kullanici.click(screen.getByRole('button', { name: /ürünler alt menüsünü aç/i }));
    fireEvent.click(screen.getByRole('button', { name: /otomasyon alt menüsünü aç/i }));

    expect(screen.getByRole('link', { name: 'Debi (Akış)' })).toHaveAttribute('href', '/urunler/debi-akis');
    expect(screen.getByRole('link', { name: 'Basınç' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Seviye' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sıcaklık' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Proses Kontrol' })).toBeInTheDocument();
  });
});
