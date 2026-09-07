<?php

declare(strict_types=1);

final class SeoDeposu
{
    public function __construct(private readonly PDO $baglanti)
    {
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
}
