import { ornekVeriler } from '../veri/ornekVeriler';

const API_TABANI = import.meta.env.VITE_API_URL ?? '/api';

// Bütün GET isteklerini aynı yanıt sözleşmesinde toplar; bileşenlerin HTTP ayrıntılarını bilmesi gerekmez.
export async function veriGetir(
  yol,
  {
    fetchFn = globalThis.fetch,
    gelistirme = import.meta.env.DEV,
    yedekVeri
  } = {}
) {
  try {
    const yanit = await fetchFn(yol, {
      headers: { Accept: 'application/json' }
    });

    if (!yanit.ok) {
      throw new Error(`HTTP ${yanit.status}`);
    }

    const govde = await yanit.json();

    if (govde?.basarili !== true) {
      throw new Error('Geçersiz API yanıtı');
    }

    return govde.veri;
  } catch (hata) {
    // Yerel veri yalnızca geliştirmede kullanılır; üretimde eski veya örnek içerik sessizce gösterilmez.
    if (gelistirme && yedekVeri !== undefined) {
      return yedekVeri;
    }

    throw new Error('İçerik şu anda yüklenemiyor.', { cause: hata });
  }
}

export async function siteVerileriniGetir(secenekler = {}) {
  // PHP geliştirme sunucusu istekleri sırayla işlediği için ilk ekran verilerini tek HTTP çağrısında toplarız.
  return veriGetir(`${API_TABANI}/baslangic`, {
    ...secenekler,
    yedekVeri: ornekVeriler
  });
}

// İletişim formu üretimde örnek veriye düşmeden doğrudan PHP kayıt ucuna gönderilir.
export async function iletisimMesajiGonder(veriler, { fetchFn = globalThis.fetch } = {}) {
  const yanit = await fetchFn(`${API_TABANI}/iletisim-mesajlari`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(veriler)
  });
  const govde = await yanit.json();
  if (!yanit.ok || govde?.basarili !== true) throw new Error(govde?.mesaj || 'Mesaj gönderilemedi.');
  return { ...govde.veri, mesaj: govde.mesaj };
}

// Admin yazma çağrıları aynı zarfı ({basarili, veri, mesaj}) paylaşır; farklı olan yalnızca HTTP metodu ve gövdedir.
async function adminIstegiGonder(yol, { yontem, govde, fetchFn = globalThis.fetch } = {}) {
  const secenekler = {
    method: yontem,
    headers: { Accept: 'application/json' }
  };
  if (govde !== undefined) {
    secenekler.headers['Content-Type'] = 'application/json';
    secenekler.body = JSON.stringify(govde);
  }

  const yanit = await fetchFn(`${API_TABANI}${yol}`, secenekler);
  const govdeYaniti = await yanit.json();
  if (!yanit.ok || govdeYaniti?.basarili !== true) {
    throw new Error(govdeYaniti?.mesaj || 'İstek tamamlanamadı.');
  }
  return govdeYaniti.veri;
}

// Kategori Yönetimi sayfası pasif kategorileri de görmesi gerektiği için genel /api/baslangic menüsü yerine
// bu admin ucunu kullanır (guncellenme_tarihi ve urun_sayisi de yalnızca burada gelir).
export async function kategoriYonetimVerisiniGetir(secenekler = {}) {
  return adminIstegiGonder('/admin/kategoriler', { ...secenekler, yontem: 'GET' });
}

export async function kategoriEkle(ustAltOgeId, veriler, secenekler = {}) {
  return adminIstegiGonder('/admin/kategoriler', {
    ...secenekler,
    yontem: 'POST',
    govde: { ...veriler, ust_alt_oge_id: ustAltOgeId }
  });
}

export async function kategoriGuncelle(id, veriler, secenekler = {}) {
  return adminIstegiGonder(`/admin/kategoriler/${id}`, { ...secenekler, yontem: 'PUT', govde: veriler });
}

export async function kategoriSil(id, secenekler = {}) {
  return adminIstegiGonder(`/admin/kategoriler/${id}`, { ...secenekler, yontem: 'DELETE' });
}

// Silinen kategoriler kalıcı silinmeden önce 7 gün "çöp kutusunda" bekler; bu iki uç o listeyi
// gösterir ve süresi geçmemiş bir kaydı geri alır.
export async function silinenKategorileriGetir(secenekler = {}) {
  return adminIstegiGonder('/admin/kategoriler/silinenler', { ...secenekler, yontem: 'GET' });
}

export async function kategoriGeriAl(id, secenekler = {}) {
  return adminIstegiGonder(`/admin/kategoriler/${id}/geri-al`, { ...secenekler, yontem: 'POST' });
}

// SPA istemci tarafında yönlendiği için her sayfa geçişinde bu uca küçük bir "fire and forget"
// isteği atılır; IP adresi güvenilir şekilde yalnızca sunucu tarafında okunabildiği için buradan
// hiçbir kimlik bilgisi gönderilmez, yalnızca ziyaret edilen yol, geldiği sayfa ve sunucudan asla
// okunamayan ekran çözünürlüğü / saat dilimi gibi tarayıcı bilgileri. Dönen kayıt id'si, ziyaretçi
// sayfadan ayrılınca kalma süresini geriye dönük doldurabilmek için kullanılır.
export async function sayfaGoruntulemeKaydet(yol, referans, { fetchFn = globalThis.fetch } = {}) {
  try {
    const yanit = await fetchFn(`${API_TABANI}/analitik/goruntuleme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        yol,
        referans: referans || null,
        ekran_cozunurlugu: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : null,
        saat_dilimi: Intl.DateTimeFormat().resolvedOptions().timeZone || null
      })
    });
    const govde = await yanit.json();
    return govde?.veri?.id ?? null;
  } catch {
    // Analitik kaydı başarısız olsa da ziyaretçi deneyimini etkilememeli.
    return null;
  }
}

// Ziyaretçi sayfadan ayrılırken (rota değişimi veya sekme kapanışı) çağrılır; sayfada geçirilen
// süreyi az önce oluşturulan ziyaret kaydına geriye dönük işler. sendBeacon, sayfa kapanırken bile
// isteğin tamamlanmasını garanti eder — normal fetch bu anda kesilebilir.
export function kalmaSuresiKaydet(id, saniye) {
  if (!id) return;
  const veri = JSON.stringify({ id, saniye });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_TABANI}/analitik/kalma-suresi`, new Blob([veri], { type: 'application/json' }));
    } else {
      fetch(`${API_TABANI}/analitik/kalma-suresi`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: veri, keepalive: true }).catch(() => {});
    }
  } catch {
    // Kalma süresi ikincil bir metrik; başarısız olması ziyaretçi deneyimini etkilememeli.
  }
}

export async function ziyaretYonetimVerisiniGetir(sayfa = 1, secenekler = {}) {
  return adminIstegiGonder(`/admin/ziyaretler?sayfa=${sayfa}`, { ...secenekler, yontem: 'GET' });
}

export async function islemYonetimVerisiniGetir(sayfa = 1, secenekler = {}) {
  return adminIstegiGonder(`/admin/loglar?sayfa=${sayfa}`, { ...secenekler, yontem: 'GET' });
}
