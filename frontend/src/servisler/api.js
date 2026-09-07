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
  // Ana sayfanın bağımsız veri kümelerini paralel almak ilk görünümün bekleme süresini azaltır.
  const istekler = [
    ['tema', ornekVeriler.tema],
    ['menu', ornekVeriler.menu],
    ['sliderlar', ornekVeriler.sliderlar],
    ['kategoriler', ornekVeriler.kategoriler],
    ['referanslar', ornekVeriler.referanslar]
  ];

  const sonuclar = await Promise.all(
    istekler.map(([yol, yedekVeri]) =>
      veriGetir(`${API_TABANI}/${yol}`, { ...secenekler, yedekVeri })
    )
  );

  return Object.fromEntries(istekler.map(([anahtar], indeks) => [anahtar, sonuclar[indeks]]));
}
