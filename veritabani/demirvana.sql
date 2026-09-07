-- Demirvana başlangıç veritabanı şeması
-- phpMyAdmin, MySQL 8 ve MariaDB 10.6+ ile içe aktarılmak üzere hazırlanmıştır.

CREATE DATABASE IF NOT EXISTS `demirvana`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_turkish_ci;

USE `demirvana`;

-- Firma, logo ve iletişim gibi farklı türde genel değerler anahtar/değer biçiminde saklanır.
CREATE TABLE IF NOT EXISTS `site_ayarlari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `anahtar` VARCHAR(100) NOT NULL,
    `deger` TEXT NULL,
    `deger_turu` ENUM('metin', 'gorsel', 'baglanti', 'eposta', 'telefon', 'sayi') NOT NULL DEFAULT 'metin',
    `aciklama` VARCHAR(255) NULL,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_site_ayari` (`anahtar`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Her rota için ayrı SEO kaydı tutulur; admin aynı rota için gelecekte farklı dil kayıtları açabilir.
CREATE TABLE IF NOT EXISTS `seo_sayfalari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `rota` VARCHAR(255) NOT NULL,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `seo_basligi` VARCHAR(70) NOT NULL,
    `meta_aciklama` VARCHAR(180) NOT NULL,
    `anahtar_kelimeler` VARCHAR(500) NULL,
    `canonical_yolu` VARCHAR(255) NULL,
    `sosyal_baslik` VARCHAR(95) NULL,
    `sosyal_aciklama` VARCHAR(220) NULL,
    `sosyal_gorsel_yolu` VARCHAR(500) NULL,
    `robotlar` VARCHAR(100) NOT NULL DEFAULT 'index, follow, max-image-preview:large',
    `yapilandirilmis_veri_turu` VARCHAR(50) NOT NULL DEFAULT 'WebPage',
    `site_haritasina_ekle` TINYINT(1) NOT NULL DEFAULT 1,
    `degisim_sikligi` ENUM('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never') NOT NULL DEFAULT 'monthly',
    `oncelik` DECIMAL(2,1) NOT NULL DEFAULT 0.5,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_seo_rotasi_dili` (`rota`, `dil_kodu`),
    KEY `seo_site_haritasi` (`site_haritasina_ekle`, `aktif_mi`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- CSS özel değişkenlerine aktarılacak renkler ayrı tutulur; admin paneli kod değiştirmeden temayı yönetebilir.
CREATE TABLE IF NOT EXISTS `tema_ayarlari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `anahtar` VARCHAR(100) NOT NULL,
    `deger` VARCHAR(100) NOT NULL,
    `aciklama` VARCHAR(255) NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_tema_anahtari` (`anahtar`),
    KEY `tema_siralama` (`aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `menu_ogeleri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `baslik` VARCHAR(100) NOT NULL,
    `baglanti` VARCHAR(255) NOT NULL,
    `hedef` ENUM('_self', '_blank') NOT NULL DEFAULT '_self',
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_menu_baglantisi` (`baglanti`),
    KEY `menu_siralama` (`aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Alt menüler ayrı tabloda tutulur; böylece mevcut üst menü yapısı bozulmadan çok seviyeli menü yönetilebilir.
CREATE TABLE IF NOT EXISTS `menu_alt_ogeleri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `menu_ogesi_id` BIGINT UNSIGNED NOT NULL,
    `ust_alt_oge_id` BIGINT UNSIGNED NULL,
    `baslik` VARCHAR(120) NOT NULL,
    `baglanti` VARCHAR(255) NOT NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_alt_menu_baglantisi` (`baglanti`),
    KEY `alt_menu_siralama` (`menu_ogesi_id`, `ust_alt_oge_id`, `aktif_mi`, `siralama`),
    CONSTRAINT `alt_menunun_ust_menusu` FOREIGN KEY (`menu_ogesi_id`) REFERENCES `menu_ogeleri` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `alt_menunun_ust_alt_ogesi` FOREIGN KEY (`ust_alt_oge_id`) REFERENCES `menu_alt_ogeleri` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Görsel dosyanın kendisi burada tutulmaz; admin panelinin yöneteceği göreli dosya yolu saklanır.
CREATE TABLE IF NOT EXISTS `sliderlar` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `baslik` VARCHAR(180) NOT NULL,
    `aciklama` VARCHAR(500) NULL,
    `gorsel_yolu` VARCHAR(500) NOT NULL,
    `alternatif_metin` VARCHAR(255) NOT NULL,
    `buton_metni` VARCHAR(100) NULL,
    `buton_baglantisi` VARCHAR(255) NULL,
    `animasyon_turu` ENUM('kaydir', 'yaklas', 'metin-maske') NOT NULL DEFAULT 'kaydir',
    `odak_x` TINYINT UNSIGNED NOT NULL DEFAULT 50,
    `odak_y` TINYINT UNSIGNED NOT NULL DEFAULT 50,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_slider_gorseli` (`gorsel_yolu`),
    KEY `slider_siralama` (`aktif_mi`, `siralama`),
    CONSTRAINT `slider_odak_x_araligi` CHECK (`odak_x` BETWEEN 0 AND 100),
    CONSTRAINT `slider_odak_y_araligi` CHECK (`odak_y` BETWEEN 0 AND 100)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `kategoriler` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `aciklama` TEXT NULL,
    `gorsel_yolu` VARCHAR(500) NULL,
    `alternatif_metin` VARCHAR(255) NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_kategori_slug` (`slug`),
    KEY `kategori_siralama` (`aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `urunler` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kategori_id` BIGINT UNSIGNED NOT NULL,
    `ad` VARCHAR(180) NOT NULL,
    `slug` VARCHAR(200) NOT NULL,
    `kisa_aciklama` VARCHAR(500) NULL,
    `uzun_aciklama` LONGTEXT NULL,
    `teknik_bilgiler` LONGTEXT NULL COMMENT 'JSON biçimli teknik özellikler; MariaDB uyumluluğu için LONGTEXT tutulur.',
    `stok_kodu` VARCHAR(100) NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_urun_slug` (`slug`),
    UNIQUE KEY `benzersiz_stok_kodu` (`stok_kodu`),
    KEY `urun_kategori_siralama` (`kategori_id`, `aktif_mi`, `siralama`),
    CONSTRAINT `urun_kategorisi` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `urun_gorselleri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `urun_id` BIGINT UNSIGNED NOT NULL,
    `gorsel_yolu` VARCHAR(500) NOT NULL,
    `alternatif_metin` VARCHAR(255) NOT NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `urun_gorseli_siralama` (`urun_id`, `aktif_mi`, `siralama`),
    CONSTRAINT `gorselin_urunu` FOREIGN KEY (`urun_id`) REFERENCES `urunler` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Tamamlanan projeler ülke grubu, kurum ve yıl bilgisiyle ayrı kayıtlar hâlinde yönetilir.
CREATE TABLE IF NOT EXISTS `referanslar` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `baslik` VARCHAR(220) NOT NULL,
    `konum` VARCHAR(160) NOT NULL,
    `kurum` VARCHAR(220) NOT NULL,
    `yil` VARCHAR(20) NULL,
    `bolge` ENUM('yurtici', 'yurtdisi') NOT NULL DEFAULT 'yurtici',
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `referans_bolge_siralama` (`bolge`, `aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Galeri dosyaları kod içine gömülmez; kadraj koordinatları admin panelinin farklı oranlı görselleri yönetebilmesini sağlar.
CREATE TABLE IF NOT EXISTS `referans_gorselleri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `gorsel_yolu` VARCHAR(500) NOT NULL,
    `alternatif_metin` VARCHAR(255) NOT NULL,
    `odak_x` TINYINT UNSIGNED NOT NULL DEFAULT 50,
    `odak_y` TINYINT UNSIGNED NOT NULL DEFAULT 50,
    `gorsel_olcegi` SMALLINT UNSIGNED NOT NULL DEFAULT 100,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `referans_gorseli_siralama` (`aktif_mi`, `siralama`),
    CONSTRAINT `referans_gorseli_odak_x_araligi` CHECK (`odak_x` BETWEEN 0 AND 100),
    CONSTRAINT `referans_gorseli_odak_y_araligi` CHECK (`odak_y` BETWEEN 0 AND 100),
    CONSTRAINT `referans_gorseli_olcek_araligi` CHECK (`gorsel_olcegi` BETWEEN 100 AND 500)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Sektörler ayrı tutulur; admin paneli filtre adlarını ve sıralamasını referans kayıtlarına dokunmadan yönetebilir.
CREATE TABLE IF NOT EXISTS `referans_sektorleri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_referans_sektor_slug` (`slug`),
    KEY `referans_sektor_siralama` (`aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Eşleşme tablosu mevcut referans şemasını geriye dönük uyumlu tutarken sektörleri genişletilebilir kılar.
CREATE TABLE IF NOT EXISTS `referans_sektor_eslesmeleri` (
    `referans_id` BIGINT UNSIGNED NOT NULL,
    `sektor_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`referans_id`),
    KEY `referans_sektor_eslesmesi` (`sektor_id`, `referans_id`),
    CONSTRAINT `eslesmenin_referansi` FOREIGN KEY (`referans_id`) REFERENCES `referanslar` (`id`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT `eslesmenin_sektoru` FOREIGN KEY (`sektor_id`) REFERENCES `referans_sektorleri` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

INSERT INTO `site_ayarlari` (`anahtar`, `deger`, `deger_turu`, `aciklama`) VALUES
    ('site_adi', 'Demirvana', 'metin', 'Tarayıcı ve marka adı'),
    ('logo_yolu', '/assets/logo.png', 'gorsel', 'Navbar ve footer logo dosyası'),
    ('footer_aktif_mi', '1', 'sayi', 'Footer genel görünürlük durumu'),
    ('footer_marka_aktif_mi', '1', 'sayi', 'Footer marka sütunu görünürlük durumu'),
    ('footer_marka_sirasi', '1', 'sayi', 'Footer marka sütunu sırası'),
    ('footer_sirket_aciklamasi', 'Endüstriyel vana üretimi, mühendislik ve satış desteğini güvenilir çözümlerle buluşturuyoruz.', 'metin', 'Footer firma tanıtım metni'),
    ('footer_hizli_baglantilar_basligi', 'Hızlı Bağlantılar', 'metin', 'Footer menü sütunu başlığı'),
    ('footer_hizli_baglantilar_aktif_mi', '1', 'sayi', 'Footer menü sütunu görünürlük durumu'),
    ('footer_hizli_baglantilar_sirasi', '2', 'sayi', 'Footer menü sütunu sırası'),
    ('footer_urunler_basligi', 'Ürün Grupları', 'metin', 'Footer ürün sütunu başlığı'),
    ('footer_urunler_aktif_mi', '1', 'sayi', 'Footer ürün sütunu görünürlük durumu'),
    ('footer_urunler_sirasi', '3', 'sayi', 'Footer ürün sütunu sırası'),
    ('footer_destek_basligi', 'Destek & İletişim', 'metin', 'Footer iletişim sütunu başlığı'),
    ('footer_destek_aktif_mi', '1', 'sayi', 'Footer iletişim sütunu görünürlük durumu'),
    ('footer_destek_sirasi', '4', 'sayi', 'Footer iletişim sütunu sırası'),
    ('destek_telefonu', '+90 (212) 297 57 30', 'telefon', 'Destek telefon numarası'),
    ('destek_eposta', 'dv@demirvana.com', 'eposta', 'Destek e-posta adresi'),
    ('firma_adresi', 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi CA Blok No:3, 34490 İkitelli - İstanbul / Türkiye', 'metin', 'Firma açık adresi'),
    ('footer_iletisim_buton_metni', 'Bizimle iletişime geçin', 'metin', 'Footer iletişim düğmesi metni'),
    ('footer_iletisim_buton_baglantisi', '/iletisim', 'baglanti', 'Footer iletişim düğmesi bağlantısı'),
    ('footer_telif_metni', '© {yil} Demirvana. Tüm hakları saklıdır.', 'metin', 'Footer telif metni; {yil} otomatik değiştirilir'),
    ('referans_hero_yol_metni', 'Anasayfa / Referanslar', 'metin', 'Referans hero ekmek kırıntısı metni'),
    ('referans_hero_basligi', 'Güvenin Referansa Dönüştüğü Projeler', 'metin', 'Referans hero ana başlığı'),
    ('referans_hero_aciklamasi', 'Türkiye’de ve dünyada tamamladığımız seçkin projeler.', 'metin', 'Referans hero açıklaması'),
    ('referans_istatistik_proje_etiketi', 'Proje', 'metin', 'Referans toplam proje istatistiği etiketi'),
    ('referans_istatistik_konum_etiketi', 'Konum', 'metin', 'Referans konum istatistiği etiketi'),
    ('referans_istatistik_sektor_etiketi', 'Sektör', 'metin', 'Referans sektör istatistiği etiketi'),
    ('referans_istatistik_yil_etiketi', 'Yıl aralığı', 'metin', 'Referans yıl aralığı istatistiği etiketi'),
    ('referans_liste_etiketi', 'Projeler', 'metin', 'Referans liste üst etiketi'),
    ('referans_liste_basligi', 'Referanslarımız', 'metin', 'Referans liste başlığı'),
    ('referans_liste_aciklamasi', 'Sektörlere göre filtreleyerek projelerimizi inceleyebilirsiniz.', 'metin', 'Referans liste açıklaması'),
    ('referans_arama_yertutucusu', 'Kurum, şehir veya proje ara', 'metin', 'Referans arama alanı yer tutucusu'),
    ('referans_daha_fazla_metni', 'Daha Fazla Göster', 'metin', 'Referans ek kayıt düğmesi metni'),
    ('referans_yurtdisi_etiketi', 'Global projeler', 'metin', 'Yurtdışı referans bölümü üst etiketi'),
    ('referans_yurtdisi_basligi', 'Yurtdışı Referanslarımız', 'metin', 'Yurtdışı referans bölümü başlığı'),
    ('referans_yurtdisi_aciklamasi', 'Sınırları aşan kalite, dünyada da tercih ediliyor.', 'metin', 'Yurtdışı referans bölümü açıklaması'),
    ('referans_galeri_basligi', 'Sahadan görüntüler', 'metin', 'Referans galeri başlığı'),
    ('referans_galeri_aciklamasi', 'Ürünlerimizin tesis uygulamalarından seçilmiş kareler.', 'metin', 'Referans galeri açıklaması'),
    ('referans_detay_etiketi', 'Proje bilgileri', 'metin', 'Açılır referans kartı detay etiketi'),
    ('referans_detay_sablonu', '{kurum} tarafından {konum} konumunda gerçekleştirilen {sektor} projesi{yil}', 'metin', 'Referans detay cümlesi; kayıt alanları süslü parantezle yerleştirilir'),
    ('referans_sonuc_metni', '{sayi} referans gösteriliyor', 'metin', 'Gösterilen kayıt sayısı metni; {sayi} otomatik değiştirilir'),
    ('referans_bos_basligi', 'Aramanızla eşleşen bir referans bulunamadı.', 'metin', 'Referans filtresi boş sonuç başlığı'),
    ('referans_bos_aciklamasi', 'Arama kelimesini veya seçili sektörü değiştirebilirsiniz.', 'metin', 'Referans filtresi boş sonuç açıklaması'),
    ('referans_fotograf_sayisi_metni', '{sayi} fotoğraf', 'metin', 'Galeri fotoğraf sayısı metni; {sayi} otomatik değiştirilir')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `deger_turu` = VALUES(`deger_turu`);

INSERT INTO `site_ayarlari` (`anahtar`, `deger`, `deger_turu`, `aciklama`) VALUES
    ('site_ana_adresi', 'https://www.demirvana.com', 'baglanti', 'Canonical ve sitemap için ana site adresi'),
    ('site_varsayilan_dil', 'tr', 'metin', 'HTML ve SEO varsayılan dil kodu'),
    ('seo_varsayilan_baslik', 'Demirvana | Endüstriyel Vana Çözümleri', 'metin', 'Sayfa kaydı yoksa kullanılacak SEO başlığı'),
    ('seo_baslik_sablonu', '%s | Demirvana', 'metin', 'Dinamik sayfa başlık şablonu'),
    ('seo_varsayilan_aciklama', 'Endüstriyel vana üretimi, mühendislik ve satış desteği için Demirvana ürün ve çözümlerini inceleyin.', 'metin', 'Varsayılan meta açıklama'),
    ('seo_varsayilan_gorsel', '/assets/logo.png', 'gorsel', 'Varsayılan sosyal paylaşım görseli'),
    ('seo_varsayilan_robotlar', 'index, follow, max-image-preview:large', 'metin', 'Varsayılan arama motoru robot yönergesi'),
    ('seo_robots_kurallari', 'User-agent: *\nAllow: /\nDisallow: /api/', 'metin', 'robots.txt içinde sitemap satırından önce yayınlanacak kurallar'),
    ('seo_organizasyon_turu', 'Organization', 'metin', 'Schema.org organizasyon türü'),
    ('google_site_dogrulama', '', 'metin', 'Google Search Console doğrulama kodu')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `deger_turu` = VALUES(`deger_turu`);

INSERT INTO `seo_sayfalari`
    (`rota`, `dil_kodu`, `seo_basligi`, `meta_aciklama`, `anahtar_kelimeler`, `canonical_yolu`, `sosyal_baslik`, `sosyal_aciklama`, `yapilandirilmis_veri_turu`, `degisim_sikligi`, `oncelik`, `siralama`)
VALUES
    ('/', 'tr', 'Demirvana | Endüstriyel Vana Çözümleri', 'Endüstriyel vana üretimi, mühendislik ve satış desteği için Demirvana ürün ve çözümlerini inceleyin.', 'endüstriyel vana, vana üreticisi, vana çözümleri', '/', 'Demirvana Endüstriyel Vana Çözümleri', 'Üretimden sahaya güvenilir vana ve akış kontrol çözümleri.', 'WebSite', 'weekly', 1.0, 1),
    ('/kurumsal', 'tr', 'Kurumsal | Demirvana', 'Demirvana üretim yaklaşımı, mühendislik deneyimi ve kurumsal değerleri hakkında bilgi alın.', 'Demirvana kurumsal, vana üreticisi', '/kurumsal', NULL, NULL, 'AboutPage', 'yearly', 0.7, 2),
    ('/urunler', 'tr', 'Endüstriyel Vana Ürünleri | Demirvana', 'Küresel, kelebek, sürgülü, kontrol vanaları ve diğer endüstriyel vana gruplarını inceleyin.', 'vana çeşitleri, endüstriyel vanalar, kontrol vanaları', '/urunler', NULL, NULL, 'CollectionPage', 'weekly', 0.9, 3),
    ('/teknik', 'tr', 'Teknik Bilgiler | Demirvana', 'Endüstriyel vana seçimi ve uygulamaları için Demirvana teknik kaynaklarını inceleyin.', 'vana teknik bilgi, vana seçimi', '/teknik', NULL, NULL, 'WebPage', 'monthly', 0.6, 4),
    ('/referanslar', 'tr', 'Proje Referansları | Demirvana', 'Su, atıksu, enerji, madencilik ve sanayi projelerindeki Demirvana referanslarını inceleyin.', 'vana projeleri, endüstriyel referanslar', '/referanslar', NULL, NULL, 'CollectionPage', 'monthly', 0.7, 5),
    ('/sertifikalar', 'tr', 'Sertifikalar | Demirvana', 'Demirvana kalite ve üretim standartlarını belgeleyen sertifikaları inceleyin.', 'vana sertifikaları, kalite belgeleri', '/sertifikalar', NULL, NULL, 'WebPage', 'yearly', 0.5, 6),
    ('/iletisim', 'tr', 'İletişim ve Destek | Demirvana', 'Ürün seçimi, teknik destek ve teklif talepleriniz için Demirvana ile iletişime geçin.', 'Demirvana iletişim, vana teklifi, teknik destek', '/iletisim', NULL, NULL, 'ContactPage', 'yearly', 0.8, 7)
ON DUPLICATE KEY UPDATE
    `seo_basligi` = VALUES(`seo_basligi`),
    `meta_aciklama` = VALUES(`meta_aciklama`),
    `anahtar_kelimeler` = VALUES(`anahtar_kelimeler`),
    `canonical_yolu` = VALUES(`canonical_yolu`),
    `yapilandirilmis_veri_turu` = VALUES(`yapilandirilmis_veri_turu`),
    `degisim_sikligi` = VALUES(`degisim_sikligi`),
    `oncelik` = VALUES(`oncelik`),
    `siralama` = VALUES(`siralama`);

INSERT INTO `tema_ayarlari` (`anahtar`, `deger`, `aciklama`, `siralama`) VALUES
    ('ana_mavi', '#28469D', 'Ana marka ve etkileşim rengi', 1),
    ('koyu_mavi', '#17306F', 'Koyu yüzey ve güçlü metin rengi', 2),
    ('acik_mavi', '#EAF1FF', 'Açık yüzey rengi', 3),
    ('beyaz', '#FFFFFF', 'Ana arka plan rengi', 4),
    ('metin', '#172033', 'Gövde metni rengi', 5),
    ('ikincil_metin', '#62708A', 'İkincil açıklama rengi', 6)
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `aciklama` = VALUES(`aciklama`), `siralama` = VALUES(`siralama`);

-- Önceki ilk sürüm adresleri korunarak yeni menü adlarına taşınır; tekrar içe aktarmada çoğalma oluşmaz.
UPDATE `menu_ogeleri` SET `baslik` = 'Kurumsal', `baglanti` = '/kurumsal', `siralama` = 2
WHERE `baglanti` = '/hakkimizda';
UPDATE `menu_ogeleri` SET `baslik` = 'Teknik', `baglanti` = '/teknik', `siralama` = 4
WHERE `baglanti` = '/uretim';

INSERT INTO `menu_ogeleri` (`baslik`, `baglanti`, `siralama`) VALUES
    ('Anasayfa', '/', 1),
    ('Kurumsal', '/kurumsal', 2),
    ('Ürünler', '/urunler', 3),
    ('Teknik', '/teknik', 4),
    ('Referanslar', '/referanslar', 5),
    ('Sertifikalar', '/sertifikalar', 6),
    ('İletişim', '/iletisim', 7)
ON DUPLICATE KEY UPDATE `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`);

INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Vana', '/urunler/vana', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Aktüatör', '/urunler/aktuator', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Otomasyon', '/urunler/otomasyon', 3),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Temsilcilikler', '/urunler/temsilcilikler', 4)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

-- Aktüatör ürün ailesi, Vana grubu gibi aynı yönetilebilir üçüncü seviye menü yapısını kullanır.
INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Elektrik Aktüatörler', '/urunler/elektrik-aktuatorler', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Pnömatik Aktüatör', '/urunler/pnomatik-aktuator', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Aktüatörlü Vanalar', '/urunler/aktuatorlu-vanalar', 3),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Aksesuarlar', '/urunler/aktuator-aksesuarlari', 4)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Yangın Vanaları', '/urunler/yangin-vanalari', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Su Grubu Vanaları', '/urunler/su-grubu-vanalari', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Buhar Grubu Vanaları', '/urunler/buhar-grubu-vanalari', 3),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Kontrol Vanaları', '/urunler/kontrol-vanalari', 4),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Hidrolik Vanalar', '/urunler/hidrolik-vanalar', 5),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Basınç Düşürücü Vanalar', '/urunler/basinc-dusurucu-vanalar', 6),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Paslanmaz Vanalar', '/urunler/paslanmaz-vanalar', 7),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Gemi Vanaları', '/urunler/gemi-vanalari', 8),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Balans Vanaları', '/urunler/balans-vanalari', 9),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Solenoid Patlaç Pistonlu', '/urunler/solenoid-patlac-pistonlu', 10),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Kompansatörler', '/urunler/kompansatorler', 11),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Bağlantı Parçaları', '/urunler/baglanti-parcalari', 12)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `sliderlar`
    (`baslik`, `aciklama`, `gorsel_yolu`, `alternatif_metin`, `buton_metni`, `buton_baglantisi`, `animasyon_turu`, `odak_x`, `odak_y`, `siralama`)
