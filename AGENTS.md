# Demirvana Proje Çalışma Kuralları

Bu dosyadaki kurallar, bu dizin ve tüm alt dizinlerindeki çalışmalar için geçerlidir.

## Oturum başlangıcı

1. Her yeni oturumda önce kök dizindeki `PROJE_DURUMU.md` dosyasını oku.
2. Projeyi baştan sona yeniden inceleme. Yalnızca mevcut görev için gerekli dosyaları ve `PROJE_DURUMU.md` içinde belirtilen ilgili alanları aç.
3. Önceki oturumda tamamlanan işleri tekrarlama; `PROJE_DURUMU.md` içindeki son durumdan devam et.
4. `PROJE_DURUMU.md` ile çalışma alanının gerçek durumu çelişirse dosyaları değiştirmeden önce kullanıcıya kısa ve somut biçimde bildir.

## Değişiklik kapsamı

1. Yalnızca kullanıcının açıkça düzenlenmesini istediği alanı değiştir.
2. İstenen değişiklik için zorunlu olmayan dosyalara, stillere, bileşenlere, API davranışlarına veya veritabanı yapılarına dokunma.
3. İlgisiz mevcut davranışları, kullanıcı tarafından yapılmış değişiklikleri ve çalışma alanındaki diğer dosyaları koru.
4. Kapsam dışında bir değişiklik zorunlu görünüyorsa uygulamadan önce nedenini ve etkilenecek alanı kullanıcıya bildir; onay almadan kapsamı genişletme.
5. Geniş çaplı yeniden düzenleme, yeniden adlandırma veya biçimlendirme yapma; görev için gereken en küçük güvenli değişikliği uygula.
6. Kullanıcı açıkça istemedikçe dosya silme, mevcut içeriğin üzerine toplu yazma veya geri döndürülmesi güç işlem yapma.

## Çalışma biçimi

1. Alt ajan veya paralel ajan kullanma; bütün çalışmayı tek ajan olarak yürüt.
2. Kaynak kod yorumlarını ve açıklamalarını Türkçe yaz.
3. Veritabanı tablo ve sütun adlarını açık, anlaşılır Türkçe adlarla oluştur.
4. React, CSS ve JavaScript arayüz yapısını; PHP REST API ve MySQL veri katmanını onaylanan tasarım belgesine uygun tut.
5. Görsel içerikleri kaynak kod içine gömme. Görsel yollarını veri katmanından alınabilecek biçimde tasarla.
6. Tema renklerini merkezi CSS özel değişkenleri üzerinden yönet ve veritabanı/API ile değiştirilebilir yapıyı koru.
7. Tüm ekran değişikliklerinde telefon, tablet, dizüstü ve geniş ekran uyumluluğunu koru.

## Oturum sonu

1. Her anlamlı çalışma sonunda `PROJE_DURUMU.md` dosyasını güncelle.
2. Güncellemede yalnızca doğrulanmış bilgileri yaz: tamamlanan işler, değiştirilen dosyalar, çalıştırılan kontroller, bilinen sorunlar ve sıradaki net adım.
3. Tamamlanmamış bir işi tamamlanmış gibi işaretleme.
4. Kullanıcının sonraki oturumda devam edebilmesi için kısa ve açık bir devam noktası bırak.

## Temel belgeler

- Tasarım: `docs/superpowers/specs/2026-09-06-demirvana-site-tasarimi.md`
- Güncel ilerleme: `PROJE_DURUMU.md`

