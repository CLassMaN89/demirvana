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

-- Ziyaretçi talepleri ilerideki admin panelinde durum ve tarih bilgisiyle yönetilir.
CREATE TABLE IF NOT EXISTS `iletisim_mesajlari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ad_soyad` VARCHAR(120) NOT NULL,
    `eposta` VARCHAR(180) NOT NULL,
    `telefon` VARCHAR(40) NOT NULL,
    `firma` VARCHAR(180) NULL,
    `mesaj` TEXT NOT NULL,
    `durum` ENUM('yeni', 'okundu', 'yanitlandi', 'arsivlendi') NOT NULL DEFAULT 'yeni',
    `veri_onayi_tarihi` TIMESTAMP NOT NULL,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `iletisim_mesaji_durumu` (`durum`, `olusturulma_tarihi`),
    KEY `iletisim_mesaji_epostasi` (`eposta`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Banka bilgileri finansal hata riskini azaltmak için her para birimi ve görünürlük durumuyla ayrı yönetilir.
CREATE TABLE IF NOT EXISTS `banka_hesaplari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `banka_adi` VARCHAR(120) NOT NULL,
    `hesap_basligi` VARCHAR(160) NOT NULL,
    `para_birimi` ENUM('TRY', 'USD', 'EUR') NOT NULL,
    `iban` VARCHAR(40) NOT NULL,
    `swift_kodu` VARCHAR(20) NULL,
    `sube` VARCHAR(140) NOT NULL,
    `hesap_no` VARCHAR(40) NOT NULL,
    `logo_yolu` VARCHAR(500) NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_banka_para_birimi` (`banka_adi`, `para_birimi`),
    KEY `banka_hesabi_siralama` (`aktif_mi`, `siralama`)
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

-- Fuar görselleri dosya yoluyla saklanır; sıra, görünürlük ve alternatif metin admin panelinden yönetilebilir.
CREATE TABLE IF NOT EXISTS `fuar_gorselleri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `gorsel_yolu` VARCHAR(500) NOT NULL,
    `alternatif_metin` VARCHAR(255) NOT NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_fuar_gorseli` (`gorsel_yolu`),
    KEY `fuar_gorseli_siralama` (`aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Temsil edilen markaların kart içerikleri, etiketleri ve bağlantıları admin panelinden ayrı ayrı yönetilir.
CREATE TABLE IF NOT EXISTS `temsilcilikler` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `marka_adi` VARCHAR(120) NOT NULL,
    `urun_grubu` VARCHAR(160) NOT NULL,
    `baslik` VARCHAR(180) NOT NULL,
    `aciklama` TEXT NOT NULL,
    `etiketler` VARCHAR(500) NULL COMMENT 'Virgülle ayrılmış kısa ürün etiketleri.',
    `logo_yolu` VARCHAR(500) NULL,
    `logo_alternatif_metin` VARCHAR(255) NULL,
    `logo_alt_metni` VARCHAR(180) NULL,
    `urun_buton_metni` VARCHAR(100) NOT NULL DEFAULT 'Marka ürünleri',
    `urun_baglantisi` VARCHAR(500) NOT NULL DEFAULT '/urunler',
    `katalog_buton_metni` VARCHAR(100) NULL,
    `katalog_baglantisi` VARCHAR(500) NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_temsilcilik_dili_markasi` (`dil_kodu`, `marka_adi`),
    KEY `temsilcilik_siralama` (`dil_kodu`, `aktif_mi`, `siralama`)
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

-- Teknik doküman grupları ayrı tutulur; admin paneli başlık, açıklama, ikon ve sıralamayı kod değiştirmeden yönetebilir.
CREATE TABLE IF NOT EXISTS `teknik_dokuman_kategorileri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `ad` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `aciklama` VARCHAR(500) NULL,
    `ikon_adi` VARCHAR(80) NOT NULL DEFAULT 'dosya-metin',
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_teknik_kategori_dili_slug` (`dil_kodu`, `slug`),
    KEY `teknik_kategori_siralama` (`dil_kodu`, `aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- PDF dosyasının kendisi dosya sisteminde, yönetilebilir açıklama ve güvenli göreli yolu veritabanında tutulur.
CREATE TABLE IF NOT EXISTS `teknik_dokumanlar` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kategori_id` BIGINT UNSIGNED NOT NULL,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `baslik` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `dosya_yolu` VARCHAR(500) NOT NULL,
    `orijinal_dosya_adi` VARCHAR(255) NOT NULL,
    `alternatif_aciklama` VARCHAR(500) NULL,
    `mime_turu` VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    `dosya_boyutu` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `sayfa_sayisi` INT UNSIGNED NOT NULL DEFAULT 0,
    `indirmeye_izin_var_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `yeni_sekmede_acmaya_izin_var_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_teknik_dokuman_dili_slug` (`dil_kodu`, `slug`),
    KEY `teknik_dokuman_siralama` (`kategori_id`, `dil_kodu`, `aktif_mi`, `siralama`),
    CONSTRAINT `teknik_dokuman_kategorisi` FOREIGN KEY (`kategori_id`) REFERENCES `teknik_dokuman_kategorileri` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `teknik_dokuman_boyutu_negatif_olamaz` CHECK (`dosya_boyutu` >= 0),
    CONSTRAINT `teknik_dokuman_sayfa_sayisi_negatif_olamaz` CHECK (`sayfa_sayisi` >= 0)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Sertifika filtreleri ayrı tabloda tutulur; admin yeni belge türlerini kod değişmeden ekleyebilir.
CREATE TABLE IF NOT EXISTS `sertifika_kategorileri` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `ad` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(140) NOT NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_sertifika_kategorisi_dili_slug` (`dil_kodu`, `slug`),
    KEY `sertifika_kategorisi_siralama` (`dil_kodu`, `aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Fiziksel PDF konumu yalnız sunucuda çözülür; istemci güvenli slug ve hafif önizleme yolunu kullanır.
CREATE TABLE IF NOT EXISTS `sertifikalar` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `kategori_id` BIGINT UNSIGNED NOT NULL,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `baslik` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `aciklama` VARCHAR(500) NULL,
    `dosya_yolu` VARCHAR(500) NOT NULL,
    `orijinal_dosya_adi` VARCHAR(255) NOT NULL,
    `onizleme_yolu` VARCHAR(500) NULL,
    `alternatif_metin` VARCHAR(300) NULL,
    `mime_turu` VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    `dosya_boyutu` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `sayfa_sayisi` INT UNSIGNED NOT NULL DEFAULT 1,
    `indirmeye_izin_var_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `yeni_sekmede_acmaya_izin_var_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_sertifika_dili_slug` (`dil_kodu`, `slug`),
    KEY `sertifika_siralama` (`kategori_id`, `dil_kodu`, `aktif_mi`, `siralama`),
    CONSTRAINT `sertifikanin_kategorisi` FOREIGN KEY (`kategori_id`) REFERENCES `sertifika_kategorileri` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT `sertifika_boyutu_negatif_olamaz` CHECK (`dosya_boyutu` >= 0),
    CONSTRAINT `sertifika_sayfa_sayisi_pozitif_olmali` CHECK (`sayfa_sayisi` > 0)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Kurumsal değerler ayrı satırlardır; admin başlık, açıklama, dil, görünürlük ve sıralamayı bağımsız yönetebilir.
CREATE TABLE IF NOT EXISTS `kurumsal_degerler` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `baslik` VARCHAR(120) NOT NULL,
    `aciklama` VARCHAR(500) NOT NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_kurumsal_deger_dili_basligi` (`dil_kodu`, `baslik`),
    KEY `kurumsal_deger_siralama` (`dil_kodu`, `aktif_mi`, `siralama`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Sütun numarası yalnız görsel gruplamayı belirtir; ürün adlarının tamamı yönetilebilir veri olarak kalır.
CREATE TABLE IF NOT EXISTS `kurumsal_urun_gruplari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `ad` VARCHAR(160) NOT NULL,
    `sutun_no` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_kurumsal_urun_dili_adi` (`dil_kodu`, `ad`),
    KEY `kurumsal_urun_siralama` (`dil_kodu`, `aktif_mi`, `sutun_no`, `siralama`),
    CONSTRAINT `kurumsal_urun_sutun_araligi` CHECK (`sutun_no` BETWEEN 1 AND 3)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- Ekip iletişimi kaynak koda gömülmez; gelecekte admin üzerinden kişi ekleme ve sıralama yapılabilir.
CREATE TABLE IF NOT EXISTS `kurumsal_ekip` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dil_kodu` VARCHAR(10) NOT NULL DEFAULT 'tr',
    `ad_soyad` VARCHAR(160) NOT NULL,
    `gorev` VARCHAR(160) NOT NULL,
    `eposta` VARCHAR(190) NOT NULL,
    `telefon` VARCHAR(40) NULL,
    `siralama` INT UNSIGNED NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    `olusturulma_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `guncellenme_tarihi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `benzersiz_kurumsal_ekip_dili_epostasi` (`dil_kodu`, `eposta`),
    KEY `kurumsal_ekip_siralama` (`dil_kodu`, `aktif_mi`, `siralama`)
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
    ('iletisim_harita_adresi', 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi CA Blok No:3, 34490 İkitelli - İstanbul / Türkiye', 'metin', 'Google Harita üzerinde aranacak firma konumu'),
    ('iletisim_harita_embed_adresi', 'https://www.google.com/maps/d/embed?mid=1R6ztHB_hDzoxh7P4hUMhGTVWJms', 'baglanti', 'Demirvana resmî Google My Maps gömme adresi'),
    ('iletisim_harita_kart_basligi', 'Bizi Ziyaret Edin', 'metin', 'Harita üzerindeki bilgi kartı başlığı'),
    ('iletisim_harita_kart_aciklamasi', 'İkitelli OSB’deki merkezimizde sizleri ağırlamaktan memnuniyet duyarız.', 'metin', 'Harita üzerindeki bilgi kartı açıklaması'),
    ('iletisim_arkaplan_rengi', '#91aec4', 'renk', 'İletişim sayfası ve dünya alanının ortak gökyüzü arka plan rengi'),
    ('iletisim_arkaplan_ust_rengi', '#ffffff', 'renk', 'İletişim sayfası gradient başlangıç rengi'),
    ('iletisim_etiketi', 'Demirvana', 'metin', 'İletişim sayfası üst etiketi'),
    ('iletisim_basligi', 'İletişim', 'metin', 'İletişim sayfası ana başlığı'),
    ('iletisim_aciklamasi', 'Sorularınız, talepleriniz veya iş birliği fırsatları için bizimle iletişime geçebilirsiniz. Ekibimiz size en kısa sürede dönüş yapacaktır.', 'metin', 'İletişim sayfası açıklaması'),
    ('iletisim_whatsapp', '+90 (555) 978 18 00', 'telefon', 'WhatsApp iletişim numarası'),
    ('iletisim_faks', '+90 (212) 297 57 33', 'telefon', 'Faks numarası'),
    ('iletisim_insan_kaynaklari_basligi', 'İnsan kaynakları başvuru formu', 'metin', 'İnsan kaynakları kısayol başlığı'),
    ('iletisim_insan_kaynaklari_aciklamasi', 'Aramıza katılmak için başvurun.', 'metin', 'İnsan kaynakları kısayol açıklaması'),
    ('iletisim_mail_order_basligi', 'Mail Order Formu', 'metin', 'Mail order kısayol başlığı'),
    ('iletisim_mail_order_aciklamasi', 'Talep formu için iletişime geçin.', 'metin', 'Mail order kısayol açıklaması'),
    ('iletisim_hesap_kisayol_basligi', 'Hesap Numaralarımız', 'metin', 'Banka hesapları kısayol başlığı'),
    ('iletisim_hesap_kisayol_aciklamasi', 'Banka hesap bilgilerimizi görüntüleyin.', 'metin', 'Banka hesapları kısayol açıklaması'),
    ('iletisim_form_basligi', 'Bize Mesaj Gönderin', 'metin', 'İletişim formu başlığı'),
    ('iletisim_form_aciklamasi', 'Taleplerinizi, sorularınızı veya iş birliği önerilerinizi form aracılığıyla bize iletebilirsiniz.', 'metin', 'İletişim formu açıklaması'),
    ('iletisim_form_slogani', 'Sanayide güvenilir çözüm ortağınız', 'metin', 'İletişim formu üst panel sloganı'),
    ('iletisim_hesap_etiketi', 'Demirvana', 'metin', 'Hesap bilgileri alanı etiketi'),
    ('iletisim_hesap_basligi', 'Hesap numaraları', 'metin', 'Hesap bilgileri alanı başlığı'),
    ('iletisim_hesap_slogani', 'Güvenilir iş ortağınız', 'metin', 'Hesap bilgileri alanı sağ sloganı'),
    ('iletisim_hesap_guvenlik_notu', 'Güncel banka ve ödeme bilgileri için muhasebe birimimizle iletişime geçin. Ödeme öncesinde hesap bilgilerini mutlaka telefonla doğrulayın.', 'metin', 'Hesap bilgileri güvenlik açıklaması'),
    ('iletisim_dunya_aktif_mi', '1', 'sayi', 'İletişim sayfası etkileşimli dünya alanının görünürlük durumu'),
    ('iletisim_dunya_basligi', 'Dünyaya güvenilir akış çözümleri', 'metin', 'Etkileşimli dünya alanı başlığı'),
    ('iletisim_dunya_aciklamasi', 'Endüstriyel akış kontrolündeki deneyimimizi dünyanın farklı noktalarındaki iş ortaklarımızla buluşturuyoruz.', 'metin', 'Etkileşimli dünya alanı açıklaması'),
    ('footer_iletisim_buton_metni', 'Bizimle iletişime geçin', 'metin', 'Footer iletişim düğmesi metni'),
    ('footer_iletisim_buton_baglantisi', '/iletisim', 'baglanti', 'Footer iletişim düğmesi bağlantısı'),
    ('footer_teknik_cizim_yolu', '/assets/footer-vana2.png', 'gorsel', 'Footer ana teknik vana çizimi yolu'),
    ('footer_teknik_cizim_ikincil_yolu', '/assets/footer-vana.png', 'gorsel', 'Footer ikincil teknik vana çizimi yolu'),
    ('footer_teknik_cizim_detay_yolu', '/assets/footer-vana3.png', 'gorsel', 'Footer teknik vana detay çizimi yolu'),
    ('footer_ikon_dizini', '/assets/footer-icons', 'gorsel', 'Footer şeffaf ikon dosyaları dizini'),
    ('footer_calisma_saatleri', 'Pzt - Cum 08:00 - 18:00', 'metin', 'Footer çalışma saatleri'),
    ('footer_sosyal_basligi', 'Bizi takip edin', 'metin', 'Footer sosyal medya başlığı'),
    ('footer_linkedin_baglantisi', 'https://www.linkedin.com', 'baglanti', 'Footer LinkedIn bağlantısı'),
    ('footer_youtube_baglantisi', 'https://www.youtube.com', 'baglanti', 'Footer YouTube bağlantısı'),
    ('footer_instagram_baglantisi', 'https://www.instagram.com', 'baglanti', 'Footer Instagram bağlantısı'),
    ('footer_slogan_metni', 'Endüstrinin her noktasında, daha güvenli bir akış için.', 'metin', 'Footer alt şerit sloganı'),
    ('footer_telif_metni', '© {yil} Demirvana. Tüm hakları saklıdır.', 'metin', 'Footer telif metni; {yil} otomatik değiştirilir'),
    ('kategori_kart_varsayilan_alt_metni', 'Endüstriyel vana çözümleri', 'metin', 'Açıklaması olmayan ana sayfa kategori kartının alt metni'),
    ('kategori_tum_urunler_alt_metni', 'Ürün kataloğu', 'metin', 'Ana sayfa Tüm Ürünler kartının alt metni'),
    ('kategori_bolumu_aktif_mi', '0', 'sayi', 'Ana sayfa Ürün Kategorilerimiz bölümünün görünürlük durumu; 1 değeri bölümü yeniden açar'),
    ('fuarlar_aktif_mi', '1', 'sayi', 'Ana sayfa Fuarlar bölümünün görünürlük durumu'),
    ('fuarlar_etiketi', 'SEKTÖREL BULUŞMALAR', 'metin', 'Fuarlar bölümü üst etiketi'),
    ('fuarlar_basligi', 'Fuarlar', 'metin', 'Fuarlar bölümü ana başlığı'),
    ('fuarlar_aciklamasi', 'Sektör profesyonelleriyle buluştuğumuz fuarlardan ve ürün tanıtımlarımızdan kareler.', 'metin', 'Fuarlar bölümü açıklaması'),
    ('fuarlar_buton_metni', 'Fuar programı için iletişime geçin', 'metin', 'Fuarlar bölümü buton metni'),
    ('fuarlar_buton_baglantisi', '/iletisim', 'baglanti', 'Fuarlar bölümü buton bağlantısı'),
    ('temsilcilik_hero_basligi', 'Temsilcilikler', 'metin', 'Temsilcilikler sayfası ana başlığı'),
    ('temsilcilik_hero_aciklamasi', 'Dünya çapında kalite ve güvenilirliğiyle öne çıkan markaların Türkiye temsilciliğini yapıyoruz. Endüstriyel vana, enstrümantasyon ve aktüatör alanlarında iş ortaklarımızla birlikte doğru çözümler sunuyoruz.', 'metin', 'Temsilcilikler sayfası giriş açıklaması'),
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
    ('teknik_hero_basligi', 'Teknik', 'metin', 'Teknik sayfası ana başlığı'),
    ('teknik_hero_aciklamasi', 'Ürünlerimize ait teknik tabloları ve kullanım talimatlarını buradan inceleyebilirsiniz.', 'metin', 'Teknik sayfası giriş açıklaması'),
    ('teknik_slogan_satir_1', 'Güvenli Akış', 'metin', 'Teknik hero sağ sloganının ilk satırı'),
    ('teknik_slogan_satir_2', 'Daha Güçlü Yarınlar', 'metin', 'Teknik hero sağ sloganının ikinci satırı'),
    ('teknik_pdf_goruntule_metni', 'PDF Görüntüle', 'metin', 'Doküman satırı eylem metni'),
    ('teknik_bos_kategori_metni', 'Bu kategoride henüz doküman bulunmuyor.', 'metin', 'Boş doküman kategorisi açıklaması'),
    ('teknik_pdf_yukleniyor_metni', 'PDF yükleniyor…', 'metin', 'PDF yükleme durumu metni'),
    ('teknik_pdf_hata_basligi', 'PDF görüntülenemedi', 'metin', 'PDF yükleme hatası başlığı'),
    ('teknik_pdf_hata_aciklamasi', 'Doküman şu anda açılamıyor. Lütfen daha sonra tekrar deneyin.', 'metin', 'PDF yükleme hatası açıklaması'),
    ('teknik_pdf_indir_metni', 'İndir', 'metin', 'PDF indirme bağlantısı metni'),
    ('teknik_pdf_yeni_sekme_metni', 'Yeni sekmede aç', 'metin', 'PDF yeni sekme bağlantısı metni'),
    ('teknik_pdf_kapat_etiketi', 'PDF görüntüleyiciyi kapat', 'metin', 'PDF kapatma düğmesi erişilebilir etiketi'),
    ('teknik_pdf_ikon_yolu', '/assets/ikonlar/pdf-ikonu-karti.png', 'gorsel', 'Teknik doküman listelerinde kullanılan şeffaf PDF ikonu'),
    ('teknik_baslik_gecis_suresi', '2600', 'sayi', 'Teknik hero dönen başlığının milisaniye cinsinden bekleme süresi')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `deger_turu` = VALUES(`deger_turu`), `aciklama` = VALUES(`aciklama`);

INSERT INTO `site_ayarlari` (`anahtar`, `deger`, `deger_turu`, `aciklama`) VALUES
    ('sertifika_hero_basligi', 'Sertifikalar', 'metin', 'Sertifika sayfası ana başlığı'),
    ('sertifika_hero_aciklamasi', 'Kaliteli üretim, güvenilir çözümler. Ulusal ve uluslararası geçerliliğe sahip sertifikalarımızla standartlara bağlılığımızı belgeliyoruz.', 'metin', 'Sertifika sayfası giriş açıklaması'),
    ('sertifika_slogan_satir_1', 'Güven', 'metin', 'Sertifika hero sloganının ilk satırı'),
    ('sertifika_slogan_satir_2', 'Kalite', 'metin', 'Sertifika hero sloganının ikinci satırı'),
    ('sertifika_slogan_satir_3', 'Sürdürülebilirlik', 'metin', 'Sertifika hero sloganının üçüncü satırı'),
    ('sertifika_kutuphane_basligi', 'Sertifika Kütüphanesi', 'metin', 'Sertifika liste paneli başlığı'),
    ('sertifika_arama_yertutucusu', 'Sertifika ara...', 'metin', 'Sertifika arama alanı yer tutucusu'),
    ('sertifika_tumu_metni', 'Tümü', 'metin', 'Bütün sertifikaları gösteren filtre metni'),
    ('sertifika_bos_metni', 'Aramanızla eşleşen bir sertifika bulunamadı.', 'metin', 'Boş sertifika arama sonucu'),
    ('sertifika_pdf_ac_metni', 'PDF Aç', 'metin', 'Sertifikayı yeni sekmede açma düğmesi'),
    ('sertifika_pdf_indir_metni', 'İndir', 'metin', 'Sertifikayı indirme düğmesi'),
    ('sertifika_pdf_yukleniyor_metni', 'Sertifika yükleniyor…', 'metin', 'Sertifika PDF yükleme durumu'),
    ('sertifika_pdf_hata_basligi', 'Sertifika görüntülenemedi', 'metin', 'Sertifika PDF yükleme hatası başlığı'),
    ('sertifika_pdf_hata_aciklamasi', 'Belge şu anda açılamıyor. Lütfen daha sonra tekrar deneyin.', 'metin', 'Sertifika PDF yükleme hatası açıklaması')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `deger_turu` = VALUES(`deger_turu`), `aciklama` = VALUES(`aciklama`);

INSERT INTO `site_ayarlari` (`anahtar`, `deger`, `deger_turu`, `aciklama`) VALUES
    ('kurumsal_etiket', 'Kurumsal', 'metin', 'Kurumsal sayfa üst etiketi'),
    ('kurumsal_baslik_satir_1', 'Güvenilir çözümler.', 'metin', 'Kurumsal ana başlığın ilk satırı'),
    ('kurumsal_baslik_satir_2', 'Sürdürülebilir iş ortaklıkları.', 'metin', 'Kurumsal ana başlığın vurgulu ikinci satırı'),
    ('kurumsal_giris_metni', '2007 yılında Demir Ticaret adıyla başlayan yolculuğumuz, 2008 yılından itibaren Demir Vana ve Kontrol Elemanları Makina Sanayi Tic. Ltd. Şti. olarak devam etmektedir. Endüstriyel vana ve akış kontrol çözümlerinde kalite, teknik bilgi ve müşteri odaklı hizmet anlayışımızla uzun vadeli iş ortaklıkları kuruyoruz.', 'metin', 'Kurumsal giriş açıklaması'),
    ('kurumsal_urunler_basligi', 'Ana Ürün Gruplarımız', 'metin', 'Kurumsal ürün grupları başlığı'),
    ('kurumsal_cozum_basligi', 'Projeye Özel Çözümler', 'metin', 'Kurumsal özel çözüm alanı başlığı'),
    ('kurumsal_cozum_aciklamasi', 'Özel vana ihtiyaçlarınız ve projeye özgü teknik talepleriniz için uzman mühendis kadromuzla birlikte çalışıyor, ihtiyacınıza uygun çözüm alternatifleri geliştiriyoruz.', 'metin', 'Kurumsal özel çözüm alanı açıklaması'),
    ('kurumsal_cozum_buton_metni', 'Teknik ekibimizle iletişime geçin', 'metin', 'Kurumsal özel çözüm düğmesi metni'),
    ('kurumsal_cozum_buton_baglantisi', '/iletisim', 'baglanti', 'Kurumsal özel çözüm düğmesi bağlantısı'),
    ('kurumsal_ekip_basligi', 'Ekibimiz', 'metin', 'Kurumsal ekip alanı başlığı'),
    ('kurumsal_ekip_aciklamasi', 'Doğru insanlarla, daha güçlü çözümler.', 'metin', 'Kurumsal ekip alanı açıklaması')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `deger_turu` = VALUES(`deger_turu`), `aciklama` = VALUES(`aciklama`);

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
    ('/temsilcilikler', 'tr', 'Temsilcilikler | Demirvana', 'Demirvana iş ortakları Genebre, Mei ve Centork marka çözümlerini inceleyin.', 'vana temsilcilikleri, Genebre, Mei, Centork', '/temsilcilikler', NULL, NULL, 'CollectionPage', 'monthly', 0.7, 4),
    ('/teknik', 'tr', 'Teknik Bilgiler | Demirvana', 'Endüstriyel vana seçimi ve uygulamaları için Demirvana teknik kaynaklarını inceleyin.', 'vana teknik bilgi, vana seçimi', '/teknik', NULL, NULL, 'WebPage', 'monthly', 0.6, 5),
    ('/referanslar', 'tr', 'Proje Referansları | Demirvana', 'Su, atıksu, enerji, madencilik ve sanayi projelerindeki Demirvana referanslarını inceleyin.', 'vana projeleri, endüstriyel referanslar', '/referanslar', NULL, NULL, 'CollectionPage', 'monthly', 0.7, 6),
    ('/sertifikalar', 'tr', 'Sertifikalar | Demirvana', 'Demirvana kalite ve üretim standartlarını belgeleyen sertifikaları inceleyin.', 'vana sertifikaları, kalite belgeleri', '/sertifikalar', NULL, NULL, 'WebPage', 'yearly', 0.5, 7),
    ('/iletisim', 'tr', 'İletişim ve Destek | Demirvana', 'Ürün seçimi, teknik destek ve teklif talepleriniz için Demirvana ile iletişime geçin.', 'Demirvana iletişim, vana teklifi, teknik destek', '/iletisim', NULL, NULL, 'ContactPage', 'yearly', 0.8, 8)
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
    ('Temsilcilikler', '/temsilcilikler', 4),
    ('Teknik', '/teknik', 5),
    ('Referanslar', '/referanslar', 6),
    ('Sertifikalar', '/sertifikalar', 7),
    ('İletişim', '/iletisim', 8)
ON DUPLICATE KEY UPDATE `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`);

-- Önceki alt menü kaydı bağımsız üst menüye taşındığı için yalnız eski adres temizlenir.
DELETE FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/temsilcilikler';

INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Vana', '/urunler/vana', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Aktüatör', '/urunler/aktuator', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), NULL, 'Otomasyon', '/urunler/otomasyon', 3)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

-- Aktüatör ürün ailesi, Vana grubu gibi aynı yönetilebilir üçüncü seviye menü yapısını kullanır.
DELETE FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator-aksesuarlari';

INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Pnömatik Aktüatör', '/urunler/pnomatik-aktuator', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Elektrik Aktüatörler', '/urunler/elektrik-aktuatorler', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Aktüatörlü Vanalar', '/urunler/aktuatorlu-vanalar', 3),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/aktuator'), 'Aksesuarlar', '/urunler/aksesuarlar', 4)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

