# Referanslar Sayfası Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Referans kayıtlarını ve galeri görsellerini PHP/MySQL üzerinden alan, filtrelenebilir ve tüm cihazlarda anlaşılır bir Referanslar sayfası oluşturmak.

**Architecture:** MySQL'deki `referanslar` ve `referans_gorselleri` tabloları `SiteDeposu` üzerinden tek bir `/api/referanslar` yanıtına dönüştürülür. React uygulama veri yükleyicisi bu yanıtı diğer başlangıç verileriyle birlikte alır ve yalnız `/referanslar` rotasında bağımsız `ReferanslarSayfasi` bileşenine aktarır.

**Tech Stack:** React 19, React Router, CSS3, Vitest/Testing Library, PHP 8 PDO, MySQL/MariaDB

**Spec:** `docs/superpowers/specs/2026-09-07-referanslar-sayfasi-tasarimi.md`

## Global Constraints

- Çalışma tek ajanla yürütülecek ve yalnız Referanslar alanı değiştirilecek.
- Kod yorumları, tablo ve sütun adları Türkçe olacak.
- Inter yazı ailesi ve dinamik CSS tema değişkenleri korunacak.
- Görseller kod içine gömülmeyecek; göreli yollar veri katmanından gelecek.
- Telefon, tablet, dizüstü ve geniş ekran uyumluluğu korunacak.

---

### Task 1: Referans veri sözleşmesi

**Files:**
- Modify: `frontend/src/servisler/api.test.js`
- Modify: `frontend/src/servisler/api.js`
- Modify: `frontend/src/veri/ornekVeriler.js`

**Interfaces:**
- Produces: `siteVerileriniGetir(): Promise<{tema, menu, sliderlar, kategoriler, referanslar}>`
- Produces: `referanslar: {kayitlar: Referans[], gorseller: ReferansGorseli[]}`

- [x] API istemcisinin `/api/referanslar` isteğini ve yedek sözleşmeyi bekleyen başarısız testi yaz.
- [x] `npm test -- --run src/servisler/api.test.js` ile testin doğru nedenle başarısız olduğunu doğrula.
- [x] Referans yedek verisini ve paralel API isteğini en küçük değişiklikle ekle.
- [x] Aynı testi yeniden çalıştırıp başarılı olduğunu doğrula.

### Task 2: Referanslar React sayfası

**Files:**
- Create: `frontend/src/sayfalar/ReferanslarSayfasi.test.jsx`
- Create: `frontend/src/sayfalar/ReferanslarSayfasi.jsx`
- Create: `frontend/src/stiller/referanslar.css`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/App.test.jsx`

**Interfaces:**
- Consumes: `referanslar` veri sözleşmesi.
- Produces: `<ReferanslarSayfasi referanslar={veri.referanslar} />`

- [x] Başlık, veri temelli sayaç, bölge filtresi ve galeri açma/kapatma davranışlarını bekleyen bileşen testlerini yaz.
- [x] `npm test -- --run src/sayfalar/ReferanslarSayfasi.test.jsx` ile testlerin bileşen bulunmadığı için başarısız olduğunu doğrula.
- [x] Semantik liste, `aria-pressed` filtreler, büyütülmüş galeri ve Türkçe açıklama yorumlarıyla bileşeni yaz.
- [x] Sayfaya özel mobil öncelikli CSS'i dinamik tema değişkenleriyle yaz ve azaltılmış hareket tercihini destekle.
- [x] `/referanslar` rotasını yeni bileşene bağla; diğer `IcerikSayfasi` rotalarını değiştirme.
- [x] Sayfa ve App testlerini çalıştırıp başarılı olduğunu doğrula.

### Task 3: PHP/MySQL referans veri katmanı

**Files:**
- Modify: `backend/tests/api_dogrulama.php`
- Modify: `backend/src/Depolar/SiteDeposu.php`
- Modify: `backend/src/Denetleyiciler/SiteDenetleyicisi.php`
- Modify: `backend/public/index.php`
- Modify: `veritabani/demirvana.sql`
- Modify: `veritabani/sema_dogrulama.ps1`

**Interfaces:**
- Produces: `SiteDeposu::referanslar(): array`
- Produces: `GET /api/referanslar -> {basarili: true, veri: {kayitlar, gorseller}}`

- [x] API doğrulama testine referans bölgesi sözleşmesini koruyan başarısız kontrol ekle.
- [x] PHP testini çalıştırıp yeni davranış olmadığı için doğru nedenle başarısız olduğunu doğrula.
- [x] İki Türkçe tabloyu, indeksleri ve tekrar içe aktarılabilir 22 kayıt + 3 galeri başlangıç verisini şemaya ekle.
- [x] Depo, denetleyici ve sabit rotaya referans veri akışını ekle.
- [x] PHP sözdizimi, API testi ve şema doğrulamasını çalıştır.

### Task 4: Görsel varlık ve bütünleşik doğrulama

**Files:**
- Create: `frontend/public/assets/referanslar/referans-galerisi.png`
- Modify: `PROJE_DURUMU.md`

**Interfaces:**
- Consumes: Galeri verisindeki `/assets/referanslar/referans-galerisi.png` yolu ve odak koordinatları.

- [x] Kullanıcının sağladığı galeri kaynağını proje varlığına kopyala; kaynak ekran görüntüsünün yalnız fotoğraf bölgesinin CSS ile odaklandığını görsel olarak doğrula.
- [x] Tüm frontend testlerini ve üretim derlemesini çalıştır.
- [x] Canlı API'de 22 referans ve 3 görsel döndüğünü doğrula.
- [x] 375, 768, 1024 ve 1440 px ekranlarda sayfayı; filtre, galeri, klavye odağı ve yatay taşma açısından doğrula.
- [x] Yalnız doğrulanmış sonuçlarla `PROJE_DURUMU.md` dosyasını güncelle.
