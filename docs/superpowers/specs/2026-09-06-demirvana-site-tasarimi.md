# Demirvana Web Sitesi Tasarım Belgesi

## Amaç ve kapsam

Demirvana için vana üretimi, imalatı ve B2B/B2C satışını tanıtan; mobil, tablet ve masaüstü cihazlarda çalışan dinamik bir web sitesi hazırlanacaktır. İlk sürüm yalnızca Türkçe olacaktır. İçerik mimarisi ileride dil kodu ve çeviri kayıtları eklenebilecek şekilde merkezi tutulacaktır.

İlk teslim ana sayfa, ürün kataloğu, ürün/kategori detay görünümü ve kurumsal sayfaların genişlemeye hazır iskeletini kapsar. Yönetim paneli bu teslimin kapsamında değildir; buna rağmen tüm içerikler ve tema değerleri ileride bir yönetim panelinden düzenlenebilecek veri modeli ve API sınırlarıyla hazırlanacaktır.

## Teknik mimari

Uygulama üç ana katmandan oluşacaktır:

- `frontend/`: Vite tabanlı React uygulaması, React Router, ES6+, HTML5 ve CSS3.
- `backend/`: PHP REST API, PDO ile güvenli MySQL bağlantısı ve JSON yanıtları.
- `veritabani/`: phpMyAdmin üzerinden içe aktarılabilir SQL şeması ve başlangıç verileri.

Frontend ile backend yalnızca tanımlı JSON API uç noktaları üzerinden haberleşir. PHP tarafı yapılandırma, bağlantı, depo, servis ve API denetleyicisi sorumluluklarına ayrılır. SQL sorgularında parametreli PDO ifadeleri kullanılır. Veritabanı tablo ve sütun adları ile kaynak kod yorumları Türkçe yazılır.

Geliştirme sırasında API kullanılamazsa frontend yerel Türkçe örnek veriyi kullanır. Bu mekanizma yalnızca geliştirme ve ilk görsel kurulum içindir; üretim ortamında API hatası kullanıcıya anlaşılır bir durum mesajı olarak gösterilir.

## Görsel tasarım sistemi

Tasarım dili, logodaki koyu mavi ve beyaz tonları temel alan endüstriyel hassasiyet yaklaşımıdır. Tipografi, küçük ekranlarda ve teknik içeriklerde okunabilirliği artırmak için tüm arayüzde Inter ailesini kullanır. Teknik çizgiler, kontrollü köşe geometrileri ve vana/boru mühendisliğini hatırlatan dairesel detaylar marka karakterini destekler.

Başlangıç tema değerleri:

- Ana mavi: `#28469D`
- Koyu mavi: `#17306F`
- Açık mavi: `#EAF1FF`
- Beyaz: `#FFFFFF`
- Metin rengi: `#172033`
- İkincil metin: `#62708A`

Renkler üretim koduna dağınık şekilde yazılmayacaktır. PHP API'den alınan tema kayıtları güvenli bir izin listesi üzerinden CSS özel değişkenlerine aktarılacaktır. Böylece arka plan, metin, vurgu, kenarlık, buton, yüzey ve gölge renkleri ileride yönetim panelinden değiştirilebilir.

## Sayfa yapısı

### Navbar

Navbar masaüstünde tam `120px` yüksekliğinde, yapışkan konumlu ve geniş yerleşimli olacaktır. Sol tarafta verilen Demirvana logosu, sağ tarafta Anasayfa, Hakkımızda, Ürünler, Üretim ve İletişim bağlantıları bulunur. Mobilde yükseklik ve boşluklar ekran ölçüsüne uygun biçimde küçülür; menü erişilebilir bir açılır panel içinde gösterilir.

### Hero carousel

Başlangıç slider görselleri `Carousel/` klasöründeki altı PNG dosyasıdır. Dosyalar yaklaşık `1994 × 789px` ve `2.53:1` oranındadır. Masaüstünde hero kapsayıcısı `aspect-ratio: 1994 / 789` kullanır. Görseller `object-fit: cover` ile yerleştirilir.

