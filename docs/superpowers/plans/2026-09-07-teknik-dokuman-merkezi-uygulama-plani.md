# Teknik Doküman Merkezi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/teknik` rotasında admin yönetimine hazır doküman kategorileri ve aynı sayfada çalışan PDF.js görüntüleyici oluşturmak.

**Architecture:** MySQL, kategori ve PDF kayıtlarının tek kaynağıdır; PHP hem JSON liste ucu hem de yalnız kayıtlı dosyalara erişen byte-range destekli PDF ucu sağlar. React kategori listesini mevcut başlangıç veri akışından alır, PDF.js adaptörü seçilen belgeyi yerel worker ile canvas üzerinde çizer ve responsive araç çubuğuyla yönetir.

**Tech Stack:** React, JavaScript ES6+, CSS3, Vite, Vitest, Testing Library, PDF.js (`pdfjs-dist`), PHP 8.4, PDO, MySQL/MariaDB.

**Spec:** `docs/superpowers/specs/2026-09-07-teknik-dokuman-merkezi-tasarimi.md`

## Global Constraints

- Çalışma tek ajan tarafından ve inline yürütülecek; alt ajan kullanılmayacak.
- Yalnız Teknik sayfası, ilgili veri/API/dosya sunumu, testler ve proje belgesi değiştirilecek.
- Navbar, footer, Referanslar, ana sayfa, ürünler ve diğer mevcut sayfalar korunacak.
- Kaynak kod yorumları, veritabanı tablo ve sütun adları açık Türkçe olacak.
- PDF yolları kaynak koda gömülmeyecek; MySQL kayıtlarından gelecek.
- `pdf/ceviri_tablosu.pdf` değiştirilmeden ilk deneme dokümanı olarak kullanılacak.
- Bütün renkler mevcut CSS özel değişkenlerinden türetilecek.
- Telefon, tablet, dizüstü ve geniş ekran uyumluluğu ile `prefers-reduced-motion` korunacak.
- TDD sırası her görevde başarısız test, en küçük uygulama, başarılı test ve ayrı commit olacak.
- Kullanıcıya ait kök `Carousel/` dizinine dokunulmayacak.

---

### Task 1: Teknik doküman veritabanı ve JSON API sözleşmesi

**Files:**
- Modify: `veritabani/demirvana.sql`
- Modify: `veritabani/sema_dogrulama.ps1`
- Modify: `backend/src/Depolar/SiteDeposu.php`
- Modify: `backend/src/Denetleyiciler/SiteDenetleyicisi.php`
- Modify: `backend/public/index.php`
- Modify: `backend/tests/api_dogrulama.php`

**Interfaces:**
- Produces: `SiteDeposu::teknikDokumanlar(): array`, `SiteDeposu::teknikDokuman(string $slug): ?array`, `SiteDenetleyicisi::teknikDokumanlar(): array`, `GET /api/teknik-dokumanlar`.
- JSON category shape: `{ id, dil_kodu, ad, slug, aciklama, ikon_adi, siralama, dokumanlar: TeknikDokuman[] }`.
- JSON document shape: `{ id, baslik, slug, dosya_adresi, orijinal_dosya_adi, alternatif_aciklama, dosya_boyutu, sayfa_sayisi, indirmeye_izin_var_mi, yeni_sekmede_acmaya_izin_var_mi, siralama }`.

- [x] **Step 1: Write the failing schema and PHP contract tests**

Add both table names to `veritabani/sema_dogrulama.ps1`. Add this contract test to `backend/tests/api_dogrulama.php`:

```php
$dokumanAgaci = SiteDeposu::teknikDokumanAgaciOlustur(
    [['id' => 1, 'ad' => 'Teknik Tablolar', 'slug' => 'teknik-tablolar']],
    [['id' => 4, 'kategori_id' => 1, 'baslik' => 'Çeviri Tablosu', 'slug' => 'ceviri-tablosu']]
);
if (($dokumanAgaci[0]['dokumanlar'][0]['baslik'] ?? null) !== 'Çeviri Tablosu') {
    throw new RuntimeException('Teknik doküman kategori ağacı doğru kurulmadı.');
}
```

