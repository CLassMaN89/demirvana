# Demirvana Teknik Doküman Merkezi Tasarımı

## Amaç

Mevcut `/teknik` yer tutucu sayfasını, kullanıcının gönderdiği ekran görüntüsündeki bilgi mimarisine sahip responsive bir teknik doküman merkezine dönüştürmek. Ziyaretçi doküman kategorilerini ve PDF listesini görür; bir kayda tıkladığında PDF, aynı sayfanın altında Demirvana temasına uyarlanmış özel bir görüntüleyicide açılır.

İlk deneme kaydı `C:/Users/Sinan/Documents/Projeler/vana3/pdf/ceviri_tablosu.pdf` dosyasını kullanır. Dosya içeriği değiştirilmez. Daha sonra kategori, doküman ve sayfa metinleri admin panelinden kod değişikliği gerektirmeden yönetilebilir.

## Kapsam

- Yalnız Teknik sayfası, onun veri sözleşmesi, PHP API/dosya sunumu, ilgili testler ve dokümantasyon değiştirilir.
- Navbar, footer, Referanslar, ana sayfa, ürünler ve diğer mevcut sayfalar korunur.
- İlk sürüm Türkçedir; veri tabloları `dil_kodu` ile gelecekteki dillere hazır tutulur.
- PDF dosyaları kaynak kod içine gömülmez; veritabanında güvenli göreli dosya yolu tutulur.

## Görsel yapı

### Üst bölüm

Teknik sayfası açık mavi-beyaz bir zemin üzerinde başlar. Sol tarafta `Teknik` başlığı ve kısa açıklama, sağ tarafta vana/boru dünyasını çağrıştıran düşük kontrastlı çizgisel endüstriyel doku bulunur. Dekoratif alan yeni bir sabit görsel gerektirmeden tema renkleri ve CSS ile oluşturulur.

### Doküman kategorileri

Kategori kartları masaüstünde iki sütun, tablette ve telefonda tek sütun kullanır. Her kartta:

- kategori simgesi, adı ve açıklaması;
- gerçek doküman sayısı;
- başlık, PDF simgesi, dosya boyutu ve `PDF görüntüle` eylemi bulunan satırlar;
- boş kategoride admin üzerinden içerik eklenebileceğini anlatan kısa durum metni bulunur.

İlk veride `Teknik Tablolar` ve `Kullanma Talimatları` kategorileri oluşturulur. `Çeviri Tablosu`, Teknik Tablolar altında deneme dokümanı olarak yer alır.

### PDF görüntüleyici

Doküman satırına tıklanınca kategori kartlarının altında tek bir görüntüleyici açılır ve sayfa bu alana yumuşak biçimde kayar. Aynı anda yalnız bir PDF seçili olabilir. Görüntüleyicide:

- seçili dokümanın başlığı, dosya adı ve boyutu;
- küçük sayfa önizlemeleri;
- ana PDF sayfası;
- önceki/sonraki sayfa;
- mevcut sayfa ve toplam sayfa;
- yüzde olarak yakınlaştırma, büyütme ve küçültme;
- PDF’yi indirme ve yeni sekmede açma;
- görüntüleyiciyi kapatma kontrolleri bulunur.

PDF.js, sayfaları canvas üzerinde çizer. Worker dosyası frontend paketiyle birlikte derlenir; harici CDN kullanılmaz. Yeni PDF seçildiğinde eski render görevi iptal edilir ve canvas belleği temizlenir.

## Responsive davranış

- 1024px ve üzerinde kategori kartları iki sütundur; görüntüleyici tüm içerik genişliğini kullanır.
- Tablet ve telefonda kategori kartları tek sütuna iner.
- Masaüstündeki dikey küçük resim rayı telefonda yatay kaydırılabilir şeride dönüşür.
- Görüntüleyici araç çubuğu küçük ekranda iki satıra sarılır; en önemli sayfa ve yakınlaştırma kontrolleri görünür kalır.
- PDF canvas kapsayıcı genişliğini aşmaz; kullanıcı yakınlaştırdığında yalnız görüntü alanı kendi içinde kayar, sayfanın tamamında yatay taşma oluşmaz.
- `prefers-reduced-motion` tercihinde açılış ve kaydırma animasyonları kaldırılır.

## Veri modeli

### `teknik_dokuman_kategorileri`

- `id`
- `dil_kodu`
- `ad`
- `slug`
- `aciklama`
- `ikon_adi`
- `siralama`
- `aktif_mi`
- oluşturulma ve güncellenme tarihleri

