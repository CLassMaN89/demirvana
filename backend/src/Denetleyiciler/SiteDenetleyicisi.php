<?php

declare(strict_types=1);

final class SiteDenetleyicisi
{
    public function __construct(private readonly SiteDeposu $depo)
    {
    }

    /** Slug biçimini sınırlamak rota üzerinden dizin veya sorgu enjeksiyonu taşınmasını engeller. */
    public static function gecerliSlug(string $slug): bool
    {
        return preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) === 1;
    }

    /** Referans bölgelerini sabit sözlükle sınırlamak frontend ve gelecekteki admin paneli için aynı veri sözleşmesini korur. */
    public static function gecerliReferansBolgesi(string $bolge): bool
    {
        return in_array($bolge, ['yurtici', 'yurtdisi'], true);
    }

    /** İletişim formunu tek sözleşmeyle temizleyip zorunlu alanları sunucu tarafında doğrular. */
    public static function iletisimMesajiDogrula(array $girdi): array
    {
        $kisalt = static fn(string $deger, int $uzunluk): string => function_exists('mb_substr')
            ? mb_substr($deger, 0, $uzunluk)
            : substr($deger, 0, $uzunluk);
        $uzunluk = static fn(string $deger): int => function_exists('mb_strlen') ? mb_strlen($deger) : strlen($deger);
        $temizle = static fn(string $anahtar, int $sinir): string => $kisalt(trim((string) ($girdi[$anahtar] ?? '')), $sinir);
        $veri = [
            'ad_soyad' => $temizle('ad_soyad', 120),
            'eposta' => $temizle('eposta', 180),
            'telefon' => $temizle('telefon', 40),
            'firma' => $temizle('firma', 180),
            'mesaj' => $temizle('mesaj', 3000),
        ];

        if ($uzunluk($veri['ad_soyad']) < 2 || !filter_var($veri['eposta'], FILTER_VALIDATE_EMAIL)
            || $uzunluk($veri['telefon']) < 7 || $uzunluk($veri['mesaj']) < 10
            || (string) ($girdi['veri_onayi'] ?? '') !== '1') {
            throw new InvalidArgumentException('Lütfen zorunlu alanları geçerli bilgilerle doldurun.');
        }

        return $veri;
    }

    public function tema(): array { return $this->depo->tema(); }
    public function siteAyarlari(): array { return $this->depo->siteAyarlari(); }
    public function menu(): array { return $this->depo->menu(); }
    public function sliderlar(): array { return $this->depo->sliderlar(); }
    public function kategoriler(): array { return $this->depo->kategoriler(); }
    public function fuarlar(): array { return $this->depo->fuarlar(); }
    public function temsilcilikler(): array { return $this->depo->temsilcilikler(); }
    public function bankaHesaplari(): array { return $this->depo->bankaHesaplari(); }
    public function referanslar(): array { return $this->depo->referanslar(); }
    public function kurumsal(): array { return $this->depo->kurumsal(); }
    public function teknikDokumanlar(): array { return $this->depo->teknikDokumanlar(); }
    public function teknikDokuman(string $slug): ?array { return $this->depo->teknikDokuman($slug); }
    public function sertifikalar(): array { return $this->depo->sertifikalar(); }
    public function sertifika(string $slug): ?array { return $this->depo->sertifika($slug); }
    public function kategori(string $slug): ?array { return $this->depo->kategori($slug); }
    public function urunler(?string $kategori, ?string $arama): array { return $this->depo->urunler($kategori, $arama); }
    public function urun(string $slug): ?array { return $this->depo->urun($slug); }
    public function iletisimMesajiKaydet(array $girdi): int { return $this->depo->iletisimMesajiKaydet(self::iletisimMesajiDogrula($girdi)); }
}
