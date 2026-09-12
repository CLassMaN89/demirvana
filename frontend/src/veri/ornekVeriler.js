// Bu kayıtlar API çalışmadan arayüz geliştirebilmek içindir; üretimde aynı alanlar MySQL'den gelir.
// Slider yalnızca görsel gösterir; başlık/açıklama/buton metni kullanılmaz.
const SLIDER_GORSEL_SAYISI = 6;

const vanaMenuKategorileri = [
  ['Su Grubu Vanaları', 'su-grubu-vanalari'],
  ['Buhar Grubu Vanaları', 'buhar-grubu-vanalari'],
  ['Kontrol Vanaları', 'kontrol-vanalari'],
  ['Hidrolik Vanalar', 'hidrolik-vanalar'],
  ['Basınç Düşürücü Vanalar', 'basinc-dusurucu-vanalar'],
  ['Yangın Vanaları', 'yangin-vanalari'],
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
  ['Pnömatik Aktüatör', 'pnomatik-aktuator'],
  ['Elektrik Aktüatörler', 'elektrik-aktuatorler'],
  ['Aktüatörlü Vanalar', 'aktuatorlu-vanalar'],
  ['Aksesuarlar', 'aksesuarlar']
].map(([baslik, slug], indeks) => ({
  id: 330 + indeks,
  baslik,
  baglanti: `/urunler/${slug}`,
  siralama: indeks + 1,
  alt_ogeler: []
}));

