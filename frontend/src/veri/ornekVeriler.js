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
const referansSektorleri = [
  [1, 'Su ve Atıksu', 'su-ve-atiksu'], [2, 'Sulama', 'sulama'], [3, 'Enerji', 'enerji'],
  [4, 'Madencilik', 'madencilik'], [5, 'Sanayi', 'sanayi'], [6, 'Belediye', 'belediye']
].map(([id, ad, slug], indeks) => ({ id, ad, slug, siralama: indeks + 1 }));

const referansKayitlari = [
  [1, 'Antalya Gazipaşa Atık Su Arıtma Tesisi Vanaları', 'Antalya / Gazipaşa', 'İller Bankası', '2011–2012', 'yurtici', 'Su ve Atıksu', 'su-ve-atiksu'],
  [2, 'Gönen Ovası Pompa Sulaması İnşaatı Vanaları', 'Balıkesir / Gönen', 'DSİ 25. Bölge · İlci İnşaat', '2012', 'yurtici', 'Sulama', 'sulama'],
  [3, 'Belediye Su ve Kanalizasyon Müdürlüğü İş Bitirme Projesi', 'Isparta', 'Isparta Belediyesi', '2010', 'yurtici', 'Belediye', 'belediye'],
  [4, 'Çermik İçme Suyu ve Paket Arıtma Tesisi Vanaları', 'Diyarbakır / Çermik', 'İller Bankası', '2013', 'yurtici', 'Su ve Atıksu', 'su-ve-atiksu'],
  [5, 'Dilovası Atıksu Arıtma Tesisi Vanaları', 'Kocaeli / Dilovası', 'İller Bankası', '2009', 'yurtici', 'Su ve Atıksu', 'su-ve-atiksu'],
  [6, 'Paşaköy–Tuzla Atıksu Arıtma Tesisi Vanaları', 'İstanbul', 'İSKİ · Kuzu Toplu Konut', null, 'yurtici', 'Su ve Atıksu', 'su-ve-atiksu'],
  [7, 'Eti Maden Tesisleri', 'Türkiye', 'Eti Maden', '2012', 'yurtici', 'Madencilik', 'madencilik'],
  [8, 'Enerji Üretim Tesisleri', 'Türkiye', 'EÜAŞ', '2014', 'yurtici', 'Enerji', 'enerji'],
  [9, 'Karabük Demir Çelik Tesisleri', 'Karabük', 'Kardemir Karabük Demir Çelik Sanayi ve Ticaret A.Ş.', null, 'yurtici', 'Sanayi', 'sanayi'],
  [10, 'Endüstriyel Tesis Projeleri', 'Türkiye', 'Enka İnşaat ve Sanayi A.Ş.', null, 'yurtici', 'Sanayi', 'sanayi'],
  [11, 'Petrol Üretim Tesisleri', 'Türkiye', 'Türkiye Petrolleri A.O.', null, 'yurtici', 'Sanayi', 'sanayi'],
  [12, 'Afşin-Elbistan Termik Santrali', 'Kahramanmaraş', 'Afşin-Elbistan Termik Santrali İşletme Müdürlüğü', null, 'yurtici', 'Enerji', 'enerji'],
  [13, 'Maden İşletme Tesisleri', 'Türkiye', 'Eti Maden İşletmeleri', null, 'yurtici', 'Madencilik', 'madencilik'],
  [14, 'Krom Üretim Tesisleri', 'Elazığ', 'Eti Krom A.Ş.', null, 'yurtici', 'Madencilik', 'madencilik'],
  [15, 'Elektrometalurji Tesisleri', 'Antalya', 'Eti Elektrometalurji A.Ş.', null, 'yurtici', 'Madencilik', 'madencilik'],
  [16, 'Belediye Altyapı Projeleri', 'Kütahya', 'Kütahya Belediyesi', null, 'yurtici', 'Belediye', 'belediye'],
  [17, 'Demir ve Çelik Fabrikaları', 'Zonguldak / Ereğli', 'Ereğli Demir ve Çelik Fab. T.A.Ş.', null, 'yurtici', 'Sanayi', 'sanayi'],
  [18, 'Deri Sanayi Atık Su Arıtma Tesisi', 'İstanbul / Tuzla', 'Tuzla Dericiler Sanayi Sitesi', null, 'yurtici', 'Belediye', 'belediye'],
  [19, 'Water Treatment Valves', 'Romanya', 'Sistem Yapı', '2008', 'yurtdisi', 'Su ve Atıksu', 'su-ve-atiksu'],
  [20, 'Hazal Seaport Valves', 'Azerbaycan', 'Hazal Seaport', '2014', 'yurtdisi', 'Sanayi', 'sanayi'],
  [21, 'Water Administration', 'Gürcistan', 'Georgia Water Administration', '2014', 'yurtdisi', 'Su ve Atıksu', 'su-ve-atiksu'],
  [22, 'Water Administration', 'Ermenistan', 'Armenia Water Administration', '2010–2011', 'yurtdisi', 'Su ve Atıksu', 'su-ve-atiksu']
].map(([id, baslik, konum, kurum, yil, bolge, sektor_adi, sektor_slug], indeks) => ({
  id, baslik, konum, kurum, yil, bolge, sektor_adi, sektor_slug, siralama: indeks + 1
}));

