<?php

declare(strict_types=1);

final class SiteDeposu
{
    public function __construct(private readonly PDO $baglanti)
    {
    }

    public function tema(): array
    {
        $sorgu = $this->baglanti->query(
            'SELECT anahtar, deger FROM tema_ayarlari WHERE aktif_mi = 1 ORDER BY siralama, id'
        );

        // Frontend tema servisi anahtar/değer nesnesi beklediği için satırları burada tek nesneye çeviririz.
        $tema = [];
        foreach ($sorgu->fetchAll() as $satir) {
            $tema[$satir['anahtar']] = $satir['deger'];
        }

        return $tema;
    }

    public function siteAyarlari(): array
    {
        $satirlar = $this->baglanti->query(
            'SELECT anahtar, deger FROM site_ayarlari WHERE aktif_mi = 1 ORDER BY id'
        )->fetchAll();

        return self::ayarNesnesiOlustur($satirlar);
    }

    public static function ayarNesnesiOlustur(array $satirlar): array
    {
        $ayarlar = [];
        foreach ($satirlar as $satir) {
            $ayarlar[$satir['anahtar']] = $satir['deger'];
        }

        return $ayarlar;
    }

    public function menu(): array
    {
        $ustMenu = $this->baglanti->query(
            'SELECT id, baslik, baglanti, siralama FROM menu_ogeleri WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        $altMenu = $this->baglanti->query(
            'SELECT mao.id, mao.menu_ogesi_id, mao.ust_alt_oge_id, mao.baslik, mao.baglanti, mao.siralama
             FROM menu_alt_ogeleri mao
             INNER JOIN menu_ogeleri mo ON mo.id = mao.menu_ogesi_id
             WHERE mao.aktif_mi = 1 AND mao.silinme_tarihi IS NULL AND mo.aktif_mi = 1
             ORDER BY mao.siralama, mao.id'
        )->fetchAll();

        return self::menuAgaciOlustur($ustMenu, $altMenu);
    }

    public static function menuAgaciOlustur(array $ustMenu, array $altMenu): array
    {
        $kokOgeler = [];
        $cocukOgeler = [];

        foreach ($altMenu as $oge) {
            if ($oge['ust_alt_oge_id'] === null) {
                $kokOgeler[(string) $oge['menu_ogesi_id']][] = $oge;
            } else {
                $cocukOgeler[(string) $oge['ust_alt_oge_id']][] = $oge;
            }
        }

        // Özyinelemeli kurulum üçüncü seviyeyi destekler ve gelecekte admin panelinin yeni derinlikler eklemesini engellemez.
        $cocuklariEkle = function (array $ogeler) use (&$cocuklariEkle, $cocukOgeler): array {
            return array_map(function (array $oge) use (&$cocuklariEkle, $cocukOgeler): array {
                $oge['alt_ogeler'] = $cocuklariEkle($cocukOgeler[(string) $oge['id']] ?? []);
                return $oge;
            }, $ogeler);
        };

        return array_map(function (array $oge) use ($kokOgeler, $cocuklariEkle): array {
            $oge['alt_ogeler'] = $cocuklariEkle($kokOgeler[(string) $oge['id']] ?? []);
            return $oge;
        }, $ustMenu);
    }

