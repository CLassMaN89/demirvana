<?php

declare(strict_types=1);

final class SeoDeposu
{
    public function __construct(private readonly PDO $baglanti)
    {
    }

    /** Tanımlı rakiplerin herkese açık ana sayfa ve sitemap verilerini ölçer; sıralama değeri uydurmaz. */
    public function rakipAnalizleriniCalistir(): array
    {
        $rakipler = $this->baglanti->query('SELECT id, ad, ana_adres FROM seo_rakipleri WHERE aktif_mi = 1 ORDER BY id')->fetchAll();
        $ekle = $this->baglanti->prepare(
            'INSERT INTO seo_rakip_taramalari
             (rakip_id, http_durumu, yanit_suresi_ms, seo_puani, baslik_uzunlugu, meta_uzunlugu,
              h1_sayisi, kelime_sayisi, baglanti_sayisi, schema_sayisi, sitemap_url_sayisi, hata_mesaji)
             VALUES (:rakip_id, :http_durumu, :yanit_suresi_ms, :seo_puani, :baslik_uzunlugu, :meta_uzunlugu,
                     :h1_sayisi, :kelime_sayisi, :baglanti_sayisi, :schema_sayisi, :sitemap_url_sayisi, :hata_mesaji)'
        );

        foreach ($rakipler as $rakip) {
            $olcum = $this->siteAnaSayfasiniOlc((string) $rakip['ana_adres']);
            $ekle->execute(['rakip_id' => $rakip['id'], ...$olcum]);
        }
        return $this->yonetimGenelBakis();
    }