-- Canlı Demirvana sitesindeki Otomasyon ürün grupları aynı yönetilebilir ağaçta tutulur.
INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/otomasyon'), 'Debi (Akış)', '/urunler/debi-akis', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/otomasyon'), 'Basınç', '/urunler/basinc', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/otomasyon'), 'Seviye', '/urunler/seviye', 3),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/otomasyon'), 'Sıcaklık', '/urunler/sicaklik', 4),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/otomasyon'), 'Proses Kontrol', '/urunler/proses-kontrol', 5)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `menu_alt_ogeleri`
    (`menu_ogesi_id`, `ust_alt_oge_id`, `baslik`, `baglanti`, `siralama`)
VALUES
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Su Grubu Vanaları', '/urunler/su-grubu-vanalari', 1),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Buhar Grubu Vanaları', '/urunler/buhar-grubu-vanalari', 2),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Kontrol Vanaları', '/urunler/kontrol-vanalari', 3),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Hidrolik Vanalar', '/urunler/hidrolik-vanalar', 4),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Basınç Düşürücü Vanalar', '/urunler/basinc-dusurucu-vanalar', 5),
    ((SELECT `id` FROM `menu_ogeleri` WHERE `baglanti` = '/urunler'), (SELECT `id` FROM `menu_alt_ogeleri` WHERE `baglanti` = '/urunler/vana'), 'Yangın Vanaları', '/urunler/yangin-vanalari', 6),
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
    ('Küresel Vanalar', 'kuresel-vanalar', '/assets/kategoriler/kuresel-vanalar.webp', 'Mavi endüstriyel küresel vana', 1),
    ('Kelebek Vanalar', 'kelebek-vanalar', '/assets/kategoriler/kelebek-vanalar.webp', 'Mavi endüstriyel kelebek vana', 2),
    ('Sürgülü Vanalar', 'surgulu-vanalar', '/assets/kategoriler/surgulu-vanalar.webp', 'Mavi endüstriyel sürgülü vana', 3),
    ('Çekvalfler', 'cekvalfler', '/assets/kategoriler/cekvalfler.webp', 'Mavi endüstriyel çekvalf', 4),
    ('Globe Vanalar', 'globe-vanalar', '/assets/kategoriler/globe-vanalar.webp', 'Mavi endüstriyel globe vana', 5),
    ('Pislik Tutucular', 'pislik-tutucular', '/assets/kategoriler/pislik-tutucular.webp', 'Mavi endüstriyel pislik tutucu', 6),
    ('Kontrol Vanaları', 'kontrol-vanalari', '/assets/kategoriler/kontrol-vanalari.webp', 'Mavi endüstriyel kontrol vanası', 7)
