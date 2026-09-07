import os
import json
import sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright


PROJE = Path(__file__).resolve().parents[1]
CIKTI = PROJE / "test-ciktilari"
CIKTI.mkdir(exist_ok=True)
TEST_ADRESI = os.environ.get("DEMIRVANA_TEST_ADRESI", "http://127.0.0.1:5176")
GERCEK_API = os.environ.get("DEMIRVANA_GERCEK_API") == "1"
sys.stdout.reconfigure(encoding="utf-8")

VANA_MENU_KATEGORILERI = [
    {"id": 310 + sira, "baslik": baslik, "baglanti": f"/urunler/{slug}", "alt_ogeler": []}
    for sira, (baslik, slug) in enumerate(
        (
            ("Yangın Vanaları", "yangin-vanalari"),
            ("Su Grubu Vanaları", "su-grubu-vanalari"),
            ("Buhar Grubu Vanaları", "buhar-grubu-vanalari"),
            ("Kontrol Vanaları", "kontrol-vanalari"),
            ("Hidrolik Vanalar", "hidrolik-vanalar"),
            ("Basınç Düşürücü Vanalar", "basinc-dusurucu-vanalar"),
            ("Paslanmaz Vanalar", "paslanmaz-vanalar"),
            ("Gemi Vanaları", "gemi-vanalari"),
            ("Balans Vanaları", "balans-vanalari"),
            ("Solenoid Patlaç Pistonlu", "solenoid-patlac-pistonlu"),
            ("Kompansatörler", "kompansatorler"),
            ("Bağlantı Parçaları", "baglanti-parcalari"),
        )
    )
]

AKTUATOR_MENU_KATEGORILERI = [
    {"id": 330 + sira, "baslik": baslik, "baglanti": f"/urunler/{slug}", "alt_ogeler": []}
    for sira, (baslik, slug) in enumerate(
        (
            ("Elektrik Aktüatörler", "elektrik-aktuatorler"),
            ("Pnömatik Aktüatör", "pnomatik-aktuator"),
            ("Aktüatörlü Vanalar", "aktuatorlu-vanalar"),
            ("Aksesuarlar", "aktuator-aksesuarlari"),
        )
    )
]

API_VERILERI = {
    "/api/tema": {
        "ana_mavi": "#28469D", "koyu_mavi": "#17306F", "acik_mavi": "#EAF1FF",
        "beyaz": "#FFFFFF", "metin": "#172033", "ikincil_metin": "#62708A",
    },
    "/api/menu": [
        {"id": 1, "baslik": "Anasayfa", "baglanti": "/", "siralama": 1, "alt_ogeler": []},
        {"id": 2, "baslik": "Kurumsal", "baglanti": "/kurumsal", "siralama": 2, "alt_ogeler": []},
        {
            "id": 3, "baslik": "Ürünler", "baglanti": "/urunler", "siralama": 3,
            "alt_ogeler": [
                {"id": 31, "baslik": "Vana", "baglanti": "/urunler/vana", "alt_ogeler": VANA_MENU_KATEGORILERI},
                {"id": 32, "baslik": "Aktüatör", "baglanti": "/urunler/aktuator", "alt_ogeler": AKTUATOR_MENU_KATEGORILERI},
                {"id": 33, "baslik": "Otomasyon", "baglanti": "/urunler/otomasyon", "alt_ogeler": []},
                {"id": 34, "baslik": "Temsilcilikler", "baglanti": "/urunler/temsilcilikler", "alt_ogeler": []},
            ],
        },
        {"id": 4, "baslik": "Teknik", "baglanti": "/teknik", "siralama": 4, "alt_ogeler": []},
        {"id": 5, "baslik": "Referanslar", "baglanti": "/referanslar", "siralama": 5, "alt_ogeler": []},
        {"id": 6, "baslik": "Sertifikalar", "baglanti": "/sertifikalar", "siralama": 6, "alt_ogeler": []},
        {"id": 7, "baslik": "İletişim", "baglanti": "/iletisim", "siralama": 7, "alt_ogeler": []},
    ],
    "/api/sliderlar": [
        {
            "id": 1, "baslik": "Endüstriyel akışta güvenilir kontrol",
            "aciklama": "Üretim hatlarına uygun vana çözümleri.",
            "gorsel_yolu": "/assets/carousel/1.png", "alternatif_metin": "Vana çözümü 1",
            "buton_metni": "Ürünleri incele", "buton_baglantisi": "/urunler",
            "animasyon_turu": "kaydir", "odak_x": 50, "odak_y": 50,
        },
        {
            "id": 2, "baslik": "Her bağlantıda ölçülü mühendislik",
            "aciklama": "Basınç ve akış gereksinimlerine uygun seçim.",
            "gorsel_yolu": "/assets/carousel/2.png", "alternatif_metin": "Vana çözümü 2",
            "buton_metni": "İletişime geçin", "buton_baglantisi": "/iletisim",
            "animasyon_turu": "yaklas", "odak_x": 50, "odak_y": 50,
        },
    ],
    "/api/kategoriler": [
        {
            "id": sira, "ad": ad, "slug": slug,
            "gorsel_yolu": "/assets/urun-placeholder.svg", "alternatif_metin": f"{ad} ürün grubu",
        }
        for sira, (ad, slug) in enumerate(
            (
                ("Küresel Vanalar", "kuresel-vanalar"),
                ("Kelebek Vanalar", "kelebek-vanalar"),
                ("Sürgülü Vanalar", "surgulu-vanalar"),
                ("Çekvalfler", "cekvalfler"),
                ("Globe Vanalar", "globe-vanalar"),
                ("Pislik Tutucular", "pislik-tutucular"),
                ("Kontrol Vanaları", "kontrol-vanalari"),
            ),
            start=1,
        )
    ],
}


