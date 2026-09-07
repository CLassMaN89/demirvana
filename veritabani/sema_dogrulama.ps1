$ErrorActionPreference = 'Stop'

$sqlDosyasi = Join-Path $PSScriptRoot 'demirvana.sql'
if (-not (Test-Path -LiteralPath $sqlDosyasi)) {
    throw "Şema dosyası bulunamadı: $sqlDosyasi"
}

$sql = Get-Content -Raw -LiteralPath $sqlDosyasi
$tablolar = @(
    'site_ayarlari',
    'tema_ayarlari',
    'menu_ogeleri',
    'menu_alt_ogeleri',
    'sliderlar',
    'kategoriler',
    'urunler',
    'urun_gorselleri',
    'referanslar',
    'referans_gorselleri',
    'referans_sektorleri',
    'referans_sektor_eslesmeleri',
    'teknik_dokuman_kategorileri',
    'teknik_dokumanlar'
)

# Bu kontrol, backend deposunun beklediği temel tabloların şemadan yanlışlıkla çıkarılmasını yakalar.
foreach ($tablo in $tablolar) {
    if ($sql -notmatch "CREATE TABLE(?: IF NOT EXISTS)? ``$tablo``") {
        throw "Eksik tablo: $tablo"
    }
}

if ($sql -notmatch 'CHARACTER SET utf8mb4') {
    throw 'Türkçe içerik için gerekli utf8mb4 tanımı eksik.'
}

if (($sql | Select-String -Pattern "'yurtici'|'yurtdisi'" -AllMatches).Matches.Count -lt 22) {
    throw 'Referans başlangıç verilerinin tamamı şemada bulunamadı.'
}

Write-Output 'Şema yapısal doğrulaması başarılı.'