ON DUPLICATE KEY UPDATE
    `ad` = VALUES(`ad`),
    `gorsel_yolu` = VALUES(`gorsel_yolu`),
    `alternatif_metin` = VALUES(`alternatif_metin`),
    `siralama` = VALUES(`siralama`);

-- İlk ürün detayı, ileride kurulacak Su Grubu sol menüsüne bağlanmaya hazır biçimde Sürgülü Vanalar kategorisinde tutulur.
INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `kisa_aciklama`, `teknik_bilgiler`, `stok_kodu`, `siralama`)
SELECT `id`, 'Metal Sitli Sürgülü Vana F4 D-001', 'metal-sitli-surgulu-vana-f4-d-001',
    'Endüstriyel akışkan kontrolünde yüksek dayanım ve güvenilir performans.',
    '{"grup_adi":"Sürgülü Vanalar","basinc":"PN 10 / 6 / 4 / 2,5 / 1,6 / 1","teknik_cizim_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/teknik-cizim.png","teknik_cizim_alt":"Metal sitli sürgülü vana teknik çizimi – F4 D-001","parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58 / Bronz / Paslanmaz Çelik"},{"no":"3","ad":"Sürgü (DN40–100)","malzeme":"Ms 58 / Bronz / Paslanmaz Çelik"},{"no":"3","ad":"Sürgü (DN125–900)","malzeme":"GG 25 / GGG-40"},{"no":"4","ad":"Sürgü Burcu","malzeme":"Ms 58 / Bronz / Paslanmaz Çelik"},{"no":"5","ad":"Sürgü Somunu","malzeme":"Ms 58 / Bronz / GGG-40"},{"no":"6","ad":"Mil","malzeme":"Ms 58 / Bronz / Paslanmaz Çelik"},{"no":"7","ad":"Conta","malzeme":"EPDM / Franzelit / Klingerit"},{"no":"8","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"9","ad":"Civata","malzeme":"5D / Paslanmaz Çelik"},{"no":"10","ad":"Mil Somunu","malzeme":"Ms 58 / Bronz / Paslanmaz Çelik"},{"no":"11","ad":"O-Ring","malzeme":"EPDM"},{"no":"12","ad":"Volan","malzeme":"GG 20"}],"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600","700","800","900"],"olculer":[{"grup":"Vana Boyutları","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390","430","470","510"]},{"grup":"Vana Boyutları","kod":"H","degerler":["157","190","210","230","260","365","375","500","630","715","820","910","1135","1300","1480","1690","1820"]},{"grup":"Vana Boyutları","kod":"D1","degerler":["160","160","160","160","200","250","250","250","315","315","400","400","500","500","630","800","800"]},{"grup":"Flanş Ölçüleri PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","670","780","895","1015","1115"]},{"grup":"Flanş Ölçüleri PN10","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","725","840","950","1050"]},{"grup":"Ağırlık","kod":"kg","degerler":["8,3","10,2","13,7","15,5","22,1","37","44,2","81","123","176","225","290","460","680","870","1200","1400"]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF · 533 KB","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/urun-foyu.pdf"}]}',
    'D-001', 1
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `ad` = VALUES(`ad`), `kisa_aciklama` = VALUES(`kisa_aciklama`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urun_gorselleri` (`urun_id`, `gorsel_yolu`, `alternatif_metin`, `siralama`)
SELECT `id`, '/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/teknik-cizim.png', 'Metal sitli sürgülü vana F4 D-001 teknik çizimi', 1
FROM `urunler` WHERE `slug` = 'metal-sitli-surgulu-vana-f4-d-001'
  AND NOT EXISTS (SELECT 1 FROM `urun_gorselleri` WHERE `gorsel_yolu` = '/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/teknik-cizim.png');

-- Kaynak tablodaki boş ve birleşik hücreler korunur; çap değerleri tahmin edilerek yayılmaz.
UPDATE `urunler`
SET `teknik_bilgiler` = JSON_SET(
    `teknik_bilgiler`,
    '$.urun_tanimi', JSON_OBJECT('baslik','METAL SİTLİ SÜRGÜLÜ VANA','satirlar',JSON_ARRAY('O-RİNG SİSTEMİ','PN10 / PN6','TS 457/1','DIN 3352/2-F4 (DIN 3216)')),
    '$.anma_basinci_gruplari', JSON_ARRAY(JSON_OBJECT('deger','10','sutun',8),JSON_OBJECT('deger','6','sutun',3),JSON_OBJECT('deger','4','sutun',2),JSON_OBJECT('deger','2,5','sutun',2),JSON_OBJECT('deger','1,6','sutun',1),JSON_OBJECT('deger','1','sutun',1)),
    '$.anma_basinci_degerleri', JSON_ARRAY('10','6','4','2,5','1,6','1','','','','','','','','','','',''),
    '$.parcalar', JSON_ARRAY(
        JSON_OBJECT('no','1','ad','Gövde','malzeme','GG 25 / GGG-40'),
        JSON_OBJECT('no','2','ad','Gövde Burcu','malzeme','Ms 58 / Bronze / S.S.'),
        JSON_OBJECT('no','3','ad','Sürgü (DN40–100)','malzeme','Ms 58 / Bronze / S.S.'),
        JSON_OBJECT('no','3','ad','Sürgü (DN125–900)','malzeme','GG 25 / GGG-40'),
        JSON_OBJECT('no','4','ad','Sürgü Burcu','malzeme','Ms 58 / Bronze / S.S.'),
        JSON_OBJECT('no','5','ad','Sürgü Somunu','malzeme','Ms 58 / Bronze / GGG-40'),
        JSON_OBJECT('no','6','ad','Mil','malzeme','Ms 58 / Bronze / S.S.'),
        JSON_OBJECT('no','7','ad','Conta','malzeme','NBR / FKM (Viton) / Klingerit'),
        JSON_OBJECT('no','8','ad','Kapak','malzeme','GG 25 / GGG-40'),
        JSON_OBJECT('no','9','ad','Civata','malzeme','St 37 / S.S.'),
        JSON_OBJECT('no','10','ad','Mil Somunu','malzeme','Mr 58 / Bronze / S.S.'),
        JSON_OBJECT('no','11','ad','O-Ring','malzeme','EPDM'),
        JSON_OBJECT('no','12','ad','Volan','malzeme','GG 20')
    ),
    '$.olculer', JSON_ARRAY(
        JSON_OBJECT('grup','Vana Boyutları\nTS 457 /1\nDIN / 3352 / 24','kod','L','degerler',JSON_ARRAY('140','150','170','180','190','200','210','230','250','270','290','310','350','390','430','470','510')),
        JSON_OBJECT('grup','','kod','H','degerler',JSON_ARRAY('157','190','210','230','260','365','375','500','630','715','820','910','1135','1300','1480','1690','1820')),
        JSON_OBJECT('grup','','kod','D1','degerler',JSON_ARRAY(),'gruplu_degerler',JSON_ARRAY(JSON_OBJECT('deger','160','sutun',4),JSON_OBJECT('deger','200','sutun',1),JSON_OBJECT('deger','250','sutun',3),JSON_OBJECT('deger','315','sutun',2),JSON_OBJECT('deger','400','sutun',2),JSON_OBJECT('deger','500','sutun',2),JSON_OBJECT('deger','630','sutun',1),JSON_OBJECT('deger','800','sutun',2))),
        JSON_OBJECT('grup','Flanş Ölçüleri\nDIN 2501 / TS 810\nPN10','kod','D','degerler',JSON_ARRAY('150','165','185','200','220','250','285','340','295','445','505','565','670','780','895','1015','1115')),
        JSON_OBJECT('grup','','kod','k','degerler',JSON_ARRAY('110','125','145','160','180','210','240','295','350','400','460','515','620','725','480','950','1050')),
        JSON_OBJECT('grup','Ağırlık','kod','kg','degerler',JSON_ARRAY('8,3','10,2','13,7','15,5','22,1','37','44,2','81','123','176','225','290','460','680','870','1200','1400'))
    ),
    '$.dokumanlar', JSON_ARRAY(
        JSON_OBJECT('baslik','Birim Fiyat Excel','aciklama','Metal Sitli Sürgülü Vana F4 D-001 fiyat listesi','tur','XLSX · 12 KB','belge_turu','excel','dosya_yolu','/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001 Birim Fiyat.xlsx'),
        JSON_OBJECT('baslik','Ürün PDF','aciklama','Ürün kataloğu ve teknik bilgiler','tur','PDF · 533 KB','dosya_yolu','/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001.pdf')
    )
)
WHERE `slug` = 'metal-sitli-surgulu-vana-f4-d-001';

-- Ürün kataloğunun ilk tesliminde beş gerçek ürün adı gösterilir; yalnız doğrulanmış F4 D-001 detayı aktiftir.
UPDATE `urunler`
SET `teknik_bilgiler` = JSON_SET(
    `teknik_bilgiler`,
    '$.katalog_bilgileri', JSON_OBJECT(
        'dn','DN 40 - 900', 'standart','TS 457/1 · DIN 3352/2-F4', 'basinc','PN 10 / PN 6',
        'gorsel_yolu','/assets/kategoriler/surgulu-vanalar.webp'
    )
)
WHERE `slug` = 'metal-sitli-surgulu-vana-f4-d-001';

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `kisa_aciklama`, `teknik_bilgiler`, `stok_kodu`, `siralama`)
SELECT `id`, 'Metal Sitli Sürgülü Vana F5 D-003', 'metal-sitli-surgulu-vana-f5-d-003',
    'Uzun tip metal sitli sürgülü vana.',
    '{"detay_hazir_mi":false,"katalog_bilgileri":{"dn":"DN 50 - 600","standart":"TS 457/1 · DIN 3352/2-F5","basinc":"PN 10 / PN 6","gorsel_yolu":"/assets/kategoriler/surgulu-vanalar.webp"}}',
    'D-003', 2
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `ad` = VALUES(`ad`), `kisa_aciklama` = VALUES(`kisa_aciklama`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `stok_kodu` = VALUES(`stok_kodu`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `kisa_aciklama`, `teknik_bilgiler`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elastomer Sitli Sürgülü Vana F4 D-010', 'elastomer-sitli-surgulu-vana-f4-d-010',
    'Elastomer sitli kısa tip sürgülü vana.',
    '{"detay_hazir_mi":false,"katalog_bilgileri":{"dn":"DN 40 - 600","standart":"TS EN 1074-2","basinc":"PN 10 / PN 16","gorsel_yolu":"/assets/kategoriler/surgulu-vanalar.webp"}}',
    'D-010', 3
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `ad` = VALUES(`ad`), `kisa_aciklama` = VALUES(`kisa_aciklama`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `stok_kodu` = VALUES(`stok_kodu`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `kisa_aciklama`, `teknik_bilgiler`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elastomer Sitli Sürgülü Vana F5 D-385', 'elastomer-sitli-surgulu-vana-f5-d-385',
    'Elastomer sitli uzun tip sürgülü vana.',
    '{"detay_hazir_mi":false,"katalog_bilgileri":{"dn":"DN 50 - 600","standart":"TS EN 1074-2","basinc":"PN 10 / PN 16","gorsel_yolu":"/assets/kategoriler/surgulu-vanalar.webp"}}',
    'D-385', 4
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `ad` = VALUES(`ad`), `kisa_aciklama` = VALUES(`kisa_aciklama`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `stok_kodu` = VALUES(`stok_kodu`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `kisa_aciklama`, `teknik_bilgiler`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yükselen Milli Sürgülü Vana F4/S D-000', 'yukselen-milli-surgulu-vana-f4-s-d-000',
    'Yükselen milli flanşlı sürgülü vana.',
    '{"detay_hazir_mi":false,"katalog_bilgileri":{"dn":"DN 50 - 600","standart":"TS 1171","basinc":"PN 10 / PN 16","gorsel_yolu":"/assets/kategoriler/surgulu-vanalar.webp"}}',
    'D-000', 5
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `ad` = VALUES(`ad`), `kisa_aciklama` = VALUES(`kisa_aciklama`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `stok_kodu` = VALUES(`stok_kodu`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `fuar_gorselleri` (`gorsel_yolu`, `alternatif_metin`, `siralama`) VALUES
    ('/assets/fuar/demirvana-fuar-5.jpg', 'Demirvana fuar standından ürün tanıtımı', 1),
    ('/assets/fuar/demirvana-fuar-6.jpg', 'Demirvana fuar alanında ziyaretçi buluşması', 2),
    ('/assets/fuar/demirvana-fuar-7.jpg', 'Demirvana fuar standı ve vana ürünleri', 3),
    ('/assets/fuar/demirvana-fuar-standi.jpg', 'Demirvana sektörel fuar katılımı', 4)
ON DUPLICATE KEY UPDATE
    `alternatif_metin` = VALUES(`alternatif_metin`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `temsilcilikler`
    (`dil_kodu`, `marka_adi`, `urun_grubu`, `baslik`, `aciklama`, `etiketler`, `logo_yolu`, `logo_alternatif_metin`, `logo_alt_metni`, `urun_buton_metni`, `urun_baglantisi`, `katalog_buton_metni`, `katalog_baglantisi`, `siralama`)
VALUES
    ('tr', 'Genebre', 'Vana ve Akış Kontrol Ürünleri', 'Genebre', 'Genebre 30 yılı aşkın süredir endüstriyel ve sıhhi tesisat sektöründe vanalar, musluklar ve engelliler için sıhhi çözümler sunar.', 'Vana,Endüstriyel Armatür,Akış Kontrol', '/assets/temsilcilikler/genebre.png', 'Genebre logosu', 'Valves & Fluid Control Solutions', 'Marka ürünleri', '/urunler', 'Katalog talep et', '/iletisim', 1),
    ('tr', 'Mei', 'Manometre ve Enstrümantasyon', 'Mei', 'Mei; manometre, termometre ve endüstriyel enstrümanların üreticisi ve ihracatçısıdır.', 'Enstrümantasyon,Manometre,Termometre', '/assets/temsilcilikler/mei.png', 'Mei logosu', 'Measurement for a safer tomorrow', 'Marka ürünleri', '/urunler', 'Katalog talep et', '/iletisim', 2),
    ('tr', 'Centork', 'Aktüatör ve Kontrol Sistemleri', 'Centork', 'Centork; vana aktüasyon çözümleri, otomasyon ve kontrol uygulamalarında uzmanlaşmıştır.', 'Aktüatör,Vana Otomasyonu,Kontrol', '/assets/temsilcilikler/centork.svg', 'Centork logosu', 'Actuation for a better tomorrow', 'Marka ürünleri', '/urunler', 'Katalog talep et', '/iletisim', 3)
ON DUPLICATE KEY UPDATE
    `urun_grubu` = VALUES(`urun_grubu`), `baslik` = VALUES(`baslik`), `aciklama` = VALUES(`aciklama`),
    `etiketler` = VALUES(`etiketler`), `logo_yolu` = VALUES(`logo_yolu`), `logo_alternatif_metin` = VALUES(`logo_alternatif_metin`),
    `logo_alt_metni` = VALUES(`logo_alt_metni`), `urun_buton_metni` = VALUES(`urun_buton_metni`),
    `urun_baglantisi` = VALUES(`urun_baglantisi`), `katalog_buton_metni` = VALUES(`katalog_buton_metni`),
    `katalog_baglantisi` = VALUES(`katalog_baglantisi`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

-- Aşağıdaki hesap bilgileri Demirvana'nın mevcut resmî iletişim sayfasındaki yayınlanmış kayıtlarla eşleştirilmiştir.
INSERT INTO `banka_hesaplari`
    (`banka_adi`, `hesap_basligi`, `para_birimi`, `iban`, `swift_kodu`, `sube`, `hesap_no`, `logo_yolu`, `siralama`)
VALUES
    ('QNB Finansbank', 'QNB Finansbank TL Hesabı', 'TRY', 'TR33 0011 1000 0000 0080 3936 11', NULL, 'İstanbul Enpara 03663', '80393611', '/assets/iletisim/qnb.png', 1),
    ('QNB Finansbank', 'QNB Finansbank USD Hesabı', 'USD', 'TR84 0011 1000 0000 0082 0144 36', 'FNNBTRISXXX', 'İstanbul Enpara 03663', '8214436', '/assets/iletisim/qnb.png', 2),
    ('QNB Finansbank', 'QNB Finansbank Euro Hesabı', 'EUR', 'TR76 0011 1000 0000 0082 3613 55', 'FNNBTRISXXX', 'İstanbul Enpara 03663', '8214436', '/assets/iletisim/qnb.png', 3)
ON DUPLICATE KEY UPDATE
    `hesap_basligi` = VALUES(`hesap_basligi`), `iban` = VALUES(`iban`), `swift_kodu` = VALUES(`swift_kodu`),
    `sube` = VALUES(`sube`), `hesap_no` = VALUES(`hesap_no`), `logo_yolu` = VALUES(`logo_yolu`),
    `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

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

INSERT INTO `teknik_dokuman_kategorileri`
    (`id`, `dil_kodu`, `ad`, `slug`, `aciklama`, `ikon_adi`, `siralama`)
VALUES
    (1, 'tr', 'TEKNİK TABLOLAR', 'teknik-tablolar', 'Ürünlere ait teknik tablo ve değerleri inceleyin.', 'dosya-hesaplama', 1),
    (2, 'tr', 'KULLANMA TALİMATLARI', 'kullanma-talimatlari', 'Vana ve ekipmanların kullanım talimatlarını inceleyin.', 'kitap-acik', 2)
ON DUPLICATE KEY UPDATE
    `ad` = VALUES(`ad`), `aciklama` = VALUES(`aciklama`), `ikon_adi` = VALUES(`ikon_adi`),
    `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `teknik_dokumanlar`
    (`id`, `kategori_id`, `dil_kodu`, `baslik`, `slug`, `dosya_yolu`, `orijinal_dosya_adi`, `alternatif_aciklama`, `mime_turu`, `dosya_boyutu`, `sayfa_sayisi`, `siralama`)
VALUES
    (1, 1, 'tr', 'Çeviri Tablosu', 'ceviri-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Teknik ölçü ve birim çeviri tablosu', 'application/pdf', 297187, 1, 2),
    (2, 1, 'tr', 'Basınç Sıcaklık Tablosu', 'basinc-sicaklik-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Basınç ve sıcaklık değerleri tablosu', 'application/pdf', 297187, 1, 1),
    (3, 1, 'tr', 'DIN Standartı Flanş Çapları Tablosu', 'din-standarti-flans-caplari-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'DIN standardı flanş ölçüleri tablosu', 'application/pdf', 297187, 1, 3),
    (4, 1, 'tr', 'Flanş Yüzeyi Tablosu', 'flans-yuzeyi-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Flanş yüzeyi teknik değerleri', 'application/pdf', 297187, 1, 4),
    (5, 1, 'tr', 'Inch-mm Çeviri Tablosu', 'inch-mm-ceviri-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'İnç ve milimetre ölçü çevirileri', 'application/pdf', 297187, 1, 5),
    (6, 1, 'tr', 'Malzemelerin Karşılaştırılması Tablosu', 'malzemelerin-karsilastirilmasi-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Teknik malzemelerin karşılaştırma değerleri', 'application/pdf', 297187, 1, 6),
    (7, 1, 'tr', 'Malzeme Özellikleri Tablosu', 'malzeme-ozellikleri-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Malzeme özellikleri ve sınıfları', 'application/pdf', 297187, 1, 7),
    (8, 1, 'tr', 'Sıcaklık Değer Tablosu', 'sicaklik-deger-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Çalışma sıcaklığı teknik değerleri', 'application/pdf', 297187, 1, 8),
    (9, 2, 'tr', 'Sürgülü Vana Kullanımı', 'surgulu-vana-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Sürgülü vana kullanım kılavuzu', 'application/pdf', 297187, 1, 1),
    (10, 2, 'tr', 'Çekvalf kullanımı', 'cekvalf-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Çekvalf kullanım kılavuzu', 'application/pdf', 297187, 1, 2),
    (11, 2, 'tr', 'Kelebek vana kullanımı', 'kelebek-vana-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Kelebek vana kullanım kılavuzu', 'application/pdf', 297187, 1, 3),
    (12, 2, 'tr', 'Glob Vana kullanımı', 'glob-vana-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Glob vana kullanım kılavuzu', 'application/pdf', 297187, 1, 4),
    (13, 2, 'tr', 'Küresel Gaz Vanası kullanımı', 'kuresel-gaz-vanasi-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Küresel gaz vanası kullanım kılavuzu', 'application/pdf', 297187, 1, 5),
    (14, 2, 'tr', 'Küresel Vana kullanımı', 'kuresel-vana-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Küresel vana kullanım kılavuzu', 'application/pdf', 297187, 1, 6),
    (15, 2, 'tr', 'Yangın Hidrantı kullanımı', 'yangin-hidranti-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Yangın hidrantı kullanım kılavuzu', 'application/pdf', 297187, 1, 7),
    (16, 2, 'tr', 'Buhar Basınç Düşürücü kullanımı', 'buhar-basinc-dusurucu-kullanimi', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Buhar basınç düşürücü kullanım kılavuzu', 'application/pdf', 297187, 1, 8)
ON DUPLICATE KEY UPDATE
    `kategori_id` = VALUES(`kategori_id`), `baslik` = VALUES(`baslik`), `dosya_yolu` = VALUES(`dosya_yolu`),
    `orijinal_dosya_adi` = VALUES(`orijinal_dosya_adi`), `alternatif_aciklama` = VALUES(`alternatif_aciklama`),
    `mime_turu` = VALUES(`mime_turu`), `dosya_boyutu` = VALUES(`dosya_boyutu`),
    `sayfa_sayisi` = VALUES(`sayfa_sayisi`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `sertifika_kategorileri` (`id`, `dil_kodu`, `ad`, `slug`, `siralama`) VALUES
    (1, 'tr', 'ISO', 'iso', 1),
    (2, 'tr', 'Resmi Belgeler', 'resmi-belgeler', 2),
    (3, 'tr', 'Marka', 'marka', 3)
ON DUPLICATE KEY UPDATE `ad` = VALUES(`ad`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `sertifikalar`
    (`id`, `kategori_id`, `dil_kodu`, `baslik`, `slug`, `aciklama`, `dosya_yolu`, `orijinal_dosya_adi`, `onizleme_yolu`, `alternatif_metin`, `dosya_boyutu`, `sayfa_sayisi`, `siralama`)
VALUES
    (1, 1, 'tr', 'ISO 9001 ENG', 'iso-9001-eng', 'Kalite Yönetim Sistemi Sertifikası (İngilizce)', 'iso 9001 ENG.pdf', 'iso 9001 ENG.pdf', '/assets/sertifikalar/iso-9001-eng.png', 'Demirvana ISO 9001 İngilizce kalite sertifikası', 954894, 1, 1),
    (2, 1, 'tr', 'ISO 9001 TR', 'iso-9001-tr', 'Kalite Yönetim Sistemi Sertifikası', 'iso 9001.pdf', 'iso 9001.pdf', '/assets/sertifikalar/iso-9001-tr.png', 'Demirvana ISO 9001 Türkçe kalite sertifikası', 909464, 1, 2),
    (3, 3, 'tr', 'Marka Tescil Belgesi', 'marka-tescil-belgesi', 'Türk Patent ve Marka Kurumu tescil belgesi', 'marka tescil belgesi.pdf', 'marka tescil belgesi.pdf', '/assets/sertifikalar/marka-tescil-belgesi.png', 'Demirvana marka tescil belgesi', 196214, 1, 3),
    (4, 2, 'tr', 'Sanayi Sicil Belgesi', 'sanayi-sicil-belgesi', 'Sanayi ve Teknoloji Bakanlığı sanayi sicil belgesi', 'sanayi sicil belgesi.pdf', 'sanayi sicil belgesi.pdf', '/assets/sertifikalar/sanayi-sicil-belgesi.png', 'Demirvana sanayi sicil belgesi', 194904, 1, 4)
ON DUPLICATE KEY UPDATE
    `kategori_id` = VALUES(`kategori_id`), `baslik` = VALUES(`baslik`), `aciklama` = VALUES(`aciklama`),
    `dosya_yolu` = VALUES(`dosya_yolu`), `orijinal_dosya_adi` = VALUES(`orijinal_dosya_adi`),
    `onizleme_yolu` = VALUES(`onizleme_yolu`), `alternatif_metin` = VALUES(`alternatif_metin`),
    `dosya_boyutu` = VALUES(`dosya_boyutu`), `sayfa_sayisi` = VALUES(`sayfa_sayisi`),
    `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `kurumsal_degerler` (`id`, `dil_kodu`, `baslik`, `aciklama`, `siralama`) VALUES
    (1, 'tr', 'Şirket Profili', 'Endüstriyel vana ve akış kontrol sistemleri alanında faaliyet gösteren, güvenilir ve köklü bir çözüm ortağıyız.', 1),
    (2, 'tr', 'Felsefemiz', 'Müşteri odaklı, güvene dayalı ve uzun vadeli iş ortaklıkları kurarız.', 2),
    (3, 'tr', 'İlkemiz', 'Kalite bir tercih değil, çalışma biçimimizdir.', 3),
    (4, 'tr', 'Misyonumuz', 'Doğru çözüm, doğru ürün ve sürdürülebilir destekle müşterilerimizin ihtiyaçlarını en iyi şekilde karşılamak.', 4),
    (5, 'tr', 'Vizyonumuz', 'Endüstriyel akışkan kontrolü alanında tercih edilen, güvenilir ve kaliteli çözüm ortağı olmak.', 5)
ON DUPLICATE KEY UPDATE
    `baslik` = VALUES(`baslik`), `aciklama` = VALUES(`aciklama`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `kurumsal_urun_gruplari` (`id`, `dil_kodu`, `ad`, `sutun_no`, `siralama`) VALUES
    (1, 'tr', 'Sürgülü Vana', 1, 1),
    (2, 'tr', 'Çapraz Çekvalf', 1, 2),
    (3, 'tr', 'Flanşlı Kelebek Vana', 1, 3),
    (4, 'tr', 'Hidrolik Vana', 1, 4),
    (5, 'tr', 'Wafer / Lug Kelebek Vana', 1, 5),
    (6, 'tr', 'Tilting Çekvalf', 2, 1),
    (7, 'tr', 'Glob Vana', 2, 2),
    (8, 'tr', 'Yaylı Çekvalf', 2, 3),
    (9, 'tr', 'Yangın Hidrantı', 2, 4),
    (10, 'tr', 'Hava Tahliye Vanası / Vantuz', 2, 5),
    (11, 'tr', 'Pislik Tutucu', 3, 1),
    (12, 'tr', 'Çamur Kutusu', 3, 2),
    (13, 'tr', 'Fırtına Vanası', 3, 3)
ON DUPLICATE KEY UPDATE
    `ad` = VALUES(`ad`), `sutun_no` = VALUES(`sutun_no`), `siralama` = VALUES(`siralama`), `aktif_mi` = 1;

INSERT INTO `kurumsal_ekip` (`id`, `dil_kodu`, `ad_soyad`, `gorev`, `eposta`, `telefon`, `siralama`) VALUES
    (1, 'tr', 'Deniz Demir', 'Şirket Müdürü', 'dd@demirvana.com', NULL, 1),
    (2, 'tr', 'Murat Aslan', 'Muhasebe Sorumlusu', 'dv@demirvana.com', NULL, 2)
ON DUPLICATE KEY UPDATE
    `ad_soyad` = VALUES(`ad_soyad`), `gorev` = VALUES(`gorev`), `telefon` = VALUES(`telefon`),
    `siralama` = VALUES(`siralama`), `aktif_mi` = 1;
