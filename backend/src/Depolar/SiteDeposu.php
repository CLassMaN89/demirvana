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
             WHERE mao.aktif_mi = 1 AND mo.aktif_mi = 1
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
        $kosullar = ['u.aktif_mi = 1', 'k.aktif_mi = 1'];
        $parametreler = [];

        if ($kategori !== null && $kategori !== '') {
            $kosullar[] = 'k.slug = :kategori';
            $parametreler['kategori'] = $kategori;
        }

        if ($arama !== null && trim($arama) !== '') {
            $kosullar[] = '(u.ad LIKE :arama OR u.kisa_aciklama LIKE :arama)';
            $parametreler['arama'] = '%' . trim($arama) . '%';
        }

        $sql = 'SELECT u.id, u.ad, u.slug, u.kisa_aciklama, u.teknik_bilgiler,
                       k.ad AS kategori_adi, k.slug AS kategori_slug
                FROM urunler u
                INNER JOIN kategoriler k ON k.id = u.kategori_id
                WHERE ' . implode(' AND ', $kosullar) . '
                ORDER BY u.siralama, u.id';
        $sorgu = $this->baglanti->prepare($sql);
        $sorgu->execute($parametreler);

        return $sorgu->fetchAll();
    }

    public function urun(string $slug): ?array
    {
        $sorgu = $this->baglanti->prepare(
            'SELECT u.id, u.ad, u.slug, u.kisa_aciklama, u.uzun_aciklama, u.teknik_bilgiler,
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
}
