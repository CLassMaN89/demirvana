<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Cekirdek/JsonYanit.php';
require_once __DIR__ . '/../src/Denetleyiciler/SiteDenetleyicisi.php';
require_once __DIR__ . '/../src/Depolar/SiteDeposu.php';
require_once __DIR__ . '/../src/Depolar/SeoDeposu.php';
require_once __DIR__ . '/../src/Denetleyiciler/SeoDenetleyicisi.php';
require_once __DIR__ . '/../src/Cekirdek/SeoHtmlOlusturucu.php';

// Bu küçük çalıştırılabilir test harici test çatısına ihtiyaç duymadan API'nin temel sözleşmesini korur.
$yanit = JsonYanit::olustur(true, ['id' => 1]);

if ($yanit !== ['basarili' => true, 'veri' => ['id' => 1]]) {
    throw new RuntimeException('Başarılı JSON yanıt sözleşmesi bozuldu.');
}

if (!SiteDenetleyicisi::gecerliSlug('kuresel-vanalar')) {
    throw new RuntimeException('Geçerli slug reddedildi.');
}

if (SiteDenetleyicisi::gecerliSlug('../gizli')) {
    throw new RuntimeException('Güvensiz slug kabul edildi.');
}

if (!SiteDenetleyicisi::gecerliReferansBolgesi('yurtdisi')) {
    throw new RuntimeException('Geçerli referans bölgesi reddedildi.');
}

if (SiteDenetleyicisi::gecerliReferansBolgesi('tum-dunya')) {
    throw new RuntimeException('Tanımsız referans bölgesi kabul edildi.');
}

$menuAgaci = SiteDeposu::menuAgaciOlustur(
    [['id' => 3, 'baslik' => 'Ürünler', 'baglanti' => '/urunler', 'siralama' => 3]],
    [
        ['id' => 31, 'menu_ogesi_id' => 3, 'ust_alt_oge_id' => null, 'baslik' => 'Vana', 'baglanti' => '/urunler/vana', 'siralama' => 1],
        ['id' => 32, 'menu_ogesi_id' => 3, 'ust_alt_oge_id' => 31, 'baslik' => 'Yangın Vanaları', 'baglanti' => '/urunler/yangin-vanalari', 'siralama' => 1],
    ]
);

if (($menuAgaci[0]['alt_ogeler'][0]['alt_ogeler'][0]['baslik'] ?? null) !== 'Yangın Vanaları') {
    throw new RuntimeException('Menü alt öğeleri doğru hiyerarşide oluşturulmadı.');
}

$siteAyarlari = SiteDeposu::ayarNesnesiOlustur([
    ['anahtar' => 'site_adi', 'deger' => 'Demirvana'],
    ['anahtar' => 'destek_eposta', 'deger' => 'dv@demirvana.com'],
]);

if (($siteAyarlari['destek_eposta'] ?? null) !== 'dv@demirvana.com') {
    throw new RuntimeException('Site ayarları anahtar/değer nesnesine dönüştürülemedi.');
}

$seoSayfalari = SeoDeposu::seoKayitlariniNesneyeDonustur([
    ['rota' => '/', 'dil_kodu' => 'tr', 'seo_basligi' => 'Demirvana'],
]);

if (($seoSayfalari['tr']['/']['seo_basligi'] ?? null) !== 'Demirvana') {
    throw new RuntimeException('SEO kayıtları dil ve rota anahtarlarıyla dönüştürülemedi.');
}

$robots = SeoDenetleyicisi::robotsMetniOlustur('https://www.demirvana.com');
if (!str_contains($robots, 'Sitemap: https://www.demirvana.com/sitemap.xml')) {
    throw new RuntimeException('Robots çıktısı sitemap adresini içermiyor.');
}

$siteHaritasi = SeoDenetleyicisi::siteHaritasiXmlOlustur('https://www.demirvana.com', [[
    'yol' => '/urunler', 'guncellenme_tarihi' => '2026-09-07 10:00:00',
    'degisim_sikligi' => 'weekly', 'oncelik' => '0.9',
]]);
if (!str_contains($siteHaritasi, '<loc>https://www.demirvana.com/urunler</loc>')) {
    throw new RuntimeException('Sitemap mutlak ürün adresini üretmedi.');
}

$seoHtml = SeoHtmlOlusturucu::uygula(
    '<html><head><title>Eski</title><meta data-demirvana-seo="true" name="description" content="Eski"></head></html>',
    [
        'baslik' => 'Teknik | Demirvana', 'aciklama' => 'Teknik açıklama',
        'canonical' => 'https://www.demirvana.com/teknik', 'robotlar' => 'index, follow',
        'sosyal_baslik' => 'Teknik | Demirvana', 'sosyal_aciklama' => 'Teknik açıklama',
        'sosyal_gorsel' => 'https://www.demirvana.com/assets/logo.png',
        'yapilandirilmis_veri' => ['@context' => 'https://schema.org', '@type' => 'WebPage'],
    ]
);
if (!str_contains($seoHtml, '<title>Teknik | Demirvana</title>') || !str_contains($seoHtml, 'rel="canonical"')) {
    throw new RuntimeException('PHP ilk HTML yanıtına SEO etiketlerini yerleştiremedi.');
}

echo "PHP API doğrulamaları başarılı.\n";
