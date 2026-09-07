// Bu kayıtlar API çalışmadan arayüz geliştirebilmek içindir; üretimde aynı alanlar MySQL'den gelir.
const sliderMetinleri = [
  ['Endüstriyel akışta güvenilir kontrol', 'Üretim hatlarına uygun vana çözümleri.'],
  ['Her bağlantıda ölçülü mühendislik', 'Projenizin basınç ve akış gereksinimlerine uygun seçim.'],
  ['Üretimden sahaya kesintisiz çözüm', 'Dayanıklı ürünler, açık teknik bilgi ve güçlü destek.'],
  ['Zorlu çalışma koşullarına hazır', 'Endüstriyel tesisler için güvenilir vana teknolojileri.'],
  ['Doğru vana, kararlı sistem', 'Uygulamaya özel ürün seçeneklerini birlikte belirleyin.'],
  ['Kaliteyi akışın merkezine koyuyoruz', 'Üretim deneyimini sürdürülebilir performansla buluşturuyoruz.']
];

const vanaMenuKategorileri = [
  ['Yangın Vanaları', 'yangin-vanalari'],
  ['Su Grubu Vanaları', 'su-grubu-vanalari'],
  ['Buhar Grubu Vanaları', 'buhar-grubu-vanalari'],
  ['Kontrol Vanaları', 'kontrol-vanalari'],
  ['Hidrolik Vanalar', 'hidrolik-vanalar'],
  ['Basınç Düşürücü Vanalar', 'basinc-dusurucu-vanalar'],
  ['Paslanmaz Vanalar', 'paslanmaz-vanalar'],
  ['Gemi Vanaları', 'gemi-vanalari'],
  ['Balans Vanaları', 'balans-vanalari'],
  ['Solenoid Patlaç Pistonlu', 'solenoid-patlac-pistonlu'],
  ['Kompansatörler', 'kompansatorler'],
  ['Bağlantı Parçaları', 'baglanti-parcalari']
].map(([baslik, slug], indeks) => ({
  id: 310 + indeks,
  baslik,
  baglanti: `/urunler/${slug}`,
  siralama: indeks + 1,
  alt_ogeler: []
}));

const aktuatorMenuKategorileri = [
  ['Elektrik Aktüatörler', 'elektrik-aktuatorler'],
  ['Pnömatik Aktüatör', 'pnomatik-aktuator'],
  ['Aktüatörlü Vanalar', 'aktuatorlu-vanalar'],
  ['Aksesuarlar', 'aktuator-aksesuarlari']
].map(([baslik, slug], indeks) => ({
  id: 330 + indeks,
  baslik,
  baglanti: `/urunler/${slug}`,
  siralama: indeks + 1,
  alt_ogeler: []
}));

// Referans kayıtları, API kapalıyken de sayfa tasarımının gerçek içerik uzunluklarıyla sınanmasını sağlar.
const referansKayitlari = [
  [1, 'Antalya Gazipaşa Atık Su Arıtma Tesisi Vanaları', 'Antalya / Gazipaşa', 'İller Bankası', '2011–2012', 'yurtici'],
  [2, 'Gönen Ovası Pompa Sulaması İnşaatı Vanaları', 'Balıkesir / Gönen', 'DSİ 25. Bölge · İlci İnşaat', '2012', 'yurtici'],
  [3, 'Belediye Su ve Kanalizasyon Müdürlüğü İş Bitirme Projesi', 'Isparta', 'Isparta Belediyesi', '2010', 'yurtici'],
  [4, 'Çermik İçme Suyu ve Paket Arıtma Tesisi Vanaları', 'Diyarbakır / Çermik', 'İller Bankası', '2013', 'yurtici'],
  [5, 'Dilovası Atıksu Arıtma Tesisi Vanaları', 'Kocaeli / Dilovası', 'İller Bankası', '2009', 'yurtici'],
  [6, 'Paşaköy–Tuzla Atıksu Arıtma Tesisi Vanaları', 'İstanbul', 'İSKİ · Kuzu Toplu Konut', null, 'yurtici'],
  [7, 'Eti Maden Tesisleri', 'Türkiye', 'Eti Maden', '2012', 'yurtici'],
  [8, 'Enerji Üretim Tesisleri', 'Türkiye', 'EÜAŞ', '2014', 'yurtici'],
  [9, 'Karabük Demir Çelik Tesisleri', 'Karabük', 'Kardemir Karabük Demir Çelik Sanayi ve Ticaret A.Ş.', null, 'yurtici'],
  [10, 'Endüstriyel Tesis Projeleri', 'Türkiye', 'Enka İnşaat ve Sanayi A.Ş.', null, 'yurtici'],
  [11, 'Petrol Üretim Tesisleri', 'Türkiye', 'Türkiye Petrolleri A.O.', null, 'yurtici'],
  [12, 'Afşin-Elbistan Termik Santrali', 'Kahramanmaraş', 'Afşin-Elbistan Termik Santrali İşletme Müdürlüğü', null, 'yurtici'],
  [13, 'Maden İşletme Tesisleri', 'Türkiye', 'Eti Maden İşletmeleri', null, 'yurtici'],
  [14, 'Krom Üretim Tesisleri', 'Elazığ', 'Eti Krom A.Ş.', null, 'yurtici'],
  [15, 'Elektrometalurji Tesisleri', 'Antalya', 'Eti Elektrometalurji A.Ş.', null, 'yurtici'],
  [16, 'Belediye Altyapı Projeleri', 'Kütahya', 'Kütahya Belediyesi', null, 'yurtici'],
  [17, 'Demir ve Çelik Fabrikaları', 'Zonguldak / Ereğli', 'Ereğli Demir ve Çelik Fab. T.A.Ş.', null, 'yurtici'],
  [18, 'Deri Sanayi Atık Su Arıtma Tesisi', 'İstanbul / Tuzla', 'Tuzla Dericiler Sanayi Sitesi', null, 'yurtici'],
  [19, 'Water Treatment Valves', 'Romanya', 'Sistem Yapı', '2008', 'yurtdisi'],
  [20, 'Hazal Seaport Valves', 'Azerbaycan', 'Hazal Seaport', '2014', 'yurtdisi'],
  [21, 'Water Administration', 'Gürcistan', 'Georgia Water Administration', '2014', 'yurtdisi'],
  [22, 'Water Administration', 'Ermenistan', 'Armenia Water Administration', '2010–2011', 'yurtdisi']
].map(([id, baslik, konum, kurum, yil, bolge], indeks) => ({
  id, baslik, konum, kurum, yil, bolge, siralama: indeks + 1
}));

