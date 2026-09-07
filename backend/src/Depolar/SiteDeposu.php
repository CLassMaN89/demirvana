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