    public function sliderlar(): array
    {
        return $this->baglanti->query(
            'SELECT id, baslik, aciklama, gorsel_yolu, alternatif_metin, buton_metni, buton_baglantisi,
                    animasyon_turu, odak_x, odak_y, siralama
             FROM sliderlar WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();
    }

    public function kategoriler(): array
    {
        return $this->baglanti->query(
            'SELECT id, ad, slug, aciklama, gorsel_yolu, alternatif_metin, siralama
             FROM kategoriler WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();
    }

    public function fuarlar(): array
    {
        return $this->baglanti->query(
            'SELECT id, gorsel_yolu, alternatif_metin, siralama
             FROM fuar_gorselleri WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();
    }

    public function temsilcilikler(): array
    {
        return $this->baglanti->query(
            'SELECT id, dil_kodu, marka_adi, urun_grubu, baslik, aciklama, etiketler, logo_yolu,
                    logo_alternatif_metin, logo_alt_metni, urun_buton_metni, urun_baglantisi,
                    katalog_buton_metni, katalog_baglantisi, siralama
             FROM temsilcilikler WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();
    }

    public function bankaHesaplari(): array
    {
        return $this->baglanti->query(
            'SELECT id, banka_adi, hesap_basligi, para_birimi, iban, swift_kodu, sube, hesap_no, logo_yolu, siralama
             FROM banka_hesaplari WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();
    }

    /** Form mesajları admin panelinde sonradan okunabilmesi için hazırlanmış sorguyla saklanır. */
    public function iletisimMesajiKaydet(array $veri): int
    {
        $sorgu = $this->baglanti->prepare(
            'INSERT INTO iletisim_mesajlari (ad_soyad, eposta, telefon, firma, mesaj, veri_onayi_tarihi)
             VALUES (:ad_soyad, :eposta, :telefon, :firma, :mesaj, CURRENT_TIMESTAMP)'
        );
        $sorgu->execute($veri);
        return (int) $this->baglanti->lastInsertId();
    }

    public function referanslar(): array
    {
        $sektorler = $this->baglanti->query(
            'SELECT id, ad, slug, siralama
             FROM referans_sektorleri WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        $kayitlar = $this->baglanti->query(
            'SELECT r.id, r.baslik, r.konum, r.kurum, r.yil, r.bolge, r.siralama,
                    rs.ad AS sektor_adi, rs.slug AS sektor_slug
             FROM referanslar r
             LEFT JOIN referans_sektor_eslesmeleri rse ON rse.referans_id = r.id
             LEFT JOIN referans_sektorleri rs ON rs.id = rse.sektor_id AND rs.aktif_mi = 1
             WHERE r.aktif_mi = 1 ORDER BY r.siralama, r.id'
        )->fetchAll();

        $gorseller = $this->baglanti->query(
            'SELECT id, gorsel_yolu, alternatif_metin, odak_x, odak_y, gorsel_olcegi, siralama
             FROM referans_gorselleri WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        // İki dizi tek uçta dönerek sayfa açılışında ikinci bir ağ isteği ve olası içerik sıçramasını önler.
        return ['sektorler' => $sektorler, 'kayitlar' => $kayitlar, 'gorseller' => $gorseller];
    }

    public function kurumsal(): array
    {
        $degerler = $this->baglanti->query(
            'SELECT id, dil_kodu, baslik, aciklama, siralama
             FROM kurumsal_degerler WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        $urunGruplari = $this->baglanti->query(
            'SELECT id, dil_kodu, ad, sutun_no, siralama
             FROM kurumsal_urun_gruplari WHERE aktif_mi = 1 ORDER BY sutun_no, siralama, id'
        )->fetchAll();

        $ekip = $this->baglanti->query(
            'SELECT id, dil_kodu, ad_soyad, gorev, eposta, telefon, siralama
             FROM kurumsal_ekip WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        // Tekrarlanabilir kurumsal alanları tek uçta toplamak, admin sıralamalarının aynı görünümde tutarlı kalmasını sağlar.
        return ['degerler' => $degerler, 'urun_gruplari' => $urunGruplari, 'ekip' => $ekip];
    }

    public function teknikDokumanlar(): array
    {
        $kategoriler = $this->baglanti->query(
            'SELECT id, dil_kodu, ad, slug, aciklama, ikon_adi, siralama
             FROM teknik_dokuman_kategorileri
             WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        $dokumanlar = $this->baglanti->query(
            'SELECT td.id, td.kategori_id, td.baslik, td.slug, td.orijinal_dosya_adi,
                    td.alternatif_aciklama, td.dosya_boyutu, td.sayfa_sayisi,
                    td.indirmeye_izin_var_mi, td.yeni_sekmede_acmaya_izin_var_mi, td.siralama
             FROM teknik_dokumanlar td
             INNER JOIN teknik_dokuman_kategorileri tdk ON tdk.id = td.kategori_id
             WHERE td.aktif_mi = 1 AND tdk.aktif_mi = 1
             ORDER BY td.siralama, td.id'
        )->fetchAll();

        return self::teknikDokumanAgaciOlustur($kategoriler, $dokumanlar);
    }

    public static function teknikDokumanAgaciOlustur(array $kategoriler, array $dokumanlar): array
    {
        $kategoriIndeksi = [];
        foreach ($kategoriler as $indeks => $kategori) {
            $kategoriler[$indeks]['dokumanlar'] = [];
            $kategoriIndeksi[(int) $kategori['id']] = $indeks;
        }

        // Dosyanın gerçek konumu dışarı açılmaz; ziyaretçi yalnız kayıtlı slug üzerinden belgeye erişir.
        foreach ($dokumanlar as $dokuman) {
            $kategoriId = (int) $dokuman['kategori_id'];
            if (!isset($kategoriIndeksi[$kategoriId])) {
                continue;
            }
            unset($dokuman['kategori_id']);
            $dokuman['dosya_adresi'] = '/dokumanlar/' . $dokuman['slug'];
            $kategoriler[$kategoriIndeksi[$kategoriId]]['dokumanlar'][] = $dokuman;
        }

        return $kategoriler;
    }

    public function teknikDokuman(string $slug): ?array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT td.*
             FROM teknik_dokumanlar td
             INNER JOIN teknik_dokuman_kategorileri tdk ON tdk.id = td.kategori_id
             WHERE td.slug = :slug AND td.aktif_mi = 1 AND tdk.aktif_mi = 1 LIMIT 1'
        );
        $sorgu->execute(['slug' => $slug]);
        $dokuman = $sorgu->fetch();

        return $dokuman ?: null;
    }

    public function sertifikalar(): array
    {
        $kategoriler = $this->baglanti->query(
            'SELECT id, dil_kodu, ad, slug, siralama
             FROM sertifika_kategorileri WHERE aktif_mi = 1 ORDER BY siralama, id'
        )->fetchAll();

        $kayitlar = $this->baglanti->query(
            'SELECT s.id, s.kategori_id, s.dil_kodu, s.baslik, s.slug, s.aciklama,
                    s.orijinal_dosya_adi, s.onizleme_yolu, s.alternatif_metin,
                    s.dosya_boyutu, s.sayfa_sayisi, s.indirmeye_izin_var_mi,
                    s.yeni_sekmede_acmaya_izin_var_mi, s.siralama,
                    sk.ad AS kategori_adi, sk.slug AS kategori_slug
             FROM sertifikalar s
             INNER JOIN sertifika_kategorileri sk ON sk.id = s.kategori_id
             WHERE s.aktif_mi = 1 AND sk.aktif_mi = 1
             ORDER BY s.siralama, s.id'
        )->fetchAll();

        // Güvenli istemci adresi veritabanındaki fiziksel dosya yolunun dışarı sızmasını önler.
        foreach ($kayitlar as &$kayit) {
            $kayit['dosya_adresi'] = '/sertifika-dosyalari/' . $kayit['slug'];
        }
        unset($kayit);

        return ['kategoriler' => $kategoriler, 'kayitlar' => $kayitlar];
    }

    public function sertifika(string $slug): ?array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT s.* FROM sertifikalar s
             INNER JOIN sertifika_kategorileri sk ON sk.id = s.kategori_id
             WHERE s.slug = :slug AND s.aktif_mi = 1 AND sk.aktif_mi = 1 LIMIT 1'
        );
        $sorgu->execute(['slug' => $slug]);
        $sertifika = $sorgu->fetch();

        return $sertifika ?: null;
    }

    public function kategori(string $slug): ?array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT id, ad, slug, aciklama, gorsel_yolu, alternatif_metin
             FROM kategoriler WHERE slug = :slug AND aktif_mi = 1 LIMIT 1'
        );
        $sorgu->execute(['slug' => $slug]);
        $kategori = $sorgu->fetch();

        if (!$kategori) {
            return null;
        }

        $kategori['urunler'] = $this->urunler($slug);
        return $kategori;
    }

    public function urunler(?string $kategori = null, ?string $arama = null): array
    {
        // u.menu_kategori_adi, urunun gercekten filtrelendigi 21 kategoriden birinin (menu_alt_ogeleri.baslik)
        // metin karsiligidir. Bu kategori admin panelinden pasife alinirsa, urun eski (legacy) kategoriler
        // tablosunda hala aktif gorunse bile artik hicbir yerde (Tum Urunler dahil) gosterilmemelidir.
        $kosullar = [
            'u.aktif_mi = 1',
            'k.aktif_mi = 1',
            '(u.menu_kategori_adi IS NULL OR u.menu_kategori_adi NOT IN (SELECT baslik FROM menu_alt_ogeleri WHERE aktif_mi = 0))'
        ];
        $parametreler = [];

        if ($kategori !== null && $kategori !== '') {
            $kosullar[] = 'k.slug = :kategori';
            $parametreler['kategori'] = $kategori;
        }

        if ($arama !== null && trim($arama) !== '') {
            $kosullar[] = '(u.ad LIKE :arama OR u.kisa_aciklama LIKE :arama)';
            $parametreler['arama'] = '%' . trim($arama) . '%';
        }

        $sql = 'SELECT u.id, u.ad, u.slug, u.kisa_aciklama, u.teknik_bilgiler, u.menu_kategori_adi,
                       k.ad AS kategori_adi, k.slug AS kategori_slug
                FROM urunler u
                INNER JOIN kategoriler k ON k.id = u.kategori_id
                WHERE ' . implode(' AND ', $kosullar) . '
                ORDER BY u.siralama, u.id';
        $sorgu = $this->baglanti->prepare($sql);
        $sorgu->execute($parametreler);

        return $sorgu->fetchAll();
    }

    /**
     * Kategori Yönetimi sayfasının veri kaynağı: genel /api/baslangic menüsünün aksine
     * pasif (aktif_mi=0) kategorileri de, ürün sayısını ve son güncelleme tarihini de döner.
     */
    public function kategoriYonetimVerisi(): array
    {
        $ustMenu = $this->baglanti->query(
            "SELECT id FROM menu_ogeleri WHERE baglanti = '/urunler' AND aktif_mi = 1 LIMIT 1"
        )->fetch();
        if (!$ustMenu) {
            return [];
        }

        $gruplarSorgusu = $this->baglanti->prepare(
            'SELECT id, baslik, baglanti, siralama, aktif_mi
             FROM menu_alt_ogeleri
             WHERE menu_ogesi_id = :menu_ogesi_id AND ust_alt_oge_id IS NULL AND silinme_tarihi IS NULL
             ORDER BY siralama, id'
        );
        $gruplarSorgusu->execute(['menu_ogesi_id' => $ustMenu['id']]);
        $gruplar = $gruplarSorgusu->fetchAll();

        $kategorilerSorgusu = $this->baglanti->prepare(
            'SELECT mao.id, mao.ust_alt_oge_id, mao.baslik, mao.baglanti, mao.siralama, mao.aktif_mi,
                    mao.guncellenme_tarihi,
                    (SELECT COUNT(*) FROM urunler u WHERE u.aktif_mi = 1 AND u.menu_kategori_adi = mao.baslik) AS urun_sayisi
             FROM menu_alt_ogeleri mao
             WHERE mao.menu_ogesi_id = :menu_ogesi_id AND mao.ust_alt_oge_id IS NOT NULL AND mao.silinme_tarihi IS NULL
             ORDER BY mao.siralama, mao.id'
        );
        $kategorilerSorgusu->execute(['menu_ogesi_id' => $ustMenu['id']]);
        $kategoriler = $kategorilerSorgusu->fetchAll();

        $gruplandirilmis = [];
        foreach ($kategoriler as $kategori) {
            $kategori['urun_sayisi'] = (int) $kategori['urun_sayisi'];
            $gruplandirilmis[(string) $kategori['ust_alt_oge_id']][] = $kategori;
        }

        return array_map(static function (array $grup) use ($gruplandirilmis): array {
            $grup['alt_ogeler'] = $gruplandirilmis[(string) $grup['id']] ?? [];
            return $grup;
        }, $gruplar);
    }

    /** Admin panelindeki kategori kartlarının kaynağı; ürün filtrelemesinde kullanılan asıl menü yaprakları budur. */
    public function kategoriBul(int $id): ?array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT id, menu_ogesi_id, ust_alt_oge_id, baslik, baglanti, siralama, aktif_mi
             FROM menu_alt_ogeleri WHERE id = :id LIMIT 1'
        );
        $sorgu->execute(['id' => $id]);
        $satir = $sorgu->fetch();

        return $satir ?: null;
    }

    /** Log kayıtlarında "hangi ana grup altında" bilgisini göstermek için kullanılır. */
    public function altOgeBasligiBul(int $id): ?string
    {
        $sorgu = $this->baglanti->prepare('SELECT baslik FROM menu_alt_ogeleri WHERE id = :id LIMIT 1');
        $sorgu->execute(['id' => $id]);
        $baslik = $sorgu->fetchColumn();

        return $baslik !== false ? (string) $baslik : null;
    }

    public function kategoriEkle(int $ustAltOgeId, string $baslik, ?string $baglantiDegeri, int $siralama): array
    {
        $ustSorgusu = $this->baglanti->prepare(
            'SELECT menu_ogesi_id FROM menu_alt_ogeleri WHERE id = :id AND aktif_mi = 1 AND silinme_tarihi IS NULL LIMIT 1'
        );
        $ustSorgusu->execute(['id' => $ustAltOgeId]);
        $ust = $ustSorgusu->fetch();
        if (!$ust) {
            throw new InvalidArgumentException('Üst kategori grubu bulunamadı.');
        }

        $baglantiDegeri = $this->benzersizBaglantiUret(
            $baglantiDegeri !== null && trim($baglantiDegeri) !== '' ? trim($baglantiDegeri) : self::slugOlustur($baslik)
        );

        $sorgu = $this->baglanti->prepare(
            'INSERT INTO menu_alt_ogeleri (menu_ogesi_id, ust_alt_oge_id, baslik, baglanti, siralama)
             VALUES (:menu_ogesi_id, :ust_alt_oge_id, :baslik, :baglanti, :siralama)'
        );
        $sorgu->execute([
            'menu_ogesi_id' => $ust['menu_ogesi_id'],
            'ust_alt_oge_id' => $ustAltOgeId,
            'baslik' => $baslik,
            'baglanti' => $baglantiDegeri,
            'siralama' => $siralama,
        ]);

        return $this->kategoriBul((int) $this->baglanti->lastInsertId());
    }

    public function kategoriGuncelle(int $id, array $alanlar): void
    {
        $izinliAlanlar = ['baslik', 'siralama', 'aktif_mi'];
        $atamalar = [];
        $parametreler = ['id' => $id];
        foreach ($izinliAlanlar as $alan) {
            if (array_key_exists($alan, $alanlar)) {
                $atamalar[] = "{$alan} = :{$alan}";
                $parametreler[$alan] = $alanlar[$alan];
            }
        }

        if ($atamalar === []) {
            return;
        }

        // Ürünler kategoriye id ile değil, menu_kategori_adi metniyle bağlı; başlık değişirse ürünler
        // eski isme takılı kalıp "kaybolmasın" diye aynı işlemde onlar da yeni başlığa taşınır.
        $eskiBaslik = null;
        if (array_key_exists('baslik', $alanlar)) {
            $mevcut = $this->kategoriBul($id);
            $eskiBaslik = $mevcut['baslik'] ?? null;
        }

        $this->baglanti->beginTransaction();
        try {
            $sql = 'UPDATE menu_alt_ogeleri SET ' . implode(', ', $atamalar) . ' WHERE id = :id';
            $this->baglanti->prepare($sql)->execute($parametreler);

            if ($eskiBaslik !== null && $eskiBaslik !== $alanlar['baslik']) {
                $this->baglanti->prepare(
                    'UPDATE urunler SET menu_kategori_adi = :yeni WHERE menu_kategori_adi = :eski'
                )->execute(['yeni' => $alanlar['baslik'], 'eski' => $eskiBaslik]);
            }

            $this->baglanti->commit();
        } catch (Throwable $hata) {
            $this->baglanti->rollBack();
            throw $hata;
        }
    }

    /**
     * "Çöp kutusu" silme: satır hemen kalıcı silinmez, silinme_tarihi damgalanır. Kategori bu anda
     * hem admin listesinden hem herkese açık siteden kaybolur (diğer sorgular silinme_tarihi IS NULL
     * arar) ama 7 gün boyunca Loglar sayfasından geri alınabilir; süre dolunca supurSilinenleri()
     * kalıcı olarak siler. kategoriyeBagliUrunSayisi kontrolü ürün bağlıysa denetleyicide zaten reddediyor.
     */
    public function kategoriSil(int $id): void
    {
        $this->baglanti->prepare('UPDATE menu_alt_ogeleri SET silinme_tarihi = NOW() WHERE id = :id')->execute(['id' => $id]);
    }

    public function kategoriGeriAl(int $id): bool
    {
        $sorgu = $this->baglanti->prepare(
            'UPDATE menu_alt_ogeleri SET silinme_tarihi = NULL
             WHERE id = :id AND silinme_tarihi IS NOT NULL AND silinme_tarihi > (NOW() - INTERVAL 7 DAY)'
        );
        $sorgu->execute(['id' => $id]);

        return $sorgu->rowCount() > 0;
    }

    /** grup_baslik NULL ise silinen kaydın kendisi bir ana grup demektir (Vana/Aktüatör/Otomasyon). */
    public function silinmisKategorileriGetir(): array
    {
        return $this->baglanti->query(
            "SELECT mao.id, mao.baslik, mao.ust_alt_oge_id, mao.silinme_tarihi,
                    ust.baslik AS grup_baslik,
                    DATEDIFF(mao.silinme_tarihi + INTERVAL 7 DAY, NOW()) AS kalan_gun
             FROM menu_alt_ogeleri mao
             LEFT JOIN menu_alt_ogeleri ust ON ust.id = mao.ust_alt_oge_id
             WHERE mao.silinme_tarihi IS NOT NULL AND mao.silinme_tarihi > (NOW() - INTERVAL 7 DAY)
             ORDER BY mao.silinme_tarihi DESC"
        )->fetchAll();
    }

    /** 7 günlük geri alma süresi dolan kategorileri kalıcı olarak siler; her admin isteğinde çağrılır. */
    public function supurSilinenleri(): void
    {
        $this->baglanti->exec(
            'DELETE FROM menu_alt_ogeleri WHERE silinme_tarihi IS NOT NULL AND silinme_tarihi <= (NOW() - INTERVAL 7 DAY)'
        );
    }

    public function kategoriyeBagliUrunSayisi(string $baslik): int
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT COUNT(*) AS adet FROM urunler WHERE aktif_mi = 1 AND menu_kategori_adi = :baslik'
        );
        $sorgu->execute(['baslik' => $baslik]);

        return (int) $sorgu->fetch()['adet'];
    }

