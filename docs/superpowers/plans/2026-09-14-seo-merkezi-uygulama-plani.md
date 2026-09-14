# SEO Merkezi Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Proje kuralı gereği alt ajan kullanılmaz. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Demir Vana admin paneline gerçek veri toplayan, geçmiş saklayan ve referans görsele uyan tek bir SEO Merkezi eklemek.

**Architecture:** SEO Merkezi, `/admin/seo?tab=...` altında tembel yüklenen yedi frontend sekmesinden oluşur. PHP tarafında mevcut genel site SEO deposundan ayrılan `SeoMerkeziDeposu`, küçük servisler ve CLI iş çalıştırıcısı; MariaDB tarafında append-only şema genişletmeleri kullanılır. Kimlik gerektiren sağlayıcılar sunucuda adaptör arayüzleriyle ayrılır ve bağlanana kadar sahte veri yerine bağlantı durumu döndürür.

**Tech Stack:** React, React Router, plain CSS, Lucide React, Recharts, PHP 8.4, PDO, MariaDB/MySQL, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-14-seo-merkezi-tasarim-ve-islev.md`

## Global Constraints

- Yalnız bir sidebar öğesi: `SEO Merkezi`.
- Arayüz ve kaynak kod açıklamaları Türkçe.
- Mevcut admin shell ve ilgisiz sayfalar değişmez.
- Frontend sabit üretim SEO verisi içermez.
- API anahtarları yalnız sunucuda tutulur.
- Her aşama kendi gerçek veri akışı, testi ve ayrı commit’iyle tamamlanır.
- `TABLO-STANDARDI.md` ve `BUTON-STANDARDI.md` uygulanır.

---

### Task 1: Güvenlik ve entegrasyon sözleşmesi

**Files:**
- Create: `backend/src/Seo/SeoSaglayiciSozlesmesi.php`
- Create: `backend/src/Seo/SeoEntegrasyonDurumu.php`
- Modify: `backend/public/index.php`
- Append: `veritabani/demirvana.sql`
- Test: `backend/tests/seo_entegrasyon_test.php`

**Interfaces:**
- Produces: `SeoSaglayiciSozlesmesi::durum(): array`, entegrasyon kayıtları ve admin SEO route kapısı.

- [ ] Kimlik bilgisi olmayan sağlayıcının `bagli_degil` döndürdüğünü sınayan PHP testi yaz.
- [ ] `seo_entegrasyonlari` tablosunu; sağlayıcı, durum, son başarılı bağlantı ve hata alanlarıyla şemanın sonuna ekle.
- [ ] Search Console, SERP, backlink, reklam ve AI sağlayıcılarını ortak sözleşmeye bağla; hiçbir gizli değeri API yanıtına koyma.
- [ ] Mevcut admin panelinde auth olmadığını koruma testinde görünür kıl; yazma uçlarını gerçek yetki gelmeden “korumalı değil” olarak belgeleyip tamamlanmış sayma.
- [ ] `php backend/tests/seo_entegrasyon_test.php` ve değişen PHP dosyalarında `php -l` çalıştır.
- [ ] Commit: `feat(seo): entegrasyon ve güvenlik sozlesmesini ekle`.

### Task 2: Kalıcı SEO veri modeli ve iş geçmişi

**Files:**
- Append: `veritabani/demirvana.sql`
- Create: `backend/src/Depolar/SeoMerkeziDeposu.php`
- Test: `backend/tests/seo_depo_test.php`

**Interfaces:**
- Produces: anahtar kelime/geçmiş, rakip/snapshot/değişiklik, reklam gözlemi, tarama/sorun, performans, fırsat, bildirim, iş ve rapor CRUD sorguları.

- [ ] Şema testini önce yaz; Türkçe tablo/sütun adları ve gerekli tarih/benzersizlik indekslerini doğrula.
- [ ] `seo_anahtar_kelimeleri`, `seo_anahtar_kelime_gecmisi`, `seo_rakipleri`, `seo_rakip_sayfalari`, `seo_rakip_anlik_goruntuleri`, `seo_rakip_degisimleri` tablolarını ekle.
- [ ] Reklam, fırsat, site taraması, sorun, performans, Search Console, bildirim, zamanlanmış iş ve rapor tablolarını ekle.
- [ ] Depoda yalnız parametreli PDO sorguları kullan; büyük listelere tarih, durum, önem ve sayfalama filtreleri ekle.
- [ ] Şemayı temiz test veritabanına iki kez uygulayıp idempotency ve depo testini doğrula.
- [ ] Commit: `feat(seo): kalici izleme veri modelini ekle`.

### Task 3: SEO Merkezi kabuğu ve URL ile kalıcı sekmeler

**Files:**
- Create: `frontend/src/sayfalar/SeoMerkeziSayfasi.jsx`
- Create: `frontend/src/sayfalar/SeoMerkeziSayfasi.test.jsx`
- Create: `frontend/src/stiller/seo-merkezi.css`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/bilesenler/YonetimDuzeni.jsx`

