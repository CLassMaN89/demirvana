<?php

declare(strict_types=1);

final class GoogleAdsOAuth
{
    private const YETKI_ADRESI = 'https://accounts.google.com/o/oauth2/v2/auth';
    private const TOKEN_ADRESI = 'https://oauth2.googleapis.com/token';
    private const KAPSAM = 'https://www.googleapis.com/auth/adwords';

    public static function ayar(string $anahtar): string
    {
        $ortamDegeri = getenv($anahtar);
        if ($ortamDegeri !== false && trim($ortamDegeri) !== '') return trim($ortamDegeri);

        $ayarlar = parse_ini_file(dirname(__DIR__, 2) . '/.env', false, INI_SCANNER_RAW) ?: [];
        return trim((string) ($ayarlar[$anahtar] ?? ''));
    }

    public static function bagliMi(): bool
    {
        return self::ayar('GOOGLE_ADS_REFRESH_TOKEN') !== '';
    }

    public static function yetkilendirmeAdresiniOlustur(): string
    {
        $istemciId = self::zorunluAyar('GOOGLE_ADS_CLIENT_ID');
        $yonlendirme = self::zorunluAyar('GOOGLE_ADS_REDIRECT_URI');
        $zaman = (string) time();
        $imza = hash_hmac('sha256', $zaman, self::zorunluAyar('GOOGLE_ADS_CLIENT_SECRET'));
        $durum = self::base64UrlKodla($zaman . '.' . $imza);

        return self::YETKI_ADRESI . '?' . http_build_query([
            'client_id' => $istemciId,
            'redirect_uri' => $yonlendirme,
            'response_type' => 'code',
            'scope' => self::KAPSAM,
            'access_type' => 'offline',
            'prompt' => 'consent',
            'state' => $durum,
        ], '', '&', PHP_QUERY_RFC3986);
    }

    public static function koduIsle(string $kod, string $durum): void
    {
        self::durumuDogrula($durum);
        $yanit = self::formGonder(self::TOKEN_ADRESI, [
            'code' => $kod,
            'client_id' => self::zorunluAyar('GOOGLE_ADS_CLIENT_ID'),
            'client_secret' => self::zorunluAyar('GOOGLE_ADS_CLIENT_SECRET'),
            'redirect_uri' => self::zorunluAyar('GOOGLE_ADS_REDIRECT_URI'),
            'grant_type' => 'authorization_code',
        ]);

        $yenilemeAnahtari = trim((string) ($yanit['refresh_token'] ?? ''));
        if ($yenilemeAnahtari === '') throw new RuntimeException('Google yenileme anahtarı döndürmedi. Hesap iznini kaldırıp yeniden bağlayın.');
        self::envDegeriniKaydet('GOOGLE_ADS_REFRESH_TOKEN', $yenilemeAnahtari);
    }

    private static function durumuDogrula(string $durum): void
    {
        $cozulmus = self::base64UrlCoz($durum);
        [$zaman, $imza] = array_pad(explode('.', $cozulmus, 2), 2, '');
        $beklenen = hash_hmac('sha256', $zaman, self::zorunluAyar('GOOGLE_ADS_CLIENT_SECRET'));
        if (!ctype_digit($zaman) || abs(time() - (int) $zaman) > 600 || !hash_equals($beklenen, $imza)) {
            throw new RuntimeException('Google Ads bağlantı isteği geçersiz veya süresi dolmuş.');
        }
    }

    private static function formGonder(string $adres, array $veri): array
    {
        if (!function_exists('curl_init')) throw new RuntimeException('PHP cURL eklentisi etkin değil; yerel PHP sunucusunu yeniden başlatın.');
        $istek = curl_init($adres);
        if ($istek === false) throw new RuntimeException('Google OAuth isteği başlatılamadı.');
        curl_setopt_array($istek, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($veri, '', '&', PHP_QUERY_RFC3986),
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded', 'Accept: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
        ]);
        $sertifikaDosyasi = self::ayar('GOOGLE_ADS_CA_BUNDLE');
        if ($sertifikaDosyasi !== '') {
            if (!is_file($sertifikaDosyasi)) throw new RuntimeException('Google Ads CA sertifika dosyası bulunamadı.');
            curl_setopt($istek, CURLOPT_CAINFO, $sertifikaDosyasi);
        }
        $govde = curl_exec($istek);
        $curlHatasi = curl_error($istek);
        $httpDurumu = (int) curl_getinfo($istek, CURLINFO_RESPONSE_CODE);
        curl_close($istek);
        if ($govde === false) throw new RuntimeException('Google OAuth bağlantısı kurulamadı: ' . $curlHatasi);
        $sonuc = json_decode((string) $govde, true);
        if ($httpDurumu >= 400 || !is_array($sonuc) || isset($sonuc['error'])) {
            throw new RuntimeException('Google OAuth kodu doğrulanamadı: ' . (string) ($sonuc['error_description'] ?? $sonuc['error'] ?? 'bilinmeyen hata'));
        }
        return $sonuc;
    }

    private static function envDegeriniKaydet(string $anahtar, string $deger): void
    {
        $dosya = dirname(__DIR__, 2) . '/.env';
        $icerik = is_file($dosya) ? (string) file_get_contents($dosya) : '';
        $satir = $anahtar . '=' . $deger;
        $desen = '/^' . preg_quote($anahtar, '/') . '=.*$/m';
        $icerik = preg_match($desen, $icerik) === 1 ? (string) preg_replace($desen, $satir, $icerik) : rtrim($icerik) . PHP_EOL . $satir . PHP_EOL;
        if (file_put_contents($dosya, $icerik, LOCK_EX) === false) throw new RuntimeException('Google Ads bağlantısı .env dosyasına kaydedilemedi.');
        putenv($satir);
    }

    private static function zorunluAyar(string $anahtar): string
    {
        $deger = self::ayar($anahtar);
        if ($deger === '') throw new RuntimeException($anahtar . ' ayarı eksik.');
        return $deger;
    }

    private static function base64UrlKodla(string $deger): string
    {
        return rtrim(strtr(base64_encode($deger), '+/', '-_'), '=');
    }

    private static function base64UrlCoz(string $deger): string
    {
        return (string) base64_decode(strtr($deger, '-_', '+/'), true);
    }
}
