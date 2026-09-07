<?php

declare(strict_types=1);

final class SeoHtmlOlusturucu
{
    public static function uygula(string $html, array $seo): string
    {
        $temizle = static fn(?string $deger): string => htmlspecialchars((string) $deger, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $baslik = $temizle($seo['baslik'] ?? 'Demirvana');
        $html = preg_replace('/<title>.*?<\/title>/is', "<title>{$baslik}</title>", $html, 1) ?? $html;
        // Build içindeki varsayılan etiketler kaldırılır; her rota tek description ve robots etiketi taşır.
        $html = preg_replace('/\s*<meta\b[^>]*data-demirvana-seo=["\'][^"\']+["\'][^>]*>/i', '', $html) ?? $html;

        $etiketler = [
            '<meta data-demirvana-seo="true" name="description" content="' . $temizle($seo['aciklama'] ?? '') . '">',
            '<meta data-demirvana-seo="true" name="robots" content="' . $temizle($seo['robotlar'] ?? 'index, follow') . '">',
            '<meta data-demirvana-seo="true" property="og:title" content="' . $temizle($seo['sosyal_baslik'] ?? $seo['baslik'] ?? '') . '">',
            '<meta data-demirvana-seo="true" property="og:description" content="' . $temizle($seo['sosyal_aciklama'] ?? $seo['aciklama'] ?? '') . '">',
            '<meta data-demirvana-seo="true" property="og:url" content="' . $temizle($seo['canonical'] ?? '') . '">',
            '<link data-demirvana-seo="true" rel="canonical" href="' . $temizle($seo['canonical'] ?? '') . '">',
        ];

        if (!empty($seo['sosyal_gorsel'])) {
            $etiketler[] = '<meta data-demirvana-seo="true" property="og:image" content="' . $temizle($seo['sosyal_gorsel']) . '">';
            $etiketler[] = '<meta data-demirvana-seo="true" name="twitter:card" content="summary_large_image">';
        }
        if (!empty($seo['google_site_dogrulama'])) {
            $etiketler[] = '<meta data-demirvana-seo="true" name="google-site-verification" content="' . $temizle($seo['google_site_dogrulama']) . '">';
        }
        if (!empty($seo['yapilandirilmis_veri'])) {
            $json = json_encode($seo['yapilandirilmis_veri'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
            $etiketler[] = '<script data-demirvana-seo="true" type="application/ld+json">' . $json . '</script>';
        }

        return str_replace('</head>', "\n    " . implode("\n    ", $etiketler) . "\n  </head>", $html);
    }
}