- [x] **Step 2: Run tests and verify failure**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File veritabani/sema_dogrulama.ps1
& 'C:\Users\Sinan\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe' backend/tests/api_dogrulama.php
```

Expected: schema test reports missing technical tables and PHP reports undefined `teknikDokumanAgaciOlustur`.

- [x] **Step 3: Add Turkish tables and repeatable seed data**

Add `teknik_dokuman_kategorileri` and `teknik_dokumanlar` exactly as specified in the design. Enforce unique `(dil_kodu, slug)`, an indexed active ordering, a category foreign key with `ON UPDATE CASCADE ON DELETE RESTRICT`, PDF-only MIME default, non-negative file size/page count, and boolean defaults.

Seed:

```sql
INSERT INTO `teknik_dokuman_kategorileri`
    (`id`, `dil_kodu`, `ad`, `slug`, `aciklama`, `ikon_adi`, `siralama`)
VALUES
    (1, 'tr', 'Teknik Tablolar', 'teknik-tablolar', 'Ürünlere ait teknik tablo ve değerleri inceleyin.', 'dosya-hesaplama', 1),
    (2, 'tr', 'Kullanma Talimatları', 'kullanma-talimatlari', 'Vana ve ekipmanların kullanım talimatlarını inceleyin.', 'kitap-acik', 2)
ON DUPLICATE KEY UPDATE `ad` = VALUES(`ad`), `aciklama` = VALUES(`aciklama`), `ikon_adi` = VALUES(`ikon_adi`), `siralama` = VALUES(`siralama`);

INSERT INTO `teknik_dokumanlar`
    (`id`, `kategori_id`, `dil_kodu`, `baslik`, `slug`, `dosya_yolu`, `orijinal_dosya_adi`, `alternatif_aciklama`, `mime_turu`, `dosya_boyutu`, `sayfa_sayisi`, `siralama`)
VALUES
    (1, 1, 'tr', 'Çeviri Tablosu', 'ceviri-tablosu', 'ceviri_tablosu.pdf', 'ceviri_tablosu.pdf', 'Teknik ölçü ve birim çeviri tablosu', 'application/pdf', 297187, 1, 1)
