import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import '../stiller/modal.css';

// document.body'ye portallanır: `.sayfa-gecisi` sarmalayıcısındaki (identity) transform kendi containing-block'unu
// oluşturduğundan, portallanmayan bir `position: fixed` modal sayfa kaydırılmışken ekran dışına düşer.
//
// Giriş/çıkış animasyonu: 3B eksende hafif bir perspektif döndürmesiyle birlikte bulanıklıktan
// netliğe geçer (kullanıcının verdiği Base UI + Motion "AlertDialog" referansındaki efektin
// projenin kendi Modal.jsx + motion/react + düz CSS altyapısına uyarlanmış hali). Kapatma
// tetiklendiğinde (zemin/ESC/kapat düğmesi) modal hemen kaldırılmaz — önce `kapaniyorMu` true
// olur, AnimatePresence TEK bir doğrudan motion çocuğun (`.modal__icerik`) çıkış animasyonunu
// bekleyip bitince (`onExitComplete`) gerçek `onKapat`'ı çağırır. Zemin (backdrop) ayrı bir öğe
// olduğu için düz CSS transition ile, `kapaniyorMu` sınıfına göre senkron fade yapar.
//
// NOT (framer-motion/requestAnimationFrame): Bu animasyon rAF'a dayanır; sekme/pencere arka
// planda veya gizliyken tarayıcılar rAF'ı durdurur, bu yüzden görünmeyen bir sekmede test
// ederken "initial" state'de donmuş gibi görünebilir — bu bir kod hatası değildir, yalnızca
// gerçekten görünür/aktif bir sekmede canlı doğrulanabilir.
export default function Modal({ baslik, aciklama, children, onKapat, genislik, boyut = 'varsayilan' }) {
  const kapatmaDugmesiRef = useRef(null);
  const oncekiOdakRef = useRef(null);
  const [kapaniyorMu, setKapaniyorMu] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // `AnimatePresence`'ın `onExitComplete` callback'i bu kurulumda (createPortal + tek motion
  // çocuk) güvenilir şekilde tetiklenmiyor; bunun yerine çıkış animasyonuyla (aşağıdaki
  // `transition`) AYNI süreye ayarlanmış bir zamanlayıcı ile `onKapat` doğrudan çağrılıyor —
  // görsel animasyon oynarken, üst bileşenin state'i animasyon bittiğinde temizleniyor.
  const CIKIS_SURESI_MS = 350;

  function kapatmayiBaslat() {
    setKapaniyorMu(true);
    setTimeout(onKapat, prefersReducedMotion ? 0 : CIKIS_SURESI_MS);
  }

  useEffect(() => {
    oncekiOdakRef.current = document.activeElement;
    const oncekiTasima = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    kapatmaDugmesiRef.current?.focus();

    const klavyeDinle = (olay) => {
      if (olay.key === 'Escape') kapatmayiBaslat();
    };
    document.addEventListener('keydown', klavyeDinle);

    return () => {
      document.body.style.overflow = oncekiTasima;
      document.removeEventListener('keydown', klavyeDinle);
      oncekiOdakRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div className={`modal${kapaniyorMu ? ' modal--kapaniyor' : ''}`} role="dialog" aria-modal="true" aria-label={baslik}>
      <button type="button" className="modal__zemin" onClick={kapatmayiBaslat} aria-label="Kapat" />
      <AnimatePresence>
        {!kapaniyorMu && (
          <motion.div
            className={`modal__icerik${boyut === 'kucuk' ? ' modal__icerik--kucuk' : ''}`}
            style={genislik ? { maxWidth: genislik, transformPerspective: 500 } : { transformPerspective: 500 }}
            initial={prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, filter: 'blur(10px)', rotateX: 5, rotateY: 25, z: -100 }}
            animate={prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, filter: 'blur(0px)', rotateX: 0, rotateY: 0, z: 0 }}
            exit={prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, filter: 'blur(10px)', rotateX: 5, rotateY: 25, z: -100 }}
            transition={prefersReducedMotion
              ? { duration: 0 }
              : { duration: .35, ease: [.17, .67, .51, 1] }}
          >
            <div className="modal__baslik">
              <div className="modal__baslik-metin">
                <h2>{baslik}</h2>
                {aciklama && <p className="modal__aciklama">{aciklama}</p>}
              </div>
              <button ref={kapatmaDugmesiRef} type="button" className="modal__kapat" onClick={kapatmayiBaslat} aria-label="Kapat">
                <X aria-hidden="true" />
              </button>
            </div>
            {/* İçerik bir fonksiyon olarak verilirse (render-prop) kapatma animasyonunu
                tetikleyen fonksiyon kendisine geçirilir; bu sayede içerideki "Vazgeç" gibi
                düğmeler de parent state'ini DOĞRUDAN temizlemek yerine (ki bu, çıkış
                animasyonunu atlayıp modal'ı aniden kaybettirirdi) aynı animasyonlu kapanma
                akışından geçer. */}
            <div className="modal__govde">{typeof children === 'function' ? children(kapatmayiBaslat) : children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
