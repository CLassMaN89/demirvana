# SEO Merkezi Tasarım ve İşlev Şartnamesi

## Kaynaklar

- Kullanıcı işlev belgesi: `C:/Users/Sinan/.codex/attachments/0779dbba-b5b7-4b90-86f3-bd67a4929151/pasted-text.txt`
- Kullanıcı tamamlanma ölçütleri: `C:/Users/Sinan/.codex/attachments/e94161c6-758c-4bf9-a512-ce1d6a0b82b6/pasted-text.txt`
- Birincil görsel referans: `C:/Users/Sinan/AppData/Local/Temp/codex-clipboard-23eb86f1-9cf6-4915-aec0-615cdb055429.png`

## Sabit kapsam

- Sol menüye yalnızca bir yeni öğe eklenir: `SEO Merkezi` (`/admin/seo`).
- Sayfa içinde ikonlu yedi yatay sekme bulunur: Genel Bakış, Anahtar Kelimeler, Rakip Intelligence, Reklam Takibi, İçerik Fırsatları, Site Sağlığı ve Raporlar.
- Sekme URL sorgusu yenileme ve ileri/geri gezinmede korunur.
- Arayüz Türkçe, masaüstü öncelikli ve mevcut admin kabuğuyla uyumlu olur.
- Mevcut sidebar, navbar ve diğer admin sayfaları yeniden tasarlanmaz.
- Lucide React, Recharts, merkezi tema değişkenleri, mevcut tablo ve buton standartları yeniden kullanılır.
- Sahte üretim verisi gösterilmez. Gerçek kayıt yoksa boş durum; kimlik bilgisi gereken sağlayıcı bağlı değilse entegrasyon durumu gösterilir.
- Görünen her eylem çalışır, açıklamalı biçimde devre dışıdır veya gerekli entegrasyonu açıkça bildirir.

## Görsel referans çözümlemesi

- Üst satır: mavi ikon kutusu, başlık/açıklama; sağda tarih aralığı ve rapor indirme.
- İkinci satır: tek çizgide, ikonlu, mavi aktif göstergeli yatay sekmeler.
- Genel Bakış: beş kompakt KPI; altında sıralama grafiği ve rakip karşılaştırma tablosu; üçüncü sırada rakip hareketleri, reklam hareketleri ve fırsatlar; en altta görev şeridi.
- Görsel dil: açık çalışma zemini, beyaz kart, ince mavi-gri sınır, düşük gölge, Inter, mevcut Demir Vana mavisi; durumlar için tutarlı yeşil/turuncu/kırmızı/mor yardımcı renkler.

## Gerçek veri sınırları

- İç site taraması, sitemap/robots kontrolü, sayfa meta/H1/canonical/schema/link/görsel analizi ve rakip sitemap/sayfa değişim tespiti üçüncü taraf kimliği olmadan çalışabilir.
- Search Console, SERP/rank, backlink, reklam şeffaflığı ve AI servisleri sunucu taraflı bağlantı kurulana kadar veri üretmez.
- Mevcut projede admin kimlik doğrulaması yoktur. “Admin izni zorunlu” ölçütü, ayrı bir kimlik doğrulama kararı uygulanmadan tamamlanmış sayılamaz.

## Tamamlanma tanımı

Yedi sekmenin görünmesi yeterli değildir. Veri şeması, toplama servisleri, geçmiş kayıtları, çalışan işler, API, hata/yükleme/boş durumları ve kalıcı raporlar doğrulanmadan modül tamamlandı olarak işaretlenmez.