ON DUPLICATE KEY UPDATE `kategori_id` = VALUES(`kategori_id`), `baslik` = VALUES(`baslik`), `dosya_yolu` = VALUES(`dosya_yolu`), `dosya_boyutu` = VALUES(`dosya_boyutu`), `sayfa_sayisi` = VALUES(`sayfa_sayisi`), `siralama` = VALUES(`siralama`);
```

- [x] **Step 4: Implement repository tree and endpoint**

Implement a flat category query plus a document query and group with:

```php
public static function teknikDokumanAgaciOlustur(array $kategoriler, array $dokumanlar): array
{
    $kategoriIndeksi = [];
    foreach ($kategoriler as $indeks => $kategori) {
        $kategoriler[$indeks]['dokumanlar'] = [];
        $kategoriIndeksi[(int) $kategori['id']] = $indeks;
    }
    foreach ($dokumanlar as $dokuman) {
        $kategoriId = (int) $dokuman['kategori_id'];
        if (isset($kategoriIndeksi[$kategoriId])) {
            $dokuman['dosya_adresi'] = '/dokumanlar/' . $dokuman['slug'];
            $kategoriler[$kategoriIndeksi[$kategoriId]]['dokumanlar'][] = $dokuman;
        }
    }
    return $kategoriler;
}
```

Add controller passthrough and `/api/teknik-dokumanlar` to `$sabitRotalar`. `teknikDokuman(string $slug)` must return the active record with category active check for Task 2.

- [x] **Step 5: Add admin-managed Technical page text seeds**

Add `site_ayarlari` keys for `teknik_hero_basligi`, `teknik_hero_aciklamasi`, `teknik_slogan_satir_1`, `teknik_slogan_satir_2`, `teknik_pdf_goruntule_metni`, `teknik_bos_kategori_metni`, `teknik_pdf_yukleniyor_metni`, `teknik_pdf_hata_basligi`, `teknik_pdf_hata_aciklamasi`, `teknik_pdf_indir_metni`, `teknik_pdf_yeni_sekme_metni`, `teknik_pdf_kapat_etiketi`.

- [x] **Step 6: Run tests and import schema twice**

Run the schema and PHP commands from Step 2, then:

```powershell
& 'C:\Program Files\MariaDB 12.3\bin\mysql.exe' -u root -e "source C:/Users/Sinan/Documents/Projeler/vana3/veritabani/demirvana.sql"
& 'C:\Program Files\MariaDB 12.3\bin\mysql.exe' -u root -e "source C:/Users/Sinan/Documents/Projeler/vana3/veritabani/demirvana.sql"
& 'C:\Program Files\MariaDB 12.3\bin\mysql.exe' -u root --batch --skip-column-names -e "USE demirvana; SELECT COUNT(*) FROM teknik_dokumanlar WHERE slug='ceviri-tablosu';"
```

Expected: all tests pass and count is exactly `1`.

- [x] **Step 7: Commit**

```powershell
git add veritabani backend
git commit -m "feat: teknik dokuman veri sozlesmesini ekle"
```

### Task 2: Secure PDF file serving with byte ranges

**Files:**
- Create: `backend/src/Cekirdek/PdfDosyaSunucusu.php`
- Modify: `backend/public/index.php`
- Modify: `backend/tests/api_dogrulama.php`
- Modify: `frontend/vite.config.js`

**Interfaces:**
- Consumes: `SiteDeposu::teknikDokuman(string $slug): ?array`.
- Produces: `PdfDosyaSunucusu::guvenliYol(string $pdfKoku, string $goreliYol): ?string`, `PdfDosyaSunucusu::gonder(array $dokuman, string $pdfKoku): never`, `GET /dokumanlar/{slug}`.

- [x] **Step 1: Write failing path-security tests**

```php
$pdfKoku = realpath(__DIR__ . '/../../pdf');
if (PdfDosyaSunucusu::guvenliYol($pdfKoku, '../gizli.pdf') !== null) {
    throw new RuntimeException('PDF dizin geçişi engellenmedi.');
}
if (!str_ends_with((string) PdfDosyaSunucusu::guvenliYol($pdfKoku, 'ceviri_tablosu.pdf'), 'ceviri_tablosu.pdf')) {
    throw new RuntimeException('Kök içindeki PDF reddedildi.');
}
```

Use the authorized project asset `pdf/ceviri_tablosu.pdf` as the valid-path fixture; the test must only read it.

- [x] **Step 2: Run PHP test and verify failure**

Expected: FAIL because `PdfDosyaSunucusu` does not exist.

- [x] **Step 3: Implement safe resolution and streaming**

`guvenliYol` must decode no URL fragments, reject absolute paths and non-`.pdf` extensions, resolve with `realpath`, and require the result to start with the resolved PDF root plus `DIRECTORY_SEPARATOR`.

`gonder` must set:

```php
header('Content-Type: application/pdf');
header('X-Content-Type-Options: nosniff');
header('Accept-Ranges: bytes');
header('Content-Disposition: inline; filename="' . $guvenliDosyaAdi . '"');
```

Parse only a single `bytes=baslangic-bitis` range. Return `206` with `Content-Range` for valid ranges, `416` for invalid ranges, otherwise `200`. Stream in 64 KiB chunks with `fseek`; never load the complete PDF into PHP memory.

- [x] **Step 4: Route registered documents before the HTML fallback**

In `backend/public/index.php`, match `#^/dokumanlar/([^/]+)$#`, validate slug, fetch the active record, return 404 when absent, and call:

