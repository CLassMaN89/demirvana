import { useEffect, useRef } from 'react';

// Sabit kamera mesafeleri, tekerlek hareketinden etkilenmeden masaüstünde yakın; telefonda taşmasız bir kadraj sağlar.
export const dunyaKameraMesafesi = (enBoyOrani) => (enBoyOrani < .8 ? 3.08 : 1.95);
export const dunyaDikeyKonumu = -.26;

function EtkilesimliDunya({ ayarlar = {} }) {
  const alanRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const alan = alanRef.current;
    if (!canvas || !alan || typeof WebGLRenderingContext === 'undefined') return undefined;

    let iptalEdildi = false;
    let temizle = () => {};

    // Three.js yalnız dünya görünür olduğunda indirilir; ilk sayfa açılışını ağırlaştırmaz.
    import('three').then((THREE) => {
      if (iptalEdildi) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;

      const sahne = new THREE.Scene();
      const kamera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      kamera.position.set(0, 0.08, dunyaKameraMesafesi(1));
      const dunyaGrubu = new THREE.Group();
      // Avrupa ve Türkiye ilk açılışta görünür; kullanıcı sürükleyerek diğer bölgelere geçer.
      dunyaGrubu.rotation.set(0.08, -2.2, 0);
      // Yakın kadrajın genişliği korunurken merkez aşağı alınır; atmosfer yayı üst sınırda kesilmeden görünür.
      dunyaGrubu.position.y = dunyaDikeyKonumu;
      sahne.add(dunyaGrubu);

      const yukleyici = new THREE.TextureLoader();
      const renk = yukleyici.load('/assets/dunya/earth_blue_marble_4k.jpg');
      renk.colorSpace = THREE.SRGBColorSpace;
      const normal = yukleyici.load('/assets/dunya/earth_normal_2048.jpg');
      const parlaklik = yukleyici.load('/assets/dunya/earth_specular_2048.jpg');
      const bulut = yukleyici.load('/assets/dunya/earth_clouds_4k.png');
      bulut.colorSpace = THREE.SRGBColorSpace;
      [renk, normal, parlaklik, bulut].forEach((doku) => { doku.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); });

      const kure = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial({ map: renk, normalMap: normal, specularMap: parlaklik, specular: new THREE.Color('#b8d4e8'), shininess: 7, emissive: new THREE.Color('#273441'), emissiveIntensity: .16 })
      );
      dunyaGrubu.add(kure);

      // Bulutlar ayrı kürede daha hızlı dönerek yüzeyden bağımsız, canlı bir katman oluşturur.
      const bulutKuresi = new THREE.Mesh(
        new THREE.SphereGeometry(1.008, 64, 64),
        new THREE.MeshPhongMaterial({ map: bulut, transparent: true, opacity: .82, depthWrite: false, blending: THREE.NormalBlending })
      );
      dunyaGrubu.add(bulutKuresi);

      const atmosfer = new THREE.Mesh(
        new THREE.SphereGeometry(1.028, 64, 64),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.FrontSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexShader: 'varying vec3 vNormal; void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
          fragmentShader: 'varying vec3 vNormal; void main(){ float kenar=pow(1.0-max(0.0,dot(normalize(vNormal),vec3(0.0,0.0,1.0))),4.5); gl_FragColor=vec4(0.60,0.82,0.98,kenar*0.24); }'
        })
      );
      atmosfer.position.y = dunyaGrubu.position.y;
      sahne.add(atmosfer);

      // İkinci çok ince kabuk, referanstaki cam kubbe hissini koyu bir kontur oluşturmadan verir.
      const disAtmosfer = new THREE.Mesh(
        new THREE.SphereGeometry(1.047, 64, 64),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.FrontSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexShader: 'varying vec3 vNormal; void main(){ vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
          fragmentShader: 'varying vec3 vNormal; void main(){ float kenar=pow(1.0-max(0.0,dot(normalize(vNormal),vec3(0.0,0.0,1.0))),7.0); gl_FragColor=vec4(0.78,0.91,1.0,kenar*0.13); }'
        })
      );
      disAtmosfer.position.y = dunyaGrubu.position.y;
      sahne.add(disAtmosfer);

      sahne.add(new THREE.HemisphereLight('#ffffff', '#8cabc1', 3.1));
      const gunes = new THREE.DirectionalLight('#ffffff', 2.1);
      gunes.position.set(-3, 2.5, 4);
      sahne.add(gunes);

      let surukleniyor = false; let oncekiX = 0; let oncekiY = 0; let gorunur = true; let kare;
      const azaltildi = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const boyutlandir = () => {
        const { width, height } = alan.getBoundingClientRect();
        renderer.setSize(width, height, false);
        kamera.aspect = width / Math.max(height, 1);
        // Telefonda kürenin yanlardan taşmasını engeller, geniş ekranda yeşil referans alanına yaklaşan büyük kadrajı korur.
        kamera.position.z = dunyaKameraMesafesi(kamera.aspect);
        kamera.updateProjectionMatrix();
      };
      const baslat = (olay) => { surukleniyor = true; oncekiX = olay.clientX; oncekiY = olay.clientY; canvas.setPointerCapture?.(olay.pointerId); };
      const hareket = (olay) => { if (!surukleniyor) return; dunyaGrubu.rotation.y += (olay.clientX - oncekiX) * .006; dunyaGrubu.rotation.x = THREE.MathUtils.clamp(dunyaGrubu.rotation.x + (olay.clientY - oncekiY) * .004, -.8, .8); oncekiX = olay.clientX; oncekiY = olay.clientY; };
      const bitir = () => { surukleniyor = false; };
      const gozlemci = new IntersectionObserver(([girdi]) => { gorunur = girdi.isIntersecting; }, { threshold: .02 });
      gozlemci.observe(alan); boyutlandir();
      canvas.addEventListener('pointerdown', baslat); canvas.addEventListener('pointermove', hareket); canvas.addEventListener('pointerup', bitir); canvas.addEventListener('pointercancel', bitir);
      window.addEventListener('resize', boyutlandir);
      const canlandir = () => {
        kare = requestAnimationFrame(canlandir); if (!gorunur) return;
        if (!surukleniyor && !azaltildi) dunyaGrubu.rotation.y += .0007;
        bulutKuresi.rotation.y += azaltildi ? 0 : .00018;
        renderer.render(sahne, kamera);
      };
      canlandir();
      temizle = () => { cancelAnimationFrame(kare); gozlemci.disconnect(); window.removeEventListener('resize', boyutlandir); canvas.removeEventListener('pointerdown', baslat); canvas.removeEventListener('pointermove', hareket); canvas.removeEventListener('pointerup', bitir); canvas.removeEventListener('pointercancel', bitir); renderer.dispose(); [renk, normal, parlaklik, bulut].forEach((doku) => doku.dispose()); };
    });

    return () => { iptalEdildi = true; temizle(); };
  }, []);

  return (
    <section className="iletisim-dunya" aria-label="Demirvana küresel görünümü">
      <div className="iletisim-dunya__sahne" ref={alanRef}>
        <canvas ref={canvasRef} aria-label="Demirvana küresel çözüm ağı" />
      </div>
      <div className="iletisim-dunya__bulutlar" aria-hidden="true"><i /><i /><i /><i /></div>
    </section>
  );
}

export default EtkilesimliDunya;
