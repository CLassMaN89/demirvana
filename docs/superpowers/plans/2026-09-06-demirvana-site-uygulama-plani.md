# Demirvana Web Sitesi Uygulama Planı

> **Uygulayıcı için:** ZORUNLU ALT BECERİ: Bu planı görev görev tek ajanla uygulamak için `superpowers:executing-plans` kullan. Kullanıcı alt ajan kullanımını açıkça yasakladı.

**Hedef:** Demirvana için responsive React arayüzü, PHP REST API'si, phpMyAdmin uyumlu MySQL şeması ve gelecekteki yönetim panelinden değiştirilebilir içerik/tema altyapısı oluşturmak.

**Mimari:** `frontend/` altında Vite + React Router tabanlı istemci, `backend/` altında PDO kullanan katmanlı PHP JSON API ve `veritabani/` altında Türkçe isimlendirilmiş MySQL şeması bulunur. React önce API'yi kullanır; yalnızca geliştirme ortamında erişim başarısızsa merkezi Türkçe örnek veriye geçer. Tema API verileri izin listesiyle CSS özel değişkenlerine uygulanır.

**Teknoloji:** React 18+, Vite, React Router, Vitest, Testing Library, CSS3, PHP 8.1+, PDO MySQL, MySQL 8 / MariaDB 10.6+.

**Tasarım belgesi:** `docs/superpowers/specs/2026-09-06-demirvana-site-tasarimi.md`

## Genel kısıtlar

- İlk sürüm yalnızca Türkçedir; arayüz sabitleri tek merkezi dosyada tutulur.
- Navbar masaüstünde tam `120px` yüksekliğindedir.
- Hero masaüstünde `1994 / 789` oranını korur; mobilde okunabilir minimum yükseklik kullanır.
- Ana sayfada tam yedi kategori kartı ve bir `Tüm Ürünler` kartı bulunur.
- Tüm tema renkleri CSS özel değişkenleridir ve API/veritabanı ile değiştirilebilir.
- Veritabanı tablo/sütun adları ve kaynak kod yorumları Türkçedir.
- Görseller veritabanında dosya yolu olarak tutulur; ikili veri olarak saklanmaz.
- Ekranlar 360px, 768px, 1440px ve 1920px genişliklerde doğrulanır.
- Alt ajan kullanılmaz; sadece açıkça istenen kapsam değiştirilir.

## Dosya haritası

```text
vana3/
├── AGENTS.md
├── PROJE_DURUMU.md
├── Carousel/                         # Kullanıcının verdiği altı hero görseli
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       ├── logo.png
│   │       └── carousel/             # 1.png ... 6.png
│   ├── src/
│   │   ├── bilesenler/
│   │   │   ├── Header.jsx
│   │   │   ├── HeroCarousel.jsx
│   │   │   ├── KategoriKarti.jsx
│   │   │   ├── KategoriBolumu.jsx
│   │   │   ├── SayfaIskeleti.jsx
│   │   │   └── DurumMesaji.jsx
│   │   ├── sayfalar/
│   │   │   ├── AnaSayfa.jsx
│   │   │   ├── UrunlerSayfasi.jsx
│   │   │   ├── KategoriSayfasi.jsx
│   │   │   ├── UrunDetaySayfasi.jsx
│   │   │   └── IcerikSayfasi.jsx
│   │   ├── servisler/api.js
│   │   ├── tema/temaUygula.js
│   │   ├── veri/ornekVeriler.js
│   │   ├── metinler/tr.js
│   │   ├── stiller/
│   │   │   ├── tema.css
│   │   │   ├── genel.css
│   │   │   ├── header.css
│   │   │   ├── carousel.css
│   │   │   └── kategoriler.css
│   │   ├── test/kurulum.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── public/index.php
│   ├── src/
│   │   ├── Cekirdek/Veritabani.php
│   │   ├── Cekirdek/JsonYanit.php
│   │   ├── Depolar/SiteDeposu.php
│   │   └── Denetleyiciler/SiteDenetleyicisi.php
│   ├── tests/api_dogrulama.php
│   ├── uploads/.gitkeep
│   ├── .env.example
│   └── router.php
└── veritabani/demirvana.sql
```