**Interfaces:**
- Produces: `/admin/seo?tab=genel-bakis|anahtar-kelimeler|rakipler|reklamlar|firsatlar|site-sagligi|raporlar`.

- [x] Tek sidebar öğesi ve yedi ikonlu sekmeyi sınayan testi yaz.
- [x] `SEO Merkezi` öğesini mevcut admin menüsüne yalnız bir kez ekle; eski pasif `SEO Ayarları` satırını aynı işlevi çoğaltmayacak biçimde kaldır.
- [x] `useSearchParams` ile geçersiz tabı `genel-bakis`e düşür; ileri/geri ve yenilemeyi test et.
- [x] Referanstaki başlık, açıklama, tarih seçici, yenileme zamanı ve rapor düğmesini mevcut tokenlarla kur.
- [x] Ağır sekmeleri `React.lazy` ile ayır; sekme bazlı skeleton ve dürüst boş durumlar ekle.
- [x] İlgili Vitest, tam frontend testi ve build çalıştır.
- [x] Commit: `feat(seo): merkez kabugunu ve sekmeleri ekle`.

### Task 4: Çalışan iç site tarayıcısı ve Site Sağlığı

**Files:**
- Create: `backend/src/Seo/SiteTaramaServisi.php`
- Create: `backend/src/Seo/SeoSorunAnalizServisi.php`
- Create: `backend/bin/seo-gorev-calistir.php`
- Create: `frontend/src/sayfalar/seo/SiteSagligiSekmesi.jsx`
- Modify: `backend/public/index.php`
- Modify: `frontend/src/servisler/api.js`
- Test: `backend/tests/seo_site_tarama_test.php`
- Test: `frontend/src/sayfalar/seo/SiteSagligiSekmesi.test.jsx`

**Interfaces:**
- Produces: `POST /api/admin/seo/taramalar`, `GET /api/admin/seo/site-sagligi`, gerçek iş durumu ve kalıcı sorun listesi.

- [ ] Yerel test sitesiyle 404, eksik title/meta/H1, canonical, mixed-case URL, bozuk link ve görsel ALT sorun testlerini yaz.
- [ ] Aynı origin sınırı, istek zaman aşımı, maksimum URL ve robots kuralları olan tarayıcıyı uygula.
- [ ] Tarama ve sorunları transaction ile sakla; puanı teknik alt puanlardan açıklanabilir biçimde hesapla.
- [ ] “Siteyi Tara”, URL kontrolü, sitemap ve robots kontrollerini gerçek endpointlere bağla.
- [ ] Sorun filtresi, önem rozeti, etkilenen URL çekmecesi, loading/empty/error durumlarını uygula.
- [ ] PHP ve frontend testleriyle kalıcılığı doğrula.
- [ ] Commit: `feat(seo): site sagligi taramasini calistir`.

### Task 5: Rakip yönetimi, tarama ve değişiklik zekâsı

