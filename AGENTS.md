# Demirvana Proje Çalışma Kuralları

Bu dosyadaki kurallar, bu dizin ve tüm alt dizinlerindeki çalışmalar için geçerlidir.

## ZORUNLU KURAL — kullanıcı talebiyle sabitlenmiştir

Kullanıcı bu kuralı açıkça zorunlu tutmuştur; aşağıdaki maddelerin herhangi birinin ihlali kapsam dışı, izinsiz bir işlemdir:

1. Yalnızca kullanıcının o anda açıkça söylediği ekleme veya güncellemeyi yap. Kullanıcının söylemediği hiçbir şeyi kendi kararınla ekleme, değiştirme veya "iyileştirme" yapma.
2. Projeyi veya ilgisiz dosyaları baştan tarama, geniş grep/okuma turları yapma. Yalnızca üzerinde çalışılan alanla doğrudan ilgili dosyaları aç.
3. Görev, belirli bir bileşen/sayfa/alanla ilgiliyse yalnızca o alana dokun; komşu alanlara, ilgisiz sayfalara veya "madem buradayım" mantığıyla başka yerlere dokunma.
4. Emin olmadığın veya kullanıcının açıkça istemediği bir genişleme fikrin varsa, uygulamadan önce sor; kendi kafana göre iş yapma.

Bu madde, aşağıdaki "Değişiklik kapsamı" bölümünü geçersiz kılmaz, onu pekiştirir ve önceliklendirir.

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
   - Üretim kodundaki önemli bölüm ve kararların yanında neyin, nerede ve neden kullanıldığını açıklayan kısa Türkçe yorumlar bulundur.
   - Açıkça anlaşılır her satırı yorumlamak yerine veri akışı, güvenlik, responsive davranış ve etkileşim mantığını açıklamaya öncelik ver.
3. Veritabanı tablo ve sütun adlarını açık, anlaşılır Türkçe adlarla oluştur.
4. React, CSS ve JavaScript arayüz yapısını; PHP REST API ve MySQL veri katmanını onaylanan tasarım belgesine uygun tut.
5. Görsel içerikleri kaynak kod içine gömme. Görsel yollarını veri katmanından alınabilecek biçimde tasarla.
6. Tema renklerini merkezi CSS özel değişkenleri üzerinden yönet ve veritabanı/API ile değiştirilebilir yapıyı koru.
7. Tüm ekran değişikliklerinde telefon, tablet, dizüstü ve geniş ekran uyumluluğunu koru.
8. Projeyi geliştirmek ve doğrulamak için gereken standart yazılım bağımlılıklarını ayrıca izin istemeden kurabilirsin; kapsam dışı, riskli veya veri kaybına yol açabilecek sistem işlemleri bu yetkiye dahil değildir.

## Oturum sonu

1. Her anlamlı çalışma sonunda `PROJE_DURUMU.md` dosyasını güncelle.
2. Güncellemede yalnızca doğrulanmış bilgileri yaz: tamamlanan işler, değiştirilen dosyalar, çalıştırılan kontroller, bilinen sorunlar ve sıradaki net adım.
3. Tamamlanmamış bir işi tamamlanmış gibi işaretleme.
4. Kullanıcının sonraki oturumda devam edebilmesi için kısa ve açık bir devam noktası bırak.

## Temel belgeler

- Tasarım: `docs/superpowers/specs/2026-09-06-demirvana-site-tasarimi.md`
- Güncel ilerleme: `PROJE_DURUMU.md`
