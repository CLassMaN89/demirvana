import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SayfaGecisi({ children }) {
  const konum = useLocation();
  // İlk yol parçası anahtar olarak kullanılır: örn. /urunler/vana ile /urunler/aktuator aynı bölüme aittir,
  // aralarında geçişte kenar menüsünün açık/kapalı durumu ve kaydırma konumu sıfırlanmaz.
  const bolumAnahtari = konum.pathname.split('/')[1] || 'anasayfa';

  useLayoutEffect(() => {
    // Yeni rota çizilmeden hemen önce konumu sıfırlamak, önceki sayfanın alt kısmının kısa süre görünmesini önler.
    // `auto`, kökteki smooth davranışını miras aldığı için yeni sayfayı bir süre eski konumda bırakır; rota geçişinde anlık konum gerekir.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [konum.pathname]);

  // Bölüm anahtarı yalnızca farklı bir bölüme geçildiğinde yeniden girer; aynı bölüm içindeki alt sayfalar
  // (ör. ürün kategorileri) sabit navbar gibi yeniden kurulmadan güncellenir.
  return (
    <div
      key={bolumAnahtari}
      className="sayfa-gecisi"
      data-testid="sayfa-gecisi"
      data-yol={konum.pathname}
    >
      {children}
    </div>
  );
}