---

### Görev 1: Frontend temeli ve güvenli dinamik tema

**Dosyalar:**
- Oluştur: `frontend/package.json`
- Oluştur: `frontend/vite.config.js`
- Oluştur: `frontend/index.html`
- Oluştur: `frontend/src/main.jsx`
- Oluştur: `frontend/src/App.jsx`
- Oluştur: `frontend/src/test/kurulum.js`
- Oluştur: `frontend/src/tema/temaUygula.js`
- Oluştur: `frontend/src/tema/temaUygula.test.js`
- Oluştur: `frontend/src/stiller/tema.css`
- Oluştur: `frontend/src/stiller/genel.css`
- Kopyala: `C:/Users/Sinan/Documents/Projeler/vana2/assets/logo.png` → `frontend/public/assets/logo.png`

**Arayüzler:**
- Üretir: `temaUygula(tema, hedef = document.documentElement): void`
- Tüketir: API'nin `{ ana_mavi, koyu_mavi, acik_mavi, beyaz, metin, ikincil_metin }` nesnesi.

- [ ] **Adım 1: Tema izin listesini tanımlayan başarısız testi yaz**

```js
import { describe, expect, it } from 'vitest';
import { temaUygula } from './temaUygula';

describe('temaUygula', () => {
  it('yalnızca izin verilen tema değerlerini CSS değişkenlerine aktarır', () => {
    const hedef = document.createElement('div');
    temaUygula({ ana_mavi: '#28469D', zararli_deger: 'url(javascript:x)' }, hedef);
    expect(hedef.style.getPropertyValue('--renk-ana')).toBe('#28469D');
    expect(hedef.style.getPropertyValue('--zararli-deger')).toBe('');
  });
});
```

- [ ] **Adım 2: Testi çalıştır ve beklenen nedenle başarısız olduğunu doğrula**

Çalıştır: `cd frontend; npm install; npm test -- --run src/tema/temaUygula.test.js`

Beklenen: `temaUygula` modülü bulunmadığı için FAIL.

- [ ] **Adım 3: Vite yapılandırmasını ve minimum tema uygulayıcısını oluştur**

`temaUygula.js` içinde sabit eşleme kullan:

```js
const TEMA_ESLEMESI = {
  ana_mavi: '--renk-ana', koyu_mavi: '--renk-koyu', acik_mavi: '--renk-acik',
  beyaz: '--renk-beyaz', metin: '--renk-metin', ikincil_metin: '--renk-ikincil'
};

export function temaUygula(tema, hedef = document.documentElement) {
  Object.entries(TEMA_ESLEMESI).forEach(([anahtar, cssDegiskeni]) => {
    if (typeof tema?.[anahtar] === 'string') hedef.style.setProperty(cssDegiskeni, tema[anahtar]);
  });
}
```

`tema.css` içinde aynı altı değişken için tasarım belgesindeki varsayılan değerleri tanımla. `genel.css` içinde Inter, sıfırlama, odak görünümü, akışkan içerik genişliği ve `prefers-reduced-motion` kuralını ekle.

- [ ] **Adım 4: Tema testi ve boş uygulama derlemesini doğrula**

Çalıştır: `cd frontend; npm test -- --run; npm run build`

Beklenen: Tüm testler PASS, Vite derlemesi exit 0.

- [ ] **Adım 5: Git deposunu başlat ve ilk görevi kaydet**

```powershell
git init
git add AGENTS.md PROJE_DURUMU.md docs frontend
git commit -m "chore: Demirvana frontend temelini kur"
```

---

### Görev 2: Merkezi Türkçe veriler ve API istemcisi

