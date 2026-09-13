import { useEffect, useMemo, useRef, useState } from 'react';
import '../stiller/referanslar.css';

const ILK_GOSTERIM_ADEDI = 8;
const EK_GOSTERIM_ADEDI = 4;

function aramaMetniniNormallestir(metin) {
  return String(metin ?? '').toLocaleLowerCase('tr-TR').trim();
}

function GaleriGorseli({ gorsel, sinifAdi }) {
  const gorselStili = {
    backgroundImage: `url("${gorsel.gorsel_yolu}")`,
    backgroundPosition: `${gorsel.odak_x ?? 50}% ${gorsel.odak_y ?? 50}%`,
    backgroundSize: `${gorsel.gorsel_olcegi ?? 100}% auto`
  };

  // Arka plan kullanımı, tek fotoğraf şeridinden farklı kadrajlar alırken admin tarafından verilen odak değerlerini korur.
  return <span className={sinifAdi} style={gorselStili} role="img" aria-label={gorsel.alternatif_metin} />;
}

function BuyutSimgesi() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function yilAraligiOlustur(kayitlar) {
  const yillar = kayitlar.flatMap((kayit) => String(kayit.yil ?? '').match(/\d{4}/g) ?? []).map(Number);
  if (!yillar.length) return '—';
  const ilkYil = Math.min(...yillar);
  const sonYil = Math.max(...yillar);
  return ilkYil === sonYil ? String(ilkYil) : `${ilkYil}–${sonYil}`;
}

function metinSablonuUygula(sablon, degerler) {
  return Object.entries(degerler).reduce((metin, [anahtar, deger]) => metin.replaceAll(`{${anahtar}}`, deger ?? ''), sablon);
}

