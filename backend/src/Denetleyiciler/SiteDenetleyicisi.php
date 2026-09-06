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

    public function tema(): array { return $this->depo->tema(); }
    public function menu(): array { return $this->depo->menu(); }
    public function sliderlar(): array { return $this->depo->sliderlar(); }
    public function kategoriler(): array { return $this->depo->kategoriler(); }
    public function kategori(string $slug): ?array { return $this->depo->kategori($slug); }
    public function urunler(?string $kategori, ?string $arama): array { return $this->depo->urunler($kategori, $arama); }
    public function urun(string $slug): ?array { return $this->depo->urun($slug); }
}