### `teknik_dokumanlar`

- `id`
- `kategori_id`
- `dil_kodu`
- `baslik`
- `slug`
- `dosya_yolu`
- `orijinal_dosya_adi`
- `alternatif_aciklama`
- `dosya_boyutu`
- `sayfa_sayisi`
- `indirmeye_izin_var_mi`
- `yeni_sekmede_acmaya_izin_var_mi`
- `siralama`
- `aktif_mi`
- oluşturulma ve güncellenme tarihleri

Dosya yolu proje kökündeki `pdf/` dizinine göre göreli tutulur. İlk kayıtta yol `ceviri_tablosu.pdf`, boyut `297187`, sayfa sayısı `1` olur.

## Admin tarafından yönetilecek metinler

`site_ayarlari` içinde Teknik hero başlığı/açıklaması, kategori alanı açıklaması, PDF görüntüle metni, boş kategori metni, görüntüleyici düğme metinleri ve hata/boş durum metinleri ayrı anahtarlarla tutulur. Renkler yeni sabit renkler eklenmeden mevcut merkezi CSS özel değişkenlerinden türetilir.

## API ve dosya akışı

- `GET /api/teknik-dokumanlar`, aktif kategorileri ve onların aktif dokümanlarını sıralı ağaç olarak döndürür.
- Başlangıç veri yükleyicisi bu ucu diğer mevcut uçlarla birlikte çağırır.
- `GET /dokumanlar/{slug}`, yalnız veritabanında aktif olan kaydın PDF dosyasını sunar.
- Sunucu gerçek dosya yolunu `pdf/` kökünün altında doğrular; `..`, mutlak yol ve kayıt dışı dosya erişimini reddeder.
- Yanıt `application/pdf`, `X-Content-Type-Options: nosniff`, güvenli `Content-Disposition` ve byte-range başlıklarını kullanır. Böylece PDF.js büyük dosyalarda gerekli aralığı okuyabilir.
- Bulunmayan, pasif veya fiziksel dosyası eksik kayıtlar JSON API’de listelenmez; doğrudan dosya isteği 404 döndürür.

## Hata ve yükleme durumları

- PDF yüklenirken görüntüleyicide belirgin bir işlem durumu gösterilir.
- Bozuk veya erişilemeyen PDF için kullanıcıya `Doküman görüntülenemedi` mesajı, yeniden deneme ve izinliyse yeni sekmede açma seçeneği sunulur.
- PDF listesi boşsa sayfa bozulmaz; kategori içinde yönlendirici boş durum görünür.
- Render sırasında bileşen kapanır veya başka belge seçilirse eski asenkron işlem state güncellemez.

## Erişilebilirlik

- Doküman satırları gerçek `button` öğeleridir ve seçili durumda `aria-pressed` kullanır.
- Görüntüleyici başlığı `aria-labelledby` ile bağlanır; yükleme ve hata bilgileri `aria-live` ile duyurulur.
- Araç çubuğu düğmelerinin Türkçe erişilebilir adları bulunur.
- Escape görüntüleyiciyi kapatır; kapanınca odak dokümanı açan düğmeye geri döner.
- Klavye odağı ve yüksek kontrastlı focus görünümü korunur.

## Test ve doğrulama

- Veritabanı şemasında iki tablo, Türkçe sütunlar, ilişkiler ve tekrarlanabilir başlangıç kayıtları doğrulanır.
- PHP depo/API testi kategori ağacını ve güvenli dosya çözümlemesini kapsar.
- React testleri kategori listeleme, PDF seçme/kapatma, sayfa değiştirme, zoom sınırları, indirme izni, hata ve boş durumlarını kapsar.
- PDF.js testlerde sahte adaptörle kullanılır; gerçek PDF tarayıcı doğrulamasında açılır.
- 375px, 768px, 1440px ve 1920px genişliklerde yatay taşma, araç çubuğu, PDF render ve konsol hataları kontrol edilir.

## Başarı ölçütü

`Çeviri Tablosu` satırı Teknik sayfasında görünür, tıklanınca gerçek `ceviri_tablosu.pdf` aynı sayfadaki özel görüntüleyicide açılır. Sayfa ve PDF kontrolleri klavye/fareyle çalışır; mobilde yatay sayfa taşması oluşmaz. Tüm kategori, doküman, dosya yolu, izin ve sayfa metinleri gelecekteki admin paneline hazır veri alanlarından gelir.
