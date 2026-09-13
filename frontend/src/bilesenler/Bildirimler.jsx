import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import '../stiller/bildirimler.css';

const IKONLAR = { basari: CheckCircle2, hata: XCircle, silme: XCircle, uyari: AlertTriangle, bilgi: Info };

// Genel amaçlı, koyu temalı toast bildirim yığını. Sağ üstte üst üste birikir, her biri kendi
// süresinde otomatik kapanır veya X ile elle kapatılabilir. Kullanan sayfa state'i (dizi + kapatma
// callback'i) kendi tutar; bu bileşen yalnızca görselleştirir.
export default function Bildirimler({ bildirimler, onKapat }) {
  return (
    <div className="bildirim-yigini" aria-live="polite">
      <AnimatePresence>
        {bildirimler.map((bildirim) => {
          const Ikon = IKONLAR[bildirim.tur] ?? Info;
          return (
            <motion.div
              key={bildirim.id}
              layout
              initial={{ opacity: 0, x: 40, scale: .95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: .95, transition: { duration: .18 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className={`bildirim bildirim--${bildirim.tur}`}
            >
              <span className="bildirim__ikon"><Ikon aria-hidden="true" size={18} /></span>
              <div className="bildirim__metin">
                <strong>{bildirim.baslik}</strong>
                {bildirim.mesaj && <p>{bildirim.mesaj}</p>}
              </div>
              <button type="button" className="bildirim__kapat" onClick={() => onKapat(bildirim.id)} aria-label="Bildirimi kapat">
                <X aria-hidden="true" size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
