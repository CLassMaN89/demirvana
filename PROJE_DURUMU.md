# Demirvana Proje Durumu

Son güncelleme: 6 Eylül 2026

## Projenin amacı

Demirvana için React, CSS ve JavaScript tabanlı responsive arayüz; PHP REST API; phpMyAdmin uyumlu MySQL veritabanı ve gelecekteki yönetim paneline hazır modüler içerik altyapısı oluşturmak.

## Onaylanan kararlar

- İlk sürüm Türkçe olacak; yapı ileride çok dilliliğe genişleyebilecek.
- Çalışma tek ajan tarafından yürütülecek; alt ajan kullanılmayacak.
- Arayüz React, CSS ve JavaScript ile hazırlanacak.
- Ürün, kategori ve carousel metin/görselleri kaynak koda gömülmeyecek; PHP/MySQL veri katmanından yönetilebilecek.
- Tema renkleri veritabanından gelen CSS özel değişkenleriyle yönetilebilecek.
- Navbar masaüstünde tam 120px yüksekliğinde olacak.
- Ana sayfada yedi kategori kartı ve bir `Tüm Ürünler` kartı bulunacak.
- Carousel başlangıçta `Carousel/` dizinindeki altı görseli kullanacak.
- Carousel görselleri yaklaşık 1994×789px ve 2.53:1 oranında; hero masaüstünde bu oranı koruyacak.
- Mobilde hero için okunabilir minimum yükseklik ve yönetilebilir görsel odak noktası kullanılacak.
- Tüm arayüz telefon, tablet, dizüstü, masaüstü ve geniş ekranlarla uyumlu olacak.
- Logo kaynağı: `C:/Users/Sinan/Documents/Projeler/vana2/assets/logo.png`.

## Tamamlanan işler

- Proje klasörü ve mevcut görseller incelendi.
- Teknik mimari, görsel yön, veri modeli, API sözleşmesi ve responsive davranış tasarlandı.
- Tasarım belgesi oluşturuldu: `docs/superpowers/specs/2026-09-06-demirvana-site-tasarimi.md`.
- Kalıcı proje çalışma kuralları `AGENTS.md` dosyasına yazıldı.
- Oturumlar arası devam kaydı için bu dosya oluşturuldu.

## Mevcut durum

Tasarım belgesi kullanıcı tarafından onaylandı. Tek ajanla yürütülecek ayrıntılı uygulama planı hazırlandı. Uygulama kodu henüz oluşturulmadı. Çalışma alanı şu anda bir Git deposu değildir.

## Değiştirilen dosyalar

- `AGENTS.md`
- `PROJE_DURUMU.md`
- `docs/superpowers/specs/2026-09-06-demirvana-site-tasarimi.md`
- `docs/superpowers/plans/2026-09-06-demirvana-site-uygulama-plani.md`

## Doğrulamalar

- `Carousel/` içindeki altı görselin boyutları kontrol edildi.
- Tasarım belgesi eksik ifade, çelişki ve belirsiz rota açısından gözden geçirildi.
- Ürün ve kategori detay rotaları ayrı tanımlandı.

## Bilinen durumlar

- Yönetim paneli bu ilk teslimin kapsamında değildir; veri yapısı yönetim paneline hazır olacaktır.
- PHP/MySQL üretim bağlantısı için ileride ortam bilgileri gerekecektir.
- Git deposu olmadığı için henüz commit oluşturulmadı.

## Sıradaki adım

Kullanıcı devam et dediğinde `superpowers:executing-plans` yönergesiyle plan tek ajan tarafından test odaklı biçimde uygulanacak. İlk görev frontend temeli ve güvenli dinamik tema katmanıdır.
