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

INSERT INTO `site_ayarlari` (`anahtar`, `deger`, `deger_turu`, `aciklama`) VALUES
    ('site_adi', 'Demirvana', 'metin', 'Tarayıcı ve marka adı'),
    ('logo_yolu', '/assets/logo.png', 'gorsel', 'Navbar logo dosyası')
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `deger_turu` = VALUES(`deger_turu`);

INSERT INTO `tema_ayarlari` (`anahtar`, `deger`, `aciklama`, `siralama`) VALUES
    ('ana_mavi', '#28469D', 'Ana marka ve etkileşim rengi', 1),
    ('koyu_mavi', '#17306F', 'Koyu yüzey ve güçlü metin rengi', 2),
    ('acik_mavi', '#EAF1FF', 'Açık yüzey rengi', 3),
    ('beyaz', '#FFFFFF', 'Ana arka plan rengi', 4),
    ('metin', '#172033', 'Gövde metni rengi', 5),
    ('ikincil_metin', '#62708A', 'İkincil açıklama rengi', 6)
ON DUPLICATE KEY UPDATE `deger` = VALUES(`deger`), `aciklama` = VALUES(`aciklama`), `siralama` = VALUES(`siralama`);

INSERT INTO `menu_ogeleri` (`baslik`, `baglanti`, `siralama`) VALUES
    ('Anasayfa', '/', 1),
    ('Hakkımızda', '/hakkimizda', 2),
    ('Ürünler', '/urunler', 3),
    ('Üretim', '/uretim', 4),
    ('İletişim', '/iletisim', 5)
ON DUPLICATE KEY UPDATE `baslik` = VALUES(`baslik`), `siralama` = VALUES(`siralama`);

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