    private static function slugOlustur(string $metin): string
    {
        $degisim = ['ç' => 'c', 'Ç' => 'c', 'ğ' => 'g', 'Ğ' => 'g', 'ı' => 'i', 'İ' => 'i', 'ö' => 'o', 'Ö' => 'o', 'ş' => 's', 'Ş' => 's', 'ü' => 'u', 'Ü' => 'u'];
        $metin = strtr($metin, $degisim);
        $metin = function_exists('iconv') ? (iconv('UTF-8', 'ASCII//TRANSLIT', $metin) ?: $metin) : $metin;
        $metin = strtolower((string) $metin);
        $metin = (string) preg_replace('/[^a-z0-9]+/', '-', $metin);

        return trim($metin, '-') ?: 'kategori';
    }

    private function benzersizBaglantiUret(string $baglanti): string
    {
        $aday = $baglanti;
        $sayac = 2;
        $kontrol = $this->baglanti->prepare('SELECT id FROM menu_alt_ogeleri WHERE baglanti = :baglanti LIMIT 1');
        while (true) {
            $kontrol->execute(['baglanti' => $aday]);
            if (!$kontrol->fetch()) {
                return $aday;
            }
            $aday = $baglanti . '-' . $sayac;
            $sayac++;
        }
    }

    public function urun(string $slug): ?array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT u.id, u.ad, u.slug, u.kisa_aciklama, u.uzun_aciklama, u.teknik_bilgiler, u.menu_kategori_adi,
                    k.ad AS kategori_adi, k.slug AS kategori_slug
             FROM urunler u
             INNER JOIN kategoriler k ON k.id = u.kategori_id
             WHERE u.slug = :slug AND u.aktif_mi = 1 AND k.aktif_mi = 1 LIMIT 1'
        );
        $sorgu->execute(['slug' => $slug]);
        $urun = $sorgu->fetch();

        if (!$urun) {
            return null;
        }

        $gorselSorgusu = $this->baglanti->prepare(
            'SELECT id, gorsel_yolu, alternatif_metin, siralama
             FROM urun_gorselleri WHERE urun_id = :urun_id AND aktif_mi = 1 ORDER BY siralama, id'
        );
        $gorselSorgusu->execute(['urun_id' => $urun['id']]);
        $urun['gorseller'] = $gorselSorgusu->fetchAll();

        return $urun;
    }

    /**
     * Kimlik dogrulama sistemi olmadigi icin ziyaretci/admin islemleri bir kullaniciya degil yalnizca
     * IP adresine baglanir. MAC adresi hicbir tarayici tarafindan web sitelerine verilmedigi icin
     * (guvenlik/gizlilik kisitlamasi) burada da tutulmuyor.
     */
    public function ziyaretKaydet(string $ipAdresi, ?string $kullaniciAjani, string $yol, ?string $referans): void
    {
        $sorgu = $this->baglanti->prepare(
            'INSERT INTO ziyaret_kayitlari (ip_adresi, kullanici_ajani, yol, referans)
             VALUES (:ip, :ajan, :yol, :referans)'
        );
        $sorgu->execute([
            'ip' => $ipAdresi,
            'ajan' => $kullaniciAjani !== null ? substr($kullaniciAjani, 0, 255) : null,
            'yol' => substr($yol, 0, 255),
            'referans' => $referans !== null ? substr($referans, 0, 255) : null,
        ]);
    }

    public function ziyaretleriGetir(int $limit, int $offset): array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT id, ip_adresi, kullanici_ajani, yol, referans, olusturulma_tarihi
             FROM ziyaret_kayitlari ORDER BY olusturulma_tarihi DESC LIMIT :limit OFFSET :offset'
        );
        $sorgu->bindValue('limit', $limit, PDO::PARAM_INT);
        $sorgu->bindValue('offset', $offset, PDO::PARAM_INT);
        $sorgu->execute();

        return $sorgu->fetchAll();
    }

    public function ziyaretIstatistikleri(): array
    {
        $toplam = (int) $this->baglanti->query('SELECT COUNT(*) FROM ziyaret_kayitlari')->fetchColumn();
        $benzersizIp = (int) $this->baglanti->query('SELECT COUNT(DISTINCT ip_adresi) FROM ziyaret_kayitlari')->fetchColumn();
        $bugun = (int) $this->baglanti->query(
            'SELECT COUNT(*) FROM ziyaret_kayitlari WHERE DATE(olusturulma_tarihi) = CURDATE()'
        )->fetchColumn();

        $enCokGorulenler = $this->baglanti->query(
            'SELECT yol, COUNT(*) AS adet FROM ziyaret_kayitlari
             GROUP BY yol ORDER BY adet DESC LIMIT 10'
        )->fetchAll();

        return [
            'toplam_goruntuleme' => $toplam,
            'benzersiz_ip_sayisi' => $benzersizIp,
            'bugunku_goruntuleme' => $bugun,
            'en_cok_goruntulenen_sayfalar' => $enCokGorulenler,
        ];
    }

    public function islemKaydet(string $ipAdresi, string $eylem, string $hedefTuru, ?int $hedefId, ?string $detay): void
    {
        $sorgu = $this->baglanti->prepare(
            'INSERT INTO admin_islem_kayitlari (ip_adresi, eylem, hedef_turu, hedef_id, detay)
             VALUES (:ip, :eylem, :hedef_turu, :hedef_id, :detay)'
        );
        $sorgu->execute([
            'ip' => $ipAdresi,
            'eylem' => $eylem,
            'hedef_turu' => $hedefTuru,
            'hedef_id' => $hedefId,
            'detay' => $detay !== null ? substr($detay, 0, 255) : null,
        ]);
    }

    public function islemleriGetir(int $limit, int $offset): array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT id, ip_adresi, eylem, hedef_turu, hedef_id, detay, olusturulma_tarihi
             FROM admin_islem_kayitlari ORDER BY olusturulma_tarihi DESC LIMIT :limit OFFSET :offset'
        );
        $sorgu->bindValue('limit', $limit, PDO::PARAM_INT);
        $sorgu->bindValue('offset', $offset, PDO::PARAM_INT);
        $sorgu->execute();

        return $sorgu->fetchAll();
    }
}