```php
PdfDosyaSunucusu::gonder($dokuman, dirname(__DIR__, 2) . '/pdf');
```

Add `/dokumanlar` to the Vite development proxy with the same PHP target used by `/api`.

Filter the JSON category tree through `PdfDosyaSunucusu::guvenliYol` before responding so a database record whose physical file is missing is not advertised to visitors.

- [x] **Step 5: Verify real headers and commit**

After importing Task 1 schema, verify:

```powershell
$yanit = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5176/dokumanlar/ceviri-tablosu' -Headers @{ Range = 'bytes=0-99' }
$yanit.StatusCode
$yanit.Headers.'Content-Range'
$yanit.Headers.'Content-Type'
```

Expected: `206`, `bytes 0-99/297187`, and `application/pdf`.

```powershell
git add backend frontend/vite.config.js pdf/ceviri_tablosu.pdf
git commit -m "feat: pdf dosyalarini guvenli sun"
```

### Task 3: Frontend data flow and local PDF.js adapter

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json`
- Modify: `frontend/src/servisler/api.js`
- Modify: `frontend/src/servisler/api.test.js`
- Modify: `frontend/src/veri/ornekVeriler.js`
- Create: `frontend/src/servisler/pdfBelgesi.js`
- Create: `frontend/src/servisler/pdfBelgesi.test.js`

**Interfaces:**
- Produces: `veri.teknik_dokumanlar`, `pdfBelgesiYukle(adres): Promise<PDFDocumentProxy>`, `pdfSayfasiCiz(pdf, sayfaNo, canvas, olcek): Promise<void>`.

- [x] **Step 1: Write failing API request test**

Extend the current `siteVerileriniGetir` test:

```js
expect(istenenYollar).toContain('/api/teknik-dokumanlar');
expect(veri.teknik_dokumanlar[0].dokumanlar[0].baslik).toBe('Çeviri Tablosu');
```

- [x] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/servisler/api.test.js`

Expected: FAIL because no technical-document request is made.

- [x] **Step 3: Install and wire PDF.js**

Run:

```powershell
npm install pdfjs-dist
```

Add `['teknik-dokumanlar', ornekVeriler.teknik_dokumanlar]` to `istekler` and matching fallback categories/documents to `ornekVeriler.js`.

Configure the bundled worker in `pdfBelgesi.js`:

```js
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

export async function pdfBelgesiYukle(adres) {
  return getDocument({ url: adres, withCredentials: false }).promise;
}

export async function pdfSayfasiCiz(pdf, sayfaNo, canvas, olcek) {
  const sayfa = await pdf.getPage(sayfaNo);
  const gorunum = sayfa.getViewport({ scale: olcek });
  const baglam = canvas.getContext('2d', { alpha: false });
  canvas.width = Math.ceil(gorunum.width);
  canvas.height = Math.ceil(gorunum.height);
  await sayfa.render({ canvasContext: baglam, viewport: gorunum }).promise;
}
```

- [x] **Step 4: Test adapter delegation**

Mock `pdfjs-dist` and verify `pdfBelgesiYukle('/dokumanlar/ceviri-tablosu')` calls `getDocument` with that URL. Mock a page/render task and verify canvas width/height are set from the viewport.

- [x] **Step 5: Run focused tests and commit**

```powershell
npm test -- --run src/servisler/api.test.js src/servisler/pdfBelgesi.test.js
git add frontend/package.json frontend/package-lock.json frontend/src/servisler frontend/src/veri
git commit -m "feat: pdfjs veri akisini ekle"
```

### Task 4: Accessible PDF viewer component

