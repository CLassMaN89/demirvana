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
    `menu_kategori_adi` VARCHAR(100) NULL COMMENT 'Ürünler menüsündeki 21 gerçek alt kategoriden biri (kategori_id''nin bağlı olduğu 7 genel gruptan bağımsızdır).',
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
    ('', NULL, '/assets/carousel/1.png', 'Demirvana endüstriyel vana çözümü 1', NULL, NULL, 'kaydir', 50, 50, 1),
    ('', NULL, '/assets/carousel/2.png', 'Demirvana endüstriyel vana çözümü 2', NULL, NULL, 'yaklas', 50, 50, 2),
    ('', NULL, '/assets/carousel/3.png', 'Demirvana endüstriyel vana çözümü 3', NULL, NULL, 'metin-maske', 50, 50, 3),
    ('', NULL, '/assets/carousel/4.png', 'Demirvana endüstriyel vana çözümü 4', NULL, NULL, 'kaydir', 50, 50, 4),
    ('', NULL, '/assets/carousel/5.png', 'Demirvana endüstriyel vana çözümü 5', NULL, NULL, 'yaklas', 50, 50, 5),
    ('', NULL, '/assets/carousel/6.png', 'Demirvana endüstriyel vana çözümü 6', NULL, NULL, 'metin-maske', 50, 50, 6)
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

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Akış Göstergesi D-149', 'akis-gostergesi-d-149', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-149', 6
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Ani Kapama Vanası Düz Tip D-155', 'ani-kapama-vanasi-duz-tip-d-155', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-155', 7
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Ani Kapama Vanası Köşe Tip D-119', 'ani-kapama-vanasi-kose-tip-d-119', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-119', 8
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çamur Sandığı Düz Tip D-157', 'camur-sandigi-duz-tip-d-157', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/camur-sandigi-duz-tip-d-157.png"}}', 'Gemi Vanaları', 'D-157', 9
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çamur Sandığı Köşe Tip D-205', 'camur-sandigi-kose-tip-d-205', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-205', 10
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Vana Sandığı D-160', 'vana-sandigi-d-160', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-160', 11
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Köşe Drenaj Vanası D-206', 'kose-drenaj-vanasi-d-206', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-206', 12
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Suction Pislik Tutucu D-207', 'suction-pislik-tutucu-d-207', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-207', 13
FROM `kategoriler` WHERE `slug` = 'pislik-tutucular'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Bronz Glob Vana Düz - Köşe D-208', 'bronz-glob-vana-duz-kose-d-208', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-208', 14
FROM `kategoriler` WHERE `slug` = 'globe-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Bronz Yangın Vanası Düz - Köşe D-209', 'bronz-yangin-vanasi-duz-kose-d-209', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-209', 15
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Dışşarj Vanası Yaylı Tip Düz - Köşe D-084', 'dissarj-vanasi-yayli-tip-duz-kose-d-084', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-084', 16
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'İskandil Vanası D-086', '129-iskandil-vanasi-d-086', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-086', 17
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Hidrolik Kol D-087', 'hidrolik-kol-d-087', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-087', 18
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Self Closing Vana D-223', 'self-closing-vana-d-223', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-223', 19
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Fırtına Vanası Düz Tip D-156', 'firtina-vanasi-duz-tip-d-156', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-156', 20
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Fırtına Vanası Köşe Tip D-224', 'firtina-vanasi-kose-tip-d-224', '{"detay_hazir_mi":false}', 'Gemi Vanaları', 'D-224', 21
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Metal Sitli Sürgülü Vana F5 D-003', 'metal-sitli-surgulu-vana-f5-d-003', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-sitli-surgulu-vana-f5-d-003.png"}}', 'Su Grubu Vanaları', 'D-003', 22
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elastomer Sitli Sürgülü Vana F4 D-010', 'elastomer-sitli-surgulu-vana-f4-d-010', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elastomer-sitli-surgulu-vana-f4-d-010.png"}}', 'Su Grubu Vanaları', 'D-010', 23
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elastomer Sitli Sürgülü Vana F5 D-385', 'elastomer-sitli-surgulu-vana-f5-d-385', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elastomer-sitli-surgulu-vana-f5-d-385.jpg"}}', 'Su Grubu Vanaları', 'D-385', 24
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yükselen Milli Sürgülü Vana F4,F5 D-008', 'yukselen-milli-surgulu-vana-f4-f5-d-008', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yukselen-milli-surgulu-vana-f4-f5-d-008.png"}}', 'Su Grubu Vanaları', 'D-008', 25
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Bıçak Sürgülü Vana D-012 (Bıçaklı Vana)', 'bicak-surgulu-vana-d-012-bicakli-vana', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bicak-surgulu-vana-d-012-bicakli-vana.png"}}', 'Su Grubu Vanaları', 'D-012', 26
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Flanşlı Kelebek Vana D-113', 'flansli-kelebek-vana-d-113', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flansli-kelebek-vana-d-113.png"}}', 'Su Grubu Vanaları', 'D-113', 27
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Lug Kelebek Vana D-036', 'lug-kelebek-vana-d-036', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/lug-kelebek-vana-d-036.png"}}', 'Su Grubu Vanaları', 'D-036', 28
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Wafer Kelebek Vana D-032', 'wafer-kelebek-vana-d-032', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/wafer-kelebek-vana-d-032.png"}}', 'Su Grubu Vanaları', 'D-032', 29
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Şamandıralı Vana D-302', 'samandirali-vana-d-302', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/samandirali-vana-d-302.png"}}', 'Su Grubu Vanaları', 'D-302', 30
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Diyafram Vana D-085', 'diyafram-vana-d-085', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/diyafram-vana-d-085.png"}}', 'Su Grubu Vanaları', 'D-085', 31
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Krepin D-046', 'krepin-d-046', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/krepin-d-046.png"}}', 'Su Grubu Vanaları', 'D-046', 32
FROM `kategoriler` WHERE `slug` = 'pislik-tutucular'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '3 Yollu Vana D-324', '3-yollu-vana-d-324', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-324', 33
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pislik Tutucu D-041', 'pislik-tutucu-d-041', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pislik-tutucu-d-041.png"}}', 'Su Grubu Vanaları', 'D-041', 34
FROM `kategoriler` WHERE `slug` = 'pislik-tutucular'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '3 Parçalı Tam Geçişli Küresel D-056', '3-parcali-tam-gecisli-kuresel-d-056', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-tam-gecisli-kuresel-d-056.png"}}', 'Su Grubu Vanaları', 'D-056', 35
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '2 Parçalı Tam Geçişli Küresel D-061', '2-parcali-tam-gecisli-kuresel-d-061', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-061', 36
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çalpara Çekvalf Flanşlı D-026', 'calpara-cekvalf-flansli-d-026', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-026', 37
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çift Klapeli Çekvalf D-020', 'cift-klapeli-cekvalf-d-020', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-020', 38
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Toplu Çekvalf D-030', 'toplu-cekvalf-d-030', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-030', 39
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Dik Çekvalf D-031', 'dik-cekvalf-d-031', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-031', 40
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Tilting Çekvalf D-128', 'tilting-cekvalf-d-128', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-128', 41
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Hidrolik Frenli Tilting Çekvalf D-131', 'hidrolik-frenli-tilting-cekvalf-d-131', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-131', 42
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Hidrolik Pompalı Çek Kelebek Vana D-133', 'hidrolik-pompali-cek-kelebek-vana-d-133', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-133', 43
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Class 150-300-600 Sürgülü Vana D-240', 'class-150-300-600-surgulu-vana-d-240', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-240', 44
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yaylı Dip Klapesi D-045', 'yayli-dip-klapesi-d-045', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yayli-dip-klapesi-d-045.png"}}', 'Su Grubu Vanaları', 'D-045', 45
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Mono Blok Küresel Vana D-064', 'mono-blok-kuresel-vana-d-064', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-064', 46
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Tek Küreli Vantuz D-123', 'tek-kureli-vantuz-d-123', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-123', 47
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çift Küreli Vantuz D-124', 'cift-kureli-vantuz-d-124', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-124', 48
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Class 150-300-600 Çalpara Çekvalf D-245', 'class-150-300-600-calpara-cekvalf-d-245', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-245', 49
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Seviye Göstergeli İndikatörlü Sürgülü Vana (Trafo Vanası) D-323', 'seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-323', 50
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'FlapVana-Klapet-Kurbağalık D-388', 'flapvana-klapet-kurbagalik-d-388', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-388', 51
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Karesel Sürgülü Vana D-011', 'karesel-surgulu-vana-d-011', '{"detay_hazir_mi":false}', 'Su Grubu Vanaları', 'D-011', 52
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Darbesiz Vantuz D-304', 'darbesiz-vantuz-d-304', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/darbesiz-vantuz-d-304.png"}}', 'Su Grubu Vanaları', 'D-304', 53
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Glob Vana D-069', 'glob-vana-d-069', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/glob-vana-d-069.png"}}', 'Buhar Grubu Vanaları', 'D-069', 54
FROM `kategoriler` WHERE `slug` = 'globe-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Glob Vana - Kumandalı Çekvalf Köşe Tip D-072', 'glob-vana-kumandali-cekvalf-kose-tip-d-072', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-072', 55
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Buhar Basınç Düşürücü D-066', 'buhar-basinc-dusurucu-d-066', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-066', 56
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnomatik Glob Tipi Kontrol Vanası D-067', 'pnomatik-glob-tipi-kontrol-vanasi-d-067', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-067', 57
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pistonlu Vana D-076', 'pistonlu-vana-d-076', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-076', 58
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Metal Körüklü Glob Vana D-073', 'metal-koruklu-glob-vana-d-073', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-koruklu-glob-vana-d-073.png"}}', 'Buhar Grubu Vanaları', 'D-073', 59
FROM `kategoriler` WHERE `slug` = 'globe-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yaylı Çekvalf D-078', 'yayli-cekvalf-d-078', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-078', 60
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yaylı Emniyet Ventili Oransal Kalkışlı D-081', 'yayli-emniyet-ventili-oransal-kalkisli-d-081', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-081', 61
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Lift Loaded Safety Valve D-082', 'lift-loaded-safety-valve-d-082', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-082', 62
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Emniyet Ventili Su, Amonyak, Azot', 'emniyet-ventili-su-amonyak-azot', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', NULL, 63
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Ters Kovalı Kondenstop D-092', 'ters-kovali-kondenstop-d-092', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-092', 64
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Termostatik Vana D-068', 'termostatik-vana-d-068', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-068', 65
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Kızgın Yağ Vanası D-141', 'pnomatik-kizgin-yag-vanasi-d-141', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-141', 66
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kazan Blöf Vanası D-093', 'kazan-blof-vanasi-d-093', '{"detay_hazir_mi":false}', 'Buhar Grubu Vanaları', 'D-093', 67
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Akış Göstergesi ( Gözetleme Camları )', 'akis-gostergesi-gozetleme-camlari', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/akis-gostergesi-gozetleme-camlari.jpg"}}', 'Buhar Grubu Vanaları', NULL, 68
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Diyafram Vana D-325', 'pnomatik-diyafram-vana-d-325', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-325', 69
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Tek Yataklı) On-Off - Oransal D-067', 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', NULL, 70
FROM `kategoriler` WHERE `slug` = 'globe-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Çift Yataklı) On-Off - Oransal D-067', 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', NULL, 71
FROM `kategoriler` WHERE `slug` = 'globe-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Glob Tip 3 Yollu Kontrol Vanası On-Off Oransal D-225', 'pnomatik-glob-tip-3-yollu-kontrol-vanasi-on-off-oransal-d-225', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-225', 72
FROM `kategoriler` WHERE `slug` = 'globe-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Buhar Basınç Düşürücü Kontrol Vanası D-066', 'buhar-basinc-dusurucu-kontrol-vanasi-d-066', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', NULL, 73
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Termostatik Vana D-068', '58-termostatik-vana-d-068', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', NULL, 74
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Diyafram Aktüatörlü Kontrol Vanası D-227', 'diyafram-aktuatorlu-kontrol-vanasi-d-227', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-227', 75
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Piston Aktüatörlü Kontrol Vanası D-228', 'piston-aktuatorlu-kontrol-vanasi-d-228', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-228', 76
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik On-Off 2 Yollu Pistonlu Kontrol Vanası D-229', 'pnomatik-on-off-2-yollu-pistonlu-kontrol-vanasi-d-229', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-229', 77
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Kızgın Yağ Vanası D-141', '62-pnomatik-kizgin-yag-vanasi-d-141', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', NULL, 78
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Basınç Ayar Vanası D-226', 'basinc-ayar-vanasi-d-226', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-226', 79
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pinch Vana D-320', 'pinch-vana-d-320', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-320', 80
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pnömatik Pinch (Çimdik) Vana D-321', 'pnomatik-pinch-cimdik-vana-d-321', '{"detay_hazir_mi":false}', 'Kontrol Vanaları', 'D-321', 81
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Basınç Düşürücü Vana - Pilot Tip D-143', 'su-basinc-dusurucu-vana-pilot-tip-d-143', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-143', 82
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Düz Tip Su Basıç Düşürücü Vana D-143', 'duz-tip-su-basic-dusurucu-vana-d-143', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', NULL, 83
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Basınç Sabitleme Vanası D-143', 'basinc-sabitleme-vanasi-d-143', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', NULL, 84
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Darbesi Önleme Vanası D-144', 'su-darbesi-onleme-vanasi-d-144', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-144', 85
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Köşe Tip Mekanik Şamandralı Vana D-302', 'surge-anticipating-control-valve-d-144', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/surge-anticipating-control-valve-d-144.jpg"}}', 'Hidrolik Vanalar', NULL, 86
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Seviye Kontrol Vanası D-145', 'seviye-kontrol-vanasi-d-145', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-145', 87
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Solenoid Kontrol Vanası D-147', 'solenoid-kontrol-vanasi-d-147', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-147', 88
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Debi Ayar Vanası D-148', 'debi-ayar-vanasi-d-148', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-148', 89
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Basınç Tahliye Vanası D-378', 'basinc-tahliye-vanasi-d-378', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-378', 90
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Flatörlü Seviye Kontrol Vanası', 'elektrik-flatorlu-seviye-kontrol-vanasi', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', NULL, 91
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Hidrolik On-Off Kontrol Vanası D-552', 'hidrolik-on-off-kontrol-vanasi-d-552', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-552', 92
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pompa Kontrol Vanası D - 598', 'pompa-kontrol-vanasi-d-598', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', 'D-598', 93
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Düz Tip Şamandralı Vana', 'duz-tip-samandrali-vana', '{"detay_hazir_mi":false}', 'Hidrolik Vanalar', NULL, 94
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Buhar Basınç Düşürücü Kontrol Vanası D-066', '79-buhar-basinc-dusurucu-kontrol-vanasi-d-066', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', NULL, 95
FROM `kategoriler` WHERE `slug` = 'kontrol-vanalari'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Basınç Düşürücü Vana Y Tipi Çift Diyaframlı D-143', 'su-basinc-dusurucu-vana-y-tipi-cift-diyaframli-d-143', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', NULL, 96
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Basınç Düşürücü Vana Y Tipi Tek Diyaframlı D-143', 'su-basinc-dusurucu-vana-y-tipi-tek-diyaframli-d-143', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', NULL, 97
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Basınç Düşürücü Vana Düz Tip D-143', 'su-basinc-dusurucu-vana-duz-tip-d-143', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', NULL, 98
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Basınç Düşürücü Vana Endustriyel Tip D-146', 'su-basinc-dusurucu-vana-endustriyel-tip-d-146', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', 'D-146', 99
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su,Gaz, Amonyak için Basınç Düşürücü - Regülatörü', 'su-gaz-amonyak-icin-basinc-dusurucu-regulatoru', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', NULL, 100
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Su Pirinç Basınç Düşürücü Vana Dişli D-333', 'su-pirinc-basinc-dusurucu-vana-disli-d-333', '{"detay_hazir_mi":false}', 'Basınç Düşürücü Vanalar', 'D-333', 101
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yerüstü Yangın Hidrantı D-151', 'yerustu-yangin-hidranti-d-151', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yerustu-yangin-hidranti-d-151.png"}}', 'Yangın Vanaları', 'D-151', 102
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yeraltı Yangın Hidrantı (Alttan Klapeli) D-152', 'yeralti-yangin-hidranti-alttan-klapeli-d-152', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-152', 103
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yeraltı Yangın Hidrantı (Üstten Klapeli) D-152', 'yeralti-yangin-hidranti-ustten-klapeli-d-152', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yeralti-yangin-hidranti-ustten-klapeli-d-152.png"}}', 'Yangın Vanaları', NULL, 104
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yeralti Yangın Hidranti Kurtağzı D-359', 'yeralti-yangin-hidranti-kurtagzi-d-359', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-359', 105
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Dişli Bronz Kelebek Vana (Yangın Tip) D-232', 'disli-bronz-kelebek-vana-yangin-tip-d-232', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-232', 106
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'İzlenebilir Kelebek Vana (Yangın Tip) D-230', 'izlenebilir-kelebek-vana-yangin-tip-d-230', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-230', 107
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yivli Kelebek Vana (Yangın Tip) D-231', 'yivli-kelebek-vana-yangin-tip-d-231', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-231', 108
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yükselen Milli Sürgülü Vana (Yangın) D-233', 'yukselen-milli-surgulu-vana-yangin-d-233', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-233', 109
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yangın Hidrantı Kazan D-154', 'yangin-hidranti-kazan-d-154', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yangin-hidranti-kazan-d-154.png"}}', 'Yangın Vanaları', 'D-154', 110
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Fire Çekvalf D-234', 'fire-cekvalf-d-234', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-234', 111
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Sabit Kaplin D-297', 'sabit-kaplin-d-297', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-297', 112
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Flexible Coupling D-298', 'flexible-coupling-d-298', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-298', 113
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yangın Vana (İtalyan Tip) D-301', 'yangin-vana-italyan-tip-d-301', '{"detay_hazir_mi":false}', 'Yangın Vanaları', 'D-301', 114
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yangın Rekoru(Kaplin)ve Kapağı', 'yangin-rekoru-kaplin-ve-kapagi', '{"detay_hazir_mi":false}', 'Yangın Vanaları', NULL, 115
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Flanşlı Yangın Vanası', 'flansli-yangin-vanasi', '{"detay_hazir_mi":false}', 'Yangın Vanaları', NULL, 116
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Islak Alarm Vanası', 'islak-alarm-vanasi', '{"detay_hazir_mi":false}', 'Yangın Vanaları', NULL, 117
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'İzlenebilir Kebelek Vana', 'izlenebilir-kebelek-vana', '{"detay_hazir_mi":false}', 'Yangın Vanaları', NULL, 118
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'L Tipi Küresel Vana D-050', 'l-tipi-kuresel-vana-d-050', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-050', 119
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Paslanmaz Monoblok Küresel Vana D-052', 'paslanmaz-monoblok-kuresel-vana-d-052', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-052', 120
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '3 Parçalı Flanşlı Küresel Vana D-054 - D-055', '3-parcali-flansli-kuresel-vana-d-054-d-055', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-054', 121
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '3 Parçalı Dişli Küresel Vana D-049', '3-parcali-disli-kuresel-vana-d-049', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-049', 122
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '2 Parçalı Dişli Küresel Vana D-047', '2-parcali-disli-kuresel-vana-d-047', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/2-parcali-disli-kuresel-vana-d-047.png"}}', 'Paslanmaz Vanalar', 'D-047', 123
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '2 Parçalı Paslanmaz Flanşlı Küresel Vana D-376', '2-parcali-paslanmaz-flansli-kuresel-vana-d-376', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-376', 124
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Wafer Çekvalf D-021', 'wafer-cekvalf-d-021', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-021', 125
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çalpara Çekvalf Dişli AISI 304 - 316 D-025', 'calpara-cekvalf-disli-aisi-304-316-d-025', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-025', 126
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Disko Çekvalf AISI D-017 AISI D-018', 'disko-cekvalf-aisi-d-017-aisi-d-018', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-017', 127
FROM `kategoriler` WHERE `slug` = 'cekvalfler'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Gıda Vanası D-246', '113-gida-vanasi-d-246', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-246', 128
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'İğne Vana D-159', 'igne-vana-d-159', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-159', 129
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Wafer Kelebek Vana D-032', '115-wafer-kelebek-vana-d-032', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', NULL, 130
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'T Tipi Küresel Vana D-051', '117-t-tipi-kuresel-vana-d-051', '{"detay_hazir_mi":false}', 'Paslanmaz Vanalar', 'D-051', 131
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Statik Balans Vanası', 'statik-balans-vanasi', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/statik-balans-vanasi.png"}}', 'Balans Vanaları', NULL, 132
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Buhar Solenoid Vanalar D-199', 'buhar-solenoid-vanalar-d-199', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', 'D-199', 133
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Grup Solenoid Vanalar', 'grup-solenoid-vanalar', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', NULL, 134
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Paslanmaz Solenoid Vanalar D-197', 'paslanmaz-solenoid-vanalar-d-197', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', 'D-197', 135
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Solenoid Vana Zaman Rolesi', 'solenoid-vana-zaman-rolesi', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', NULL, 136
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Vakum Solenoid Vanalar', 'vakum-solenoid-vanalar', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', NULL, 137
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yakıt Solenoid Vanalar', 'yakit-solenoid-vanalar', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', NULL, 138
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Tek Etkili Y Tipi Pistonlu Vana D-202', 'tek-etkili-y-tipi-pistonlu-vana-d-202', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', 'D-202', 139
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Bobinli Patlaç Valf', 'bobinli-patlac-valf', '{"detay_hazir_mi":false}', 'Solenoid Patlaç Pistonlu', NULL, 140
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Döner Flanşlı Kompansatör D-099', 'doner-flansli-kompansator-d-099', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-099', 141
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kaynak Boyunlu Kompansatör D-106', 'kaynak-boyunlu-kompansator-d-106', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-106', 142
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Sabit Flanşlı Kompansatör D-103', 'sabit-flansli-kompansator-d-103', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-103', 143
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Dıştan Basınçlı Kompansatör D-111', 'distan-basincli-kompansator-d-111', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-111', 144
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kauçuk Kompansatör D-096', 'kaucuk-kompansator-d-096', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-096', 145
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Körük D-271', 'koruk-d-271', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-271', 146
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'İzoleli Flexible Hortumu D-120', 'izoleli-flexible-hortumu-d-120', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-120', 147
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'İzolesiz Flexible Hortumu D-299', 'izolesiz-flexible-hortumu-d-299', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-299', 148
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Örgülü Esnek Metal Hortum D-142', 'orgulu-esnek-metal-hortum-d-142', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-142', 149
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Örgüsüz Esnek Metal Hortum D-300', 'orgusuz-esnek-metal-hortum-d-300', '{"detay_hazir_mi":false}', 'Kompansatörler', 'D-300', 150
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Düz Flanş D-290', 'duz-flans-d-290', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-290', 151
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kaynak Boyunlu Flanş D-291', 'kaynak-boyunlu-flans-d-291', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-291', 152
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Te D-292', 'te-d-292', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-292', 153
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kep D-293', 'kep-d-293', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-293', 154
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Dirsek D-294', 'dirsek-d-294', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-294', 155
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Eksantrik Konsantrik Redüksiyonlar D-295', 'eksantrik-konsantrik-reduksiyonlar-d-295', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-295', 156
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Demontaj Parçası D-135', 'demontaj-parcasi-d-135', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-135', 157
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Flanş Adaptörü D-296', 'flans-adaptoru-d-296', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-296', 158
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Sabit Kaplin D-297', '163-sabit-kaplin-d-297', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 159
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Esnek Kaplin D-298', 'esnek-kaplin-d-298', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 160
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'P-T D-351', 'p-t-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-351', 161
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-E D-351', 'g-e-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 162
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-F D-351', 'g-f-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 163
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-MMA D-351', 'g-mma-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 164
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-MMB D-351', 'g-mmb-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 165
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-MMG D-351', 'g-mmg-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 166
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-MMR D-351', 'g-mmr-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 167
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'FFR D-351', 'ffr-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 168
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-Q D-351', 'g-q-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 169
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'FFQ D-351', 'ffq-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 170
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-MG D-351', 'g-mg-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 171
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'X Kör Flanş D-351', 'x-kor-flans-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 172
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'SÜPER KOLYE D-696', 'super-kolye-d-696', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-696', 173
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'G-MA D-351', 'g-ma-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 174
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'AÇB F D-351', 'acb-f-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 175
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Son Kapama Parçası D-351', 'son-kapama-parcasi-d-351', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 176
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Buşakle Takım D-007', 'busakle-takim-d-007', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', 'D-007', 177
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Yangın Rekoru(Kaplin)ve Kapağı', '182-yangin-rekoru-kaplin-ve-kapagi', '{"detay_hazir_mi":false}', 'Bağlantı Parçaları', NULL, 178
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrikli Aktüatör DE-05', 'rotary-on-off-elektrikli-aktuator-de-05', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 179
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary Oransal Elektrik Aktüatör DE-05P', 'rotary-oransal-elektrik-aktuator-de-05p', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 180
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrik Aktüatör DE-10', 'rotary-on-off-elektrik-aktuator-de-10', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 181
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary Oransal Elektrik Aktüatör DE-10P', 'rotary-oransal-elektrik-aktuator-de-10p', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 182
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrik Aktüatör DE-20', 'rotary-on-off-elektrik-aktuator-de-20', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 183
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrik Aktüatör DE-20P', 'rotary-on-off-elektrik-aktuator-de-20p', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 184
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary Kontrol Üniteli Elektrik Aktüatör DE-20I', 'rotary-kontrol-uniteli-elektrik-aktuator-de-20i', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 185
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çok turlu aktüatör On-Off', 'cok-turlu-aktuator-on-off', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 186
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary Kontrol Üniteli Elektrikli Aktüatör DE-05P-D-268', 'rotary-kontrol-uniteli-elektrikli-aktuator-de-05p-d-268', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', 'D-268', 187
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, '3 Yollu Vana Motoru DE-10-D-179', '3-yollu-vana-motoru-de-10-d-179', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', 'D-179', 188
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrik Aktüatör DE-60', 'rotary-on-off-elektrik-aktuator-de-60', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 189
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrik Aktüatör DE-03', 'rotary-on-off-elektrik-aktuator-de-03', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 190
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary On-Off Elektrik Aktüatör', 'rotary-on-off-elektrik-aktuator', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 191
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Rotary Oransal Elektrik Aktüatör', 'rotary-oransal-elektrik-aktuator', '{"detay_hazir_mi":false}', 'Elektrik Aktüatörler', NULL, 192
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çift Etkili Pnömatik Aktüatör D-161', 'cift-etkili-pnomatik-aktuator-d-161', '{"detay_hazir_mi":false}', 'Pnömatik Aktüatör', 'D-161', 193
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Tek Etkili Pnömatik Aktüatör (10 Yaylı) D-339', 'tek-etkili-pnomatik-aktuator-10-yayli-d-339', '{"detay_hazir_mi":false}', 'Pnömatik Aktüatör', 'D-339', 194
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Aktüatörlü Kelebek Vana (Wafer Tip) D-187', 'elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-187', 195
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Aktüatörlü Kelebek Vana (Lug Tip) D-188', 'elektrik-aktuatorlu-kelebek-vana-lug-tip-d-188', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-188', 196
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Aktüatörlü Küresel Vana (3 PCS Dişli) D-175', 'elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-175', 197
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çift Etkili Pnömatik Aktüatörlü 3 Yollu Küresel Vana L Tipi - T Tipi D-177', 'cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-177', 198
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çift Etkili Pnömatik Aktüatörlü Kelebek Vana (Wafer Tip) D-169', 'cift-etkili-pnomatik-aktuatorlu-kelebek-vana-wafer-tip-d-169', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-169', 199
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Çift Etkili Pnömatik Aktüatörlü Kelebek Vana (Lug Tip) D-172', 'cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-172', 200
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Aktüatörlü PVC Küresel Vana D-190', 'elektrik-aktuatorlu-pvc-kuresel-vana-d-190', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-190', 201
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Aktüatörlü Pirinç Küresel Vana D-189', 'elektrik-aktuatorlu-pirinc-kuresel-vana-d-189', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-189', 202
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Mini Elektrik Aktüatörlü Küresel Vana D-194', 'mini-elektrik-aktuatorlu-kuresel-vana-d-194', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-194', 203
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Aktüatörlü Flanşlı Kelebek Vana D-269', 'aktuatorlu-flansli-kelebek-vana-d-269', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-269', 204
FROM `kategoriler` WHERE `slug` = 'kelebek-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Aktüatörlü Sürgülü Vana D-270', 'aktuatorlu-surgulu-vana-d-270', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-270', 205
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektrik Aktüatörlü Küresel Vana D-193', 'elektrik-aktuatorlu-kuresel-vana-d-193', '{"detay_hazir_mi":false}', 'Aktüatörlü Vanalar', 'D-193', 206
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Linear Pozisyoner D-165', 'linear-pozisyoner-d-165', '{"detay_hazir_mi":false}', 'Aksesuarlar', 'D-165', 207
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Linear Pozisyoner Feedback D-166 ıT', 'linear-pozisyoner-feedback-d-166-it', '{"detay_hazir_mi":false}', 'Aksesuarlar', 'D-166', 208
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Switch Box D-164', 'switch-box-d-164', '{"detay_hazir_mi":false}', 'Aksesuarlar', 'D-164', 209
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Namur Solenoid Yön Valfi (Tek Bobinli) D-162', 'namur-solenoid-yon-valfi-tek-bobinli-d-162', '{"detay_hazir_mi":false}', 'Aksesuarlar', 'D-162', 210
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Namur Solenoid Yön Valfi (Çift Bobinli) D-162', 'namur-solenoid-yon-valfi-cift-bobinli-d-162', '{"detay_hazir_mi":false}', 'Aksesuarlar', NULL, 211
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'I-P Çevirici D-167', 'i-p-cevirici-d-167', '{"detay_hazir_mi":false}', 'Aksesuarlar', 'D-167', 212
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Mekanik Woltman Tipi Debimetre D-214', 'mekanik-woltman-tipi-debimetre-d-214', '{"detay_hazir_mi":false}', 'Debi (Akış)', 'D-214', 213
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektromanyetik Debimetre D-212', 'elektromanyetik-debimetre-d-212', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektromanyetik-debimetre-d-212.png"}}', 'Debi (Akış)', 'D-212', 214
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Ultrasonik Debimetre D-213', 'ultrasonik-debimetre-d-213', '{"detay_hazir_mi":false}', 'Debi (Akış)', 'D-213', 215
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Şamandıralı Debimetre D-210', 'samandirali-debimetre-d-210', '{"detay_hazir_mi":false}', 'Debi (Akış)', 'D-210', 216
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Metal Gövdeli Şamandıralı Debimetre D-211', 'metal-govdeli-samandirali-debimetre-d-211', '{"detay_hazir_mi":false}', 'Debi (Akış)', 'D-211', 217
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Pedal Tip Akış Şalterleri D-215', 'pedal-tip-akis-salterleri-d-215', '{"detay_hazir_mi":false}', 'Debi (Akış)', 'D-215', 218
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Basınç Sensörü - Transmitteri D-219', 'basinc-sensoru-transmitteri-d-219', '{"detay_hazir_mi":false}', 'Basınç', 'D-219', 219
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Digital ve Analog Manometre D-220', 'digital-ve-analog-manometre-d-220', '{"detay_hazir_mi":false}', 'Basınç', 'D-220', 220
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kuru Tip Alttan Çıkışlı Manometre', 'kuru-tip-alttan-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kuru-tip-alttan-cikisli-manometre.jpg"}}', 'Basınç', NULL, 221
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Mini Elektrik Aktüatörlü Küresel Vana D-194', '225-mini-elektrik-aktuatorlu-kuresel-vana-d-194', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/225-mini-elektrik-aktuatorlu-kuresel-vana-d-194.jpg"}}', 'Basınç', NULL, 222
FROM `kategoriler` WHERE `slug` = 'kuresel-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Gliserin Tip Alttan Çıkışlı Manometreler', 'gliserin-tip-alttan-cikisli-manometreler', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/gliserin-tip-alttan-cikisli-manometreler.jpg"}}', 'Basınç', NULL, 223
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Gliserin Tip Arka Çıkışlı Manometreler', 'gliserin-tip-arka-cikisli-manometreler', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/gliserin-tip-arka-cikisli-manometreler.jpg"}}', 'Basınç', NULL, 224
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre', 'endustriyel-manometre-c1-1-6-alttan-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg"}}', 'Basınç', NULL, 225
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre', 'endustriyel-manometre-c1-1-6-arka-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg"}}', 'Basınç', NULL, 226
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre', 'endustriyel-manometre-c1-1-arka-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}}', 'Basınç', NULL, 227
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre', '231-endustriyel-manometre-c1-1-arka-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/231-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}}', 'Basınç', NULL, 228
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre', '232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg"}}', 'Basınç', NULL, 229
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre', '233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg"}}', 'Basınç', NULL, 230
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre', '234-endustriyel-manometre-c1-1-arka-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/234-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}}', 'Basınç', NULL, 231
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre', '235-endustriyel-manometre-c1-1-arka-cikisli-manometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/235-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}}', 'Basınç', NULL, 232
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Manometre Bağlantı Sifonu D-570', 'manometre-baglanti-sifonu-d-570', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/manometre-baglanti-sifonu-d-570.jpg"}}', 'Basınç', 'D-570', 233
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Manometre Pano Bağlantı Aparatı', 'manometre-pano-baglanti-aparati', '{"detay_hazir_mi":false}', 'Basınç', NULL, 234
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Manometre Flanşı', 'manometre-flansi', '{"detay_hazir_mi":false}', 'Basınç', NULL, 235
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Seviye Şalterleri D-217', 'seviye-salterleri-d-217', '{"detay_hazir_mi":false}', 'Seviye', 'D-217', 236
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Ultrasonik Seviye Sensörü (Göstergeli) D-218', 'ultrasonik-seviye-sensoru-gostergeli-d-218', '{"detay_hazir_mi":false}', 'Seviye', 'D-218', 237
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Hvac Bimetal Thermometre Byk', 'hvac-bimetal-thermometre-byk', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hvac-bimetal-thermometre-byk.jpg"}}', 'Sıcaklık', NULL, 238
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Endüstriyel Termometre', 'endustriyel-termometre', '{"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-termometre.jpg"}}', 'Sıcaklık', NULL, 239
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Kontrol Cihazı D-222', 'kontrol-cihazi-d-222', '{"detay_hazir_mi":false}', 'Proses Kontrol', 'D-222', 240
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektro Pnömatik Pozisyoner 4 - 20 mA (LINEAR) D-165', 'elektro-pnomatik-pozisyoner-4-20-ma-linear-d-165', '{"detay_hazir_mi":false}', 'Proses Kontrol', NULL, 241
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektro Pnömatik Pozisyoner FeedBackli 4-20 mA (LINEAR) D-166 ıT', 'elektro-pnomatik-pozisyoner-feedbackli-4-20-ma-linear-d-166-it', '{"detay_hazir_mi":false}', 'Proses Kontrol', NULL, 242
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;