def api_yanitla(rota) -> None:
    """Tarayıcı testini veritabanından bağımsız tutarken gerçek API sözleşmesini korur."""
    yol = urlparse(rota.request.url).path
    veri = API_VERILERI.get(yol, [])
    rota.fulfill(
        status=200,
        content_type="application/json; charset=utf-8",
        body=json.dumps({"basarili": True, "veri": veri}, ensure_ascii=False),
    )


def sayfayi_dogrula(page, genislik: int, yukseklik: int) -> None:
    """Her hedef ekranda ana yapının görünür ve yatay taşmasız olduğunu doğrular."""
    # MySQL gerektirmeden PHP API ile aynı JSON sınırını kullanarak görünümü kararlı test ederiz.
    if not GERCEK_API:
        page.route("**/api/**", api_yanitla)
    page.goto(TEST_ADRESI, wait_until="networkidle")
    page.get_by_role("heading", name="ÜRÜN KATEGORİLERİMİZ").wait_for()

    yazi_tipi = page.evaluate("getComputedStyle(document.body).fontFamily")
    assert "Inter" in yazi_tipi, f"Beklenen Inter yerine {yazi_tipi} kullanılıyor"

    assert page.locator('[data-testid="kategori-karti"]').count() == 8
    assert page.locator(".vite-error-overlay").count() == 0

    # Kullanıcının son kararıyla navbar tüm ekranlarda 60px yüksekliğinde kalır.
    navbar_yuksekligi = page.locator(".site-header").evaluate(
        "element => element.getBoundingClientRect().height"
    )
    assert navbar_yuksekligi == 60, (
        f"Navbar {genislik}px görünümde {navbar_yuksekligi}px; beklenen 60px"
    )

    # Kategori paneli sliderın üzerine binmemeli; normal akışta hero bittikten sonra başlamalıdır.
    hero_alt = page.locator(".hero-carousel").evaluate(
        "element => element.getBoundingClientRect().bottom"
    )
    kategori_ust = page.locator(".kategori-bolumu > .icerik-kapsayici").evaluate(
        "element => element.getBoundingClientRect().top"
    )
    assert kategori_ust >= hero_alt, (
        f"Kategori paneli hero üzerine {hero_alt - kategori_ust}px taşıyor"
    )

    # Bir piksel yuvarlama payı dışında yatay taşma, responsive grid'in kırıldığını gösterir.
    yatay_tasma = page.evaluate(
        "document.documentElement.scrollWidth - document.documentElement.clientWidth"
    )
    assert yatay_tasma <= 1, f"{genislik}px görünümde {yatay_tasma}px yatay taşma var"

    if genislik == 1440:
        urunler_dugmesi = page.get_by_role("button", name="Ürünler alt menüsünü aç")
        urunler_dugmesi.hover()
        page.get_by_role("link", name="Yangın Vanaları").wait_for(state="visible")
        assert page.get_by_role("link", name="Bağlantı Parçaları").is_visible()
        page.wait_for_timeout(320)
        page.screenshot(path=str(CIKTI / "ust-menu-1440.png"), full_page=False)
        page.get_by_role("button", name="Aktüatör alt menüsünü aç").hover()
        page.get_by_role("link", name="Elektrik Aktüatörler").wait_for(state="visible")
        assert page.get_by_role("link", name="Aksesuarlar").is_visible()
        page.wait_for_timeout(240)
        page.screenshot(path=str(CIKTI / "aktuator-menu-1440.png"), full_page=False)
        page.keyboard.press("Escape")

        # Canvas başlangıçta şeffaftır; fare ilerlediğinde ilgili pikselde teknik çizim katmanı oluşmalıdır.
        canvas = page.locator('[data-testid="murekkep-maskesi"]')
        kutu = canvas.bounding_box()
        ilk_alfa = canvas.evaluate(
            """element => {
              const x = Math.floor(element.width * 0.66);
              const y = Math.floor(element.height * 0.48);
              return element.getContext('2d').getImageData(x, y, 1, 1).data[3];
            }"""
        )
        page.mouse.move(kutu["x"] + kutu["width"] * 0.66, kutu["y"] + kutu["height"] * 0.48)
        page.wait_for_timeout(120)
        merkez_alfa = canvas.evaluate(
            """element => {
              const x = Math.floor(element.width * 0.66);
              const y = Math.floor(element.height * 0.48);
              return element.getContext('2d').getImageData(x, y, 1, 1).data[3];
            }"""
        )
        assert ilk_alfa == 0, "Teknik çizim canvası fare etkileşiminden önce şeffaf değil"
        assert merkez_alfa > 5, "Fare konumunda teknik çizim katmanı oluşmadı"

    page.screenshot(
        path=str(CIKTI / f"ana-sayfa-{genislik}.png"),
        full_page=True,
    )

    if genislik in (360, 375):
        menu_dugmesi = page.get_by_role("button", name="Menüyü aç")
        menu_dugmesi.click()
        assert page.get_by_role("button", name="Menüyü kapat").get_attribute("aria-expanded") == "true"
        page.get_by_role("button", name="Ürünler alt menüsünü aç").click()
        page.get_by_role("link", name="Yangın Vanaları").wait_for(state="visible")
        page.get_by_role("button", name="Aktüatör alt menüsünü aç").click()
        page.get_by_role("link", name="Elektrik Aktüatörler").wait_for(state="visible")

    if genislik == 1440:
        ilk_baslik = page.locator(".hero-carousel h1").inner_text()
        page.get_by_role("button", name="Sonraki slayt").click()
        assert page.locator(".hero-carousel h1").inner_text() != ilk_baslik


