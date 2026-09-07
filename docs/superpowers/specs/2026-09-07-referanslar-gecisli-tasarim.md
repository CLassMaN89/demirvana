# Demirvana Geçişli Referanslar Sayfası Tasarımı

## Amaç

`C:/Users/Sinan/Documents/Projeler/vana2/assets/Carousel/index.html` içindeki Referanslar görünümünün görsel dili ve etkileşimleri, mevcut React/PHP/MySQL mimarisine uyarlanır. Yerel HTML yalnız tasarım referansıdır; navbar, footer ve diğer sayfalar değiştirilmez.

## Sayfa düzeni

- Koyu mavi, çizgisel dokulu hero içinde ekmek kırıntısı, ana başlık, açıklama ve gerçek kayıtlardan hesaplanan proje/konum/sektör/yıl istatistikleri bulunur.
- Açık zemindeki proje alanında sektör filtreleri, metin araması ve gösterilen sonuç sayısı birlikte çalışır.
- Yurtiçi kayıtlar iki sütunlu kartlarda ilk sekiz kayıtla başlar; `Daha Fazla Göster` her kullanımda dört kayıt ekler.
- Kartlar 65ms kademeli giriş hareketi kullanır. Kart seçildiğinde yalnız o kartın gerçek kurum, konum, sektör ve yıl verisi yumuşak akordeon geçişiyle açılır.
- Yurtdışı kayıtları ayrı koyu bölümde gösterilir. Mevcut saha galerisi ve erişilebilir büyütme modalı korunur.

## Yönetilebilirlik

Hero, istatistik etiketleri, liste, arama, daha fazla düğmesi, yurtdışı alanı ve galeri metinleri `site_ayarlari` üzerinden gelir. Proje, sektör ve görsel içerikleri mevcut Türkçe tablolardan alınır. Görsel içerik kaynak koda gömülmez ve tüm renkler merkezi tema değişkenlerinden türetilir.

## Responsive ve erişilebilirlik

Masaüstünde iki sütun, tablet ve telefonda tek sütun kullanılır. Filtreler telefonda yatay kaydırılır; hero istatistikleri iki sütuna iner. Kart düğmeleri `aria-expanded` ve `aria-controls` kullanır, Escape açık kartı veya galeriyi kapatır. `prefers-reduced-motion` açıkken giriş ve akordeon animasyonları kaldırılır.
