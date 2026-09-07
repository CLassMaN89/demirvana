# Site Arama ve Sayfa Geçişi Tasarımı

## Kapsam

- Ana menüde İletişim bağlantısının sağına erişilebilir arama düğmesi eklenir.
- Düğme, navbarın altında yumuşak geçişle arama panelini açar ve odağı arama alanına taşır.
- Arama; menü sayfaları, ürün kategorileri, ürünler ve referansların gerçek API verisinde çalışır.
- Sonuçlar ilgili sayfa rotasına gider; en az iki karakter yoksa kullanıcıya yönlendirme gösterilir.
- Route değişimlerinde ana içerik kısa bir opaklık/dikey hareket animasyonuyla girer; `prefers-reduced-motion` altında animasyon kapatılır.
- Navbar yüksekliği, hero ve sayfa içerikleri değiştirilmez.

## Responsive ve erişilebilirlik

- Arama düğmesi en az 44×44px'tir; `aria-expanded`, `aria-controls` ve açıklayıcı etiket taşır.
- Escape paneli kapatır, panel kapanınca odak arama düğmesine döner.
- Mobilde panel ekran genişliğine oturur ve sonuçlar navbar altında kaydırılabilir.
- Klavye odağı görünür kalır ve sonuçlar gerçek bağlantılardır.

