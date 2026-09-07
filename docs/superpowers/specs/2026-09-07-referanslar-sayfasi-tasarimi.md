# Demirvana Referanslar Sayfası Tasarımı

## Amaç ve kapsam

Mevcut tek paragraf hâlindeki `/referanslar` rotası; kullanıcıların Demirvana'nın tamamladığı projeleri hızlıca anlayabildiği, yurtiçi ve yurtdışı kayıtlarını ayırabildiği ve saha fotoğraflarını inceleyebildiği bağımsız bir sayfaya dönüştürülecektir. Değişiklik yalnızca Referanslar sayfası, bu sayfanın veri uçları ve başlangıç verileriyle sınırlıdır; navbar, hero, ürün vitrini ve diğer içerik sayfaları değiştirilmeyecektir.

## Görsel yön

- Sayfa, Demirvana'nın mavi-beyaz marka dilini ve yerel Inter yazı ailesini korur.
- Ayırt edici görsel fikir “endüstriyel proje arşivi”dir: ince teknik çizgi, belirgin proje adları, kurum/yıl bilgisi ve düzenli bir kayıt ritmi kullanılır.
- Üst bölümde sol hizalı başlık ve kısa açıklama; sağda toplam, yurtiçi ve yurtdışı sayıları bulunur. Sayılar veriden hesaplanır, kaynak koda sabit yazılmaz.
- Kayıtlar masaüstünde iki sütunlu, mobilde tek sütunlu bir proje dizininde gösterilir. Kart görünümü ağır gölgeler yerine sınır, numara ve boşluk hiyerarşisiyle kurulur.
- `Tümü`, `Yurtiçi` ve `Yurtdışı` filtreleri gerçek `button` elemanlarıdır; seçili durum `aria-pressed` ile açıklanır ve klavye odağı görünür kalır.
- Fotoğraf galerisi üç görselden oluşur. Kullanıcının verdiği mevcut galeri fotoğrafları başlangıçta kullanılacak; yollar veri katmanında tutulacağı için yönetim panelinde ayrı görsellerle değiştirilebilecektir.
- Galeri görseli seçildiğinde erişilebilir bir büyütülmüş görünüm açılır; kapatma düğmesi ve Escape tuşu desteklenir.

## Responsive davranış

- 0–639 px: tek sütun kayıtlar, tam genişlik filtreler ve tek sütun galeri.
- 640–1023 px: iki sütun galeri; özet alanı içeriğin altında akabilir.
- 1024 px ve üzeri: iki sütun proje dizini, üç sütun galeri ve giriş bölümünde yan yana özet.
- Dokunma alanları en az 44 px, gövde metni en az 16 px ve yatay taşma olmadan çalışır.
- `prefers-reduced-motion: reduce` durumunda zorunlu olmayan geçişler kapatılır.

## Veri modeli ve API

### `referanslar`

- `id`, `baslik`, `konum`, `kurum`, `yil`, `bolge`, `siralama`, `aktif_mi` ve zaman damgaları.
- `bolge` yalnızca `yurtici` veya `yurtdisi` değerini alır.
- Ekran görüntüsündeki 18 yurtiçi ve 4 yurtdışı kayıt tekrarlanabilir başlangıç verisi olarak eklenir.

### `referans_gorselleri`

- `id`, `gorsel_yolu`, `alternatif_metin`, `odak_x`, `odak_y`, `gorsel_olcegi`, `siralama`, `aktif_mi` ve zaman damgaları.
- Görsel dosyaları veritabanına gömülmez; yalnızca yönetilebilir göreli yollar saklanır.

### `GET /api/referanslar`

Yanıt `kayitlar` ve `gorseller` dizilerini döndürür. Yalnız etkin kayıtlar sıralamaya göre gelir. Frontend geliştirme sırasında API kullanılamazsa aynı sözleşmeye sahip örnek veriye döner.

## Erişilebilirlik ve hata davranışı

- Projeler anlamsal liste olarak işaretlenir ve filtre sonucunun sayısı canlı metinle güncellenir.
- Boş filtre sonucu için açıklayıcı mesaj gösterilir.
- Galeri görsellerinde açıklayıcı alternatif metin bulunur.
- Etkileşimli bütün öğelerde görünür klavye odağı ve renk dışında ek durum göstergesi vardır.

## Doğrulama ölçütleri

- Ekran görüntüsündeki 22 kayıt doğru bölge gruplarıyla görünür.
- Filtreler doğru kayıtları gösterir ve sayaç güncellenir.
- Galeri açma/kapatma fare, dokunma, klavye ve Escape ile çalışır.
- API, şema, frontend testleri ve üretim derlemesi başarılıdır.
- 375, 768, 1024 ve 1440 px ekranlarda yatay taşma veya navbar çakışması yoktur.