export const ornekVeriler = Object.freeze({
  seo: {
    genel: {
      site_adi: 'Demirvana',
      site_ana_adresi: 'https://www.demirvana.com',
      site_varsayilan_dil: 'tr',
      logo_yolu: '/assets/logo.png',
      seo_varsayilan_baslik: 'Demirvana | Endüstriyel Vana Çözümleri',
      seo_baslik_sablonu: '%s | Demirvana',
      seo_varsayilan_aciklama: 'Endüstriyel vana üretimi, mühendislik ve satış desteği için Demirvana ürün ve çözümlerini inceleyin.',
      seo_varsayilan_gorsel: '/assets/logo.png',
      seo_varsayilan_robotlar: 'index, follow, max-image-preview:large',
      seo_organizasyon_turu: 'Organization'
    },
    sayfalar: {
      tr: {
        '/': { seo_basligi: 'Demirvana | Endüstriyel Vana Çözümleri', meta_aciklama: 'Endüstriyel vana üretimi, mühendislik ve satış desteği için Demirvana ürün ve çözümlerini inceleyin.', canonical_yolu: '/', robotlar: 'index, follow, max-image-preview:large', yapilandirilmis_veri_turu: 'WebSite' },
        '/urunler': { seo_basligi: 'Endüstriyel Vana Ürünleri | Demirvana', meta_aciklama: 'Küresel, kelebek, sürgülü, kontrol vanaları ve diğer endüstriyel vana gruplarını inceleyin.', canonical_yolu: '/urunler', robotlar: 'index, follow, max-image-preview:large', yapilandirilmis_veri_turu: 'CollectionPage' },
        '/temsilcilikler': { seo_basligi: 'Temsilcilikler | Demirvana', meta_aciklama: 'Demirvana iş ortakları Genebre, Mei ve Centork marka çözümlerini inceleyin.', canonical_yolu: '/temsilcilikler', robotlar: 'index, follow, max-image-preview:large', yapilandirilmis_veri_turu: 'CollectionPage' }
      }
    }
  },
  site_ayarlari: {
    site_adi: 'Demirvana',
    logo_yolu: '/assets/logo.png',
    footer_aktif_mi: '1',
    footer_marka_aktif_mi: '1',
    footer_marka_sirasi: '1',
    footer_sirket_aciklamasi: 'Endüstriyel vana üretimi, mühendislik ve satış desteğini güvenilir çözümlerle buluşturuyoruz.',
    footer_hizli_baglantilar_basligi: 'Hızlı Bağlantılar',
    footer_hizli_baglantilar_aktif_mi: '1',
    footer_hizli_baglantilar_sirasi: '2',
    footer_urunler_basligi: 'Ürün Grupları',
    footer_urunler_aktif_mi: '1',
    footer_urunler_sirasi: '3',
    footer_destek_basligi: 'Destek & İletişim',
    footer_destek_aktif_mi: '1',
    footer_destek_sirasi: '4',
    destek_telefonu: '+90 (212) 297 57 30',
    destek_eposta: 'dv@demirvana.com',
    firma_adresi: 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi CA Blok No:3, 34490 İkitelli - İstanbul / Türkiye',
    iletisim_harita_adresi: 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi CA Blok No:3, 34490 İkitelli - İstanbul / Türkiye',
    iletisim_harita_embed_adresi: 'https://www.google.com/maps/d/embed?mid=1R6ztHB_hDzoxh7P4hUMhGTVWJms',
    iletisim_harita_kart_basligi: 'Bizi Ziyaret Edin',
    iletisim_harita_kart_aciklamasi: 'İkitelli OSB’deki merkezimizde sizleri ağırlamaktan memnuniyet duyarız.',
    iletisim_arkaplan_rengi: '#91aec4',
    iletisim_arkaplan_ust_rengi: '#ffffff',
    iletisim_etiketi: 'Demirvana',
    iletisim_basligi: 'İletişim',
    iletisim_aciklamasi: 'Sorularınız, talepleriniz veya iş birliği fırsatları için bizimle iletişime geçebilirsiniz. Ekibimiz size en kısa sürede dönüş yapacaktır.',
    iletisim_whatsapp: '+90 (555) 978 18 00',
    iletisim_faks: '+90 (212) 297 57 33',
    iletisim_form_basligi: 'Bize Mesaj Gönderin',
    iletisim_form_aciklamasi: 'Taleplerinizi, sorularınızı veya iş birliği önerilerinizi form aracılığıyla bize iletebilirsiniz.',
    iletisim_hesap_kisayol_basligi: 'Hesap Numaralarımız',
    iletisim_hesap_kisayol_aciklamasi: 'Banka hesap bilgilerimizi görüntüleyin.',
    iletisim_hesap_basligi: 'Hesap numaraları',
    iletisim_hesap_slogani: 'Güvenilir iş ortağınız',
    iletisim_hesap_guvenlik_notu: 'Güncel banka ve ödeme bilgileri için muhasebe birimimizle iletişime geçin. Ödeme öncesinde hesap bilgilerini mutlaka telefonla doğrulayın.',
    iletisim_dunya_aktif_mi: '1',
    iletisim_dunya_basligi: 'Dünyaya güvenilir akış çözümleri',
    iletisim_dunya_aciklamasi: 'Endüstriyel akış kontrolündeki deneyimimizi dünyanın farklı noktalarındaki iş ortaklarımızla buluşturuyoruz.',
    footer_iletisim_buton_metni: 'Bizimle iletişime geçin',
    footer_iletisim_buton_baglantisi: '/iletisim',
    footer_telif_metni: '© {yil} Demirvana. Tüm hakları saklıdır.',
    kategori_kart_varsayilan_alt_metni: 'Endüstriyel vana çözümleri',
    kategori_tum_urunler_alt_metni: 'Ürün kataloğu',
    kategori_bolumu_aktif_mi: '0',
    fuarlar_aktif_mi: '1',
    fuarlar_etiketi: 'SEKTÖREL BULUŞMALAR',
    fuarlar_basligi: 'Fuarlar',
    fuarlar_aciklamasi: 'Sektör profesyonelleriyle buluştuğumuz fuarlardan ve ürün tanıtımlarımızdan kareler.',
    fuarlar_buton_metni: 'Fuar programı için iletişime geçin',
    fuarlar_buton_baglantisi: '/iletisim',
    teknik_hero_basligi: 'Teknik',
    teknik_hero_aciklamasi: 'Ürünlerimize ait teknik tabloları ve kullanım talimatlarını buradan inceleyebilirsiniz.',
    teknik_slogan_satir_1: 'Güvenli Akış',
    teknik_slogan_satir_2: 'Daha Güçlü Yarınlar',
    teknik_pdf_goruntule_metni: 'PDF Görüntüle',
    teknik_bos_kategori_metni: 'Bu kategoride henüz doküman bulunmuyor.',
    teknik_pdf_yukleniyor_metni: 'PDF yükleniyor…',
    teknik_pdf_hata_basligi: 'PDF görüntülenemedi',
    teknik_pdf_hata_aciklamasi: 'Doküman şu anda açılamıyor. Lütfen daha sonra tekrar deneyin.',
    teknik_pdf_indir_metni: 'İndir',
    teknik_pdf_yeni_sekme_metni: 'Yeni sekmede aç',
    teknik_pdf_kapat_etiketi: 'PDF görüntüleyiciyi kapat',
    teknik_pdf_ikon_yolu: '/assets/ikonlar/pdf-ikonu.png',
    teknik_baslik_gecis_suresi: '2600',
    sertifika_hero_basligi: 'Sertifikalar',
    sertifika_hero_aciklamasi: 'Kaliteli üretim, güvenilir çözümler. Ulusal ve uluslararası geçerliliğe sahip sertifikalarımızla standartlara bağlılığımızı belgeliyoruz.',
    sertifika_slogan_satir_1: 'Güven',
    sertifika_slogan_satir_2: 'Kalite',
    sertifika_slogan_satir_3: 'Sürdürülebilirlik',
    sertifika_kutuphane_basligi: 'Sertifika Kütüphanesi',
    sertifika_arama_yertutucusu: 'Sertifika ara...',
    sertifika_tumu_metni: 'Tümü',
    sertifika_bos_metni: 'Aramanızla eşleşen bir sertifika bulunamadı.',
    sertifika_pdf_ac_metni: 'PDF Aç',
    sertifika_pdf_indir_metni: 'İndir',
    sertifika_pdf_yukleniyor_metni: 'Sertifika yükleniyor…',
    sertifika_pdf_hata_basligi: 'Sertifika görüntülenemedi',
    sertifika_pdf_hata_aciklamasi: 'Belge şu anda açılamıyor. Lütfen daha sonra tekrar deneyin.',
    kurumsal_etiket: 'Kurumsal',
    kurumsal_baslik_satir_1: 'Güvenilir çözümler.',
    kurumsal_baslik_satir_2: 'Sürdürülebilir iş ortaklıkları.',
    kurumsal_giris_metni: '2007 yılında Demir Ticaret adıyla başlayan yolculuğumuz, 2008 yılından itibaren Demir Vana ve Kontrol Elemanları Makina Sanayi Tic. Ltd. Şti. olarak devam etmektedir. Endüstriyel vana ve akış kontrol çözümlerinde kalite, teknik bilgi ve müşteri odaklı hizmet anlayışımızla uzun vadeli iş ortaklıkları kuruyoruz.',
    kurumsal_urunler_basligi: 'Ana Ürün Gruplarımız',
    kurumsal_cozum_basligi: 'Projeye Özel Çözümler',
    kurumsal_cozum_aciklamasi: 'Özel vana ihtiyaçlarınız ve projeye özgü teknik talepleriniz için uzman mühendis kadromuzla birlikte çalışıyor, ihtiyacınıza uygun çözüm alternatifleri geliştiriyoruz.',
    kurumsal_cozum_buton_metni: 'Teknik ekibimizle iletişime geçin',
    kurumsal_cozum_buton_baglantisi: '/iletisim',
    kurumsal_ekip_basligi: 'Ekibimiz',
    kurumsal_ekip_aciklamasi: 'Doğru insanlarla, daha güçlü çözümler.',
    temsilcilik_hero_basligi: 'Temsilcilikler',
    temsilcilik_hero_aciklamasi: 'Dünya çapında kalite ve güvenilirliğiyle öne çıkan markalarla, endüstriyel tesisler için güvenilir çözüm ortaklıkları sunuyoruz.'
  },
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
        { id: 33, baslik: 'Otomasyon', baglanti: '/urunler/otomasyon', siralama: 3, alt_ogeler: [] }
      ]
    },
    { id: 8, baslik: 'Temsilcilikler', baglanti: '/temsilcilikler', siralama: 4, alt_ogeler: [] },
    { id: 4, baslik: 'Teknik', baglanti: '/teknik', siralama: 5, alt_ogeler: [] },
    { id: 5, baslik: 'Referanslar', baglanti: '/referanslar', siralama: 6, alt_ogeler: [] },
    { id: 6, baslik: 'Sertifikalar', baglanti: '/sertifikalar', siralama: 7, alt_ogeler: [] },
    { id: 7, baslik: 'İletişim', baglanti: '/iletisim', siralama: 8, alt_ogeler: [] }
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
    gorsel_yolu: `/assets/kategoriler/${kategori.slug}.webp`,
    alternatif_metin: `${kategori.ad} ürün grubu`
  })),
  fuarlar: [
    ['demirvana-fuar-5.jpg', 'Demirvana fuar standından ürün tanıtımı'],
    ['demirvana-fuar-6.jpg', 'Demirvana fuar alanında ziyaretçi buluşması'],
    ['demirvana-fuar-7.jpg', 'Demirvana fuar standı ve vana ürünleri'],
    ['demirvana-fuar-standi.jpg', 'Demirvana sektörel fuar katılımı']
  ].map(([dosya, alternatif_metin], indeks) => ({ id: indeks + 1, gorsel_yolu: `/assets/fuar/${dosya}`, alternatif_metin, siralama: indeks + 1 })),
  temsilcilikler: [
    ['Genebre', 'Endüstriyel Vanalar', 'Genebre', 'Genebre, 30 yılı aşkın süredir endüstriyel ve sıhhi tesisat sektöründe vanalar, musluklar ve engelliler için sıhhi çözümler sunar.', 'Valves & Fluid Control Solutions', '/assets/temsilcilikler/genebre.png'],
    ['Mei', 'Manometre & Enstrümantasyon', 'Mei (Manometría e instrumentación, S.L.)', 'Mei; manometre, termometre ve endüstriyel enstrümanların üreticisi ve ihracatçısıdır.', 'Measurement for a safer tomorrow', '/assets/temsilcilikler/mei.png'],
    ['Centork', 'Vana Aktüatörleri', 'Centork', 'Centork; vana aktüasyon çözümleri, otomasyon ve kontrol uygulamalarında uzmanlaşmıştır.', 'Actuation for a better tomorrow', '/assets/temsilcilikler/centork.svg']
  ].map(([marka_adi, urun_grubu, baslik, aciklama, logo_alt_metni, logo_yolu], indeks) => ({ id: indeks + 1, marka_adi, urun_grubu, baslik, aciklama, etiketler: ['Vana,Endüstriyel Armatür,Akış Kontrol', 'Enstrümantasyon,Manometre,Termometre', 'Aktüatör,Vana Otomasyonu,Kontrol'][indeks], logo_yolu, logo_alternatif_metin: `${marka_adi} logosu`, logo_alt_metni, urun_buton_metni: 'Marka ürünleri', urun_baglantisi: '/urunler', katalog_buton_metni: 'Katalog talep et', katalog_baglantisi: '/iletisim', siralama: indeks + 1 })),
  banka_hesaplari: [
    ['TRY', 'TR33 0011 1000 0000 0080 3936 11', null, '80393611'],
    ['USD', 'TR84 0011 1000 0000 0082 0144 36', 'FNNBTRISXXX', '8214436'],
    ['EUR', 'TR76 0011 1000 0000 0082 3613 55', 'FNNBTRISXXX', '8214436']
  ].map(([para_birimi, iban, swift_kodu, hesap_no], indeks) => ({ id: indeks + 1, banka_adi: 'QNB Finansbank', hesap_basligi: `QNB Finansbank ${para_birimi} Hesabı`, para_birimi, iban, swift_kodu, sube: 'İstanbul Enpara 03663', hesap_no, logo_yolu: '/assets/iletisim/qnb.png', siralama: indeks + 1 })),
  // API kullanılamadığında arama güvenli biçimde boş ürün listesiyle çalışmayı sürdürür.
  urunler: [],
  referanslar: {
    sektorler: referansSektorleri,
    kayitlar: referansKayitlari,
    // Aynı kaynak görseldeki üç saha fotoğrafı odak koordinatlarıyla ayrılır; admin yüklemeleri sonradan ayrı dosyalar olabilir.
    gorseller: [
      { id: 1, gorsel_yolu: '/assets/referanslar/referans-galerisi.png', alternatif_metin: 'Arıtma tesisinde kullanılan mavi vana sistemi', odak_x: 0, odak_y: 100, gorsel_olcegi: 330, siralama: 1 },
      { id: 2, gorsel_yolu: '/assets/referanslar/referans-galerisi.png', alternatif_metin: 'Arıtma havuzu üzerindeki vana uygulaması', odak_x: 50, odak_y: 100, gorsel_olcegi: 330, siralama: 2 },
      { id: 3, gorsel_yolu: '/assets/referanslar/referans-galerisi.png', alternatif_metin: 'Saha kontrol panosu ve boru hattı uygulaması', odak_x: 100, odak_y: 100, gorsel_olcegi: 330, siralama: 3 }
    ]
  },
  kurumsal: {
    degerler: [
      ['Şirket Profili', 'Endüstriyel vana ve akış kontrol sistemleri alanında faaliyet gösteren, güvenilir ve köklü bir çözüm ortağıyız.'],
      ['Felsefemiz', 'Müşteri odaklı, güvene dayalı ve uzun vadeli iş ortaklıkları kurarız.'],
      ['İlkemiz', 'Kalite bir tercih değil, çalışma biçimimizdir.'],
      ['Misyonumuz', 'Doğru çözüm, doğru ürün ve sürdürülebilir destekle müşterilerimizin ihtiyaçlarını en iyi şekilde karşılamak.'],
      ['Vizyonumuz', 'Endüstriyel akışkan kontrolü alanında tercih edilen, güvenilir ve kaliteli çözüm ortağı olmak.']
    ].map(([baslik, aciklama], indeks) => ({ id: indeks + 1, dil_kodu: 'tr', baslik, aciklama, siralama: indeks + 1 })),
    urun_gruplari: [
      ['Sürgülü Vana', 1], ['Çapraz Çekvalf', 1], ['Flanşlı Kelebek Vana', 1], ['Hidrolik Vana', 1], ['Wafer / Lug Kelebek Vana', 1],
      ['Tilting Çekvalf', 2], ['Glob Vana', 2], ['Yaylı Çekvalf', 2], ['Yangın Hidrantı', 2], ['Hava Tahliye Vanası / Vantuz', 2],
      ['Pislik Tutucu', 3], ['Çamur Kutusu', 3], ['Fırtına Vanası', 3]
    ].map(([ad, sutun_no], indeks) => ({ id: indeks + 1, dil_kodu: 'tr', ad, sutun_no, siralama: indeks + 1 })),
    ekip: [
      { id: 1, dil_kodu: 'tr', ad_soyad: 'Deniz Demir', gorev: 'Şirket Müdürü', eposta: 'dd@demirvana.com', telefon: null, siralama: 1 },
      { id: 2, dil_kodu: 'tr', ad_soyad: 'Murat Aslan', gorev: 'Muhasebe Sorumlusu', eposta: 'dv@demirvana.com', telefon: null, siralama: 2 }
    ]
  },
  sertifikalar: {
    kategoriler: [
      { id: 1, dil_kodu: 'tr', ad: 'ISO', slug: 'iso', siralama: 1 },
      { id: 2, dil_kodu: 'tr', ad: 'Resmi Belgeler', slug: 'resmi-belgeler', siralama: 2 },
      { id: 3, dil_kodu: 'tr', ad: 'Marka', slug: 'marka', siralama: 3 }
    ],
    // Örnek veri gerçek API ile aynı sözleşmeyi korur; dosyalar yalnız güvenli slug adresinden sunulur.
    kayitlar: [
      ['ISO 9001 ENG', 'iso-9001-eng', 'Kalite Yönetim Sistemi Sertifikası (İngilizce)', 1, 'ISO', 'iso', 'iso 9001 ENG.pdf', 954894],
      ['ISO 9001 TR', 'iso-9001-tr', 'Kalite Yönetim Sistemi Sertifikası', 1, 'ISO', 'iso', 'iso 9001.pdf', 909464],
      ['Marka Tescil Belgesi', 'marka-tescil-belgesi', 'Türk Patent ve Marka Kurumu tescil belgesi', 3, 'Marka', 'marka', 'marka tescil belgesi.pdf', 196214],
      ['Sanayi Sicil Belgesi', 'sanayi-sicil-belgesi', 'Sanayi ve Teknoloji Bakanlığı sanayi sicil belgesi', 2, 'Resmi Belgeler', 'resmi-belgeler', 'sanayi sicil belgesi.pdf', 194904]
    ].map(([baslik, slug, aciklama, kategori_id, kategori_adi, kategori_slug, orijinal_dosya_adi, dosya_boyutu], indeks) => ({
      id: indeks + 1, baslik, slug, aciklama, kategori_id, kategori_adi, kategori_slug,
      orijinal_dosya_adi, dosya_boyutu, dosya_adresi: `/sertifika-dosyalari/${slug}`,
      onizleme_yolu: `/assets/sertifikalar/${slug}.png`, alternatif_metin: `${baslik} önizlemesi`,
      sayfa_sayisi: 1, indirmeye_izin_var_mi: 1, yeni_sekmede_acmaya_izin_var_mi: 1, siralama: indeks + 1
    }))
  },
  teknik_dokumanlar: [
    {
      id: 1, dil_kodu: 'tr', ad: 'TEKNİK TABLOLAR', slug: 'teknik-tablolar',
      aciklama: 'Ürünlere ait teknik tablo ve değerleri inceleyin.', ikon_adi: 'dosya-hesaplama', siralama: 1,
      dokumanlar: [
        ['Basınç Sıcaklık Tablosu', 'basinc-sicaklik-tablosu'],
        ['Çeviri Tablosu', 'ceviri-tablosu'],
        ['DIN Standartı Flanş Çapları Tablosu', 'din-standarti-flans-caplari-tablosu'],
        ['Flanş Yüzeyi Tablosu', 'flans-yuzeyi-tablosu'],
        ['Inch-mm Çeviri Tablosu', 'inch-mm-ceviri-tablosu'],
        ['Malzemelerin Karşılaştırılması Tablosu', 'malzemelerin-karsilastirilmasi-tablosu'],
        ['Malzeme Özellikleri Tablosu', 'malzeme-ozellikleri-tablosu'],
        ['Sıcaklık Değer Tablosu', 'sicaklik-deger-tablosu']
      ].map(([baslik, slug], indeks) => ({ id: indeks + 1, baslik, slug, dosya_adresi: `/dokumanlar/${slug}`, orijinal_dosya_adi: 'ceviri_tablosu.pdf', alternatif_aciklama: `${baslik} teknik dokümanı`, dosya_boyutu: 297187, sayfa_sayisi: 1, indirmeye_izin_var_mi: 1, yeni_sekmede_acmaya_izin_var_mi: 1, siralama: indeks + 1 }))
    },
    {
      id: 2, dil_kodu: 'tr', ad: 'KULLANMA TALİMATLARI', slug: 'kullanma-talimatlari',
      aciklama: 'Vana ve ekipmanların kullanım talimatlarını inceleyin.', ikon_adi: 'kitap-acik', siralama: 2,
      dokumanlar: [
        ['Sürgülü Vana Kullanımı', 'surgulu-vana-kullanimi'],
        ['Çekvalf kullanımı', 'cekvalf-kullanimi'],
        ['Kelebek vana kullanımı', 'kelebek-vana-kullanimi'],
        ['Glob Vana kullanımı', 'glob-vana-kullanimi'],
        ['Küresel Gaz Vanası kullanımı', 'kuresel-gaz-vanasi-kullanimi'],
        ['Küresel Vana kullanımı', 'kuresel-vana-kullanimi'],
        ['Yangın Hidrantı kullanımı', 'yangin-hidranti-kullanimi'],
        ['Buhar Basınç Düşürücü kullanımı', 'buhar-basinc-dusurucu-kullanimi']
      ].map(([baslik, slug], indeks) => ({ id: indeks + 9, baslik, slug, dosya_adresi: `/dokumanlar/${slug}`, orijinal_dosya_adi: 'ceviri_tablosu.pdf', alternatif_aciklama: `${baslik} kılavuzu`, dosya_boyutu: 297187, sayfa_sayisi: 1, indirmeye_izin_var_mi: 1, yeni_sekmede_acmaya_izin_var_mi: 1, siralama: indeks + 1 }))
    }
  ]
});