export const ornekVeriler = Object.freeze({
  tema: {
    ana_mavi: '#28469D',
    koyu_mavi: '#17306F',
    acik_mavi: '#EAF1FF',
    beyaz: '#FFFFFF',
    metin: '#172033',
    ikincil_metin: '#62708A'
  },
  menu: [
    { id: 1, baslik: 'Anasayfa', baglanti: '/', siralama: 1, alt_ogeler: [] },
    { id: 2, baslik: 'Kurumsal', baglanti: '/kurumsal', siralama: 2, alt_ogeler: [] },
    {
      id: 3,
      baslik: 'Ürünler',
      baglanti: '/urunler',
      siralama: 3,
      alt_ogeler: [
        { id: 31, baslik: 'Vana', baglanti: '/urunler/vana', siralama: 1, alt_ogeler: vanaMenuKategorileri },
        { id: 32, baslik: 'Aktüatör', baglanti: '/urunler/aktuator', siralama: 2, alt_ogeler: aktuatorMenuKategorileri },
        { id: 33, baslik: 'Otomasyon', baglanti: '/urunler/otomasyon', siralama: 3, alt_ogeler: [] },
        { id: 34, baslik: 'Temsilcilikler', baglanti: '/urunler/temsilcilikler', siralama: 4, alt_ogeler: [] }
      ]
    },
    { id: 4, baslik: 'Teknik', baglanti: '/teknik', siralama: 4, alt_ogeler: [] },
    { id: 5, baslik: 'Referanslar', baglanti: '/referanslar', siralama: 5, alt_ogeler: [] },
    { id: 6, baslik: 'Sertifikalar', baglanti: '/sertifikalar', siralama: 6, alt_ogeler: [] },
    { id: 7, baslik: 'İletişim', baglanti: '/iletisim', siralama: 7, alt_ogeler: [] }
  ],
  sliderlar: sliderMetinleri.map(([baslik, aciklama], indeks) => ({
    id: indeks + 1,
    baslik,
    aciklama,
    gorsel_yolu: `/assets/carousel/${indeks + 1}.png`,
    alternatif_metin: `Demirvana endüstriyel vana çözümü ${indeks + 1}`,
    buton_metni: indeks % 2 === 0 ? 'Ürünleri incele' : 'Bizimle iletişime geçin',
    buton_baglantisi: indeks % 2 === 0 ? '/urunler' : '/iletisim',
    animasyon_turu: ['kaydir', 'yaklas', 'metin-maske'][indeks % 3],
    odak_x: 50,
    odak_y: 50
  })),
  kategoriler: [
    { id: 1, ad: 'Küresel Vanalar', slug: 'kuresel-vanalar' },
    { id: 2, ad: 'Kelebek Vanalar', slug: 'kelebek-vanalar' },
    { id: 3, ad: 'Sürgülü Vanalar', slug: 'surgulu-vanalar' },
    { id: 4, ad: 'Çekvalfler', slug: 'cekvalfler' },
    { id: 5, ad: 'Globe Vanalar', slug: 'globe-vanalar' },
    { id: 6, ad: 'Pislik Tutucular', slug: 'pislik-tutucular' },
    { id: 7, ad: 'Kontrol Vanaları', slug: 'kontrol-vanalari' }
  ].map((kategori) => ({
    ...kategori,
    gorsel_yolu: '/assets/urun-placeholder.svg',
    alternatif_metin: `${kategori.ad} ürün grubu`
  })),
  referanslar: {
    kayitlar: referansKayitlari,
    // Aynı kaynak görseldeki üç saha fotoğrafı odak koordinatlarıyla ayrılır; admin yüklemeleri sonradan ayrı dosyalar olabilir.
    gorseller: [
      { id: 1, gorsel_yolu: '/assets/referanslar/referans-galerisi.png', alternatif_metin: 'Arıtma tesisinde kullanılan mavi vana sistemi', odak_x: 0, odak_y: 100, gorsel_olcegi: 330, siralama: 1 },
      { id: 2, gorsel_yolu: '/assets/referanslar/referans-galerisi.png', alternatif_metin: 'Arıtma havuzu üzerindeki vana uygulaması', odak_x: 50, odak_y: 100, gorsel_olcegi: 330, siralama: 2 },
      { id: 3, gorsel_yolu: '/assets/referanslar/referans-galerisi.png', alternatif_metin: 'Saha kontrol panosu ve boru hattı uygulaması', odak_x: 100, odak_y: 100, gorsel_olcegi: 330, siralama: 3 }
    ]
  }
});
