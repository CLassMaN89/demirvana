# Admin Yönetimli SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Demirvana için admin panelinden yönetilebilen, React ve PHP tarafından ortak kullanılan eksiksiz teknik SEO altyapısı kurmak.

**Architecture:** Global SEO ayarları mevcut `site_ayarlari`, rota kayıtları yeni `seo_sayfalari` tablosundan okunur. PHP SEO API'si, robots ve sitemap üretir; React tek bir `SeoYoneticisi` ile rota değişimlerinde head etiketlerini ve JSON-LD'yi güvenli biçimde günceller.

**Tech Stack:** React, React Router, PHP 8.4, PDO, MySQL/MariaDB, Vitest, JSON-LD.

**Spec:** `docs/superpowers/specs/2026-09-07-admin-yonetimli-seo-tasarimi.md`

## Global Constraints

- Bütün kaynak yorumları, tablo ve sütun adları Türkçe olacaktır.
- Alt ajan kullanılmayacaktır.
- Renkler merkezi tema değişkenlerinden gelir.
- Veritabanında bulunmayan fiyat, stok, puan veya yorum verisi üretilmez.
- Her üretim değişikliği önce başarısız testle doğrulanır.

---

### Task 1: SEO veri tabanı ve API sözleşmesi

**Files:**
- Modify: `veritabani/demirvana.sql`
- Create: `backend/src/Depolar/SeoDeposu.php`
- Create: `backend/src/Denetleyiciler/SeoDenetleyicisi.php`
- Modify: `backend/public/index.php`
- Modify: `backend/tests/api_dogrulama.php`

**Interfaces:**
- Produces: `SeoDeposu::seoVerileri(): array`, `SeoDenetleyicisi::seo(): array`, `GET /api/seo`.

- [x] **Step 1: Write the failing test**

```php
$seo = SeoDeposu::seoKayitlariniNesneyeDonustur([['rota' => '/', 'seo_basligi' => 'Demirvana']]);
if ($seo['/']['seo_basligi'] !== 'Demirvana') throw new RuntimeException('SEO dönüşümü bozuk.');
```

- [x] **Step 2: Run test to verify it fails**

Run: `php backend/tests/api_dogrulama.php`
Expected: FAIL because `SeoDeposu` does not exist.

- [x] **Step 3: Write minimal implementation**

Create `seo_sayfalari` with Turkish fields and seed all current public routes. Return `{genel, sayfalar}` from `/api/seo`.

- [x] **Step 4: Run test to verify it passes**

Run: `php backend/tests/api_dogrulama.php`
Expected: `PHP API doğrulamaları başarılı.`

- [x] **Step 5: Commit**

```bash
git add backend veritabani/demirvana.sql
git commit -m "feat: seo veri sozlesmesini ekle"
```

### Task 2: React head ve yapılandırılmış veri yönetimi

**Files:**
- Create: `frontend/src/seo/seoOlustur.js`
- Create: `frontend/src/seo/seoOlustur.test.js`
- Create: `frontend/src/bilesenler/SeoYoneticisi.jsx`
- Create: `frontend/src/bilesenler/SeoYoneticisi.test.jsx`
- Modify: `frontend/src/servisler/api.js`
- Modify: `frontend/src/servisler/api.test.js`
- Modify: `frontend/src/veri/ornekVeriler.js`
- Modify: `frontend/src/App.jsx`

**Interfaces:**
- Consumes: `{genel, sayfalar}` SEO API sözleşmesi.
- Produces: `seoVerisiOlustur(yol, seo, icerik)` and `<SeoYoneticisi />`.

- [x] **Step 1: Write the failing test**

```js
expect(seoVerisiOlustur('/urunler/test', seo, icerik).canonical).toBe('https://www.demirvana.com/urunler/test');
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/seo/seoOlustur.test.js`
Expected: FAIL because module does not exist.

- [x] **Step 3: Write minimal implementation**

