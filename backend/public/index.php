<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/Cekirdek/JsonYanit.php';
require_once __DIR__ . '/../src/Cekirdek/Veritabani.php';
require_once __DIR__ . '/../src/Cekirdek/SeoHtmlOlusturucu.php';
require_once __DIR__ . '/../src/Cekirdek/PdfDosyaSunucusu.php';
require_once __DIR__ . '/../src/Cekirdek/GoogleAdsOAuth.php';
require_once __DIR__ . '/../src/Depolar/SiteDeposu.php';
require_once __DIR__ . '/../src/Depolar/SeoDeposu.php';
require_once __DIR__ . '/../src/Denetleyiciler/SiteDenetleyicisi.php';
require_once __DIR__ . '/../src/Denetleyiciler/SeoDenetleyicisi.php';

$yol = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$yol = '/' . trim($yol, '/');
$yontem = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Genel API salt okunurdur; ziyaretçi iletişim formu kaydı, sayfa görüntüleme analitiği ve
// /api/admin/* altındaki admin panel uçları istisnadır.
// NOT: Admin panelinde henüz bir giriş/oturum sistemi yok (bilinçli, geçici karar) — bu uçlar korumasızdır.
if ($yontem !== 'GET'
    && !($yontem === 'POST' && $yol === '/api/iletisim-mesajlari')
    && !($yontem === 'POST' && $yol === '/api/analitik/goruntuleme')
    && !($yontem === 'POST' && $yol === '/api/analitik/kalma-suresi')
    && !str_starts_with($yol, '/api/admin/')) {
    JsonYanit::gonder(JsonYanit::olustur(false, null, 'Bu yöntem desteklenmiyor.'), 405);
}

