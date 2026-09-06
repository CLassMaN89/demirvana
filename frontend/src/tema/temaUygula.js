// API'den gelen anahtarları sınırlı bir CSS değişken listesine bağlayarak yönetim paneli verisinin rastgele stil yazmasını engelleriz.
const TEMA_ESLEMESI = Object.freeze({
  ana_mavi: '--renk-ana',
  koyu_mavi: '--renk-koyu',
  acik_mavi: '--renk-acik',
  beyaz: '--renk-beyaz',
  metin: '--renk-metin',
  ikincil_metin: '--renk-ikincil'
});

export function temaUygula(tema, hedef = document.documentElement) {
  // `hedef` parametresi gerçek sayfada :root'u, testlerde ise izole bir DOM öğesini günceller.
  Object.entries(TEMA_ESLEMESI).forEach(([anahtar, cssDegiskeni]) => {
    const deger = tema?.[anahtar];

    if (typeof deger === 'string') {
      hedef.style.setProperty(cssDegiskeni, deger);
    }
  });
}
