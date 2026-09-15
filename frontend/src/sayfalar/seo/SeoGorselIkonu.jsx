/** Kaynaktan ayrı şeffaf dosyaya çıkarılan ikonları oranını bozmadan gösterir. */
export default function SeoGorselIkonu({ tur, boyut = 28, className = '' }) {
  return (
    <span className={`seo-sprite-ikon ${className}`} style={{ '--ikon-boyutu': `${boyut}px` }} aria-hidden="true">
      <img src={`/assets/seo-ikonlari/${tur}.png`} alt="" />
    </span>
  );
}