function ReferansKarti({ kayit, sira, acik, onToggle, detayEtiketi, detaySablonu }) {
  const detayKimligi = `referans-detay-${kayit.id}`;
  const gecikme = `${Math.min(sira % 4, 3) * 65}ms`;

  return (
    <li id={`referans-${kayit.id}`} className={`referans-kaydi${acik ? ' referans-kaydi--acik' : ''}`} style={{ '--referans-gecikme': gecikme }}>
      <button className="referans-kaydi__dugme" type="button" aria-expanded={acik} aria-controls={detayKimligi} onClick={onToggle}>
        <span className="referans-kaydi__numara" aria-hidden="true">{String(kayit.siralama ?? sira + 1).padStart(2, '0')}</span>
        <span className="referans-kaydi__icerik">
          <span className="referans-kaydi__sektor">{kayit.sektor_adi ?? 'Referans'}</span>
          <span className="referans-kaydi__baslik">{kayit.baslik}</span>
          <span className="referans-kaydi__meta">{kayit.konum}<span aria-hidden="true"> • </span>{kayit.kurum}</span>
        </span>
        <span className="referans-kaydi__yan">
          {kayit.yil && <span className="referans-kaydi__yil">{kayit.yil}</span>}
          <span className="referans-kaydi__ok" aria-hidden="true">→</span>
        </span>
      </button>
      <div id={detayKimligi} className="referans-kaydi__detay" aria-hidden={!acik}>
        <div className="referans-kaydi__detay-kirpici">
          <div className="referans-kaydi__detay-icerik">
            <span className="referans-kaydi__detay-etiket">{detayEtiketi}</span>
            <p>{metinSablonuUygula(detaySablonu, { kurum: kayit.kurum, konum: kayit.konum, sektor: kayit.sektor_adi?.toLocaleLowerCase('tr-TR') ?? 'endüstriyel', yil: kayit.yil ? ` • ${kayit.yil}` : '' })}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function ReferanslarSayfasi({ referanslar = { kayitlar: [], gorseller: [] }, siteAyarlari = {} }) {
  const [etkinSektor, setEtkinSektor] = useState('tumu');
  const [arama, setArama] = useState('');
  const [gosterimSiniri, setGosterimSiniri] = useState(ILK_GOSTERIM_ADEDI);
  const [acikReferans, setAcikReferans] = useState(null);
  const [seciliGorsel, setSeciliGorsel] = useState(null);
  const kapatmaDugmesi = useRef(null);
  const oncekiOdak = useRef(null);
  const kayitlar = referanslar?.kayitlar ?? [];
  const gorseller = referanslar?.gorseller ?? [];
  const sektorler = referanslar?.sektorler ?? [];

  const filtrelenmisKayitlar = useMemo(() => {
    const aranan = aramaMetniniNormallestir(arama);
    return kayitlar.filter((kayit) => {
      const sektorUygun = etkinSektor === 'tumu' || kayit.sektor_slug === etkinSektor;
      const aranabilirMetin = aramaMetniniNormallestir(`${kayit.baslik} ${kayit.konum} ${kayit.kurum} ${kayit.sektor_adi}`);
      return sektorUygun && (!aranan || aranabilirMetin.includes(aranan));
    });
  }, [arama, etkinSektor, kayitlar]);

  const yurticiKayitlar = filtrelenmisKayitlar.filter((kayit) => kayit.bolge !== 'yurtdisi');
  const yurtdisiKayitlar = filtrelenmisKayitlar.filter((kayit) => kayit.bolge === 'yurtdisi');
  const gorunenYurticiKayitlar = yurticiKayitlar.slice(0, gosterimSiniri);
  const gorunenKayitSayisi = gorunenYurticiKayitlar.length + yurtdisiKayitlar.length;
  const konumSayisi = new Set(kayitlar.map((kayit) => kayit.konum).filter(Boolean)).size;
  const sektorSayisi = new Set(kayitlar.map((kayit) => kayit.sektor_slug).filter(Boolean)).size;
  const [sonucMetniOncesi, sonucMetniSonrasi] = (siteAyarlari.referans_sonuc_metni ?? '{sayi} referans gösteriliyor').split('{sayi}');

  useEffect(() => {
    if (!seciliGorsel) return undefined;
    const oncekiTasima = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    kapatmaDugmesi.current?.focus();
    const klavyeDinle = (olay) => { if (olay.key === 'Escape') setSeciliGorsel(null); };
    document.addEventListener('keydown', klavyeDinle);

    // Modal kapanınca sayfa kaydırmasını ve kullanıcının önceki klavye odağını geri getiririz.
    return () => {
      document.body.style.overflow = oncekiTasima;
      document.removeEventListener('keydown', klavyeDinle);
      oncekiOdak.current?.focus();
    };
  }, [seciliGorsel]);

  useEffect(() => {
    const kartKapat = (olay) => { if (olay.key === 'Escape') setAcikReferans(null); };
    document.addEventListener('keydown', kartKapat);
    return () => document.removeEventListener('keydown', kartKapat);
  }, []);

  const filtreSec = (slug) => {
    setEtkinSektor(slug);
    setGosterimSiniri(ILK_GOSTERIM_ADEDI);
    setAcikReferans(null);
  };

  const aramayiDegistir = (deger) => {
    setArama(deger);
    setGosterimSiniri(ILK_GOSTERIM_ADEDI);
    setAcikReferans(null);
  };

  const gorseliAc = (gorsel, dugme) => {
    oncekiOdak.current = dugme;
    setSeciliGorsel(gorsel);
  };

  return (
    <section className="referans-sayfasi">
      <header className="referans-hero">
        <img className="referans-hero__dunya-hologram" src="/assets/world.png" alt="" aria-hidden="true" />
        <div className="icerik-kapsayici referans-hero__icerik">
          <div className="referans-hero__metin">
            <p className="referans-hero__yol">{siteAyarlari.referans_hero_yol_metni ?? 'Anasayfa / Referanslar'}</p>
            <h1>{siteAyarlari.referans_hero_basligi ?? 'Güvenin Referansa Dönüştüğü Projeler'}</h1>
            <p>{siteAyarlari.referans_hero_aciklamasi ?? 'Türkiye’de ve dünyada tamamladığımız seçkin projeler.'}</p>
          </div>
          <div className="referans-istatistikleri" aria-label="Referans istatistikleri">
            {[[kayitlar.length, siteAyarlari.referans_istatistik_proje_etiketi ?? 'Proje'], [konumSayisi, siteAyarlari.referans_istatistik_konum_etiketi ?? 'Konum'], [sektorSayisi, siteAyarlari.referans_istatistik_sektor_etiketi ?? 'Sektör'], [yilAraligiOlustur(kayitlar), siteAyarlari.referans_istatistik_yil_etiketi ?? 'Yıl aralığı']].map(([deger, etiket]) => (
              <div className="referans-istatistik" key={etiket}><strong className="referans-istatistik__deger">{deger}</strong><span>{etiket}</span></div>
            ))}
          </div>
        </div>
      </header>

      <main className="referans-ana">
        <div className="icerik-kapsayici">
          <header className="referans-giris">
            <div className="referans-giris__metin"><span className="referans-giris__etiket">{siteAyarlari.referans_liste_etiketi ?? 'Projeler'}</span><h2>{siteAyarlari.referans_liste_basligi ?? 'Referanslarımız'}</h2><p>{siteAyarlari.referans_liste_aciklamasi ?? 'Sektörlere göre filtreleyerek projelerimizi inceleyebilirsiniz.'}</p></div>
            <p className="referans-sonuc" aria-live="polite">{sonucMetniOncesi}<strong className="referans-sonuc__sayi">{gorunenKayitSayisi}</strong>{sonucMetniSonrasi}</p>
          </header>

          <div className="referans-arac-cubugu">
            <div className="referans-filtre-kaydirma"><div className="referans-filtreleri" aria-label="Referans sektör filtresi">
              {[{ id: 0, ad: 'Tümü', slug: 'tumu' }, ...sektorler].map((sektor) => (
                <button key={sektor.slug} type="button" aria-pressed={etkinSektor === sektor.slug} onClick={() => filtreSec(sektor.slug)}>{sektor.ad}</button>
              ))}
            </div></div>
            <label className="referans-arama">
              <span className="ekran-okuyucu">Referanslarda ara</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              <input type="search" aria-label="Referanslarda ara" value={arama} onChange={(olay) => aramayiDegistir(olay.target.value)} placeholder={siteAyarlari.referans_arama_yertutucusu ?? 'Kurum, şehir veya proje ara'} />
              {arama && <button type="button" aria-label="Referans aramasını temizle" onClick={() => aramayiDegistir('')}>×</button>}
            </label>
          </div>

          {gorunenYurticiKayitlar.length > 0 ? (
            <ol className="referans-listesi">
              {gorunenYurticiKayitlar.map((kayit, sira) => (
                <ReferansKarti key={kayit.id} kayit={kayit} sira={sira} acik={acikReferans === kayit.id} onToggle={() => setAcikReferans((mevcut) => mevcut === kayit.id ? null : kayit.id)} detayEtiketi={siteAyarlari.referans_detay_etiketi ?? 'Proje bilgileri'} detaySablonu={siteAyarlari.referans_detay_sablonu ?? '{kurum} tarafından {konum} konumunda gerçekleştirilen {sektor} projesi{yil}'} />
              ))}
            </ol>
          ) : yurtdisiKayitlar.length === 0 ? (
            <p className="referans-bos"><strong>{siteAyarlari.referans_bos_basligi ?? 'Aramanızla eşleşen bir referans bulunamadı.'}</strong><br />{siteAyarlari.referans_bos_aciklamasi ?? 'Arama kelimesini veya seçili sektörü değiştirebilirsiniz.'}</p>
          ) : null}

          {yurticiKayitlar.length > gosterimSiniri && <div className="referans-daha-fazla"><button type="button" onClick={() => setGosterimSiniri((sinir) => sinir + EK_GOSTERIM_ADEDI)}>{siteAyarlari.referans_daha_fazla_metni ?? 'Daha Fazla Göster'}</button></div>}
        </div>
      </main>

      {yurtdisiKayitlar.length > 0 && (
        <section className="referans-yurtdisi" aria-labelledby="referans-yurtdisi-basligi">
          <img className="referans-yurtdisi__dunya-hologram" src="/assets/world.png" alt="" aria-hidden="true" />
          <div className="icerik-kapsayici referans-yurtdisi__icerik">
            <div className="referans-yurtdisi__baslik"><span>{siteAyarlari.referans_yurtdisi_etiketi ?? 'Global projeler'}</span><h2 id="referans-yurtdisi-basligi">{siteAyarlari.referans_yurtdisi_basligi ?? 'Yurtdışı Referanslarımız'}</h2><p>{siteAyarlari.referans_yurtdisi_aciklamasi ?? 'Sınırları aşan kalite, dünyada da tercih ediliyor.'}</p></div>
            <div className="referans-yurtdisi__liste">
              {yurtdisiKayitlar.map((kayit) => (
                <article className="referans-yurtdisi__kart" key={kayit.id} id={`referans-${kayit.id}`}><span className="referans-yurtdisi__dunya" aria-hidden="true">◎</span><div><h3>{kayit.baslik}</h3><p>{kayit.konum} • {kayit.kurum}</p></div>{kayit.yil && <span className="referans-yurtdisi__yil">{kayit.yil}</span>}</article>
              ))}
            </div>
          </div>
        </section>
      )}

      {gorseller.length > 0 && (
        <section className="referans-galeri" aria-labelledby="referans-galeri-basligi"><div className="icerik-kapsayici">
          <div className="referans-galeri__baslik"><div><h2 id="referans-galeri-basligi">{siteAyarlari.referans_galeri_basligi ?? 'Sahadan görüntüler'}</h2><p>{siteAyarlari.referans_galeri_aciklamasi ?? 'Ürünlerimizin tesis uygulamalarından seçilmiş kareler.'}</p></div><span>{metinSablonuUygula(siteAyarlari.referans_fotograf_sayisi_metni ?? '{sayi} fotoğraf', { sayi: String(gorseller.length) })}</span></div>
          <div className="referans-galeri__grid">{gorseller.map((gorsel) => (
            <button key={gorsel.id} className="referans-galeri__kart" type="button" aria-label={`${gorsel.alternatif_metin} görselini büyüt`} onClick={(olay) => gorseliAc(gorsel, olay.currentTarget)}><GaleriGorseli gorsel={gorsel} sinifAdi="referans-galeri__gorsel" /><span className="referans-galeri__buyut"><BuyutSimgesi /></span></button>
          ))}</div>
        </div></section>
      )}

      {seciliGorsel && (
        <div className="referans-modal" role="dialog" aria-modal="true" aria-label={seciliGorsel.alternatif_metin}>
          <button className="referans-modal__zemin" type="button" aria-label="Büyütülmüş görseli kapat" onClick={() => setSeciliGorsel(null)} />
          <div className="referans-modal__icerik"><GaleriGorseli gorsel={seciliGorsel} sinifAdi="referans-modal__gorsel" /><p>{seciliGorsel.alternatif_metin}</p><button ref={kapatmaDugmesi} className="referans-modal__kapat" type="button" onClick={() => setSeciliGorsel(null)} aria-label="Kapat"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button></div>
        </div>
      )}
    </section>
  );
}
