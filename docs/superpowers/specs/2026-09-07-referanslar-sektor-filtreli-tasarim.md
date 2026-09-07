# Referanslar Sektör Filtreli Tasarım

## Kapsam

`/referanslar` sayfası kullanıcının gönderdiği açık mavi zeminli, iki sütunlu proje dizini referansına uyarlanacaktır. Navbar, hero, ürünler ve diğer sayfalar değiştirilmeyecektir. Mevcut fotoğraf galerisi proje kartlarının altında korunacaktır.

## Arayüz

- Üstte küçük `PROJELER` etiketi, `Referanslarımız` başlığı, açıklama ve sağda canlı sonuç sayısı bulunur.
- Altındaki beyaz araç çubuğunda sektör filtreleri ve kurum, şehir veya proje adında arama yapan alan yer alır.
- Filtreler `Tümü`, `Su ve Atıksu`, `Sulama`, `Enerji`, `Madencilik`, `Sanayi` ve `Belediye` sırasındadır.
- Referans kartları masaüstünde iki, mobilde tek sütundur. Büyük sıra numarası, sektör adı, proje başlığı, konum/kurum ve yıl rozeti içerir.
- Filtreler küçük ekranda yatay kaydırılabilir; arama alanı ayrı satıra geçer.
- Etkileşimler klavye ile kullanılabilir, seçili filtre `aria-pressed` ile açıklanır ve sonuç bilgisi `aria-live` kullanır.

## Veri modeli

- `referans_sektorleri`: `id`, `ad`, `slug`, `siralama`, `aktif_mi` ve zaman damgaları.
- `referans_sektor_eslesmeleri`: her referansı bir sektöre bağlayan `referans_id`, `sektor_id` alanları.
- `GET /api/referanslar`; `sektorler`, sektör bilgisi eklenmiş `kayitlar` ve `gorseller` dizilerini döndürür.
- Ayrı eşleşme tablosu mevcut `referanslar` tablosunu geriye dönük uyumlu tutar ve admin panelinde sektörlerin genişletilebilmesini sağlar.

## Doğrulama

- Sektör filtresi ve Türkçe büyük/küçük harf uyumlu arama birlikte çalışır.
- Sonuç sayısı her değişiklikte güncellenir; sonuç yoksa anlaşılır boş durum gösterilir.
- 375, 768, 1024 ve 1440px hedeflerinde yatay sayfa taşması oluşmaz.
- Frontend, PHP, şema ve canlı API kontrolleri başarılı olur.