**Dosyalar:**
- Oluştur: `frontend/src/metinler/tr.js`
- Oluştur: `frontend/src/veri/ornekVeriler.js`
- Oluştur: `frontend/src/servisler/api.js`
- Oluştur: `frontend/src/servisler/api.test.js`

**Arayüzler:**
- Üretir: `veriGetir(yol, { fetchFn, gelistirme, yedekVeri }): Promise<unknown>`
- Üretir: `siteVerileriniGetir(secenekler): Promise<{tema, menu, sliderlar, kategoriler}>`
- Tüketir: Ortak API yanıtı `{ basarili: boolean, veri: unknown, mesaj?: string }`.

- [ ] **Adım 1: Başarılı yanıt ve geliştirme yedeği için başarısız testleri yaz**

```js
it('başarılı API yanıtındaki veriyi döndürür', async () => {
  const fetchFn = async () => ({ ok: true, json: async () => ({ basarili: true, veri: ['a'] }) });
  await expect(veriGetir('/api/menu', { fetchFn })).resolves.toEqual(['a']);
});

it('geliştirmede API erişilemezse örnek veriyi döndürür', async () => {
  const fetchFn = async () => { throw new Error('bağlantı yok'); };
  await expect(veriGetir('/api/menu', { fetchFn, gelistirme: true, yedekVeri: ['yerel'] }))
    .resolves.toEqual(['yerel']);
});
```

- [ ] **Adım 2: Testleri çalıştır ve eksik modül nedeniyle başarısızlığı doğrula**

Çalıştır: `cd frontend; npm test -- --run src/servisler/api.test.js`

Beklenen: `api.js` bulunmadığı için FAIL.

- [ ] **Adım 3: API istemcisini ve merkezi Türkçe içeriği uygula**

`veriGetir` HTTP hatasında veya `basarili !== true` olduğunda hata üretir; yalnızca `gelistirme === true` ve `yedekVeri` tanımlıysa örnek veriye döner. `ornekVeriler.js` altı carousel kaydı, yedi vana kategorisi, tema ve menü kaydı içerir. Görsel yolları `/assets/carousel/1.png` ile `/assets/carousel/6.png` biçimindedir. `tr.js` navigasyon, buton, boş durum ve hata metinlerini tek nesnede dışa aktarır.

- [ ] **Adım 4: API testlerini ve tüm frontend testlerini doğrula**

Çalıştır: `cd frontend; npm test -- --run`

Beklenen: Tüm testler PASS.

- [ ] **Adım 5: Değişiklikleri kaydet**

```powershell
git add frontend/src/metinler frontend/src/veri frontend/src/servisler
git commit -m "feat: dinamik içerik istemcisini ekle"
```

---

### Görev 3: Responsive navbar ve sayfa iskeleti

**Dosyalar:**
- Oluştur: `frontend/src/bilesenler/Header.jsx`
- Oluştur: `frontend/src/bilesenler/Header.test.jsx`
- Oluştur: `frontend/src/bilesenler/SayfaIskeleti.jsx`
- Oluştur: `frontend/src/bilesenler/DurumMesaji.jsx`
- Oluştur: `frontend/src/stiller/header.css`
- Değiştir: `frontend/src/App.jsx`

**Arayüzler:**
- Üretir: `<Header menu={MenuOgesi[]} logoYolu="/assets/logo.png" />`
- Üretir: `<SayfaIskeleti menu tema children />`
- Tüketir: `MenuOgesi = { id, baslik, baglanti, siralama }`.

- [ ] **Adım 1: Menü ve mobil düğme davranışı için başarısız testi yaz**

```jsx
render(<MemoryRouter><Header menu={[{ id: 1, baslik: 'Ürünler', baglanti: '/urunler' }]} logoYolu="/assets/logo.png" /></MemoryRouter>);
expect(screen.getByRole('banner')).toBeInTheDocument();
expect(screen.getByRole('link', { name: /ürünler/i })).toHaveAttribute('href', '/urunler');
await userEvent.click(screen.getByRole('button', { name: /menüyü aç/i }));
expect(screen.getByRole('button', { name: /menüyü kapat/i })).toBeInTheDocument();
```

