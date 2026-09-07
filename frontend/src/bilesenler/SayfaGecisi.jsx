import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SayfaGecisi({ children }) {
  const konum = useLocation();

  useLayoutEffect(() => {
    // Yeni rota çizilmeden hemen önce konumu sıfırlamak, önceki sayfanın alt kısmının kısa süre görünmesini önler.
    // `auto`, kökteki smooth davranışını miras aldığı için yeni sayfayı bir süre eski konumda bırakır; rota geçişinde anlık konum gerekir.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [konum.pathname]);

  // Yol anahtar olarak kullanıldığında yalnızca değişen sayfa içeriği yeniden girer; sabit navbar etkilenmez.
  return (
    <div
      key={konum.pathname}
      className="sayfa-gecisi"
      data-testid="sayfa-gecisi"
      data-yol={konum.pathname}
    >
      {children}
    </div>
  );
}
