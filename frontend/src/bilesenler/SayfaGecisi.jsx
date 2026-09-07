import { useLocation } from 'react-router-dom';

export default function SayfaGecisi({ children }) {
  const konum = useLocation();

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