VALUES
    ('Endüstriyel akışta güvenilir kontrol', 'Üretim hatlarına uygun vana çözümleri.', '/assets/carousel/1.png', 'Demirvana endüstriyel vana çözümü 1', 'Ürünleri incele', '/urunler', 'kaydir', 50, 50, 1),
    ('Her bağlantıda ölçülü mühendislik', 'Projenizin basınç ve akış gereksinimlerine uygun seçim.', '/assets/carousel/2.png', 'Demirvana endüstriyel vana çözümü 2', 'Bizimle iletişime geçin', '/iletisim', 'yaklas', 50, 50, 2),
    ('Üretimden sahaya kesintisiz çözüm', 'Dayanıklı ürünler, açık teknik bilgi ve güçlü destek.', '/assets/carousel/3.png', 'Demirvana endüstriyel vana çözümü 3', 'Ürünleri incele', '/urunler', 'metin-maske', 50, 50, 3),
    ('Zorlu çalışma koşullarına hazır', 'Endüstriyel tesisler için güvenilir vana teknolojileri.', '/assets/carousel/4.png', 'Demirvana endüstriyel vana çözümü 4', 'Bizimle iletişime geçin', '/iletisim', 'kaydir', 50, 50, 4),
    ('Doğru vana, kararlı sistem', 'Uygulamaya özel ürün seçeneklerini birlikte belirleyin.', '/assets/carousel/5.png', 'Demirvana endüstriyel vana çözümü 5', 'Ürünleri incele', '/urunler', 'yaklas', 50, 50, 5),
    ('Kaliteyi akışın merkezine koyuyoruz', 'Üretim deneyimini sürdürülebilir performansla buluşturuyoruz.', '/assets/carousel/6.png', 'Demirvana endüstriyel vana çözümü 6', 'Bizimle iletişime geçin', '/iletisim', 'metin-maske', 50, 50, 6)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`),
    `aciklama` = VALUES(`aciklama`),
    `alternatif_metin` = VALUES(`alternatif_metin`),
    `buton_metni` = VALUES(`buton_metni`),
    `buton_baglantisi` = VALUES(`buton_baglantisi`),
    `animasyon_turu` = VALUES(`animasyon_turu`),
    `siralama` = VALUES(`siralama`);

INSERT INTO `kategoriler` (`ad`, `slug`, `gorsel_yolu`, `alternatif_metin`, `siralama`) VALUES
    ('Küresel Vanalar', 'kuresel-vanalar', '/assets/urun-placeholder.svg', 'Küresel Vanalar ürün grubu', 1),
    ('Kelebek Vanalar', 'kelebek-vanalar', '/assets/urun-placeholder.svg', 'Kelebek Vanalar ürün grubu', 2),
    ('Sürgülü Vanalar', 'surgulu-vanalar', '/assets/urun-placeholder.svg', 'Sürgülü Vanalar ürün grubu', 3),
    ('Çekvalfler', 'cekvalfler', '/assets/urun-placeholder.svg', 'Çekvalfler ürün grubu', 4),
    ('Globe Vanalar', 'globe-vanalar', '/assets/urun-placeholder.svg', 'Globe Vanalar ürün grubu', 5),
    ('Pislik Tutucular', 'pislik-tutucular', '/assets/urun-placeholder.svg', 'Pislik Tutucular ürün grubu', 6),
    ('Kontrol Vanaları', 'kontrol-vanalari', '/assets/urun-placeholder.svg', 'Kontrol Vanaları ürün grubu', 7)
ON DUPLICATE KEY UPDATE `ad` = VALUES(`ad`), `siralama` = VALUES(`siralama`);

INSERT INTO `referanslar` (`id`, `baslik`, `konum`, `kurum`, `yil`, `bolge`, `siralama`) VALUES
    (1, 'Antalya Gazipaşa Atık Su Arıtma Tesisi Vanaları', 'Antalya / Gazipaşa', 'İller Bankası', '2011–2012', 'yurtici', 1),
    (2, 'Gönen Ovası Pompa Sulaması İnşaatı Vanaları', 'Balıkesir / Gönen', 'DSİ 25. Bölge · İlci İnşaat', '2012', 'yurtici', 2),
    (3, 'Belediye Su ve Kanalizasyon Müdürlüğü İş Bitirme Projesi', 'Isparta', 'Isparta Belediyesi', '2010', 'yurtici', 3),
    (4, 'Çermik İçme Suyu ve Paket Arıtma Tesisi Vanaları', 'Diyarbakır / Çermik', 'İller Bankası', '2013', 'yurtici', 4),
    (5, 'Dilovası Atıksu Arıtma Tesisi Vanaları', 'Kocaeli / Dilovası', 'İller Bankası', '2009', 'yurtici', 5),
    (6, 'Paşaköy–Tuzla Atıksu Arıtma Tesisi Vanaları', 'İstanbul', 'İSKİ · Kuzu Toplu Konut', NULL, 'yurtici', 6),
    (7, 'Eti Maden Tesisleri', 'Türkiye', 'Eti Maden', '2012', 'yurtici', 7),
    (8, 'Enerji Üretim Tesisleri', 'Türkiye', 'EÜAŞ', '2014', 'yurtici', 8),
    (9, 'Karabük Demir Çelik Tesisleri', 'Karabük', 'Kardemir Karabük Demir Çelik Sanayi ve Ticaret A.Ş.', NULL, 'yurtici', 9),
    (10, 'Endüstriyel Tesis Projeleri', 'Türkiye', 'Enka İnşaat ve Sanayi A.Ş.', NULL, 'yurtici', 10),
    (11, 'Petrol Üretim Tesisleri', 'Türkiye', 'Türkiye Petrolleri A.O.', NULL, 'yurtici', 11),
    (12, 'Afşin-Elbistan Termik Santrali', 'Kahramanmaraş', 'Afşin-Elbistan Termik Santrali İşletme Müdürlüğü', NULL, 'yurtici', 12),
    (13, 'Maden İşletme Tesisleri', 'Türkiye', 'Eti Maden İşletmeleri', NULL, 'yurtici', 13),
    (14, 'Krom Üretim Tesisleri', 'Elazığ', 'Eti Krom A.Ş.', NULL, 'yurtici', 14),
    (15, 'Elektrometalurji Tesisleri', 'Antalya', 'Eti Elektrometalurji A.Ş.', NULL, 'yurtici', 15),
    (16, 'Belediye Altyapı Projeleri', 'Kütahya', 'Kütahya Belediyesi', NULL, 'yurtici', 16),
    (17, 'Demir ve Çelik Fabrikaları', 'Zonguldak / Ereğli', 'Ereğli Demir ve Çelik Fab. T.A.Ş.', NULL, 'yurtici', 17),
    (18, 'Deri Sanayi Atık Su Arıtma Tesisi', 'İstanbul / Tuzla', 'Tuzla Dericiler Sanayi Sitesi', NULL, 'yurtici', 18),
    (19, 'Water Treatment Valves', 'Romanya', 'Sistem Yapı', '2008', 'yurtdisi', 19),
    (20, 'Hazal Seaport Valves', 'Azerbaycan', 'Hazal Seaport', '2014', 'yurtdisi', 20),
    (21, 'Water Administration', 'Gürcistan', 'Georgia Water Administration', '2014', 'yurtdisi', 21),
    (22, 'Water Administration', 'Ermenistan', 'Armenia Water Administration', '2010–2011', 'yurtdisi', 22)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `konum` = VALUES(`konum`), `kurum` = VALUES(`kurum`),
    `yil` = VALUES(`yil`), `bolge` = VALUES(`bolge`), `siralama` = VALUES(`siralama`);

INSERT INTO `referans_gorselleri`
    (`id`, `gorsel_yolu`, `alternatif_metin`, `odak_x`, `odak_y`, `gorsel_olcegi`, `siralama`)
VALUES
    (1, '/assets/referanslar/referans-galerisi.png', 'Arıtma tesisinde kullanılan mavi vana sistemi', 0, 100, 330, 1),
    (2, '/assets/referanslar/referans-galerisi.png', 'Arıtma havuzu üzerindeki vana uygulaması', 50, 100, 330, 2),
    (3, '/assets/referanslar/referans-galerisi.png', 'Saha kontrol panosu ve boru hattı uygulaması', 100, 100, 330, 3)
ON DUPLICATE KEY UPDATE
    `gorsel_yolu` = VALUES(`gorsel_yolu`), `alternatif_metin` = VALUES(`alternatif_metin`),
    `odak_x` = VALUES(`odak_x`), `odak_y` = VALUES(`odak_y`),
    `gorsel_olcegi` = VALUES(`gorsel_olcegi`), `siralama` = VALUES(`siralama`);

INSERT INTO `referans_sektorleri` (`id`, `ad`, `slug`, `siralama`) VALUES
    (1, 'Su ve Atıksu', 'su-ve-atiksu', 1),
    (2, 'Sulama', 'sulama', 2),
    (3, 'Enerji', 'enerji', 3),
    (4, 'Madencilik', 'madencilik', 4),
    (5, 'Sanayi', 'sanayi', 5),
    (6, 'Belediye', 'belediye', 6)
ON DUPLICATE KEY UPDATE `ad` = VALUES(`ad`), `slug` = VALUES(`slug`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `referans_sektor_eslesmeleri` (`referans_id`, `sektor_id`) VALUES
    (1, 1), (2, 2), (3, 6), (4, 1), (5, 1), (6, 1),
    (7, 4), (8, 3), (9, 5), (10, 5), (11, 5), (12, 3),
    (13, 4), (14, 4), (15, 4), (16, 6), (17, 5), (18, 6),
    (19, 1), (20, 5), (21, 1), (22, 1)
ON DUPLICATE KEY UPDATE `sektor_id` = VALUES(`sektor_id`);
