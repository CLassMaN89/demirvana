export default function DurumMesaji({ baslik, aciklama, eylem }) {
  return (
    <section className="durum-mesaji" role="status">
      <h1>{baslik}</h1>
      {aciklama && <p>{aciklama}</p>}
      {eylem}
    </section>
  );
}