    private function siteAnaSayfasiniOlc(string $adres): array
    {
        $baslangic = microtime(true);
        [$icerik, $httpDurumu, $hata] = $this->uzakIcerikGetir($adres);
        $yanitSuresi = (int) round((microtime(true) - $baslangic) * 1000);
        $bos = ['http_durumu' => $httpDurumu, 'yanit_suresi_ms' => $yanitSuresi, 'seo_puani' => 0, 'baslik_uzunlugu' => 0, 'meta_uzunlugu' => 0, 'h1_sayisi' => 0, 'kelime_sayisi' => 0, 'baglanti_sayisi' => 0, 'schema_sayisi' => 0, 'sitemap_url_sayisi' => 0, 'hata_mesaji' => $hata];
        if ($icerik === '') return $bos;

        $belge = new DOMDocument();
        libxml_use_internal_errors(true);
        $belge->loadHTML($icerik, LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();
        $xpath = new DOMXPath($belge);
        $baslik = trim((string) ($belge->getElementsByTagName('title')->item(0)?->textContent ?? ''));
        $meta = trim((string) ($xpath->query('//meta[translate(@name,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="description"]/@content')->item(0)?->nodeValue ?? ''));
        $h1Sayisi = $belge->getElementsByTagName('h1')->length;
        $baglantiSayisi = $belge->getElementsByTagName('a')->length;
        $schemaSayisi = $xpath->query('//script[@type="application/ld+json"]')->length;
        $metin = preg_replace('/\s+/u', ' ', strip_tags($icerik)) ?? '';
        $kelimeSayisi = count(preg_split('/\s+/u', trim($metin), -1, PREG_SPLIT_NO_EMPTY));
        [$siteHaritasi] = $this->uzakIcerikGetir(rtrim($adres, '/') . '/sitemap.xml', 8);
        $sitemapSayisi = $siteHaritasi !== '' ? preg_match_all('/<loc[ >]/i', $siteHaritasi) : 0;

        $puan = 100;
        if ($httpDurumu < 200 || $httpDurumu >= 400) $puan -= 35;
        if (strlen($baslik) < 15 || strlen($baslik) > 65) $puan -= 12;
        if (strlen($meta) < 70 || strlen($meta) > 170) $puan -= 12;
        if ($h1Sayisi !== 1) $puan -= 10;
        if ($schemaSayisi === 0) $puan -= 8;
        if ($sitemapSayisi === 0) $puan -= 8;
        if ($yanitSuresi > 2500) $puan -= 10;
        if ($kelimeSayisi < 200) $puan -= 5;

        return ['http_durumu' => $httpDurumu, 'yanit_suresi_ms' => $yanitSuresi, 'seo_puani' => max(0, $puan), 'baslik_uzunlugu' => strlen($baslik), 'meta_uzunlugu' => strlen($meta), 'h1_sayisi' => $h1Sayisi, 'kelime_sayisi' => $kelimeSayisi, 'baglanti_sayisi' => $baglantiSayisi, 'schema_sayisi' => $schemaSayisi, 'sitemap_url_sayisi' => (int) $sitemapSayisi, 'hata_mesaji' => null];
    }

    private function uzakIcerikGetir(string $adres, int $zamanAsimi = 15): array
    {
        if (function_exists('curl_init')) {
            $istek = curl_init($adres);
            $ayarlar = [CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => $zamanAsimi, CURLOPT_CONNECTTIMEOUT => 6, CURLOPT_USERAGENT => 'Demirvana SEO Monitor/1.0', CURLOPT_SSL_VERIFYPEER => true];
            // Windows geliştirme ortamında ayrıca CA dosyası taşımadan işletim sisteminin güvenilir sertifika deposunu kullanır.
            if (defined('CURLOPT_SSL_OPTIONS') && defined('CURLSSLOPT_NATIVE_CA')) $ayarlar[CURLOPT_SSL_OPTIONS] = CURLSSLOPT_NATIVE_CA;
            curl_setopt_array($istek, $ayarlar);
            $icerik = curl_exec($istek);
            $durum = (int) curl_getinfo($istek, CURLINFO_HTTP_CODE);
            $hata = $icerik === false ? curl_error($istek) : null;
            curl_close($istek);
            return [(string) ($icerik ?: ''), $durum, $hata];
        }
        if (PHP_OS_FAMILY === 'Windows' && function_exists('proc_open')) {
            $borular = [];
            $islem = @proc_open(['curl.exe', '-L', '-sS', '--max-time', (string) $zamanAsimi, '-A', 'Demirvana SEO Monitor/1.0', '-w', "\n%{http_code}", $adres], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $borular);
            if (is_resource($islem)) {
                $cikti = stream_get_contents($borular[1]);
                $hata = trim(stream_get_contents($borular[2]));
                fclose($borular[1]); fclose($borular[2]);
                $islemKodu = proc_close($islem);
                if (preg_match('/\n(\d{3})$/', $cikti, $eslesme)) {
                    $cikti = substr($cikti, 0, -4);
                    return [$cikti, (int) $eslesme[1], $islemKodu === 0 ? null : $hata];
                }
            }
        }
        $baglam = stream_context_create(['http' => ['timeout' => $zamanAsimi, 'follow_location' => 1, 'user_agent' => 'Demirvana SEO Monitor/1.0'], 'ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
        $icerik = @file_get_contents($adres, false, $baglam);
        $durum = 0;
        foreach ($http_response_header ?? [] as $baslik) if (preg_match('/HTTP\/\S+\s+(\d{3})/', $baslik, $eslesme)) $durum = (int) $eslesme[1];
        return [(string) ($icerik ?: ''), $durum, $icerik === false ? 'Uzak siteye bağlanılamadı.' : null];
    }

    /** Sitemap'e girebilen gerçek rotaların üretilen SEO alanlarını denetler ve sonucu kalıcı saklar. */
    public function siteDenetimiCalistir(): array
    {
        $this->baglanti->beginTransaction();
        try {
            $this->baglanti->exec("INSERT INTO seo_site_taramalari (durum) VALUES ('calisiyor')");
            $taramaId = (int) $this->baglanti->lastInsertId();
            $adresler = $this->siteHaritasiAdresleri();
            $sorunlar = [];

            foreach ($adresler as $adres) {
                $yol = (string) $adres['yol'];
                $meta = $this->sayfaMetaVerisi($yol);
                // Sunucuda mbstring kapalı olsa da tarama yarıda kalmamalıdır.
                $uzunluk = static fn(string $metin): int => function_exists('mb_strlen') ? mb_strlen($metin) : strlen($metin);
                $baslikUzunlugu = $uzunluk(trim((string) ($meta['baslik'] ?? '')));
                $aciklamaUzunlugu = $uzunluk(trim((string) ($meta['aciklama'] ?? '')));

                if ($baslikUzunlugu === 0) {
                    $sorunlar[] = [$yol, 'eksik_baslik', 'kritik', 'SEO başlığı bulunmuyor.', 'Sayfaya açıklayıcı ve benzersiz bir SEO başlığı ekleyin.'];
                } elseif ($baslikUzunlugu > 60) {
                    $sorunlar[] = [$yol, 'uzun_baslik', 'orta', "SEO başlığı {$baslikUzunlugu} karakter.", 'Başlığı anlamı koruyarak yaklaşık 50–60 karaktere indirin.'];
                }
                if ($aciklamaUzunlugu === 0) {
                    $sorunlar[] = [$yol, 'eksik_meta_aciklama', 'yuksek', 'Meta açıklaması bulunmuyor.', 'Sayfanın içeriğini anlatan benzersiz bir meta açıklaması ekleyin.'];
                } elseif ($aciklamaUzunlugu > 160) {
                    $sorunlar[] = [$yol, 'uzun_meta_aciklama', 'dusuk', "Meta açıklaması {$aciklamaUzunlugu} karakter.", 'Açıklamayı yaklaşık 140–160 karaktere indirin.'];
                }
                if (empty($meta['canonical'])) {
                    $sorunlar[] = [$yol, 'eksik_canonical', 'yuksek', 'Canonical adresi bulunmuyor.', 'Sayfanın tercih edilen mutlak canonical adresini tanımlayın.'];
                }
                if (str_contains(strtolower($yol), '/urunler/') && (($meta['yapilandirilmis_veri']['@type'] ?? '') !== 'Product')) {
                    $sorunlar[] = [$yol, 'urun_schema', 'orta', 'Ürün sayfasında Product yapılandırılmış verisi bulunmuyor.', 'Görünür ürün bilgileriyle eşleşen Product schema ekleyin.'];
                }
            }

            $ekle = $this->baglanti->prepare(
                'INSERT INTO seo_site_sorunlari (tarama_id, url_yolu, sorun_turu, onem, aciklama, onerilen_duzeltme)
                 VALUES (:tarama_id, :url_yolu, :sorun_turu, :onem, :aciklama, :onerilen_duzeltme)'
            );
            foreach ($sorunlar as [$yol, $tur, $onem, $aciklama, $onerilen]) {
                $ekle->execute(['tarama_id' => $taramaId, 'url_yolu' => $yol, 'sorun_turu' => $tur, 'onem' => $onem, 'aciklama' => $aciklama, 'onerilen_duzeltme' => $onerilen]);
            }

            $agirliklar = ['kritik' => 12, 'yuksek' => 7, 'orta' => 4, 'dusuk' => 2, 'bilgi' => 0];
            $kesinti = array_sum(array_map(fn(array $sorun): int => $agirliklar[$sorun[2]], $sorunlar));
            // Sorun ağırlığını taranan URL sayısına oranlamak, büyük sitelerin sırf sayfa sayısı nedeniyle sıfır puana düşmesini önler.
            $oranlanmisKesinti = (int) round(($kesinti / max(1, count($adresler))) * 10);
            $puan = max(0, 100 - min(100, $oranlanmisKesinti));
            $guncelle = $this->baglanti->prepare(
                "UPDATE seo_site_taramalari SET durum = 'tamamlandi', toplam_url = :toplam_url,
                 sorun_sayisi = :sorun_sayisi, saglik_puani = :puan, bitis_tarihi = NOW() WHERE id = :id"
            );
            $guncelle->execute(['toplam_url' => count($adresler), 'sorun_sayisi' => count($sorunlar), 'puan' => $puan, 'id' => $taramaId]);
            $this->baglanti->commit();
            return $this->yonetimGenelBakis();
        } catch (Throwable $hata) {
            if ($this->baglanti->inTransaction()) $this->baglanti->rollBack();
            throw $hata;
        }
    }

    public function yonetimGenelBakis(): array
    {
        $tarama = $this->baglanti->query(
            "SELECT id, toplam_url, sorun_sayisi, saglik_puani, bitis_tarihi
             FROM seo_site_taramalari WHERE durum = 'tamamlandi' ORDER BY id DESC LIMIT 1"
        )->fetch() ?: null;
        $sorunlar = [];
        if ($tarama !== null) {
            $sorgu = $this->baglanti->prepare(
                'SELECT id, url_yolu, sorun_turu, onem, aciklama, onerilen_duzeltme, tespit_tarihi
                 FROM seo_site_sorunlari WHERE tarama_id = :tarama_id
                 ORDER BY FIELD(onem, "kritik", "yuksek", "orta", "dusuk", "bilgi"), id LIMIT 50'
            );
            $sorgu->execute(['tarama_id' => $tarama['id']]);
            $sorunlar = $sorgu->fetchAll();
        }
        $taramaGecmisi = $this->baglanti->query(
            "SELECT id, toplam_url, sorun_sayisi, saglik_puani, bitis_tarihi
             FROM seo_site_taramalari WHERE durum = 'tamamlandi'
             ORDER BY id DESC LIMIT 30"
        )->fetchAll();
        $taramaGecmisi = array_reverse($taramaGecmisi);

        $sorunOzeti = [];
        if ($tarama !== null) {
            $ozetSorgusu = $this->baglanti->prepare(
                'SELECT sorun_turu, onem, COUNT(*) AS adet
                 FROM seo_site_sorunlari WHERE tarama_id = :tarama_id
                 GROUP BY sorun_turu, onem ORDER BY adet DESC'
            );
            $ozetSorgusu->execute(['tarama_id' => $tarama['id']]);
            $sorunOzeti = $ozetSorgusu->fetchAll();
        }
        $rakipAnalizleri = $this->baglanti->query(
            'SELECT r.id, r.ad, r.ana_adres, r.bizim_sitemiz_mi, t.http_durumu, t.yanit_suresi_ms,
                    t.seo_puani, t.baslik_uzunlugu, t.meta_uzunlugu, t.h1_sayisi, t.kelime_sayisi,
                    t.baglanti_sayisi, t.schema_sayisi, t.sitemap_url_sayisi, t.hata_mesaji, t.tarama_tarihi
             FROM seo_rakipleri r
             LEFT JOIN seo_rakip_taramalari t ON t.id = (SELECT MAX(t2.id) FROM seo_rakip_taramalari t2 WHERE t2.rakip_id = r.id)
             WHERE r.aktif_mi = 1 ORDER BY r.bizim_sitemiz_mi DESC, r.id'
        )->fetchAll();
        // Grafik, son durum tablosundan değil gerçek tarama geçmişinden beslenir.
        $rakipGecmisi = $this->baglanti->query(
            "SELECT r.id AS rakip_id, r.ad, t.seo_puani, t.tarama_tarihi
             FROM seo_rakip_taramalari t
             INNER JOIN seo_rakipleri r ON r.id = t.rakip_id
             WHERE r.aktif_mi = 1
             ORDER BY t.tarama_tarihi DESC, t.id DESC LIMIT 150"
        )->fetchAll();
        $rakipGecmisi = array_reverse($rakipGecmisi);
        return [
            'dis_kaynaklar' => ['search_console' => 'bagli_degil', 'siralama_saglayicisi' => 'bagli_degil', 'reklam_saglayicisi' => 'bagli_degil'],
            'site_sagligi' => $tarama,
            'sorunlar' => $sorunlar,
            'tarama_gecmisi' => $taramaGecmisi,
            'sorun_ozeti' => $sorunOzeti,
            'rakip_analizleri' => $rakipAnalizleri,
            'rakip_gecmisi' => $rakipGecmisi,
            'rakip_hareketleri' => [],
            'reklam_hareketleri' => [],
        ];
    }

    public function seoVerileri(): array
    {
        $genelSorgusu = $this->baglanti->query(
            "SELECT anahtar, deger FROM site_ayarlari
             WHERE aktif_mi = 1
               AND (anahtar LIKE 'seo_%' OR anahtar IN ('site_adi', 'site_ana_adresi', 'site_varsayilan_dil', 'logo_yolu', 'destek_telefonu', 'destek_eposta', 'firma_adresi', 'google_site_dogrulama'))
             ORDER BY id"
        );

        $genel = [];
        foreach ($genelSorgusu->fetchAll() as $satir) {
            $genel[$satir['anahtar']] = $satir['deger'];
        }

        $sayfalar = $this->baglanti->query(
            'SELECT id, rota, dil_kodu, seo_basligi, meta_aciklama, anahtar_kelimeler,
                    canonical_yolu, sosyal_baslik, sosyal_aciklama, sosyal_gorsel_yolu,
                    robotlar, yapilandirilmis_veri_turu, site_haritasina_ekle,
                    degisim_sikligi, oncelik, guncellenme_tarihi
             FROM seo_sayfalari WHERE aktif_mi = 1 ORDER BY dil_kodu, siralama, id'
        )->fetchAll();

        return ['genel' => $genel, 'sayfalar' => self::seoKayitlariniNesneyeDonustur($sayfalar)];
    }

    public static function seoKayitlariniNesneyeDonustur(array $satirlar): array
    {
        $sayfalar = [];
        foreach ($satirlar as $satir) {
            // Dil ve rota birlikte anahtarlandığı için admin yeni dil eklediğinde mevcut Türkçe kayıtlarla çakışmaz.
            $sayfalar[$satir['dil_kodu']][$satir['rota']] = $satir;
        }

        return $sayfalar;
    }

    public function siteHaritasiAdresleri(): array
    {
        $seoSayfalari = $this->baglanti->query(
            "SELECT rota AS yol, guncellenme_tarihi, degisim_sikligi, oncelik
             FROM seo_sayfalari
             WHERE aktif_mi = 1 AND site_haritasina_ekle = 1 AND robotlar NOT LIKE '%noindex%'"
        )->fetchAll();
        $kategoriler = $this->baglanti->query(
            "SELECT CONCAT('/kategoriler/', slug) AS yol, guncellenme_tarihi,
                    'weekly' AS degisim_sikligi, 0.8 AS oncelik
             FROM kategoriler WHERE aktif_mi = 1"
        )->fetchAll();
        $urunler = $this->baglanti->query(
            "SELECT CONCAT('/urunler/', slug) AS yol, guncellenme_tarihi,
                    'weekly' AS degisim_sikligi, 0.8 AS oncelik
             FROM urunler WHERE aktif_mi = 1"
        )->fetchAll();

        $adresler = [];
        foreach (array_merge($seoSayfalari, $kategoriler, $urunler) as $adres) {
            // Aynı canonical rota farklı kaynaklardan gelirse yalnız tek sitemap kaydı yayınlanır.
            $adresler[$adres['yol']] = $adres;
        }

        return array_values($adresler);
    }

    public function sayfaMetaVerisi(string $yol): array
    {
        $seo = $this->seoVerileri();
        $genel = $seo['genel'];
        $dil = $genel['site_varsayilan_dil'] ?? 'tr';
        $kayit = $seo['sayfalar'][$dil][$yol] ?? null;
        $dinamik = $kayit === null ? $this->dinamikSayfaBul($yol) : null;
        $mevcut = $kayit !== null || $dinamik !== null || $this->menuRotasiVarMi($yol);
        $siteAdi = $genel['site_adi'] ?? 'Demirvana';
        $anaAdres = rtrim($genel['site_ana_adresi'] ?? 'https://www.demirvana.com', '/');
        $dinamikBaslik = $dinamik['ad'] ?? null;
        $baslik = $kayit['seo_basligi'] ?? ($dinamikBaslik
            ? str_replace('%s', $dinamikBaslik, $genel['seo_baslik_sablonu'] ?? '%s | Demirvana')
            : ($mevcut ? ($genel['seo_varsayilan_baslik'] ?? $siteAdi) : "Sayfa bulunamadı | {$siteAdi}"));
        $aciklama = $kayit['meta_aciklama'] ?? $dinamik['aciklama'] ?? $genel['seo_varsayilan_aciklama'] ?? '';
        $canonicalYolu = $kayit['canonical_yolu'] ?? $yol;
        $canonicalYolu = str_starts_with($canonicalYolu, '/') ? $canonicalYolu : $yol;
        $canonical = $anaAdres . ($canonicalYolu === '/' ? '/' : $canonicalYolu);
        $gorselYolu = $kayit['sosyal_gorsel_yolu'] ?? $dinamik['gorsel_yolu'] ?? $genel['seo_varsayilan_gorsel'] ?? null;
        $sosyalGorsel = $gorselYolu
            ? (str_starts_with($gorselYolu, 'http') ? $gorselYolu : $anaAdres . '/' . ltrim($gorselYolu, '/'))
            : null;
        $tur = $kayit['yapilandirilmis_veri_turu'] ?? $dinamik['tur'] ?? 'WebPage';

        return [
            'baslik' => $baslik,
            'aciklama' => $aciklama,
            'canonical' => $canonical,
            'robotlar' => $mevcut ? ($kayit['robotlar'] ?? $genel['seo_varsayilan_robotlar'] ?? 'index, follow') : 'noindex, nofollow',
            'sosyal_baslik' => $kayit['sosyal_baslik'] ?? $baslik,
            'sosyal_aciklama' => $kayit['sosyal_aciklama'] ?? $aciklama,
            'sosyal_gorsel' => $sosyalGorsel,
            'google_site_dogrulama' => $genel['google_site_dogrulama'] ?? null,
            'bulunamadi' => !$mevcut,
            'yapilandirilmis_veri' => [
                '@context' => 'https://schema.org',
                '@type' => $tur,
                'name' => $dinamikBaslik ?? $baslik,
                'description' => $aciklama,
                'url' => $canonical,
                'inLanguage' => $dil,
            ],
        ];
    }

    private function dinamikSayfaBul(string $yol): ?array
    {
        if (preg_match('#^/kategoriler/([a-z0-9-]+)$#', $yol, $eslesme) === 1) {
            $sorgu = $this->baglanti->prepare(
                "SELECT ad, aciklama, gorsel_yolu, 'CollectionPage' AS tur FROM kategoriler WHERE slug = :slug AND aktif_mi = 1 LIMIT 1"
            );
            $sorgu->execute(['slug' => $eslesme[1]]);
            return $sorgu->fetch() ?: null;
        }
        if (preg_match('#^/urunler/([a-z0-9-]+)$#', $yol, $eslesme) === 1) {
            $sorgu = $this->baglanti->prepare(
                "SELECT u.ad, u.kisa_aciklama AS aciklama, ug.gorsel_yolu, 'Product' AS tur
                 FROM urunler u LEFT JOIN urun_gorselleri ug ON ug.urun_id = u.id AND ug.aktif_mi = 1
                 WHERE u.slug = :slug AND u.aktif_mi = 1 ORDER BY ug.siralama, ug.id LIMIT 1"
            );
            $sorgu->execute(['slug' => $eslesme[1]]);
            return $sorgu->fetch() ?: null;
        }
        return null;
    }

    private function menuRotasiVarMi(string $yol): bool
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT EXISTS(
                SELECT 1 FROM menu_ogeleri WHERE baglanti = :yol1 AND aktif_mi = 1
                UNION ALL
                SELECT 1 FROM menu_alt_ogeleri WHERE baglanti = :yol2 AND aktif_mi = 1
             ) AS mevcut'
        );
        $sorgu->execute(['yol1' => $yol, 'yol2' => $yol]);
        return (bool) $sorgu->fetchColumn();
    }
}
