CREATE TABLE IF NOT EXISTS `seo_site_taramalari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `durum` ENUM('calisiyor', 'tamamlandi', 'hata') NOT NULL DEFAULT 'calisiyor',
    `toplam_url` INT UNSIGNED NOT NULL DEFAULT 0,
    `sorun_sayisi` INT UNSIGNED NOT NULL DEFAULT 0,
    `saglik_puani` TINYINT UNSIGNED NULL,
    `hata_mesaji` VARCHAR(500) NULL,
    `baslama_tarihi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `bitis_tarihi` DATETIME NULL,
    PRIMARY KEY (`id`),
    KEY `seo_tarama_durum_tarih` (`durum`, `baslama_tarihi`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `seo_site_sorunlari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tarama_id` BIGINT UNSIGNED NOT NULL,
    `url_yolu` VARCHAR(500) NOT NULL,
    `sorun_turu` VARCHAR(80) NOT NULL,
    `onem` ENUM('kritik', 'yuksek', 'orta', 'dusuk', 'bilgi') NOT NULL,
    `aciklama` VARCHAR(500) NOT NULL,
    `onerilen_duzeltme` VARCHAR(500) NOT NULL,
    `tespit_tarihi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `seo_sorun_tarama` (`tarama_id`),
    KEY `seo_sorun_onem` (`onem`, `tespit_tarihi`),
    CONSTRAINT `fk_seo_sorun_tarama` FOREIGN KEY (`tarama_id`) REFERENCES `seo_site_taramalari` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
