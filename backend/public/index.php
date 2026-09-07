<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Cekirdek/JsonYanit.php';
require_once __DIR__ . '/../src/Cekirdek/Veritabani.php';
require_once __DIR__ . '/../src/Depolar/SiteDeposu.php';
require_once __DIR__ . '/../src/Depolar/SeoDeposu.php';
require_once __DIR__ . '/../src/Denetleyiciler/SiteDenetleyicisi.php';
require_once __DIR__ . '/../src/Denetleyiciler/SeoDenetleyicisi.php';

// API salt okunur başlar; gelecekteki admin yazma uçları kimlik doğrulama katmanıyla ayrı eklenecektir.
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    JsonYanit::gonder(JsonYanit::olustur(false, null, 'Bu yöntem desteklenmiyor.'), 405);
}

$yol = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$yol = '/' . trim($yol, '/');

try {
    $denetleyici = new SiteDenetleyicisi(new SiteDeposu(Veritabani::baglanti()));
    $seoDenetleyicisi = new SeoDenetleyicisi(new SeoDeposu(Veritabani::baglanti()));

    $sabitRotalar = [
        '/api/site-ayarlari' => fn() => $denetleyici->siteAyarlari(),
        '/api/seo' => fn() => $seoDenetleyicisi->seo(),
        '/api/tema' => fn() => $denetleyici->tema(),
        '/api/menu' => fn() => $denetleyici->menu(),
        '/api/sliderlar' => fn() => $denetleyici->sliderlar(),
        '/api/kategoriler' => fn() => $denetleyici->kategoriler(),
        '/api/referanslar' => fn() => $denetleyici->referanslar(),
        '/api/urunler' => fn() => $denetleyici->urunler(
            isset($_GET['kategori']) ? (string) $_GET['kategori'] : null,
            isset($_GET['arama']) ? (string) $_GET['arama'] : null
        ),
    ];

    if (isset($sabitRotalar[$yol])) {
        JsonYanit::gonder(JsonYanit::olustur(true, $sabitRotalar[$yol]()));
    }

    $tekilRotalar = [
        '#^/api/kategoriler/([^/]+)$#' => fn(string $slug) => $denetleyici->kategori($slug),
        '#^/api/urunler/([^/]+)$#' => fn(string $slug) => $denetleyici->urun($slug),
    ];

    foreach ($tekilRotalar as $desen => $isleyici) {
        if (preg_match($desen, $yol, $eslesme) !== 1) {
            continue;
        }

        $slug = $eslesme[1];
        if (!SiteDenetleyicisi::gecerliSlug($slug)) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Geçersiz adres bilgisi.'), 400);
        }

        $veri = $isleyici($slug);
        if ($veri === null) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Kayıt bulunamadı.'), 404);
        }

        JsonYanit::gonder(JsonYanit::olustur(true, $veri));
    }

    JsonYanit::gonder(JsonYanit::olustur(false, null, 'API rotası bulunamadı.'), 404);
} catch (Throwable $hata) {
    // Veritabanı ve dosya sistemi ayrıntılarını istemciye açmayarak bilgi sızıntısını önleriz.
    error_log($hata->getMessage());
    JsonYanit::gonder(JsonYanit::olustur(false, null, 'Sunucu isteği tamamlayamadı.'), 500);
}
