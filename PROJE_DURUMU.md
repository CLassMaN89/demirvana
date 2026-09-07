# Demirvana Proje Durumu

Son güncelleme: 7 Eylül 2026

## Projenin amacı

Demirvana için React, CSS ve JavaScript tabanlı responsive arayüz; PHP REST API; phpMyAdmin uyumlu MySQL veritabanı ve gelecekteki yönetim paneline hazır modüler içerik altyapısı oluşturmak.

## Onaylanan kararlar

- İlk sürüm Türkçe olacak; yapı ileride çok dilliliğe genişleyebilecek.
- Çalışma tek ajan tarafından yürütülecek; alt ajan kullanılmayacak.
- Arayüz React, CSS ve JavaScript ile hazırlanacak.
- Okunabilirlik için tüm arayüzde yerel Inter yazı ailesi kullanılacak; gövde 400, menü 500–600, başlıklar 600–700 ağırlığında tutulacak.
- Ürün, kategori ve carousel metin/görselleri kaynak koda gömülmeyecek; PHP/MySQL veri katmanından yönetilebilecek.
- Tema renkleri veritabanından gelen CSS özel değişkenleriyle yönetilebilecek.
- Son kullanıcı kararına göre navbar masaüstü ve mobilde tam 60px olacak.
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
- Vite, React Router, Vitest ve Testing Library tabanlı frontend temeli kuruldu.
- API tema anahtarlarını güvenli CSS değişkenlerine aktaran dinamik tema katmanı eklendi.
- Geliştirme ortamında örnek veriye dönebilen merkezi API istemcisi eklendi.
- Tüm ekranlarda 60px yüksekliğinde, mobilde açılır menülü responsive navbar oluşturuldu.
- Altı mevcut görseli kullanan erişilebilir ve dokunmatik hero carousel oluşturuldu.
- Yedi kategori ve bir `Tüm Ürünler` kartından oluşan responsive grid eklendi.
- Ana sayfa, katalog, kategori, ürün ve kurumsal sayfa rotaları eklendi.
- Kritik üretim kodlarına neyin neden kullanıldığını açıklayan Türkçe yorumlar eklendi; kural `AGENTS.md` içinde kalıcılaştırıldı.
- PHP 8.4.24 kuruldu ve `pdo_mysql` uzantısı etkinleştirildi.
- Parametreli PDO sorguları kullanan salt okunur PHP REST API oluşturuldu.
- Sekiz Türkçe tabloyu, ilişkileri ve tekrarlanabilir başlangıç verilerini içeren MySQL/MariaDB şeması oluşturuldu.
- MariaDB 12.3.3 kuruldu; şema iki kez canlı içe aktarılıp başlangıç kayıtlarının çoğalmadığı doğrulandı.
- React veri yükleme, hata, yeniden deneme ve dinamik tema akışı gerçek API sözleşmesine bağlandı.
- Inter fontu harici servise bağımlı kalmaması için frontend paketine yalnız gereken Latin Extended 400–700 ağırlıklarıyla yerel eklendi.
- README kurulum ve çalışma belgesi oluşturuldu.
- Playwright ile 360px, 375px, 768px, 844×390px yatay telefon, 1440px ve 1920px responsive tarayıcı doğrulaması yapıldı.
- Yatay telefonda carousel oklarının metne yaklaşması giderildi; kontroller sağ üst güvenli alana taşındı.
- Header, hero ve kategori vitrini gönderilen kompakt kurumsal referansa göre yeniden tasarlandı.
- Masaüstü menüsü sayfanın tam merkezine alındı; logo sol, teklif bağlantısı sağ kolonda bağımsız tutuldu.
- Hero metni sağa taşındı ve altı slider görseli küçük görsel navigasyonuna dönüştürüldü.
- Sekiz kategori, masaüstünde tek sıra kompakt panel; mobil ve tablette yatay kaydırılabilir panel olarak düzenlendi.
- Kategori paneli hero üzerine bindirilmeden sliderın altındaki normal içerik akışına taşındı.
- Kategori kartlarındaki vana adlarının yazı ağırlığı 800'den 400'e indirildi.
- Hero görseline fare hareketiyle açılan dinamik canvas maskesi eklendi; hero başlangıçta kendi renkleriyle görünür.
- Fare izinde basit gri/karakalem filtre yerine Sobel kenar algılama ile üretilen açık zeminli teknik çizim görünür.
- Efekt dokunmatik cihazlarda ve azaltılmış hareket tercihinde kapatılarak hero görseli doğrudan gösterilir.
- Üst menü `Anasayfa, Kurumsal, Ürünler, Teknik, Referanslar, Sertifikalar, İletişim` sırasıyla güncellendi.
- Ürünler menüsüne hareketli ortak vurgu ve responsive mega menü eklendi; Vana, Aktüatör, Otomasyon ve Temsilcilikler veritabanından gelir.
- Vana grubunun altında kullanıcı görselindeki 12 kategori üçüncü seviye olarak tanımlandı; masaüstünde iki kolon, mobilde iç içe liste kullanılır.
- Aktüatör grubuna Elektrik Aktüatörler, Pnömatik Aktüatör, Aktüatörlü Vanalar ve Aksesuarlar üçüncü seviye olarak eklendi.
- Alt menülerin gelecekte yönetim panelinden düzenlenebilmesi için `menu_alt_ogeleri` tablosu ve özyinelemeli PHP menü ağacı eklendi.
- Referanslar rotası, tek paragraf içerik yerine bağımsız ve responsive `ReferanslarSayfasi` bileşenine taşındı.
- Referans sayfasına veriden hesaplanan toplam/yurtiçi/yurtdışı özeti, erişilebilir bölge filtreleri ve iki sütunlu proje dizini eklendi.
- Kullanıcının sağladığı üç saha fotoğrafı yönetilebilir görsel yolu ve kadraj değerleriyle galeriye bağlandı; büyütülmüş görünüm ve Escape ile kapatma desteklendi.
- `referanslar` ve `referans_gorselleri` tabloları ile `/api/referanslar` ucu eklendi; 18 yurtiçi ve 4 yurtdışı kayıt canlı veritabanına aktarıldı.
- Üst menü yazı boyutu kullanıcı isteğiyle 12px yapıldı ve masaüstü logo genişliği 118px'e çıkarıldı.
- Referanslar sayfası için onaylanan tasarım ve uygulama belgeleri oluşturuldu.
- Referanslar sayfası açık mavi-gri zemin, sektör filtreleri, birleşik metin araması ve iki sütunlu numaralı proje kartlarıyla onaylanan görsele uyarlandı.
- Altı sektör `referans_sektorleri` ve `referans_sektor_eslesmeleri` tablolarıyla dinamik veri katmanına taşındı; `/api/referanslar` kayıt başına sektör bilgisini döndürüyor.
- İletişim menüsünün sağına animasyonlu site araması eklendi; menü sayfaları, ürün kategorileri, ürünler ve referanslar aynı panelden aranabiliyor.
- Arama sonuçları ilgili sayfaya veya referansın doğrudan bağlantısına gider; panel odağı, Escape ile kapatma ve mobil menü davranışı erişilebilir biçimde uygulandı.
- Sayfa geçişleri navbarı sabit tutan 420ms içerik giriş animasyonuyla yumuşatıldı; azaltılmış hareket tercihinde animasyon kapatıldı.
- Yeni tasarım ve uygulama belgeleri `2026-09-07-referanslar-sektor-filtreli-*` ile `2026-09-07-site-arama-ve-sayfa-gecisi-*` dosyalarında kaydedildi.
- Navbar arama alanı Origin UI referansındaki kompakt görünüme uyarlandı; sol arama/yükleme simgesi ve sağ sesli arama düğmesi eklendi.
- Arama yazılırken 500ms işlem göstergesi çalışır; Web Speech API destekleyen tarayıcılarda Türkçe ses tanıma sonucu gerçek sorguya aktarılır, desteklemeyenlerde mikrofon gizlenir.
- İkonlar erişilebilir etiketlerle `lucide-react` paketinden alınır; mevcut kategori, ürün, sayfa ve referans sonuç akışı korunur.
- Site araması tam genişlikte ayrı panel yerine navbar içindeki büyüteçten sağa doğru açılan 420px kompakt alana dönüştürüldü.
- Arama sonuçları yalnızca sorgu iki karaktere ulaştığında girişin altında tek sütunlu Google benzeri öneri kutusunda görünür; arama açıkken Teklif Al alanı geçici olarak gizlenir.
- Navbar araması 288px güvenli genişliğe ayarlandı; `Teklif Al` arama açıkken de görünür ve tıklanabilir durumda tutuldu.
- Arama açılışına yay eğrili ölçek, kısa blur ve odak parlaması eklendi; sonuçlar ayrı fade/kayma hareketi kullanır.
- Fare arama veya sonuç kapsayıcısından ayrıldığında 250ms sonra, başka yere tıklamada ya da Escape kullanımında hemen kapanır ve sorgu temizlenir.