**Files:**
- Create: `backend/src/Seo/RakipTaramaServisi.php`
- Create: `backend/src/Seo/RakipKarsilastirmaServisi.php`
- Create: `frontend/src/sayfalar/seo/RakiplerSekmesi.jsx`
- Modify: `backend/public/index.php`
- Modify: `frontend/src/servisler/api.js`
- Test: `backend/tests/seo_rakip_degisim_test.php`
- Test: `frontend/src/sayfalar/seo/RakiplerSekmesi.test.jsx`

**Interfaces:**
- Produces: rakip CRUD, manuel tarama, snapshot, alan bazlı önce/sonra farkı ve kronolojik hareket akışı.

- [ ] Rakip ekle/sil, SSRF engeli ve sitemap alan adı sınırı testlerini yaz.
- [ ] Tam rakip içeriği yerine title/meta/H1/canonical/schema özeti, linkler, kelime sayısı ve içerik hash’i sakla.
- [ ] Yeni/silinen/değişen sayfa ve SEO alanı değişikliklerini önceki snapshot ile hesapla.
- [ ] Olaylarda “ne oldu, neden önemli, olası etki, önerilen eylem” alanlarını gerçek farktan üret.
- [ ] Rakip kartları, filtreli feed ve sağ detay çekmecesini referans tasarımla uygula.
- [ ] Testleri ve iki ardışık taramada değişiklik kalıcılığını doğrula.
- [ ] Commit: `feat(seo): rakip degisim zekasini ekle`.

### Task 6: Genel Bakışın gerçek veri birleşimi

**Files:**
- Create: `backend/src/Seo/SeoGenelBakisServisi.php`
- Create: `frontend/src/sayfalar/seo/GenelBakisSekmesi.jsx`
- Modify: `backend/public/index.php`
- Modify: `frontend/src/servisler/api.js`
- Test: `frontend/src/sayfalar/seo/GenelBakisSekmesi.test.jsx`

**Interfaces:**
- Produces: `GET /api/admin/seo/genel-bakis?baslangic=&bitis=`; kaynak ve önceki dönem bilgili KPI yanıtı.

- [ ] Veri yokken sahte sayı yerine kaynak bazlı boş/bağlantı durumu testini yaz.
- [ ] Site sağlığı, rakip hareketi, reklam, fırsat ve görevleri tek özet sorgusunda birleştir.
- [ ] Search Console/rank verisi yoksa ilgili KPI ve grafiklerde bağlantı kartı göster.
- [ ] Referanstaki beş KPI, Recharts sıralama grafiği, rakip tablo, üç hareket listesi ve görev şeridini uygula.
- [ ] Grafik serilerinde renk yanında çizgi biçimi/legend/erişilebilir ad kullan.
- [ ] Test, responsive kontrol ve bundle kontrolü yap.
- [ ] Commit: `feat(seo): gercek verili genel bakisi ekle`.

### Task 7: Anahtar kelime takibi ve Search Console adaptörü

**Files:**
- Create: `backend/src/Seo/SearchConsoleSaglayicisi.php`
- Create: `backend/src/Seo/AnahtarKelimeServisi.php`
- Create: `frontend/src/sayfalar/seo/AnahtarKelimelerSekmesi.jsx`
- Test: `backend/tests/seo_anahtar_kelime_test.php`
- Test: `frontend/src/sayfalar/seo/AnahtarKelimelerSekmesi.test.jsx`

**Interfaces:**
- Produces: keyword CRUD/history, GSC sync, gerçek önceki-güncel fark ve detay çekmecesi.

- [ ] Manuel kelime CRUD ve önceki kayıt yoksa `Yeni` durum testini yaz.
- [ ] GSC OAuth/servis hesabı yapılandırmasını yalnız backend environment üzerinden oku.
- [ ] Bağlı değilken veri tablosu uydurma; bağlantı durumu ve bağlama eylemi göster.
- [ ] Bağlıyken sorgu/sayfa/ülke/cihaz/gün metriklerini tarihsel sakla ve filtrele.
- [ ] Top 3/10/20, yakın, yükselen, düşen ve yüksek gösterim-düşük CTR filtrelerini gerçek sorgularla uygula.
- [ ] Detay grafikleri, landing page ve karşılaştırmaları tarihsel kayıttan üret.
- [ ] Commit: `feat(seo): anahtar kelime ve search console akislarini ekle`.