INSERT INTO `urunler` (`kategori_id`, `ad`, `slug`, `teknik_bilgiler`, `menu_kategori_adi`, `stok_kodu`, `siralama`)
SELECT `id`, 'Elektro Pnömatik Pozisyoner 4-20 mA (LINEAR) D-166', 'elektro-pnomatik-pozisyoner-4-20-ma-linear-d-166', '{"detay_hazir_mi":false}', 'Proses Kontrol', NULL, 243
FROM `kategoriler` WHERE `slug` = 'surgulu-vanalar'
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `teknik_bilgiler` = VALUES(`teknik_bilgiler`), `menu_kategori_adi` = VALUES(`menu_kategori_adi`), `stok_kodu` = VALUES(`stok_kodu`), `aktif_mi` = 1;


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

-- Canli demirvana.com sitesinden alinan gercek urun fotograflari (2026-09-13).
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/metal-sitli-surgulu-vana-f4-d-001.jpg') WHERE `slug` = 'metal-sitli-surgulu-vana-f4-d-001';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/akis-gostergesi-d-149.jpg') WHERE `slug` = 'akis-gostergesi-d-149';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ani-kapama-vanasi-duz-tip-d-155.jpg') WHERE `slug` = 'ani-kapama-vanasi-duz-tip-d-155';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ani-kapama-vanasi-kose-tip-d-119.jpg') WHERE `slug` = 'ani-kapama-vanasi-kose-tip-d-119';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/camur-sandigi-duz-tip-d-157.jpg') WHERE `slug` = 'camur-sandigi-duz-tip-d-157';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/camur-sandigi-kose-tip-d-205.jpg') WHERE `slug` = 'camur-sandigi-kose-tip-d-205';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/vana-sandigi-d-160.jpg') WHERE `slug` = 'vana-sandigi-d-160';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kose-drenaj-vanasi-d-206.jpg') WHERE `slug` = 'kose-drenaj-vanasi-d-206';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/suction-pislik-tutucu-d-207.jpg') WHERE `slug` = 'suction-pislik-tutucu-d-207';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/bronz-glob-vana-duz-kose-d-208.jpg') WHERE `slug` = 'bronz-glob-vana-duz-kose-d-208';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/bronz-yangin-vanasi-duz-kose-d-209.jpg') WHERE `slug` = 'bronz-yangin-vanasi-duz-kose-d-209';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/dissarj-vanasi-yayli-tip-duz-kose-d-084.jpg') WHERE `slug` = 'dissarj-vanasi-yayli-tip-duz-kose-d-084';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/129-iskandil-vanasi-d-086.jpg') WHERE `slug` = '129-iskandil-vanasi-d-086';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/hidrolik-kol-d-087.jpg') WHERE `slug` = 'hidrolik-kol-d-087';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/self-closing-vana-d-223.jpg') WHERE `slug` = 'self-closing-vana-d-223';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/firtina-vanasi-duz-tip-d-156.jpg') WHERE `slug` = 'firtina-vanasi-duz-tip-d-156';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/firtina-vanasi-kose-tip-d-224.jpg') WHERE `slug` = 'firtina-vanasi-kose-tip-d-224';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/metal-sitli-surgulu-vana-f5-d-003.jpg') WHERE `slug` = 'metal-sitli-surgulu-vana-f5-d-003';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elastomer-sitli-surgulu-vana-f4-d-010.jpg') WHERE `slug` = 'elastomer-sitli-surgulu-vana-f4-d-010';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elastomer-sitli-surgulu-vana-f5-d-385.jpg') WHERE `slug` = 'elastomer-sitli-surgulu-vana-f5-d-385';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yukselen-milli-surgulu-vana-f4-f5-d-008.jpg') WHERE `slug` = 'yukselen-milli-surgulu-vana-f4-f5-d-008';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/bicak-surgulu-vana-d-012-bicakli-vana.jpg') WHERE `slug` = 'bicak-surgulu-vana-d-012-bicakli-vana';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/flansli-kelebek-vana-d-113.jpg') WHERE `slug` = 'flansli-kelebek-vana-d-113';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/lug-kelebek-vana-d-036.jpg') WHERE `slug` = 'lug-kelebek-vana-d-036';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/wafer-kelebek-vana-d-032.jpg') WHERE `slug` = 'wafer-kelebek-vana-d-032';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/samandirali-vana-d-302.jpg') WHERE `slug` = 'samandirali-vana-d-302';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/diyafram-vana-d-085.jpg') WHERE `slug` = 'diyafram-vana-d-085';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/krepin-d-046.jpg') WHERE `slug` = 'krepin-d-046';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/3-yollu-vana-d-324.jpg') WHERE `slug` = '3-yollu-vana-d-324';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pislik-tutucu-d-041.jpg') WHERE `slug` = 'pislik-tutucu-d-041';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/3-parcali-tam-gecisli-kuresel-d-056.jpg') WHERE `slug` = '3-parcali-tam-gecisli-kuresel-d-056';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/2-parcali-tam-gecisli-kuresel-d-061.jpg') WHERE `slug` = '2-parcali-tam-gecisli-kuresel-d-061';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/calpara-cekvalf-flansli-d-026.jpg') WHERE `slug` = 'calpara-cekvalf-flansli-d-026';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cift-klapeli-cekvalf-d-020.jpg') WHERE `slug` = 'cift-klapeli-cekvalf-d-020';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/toplu-cekvalf-d-030.jpg') WHERE `slug` = 'toplu-cekvalf-d-030';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/dik-cekvalf-d-031.jpg') WHERE `slug` = 'dik-cekvalf-d-031';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/tilting-cekvalf-d-128.jpg') WHERE `slug` = 'tilting-cekvalf-d-128';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/hidrolik-frenli-tilting-cekvalf-d-131.jpg') WHERE `slug` = 'hidrolik-frenli-tilting-cekvalf-d-131';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/hidrolik-pompali-cek-kelebek-vana-d-133.jpg') WHERE `slug` = 'hidrolik-pompali-cek-kelebek-vana-d-133';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/class-150-300-600-surgulu-vana-d-240.jpg') WHERE `slug` = 'class-150-300-600-surgulu-vana-d-240';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yayli-dip-klapesi-d-045.jpg') WHERE `slug` = 'yayli-dip-klapesi-d-045';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/mono-blok-kuresel-vana-d-064.jpg') WHERE `slug` = 'mono-blok-kuresel-vana-d-064';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/tek-kureli-vantuz-d-123.jpg') WHERE `slug` = 'tek-kureli-vantuz-d-123';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cift-kureli-vantuz-d-124.jpg') WHERE `slug` = 'cift-kureli-vantuz-d-124';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/class-150-300-600-calpara-cekvalf-d-245.jpg') WHERE `slug` = 'class-150-300-600-calpara-cekvalf-d-245';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323.jpg') WHERE `slug` = 'seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/flapvana-klapet-kurbagalik-d-388.jpg') WHERE `slug` = 'flapvana-klapet-kurbagalik-d-388';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/karesel-surgulu-vana-d-011.jpg') WHERE `slug` = 'karesel-surgulu-vana-d-011';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/darbesiz-vantuz-d-304.jpg') WHERE `slug` = 'darbesiz-vantuz-d-304';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/glob-vana-d-069.jpg') WHERE `slug` = 'glob-vana-d-069';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/glob-vana-kumandali-cekvalf-kose-tip-d-072.jpg') WHERE `slug` = 'glob-vana-kumandali-cekvalf-kose-tip-d-072';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/buhar-basinc-dusurucu-d-066.jpg') WHERE `slug` = 'buhar-basinc-dusurucu-d-066';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-glob-tipi-kontrol-vanasi-d-067.jpg') WHERE `slug` = 'pnomatik-glob-tipi-kontrol-vanasi-d-067';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pistonlu-vana-d-076.jpg') WHERE `slug` = 'pistonlu-vana-d-076';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/metal-koruklu-glob-vana-d-073.jpg') WHERE `slug` = 'metal-koruklu-glob-vana-d-073';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yayli-cekvalf-d-078.jpg') WHERE `slug` = 'yayli-cekvalf-d-078';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yayli-emniyet-ventili-oransal-kalkisli-d-081.jpg') WHERE `slug` = 'yayli-emniyet-ventili-oransal-kalkisli-d-081';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/lift-loaded-safety-valve-d-082.jpg') WHERE `slug` = 'lift-loaded-safety-valve-d-082';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/emniyet-ventili-su-amonyak-azot.jpg') WHERE `slug` = 'emniyet-ventili-su-amonyak-azot';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ters-kovali-kondenstop-d-092.jpg') WHERE `slug` = 'ters-kovali-kondenstop-d-092';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/termostatik-vana-d-068.jpg') WHERE `slug` = 'termostatik-vana-d-068';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-kizgin-yag-vanasi-d-141.jpg') WHERE `slug` = 'pnomatik-kizgin-yag-vanasi-d-141';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kazan-blof-vanasi-d-093.jpg') WHERE `slug` = 'kazan-blof-vanasi-d-093';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/akis-gostergesi-gozetleme-camlari.jpg') WHERE `slug` = 'akis-gostergesi-gozetleme-camlari';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-diyafram-vana-d-325.jpg') WHERE `slug` = 'pnomatik-diyafram-vana-d-325';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067.jpg') WHERE `slug` = 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067.jpg') WHERE `slug` = 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-glob-tip-3-yollu-kontrol-vanasi-on-off-oransal-d-225.jpg') WHERE `slug` = 'pnomatik-glob-tip-3-yollu-kontrol-vanasi-on-off-oransal-d-225';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/buhar-basinc-dusurucu-kontrol-vanasi-d-066.jpg') WHERE `slug` = 'buhar-basinc-dusurucu-kontrol-vanasi-d-066';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/58-termostatik-vana-d-068.jpg') WHERE `slug` = '58-termostatik-vana-d-068';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/diyafram-aktuatorlu-kontrol-vanasi-d-227.jpg') WHERE `slug` = 'diyafram-aktuatorlu-kontrol-vanasi-d-227';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/piston-aktuatorlu-kontrol-vanasi-d-228.jpg') WHERE `slug` = 'piston-aktuatorlu-kontrol-vanasi-d-228';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-on-off-2-yollu-pistonlu-kontrol-vanasi-d-229.jpg') WHERE `slug` = 'pnomatik-on-off-2-yollu-pistonlu-kontrol-vanasi-d-229';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/62-pnomatik-kizgin-yag-vanasi-d-141.jpg') WHERE `slug` = '62-pnomatik-kizgin-yag-vanasi-d-141';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/basinc-ayar-vanasi-d-226.jpg') WHERE `slug` = 'basinc-ayar-vanasi-d-226';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pinch-vana-d-320.jpg') WHERE `slug` = 'pinch-vana-d-320';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pnomatik-pinch-cimdik-vana-d-321.jpg') WHERE `slug` = 'pnomatik-pinch-cimdik-vana-d-321';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-basinc-dusurucu-vana-pilot-tip-d-143.jpg') WHERE `slug` = 'su-basinc-dusurucu-vana-pilot-tip-d-143';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/duz-tip-su-basic-dusurucu-vana-d-143.jpg') WHERE `slug` = 'duz-tip-su-basic-dusurucu-vana-d-143';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/basinc-sabitleme-vanasi-d-143.jpg') WHERE `slug` = 'basinc-sabitleme-vanasi-d-143';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-darbesi-onleme-vanasi-d-144.jpg') WHERE `slug` = 'su-darbesi-onleme-vanasi-d-144';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/surge-anticipating-control-valve-d-144.jpg') WHERE `slug` = 'surge-anticipating-control-valve-d-144';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/seviye-kontrol-vanasi-d-145.jpg') WHERE `slug` = 'seviye-kontrol-vanasi-d-145';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/solenoid-kontrol-vanasi-d-147.jpg') WHERE `slug` = 'solenoid-kontrol-vanasi-d-147';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/debi-ayar-vanasi-d-148.jpg') WHERE `slug` = 'debi-ayar-vanasi-d-148';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/basinc-tahliye-vanasi-d-378.jpg') WHERE `slug` = 'basinc-tahliye-vanasi-d-378';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-flatorlu-seviye-kontrol-vanasi.jpg') WHERE `slug` = 'elektrik-flatorlu-seviye-kontrol-vanasi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/hidrolik-on-off-kontrol-vanasi-d-552.jpg') WHERE `slug` = 'hidrolik-on-off-kontrol-vanasi-d-552';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pompa-kontrol-vanasi-d-598.jpg') WHERE `slug` = 'pompa-kontrol-vanasi-d-598';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/duz-tip-samandrali-vana.jpg') WHERE `slug` = 'duz-tip-samandrali-vana';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/79-buhar-basinc-dusurucu-kontrol-vanasi-d-066.jpg') WHERE `slug` = '79-buhar-basinc-dusurucu-kontrol-vanasi-d-066';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-basinc-dusurucu-vana-y-tipi-cift-diyaframli-d-143.jpg') WHERE `slug` = 'su-basinc-dusurucu-vana-y-tipi-cift-diyaframli-d-143';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-basinc-dusurucu-vana-y-tipi-tek-diyaframli-d-143.jpg') WHERE `slug` = 'su-basinc-dusurucu-vana-y-tipi-tek-diyaframli-d-143';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-basinc-dusurucu-vana-endustriyel-tip-d-146.jpg') WHERE `slug` = 'su-basinc-dusurucu-vana-endustriyel-tip-d-146';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-gaz-amonyak-icin-basinc-dusurucu-regulatoru.jpg') WHERE `slug` = 'su-gaz-amonyak-icin-basinc-dusurucu-regulatoru';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/su-pirinc-basinc-dusurucu-vana-disli-d-333.jpg') WHERE `slug` = 'su-pirinc-basinc-dusurucu-vana-disli-d-333';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yerustu-yangin-hidranti-d-151.jpg') WHERE `slug` = 'yerustu-yangin-hidranti-d-151';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yeralti-yangin-hidranti-alttan-klapeli-d-152.jpg') WHERE `slug` = 'yeralti-yangin-hidranti-alttan-klapeli-d-152';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yeralti-yangin-hidranti-ustten-klapeli-d-152.jpg') WHERE `slug` = 'yeralti-yangin-hidranti-ustten-klapeli-d-152';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yeralti-yangin-hidranti-kurtagzi-d-359.jpg') WHERE `slug` = 'yeralti-yangin-hidranti-kurtagzi-d-359';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/disli-bronz-kelebek-vana-yangin-tip-d-232.jpg') WHERE `slug` = 'disli-bronz-kelebek-vana-yangin-tip-d-232';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/izlenebilir-kelebek-vana-yangin-tip-d-230.jpg') WHERE `slug` = 'izlenebilir-kelebek-vana-yangin-tip-d-230';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yivli-kelebek-vana-yangin-tip-d-231.jpg') WHERE `slug` = 'yivli-kelebek-vana-yangin-tip-d-231';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yukselen-milli-surgulu-vana-yangin-d-233.jpg') WHERE `slug` = 'yukselen-milli-surgulu-vana-yangin-d-233';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yangin-hidranti-kazan-d-154.jpg') WHERE `slug` = 'yangin-hidranti-kazan-d-154';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/fire-cekvalf-d-234.jpg') WHERE `slug` = 'fire-cekvalf-d-234';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/sabit-kaplin-d-297.jpg') WHERE `slug` = 'sabit-kaplin-d-297';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/flexible-coupling-d-298.jpg') WHERE `slug` = 'flexible-coupling-d-298';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yangin-vana-italyan-tip-d-301.jpg') WHERE `slug` = 'yangin-vana-italyan-tip-d-301';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yangin-rekoru-kaplin-ve-kapagi.jpg') WHERE `slug` = 'yangin-rekoru-kaplin-ve-kapagi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/flansli-yangin-vanasi.jpg') WHERE `slug` = 'flansli-yangin-vanasi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/islak-alarm-vanasi.jpg') WHERE `slug` = 'islak-alarm-vanasi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/izlenebilir-kebelek-vana.jpg') WHERE `slug` = 'izlenebilir-kebelek-vana';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/l-tipi-kuresel-vana-d-050.jpg') WHERE `slug` = 'l-tipi-kuresel-vana-d-050';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/paslanmaz-monoblok-kuresel-vana-d-052.jpg') WHERE `slug` = 'paslanmaz-monoblok-kuresel-vana-d-052';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/3-parcali-flansli-kuresel-vana-d-054-d-055.jpg') WHERE `slug` = '3-parcali-flansli-kuresel-vana-d-054-d-055';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/3-parcali-disli-kuresel-vana-d-049.jpg') WHERE `slug` = '3-parcali-disli-kuresel-vana-d-049';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/2-parcali-disli-kuresel-vana-d-047.jpg') WHERE `slug` = '2-parcali-disli-kuresel-vana-d-047';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/2-parcali-paslanmaz-flansli-kuresel-vana-d-376.jpg') WHERE `slug` = '2-parcali-paslanmaz-flansli-kuresel-vana-d-376';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/wafer-cekvalf-d-021.jpg') WHERE `slug` = 'wafer-cekvalf-d-021';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/calpara-cekvalf-disli-aisi-304-316-d-025.jpg') WHERE `slug` = 'calpara-cekvalf-disli-aisi-304-316-d-025';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/disko-cekvalf-aisi-d-017-aisi-d-018.jpg') WHERE `slug` = 'disko-cekvalf-aisi-d-017-aisi-d-018';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/113-gida-vanasi-d-246.jpg') WHERE `slug` = '113-gida-vanasi-d-246';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/igne-vana-d-159.jpg') WHERE `slug` = 'igne-vana-d-159';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/115-wafer-kelebek-vana-d-032.jpg') WHERE `slug` = '115-wafer-kelebek-vana-d-032';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/117-t-tipi-kuresel-vana-d-051.jpg') WHERE `slug` = '117-t-tipi-kuresel-vana-d-051';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/statik-balans-vanasi.jpg') WHERE `slug` = 'statik-balans-vanasi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/buhar-solenoid-vanalar-d-199.jpg') WHERE `slug` = 'buhar-solenoid-vanalar-d-199';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/grup-solenoid-vanalar.jpg') WHERE `slug` = 'grup-solenoid-vanalar';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/paslanmaz-solenoid-vanalar-d-197.jpg') WHERE `slug` = 'paslanmaz-solenoid-vanalar-d-197';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/solenoid-vana-zaman-rolesi.jpg') WHERE `slug` = 'solenoid-vana-zaman-rolesi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/vakum-solenoid-vanalar.jpg') WHERE `slug` = 'vakum-solenoid-vanalar';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/yakit-solenoid-vanalar.jpg') WHERE `slug` = 'yakit-solenoid-vanalar';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/tek-etkili-y-tipi-pistonlu-vana-d-202.jpg') WHERE `slug` = 'tek-etkili-y-tipi-pistonlu-vana-d-202';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/bobinli-patlac-valf.jpg') WHERE `slug` = 'bobinli-patlac-valf';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/doner-flansli-kompansator-d-099.jpg') WHERE `slug` = 'doner-flansli-kompansator-d-099';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kaynak-boyunlu-kompansator-d-106.jpg') WHERE `slug` = 'kaynak-boyunlu-kompansator-d-106';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/sabit-flansli-kompansator-d-103.jpg') WHERE `slug` = 'sabit-flansli-kompansator-d-103';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/distan-basincli-kompansator-d-111.jpg') WHERE `slug` = 'distan-basincli-kompansator-d-111';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kaucuk-kompansator-d-096.jpg') WHERE `slug` = 'kaucuk-kompansator-d-096';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/koruk-d-271.jpg') WHERE `slug` = 'koruk-d-271';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/izoleli-flexible-hortumu-d-120.jpg') WHERE `slug` = 'izoleli-flexible-hortumu-d-120';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/izolesiz-flexible-hortumu-d-299.jpg') WHERE `slug` = 'izolesiz-flexible-hortumu-d-299';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/orgulu-esnek-metal-hortum-d-142.jpg') WHERE `slug` = 'orgulu-esnek-metal-hortum-d-142';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/orgusuz-esnek-metal-hortum-d-300.jpg') WHERE `slug` = 'orgusuz-esnek-metal-hortum-d-300';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/duz-flans-d-290.jpg') WHERE `slug` = 'duz-flans-d-290';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kaynak-boyunlu-flans-d-291.jpg') WHERE `slug` = 'kaynak-boyunlu-flans-d-291';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/te-d-292.jpg') WHERE `slug` = 'te-d-292';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kep-d-293.jpg') WHERE `slug` = 'kep-d-293';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/dirsek-d-294.jpg') WHERE `slug` = 'dirsek-d-294';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/eksantrik-konsantrik-reduksiyonlar-d-295.jpg') WHERE `slug` = 'eksantrik-konsantrik-reduksiyonlar-d-295';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/demontaj-parcasi-d-135.jpg') WHERE `slug` = 'demontaj-parcasi-d-135';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/flans-adaptoru-d-296.jpg') WHERE `slug` = 'flans-adaptoru-d-296';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/163-sabit-kaplin-d-297.jpg') WHERE `slug` = '163-sabit-kaplin-d-297';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/esnek-kaplin-d-298.jpg') WHERE `slug` = 'esnek-kaplin-d-298';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/p-t-d-351.jpg') WHERE `slug` = 'p-t-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-e-d-351.jpg') WHERE `slug` = 'g-e-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-f-d-351.jpg') WHERE `slug` = 'g-f-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-mma-d-351.jpg') WHERE `slug` = 'g-mma-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-mmb-d-351.jpg') WHERE `slug` = 'g-mmb-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-mmg-d-351.jpg') WHERE `slug` = 'g-mmg-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-mmr-d-351.jpg') WHERE `slug` = 'g-mmr-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ffr-d-351.jpg') WHERE `slug` = 'ffr-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-q-d-351.jpg') WHERE `slug` = 'g-q-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ffq-d-351.jpg') WHERE `slug` = 'ffq-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-mg-d-351.jpg') WHERE `slug` = 'g-mg-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/x-kor-flans-d-351.jpg') WHERE `slug` = 'x-kor-flans-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/super-kolye-d-696.jpg') WHERE `slug` = 'super-kolye-d-696';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/g-ma-d-351.jpg') WHERE `slug` = 'g-ma-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/acb-f-d-351.jpg') WHERE `slug` = 'acb-f-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/son-kapama-parcasi-d-351.jpg') WHERE `slug` = 'son-kapama-parcasi-d-351';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/busakle-takim-d-007.jpg') WHERE `slug` = 'busakle-takim-d-007';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/182-yangin-rekoru-kaplin-ve-kapagi.jpg') WHERE `slug` = '182-yangin-rekoru-kaplin-ve-kapagi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrikli-aktuator-de-05.jpg') WHERE `slug` = 'rotary-on-off-elektrikli-aktuator-de-05';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-oransal-elektrik-aktuator-de-05p.jpg') WHERE `slug` = 'rotary-oransal-elektrik-aktuator-de-05p';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-10.jpg') WHERE `slug` = 'rotary-on-off-elektrik-aktuator-de-10';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-oransal-elektrik-aktuator-de-10p.jpg') WHERE `slug` = 'rotary-oransal-elektrik-aktuator-de-10p';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-20.jpg') WHERE `slug` = 'rotary-on-off-elektrik-aktuator-de-20';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-20p.jpg') WHERE `slug` = 'rotary-on-off-elektrik-aktuator-de-20p';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-kontrol-uniteli-elektrik-aktuator-de-20i.jpg') WHERE `slug` = 'rotary-kontrol-uniteli-elektrik-aktuator-de-20i';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cok-turlu-aktuator-on-off.jpg') WHERE `slug` = 'cok-turlu-aktuator-on-off';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-kontrol-uniteli-elektrikli-aktuator-de-05p-d-268.jpg') WHERE `slug` = 'rotary-kontrol-uniteli-elektrikli-aktuator-de-05p-d-268';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/3-yollu-vana-motoru-de-10-d-179.jpg') WHERE `slug` = '3-yollu-vana-motoru-de-10-d-179';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-60.jpg') WHERE `slug` = 'rotary-on-off-elektrik-aktuator-de-60';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-03.jpg') WHERE `slug` = 'rotary-on-off-elektrik-aktuator-de-03';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-on-off-elektrik-aktuator.jpg') WHERE `slug` = 'rotary-on-off-elektrik-aktuator';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/rotary-oransal-elektrik-aktuator.jpg') WHERE `slug` = 'rotary-oransal-elektrik-aktuator';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cift-etkili-pnomatik-aktuator-d-161.jpg') WHERE `slug` = 'cift-etkili-pnomatik-aktuator-d-161';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/tek-etkili-pnomatik-aktuator-10-yayli-d-339.jpg') WHERE `slug` = 'tek-etkili-pnomatik-aktuator-10-yayli-d-339';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187.jpg') WHERE `slug` = 'elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-aktuatorlu-kelebek-vana-lug-tip-d-188.jpg') WHERE `slug` = 'elektrik-aktuatorlu-kelebek-vana-lug-tip-d-188';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175.jpg') WHERE `slug` = 'elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177.jpg') WHERE `slug` = 'cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-kelebek-vana-wafer-tip-d-169.jpg') WHERE `slug` = 'cift-etkili-pnomatik-aktuatorlu-kelebek-vana-wafer-tip-d-169';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172.jpg') WHERE `slug` = 'cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-aktuatorlu-pvc-kuresel-vana-d-190.jpg') WHERE `slug` = 'elektrik-aktuatorlu-pvc-kuresel-vana-d-190';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-aktuatorlu-pirinc-kuresel-vana-d-189.jpg') WHERE `slug` = 'elektrik-aktuatorlu-pirinc-kuresel-vana-d-189';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/mini-elektrik-aktuatorlu-kuresel-vana-d-194.jpg') WHERE `slug` = 'mini-elektrik-aktuatorlu-kuresel-vana-d-194';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/aktuatorlu-flansli-kelebek-vana-d-269.jpg') WHERE `slug` = 'aktuatorlu-flansli-kelebek-vana-d-269';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/aktuatorlu-surgulu-vana-d-270.jpg') WHERE `slug` = 'aktuatorlu-surgulu-vana-d-270';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektrik-aktuatorlu-kuresel-vana-d-193.jpg') WHERE `slug` = 'elektrik-aktuatorlu-kuresel-vana-d-193';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/linear-pozisyoner-d-165.jpg') WHERE `slug` = 'linear-pozisyoner-d-165';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/linear-pozisyoner-feedback-d-166-it.jpg') WHERE `slug` = 'linear-pozisyoner-feedback-d-166-it';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/switch-box-d-164.jpg') WHERE `slug` = 'switch-box-d-164';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/namur-solenoid-yon-valfi-tek-bobinli-d-162.jpg') WHERE `slug` = 'namur-solenoid-yon-valfi-tek-bobinli-d-162';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/namur-solenoid-yon-valfi-cift-bobinli-d-162.jpg') WHERE `slug` = 'namur-solenoid-yon-valfi-cift-bobinli-d-162';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/i-p-cevirici-d-167.jpg') WHERE `slug` = 'i-p-cevirici-d-167';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/mekanik-woltman-tipi-debimetre-d-214.jpg') WHERE `slug` = 'mekanik-woltman-tipi-debimetre-d-214';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektromanyetik-debimetre-d-212.jpg') WHERE `slug` = 'elektromanyetik-debimetre-d-212';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ultrasonik-debimetre-d-213.jpg') WHERE `slug` = 'ultrasonik-debimetre-d-213';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/samandirali-debimetre-d-210.jpg') WHERE `slug` = 'samandirali-debimetre-d-210';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/metal-govdeli-samandirali-debimetre-d-211.jpg') WHERE `slug` = 'metal-govdeli-samandirali-debimetre-d-211';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/pedal-tip-akis-salterleri-d-215.jpg') WHERE `slug` = 'pedal-tip-akis-salterleri-d-215';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/basinc-sensoru-transmitteri-d-219.jpg') WHERE `slug` = 'basinc-sensoru-transmitteri-d-219';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/digital-ve-analog-manometre-d-220.jpg') WHERE `slug` = 'digital-ve-analog-manometre-d-220';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kuru-tip-alttan-cikisli-manometre.jpg') WHERE `slug` = 'kuru-tip-alttan-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/225-mini-elektrik-aktuatorlu-kuresel-vana-d-194.jpg') WHERE `slug` = '225-mini-elektrik-aktuatorlu-kuresel-vana-d-194';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/gliserin-tip-alttan-cikisli-manometreler.jpg') WHERE `slug` = 'gliserin-tip-alttan-cikisli-manometreler';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/gliserin-tip-arka-cikisli-manometreler.jpg') WHERE `slug` = 'gliserin-tip-arka-cikisli-manometreler';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg') WHERE `slug` = 'endustriyel-manometre-c1-1-6-alttan-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg') WHERE `slug` = 'endustriyel-manometre-c1-1-6-arka-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg') WHERE `slug` = 'endustriyel-manometre-c1-1-arka-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/231-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg') WHERE `slug` = '231-endustriyel-manometre-c1-1-arka-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg') WHERE `slug` = '232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg') WHERE `slug` = '233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/234-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg') WHERE `slug` = '234-endustriyel-manometre-c1-1-arka-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/235-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg') WHERE `slug` = '235-endustriyel-manometre-c1-1-arka-cikisli-manometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/manometre-baglanti-sifonu-d-570.jpg') WHERE `slug` = 'manometre-baglanti-sifonu-d-570';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/manometre-pano-baglanti-aparati.jpg') WHERE `slug` = 'manometre-pano-baglanti-aparati';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/manometre-flansi.jpg') WHERE `slug` = 'manometre-flansi';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/seviye-salterleri-d-217.jpg') WHERE `slug` = 'seviye-salterleri-d-217';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/ultrasonik-seviye-sensoru-gostergeli-d-218.jpg') WHERE `slug` = 'ultrasonik-seviye-sensoru-gostergeli-d-218';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/hvac-bimetal-thermometre-byk.jpg') WHERE `slug` = 'hvac-bimetal-thermometre-byk';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/endustriyel-termometre.jpg') WHERE `slug` = 'endustriyel-termometre';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/kontrol-cihazi-d-222.jpg') WHERE `slug` = 'kontrol-cihazi-d-222';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektro-pnomatik-pozisyoner-4-20-ma-linear-d-165.jpg') WHERE `slug` = 'elektro-pnomatik-pozisyoner-4-20-ma-linear-d-165';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektro-pnomatik-pozisyoner-feedbackli-4-20-ma-linear-d-166-it.jpg') WHERE `slug` = 'elektro-pnomatik-pozisyoner-feedbackli-4-20-ma-linear-d-166-it';
UPDATE `urunler` SET `teknik_bilgiler` = JSON_SET(`teknik_bilgiler`, '$.katalog_bilgileri.gorsel_yolu', '/assets/urunler/genel/elektro-pnomatik-pozisyoner-4-20-ma-linear-d-166.jpg') WHERE `slug` = 'elektro-pnomatik-pozisyoner-4-20-ma-linear-d-166';