- [ ] **Adım 2: Testi çalıştır ve Header eksikliği nedeniyle başarısızlığı doğrula**

Çalıştır: `cd frontend; npm test -- --run src/bilesenler/Header.test.jsx`

Beklenen: `Header.jsx` bulunmadığı için FAIL.

- [ ] **Adım 3: Header ve iskeleti uygula**

Logo anlamlı alternatif metin taşır. Menü düğmesi `aria-expanded` ve `aria-controls` kullanır. Route değişiminde mobil menü kapanır. CSS masaüstünde `--navbar-yuksekligi: 120px`, sticky konum ve beyaz/mavi yüzey; 900px altında kompakt navbar ve açılır panel uygular.

- [ ] **Adım 4: Bileşen testleri ve derlemeyi doğrula**

Çalıştır: `cd frontend; npm test -- --run; npm run build`

Beklenen: Tüm testler PASS, derleme exit 0.

- [ ] **Adım 5: Değişiklikleri kaydet**

```powershell
git add frontend/src/bilesenler frontend/src/stiller/header.css frontend/src/App.jsx
git commit -m "feat: responsive site navigasyonunu ekle"
```

---

### Görev 4: Hero carousel

**Dosyalar:**
- Oluştur: `frontend/src/bilesenler/HeroCarousel.jsx`
- Oluştur: `frontend/src/bilesenler/HeroCarousel.test.jsx`
- Oluştur: `frontend/src/stiller/carousel.css`
- Kopyala: `Carousel/1.png` ... `Carousel/6.png` → `frontend/public/assets/carousel/`

**Arayüzler:**
- Üretir: `<HeroCarousel sliderlar={Slider[]} otomatikGecisMs={6500} />`
- Tüketir: `Slider = { id, baslik, aciklama, gorsel_yolu, alternatif_metin, buton_metni, buton_baglantisi, animasyon_turu, odak_x, odak_y }`.

- [ ] **Adım 1: Ok ve klavye navigasyonu için başarısız testleri yaz**

```jsx
render(<MemoryRouter><HeroCarousel sliderlar={ikiSlider} otomatikGecisMs={0} /></MemoryRouter>);
expect(screen.getByRole('heading', { name: 'Birinci' })).toBeInTheDocument();
await userEvent.click(screen.getByRole('button', { name: /sonraki slayt/i }));
expect(screen.getByRole('heading', { name: 'İkinci' })).toBeInTheDocument();
await userEvent.keyboard('{ArrowLeft}');
expect(screen.getByRole('heading', { name: 'Birinci' })).toBeInTheDocument();
```

- [ ] **Adım 2: Testi çalıştır ve bileşen eksikliği nedeniyle başarısızlığı doğrula**

Çalıştır: `cd frontend; npm test -- --run src/bilesenler/HeroCarousel.test.jsx`

Beklenen: `HeroCarousel.jsx` bulunmadığı için FAIL.

- [ ] **Adım 3: Carousel davranışını uygula**

Aktif indeks React state içinde tutulur. Önceki/sonraki işlemleri sarar. Gösterge düğmeleri `Slayt N'e git` adı taşır. `pointerdown/pointerup` farkı 45px'i aşınca dokunmatik geçiş yapılır. Fare hero üzerindeyken ve odak hero içindeyken otomatik oynatma durur. Görsel stili `object-position: ${odak_x}% ${odak_y}%` kullanır.

- [ ] **Adım 4: Oran, mobil yükseklik ve hareket azaltma CSS'ini uygula**

