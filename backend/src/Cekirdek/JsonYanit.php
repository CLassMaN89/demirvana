<?php

declare(strict_types=1);

final class JsonYanit
{
    /**
     * Bütün API uçlarının aynı gövde yapısını kullanmasını sağlar; React her rota için ayrı ayrıştırıcı yazmaz.
     */
    public static function olustur(bool $basarili, mixed $veri, ?string $mesaj = null): array
    {
        $yanit = ['basarili' => $basarili, 'veri' => $veri];

        if ($mesaj !== null) {
            $yanit['mesaj'] = $mesaj;
        }

        return $yanit;
    }

    /** HTTP durum kodu ile UTF-8 JSON çıktısını tek noktadan gönderir. */
    public static function gonder(array $govde, int $durumKodu = 200): never
    {
        http_response_code($durumKodu);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($govde, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