## Mevcut durum

Ana site iskeleti, sektörlü Referanslar sayfası, gerçek site araması ve yumuşak rota geçişi tamamlandı. React frontend, PHP API ve MySQL/MariaDB veri akışı canlı olarak birlikte doğrulandı. Yönetim paneli sonraki aşamanın kapsamıdır.

## Değiştirilen dosyalar

- `AGENTS.md`
- `PROJE_DURUMU.md`
- `docs/superpowers/specs/2026-09-06-demirvana-site-tasarimi.md`
- `docs/superpowers/plans/2026-09-06-demirvana-site-uygulama-plani.md`
- `docs/superpowers/specs/2026-09-07-referanslar-sayfasi-tasarimi.md`
- `docs/superpowers/plans/2026-09-07-referanslar-sayfasi-uygulama-plani.md`
- `docs/superpowers/specs/2026-09-07-referanslar-sektor-filtreli-tasarim.md`
- `docs/superpowers/plans/2026-09-07-referanslar-sektor-filtreli-uygulama-plani.md`
- `docs/superpowers/specs/2026-09-07-site-arama-ve-sayfa-gecisi.md`
- `docs/superpowers/plans/2026-09-07-site-arama-ve-sayfa-gecisi-plani.md`
- `frontend/` altındaki React, test, stil ve statik varlık dosyaları
- `backend/` altındaki PHP API dosyaları
- `veritabani/demirvana.sql`
- `veritabani/sema_dogrulama.ps1`
- `README.md`

