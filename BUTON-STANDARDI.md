# Buton Standardı

Bu doküman, sitede (hem halka açık sayfalarda hem admin panelinde) kullanılacak standart
buton görünümünü tanımlar. Kaynak: `frontend/src/sayfalar/UrunlerSayfasi.jsx`'teki ürün
kartlarında kullanılan **"Detayı Gör"** butonu (`.urun-katalog__detay`, bkz.
`frontend/src/stiller/urun-katalog.css`).

## Ne zaman kullanılır

İkincil/gezinme amaçlı tüm butonlar ve linkler bu stili kullanır: "Detayı Gör", "Görüntüle",
"Tümünü Gör", "Alt Kategori Ekle" gibi. Admin panelindeki karşılığı `.yonetim-pill-buton`
sınıfıdır (bkz. `frontend/src/stiller/yonetim-kategori.css`).

Kapsam dışı: birincil çağrı-to-action (ör. "Yeni Kategori Ekle" üst buton, form içindeki
"Kaydet") ve yıkıcı onay butonları (ör. "Evet, Sil") mevcut dolu (solid) renkli stillerinde
kalır — bunlar sayfadaki TEK öncelikli eylemi vurgulamak için kasıtlı olarak farklıdır.

## Görsel özellikler

- İnce kenarlık (marka rengiyle uyumlu, soluk ton) + aynı rengin çok soluk (~5-10%) dolgusu.
- Metin marka rengiyle, kalın (700 font-weight).
- Köşeler yuvarlak (7-9px).
- Sağında küçük bir ikon (genelde `ChevronRight`, "Alt Kategori Ekle" gibi eylemlerde `Plus`).
- **Hover**: arkaplan tamamen marka rengine döner, metin/ikon beyaza döner; ikon sağa doğru
  birkaç piksel kayar (`translateX`). Geçiş yumuşak (`transition`).

## Referans CSS (halka açık site)

```css
.urun-katalog__detay {
  display: flex; min-height: 36px; align-items: center; justify-content: center; gap: 8px;
  border: 1px solid #7dadfd; border-radius: 7px; background: #f4f9fe; color: #2749d0;
  font-size: .7rem; font-weight: 700; text-decoration: none;
  transition: background-color 380ms cubic-bezier(.22,1,.36,1), color 380ms cubic-bezier(.22,1,.36,1), border-color 380ms cubic-bezier(.22,1,.36,1);
}
.urun-katalog__detay svg { width: 15px; transition: transform 320ms cubic-bezier(.22,1,.36,1); }
.urun-katalog__detay:hover { background: var(--renk-ana); border-color: var(--renk-ana); color: #fff; }
.urun-katalog__detay:hover svg { transform: translateX(3px); }
```

## Referans CSS (admin paneli — `.yonetim-pill-buton`)

```css
.yonetim-pill-buton {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 13px; border: 1px solid color-mix(in srgb, var(--yonetim-mavi) 45%, #fff);
  border-radius: 8px; background: color-mix(in srgb, var(--yonetim-mavi) 6%, #fff);
  color: var(--yonetim-mavi); cursor: pointer; font-size: .78rem; font-weight: 700;
  text-decoration: none; transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
.yonetim-pill-buton svg { width: 14px; height: 14px; transition: transform 200ms ease; }
.yonetim-pill-buton:hover { background: var(--yonetim-mavi); border-color: var(--yonetim-mavi); color: #fff; }
.yonetim-pill-buton:hover svg { transform: translateX(2px); }
```

Admin panelinde farklı bir vurgu rengi gerekiyorsa (ör. kırmızı/yeşil), `--yonetim-mavi`
yerine `--yonetim-kirmizi` / `--yonetim-yesil` kullanan aynı desende yeni bir varyant
(`.yonetim-pill-buton--kirmizi` gibi) eklenmeli; ana kural (kenarlık+soluk dolgu → hover'da
dolu renk) korunmalı.

## Kullanıldığı yerler (2026-09-13 itibarıyla)

- `UrunlerSayfasi.jsx` — "Detayı Gör" (orijinal kaynak)
- `KategoriYonetimSayfasi.jsx` — "Tümünü Gör", "Alt Kategori Ekle"

Yeni eklenen her ikincil/gezinme butonu bu standardı takip etmeli; mevcut solid/plain-link
butonlar zaman içinde bu desene taşınabilir.
