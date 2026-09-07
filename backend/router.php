<?php

declare(strict_types=1);

$yol = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$distKoku = realpath(__DIR__ . '/../frontend/dist');
$adayDosya = $distKoku ? realpath($distKoku . DIRECTORY_SEPARATOR . ltrim(urldecode($yol), '/')) : false;

if ($distKoku && $adayDosya && str_starts_with($adayDosya, $distKoku . DIRECTORY_SEPARATOR) && is_file($adayDosya)) {
    $uzanti = strtolower(pathinfo($adayDosya, PATHINFO_EXTENSION));
    $mimeTurleri = ['js' => 'text/javascript', 'css' => 'text/css', 'svg' => 'image/svg+xml', 'png' => 'image/png', 'woff2' => 'font/woff2', 'woff' => 'font/woff'];
    header('Content-Type: ' . ($mimeTurleri[$uzanti] ?? 'application/octet-stream'));
    readfile($adayDosya);
    exit;
}

// API, crawler dosyaları ve React rotaları tek PHP giriş noktasına yönlendirilir.
require __DIR__ . '/public/index.php';
