import '../stiller/yuzen-whatsapp.css';

// Numara site_ayarlari üzerinden yönetilebilir; sabit kodlanmış yalnızca geliştirme yedeğidir.
export default function YuzenWhatsapp({ siteAyarlari = {} }) {
  const numara = (siteAyarlari.iletisim_whatsapp ?? '+90 (555) 978 18 00').replace(/\D/g, '');

  return (
    <a
      className="yuzen-whatsapp"
      href={`https://wa.me/${numara}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp üzerinden bize ulaşın"
    >
      <img src="/assets/Whatsapp Transparent.svg" alt="" aria-hidden="true" />
    </a>
  );
}
