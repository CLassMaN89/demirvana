// Animate UI'nin (animate-ui.com) TypeScript ikon çatısının basitleştirilmiş JS karşılığı.
// Orijinali imperative "useAnimation()" kontrolcüsü kullanır; burada aynı sonucu daha sade ve
// güvenilir biçimde React state'i ile elde ediyoruz (fare üzerideyken "animate", değilse "initial").
//
// Kullanım:
//   Tek başına ikon:            <Clock4Ikon animateOnHover />
//   Başlık + ikonu birlikte:    <AnimateIcon animateOnHover><Clock4Ikon /> Son Aktiviteler</AnimateIcon>
// İkinci kullanımda fare, ikonun kendisi kadar küçük bir alana değil, sarmalayıcının tamamına
// (örn. tüm başlık metnine) gelince animasyon tetiklenir.
import { createContext, useContext, useState } from 'react';

const AnimateIconContext = createContext(null);

export function useAnimateIconContext() {
  return useContext(AnimateIconContext) ?? { durum: 'initial', animation: 'default' };
}

export function getVariants(animasyonlar) {
  const { animation } = useAnimateIconContext();
  return animasyonlar[animation] ?? animasyonlar.default;
}

function hoverOlaylariniOlustur(setDurum, animateOnHover, animateOnTap) {
  const olaylar = {};
  if (animateOnHover) {
    olaylar.onMouseEnter = () => setDurum('animate');
    olaylar.onMouseLeave = () => setDurum('initial');
  }
  if (animateOnTap) {
    olaylar.onPointerDown = () => setDurum('animate');
    olaylar.onPointerUp = () => setDurum('initial');
  }
  return olaylar;
}

// Dıştaki sarmalayıcı: ikon + yanındaki metni birlikte kapsar, fare bu sarmalayıcının
// herhangi bir noktasına gelince animasyonu tetikler.
export function AnimateIcon({ animateOnHover, animateOnTap, className, style, children }) {
  const [durum, setDurum] = useState('initial');
  const olaylar = hoverOlaylariniOlustur(setDurum, animateOnHover, animateOnTap);

  return (
    <AnimateIconContext.Provider value={{ durum, animation: 'default' }}>
      <span className={className} style={{ display: 'inline-flex', alignItems: 'center', ...style }} {...olaylar}>
        {children}
      </span>
    </AnimateIconContext.Provider>
  );
}

// icon: alt ikon bileşeni (ör. Clock4IkonGovdesi). Bir AnimateIcon/başka IconWrapper içindeyse
// oradaki durumu paylaşır; tek başına kullanılırsa (animateOnHover kendi üzerinde verilirse)
// kendi hover alanını oluşturur.
export function IconWrapper({ icon: Ikon, size = 24, animateOnHover, animateOnTap, style, ...props }) {
  const dısBaglam = useContext(AnimateIconContext);
  const [kendiDurum, setKendiDurum] = useState('initial');

  if (dısBaglam) {
    return <Ikon size={size} {...props} />;
  }

  const olaylar = hoverOlaylariniOlustur(setKendiDurum, animateOnHover, animateOnTap);

  return (
    <AnimateIconContext.Provider value={{ durum: kendiDurum, animation: 'default' }}>
      <span style={{ display: 'inline-flex', ...style }} {...olaylar}>
        <Ikon size={size} {...props} />
      </span>
    </AnimateIconContext.Provider>
  );
}