Masaüstünde `aspect-ratio: 1994 / 789`; mobilde `min-height: clamp(430px, 78svh, 650px)` kullan. Animasyon sınıfları `kaydir`, `yaklas` ve `metin-maske` ile sınırlandırılır. `prefers-reduced-motion: reduce` altında animasyon ve otomatik geçiş devre dışı kalır.

- [ ] **Adım 5: Testleri ve derlemeyi doğrula**

Çalıştır: `cd frontend; npm test -- --run; npm run build`

Beklenen: Tüm testler PASS, derleme exit 0.

- [ ] **Adım 6: Değişiklikleri kaydet**

```powershell
git add frontend/public/assets/carousel frontend/src/bilesenler/HeroCarousel* frontend/src/stiller/carousel.css
git commit -m "feat: erişilebilir hero carousel ekle"
```

---

### Görev 5: Kategori grid'i ve sayfa rotaları

**Dosyalar:**
- Oluştur: `frontend/src/bilesenler/KategoriKarti.jsx`
- Oluştur: `frontend/src/bilesenler/KategoriBolumu.jsx`
- Oluştur: `frontend/src/bilesenler/KategoriBolumu.test.jsx`
- Oluştur: `frontend/src/sayfalar/AnaSayfa.jsx`
- Oluştur: `frontend/src/sayfalar/UrunlerSayfasi.jsx`
- Oluştur: `frontend/src/sayfalar/KategoriSayfasi.jsx`
- Oluştur: `frontend/src/sayfalar/UrunDetaySayfasi.jsx`
- Oluştur: `frontend/src/sayfalar/IcerikSayfasi.jsx`
- Oluştur: `frontend/src/stiller/kategoriler.css`
- Değiştir: `frontend/src/App.jsx`

**Arayüzler:**
- Üretir: `<KategoriBolumu kategoriler={Kategori[]} />`
- Tüketir: `Kategori = { id, ad, slug, gorsel_yolu, alternatif_metin }`.

- [ ] **Adım 1: Tam sekiz kart ve doğru rotalar için başarısız testi yaz**

```jsx
render(<MemoryRouter><KategoriBolumu kategoriler={yediKategori} /></MemoryRouter>);
expect(screen.getByRole('heading', { name: 'ÜRÜN KATEGORİLERİMİZ' })).toBeInTheDocument();
expect(screen.getAllByTestId('kategori-karti')).toHaveLength(8);
expect(screen.getByRole('link', { name: /küresel vanalar/i })).toHaveAttribute('href', '/kategoriler/kuresel-vanalar');
expect(screen.getByRole('link', { name: /tüm ürünler/i })).toHaveAttribute('href', '/urunler');
```

- [ ] **Adım 2: Testi çalıştır ve bileşen eksikliği nedeniyle başarısızlığı doğrula**

Çalıştır: `cd frontend; npm test -- --run src/bilesenler/KategoriBolumu.test.jsx`

Beklenen: `KategoriBolumu.jsx` bulunmadığı için FAIL.

- [ ] **Adım 3: Kartları, grid'i ve sayfaları uygula**

İlk yedi aktif kategori `slice(0, 7)` ile gösterilir ve sekizinci kart kod tarafından `Tüm Ürünler` olarak eklenir. Her kart tek bir React Router `Link` öğesidir. Grid 1100px üzerinde dört, 640–1099px arasında iki, 639px altında bir sütundur. Katalog ve detay sayfaları API verisi gelene kadar iskelet; boşsa açıklayıcı `DurumMesaji` gösterir.

- [ ] **Adım 4: App rotalarını bağla**

`/`, `/urunler`, `/kategoriler/:slug`, `/urunler/:slug`, `/hakkimizda`, `/uretim` ve `/iletisim` rotalarını tanımla. Bilinmeyen rotayı ana sayfaya yönlendir.

- [ ] **Adım 5: Tüm frontend testlerini ve derlemeyi doğrula**

Çalıştır: `cd frontend; npm test -- --run; npm run build`

Beklenen: Tüm testler PASS, derleme exit 0.