// Proxy arkasında çalışıyorsa X-Forwarded-For'un ilk (gerçek istemci) adresi alınır; MAC adresi
// hiçbir tarayıcı tarafından web sunucusuna gönderilmediği için (donanım katmanı, HTTP dışı) burada
// hiçbir şekilde elde edilemez — yalnızca IP adresi kaydedilebilir.
function istekIp(): string
{
    $ileriIcin = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($ileriIcin !== '') {
        return trim(explode(',', $ileriIcin)[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'bilinmiyor';
}

try {
    $denetleyici = new SiteDenetleyicisi(new SiteDeposu(Veritabani::baglanti()));
    $seoDenetleyicisi = new SeoDenetleyicisi(new SeoDeposu(Veritabani::baglanti()));

    if ($yontem === 'POST' && $yol === '/api/iletisim-mesajlari') {
        $girdi = json_decode((string) file_get_contents('php://input'), true);
        if (!is_array($girdi) || trim((string) ($girdi['internet_sitesi'] ?? '')) !== '') {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Form bilgileri doğrulanamadı.'), 422);
        }
        try {
            $id = $denetleyici->iletisimMesajiKaydet($girdi);
            JsonYanit::gonder(JsonYanit::olustur(true, ['id' => $id], 'Mesajınız başarıyla alındı.'), 201);
        } catch (InvalidArgumentException $hata) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
        }
    }

    // Her admin isteğinde, 7 günlük geri alma süresi dolmuş "çöp kutusu" kategorileri kalıcı olarak
    // süpürülür. Gerçek bir cron/zamanlanmış görev altyapısı olmadığı için en pratik ve güvenilir
    // yöntem budur; hacim düşük olduğundan performans etkisi ihmal edilebilir.
    if (str_starts_with($yol, '/api/admin/')) {
        $denetleyici->supurSilinenleri();
    }

    if ($yontem === 'GET' && $yol === '/api/admin/seo/genel-bakis') {
        $seoGenelBakisi = $seoDenetleyicisi->yonetimGenelBakis();
        $seoGenelBakisi['dis_kaynaklar']['reklam_saglayicisi'] = GoogleAdsOAuth::bagliMi() ? 'bagli' : 'bagli_degil';
        JsonYanit::gonder(JsonYanit::olustur(true, $seoGenelBakisi));
    }

    if ($yontem === 'GET' && $yol === '/api/admin/google-ads/oauth/baslat') {
        header('Location: ' . GoogleAdsOAuth::yetkilendirmeAdresiniOlustur(), true, 302);
        exit;
    }

    if ($yontem === 'GET' && $yol === '/api/admin/google-ads/oauth/callback') {
        if (isset($_GET['error'])) throw new RuntimeException('Google Ads izni verilmedi: ' . (string) $_GET['error']);
        GoogleAdsOAuth::koduIsle((string) ($_GET['code'] ?? ''), (string) ($_GET['state'] ?? ''));
        header('Location: http://127.0.0.1:5173/admin/seo?google_ads=baglandi', true, 302);
        exit;
    }

    if ($yontem === 'POST' && $yol === '/api/admin/seo/siteyi-tara') {
        JsonYanit::gonder(JsonYanit::olustur(true, $seoDenetleyicisi->siteDenetimiCalistir(), 'Site SEO denetimi tamamlandı.'));
    }

    if ($yontem === 'POST' && $yol === '/api/admin/seo/rakipleri-tara') {
        JsonYanit::gonder(JsonYanit::olustur(true, $seoDenetleyicisi->rakipAnalizleriniCalistir(), 'Rakip SEO analizleri tamamlandı.'));
    }

    // Kategori Yönetimi ekranı: menu_alt_ogeleri (ürünlerin gerçekten filtrelendiği menü yaprakları) üzerinde CRUD.
    if (str_starts_with($yol, '/api/admin/kategoriler')) {
        if ($yontem === 'GET' && $yol === '/api/admin/kategoriler/silinenler') {
            JsonYanit::gonder(JsonYanit::olustur(true, $denetleyici->silinmisKategorileriGetir()));
        }

        if ($yontem === 'POST' && preg_match('#^/api/admin/kategoriler/(\d+)/geri-al$#', $yol, $eslesme) === 1) {
            try {
                $kategori = $denetleyici->kategoriGeriAl((int) $eslesme[1]);
                $denetleyici->islemKaydet(istekIp(), 'kategori_geri_al', 'kategori', (int) $eslesme[1], $denetleyici->islemDetayiUret($kategori));
                JsonYanit::gonder(JsonYanit::olustur(true, $kategori, 'Kategori geri alındı.'));
            } catch (RuntimeException $hata) {
                JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
            }
        }

        if ($yontem === 'POST' && $yol === '/api/admin/kategoriler') {
            $girdi = json_decode((string) file_get_contents('php://input'), true);
            try {
                $kategori = $denetleyici->kategoriEkle(is_array($girdi) ? $girdi : []);
                $denetleyici->islemKaydet(istekIp(), 'kategori_ekle', 'kategori', (int) $kategori['id'], $denetleyici->islemDetayiUret($kategori));
                JsonYanit::gonder(JsonYanit::olustur(true, $kategori, 'Kategori eklendi.'), 201);
            } catch (InvalidArgumentException $hata) {
                JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
            }
        }

        if (preg_match('#^/api/admin/kategoriler/(\d+)$#', $yol, $eslesme) === 1) {
            $id = (int) $eslesme[1];

            if ($yontem === 'GET') {
                $kategori = $denetleyici->kategoriBul($id);
                if ($kategori === null) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, 'Kategori bulunamadı.'), 404);
                }
                JsonYanit::gonder(JsonYanit::olustur(true, $kategori));
            }

            if ($yontem === 'PUT') {
                $girdi = json_decode((string) file_get_contents('php://input'), true);
                try {
                    $kategori = $denetleyici->kategoriGuncelle($id, is_array($girdi) ? $girdi : []);
                    $denetleyici->islemKaydet(istekIp(), 'kategori_guncelle', 'kategori', $id, $denetleyici->islemDetayiUret($kategori));
                    JsonYanit::gonder(JsonYanit::olustur(true, $kategori, 'Kategori güncellendi.'));
                } catch (InvalidArgumentException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
                } catch (RuntimeException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
                }
            }

            if ($yontem === 'DELETE') {
                try {
                    $mevcut = $denetleyici->kategoriBul($id);
                    $denetleyici->kategoriSil($id);
                    $denetleyici->islemKaydet(istekIp(), 'kategori_sil', 'kategori', $id, $mevcut !== null ? $denetleyici->islemDetayiUret($mevcut) : null);
                    JsonYanit::gonder(JsonYanit::olustur(true, null, 'Kategori silindi.'));
                } catch (RuntimeException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
                }
            }
        }
    }

    // Menü Yönetimi ekranı: menu_ogeleri (sitenin üst navigasyonu) üzerinde CRUD.
    if (str_starts_with($yol, '/api/admin/menu-ogeleri')) {
        if ($yontem === 'GET' && $yol === '/api/admin/menu-ogeleri') {
            JsonYanit::gonder(JsonYanit::olustur(true, $denetleyici->menuYonetimVerisi()));
        }

        if ($yontem === 'POST' && $yol === '/api/admin/menu-ogeleri') {
            $girdi = json_decode((string) file_get_contents('php://input'), true);
            try {
                $oge = $denetleyici->menuOgesiEkle(is_array($girdi) ? $girdi : []);
                $denetleyici->islemKaydet(istekIp(), 'menu_ogesi_ekle', 'menu_ogesi', (int) $oge['id'], "Menü Yönetimi > {$oge['baslik']}");
                JsonYanit::gonder(JsonYanit::olustur(true, $oge, 'Menü öğesi eklendi.'), 201);
            } catch (InvalidArgumentException $hata) {
                JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
            }
        }

        // Birleşik Menü Yönetimi ekranı: bir üst menünün TÜM alt yapısını (grup+kategori dahil,
        // sonsuz derinlik) tek ağaç olarak döner.
        if ($yontem === 'GET' && preg_match('#^/api/admin/menu-ogeleri/(\d+)/agac$#', $yol, $eslesme) === 1) {
            try {
                JsonYanit::gonder(JsonYanit::olustur(true, $denetleyici->menuOgesiAgaciGetir((int) $eslesme[1])));
            } catch (RuntimeException $hata) {
                JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
            }
        }

        // Bir üst menünün (Kurumsal, Teknik, vb.) doğrudan alt menüleri (dropdown öğeleri) — Kategori
        // Yönetimi'nin "Ürünler" için yaptığının genellenmiş hali. Düzenleme/silme mevcut
        // /api/admin/kategoriler/{id} uçlarını kullanır (menu_alt_ogeleri üzerinde genel amaçlı çalışırlar).
        if (preg_match('#^/api/admin/menu-ogeleri/(\d+)/alt-ogeler$#', $yol, $eslesme) === 1) {
            $menuOgesiId = (int) $eslesme[1];

            if ($yontem === 'POST') {
                $girdi = json_decode((string) file_get_contents('php://input'), true);
                try {
                    $altOge = $denetleyici->altMenuOgesiEkle($menuOgesiId, is_array($girdi) ? $girdi : []);
                    $denetleyici->islemKaydet(istekIp(), 'alt_menu_ogesi_ekle', 'menu_alt_ogesi', (int) $altOge['id'], "Menü Yönetimi > {$altOge['baslik']}");
                    JsonYanit::gonder(JsonYanit::olustur(true, $altOge, 'Alt menü öğesi eklendi.'), 201);
                } catch (InvalidArgumentException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
                } catch (RuntimeException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
                }
            }
        }

        if ($yontem === 'POST' && preg_match('#^/api/admin/menu-ogeleri/(\d+)/geri-al$#', $yol, $eslesme) === 1) {
            try {
                $oge = $denetleyici->menuOgesiGeriAl((int) $eslesme[1]);
                $denetleyici->islemKaydet(istekIp(), 'menu_ogesi_geri_al', 'menu_ogesi', (int) $eslesme[1], "Menü Yönetimi > {$oge['baslik']}");
                JsonYanit::gonder(JsonYanit::olustur(true, $oge, 'Menü öğesi geri alındı.'));
            } catch (RuntimeException $hata) {
                JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
            }
        }

        if (preg_match('#^/api/admin/menu-ogeleri/(\d+)$#', $yol, $eslesme) === 1) {
            $id = (int) $eslesme[1];

            if ($yontem === 'PUT') {
                $girdi = json_decode((string) file_get_contents('php://input'), true);
                try {
                    $oge = $denetleyici->menuOgesiGuncelle($id, is_array($girdi) ? $girdi : []);
                    $denetleyici->islemKaydet(istekIp(), 'menu_ogesi_guncelle', 'menu_ogesi', $id, "Menü Yönetimi > {$oge['baslik']}");
                    JsonYanit::gonder(JsonYanit::olustur(true, $oge, 'Menü öğesi güncellendi.'));
                } catch (InvalidArgumentException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
                } catch (RuntimeException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
                }
            }

            if ($yontem === 'DELETE') {
                try {
                    $mevcut = $denetleyici->menuOgesiBul($id);
                    $denetleyici->menuOgesiSil($id);
                    $denetleyici->islemKaydet(istekIp(), 'menu_ogesi_sil', 'menu_ogesi', $id, $mevcut !== null ? "Menü Yönetimi > {$mevcut['baslik']}" : null);
                    JsonYanit::gonder(JsonYanit::olustur(true, null, 'Menü öğesi silindi.'));
                } catch (RuntimeException $hata) {
                    JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), $hata->getCode() ?: 400);
                }
            }
        }
    }

    // Ziyaretci sayfa goruntuleme analitigi: SPA istemci tarafinda yonlendigi icin her rota
    // degisiminde bu uca kucuk bir istek atar; IP burada (yalnizca sunucu tarafinda guvenilir
    // sekilde) okunur.
    if ($yontem === 'POST' && $yol === '/api/analitik/goruntuleme') {
        $girdi = json_decode((string) file_get_contents('php://input'), true);
        try {
            // Dil, Accept-Language header'indan (sunucu tarafinda guvenilir) alinir; ekran
            // cozunurlugu ve saat dilimi ise yalnizca tarayicidan (JS ile) bilinebildigi icin
            // istek govdesinden okunur.
            $dil = isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])
                ? trim(explode(',', (string) $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0])
                : null;
            $id = $denetleyici->ziyaretKaydet(
                istekIp(),
                isset($_SERVER['HTTP_USER_AGENT']) ? (string) $_SERVER['HTTP_USER_AGENT'] : null,
                (string) ($girdi['yol'] ?? ''),
                isset($girdi['referans']) && $girdi['referans'] !== '' ? (string) $girdi['referans'] : null,
                $dil !== '' ? $dil : null,
                isset($girdi['ekran_cozunurlugu']) && $girdi['ekran_cozunurlugu'] !== '' ? (string) $girdi['ekran_cozunurlugu'] : null,
                isset($girdi['saat_dilimi']) && $girdi['saat_dilimi'] !== '' ? (string) $girdi['saat_dilimi'] : null
            );
            JsonYanit::gonder(JsonYanit::olustur(true, ['id' => $id]), 201);
        } catch (InvalidArgumentException $hata) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, $hata->getMessage()), 422);
        }
    }

    // Kalma suresi, sayfa gorunumu kaydedildikten SONRA (ziyaretci sayfadan ayrilirken) belli
    // olur; bu yuzden ayri ve kucuk bir PATCH benzeri istekle geriye donuk doldurulur.
    if ($yontem === 'POST' && $yol === '/api/analitik/kalma-suresi') {
        $girdi = json_decode((string) file_get_contents('php://input'), true);
        $id = isset($girdi['id']) ? (int) $girdi['id'] : 0;
        $saniye = isset($girdi['saniye']) ? (int) $girdi['saniye'] : -1;
        if ($id > 0 && $saniye >= 0) {
            $denetleyici->kalmaSuresiGuncelle($id, $saniye);
        }
        JsonYanit::gonder(JsonYanit::olustur(true, null), 200);
    }

    if ($yontem === 'GET' && $yol === '/api/admin/ziyaretler') {
        $sayfa = isset($_GET['sayfa']) ? (int) $_GET['sayfa'] : 1;
        JsonYanit::gonder(JsonYanit::olustur(true, $denetleyici->ziyaretYonetimVerisi($sayfa)));
    }

    // Günlük IP toplamındaki satır açıldığında sayfa dökümü aynı tarihle sınırlandırılır.
    if ($yontem === 'GET' && preg_match('#^/api/admin/ziyaretler/ip/([^/]+)$#', $yol, $eslesme) === 1) {
        $tarih = isset($_GET['tarih']) ? trim((string) $_GET['tarih']) : null;
        JsonYanit::gonder(JsonYanit::olustur(true, $denetleyici->ipSayfalariniGetir(urldecode($eslesme[1]), $tarih)));
    }

    if ($yontem === 'GET' && $yol === '/api/admin/loglar') {
        $sayfa = isset($_GET['sayfa']) ? (int) $_GET['sayfa'] : 1;
        JsonYanit::gonder(JsonYanit::olustur(true, $denetleyici->islemYonetimVerisi($sayfa)));
    }

    if ($yol === '/robots.txt') {
        header('Content-Type: text/plain; charset=utf-8');
        echo $seoDenetleyicisi->robots();
        exit;
    }

    if ($yol === '/sitemap.xml') {
        header('Content-Type: application/xml; charset=utf-8');
        echo $seoDenetleyicisi->siteHaritasi();
        exit;
    }

    if (preg_match('#^/dokumanlar/([^/]+)$#', $yol, $eslesme) === 1) {
        $slug = $eslesme[1];
        if (!SiteDenetleyicisi::gecerliSlug($slug)) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Geçersiz doküman adresi.'), 400);
        }

        $dokuman = $denetleyici->teknikDokuman($slug);
        if ($dokuman === null) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Doküman bulunamadı.'), 404);
        }
        PdfDosyaSunucusu::gonder($dokuman, dirname(__DIR__, 2) . '/pdf');
    }

    if (preg_match('#^/sertifika-dosyalari/([^/]+)$#', $yol, $eslesme) === 1) {
        $slug = $eslesme[1];
        if (!SiteDenetleyicisi::gecerliSlug($slug)) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Geçersiz sertifika adresi.'), 400);
        }

        $sertifika = $denetleyici->sertifika($slug);
        if ($sertifika === null) {
            JsonYanit::gonder(JsonYanit::olustur(false, null, 'Sertifika bulunamadı.'), 404);
        }
        // PDF sunucusu kök denetimi ve byte-range desteğini teknik belgelerle aynı güvenli katmanda uygular.
        PdfDosyaSunucusu::gonder($sertifika, dirname(__DIR__, 2) . '/sertifikalar');
    }

    if (!str_starts_with($yol, '/api')) {
        $htmlDosyasi = dirname(__DIR__, 2) . '/frontend/dist/index.html';
        if (!is_file($htmlDosyasi)) {
            throw new RuntimeException('Frontend üretim derlemesi bulunamadı.');
        }

        $meta = $seoDenetleyicisi->htmlMeta($yol);
        if ($meta['bulunamadi']) {
            http_response_code(404);
        }
        header('Content-Type: text/html; charset=utf-8');
        echo SeoHtmlOlusturucu::uygula((string) file_get_contents($htmlDosyasi), $meta);
        exit;
    }

    $teknikDokumanlariHazirla = function () use ($denetleyici): array {
        $kategoriler = $denetleyici->teknikDokumanlar();
        $pdfKoku = dirname(__DIR__, 2) . '/pdf';

        // Veritabanında kaydı olsa bile fiziksel dosyası bulunmayan belge ziyaretçiye gösterilmez.
        foreach ($kategoriler as &$kategori) {
            $kategori['dokumanlar'] = array_values(array_filter(
                $kategori['dokumanlar'],
                function (array $ozet) use ($denetleyici, $pdfKoku): bool {
                    $dokuman = $denetleyici->teknikDokuman((string) $ozet['slug']);
                    return $dokuman !== null
                        && PdfDosyaSunucusu::guvenliYol($pdfKoku, (string) $dokuman['dosya_yolu']) !== null;
                }
            ));
        }
        unset($kategori);
        return $kategoriler;
    };

    $sertifikalariHazirla = function () use ($denetleyici): array {
        $veri = $denetleyici->sertifikalar();
        $pdfKoku = dirname(__DIR__, 2) . '/sertifikalar';

        // Silinmiş veya kök dışına yönlendirilmiş PDF kayıtları kütüphane listesine alınmaz.
        $veri['kayitlar'] = array_values(array_filter(
            $veri['kayitlar'],
            function (array $ozet) use ($denetleyici, $pdfKoku): bool {
                $sertifika = $denetleyici->sertifika((string) $ozet['slug']);
                return $sertifika !== null
                    && PdfDosyaSunucusu::guvenliYol($pdfKoku, (string) $sertifika['dosya_yolu']) !== null;
            }
        ));
        return $veri;
    };

    $sabitRotalar = [
        // İlk görünüm tek bağlantı üzerinden döner; ayrı uçlar admin ve bağımsız yenilemeler için korunur.
        '/api/baslangic' => fn() => [
            'site_ayarlari' => $denetleyici->siteAyarlari(),
            'seo' => $seoDenetleyicisi->seo(),
            'tema' => $denetleyici->tema(),
            'menu' => $denetleyici->menu(),
            'sliderlar' => $denetleyici->sliderlar(),
            'kategoriler' => $denetleyici->kategoriler(),
            'fuarlar' => $denetleyici->fuarlar(),
            'temsilcilikler' => $denetleyici->temsilcilikler(),
            'banka_hesaplari' => $denetleyici->bankaHesaplari(),
            'urunler' => $denetleyici->urunler(null, null),
            'referanslar' => $denetleyici->referanslar(),
            'kurumsal' => $denetleyici->kurumsal(),
            'teknik_dokumanlar' => $teknikDokumanlariHazirla(),
            'sertifikalar' => $sertifikalariHazirla(),
        ],
        '/api/site-ayarlari' => fn() => $denetleyici->siteAyarlari(),
        '/api/seo' => fn() => $seoDenetleyicisi->seo(),
        '/api/tema' => fn() => $denetleyici->tema(),
        '/api/menu' => fn() => $denetleyici->menu(),
        '/api/sliderlar' => fn() => $denetleyici->sliderlar(),
        '/api/kategoriler' => fn() => $denetleyici->kategoriler(),
        '/api/fuarlar' => fn() => $denetleyici->fuarlar(),
        '/api/temsilcilikler' => fn() => $denetleyici->temsilcilikler(),
        '/api/banka-hesaplari' => fn() => $denetleyici->bankaHesaplari(),
        '/api/referanslar' => fn() => $denetleyici->referanslar(),
        '/api/kurumsal' => fn() => $denetleyici->kurumsal(),
        '/api/teknik-dokumanlar' => $teknikDokumanlariHazirla,
        '/api/sertifikalar' => $sertifikalariHazirla,
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
