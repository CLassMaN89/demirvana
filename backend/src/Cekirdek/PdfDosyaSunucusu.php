<?php

declare(strict_types=1);

final class PdfDosyaSunucusu
{
    public static function guvenliYol(string $pdfKoku, string $goreliYol): ?string
    {
        $kok = realpath($pdfKoku);
        if ($kok === false || $goreliYol === '' || str_contains($goreliYol, "\0")) {
            return null;
        }

        // Admin kaydı yalnız PDF köküne göreli bir yol olabilir; mutlak yollar ve başka dosya türleri reddedilir.
        if (preg_match('#^(?:[a-zA-Z]:[\\\\/]|[\\\\/])#', $goreliYol) === 1
            || strtolower(pathinfo($goreliYol, PATHINFO_EXTENSION)) !== 'pdf') {
            return null;
        }

        $aday = realpath($kok . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $goreliYol));
        if ($aday === false || !is_file($aday)) {
            return null;
        }

        $kokSiniri = rtrim($kok, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        $ayniKokte = DIRECTORY_SEPARATOR === '\\'
            ? str_starts_with(strtolower($aday), strtolower($kokSiniri))
            : str_starts_with($aday, $kokSiniri);

        return $ayniKokte ? $aday : null;
    }

    public static function gonder(array $dokuman, string $pdfKoku): never
    {
        $dosya = self::guvenliYol($pdfKoku, (string) ($dokuman['dosya_yolu'] ?? ''));
        if ($dosya === null) {
            http_response_code(404);
            exit;
        }

        $dosyaBoyutu = filesize($dosya);
        if ($dosyaBoyutu === false) {
            http_response_code(500);
            exit;
        }

        $baslangic = 0;
        $bitis = max(0, $dosyaBoyutu - 1);
        $durumKodu = 200;
        $aralik = trim((string) ($_SERVER['HTTP_RANGE'] ?? ''));

        if ($aralik !== '') {
            if (preg_match('/^bytes=(\d+)-(\d*)$/', $aralik, $eslesme) !== 1) {
                self::gecersizAralikGonder($dosyaBoyutu);
            }

            $baslangic = (int) $eslesme[1];
            $bitis = $eslesme[2] === '' ? $dosyaBoyutu - 1 : (int) $eslesme[2];
            if ($baslangic > $bitis || $baslangic >= $dosyaBoyutu || $bitis >= $dosyaBoyutu) {
                self::gecersizAralikGonder($dosyaBoyutu);
            }
            $durumKodu = 206;
        }

        $uzunluk = $bitis - $baslangic + 1;
        $dosyaAdi = basename((string) ($dokuman['orijinal_dosya_adi'] ?? basename($dosya)));
        $guvenliDosyaAdi = preg_replace('/[^a-zA-Z0-9._-]/', '_', $dosyaAdi) ?: 'dokuman.pdf';

        http_response_code($durumKodu);
        header('Content-Type: application/pdf');
        header('X-Content-Type-Options: nosniff');
        header('Accept-Ranges: bytes');
        header('Content-Disposition: inline; filename="' . $guvenliDosyaAdi . '"');
        header('Content-Length: ' . $uzunluk);
        if ($durumKodu === 206) {
            header("Content-Range: bytes {$baslangic}-{$bitis}/{$dosyaBoyutu}");
        }

        $akis = fopen($dosya, 'rb');
        if ($akis === false) {
            http_response_code(500);
            exit;
        }

        fseek($akis, $baslangic);
        $kalan = $uzunluk;
        // Büyük teknik dosyalar PHP belleğine alınmaz; ziyaretçiye 64 KiB parçalar hâlinde aktarılır.
        while ($kalan > 0 && !feof($akis)) {
            $parca = fread($akis, min(65536, $kalan));
            if ($parca === false || $parca === '') {
                break;
            }
            echo $parca;
            $kalan -= strlen($parca);
            if (function_exists('fastcgi_finish_request')) {
                flush();
            }
        }
        fclose($akis);
        exit;
    }

    private static function gecersizAralikGonder(int $dosyaBoyutu): never
    {
        http_response_code(416);
        header("Content-Range: bytes */{$dosyaBoyutu}");
        header('Content-Length: 0');
        exit;
    }
}