- [ ] **Adım 6: Değişiklikleri kaydet**

```powershell
git add frontend/src/bilesenler frontend/src/sayfalar frontend/src/stiller/kategoriler.css frontend/src/App.jsx
git commit -m "feat: ürün kategorileri ve sayfa rotalarını ekle"
```

---

### Görev 6: PHP çekirdeği ve JSON API

**Dosyalar:**
- Oluştur: `backend/src/Cekirdek/Veritabani.php`
- Oluştur: `backend/src/Cekirdek/JsonYanit.php`
- Oluştur: `backend/src/Depolar/SiteDeposu.php`
- Oluştur: `backend/src/Denetleyiciler/SiteDenetleyicisi.php`
- Oluştur: `backend/public/index.php`
- Oluştur: `backend/router.php`
- Oluştur: `backend/.env.example`
- Oluştur: `backend/tests/api_dogrulama.php`
- Oluştur: `backend/uploads/.gitkeep`

**Arayüzler:**
- Üretir: `JsonYanit::olustur(bool $basarili, mixed $veri, ?string $mesaj = null): array`
- Üretir: `SiteDeposu::tema(): array`, `menu(): array`, `sliderlar(): array`, `kategoriler(): array`, `kategori(string $slug): ?array`, `urunler(?string $kategori = null, ?string $arama = null): array`, `urun(string $slug): ?array`.
- Tüketir: UTF-8 PDO bağlantısı ve Türkçe tablo/sütun adları.

- [ ] **Adım 1: JSON sözleşmesi ve slug doğrulaması için başarısız PHP testi yaz**

```php
<?php
require_once __DIR__ . '/../src/Cekirdek/JsonYanit.php';

$yanit = JsonYanit::olustur(true, ['id' => 1]);
assert($yanit === ['basarili' => true, 'veri' => ['id' => 1]]);
assert(SiteDenetleyicisi::gecerliSlug('kuresel-vanalar') === true);
assert(SiteDenetleyicisi::gecerliSlug('../gizli') === false);
echo "PHP API doğrulamaları başarılı.\n";
```

- [ ] **Adım 2: Testi çalıştır ve eksik sınıf nedeniyle başarısızlığı doğrula**

Çalıştır: `php -d assert.exception=1 backend/tests/api_dogrulama.php`

Beklenen: `JsonYanit` veya `SiteDenetleyicisi` bulunmadığı için FAIL.

- [ ] **Adım 3: Çekirdek sınıfları ve depo sorgularını uygula**

`Veritabani` ortam değişkenlerinden bağlantı kurar, `utf8mb4` kullanır ve `PDO::ATTR_EMULATE_PREPARES => false` ayarlar. `SiteDeposu` yalnızca parametreli sorgular çalıştırır. `SiteDenetleyicisi::gecerliSlug` için `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` kullanılır.

- [ ] **Adım 4: Router ve HTTP yanıtlarını uygula**

`public/index.php` sadece `GET` kabul eder ve `/api/tema`, `/api/menu`, `/api/sliderlar`, `/api/kategoriler`, `/api/kategoriler/{slug}`, `/api/urunler`, `/api/urunler/{slug}` rotalarını yönlendirir. JSON başlığı `application/json; charset=utf-8` olur. Bilinmeyen rota `404`, geçersiz slug `400`, yakalanan sunucu hatası ayrıntısız `500` döndürür.

- [ ] **Adım 5: PHP testini ve tüm dosyaların sözdizimini doğrula**

Çalıştır:

```powershell
php -d assert.exception=1 backend/tests/api_dogrulama.php
Get-ChildItem backend -Recurse -Filter *.php | ForEach-Object { php -l $_.FullName; if ($LASTEXITCODE -ne 0) { throw "PHP sözdizimi hatası" } }
```

Beklenen: API doğrulaması başarılı, bütün dosyalarda `No syntax errors detected`.