-- Glob Vana D-069 icin tam urun detayi (canli demirvana.com kaynagindan, 2026-09-13).
UPDATE `urunler` SET `teknik_bilgiler` = '{"katalog_bilgileri":{"dn":"DN 15 - 600","standart":"Civatalı Kapaklı DIN Glob Vana","basinc":"PN 16 / 25 / 40 / 63 / 100 / 160","gorsel_yolu":"/assets/urunler/genel/glob-vana-d-069.jpg"},"urun_tanimi":{"baslik":"GLOB VANA","satirlar":["CİVATALI KAPAKLI GÖVDE","PN 16 / 25 / 40 / 63 / 100 / 160","FLANŞLI VEYA KAYNAK AĞIZLI BAĞLANTI","DÖKME DEMİR VEYA DÖKME ÇELİK GÖVDE"]},"basinc":"PN 16","teknik_cizim_yolu":"/assets/urunler/glob-vana-d-069/teknik-cizim.png","teknik_cizim_alt":"Glob vana teknik çizimi – D-069","parcalar":[{"no":"1","ad":"Gövde","malzeme":"EN-GJ 250"},{"no":"2","ad":"Kapak","malzeme":"EN-GJ 250"},{"no":"3","ad":"Oturma Yüzeyi","malzeme":"X20Cr13"},{"no":"4","ad":"Disk Oturma Yüzeyi","malzeme":"X20Cr13"},{"no":"5","ad":"Mil","malzeme":"X20Cr13"},{"no":"6","ad":"Arka Oturma (Bütünleşik)","malzeme":"EN-GJ 250"},{"no":"7","ad":"Salmastra Yatağı","malzeme":"1.0460"},{"no":"8","ad":"Boyunduruk Burcu","malzeme":"N/A"},{"no":"9","ad":"Volan","malzeme":"Çelik"},{"no":"10","ad":"Plaka","malzeme":"1.0460"},{"no":"11","ad":"Volan Somunu","malzeme":"1.0460"},{"no":"12","ad":"Civata","malzeme":"CK35"},{"no":"13","ad":"Somun","malzeme":"C35"},{"no":"14","ad":"Halka Civata","malzeme":"CK35"},{"no":"15","ad":"Somun","malzeme":"C35"},{"no":"16","ad":"Halka Civata Pimi","malzeme":"CK35"},{"no":"17","ad":"Conta","malzeme":"Paslanmaz Takviyeli Grafit"},{"no":"18","ad":"Salmastra","malzeme":"Grafit Halka & Sıyırıcı Halka"}],"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"anma_basinci_gruplari":[{"deger":"16","sutun":20}],"olculer":[{"grup":"Vana Boyutları\\nDIN Bolted Bonnet · FIG 1401","kod":"L","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","960","1100","1200","1250","1450"]},{"grup":"","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","315","340","405","460","520","580","640","715","840"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["160","165","190","200","225","260","280","320","375","415","460","550","570","750","900","1040","1290","1400","1600",""]},{"grup":"","kod":"H1","degerler":["164","170","197","208","235","273","297","340","400","447","498","594","620","813","975","1128","1390","1513","1725",""]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/glob-vana-d-069/Glob Vana D-069.pdf"},{"baslik":"Birim Fiyat Excel","aciklama":"Glob Vana D-069 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/glob-vana-d-069/Glob Vana D-069 Birim Fiyat.xlsx","belge_turu":"excel"}]}' WHERE `slug` = 'glob-vana-d-069';