### Task 8: Performans, index, sitemap ve schema izleme

**Files:**
- Create: `backend/src/Seo/PerformansDenetimServisi.php`
- Create: `backend/src/Seo/IndexIzlemeServisi.php`
- Modify: `frontend/src/sayfalar/seo/SiteSagligiSekmesi.jsx`
- Test: `backend/tests/seo_performans_index_test.php`

**Interfaces:**
- Produces: Lighthouse/PageSpeed geçmişi, regresyon olayı, sitemap/index/schema özetleri.

- [ ] LCP/FCP/TBT/CLS/Speed Index saklama ve regresyon eşiği testlerini yaz.
- [ ] Yerel Lighthouse veya bağlı PageSpeed adaptörünü gerçek iş olarak çalıştır.
- [ ] Sitemap lastmod değerini içerik değişmeden değiştirme; okuma/gönderim sonucunu sakla.
- [ ] GSC URL Inspection yoksa index ayrıntısını “bağlantı gerekli” göster.
- [ ] Görünür içeriğe uymayan schema türünü puan kazandırmak için önermeme kuralını test et.
- [ ] Commit: `feat(seo): performans ve index izlemeyi ekle`.

### Task 9: İçerik fırsatları, ürün/kategori bağlantısı ve AI danışmanı

**Files:**
- Create: `backend/src/Seo/FirsatAnalizServisi.php`
- Create: `backend/src/Seo/AiSeoSaglayicisi.php`
- Create: `frontend/src/sayfalar/seo/IcerikFirsatlariSekmesi.jsx`
- Test: `backend/tests/seo_firsat_test.php`

**Interfaces:**
- Produces: açıklanabilir 0–100 fırsat puanı, iç link önerisi, ürün/kategori SEO bağlantısı ve onaysız yayın yapmayan AI önerisi.

- [ ] Pozisyon, gösterim, CTR, rakip gücü, içerik açığı ve sayfa ilgisi ağırlıklarını sabitleyen test yaz.
- [ ] Mevcut ürün/kategori URL’lerini gerçek veritabanından fırsatlarla eşleştir.
- [ ] Kaynak/hedef/anchor/gerekçe içeren iç link önerilerini sakla.
- [ ] AI bağlı değilse kural tabanlı kanıtı göster; bağlıysa problem/kanıt/etki/öneri/önem/güven şemasını doğrula.
- [ ] Hiçbir öneriyi otomatik yayınlama; yalnız içerik planı oluştur.
- [ ] Commit: `feat(seo): aciklanabilir icerik firsatlarini ekle`.

### Task 10: Reklam takibi ve sağlayıcı sınırları

**Files:**
- Create: `backend/src/Seo/ReklamSaglayicisi.php`
- Create: `frontend/src/sayfalar/seo/ReklamlarSekmesi.jsx`
- Test: `frontend/src/sayfalar/seo/ReklamlarSekmesi.test.jsx`

**Interfaces:**
- Produces: izinli kaynaktan reklam gözlemi/geçmişi veya dürüst bağlantı durumu.

- [ ] Sağlayıcı yokken reklam örneği göstermeyen boş durum testini yaz.
- [ ] Yalnız izinli API/şeffaflık kaynağı adaptörünü kabul et; kırılgan scraping ekleme.
- [ ] Başlık/açıklama/landing page değişikliklerini gözlem geçmişinden karşılaştır.
- [ ] Landing page SEO analizini site/rakip tarayıcı servisleriyle birleştir.
- [ ] Commit: `feat(seo): reklam izleme entegrasyon katmanini ekle`.

### Task 11: Bildirimler, zamanlanmış işler ve hızlı işlemler

