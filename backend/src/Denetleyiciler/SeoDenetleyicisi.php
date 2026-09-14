<?php

declare(strict_types=1);

final class SeoDenetleyicisi
{
    public function __construct(private readonly SeoDeposu $depo)
    {
    }

    public function seo(): array
    {
        return $this->depo->seoVerileri();
    }

    public function yonetimGenelBakis(): array
    {
        return $this->depo->yonetimGenelBakis();
    }

    public function siteDenetimiCalistir(): array
    {
        return $this->depo->siteDenetimiCalistir();
    }

    public function robots(): string
    {
        $genel = $this->depo->seoVerileri()['genel'];
        return self::robotsMetniOlustur(
            $genel['site_ana_adresi'] ?? 'https://www.demirvana.com',
            $genel['seo_robots_kurallari'] ?? null
        );
    }

    public function siteHaritasi(): string
    {
        $genel = $this->depo->seoVerileri()['genel'];
        return self::siteHaritasiXmlOlustur(
            $genel['site_ana_adresi'] ?? 'https://www.demirvana.com',
            $this->depo->siteHaritasiAdresleri()
        );
    }

    public function htmlMeta(string $yol): array
    {
        return $this->depo->sayfaMetaVerisi($yol);
    }

    public static function robotsMetniOlustur(string $anaAdres, ?string $kurallar = null): string
    {
        $anaAdres = rtrim($anaAdres, '/');
        $temelKurallar = trim($kurallar ?: "User-agent: *\nAllow: /\nDisallow: /api/");
        return $temelKurallar . "\n\nSitemap: {$anaAdres}/sitemap.xml\n";
    }

    public static function siteHaritasiXmlOlustur(string $anaAdres, array $adresler): string
    {
        $anaAdres = rtrim($anaAdres, '/');
        $izinliSikliklar = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
        $satirlar = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

        foreach ($adresler as $adres) {
            $yol = '/' . ltrim((string) $adres['yol'], '/');
            $loc = htmlspecialchars($anaAdres . $yol, ENT_XML1 | ENT_QUOTES, 'UTF-8');
            $tarih = date('Y-m-d', strtotime((string) ($adres['guncellenme_tarihi'] ?? 'now')));
            $siklik = in_array($adres['degisim_sikligi'] ?? '', $izinliSikliklar, true)
                ? $adres['degisim_sikligi']
                : 'monthly';
            $oncelik = min(1, max(0, (float) ($adres['oncelik'] ?? 0.5)));
            $satirlar[] = "  <url><loc>{$loc}</loc><lastmod>{$tarih}</lastmod><changefreq>{$siklik}</changefreq><priority>" . number_format($oncelik, 1, '.', '') . '</priority></url>';
        }

        $satirlar[] = '</urlset>';
        return implode("\n", $satirlar) . "\n";
    }
}
