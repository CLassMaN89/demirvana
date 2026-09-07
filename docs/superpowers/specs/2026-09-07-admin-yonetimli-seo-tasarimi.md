# Demirvana Admin Yönetimli SEO Tasarımı

## Amaç

Demirvana'nın tüm sabit ve dinamik sayfalarında benzersiz, doğrulanabilir ve admin panelinden yönetilebilir teknik SEO verisi üretmek; Googlebot ile diğer arama motorlarına HTML meta etiketleri, robots.txt, sitemap.xml ve uygun JSON-LD verilerini sunmak.

## Temel kararlar

- Google sıralaması garanti edilmez; teknik erişilebilirlik ve arama motorunun içeriği doğru anlaması optimize edilir.
- Global varsayılanlar `site_ayarlari`, sayfa bazlı kayıtlar `seo_sayfalari` tablosunda tutulur.
- React rota değişiminde title, description, canonical, robots, Open Graph, Twitter ve JSON-LD etiketlerini günceller.
- PHP aynı SEO sözleşmesini API, `robots.txt` ve `sitemap.xml` için kullanır.
- Ürün fiyatı, stok, puan veya yorum gibi veritabanında bulunmayan bilgiler yapılandırılmış veriye eklenmez.
- Türkçe ilk dildir; veri sözleşmesi gelecekte `dil_kodu` üzerinden diğer dillere genişler.

## Admin tarafından yönetilecek alanlar

- Site ana adresi, varsayılan başlık/açıklama/görsel, başlık şablonu, varsayılan robots değeri ve Google doğrulama kodu.
- Her rota için SEO başlığı, meta açıklama, anahtar kelimeler, canonical yolu, sosyal başlık/açıklama/görsel, robots değeri ve yapılandırılmış veri türü.
- Kayıtların dili, aktifliği ve sitemap'e dahil edilme durumu.
- Sitemap değişim sıklığı ve öncelik değeri.

## Veri doğrulama kuralları

- Başlık önerilen 30–60 karakter, açıklama 70–160 karakter aralığında admin arayüzünde uyarı üretmeye hazırdır.
- Canonical değerleri yalnız site ana adresi veya `/` ile başlayan güvenli yol olarak kabul edilir.
- Robots yalnız izinli değerlerden oluşur: `index`, `noindex`, `follow`, `nofollow`, `max-image-preview:large`.
- Sosyal görsel yolu veri katmanından gelir; kaynak koda gömülmez.
- JSON-LD yalnız kullanıcıya görünür gerçek içerikten üretilir.

## Google çıktıları

- Benzersiz `<title>` ve `<meta name="description">`.
- Tek canonical etiketi.
- Open Graph ve Twitter Card etiketleri.
- Ana sayfada `Organization` ve `WebSite`; iç sayfalarda `BreadcrumbList`; ürün detayında mevcut alanlarla sınırlı `Product` JSON-LD.
- Veritabanındaki aktif menü, kategori, ürün ve SEO rotalarından otomatik `/sitemap.xml`.
- Sitemap adresini bildiren ve admin tarafından yönetilen `/robots.txt`.
- Bulunamayan rotalarda `noindex, nofollow` ve gerçek 404 içeriği.

## Responsive ve erişilebilirlik

SEO değişiklikleri görsel düzeni bozmaz. 404 sayfası telefon, tablet ve masaüstünde mevcut tema değişkenleriyle uyumludur. Sayfa başlık hiyerarşisi ve bağlantı metinleri semantik HTML olarak korunur.

