# Admin Tablo Standardı

Bu doküman, admin panelindeki (özellikle `IstatistiklerSayfasi.jsx`) veri tablolarında
uygulanan standart davranışları tanımlar. "Tablo" istendiğinde veya yeni bir istatistik/liste
kartı eklenirken bu doküman referans alınır — davranış tekrar tarif edilmesi beklenmez.

## 1. Sabit yükseklikli kart + iç kaydırma (sayfa hiç kaymasın)

Yan yana duran kartlar (`.istatistik-yan-yana > .istatistik-kart`) **sabit bir yüksekliğe**
sahiptir (`height`, `min-height` değil) ve `display:flex; flex-direction:column` kullanır.
Kartın gövdesi ayrı bir sarmalayıcıdadır: `.istatistik-kart__govde { flex:1; min-height:0;
overflow-y:auto; }`.

**Neden**: Bir akordiyon açılıp kapanınca ya da sayfalar arası geçilince kartın DIŞ yüksekliği
hiç değişmez — büyüme/küçülme yalnızca bu iç kaydırma alanında olur. Böylece o kart da, yanındaki
kart da, sayfanın geri kalanı da **asla aşağı kaymaz**.

Yükseklik değeri, en kalabalık normal senaryoyu (ör. tek bir satır açıkken tam bir sayfalık
döküm) hiç kaydırma gerekmeden karşılayacak kadar cömert seçilir — `scrollHeight ===
clientHeight` olacak şekilde canlı ölçülüp ayarlanır (bkz. aşağıdaki doğrulama yöntemi). Yalnızca
gerçekten çok fazla öğe aynı anda açılırsa (nadir durum) iç kaydırma devreye girer.

## 2. Sayfalanmış listelerde dolgu satırı (yükseklik hep sabit)

Bir liste/tablo sayfalara bölündüğünde (Önceki/Sonraki), **son sayfada daha az kayıt kalınca
alan küçülüp sayfalama düğmeleri yukarı/aşağı kaymasın diye** eksik kalan satır sayısı kadar
görünmez "dolgu satırı" eklenir:

```jsx
{Array.from({ length: Math.max(0, SAYFA_BOYUTU - gosterilenler.length) }).map((_, i) => (
  <tr key={`bos-${i}`} className="istatistik-tablo__dolgu-satir" aria-hidden="true">
    <td colSpan={SUTUN_SAYISI}>&nbsp;</td>
  </tr>
))}
```

Sayfalama düğmeleri (`.sayfalama`) de her zaman render edilir (tek sayfa olsa bile gizlenmez
— ya da en azından sayfa sayısı sabitse gizlenmeyecek şekilde tasarlanır) ki toplam yükseklik
öngörülebilir kalsın.

**Doğrulama yöntemi** (bir sonraki sayfaya geçerken pager'ın gerçekten kaymadığını kanıtlamak
için): tarayıcıda `pager.getBoundingClientRect().top` değerini sayfa geçişlerinden önce/sonra
karşılaştır — birebir aynı olmalı.

## 3. Sütun hizalama

**Varsayılan: tüm sütunlar ortalı** (`text-align: center`). Yalnızca URL/yol taşıyan sütunlar
(ör. "Sayfa", "Geldiği Yer") **sola yaslı** kalır — bunlar en uzun ve en önemli okunacak
değerlerdir, ortalanınca okunabilirliği bozar.

```css
.istatistik-tablo th, .istatistik-tablo td { text-align: center; }
.istatistik-tablo .istatistik-tablo__sol-hucre { text-align: left; }
```

**⚠️ CSS özgüllük tuzağı**: `.istatistik-tablo td` seçicisi (1 class + 1 element =
özgüllük `(0,1,1)`) tek başına `.istatistik-tablo__sol-hucre` seçicisinden (1 class =
`(0,1,0)`) DAHA YÜKSEK özgüllüktedir — sırayla yazılsa bile ikincisi kaybeder. Override kuralı
en az iki class içermeli: `.istatistik-tablo .istatistik-tablo__sol-hucre` (`(0,2,0)`,
element sayısına bakılmaksızın kazanır).

## 4. "Sayfayı web sitesinde aç" göz ikonu

Bir sayfa/URL yolu gösteren her sütunun **hemen sağına** (soluna değil) bir göz ikonu (`Eye`,
lucide-react) sütunu eklenir; tıklanınca o path yeni sekmede açılır (SPA ile aynı origin,
`target="_blank"`). Sütun başlığı boş bırakılmaz, "Sayfa Görüntüle" yazar.

```jsx
function SayfaGoruntuleLinki({ yol }) {
  return (
    <a className="sayfa-goruntule-linki" href={yol} target="_blank" rel="noopener noreferrer"
       aria-label={`${yol} sayfasını web sitesinde aç`} title="Sayfayı web sitesinde aç">
      <Eye aria-hidden="true" size={15} />
    </a>
  );
}
```

Sütun sırası: `... | Sayfa | Sayfa Görüntüle | ...` (ikon Sayfa'dan SONRA gelir).

## 5. Başlıklar sarılabilir olmalı

Dar sütunların başlığı (ör. "Sayfa Görüntüle") `white-space: nowrap` ile kesilmemeli; başlık
satırı içeriğe göre esneyip 2 satıra sarılabilmeli, gövde satırlarının sabit yüksekliği
(`height: 33px`) bundan etkilenmemeli:

```css
.istatistik-tablo th { white-space: normal; line-height: 1.3; vertical-align: middle; }
.istatistik-tablo tbody th, .istatistik-tablo tbody td { height: 33px; box-sizing: border-box; }
```

## Uygulandığı yer

`frontend/src/sayfalar/IstatistiklerSayfasi.jsx` — En Çok Görüntülenen Sayfalar, IP Bazında
Toplam Kalma Süresi (ve IP'ye tıklayınca açılan sayfa dökümü), Son Ziyaretler.