**Files:**
- Create: `backend/src/Seo/SeoIsZamanlayici.php`
- Modify: `backend/bin/seo-gorev-calistir.php`
- Create: `frontend/src/bilesenler/seo/HizliIslemler.jsx`
- Test: `backend/tests/seo_is_zamanlayici_test.php`

**Interfaces:**
- Produces: iş adı/sonraki çalışma/süre/durum/sonuç/hata; bildirim okundu/incelendi/göreve dönüştürüldü akışı.

- [ ] Aynı işin eşzamanlı ikinci kez başlamasını engelleyen kilit testini yaz.
- [ ] İç tarama, rakip tarama, sitemap, GSC, keyword, performans, fırsat ve rapor işlerini CLI dispatcher’a kaydet.
- [ ] Cron/Windows Task Scheduler yalnız CLI komutunu çağıracak biçimde kurulum belgesi ekle.
- [ ] Hızlı İşlemlerdeki her düğmeyi gerçek işe/CRUD’a bağla; bağlantısız sağlayıcı eylemini açıklamayla devre dışı bırak.
- [ ] Gerçek olay eşiklerinden bildirim üret ve durum geçişlerini API’ye bağla.
- [ ] Commit: `feat(seo): zamanlanmis isleri ve bildirimleri ekle`.

### Task 12: Raporlar ve dışa aktarma

**Files:**
- Create: `backend/src/Seo/SeoRaporServisi.php`
- Create: `frontend/src/sayfalar/seo/RaporlarSekmesi.jsx`
- Modify: `frontend/src/servisler/api.js`
- Test: `backend/tests/seo_rapor_test.php`

**Interfaces:**
- Produces: haftalık/aylık ve konu bazlı kalıcı rapor; CSV, yazdırma görünümü ve PDF indirme.

- [ ] Raporun yalnız seçili dönemdeki tarihsel kayıtlardan üretildiğini test et.
- [ ] Yönetici özeti ve gelecek dönem önceliklerini kanıt bağlantılarıyla oluştur.
- [ ] CSV’yi yerel üret; PDF için sunucu taraflı güvenli PDF bağımlılığını kilitli sürümle ekle.
- [ ] Oluşturma işinin durumunu, hata halini ve tamamlanan dosya indirmesini uygula.
- [ ] Commit: `feat(seo): tarihsel rapor ve disa aktarmayi ekle`.

### Task 13: Son entegrasyon ve tamamlanma denetimi

**Files:**
- Modify: `PROJE_DURUMU.md`
- Create: `docs/seo-merkezi-kurulum.md`

**Interfaces:**
- Consumes: Task 1–12 çıktılarının tamamı.
- Produces: doğrulanmış kurulum ve sağlayıcı matrisi.

- [ ] Yedi tabı, tek sidebar öğesini, URL kalıcılığını ve lazy-loading’i E2E doğrula.
- [ ] Loading/empty/error durumlarını her sağlayıcı ve büyük veri listesi için doğrula.
- [ ] Tüm PHP syntax/API testlerini, Vitest’i ve production build’i çalıştır.
- [ ] Masaüstü/laptop/tablet/mobil ekran görüntülerini referansla karşılaştır.
- [ ] API yanıtı ve frontend bundle içinde secret bulunmadığını tara.
- [ ] Auth yokluğu veya bağlanmamış sağlayıcı varsa modülü “tamamlandı” değil, ilgili aşamada “bekliyor” olarak işaretle.
- [ ] Yalnız doğrulanmış sonuçları `PROJE_DURUMU.md` ve kurulum belgesine yaz.
- [ ] Commit: `docs(seo): kurulum ve tamamlanma denetimini kaydet`.

## Uygulama sırası ve onay kapıları

1. Temel: Task 1–3.
2. Kimliksiz çalışabilen çekirdek: Task 4–6.
3. Sağlayıcılar ve zekâ: Task 7–10.
4. Otomasyon/rapor/son kontrol: Task 11–13.

Her grup sonunda kullanıcıya çalışan ekran ve gerçek API sonucu gösterilmeden sonraki gruba geçilmez.