const otomasyonMenuKategorileri = [
  ['Debi (Akış)', 'debi-akis'],
  ['Basınç', 'basinc'],
  ['Seviye', 'seviye'],
  ['Sıcaklık', 'sicaklik'],
  ['Proses Kontrol', 'proses-kontrol']
].map(([baslik, slug], indeks) => ({
  id: 350 + indeks,
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
    iletisim_form_slogani: 'Sanayide güvenilir çözüm ortağınız',
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
    footer_teknik_cizim_yolu: '/assets/footer-vana2.png',
    footer_teknik_cizim_ikincil_yolu: '/assets/footer-vana.png',
    footer_teknik_cizim_detay_yolu: '/assets/footer-vana3.png',
    footer_ikon_dizini: '/assets/footer-icons',
    footer_calisma_saatleri: 'Pzt - Cum 08:00 - 18:00',
    footer_sosyal_basligi: 'Bizi takip edin',
    footer_linkedin_baglantisi: 'https://www.linkedin.com',
    footer_youtube_baglantisi: 'https://www.youtube.com',
    footer_instagram_baglantisi: 'https://www.instagram.com',
    footer_slogan_metni: 'Endüstrinin her noktasında, daha güvenli bir akış için.',
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
    teknik_pdf_ikon_yolu: '/assets/ikonlar/pdf-ikonu-karti.png',
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
        { id: 33, baslik: 'Otomasyon', baglanti: '/urunler/otomasyon', siralama: 3, alt_ogeler: otomasyonMenuKategorileri }
      ]
    },
    { id: 8, baslik: 'Temsilcilikler', baglanti: '/temsilcilikler', siralama: 4, alt_ogeler: [] },
    { id: 4, baslik: 'Teknik', baglanti: '/teknik', siralama: 5, alt_ogeler: [] },
    { id: 5, baslik: 'Referanslar', baglanti: '/referanslar', siralama: 6, alt_ogeler: [] },
    { id: 6, baslik: 'Sertifikalar', baglanti: '/sertifikalar', siralama: 7, alt_ogeler: [] },
    { id: 7, baslik: 'İletişim', baglanti: '/iletisim', siralama: 8, alt_ogeler: [] }
  ],
  sliderlar: Array.from({ length: SLIDER_GORSEL_SAYISI }, (_, indeks) => ({
    id: indeks + 1,
    baslik: '',
    aciklama: null,
    gorsel_yolu: `/assets/carousel/${indeks + 1}.png`,
    alternatif_metin: `Demirvana endüstriyel vana çözümü ${indeks + 1}`,
    buton_metni: null,
    buton_baglantisi: null,
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
  // Örnek ürün, API kapalıyken de gerçek teknik çizim ve yerel dokümanla aynı detay deneyimini korur.
  urunler: [{
    id: 1,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Metal Sitli Sürgülü Vana F4 D-001',
    slug: 'metal-sitli-surgulu-vana-f4-d-001',
    stok_kodu: 'D-001',
    kisa_aciklama: 'Endüstriyel akışkan kontrolünde yüksek dayanım ve güvenilir performans.',
    teknik_bilgiler: JSON.stringify({"grup_adi":"Sürgülü Vanalar","basinc":"PN 10 / 6 / 4 / 2,5 / 1,6 / 1","katalog_bilgileri":{"dn":"DN 40 - 900","standart":"TS 457/1 · DIN 3352/2-F4","basinc":"PN 10 / PN 6","gorsel_yolu":"/assets/urunler/genel/metal-sitli-surgulu-vana-f4-d-001.jpg"},"urun_tanimi":{"baslik":"METAL SİTLİ SÜRGÜLÜ VANA","satirlar":["O-RİNG SİSTEMİ","PN10 / PN6","TS 457/1","DIN 3352/2-F4 (DIN 3216)"]},"teknik_cizim_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/teknik-cizim.png","teknik_cizim_alt":"Metal sitli sürgülü vana teknik çizimi – F4 D-001","parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58 / Bronze / S.S."},{"no":"3","ad":"Sürgü (DN40–100)","malzeme":"Ms 58 / Bronze / S.S."},{"no":"3","ad":"Sürgü (DN125–900)","malzeme":"GG 25 / GGG-40"},{"no":"4","ad":"Sürgü Burcu","malzeme":"Ms 58 / Bronze / S.S."},{"no":"5","ad":"Sürgü Somunu","malzeme":"Ms 58 / Bronze / GGG-40"},{"no":"6","ad":"Mil","malzeme":"Ms 58 / Bronze / S.S."},{"no":"7","ad":"Conta","malzeme":"NBR / FKM (Viton) / Klingerit"},{"no":"8","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"9","ad":"Civata","malzeme":"St 37 / S.S."},{"no":"10","ad":"Mil Somunu","malzeme":"Mr 58 / Bronze / S.S."},{"no":"11","ad":"O-Ring","malzeme":"EPDM"},{"no":"12","ad":"Volan","malzeme":"GG 20"}],"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600","700","800","900"],"anma_basinci_gruplari":[{"deger":"10","sutun":8},{"deger":"6","sutun":3},{"deger":"4","sutun":2},{"deger":"2,5","sutun":2},{"deger":"1,6","sutun":1},{"deger":"1","sutun":1}],"olculer":[{"grup":"Vana Boyutları\nTS 457 /1\nDIN / 3352 / 24","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390","430","470","510"]},{"grup":"","kod":"H","degerler":["157","190","210","230","260","365","375","500","630","715","820","910","1135","1300","1480","1690","1820"]},{"grup":"","kod":"D1","degerler":[],"gruplu_degerler":[{"deger":"160","sutun":4},{"deger":"200","sutun":1},{"deger":"250","sutun":3},{"deger":"315","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2},{"deger":"630","sutun":1},{"deger":"800","sutun":2}]},{"grup":"Flanş Ölçüleri\nDIN 2501 / TS 810\nPN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","295","445","505","565","670","780","895","1015","1115"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","725","480","950","1050"]},{"grup":"Ağırlık","kod":"kg","degerler":["8,3","10,2","13,7","15,5","22,1","37","44,2","81","123","176","225","290","460","680","870","1200","1400"]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Metal Sitli Sürgülü Vana F4 D-001 fiyat listesi","tur":"XLSX · 12 KB","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF · 533 KB","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001.pdf"}]})
  },   {
    id: 6,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Akış Göstergesi D-149',
    slug: 'akis-gostergesi-d-149',
    stok_kodu: 'D-149',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/akis-gostergesi-d-149.jpg"}})
  },
  {
    id: 7,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Ani Kapama Vanası Düz Tip D-155',
    slug: 'ani-kapama-vanasi-duz-tip-d-155',
    stok_kodu: 'D-155',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ani-kapama-vanasi-duz-tip-d-155.jpg"}})
  },
  {
    id: 8,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Ani Kapama Vanası Köşe Tip D-119',
    slug: 'ani-kapama-vanasi-kose-tip-d-119',
    stok_kodu: 'D-119',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ani-kapama-vanasi-kose-tip-d-119.jpg"}})
  },
  {
    id: 9,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Çamur Sandığı Düz Tip D-157',
    slug: 'camur-sandigi-duz-tip-d-157',
    stok_kodu: 'D-157',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/camur-sandigi-duz-tip-d-157.jpg"}})
  },
  {
    id: 10,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Çamur Sandığı Köşe Tip D-205',
    slug: 'camur-sandigi-kose-tip-d-205',
    stok_kodu: 'D-205',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/camur-sandigi-kose-tip-d-205.jpg"}})
  },
  {
    id: 11,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Vana Sandığı D-160',
    slug: 'vana-sandigi-d-160',
    stok_kodu: 'D-160',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/vana-sandigi-d-160.jpg"}})
  },
  {
    id: 12,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Köşe Drenaj Vanası D-206',
    slug: 'kose-drenaj-vanasi-d-206',
    stok_kodu: 'D-206',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kose-drenaj-vanasi-d-206.jpg"}})
  },
  {
    id: 13,
    kategori_id: 6,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Suction Pislik Tutucu D-207',
    slug: 'suction-pislik-tutucu-d-207',
    stok_kodu: 'D-207',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/suction-pislik-tutucu-d-207.jpg"}})
  },
  {
    id: 14,
    kategori_id: 5,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Bronz Glob Vana Düz - Köşe D-208',
    slug: 'bronz-glob-vana-duz-kose-d-208',
    stok_kodu: 'D-208',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bronz-glob-vana-duz-kose-d-208.jpg"}})
  },
  {
    id: 15,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Bronz Yangın Vanası Düz - Köşe D-209',
    slug: 'bronz-yangin-vanasi-duz-kose-d-209',
    stok_kodu: 'D-209',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bronz-yangin-vanasi-duz-kose-d-209.jpg"}})
  },
  {
    id: 16,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Dışşarj Vanası Yaylı Tip Düz - Köşe D-084',
    slug: 'dissarj-vanasi-yayli-tip-duz-kose-d-084',
    stok_kodu: 'D-084',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/dissarj-vanasi-yayli-tip-duz-kose-d-084.jpg"}})
  },
  {
    id: 17,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'İskandil Vanası D-086',
    slug: '129-iskandil-vanasi-d-086',
    stok_kodu: 'D-086',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/129-iskandil-vanasi-d-086.jpg"}})
  },
  {
    id: 18,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Hidrolik Kol D-087',
    slug: 'hidrolik-kol-d-087',
    stok_kodu: 'D-087',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hidrolik-kol-d-087.jpg"}})
  },
  {
    id: 19,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Self Closing Vana D-223',
    slug: 'self-closing-vana-d-223',
    stok_kodu: 'D-223',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/self-closing-vana-d-223.jpg"}})
  },
  {
    id: 20,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Fırtına Vanası Düz Tip D-156',
    slug: 'firtina-vanasi-duz-tip-d-156',
    stok_kodu: 'D-156',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/firtina-vanasi-duz-tip-d-156.jpg"}})
  },
  {
    id: 21,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Fırtına Vanası Köşe Tip D-224',
    slug: 'firtina-vanasi-kose-tip-d-224',
    stok_kodu: 'D-224',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/firtina-vanasi-kose-tip-d-224.jpg"}})
  },
  {
    id: 22,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Metal Sitli Sürgülü Vana F5 D-003',
    slug: 'metal-sitli-surgulu-vana-f5-d-003',
    stok_kodu: 'D-003',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-sitli-surgulu-vana-f5-d-003.jpg"}})
  },
  {
    id: 23,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Elastomer Sitli Sürgülü Vana F4 D-010',
    slug: 'elastomer-sitli-surgulu-vana-f4-d-010',
    stok_kodu: 'D-010',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elastomer-sitli-surgulu-vana-f4-d-010.jpg"}})
  },
  {
    id: 24,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Elastomer Sitli Sürgülü Vana F5 D-385',
    slug: 'elastomer-sitli-surgulu-vana-f5-d-385',
    stok_kodu: 'D-385',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elastomer-sitli-surgulu-vana-f5-d-385.jpg"}})
  },
  {
    id: 25,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Yükselen Milli Sürgülü Vana F4,F5 D-008',
    slug: 'yukselen-milli-surgulu-vana-f4-f5-d-008',
    stok_kodu: 'D-008',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yukselen-milli-surgulu-vana-f4-f5-d-008.jpg"}})
  },
  {
    id: 26,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Bıçak Sürgülü Vana D-012 (Bıçaklı Vana)',
    slug: 'bicak-surgulu-vana-d-012-bicakli-vana',
    stok_kodu: 'D-012',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bicak-surgulu-vana-d-012-bicakli-vana.jpg"}})
  },
  {
    id: 27,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Flanşlı Kelebek Vana D-113',
    slug: 'flansli-kelebek-vana-d-113',
    stok_kodu: 'D-113',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flansli-kelebek-vana-d-113.jpg"}})
  },
  {
    id: 28,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Lug Kelebek Vana D-036',
    slug: 'lug-kelebek-vana-d-036',
    stok_kodu: 'D-036',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/lug-kelebek-vana-d-036.jpg"}})
  },
  {
    id: 29,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Wafer Kelebek Vana D-032',
    slug: 'wafer-kelebek-vana-d-032',
    stok_kodu: 'D-032',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/wafer-kelebek-vana-d-032.jpg"}})
  },
  {
    id: 30,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Şamandıralı Vana D-302',
    slug: 'samandirali-vana-d-302',
    stok_kodu: 'D-302',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/samandirali-vana-d-302.jpg"}})
  },
  {
    id: 31,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Diyafram Vana D-085',
    slug: 'diyafram-vana-d-085',
    stok_kodu: 'D-085',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/diyafram-vana-d-085.jpg"}})
  },
  {
    id: 32,
    kategori_id: 6,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Krepin D-046',
    slug: 'krepin-d-046',
    stok_kodu: 'D-046',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/krepin-d-046.jpg"}})
  },
  {
    id: 33,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: '3 Yollu Vana D-324',
    slug: '3-yollu-vana-d-324',
    stok_kodu: 'D-324',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-yollu-vana-d-324.jpg"}})
  },
  {
    id: 34,
    kategori_id: 6,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Pislik Tutucu D-041',
    slug: 'pislik-tutucu-d-041',
    stok_kodu: 'D-041',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pislik-tutucu-d-041.jpg"}})
  },
  {
    id: 35,
    kategori_id: 1,
    kategori_adi: 'Su Grubu Vanaları',
    ad: '3 Parçalı Tam Geçişli Küresel D-056',
    slug: '3-parcali-tam-gecisli-kuresel-d-056',
    stok_kodu: 'D-056',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-tam-gecisli-kuresel-d-056.jpg"}})
  },
  {
    id: 36,
    kategori_id: 1,
    kategori_adi: 'Su Grubu Vanaları',
    ad: '2 Parçalı Tam Geçişli Küresel D-061',
    slug: '2-parcali-tam-gecisli-kuresel-d-061',
    stok_kodu: 'D-061',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/2-parcali-tam-gecisli-kuresel-d-061.jpg"}})
  },
  {
    id: 37,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Çalpara Çekvalf Flanşlı D-026',
    slug: 'calpara-cekvalf-flansli-d-026',
    stok_kodu: 'D-026',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/calpara-cekvalf-flansli-d-026.jpg"}})
  },
  {
    id: 38,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Çift Klapeli Çekvalf D-020',
    slug: 'cift-klapeli-cekvalf-d-020',
    stok_kodu: 'D-020',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-klapeli-cekvalf-d-020.jpg"}})
  },
  {
    id: 39,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Toplu Çekvalf D-030',
    slug: 'toplu-cekvalf-d-030',
    stok_kodu: 'D-030',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/toplu-cekvalf-d-030.jpg"}})
  },
  {
    id: 40,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Dik Çekvalf D-031',
    slug: 'dik-cekvalf-d-031',
    stok_kodu: 'D-031',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/dik-cekvalf-d-031.jpg"}})
  },
  {
    id: 41,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Tilting Çekvalf D-128',
    slug: 'tilting-cekvalf-d-128',
    stok_kodu: 'D-128',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/tilting-cekvalf-d-128.jpg"}})
  },
  {
    id: 42,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Hidrolik Frenli Tilting Çekvalf D-131',
    slug: 'hidrolik-frenli-tilting-cekvalf-d-131',
    stok_kodu: 'D-131',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hidrolik-frenli-tilting-cekvalf-d-131.jpg"}})
  },
  {
    id: 43,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Hidrolik Pompalı Çek Kelebek Vana D-133',
    slug: 'hidrolik-pompali-cek-kelebek-vana-d-133',
    stok_kodu: 'D-133',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hidrolik-pompali-cek-kelebek-vana-d-133.jpg"}})
  },
  {
    id: 44,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Class 150-300-600 Sürgülü Vana D-240',
    slug: 'class-150-300-600-surgulu-vana-d-240',
    stok_kodu: 'D-240',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/class-150-300-600-surgulu-vana-d-240.jpg"}})
  },
  {
    id: 45,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Yaylı Dip Klapesi D-045',
    slug: 'yayli-dip-klapesi-d-045',
    stok_kodu: 'D-045',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yayli-dip-klapesi-d-045.jpg"}})
  },
  {
    id: 46,
    kategori_id: 1,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Mono Blok Küresel Vana D-064',
    slug: 'mono-blok-kuresel-vana-d-064',
    stok_kodu: 'D-064',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/mono-blok-kuresel-vana-d-064.jpg"}})
  },
  {
    id: 47,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Tek Küreli Vantuz D-123',
    slug: 'tek-kureli-vantuz-d-123',
    stok_kodu: 'D-123',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/tek-kureli-vantuz-d-123.jpg"}})
  },
  {
    id: 48,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Çift Küreli Vantuz D-124',
    slug: 'cift-kureli-vantuz-d-124',
    stok_kodu: 'D-124',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-kureli-vantuz-d-124.jpg"}})
  },
  {
    id: 49,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Class 150-300-600 Çalpara Çekvalf D-245',
    slug: 'class-150-300-600-calpara-cekvalf-d-245',
    stok_kodu: 'D-245',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/class-150-300-600-calpara-cekvalf-d-245.jpg"}})
  },
  {
    id: 50,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Seviye Göstergeli İndikatörlü Sürgülü Vana (Trafo Vanası) D-323',
    slug: 'seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323',
    stok_kodu: 'D-323',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323.jpg"}})
  },
  {
    id: 51,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'FlapVana-Klapet-Kurbağalık D-388',
    slug: 'flapvana-klapet-kurbagalik-d-388',
    stok_kodu: 'D-388',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flapvana-klapet-kurbagalik-d-388.jpg"}})
  },
  {
    id: 52,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Karesel Sürgülü Vana D-011',
    slug: 'karesel-surgulu-vana-d-011',
    stok_kodu: 'D-011',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/karesel-surgulu-vana-d-011.jpg"}})
  },
  {
    id: 53,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Darbesiz Vantuz D-304',
    slug: 'darbesiz-vantuz-d-304',
    stok_kodu: 'D-304',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/darbesiz-vantuz-d-304.jpg"}})
  },
  {
    id: 54,
    kategori_id: 5,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Glob Vana D-069',
    slug: 'glob-vana-d-069',
    stok_kodu: 'D-069',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"dn":"DN 15 - 600","standart":"Civatalı Kapaklı DIN Glob Vana","basinc":"PN 16 / 25 / 40 / 63 / 100 / 160","gorsel_yolu":"/assets/urunler/genel/glob-vana-d-069.jpg"},"urun_tanimi":{"baslik":"GLOB VANA","satirlar":["CİVATALI KAPAKLI GÖVDE","PN 16 / 25 / 40 / 63 / 100 / 160","FLANŞLI VEYA KAYNAK AĞIZLI BAĞLANTI","DÖKME DEMİR VEYA DÖKME ÇELİK GÖVDE"]},"basinc":"PN 16 / 25 / 40 / 63 / 100 / 160","teknik_cizim_yolu":"/assets/urunler/glob-vana-d-069/teknik-cizim.png","teknik_cizim_alt":"Glob vana teknik çizimi – D-069","parcalar":[{"no":"1","ad":"Gövde","malzeme":"EN-GJ 250"},{"no":"2","ad":"Kapak","malzeme":"EN-GJ 250"},{"no":"3","ad":"Oturma Yüzeyi","malzeme":"X20Cr13"},{"no":"4","ad":"Disk Oturma Yüzeyi","malzeme":"X20Cr13"},{"no":"5","ad":"Mil","malzeme":"X20Cr13"},{"no":"6","ad":"Arka Oturma (Bütünleşik)","malzeme":"EN-GJ 250"},{"no":"7","ad":"Salmastra Yatağı","malzeme":"1.0460"},{"no":"8","ad":"Boyunduruk Burcu","malzeme":"N/A"},{"no":"9","ad":"Volan","malzeme":"Çelik"},{"no":"10","ad":"Plaka","malzeme":"1.0460"},{"no":"11","ad":"Volan Somunu","malzeme":"1.0460"},{"no":"12","ad":"Civata","malzeme":"CK35"},{"no":"13","ad":"Somun","malzeme":"C35"},{"no":"14","ad":"Halka Civata","malzeme":"CK35"},{"no":"15","ad":"Somun","malzeme":"C35"},{"no":"16","ad":"Halka Civata Pimi","malzeme":"CK35"},{"no":"17","ad":"Conta","malzeme":"Paslanmaz Takviyeli Grafit"},{"no":"18","ad":"Salmastra","malzeme":"Grafit Halka & Sıyırıcı Halka"}],"olcu_tablolari":[{"baslik":"FIG. 1401 – Civatalı Kapaklı Glob Vana DIN PN 16 – Dökme Demir – F1","basincGruplari":[{"deger":"16","sutun":20}],"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"Vana Boyutları","kod":"L RF","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","960","1100","1200","1250","1450"]},{"grup":"","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","315","340","405","460","520","580","640","715","840"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["160","165","190","200","225","260","280","320","375","415","460","550","570","750","900","1040","1290","1400","1600",""]},{"grup":"","kod":"H1","degerler":["164","170","197","208","235","273","297","340","400","447","498","594","620","813","975","1128","1390","1513","1725",""]}]},{"baslik":"FIG. 1430 – Civatalı Kapaklı Glob Vana DIN PN 25/40 – F1","basincGruplari":[{"deger":"25 / 40","sutun":20}],"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"Vana Boyutları","kod":"L RF / BW","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","960","1100","1200","1250","1450"]},{"grup":"","kod":"D – PN25","degerler":["95","105","115","140","150","165","185","200","235","270","300","330","350","425","485","555","620","670","730","845"]},{"grup":"","kod":"D – PN40","degerler":["95","105","115","140","150","165","185","200","235","270","300","350","375","450","515","580","660","685","755","890"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["160","165","190","200","225","260","280","320","375","415","460","550","570","750","900","1040","1290","1400","1600",""]},{"grup":"","kod":"H1","degerler":["164","170","197","208","235","273","297","340","400","447","498","594","620","813","975","1128","1390","1513","1725",""]}]},{"baslik":"FIG. 1560 – Civatalı Kapaklı Glob Vana DIN PN 63 – F2","basincGruplari":[{"deger":"63","sutun":19}],"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","500","600"],"olculer":[{"grup":"Vana Boyutları","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900","1025","1150","1400","1600"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","180","205","215","250","295","345","375","415","470","530","600","670","800","930"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700","800","800","1000","1200"]},{"grup":"","kod":"H","degerler":["250","310","310","330","350","380","410","480","490","550","610","700","750","800","900","","","",""]},{"grup":"","kod":"H1","degerler":["254","315","317","338","360","393","427","480","515","582","648","744","800","863","1005","","","",""]}]},{"baslik":"FIG. 1570 – Civatalı Kapaklı Glob Vana DIN PN 100 – F2","basincGruplari":[{"deger":"100","sutun":15}],"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300"],"olculer":[{"grup":"Vana Boyutları","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","195","220","230","265","315","355","385","430","505","585"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700"]},{"grup":"","kod":"H","degerler":["250","310","310","330","350","400","480","510","583","600","630","720","780","830","970"]},{"grup":"","kod":"H1","degerler":["254","315","317","338","363","413","497","530","605","632","668","764","833","893","1045"]}]},{"baslik":"FIG. 1580 – Civatalı Kapaklı Glob Vana DIN PN 160 – F2","basincGruplari":[{"deger":"160","sutun":15}],"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300"],"olculer":[{"grup":"Vana Boyutları","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900"]},{"grup":"","kod":"D – PN25","degerler":["105","130","140","155","170","195","220","230","265","315","355","390","430","515","585"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","250","300","400","500","500","600","700","700","700"]},{"grup":"","kod":"H","degerler":["250","310","310","355","355","400","","","","","","","","",""]},{"grup":"","kod":"H1","degerler":["254","315","317","363","365","413","","","","","","","","",""]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/glob-vana-d-069/Glob Vana D-069.pdf"},{"baslik":"Birim Fiyat Excel","aciklama":"Glob Vana D-069 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/glob-vana-d-069/Glob Vana D-069 Birim Fiyat.xlsx","belge_turu":"excel"}]})
  },
  {
    id: 55,
    kategori_id: 4,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Glob Vana - Kumandalı Çekvalf Köşe Tip D-072',
    slug: 'glob-vana-kumandali-cekvalf-kose-tip-d-072',
    stok_kodu: 'D-072',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/glob-vana-kumandali-cekvalf-kose-tip-d-072.jpg"}})
  },
  {
    id: 56,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Buhar Basınç Düşürücü D-066',
    slug: 'buhar-basinc-dusurucu-d-066',
    stok_kodu: 'D-066',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/buhar-basinc-dusurucu-d-066.jpg"}})
  },
  {
    id: 57,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnomatik Glob Tipi Kontrol Vanası D-067',
    slug: 'pnomatik-glob-tipi-kontrol-vanasi-d-067',
    stok_kodu: 'D-067',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-glob-tipi-kontrol-vanasi-d-067.jpg"}})
  },
  {
    id: 58,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Pistonlu Vana D-076',
    slug: 'pistonlu-vana-d-076',
    stok_kodu: 'D-076',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pistonlu-vana-d-076.jpg"}})
  },
  {
    id: 59,
    kategori_id: 5,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Metal Körüklü Glob Vana D-073',
    slug: 'metal-koruklu-glob-vana-d-073',
    stok_kodu: 'D-073',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-koruklu-glob-vana-d-073.jpg"}})
  },
  {
    id: 60,
    kategori_id: 4,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Yaylı Çekvalf D-078',
    slug: 'yayli-cekvalf-d-078',
    stok_kodu: 'D-078',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yayli-cekvalf-d-078.jpg"}})
  },
  {
    id: 61,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Yaylı Emniyet Ventili Oransal Kalkışlı D-081',
    slug: 'yayli-emniyet-ventili-oransal-kalkisli-d-081',
    stok_kodu: 'D-081',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yayli-emniyet-ventili-oransal-kalkisli-d-081.jpg"}})
  },
  {
    id: 62,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Lift Loaded Safety Valve D-082',
    slug: 'lift-loaded-safety-valve-d-082',
    stok_kodu: 'D-082',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/lift-loaded-safety-valve-d-082.jpg"}})
  },
  {
    id: 63,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Emniyet Ventili Su, Amonyak, Azot',
    slug: 'emniyet-ventili-su-amonyak-azot',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/emniyet-ventili-su-amonyak-azot.jpg"}})
  },
  {
    id: 64,
    kategori_id: 4,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Ters Kovalı Kondenstop D-092',
    slug: 'ters-kovali-kondenstop-d-092',
    stok_kodu: 'D-092',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ters-kovali-kondenstop-d-092.jpg"}})
  },
  {
    id: 65,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Termostatik Vana D-068',
    slug: 'termostatik-vana-d-068',
    stok_kodu: 'D-068',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/termostatik-vana-d-068.jpg"}})
  },
  {
    id: 66,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Pnömatik Kızgın Yağ Vanası D-141',
    slug: 'pnomatik-kizgin-yag-vanasi-d-141',
    stok_kodu: 'D-141',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-kizgin-yag-vanasi-d-141.jpg"}})
  },
  {
    id: 67,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Kazan Blöf Vanası D-093',
    slug: 'kazan-blof-vanasi-d-093',
    stok_kodu: 'D-093',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kazan-blof-vanasi-d-093.jpg"}})
  },
  {
    id: 68,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Akış Göstergesi ( Gözetleme Camları )',
    slug: 'akis-gostergesi-gozetleme-camlari',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/akis-gostergesi-gozetleme-camlari.jpg"}})
  },
  {
    id: 69,
    kategori_id: 3,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Diyafram Vana D-325',
    slug: 'pnomatik-diyafram-vana-d-325',
    stok_kodu: 'D-325',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-diyafram-vana-d-325.jpg"}})
  },
  {
    id: 70,
    kategori_id: 5,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Tek Yataklı) On-Off - Oransal D-067',
    slug: 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067.jpg"}})
  },
  {
    id: 71,
    kategori_id: 5,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Çift Yataklı) On-Off - Oransal D-067',
    slug: 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067.jpg"}})
  },
  {
    id: 72,
    kategori_id: 5,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Glob Tip 3 Yollu Kontrol Vanası On-Off Oransal D-225',
    slug: 'pnomatik-glob-tip-3-yollu-kontrol-vanasi-on-off-oransal-d-225',
    stok_kodu: 'D-225',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-glob-tip-3-yollu-kontrol-vanasi-on-off-oransal-d-225.jpg"}})
  },
  {
    id: 73,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Buhar Basınç Düşürücü Kontrol Vanası D-066',
    slug: 'buhar-basinc-dusurucu-kontrol-vanasi-d-066',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/buhar-basinc-dusurucu-kontrol-vanasi-d-066.jpg"}})
  },
  {
    id: 74,
    kategori_id: 3,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Termostatik Vana D-068',
    slug: '58-termostatik-vana-d-068',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/58-termostatik-vana-d-068.jpg"}})
  },
  {
    id: 75,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Diyafram Aktüatörlü Kontrol Vanası D-227',
    slug: 'diyafram-aktuatorlu-kontrol-vanasi-d-227',
    stok_kodu: 'D-227',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/diyafram-aktuatorlu-kontrol-vanasi-d-227.jpg"}})
  },
  {
    id: 76,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Piston Aktüatörlü Kontrol Vanası D-228',
    slug: 'piston-aktuatorlu-kontrol-vanasi-d-228',
    stok_kodu: 'D-228',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/piston-aktuatorlu-kontrol-vanasi-d-228.jpg"}})
  },
  {
    id: 77,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik On-Off 2 Yollu Pistonlu Kontrol Vanası D-229',
    slug: 'pnomatik-on-off-2-yollu-pistonlu-kontrol-vanasi-d-229',
    stok_kodu: 'D-229',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-on-off-2-yollu-pistonlu-kontrol-vanasi-d-229.jpg"}})
  },
  {
    id: 78,
    kategori_id: 3,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Kızgın Yağ Vanası D-141',
    slug: '62-pnomatik-kizgin-yag-vanasi-d-141',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/62-pnomatik-kizgin-yag-vanasi-d-141.jpg"}})
  },
  {
    id: 79,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Basınç Ayar Vanası D-226',
    slug: 'basinc-ayar-vanasi-d-226',
    stok_kodu: 'D-226',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/basinc-ayar-vanasi-d-226.jpg"}})
  },
  {
    id: 80,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pinch Vana D-320',
    slug: 'pinch-vana-d-320',
    stok_kodu: 'D-320',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pinch-vana-d-320.jpg"}})
  },
  {
    id: 81,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Pinch (Çimdik) Vana D-321',
    slug: 'pnomatik-pinch-cimdik-vana-d-321',
    stok_kodu: 'D-321',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-pinch-cimdik-vana-d-321.jpg"}})
  },
  {
    id: 82,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Su Basınç Düşürücü Vana - Pilot Tip D-143',
    slug: 'su-basinc-dusurucu-vana-pilot-tip-d-143',
    stok_kodu: 'D-143',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-basinc-dusurucu-vana-pilot-tip-d-143.jpg"}})
  },
  {
    id: 83,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Düz Tip Su Basıç Düşürücü Vana D-143',
    slug: 'duz-tip-su-basic-dusurucu-vana-d-143',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/duz-tip-su-basic-dusurucu-vana-d-143.jpg"}})
  },
  {
    id: 84,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Basınç Sabitleme Vanası D-143',
    slug: 'basinc-sabitleme-vanasi-d-143',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/basinc-sabitleme-vanasi-d-143.jpg"}})
  },
  {
    id: 85,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Su Darbesi Önleme Vanası D-144',
    slug: 'su-darbesi-onleme-vanasi-d-144',
    stok_kodu: 'D-144',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-darbesi-onleme-vanasi-d-144.jpg"}})
  },
  {
    id: 86,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Köşe Tip Mekanik Şamandralı Vana D-302',
    slug: 'surge-anticipating-control-valve-d-144',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/surge-anticipating-control-valve-d-144.jpg"}})
  },
  {
    id: 87,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Seviye Kontrol Vanası D-145',
    slug: 'seviye-kontrol-vanasi-d-145',
    stok_kodu: 'D-145',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/seviye-kontrol-vanasi-d-145.jpg"}})
  },
  {
    id: 88,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Solenoid Kontrol Vanası D-147',
    slug: 'solenoid-kontrol-vanasi-d-147',
    stok_kodu: 'D-147',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/solenoid-kontrol-vanasi-d-147.jpg"}})
  },
  {
    id: 89,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Debi Ayar Vanası D-148',
    slug: 'debi-ayar-vanasi-d-148',
    stok_kodu: 'D-148',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/debi-ayar-vanasi-d-148.jpg"}})
  },
  {
    id: 90,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Basınç Tahliye Vanası D-378',
    slug: 'basinc-tahliye-vanasi-d-378',
    stok_kodu: 'D-378',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/basinc-tahliye-vanasi-d-378.jpg"}})
  },
  {
    id: 91,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Elektrik Flatörlü Seviye Kontrol Vanası',
    slug: 'elektrik-flatorlu-seviye-kontrol-vanasi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-flatorlu-seviye-kontrol-vanasi.jpg"}})
  },
  {
    id: 92,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Hidrolik On-Off Kontrol Vanası D-552',
    slug: 'hidrolik-on-off-kontrol-vanasi-d-552',
    stok_kodu: 'D-552',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hidrolik-on-off-kontrol-vanasi-d-552.jpg"}})
  },
  {
    id: 93,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Pompa Kontrol Vanası D - 598',
    slug: 'pompa-kontrol-vanasi-d-598',
    stok_kodu: 'D-598',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pompa-kontrol-vanasi-d-598.jpg"}})
  },
  {
    id: 94,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Düz Tip Şamandralı Vana',
    slug: 'duz-tip-samandrali-vana',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/duz-tip-samandrali-vana.jpg"}})
  },
  {
    id: 95,
    kategori_id: 7,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Buhar Basınç Düşürücü Kontrol Vanası D-066',
    slug: '79-buhar-basinc-dusurucu-kontrol-vanasi-d-066',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/79-buhar-basinc-dusurucu-kontrol-vanasi-d-066.jpg"}})
  },
  {
    id: 96,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su Basınç Düşürücü Vana Y Tipi Çift Diyaframlı D-143',
    slug: 'su-basinc-dusurucu-vana-y-tipi-cift-diyaframli-d-143',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-basinc-dusurucu-vana-y-tipi-cift-diyaframli-d-143.jpg"}})
  },
  {
    id: 97,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su Basınç Düşürücü Vana Y Tipi Tek Diyaframlı D-143',
    slug: 'su-basinc-dusurucu-vana-y-tipi-tek-diyaframli-d-143',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-basinc-dusurucu-vana-y-tipi-tek-diyaframli-d-143.jpg"}})
  },
  {
    id: 98,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su Basınç Düşürücü Vana Düz Tip D-143',
    slug: 'su-basinc-dusurucu-vana-duz-tip-d-143',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false})
  },
  {
    id: 99,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su Basınç Düşürücü Vana Endustriyel Tip D-146',
    slug: 'su-basinc-dusurucu-vana-endustriyel-tip-d-146',
    stok_kodu: 'D-146',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-basinc-dusurucu-vana-endustriyel-tip-d-146.jpg"}})
  },
  {
    id: 100,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su,Gaz, Amonyak için Basınç Düşürücü - Regülatörü',
    slug: 'su-gaz-amonyak-icin-basinc-dusurucu-regulatoru',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-gaz-amonyak-icin-basinc-dusurucu-regulatoru.jpg"}})
  },
  {
    id: 101,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su Pirinç Basınç Düşürücü Vana Dişli D-333',
    slug: 'su-pirinc-basinc-dusurucu-vana-disli-d-333',
    stok_kodu: 'D-333',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-pirinc-basinc-dusurucu-vana-disli-d-333.jpg"}})
  },
  {
    id: 102,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yerüstü Yangın Hidrantı D-151',
    slug: 'yerustu-yangin-hidranti-d-151',
    stok_kodu: 'D-151',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yerustu-yangin-hidranti-d-151.jpg"}})
  },
  {
    id: 103,
    kategori_id: 4,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yeraltı Yangın Hidrantı (Alttan Klapeli) D-152',
    slug: 'yeralti-yangin-hidranti-alttan-klapeli-d-152',
    stok_kodu: 'D-152',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yeralti-yangin-hidranti-alttan-klapeli-d-152.jpg"}})
  },
  {
    id: 104,
    kategori_id: 4,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yeraltı Yangın Hidrantı (Üstten Klapeli) D-152',
    slug: 'yeralti-yangin-hidranti-ustten-klapeli-d-152',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yeralti-yangin-hidranti-ustten-klapeli-d-152.jpg"}})
  },
  {
    id: 105,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yeralti Yangın Hidranti Kurtağzı D-359',
    slug: 'yeralti-yangin-hidranti-kurtagzi-d-359',
    stok_kodu: 'D-359',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yeralti-yangin-hidranti-kurtagzi-d-359.jpg"}})
  },
  {
    id: 106,
    kategori_id: 2,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Dişli Bronz Kelebek Vana (Yangın Tip) D-232',
    slug: 'disli-bronz-kelebek-vana-yangin-tip-d-232',
    stok_kodu: 'D-232',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/disli-bronz-kelebek-vana-yangin-tip-d-232.jpg"}})
  },
  {
    id: 107,
    kategori_id: 2,
    kategori_adi: 'Yangın Vanaları',
    ad: 'İzlenebilir Kelebek Vana (Yangın Tip) D-230',
    slug: 'izlenebilir-kelebek-vana-yangin-tip-d-230',
    stok_kodu: 'D-230',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/izlenebilir-kelebek-vana-yangin-tip-d-230.jpg"}})
  },
  {
    id: 108,
    kategori_id: 2,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yivli Kelebek Vana (Yangın Tip) D-231',
    slug: 'yivli-kelebek-vana-yangin-tip-d-231',
    stok_kodu: 'D-231',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yivli-kelebek-vana-yangin-tip-d-231.jpg"}})
  },
  {
    id: 109,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yükselen Milli Sürgülü Vana (Yangın) D-233',
    slug: 'yukselen-milli-surgulu-vana-yangin-d-233',
    stok_kodu: 'D-233',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yukselen-milli-surgulu-vana-yangin-d-233.jpg"}})
  },
  {
    id: 110,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yangın Hidrantı Kazan D-154',
    slug: 'yangin-hidranti-kazan-d-154',
    stok_kodu: 'D-154',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yangin-hidranti-kazan-d-154.jpg"}})
  },
  {
    id: 111,
    kategori_id: 4,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Fire Çekvalf D-234',
    slug: 'fire-cekvalf-d-234',
    stok_kodu: 'D-234',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/fire-cekvalf-d-234.jpg"}})
  },
  {
    id: 112,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Sabit Kaplin D-297',
    slug: 'sabit-kaplin-d-297',
    stok_kodu: 'D-297',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/sabit-kaplin-d-297.jpg"}})
  },
  {
    id: 113,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Flexible Coupling D-298',
    slug: 'flexible-coupling-d-298',
    stok_kodu: 'D-298',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flexible-coupling-d-298.jpg"}})
  },
  {
    id: 114,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yangın Vana (İtalyan Tip) D-301',
    slug: 'yangin-vana-italyan-tip-d-301',
    stok_kodu: 'D-301',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yangin-vana-italyan-tip-d-301.jpg"}})
  },
  {
    id: 115,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yangın Rekoru(Kaplin)ve Kapağı',
    slug: 'yangin-rekoru-kaplin-ve-kapagi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yangin-rekoru-kaplin-ve-kapagi.jpg"}})
  },
  {
    id: 116,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Flanşlı Yangın Vanası',
    slug: 'flansli-yangin-vanasi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flansli-yangin-vanasi.jpg"}})
  },
  {
    id: 117,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Islak Alarm Vanası',
    slug: 'islak-alarm-vanasi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/islak-alarm-vanasi.jpg"}})
  },
  {
    id: 118,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'İzlenebilir Kebelek Vana',
    slug: 'izlenebilir-kebelek-vana',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/izlenebilir-kebelek-vana.jpg"}})
  },
  {
    id: 119,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'L Tipi Küresel Vana D-050',
    slug: 'l-tipi-kuresel-vana-d-050',
    stok_kodu: 'D-050',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/l-tipi-kuresel-vana-d-050.jpg"}})
  },
  {
    id: 120,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Paslanmaz Monoblok Küresel Vana D-052',
    slug: 'paslanmaz-monoblok-kuresel-vana-d-052',
    stok_kodu: 'D-052',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/paslanmaz-monoblok-kuresel-vana-d-052.jpg"}})
  },
  {
    id: 121,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '3 Parçalı Flanşlı Küresel Vana D-054 - D-055',
    slug: '3-parcali-flansli-kuresel-vana-d-054-d-055',
    stok_kodu: 'D-054',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-flansli-kuresel-vana-d-054-d-055.jpg"}})
  },
  {
    id: 122,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '3 Parçalı Dişli Küresel Vana D-049',
    slug: '3-parcali-disli-kuresel-vana-d-049',
    stok_kodu: 'D-049',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-disli-kuresel-vana-d-049.jpg"}})
  },
  {
    id: 123,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '2 Parçalı Dişli Küresel Vana D-047',
    slug: '2-parcali-disli-kuresel-vana-d-047',
    stok_kodu: 'D-047',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/2-parcali-disli-kuresel-vana-d-047.jpg"}})
  },
  {
    id: 124,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '2 Parçalı Paslanmaz Flanşlı Küresel Vana D-376',
    slug: '2-parcali-paslanmaz-flansli-kuresel-vana-d-376',
    stok_kodu: 'D-376',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/2-parcali-paslanmaz-flansli-kuresel-vana-d-376.jpg"}})
  },
  {
    id: 125,
    kategori_id: 4,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Wafer Çekvalf D-021',
    slug: 'wafer-cekvalf-d-021',
    stok_kodu: 'D-021',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/wafer-cekvalf-d-021.jpg"}})
  },
  {
    id: 126,
    kategori_id: 4,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Çalpara Çekvalf Dişli AISI 304 - 316 D-025',
    slug: 'calpara-cekvalf-disli-aisi-304-316-d-025',
    stok_kodu: 'D-025',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/calpara-cekvalf-disli-aisi-304-316-d-025.jpg"}})
  },
  {
    id: 127,
    kategori_id: 4,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Disko Çekvalf AISI D-017 AISI D-018',
    slug: 'disko-cekvalf-aisi-d-017-aisi-d-018',
    stok_kodu: 'D-017',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/disko-cekvalf-aisi-d-017-aisi-d-018.jpg"}})
  },
  {
    id: 128,
    kategori_id: 3,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Gıda Vanası D-246',
    slug: '113-gida-vanasi-d-246',
    stok_kodu: 'D-246',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/113-gida-vanasi-d-246.jpg"}})
  },
  {
    id: 129,
    kategori_id: 3,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'İğne Vana D-159',
    slug: 'igne-vana-d-159',
    stok_kodu: 'D-159',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/igne-vana-d-159.jpg"}})
  },
  {
    id: 130,
    kategori_id: 2,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Wafer Kelebek Vana D-032',
    slug: '115-wafer-kelebek-vana-d-032',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/115-wafer-kelebek-vana-d-032.jpg"}})
  },
  {
    id: 131,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'T Tipi Küresel Vana D-051',
    slug: '117-t-tipi-kuresel-vana-d-051',
    stok_kodu: 'D-051',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/117-t-tipi-kuresel-vana-d-051.jpg"}})
  },
  {
    id: 132,
    kategori_id: 3,
    kategori_adi: 'Balans Vanaları',
    ad: 'Statik Balans Vanası',
    slug: 'statik-balans-vanasi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/statik-balans-vanasi.jpg"}})
  },
  {
    id: 133,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Buhar Solenoid Vanalar D-199',
    slug: 'buhar-solenoid-vanalar-d-199',
    stok_kodu: 'D-199',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/buhar-solenoid-vanalar-d-199.jpg"}})
  },
  {
    id: 134,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Grup Solenoid Vanalar',
    slug: 'grup-solenoid-vanalar',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/grup-solenoid-vanalar.jpg"}})
  },
  {
    id: 135,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Paslanmaz Solenoid Vanalar D-197',
    slug: 'paslanmaz-solenoid-vanalar-d-197',
    stok_kodu: 'D-197',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/paslanmaz-solenoid-vanalar-d-197.jpg"}})
  },
  {
    id: 136,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Solenoid Vana Zaman Rolesi',
    slug: 'solenoid-vana-zaman-rolesi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/solenoid-vana-zaman-rolesi.jpg"}})
  },
  {
    id: 137,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Vakum Solenoid Vanalar',
    slug: 'vakum-solenoid-vanalar',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/vakum-solenoid-vanalar.jpg"}})
  },
  {
    id: 138,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Yakıt Solenoid Vanalar',
    slug: 'yakit-solenoid-vanalar',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yakit-solenoid-vanalar.jpg"}})
  },
  {
    id: 139,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Tek Etkili Y Tipi Pistonlu Vana D-202',
    slug: 'tek-etkili-y-tipi-pistonlu-vana-d-202',
    stok_kodu: 'D-202',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/tek-etkili-y-tipi-pistonlu-vana-d-202.jpg"}})
  },
  {
    id: 140,
    kategori_id: 3,
    kategori_adi: 'Solenoid Patlaç Pistonlu',
    ad: 'Bobinli Patlaç Valf',
    slug: 'bobinli-patlac-valf',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bobinli-patlac-valf.jpg"}})
  },
  {
    id: 141,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Döner Flanşlı Kompansatör D-099',
    slug: 'doner-flansli-kompansator-d-099',
    stok_kodu: 'D-099',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/doner-flansli-kompansator-d-099.jpg"}})
  },
  {
    id: 142,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Kaynak Boyunlu Kompansatör D-106',
    slug: 'kaynak-boyunlu-kompansator-d-106',
    stok_kodu: 'D-106',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kaynak-boyunlu-kompansator-d-106.jpg"}})
  },
  {
    id: 143,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Sabit Flanşlı Kompansatör D-103',
    slug: 'sabit-flansli-kompansator-d-103',
    stok_kodu: 'D-103',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/sabit-flansli-kompansator-d-103.jpg"}})
  },
  {
    id: 144,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Dıştan Basınçlı Kompansatör D-111',
    slug: 'distan-basincli-kompansator-d-111',
    stok_kodu: 'D-111',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/distan-basincli-kompansator-d-111.jpg"}})
  },
  {
    id: 145,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Kauçuk Kompansatör D-096',
    slug: 'kaucuk-kompansator-d-096',
    stok_kodu: 'D-096',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kaucuk-kompansator-d-096.jpg"}})
  },
  {
    id: 146,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Körük D-271',
    slug: 'koruk-d-271',
    stok_kodu: 'D-271',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/koruk-d-271.jpg"}})
  },
  {
    id: 147,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'İzoleli Flexible Hortumu D-120',
    slug: 'izoleli-flexible-hortumu-d-120',
    stok_kodu: 'D-120',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/izoleli-flexible-hortumu-d-120.jpg"}})
  },
  {
    id: 148,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'İzolesiz Flexible Hortumu D-299',
    slug: 'izolesiz-flexible-hortumu-d-299',
    stok_kodu: 'D-299',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/izolesiz-flexible-hortumu-d-299.jpg"}})
  },
  {
    id: 149,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Örgülü Esnek Metal Hortum D-142',
    slug: 'orgulu-esnek-metal-hortum-d-142',
    stok_kodu: 'D-142',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/orgulu-esnek-metal-hortum-d-142.jpg"}})
  },
  {
    id: 150,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Örgüsüz Esnek Metal Hortum D-300',
    slug: 'orgusuz-esnek-metal-hortum-d-300',
    stok_kodu: 'D-300',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/orgusuz-esnek-metal-hortum-d-300.jpg"}})
  },
  {
    id: 151,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Düz Flanş D-290',
    slug: 'duz-flans-d-290',
    stok_kodu: 'D-290',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/duz-flans-d-290.jpg"}})
  },
  {
    id: 152,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Kaynak Boyunlu Flanş D-291',
    slug: 'kaynak-boyunlu-flans-d-291',
    stok_kodu: 'D-291',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kaynak-boyunlu-flans-d-291.jpg"}})
  },
  {
    id: 153,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Te D-292',
    slug: 'te-d-292',
    stok_kodu: 'D-292',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/te-d-292.jpg"}})
  },
  {
    id: 154,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Kep D-293',
    slug: 'kep-d-293',
    stok_kodu: 'D-293',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kep-d-293.jpg"}})
  },
  {
    id: 155,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Dirsek D-294',
    slug: 'dirsek-d-294',
    stok_kodu: 'D-294',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/dirsek-d-294.jpg"}})
  },
  {
    id: 156,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Eksantrik Konsantrik Redüksiyonlar D-295',
    slug: 'eksantrik-konsantrik-reduksiyonlar-d-295',
    stok_kodu: 'D-295',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/eksantrik-konsantrik-reduksiyonlar-d-295.jpg"}})
  },
  {
    id: 157,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Demontaj Parçası D-135',
    slug: 'demontaj-parcasi-d-135',
    stok_kodu: 'D-135',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/demontaj-parcasi-d-135.jpg"}})
  },
  {
    id: 158,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Flanş Adaptörü D-296',
    slug: 'flans-adaptoru-d-296',
    stok_kodu: 'D-296',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flans-adaptoru-d-296.jpg"}})
  },
  {
    id: 159,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Sabit Kaplin D-297',
    slug: '163-sabit-kaplin-d-297',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/163-sabit-kaplin-d-297.jpg"}})
  },
  {
    id: 160,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Esnek Kaplin D-298',
    slug: 'esnek-kaplin-d-298',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/esnek-kaplin-d-298.jpg"}})
  },
  {
    id: 161,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'P-T D-351',
    slug: 'p-t-d-351',
    stok_kodu: 'D-351',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/p-t-d-351.jpg"}})
  },
  {
    id: 162,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-E D-351',
    slug: 'g-e-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-e-d-351.jpg"}})
  },
  {
    id: 163,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-F D-351',
    slug: 'g-f-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-f-d-351.jpg"}})
  },
  {
    id: 164,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-MMA D-351',
    slug: 'g-mma-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-mma-d-351.jpg"}})
  },
  {
    id: 165,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-MMB D-351',
    slug: 'g-mmb-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-mmb-d-351.jpg"}})
  },
  {
    id: 166,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-MMG D-351',
    slug: 'g-mmg-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-mmg-d-351.jpg"}})
  },
  {
    id: 167,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-MMR D-351',
    slug: 'g-mmr-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-mmr-d-351.jpg"}})
  },
  {
    id: 168,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'FFR D-351',
    slug: 'ffr-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ffr-d-351.jpg"}})
  },
  {
    id: 169,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-Q D-351',
    slug: 'g-q-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-q-d-351.jpg"}})
  },
  {
    id: 170,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'FFQ D-351',
    slug: 'ffq-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ffq-d-351.jpg"}})
  },
  {
    id: 171,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-MG D-351',
    slug: 'g-mg-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-mg-d-351.jpg"}})
  },
  {
    id: 172,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'X Kör Flanş D-351',
    slug: 'x-kor-flans-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/x-kor-flans-d-351.jpg"}})
  },
  {
    id: 173,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'SÜPER KOLYE D-696',
    slug: 'super-kolye-d-696',
    stok_kodu: 'D-696',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/super-kolye-d-696.jpg"}})
  },
  {
    id: 174,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'G-MA D-351',
    slug: 'g-ma-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/g-ma-d-351.jpg"}})
  },
  {
    id: 175,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'AÇB F D-351',
    slug: 'acb-f-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/acb-f-d-351.jpg"}})
  },
  {
    id: 176,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Son Kapama Parçası D-351',
    slug: 'son-kapama-parcasi-d-351',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/son-kapama-parcasi-d-351.jpg"}})
  },
  {
    id: 177,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Buşakle Takım D-007',
    slug: 'busakle-takim-d-007',
    stok_kodu: 'D-007',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/busakle-takim-d-007.jpg"}})
  },
  {
    id: 178,
    kategori_id: 3,
    kategori_adi: 'Bağlantı Parçaları',
    ad: 'Yangın Rekoru(Kaplin)ve Kapağı',
    slug: '182-yangin-rekoru-kaplin-ve-kapagi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/182-yangin-rekoru-kaplin-ve-kapagi.jpg"}})
  },
  {
    id: 179,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrikli Aktüatör DE-05',
    slug: 'rotary-on-off-elektrikli-aktuator-de-05',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrikli-aktuator-de-05.jpg"}})
  },
  {
    id: 180,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary Oransal Elektrik Aktüatör DE-05P',
    slug: 'rotary-oransal-elektrik-aktuator-de-05p',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-oransal-elektrik-aktuator-de-05p.jpg"}})
  },
  {
    id: 181,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrik Aktüatör DE-10',
    slug: 'rotary-on-off-elektrik-aktuator-de-10',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-10.jpg"}})
  },
  {
    id: 182,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary Oransal Elektrik Aktüatör DE-10P',
    slug: 'rotary-oransal-elektrik-aktuator-de-10p',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-oransal-elektrik-aktuator-de-10p.jpg"}})
  },
  {
    id: 183,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrik Aktüatör DE-20',
    slug: 'rotary-on-off-elektrik-aktuator-de-20',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-20.jpg"}})
  },
  {
    id: 184,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrik Aktüatör DE-20P',
    slug: 'rotary-on-off-elektrik-aktuator-de-20p',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-20p.jpg"}})
  },
  {
    id: 185,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary Kontrol Üniteli Elektrik Aktüatör DE-20I',
    slug: 'rotary-kontrol-uniteli-elektrik-aktuator-de-20i',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-kontrol-uniteli-elektrik-aktuator-de-20i.jpg"}})
  },
  {
    id: 186,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Çok turlu aktüatör On-Off',
    slug: 'cok-turlu-aktuator-on-off',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cok-turlu-aktuator-on-off.jpg"}})
  },
  {
    id: 187,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary Kontrol Üniteli Elektrikli Aktüatör DE-05P-D-268',
    slug: 'rotary-kontrol-uniteli-elektrikli-aktuator-de-05p-d-268',
    stok_kodu: 'D-268',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-kontrol-uniteli-elektrikli-aktuator-de-05p-d-268.jpg"}})
  },
  {
    id: 188,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: '3 Yollu Vana Motoru DE-10-D-179',
    slug: '3-yollu-vana-motoru-de-10-d-179',
    stok_kodu: 'D-179',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-yollu-vana-motoru-de-10-d-179.jpg"}})
  },
  {
    id: 189,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrik Aktüatör DE-60',
    slug: 'rotary-on-off-elektrik-aktuator-de-60',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-60.jpg"}})
  },
  {
    id: 190,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrik Aktüatör DE-03',
    slug: 'rotary-on-off-elektrik-aktuator-de-03',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrik-aktuator-de-03.jpg"}})
  },
  {
    id: 191,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary On-Off Elektrik Aktüatör',
    slug: 'rotary-on-off-elektrik-aktuator',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-on-off-elektrik-aktuator.jpg"}})
  },
  {
    id: 192,
    kategori_id: 3,
    kategori_adi: 'Elektrik Aktüatörler',
    ad: 'Rotary Oransal Elektrik Aktüatör',
    slug: 'rotary-oransal-elektrik-aktuator',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/rotary-oransal-elektrik-aktuator.jpg"}})
  },
  {
    id: 193,
    kategori_id: 3,
    kategori_adi: 'Pnömatik Aktüatör',
    ad: 'Çift Etkili Pnömatik Aktüatör D-161',
    slug: 'cift-etkili-pnomatik-aktuator-d-161',
    stok_kodu: 'D-161',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-etkili-pnomatik-aktuator-d-161.jpg"}})
  },
  {
    id: 194,
    kategori_id: 3,
    kategori_adi: 'Pnömatik Aktüatör',
    ad: 'Tek Etkili Pnömatik Aktüatör (10 Yaylı) D-339',
    slug: 'tek-etkili-pnomatik-aktuator-10-yayli-d-339',
    stok_kodu: 'D-339',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/tek-etkili-pnomatik-aktuator-10-yayli-d-339.jpg"}})
  },
  {
    id: 195,
    kategori_id: 2,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü Kelebek Vana (Wafer Tip) D-187',
    slug: 'elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187',
    stok_kodu: 'D-187',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187.jpg"}})
  },
  {
    id: 196,
    kategori_id: 2,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü Kelebek Vana (Lug Tip) D-188',
    slug: 'elektrik-aktuatorlu-kelebek-vana-lug-tip-d-188',
    stok_kodu: 'D-188',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kelebek-vana-lug-tip-d-188.jpg"}})
  },
  {
    id: 197,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü Küresel Vana (3 PCS Dişli) D-175',
    slug: 'elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175',
    stok_kodu: 'D-175',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175.jpg"}})
  },
  {
    id: 198,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Çift Etkili Pnömatik Aktüatörlü 3 Yollu Küresel Vana L Tipi - T Tipi D-177',
    slug: 'cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177',
    stok_kodu: 'D-177',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177.jpg"}})
  },
  {
    id: 199,
    kategori_id: 2,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Çift Etkili Pnömatik Aktüatörlü Kelebek Vana (Wafer Tip) D-169',
    slug: 'cift-etkili-pnomatik-aktuatorlu-kelebek-vana-wafer-tip-d-169',
    stok_kodu: 'D-169',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-kelebek-vana-wafer-tip-d-169.jpg"}})
  },
  {
    id: 200,
    kategori_id: 2,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Çift Etkili Pnömatik Aktüatörlü Kelebek Vana (Lug Tip) D-172',
    slug: 'cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172',
    stok_kodu: 'D-172',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172.jpg"}})
  },
  {
    id: 201,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü PVC Küresel Vana D-190',
    slug: 'elektrik-aktuatorlu-pvc-kuresel-vana-d-190',
    stok_kodu: 'D-190',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-pvc-kuresel-vana-d-190.jpg"}})
  },
  {
    id: 202,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü Pirinç Küresel Vana D-189',
    slug: 'elektrik-aktuatorlu-pirinc-kuresel-vana-d-189',
    stok_kodu: 'D-189',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-pirinc-kuresel-vana-d-189.jpg"}})
  },
  {
    id: 203,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Mini Elektrik Aktüatörlü Küresel Vana D-194',
    slug: 'mini-elektrik-aktuatorlu-kuresel-vana-d-194',
    stok_kodu: 'D-194',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/mini-elektrik-aktuatorlu-kuresel-vana-d-194.jpg"}})
  },
  {
    id: 204,
    kategori_id: 2,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Aktüatörlü Flanşlı Kelebek Vana D-269',
    slug: 'aktuatorlu-flansli-kelebek-vana-d-269',
    stok_kodu: 'D-269',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/aktuatorlu-flansli-kelebek-vana-d-269.jpg"}})
  },
  {
    id: 205,
    kategori_id: 3,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Aktüatörlü Sürgülü Vana D-270',
    slug: 'aktuatorlu-surgulu-vana-d-270',
    stok_kodu: 'D-270',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/aktuatorlu-surgulu-vana-d-270.jpg"}})
  },
  {
    id: 206,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü Küresel Vana D-193',
    slug: 'elektrik-aktuatorlu-kuresel-vana-d-193',
    stok_kodu: 'D-193',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kuresel-vana-d-193.jpg"}})
  },
  {
    id: 207,
    kategori_id: 3,
    kategori_adi: 'Aksesuarlar',
    ad: 'Linear Pozisyoner D-165',
    slug: 'linear-pozisyoner-d-165',
    stok_kodu: 'D-165',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/linear-pozisyoner-d-165.jpg"}})
  },
  {
    id: 208,
    kategori_id: 3,
    kategori_adi: 'Aksesuarlar',
    ad: 'Linear Pozisyoner Feedback D-166 ıT',
    slug: 'linear-pozisyoner-feedback-d-166-it',
    stok_kodu: 'D-166',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/linear-pozisyoner-feedback-d-166-it.jpg"}})
  },
  {
    id: 209,
    kategori_id: 3,
    kategori_adi: 'Aksesuarlar',
    ad: 'Switch Box D-164',
    slug: 'switch-box-d-164',
    stok_kodu: 'D-164',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/switch-box-d-164.jpg"}})
  },
  {
    id: 210,
    kategori_id: 3,
    kategori_adi: 'Aksesuarlar',
    ad: 'Namur Solenoid Yön Valfi (Tek Bobinli) D-162',
    slug: 'namur-solenoid-yon-valfi-tek-bobinli-d-162',
    stok_kodu: 'D-162',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/namur-solenoid-yon-valfi-tek-bobinli-d-162.jpg"}})
  },
  {
    id: 211,
    kategori_id: 3,
    kategori_adi: 'Aksesuarlar',
    ad: 'Namur Solenoid Yön Valfi (Çift Bobinli) D-162',
    slug: 'namur-solenoid-yon-valfi-cift-bobinli-d-162',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/namur-solenoid-yon-valfi-cift-bobinli-d-162.jpg"}})
  },
  {
    id: 212,
    kategori_id: 3,
    kategori_adi: 'Aksesuarlar',
    ad: 'I-P Çevirici D-167',
    slug: 'i-p-cevirici-d-167',
    stok_kodu: 'D-167',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/i-p-cevirici-d-167.jpg"}})
  },
  {
    id: 213,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Mekanik Woltman Tipi Debimetre D-214',
    slug: 'mekanik-woltman-tipi-debimetre-d-214',
    stok_kodu: 'D-214',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/mekanik-woltman-tipi-debimetre-d-214.jpg"}})
  },
  {
    id: 214,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Elektromanyetik Debimetre D-212',
    slug: 'elektromanyetik-debimetre-d-212',
    stok_kodu: 'D-212',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektromanyetik-debimetre-d-212.jpg"}})
  },
  {
    id: 215,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Ultrasonik Debimetre D-213',
    slug: 'ultrasonik-debimetre-d-213',
    stok_kodu: 'D-213',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ultrasonik-debimetre-d-213.jpg"}})
  },
  {
    id: 216,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Şamandıralı Debimetre D-210',
    slug: 'samandirali-debimetre-d-210',
    stok_kodu: 'D-210',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/samandirali-debimetre-d-210.jpg"}})
  },
  {
    id: 217,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Metal Gövdeli Şamandıralı Debimetre D-211',
    slug: 'metal-govdeli-samandirali-debimetre-d-211',
    stok_kodu: 'D-211',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-govdeli-samandirali-debimetre-d-211.jpg"}})
  },
  {
    id: 218,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Pedal Tip Akış Şalterleri D-215',
    slug: 'pedal-tip-akis-salterleri-d-215',
    stok_kodu: 'D-215',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pedal-tip-akis-salterleri-d-215.jpg"}})
  },
  {
    id: 219,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Basınç Sensörü - Transmitteri D-219',
    slug: 'basinc-sensoru-transmitteri-d-219',
    stok_kodu: 'D-219',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/basinc-sensoru-transmitteri-d-219.jpg"}})
  },
  {
    id: 220,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Digital ve Analog Manometre D-220',
    slug: 'digital-ve-analog-manometre-d-220',
    stok_kodu: 'D-220',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/digital-ve-analog-manometre-d-220.jpg"}})
  },
  {
    id: 221,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Kuru Tip Alttan Çıkışlı Manometre',
    slug: 'kuru-tip-alttan-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kuru-tip-alttan-cikisli-manometre.jpg"}})
  },
  {
    id: 222,
    kategori_id: 1,
    kategori_adi: 'Basınç',
    ad: 'Mini Elektrik Aktüatörlü Küresel Vana D-194',
    slug: '225-mini-elektrik-aktuatorlu-kuresel-vana-d-194',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/225-mini-elektrik-aktuatorlu-kuresel-vana-d-194.jpg"}})
  },
  {
    id: 223,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Gliserin Tip Alttan Çıkışlı Manometreler',
    slug: 'gliserin-tip-alttan-cikisli-manometreler',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/gliserin-tip-alttan-cikisli-manometreler.jpg"}})
  },
  {
    id: 224,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Gliserin Tip Arka Çıkışlı Manometreler',
    slug: 'gliserin-tip-arka-cikisli-manometreler',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/gliserin-tip-arka-cikisli-manometreler.jpg"}})
  },
  {
    id: 225,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre',
    slug: 'endustriyel-manometre-c1-1-6-alttan-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg"}})
  },
  {
    id: 226,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre',
    slug: 'endustriyel-manometre-c1-1-6-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg"}})
  },
  {
    id: 227,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: 'endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}})
  },
  {
    id: 228,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: '231-endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/231-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}})
  },
  {
    id: 229,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre',
    slug: '232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg"}})
  },
  {
    id: 230,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre',
    slug: '233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg"}})
  },
  {
    id: 231,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: '234-endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/234-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}})
  },
  {
    id: 232,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: '235-endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/235-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"}})
  },
  {
    id: 233,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Manometre Bağlantı Sifonu D-570',
    slug: 'manometre-baglanti-sifonu-d-570',
    stok_kodu: 'D-570',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/manometre-baglanti-sifonu-d-570.jpg"}})
  },
  {
    id: 234,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Manometre Pano Bağlantı Aparatı',
    slug: 'manometre-pano-baglanti-aparati',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/manometre-pano-baglanti-aparati.jpg"}})
  },
  {
    id: 235,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Manometre Flanşı',
    slug: 'manometre-flansi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/manometre-flansi.jpg"}})
  },
  {
    id: 236,
    kategori_id: 3,
    kategori_adi: 'Seviye',
    ad: 'Seviye Şalterleri D-217',
    slug: 'seviye-salterleri-d-217',
    stok_kodu: 'D-217',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/seviye-salterleri-d-217.jpg"}})
  },
  {
    id: 237,
    kategori_id: 3,
    kategori_adi: 'Seviye',
    ad: 'Ultrasonik Seviye Sensörü (Göstergeli) D-218',
    slug: 'ultrasonik-seviye-sensoru-gostergeli-d-218',
    stok_kodu: 'D-218',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ultrasonik-seviye-sensoru-gostergeli-d-218.jpg"}})
  },
  {
    id: 238,
    kategori_id: 3,
    kategori_adi: 'Sıcaklık',
    ad: 'Hvac Bimetal Thermometre Byk',
    slug: 'hvac-bimetal-thermometre-byk',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hvac-bimetal-thermometre-byk.jpg"}})
  },
  {
    id: 239,
    kategori_id: 3,
    kategori_adi: 'Sıcaklık',
    ad: 'Endüstriyel Termometre',
    slug: 'endustriyel-termometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-termometre.jpg"}})
  },
  {
    id: 240,
    kategori_id: 3,
    kategori_adi: 'Proses Kontrol',
    ad: 'Kontrol Cihazı D-222',
    slug: 'kontrol-cihazi-d-222',
    stok_kodu: 'D-222',
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kontrol-cihazi-d-222.jpg"}})
  },
  {
    id: 241,
    kategori_id: 3,
    kategori_adi: 'Proses Kontrol',
    ad: 'Elektro Pnömatik Pozisyoner 4 - 20 mA (LINEAR) D-165',
    slug: 'elektro-pnomatik-pozisyoner-4-20-ma-linear-d-165',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektro-pnomatik-pozisyoner-4-20-ma-linear-d-165.jpg"}})
  },
  {
    id: 242,
    kategori_id: 3,
    kategori_adi: 'Proses Kontrol',
    ad: 'Elektro Pnömatik Pozisyoner FeedBackli 4-20 mA (LINEAR) D-166 ıT',
    slug: 'elektro-pnomatik-pozisyoner-feedbackli-4-20-ma-linear-d-166-it',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektro-pnomatik-pozisyoner-feedbackli-4-20-ma-linear-d-166-it.jpg"}})
  },
  {
    id: 243,
    kategori_id: 3,
    kategori_adi: 'Proses Kontrol',
    ad: 'Elektro Pnömatik Pozisyoner 4-20 mA (LINEAR) D-166',
    slug: 'elektro-pnomatik-pozisyoner-4-20-ma-linear-d-166',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"detay_hazir_mi":false,"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektro-pnomatik-pozisyoner-4-20-ma-linear-d-166.jpg"}})
  }],
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
