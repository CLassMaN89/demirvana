# Site Arama ve Sayfa Geçişi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Navbar aramasını gerçek site verisine bağlamak ve route geçişlerini yumuşatmak.

**Architecture:** Başlangıçta yüklenen menu, kategori, ürün ve referans verileri `Header` bileşenine aktarılır. Saf arama yardımcı fonksiyonu sonuçları üretir; `SayfaGecisi` bileşeni aktif rota anahtarıyla giriş animasyonunu tetikler.

**Tech Stack:** React 19, React Router, CSS3, Vitest/Testing Library

**Spec:** `docs/superpowers/specs/2026-09-07-site-arama-ve-sayfa-gecisi.md`

### Task 1: Gerçek navbar araması

- [x] Arama düğmesi, panel odağı ve gerçek sonuç bağlantısı için başarısız Header testleri yaz.
- [x] Arama kaynaklarını App → SayfaIskeleti → Header akışına bağla.
- [x] Açılır paneli, arama yardımcı fonksiyonunu ve responsive stilleri uygula.
- [x] Header ve API istemci testlerini geçir.

### Task 2: Sayfa geçiş animasyonu

- [x] Aktif rota bilgisini taşıyan geçiş sarmalayıcısı için başarısız test yaz.
- [x] `SayfaGecisi` bileşenini ve azaltılmış hareket uyumlu CSS animasyonunu ekle.
- [x] App testlerini ve üretim derlemesini geçir.

### Task 3: Canlı doğrulama

- [x] Masaüstü ve mobil CSS kurallarıyla arama açma, sonuç seçme ve route animasyonunu doğrula.
- [x] Tüm test, PHP, şema ve canlı API kontrollerini çalıştır.
- [x] `PROJE_DURUMU.md` dosyasını güncelle ve yalnız ilgili dosyaları kaydet.
