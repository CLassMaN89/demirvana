<?php

declare(strict_types=1);

final class Veritabani
{
    private static ?PDO $baglanti = null;

    /**
     * Tek PDO örneği kullanmak her istek içinde gereksiz tekrar bağlantıları önler.
     * Bilgiler kaynak koda yazılmaz; sunucu ortam değişkenlerinden alınır.
     */
    public static function baglanti(): PDO
    {
        if (self::$baglanti instanceof PDO) {
            return self::$baglanti;
        }

        $sunucu = getenv('DB_SUNUCU') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $veritabani = getenv('DB_ADI') ?: 'demirvana';
        $kullanici = getenv('DB_KULLANICI') ?: 'root';
        $parola = getenv('DB_PAROLA') ?: '';
        $dsn = "mysql:host={$sunucu};port={$port};dbname={$veritabani};charset=utf8mb4";

        self::$baglanti = new PDO($dsn, $kullanici, $parola, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Gerçek hazırlanmış sorgular, kullanıcı verisinin SQL olarak yorumlanmasını engeller.
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        return self::$baglanti;
    }
}