Mobil cihazlarda bu yatay oran metin ve kontrollere yetersiz yükseklik bırakacağından erişilebilir bir minimum yükseklik uygulanır. Her slayt için yatay ve dikey odak noktası veri kaydından yönetilebilir; böylece önemli görsel alanlar kırpma sırasında korunur.

Başlık, açıklama ve butonlar görsel dosyasına gömülmez; React ve CSS ile ayrı katmanlarda oluşturulur. Slayt kaydı görsel yolu, alternatif metin, başlık, açıklama, buton metni, buton bağlantısı, animasyon türü, odak noktası, sıralama ve aktiflik alanlarını içerir.

Carousel otomatik geçiş, önceki/sonraki okları, gösterge düğmeleri, dokunarak kaydırma, klavye kontrolü ve duraklatma davranışı sunar. Geçiş türleri yatay kayma, kontrollü yakınlaşma ve metin maskesi olabilir. `prefers-reduced-motion` etkin olduğunda hareketli geçişler sadeleştirilir.

### Ürün kategorileri

Bölüm başlığı tam olarak `ÜRÜN KATEGORİLERİMİZ` olacaktır. Ana sayfada tam sekiz kart gösterilir:

- İlk yedi kart aktif vana kategorilerini sıralama alanına göre listeler.
- Sekizinci kart `Tüm Ürünler` çağrısıdır ve `/urunler` sayfasına gider.

Her kategori kartında küçük ürün görseli, sol altta kategori adı ve sağda etkileşimli ok bulunur. Kartın tamamı tek bir erişilebilir bağlantıdır ve ilgili `/urunler/:slug` görünümüne gider. Grid masaüstünde 4×2, tablette 2×4 ve telefonda tek sütun düzenine dönüşür.

### Diğer görünümler

- `/`: Ana sayfa.
- `/urunler`: Tüm ürünleri/kategorileri listeleyen katalog.
- `/kategoriler/:slug`: Seçilen kategorinin açıklamasını ve ürünlerini gösteren kategori görünümü.
- `/urunler/:slug`: Slug değerine göre tek ürün detay görünümü.
- `/hakkimizda`: Kurumsal içerik iskeleti.
- `/uretim`: Üretim kabiliyetleri iskeleti.
- `/iletisim`: İletişim içeriği ve forma hazır iskelet.

## Veri modeli

Başlangıç şeması aşağıdaki tablolardan oluşur:

- `site_ayarlari`: site adı, logo, iletişim ve genel ayarlar.
- `tema_ayarlari`: CSS değişken anahtarı, değeri ve açıklaması.
- `menu_ogeleri`: başlık, bağlantı, sıralama ve aktiflik.
- `sliderlar`: carousel içeriği, görsel yolu, animasyon ve odak ayarları.
- `kategoriler`: kategori adı, slug, açıklama, görsel ve sıralama.
- `urunler`: kategori ilişkisi, ad, slug, kısa/uzun açıklama, teknik bilgiler ve aktiflik.
- `urun_gorselleri`: ürünle ilişkili çoklu görsel yolları ve alternatif metinler.

Görseller veritabanında ikili veri olarak tutulmaz. Veritabanında yalnızca göreli dosya yolu ve alternatif metin saklanır; gerçek dosyalar backend içindeki yönetilebilir `uploads/` alanında yer alır. Dosya adları çakışmayı önleyen güvenli benzersiz değerlerle oluşturulabilecek şekilde tasarlanır.

İleride çok dillilik eklendiğinde çevrilebilir alanlar ayrı çeviri tablolarına taşınabilir. İlk sürümde gereksiz karmaşıklık oluşturmamak için içerikler doğrudan Türkçe alanlarda tutulur; frontend metin sabitleri tek bir merkezi dosyada bulunur.

## API sözleşmesi

Okuma uç noktaları:

- `GET /api/tema`: İzin verilen tema anahtarlarını döndürür.
- `GET /api/menu`: Aktif menü öğelerini sıralı döndürür.
- `GET /api/sliderlar`: Aktif slider kayıtlarını sıralı döndürür.
- `GET /api/kategoriler`: Aktif kategorileri döndürür.
- `GET /api/kategoriler/{slug}`: Tek kategoriyi ve o kategoriye bağlı ürünleri döndürür.
- `GET /api/urunler`: Ürün listesini; kategori ve arama filtrelerini destekleyecek şekilde döndürür.
- `GET /api/urunler/{slug}`: Tek ürün detay verisini döndürür.

Yanıtlar ortak bir `basarili`, `veri` ve gerektiğinde `mesaj` yapısı kullanır. Bulunamayan kayıtlar `404`, geçersiz istekler `400`, beklenmeyen sunucu sorunları `500` durum kodu döndürür. Dahili hata ve veritabanı ayrıntıları istemciye açılmaz.

## Durumlar ve erişilebilirlik

Veri yüklenirken içerik ölçülerine yakın iskelet alanları gösterilir. Boş sonuçlarda kullanıcıyı kataloğa veya ana sayfaya yönlendiren açıklayıcı bir durum sunulur. API hatasında yeniden deneme eylemi bulunur.

Tüm etkileşimli öğeler klavye ile kullanılabilir, görünür odak durumuna sahiptir ve anlamlı erişilebilir adlar taşır. Görsellerde alternatif metin kullanılır. Renk karşıtlığı WCAG AA hedefini karşılayacak şekilde seçilir. Slider otomatik oynatması kullanıcı etkileşiminde duraklatılabilir ve hareket azaltma tercihini gözetir.

## Responsive davranış

Arayüz sabit cihaz isimlerine bağımlı olmayacak; içerik genişliğine göre akışkan ölçüler, `clamp()` değerleri ve gerekli kırılım noktaları kullanılacaktır. Temel kontroller şu aralıklarda doğrulanacaktır:

- Küçük telefon: 360px
- Telefon: 390–430px
- Tablet: 768–1024px
- Dizüstü: 1280–1440px
- Masaüstü ve geniş ekran: 1920px ve üzeri

Dokunmatik hedefler en az 44×44px olur. Yatay taşma oluşmaz. Ürün görselleri uygun `srcset` ve tembel yükleme kullanımına hazır tutulur.

## Test ve kabul ölçütleri

Frontend birim ve bileşen testleri aşağıdaki davranışları doğrular:

- API tema değerlerinin yalnızca izin verilen CSS değişkenlerine aktarılması.
- Ana sayfada yedi kategori ve bir `Tüm Ürünler` kartı olmak üzere tam sekiz kart bulunması.
- Kategori kartlarının doğru slug bağlantılarına gitmesi.
- Carousel ok, gösterge, klavye ve dokunma davranışları.
- API başarısız olduğunda geliştirme örnek verisinin veya hata durumunun doğru seçilmesi.

PHP testleri JSON yanıt biçimini, HTTP durum kodlarını, giriş filtrelerini ve depo katmanı davranışlarını doğrular. SQL şeması phpMyAdmin ile uyumlu MySQL sözdizimi açısından kontrol edilir.

Teslimden önce frontend testleri, üretim derlemesi, PHP sözdizimi denetimi ve uygun ortam mevcutsa API sağlık kontrolü çalıştırılır. Ana sayfa en az 360px, 768px, 1440px ve 1920px genişliklerde görsel olarak kontrol edilir.

## Kapsam dışı

Bu aşamada yönetim paneli ekranları, kullanıcı yetkilendirmesi, ödeme altyapısı, canlı teklif formu gönderimi ve tam çok dilli içerik yönetimi uygulanmayacaktır. Veri modeli ve modüler servis sınırları bu özelliklerin sonraki aşamalarda eklenmesine engel olmayacaktır.
