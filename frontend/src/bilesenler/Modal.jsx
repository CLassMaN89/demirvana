import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import '../stiller/modal.css';

// document.body'ye portallanır: `.sayfa-gecisi` sarmalayıcısındaki (identity) transform kendi containing-block'unu
// oluşturduğundan, portallanmayan bir `position: fixed` modal sayfa kaydırılmışken ekran dışına düşer.
export default function Modal({ baslik, children, onKapat, genislik }) {
  const kapatmaDugmesiRef = useRef(null);
  const oncekiOdakRef = useRef(null);

  useEffect(() => {
    oncekiOdakRef.current = document.activeElement;
    const oncekiTasima = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    kapatmaDugmesiRef.current?.focus();

    const klavyeDinle = (olay) => {
      if (olay.key === 'Escape') onKapat();
    };
    document.addEventListener('keydown', klavyeDinle);

    return () => {
      document.body.style.overflow = oncekiTasima;
      document.removeEventListener('keydown', klavyeDinle);
      oncekiOdakRef.current?.focus?.();
    };
  }, [onKapat]);

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-label={baslik}>
      <button type="button" className="modal__zemin" onClick={onKapat} aria-label="Kapat" />
      <div className="modal__icerik" style={genislik ? { maxWidth: genislik } : undefined}>
        <div className="modal__baslik">
          <h2>{baslik}</h2>
          <button ref={kapatmaDugmesiRef} type="button" className="modal__kapat" onClick={onKapat} aria-label="Kapat">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="modal__govde">{children}</div>
      </div>
    </div>,
    document.body
  );
}