- [ ] **Adım 6: Değişiklikleri kaydet**

```powershell
git add backend
git commit -m "feat: PHP REST API katmanını ekle"
```

---

### Görev 7: MySQL şeması ve başlangıç verileri

**Dosyalar:**
- Oluştur: `veritabani/demirvana.sql`
- Oluştur: `veritabani/sema_dogrulama.ps1`

**Arayüzler:**
- Üretir: `site_ayarlari`, `tema_ayarlari`, `menu_ogeleri`, `sliderlar`, `kategoriler`, `urunler`, `urun_gorselleri` tabloları.
- Tüketir: Backend depo sorgularında kullanılan alan adları.

- [ ] **Adım 1: Beklenen tabloları denetleyen başarısız şema testini yaz**

```powershell
$sql = Get-Content -Raw "$PSScriptRoot/demirvana.sql"
$tablolar = 'site_ayarlari','tema_ayarlari','menu_ogeleri','sliderlar','kategoriler','urunler','urun_gorselleri'
foreach ($tablo in $tablolar) {
  if ($sql -notmatch "CREATE TABLE ``$tablo``") { throw "Eksik tablo: $tablo" }
}
if ($sql -notmatch 'CHARACTER SET utf8mb4') { throw 'utf8mb4 tanımı eksik' }
Write-Output 'Şema yapısal doğrulaması başarılı.'
```

- [ ] **Adım 2: Şema testini çalıştır ve SQL dosyası eksik olduğu için başarısızlığı doğrula**

Çalıştır: `powershell -ExecutionPolicy Bypass -File veritabani/sema_dogrulama.ps1`

Beklenen: `demirvana.sql` bulunmadığı için FAIL.

- [ ] **Adım 3: Türkçe MySQL şemasını oluştur**

Her tabloda `id`, zaman damgaları ve gerekli `aktif_mi`/`siralama` alanları bulunur. Slug alanları benzersiz indekslidir. Yabancı anahtarlar `urunler.kategori_id → kategoriler.id` ve `urun_gorselleri.urun_id → urunler.id` ilişkilerini kurar. Silme davranışı ürün görsellerinde `CASCADE`, kategoriye bağlı ürünlerde `RESTRICT` olur.

- [ ] **Adım 4: Başlangıç kayıtlarını ekle**

SQL dosyası altı tema rengi, beş menü bağlantısı, altı carousel yolu ve yedi kategori kaydı ekler. Carousel yolları `/assets/carousel/1.png` ... `/assets/carousel/6.png`; kategori görselleri admin panelinden yüklenene kadar `/assets/urun-placeholder.svg` yolunu kullanır.

- [ ] **Adım 5: Şemayı doğrula**

Çalıştır: `powershell -ExecutionPolicy Bypass -File veritabani/sema_dogrulama.ps1`

MySQL istemcisi mevcutsa ayrıca çalıştır: `mysql --default-character-set=utf8mb4 -u root -p < veritabani/demirvana.sql`

Beklenen: Yapısal test PASS; MySQL mevcutsa şema içe aktarma exit 0.

- [ ] **Adım 6: Değişiklikleri kaydet**

```powershell
git add veritabani
git commit -m "feat: Türkçe MySQL şemasını ekle"
```

---

### Görev 8: Entegrasyon, responsive görsel kontrol ve teslim kaydı

**Dosyalar:**
- Oluştur: `README.md`
- Oluştur: `frontend/public/assets/urun-placeholder.svg`
- Değiştir: `frontend/src/App.jsx`
- Değiştir: `frontend/src/stiller/genel.css`
- Değiştir: `PROJE_DURUMU.md`

**Arayüzler:**
- Tüketir: Görev 1–7 içinde tanımlanan frontend, API ve şema arayüzleri.
- Üretir: Yerel kurulum komutları, doğrulama kanıtı ve sonraki oturum devam noktası.

- [ ] **Adım 1: Ana sayfa entegrasyon testini yaz ve başarısızlığını doğrula**

