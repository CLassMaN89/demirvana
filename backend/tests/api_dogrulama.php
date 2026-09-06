<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Cekirdek/JsonYanit.php';
require_once __DIR__ . '/../src/Denetleyiciler/SiteDenetleyicisi.php';

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

echo "PHP API doğrulamaları başarılı.\n";
