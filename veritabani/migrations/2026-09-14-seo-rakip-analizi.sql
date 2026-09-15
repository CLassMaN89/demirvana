CREATE TABLE IF NOT EXISTS `seo_rakipleri` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ad` VARCHAR(100) NOT NULL,
    `ana_adres` VARCHAR(255) NOT NULL,
    `bizim_sitemiz_mi` TINYINT(1) NOT NULL DEFAULT 0,
    `aktif_mi` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `seo_rakip_adres` (`ana_adres`)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `seo_rakip_taramalari` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `rakip_id` INT UNSIGNED NOT NULL,
    `http_durumu` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `yanit_suresi_ms` INT UNSIGNED NOT NULL DEFAULT 0,
    `seo_puani` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `baslik_uzunlugu` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `meta_uzunlugu` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `h1_sayisi` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `kelime_sayisi` INT UNSIGNED NOT NULL DEFAULT 0,
    `baglanti_sayisi` INT UNSIGNED NOT NULL DEFAULT 0,
    `schema_sayisi` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `sitemap_url_sayisi` INT UNSIGNED NOT NULL DEFAULT 0,
    `hata_mesaji` VARCHAR(500) NULL,
    `tarama_tarihi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `seo_rakip_tarama` (`rakip_id`, `tarama_tarihi`),
    CONSTRAINT `fk_seo_rakip_tarama` FOREIGN KEY (`rakip_id`) REFERENCES `seo_rakipleri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;

-- 2026-09-15: Her canlı taramada herkese açık içerikten çıkarılan terimler saklanır.
ALTER TABLE `seo_rakip_taramalari`
    ADD COLUMN IF NOT EXISTS `anahtar_kelimeler_json` LONGTEXT NULL AFTER `sitemap_url_sayisi`;

INSERT INTO `seo_rakipleri` (`ad`, `ana_adres`, `bizim_sitemiz_mi`) VALUES
    ('Demir Vana', 'https://www.demirvana.com/', 1),
    ('Duyar', 'https://www.duyar.com/', 0),
    ('FAF', 'https://www.fafvana.com.tr/', 0),
    ('Dikkaya', 'https://www.dikkaya.com/', 0),
    ('Ayvaz', 'https://www.ayvaz.com/', 0)
ON DUPLICATE KEY UPDATE `ad` = VALUES(`ad`), `bizim_sitemiz_mi` = VALUES(`bizim_sitemiz_mi`), `aktif_mi` = 1;