with sync_playwright() as playwright:
    tarayici = playwright.chromium.launch(headless=True)
    konsol_hatalari: list[str] = []

    # 375px telefon ve 844x390 yatay telefon, gerçek cihazlarda oluşabilecek kırılmaları ayrıca yakalar.
    for genislik, yukseklik in (
        (360, 800),
        (375, 667),
        (768, 1024),
        (844, 390),
        (1440, 900),
        (1920, 1080),
    ):
        sayfa = tarayici.new_page(viewport={"width": genislik, "height": yukseklik})
        sayfa.on(
            "console",
            lambda mesaj: konsol_hatalari.append(mesaj.text)
            if mesaj.type == "error"
            else None,
        )
        sayfayi_dogrula(sayfa, genislik, yukseklik)
        sayfa.close()

    # Katalog bağlantısının gerçek router geçişi yaptığını ayrıca kontrol ederiz.
    sayfa = tarayici.new_page(viewport={"width": 1440, "height": 900})
    if not GERCEK_API:
        sayfa.route("**/api/**", api_yanitla)
    sayfa.goto(TEST_ADRESI, wait_until="networkidle")
    # Üstteki "Tüm ürünleri gör" bağlantısından ayrıştırmak için kart adını tam eşleştiririz.
    sayfa.get_by_role("link", name="Tüm Ürünler", exact=True).click()
    sayfa.wait_for_url("**/urunler")
    sayfa.get_by_role("heading", name="Ürün kataloğu").wait_for(state="visible")
    sayfa.close()
    tarayici.close()

    if konsol_hatalari:
        raise AssertionError("Tarayıcı konsol hataları: " + " | ".join(konsol_hatalari))

print("Responsive tarayıcı doğrulaması başarılı: telefon, yatay telefon, tablet ve masaüstü.")