```jsx
render(<MemoryRouter initialEntries={['/']}><App veriKaynagi={sabitTestVerisi} /></MemoryRouter>);
expect(screen.getByRole('banner')).toBeInTheDocument();
expect(screen.getByRole('region', { name: /öne çıkan içerikler/i })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'ÜRÜN KATEGORİLERİMİZ' })).toBeInTheDocument();
expect(screen.getAllByTestId('kategori-karti')).toHaveLength(8);
```

Çalıştır: `cd frontend; npm test -- --run src/App.test.jsx`

Beklenen: Entegre veri akışı henüz bağlanmadığı için FAIL.

- [ ] **Adım 2: App veri yükleme durumlarını bağla**

`App` ilk yüklemede tema, menü, slider ve kategorileri paralel alır; yükleniyor, başarılı ve hata durumlarını ayrı render eder. Tema verisi geldiğinde `temaUygula` çağrılır. Testler için `veriKaynagi` bağımlılığı prop üzerinden verilebilir.

- [ ] **Adım 3: README kurulum belgesini yaz**

Belgede `npm install`, `npm run dev`, `npm test -- --run`, `npm run build`, `php -S localhost:8080 backend/router.php`, `.env.example` değerleri ve phpMyAdmin üzerinden `veritabani/demirvana.sql` içe aktarma adımları bulunur.

- [ ] **Adım 4: Tüm otomatik doğrulamaları taze çalıştır**

```powershell
Set-Location frontend
npm test -- --run
npm run build
Set-Location ..
php -d assert.exception=1 backend/tests/api_dogrulama.php
Get-ChildItem backend -Recurse -Filter *.php | ForEach-Object { php -l $_.FullName; if ($LASTEXITCODE -ne 0) { throw "PHP sözdizimi hatası" } }
powershell -ExecutionPolicy Bypass -File veritabani/sema_dogrulama.ps1
```

Beklenen: Frontend testleri 0 hata, üretim derlemesi exit 0, PHP test/sözdizimi 0 hata ve SQL yapısal testi PASS.

- [ ] **Adım 5: Tarayıcıda responsive ve etkileşimli kontrolleri yap**

Vite geliştirme sunucusunu aç. 360×800, 768×1024, 1440×900 ve 1920×1080 görünüm alanlarında ekran görüntüsü al. Her boyutta yatay taşma olmadığını; navbar, carousel metni/okları, sekiz kategori kartı, mobil menü, klavye odağı ve route geçişlerini kontrol et. Bulunan her davranış hatası için önce başarısız regresyon testi ekle, ardından en küçük düzeltmeyi yap.

- [ ] **Adım 6: Proje durumunu gerçek sonuçlarla güncelle ve son kaydı oluştur**

`PROJE_DURUMU.md` içine yalnızca çalıştırılmış test sayılarını, derleme sonucunu, görsel kontrol boyutlarını, bilinen eksikleri ve sonraki net adımı yaz.

```powershell
git add README.md frontend backend veritabani PROJE_DURUMU.md
git commit -m "feat: Demirvana site iskeletini tamamla"
git status --short
```

Beklenen: Commit başarılı; `git status --short` kullanıcıya ait ilgisiz değişiklik yoksa boş.

## Plan öz denetimi

- Tasarım belgesindeki navbar, hero oranı, altı carousel görseli, sekiz kategori kartı, rotalar, dinamik tema, PHP API, Türkçe MySQL şeması, erişilebilirlik ve responsive doğrulama gereksinimleri görevlerle eşleştirildi.
- Frontend fonksiyon adları ve veri alanları görevler arasında aynı tutuldu.
- Yönetim paneli ekranları, ödeme, kimlik doğrulama ve canlı form gönderimi kapsam dışında bırakıldı.
- Uygulama tek ajanla yürütülecek; hiçbir görev alt ajan gerektirmiyor.
