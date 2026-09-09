import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight, faBuilding, faCompress, faEnvelope, faExpand, faFax, faFileLines, faLandmark, faLocationDot,
  faMessage, faPaperPlane, faPhone, faUser, faUsers, faXmark
} from '@fortawesome/free-solid-svg-icons';
import { iletisimMesajiGonder } from '../servisler/api';
import EtkilesimliDunya from '../bilesenler/EtkilesimliDunya';
import '../stiller/iletisim.css';

function telefonBaglantisi(deger) {
  return `tel:${String(deger || '').replace(/[^+\d]/g, '')}`;
}

function Harita({ adres, haritaAdresi, baslik, aciklama }) {
  const sorgu = encodeURIComponent(adres);
  return (
    <section className="iletisim-harita" aria-label="Demirvana konumu">
      <iframe title="Demirvana konumu" src={haritaAdresi || `https://www.google.com/maps?q=${sorgu}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <a className="iletisim-harita__bilgi" href={`https://www.google.com/maps/search/?api=1&query=${sorgu}`} target="_blank" rel="noreferrer">
        <span><FontAwesomeIcon icon={faLocationDot} /></span>
        <strong>{baslik}</strong>
        <small>{aciklama}</small>
      </a>
    </section>
  );
}

function HesapNumaralariPenceresi({ acik, ayar, bankaHesaplari, kapat }) {
  const [genis, setGenis] = useState(false);
  const kapatDugmesi = useRef(null);

  useEffect(() => {
    if (!acik) return undefined;
    const oncekiTasma = document.body.style.overflow;
    const klavyeDinle = (olay) => olay.key === 'Escape' && kapat();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', klavyeDinle);
    kapatDugmesi.current?.focus();
    return () => {
      document.body.style.overflow = oncekiTasma;
      document.removeEventListener('keydown', klavyeDinle);
    };
  }, [acik, kapat]);

  if (!acik) return null;

  const baslik = ayar('iletisim_hesap_basligi', 'Hesap numaraları');
  return (
    <div className="hesap-penceresi" onMouseDown={(olay) => olay.target === olay.currentTarget && kapat()}>
      <section className={`hesap-penceresi__panel${genis ? ' hesap-penceresi__panel--genis' : ''}`} role="dialog" aria-modal="true" aria-labelledby="hesap-penceresi-basligi">
        <header className="hesap-penceresi__baslik">
          <div>
            <span>{ayar('iletisim_hesap_etiketi', 'Demirvana')}</span>
            <h2 id="hesap-penceresi-basligi">{baslik}</h2>
            <p>{ayar('iletisim_hesap_slogani', 'Güvenilir iş ortağınız')}</p>
          </div>
          <div className="hesap-penceresi__islemler">
            <button type="button" onClick={() => setGenis((deger) => !deger)} aria-label={genis ? 'Pencereyi küçült' : 'Pencereyi büyüt'} title={genis ? 'Küçült' : 'Büyüt'}>
              <FontAwesomeIcon icon={genis ? faCompress : faExpand} />
            </button>
            <button ref={kapatDugmesi} type="button" onClick={kapat} aria-label="Hesap numaralarını kapat" title="Kapat">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </header>
        <div className="hesap-penceresi__icerik">
          {bankaHesaplari.length ? (
            <div className="iletisim-hesaplar__grid">
              {bankaHesaplari.map((hesap) => (
                <article className="iletisim-hesap-karti" key={hesap.id}>
                  <span className="iletisim-hesap-karti__para">{hesap.para_birimi === 'USD' ? '$' : hesap.para_birimi === 'EUR' ? '€' : 'TL'}</span>
                  <div><h3>{hesap.hesap_basligi || `${hesap.banka_adi} ${hesap.para_birimi === 'TRY' ? 'TL' : hesap.para_birimi} hesabı`}</h3><img src={hesap.logo_yolu || '/assets/iletisim/qnb.png'} alt={`${hesap.banka_adi} logosu`} /></div>
                  <dl>
                    {hesap.swift_kodu ? <><dt>SWIFT kodu</dt><dd>{hesap.swift_kodu}</dd></> : null}
                    <dt>IBAN</dt><dd>{hesap.iban}</dd>
                    <dt>Şube</dt><dd>{hesap.sube}</dd>
                    <dt>Hesap no</dt><dd>{hesap.hesap_no}</dd>
                  </dl>
                </article>
              ))}
            </div>
          ) : <p className="hesap-penceresi__bos">Hesap bilgileri kısa süre içinde güncellenecektir.</p>}
          <p className="iletisim-hesaplar__uyari">{ayar('iletisim_hesap_guvenlik_notu', 'Ödeme öncesinde hesap bilgilerini mutlaka telefonla doğrulayın.')}</p>
        </div>
      </section>
    </div>
  );
}

export default function IcerikSayfasi({ tur, siteAyarlari = {}, bankaHesaplari = [], mesajGonder = iletisimMesajiGonder }) {
  const [durum, setDurum] = useState({ gonderiliyor: false, mesaj: '', hata: false });
  const [hesaplarAcik, setHesaplarAcik] = useState(false);
  const hesapDugmesi = useRef(null);
  if (tur !== 'iletisim') return null;

  const ayar = (anahtar, yedek) => siteAyarlari[anahtar] || yedek;
  const adres = ayar('iletisim_harita_adresi', siteAyarlari.firma_adresi || 'İkitelli OSB Pik Dökümcüler Sanayi Sitesi CA Blok No:3, 34490 İstanbul');
  const telefon = ayar('destek_telefonu', '+90 (212) 297 57 30');
  const whatsapp = ayar('iletisim_whatsapp', '+90 (555) 978 18 00');
  const faks = ayar('iletisim_faks', '+90 (212) 297 57 33');
  const eposta = ayar('destek_eposta', 'dv@demirvana.com');
  const hesaplariKapat = () => {
    setHesaplarAcik(false);
    requestAnimationFrame(() => hesapDugmesi.current?.focus());
  };

  const gonder = async (olay) => {
    olay.preventDefault();
    const form = olay.currentTarget;
    const veriler = Object.fromEntries(new FormData(form).entries());
    setDurum({ gonderiliyor: true, mesaj: '', hata: false });
    try {
      const yanit = await mesajGonder(veriler);
      form.reset();
      setDurum({ gonderiliyor: false, mesaj: yanit?.mesaj || 'Mesajınız başarıyla alındı.', hata: false });
    } catch (hata) {
      setDurum({ gonderiliyor: false, mesaj: hata.message || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.', hata: true });
    }
  };

  return (
    <article className="iletisim-sayfasi" style={{
      '--iletisim-arkaplan-ust-rengi': ayar('iletisim_arkaplan_ust_rengi', '#ffffff'),
      '--iletisim-arkaplan-rengi': ayar('iletisim_arkaplan_rengi', '#91aec4')
    }}>
      <Harita adres={adres} haritaAdresi={siteAyarlari.iletisim_harita_embed_adresi} baslik={ayar('iletisim_harita_kart_basligi', 'Bizi Ziyaret Edin')} aciklama={ayar('iletisim_harita_kart_aciklamasi', 'İkitelli OSB’deki merkezimizde sizleri ağırlamaktan memnuniyet duyarız.')} />
      <div className="iletisim-icerik icerik-kapsayici">
        <section className="iletisim-bilgileri" aria-labelledby="iletisim-basligi">
          <div className="iletisim-baslik">
            <span>{ayar('iletisim_etiketi', 'Demirvana')}</span>
            <h1 id="iletisim-basligi">{ayar('iletisim_basligi', 'İletişim')}</h1>
            <p>{ayar('iletisim_aciklamasi', 'Sorularınız, talepleriniz veya iş birliği fırsatları için bizimle iletişime geçebilirsiniz. Ekibimiz size en kısa sürede dönüş yapacaktır.')}</p>
          </div>
          <div className="iletisim-kanallari">
            <p><FontAwesomeIcon icon={faLocationDot} /><strong>Adres</strong><span>{siteAyarlari.firma_adresi || adres}</span></p>
            <p><FontAwesomeIcon icon={faPhone} /><strong>Telefon</strong><a href={telefonBaglantisi(telefon)}>{telefon}</a></p>
            <p className="iletisim-kanallari__whatsapp"><FontAwesomeIcon icon={faWhatsapp} /><strong>WhatsApp</strong><a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{whatsapp}</a></p>
            <p><FontAwesomeIcon icon={faFax} /><strong>Faks</strong><span>{faks}</span></p>
            <p><FontAwesomeIcon icon={faEnvelope} /><strong>E-posta</strong><a href={`mailto:${eposta}`}>{eposta}</a></p>
          </div>
          <div className="iletisim-kisayollar">
            <a href={`mailto:${eposta}?subject=İnsan kaynakları başvurusu`}><FontAwesomeIcon icon={faUsers} /><span><strong>{ayar('iletisim_insan_kaynaklari_basligi', 'İnsan kaynakları başvuru formu')}</strong><small>{ayar('iletisim_insan_kaynaklari_aciklamasi', 'Aramıza katılmak için başvurun.')}</small></span><FontAwesomeIcon icon={faArrowRight} /></a>
            <a href={`mailto:${eposta}?subject=Mail Order Formu`}><FontAwesomeIcon icon={faFileLines} /><span><strong>{ayar('iletisim_mail_order_basligi', 'Mail Order Formu')}</strong><small>{ayar('iletisim_mail_order_aciklamasi', 'Talep formu için iletişime geçin.')}</small></span><FontAwesomeIcon icon={faArrowRight} /></a>
            <button ref={hesapDugmesi} type="button" onClick={() => setHesaplarAcik(true)}><FontAwesomeIcon icon={faLandmark} /><span><strong>{ayar('iletisim_hesap_kisayol_basligi', 'Hesap Numaralarımız')}</strong><small>{ayar('iletisim_hesap_kisayol_aciklamasi', 'Banka hesap bilgilerimizi görüntüleyin.')}</small></span><FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        </section>
        <section className="iletisim-form-karti" aria-labelledby="mesaj-basligi">
          <header>
            <span><FontAwesomeIcon icon={faPaperPlane} /></span>
            <div><h2 id="mesaj-basligi">{ayar('iletisim_form_basligi', 'Bize Mesaj Gönderin')}</h2><p>{ayar('iletisim_form_aciklamasi', 'Taleplerinizi, sorularınızı veya iş birliği önerilerinizi form aracılığıyla bize iletebilirsiniz.')}</p></div>
            <strong className="iletisim-form-karti__slogan">{ayar('iletisim_form_slogani', 'Sanayide güvenilir çözüm ortağınız')}</strong>
          </header>
          <form onSubmit={gonder}>
            <label><span><FontAwesomeIcon icon={faUser} /> İsim Soyisim</span><input name="ad_soyad" aria-label="İsim Soyisim" autoComplete="name" maxLength="120" required /></label>
            <label><span><FontAwesomeIcon icon={faEnvelope} /> E-posta</span><input name="eposta" aria-label="E-posta" type="email" autoComplete="email" maxLength="180" required /></label>
            <label><span><FontAwesomeIcon icon={faPhone} /> Telefon</span><input name="telefon" aria-label="Telefon" type="tel" autoComplete="tel" maxLength="40" required /></label>
            <label><span><FontAwesomeIcon icon={faBuilding} /> Firma</span><input name="firma" aria-label="Firma" autoComplete="organization" maxLength="180" /></label>
            <label className="iletisim-form__mesaj"><span><FontAwesomeIcon icon={faMessage} /> Mesajınız</span><textarea name="mesaj" aria-label="Mesajınız" rows="6" maxLength="3000" required /></label>
            <input className="iletisim-form__tuzak" name="internet_sitesi" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <label className="iletisim-form__onay"><input name="veri_onayi" type="checkbox" value="1" required /><span>Kişisel verilerimin iletişim talebimin yanıtlanması amacıyla işlenmesini kabul ediyorum.</span></label>
            <button type="submit" disabled={durum.gonderiliyor}><span><FontAwesomeIcon icon={faPaperPlane} />{durum.gonderiliyor ? 'Gönderiliyor…' : 'Gönder'}</span><FontAwesomeIcon icon={faArrowRight} /></button>
            {durum.mesaj ? <p className={`iletisim-form__bildirim${durum.hata ? ' iletisim-form__bildirim--hata' : ''}`} role="status">{durum.mesaj}</p> : null}
          </form>
        </section>
      </div>
      <HesapNumaralariPenceresi acik={hesaplarAcik} ayar={ayar} bankaHesaplari={bankaHesaplari} kapat={hesaplariKapat} />
      {ayar('iletisim_dunya_aktif_mi', '1') !== '0' ? <EtkilesimliDunya ayarlar={siteAyarlari} /> : null}
    </article>
  );
}