**Files:**
- Create: `frontend/src/bilesenler/PdfGoruntuleyici.jsx`
- Create: `frontend/src/bilesenler/PdfGoruntuleyici.test.jsx`

**Interfaces:**
- Consumes: `dokuman`, `siteAyarlari`, injectable `belgeYukleyici`, injectable `sayfaCizici`, `onKapat`.
- Produces: selected-document viewer with page, zoom, thumbnail, download, new-tab and close controls.

- [x] **Step 1: Write failing interaction tests**

Use a fake PDF `{ numPages: 2, destroy: vi.fn(), getPage: vi.fn() }` and injected async renderer. Assert:

```jsx
expect(await screen.findByRole('heading', { name: 'Çeviri Tablosu' })).toBeInTheDocument();
expect(screen.getByText('1 / 2')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: 'Sonraki sayfa' }));
expect(screen.getByText('2 / 2')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: 'Yakınlaştır' }));
expect(screen.getByText('110%')).toBeInTheDocument();
expect(screen.getByRole('link', { name: 'İndir' })).toHaveAttribute('download', 'ceviri_tablosu.pdf');
```

Add separate tests for `indirmeye_izin_var_mi = 0`, loader rejection, Escape close, and focus return.

- [x] **Step 2: Run test and verify failure**

Run: `npm test -- --run src/bilesenler/PdfGoruntuleyici.test.jsx`

Expected: FAIL because component does not exist.

- [x] **Step 3: Implement document lifecycle**

On `dokuman.dosya_adresi` change, set loading state, load the PDF, set page `1`, render the main canvas and page thumbnails, and call `pdf.destroy()` during cleanup. Guard each awaited result with an `etkin` boolean so stale documents cannot update state.

Clamp zoom to `0.5`–`2.0` in `0.1` steps. Disable previous on page 1 and next on the last page. Use `Intl.NumberFormat('tr-TR')` to present file size in MB/KB.

- [x] **Step 4: Implement toolbar and accessibility**

Use lucide-react icons with visible Turkish labels for download/new-tab and `aria-label` for icon-only page/zoom/close controls. Add `aria-live="polite"` to load/error state and `aria-current="page"` to the active thumbnail. Escape calls `onKapat`.

- [x] **Step 5: Run viewer tests and commit**

```powershell
npm test -- --run src/bilesenler/PdfGoruntuleyici.test.jsx
git add frontend/src/bilesenler/PdfGoruntuleyici.jsx frontend/src/bilesenler/PdfGoruntuleyici.test.jsx
git commit -m "feat: pdf goruntuleyici bilesenini ekle"
```

### Task 5: Technical page layout and responsive styling

**Files:**
- Create: `frontend/src/sayfalar/TeknikSayfasi.jsx`
- Create: `frontend/src/sayfalar/TeknikSayfasi.test.jsx`
- Create: `frontend/src/stiller/teknik.css`
- Create: `frontend/src/stiller/teknik.test.js`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/App.test.jsx`

**Interfaces:**
- Consumes: `veri.teknik_dokumanlar`, `veri.site_ayarlari`, `PdfGoruntuleyici`.
- Produces: independent `/teknik` page; `IcerikSayfasi` continues serving only Kurumsal, Sertifikalar and İletişim.

- [x] **Step 1: Write failing page tests**

Render two categories with one PDF and assert:

```jsx
expect(screen.getByRole('heading', { name: 'Teknik' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'Teknik Tablolar' })).toBeInTheDocument();
expect(screen.getByText('1 doküman')).toBeInTheDocument();
expect(screen.getByText('0 doküman')).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /Çeviri Tablosu/ }));
expect(screen.getByTestId('pdf-goruntuleyici')).toBeInTheDocument();
```

Mock `PdfGoruntuleyici` in the page test so PDF rendering remains the component test’s responsibility.

- [x] **Step 2: Run focused page tests and verify failure**

Run: `npm test -- --run src/sayfalar/TeknikSayfasi.test.jsx src/App.test.jsx`

Expected: FAIL because `/teknik` still renders `IcerikSayfasi`.

- [x] **Step 3: Implement the page structure**

Create a theme-driven hero, two-column category grid and document buttons. Maintain `seciliDokuman` and the opening button ref. After selection, render `PdfGoruntuleyici` below the category grid and call `scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })` only after the viewer mounts.

Map `ikon_adi` through an allowlist:

```js
const KATEGORI_IKONLARI = {
  'dosya-hesaplama': FileSpreadsheet,
  'kitap-acik': BookOpen
};
```

Unknown names use `FileText`; do not construct component names from database text.

- [x] **Step 4: Replace only the Technical route**

In `App.jsx`:

```jsx
<Route
  path="/teknik"
  element={<TeknikSayfasi kategoriler={veri.teknik_dokumanlar} siteAyarlari={veri.site_ayarlari} />}
