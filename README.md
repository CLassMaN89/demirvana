# Demirvana Web Sitesi

Demirvana için React arayüzü, PHP REST API ve MySQL veri katmanından oluşan responsive site iskeletidir. İçerik ve tema yapısı, daha sonra eklenecek yönetim panelinden kod değiştirmeden yönetilebilecek biçimde ayrılmıştır.

## Klasörler

- `frontend/`: React bileşenleri, CSS stilleri, testler ve tarayıcı varlıkları.
- `backend/`: Salt okunur PHP JSON API, PDO bağlantısı ve veri depoları.
- `veritabani/`: phpMyAdmin ile içe aktarılabilir Türkçe MySQL şeması.
- `docs/`: Onaylanan tasarım ve uygulama planı.

## Frontend kurulumu

```powershell
Set-Location frontend
npm install
npm run dev
```

Geliştirme adresi varsayılan olarak `http://localhost:5173` olur. PHP API kapalıysa Vite geliştirme ortamında merkezi örnek veriler kullanılır.

Test ve üretim derlemesi:

```powershell
Set-Location frontend
npm test -- --run
npm run build
```

## Veritabanı kurulumu

1. phpMyAdmin içinde **İçe aktar** ekranını açın.
2. `veritabani/demirvana.sql` dosyasını seçin.
3. UTF-8/utf8mb4 karakter setiyle içe aktarmayı başlatın.

Şema; `site_ayarlari`, `tema_ayarlari`, `menu_ogeleri`, `sliderlar`, `kategoriler`, `urunler` ve `urun_gorselleri` tablolarını oluşturur. SQL dosyası başlangıç kayıtları çoğalmadan yeniden içe aktarılabilir.

Yapısal şema kontrolü:

```powershell
pwsh -NoProfile -File veritabani/sema_dogrulama.ps1
```

## PHP API kurulumu

`backend/.env.example` dosyasındaki adlarla sistem ortam değişkenlerini tanımlayın:

```text
DB_SUNUCU=127.0.0.1
DB_PORT=3306
DB_ADI=demirvana
DB_KULLANICI=root
DB_PAROLA=
```

API'yi proje kökünden başlatın:

```powershell
php -S 127.0.0.1:8080 backend/router.php
```

Kullanılabilir okuma uçları:

- `GET /api/tema`
- `GET /api/menu`
- `GET /api/sliderlar`
- `GET /api/kategoriler`
- `GET /api/kategoriler/{slug}`
- `GET /api/urunler?kategori={slug}&arama={metin}`
- `GET /api/urunler/{slug}`

PHP doğrulaması:

```powershell
php -d zend.assertions=1 -d assert.exception=1 backend/tests/api_dogrulama.php
Get-ChildItem backend -Recurse -Filter *.php | ForEach-Object { php -l $_.FullName }
```

## İçerik yönetimine hazırlık

- Ürün ve kategori görselleri `backend/uploads/` altında saklanacak; veritabanına yalnızca göreli yol yazılacaktır.
- Tema API'sinden gelen değerler izin verilen CSS değişkenlerine dönüştürülür.
- Carousel metni, butonu, görseli, animasyon türü ve görsel odak noktası ayrı veri alanlarıdır.
- İlk sürüm Türkçedir; frontend sabitleri `frontend/src/metinler/tr.js` içinde merkezidir.

Yönetim paneli, kimlik doğrulama ve dosya yükleme uçları bu ilk iskeletin kapsamı dışındadır.
