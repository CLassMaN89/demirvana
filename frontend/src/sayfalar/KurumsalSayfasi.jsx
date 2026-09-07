import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../stiller/kurumsal.css';

function urunleriSutunlaraAyir(urunGruplari) {
  return [1, 2, 3].map((sutunNo) =>
    urunGruplari.filter((urun) => Number(urun.sutun_no) === sutunNo)
  );
}

export default function KurumsalSayfasi({ kurumsal = {}, siteAyarlari = {} }) {
  const ayar = (anahtar, yedek) => siteAyarlari?.[anahtar] || yedek;
  const degerler = kurumsal?.degerler ?? [];
  const ekip = kurumsal?.ekip ?? [];
  const urunSutunlari = urunleriSutunlaraAyir(kurumsal?.urun_gruplari ?? []);

  return (
    <main className="kurumsal-sayfasi">
      <div className="icerik-kapsayici kurumsal-icerik">
        <header className="kurumsal-giris">
          <p className="kurumsal-etiket">
            {ayar('kurumsal_etiket', 'Kurumsal')}
            <span aria-hidden="true" />
          </p>
          <h1>
            <span>{ayar('kurumsal_baslik_satir_1', 'Güvenilir çözümler.')}</span>
            {' '}
            <strong>{ayar('kurumsal_baslik_satir_2', 'Sürdürülebilir iş ortaklıkları.')}</strong>
          </h1>
          <p className="kurumsal-giris__aciklama">
            {ayar('kurumsal_giris_metni', 'Endüstriyel vana ve akış kontrol çözümlerinde uzun vadeli iş ortaklıkları kuruyoruz.')}
          </p>
        </header>

        <section className="kurumsal-degerler" aria-label="Kurumsal değerler">
          {degerler.map((deger, indeks) => (
            <article
              className="kurumsal-deger"
              key={deger.id ?? deger.baslik}
              style={{ '--kurumsal-gecikme': `${indeks * 55}ms` }}
            >
              <h3>{deger.baslik}</h3>
              <p>{deger.aciklama}</p>
            </article>
          ))}
        </section>

        <section className="kurumsal-urunler" aria-labelledby="kurumsal-urunler-basligi">
          <h2 id="kurumsal-urunler-basligi">{ayar('kurumsal_urunler_basligi', 'Ana Ürün Gruplarımız')}</h2>
          <div className="kurumsal-urunler__sutunlar">
            {urunSutunlari.map((sutun, sutunIndeksi) => (
              <ul key={sutunIndeksi}>
                {sutun.map((urun) => (
                  <li key={urun.id ?? urun.ad}><span aria-hidden="true" />{urun.ad}</li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        <section className="kurumsal-cozum" aria-labelledby="kurumsal-cozum-basligi">
          <div>
            <h2 id="kurumsal-cozum-basligi">{ayar('kurumsal_cozum_basligi', 'Projeye Özel Çözümler')}</h2>
            <p>{ayar('kurumsal_cozum_aciklamasi', 'Teknik talepleriniz için ihtiyacınıza uygun çözüm alternatifleri geliştiriyoruz.')}</p>
          </div>
          <Link className="kurumsal-cozum__dugme" to={ayar('kurumsal_cozum_buton_baglantisi', '/iletisim')}>
            {ayar('kurumsal_cozum_buton_metni', 'Teknik ekibimizle iletişime geçin')}
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="kurumsal-ekip" aria-labelledby="kurumsal-ekip-basligi">
          <div className="kurumsal-ekip__giris">
            <h2 id="kurumsal-ekip-basligi">{ayar('kurumsal_ekip_basligi', 'Ekibimiz')}</h2>
            <p>{ayar('kurumsal_ekip_aciklamasi', 'Doğru insanlarla, daha güçlü çözümler.')}</p>
          </div>
          <div className="kurumsal-ekip__kisiler">
            {ekip.map((kisi) => (
              <address className="kurumsal-kisi" key={kisi.id ?? kisi.eposta}>
                <strong>{kisi.ad_soyad}</strong>
                <span>{kisi.gorev}</span>
                <a href={`mailto:${kisi.eposta}`}>{kisi.eposta}</a>
                {kisi.telefon && <a href={`tel:${kisi.telefon.replace(/[^+\d]/g, '')}`}>{kisi.telefon}</a>}
              </address>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