/>
```

Keep every other route byte-for-byte unchanged.

- [x] **Step 5: Implement responsive styles**

Use existing `--renk-*` variables only. Desktop category grid is two columns; below 1024px it is one. Viewer layout uses `minmax(0, 1fr)` to prevent overflow; at 639px thumbnails become a horizontal strip and toolbar wraps. Add visible `:focus-visible` states and a reduced-motion media query.

- [x] **Step 6: Run page/style tests and commit**

```powershell
npm test -- --run src/sayfalar/TeknikSayfasi.test.jsx src/stiller/teknik.test.js src/App.test.jsx
git add frontend/src/App.jsx frontend/src/App.test.jsx frontend/src/sayfalar/TeknikSayfasi* frontend/src/stiller/teknik.css frontend/src/stiller/teknik.test.js
git commit -m "feat: teknik dokuman merkezini ekle"
```

### Task 6: Full verification and durable project status

**Files:**
- Modify: `PROJE_DURUMU.md`
- Modify: `docs/superpowers/plans/2026-09-07-teknik-dokuman-merkezi-uygulama-plani.md`

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: verified continuation point for the next session.

- [x] **Step 1: Run the complete automated suite**

```powershell
cd frontend
npm test -- --run
npm run build
cd ..
& 'C:\Users\Sinan\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.4_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe' backend/tests/api_dogrulama.php
powershell -ExecutionPolicy Bypass -File veritabani/sema_dogrulama.ps1
```

Expected: all tests and production build pass.

- [x] **Step 2: Verify live API and PDF headers**

Verify `/api/teknik-dokumanlar` returns two categories and one document, `/dokumanlar/ceviri-tablosu` returns 200, byte range returns 206, traversal-like and unknown slugs return 400/404, and MIME is `application/pdf`.

- [x] **Step 3: Verify the real PDF in browsers**

At 375×812, 768×1024, 1440×1000 and 1920×1080:

- open `/teknik` and click `Çeviri Tablosu`;
- wait until the PDF canvas has non-zero dimensions;
- verify page `1 / 1`, zoom controls, download and close;
- verify no document-level horizontal overflow;
- verify console has no errors;
- capture one desktop and one mobile screenshot for visual review, then move temporary screenshots outside the workspace.

- [x] **Step 4: Update project status**

Record exact test counts, tables, endpoints, live PDF result, responsive widths, changed files, known browser limitations and the next requested task in `PROJE_DURUMU.md`. Mark completed plan checkboxes only for verified steps.

- [x] **Step 5: Commit**

```powershell
git add PROJE_DURUMU.md docs/superpowers/plans/2026-09-07-teknik-dokuman-merkezi-uygulama-plani.md
git commit -m "docs: teknik dokuman merkezi durumunu kaydet"
git status --short
```

Expected final status: only the user-owned untracked `Carousel/` directory remains. The explicitly authorized `pdf/ceviri_tablosu.pdf` asset is committed because the live Technical page depends on it.