Resolve exact route first, then content fallback, then global defaults. Update one instance of every head tag and replace the managed JSON-LD script on route changes.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/seo/seoOlustur.test.js src/bilesenler/SeoYoneticisi.test.jsx`
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add frontend/src
git commit -m "feat: react seo yoneticisini ekle"
```

### Task 3: robots.txt ve sitemap.xml

**Files:**
- Modify: `backend/src/Depolar/SeoDeposu.php`
- Modify: `backend/src/Denetleyiciler/SeoDenetleyicisi.php`
- Modify: `backend/public/index.php`
- Modify: `frontend/vite.config.js`
- Modify: `backend/tests/api_dogrulama.php`

**Interfaces:**
- Produces: `SeoDenetleyicisi::robots(): string`, `SeoDenetleyicisi::siteHaritasi(): string`, `/robots.txt`, `/sitemap.xml`.

- [x] **Step 1: Write the failing test**

```php
if (!str_contains(SeoDenetleyicisi::robotsMetniOlustur('https://www.demirvana.com'), 'Sitemap: https://www.demirvana.com/sitemap.xml')) throw new RuntimeException('Robots bozuk.');
```

- [x] **Step 2: Run test to verify it fails**

Run: `php backend/tests/api_dogrulama.php`
Expected: FAIL because output methods do not exist.

- [x] **Step 3: Write minimal implementation**

Generate UTF-8 XML with absolute canonical URLs from active menu, category, product and SEO records. Proxy both root endpoints to PHP in Vite development.

- [x] **Step 4: Run test to verify it passes**

Run: `php backend/tests/api_dogrulama.php`
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add backend frontend/vite.config.js
git commit -m "feat: dinamik robots ve sitemap ekle"
```

### Task 4: SEO uyumlu 404 ve HTML başlangıç etiketleri

**Files:**
- Create: `frontend/src/sayfalar/BulunamadiSayfasi.jsx`
- Create: `frontend/src/stiller/bulunamadi.css`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/index.html`
- Modify: `frontend/src/App.test.jsx`
- Create: `backend/src/Destek/SeoHtmlOlusturucu.php`
- Modify: `backend/src/Depolar/SeoDeposu.php`
- Modify: `backend/public/index.php`

**Interfaces:**
- Produces: gerçek 404 içeriği ve `noindex, nofollow` rota verisi.

- [x] **Step 1: Write the failing test**

```jsx
expect(await screen.findByRole('heading', { name: 'Sayfa bulunamadı' })).toBeInTheDocument();
expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.jsx`
Expected: FAIL because unknown routes redirect home.

- [x] **Step 3: Write minimal implementation**

Render themed 404 content, pass the current route to `SeoYoneticisi`, and add safe fallback metadata to `index.html` without duplicate canonical tags. PHP production entry point also injects route-specific metadata and JSON-LD before React starts; unknown direct routes return HTTP 404.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.jsx`
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add frontend
git commit -m "feat: seo uyumlu bulunamadi sayfasi ekle"
```

### Task 5: Tam doğrulama ve proje kaydı

**Files:**
- Modify: `PROJE_DURUMU.md`

**Interfaces:**
- Consumes: Task 1–4 çıktıları.
- Produces: doğrulanmış devam noktası.

- [x] **Step 1: Run complete verification**

```text
npm test -- --run
npm run build
php backend/tests/api_dogrulama.php
veritabani/sema_dogrulama.ps1
```

- [x] **Step 2: Verify live endpoints**

Check `/api/seo`, `/robots.txt`, `/sitemap.xml`, canonical, metadata and JSON-LD on localhost.

- [x] **Step 3: Update project status**

Record changed files, exact test counts, endpoint checks, known production Search Console step and next task in `PROJE_DURUMU.md`.

- [x] **Step 4: Commit**

```bash
git add PROJE_DURUMU.md
git commit -m "docs: seo uygulama durumunu kaydet"
```
