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

    public function tema(): array { return $this->depo->tema(); }
    public function siteAyarlari(): array { return $this->depo->siteAyarlari(); }
    public function menu(): array { return $this->depo->menu(); }
    public function sliderlar(): array { return $this->depo->sliderlar(); }
    public function kategoriler(): array { return $this->depo->kategoriler(); }
    public function referanslar(): array { return $this->depo->referanslar(); }
    public function kurumsal(): array { return $this->depo->kurumsal(); }
    public function teknikDokumanlar(): array { return $this->depo->teknikDokumanlar(); }
    public function teknikDokuman(string $slug): ?array { return $this->depo->teknikDokuman($slug); }
    public function sertifikalar(): array { return $this->depo->sertifikalar(); }
    public function sertifika(string $slug): ?array { return $this->depo->sertifika($slug); }
    public function kategori(string $slug): ?array { return $this->depo->kategori($slug); }
    public function urunler(?string $kategori, ?string $arama): array { return $this->depo->urunler($kategori, $arama); }
    public function urun(string $slug): ?array { return $this->depo->urun($slug); }
}
