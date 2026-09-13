# Sol Menü / Filtre Menüsü Standardı

Bu doküman, "sol menü" istendiğinde uygulanacak standart etkileşim davranışını tanımlar.
Kaynak: `frontend/src/sayfalar/UrunlerSayfasi.jsx`'teki `YanMenuGrubu` bileşeni (halka açık
`/urunler` sayfasının sol kategori filtre menüsü), CSS: `frontend/src/stiller/urun-katalog.css`.

## Ne zaman kullanılır

Herhangi bir dikey link/öğe listesi ("sol menü", "yan menü", filtre menüsü) istendiğinde bu
davranış **doğrudan** uygulanır — tekrar tarif edilmesi beklenmez. Farklı bir alanda
kullanılıyorsa (ör. admin paneli) yalnızca **renk paleti** o alanın kendi temasına uyarlanır;
düzen ve etkileşim davranışı **değiştirilmez**.

Uygulandığı yerler: `frontend/src/bilesenler/YonetimDuzeni.jsx` (admin sol navigasyon menüsü,
`--yonetim-mavi` paletiyle).

## Görsel/etkileşim özellikleri

- Öğeler **sola yaslı**: ikon + metin `justify-content: flex-start`, aralarında `gap`.
- **Kayan tek vurgu şeridi** (kritik kısım — sıradan `:hover` bunu VEREMEZ): her öğe kendi
  arka planını ayrı ayrı açıp kapatmaz. Bunun yerine listenin en başında `position:absolute`
  TEK bir "hover" elemanı durur; fare hangi öğenin üzerine gelirse o elemanın
  `offsetTop`/`offsetHeight` değerleri React state'e yazılır, vurgu şeridi bu değerlere göre
  `top`/`height` CSS transition'ıyla (`240ms cubic-bezier(.22,1,.36,1)`) o öğeye doğru
  **kayar**. Fare listeden tamamen çıkınca (`onMouseLeave` üst kapsayıcıda) opaklık 0'a iner.
- Vurgu şeridi: hafif tonlu arka plan (marka rengi ~%20-22 karışım) + **sol kenarlık** (3px,
  marka rengi).
- Aktif öğe aynı görseli (arka plan + sol kenarlık) **sabit/kalıcı** olarak taşır — kayan şerit
  bundan bağımsız çalışır, üzerine gelinirse ikisi üst üste biner (sorun değil).
- Tıklanabilir olmayan öğeler (ör. admin'deki "Yakında" rozetli linkler) de aynı kayan-şerit
  hover geri bildirimini alır; yalnızca `cursor: not-allowed` ile tıklanamaz oldukları belirtilir.
- Öğenin kendi `:hover` kuralı SADECE metin/ikon rengini değiştirir (görsel vurgu tamamen kayan
  şeritten gelir); ikon `transform: scale(1.1)` ile hafifçe büyür (`220ms cubic-bezier(.22,1,.36,1)`).

## Referans CSS (halka açık site)

```css
.urun-katalog__menu-hover { position: absolute; left: 8px; right: 8px; border-radius: 5px; background: #edf5fe; border-left: 3px solid #3277fd; opacity: 0; transition: top 240ms cubic-bezier(.22,1,.36,1), height 240ms cubic-bezier(.22,1,.36,1), opacity 160ms ease; pointer-events: none; z-index: 0; }
.urun-katalog__menu-gecis a { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; padding: 9px 11px 9px 14px; border-radius: 5px; color: #6577b8; transition: color 160ms ease; }
.urun-katalog__menu-ikon { transition: transform 220ms cubic-bezier(.22,1,.36,1); }
.urun-katalog__menu-gecis a:hover, .urun-katalog__menu-gecis a.aktif { color: #86b8fe; }
.urun-katalog__menu-gecis a.aktif { background: #edf5fe; border-left: 3px solid #3277fd; }
.urun-katalog__menu-gecis a:hover .urun-katalog__menu-ikon, .urun-katalog__menu-gecis a.aktif .urun-katalog__menu-ikon { transform: scale(1.12); }
```

## Referans JS (React)

```jsx
const [hoverKonumu, setHoverKonumu] = useState(null);
// ...
<nav onMouseLeave={() => setHoverKonumu(null)}>
  <span
    className="...-hover"
    aria-hidden="true"
    style={hoverKonumu ? { top: `${hoverKonumu.top}px`, height: `${hoverKonumu.height}px`, opacity: 1 } : { opacity: 0 }}
  />
  {ogeler.map((oge) => (
    <Link onMouseEnter={(e) => setHoverKonumu({ top: e.currentTarget.offsetTop, height: e.currentTarget.offsetHeight })}>
      ...
    </Link>
  ))}
</nav>
```

**Önkoşul**: kayan şeridin absolute konumlanabilmesi için `<nav>` (ya da en yakın ortak
kapsayıcı) `position: relative` olmalı; aradaki gruplama `<div>`leri `position: static` kalmalı
(aksi halde `offsetTop` yanlış referans noktasına göre hesaplanır).

## Renk uyarlaması (yeni bir alanda kullanırken)

Yalnızca şu üç değer o alanın paletine çevrilir, geri kalan her şey birebir kalır:
1. Vurgu şeridinin arka planı ve sol kenarlığı → alanın marka/vurgu rengi.
2. Aktif öğenin arka planı/kenarlığı → aynı renk.
3. Metin rengi (normal / hover / aktif) → alanın kendi metin tonları.