## Doğrulamalar

- `Carousel/` içindeki altı görselin boyutları kontrol edildi.
- Tasarım belgesi eksik ifade, çelişki ve belirsiz rota açısından gözden geçirildi.
- Ürün ve kategori detay rotaları ayrı tanımlandı.
- Frontend testleri: 30 test, 0 hata.
- Vite üretim derlemesi: başarılı.
- Node.js `v24.16.0`, npm `11.13.0` ve Git `2.55.0` kullanılabilir.
- PHP API testi: başarılı; yedi PHP dosyasında sözdizimi hatası yok.
- MySQL şeması yapısal testi: başarılı.
- Canlı veritabanı sayımları: 6 tema, 7 üst menü, 20 alt menü, 6 slider ve 7 kategori.
- Canlı API sonuçları: tema, üç seviyeli menü, slider, kategori, kategori detayı ve boş ürün listesi başarılı JSON döndürdü.
- Gerçek Vite → PHP → MariaDB zinciriyle responsive tarayıcı testi: telefon, yatay telefon, tablet ve masaüstü başarılı; konsol hatası ve yatay taşma yok.
- Görsel tasarım denetimi: 0 engelleyici, 0 açık kalite sorunu; ürün fotoğrafları yönetim panelinden ekleneceği için şimdilik bilinçli placeholder kullanılıyor.
- Referanslar canlı API sayımları: toplam 22 kayıt; 18 yurtiçi, 4 yurtdışı ve 3 galeri görseli.
- Referanslar tarayıcı doğrulaması: 375, 768, 1024 ve 1440px hedeflerinde yatay taşma yok; filtre ve galeri modalı çalışıyor; tarayıcı konsolunda hata/uyarı yok.
- Sektörlü referans API doğrulaması: 6 sektör ve 22 kayıt canlı MariaDB verisinden başarıyla döndü.
- Site araması canlı tarayıcı doğrulaması: arama paneli odaklandı, `gazipaşa` sorgusu doğru referansı buldu ve `#referans-1` bağlantısına yönlendirdi.
- Masaüstü canlı görünümde yatay taşma bulunmadı; `sayfa-giris` animasyonu ve İletişim sonrası arama düğmesi hesaplanan DOM/CSS değerleriyle doğrulandı.
- Yeni arama alanı canlı tarayıcıda doğrulandı: yükleme göstergesi, Kelebek Vanalar sonucu ve desteklenen Chrome ortamında mikrofon düğmesi görünür; yatay taşma yok.
- Navbar içi arama canlı görünümde doğrulandı: ayrı sayfa paneli oluşmuyor, alan sağa genişliyor ve sonuç tek satırlık öneri kutusunda yalnızca girişin altında açılıyor.
- Teklif düğmesinin arama yanında görünür kaldığı ve hero kontrolüne tıklanınca aramanın kapandığı canlı tarayıcıda doğrulandı.

## Bilinen durumlar

- Yönetim paneli bu ilk teslimin kapsamında değildir; veri yapısı yönetim paneline hazır olacaktır.
- Yerel Git deposu oluşturuldu ve tamamlanan frontend görevleri ayrı commitlerle kaydedildi.
- PHP 8.4 ve MariaDB 12.3 yerel geliştirme için kuruldu. Bu oturumda PHP çalıştırıcısına WinGet kurulum yolu üzerinden erişildi.
- Yerel MariaDB root hesabı parola olmadan yalnızca geliştirme doğrulaması için kullanıldı; üretim ortamında güçlü parola ve ayrı uygulama kullanıcısı tanımlanmalıdır.
- Kullanıcının sağladığı kök `Carousel/` klasörü değiştirilmeden korunur; frontend kendi `public/assets/carousel/` kopyalarını kullanır.
- Referans galerisindeki başlangıç fotoğrafları kullanıcının ekran görüntüsünden kadrajlanır; yönetim panelinde özgün yüksek çözünürlüklü dosyalarla değiştirilebilir.

## Sıradaki adım

Kullanıcının belirteceği alanda sınırlı düzenleme yap. Sonraki olası adım, seçilecek yeni sayfanın tasarlanması veya özgün yüksek çözünürlüklü referans fotoğraflarının eklenmesidir.
