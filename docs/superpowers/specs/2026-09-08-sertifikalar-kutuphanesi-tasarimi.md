# Demirvana Sertifikalar Kütüphanesi

## Onaylanan görünüm

- Üst alan; yönetilebilir başlık, açıklama ve üç satırlı kalite sloganından oluşur.
- Masaüstünde sol sütunda aranabilir/filtrelenebilir sertifika kütüphanesi, sağ sütunda seçili PDF bulunur.
- Telefon ve tablette kütüphane PDF görüntüleyicisinin üstüne geçer; sayfa yatay taşmaz.
- İlk açılışta sıralaması en küçük etkin sertifika seçilir.
- Liste satırları PDF'nin ilk sayfasından üretilmiş hafif önizleme görselini kullanır; tam PDF yalnız seçildiğinde yüklenir.

## Veri ve yönetim modeli

- `sertifika_kategorileri`: dil, ad, slug, sıralama ve görünürlük.
- `sertifikalar`: kategori, dil, başlık, açıklama, güvenli dosya yolu, önizleme yolu, dosya bilgileri, açma/indirme izinleri, sıralama ve görünürlük.
- Hero, slogan, arama, filtre, boş durum ve PDF eylem metinleri `site_ayarlari` içindedir.
- `/api/sertifikalar` yalnız etkin ve fiziksel dosyası bulunan kayıtları döndürür.
- `/sertifika-dosyalari/{slug}` yalnız veritabanında kayıtlı PDF'yi sertifikalar kökü içinden sunar; dizin geçişine izin vermez ve byte-range destekler.

## Başlangıç içeriği

- ISO 9001 ENG
- ISO 9001 TR
- Marka Tescil Belgesi
- Sanayi Sicil Belgesi

Kaynak PDF'ler kullanıcının `sertifikalar/` dizininden değiştirilmeden kullanılır. Liste önizlemeleri `frontend/public/assets/sertifikalar/` altında tutulur ve gelecekte admin yükleme akışında yeniden üretilebilir.
