# Referanslar Sektör Filtreli Tasarım Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Referanslar sayfasını sektör filtreli, aranabilir ve iki sütunlu kompakt proje dizinine dönüştürmek.

**Architecture:** Sektör tanımları ve referans eşleşmeleri iki yeni Türkçe tabloda tutulur. Mevcut `/api/referanslar` sözleşmesi sektör dizisi ve kayıt başına sektör alanlarıyla genişletilir; React sayfası aynı veri üzerinden filtreleme ve arama yapar.

**Tech Stack:** React 19, CSS3, Vitest/Testing Library, PHP 8 PDO, MySQL/MariaDB

**Spec:** `docs/superpowers/specs/2026-09-07-referanslar-sektor-filtreli-tasarim.md`

## Global Constraints

- Tek ajan kullanılacak ve yalnız Referanslar sayfası/veri akışı değiştirilecek.
- Kod yorumları ile veritabanı adları Türkçe olacak.
- Inter ve dinamik tema değişkenleri korunacak.
- Galeri kaldırılmayacak; tüm cihaz uyumluluğu korunacak.

### Task 1: Frontend arama ve sektör davranışı

**Files:** `frontend/src/sayfalar/ReferanslarSayfasi.test.jsx`, `frontend/src/sayfalar/ReferanslarSayfasi.jsx`, `frontend/src/stiller/referanslar.css`, `frontend/src/veri/ornekVeriler.js`

- [x] Sektör filtresi, birleşik filtre+arama ve boş sonuç için başarısız testleri yaz.
- [x] Testlerin eksik arama/sektör davranışı nedeniyle başarısız olduğunu doğrula.
- [x] Yeni başlık, araç çubuğu, filtreleme, arama ve kart yapısını uygula.
- [x] Referans görseline uygun responsive CSS'i yaz ve testleri geçir.

### Task 2: Dinamik sektör veri katmanı

**Files:** `veritabani/demirvana.sql`, `veritabani/sema_dogrulama.ps1`, `backend/src/Depolar/SiteDeposu.php`, `backend/tests/api_dogrulama.php`

- [x] Sektör sözleşmesi için başarısız PHP/şema testi ekle.
- [x] İki sektör tablosunu ve tekrarlanabilir başlangıç eşleşmelerini ekle.
- [x] Depo sorgusunu `sektorler`, `sektor_adi` ve `sektor_slug` döndürecek şekilde genişlet.
- [x] Şemayı canlı veritabanına aktar ve API sayımlarını doğrula.

### Task 3: Görsel ve bütünleşik doğrulama

**Files:** `PROJE_DURUMU.md`

- [x] Tüm frontend testleri, üretim derlemesi, PHP ve şema kontrollerini çalıştır.
- [x] Responsive CSS, masaüstü canlı görünüm ve arama/filtre davranışını doğrula.
- [x] Proje durumunu yalnız doğrulanmış bilgilerle güncelle ve değişiklikleri kaydet.
