import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../stiller/bulunamadi.css';

export default function BulunamadiSayfasi() {
  return (
    <section className="bulunamadi icerik-kapsayici" aria-labelledby="bulunamadi-basligi">
      <p className="bulunamadi__kod" aria-hidden="true">404</p>
      <div className="bulunamadi__icerik">
        <span>Aradığınız adres mevcut değil</span>
        <h1 id="bulunamadi-basligi">Sayfa bulunamadı</h1>
        <p>Bağlantı değiştirilmiş veya kaldırılmış olabilir. Ana sayfadan ürün ve hizmetlerimize yeniden ulaşabilirsiniz.</p>
        <Link to="/"><ArrowLeft size={17} aria-hidden="true" />Ana sayfaya dön</Link>
      </div>
    </section>
  );
}
