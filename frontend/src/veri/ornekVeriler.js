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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-sitli-surgulu-vana-f4-d-001.jpg"},"urun_tanimi":{"baslik":"METAL SİTLİ SÜRGÜLÜ VANA O-RİNG SİSTEMİ PN10 / PN6 TS 457/1 DIN 3352/2-F4 (DIN 3216) NO PARÇA ADI MALZEME 1 Gövde GG 25 / GGG-40 2 Gövde Burcu Ms 58 / Bronze/S.S 3 DN40...100 Sürgü Ms 58 / Bronze/S.S DN125...900 Sürgü GG 25 / GGG-40 4 Sürgü Burcu Ms 58 /Bronze/S.S 5 Sürgü Somunu 125...920 Ms 58 / Bronze / GGG-40 6 Mil Ms 58 / Bronze/S.S 7 Conta EPDM / FRANZELİT / KLİNGERİT 8 Kapak GG 25 / GGG-40 9 Civata 5 D /S.S 10 Mil Somunu Mr 58/Bronze/S.S. 11 O-Ring EPDM 12 Volan GG 20 Anma Basıncı PN 10 6 4 2,5 1,6 1 Anma Çapı DN 40 50 65 80 100 125 150 200 250 300 350 400 500 600 700 800 900 Vana Boyutları TS 457 /1 DIN / 3352 / 24 L 140 150 170 180 190 200 210 230 250 270 290 310 350 390 430 470 510 H 157 190 210 230 260 365 375 500 630 715 820 910 1135 1300 1480 1690 1820 D1 160 200 250 315 400 500 630 800 Flanş Ölçüleri DIN 2501 / TS 810 PN10 D 150 165 185 200 220 250 285 340 295 445 505 565 670 780 895 1015 1115 k 110 125 145 160 180 210 240 295 350 400 460 515 620 725 480 950 1050 Ağırlık kg 8,3 10,2 13,7 15,5 22,1 37 44,2 81 123 176 225 290 460 680 870 1200 1400","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58 / Bronze/S.S"},{"no":"3","ad":"DN40...100 Sürgü","malzeme":"Ms 58 / Bronze/S.S"},{"no":"DN125...900 Sürgü","ad":"GG 25 / GGG-40","malzeme":""},{"no":"4","ad":"Sürgü Burcu","malzeme":"Ms 58 /Bronze/S.S"},{"no":"5","ad":"Sürgü Somunu 125...920","malzeme":"Ms 58 / Bronze / GGG-40"},{"no":"6","ad":"Mil","malzeme":"Ms 58 / Bronze/S.S"},{"no":"7","ad":"Conta","malzeme":"EPDM / FRANZELİT / KLİNGERİT"},{"no":"8","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"9","ad":"Civata","malzeme":"5 D /S.S"},{"no":"10","ad":"Mil Somunu","malzeme":"Mr 58/Bronze/S.S."},{"no":"11","ad":"O-Ring","malzeme":"EPDM"},{"no":"12","ad":"Volan","malzeme":"GG 20"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600","700","800","900"],"olculer":[{"grup":"Vana Boyutları TS 457 /1 DIN / 3352 / 24","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390","430","470","510"]},{"grup":"","kod":"H","degerler":["157","190","210","230","260","365","375","500","630","715","820","910","1135","1300","1480","1690","1820"]},{"grup":"","kod":"D1","gruplu_degerler":[{"deger":"160","sutun":4},{"deger":"200","sutun":1},{"deger":"250","sutun":3},{"deger":"315","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2},{"deger":"630","sutun":1},{"deger":"800","sutun":2}]},{"grup":"Flanş Ölçüleri DIN 2501 / TS 810 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","295","445","505","565","670","780","895","1015","1115"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","725","480","950","1050"]},{"grup":"Ağırlık","kod":"kg","degerler":["8,3","10,2","13,7","15,5","22,1","37","44,2","81","123","176","225","290","460","680","870","1200","1400"]}]}],"teknik_cizim_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Metal Sitli Sürgülü Vana F4 D-001 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f4-d-001/Metal Sitli Sürgülü Vana F4 D-001 PDF.pdf"}]})
  },   {
    id: 6,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Akış Göstergesi D-149',
    slug: 'akis-gostergesi-d-149',
    stok_kodu: 'D-149',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/akis-gostergesi-d-149.jpg"},"urun_tanimi":{"baslik":"Akış Göstergesi","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG-25 / GGG-40 / GS-C 25"},{"no":"2","ad":"Cam","malzeme":"Glass (Borosilicat DIN 7080)"},{"no":"3","ad":"Conta","malzeme":"Klingerit"},{"no":"4","ad":"Kapak","malzeme":"GG-25 / GGG-40 / GS-C 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150"],"olculer":[{"grup":"Boyut Ölçüleri","kod":"L","degerler":["130","150","160","180","200","230","290","310","350","400","480"]},{"grup":"","kod":"H","degerler":["110","115","120","125","135","150","175","190","260","280","330"]},{"grup":"Flanş Ölçüleri PN 10/16 TS 810 DIN 2501","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","180","210","240"]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"14","sutun":1},{"deger":"16","sutun":2},{"deger":"18","sutun":2},{"deger":"20","sutun":2},{"deger":"22","sutun":1},{"deger":"24","sutun":1},{"deger":"26","sutun":2}]},{"grup":"","kod":"Ølxn","gruplu_degerler":[{"deger":"Ø14x4","sutun":3},{"deger":"Ø18x4","sutun":4},{"deger":"Ø18x","sutun":3},{"deger":"Ø22x8","sutun":1}]},{"grup":"Ağırlık","kod":"kg","degerler":["4","5","7","9","14","16","25","32","39","48","90"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/akis-gostergesi-d-149/Akış Göstergesi D-149 PDF.pdf"}]})
  },
  {
    id: 7,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Ani Kapama Vanası Düz Tip D-155',
    slug: 'ani-kapama-vanasi-duz-tip-d-155',
    stok_kodu: 'D-155',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ani-kapama-vanasi-duz-tip-d-155.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/ani-kapama-vanasi-duz-tip-d-155/Ani Kapama Vanası Düz Tip D-155 PDF.pdf"}]})
  },
  {
    id: 8,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Ani Kapama Vanası Köşe Tip D-119',
    slug: 'ani-kapama-vanasi-kose-tip-d-119',
    stok_kodu: 'D-119',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ani-kapama-vanasi-kose-tip-d-119.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/ani-kapama-vanasi-kose-tip-d-119/Ani Kapama Vanası Köşe Tip D-119 PDF.pdf"}]})
  },
  {
    id: 9,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Çamur Sandığı Düz Tip D-157',
    slug: 'camur-sandigi-duz-tip-d-157',
    stok_kodu: 'D-157',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/camur-sandigi-duz-tip-d-157.jpg"},"urun_tanimi":{"baslik":"ÇAMUR SANDIĞI DÜZ TİP","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25"},{"no":"2","ad":"Filtre","malzeme":"316 L"},{"no":"3","ad":"Kapak","malzeme":"GG 25"},{"no":"4","ad":"Halka","malzeme":"C 15"},{"no":"5","ad":"Saplama","malzeme":"5.8"},{"no":"6","ad":"Somun","malzeme":"8"},{"no":"7","ad":"Tapa","malzeme":"BRASS"},{"no":"8","ad":"O-Ring","malzeme":"Perbunan"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["040","050","065","080","100","125","150","200","250","300","350","400"],"olculer":[{"grup":"","kod":"ØD","degerler":["150","165","185","200","220","250","285","340","395","445","505","565"]},{"grup":"","kod":"Øk","degerler":["110","125","145","160","180","210","240","295","350","400","460","515"]},{"grup":"","kod":"L","degerler":["200","230","290","310","350","400","480","600","600","700","800","740"]},{"grup":"","kod":"H","degerler":["205","225","260","310","345","395","465","565","610","675","790","9904"]},{"grup":"","kod":"h","degerler":["95","106","134","156","185","225","265","335","345","390","425","470"]},{"grup":"","kod":"Ağırlık kg.","degerler":["11","15","21","27","37","50","71","122","148","199","270","345"]}]}],"teknik_cizim_yolu":"/assets/urunler/camur-sandigi-duz-tip-d-157/teknik-cizim.png","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/camur-sandigi-duz-tip-d-157/Çamur Sandığı Düz Tip D-157 PDF.pdf"}]})
  },
  {
    id: 10,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Çamur Sandığı Köşe Tip D-205',
    slug: 'camur-sandigi-kose-tip-d-205',
    stok_kodu: 'D-205',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/camur-sandigi-kose-tip-d-205.jpg"},"urun_tanimi":{"baslik":"ÇAMUR SANDIĞI KÖŞE TİP","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25"},{"no":"2","ad":"Filtre","malzeme":"316 L"},{"no":"3","ad":"Kapak","malzeme":"GG 25"},{"no":"4","ad":"Halka","malzeme":"C 15"},{"no":"5","ad":"Saplama","malzeme":"5.8"},{"no":"6","ad":"Somun","malzeme":"8"},{"no":"7","ad":"Tapa","malzeme":"BRASS"},{"no":"8","ad":"O-Ring","malzeme":"Perbunan"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["040","050","065","080","100","125","150","200","250","300","350","400"],"olculer":[{"grup":"","kod":"ØD","degerler":["150","165","185","200","220","250","285","340","395","445","505","565"]},{"grup":"","kod":"Øk","degerler":["110","125","145","160","180","210","240","295","350","400","460","515"]},{"grup":"","kod":"L","degerler":["125","135","150","175","195","220","270","300","390","450","400","420 520"]},{"grup":"","kod":"H","degerler":["240","260","280","330","350","415","470","540","660","760","730","980"]},{"grup":"","kod":"Ağırlık kg.","degerler":["12,5","17,5","20","30","42,5","57,5","78","115","166","230","274","380"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/camur-sandigi-kose-tip-d-205/Çamur Sandığı Köşe Tip D-205 PDF.pdf"}]})
  },
  {
    id: 11,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Vana Sandığı D-160',
    slug: 'vana-sandigi-d-160',
    stok_kodu: 'D-160',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/vana-sandigi-d-160.jpg"},"urun_tanimi":{"baslik":"VANA SANDIĞI","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG40,3 / GSC - 25 / Bronze"},{"no":"2","ad":"Yatak Disk (<50)","malzeme":"X5CrNi 18 9 X5CrNi 18 9"},{"no":"3","ad":"Disk Yüzüyi Disk (>65)","malzeme":"GG 25 X5CrNi 18 9"},{"no":"4","ad":"Disk Somunu","malzeme":"X5CrNi 18 9"},{"no":"5","ad":"Kapak","malzeme":"GG 25"},{"no":"6","ad":"Conta","malzeme":"Grafit"},{"no":"7","ad":"Baskı Tapası","malzeme":"GGG 40,3"},{"no":"8","ad":"T Civata , Somun","malzeme":"Çelik"},{"no":"9","ad":"Mil","malzeme":"X5CrNi 18 9"},{"no":"10","ad":"Conta","malzeme":"Karbo (Astbestsiz)"},{"no":"11","ad":"Civata Somun","malzeme":"Çelik"},{"no":"12","ad":"Gösterge","malzeme":"Çelik"},{"no":"13","ad":"Volan","malzeme":"GG 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["ØD","DN1","ØD1","L1","L2","ØR","H1","H (Açık)"],"olculer":[{"grup":"","kod":"50","degerler":["165","50","165","170","120","160","100","266"]},{"grup":"","kod":"50","degerler":["165","65","185","170","120","160","100","266"]},{"grup":"","kod":"65","degerler":["185","65","185","190","130","180","110","285"]},{"grup":"","kod":"65","degerler":["185","80","200","190","130","180","110","285"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/vana-sandigi-d-160/Vana Sandığı D-160 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bronz-glob-vana-duz-kose-d-208.jpg"},"urun_tanimi":{"baslik":"BRONZ GLOB VANA DÜZ / KÖŞE","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"G-CuSn5ZPb"},{"no":"2","ad":"Yatak","malzeme":"G-CuSn5ZPb"},{"no":"3","ad":"Disk","malzeme":"G-CuSn5ZPb"},{"no":"4","ad":"Disk Somunu","malzeme":"G-CuSn5ZPb"},{"no":"5","ad":"Kapak","malzeme":"G-CuSn5ZPb"},{"no":"6","ad":"Conta","malzeme":"Grafit"},{"no":"7","ad":"Baskı Tapası","malzeme":"G-CuSn5ZPb"},{"no":"8","ad":"Çekiç Baş Vida-Somun","malzeme":"A2 304"},{"no":"9","ad":"Mil","malzeme":"CuZn35Ni"},{"no":"10","ad":"Conta","malzeme":"Asperit"},{"no":"11","ad":"Vida Somun","malzeme":"A2 304"},{"no":"12","ad":"Valon","malzeme":"GG 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","500","600"],"olculer":[{"grup":"","kod":"L","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","980","1100","1250","1450"]},{"grup":"","kod":"L1","degerler":["90","95","100","105","115","125","145","155","175","200","225","250","275","325","375","425","475","525","450 550"]},{"grup":"10","kod":"ØD","degerler":["95","105","115","140","150","1651","185","200","220","2502","285","315","340","395","445","505","565","670","780"]},{"grup":"16","kod":"ØD","degerler":["95","105","115","140","150","1651","185","200","220","2502","285","315","340","405","460","520","580","715","840"]},{"grup":"","kod":"H (Açık)","degerler":["170","170","176","176","230","240","258","315","356","454","516","598","598","830","910","985","10851","1250",""]},{"grup":"","kod":"H (Açık)","degerler":["160","160","166","170","212","223","240","290","320","410","450","512","512","705","785","885","954","1100","1355"]},{"grup":"","kod":"ØR","degerler":["120","120","140","140","160","160","180","200","220","300","400","400","400","520","520","520","520","640","640"]},{"grup":"","kod":"Kg 100","degerler":["4,5","5,2","5,6","7,5","11,2","13,6","21","28","39,6","62,2","105","120","146","238","303","478","565","1120",""]},{"grup":"","kod":"Kg 103","degerler":["4,8","5,5","6,6","8","11,2","13","18,7","26,4","37","58,4","70","105","120","208","270","402","428","840","1030"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/bronz-glob-vana-duz-kose-d-208/Bronz Glob Vana Düz - Köşe D-208 PDF.pdf"}]})
  },
  {
    id: 15,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Bronz Yangın Vanası Düz - Köşe D-209',
    slug: 'bronz-yangin-vanasi-duz-kose-d-209',
    stok_kodu: 'D-209',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bronz-yangin-vanasi-duz-kose-d-209.jpg"},"urun_tanimi":{"baslik":"BRONZ YANGIN VANASI DÜZ / KÖŞE","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"Rg5"},{"no":"2","ad":"Klape","malzeme":"Rg5"},{"no":"3","ad":"Klape Contası","malzeme":"EPDM"},{"no":"4","ad":"Mil","malzeme":"Ms58"},{"no":"5","ad":"Kapak","malzeme":"Rg5"},{"no":"6","ad":"Volan","malzeme":"GG 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["D","k","d","L","L1","L2","Hmax.","H 1 max.","R"],"olculer":[{"grup":"","kod":"40","degerler":["150","110","R1 1/2\"","150","75","65","180","165","140"]},{"grup":"","kod":"50","degerler":["165","125","R2\"","165","75","75","176","152","140"]},{"grup":"","kod":"65","degerler":["185","145","R2 1/2\"","200","95","90","235","200","160"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/bronz-yangin-vanasi-duz-kose-d-209/Bronz Yangın Vanası Düz - Köşe D-209 PDF.pdf"}]})
  },
  {
    id: 16,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Dışşarj Vanası Yaylı Tip Düz - Köşe D-084',
    slug: 'dissarj-vanasi-yayli-tip-duz-kose-d-084',
    stok_kodu: 'D-084',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/dissarj-vanasi-yayli-tip-duz-kose-d-084.jpg"},"urun_tanimi":{"baslik":"DIŞŞARJ VANASI YAYLI TİP DÜZ / KÖŞE","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 / GS-C 25"},{"no":"2","ad":"Burc","malzeme":"1,4301 / BRONZE"},{"no":"3","ad":"Klape","malzeme":"1,4301 / BRONZE"},{"no":"4","ad":"Baskı","malzeme":"Ms 58"},{"no":"5","ad":"Mil","malzeme":"1,4021 / Cu Sn8"},{"no":"6","ad":"Conta","malzeme":"Klingerti / Asberit"},{"no":"7","ad":"Kapak","malzeme":"GG 25 / GGG-40 / GS-C 25"},{"no":"8","ad":"Salmastra","malzeme":"Graphite"},{"no":"9","ad":"Sal Baskısı","malzeme":"GG 25 / GGG-40 / GS-C 25"},{"no":"10","ad":"Saplama Somuın","malzeme":"5,6 - 8"},{"no":"11","ad":"Destek","malzeme":"Automat Steel"},{"no":"12","ad":"Köprü","malzeme":"GG 25"},{"no":"13","ad":"Yay","malzeme":"AISI 301"},{"no":"14","ad":"El Çarkı","malzeme":"GG 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["ØD","Düz","15","20","25","32","40","50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"","kod":"L","degerler":["Øk","Açılı","130","150","160","180","200","230","290","310","350","400","480","600","730","850"]},{"grup":"","kod":"L1","degerler":["Ağırlık kg","Düz","90","95","100","105","115","125","145","155","175","200","225","275","325","375"]},{"grup":"","kod":"H","degerler":["ØD","Açılı","340","345","350","355","365","375","480","500","525","620","760","810","860","880"]},{"grup":"","kod":"H1","degerler":["ØK","","310","325","320","323","335","340","450","465","480","515","685","745","775","790"]},{"grup":"","kod":"Strok","degerler":["Ağırlık kg","","8","8","12","15","20","20","27","31","35","49","53","72","80","100"]},{"grup":"","kod":"ØC","degerler":["","","120","120","140","140","160","160","180","200","225","250","300","400","520","520"]},{"grup":"","kod":"PN 16","degerler":["","","95","105","115","140","150","165","185","200","220","250","285","340","405","460"]},{"grup":"","kod":"PN 40","degerler":["","","65","75","85","100","110","125","145","160","180","210","240","295","355","410"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/dissarj-vanasi-yayli-tip-duz-kose-d-084/Dışşarj Vanası Yaylı Tip Düz - Köşe D-084 PDF.pdf"}]})
  },
  {
    id: 17,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'İskandil Vanası D-086',
    slug: '129-iskandil-vanasi-d-086',
    stok_kodu: 'D-086',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/129-iskandil-vanasi-d-086.jpg"},"urun_tanimi":{"baslik":"İSKANDİL VANASI","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"G-CuSn5ZnPb"},{"no":"2","ad":"Kapak","malzeme":"G-CuSn5ZnPb"},{"no":"3","ad":"Başlık","malzeme":"G-CuSn5ZnPb"},{"no":"4","ad":"Toz Kapağı","malzeme":"G-CuSn5ZnPb"},{"no":"5","ad":"Kumanda Kolu","malzeme":"G-CuSn5ZnPb"},{"no":"6","ad":"Somun","malzeme":"8,8"},{"no":"7","ad":"O-Ring","malzeme":"NBR"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["D\"","L","L1","H","F\"","KG 170"],"olculer":[{"grup":"","kod":"32","degerler":["1 1/4\"","130","150","85","1/4\"","3,5"]},{"grup":"","kod":"40","degerler":["1 1/2\"","130","150","85","1/4\"","3,5"]},{"grup":"","kod":"50","degerler":["2\"","130","150","85","1/4\"","3,5"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/129-iskandil-vanasi-d-086/İskandil Vanası D-086 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/firtina-vanasi-duz-tip-d-156.jpg"},"urun_tanimi":{"baslik":"FIRTINA VANASI DÜZ TİP","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GGG-40/ GS-C 25"},{"no":"2","ad":"Kapak","malzeme":"GGG-40/ GS-C 25"},{"no":"3","ad":"Klape","malzeme":"Bronze"},{"no":"4","ad":"Conta","malzeme":"EPDM"},{"no":"5","ad":"Conta","malzeme":"EPDM"},{"no":"6","ad":"Pim","malzeme":"Brass / Ms 58"},{"no":"7","ad":"Somun","malzeme":"8"},{"no":"8","ad":"Saplama","malzeme":"5,6"},{"no":"9","ad":"Tapa","malzeme":"Brass / Ms 58"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["50","65","80","100","125","150"],"olculer":[{"grup":"","kod":"ØD","degerler":["165","185","200","220","250","285"]},{"grup":"","kod":"Øk","degerler":["1251","145","160","180","210","240"]},{"grup":"","kod":"h","degerler":["37","148","174","195","216","242"]},{"grup":"","kod":"L","degerler":["200","240","260","300","350","400"]},{"grup":"","kod":"Ağırlık kg","degerler":["16","20","26","33","47","63"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/firtina-vanasi-duz-tip-d-156/Fırtına Vanası Düz Tip D-156 PDF.pdf"}]})
  },
  {
    id: 21,
    kategori_id: 3,
    kategori_adi: 'Gemi Vanaları',
    ad: 'Fırtına Vanası Köşe Tip D-224',
    slug: 'firtina-vanasi-kose-tip-d-224',
    stok_kodu: 'D-224',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/firtina-vanasi-kose-tip-d-224.jpg"},"urun_tanimi":{"baslik":"FIRTINA VANASI KÖŞE TİP","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GGG-40/ GS-C 25"},{"no":"2","ad":"Kapak","malzeme":"GGG-40/ GS-C 25"},{"no":"3","ad":"Klape","malzeme":"Bronze"},{"no":"4","ad":"Conta","malzeme":"EPDM"},{"no":"5","ad":"Conta","malzeme":"EPDM"},{"no":"6","ad":"Pim","malzeme":"Brass / Ms 58"},{"no":"7","ad":"Somun","malzeme":"8"},{"no":"8","ad":"Saplama","malzeme":"5,6"},{"no":"9","ad":"Tapa","malzeme":"Brass / Ms 58"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["50","65","80","100","125","150"],"olculer":[{"grup":"","kod":"ØD","degerler":["165","185","200","220","250","285"]},{"grup":"","kod":"Øk","degerler":["1251","145","160","180","210","240"]},{"grup":"","kod":"h","degerler":["37","148","174","195","216","242"]},{"grup":"","kod":"L","degerler":["200","240","260","300","350","400"]},{"grup":"","kod":"Ağırlık kg","degerler":["16","20","26","33","47","63"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/firtina-vanasi-kose-tip-d-224/Fırtına Vanası Köşe Tip D-224 PDF.pdf"}]})
  },
  {
    id: 22,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Metal Sitli Sürgülü Vana F5 D-003',
    slug: 'metal-sitli-surgulu-vana-f5-d-003',
    stok_kodu: 'D-003',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-sitli-surgulu-vana-f5-d-003.jpg"},"urun_tanimi":{"baslik":"METAL SİTLİ SÜRGÜLÜ VANA F5","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG 40-50 / GSC 25"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58 / Bronze/S.S"},{"no":"3","ad":"Sürgü","malzeme":"GG 25 / GGG 40-50 / GSC 25"},{"no":"4","ad":"Sürgü Burcu","malzeme":"Ms 58 / Bronze/S.S"},{"no":"5","ad":"Sürgü Somunu","malzeme":"Ms 58 / Bronze/S.S"},{"no":"6","ad":"Mil","malzeme":"Ms 58 / Bronze/S.S"},{"no":"7","ad":"Conta","malzeme":"NBR / Franzelit / Klingerit"},{"no":"8","ad":"Kapak","malzeme":"GG 25 / GGG 40-50"},{"no":"9","ad":"Civata","malzeme":"5 D /S.S"},{"no":"10","ad":"Mil Somunu","malzeme":"Mr 58/Bronze/S.S."},{"no":"11","ad":"O-Ring","malzeme":"EPDM"},{"no":"12","ad":"Volan","malzeme":"GG 20"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600"],"olculer":[{"grup":"Vana Boyutları TS 457 /1 DIN / 3352 / 24","kod":"L","degerler":["240","250","270","280","300","325","350","400","450","500","550","600","700","800"]},{"grup":"","kod":"H","degerler":["215","220","265","300","320","370","415","590","675","750","870","950","1200","1330"]},{"grup":"","kod":"D1","gruplu_degerler":[{"deger":"200","sutun":2},{"deger":"250","sutun":1},{"deger":"315","sutun":3},{"deger":"400","sutun":2},{"deger":"500","sutun":3},{"deger":"620","sutun":2},{"deger":"800","sutun":1}]},{"grup":"Flanş Ölçüleri DIN 2501 / TS 810 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","670","780"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","725"]},{"grup":"Flanş Ölçüleri DIN 2501 / TS 810 PN16","kod":"D","degerler":["150","165","185","200","220","250","285","340","405","460","520","580","715","840"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","355","410","470","525","650","770"]},{"grup":"Ağırlık","kod":"kg","degerler":["13,3","15,3","22,2","26,8","36","47","59","141","195","285","371","460","751","1143"]}]}],"teknik_cizim_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f5-d-003/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Metal Sitli Sürgülü Vana F5 D-003 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f5-d-003/Metal Sitli Sürgülü Vana F5 D-003 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/metal-sitli-surgulu-vana-f5-d-003/Metal Sitli Sürgülü Vana F5 D-003 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yukselen-milli-surgulu-vana-f4-f5-d-008.jpg"},"urun_tanimi":{"baslik":"YÜKSELEN MİLLİ SÜRGÜLÜ VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40/GGG-40.3/GSC25/ BronzeRG5, RG7, RG10/SS304,SS316"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58/BRONZE / S.S"},{"no":"3","ad":"Sürgü","malzeme":"GG 25 / GGG-40/GGG-40.3/GSC25/ Bronze RG5, RG7, RG10/SS304,SS316"},{"no":"4","ad":"Sürgü Bursu","malzeme":"Ms 58/BronzeE / S.S"},{"no":"5","ad":"Sürgü Somunu Sadece 125..600","malzeme":"Bronze / GGG 40"},{"no":"6","ad":"Mil","malzeme":"SS420/Ms58/Som59/CuZn35Ni/ CuSn8,Cusn10/SS304,SS316"},{"no":"7","ad":"Sabitleme","malzeme":"Ms 58 / Bronze /S.S"},{"no":"8","ad":"Conta","malzeme":"Klingerit / EPDM / GRAPHITE"},{"no":"9","ad":"Kapak","malzeme":"GG 25 / GGG-40/GGG-40.3/GSC25/ BronzeRG5, RG7, RG10/SS304,SS316"},{"no":"10","ad":"Civata","malzeme":"8.8 / A2 / A4"},{"no":"11","ad":"Salmastra","malzeme":"GRAPHITE / TEFLON"},{"no":"12","ad":"Boyunduruk","malzeme":"SS420/Ms58/Som59/CuZn35Ni/ CuSn8,Cusn10/SS304,SS316"},{"no":"13","ad":"Salmastra Baskısı","malzeme":"SS420/Ms58/Som59/CuZn35Ni/ CuSn8,Cusn10/SS304,SS316"},{"no":"14","ad":"Mil Yatağı","malzeme":"Ms 58 / Bronze / GGG 40"},{"no":"15","ad":"Mil Yatağı Somunu","malzeme":"Ms 58 / Bronze / S.S"},{"no":"16","ad":"Gresörlük","malzeme":"St"},{"no":"17","ad":"Volan","malzeme":"GG 20"},{"no":"18","ad":"Volan Somunu","malzeme":"Ms 58 / Bronze / S.S"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600"],"olculer":[{"grup":"Anma Çapı TS EN 1171 DIN 3352/2-F4","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390"]},{"grup":"","kod":"H min","degerler":["350","360","470","470","580","650","725","815","950","1080","1225","1390","1670","1920"]},{"grup":"","kod":"H max","degerler":["410","470","560","560","690","790","895","1030","1220","1405","1595","1810","2195","2550"]},{"grup":"","kod":"D1","gruplu_degerler":[{"deger":"160","sutun":4},{"deger":"200","sutun":1},{"deger":"250","sutun":3},{"deger":"315","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2}]},{"grup":"Flanş Ölçüleri DIN EN 1092-2 PN 10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","670","780"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","720"]},{"grup":"Weight","kod":"kg","degerler":["11","15","19,5","24","30","44","59","106","158","232","200","310","450","600"]}]}],"teknik_cizim_yolu":"/assets/urunler/yukselen-milli-surgulu-vana-f4-f5-d-008/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Yükselen Milli Sürgülü Vana F4,F5 D-008 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/yukselen-milli-surgulu-vana-f4-f5-d-008/Yükselen Milli Sürgülü Vana F4,F5 D-008 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/yukselen-milli-surgulu-vana-f4-f5-d-008/Yükselen Milli Sürgülü Vana F4,F5 D-008 PDF.pdf"}]})
  },
  {
    id: 26,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Bıçak Sürgülü Vana D-012 (Bıçaklı Vana)',
    slug: 'bicak-surgulu-vana-d-012-bicakli-vana',
    stok_kodu: 'D-012',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/bicak-surgulu-vana-d-012-bicakli-vana.jpg"},"urun_tanimi":{"baslik":"BIÇAK SÜRGÜLÜ VANA (BIÇAKLI VANA)","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 /GS-C25"},{"no":"2","ad":"Conta","malzeme":"Elastomer/EPDM"},{"no":"3","ad":"Sürgü","malzeme":"AISI 304"},{"no":"4","ad":"Salmastra","malzeme":"PTFE/Grafite"},{"no":"5","ad":"Salmastra Baskısı","malzeme":"GG 25 / GGG-40 /GS-C25"},{"no":"6","ad":"Boyunduruk","malzeme":"GG 25 / GGG-40 /GS-C25"},{"no":"7","ad":"Mil","malzeme":"AISI 420"},{"no":"8","ad":"Mil Yatağı","malzeme":"Ms 58/ Bronze/GGG 40"},{"no":"9","ad":"Yatak Somunu","malzeme":"Ms 58/ Bronze/S.S."},{"no":"10","ad":"Volan","malzeme":"MGG 20"},{"no":"11","ad":"Volan Somunu","malzeme":"Mr 58/Bronze/S.S."},{"no":"12","ad":"Gresörlük","malzeme":"St"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["50","65","80","100","125","150","200","250","300","350","400","500","600"],"olculer":[{"grup":"Vana Boyutları Boyut Ölçüleri DIN3202/3-K1","kod":"L","gruplu_degerler":[{"deger":"43","sutun":1},{"deger":"46","sutun":2},{"deger":"52","sutun":2},{"deger":"56","sutun":1},{"deger":"60","sutun":1},{"deger":"68","sutun":1},{"deger":"78","sutun":2},{"deger":"102","sutun":1},{"deger":"127","sutun":1},{"deger":"154","sutun":1}]},{"grup":"","kod":"H","degerler":["320","325","370","390","450","490","610","720","850","935","1115","1265","1440"]},{"grup":"","kod":"D1","gruplu_degerler":[{"deger":"200","sutun":3},{"deger":"225","sutun":2},{"deger":"250","sutun":2},{"deger":"360","sutun":1},{"deger":"315","sutun":1},{"deger":"360","sutun":1},{"deger":"400","sutun":2},{"deger":"500","sutun":1}]},{"grup":"","kod":"ØD","degerler":["165","185","200","220","250","285","340","395","445","505","565","670","760"]},{"grup":"Flanş Ölçüleri DIN 2501/TS 810 PN10","kod":"Øk","degerler":["125","145","160","180","210","240","295","350","400","460","515","620","720"]},{"grup":"","kod":"Ød1xad","gruplu_degerler":[{"deger":"M15x2","sutun":5},{"deger":"M20x2","sutun":2},{"deger":"M20x4","sutun":2},{"deger":"M20x6","sutun":1},{"deger":"M24x6","sutun":2},{"deger":"M27x6","sutun":1}]},{"grup":"","kod":"Ød2xad","gruplu_degerler":[{"deger":"Ø18x2","sutun":5},{"deger":"Ø22x2","sutun":2},{"deger":"Ø22x4","sutun":2},{"deger":"Ø26x6","sutun":3},{"deger":"Ø32x6","sutun":1}]},{"grup":"Flaş Ölçüleri DIN 2501/TS 810 PN10/ 16","kod":"ØD","degerler":["165","185","200","220","250","285","340","405","460","520","580","715","840"]},{"grup":"","kod":"ØK","degerler":["125","145","160","180","210","240","295","355","410","470","525","650","770"]},{"grup":"","kod":"Ød1xad.","gruplu_degerler":[{"deger":"M16x2","sutun":5},{"deger":"M20x2","sutun":1},{"deger":"M20x4","sutun":1},{"deger":"M24x4","sutun":2},{"deger":"M24x6","sutun":1},{"deger":"M27x6","sutun":1},{"deger":"M30x6","sutun":1},{"deger":"M33x6","sutun":1}]},{"grup":"","kod":"Ød2xad.","gruplu_degerler":[{"deger":"Ø18x2","sutun":5},{"deger":"Ø22x2","sutun":1},{"deger":"Ø26x4","sutun":1},{"deger":"Ø26x6","sutun":2},{"deger":"Ø30x6","sutun":1},{"deger":"Ø33x6","sutun":2},{"deger":"Ø36x6","sutun":1}]},{"grup":"Ağırlık","kod":"kg","degerler":["10","11","13","17","20","26","39","54","93","153","165","255","370"]}]}],"teknik_cizim_yolu":"/assets/urunler/bicak-surgulu-vana-d-012-bicakli-vana/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Bıçak Sürgülü Vana D-012 (Bıçaklı Vana) fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/bicak-surgulu-vana-d-012-bicakli-vana/Bıçak Sürgülü Vana D-012 (Bıçaklı Vana) Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/bicak-surgulu-vana-d-012-bicakli-vana/Bıçak Sürgülü Vana D-012 (Bıçaklı Vana) PDF.pdf"}]})
  },
  {
    id: 27,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Flanşlı Kelebek Vana D-113',
    slug: 'flansli-kelebek-vana-d-113',
    stok_kodu: 'D-113',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flansli-kelebek-vana-d-113.jpg"},"urun_tanimi":{"baslik":"FLANŞLI KELEBEK VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GGG 40/50 GSC25 / AISI 304"},{"no":"2","ad":"Klape","malzeme":"GGG-50 GS-C 25 / Al-Bronze"},{"no":"3","ad":"Baskı Çemberi","malzeme":"St37 / 304 / 316"},{"no":"4","ad":"Tahrik Mili","malzeme":"AISI 420 (X20 Cr 13) / 304 / 316"},{"no":"5","ad":"Kısa Mil","malzeme":"AISI 420 (X20 Cr 13) / 304 / 316"},{"no":"6","ad":"Yatak Burcu","malzeme":"TEFLON / PTFE"},{"no":"7","ad":"Mil Kapağı","malzeme":"GGG-50 / GS-C 25 / 304 / 316"},{"no":"8","ad":"Kısa Mil Kapağı","malzeme":"GGG-50 / GS-C 25 / 304 / 316"},{"no":"9","ad":"Sızdırmazlık Ringi","malzeme":"EPDM"},{"no":"10","ad":"Kama","malzeme":"Steel CK - 45"},{"no":"11","ad":"Setskur","malzeme":"Stainless Stell - A2 / A4"},{"no":"12","ad":"O-Ring","malzeme":"EPDM / BUNA - N"},{"no":"13","ad":"İmbus Civata","malzeme":"Stainless Stell - A2"},{"no":"14","ad":"Civata","malzeme":"5 D"},{"no":"15","ad":"Tahrik Kutusu","malzeme":"GGG-50 / St"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["100","125","150","200","250","300","350","400","500","600","700","800","900","1000","1100","1200","1200"],"olculer":[{"grup":"Vana Boyutları DIN 3202/2-F4 BS 5155","kod":"L DIN 3202/F4","degerler":["190","200","210","230","250","270","290","310","330","350","390","430","470","510","550","590","630"]},{"grup":"","kod":"L BS 5155","degerler":["127","140","140","152","165","178","190","216","222","229","267","292","318","330","410","440","470"]},{"grup":"","kod":"e1","degerler":["250","262","284","307","387","423","438","482","515","573","641","729","790","845","920","980","1168"]},{"grup":"","kod":"e2","degerler":["105","117","128","157","213","242","273","299","335","355","430","465","521","576","650","710","765"]},{"grup":"","kod":"e3","degerler":["198","210","232","255","319","355","370","414","447","491","559","599","660","715","790","850","945"]},{"grup":"","kod":"e4","gruplu_degerler":[{"deger":"134","sutun":4},{"deger":"158","sutun":2},{"deger":"172","sutun":3},{"deger":"238","sutun":2},{"deger":"314","sutun":2},{"deger":"366","sutun":3},{"deger":"515","sutun":1}]},{"grup":"","kod":"h1","degerler":["110","125","143","170","212","240","270","295","325","367","430","465","522","570","632","695","752"]},{"grup":"","kod":"h2","gruplu_degerler":[{"deger":"205","sutun":4},{"deger":"255","sutun":2},{"deger":"275","sutun":3},{"deger":"410","sutun":2},{"deger":"476","sutun":2},{"deger":"515","sutun":3},{"deger":"620","sutun":1}]},{"grup":"","kod":"d1","gruplu_degerler":[{"deger":"180","sutun":4},{"deger":"215","sutun":2},{"deger":"250","sutun":3},{"deger":"320","sutun":4},{"deger":"385","sutun":4}]},{"grup":"","kod":"l1","gruplu_degerler":[{"deger":"","sutun":4},{"deger":"260","sutun":1},{"deger":"335","sutun":1},{"deger":"345","sutun":1},{"deger":"375","sutun":1},{"deger":"450","sutun":1},{"deger":"470","sutun":1},{"deger":"545","sutun":1},{"deger":"590","sutun":1},{"deger":"660","sutun":1},{"deger":"720","sutun":1},{"deger":"770","sutun":1},{"deger":"","sutun":1},{"deger":"965","sutun":1}]},{"grup":"FlanşBoyutları TS 810 DIN 2501 BS 4504","kod":"ØD","degerler":["220","250","285","340","395","445","505","565","615","670","780","895","1015","1115","1230","1340","1455"]},{"grup":"","kod":"ØK","degerler":["180","210","240","295","350","400","460","515","565","620","725","840","950","1050","1160","1270","1380"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø18x8","sutun":2},{"deger":"Ø22x8","sutun":2},{"deger":"Ø22x12","sutun":2},{"deger":"Ø22x16","sutun":1},{"deger":"Ø26x16","sutun":1},{"deger":"Ø26x20","sutun":2},{"deger":"Ø30x20","sutun":1},{"deger":"Ø30x24","sutun":1},{"deger":"Ø33x24","sutun":1},{"deger":"Ø33x28","sutun":1},{"deger":"Ø36x28","sutun":1},{"deger":"Ø36x32","sutun":1},{"deger":"Ø39x32","sutun":1}]},{"grup":"","kod":"ØD","degerler":["220","250","285","340","395","445","505","565","615","670","780","895","1015","1115","1230","1340","1455"]},{"grup":"","kod":"ØK","degerler":["180","210","240","295","355","410","470","525","585","650","770","840","950","1050","1170","1270","1380"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø18x8","sutun":2},{"deger":"Ø22x8","sutun":1},{"deger":"Ø22x12","sutun":1},{"deger":"Ø26x12","sutun":2},{"deger":"Ø26x16","sutun":1},{"deger":"Ø30x16","sutun":1},{"deger":"Ø30x20","sutun":1},{"deger":"Ø33x20","sutun":1},{"deger":"Ø36x20","sutun":1},{"deger":"Ø36x24","sutun":1},{"deger":"Ø39x24","sutun":1},{"deger":"Ø39x28","sutun":1},{"deger":"Ø42x28","sutun":1},{"deger":"Ø42x32","sutun":1},{"deger":"Ø49x32","sutun":1}]},{"grup":"","kod":"ØD","degerler":["235","270","300","360","425","485","555","620","670","730","845","960","1085","1185","1320","","1530"]},{"grup":"","kod":"ØK","degerler":["190","220","250","310","370","430","490","550","600","660","770","875","990","1090","1210","","1420"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø22x8","sutun":1},{"deger":"Ø26x8","sutun":2},{"deger":"Ø26x12","sutun":1},{"deger":"Ø30x12","sutun":1},{"deger":"Ø30x16","sutun":1},{"deger":"Ø33x16","sutun":1},{"deger":"Ø36x16","sutun":1},{"deger":"Ø36x20","sutun":2},{"deger":"Ø39x20","sutun":1},{"deger":"Ø42x24","sutun":1},{"deger":"Ø48x24","sutun":1},{"deger":"Ø48x28","sutun":1},{"deger":"Ø56x28","sutun":1},{"deger":"","sutun":1},{"deger":"Ø56x32","sutun":1}]},{"grup":"","kod":"ØD","degerler":["235","270","300","375","450","515","580","660","685","755","890","995","1140","1250","1360","","1530"]},{"grup":"","kod":"ØK","degerler":["190","220","250","320","385","450","510","585","610","670","795","900","1030","1140","1250","","1430"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø22x8","sutun":1},{"deger":"Ø26x8","sutun":2},{"deger":"Ø30x12","sutun":1},{"deger":"Ø33x12","sutun":1},{"deger":"Ø33x16","sutun":1},{"deger":"Ø36x16","sutun":1},{"deger":"Ø39x16","sutun":1},{"deger":"Ø39x20","sutun":1},{"deger":"Ø42x20","sutun":1},{"deger":"Ø48x22","sutun":1},{"deger":"Ø48x24","sutun":1},{"deger":"Ø56x24","sutun":2},{"deger":"Ø56x28","sutun":1},{"deger":"","sutun":1},{"deger":"","sutun":1}]},{"grup":"Ağırlık","kod":"kg","degerler":["30","35","45","50","95","120","160","200","225","300","460","635","790","1020","1355","1710","2400"]}]}],"teknik_cizim_yolu":"/assets/urunler/flansli-kelebek-vana-d-113/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Flanşlı Kelebek Vana D-113 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/flansli-kelebek-vana-d-113/Flanşlı Kelebek Vana D-113 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/flansli-kelebek-vana-d-113/Flanşlı Kelebek Vana D-113 PDF.pdf"}]})
  },
  {
    id: 28,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Lug Kelebek Vana D-036',
    slug: 'lug-kelebek-vana-d-036',
    stok_kodu: 'D-036',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/lug-kelebek-vana-d-036.jpg"},"urun_tanimi":{"baslik":"LUG KELEBEK VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 /50 GS-C 25/AISI 304"},{"no":"2","ad":"Gövde Yatağı","malzeme":"EPMD, BUNA-N"},{"no":"3","ad":"Klape","malzeme":"GGG-40/AISI 316/BRONZE"},{"no":"4","ad":"Mil","malzeme":"AISI 420/AISI 316"},{"no":"5","ad":"O-Ring","malzeme":"EDM,BUNA-N"},{"no":"6","ad":"Baskı Burcu","malzeme":"PVC,PTFE"},{"no":"7","ad":"Segman","malzeme":"St"},{"no":"8","ad":"Rondela","malzeme":"St-37"},{"no":"9","ad":"Civata","malzeme":"5 D/S.S"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["50 2\"","65 2 1/2\"","80 3\"","100 4\"","125 5\"","150 6\"","200 8\"","250 10\"","300 12\"","350 14\"","400 16\"","450 18\"","500 20\"","600 24\""],"olculer":[{"grup":"Vana Boyutarı TS 11341 DIN 3337/K1 ISO 5752/20-5","kod":"C","gruplu_degerler":[{"deger":"43","sutun":1},{"deger":"46","sutun":2},{"deger":"52","sutun":1},{"deger":"56","sutun":2},{"deger":"60","sutun":1},{"deger":"68","sutun":1},{"deger":"78","sutun":2},{"deger":"102","sutun":1},{"deger":"114","sutun":1},{"deger":"127","sutun":1},{"deger":"154","sutun":1}]},{"grup":"","kod":"H1","degerler":["67","74","96","110","122","136","160","201","237","267","302","325","362","422"]},{"grup":"","kod":"H2","degerler":["140","152","159","177","190","203","241","273","311","350","375","400","450","510"]},{"grup":"","kod":"H Kollu","gruplu_degerler":[{"deger":"237","sutun":1},{"deger":"254","sutun":1},{"deger":"283","sutun":1},{"deger":"315","sutun":1},{"deger":"340","sutun":1},{"deger":"367","sutun":1},{"deger":"439","sutun":1},{"deger":"512","sutun":1},{"deger":"600","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"Redektörlü","degerler":["275","294","323","355","380","407","480","553","630","784","844","892","1008","1128"]},{"grup":"","kod":"ØD1","gruplu_degerler":[{"deger":"94","sutun":1},{"deger":"112","sutun":1},{"deger":"126","sutun":1},{"deger":"152","sutun":1},{"deger":"185","sutun":1},{"deger":"210","sutun":1},{"deger":"262","sutun":1},{"deger":"316","sutun":1},{"deger":"372","sutun":1},{"deger":"","sutun":5}]},{"grup":"Üst Flanş Ölçüleri ISO 5211/1 DIN 3337","kod":"ØN","gruplu_degerler":[{"deger":"90","sutun":6},{"deger":"152","sutun":3},{"deger":"175","sutun":3},{"deger":"210","sutun":2}]},{"grup":"","kod":"ØM","gruplu_degerler":[{"deger":"70","sutun":6},{"deger":"125","sutun":3},{"deger":"140","sutun":3},{"deger":"165","sutun":2}]},{"grup":"","kod":"Ød2xAd.","gruplu_degerler":[{"deger":"Ø10x4","sutun":6},{"deger":"Ø14x4","sutun":3},{"deger":"Ø19x4","sutun":3},{"deger":"Ø23x8","sutun":2}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"12","sutun":6},{"deger":"15.5","sutun":3},{"deger":"20","sutun":2},{"deger":"23","sutun":1},{"deger":"25","sutun":2}]},{"grup":"Mil Boyutları DIN 3337 ISO 5211/1","kod":"Ød","gruplu_degerler":[{"deger":"Ø14","sutun":3},{"deger":"Ø16","sutun":3},{"deger":"20","sutun":1},{"deger":"22","sutun":2},{"deger":"28","sutun":1},{"deger":"42","sutun":1},{"deger":"48","sutun":1},{"deger":"52","sutun":1},{"deger":"68","sutun":1}]},{"grup":"","kod":"□ a","gruplu_degerler":[{"deger":"12","sutun":3},{"deger":"14","sutun":3},{"deger":"17","sutun":1},{"deger":"19","sutun":1},{"deger":"25","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"h","gruplu_degerler":[{"deger":"31","sutun":6},{"deger":"38","sutun":3},{"deger":"105","sutun":3},{"deger":"130","sutun":2}]},{"grup":"","kod":"t","gruplu_degerler":[{"deger":"","sutun":9},{"deger":"45","sutun":1},{"deger":"51.5","sutun":1},{"deger":"56","sutun":1},{"deger":"62","sutun":1},{"deger":"72.5","sutun":1}]},{"grup":"","kod":"c","gruplu_degerler":[{"deger":"","sutun":9},{"deger":"12","sutun":1},{"deger":"14","sutun":1},{"deger":"16","sutun":1},{"deger":"18","sutun":1},{"deger":"20","sutun":1}]},{"grup":"Flanş Ölüçeri TS810/DIN2501","kod":"Øk","gruplu_degerler":[{"deger":"110","sutun":1},{"deger":"130","sutun":1},{"deger":"150","sutun":1},{"deger":"170","sutun":1},{"deger":"200","sutun":1},{"deger":"225","sutun":1},{"deger":"280","sutun":1},{"deger":"335","sutun":1},{"deger":"395","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"Ød1xAd.","gruplu_degerler":[{"deger":"M12x4","sutun":2},{"deger":"M16x4","sutun":2},{"deger":"M16x8","sutun":3},{"deger":"M16x12","sutun":1},{"deger":"M20x12","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"Øk","degerler":["125","145","160","180","210","240","295","355","410","470","525","585","650","725"]},{"grup":"","kod":"Ød1xAd.","gruplu_degerler":[{"deger":"M16x4","sutun":2},{"deger":"M16x8","sutun":3},{"deger":"M20x8","sutun":2},{"deger":"M20x12","sutun":2},{"deger":"M20x16","sutun":1},{"deger":"M24x16","sutun":1},{"deger":"M24x20","sutun":2},{"deger":"M27x20","sutun":1}]},{"grup":"","kod":"Øk","degerler":["125","145","160","180","210","240","295","355","410","470","525","585","650","770"]},{"grup":"","kod":"Ød1xAd.","gruplu_degerler":[{"deger":"M12x4","sutun":2},{"deger":"M16x8","sutun":3},{"deger":"M20x8","sutun":1},{"deger":"M20x12","sutun":1},{"deger":"M24x12","sutun":2},{"deger":"M24x16","sutun":1},{"deger":"M27x16","sutun":1},{"deger":"M24x20","sutun":1},{"deger":"M30x20","sutun":1},{"deger":"M33x20","sutun":1}]},{"grup":"Ağırlık","kod":"kg","degerler":["4.6","5.2","6.8","8.5","10.5","12.5","20.2","29.2","46.5","71","107","140","186","267"]}]}],"teknik_cizim_yolu":"/assets/urunler/lug-kelebek-vana-d-036/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Lug Kelebek Vana D-036 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/lug-kelebek-vana-d-036/Lug Kelebek Vana D-036 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/lug-kelebek-vana-d-036/Lug Kelebek Vana D-036 PDF.pdf"}]})
  },
  {
    id: 29,
    kategori_id: 2,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Wafer Kelebek Vana D-032',
    slug: 'wafer-kelebek-vana-d-032',
    stok_kodu: 'D-032',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/wafer-kelebek-vana-d-032.jpg"},"urun_tanimi":{"baslik":"WAFER KELEBEK VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 / 50 GS-C 25/AISI 304"},{"no":"2","ad":"Gövde Yatağı","malzeme":"EPDM,BUNA-N"},{"no":"3","ad":"Klape","malzeme":"GGG-40/AISI 316/BRONZE"},{"no":"4","ad":"Mil","malzeme":"AISI 420/AISI 316"},{"no":"5","ad":"O-Ring","malzeme":"EPDM,BUNA-N"},{"no":"6","ad":"Baskı Burcu","malzeme":"PVC,PTFE"},{"no":"7","ad":"Segman","malzeme":"ST"},{"no":"8","ad":"Rondela","malzeme":"ST37"},{"no":"9","ad":"Civata","malzeme":"5D/S.S"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["50 2\"","65 2 1/2\"","80 3\"","100 4\"","125 5\"","150 6\"","200 8\"","250 10\"","300 12\"","350 14\"","400 16\"","450 18\"","500 20\"","600 24\""],"olculer":[{"grup":"Vana Boyutarı TS 11341 DIN 3337/K1 ISO 5752/20-5","kod":"C","gruplu_degerler":[{"deger":"43","sutun":1},{"deger":"46","sutun":2},{"deger":"52","sutun":1},{"deger":"56","sutun":2},{"deger":"60","sutun":1},{"deger":"68","sutun":1},{"deger":"78","sutun":2},{"deger":"102","sutun":1},{"deger":"114","sutun":1},{"deger":"127","sutun":1},{"deger":"154","sutun":1}]},{"grup":"","kod":"H1","degerler":["67","74","96","110","122","136","160","201","237","267","302","325","362","422"]},{"grup":"","kod":"H2","degerler":["140","152","159","177","190","203","241","273","311","350","375","400","450","510"]},{"grup":"","kod":"H Kollu","gruplu_degerler":[{"deger":"237","sutun":1},{"deger":"254","sutun":1},{"deger":"283","sutun":1},{"deger":"315","sutun":1},{"deger":"340","sutun":1},{"deger":"367","sutun":1},{"deger":"439","sutun":1},{"deger":"512","sutun":1},{"deger":"600","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"Redektörlü","degerler":["275","294","323","355","380","407","480","553","630","784","844","892","1008","1128"]},{"grup":"","kod":"ØD1","gruplu_degerler":[{"deger":"94","sutun":1},{"deger":"112","sutun":1},{"deger":"126","sutun":1},{"deger":"152","sutun":1},{"deger":"185","sutun":1},{"deger":"210","sutun":1},{"deger":"262","sutun":1},{"deger":"316","sutun":1},{"deger":"372","sutun":1},{"deger":"","sutun":5}]},{"grup":"Üst Flanş Ölçüleri ISO 5211/1 DIN 3337","kod":"ØN","gruplu_degerler":[{"deger":"90","sutun":6},{"deger":"152","sutun":3},{"deger":"175","sutun":3},{"deger":"210","sutun":2}]},{"grup":"","kod":"ØM","gruplu_degerler":[{"deger":"70","sutun":6},{"deger":"125","sutun":3},{"deger":"140","sutun":3},{"deger":"165","sutun":2}]},{"grup":"","kod":"Ød2xAd.","gruplu_degerler":[{"deger":"Ø10x4","sutun":6},{"deger":"Ø14x4","sutun":3},{"deger":"Ø19x4","sutun":3},{"deger":"Ø23x8","sutun":2}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"12","sutun":6},{"deger":"15.5","sutun":3},{"deger":"20","sutun":2},{"deger":"23","sutun":1},{"deger":"25","sutun":2}]},{"grup":"Mil Boyutları DIN 3337 ISO 5211/1","kod":"Ød","gruplu_degerler":[{"deger":"Ø14","sutun":3},{"deger":"Ø16","sutun":3},{"deger":"20","sutun":1},{"deger":"22","sutun":2},{"deger":"28","sutun":1},{"deger":"42","sutun":1},{"deger":"48","sutun":1},{"deger":"52","sutun":1},{"deger":"68","sutun":1}]},{"grup":"","kod":"□ a","gruplu_degerler":[{"deger":"12","sutun":3},{"deger":"14","sutun":3},{"deger":"17","sutun":1},{"deger":"19","sutun":1},{"deger":"25","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"h","gruplu_degerler":[{"deger":"31","sutun":6},{"deger":"38","sutun":3},{"deger":"105","sutun":3},{"deger":"130","sutun":2}]},{"grup":"","kod":"t","gruplu_degerler":[{"deger":"","sutun":9},{"deger":"45","sutun":1},{"deger":"51.5","sutun":1},{"deger":"56","sutun":1},{"deger":"62","sutun":1},{"deger":"72.5","sutun":1}]},{"grup":"","kod":"c","gruplu_degerler":[{"deger":"","sutun":9},{"deger":"12","sutun":1},{"deger":"14","sutun":1},{"deger":"16","sutun":1},{"deger":"18","sutun":1},{"deger":"20","sutun":1}]},{"grup":"Flanş Ölüçeri TS810/DIN2501","kod":"Øk","gruplu_degerler":[{"deger":"110","sutun":1},{"deger":"130","sutun":1},{"deger":"150","sutun":1},{"deger":"170","sutun":1},{"deger":"200","sutun":1},{"deger":"225","sutun":1},{"deger":"280","sutun":1},{"deger":"335","sutun":1},{"deger":"395","sutun":1},{"deger":"","sutun":5}]},{"grup":"","kod":"Ød1xAd.","gruplu_degerler":[{"deger":"14x4","sutun":2},{"deger":"18x4","sutun":6},{"deger":"22x4","sutun":3},{"deger":"","sutun":3}]},{"grup":"","kod":"Øk","degerler":["125","145","160","180","210","240","295","355","410","470","525","585","650","725"]},{"grup":"","kod":"Ød1xAd.","gruplu_degerler":[{"deger":"18x4","sutun":5},{"deger":"23x4","sutun":5},{"deger":"27x4","sutun":3},{"deger":"30x4","sutun":1}]},{"grup":"","kod":"Øk","degerler":["125","145","160","180","210","240","295","355","410","470","525","585","650","770"]},{"grup":"","kod":"Ød1xAd.","gruplu_degerler":[{"deger":"18x4","sutun":5},{"deger":"23x4","sutun":2},{"deger":"27x4","sutun":1},{"deger":"24x16","sutun":1},{"deger":"30x4","sutun":3},{"deger":"33x4","sutun":1},{"deger":"36x4","sutun":1}]},{"grup":"Ağırlık","kod":"kg","degerler":["4.6","5.2","6.8","8.5","10.5","12.5","20.2","29.2","46.5","71","107","140","186","267"]}]}],"teknik_cizim_yolu":"/assets/urunler/wafer-kelebek-vana-d-032/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Wafer Kelebek Vana D-032 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/wafer-kelebek-vana-d-032/Wafer Kelebek Vana D-032 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/wafer-kelebek-vana-d-032/Wafer Kelebek Vana D-032 PDF.pdf"}]})
  },
  {
    id: 30,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Şamandıralı Vana D-302',
    slug: 'samandirali-vana-d-302',
    stok_kodu: 'D-302',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/samandirali-vana-d-302.jpg"},"urun_tanimi":{"baslik":"ŞAMANDIRALI VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Burç","malzeme":"Ms 58/1.4021"},{"no":"3","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"4","ad":"Burç","malzeme":"Ms 58/1.4021"},{"no":"5","ad":"Klape","malzeme":"Ms 58/1.4021"},{"no":"6","ad":"Keçe","malzeme":"St 37 / NBR"},{"no":"7","ad":"Mil","malzeme":"1.4021"},{"no":"8","ad":"Conta","malzeme":"EPDM"},{"no":"9","ad":"Civata","malzeme":"8,8"},{"no":"10","ad":"Destek","malzeme":"GG 25 / GGG-40"},{"no":"11","ad":"Kol","malzeme":"St 37"},{"no":"12","ad":"Pim","malzeme":"1.4021"},{"no":"13","ad":"Küre","malzeme":"Bronze / St 37 / SS420 / SS304"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"Vana Boyutları DIN 320/2-F1","kod":"L","degerler":["200","230","290","310","350","400","480","600","730","850"]},{"grup":"","kod":"A","degerler":["1295","1295","1460","1460","1535","1850","1850","2145","2345","2995"]},{"grup":"","kod":"B","degerler":["1562","1562","1755","1755","1890","2305","2305","2995","3150","3700"]},{"grup":"","kod":"H","degerler":["172","172","305","305","330","340","340","340","455","455"]},{"grup":"","kod":"J","degerler":["463","463","545","545","546","721","721","907","1150","1502"]},{"grup":"","kod":"Ød","gruplu_degerler":[{"deger":"280","sutun":2},{"deger":"320","sutun":2},{"deger":"350","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2}]},{"grup":"Flanş Ölçüleri DIN 2501 / TS 810 PN 10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445"]},{"grup":"","kod":"K","degerler":["110","125","145","160","180","210","240","295","350","400"]},{"grup":"Flanş Ölçüleri DIN 2501 / TS 810 PN 10","kod":"D","degerler":["150","165","185","200","220","250","285","340","405","460"]},{"grup":"","kod":"K","degerler":["110","125","145","160","180","210","240","295","355","410"]},{"grup":"Ağırlık","kod":"kg","degerler":["19","20","30","35","55","70","100","180","270","370"]}]}],"teknik_cizim_yolu":"/assets/urunler/samandirali-vana-d-302/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Şamandıralı Vana D-302 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/samandirali-vana-d-302/Şamandıralı Vana D-302 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/samandirali-vana-d-302/Şamandıralı Vana D-302 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-yollu-vana-d-324.jpg"},"urun_tanimi":{"baslik":"3 YOLLU VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 / GSC 25 / SS 304 / 316 / Bronze Rg-5"},{"no":"2","ad":"Tapa","malzeme":"GG 25 / GGG-40 / GSC 25 / SS 304 / 316 / Bronze Rg-5"},{"no":"3","ad":"Conta","malzeme":"EPDN /Klingerit"},{"no":"4","ad":"Kapak","malzeme":"GG 25 / GGG-40 / GSC 25 / SS 304 / 316 / Bronze Rg-5"},{"no":"5","ad":"Salmastra","malzeme":"PTFE + Graphite"},{"no":"6","ad":"Glend","malzeme":"GG 25 / GGG-40 / GSC 25 / SS 304 / 316 / Bronze Rg-5"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["25","32","40","50","65","80","100"],"olculer":[{"grup":"Vana Boyutları BS 1735","kod":"L","degerler":["165","203","222","241","267","305","256"]},{"grup":"","kod":"l","degerler":["130","150","175","190","210","265","310"]},{"grup":"","kod":"E","degerler":["149","165","189","211","246","260","304"]},{"grup":"","kod":"F","degerler":["57","65","76","95","114","143","172"]},{"grup":"","kod":"P","degerler":["214","230","270","292","340","360","405"]},{"grup":"","kod":"J","gruplu_degerler":[{"deger":"27","sutun":2},{"deger":"32","sutun":1},{"deger":"38","sutun":1},{"deger":"41","sutun":1},{"deger":"48","sutun":1},{"deger":"51","sutun":1}]},{"grup":"","kod":"K","gruplu_degerler":[{"deger":"27","sutun":2},{"deger":"32","sutun":1},{"deger":"38","sutun":1},{"deger":"51","sutun":3}]},{"grup":"Flanş Ölçüleri DIN EN 1092 ASA 125 / ASA 150 BS 4504","kod":"D","degerler":["115","140","150","165","185","200","220"]},{"grup":"","kod":"k","degerler":["85","100","110","125","145","160","180"]},{"grup":"","kod":"D","degerler":["115","140","150","165","185","200","500"]},{"grup":"","kod":"k","degerler":["85","100","110","125","145","160","285"]},{"grup":"","kod":"D","degerler":["110","125","145","160","180","210","240"]},{"grup":"","kod":"k","degerler":["79","89","98,5","120,7","139,7","152,4","190,5"]},{"grup":"Ağırlık","kod":"kg","degerler":["6,5","10,5","12","20,5","28","36","66"]}]}]})
  },
  {
    id: 34,
    kategori_id: 6,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Pislik Tutucu D-041',
    slug: 'pislik-tutucu-d-041',
    stok_kodu: 'D-041',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pislik-tutucu-d-041.jpg"},"urun_tanimi":{"baslik":"PİSLİK TUTUCU","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 / 50"},{"no":"2","ad":"Filtre","malzeme":"AISI 304"},{"no":"3","ad":"Contra","malzeme":"Klingerit / Franzelit"},{"no":"4","ad":"Kapak","malzeme":"GG 25 / GGG-40 / 50"},{"no":"5","ad":"Civata","malzeme":"5 D /S.S"},{"no":"6","ad":"Tapa","malzeme":"GG 25/Ms 58/S.S"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","200","250","300","350","400"],"olculer":[{"grup":"Vana Ölçüleri TS 11494 DIN 3202/2-F1","kod":"L","degerler":["130","150","160","180","200","230","290","310","350","400","480","600","730","850","980","1100"]},{"grup":"","kod":"H (Min)","degerler":["60","70","80","85","120","135","185","205","245","290","330","390","530","560","620","710"]},{"grup":"","kod":"H (Max)","degerler":["100","120","140","150","190","220","310","340","410","470","530","620","850","1050","1100","1210"]},{"grup":"Filtre Özellikleri","kod":"B","degerler":["52","62","72","77","97","112","168","188","218","243","281","317","485","520","560","610"]},{"grup":"","kod":"S","degerler":["25","25","29","38","50","60","65","85","105","130","160","210","260","310","360","410"]},{"grup":"","kod":"V","gruplu_degerler":[{"deger":"0.35","sutun":4},{"deger":"0.40","sutun":4},{"deger":"0.50","sutun":8}]},{"grup":"","kod":"W","gruplu_degerler":[{"deger":"0.65","sutun":4},{"deger":"0.85","sutun":4},{"deger":"0.93","sutun":8}]},{"grup":"Tapa Ölçüleri","kod":"D1","gruplu_degerler":[{"deger":"","sutun":5},{"deger":"R7/8\"","sutun":8},{"deger":"R 1","sutun":3}]},{"grup":"Flanş Ölçüleri TS 810/DIN 2501 PN 6","kod":"D","degerler":["80","90","100","120","130","140","160","190","210","240","265","320","375","400","490","540"]},{"grup":"","kod":"k","degerler":["55","65","75","90","100","110","130","150","170","210","225","280","335","395","445","495"]},{"grup":"Flanş Ölçüleri TS 810/DIN 2501 PN 10","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","340","395","445","505","565"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","180","210","240","295","350","400","460","515"]},{"grup":"Flanş Ölçüleri TS 810/DIN 2501 PN 10","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","340","405","460","520","580"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","180","210","240","295","355","410","470","525"]},{"grup":"Ağırlık","kod":"kg","degerler":["1.97","2. 98","3.7","5.6","7.6","9.8","15.7","24.9","34","43","54","118","177","275","310","418"]}]}],"teknik_cizim_yolu":"/assets/urunler/pislik-tutucu-d-041/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Pislik Tutucu D-041 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/pislik-tutucu-d-041/Pislik Tutucu D-041 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pislik-tutucu-d-041/Pislik Tutucu D-041 PDF.pdf"}]})
  },
  {
    id: 35,
    kategori_id: 1,
    kategori_adi: 'Su Grubu Vanaları',
    ad: '3 Parçalı Tam Geçişli Küresel D-056',
    slug: '3-parcali-tam-gecisli-kuresel-d-056',
    stok_kodu: 'D-056',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-tam-gecisli-kuresel-d-056.jpg"},"urun_tanimi":{"baslik":"3 PARÇALI TAM GEÇİŞLİ KÜRESEL VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 SS / GS-C 25 / Bronze"},{"no":"2","ad":"Contra","malzeme":"PTFE"},{"no":"3","ad":"Mil","malzeme":"AISI 304 / AISI 316"},{"no":"4","ad":"Contra","malzeme":"PTFE"},{"no":"5","ad":"Baskı Burcu","malzeme":"Ms 58 / AISI 304"},{"no":"6","ad":"Hareket Pulu","malzeme":"St 37 / AISI 304"},{"no":"7","ad":"Kol","malzeme":"St 37 / AISI 304"},{"no":"8","ad":"Rondela","malzeme":"St 37 / AISI 304"},{"no":"9","ad":"Somun","malzeme":"5 D/SS"},{"no":"10","ad":"Küre","malzeme":"AISI 304 / AISI 316 / Bronze"},{"no":"11","ad":"Ring","malzeme":"PTFE"},{"no":"12","ad":"Flanş","malzeme":"GG 25 / GGG-40 SS / GS-C 25 / Bronze"},{"no":"13","ad":"Saplama","malzeme":"5.6 / SS"},{"no":"14","ad":"Rondela","malzeme":"St 37 / AISI 304"},{"no":"15","ad":"Somun","malzeme":"5 D/SS"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150"],"olculer":[{"grup":"Vana Ölçüleri TS 11494 DIN 3202/2-F1","kod":"L","degerler":["130","150","160","180","200","230","290","310","350","400","350"]},{"grup":"","kod":"G (Max)","degerler":["160","180","180","250","300","320","350","450","500","700","700"]},{"grup":"","kod":"H (Max)","degerler":["95","110","115","130","135","145","155","195","220","265","300"]},{"grup":"Flanş Ölçüleri","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","180","210","240"]},{"grup":"Flanş Ölçüleri TS 810/DIN 2501 PN 6","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","235","270"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","190","220","250"]},{"grup":"Flanş Ölçüleri TS 810/DIN 2501 PN 6","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","235","270"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","190","220","250"]},{"grup":"Ağırlık","kod":"kg","degerler":["1.97","2. 98","3.7","5.6","7.6","9.8","15.7","24.9","34","43","54"]}]}],"teknik_cizim_yolu":"/assets/urunler/3-parcali-tam-gecisli-kuresel-d-056/teknik-cizim.png","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/3-parcali-tam-gecisli-kuresel-d-056/3 Parçalı Tam Geçişli Küresel D-056 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/calpara-cekvalf-flansli-d-026.jpg"},"urun_tanimi":{"baslik":"ÇALPARA ÇEKVALF FLANŞLI","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 /GS-C 25"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58 Bronze"},{"no":"3","ad":"Klape","malzeme":"GG 25 / GGG-40 /GS-C 25"},{"no":"4","ad":"Klape Burcu","malzeme":"EPDM/304/BRONZE"},{"no":"5","ad":"Klape Kolu","malzeme":"GGG 40/50"},{"no":"6","ad":"Pim","malzeme":"Ms 58 / 304 Broze"},{"no":"7","ad":"Mil","malzeme":"Ms 58 / 304 Broze"},{"no":"8","ad":"Conta","malzeme":"EPDM /KRİNGELİT"},{"no":"9","ad":"Kapak","malzeme":"GG 25 / GGG-40 /GS-C 25"},{"no":"10","ad":"Civata","malzeme":"5 D /Pas . Çelik"},{"no":"11","ad":"Kol","malzeme":"GGG 40/50"},{"no":"12","ad":"Kol Ağırlığı","malzeme":"GG 20"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","450","500","600","700","800","900","1000","1200"],"olculer":[{"grup":"Vana Boyutları TS 457 /1 DIN 3202/2-F6 Flanş Ölçüleri DIN EN 558-1/48","kod":"L","degerler":["180","200","240","260","300","350","400","500","600","700","800","900","1000","1100","1300","1500","1700","1900","2100","2500"]},{"grup":"","kod":"H","degerler":["100","110","130","145","170","195","205","260","340","370","400","450","500","630","700","800","900","1000","1100","1300"]},{"grup":"","kod":"B","gruplu_degerler":[{"deger":"Ø112","sutun":2},{"deger":"Ø152","sutun":1},{"deger":"Ø158","sutun":2},{"deger":"Ø240","sutun":1},{"deger":"Ø275","sutun":1},{"deger":"Ø336","sutun":1},{"deger":"Ø400","sutun":1},{"deger":"Ø450","sutun":1},{"deger":"Ø500","sutun":1},{"deger":"Ø550","sutun":1},{"deger":"Ø600","sutun":1},{"deger":"Ø700","sutun":1},{"deger":"Ø820","sutun":1},{"deger":"Ø1000","sutun":1},{"deger":"Ø1100","sutun":1},{"deger":"Ø1200","sutun":1},{"deger":"Ø1400","sutun":1},{"deger":"Ø1650","sutun":1}]},{"grup":"","kod":"a","degerler":["200","300","400","600","800","1100","1200","","","","","","","","","","","","",""]},{"grup":"By-Pass","kod":"Øe","degerler":["Ø15","Ø25","Ø40","Ø50","Ø65","Ø80","Ø100","Ø125","","","","","","","","","","","",""]},{"grup":"Flanş Ölçüleri DIN EN 1092-1-2 PN 10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","615","670","780","895","1015","1115","1230","1455"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","295","460","515","565","620","725","840","950","1050","1160","1380"]},{"grup":"Flanş Ölçüleri DIN EN 1092-1-2 PN 16","kod":"D","degerler":["150","165","185","200","220","250","285","340","405","460","520","580","640","715","840","910","1025","1125","1255","1485"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","355","410","470","525","585","650","770","840","950","1050","1170","1390"]},{"grup":"Flanş Ölçüleri DIN EN 1092-1-2 PN 25","kod":"D","degerler":["150","165","185","200","235","270","300","360","425","485","555","620","670","730","845","960","1085","1185","1320","1530"]},{"grup":"","kod":"k","degerler":["110","125","145","160","190","220","250","310","370","430","490","550","600","660","770","875","990","1090","1210","1420"]},{"grup":"Flanş Ölçüleri DIN EN 1092-1-2 PN 40","kod":"D","degerler":["150","165","185","200","235","270","300","375","450","515","580","660","685","755","890","995","1140","1250","1360","1575"]},{"grup":"","kod":"k","degerler":["110","125","145","160","190","220","250","320","385","450","510","585","610","670","795","900","1030","1140","1250","1460"]},{"grup":"Ağırlık","kod":"kg","degerler":["10","11,5","16,5","21","27,5","45","65","120","150","205","350","430","625","765","970","1450","2380","3335","3780","4550"]}]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Çalpara Çekvalf Flanşlı D-026 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/calpara-cekvalf-flansli-d-026/Çalpara Çekvalf Flanşlı D-026 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/calpara-cekvalf-flansli-d-026/Çalpara Çekvalf Flanşlı D-026 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/toplu-cekvalf-d-030.jpg"},"urun_tanimi":{"baslik":"TOPLU ÇEKVALF","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 / 50"},{"no":"2","ad":"Küre","malzeme":"NBR + (GG-25) St - 37"},{"no":"3","ad":"Kapak","malzeme":"GG 25 / GGG-40 / 50"},{"no":"4","ad":"Contra","malzeme":"NBR"},{"no":"5","ad":"Civata","malzeme":"5D / Paslanmaz Çelik"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"Vana Boyutları DIN / 3202/2-F6","kod":"L","degerler":["180","200","240","260","300","350","400","500","600","700"]},{"grup":"","kod":"H","degerler":["100","110","130","145","170","195","205","260","390","500"]},{"grup":"Flanş Ölçüleri DIN 2501/TS 810 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400"]},{"grup":"Ağırlık","kod":"kg","degerler":["8","9","12","14","22","30","49","98","125","240"]}]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Toplu Çekvalf D-030 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/toplu-cekvalf-d-030/Toplu Çekvalf D-030 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/toplu-cekvalf-d-030/Toplu Çekvalf D-030 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/tilting-cekvalf-d-128.jpg"},"urun_tanimi":{"baslik":"TİLTİNG ÇEKVALF","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GGG- 50"},{"no":"2","ad":"Klape","malzeme":"GGG- 50"},{"no":"3","ad":"Baskı Çemberi","malzeme":"St"},{"no":"4","ad":"Tahrik Mili","malzeme":"AISI 420 (X20 Cr13)"},{"no":"5","ad":"Yatak Burcu","malzeme":"Delrin , PTFE"},{"no":"6","ad":"Mil Kapağı","malzeme":"GGG-50"},{"no":"7","ad":"Sızdırmazlık Ringi","malzeme":"EPDM"},{"no":"8","ad":"Kol","malzeme":"Steel St-37"},{"no":"9","ad":"Ağırlık","malzeme":"GG-25"},{"no":"10","ad":"Kama","malzeme":"Steel Ck-45"},{"no":"11","ad":"Setskur","malzeme":"Stainless Steel - A2"},{"no":"12","ad":"O-Ring","malzeme":"EPDM , BUNA-N"},{"no":"13","ad":"İmbus Civata","malzeme":"Stainless Steel - A2"},{"no":"14","ad":"Civata","malzeme":"5 D"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["100","125","150","200","250","300","350","400","450","500","600","700","800","900","1000","1200","1400"],"olculer":[{"grup":"Vana Boyutları DIN / 3202/2-F4 BS 5155","kod":"DIN 3202 F4 L","degerler":["190","200","210","230","250","270","290","310","330","350","390","430","470","510","550","630","710"]},{"grup":"","kod":"BS 5155 L","degerler":["127","140","140","152","165","178","190","216","222","229","267","292","318","330","410","470",""]},{"grup":"","kod":"e1","degerler":["192","215","238","263","313","326","388","418","470","495","592","688","715","825","832","1000","1246"]},{"grup":"","kod":"e2","degerler":["160","183","206","231","276","289","346","376","420","453","540","623","656","740","764","900","1100"]},{"grup":"","kod":"h1","degerler":["135","156","180","220","265","305","357","395","440","490","580","635","713","795","890","1042","1200"]},{"grup":"","kod":"h2","gruplu_degerler":[{"deger":"189","sutun":4},{"deger":"280","sutun":2},{"deger":"372","sutun":2},{"deger":"405","sutun":1},{"deger":"460","sutun":1},{"deger":"555","sutun":1},{"deger":"642","sutun":1},{"deger":"735","sutun":1},{"deger":"830","sutun":1},{"deger":"920","sutun":1},{"deger":"1087","sutun":1},{"deger":"1280","sutun":1}]},{"grup":"","kod":"l1","gruplu_degerler":[{"deger":"200","sutun":4},{"deger":"300","sutun":2},{"deger":"400","sutun":2},{"deger":"450","sutun":1},{"deger":"500","sutun":1},{"deger":"600","sutun":1},{"deger":"700","sutun":1},{"deger":"800","sutun":1},{"deger":"900","sutun":1},{"deger":"100","sutun":1},{"deger":"1200","sutun":1},{"deger":"1400","sutun":1}]},{"grup":"","kod":"l2","degerler":["220","250","285","340","260","335","345","375","450","470","545","590","660","720","770","965","965"]},{"grup":"Flanş Ölçüleri TS810/DIN 2501 BS 4504","kod":"ØD","degerler":["220","250","285","340","395","445","505","565","615","670","780","895","1015","1115","1230","1455","1675"]},{"grup":"","kod":"ØK","degerler":["180","210","240","295","350","400","460","515","565","620","725","840","950","1050","1160","1380","1590"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø18x8","sutun":2},{"deger":"Ø22x8","sutun":2},{"deger":"Ø22x12","sutun":2},{"deger":"Ø22x16","sutun":1},{"deger":"Ø26x16","sutun":1},{"deger":"Ø26x20","sutun":2},{"deger":"Ø30x20","sutun":1},{"deger":"Ø30x24","sutun":1},{"deger":"Ø33x24","sutun":1},{"deger":"Ø33x28","sutun":1},{"deger":"Ø36x28","sutun":1},{"deger":"Ø39x32","sutun":1},{"deger":"Ø43x36","sutun":1}]},{"grup":"","kod":"ØD","gruplu_degerler":[{"deger":"220","sutun":1},{"deger":"250","sutun":1},{"deger":"285","sutun":1},{"deger":"340","sutun":1},{"deger":"405","sutun":1},{"deger":"460","sutun":1},{"deger":"520","sutun":1},{"deger":"580","sutun":1},{"deger":"640 715","sutun":3},{"deger":"840","sutun":1},{"deger":"910","sutun":1},{"deger":"1025","sutun":1},{"deger":"1125","sutun":1},{"deger":"1485","sutun":1},{"deger":"1685","sutun":1}]},{"grup":"","kod":"ØK","degerler":["180","210","240","295","355","410","470","525","585","650","770","840","950","1050","1160","1380","1590"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø18x8","sutun":2},{"deger":"Ø22x8","sutun":1},{"deger":"Ø22x12","sutun":1},{"deger":"Ø26x12","sutun":2},{"deger":"Ø26x16","sutun":1},{"deger":"Ø30x16","sutun":1},{"deger":"Ø30x20","sutun":1},{"deger":"Ø33x20","sutun":1},{"deger":"Ø36x20","sutun":1},{"deger":"Ø36x24","sutun":1},{"deger":"Ø39x24","sutun":1},{"deger":"Ø39x28","sutun":1},{"deger":"Ø42x28","sutun":1},{"deger":"Ø49x32","sutun":1},{"deger":"Ø49x36","sutun":1}]},{"grup":"","kod":"ØD","degerler":["235","270","300","360","425","485","555","620","670","730","845","960","1085","1185","1320","1530","1755"]},{"grup":"","kod":"ØK","degerler":["190","220","250","310","370","430","490","550","600","660","770","875","990","1090","1210","1420","1640"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø22x8","sutun":1},{"deger":"Ø26x8","sutun":2},{"deger":"Ø26x12","sutun":1},{"deger":"Ø30x12","sutun":1},{"deger":"Ø30x16","sutun":1},{"deger":"Ø36x16","sutun":1},{"deger":"Ø36x20","sutun":2},{"deger":"Ø39x20","sutun":1},{"deger":"Ø42x24","sutun":1},{"deger":"Ø48x24","sutun":1},{"deger":"Ø48x28","sutun":1},{"deger":"Ø56x28","sutun":1},{"deger":"Ø56x32","sutun":1},{"deger":"Ø62x36","sutun":1},{"deger":"350","sutun":1}]},{"grup":"","kod":"ØD","degerler":["235","270","300","375","450","515","580","660","685","755","890","995","1140","1250","1360","1575","1795"]},{"grup":"","kod":"ØK","degerler":["190","220","250","320","285","450","510","585","610","670","795","900","1030","1140","1250","1460","1680"]},{"grup":"","kod":"Ød2xn","gruplu_degerler":[{"deger":"Ø22x8","sutun":1},{"deger":"Ø26x8","sutun":2},{"deger":"Ø30x12","sutun":1},{"deger":"Ø33x12","sutun":1},{"deger":"Ø33x16","sutun":1},{"deger":"Ø36x16","sutun":1},{"deger":"Ø39x16","sutun":1},{"deger":"Ø39x20","sutun":1},{"deger":"Ø42x20","sutun":1},{"deger":"Ø48x20","sutun":1},{"deger":"Ø48x24","sutun":1},{"deger":"Ø56x24","sutun":1},{"deger":"Ø56x28","sutun":2},{"deger":"Ø62x32","sutun":1},{"deger":"Ø62x36","sutun":1}]},{"grup":"Ağırlık","kod":"kg","degerler":["20","28","36","50","70","110","145","180","240","280","410","540","680","1050","1250","2100","3400"]}]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Tilting Çekvalf D-128 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/tilting-cekvalf-d-128/Tilting Çekvalf D-128 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/tilting-cekvalf-d-128/Tilting Çekvalf D-128 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hidrolik-pompali-cek-kelebek-vana-d-133.jpg"},"urun_tanimi":{"baslik":"HİDROLİK POMPALI ÇEK KELEBEK VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"PİRİNÇ (CuZn40Pb2) (SICAK PRES)/GGG-50"},{"no":"2","ad":"Klavuz","malzeme":"PASLANMAZ ÇELİK/GGG-50"},{"no":"3","ad":"Klape","malzeme":"PASLANMAZ ÇELİK/GGG-50"},{"no":"4","ad":"Yaylar","malzeme":"PASLANMAZ ÇELİK/S.S"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","200"],"olculer":[{"grup":"Yaylı","kod":"→ ←","gruplu_degerler":[{"deger":"21","sutun":9},{"deger":"22","sutun":1},{"deger":"23.5","sutun":1},{"deger":"24","sutun":1}]},{"grup":"","kod":"↓","gruplu_degerler":[{"deger":"17","sutun":2},{"deger":"18.3","sutun":1},{"deger":"16.3","sutun":1},{"deger":"16.2","sutun":1},{"deger":"16.1","sutun":1},{"deger":"15","sutun":1},{"deger":"13.7","sutun":1},{"deger":"12.5","sutun":1},{"deger":"12","sutun":1},{"deger":"13","sutun":1},{"deger":"14.5","sutun":1}]},{"grup":"","kod":"↑","gruplu_degerler":[{"deger":"23","sutun":4},{"deger":"24","sutun":1},{"deger":"25","sutun":2},{"deger":"26","sutun":1},{"deger":"26.5","sutun":1},{"deger":"30","sutun":1},{"deger":"32.5","sutun":1},{"deger":"35","sutun":1}]},{"grup":"Yaysız","kod":"↓","gruplu_degerler":[{"deger":"2.6","sutun":3},{"deger":"3.9","sutun":1},{"deger":"4","sutun":1},{"deger":"4.2","sutun":1},{"deger":"5.1","sutun":1},{"deger":"5.6","sutun":1},{"deger":"7.4","sutun":1},{"deger":"15","sutun":1},{"deger":"17","sutun":1},{"deger":"18.5","sutun":1}]},{"grup":"Anma Çapı","kod":"DN","degerler":["15","20","25","32","40","50","65","80","100","125","150","200"]},{"grup":"Vana Boyutları DIN 3202 / 3 - K4","kod":"Ød","degerler":["40","47","56","72","82","95","115","132","152","184","209","264"]},{"grup":"","kod":"Ød1","degerler":["15","20","25","31.5","39","48","64","74","89","112","132","175"]},{"grup":"","kod":"L","degerler":["16","19","22","28","31.5","40","46","50","60","90","106","140"]},{"grup":"Ağırlık","kod":"kg","degerler":["0.094","0.134","0.202","0.458","0.620","0.976","1.360","2.078","3.030","6.80","10.00","20.00"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/hidrolik-pompali-cek-kelebek-vana-d-133/Hidrolik Pompalı Çek Kelebek Vana D-133 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yayli-dip-klapesi-d-045.jpg"},"urun_tanimi":{"baslik":"YAYLI DİP KLAPESİ","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40 / GS-C 25 BRONZE/SS(Pas.Çelik)"},{"no":"2","ad":"Klape","malzeme":"GG-25/AISI 304/ Bronze"},{"no":"3","ad":"Conta","malzeme":"NBR/EPDM"},{"no":"4","ad":"Mil","malzeme":"1.402/Bronze"},{"no":"5","ad":"Yay","malzeme":"AISI 302 (1.430)"},{"no":"6","ad":"Burc","malzeme":"BRONZE"},{"no":"7","ad":"Kayıt","malzeme":"GG 25 / GGG-40 / GS-C 25"},{"no":"8","ad":"Flanş","malzeme":"GG 25 / GGG-40 / GS-C 25 BRONZE/SS(Pas.Çelik)"},{"no":"9","ad":"Filtre","malzeme":"AISI 304/RSt-37-2"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500"],"olculer":[{"grup":"Vana Boyutları TS 457 /1 DIN / 3352 / 24","kod":"L","degerler":["85","100","120","140","170","200","230","288","354","395","472","560","670"]},{"grup":"","kod":"H","degerler":["185","200","245","280","320","400","450","510","600","650","735","860","1020"]},{"grup":"","kod":"Ød","degerler":["71","81","101","111","140","161","190","235","295","345","410","454","554"]},{"grup":"","kod":"s","gruplu_degerler":[{"deger":"1.5","sutun":6},{"deger":"2","sutun":6},{"deger":"2.5","sutun":1}]},{"grup":"Flanş Ölçüleri DIN 2501 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","670"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620"]},{"grup":"Flanş Ölçüleri DIN 2501 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","405","460","470","525","650"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","355","410","470","525","650"]},{"grup":"Flanş Ölçüleri DIN 2501 PN10","kod":"D","degerler":["150","152.7","178","190.5","229","254","279.5","343","406.5","483","533.5","597","698.5"]},{"grup":"","kod":"k","degerler":["110","120.7","139.7","152.4","190.5","216","241.3","298.5","362","431.4","476.3","593.8","635"]},{"grup":"Ağırlık","kod":"kg","degerler":["6.2","8.8","11","14","19.5","30.5","39.5","64.5","110","156","250","342","590"]}]}],"teknik_cizim_yolu":"/assets/urunler/yayli-dip-klapesi-d-045/teknik-cizim.png","dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Yaylı Dip Klapesi D-045 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/yayli-dip-klapesi-d-045/Yaylı Dip Klapesi D-045 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/yayli-dip-klapesi-d-045/Yaylı Dip Klapesi D-045 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/tek-kureli-vantuz-d-123.jpg"},"urun_tanimi":{"baslik":"TEK KÜREKLİ VANTUZ","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Küre","malzeme":"ST37+Perbunan"},{"no":"3","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"4","ad":"Conta","malzeme":"EPDM"},{"no":"5","ad":"Conta","malzeme":"EPDM / KLİNGERİT"},{"no":"6","ad":"Toz Kapağı","malzeme":"GG 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["B","H","ØD","ØK","Ağırlık","ØD","ØK","ağırlık"],"olculer":[{"grup":"","kod":"50","degerler":["160","230","165","125","8","165","165","9"]},{"grup":"","kod":"80","degerler":["250","290","160","200","17","200","160","19"]},{"grup":"","kod":"100","degerler":["270","330","180","220","18","235","195","20"]},{"grup":"","kod":"150","degerler":["310","435","240","285","50","300","250","55"]},{"grup":"","kod":"200","degerler":["310","440","295","340","55","360","310","61"]}]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Tek Küreli Vantuz D-123 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/tek-kureli-vantuz-d-123/Tek Küreli Vantuz D-123 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/tek-kureli-vantuz-d-123/Tek Küreli Vantuz D-123 PDF.pdf"}]})
  },
  {
    id: 48,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Çift Küreli Vantuz D-124',
    slug: 'cift-kureli-vantuz-d-124',
    stok_kodu: 'D-124',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-kureli-vantuz-d-124.jpg"},"urun_tanimi":{"baslik":"ÇİFT KÜRELİ VANTUZ","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Gövde Burcu","malzeme":"ST37+Perbunan"},{"no":"3","ad":"Küre","malzeme":"GG 25 / GGG-40"},{"no":"4","ad":"Klape","malzeme":"EPDM"},{"no":"5","ad":"Mil","malzeme":"EPDM / KLİNGERİT"},{"no":"6","ad":"Orta Kapak","malzeme":"GG 25 / GGG-40"},{"no":"7","ad":"Conta","malzeme":"EPDM/KLİNGERİT"},{"no":"8","ad":"Sibob","malzeme":"Ms 58"},{"no":"9","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"10","ad":"Salmastra","malzeme":"Teflon/Graphite"},{"no":"11","ad":"Baskı","malzeme":"Ms 58/Bronze/S.S"},{"no":"12","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"13","ad":"Conta","malzeme":"EPDM/KLİNGERİT"},{"no":"14","ad":"Üst Kapak","malzeme":"GG 25 / GGG-40"},{"no":"15","ad":"El Çarkı","malzeme":"GG 25"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["d1","H","L","B","ØD","ØK","Ağırlık","ØD","ØK","Ağırlık"],"olculer":[{"grup":"","kod":"50","degerler":["200","320","400","160","165","125","23","165","125","25.5"]},{"grup":"","kod":"80","degerler":["250","415","650","250","200","160","65,5","200","160","69"]},{"grup":"","kod":"100","degerler":["250","470","680","270","220","180","63,7","235","190","70"]},{"grup":"","kod":"150","degerler":["400","570","760","310","285","240","130","300","250","130"]},{"grup":"","kod":"200","degerler":["400","675","910","380","340","295","240","360","310","264"]},{"grup":"","kod":"250","degerler":["500","675","900","380","405","355","253","425","370","278"]}]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Çift Küreli Vantuz D-124 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/cift-kureli-vantuz-d-124/Çift Küreli Vantuz D-124 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/cift-kureli-vantuz-d-124/Çift Küreli Vantuz D-124 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323.jpg"},"urun_tanimi":{"baslik":"SEVİYE GÖSTERGELİ İNDİKTATÖRLÜ SÜRGÜLÜ VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40"},{"no":"2","ad":"Gövde Burcu","malzeme":"Ms 58/Bronze/S.S"},{"no":"3","ad":"DN40...100 Sürgü","malzeme":"Ms 58/Bronze/S.S"},{"no":"DN125...900 Sürgü","ad":"GG 25 / GGG-40","malzeme":""},{"no":"4","ad":"Sürgü Burcu","malzeme":"Ms 58/Bronze/S.S"},{"no":"5","ad":"Sürgü Somunu Sadece 125...900","malzeme":"Ms 58/Bronze/GGG 40"},{"no":"6","ad":"Mil","malzeme":"Ms 58/Bronze/S.S"},{"no":"7","ad":"Conta","malzeme":"EPDM/FRANZELİT/KLİNGERİT"},{"no":"8","ad":"Kapak","malzeme":"GG 25 / GGG-40"},{"no":"9","ad":"Civata","malzeme":"5 D /S.S"},{"no":"10","ad":"Mil Somunu","malzeme":"Ms 58/Bronze/S.S"},{"no":"11","ad":"O-Ring","malzeme":"Epdm"},{"no":"12","ad":"Gösterge","malzeme":"Ms 58/S.S"},{"no":"13","ad":"Gösterge Pimi","malzeme":"Ms 58/S.S"},{"no":"14","ad":"Volan","malzeme":"GG 20"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600","700","800","900"],"olculer":[{"grup":"Vana Boyutları TS 457/1 DIN 3352/2-F4","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390","430","470","510"]},{"grup":"","kod":"H","degerler":["190","235","260","290","310","435","455","580","720","815","925","1030","1265","1450","1650","1860","1990"]},{"grup":"","kod":"D1","gruplu_degerler":[{"deger":"160","sutun":4},{"deger":"200","sutun":1},{"deger":"250","sutun":3},{"deger":"315","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2},{"deger":"630","sutun":1},{"deger":"800","sutun":2}]},{"grup":"Flanş Ölçüleri DIN 2501/TS 810 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","670","780","895","1015","1115"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","725","840","950","1050"]},{"grup":"Ağırlık","kod":"kg","degerler":["8.5","10.5","14","16","22.5","37.5","45","82","125","178","228","293","465","685","875","1205","1405"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/seviye-gostergeli-indikatorlu-surgulu-vana-trafo-vanasi-d-323/Seviye Göstergeli İndikatörlü Sürgülü Vana (Trafo Vanası) D-323 PDF.pdf"}]})
  },
  {
    id: 51,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'FlapVana-Klapet-Kurbağalık D-388',
    slug: 'flapvana-klapet-kurbagalik-d-388',
    stok_kodu: 'D-388',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/flapvana-klapet-kurbagalik-d-388.jpg"},"urun_tanimi":{"baslik":"FLAPVANA/KLAPET/KURBAĞALIK","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"Sfero Döküm / EN-GJS-400-15"},{"no":"2","ad":"Kapak","malzeme":"Sfero Döküm / EN-GJS-400-15"},{"no":"3","ad":"Pim","malzeme":"Paslanmaz Çelik / X20Cr13"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["100","150","200","250","300","350","400","450","500","600","700","800","900","1000"],"olculer":[{"grup":"","kod":"PN","degerler":["16","16","16","16","16","16","16","16","16","16","16","16","16","16"]},{"grup":"","kod":"L","degerler":["70","75","85","95","105","110","120","125","150","175","195","215","260","300"]},{"grup":"","kod":"Ağırlık","degerler":["6","10","15","20","30","40","50","60","90","150","205","290","385","500"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/flapvana-klapet-kurbagalik-d-388/FlapVana-Klapet-Kurbağalık D-388 PDF.pdf"}]})
  },
  {
    id: 52,
    kategori_id: 3,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Karesel Sürgülü Vana D-011',
    slug: 'karesel-surgulu-vana-d-011',
    stok_kodu: 'D-011',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/karesel-surgulu-vana-d-011.jpg"},"urun_tanimi":{"baslik":"KARESEL SÜRGÜLÜ VANA","satirlar":[]},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/karesel-surgulu-vana-d-011/Karesel Sürgülü Vana D-011 PDF.pdf"}]})
  },
  {
    id: 53,
    kategori_id: 4,
    kategori_adi: 'Su Grubu Vanaları',
    ad: 'Darbesiz Vantuz D-304',
    slug: 'darbesiz-vantuz-d-304',
    stok_kodu: 'D-304',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/darbesiz-vantuz-d-304.jpg"},"urun_tanimi":{"baslik":"DARBESİZ VANTUZ","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"EN GJS 400 / EN GJS 500"},{"no":"2","ad":"Kapak","malzeme":"EN GJS 400 / EN GJS 500"},{"no":"3","ad":"Orifis","malzeme":"DERLİN"},{"no":"4","ad":"Orifis Baskı Çemberi","malzeme":"AISI 304 / 316 /320"},{"no":"5","ad":"Pim","malzeme":"AISI 304 / 316 /320"},{"no":"6","ad":"Somun","malzeme":"A2 / A4"},{"no":"7","ad":"Civata","malzeme":"A2 / A4"},{"no":"8","ad":"Oring","malzeme":"EPDM / NBR / VITON / SILICON"},{"no":"9","ad":"Nipel","malzeme":"SAE 1040 / 1050"},{"no":"10","ad":"Hava Tahliye Gövdesi","malzeme":"SAE 1040 / 1050"},{"no":"11","ad":"Hava Tahliye Kapağı","malzeme":"SAE 1040 / 1050"},{"no":"12","ad":"Top","malzeme":""}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["D","k","b","fxh","dxh","h","DN","D","k","b","fxh","dxh","h"],"olculer":[{"grup":"","kod":"50","degerler":["165","125","19","101x2","19x4","200","100","220","180","19","156x2","19x8","285"]},{"grup":"","kod":"65","degerler":["185","145","19","121x2","19x8","200","150","285","240","19","212x2","23x8","327"]},{"grup":"","kod":"80","degerler":["200","160","19","136x2","19x8","210","200","340","295","20","267x2","23x8","370"]}]}],"teknik_cizim_yolu":"/assets/urunler/darbesiz-vantuz-d-304/teknik-cizim.png","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/darbesiz-vantuz-d-304/Darbesiz Vantuz D-304 PDF.pdf"}]})
  },
  {
    id: 54,
    kategori_id: 5,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Glob Vana D-069',
    slug: 'glob-vana-d-069',
    stok_kodu: 'D-069',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/glob-vana-d-069.jpg"},"urun_tanimi":{"baslik":"GLOB VANA","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/glob-vana-d-069/teknik-cizim.png","teknik_cizim_alt":"Glob vana teknik çizimi – D-069","parca_kolonlari":["G1401 - (Cast Iron)","A1430 - A1560\nA1570 - A1580","FK1430 - FK1560\nFK1570 - FK1580"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["EN-GJ 250","1.0619(A)","1.4581"]},{"no":"2","ad":"Kapak","malzemeler":["EN-GJ 250","1.0619(B)","1.4581"]},{"no":"3","ad":"Oturma Yüzeyi","malzemeler":["X20Cr13(1)","X20Cr13(1)","X5CrNiMo17-12-2(1)"]},{"no":"4","ad":"Disk Oturma Yüzeyi","malzemeler":["X20Cr13(1)","X20Cr13(1)","X5CrNiMo17-12-2(1)"]},{"no":"5","ad":"Mil","malzemeler":["X20Cr13(2)","X20Cr13(2)","X5CrNiMo17-12-2(2)"]},{"no":"6","ad":"Arka Oturma (Bütünleşik)","malzemeler":["EN-GJ 250","1.0619(B)","1.4581"]},{"no":"7","ad":"Salmastra Yatağı","malzemeler":["1.0460","1.0460","X5CrNiMo17-12-2"]},{"no":"8","ad":"Boyunduruk Burcu","malzemeler":["N/A","MS58 (3)","MS58 (3)"]},{"no":"9","ad":"Volan","malzemeler":["Steel","Steel","Steel"]},{"no":"10","ad":"Plaka","malzemeler":["1.0460","1.0460","1.0460"]},{"no":"11","ad":"Volan Somunu","malzemeler":["1.0460","1.0460","X5CrNiMo17-12-2"]},{"no":"12","ad":"Civata","malzemeler":["CK35","CK35","A2-70"]},{"no":"13","ad":"Somun","malzemeler":["C35","C35","A2-70"]},{"no":"14","ad":"Halka Civata","malzemeler":["CK35","CK35","A2-7"]},{"no":"15","ad":"Somun","malzemeler":["C35","C35","A2-7"]},{"no":"16","ad":"Halka Civata Pimi","malzemeler":["CK35","CK35","A2-7"]},{"no":"17","ad":"Conta","malzemeler":["S.S. reinforced graphite (4)","S.S. reinforced graphite (4)","S.S. reinforced graphite (4)"]},{"no":"18","ad":"Salmastra","malzemeler":["Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)"]}],"olcu_tablolari":[{"baslik":"FIG. 1401 – Civatalı Kapaklı Glob Vana DIN PN 16 – Dökme Demir – F1","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"L RF","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","960","1100","1200","1250","1450"]},{"grup":"","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","315","340","405","460","520","580","640","715","840"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["160","165","190","200","225","260","280","320","375","415","460","550","570","750","900","1040","1290","1400","1600",""]},{"grup":"","kod":"H1","degerler":["164","170","197","208","235","273","297","340","400","447","498","594","620","813","975","1128","1390","1513","1725",""]}]},{"baslik":"FIG. 1430 – Civatalı Kapaklı Glob Vana DIN PN 25/40 – F1","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","960","1100","1200","1250","1450"]},{"grup":"","kod":"D – PN25","degerler":["95","105","115","140","150","165","185","200","235","270","300","330","350","425","485","555","620","670","730","845"]},{"grup":"","kod":"D – PN40","degerler":["95","105","115","140","150","165","185","200","235","270","300","350","375","450","515","580","660","685","755","890"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["160","165","190","200","225","260","280","320","375","415","460","550","570","750","900","1040","1290","1400","1600",""]},{"grup":"","kod":"H1","degerler":["164","170","197","208","235","273","297","340","400","447","498","594","620","813","975","1128","1390","1513","1725",""]}]},{"baslik":"FIG. 1560 – Civatalı Kapaklı Glob Vana DIN PN 63 – F2","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","500","600"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900","1025","1150","1400","1600"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","180","205","215","250","295","345","375","415","470","530","600","670","800","930"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700","800","800","1000","1200"]},{"grup":"","kod":"H","degerler":["250","310","310","330","350","380","410","480","490","550","610","700","750","800","900","","","",""]},{"grup":"","kod":"H1","degerler":["254","315","317","338","360","393","427","480","515","582","648","744","800","863","1005","","","",""]}]},{"baslik":"FIG. 1570 – Civatalı Kapaklı Glob Vana DIN PN 100 – F2","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","195","220","230","265","315","355","385","430","505","585"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700"]},{"grup":"","kod":"H","degerler":["250","310","310","330","350","400","480","510","583","600","630","720","780","830","970"]},{"grup":"","kod":"H1","degerler":["254","315","317","338","363","413","497","530","605","632","668","764","833","893","1045"]}]},{"baslik":"FIG. 1580 – Civatalı Kapaklı Glob Vana DIN PN 160 – F2","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900"]},{"grup":"","kod":"D – PN25","degerler":["105","130","140","155","170","195","220","230","265","315","355","390","430","515","585"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","250","300","400","500","500","600","700","700","700"]},{"grup":"","kod":"H","degerler":["250","310","310","355","355","400","","","","","","","","",""]},{"grup":"","kod":"H1","degerler":["254","315","317","363","365","413","","","","","","","","",""]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/glob-vana-d-069/Glob Vana D-069.pdf"},{"baslik":"Birim Fiyat Excel","aciklama":"Glob Vana D-069 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/glob-vana-d-069/Glob Vana D-069 Birim Fiyat.xlsx","belge_turu":"excel"}]})
  },
  {
    id: 55,
    kategori_id: 4,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Glob Vana - Kumandalı Çekvalf Köşe Tip D-072',
    slug: 'glob-vana-kumandali-cekvalf-kose-tip-d-072',
    stok_kodu: 'D-072',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/glob-vana-kumandali-cekvalf-kose-tip-d-072.jpg"},"urun_tanimi":{"baslik":"GLOB VANA / KUMANDALI ÇEKVALF KÖŞE TİP","satirlar":[]},"parca_kolonlari":["S1810 - (Nodular Iron)","A1680 - A1560ASO - A1570ASO","FK1680 - FK1560ASO - FK1570ASO"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["EN-GJS-400-18-LT","1.0619(A)","1.4581"]},{"no":"2","ad":"Kapak","malzemeler":["EN-GJS-400-18-LT","1.0619(B)","1.4581"]},{"no":"3","ad":"Oturma Yüzeyi","malzemeler":["X20Cr13(1)","X20Cr13 (1)","X5CrNiMo17-12-2 (1)"]},{"no":"4","ad":"Disk Oturma Yüzeyi","malzemeler":["X20Cr13(1)","X20Cr13 (1)","X5CrNiMo17-12-2(1)"]},{"no":"5","ad":"Mil","malzemeler":["X20Cr13(2)","X20Cr13 (2)","X5CrNiMo17-12-2(2)"]},{"no":"6","ad":"Arka Oturma (Bütünleşik)","malzemeler":["EN-GJS-400-18-LT","1.0619(B)","1.4581"]},{"no":"7","ad":"Salmastra Yatağı","malzemeler":["1.0460","1.0460","X5CrNiMo17-12-2"]},{"no":"8","ad":"Dönmez Aparat","malzemeler":["X20Cr13","MS58 (3)","MS58 (3)"]},{"no":"9","ad":"Boyunduruk Burcu","malzemeler":["N/A","Steel","Steel"]},{"no":"10","ad":"Boyunduruk Somunu","malzemeler":["1.0460","1.0460","1.0460"]},{"no":"11","ad":"Volan","malzemeler":["Steel","1.0460","X5CrNiMo17-12-2"]},{"no":"12","ad":"Volan Somunu","malzemeler":["1.0460","CK35","A2-70"]},{"no":"13","ad":"Civata","malzemeler":["CK35","C35","A2-70"]},{"no":"14","ad":"Somun","malzemeler":["C35","CK35","A2-7"]},{"no":"15","ad":"Halka Civata","malzemeler":["CK35","C35","A2-7"]},{"no":"16","ad":"Somun","malzemeler":["C35","CK35","A2-7"]},{"no":"17","ad":"Halka Civata Pimi","malzemeler":["CK35","S. S. reinforced graphite (4)","S. S. reinforced graphite (4)"]},{"no":"18","ad":"Körük Flanşı","malzemeler":["X6CrNiTi18-10","Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)"]},{"no":"19","ad":"Conta","malzemeler":["S. S. Reinforced Graphite (4)","S. S. Reinforced Graphite (4)","S. S. Reinforced Graphite (4)"]},{"no":"20","ad":"Salmastra","malzemeler":["Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)"]},{"no":"21","ad":"Körük","malzemeler":["X6CrNiTi18-10","X6CrNiTi18-10","X6CrNiTi18-10"]},{"no":"22","ad":"Gres Nipeli","malzemeler":["Steel","Steel","Steel"]}],"olcu_tablolari":[{"baslik":"FIG. 1810 – Körüklü Salmastralı Glob Vana 90° Köşe Tip DIN PN 16/25 – Sfero Döküm – F32","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"L RF","degerler":["90","95","100","105","115","125","145","155","175","200","225","250","275","325","375","425","475","500","575","675"]},{"grup":"","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","315","340","405","460","520","580","640","715","840"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["180","190","210","250","290","340","380","450","500","570","650","770","840","950","1100","1250","1500","1650","1850",""]},{"grup":"","kod":"H1","degerler":["184","195","217","258","300","353","397","470","525","602","688","814","890","1013","1175","1338","1600","1763","1975",""]}]},{"baslik":"FIG. 1680 – Körüklü Salmastralı Glob Vana 90° Köşe Tip DIN PN 16/25 – Sfero Döküm – F32","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["90","95","100","105","115","125","145","155","175","200","225","250","275","325","375","425","475","500","575","675"]},{"grup":"","kod":"D – PN16","degerler":["95","105","115","140","150","165","185","200","235","270","300","330","360","425","485","555","620","670","730","845"]},{"grup":"","kod":"D – PN25","degerler":["95","105","115","140","150","165","185","200","235","270","300","350","375","450","515","580","660","685","755","890"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["210","220","220","220","240","270","310","350","400","460","510","600","630","810","950","1100","1350","1460","1660",""]},{"grup":"","kod":"H1","degerler":["214","225","227","228","250","283","327","370","425","492","548","594","680","813","925","1088","1300","1513","1725",""]}]},{"baslik":"FIG. 1560ASO – Körüklü Salmastralı Glob Vana 90° Köşe Tip DIN PN 63 – F33","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","500","600"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["105","105","115","130","130","150","170","190","215","250","275","300","325","390","450","515","575","700",""]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","180","205","215","250","295","345","375","415","470","530","600","670","800","930"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","600","700","800","800","1000","1200"]},{"grup":"","kod":"H","degerler":["300","360","360","380","400","430","460","510","540","610","670","760","810","860","990","","","",""]},{"grup":"","kod":"H1","degerler":["304","365","367","388","410","443","477","530","565","642","708","804","860","923","1065","","","",""]}]},{"baslik":"FIG. 1570 – Körüklü Salmastralı Glob Vana 90° Köşe Tip DIN PN 100 – F33","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["105","105","115","130","130","150","170","190","215","250","275","300","325","390","450"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","195","220","230","265","315","355","385","430","505","585"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700"]},{"grup":"","kod":"H","degerler":["300","360","360","380","400","450","530","560","630","660","690","780","840","890","1030"]},{"grup":"","kod":"H1","degerler":["304","365","367","388","410","463","547","580","655","692","728","824","890","953","1105"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/glob-vana-kumandali-cekvalf-kose-tip-d-072/Glob Vana - Kumandalı Çekvalf Köşe Tip D-072.pdf"}]})
  },
  {
    id: 56,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Buhar Basınç Düşürücü D-066',
    slug: 'buhar-basinc-dusurucu-d-066',
    stok_kodu: 'D-066',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/buhar-basinc-dusurucu-d-066.jpg"},"urun_tanimi":{"baslik":"BUHAR BASINÇ DÜŞÜRÜCÜ","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["GGG22-25","GGG40","GS2C25 / A216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GS2C25 / A216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GGG22-25","ST37","GS2C25 / A216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GGG22-25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","H","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","325","","95","65","45","4","14","14"]},{"grup":"","kod":"20","degerler":["3/4\"","150","328","","105","75","58","4","14","16"]},{"grup":"","kod":"25","degerler":["1\"","160","330","","115","85","65","4","14","16"]},{"grup":"","kod":"32","degerler":["11/4\"","180","340","","140","100","78","4","18","18"]},{"grup":"","kod":"40","degerler":["11/2\"","200","470","","150","110","88","4","18","18"]},{"grup":"","kod":"50","degerler":["2\"","230","480","","165","125","102","4","18","20"]},{"grup":"","kod":"65","degerler":["21/2\"","290","580","","185","145","122","4","18","20"]},{"grup":"","kod":"80","degerler":["3\"","310","600","","200","160","138","8","18","22"]},{"grup":"","kod":"100","degerler":["4\"","350","620","","220","180","158","8","18","24"]}]}],"dokumanlar":[{"baslik":"Birim Fiyat Excel","aciklama":"Buhar Basınç Düşürücü D-066 fiyat listesi","tur":"XLSX","dosya_yolu":"/assets/urunler/buhar-basinc-dusurucu-d-066/Buhar Basınç Düşürücü D-066 Birim Fiyat.xlsx","belge_turu":"excel"},{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/buhar-basinc-dusurucu-d-066/Buhar Basınç Düşürücü D-066 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-koruklu-glob-vana-d-073.jpg"},"urun_tanimi":{"baslik":"METAL KÖRÜKLÜ GLOB VANA","satirlar":[]},"parca_kolonlari":["S1800 - (NODULAR IRON)","A1670 - A1560SO","FK 1670 - FK1560SO - FK1570SO"],"parcalar":[{"no":"1","ad":"Body","malzemeler":["EN-GJS-400-18-LT","1.0619 (A)","1.4581"]},{"no":"2","ad":"Bonnet","malzemeler":["EN-GJS-400-18-LT","1.0619 (B)","1.4581"]},{"no":"3","ad":"Seat Surface","malzemeler":["X20Cr13 (1)","X20Cr13 (1) overlay","1.4581 (1)"]},{"no":"4","ad":"Disc Seat Surface","malzemeler":["X20Cr13 (1)","X20Cr13 (1)","X5CrNiMo17-12-2 (1)"]},{"no":"5","ad":"Stem","malzemeler":["X20Cr13 (2)","X20Cr13 (2)","X5CrNiMo17-12-2 (2)"]},{"no":"6","ad":"Back Seat (Integral)","malzemeler":["EN-GJS-400-18-LT","1.0619 (B)","1.4581"]},{"no":"7","ad":"Gland","malzemeler":["1.0460","1.0460","X5CrNiMo17-12-2"]},{"no":"8","ad":"No Rot. Device","malzemeler":["X20Cr13","MS58 (3)","X5CrNiMo17-12-2"]},{"no":"9","ad":"Yoke Sleeve","malzemeler":["N/A","1.0460","MS58 (3)"]},{"no":"10","ad":"Yoke Nut","malzemeler":["1.0460","Steel","X5CrNiMo17-12-2"]},{"no":"11","ad":"Handwheel","malzemeler":["Steel","CK35","Steel"]},{"no":"12","ad":"Handwheel Nut","malzemeler":["1.0460","C35","X5CrNiMo17-12-2"]},{"no":"13","ad":"Bolts","malzemeler":["CK35","CK35","A2-70"]},{"no":"14","ad":"Nuts","malzemeler":["C35","C35","A2-70"]},{"no":"15","ad":"Eye Bolts","malzemeler":["CK35","CK35","A2-70"]},{"no":"16","ad":"Nuts","malzemeler":["C35","C35","A2-70"]},{"no":"17","ad":"Eye Bolt Pin","malzemeler":["CK35","CK35","A2-70"]},{"no":"18","ad":"Bellow Flange","malzemeler":["X6CrNiTi18-10","X6CrNiTi18-10)","X6CrNiTi18-10"]},{"no":"19","ad":"Gasket","malzemeler":["S. S. reinforced graphite (4)","S. S. reinforced graphite (4)","S. S. reinforced graphite (4)"]},{"no":"20","ad":"Packing","malzemeler":["Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)","Graphite Rings & Wiper Rings (4)"]},{"no":"21","ad":"Bellow","malzemeler":["X6CrNiTi18-10","X6CrNiTi18-10","X6CrNiTi18-10"]},{"no":"22","ad":"Grease Nipple","malzemeler":["Steel","Steel","Steel"]}],"olcu_tablolari":[{"baslik":"FIG. 1800 - GLOBE VALVES BELLOW SEAL - DIN PN 16/25 - NODULAR IRON - F1","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"L RF","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","980","1100","1200","1250","1450"]},{"grup":"","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","315","340","405","460","520","580","640","715","840"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["180","190","210","250","290","340","380","450","500","570","650","770","840","950","1100","1250","1500","1650","1850",""]},{"grup":"","kod":"H1","degerler":["184","195","217","258","300","353","397","470","525","602","688","814","890","1013","1175","1338","1600","1763","1975",""]}]},{"baslik":"FIG. 1670 - GLOBE VALVES BELLOW SEAL - DIN PN 25/40 - F1","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["130","150","160","180","200","230","290","310","350","400","480","550","600","730","850","980","1100","1200","1250","1450"]},{"grup":"","kod":"D - PN25","degerler":["95","105","115","140","150","165","185","200","235","270","300","330","360","425","485","555","620","670","730","845"]},{"grup":"","kod":"D - PN40","degerler":["95","105","115","140","150","165","185","200","235","270","300","350","375","450","515","580","660","685","755","890"]},{"grup":"","kod":"V","degerler":["100","100","125","125","150","150","200","200","225","225","300","300","400","500","500","600","600","700","700","800"]},{"grup":"","kod":"H","degerler":["210","220","220","220","240","270","310","350","400","460","510","600","630","810","950","1100","1350","1460","1600",""]},{"grup":"","kod":"H1","degerler":["214","225","227","228","250","283","327","370","425","492","548","594","680","813","925","1088","1300","1513","1725",""]}]},{"baslik":"FIG. 1560SO - GLOBE VALVES BELLOW SEAL - DIN PN 63 - F2","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300","350","400","500","600"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900","1025","1150","1400","1600"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","180","205","215","250","295","345","375","415","470","530","600","670","800","930"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700","800","800","1000","1200"]},{"grup":"","kod":"H","degerler":["300","360","360","380","400","430","460","510","540","610","670","760","810","860","990","","","",""]},{"grup":"","kod":"H1","degerler":["304","365","367","388","410","443","477","530","565","642","708","804","860","923","1065","","","",""]}]},{"baslik":"FIG. 1570SO - GLOBE VALVES BELLOW SEAL DIN PN 100 - F2","olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","175","200","250","300"],"olculer":[{"grup":"","kod":"L RF / BW","degerler":["210","230","230","260","260","300","340","380","430","500","550","600","650","775","900"]},{"grup":"","kod":"D","degerler":["105","130","140","155","170","195","220","230","265","315","355","385","430","505","585"]},{"grup":"","kod":"V","degerler":["150","150","150","200","200","200","225","250","300","400","500","500","600","700","700"]},{"grup":"","kod":"H","degerler":["300","360","360","380","400","450","530","560","630","660","690","780","840","890","1030"]},{"grup":"","kod":"H1","degerler":["304","365","367","388","410","463","547","580","655","692","728","824","890","953","1105"]}]}],"teknik_cizim_yolu":"/assets/urunler/metal-koruklu-glob-vana-d-073/teknik-cizim.png","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/metal-koruklu-glob-vana-d-073/Metal Körüklü Glob Vana D-073 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/lift-loaded-safety-valve-d-082.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/lift-loaded-safety-valve-d-082/Lift Loaded Safety Valve D-082 PDF.pdf"}]})
  },
  {
    id: 63,
    kategori_id: 3,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Emniyet Ventili Su, Amonyak, Azot',
    slug: 'emniyet-ventili-su-amonyak-azot',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/emniyet-ventili-su-amonyak-azot.jpg"},"urun_tanimi":{"baslik":"EMNİYET VENTİLİ SU, AMONYAK , AZOT","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25 / GGG-40/GS-C 25"},{"no":"2","ad":"Burc","malzeme":"AISI 304"},{"no":"3","ad":"Klape","malzeme":"AISI 304"},{"no":"Baskı","ad":"Ms58","malzeme":""},{"no":"4","ad":"Mil","malzeme":"1.4021"},{"no":"5","ad":"Kılavuz","malzeme":"GG 25/GGG-40"},{"no":"6","ad":"Kapak","malzeme":"GG 25 / GGG-40/GS-C 25"},{"no":"7","ad":"Kol","malzeme":"St-37-2"},{"no":"8","ad":"Ağırlık","malzeme":"GG 20"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600","700","800","900"],"olculer":[{"grup":"Valve Dimensions TS 457 /1 DIN / 3352 / 24","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390","430","470","510"]},{"grup":"","kod":"H","degerler":["157","190","210","230","260","365","375","500","630","715","820","910","1135","1300","1480","1690","1820"]},{"grup":"","kod":"D1","gruplu_degerler":[{"deger":"160","sutun":4},{"deger":"200","sutun":1},{"deger":"250","sutun":3},{"deger":"315","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2},{"deger":"630","sutun":1},{"deger":"800","sutun":2}]},{"grup":"Flange Dimensions DIN 2501 / TS 810 PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","295","445","505","565","670","780","895","1015","1115"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","725","480","950","1050"]},{"grup":"Weight","kod":"kg","degerler":["8,3","10,2","13,7","15,5","22,1","37","44,2","81","123","176","225","290","460","680","870","1200","1400"]}]}]})
  },
  {
    id: 64,
    kategori_id: 4,
    kategori_adi: 'Buhar Grubu Vanaları',
    ad: 'Ters Kovalı Kondenstop D-092',
    slug: 'ters-kovali-kondenstop-d-092',
    stok_kodu: 'D-092',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/ters-kovali-kondenstop-d-092.jpg"},"urun_tanimi":{"baslik":"TERS KOVALI KONDENSTOP","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG25"},{"no":"2","ad":"Kapak","malzeme":"GG25"},{"no":"3","ad":"Kova","malzeme":"Paslanmaz Çelik"},{"no":"4","ad":"Orifis","malzeme":"Paslanmaz Çelik"},{"no":"5","ad":"Tapa","malzeme":"St37"},{"no":"6","ad":"Conta","malzeme":"Klingerit"}],"olcu_tablolari":[{"baslik":"TERS KOVALI KONDENSTOP (FLANŞLI)","olcu_basliklari":["15","20","25","32","40","50"],"olculer":[{"grup":"Vana Boyutları","kod":"L","degerler":["170","180","195","205","245","280"]},{"grup":"","kod":"H","degerler":["170","180","190","200","235","275"]},{"grup":"","kod":"S","degerler":["90","95","100","105","120","130"]},{"grup":"","kod":"ØD","degerler":["95","105","115","140","150","165"]},{"grup":"","kod":"Øk","degerler":["65","75","85","100","110","125"]},{"grup":"","kod":"Øg","degerler":["46","56","65","76","84","99"]},{"grup":"","kod":"Ød","gruplu_degerler":[{"deger":"14","sutun":3},{"deger":"19","sutun":3}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"14","sutun":1},{"deger":"16","sutun":2},{"deger":"18","sutun":2},{"deger":"20","sutun":1}]},{"grup":"","kod":"n","gruplu_degerler":[{"deger":"4","sutun":6}]},{"grup":"Ağırlık","kod":"Kg","degerler":["5,5","6,4","8,1","9,9","15,8","24,9"]}]},{"baslik":"TERS KOVALI KONDENSTOP (DİŞLİ)","olcu_basliklari":["15","20","25","32","40","50"],"olculer":[{"grup":"","kod":"G","degerler":["1/2\"","3/4\"","1\"","1 1/4\"","1 1/2\"","2\""]},{"grup":"Vana Boyuları","kod":"L","degerler":["140","150","170","180","220","245"]},{"grup":"","kod":"H","degerler":["170","180","190","200","235","275"]},{"grup":"","kod":"S","degerler":["90","95","100","105","120","130"]},{"grup":"Ağırlık","kod":"Kg","degerler":["4,9","6,0","7,5","7,9","13,4","22,1"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/ters-kovali-kondenstop-d-092/Ters Kovalı Kondenstop D-092 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-kizgin-yag-vanasi-d-141.jpg"},"urun_tanimi":{"baslik":"PNÖMATİK KIZGIN YAĞ VANASI","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["GGG22-25","GGG40","GS2C25 / A216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GS2C25 / A216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GGG22-25","ST37","GS2C25 / A216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GGG22-25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","H","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","325","","95","65","45","4","14","14"]},{"grup":"","kod":"20","degerler":["3/4\"","150","328","","105","75","58","4","14","16"]},{"grup":"","kod":"25","degerler":["1\"","160","330","","115","85","65","4","14","16"]},{"grup":"","kod":"32","degerler":["11/4\"","180","340","","140","100","78","4","18","18"]},{"grup":"","kod":"40","degerler":["11/2\"","200","470","","150","110","88","4","18","18"]},{"grup":"","kod":"50","degerler":["2\"","230","480","","165","125","102","4","18","20"]},{"grup":"","kod":"65","degerler":["21/2\"","290","580","","185","145","122","4","18","20"]},{"grup":"","kod":"80","degerler":["3\"","310","600","","200","160","138","8","18","22"]},{"grup":"","kod":"100","degerler":["4\"","350","620","","220","180","158","8","18","24"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pnomatik-kizgin-yag-vanasi-d-141/Pnömatik Kızgın Yağ Vanası D-141 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/akis-gostergesi-gozetleme-camlari.jpg"},"urun_tanimi":{"baslik":"AKIŞ GÖSTERGESİ","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GGG 40 Sferon Döküm Paslanmaz Çelik (AISI 304)"},{"no":"2","ad":"Cam","malzeme":"Basınca Duyarlı (Securit Cam)"},{"no":"3","ad":"Boyut","malzeme":"DN 3202 - F1"},{"no":"4","ad":"Flanş","malzeme":"PN 16 / DIN 2533"},{"no":"5","ad":"Sızdırmazlık","malzeme":"TEFLON (PTFE)"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","200"],"olculer":[{"grup":"","kod":"L","degerler":["130","150","160","180","200","230","290","310","350","400","350","400"]},{"grup":"","kod":"D","degerler":["95","105","115","140","150","165","185","200","220","250","285","340"]},{"grup":"","kod":"d","degerler":["15","20","25","32","40","50","65","80","100","125","150","200"]},{"grup":"","kod":"g","degerler":["45","58","68","78","88","102","122","138","158","188","212","268"]},{"grup":"","kod":"k","degerler":["65","75","85","100","110","125","145","160","180","210","240","295"]},{"grup":"","kod":"Delik","degerler":["4","4","4","4","4","4","4","8","8","8","8","12"]},{"grup":"","kod":"l","degerler":["14","14","14","18","18","18","18","18","22","26","26","26"]},{"grup":"","kod":"f","degerler":["2","2","2","2","3","3","","3","3","3","3","3"]},{"grup":"","kod":"b","degerler":["14","16","16","18","18","20","20","22","24","26","26","30"]},{"grup":"","kod":"KG","degerler":["3.50","4.20","5.50","7.00","9.50","14.20","16.00","31.00","40.00","60.00","75.00","115.00"]}]}],"teknik_cizim_yolu":"/assets/urunler/akis-gostergesi-gozetleme-camlari/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/akis-gostergesi-gozetleme-camlari/Akış Göstergesi ( Gözetleme Camları ) PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067.jpg"},"urun_tanimi":{"baslik":"PNÖMATİK GLOP TİP 2 YOLLU KONTROL VANASI (TEK YATAKLI) ON-OFF / ORANSAL","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["GG 22-25","GGG 40","GS2C25 / A216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GS2C25 / A216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GG 22-25","ST 37","GS2C25 / A216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GG 22-25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","H","A","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","325","160","","95","65","45","4","14","14"]},{"grup":"","kod":"20","degerler":["3/4\"","150","328","160","","105","75","58","4","14","16"]},{"grup":"","kod":"25","degerler":["1\"","160","330","160","","115","85","68","4","14","16"]},{"grup":"","kod":"32","degerler":["11/4\"","180","340","160","","140","100","78","4","18","18"]},{"grup":"","kod":"40","degerler":["11/2\"","200","470","280","","150","110","88","4","18","18"]},{"grup":"","kod":"50","degerler":["2\"","230","480","280","","165","125","102","4","18","20"]},{"grup":"","kod":"65","degerler":["21/2\"","290","580","280","","185","145","122","4","18","20"]},{"grup":"","kod":"80","degerler":["3\"","310","600","350","","200","160","138","8","18","22"]},{"grup":"","kod":"100","degerler":["4\"","350","620","350","","220","180","158","8","18","24"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pnomatik-glob-tip-2-yollu-kontrol-vanasi-tek-yatakli-on-off-oransal-d-067/Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Tek Yataklı) On-Off - Oransal D-067 PDF.pdf"}]})
  },
  {
    id: 71,
    kategori_id: 5,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Çift Yataklı) On-Off - Oransal D-067',
    slug: 'pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067.jpg"},"urun_tanimi":{"baslik":"PNÖMATİK GLOP TİP 2 YOLLU KONTROL VANASI (ÇİFT YATAKLI) ON-OFF / ORANSAL","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["GG 22-25","GGG 40","GS2C25 / A216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GS2C25 / A216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GG 22-25","ST 37","GS2C25 / A216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GG 22-25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","B","A","H","E","PN 16 (DIN 2501 - BS 4504)","Ø D","Ø k","Ø g","n","Ø d2","b","Kg"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","140","450","575","280","","95","65","45","4","14","14",""]},{"grup":"","kod":"20","degerler":["3/4\"","150","","450","","280","","105","75","58","4","14","16",""]},{"grup":"","kod":"25","degerler":["1\"","160","140","450","610","350","","115","85","68","4","14","16","38"]},{"grup":"","kod":"32","degerler":["11/4\"","200","160","450","610","350","","150","110","88","4","18","18","48"]},{"grup":"","kod":"40","degerler":["11/2\"","200","","450","","350","","140","100","78","4","18","18",""]},{"grup":"","kod":"50","degerler":["2\"","230","170","450","650","350","","165","125","102","4","18","20","61"]},{"grup":"","kod":"65","degerler":["21/2\"","290","200","550","770","450","","185","145","122","4","18","20","86"]},{"grup":"","kod":"80","degerler":["3\"","310","240","640","890","450","","200","160","138","8","18","22","130"]},{"grup":"","kod":"100","degerler":["4\"","350","240","660","910","450","","220","180","158","8","18","24","162"]},{"grup":"","kod":"150","degerler":["6\"","480","240","840","1120","450","","285","240","212","8","22","26","280"]},{"grup":"","kod":"200","degerler":["8\"","600","290","840","1180","470","","340","295","268","12","22","30","340"]},{"grup":"","kod":"250","degerler":["10\"","730","350","890","1280","470","","405","355","320","12","22","","420"]},{"grup":"","kod":"300","degerler":["12\"","850","480","890","1400","470","","460","378","410","12","26","","760"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pnomatik-glob-tip-2-yollu-kontrol-vanasi-cift-yatakli-on-off-oransal-d-067/Pnömatik Glob Tip 2 Yollu Kontrol Vanası (Çift Yataklı) On-Off - Oransal D-067 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/buhar-basinc-dusurucu-kontrol-vanasi-d-066.jpg"},"urun_tanimi":{"baslik":"BUHAR BASINÇ DÜŞÜRÜCÜ KONTROL VANASI","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 2"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["GG 22-25","GGG-40","GS2C25 / A 216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GS2C25 / A 216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GG 22-25","ST 37","GS2C25 / A 216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GG 22-25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","H","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","325","","95","65","45","4","14","14"]},{"grup":"","kod":"20","degerler":["3/4\"","150","328","","105","75","58","4","14","16"]},{"grup":"","kod":"25","degerler":["1\"","160","330","","115","85","68","4","14","16"]},{"grup":"","kod":"32","degerler":["11/4\"","180","340","","140","100","78","4","18","18"]},{"grup":"","kod":"40","degerler":["11/2\"","200","470","","150","110","88","4","18","18"]},{"grup":"","kod":"50","degerler":["2\"","230","480","","165","125","102","4","18","20"]},{"grup":"","kod":"65","degerler":["21/2\"","290","580","","185","145","122","4","18","20"]},{"grup":"","kod":"80","degerler":["3\"","310","600","","200","160","138","8","18","22"]},{"grup":"","kod":"100","degerler":["4\"","350","620","","220","180","158","8","18","24"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/buhar-basinc-dusurucu-kontrol-vanasi-d-066/Buhar Basınç Düşürücü Kontrol Vanası D-066 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/diyafram-aktuatorlu-kontrol-vanasi-d-227.jpg"},"urun_tanimi":{"baslik":"DİYAFRAM AKTÜATÖRLÜ KONTROL VANASI","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Body","malzemeler":["A216 - WCB","A217-WC9","A351-CF8M"]},{"no":"2","ad":"Bonnet","malzemeler":["A216 - WCB","A276-F22/A217-WC9","A276 - 316/ A351 - CF8M"]},{"no":"3","ad":"Seatring","malzemeler":["A276 - 410","A276 - F22","A276 - 316"]},{"no":"4","ad":"Cage","malzemeler":["A276 - 410","A276 - 410","A276 - 410"]},{"no":"5","ad":"Plug","malzemeler":["A276 - 316","A276 - 316","A276 - 316"]},{"no":"6","ad":"Gland Flange","malzemeler":["A276 - 410","A276 - 410","A276 - 410"]},{"no":"7","ad":"Yoke","malzemeler":["A216 - WCB","A217-WC9","A351-CF8M"]},{"no":"8","ad":"Cylinder","malzemeler":["B 26","B26","B26"]},{"no":"9","ad":"Piston Stem","malzemeler":["C/S 1045+Cr.Plating","C/S 1045+Cr.Plating","C/S 1045+Cr.Plating"]},{"no":"10","ad":"Plate Clamp","malzemeler":["A276 - 410","A276 - 410","A276 - 410"]},{"no":"11","ad":"Spring","malzemeler":["SS304","SS304","SS304"]},{"no":"12","ad":"Gasket","malzemeler":["SS316/Graphite","SS316/Graphite","SS316/Graphite"]},{"no":"13","ad":"Gasket","malzemeler":["SS316/Graphite","SS316/Graphite","SS316/Graphite"]},{"no":"14","ad":"O-Ring","malzemeler":["Viton","Viton","Viton"]},{"no":"15","ad":"Mold Packing","malzemeler":["Graphite","Graphite","Graphite"]},{"no":"16","ad":"Fİlled Packing","malzemeler":["Graphite","Graphite","Graphite"]},{"no":"17","ad":"Gland Flange Bolt","malzemeler":["A193 - B7","A193 - B7","A193 - B8"]},{"no":"18","ad":"Gland Flange Nut","malzemeler":["A194 - 2H","A194 - 2H","A194 - 8"]},{"no":"19","ad":"Cylinder Bolt","malzemeler":["A193 - B7","A193 - B7","A193 - B8"]},{"no":"20","ad":"Bonnet Bolt","malzemeler":["A193 - B7","A193 - B16","A193 - B8"]},{"no":"21","ad":"Bonnet Nul","malzemeler":["A194 - 2H","A194 - 4","A194 - 8"]},{"no":"22","ad":"Oilless Bushing","malzemeler":["B124-C37700","B124 - C37700","B124 - C37700"]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["ANSI 150","1 inch","1½ inch","2 inch","3 inch","4 inch","6 inch","8 inch","10 inch","12 inch"],"olculer":[{"grup":"","kod":"L (mm)","degerler":["ANSI 300","25 mm","40 mm","50 mm","80 mm","100 mm","150 mm","200 mm","250 mm","300 mm"]}]},{"baslik":null,"olcu_basliklari":["Diaphragm","1 inch","1½ inch","2 inch","3 inch","4 inch","6 inch","8 inch","10 inch","12 inch"],"olculer":[{"grup":"","kod":"H (mm)","degerler":["Sylinder","25 mm","40 mm","50 mm","80 mm","100 mm","150 mm","200 mm","250 mm","300 mm"]},{"grup":"","kod":"A (mm)","degerler":["Diaphragm","900","900","950","980","1200","1330","1620","1790","2000"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/diyafram-aktuatorlu-kontrol-vanasi-d-227/Diyafram Aktüatörlü Kontrol Vanası D-227 PDF.pdf"}]})
  },
  {
    id: 76,
    kategori_id: 7,
    kategori_adi: 'Kontrol Vanaları',
    ad: 'Piston Aktüatörlü Kontrol Vanası D-228',
    slug: 'piston-aktuatorlu-kontrol-vanasi-d-228',
    stok_kodu: 'D-228',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/piston-aktuatorlu-kontrol-vanasi-d-228.jpg"},"urun_tanimi":{"baslik":"PİSTON AKTÜATÖRLÜ KONTROL VANASI","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Body","malzemeler":["A216 - WCB","A217-WC9","A351-CF8M"]},{"no":"2","ad":"Bonnet","malzemeler":["A216 - WCB","A276-F22/A217-WC9","A276 - 316/ A351 - CF8M"]},{"no":"3","ad":"Seatring","malzemeler":["A276 - 410","A276 - F22","A276 - 316"]},{"no":"4","ad":"Cage","malzemeler":["A276 - 410","A276 - 410","A276 - 410"]},{"no":"5","ad":"Plug","malzemeler":["A276 - 316","A276 - 316","A276 - 316"]},{"no":"6","ad":"Gland Flange","malzemeler":["A276 - 410","A276 - 410","A276 - 410"]},{"no":"7","ad":"Yoke","malzemeler":["A216 - WCB","A217-WC9","A351-CF8M"]},{"no":"8","ad":"Cylinder","malzemeler":["B 26","B26","B26"]},{"no":"9","ad":"Piston Stem","malzemeler":["C/S 1045+Cr.Plating","C/S 1045+Cr.Plating","C/S 1045+Cr.Plating"]},{"no":"10","ad":"Plate Clamp","malzemeler":["A276 - 410","A276 - 410","A276 - 410"]},{"no":"11","ad":"Spring","malzemeler":["SS304","SS304","SS304"]},{"no":"12","ad":"Gasket","malzemeler":["SS316/Graphite","SS316/Graphite","SS316/Graphite"]},{"no":"13","ad":"Gasket","malzemeler":["SS316/Graphite","SS316/Graphite","SS316/Graphite"]},{"no":"14","ad":"O-Ring","malzemeler":["Viton","Viton","Viton"]},{"no":"15","ad":"Mold Packing","malzemeler":["Graphite","Graphite","Graphite"]},{"no":"16","ad":"Fİlled Packing","malzemeler":["Graphite","Graphite","Graphite"]},{"no":"17","ad":"Gland Flange Bolt","malzemeler":["A193 - B7","A193 - B7","A193 - B8"]},{"no":"18","ad":"Gland Flange Nut","malzemeler":["A194 - 2H","A194 - 2H","A194 - 8"]},{"no":"19","ad":"Cylinder Bolt","malzemeler":["A193 - B7","A193 - B7","A193 - B8"]},{"no":"20","ad":"Bonnet Bolt","malzemeler":["A193 - B7","A193 - B16","A193 - B8"]},{"no":"21","ad":"Bonnet Nul","malzemeler":["A194 - 2H","A194 - 4","A194 - 8"]},{"no":"22","ad":"Oilless Bushing","malzemeler":["B124-C37700","B124 - C37700","B124 - C37700"]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["ANSI 150","1 inch","1½ inch","2 inch","3 inch","4 inch","6 inch","8 inch","10 inch","12 inch"],"olculer":[{"grup":"","kod":"L (mm)","degerler":["ANSI 300","25 mm","40 mm","50 mm","80 mm","100 mm","150 mm","200 mm","250 mm","300 mm"]}]},{"baslik":null,"olcu_basliklari":["Diaphragm","1 inch","1½ inch","2 inch","3 inch","4 inch","6 inch","8 inch","10 inch","12 inch"],"olculer":[{"grup":"","kod":"H (mm)","degerler":["Sylinder","25 mm","40 mm","50 mm","80 mm","100 mm","150 mm","200 mm","250 mm","300 mm"]},{"grup":"","kod":"A (mm)","degerler":["Diaphragm","900","900","950","980","1200","1330","1620","1790","2000"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/piston-aktuatorlu-kontrol-vanasi-d-228/Piston Aktüatörlü Kontrol Vanası D-228 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/62-pnomatik-kizgin-yag-vanasi-d-141.jpg"},"urun_tanimi":{"baslik":"PNÖMATİK KIZGIN YAĞ VANASI","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["GG 22-25","GGG 40","GS2C25 / A216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GS2C25 / A216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GG 22-25","ST 37","GS2C25 / A216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GG 22-25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","H","A","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","300","280","","95","65","45","4","14","14"]},{"grup":"","kod":"20","degerler":["3/4\"","150","320","280","","105","75","58","4","14","16"]},{"grup":"","kod":"25","degerler":["1\"","160","340","280","","115","85","68","4","14","16"]},{"grup":"","kod":"32","degerler":["11/4\"","160","350","280","","140","100","78","4","18","18"]},{"grup":"","kod":"40","degerler":["11/2\"","200","460","280","","150","110","88","4","18","18"]},{"grup":"","kod":"50","degerler":["2\"","230","470","280","","165","125","102","4","18","20"]},{"grup":"","kod":"65","degerler":["21/2\"","290","480","280","","185","145","122","4","18","20"]},{"grup":"","kod":"80","degerler":["3\"","310","","","","200","160","138","8","18","22"]},{"grup":"","kod":"100","degerler":["4\"","350","","","","220","180","158","8","18","24"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/62-pnomatik-kizgin-yag-vanasi-d-141/Pnömatik Kızgın Yağ Vanası D-141 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pinch-vana-d-320.jpg"},"urun_tanimi":{"baslik":"PİNCH VANA","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2"],"parcalar":[{"no":"1","ad":"Üst Gövde","malzemeler":["GG 22-25 / A126 Gr B","GS2C25 / A216 Gr WCB"]},{"no":"2","ad":"Kol","malzemeler":["GG 22-25 / A126 Gr B","GS2C25 / A216 Gr WCB"]},{"no":"3","ad":"Boru Conta","malzemeler":["Buna N","Buna N"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GG 22-25 / A126 Gr B","GS2C25 / A216 Gr WCB"]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","A","B","H","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b","kg"],"olculer":[{"grup":"","kod":"50","degerler":["2\"","178","242","150","","165","125","102","4","18","20","-"]},{"grup":"","kod":"65","degerler":["21/2\"","190","248","185","","185","145","122","4","18","20","-"]},{"grup":"","kod":"80","degerler":["3\"","203","282","250","","200","","138","8","18","22","-"]},{"grup":"","kod":"100","degerler":["4\"","300","316","260","","220","180","158","8","18","24","-"]},{"grup":"","kod":"150","degerler":["6\"","350","400","310","","285","240","218","8","22","26","-"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pinch-vana-d-320/Pinch Vana D-320 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/basinc-sabitleme-vanasi-d-143.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/basinc-sabitleme-vanasi-d-143/Basınç Sabitleme Vanası D-143 PDF.pdf"}]})
  },
  {
    id: 85,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Su Darbesi Önleme Vanası D-144',
    slug: 'su-darbesi-onleme-vanasi-d-144',
    stok_kodu: 'D-144',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-darbesi-onleme-vanasi-d-144.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/su-darbesi-onleme-vanasi-d-144/Su Darbesi Önleme Vanası D-144 PDF.pdf"}]})
  },
  {
    id: 86,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Köşe Tip Mekanik Şamandralı Vana D-302',
    slug: 'surge-anticipating-control-valve-d-144',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/surge-anticipating-control-valve-d-144.jpg"},"urun_tanimi":{"baslik":"MEKANİK ŞAMANDRALI VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25/ GGG 40"},{"no":"2","ad":"Burç","malzeme":"Ms 58/1.4021"},{"no":"3","ad":"Conta","malzeme":"EPDM"},{"no":"4","ad":"Klape","malzeme":"Ms 58/1.4021"},{"no":"5","ad":"Kapak","malzeme":"GG 25/ GGG 40"},{"no":"6","ad":"Conta","malzeme":"EPDM"},{"no":"7","ad":"Mil","malzeme":"1.4021"},{"no":"8","ad":"Mil Somunu","malzeme":"Ms 58/1.4021"},{"no":"9","ad":"O-Ring","malzeme":"EPDM"},{"no":"10","ad":"Destek","malzeme":"St 37"},{"no":"11","ad":"Kol","malzeme":"St 37"},{"no":"12","ad":"Pim","malzeme":"1.4021"},{"no":"13","ad":"Küre","malzeme":"Bronze / AISI 304"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["40","50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"Vana Byoutları DIN 3202/2-F1","kod":"L","degerler":["200","230","290","310","350","400","480","600","730","850"]},{"grup":"","kod":"A","degerler":["1295","1295","1460","1460","1535","1850","1850","2145","2345","2995"]},{"grup":"","kod":"B","degerler":["1562","1562","1755","1755","1890","2305","2305","2995","3150","3700"]},{"grup":"","kod":"H","degerler":["172","172","305","305","330","340","340","340","455","455"]},{"grup":"","kod":"J","degerler":["463","463","545","545","546","721","721","907","1150","1502"]},{"grup":"","kod":"Ød","gruplu_degerler":[{"deger":"280","sutun":2},{"deger":"320","sutun":2},{"deger":"350","sutun":2},{"deger":"400","sutun":2},{"deger":"500","sutun":2}]},{"grup":"Flanş Ölçüleri DIN 2501/TS 810 PIN 10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400"]},{"grup":"Flanş Ölçüleri DIN 2501/TS 810 PIN 10","kod":"D","degerler":["150","165","185","200","220","250","285","340","405","460"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","355","410"]},{"grup":"Ağırlık","kod":"kg","degerler":["19","20","30","35","55","70","100","180","270","370"]}]}],"teknik_cizim_yolu":"/assets/urunler/surge-anticipating-control-valve-d-144/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/surge-anticipating-control-valve-d-144/Köşe Tip Mekanik Şamandralı Vana D-302 PDF.pdf"}]})
  },
  {
    id: 87,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Seviye Kontrol Vanası D-145',
    slug: 'seviye-kontrol-vanasi-d-145',
    stok_kodu: 'D-145',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/seviye-kontrol-vanasi-d-145.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/seviye-kontrol-vanasi-d-145/Seviye Kontrol Vanası D-145 PDF.pdf"}]})
  },
  {
    id: 88,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Solenoid Kontrol Vanası D-147',
    slug: 'solenoid-kontrol-vanasi-d-147',
    stok_kodu: 'D-147',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/solenoid-kontrol-vanasi-d-147.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/solenoid-kontrol-vanasi-d-147/Solenoid Kontrol Vanası D-147 PDF.pdf"}]})
  },
  {
    id: 89,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Debi Ayar Vanası D-148',
    slug: 'debi-ayar-vanasi-d-148',
    stok_kodu: 'D-148',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/debi-ayar-vanasi-d-148.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/debi-ayar-vanasi-d-148/Debi Ayar Vanası D-148 PDF.pdf"}]})
  },
  {
    id: 90,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Basınç Tahliye Vanası D-378',
    slug: 'basinc-tahliye-vanasi-d-378',
    stok_kodu: 'D-378',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/basinc-tahliye-vanasi-d-378.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/basinc-tahliye-vanasi-d-378/Basınç Tahliye Vanası D-378 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hidrolik-on-off-kontrol-vanasi-d-552.jpg"},"urun_tanimi":{"baslik":"HİDROLİK ON/OFF KONTROL VANASI","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"EN GJS 400 / EN GJS 500"},{"no":"2","ad":"Aktüatör Alt Hazne","malzeme":"EN GJS 400 / EN GJS 500"},{"no":"3","ad":"Aktuatör Kapak","malzeme":"EN GJS 400 / EN GJS 500"},{"no":"4","ad":"Mil","malzeme":"AISI 304 / 316 / 420"},{"no":"5","ad":"Yay","malzeme":"AISI 316"},{"no":"6","ad":"Klape","malzeme":"SAE 1040"},{"no":"7","ad":"Kauçuk","malzeme":"EPDM / NBR /VITON / SILICON"},{"no":"8","ad":"Klepe Rondelesi","malzeme":"SAE 1040"},{"no":"9","ad":"O-Ring","malzeme":"EPDM / NBR /VITON / SILICON"},{"no":"10","ad":"Mil Merkezleme Burcu","malzeme":"BRONZE"},{"no":"11","ad":"Diyafram Rondelası","malzeme":"SAE 1040"},{"no":"12","ad":"Diyafram","malzeme":"Neopren Korbezli Kauçuk"},{"no":"13","ad":"İğne Vana","malzeme":"MS58 Dövme"},{"no":"14","ad":"Küresel Vana","malzeme":"MS58 Dövme"},{"no":"15","ad":"Civata","malzeme":"8x8 Galvenized / A2 /A4"},{"no":"16","ad":"Somun","malzeme":"8x8 Galvenized / A2 /A4"}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/hidrolik-on-off-kontrol-vanasi-d-552/Hidrolik On-Off Kontrol Vanası D-552 PDF.pdf"}]})
  },
  {
    id: 93,
    kategori_id: 7,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Pompa Kontrol Vanası D - 598',
    slug: 'pompa-kontrol-vanasi-d-598',
    stok_kodu: 'D-598',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pompa-kontrol-vanasi-d-598.jpg"},"urun_tanimi":{"baslik":"POMPA KONTROL VANASI","satirlar":[]},"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["inch","2","2","323","3","4","5","6","8","10","12","14","16"],"olculer":[{"grup":"","kod":"D","degerler":["mm","50","65","80*50","80","100","125","150","200","250","300","350","400"]},{"grup":"","kod":"L","degerler":["inch","6,49","7,28","7,87","7,87","8,66","9,84","11,2","13,3","15,5","17,5","20,6","23,4"]},{"grup":"","kod":"H","degerler":["mm","165","185","200","200","220","250","285","340","395","445","524","596"]},{"grup":"","kod":"Ağırlık","degerler":["inch","7,87","8,46","8,46","11,4","12","14,3","15,7","19,2","21","22,8","25,6","27,1"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pompa-kontrol-vanasi-d-598/Pompa Kontrol Vanası D - 598 PDF.pdf"}]})
  },
  {
    id: 94,
    kategori_id: 3,
    kategori_adi: 'Hidrolik Vanalar',
    ad: 'Düz Tip Şamandralı Vana',
    slug: 'duz-tip-samandrali-vana',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/duz-tip-samandrali-vana.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/duz-tip-samandrali-vana/Düz Tip Şamandralı Vana PDF.pdf"}]})
  },
  {
    id: 95,
    kategori_id: 7,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Buhar Basınç Düşürücü Kontrol Vanası D-066',
    slug: '79-buhar-basinc-dusurucu-kontrol-vanasi-d-066',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/79-buhar-basinc-dusurucu-kontrol-vanasi-d-066.jpg"},"urun_tanimi":{"baslik":"BUHAR BASINÇ DÜŞÜRÜCÜ KONTROL VANASI","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2","MALZEME 3"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["AISI 304","GGG 40","GSC25 / A216 Gr WCB"]},{"no":"2","ad":"Disk","malzemeler":["AISI 304","AISI 304","GSC25 / A216 Gr WCB"]},{"no":"3","ad":"Ring","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"4","ad":"Mil","malzemeler":["AISI 304","AISI 304","AISI 304"]},{"no":"5","ad":"Kapak","malzemeler":["GG 25- 25","ST37","GSC25 / A216 Gr WCB"]},{"no":"6","ad":"Aktüatör","malzemeler":["GG 25- 25","",""]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["INÇ","L","H","PN 16 (DIN 2501 - BS 4505)","Ø D","Ø k","Ø g","n","Ø d2","b"],"olculer":[{"grup":"","kod":"15","degerler":["1/2\"","130","325","","95","65","45","4","14","14"]},{"grup":"","kod":"20","degerler":["3/4\"","150","328","","105","75","58","4","14","16"]},{"grup":"","kod":"25","degerler":["1\"","160","330","","115","85","68","4","14","16"]},{"grup":"","kod":"32","degerler":["11/4\"","180","340","","140","100","78","4","18","18"]},{"grup":"","kod":"40","degerler":["11/2\"","200","470","","150","110","88","4","18","18"]},{"grup":"","kod":"50","degerler":["2\"","230","480","","165","125","102","4","18","20"]},{"grup":"","kod":"65","degerler":["21/2\"","290","580","","185","145","122","4","18","20"]},{"grup":"","kod":"80","degerler":["3\"","310","600","","200","160","138","8","18","22"]},{"grup":"","kod":"100","degerler":["4\"","350","620","","220","180","158","8","18","24"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/79-buhar-basinc-dusurucu-kontrol-vanasi-d-066/Buhar Basınç Düşürücü Kontrol Vanası D-066 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-basinc-dusurucu-vana-duz-tip-d-143.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/su-basinc-dusurucu-vana-duz-tip-d-143/Su Basınç Düşürücü Vana Düz Tip D-143 PDF.pdf"}]})
  },
  {
    id: 99,
    kategori_id: 3,
    kategori_adi: 'Basınç Düşürücü Vanalar',
    ad: 'Su Basınç Düşürücü Vana Endustriyel Tip D-146',
    slug: 'su-basinc-dusurucu-vana-endustriyel-tip-d-146',
    stok_kodu: 'D-146',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-basinc-dusurucu-vana-endustriyel-tip-d-146.jpg"},"urun_tanimi":{"baslik":"SU BASINÇ DÜŞÜRÜCÜ VANA ENDUSTRİYEL TİP","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2"],"parcalar":[{"no":"1","ad":"Basınç Ayar Vidası","malzemeler":["St. 42","St. 42"]},{"no":"2","ad":"Yay Pulu","malzemeler":["St. 42","St. 42"]},{"no":"3","ad":"Yay","malzemeler":["Yay Çeliği","Yay Çeliği"]},{"no":"4","ad":"Diyafram","malzemeler":["Neopren","Neopren"]},{"no":"5","ad":"Baskı Tavası","malzemeler":["St. 42","St. 42"]},{"no":"6","ad":"Tapa Üst Yatağı","malzemeler":["AISI 304","AISI 304"]},{"no":"7","ad":"Tapa","malzemeler":["AISI 304","AISI 304"]},{"no":"8","ad":"Üst Bilezik","malzemeler":["AISI 304","AISI 304"]},{"no":"9","ad":"Alt Bilezik","malzemeler":["AISI 304","AISI 304"]},{"no":"10","ad":"Gövde","malzemeler":["GG 22/A 126 Gr B","GG 22/A 126 Gr B"]},{"no":"11","ad":"Tapa Alt Yatağı","malzemeler":["AISI 304","AISI 304"]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","40","50","65","80","100","150","200","250","300"],"olculer":[{"grup":"","kod":"INÇ","degerler":["1/2\"","1\"","11/2\"","2\"","21/2\"","3\"","4\"","6\"","8\"","10\"","12\""]},{"grup":"","kod":"L","degerler":["h1","85","95","105","115","130","145","175","205","230","260"]},{"grup":"","kod":"A","gruplu_degerler":[{"deger":"Standart Basınç Aralıkları \" A-H \" Ölçüleri İmalatçısı Tarafından Belirlenir","sutun":11}]},{"grup":"PN 16 (DIN 2501 - BS 4505)","kod":"Ø D","degerler":["95","115","150","165","185","200","220","285","340","405","460"]},{"grup":"","kod":"Ø k","degerler":["65","85","110","125","145","160","180","240","295","355","378"]},{"grup":"","kod":"Ø g","degerler":["45","68","88","102","122","138","158","212","268","320","410"]},{"grup":"","kod":"n","degerler":["4","4","4","4","4","8","8","8","12","12","12"]},{"grup":"","kod":"Ø d2","degerler":["14","14","18","18","18","18","18","22","22","26","26"]},{"grup":"","kod":"B","degerler":["14","16","18","20","20","22","24","26","30","",""]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/su-basinc-dusurucu-vana-endustriyel-tip-d-146/Su Basınç Düşürücü Vana Endustriyel Tip D-146 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/su-pirinc-basinc-dusurucu-vana-disli-d-333.jpg"},"urun_tanimi":{"baslik":"SU PİRİNÇ DÜŞÜRÜCÜ VANA DİŞLİ","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"MS58 (CuZN 40Pb2)"},{"no":"2","ad":"Yay","malzeme":"Çelik / Steel"},{"no":"3","ad":"Conta","malzeme":"NBR 70"},{"no":"4","ad":"Bar","malzeme":"0,5 - 5 Bar"},{"no":"5","ad":"Sıcaklık","malzeme":"Max. 80◦C"},{"no":"6","ad":"Çalış. Basınç","malzeme":"Giriş: Max. 12 Bar - Çıkış: Min: 0,5 Bar"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50"],"olculer":[{"grup":"","kod":"S","degerler":["1/2\"","3/4\"","1\"","1 1/4\"","1 1/2\"","2\""]},{"grup":"ÖLÇÜ AĞIRLIK","kod":"L (mm)","degerler":["110","110","170","220","230","240"]},{"grup":"","kod":"H (mm)","degerler":["40","40","85","95","125","127"]},{"grup":"","kod":"gr.","degerler":["0,35","0,28","1,15","2,00","2,15","3,45"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/su-pirinc-basinc-dusurucu-vana-disli-d-333/Su Pirinç Basınç Düşürücü Vana Dişli D-333 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/izlenebilir-kelebek-vana-yangin-tip-d-230.jpg"},"urun_tanimi":{"baslik":"WAFER KELEBEK VANA (YANGIN TİP)","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"WCB + NİKEL KAPLAMA / CF8"},{"no":"2","ad":"Klape","malzeme":"WCB + NİKEL KAPLAMA / CF8"},{"no":"3","ad":"O-Ring","malzeme":"NBR / EPDM"},{"no":"4","ad":"Mapa","malzeme":"St + NİKEL PASLAMA"}],"olcu_tablolari":[{"baslik":"Wafer Çalpara Çek Vana","olcu_basliklari":["50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"Vana Boyutları","kod":"oD","degerler":["109","129","144","164","191","220","275","330","378"]},{"grup":"","kod":"oP","degerler":["32","45","56","75","98","120","164","210","235"]},{"grup":"","kod":"E","degerler":["16","16","16","18","18","20","22","26","28"]},{"grup":"","kod":"D","degerler":["0","2","3","4","5","6","8","9","10"]},{"grup":"","kod":"oC","degerler":["87","109","119","147","167","198","248","308","368"]},{"grup":"Ağırlık","kod":"kg","degerler":["0.80","1.2","1.5","2.3","3.5","4.1","7","12","18"]}]}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yukselen-milli-surgulu-vana-yangin-d-233.jpg"},"urun_tanimi":{"baslik":"YÜKSELEN MİLLİ SÜRGÜLÜ VANA (YANGIN)","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG 25"},{"no":"2","ad":"Kapak","malzeme":"GG 25"},{"no":"3","ad":"Volan","malzeme":"GG 20"},{"no":"4","ad":"Mil","malzeme":"Paslanmaz Çelik"},{"no":"5","ad":"Sürgü","malzeme":"GG25 / GGG40"},{"no":"6","ad":"Sitler","malzeme":"Ms58 / Bronze"},{"no":"7","ad":"Conta","malzeme":"NBR / EPDM"},{"no":"8","ad":"Gösterge","malzeme":"Ms58 / STAINLES STEEL"}],"olcu_tablolari":[{"baslik":"Sürgülü Vana Metal Yataklı Seviye Göstergesi","olcu_basliklari":["40","50","65","80","100","125","150","200","250","300","350","400","500","600"],"olculer":[{"grup":"Vana Boyutları","kod":"L","degerler":["140","150","170","180","190","200","210","230","250","270","290","310","350","390"]},{"grup":"","kod":"H","degerler":["210","235","260","290","325","425","500","580","720","815","925","1030","1265","1450"]},{"grup":"","kod":"D1","degerler":["160","200","250","315","400","500","","","","","","","",""]},{"grup":"Flanş Ölçüleri PN10","kod":"D","degerler":["150","165","185","200","220","250","285","340","395","445","505","565","670","780"]},{"grup":"","kod":"k","degerler":["110","125","145","160","180","210","240","295","350","400","460","515","620","757"]},{"grup":"","kod":"g","degerler":["84","99","118","132","156","184","211","266","319","370","429","480","582","682"]},{"grup":"","kod":"b","degerler":["18","20","22","24","26","28","30","32","34","36","","","",""]},{"grup":"","kod":"d","degerler":["19","23","28","31","","","","","","","","","",""]},{"grup":"","kod":"n","degerler":["4","8","12","16","20","","","","","","","","",""]},{"grup":"Ağırlık","kod":"kg","degerler":["9","10","15","17","23","37","45","80","123","166","225","290","460","680"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/yukselen-milli-surgulu-vana-yangin-d-233/Yükselen Milli Sürgülü Vana (Yangın) D-233 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/fire-cekvalf-d-234.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/fire-cekvalf-d-234/Fire Çekvalf D-234 PDF.pdf"}]})
  },
  {
    id: 112,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Sabit Kaplin D-297',
    slug: 'sabit-kaplin-d-297',
    stok_kodu: 'D-297',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/sabit-kaplin-d-297.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/sabit-kaplin-d-297/Sabit Kaplin D-297 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yangin-vana-italyan-tip-d-301.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/yangin-vana-italyan-tip-d-301/Yangın Vana (İtalyan Tip) D-301 PDF.pdf"}]})
  },
  {
    id: 115,
    kategori_id: 3,
    kategori_adi: 'Yangın Vanaları',
    ad: 'Yangın Rekoru(Kaplin)ve Kapağı',
    slug: 'yangin-rekoru-kaplin-ve-kapagi',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/yangin-rekoru-kaplin-ve-kapagi.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/yangin-rekoru-kaplin-ve-kapagi/Yangın Rekoru(Kaplin)ve Kapağı PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/paslanmaz-monoblok-kuresel-vana-d-052.jpg"}})
  },
  {
    id: 121,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '3 Parçalı Flanşlı Küresel Vana D-054 - D-055',
    slug: '3-parcali-flansli-kuresel-vana-d-054-d-055',
    stok_kodu: 'D-054',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-flansli-kuresel-vana-d-054-d-055.jpg"},"urun_tanimi":{"baslik":"3 PARÇALI FLANŞLI KÜRESEL VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"PASLANMAZ ÇELİK"},{"no":"2","ad":"Flanş","malzeme":"PASLANMAZ ÇELİK"},{"no":"3","ad":"Kol","malzeme":"PAS. ÇELİK + VİNİL KAPLAMA"},{"no":"4","ad":"Mil","malzeme":"PASLANMAZ ÇELİK"},{"no":"5","ad":"Küre","malzeme":"PASLANMAZ ÇELİK"},{"no":"6","ad":"Ringler","malzeme":"TEFLON"},{"no":"7","ad":"Salmastra","malzeme":"TEFLON"}],"olcu_tablolari":[{"baslik":"Paslanmaz Çelik Flanşlı","olcu_basliklari":["15","20","25","32","40","50","65","80","100"],"olculer":[{"grup":"Vana Boyutları","kod":"L","degerler":["130","150","160","180","200","230","290","310","350"]},{"grup":"","kod":"H","degerler":["95","110","115","130","135","145","155","195","220"]},{"grup":"","kod":"G max","degerler":["160","180","180","250","300","320","350","400","500"]},{"grup":"","kod":"Ø D","degerler":["95","105","115","140","150","165","185","200","235"]},{"grup":"","kod":"Ø K","degerler":["65","75","85","100","110","125","145","160","190"]},{"grup":"","kod":"Ø g","degerler":["46","56","65","76","84","99","118","132","156"]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"16","sutun":1},{"deger":"18","sutun":4},{"deger":"20","sutun":1},{"deger":"22","sutun":1},{"deger":"24","sutun":1},{"deger":"24","sutun":1}]},{"grup":"","kod":"d","gruplu_degerler":[{"deger":"14","sutun":3},{"deger":"18","sutun":5},{"deger":"22","sutun":1}]},{"grup":"Anma Çapı","kod":"n","gruplu_degerler":[{"deger":"4","sutun":5},{"deger":"8","sutun":4}]},{"grup":"","kod":"kg","degerler":["2","2.9","3.8","5.5","6.8","9.6","15","20","36"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/3-parcali-flansli-kuresel-vana-d-054-d-055/3 Parçalı Flanşlı Küresel Vana D-054 - D-055 PDF.pdf"}]})
  },
  {
    id: 122,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '3 Parçalı Dişli Küresel Vana D-049',
    slug: '3-parcali-disli-kuresel-vana-d-049',
    stok_kodu: 'D-049',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/3-parcali-disli-kuresel-vana-d-049.jpg"},"urun_tanimi":{"baslik":"3 PARÇALI DİŞLİ KÜRESEL VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"PASLANMAZ ÇELİK"},{"no":"2","ad":"Kapak","malzeme":"PASLANMAZ ÇELİK"},{"no":"3","ad":"Kol","malzeme":"PAS. ÇELİK + VİNİL KAPLAMA"},{"no":"4","ad":"Mil","malzeme":"PASLANMAZ ÇELİK"},{"no":"5","ad":"Küre","malzeme":"PASLANMAZ ÇELİK"},{"no":"6","ad":"Ringler","malzeme":"TEFLON"},{"no":"7","ad":"Salmastra","malzeme":"TEFLON"}],"olcu_tablolari":[{"baslik":"Paslanmaz Çelik Küresel Vana","olcu_basliklari":["15","20","25","32","40","50"],"olculer":[{"grup":"Vana Boyutları","kod":"G","degerler":["1/2\"","3/4\"","1\"","1 1/4\"","1 1/2\"","2\""]},{"grup":"","kod":"ØB","degerler":["15","20","25","32","38","50"]},{"grup":"","kod":"L","degerler":["75","80","90","110","120","140"]},{"grup":"","kod":"A","gruplu_degerler":[{"deger":"105","sutun":1},{"deger":"126","sutun":1},{"deger":"144","sutun":2},{"deger":"189","sutun":2}]},{"grup":"","kod":"H","degerler":["50","52","65","70","85","93"]},{"grup":"Ağırlık","kod":"kg","degerler":["0.5","0.9","1.2","1.9","2.8","4.4"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/3-parcali-disli-kuresel-vana-d-049/3 Parçalı Dişli Küresel Vana D-049 PDF.pdf"}]})
  },
  {
    id: 123,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '2 Parçalı Dişli Küresel Vana D-047',
    slug: '2-parcali-disli-kuresel-vana-d-047',
    stok_kodu: 'D-047',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/2-parcali-disli-kuresel-vana-d-047.jpg"},"urun_tanimi":{"baslik":"2 PARÇALI DİŞLİ KÜRESEL VANA","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/2-parcali-disli-kuresel-vana-d-047/teknik-cizim.png"})
  },
  {
    id: 124,
    kategori_id: 1,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: '2 Parçalı Paslanmaz Flanşlı Küresel Vana D-376',
    slug: '2-parcali-paslanmaz-flansli-kuresel-vana-d-376',
    stok_kodu: 'D-376',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/2-parcali-paslanmaz-flansli-kuresel-vana-d-376.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/2-parcali-paslanmaz-flansli-kuresel-vana-d-376/2 Parçalı Paslanmaz Flanşlı Küresel Vana D-376 PDF.pdf"}]})
  },
  {
    id: 125,
    kategori_id: 4,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Wafer Çekvalf D-021',
    slug: 'wafer-cekvalf-d-021',
    stok_kodu: 'D-021',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/wafer-cekvalf-d-021.jpg"},"urun_tanimi":{"baslik":"WAFER ÇEKVALF","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"WCB + NİKEL KAPLAMA / CF8"},{"no":"2","ad":"Klape","malzeme":"WCB + NİKEL KAPLAMA / CF8"},{"no":"3","ad":"O-Ring","malzeme":"NBR / EPDM"},{"no":"4","ad":"Mapa","malzeme":"St + NİKEL PASLAMA"}],"olcu_tablolari":[{"baslik":"Wafer Çalpara Çek Vana","olcu_basliklari":["50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"Vana Boyutları","kod":"oD","degerler":["109","129","144","164","191","220","275","330","378"]},{"grup":"","kod":"oP","degerler":["32","45","56","75","98","120","164","210","235"]},{"grup":"","kod":"E","degerler":["16","16","16","18","18","20","22","26","28"]},{"grup":"","kod":"D","degerler":["0","2","3","4","5","6","8","9","10"]},{"grup":"","kod":"oC","degerler":["87","109","119","147","167","198","248","308","368"]},{"grup":"Ağırlık","kod":"kg","degerler":["0.80","1.2","1.5","2.3","3.5","4.1","7","12","18"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/wafer-cekvalf-d-021/Wafer Çekvalf D-021 PDF.pdf"}]})
  },
  {
    id: 126,
    kategori_id: 4,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Çalpara Çekvalf Dişli AISI 304 - 316 D-025',
    slug: 'calpara-cekvalf-disli-aisi-304-316-d-025',
    stok_kodu: 'D-025',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/calpara-cekvalf-disli-aisi-304-316-d-025.jpg"},"urun_tanimi":{"baslik":"ÇALPARA ÇEKVALF DİŞLİ AISI 304 / 316","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"AISI - 304 / 316"},{"no":"2","ad":"Kapak","malzeme":"AISI - 304 / 316"},{"no":"3","ad":"Kpale","malzeme":"AISI - 304 / 316"},{"no":"4","ad":"Pim","malzeme":"PASLANMAZ ÇELİK"},{"no":"5","ad":"Conta","malzeme":"TEFLON"}],"olcu_tablolari":[{"baslik":"Paslanmaz Çalpara Çelik Vana","olcu_basliklari":["15","20","25","32","40","50"],"olculer":[{"grup":"Vana Boyutları","kod":"G","degerler":["1/2\"","3/4\"","1\"","1 1/4\"","1 1/2\"","2\""]},{"grup":"","kod":"E","degerler":["12","17","20","20","20","23"]},{"grup":"","kod":"L","degerler":["65","80","90","105","120","140"]},{"grup":"","kod":"H","degerler":["65","80","90","105","120","140"]},{"grup":"Ağırlık","kod":"kg","degerler":["0.3","0.49","0.7","1.15","1.50","2.18"]}]}]})
  },
  {
    id: 127,
    kategori_id: 4,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Disko Çekvalf AISI D-017 AISI D-018',
    slug: 'disko-cekvalf-aisi-d-017-aisi-d-018',
    stok_kodu: 'D-017',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/disko-cekvalf-aisi-d-017-aisi-d-018.jpg"},"urun_tanimi":{"baslik":"DİSKO ÇEKVALF","satirlar":[]},"parca_kolonlari":["MALZEME 1","MALZEME 2"],"parcalar":[{"no":"1","ad":"Gövde","malzemeler":["Pirinç (CuZn40Pb2) (Sıcak Pres)","GGG 50"]},{"no":"2","ad":"Klavuz","malzemeler":["PASLANMAZ ÇELİK","GGG 50"]},{"no":"3","ad":"Kpale","malzemeler":["PASLANMAZ ÇELİK","GGG 50"]},{"no":"4","ad":"Yaylar","malzemeler":["PASLANMAZ ÇELİK","SS"]}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["15","20","25","32","40","50","65","80","100","125","150","200"],"olculer":[{"grup":"Yaylı","kod":"→ ←","gruplu_degerler":[{"deger":"21","sutun":9},{"deger":"22","sutun":1},{"deger":"23.5","sutun":1},{"deger":"24","sutun":1}]},{"grup":"","kod":"↓","gruplu_degerler":[{"deger":"17","sutun":2},{"deger":"18.3","sutun":1},{"deger":"16.3","sutun":1},{"deger":"16.2","sutun":1},{"deger":"16.1","sutun":1},{"deger":"15","sutun":1},{"deger":"13.7","sutun":1},{"deger":"12.5","sutun":1},{"deger":"12","sutun":1},{"deger":"13","sutun":1},{"deger":"14.5","sutun":1}]},{"grup":"","kod":"↑","gruplu_degerler":[{"deger":"23","sutun":4},{"deger":"24","sutun":1},{"deger":"25","sutun":2},{"deger":"26","sutun":1},{"deger":"26.5","sutun":1},{"deger":"30","sutun":1},{"deger":"32.5","sutun":1},{"deger":"35","sutun":1}]},{"grup":"Yaysız","kod":"↓","gruplu_degerler":[{"deger":"2.6","sutun":3},{"deger":"3.9","sutun":1},{"deger":"4","sutun":1},{"deger":"4.2","sutun":1},{"deger":"5.1","sutun":1},{"deger":"5.6","sutun":1},{"deger":"7.4","sutun":1},{"deger":"15","sutun":1},{"deger":"17","sutun":1},{"deger":"18.5","sutun":1}]},{"grup":"Anma Çapı","kod":"DN","degerler":["15","20","25","32","40","50","65","80","100","125","150","200"]},{"grup":"Vana Boyutları DIN 3202 / 3 - K4","kod":"Ød","degerler":["40","47","56","72","82","95","115","132","152","184","209","264"]},{"grup":"","kod":"Ød1","degerler":["15","20","25","31.5","39","48","64","74","89","112","132","175"]},{"grup":"","kod":"L","degerler":["16","19","22","28","31.5","40","46","50","60","90","106","140"]},{"grup":"Ağırlık","kod":"kg","degerler":["0.094","0.134","0.202","0.458","0.620","0.976","1.360","2.078","3.030","6.80","10.00","20.00"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/disko-cekvalf-aisi-d-017-aisi-d-018/Disko Çekvalf AISI D-017 AISI D-018 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/igne-vana-d-159.jpg"},"urun_tanimi":{"baslik":"İĞNE VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Body","malzeme":"Stainless Steel AISI 304"},{"no":"2","ad":"Stem","malzeme":"Stainless Steel AISI 304"},{"no":"3","ad":"Glandpacking","malzeme":"Graphite"},{"no":"4","ad":"Gland","malzeme":"Stainless Steel AISI 304"},{"no":"5","ad":"Gland nut","malzeme":"Stainless Steel AISI 304"},{"no":"6","ad":"Handwheel","malzeme":"Pressed Steel"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["Mpa 20◦ C","6","8","10","15","20","25"],"olculer":[{"grup":"","kod":"D","degerler":["Mpa 300◦ C","1/8\"","1/4\"","3/8\"","1/2\"","3/4\"","1\""]},{"grup":"","kod":"d","degerler":["","4","5","5","5","8","10"]},{"grup":"","kod":"L","degerler":["","60","60","60","60","70","78"]},{"grup":"","kod":"Hmax","degerler":["","85","85","85","85","100","110"]},{"grup":"","kod":"Max Working - Pressure","degerler":["","40,0","40,0","40,0","40,0","40,0","40,0"]},{"grup":"","kod":"Kg","degerler":["","2,0","2,0","2,0","2,0","2,0","2,0"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/igne-vana-d-159/İğne Vana D-159 PDF.pdf"}]})
  },
  {
    id: 130,
    kategori_id: 2,
    kategori_adi: 'Paslanmaz Vanalar',
    ad: 'Wafer Kelebek Vana D-032',
    slug: '115-wafer-kelebek-vana-d-032',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/115-wafer-kelebek-vana-d-032.jpg"},"urun_tanimi":{"baslik":"WAFER KELEBEK VANA","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"GG25 / GGG40"},{"no":"2","ad":"Klape","malzeme":"GGG40,3 / NİKEL KAPLAMA"},{"no":"3","ad":"Kol","malzeme":"GGG40"},{"no":"4","ad":"Alt / Üst Mil","malzeme":"PASLANMAZ ÇELİK"},{"no":"5","ad":"Sızdırmazlık Yatağı","malzeme":"EPDM / NBR"},{"no":"6","ad":"Tapa","malzeme":"ÇELİK"},{"no":"7","ad":"Salmastra","malzeme":"FIBER GLASS"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["k","Ölçüsüz Uzunluk","b","40","50","65","80","100","125","150","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"PN 6","degerler":["n","Adet (Qty)","mxl","100","110","130","150","170","200","225","280","335","395","445","495","550","600","705"]},{"grup":"","kod":"PN 10","degerler":["Ød","b","n","4","4","4","4","4","8","8","8","12","12","12","16","16","20","20"]},{"grup":"","kod":"PN 16","degerler":["Flanş Kal. (mm)","Ölçüsüz Uzunluk","b","14","14","14","19","19","19","19","19","19","23","23","23","23","23","28"]},{"grup":"","kod":"","degerler":["Saplama","Ölçüsüz Uzunluk","mxl","16","16","16","18","18","20","20","22","24","24","26","28","28","30","30"]}]},{"baslik":null,"olcu_basliklari":["A","40","50","65","80","100","125","150","200","250","300","350","400","450","500","600"],"olculer":[{"grup":"","kod":"Øg","degerler":["Tip","42.5","53","65","79","104,5","121,5","156","203","251","302,5","354","402","455","492,5","582"]},{"grup":"","kod":"H1","degerler":["oN","77","81","87","99","111","132","144,5","185,5","208,5","251","277","308","342","374","459"]},{"grup":"","kod":"H2","degerler":["oM","14.4","16.2","175.5","193","200","218","226","280","314,5","354","388","416","455","490","562"]},{"grup":"","kod":"H3","degerler":["Ød1x2","32.5","32.5","32.5","32,5","32,5","33","33","40,5","40,5","40,5","45","51","51","64","70"]},{"grup":"","kod":"H4","degerler":["","254","275.5","295","324,5","343,5","383","403,5","506","563,5","645,5","710","775","848","928","1091"]},{"grup":"","kod":"B","degerler":["","32","32","32","32","32","32","32","39,5","39,5","39,5","44","50","50","63","69"]},{"grup":"","kod":"L","degerler":["","33","43","46","46","52","56","56","60","68","78","92","102","114","127","154"]},{"grup":"","kod":"W","degerler":["","26.8","31","45.9","62,2","90,6","110","145,6","193,9","241,6","292,3","341,8","388,8","445,6","480,5","566,4"]},{"grup":"","kod":"Mil","degerler":["","11","11","11","11","14","17","17","17","22","22","22","27","27","36","36"]},{"grup":"","kod":"TEPE FLANŞI (ISO 5211)","degerler":["","F05","F05","F05","F05","F07","F07","F07","F10","F10","F10","F10","F16","F16","F16","F16"]},{"grup":"","kod":"Ağırlık kg.","degerler":["","65","65","65","65","90","90","90","125","125","125","125","210","210","210","210"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/115-wafer-kelebek-vana-d-032/Wafer Kelebek Vana D-032 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/statik-balans-vanasi.jpg"},"urun_tanimi":{"baslik":"Statik Balans Vanası","satirlar":[]},"parcalar":[{"no":"1","ad":"Gövde","malzeme":"Pik Döküm (GG25)"},{"no":"2","ad":"Klape","malzeme":"Paslanmaz Çelik"},{"no":"3","ad":"Klape Sızdırmazlık Stili","malzeme":"PTFE"},{"no":"4","ad":"Kol","malzeme":"Karbon Çelik"},{"no":"5","ad":"Ölçüm Noktaları","malzeme":"Pirinç"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["50","65","80","100","125","150","200","250","300"],"olculer":[{"grup":"","kod":"L","degerler":["230","290","310","350","400","480","600","730","850"]},{"grup":"","kod":"H","degerler":["280","365","395","430","495","530","665","600","685"]},{"grup":"","kod":"ØD","degerler":["160","185","200","220","250","285","340","405","460"]},{"grup":"","kod":"ØK","degerler":["125","145","160","180","210","240","295","355","410"]},{"grup":"","kod":"nxØd","degerler":["4x18","4x18","8x18","8x18","8x18","8x22","8x22","12x22","12x26"]},{"grup":"","kod":"Kg","degerler":["48,5","74,4","111","165","242","372","704","812","1380"]}]}],"teknik_cizim_yolu":"/assets/urunler/statik-balans-vanasi/teknik-cizim.png","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/statik-balans-vanasi/Statik Balans Vanası PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/doner-flansli-kompansator-d-099.jpg"},"urun_tanimi":{"baslik":"DÖNER FLANŞLI KOMPANSATÖR","satirlar":[]},"parcalar":[{"no":"1","ad":"Körük","malzeme":"Paslanmaz Çelik (AISI 321)"},{"no":"2","ad":"Flanş","malzeme":"ÇELİK"}],"olcu_tablolari":[{"baslik":"Metal Körüklü Kompansatör Döner Flanşlı (Laynersiz)","olcu_basliklari":["25","32","40","50","65","80","100","125","150","200","250"],"olculer":[{"grup":"","kod":"L","gruplu_degerler":[{"deger":"180","sutun":8},{"deger":"130","sutun":1},{"deger":"140","sutun":2}]},{"grup":"","kod":"ØD","degerler":["115","140","150","165","185","200","220","250","285","340","405"]},{"grup":"","kod":"ØK","degerler":["85","100","110","125","145","160","180","210","240","295","355"]},{"grup":"","kod":"△ x (Eksenel Hareket)","gruplu_degerler":[{"deger":"30 mm (-20/ +10mm)","sutun":11}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"16","sutun":3},{"deger":"18","sutun":2},{"deger":"20","sutun":2},{"deger":"22","sutun":2},{"deger":"24","sutun":1},{"deger":"26","sutun":1}]},{"grup":"","kod":"Ød x n","gruplu_degerler":[{"deger":"4x14","sutun":1},{"deger":"4x19","sutun":4},{"deger":"8x19","sutun":3},{"deger":"8x23","sutun":1},{"deger":"12x23","sutun":1},{"deger":"12x28","sutun":1}]}]},{"baslik":null,"olcu_basliklari":["65","80","100","125","150","200","250"],"olculer":[{"grup":"","kod":"L","gruplu_degerler":[{"deger":"180","sutun":4},{"deger":"190","sutun":1},{"deger":"200","sutun":2}]},{"grup":"","kod":"ØD","degerler":["185","200","220","250","285","340","405"]},{"grup":"","kod":"△ x (Eksenel Hareket)","gruplu_degerler":[{"deger":"60 mm (-20/ +20 mm)","sutun":7}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"18","sutun":1},{"deger":"20","sutun":2},{"deger":"22","sutun":2},{"deger":"24","sutun":1},{"deger":"26","sutun":1}]},{"grup":"","kod":"Ød x n","gruplu_degerler":[{"deger":"4x19","sutun":1},{"deger":"8x19","sutun":3},{"deger":"8x23","sutun":1},{"deger":"12x23","sutun":1},{"deger":"23x28","sutun":1}]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/doner-flansli-kompansator-d-099/Döner Flanşlı Kompansatör D-099 PDF.pdf"}]})
  },
  {
    id: 142,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Kaynak Boyunlu Kompansatör D-106',
    slug: 'kaynak-boyunlu-kompansator-d-106',
    stok_kodu: 'D-106',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kaynak-boyunlu-kompansator-d-106.jpg"},"urun_tanimi":{"baslik":"KAYNAK BOYUNLU KOMPANSATÖR","satirlar":[]},"parcalar":[{"no":"1","ad":"Körük","malzeme":"Paslanmaz Çelik (AISI 321)"},{"no":"2","ad":"Kaynak Boynu","malzeme":"Galvanızlı Çelik Boru"}],"olcu_tablolari":[{"baslik":"Kaynak Boyunlu (Laynersiz)","olcu_basliklari":["25","32","40","50","65","80","100","125","150","200","250"],"olculer":[{"grup":"","kod":"L","gruplu_degerler":[{"deger":"120","sutun":4},{"deger":"260","sutun":1},{"deger":"280","sutun":3},{"deger":"300","sutun":1},{"deger":"350","sutun":1},{"deger":"390","sutun":1}]},{"grup":"","kod":"ØD","degerler":["33,7","42,4","48,3","60,3","76,1","88,9","114,3","139,7","168,3","219,1","273"]},{"grup":"","kod":"ØK","gruplu_degerler":[{"deger":"40","sutun":4},{"deger":"50","sutun":4},{"deger":"60","sutun":2},{"deger":"70","sutun":1}]},{"grup":"","kod":"△ x (Eksenel Hareket)","gruplu_degerler":[{"deger":"30 mm (-20/+10mm )","sutun":11}]},{"grup":"","kod":"s","gruplu_degerler":[{"deger":"2,6","sutun":3},{"deger":"2,9","sutun":2},{"deger":"3,2","sutun":1},{"deger":"3,6","sutun":1},{"deger":"4","sutun":1},{"deger":"4,5","sutun":1},{"deger":"5,6","sutun":1},{"deger":"8,3La","sutun":1}]}]},{"baslik":null,"olcu_basliklari":["65","80","100","125","150","200","250"],"olculer":[{"grup":"","kod":"L","gruplu_degerler":[{"deger":"260","sutun":1},{"deger":"280","sutun":3},{"deger":"300","sutun":1},{"deger":"350","sutun":1},{"deger":"390","sutun":1}]},{"grup":"","kod":"ØD","degerler":["76,1","88,9","114,3","139,7","168,3","219,1","273"]},{"grup":"","kod":"L2","degerler":["50","50","50","50","60","60","70"]},{"grup":"","kod":"△ x (Eksenel Hareket)","gruplu_degerler":[{"deger":"60 mm (-40/ +20 mm)","sutun":7}]},{"grup":"","kod":"s","degerler":["2,9","3,2","3,6","4","4,5","5,6","8,3"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/kaynak-boyunlu-kompansator-d-106/Kaynak Boyunlu Kompansatör D-106 PDF.pdf"}]})
  },
  {
    id: 143,
    kategori_id: 3,
    kategori_adi: 'Kompansatörler',
    ad: 'Sabit Flanşlı Kompansatör D-103',
    slug: 'sabit-flansli-kompansator-d-103',
    stok_kodu: 'D-103',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/sabit-flansli-kompansator-d-103.jpg"},"urun_tanimi":{"baslik":"SABİT FLANŞLI KOMPANSATÖR","satirlar":[]},"parcalar":[{"no":"1","ad":"Körük","malzeme":"Paslanmaz Çelik (AISI 321)"},{"no":"2","ad":"Flanş","malzeme":"Paslanmaz Çelik"},{"no":"3","ad":"Layner","malzeme":"Paslanmaz Çelik"}],"olcu_tablolari":[{"baslik":"Metal Körüklü Kompasatör Sabit Flanşli (Laynersiz)","olcu_basliklari":["25","32","40","50","65","80","100","125","150","200","250"],"olculer":[{"grup":"","kod":"L","gruplu_degerler":[{"deger":"120","sutun":8},{"deger":"130","sutun":1},{"deger":"140","sutun":2}]},{"grup":"","kod":"ØD","degerler":["115","140","150","165","185","200","220","250","285","340","405"]},{"grup":"","kod":"ØK","degerler":["85","100","110","125","145","160","180","210","240","295","355"]},{"grup":"","kod":"△ x (Eksenel Hareket)","gruplu_degerler":[{"deger":"30 mm (-20/+10mm )","sutun":11}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"16","sutun":3},{"deger":"18","sutun":2},{"deger":"20","sutun":2},{"deger":"22","sutun":2},{"deger":"24","sutun":1},{"deger":"26","sutun":1}]},{"grup":"","kod":"Ød x n","gruplu_degerler":[{"deger":"4x14","sutun":1},{"deger":"4x19","sutun":4},{"deger":"8x19","sutun":3},{"deger":"8x23","sutun":1},{"deger":"12x23","sutun":1},{"deger":"12x28","sutun":1}]}]},{"baslik":null,"olcu_basliklari":["65","80","100","125","150","200","250"],"olculer":[{"grup":"","kod":"L","gruplu_degerler":[{"deger":"180","sutun":4},{"deger":"190","sutun":1},{"deger":"200","sutun":2}]},{"grup":"","kod":"ØD","degerler":["185","200","220","250","285","340","405"]},{"grup":"","kod":"Øk","degerler":["145","160","180","210","240","295","355"]},{"grup":"","kod":"△ x (Eksenel Hareket)","gruplu_degerler":[{"deger":"60 mm (-40/ +20 mm)","sutun":7}]},{"grup":"","kod":"b","gruplu_degerler":[{"deger":"18","sutun":1},{"deger":"20","sutun":2},{"deger":"22","sutun":2},{"deger":"24","sutun":1},{"deger":"26","sutun":1}]},{"grup":"","kod":"Ød x n","gruplu_degerler":[{"deger":"4x19","sutun":1},{"deger":"8x19","sutun":3},{"deger":"8x23","sutun":1},{"deger":"12x23","sutun":1},{"deger":"12x28","sutun":1}]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/sabit-flansli-kompansator-d-103/Sabit Flanşlı Kompansatör D-103 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/orgulu-esnek-metal-hortum-d-142.jpg"},"urun_tanimi":{"baslik":"ÖRGÜLÜ ESNEK METAL HORTUM","satirlar":[]},"parcalar":[{"no":"1","ad":"Hortum","malzeme":"Paslanmaz Çelik"},{"no":"2","ad":"Örgü Teli","malzeme":"Paslanmaz Çelik"},{"no":"3","ad":"Uç Bağlantıları","malzeme":"Paslanmaz Çelik Veya Karbon Çelik"}],"olcu_tablolari":[{"baslik":null,"olcu_basliklari":["d1 (mm)","8","10","12","16","20","32","40","50","65","80","100","125","150"],"olculer":[{"grup":"","kod":"Seri No","degerler":["tol. (±) (mm)","ASS 8 FH","ASS 10 FH","ASS 12 FH","ASS 15 FH","ASS 20 FH","ASS 25 FH","ASS 40 FH","ASS 50 FH","ASS 65 FH","ASS 80 FH","ASS 100 FH","ASS 125 FH","ASS 150 FH"]},{"grup":"","kod":"İç Çap","degerler":["d2 (mm)","8,1","10,1","12,1","16,1","20,1","25,3","40,0","50,0","65,3","80,2","100,0","126,2","151,6"]},{"grup":"","kod":"Dış Çap","degerler":["d3 (mm)","0,2","0,2","0,2","0,2","0,3","0,3","0,3","0,3","0,4","0,4","0,5","0,6","1,4"]},{"grup":"","kod":"Bükme Çapı","degerler":["tol. (±) (mm)","12,1","14,1","16,5","21,5","26,5","32,0","49,5","49,5","78,0","94,8","116,2","145,0","171,0"]},{"grup":"","kod":"PN (bar)","degerler":["f min (mm)","13,5","15,5","18,0","23,0","27,0","34,0","51,5","51,5","81,2","98,0","119,4","148,2","174,2"]}]}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/orgulu-esnek-metal-hortum-d-142/Örgülü Esnek Metal Hortum D-142 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/163-sabit-kaplin-d-297.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/163-sabit-kaplin-d-297/Sabit Kaplin D-297 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/182-yangin-rekoru-kaplin-ve-kapagi.jpg"},"urun_tanimi":{"baslik":"YANGIN REKORU (KAPLİN)","satirlar":[]},"parcalar":[{"no":"1","ad":"Kaplin-Rekor","malzeme":"PİRİNÇ / ALÜMİNYUM"},{"no":"2","ad":"Kapak","malzeme":"PİRİNÇ / ALÜMİNYUM"},{"no":"3","ad":"Conta","malzeme":"EPDM"},{"no":"4","ad":"Zincir","malzeme":"ÇELİK"}],"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/182-yangin-rekoru-kaplin-ve-kapagi/Yangın Rekoru(Kaplin)ve Kapağı PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cok-turlu-aktuator-on-off.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/cok-turlu-aktuator-on-off/Çok turlu aktüatör On-Off PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/elektrik-aktuatorlu-kelebek-vana-wafer-tip-d-187/Elektrik Aktüatörlü Kelebek Vana (Wafer Tip) D-187 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/elektrik-aktuatorlu-kuresel-vana-3-pcs-disli-d-175/Elektrik Aktüatörlü Küresel Vana (3 PCS Dişli) D-175 PDF.pdf"}]})
  },
  {
    id: 198,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Çift Etkili Pnömatik Aktüatörlü 3 Yollu Küresel Vana L Tipi - T Tipi D-177',
    slug: 'cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177',
    stok_kodu: 'D-177',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/cift-etkili-pnomatik-aktuatorlu-3-yollu-kuresel-vana-l-tipi-t-tipi-d-177/Çift Etkili Pnömatik Aktüatörlü 3 Yollu Küresel Vana L Tipi - T Tipi D-177 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/cift-etkili-pnomatik-aktuatorlu-kelebek-vana-lug-tip-d-172/Çift Etkili Pnömatik Aktüatörlü Kelebek Vana (Lug Tip) D-172 PDF.pdf"}]})
  },
  {
    id: 201,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü PVC Küresel Vana D-190',
    slug: 'elektrik-aktuatorlu-pvc-kuresel-vana-d-190',
    stok_kodu: 'D-190',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-pvc-kuresel-vana-d-190.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/elektrik-aktuatorlu-pvc-kuresel-vana-d-190/Elektrik Aktüatörlü PVC Küresel Vana D-190 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/aktuatorlu-surgulu-vana-d-270.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/aktuatorlu-surgulu-vana-d-270/Aktüatörlü Sürgülü Vana D-270 PDF.pdf"}]})
  },
  {
    id: 206,
    kategori_id: 1,
    kategori_adi: 'Aktüatörlü Vanalar',
    ad: 'Elektrik Aktüatörlü Küresel Vana D-193',
    slug: 'elektrik-aktuatorlu-kuresel-vana-d-193',
    stok_kodu: 'D-193',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/elektrik-aktuatorlu-kuresel-vana-d-193.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/elektrik-aktuatorlu-kuresel-vana-d-193/Elektrik Aktüatörlü Küresel Vana D-193 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/samandirali-debimetre-d-210.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/samandirali-debimetre-d-210/Şamandıralı Debimetre D-210 PDF.pdf"}]})
  },
  {
    id: 217,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Metal Gövdeli Şamandıralı Debimetre D-211',
    slug: 'metal-govdeli-samandirali-debimetre-d-211',
    stok_kodu: 'D-211',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/metal-govdeli-samandirali-debimetre-d-211.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/metal-govdeli-samandirali-debimetre-d-211/Metal Gövdeli Şamandıralı Debimetre D-211 PDF.pdf"}]})
  },
  {
    id: 218,
    kategori_id: 3,
    kategori_adi: 'Debi (Akış)',
    ad: 'Pedal Tip Akış Şalterleri D-215',
    slug: 'pedal-tip-akis-salterleri-d-215',
    stok_kodu: 'D-215',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/pedal-tip-akis-salterleri-d-215.jpg"},"dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/pedal-tip-akis-salterleri-d-215/Pedal Tip Akış Şalterleri D-215 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/kuru-tip-alttan-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"KURU TİP ALTTAN ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/kuru-tip-alttan-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/kuru-tip-alttan-cikisli-manometre/Kuru Tip Alttan Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 222,
    kategori_id: 1,
    kategori_adi: 'Basınç',
    ad: 'Mini Elektrik Aktüatörlü Küresel Vana D-194',
    slug: '225-mini-elektrik-aktuatorlu-kuresel-vana-d-194',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/225-mini-elektrik-aktuatorlu-kuresel-vana-d-194.jpg"},"urun_tanimi":{"baslik":"MİNİ ELEKTRİK AKTÜATÖRLÜ KÜRESEL VANA","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/225-mini-elektrik-aktuatorlu-kuresel-vana-d-194/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/225-mini-elektrik-aktuatorlu-kuresel-vana-d-194/Mini Elektrik Aktüatörlü Küresel Vana D-194 PDF.pdf"}]})
  },
  {
    id: 223,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Gliserin Tip Alttan Çıkışlı Manometreler',
    slug: 'gliserin-tip-alttan-cikisli-manometreler',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/gliserin-tip-alttan-cikisli-manometreler.jpg"},"urun_tanimi":{"baslik":"GLİSERİN TİP ALTTAN ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/gliserin-tip-alttan-cikisli-manometreler/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/gliserin-tip-alttan-cikisli-manometreler/Gliserin Tip Alttan Çıkışlı Manometreler PDF.pdf"}]})
  },
  {
    id: 224,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Gliserin Tip Arka Çıkışlı Manometreler',
    slug: 'gliserin-tip-arka-cikisli-manometreler',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/gliserin-tip-arka-cikisli-manometreler.jpg"},"urun_tanimi":{"baslik":"GLİSERİN TİP ARKA ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/gliserin-tip-arka-cikisli-manometreler/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/gliserin-tip-arka-cikisli-manometreler/Gliserin Tip Arka Çıkışlı Manometreler PDF.pdf"}]})
  },
  {
    id: 225,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre',
    slug: 'endustriyel-manometre-c1-1-6-alttan-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE-C1 , ALTTAN ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/endustriyel-manometre-c1-1-6-alttan-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/endustriyel-manometre-c1-1-6-alttan-cikisli-manometre/Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 226,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre',
    slug: 'endustriyel-manometre-c1-1-6-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE-C1 , 1.6 ARKA ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/endustriyel-manometre-c1-1-6-arka-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/endustriyel-manometre-c1-1-6-arka-cikisli-manometre/Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 227,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: 'endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE -C1 1ARKA ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/endustriyel-manometre-c1-1-arka-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/endustriyel-manometre-c1-1-arka-cikisli-manometre/Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 228,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: '231-endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/231-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE-C1 1 ARKA ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/231-endustriyel-manometre-c1-1-arka-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/231-endustriyel-manometre-c1-1-arka-cikisli-manometre/Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 229,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre',
    slug: '232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE-C1 1,6 ALTTAN ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/232-endustriyel-manometre-c1-1-6-alttan-cikisli-manometre/Endüstriyel Manometre-C1. 1,6 Alttan Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 230,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre',
    slug: '233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE-C1 1,6 ARKA ÇIKILKI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/233-endustriyel-manometre-c1-1-6-arka-cikisli-manometre/Endüstriyel Manometre-C1. 1,6 Arka Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 231,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: '234-endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/234-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE -C1 1,6 ARKA ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/234-endustriyel-manometre-c1-1-arka-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/234-endustriyel-manometre-c1-1-arka-cikisli-manometre/Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 232,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre',
    slug: '235-endustriyel-manometre-c1-1-arka-cikisli-manometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/235-endustriyel-manometre-c1-1-arka-cikisli-manometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL MANOMETRE-C1 ARKA ÇIKIŞLI MANOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/235-endustriyel-manometre-c1-1-arka-cikisli-manometre/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/235-endustriyel-manometre-c1-1-arka-cikisli-manometre/Endüstriyel Manometre-C1. 1 Arka Çıkışlı Manometre PDF.pdf"}]})
  },
  {
    id: 233,
    kategori_id: 3,
    kategori_adi: 'Basınç',
    ad: 'Manometre Bağlantı Sifonu D-570',
    slug: 'manometre-baglanti-sifonu-d-570',
    stok_kodu: 'D-570',
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/manometre-baglanti-sifonu-d-570.jpg"},"urun_tanimi":{"baslik":"MANOMETRE BAĞLANTI SİFONU","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/manometre-baglanti-sifonu-d-570/teknik-cizim.jpg","dokumanlar":[{"baslik":"Ürün PDF","aciklama":"Ürün kataloğu ve teknik bilgiler","tur":"PDF","dosya_yolu":"/assets/urunler/manometre-baglanti-sifonu-d-570/Manometre Bağlantı Sifonu D-570 PDF.pdf"}]})
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
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/hvac-bimetal-thermometre-byk.jpg"},"urun_tanimi":{"baslik":"HVAC BİMETAL THERMOMETRE BYK","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/hvac-bimetal-thermometre-byk/teknik-cizim.jpg"})
  },
  {
    id: 239,
    kategori_id: 3,
    kategori_adi: 'Sıcaklık',
    ad: 'Endüstriyel Termometre',
    slug: 'endustriyel-termometre',
    stok_kodu: null,
    teknik_bilgiler: JSON.stringify({"katalog_bilgileri":{"gorsel_yolu":"/assets/urunler/genel/endustriyel-termometre.jpg"},"urun_tanimi":{"baslik":"ENDÜSTRİYEL TERMOMETRE","satirlar":[]},"teknik_cizim_yolu":"/assets/urunler/endustriyel-termometre/teknik-cizim.jpg"})
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
