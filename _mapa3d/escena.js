// Mapa de reservas en 3D: la sala de NOOR con su forma real (plano de reforma del arquitecto),
// el mobiliario de las fotos y vídeos del local, luz, sombras y materiales realistas.
// Lo carga js/mapa.js solo si el navegador tiene WebGL2; si algo falla, se queda el mapa plano (SVG).
// Textos y datos de las mesas (id, zona, plazas) llegan en `api` (window.NOOR_MAPA); las posiciones, de plano.js.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as TX from './texturas.js';
import * as PL from './plano.js';

export function iniciar(api, contenedor) {
  const { MESAS, ZONAS, T } = api;
  const tactil = matchMedia('(pointer: coarse)').matches;
  const pocoMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alta = !tactil && (navigator.hardwareConcurrency || 4) >= 4;

  // ---------- Escala: píxeles del plano → metros (x hacia la derecha, z hacia abajo del plano) ----------
  const S = PL.S, ALTO = 2.9;
  const pt = (x, y) => [(x - PL.ORIGEN[0]) * S, (y - PL.ORIGEN[1]) * S];
  const xs = PL.CONTORNO.map((p) => pt(...p)[0]), zs = PL.CONTORNO.map((p) => pt(...p)[1]);
  const RW = Math.max(...xs), RD = Math.max(...zs), X_MIN = pt(PL.ACERA[0][0], 0)[0];
  const MIRA = { s: 0, n: Math.PI, e: Math.PI / 2, o: -Math.PI / 2 };
  const DIR = { s: [0, 1], n: [0, -1], e: [1, 0], o: [-1, 0] };

  // ---------- Renderizador ----------
  const lienzo = document.createElement('canvas');
  contenedor.prepend(lienzo);
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x120c09, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  let dpr = Math.min(devicePixelRatio || 1, alta ? 1.75 : 1.5);
  renderer.setPixelRatio(dpr);
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.18;

  const camara = new THREE.PerspectiveCamera(28, 1.6, 0.5, 120);

  // ---------- Materiales ----------
  const conRep = (t, rx, ry) => { const c = t.clone(); c.repeat.set(rx, ry); c.needsUpdate = true; return c; };
  const pack = (m, extra = {}) => {
    const col = TX.aTextura(m.col, { color: true, aniso }), rug = TX.aTextura(m.rug, { aniso }), nor = TX.aTextura(m.nor, { aniso });
    return (rx = 1, ry = 1) => new THREE.MeshStandardMaterial({
      map: conRep(col, rx, ry), roughnessMap: conRep(rug, rx, ry), normalMap: conRep(nor, rx, ry), ...extra,
    });
  };
  const tam = alta ? 1024 : 768;
  const azulejo = pack(TX.azulejo(tam), { metalness: 0.3, roughness: 1, color: 0xd07070, normalScale: new THREE.Vector2(0.9, 0.9) });
  const baldosa = pack(TX.baldosa(tam), { metalness: 0, roughness: 1, color: 0xd8d8d8, normalScale: new THREE.Vector2(0.6, 0.6) });
  // Paneles gris topo con ranuras diagonales (las paredes del local)
  const madera = pack(TX.madera(tam, [104, 96, 86]), { metalness: 0.05, roughness: 1, normalScale: new THREE.Vector2(1.3, 1.3) });
  const granito = pack(TX.marmol(512, [118, 58, 30], [120, 90, 60]), { metalness: 0.05, roughness: 1, envMapIntensity: 1.6 });
  const marmolVerde = pack(TX.marmol(512, [16, 44, 34], [120, 150, 130]), { metalness: 0.05, roughness: 1, envMapIntensity: 1.8 });
  const marmolNegro = pack(TX.marmol(512, [14, 15, 15], [90, 90, 88]), { metalness: 0.05, roughness: 1, envMapIntensity: 1.6 });

  const M = {
    terciopeloGris: new THREE.MeshPhysicalMaterial({ color: 0x6f6d6a, roughness: 0.88, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color(0x8e8c88) }),
    terciopeloRojo: new THREE.MeshPhysicalMaterial({ color: 0x8e2430, roughness: 0.8, sheen: 0.8, sheenRoughness: 0.45, sheenColor: new THREE.Color(0xc4505c) }),
    terciopeloNaranja: new THREE.MeshPhysicalMaterial({ color: 0x9a4a1e, roughness: 0.82, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xc0602a) }),
    terciopeloCamel: new THREE.MeshPhysicalMaterial({ color: 0x8a5e38, roughness: 0.85, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(0xb08050) }),
    cuero: new THREE.MeshPhysicalMaterial({ color: 0x2a1612, roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.3 }),
    lino: new THREE.MeshPhysicalMaterial({ color: 0x9e9787, roughness: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0xd8d0c0) }),
    negroMate: new THREE.MeshStandardMaterial({ color: 0x0d0b0a, roughness: 0.55, metalness: 0.6 }),
    mesaNegra: new THREE.MeshStandardMaterial({ color: 0x1a1715, roughness: 0.4, metalness: 0.1 }),
    rustica: new THREE.MeshStandardMaterial({ color: 0x5a3820, roughness: 0.7 }),
    oro: new THREE.MeshStandardMaterial({ color: 0xc9a44a, roughness: 0.28, metalness: 1 }),
    acero: new THREE.MeshStandardMaterial({ color: 0xc9c4bd, roughness: 0.22, metalness: 1 }),
    ceramica: new THREE.MeshStandardMaterial({ color: 0xe9e2d6, roughness: 0.45 }),
    manguera: new THREE.MeshStandardMaterial({ color: 0x151313, roughness: 0.6, metalness: 0.2 }),
    brasa: new THREE.MeshStandardMaterial({ color: 0x220a00, emissive: 0xff5a10, emissiveIntensity: 2.4 }),
    vidrio: alta
      ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, transmission: 1, thickness: 0.05, ior: 1.5, envMapIntensity: 1.4 })
      : new THREE.MeshPhysicalMaterial({ color: 0xbfd4d8, roughness: 0.05, transparent: true, opacity: 0.35, envMapIntensity: 1.6 }),
    mampara: new THREE.MeshPhysicalMaterial({ color: 0xcfe0e4, roughness: 0.05, transparent: true, opacity: 0.22, envMapIntensity: 2, depthWrite: false }),
    oscuro: new THREE.MeshStandardMaterial({ color: 0x15100d, roughness: 0.7 }),
    led: new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffa04a, emissiveIntensity: 4 }),
    espejo: new THREE.MeshStandardMaterial({ color: 0xc8c4be, roughness: 0.06, metalness: 1, envMapIntensity: 4.5 }),
    botella: new THREE.MeshPhysicalMaterial({ roughness: 0.08, transparent: true, opacity: 0.88, clearcoat: 1, envMapIntensity: 1.8 }),
    pantallaMesa: new THREE.MeshStandardMaterial({ color: 0x050608, emissive: 0x1d3a6a, emissiveIntensity: 0.3, roughness: 0.1 }),
  };

  const sombra = (o, cast = true, rec = true) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = rec; } }); return o; };
  const malla = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); return o; };
  // Une varias geometrías ya colocadas en una sola malla (menos llamadas de dibujo)
  const unir = (lista, m) => {
    const gs = lista.map(([g, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0]) => {
      const c = g.index ? g.toNonIndexed() : g.clone();
      if (c.attributes.uv1) c.deleteAttribute('uv1');
      c.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(1, 1, 1)));
      return c;
    });
    return new THREE.Mesh(mergeGeometries(gs), m);
  };
  const rbox = (w, h, d, r = 0.03, s = 3) => new RoundedBoxGeometry(w, h, d, s, Math.min(r, w / 2, h / 2, d / 2));
  // Coloca un objeto en un punto del plano mirando hacia n/s/e/o
  const poner = (o, x, y, mira = 's', alt = 0) => { const [X, Z] = pt(x, y); o.position.set(X, alt, Z); o.rotation.y = MIRA[mira]; return o; };

  // ---------- La sala ----------
  const sala = new THREE.Group();
  escena.add(sala);
  const forma = new THREE.Shape(PL.CONTORNO.map((p) => { const [X, Z] = pt(...p); return new THREE.Vector2(X, -Z); }));
  const suelo = malla(new THREE.ShapeGeometry(forma), baldosa(1 / 1.2, 1 / 1.2));
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  sala.add(suelo);
  // Zócalo bajo el suelo para que la sala "flote" como una maqueta
  const zocalo = malla(new THREE.ExtrudeGeometry(forma, { depth: 0.3, bevelEnabled: false }), M.oscuro, 0, -0.302, 0);
  zocalo.rotation.x = -Math.PI / 2;
  sala.add(zocalo);

  // Paredes altas (y lo colgado en ellas) que se bajan solas cuando quedan entre la cámara y la sala
  const cortables = [];
  // Pared recta entre dos puntos del plano. lado = +1 empuja el grosor hacia fuera del local.
  const tramo = (a, b, alto, mat, { grosor = 0.12, y0 = 0, lado = 1, remate = true } = {}) => {
    const [x1, z1] = pt(...a), [x2, z2] = pt(...b), dx = x2 - x1, dz = z2 - z1, L = Math.hypot(dx, dz);
    const nx = dz / L * lado, nz = -dx / L * lado;   // normal hacia fuera (el interior queda a la derecha)
    const g = new THREE.Group();
    const m = typeof mat === 'function' ? mat(L / 1.2, alto / 1.2) : mat;
    g.add(malla(new THREE.BoxGeometry(L + grosor, alto, grosor), m, 0, y0 + alto / 2, 0));
    if (remate && y0 + alto > 0.2) g.add(malla(new THREE.BoxGeometry(L + grosor, 0.02, grosor + 0.01), M.negroMate, 0, y0 + alto, 0));
    g.position.set((x1 + x2) / 2 + nx * grosor / 2, 0, (z1 + z2) / 2 + nz * grosor / 2);
    g.rotation.y = -Math.atan2(dz, dx);
    sala.add(sombra(g, false, true));
    if (lado && alto > 1.5) cortables.push({ o: g, n: [nx, nz] });
    return g;
  };
  const punto = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // Vidrio de suelo a techo con perfiles de acero
  const vidrio = (a, b, { y0 = 0, alto = 2.4, mat = M.mampara, n = null } = {}) => {
    const [x1, z1] = pt(...a), [x2, z2] = pt(...b), dx = x2 - x1, dz = z2 - z1, L = Math.hypot(dx, dz);
    const g = new THREE.Group();
    g.add(malla(new THREE.BoxGeometry(L, alto, 0.02), mat, 0, y0 + alto / 2, 0));
    for (const t of [-0.5, 0, 0.5]) g.add(malla(new THREE.BoxGeometry(0.04, alto, 0.05), M.acero, t * L, y0 + alto / 2, 0));
    g.add(malla(new THREE.BoxGeometry(L, 0.04, 0.05), M.acero, 0, y0 + alto, 0));
    g.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
    g.rotation.y = -Math.atan2(dz, dx);
    sala.add(g);
    if (n) cortables.push({ o: g, n });
  };
  PL.CONTORNO.forEach((a, i) => {
    const b = PL.CONTORNO[(i + 1) % PL.CONTORNO.length];
    const bajo = PL.BAJOS.includes(i), mat = PL.ALICATADOS.includes(i) ? azulejo : madera;
    const vid = PL.VIDRIOS.find((v) => v[0] === i);
    if (!vid) { tramo(a, b, bajo ? 0.32 : ALTO, mat); return; }
    const [, t0, t1] = vid, p0 = punto(a, b, t0), p1 = punto(a, b, t1);
    if (t0 > 0) tramo(a, p0, ALTO, mat);
    if (t1 < 1) tramo(p1, b, ALTO, mat);
    const ventana = t0 > 0 || t1 < 1;
    // Ventana: antepecho y dintel de pared con el vidrio en medio; fachada del cortavientos: vidrio entero
    const n = (() => { const [x1, z1] = pt(...a), [x2, z2] = pt(...b), L = Math.hypot(x2 - x1, z2 - z1); return [(z2 - z1) / L, -(x2 - x1) / L]; })();
    if (ventana) { tramo(p0, p1, 0.75, mat, { remate: false }); cortables.push({ o: tramo(p0, p1, ALTO - 2.3, mat, { y0: 2.3 }), n, ocultar: true }); }
    vidrio(p0, p1, { y0: ventana ? 0.75 : 0, alto: ventana ? 1.55 : 2.4, n });
  });
  // Acera (con la terraza) y franja de calzada delante de la fachada
  {
    const fa = new THREE.Shape(PL.ACERA.map((p) => { const [X, Z] = pt(...p); return new THREE.Vector2(X, -Z); }));
    const acera = malla(new THREE.ExtrudeGeometry(fa, { depth: 0.12, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0x8a8782, roughness: 0.92 }), 0, -0.13, 0);
    acera.rotation.x = -Math.PI / 2;
    acera.receiveShadow = true;
    sala.add(acera);
    const losas = malla(new THREE.ShapeGeometry(fa), baldosa(1 / 0.8, 1 / 0.8), 0, -0.008, 0);
    losas.rotation.x = -Math.PI / 2;
    losas.receiveShadow = true;
    sala.add(losas);
    const [cx, cy, cw, ch] = PL.CALZADA, [X0, Z0] = pt(cx, cy);
    const asfalto = malla(new THREE.BoxGeometry(cw * S, 0.1, ch * S), new THREE.MeshStandardMaterial({ color: 0x26282b, roughness: 0.95 }), X0 + cw * S / 2, -0.2, Z0 + ch * S / 2);
    asfalto.receiveShadow = true;
    sala.add(asfalto);
  }
  for (const [a, b] of PL.TABIQUES) tramo(a, b, 1.1, madera, { grosor: 0.1, lado: 0 });
  for (const [a, b] of PL.MAMPARAS) vidrio(a, b);
  // Felpudo de entrada (junto a la puerta de la calle) con el texto traducido
  {
    const t = TX.cartel(T.entrada, { ancho: 512, alto: 256, fondo: '#20160f', tam: 64 });
    const f = poner(malla(new THREE.PlaneGeometry(0.9, 0.55), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 })), PL.FELPUDO.x + 22, PL.FELPUDO.y, 's', 0.004);
    f.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    f.receiveShadow = true;
    sala.add(f);
  }

  // ---------- Elementos fijos ----------
  // Pilares: mármol verde, espejo y el alicatado junto a la puerta acristalada
  const caja = (x, y, w, h, alto, mat, y0 = 0) => {
    const [X, Z] = pt(x, y);
    return sombra(malla(new THREE.BoxGeometry(w * S, alto, h * S), mat, X + w * S / 2, y0 + alto / 2, Z + h * S / 2));
  };
  for (const [x, y, w, h, tipo] of PL.PILARES) sala.add(caja(x, y, w, h, ALTO, tipo === 'verde' ? marmolVerde(0.5, 2.4) : M.espejo));
  sala.add(caja(...PL.PILAR_AZULEJO, ALTO, azulejo(0.4, 2.4)));
  // Mesa de la consola con los juegos encima
  {
    const [x, y, w, h] = PL.CONSOLA;
    sala.add(caja(x, y, w, h, 0.03, M.mesaNegra, 0.78));
    for (const [cx, cy] of [[x + 3, y + 3], [x + w - 3, y + 3], [x + 3, y + h - 3], [x + w - 3, y + h - 3]]) sala.add(caja(cx - 1, cy - 1, 2, 2, 0.78, M.negroMate));
    sala.add(caja(x + 6, y + 4, 14, 14, 0.09, new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.3 }), 0.81));
    sala.add(caja(x + 30, y + 5, 10, 12, 0.12, new THREE.MeshStandardMaterial({ color: 0x1f4fb0, roughness: 0.4 }), 0.81));
  }
  // Columnas de luz de acero perforado
  const perf = TX.perforado();
  const matColumna = new THREE.MeshStandardMaterial({ color: 0x8a8580, metalness: 0.7, roughness: 0.35, emissive: 0xffffff, emissiveMap: perf, emissiveIntensity: 1.3 });
  PL.COLUMNAS_LUZ.forEach(([x, y], i) => {
    const [X, Z] = pt(x, y), g = new THREE.Group(), alto = 2.3;
    g.add(malla(new THREE.CylinderGeometry(0.11, 0.11, alto, 40, 1, true), matColumna, 0, alto / 2, 0));
    g.add(malla(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 40), M.acero, 0, 0.025, 0));
    if (alta || i % 2 === 0) { const l = new THREE.PointLight(0xffa050, 1.6, 3, 2); l.position.y = 1.2; g.add(l); }
    g.position.set(X, 0, Z);
    sala.add(g);
  });

  // ---------- Barra en U, barra alta y botellero ----------
  for (const [x, y, w, h, k] of PL.BARRAS) {
    const alto = k === 'trasera' ? 0.95 : 1.08, [X, Z] = pt(x, y), W = w * S, D = h * S;
    const g = new THREE.Group();
    g.add(malla(new THREE.BoxGeometry(W - 0.03, alto - 0.05, D - 0.03), marmolNegro(W / 1.2, 1), 0, (alto - 0.05) / 2, 0));
    g.add(malla(rbox(W + 0.05, 0.05, D + 0.05, 0.012), granito(W / 1.4, D / 1.4), 0, alto - 0.025, 0));
    if (y < 470 && k !== 'trasera') g.add(malla(new THREE.BoxGeometry(W - 0.06, 0.012, 0.012), M.led, 0, 0.05, -D / 2 - 0.004));
    g.position.set(X + W / 2, 0, Z + D / 2);
    sala.add(sombra(g));
  }
  // Botellas sobre la contrabarra (instanciadas: una sola malla)
  {
    const [x, y, w, h] = PL.BARRAS.find((b) => b[4] === 'trasera'), [X0, Z0] = pt(x + 40, y), largo = (w - 80) * S, zB = Z0 + h * S * 0.55;
    const perfil = [[0, 0], [0.036, 0], [0.038, 0.01], [0.038, 0.2], [0.032, 0.24], [0.012, 0.27], [0.012, 0.33], [0.014, 0.335], [0, 0.335]].map(([a, b]) => new THREE.Vector2(a, b));
    const n = Math.floor(largo / 0.09);
    const botellas = new THREE.InstancedMesh(new THREE.LatheGeometry(perfil, 18), M.botella, n);
    const tonos = [0x7a3c0f, 0xa65c12, 0x2f4a1f, 0xd9d2c0, 0x4a1b12, 0x8f6a1a, 0x1d2a26, 0xb88a3a];
    const azar = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(9);
    const m4 = new THREE.Matrix4(), c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      m4.compose(new THREE.Vector3(X0 + 0.05 + i * 0.09, 0.95, zB + (azar() - 0.5) * 0.08), new THREE.Quaternion(), new THREE.Vector3(1, 0.8 + azar() * 0.45, 1));
      botellas.setMatrixAt(i, m4);
      botellas.setColorAt(i, c.setHex(tonos[Math.floor(azar() * tonos.length)]));
    }
    botellas.castShadow = true;
    sala.add(botellas);
    sala.add(malla(new THREE.BoxGeometry(largo, 0.01, 0.01), M.led, X0 + largo / 2, 0.952, zB - 0.12));
    for (const t of [0.25, 0.75]) { const l = new THREE.PointLight(0xffa860, 1.4, 2.6, 2); l.position.set(X0 + largo * t, 1.5, zB); sala.add(l); }
  }
  // Barra alta de granito pegada a la pared (mesa 12)
  {
    const [x, y, w, h] = PL.BARRA_ALTA;
    sala.add(caja(x, y, w, h, 0.05, granito((w * S) / 1.4, 0.3), 1.03));
    sala.add(caja(x + 4, y, w - 8, 6, 1.03, M.oscuro));
  }

  // ---------- Pantallas, espejos y cuadro ----------
  const fotos = ['cachimba-1-800.webp', 'ritual-800.webp', 'coctel-1-800.webp'];
  const cargador = new THREE.TextureLoader();
  const enPared = (o, x, y, mira, alt, sep = 0.03) => {
    const [dx, dz] = DIR[mira]; poner(o, x, y, mira, alt); o.position.x += dx * sep; o.position.z += dz * sep; sala.add(o);
    cortables.push({ o, n: [-dx, -dz], ocultar: true });
    return o;
  };
  PL.PANTALLAS.forEach((p, i) => {
    const g = new THREE.Group(), ancho = p.ancho, altoP = ancho * 0.5625;
    g.add(malla(rbox(ancho + 0.04, altoP + 0.04, 0.05, 0.01), M.negroMate));
    const tex = cargador.load(new URL(`../img/${fotos[i % fotos.length]}`, import.meta.url).href, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; });
    tex.colorSpace = THREE.SRGBColorSpace;
    g.add(malla(new THREE.PlaneGeometry(ancho, altoP), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.5, roughness: 0.15 }), 0, 0, 0.027));
    enPared(g, p.x, p.y, p.mira, p.alto, 0.06);
  });
  for (const e of PL.ESPEJOS) {
    const g = new THREE.Group();
    g.add(malla(new THREE.CircleGeometry(e.r, 64), M.espejo, 0, 0, 0.012));
    g.add(malla(new THREE.TorusGeometry(e.r, 0.012, 12, 96), M.acero, 0, 0, 0.012));
    enPared(g, e.x, e.y, e.mira, 1.75);
  }
  {
    const t = cargador.load(new URL('../img/cuadro-sala.webp', import.meta.url).href);
    t.colorSpace = THREE.SRGBColorSpace;
    const g = new THREE.Group();
    g.add(malla(new THREE.BoxGeometry(0.66, 0.96, 0.03), M.negroMate));
    g.add(malla(new THREE.PlaneGeometry(0.6, 0.9), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }), 0, 0, 0.017));
    enPared(g, PL.CUADRO.x, PL.CUADRO.y, PL.CUADRO.mira, 1.55, 0.02);
  }

  // ---------- Mobiliario (todo mira hacia +z en local; el respaldo queda en -z) ----------
  // Sofá capitoné en canales verticales (rojo en la entrada, gris en el fondo)
  function sofa(largo, mat = M.terciopeloGris) {
    const fondo = 0.62, n = Math.max(2, Math.round(largo / 0.2)), cw = largo / n;
    const piezas = [[rbox(largo, 0.24, fondo, 0.03), 0, 0.16, 0], [rbox(largo - 0.03, 0.12, fondo - 0.2, 0.05), 0, 0.33, 0.08]];
    for (let i = 0; i < n; i++) piezas.push([rbox(cw - 0.01, 0.48, 0.17, 0.06, 4), -largo / 2 + cw * (i + 0.5), 0.52, -fondo / 2 + 0.09, 0, -0.08]);
    const g = new THREE.Group();
    g.add(unir(piezas, mat));
    g.add(malla(new THREE.BoxGeometry(largo - 0.06, 0.04, fondo - 0.06), M.negroMate, 0, 0.02, 0));
    return sombra(g);
  }
  // Sofá gris de una pieza con respaldo y brazos curvos (el de la pared de los espejos)
  function sofaCurvo(largo) {
    const g = new THREE.Group();
    g.add(unir([
      [rbox(largo - 0.1, 0.36, 0.64, 0.14, 4), 0, 0.2, 0],
      [rbox(largo, 0.4, 0.16, 0.08, 4), 0, 0.56, -0.26],
      [rbox(0.14, 0.26, 0.66, 0.07, 4), -largo / 2 + 0.07, 0.5, 0],
      [rbox(0.14, 0.26, 0.66, 0.07, 4), largo / 2 - 0.07, 0.5, 0],
      [rbox(largo - 0.32, 0.08, 0.5, 0.04, 3), 0, 0.41, 0.04],
    ], M.terciopeloGris));
    return sombra(g);
  }
  // Taburete alto: asiento naranja acolchado, respaldo camel, patas negras finas y aro reposapiés
  const camelDoble = M.terciopeloCamel.clone(); camelDoble.side = THREE.DoubleSide;
  const geoTaburete = (() => {
    const patas = [];
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) patas.push([new THREE.CylinderGeometry(0.011, 0.011, 0.74, 8), sx * 0.16, 0.37, sz * 0.16, 0, sz * 0.08, -sx * 0.08]);
    patas.push([new THREE.TorusGeometry(0.18, 0.009, 8, 40), 0, 0.27, 0, 0, Math.PI / 2]);
    return { asiento: rbox(0.44, 0.09, 0.42, 0.04), respaldo: new THREE.CylinderGeometry(0.22, 0.2, 0.32, 32, 1, true, Math.PI - 1.2, 2.4), patas };
  })();
  function taburete() {
    const g = new THREE.Group();
    g.add(malla(geoTaburete.asiento, M.terciopeloNaranja, 0, 0.77, 0));
    g.add(malla(geoTaburete.respaldo, camelDoble, 0, 0.98, 0.02));
    g.add(unir(geoTaburete.patas, M.negroMate));
    return sombra(g);
  }
  // Silla tapizada con respaldo envolvente
  const geoSilla = { asiento: rbox(0.46, 0.08, 0.44, 0.04), respaldo: new THREE.CylinderGeometry(0.24, 0.22, 0.34, 32, 1, true, Math.PI - 1.25, 2.5) };
  const negroDoble = M.negroMate.clone(); negroDoble.side = THREE.DoubleSide;
  function silla(negra = false) {
    const g = new THREE.Group();
    g.add(malla(geoSilla.asiento, negra ? M.negroMate : M.terciopeloCamel, 0, 0.47, 0));
    g.add(malla(geoSilla.respaldo, negra ? negroDoble : camelDoble, 0, 0.66, 0.02));
    const patas = [];
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) patas.push([new THREE.CylinderGeometry(0.012, 0.009, 0.46, 8), sx * 0.17, 0.23, sz * 0.16, 0, sz * 0.12, -sx * 0.12]);
    g.add(unir(patas, M.negroMate));
    return sombra(g);
  }
  // Sillón de cuero marrón tipo bañera
  const cueroDoble = M.cuero.clone(); cueroDoble.side = THREE.DoubleSide;
  const geoSillon = { base: rbox(0.66, 0.36, 0.64, 0.08, 4), cojin: rbox(0.48, 0.1, 0.48, 0.05, 3), aro: new THREE.CylinderGeometry(0.33, 0.32, 0.36, 40, 1, true, Math.PI - 2.1, 4.2) };
  function sillon() {
    const g = new THREE.Group();
    g.add(malla(geoSillon.base, M.cuero, 0, 0.22, 0));
    g.add(malla(geoSillon.cojin, M.cuero, 0, 0.44, 0.04));
    g.add(malla(geoSillon.aro, cueroDoble, 0, 0.58, 0));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(malla(new THREE.CylinderGeometry(0.025, 0.02, 0.05, 10), M.negroMate, sx * 0.26, 0.025, sz * 0.25));
    return sombra(g);
  }
  function mesaRect(w, d, tapa) {
    const g = new THREE.Group(), alto = tapa === 'pantalla' ? 0.74 : 0.46;
    const mat = { rustica: M.rustica, pantalla: M.pantallaMesa }[tapa] || M.mesaNegra;
    g.add(malla(rbox(w, 0.035, d, 0.01), mat, 0, alto - 0.0175, 0));
    const patas = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) patas.push([new THREE.BoxGeometry(0.03, alto - 0.035, 0.03), sx * (w / 2 - 0.04), (alto - 0.035) / 2, sz * (d / 2 - 0.04)]);
    // Bastidor metálico a ras de suelo, como las mesas de madera del local
    if (tapa === 'rustica') for (const sz of [-1, 1]) patas.push([new THREE.BoxGeometry(w - 0.08, 0.025, 0.025), 0, 0.06, sz * (d / 2 - 0.04)]);
    g.add(unir(patas, M.negroMate));
    return { g: sombra(g), alto };
  }
  function mesaRed(r, tapa) {
    const g = new THREE.Group();
    if (tapa === 'puf') {
      // Mesa-puf de lino con aros apilados y tapa de madera oscura
      g.add(unir([0.07, 0.18, 0.29].map((y) => [new THREE.TorusGeometry(r - 0.06, 0.065, 14, 48), 0, y, 0, 0, Math.PI / 2]).concat([[new THREE.CylinderGeometry(r - 0.06, r - 0.06, 0.36, 40), 0, 0.18, 0]]), M.lino));
      g.add(malla(new THREE.CylinderGeometry(r, r, 0.03, 48), M.mesaNegra, 0, 0.38, 0));
      return { g: sombra(g), alto: 0.4 };
    }
    if (tapa === 'verde') {
      // Mesita de mármol verde con aro y patas doradas
      const alto = 0.52;
      g.add(malla(new THREE.CylinderGeometry(r, r, 0.025, 48), marmolVerde(0.4, 0.4), 0, alto - 0.0125, 0));
      g.add(unir([[new THREE.TorusGeometry(r * 0.95, 0.006, 8, 48), 0, 0.03, 0, 0, Math.PI / 2], [new THREE.TorusGeometry(r * 0.95, 0.006, 8, 48), 0, alto - 0.03, 0, 0, Math.PI / 2],
        ...[0, 1, 2, 3].map((k) => [new THREE.CylinderGeometry(0.006, 0.006, alto - 0.02, 8), Math.cos(k * 1.571) * r * 0.95, (alto - 0.02) / 2, Math.sin(k * 1.571) * r * 0.95])], M.oro));
      return { g: sombra(g), alto };
    }
    const alto = 0.62;
    g.add(malla(new THREE.CylinderGeometry(r, r, 0.03, 56), M.mesaNegra, 0, alto - 0.015, 0));
    const pz = [];
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4, l = Math.hypot(r * 0.6, alto);
      pz.push([new THREE.CylinderGeometry(0.012, 0.012, l, 8), Math.cos(a) * r * 0.3, alto / 2 - 0.015, Math.sin(a) * r * 0.3, -a, 0, Math.atan2(r * 0.6, alto)]);
    }
    g.add(unir(pz, M.negroMate));
    return { g: sombra(g), alto };
  }
  const tapiz = (t) => (t === 'rojo' ? M.terciopeloRojo : M.terciopeloGris);
  const asiento = (a) => {
    const o = a.t === 'sofa' ? sofa(a.largo * S, tapiz(a.tapiz)) : a.t === 'sofaCurvo' ? sofaCurvo(a.largo * S)
      : a.t === 'sillon' ? sillon() : a.t === 'sillaNegra' ? silla(true) : silla();
    sala.add(poner(o, a.x, a.y, a.mira));
    // Huella aproximada en el plano (px) para el halo de selección
    const lx = (a.largo || 50) / 2, ly = 24, girado = a.mira === 'e' || a.mira === 'o';
    return [a.x - (girado ? ly : lx), a.y - (girado ? lx : ly), a.x + (girado ? ly : lx), a.y + (girado ? lx : ly)];
  };

  // Cachimbas: cinco mallas instanciadas (vidrio, acero, cazoleta, manguera, brasas)
  const cachimbas = [];
  const geoCachimba = (() => {
    const base = new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.085, 0.03], [0.09, 0.08], [0.07, 0.15], [0.035, 0.2], [0.02, 0.23], [0.02, 0.245], [0, 0.245]].map(([a, b]) => new THREE.Vector2(a, b)), 40);
    const acero = mergeGeometries([
      new THREE.CylinderGeometry(0.014, 0.016, 0.42, 16).translate(0, 0.45, 0),
      new THREE.CylinderGeometry(0.1, 0.1, 0.006, 40).translate(0, 0.6, 0),
      ...[0.3, 0.38, 0.5].map((y) => new THREE.TorusGeometry(0.022, 0.006, 8, 24).rotateX(Math.PI / 2).translate(0, y, 0)),
      new THREE.CylinderGeometry(0.03, 0.022, 0.03, 20).translate(0, 0.255, 0),
    ].map((g) => g.toNonIndexed()));
    const cazoleta = new THREE.LatheGeometry([[0, 0], [0.02, 0], [0.035, 0.05], [0.04, 0.06], [0, 0.06]].map(([a, b]) => new THREE.Vector2(a, b)), 28).translate(0, 0.605, 0);
    const pts = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40, a = t * Math.PI * 6; pts.push(new THREE.Vector3(Math.cos(a) * 0.05, 0.5 - t * 0.18, Math.sin(a) * 0.05)); }
    pts.push(new THREE.Vector3(0.12, 0.25, 0.04), new THREE.Vector3(0.22, 0.08, 0.06), new THREE.Vector3(0.3, 0.012, 0.1), new THREE.Vector3(0.42, 0.012, 0.1));
    const manguera = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.007, 8);
    const brasa = mergeGeometries([0, 1, 2].map((k) => new THREE.BoxGeometry(0.022, 0.012, 0.022).rotateY(k).translate(Math.cos(k * 2.1) * 0.016, 0.668, Math.sin(k * 2.1) * 0.016).toNonIndexed()));
    return { base, acero, cazoleta, manguera, brasa };
  })();
  const ponerCachimba = (X, y, Z, ry = 0) => cachimbas.push(new THREE.Matrix4().compose(new THREE.Vector3(X, y, Z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1)));

  // Muebles compartidos o sin número: sofá rojo en L, sofás corridos del fondo y decorado
  [...PL.SOFA_ROJO, ...PL.BANCOS].forEach(asiento);
  const azarA = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(3);

  // Construye una mesa del plano y devuelve su huella (px) y la altura del tablero
  function construir(def) {
    const h = [Infinity, Infinity, -Infinity, -Infinity];
    const amplia = (q) => { h[0] = Math.min(h[0], q[0]); h[1] = Math.min(h[1], q[1]); h[2] = Math.max(h[2], q[2]); h[3] = Math.max(h[3], q[3]); };
    let alto = 0, tipo = 'rect';
    if (def.taburete || def.taburetes) {
      tipo = 'red';
      for (const [x, y] of def.taburetes || [def.taburete]) { sala.add(poner(taburete(), x, y, def.mira)); amplia([x - 16, y - 16, x + 16, y + 16]); }
      alto = 1.1;
    } else if (def.rect) {
      const [x, y, w, d] = def.rect, mt = mesaRect(w * S, d * S, def.tapa);
      sala.add(poner(mt.g, x + w / 2, y + d / 2, 's'));
      amplia([x, y, x + w, y + d]); alto = mt.alto;
      const [X, Z] = pt(x + w / 2, y + d / 2);
      ponerCachimba(X + (azarA() - 0.5) * w * S * 0.3, alto, Z + (azarA() - 0.5) * d * S * 0.3, azarA() * 6.28);
    } else if (def.red) {
      tipo = 'red';
      const [x, y, r] = def.red, mt = mesaRed(r, def.tapa), rp = r / S;
      sala.add(poner(mt.g, x, y, 's'));
      amplia([x - rp, y - rp, x + rp, y + rp]); alto = mt.alto;
      const [X, Z] = pt(x, y);
      ponerCachimba(X, alto, Z, azarA() * 6.28);
    }
    for (const a of def.asientos || []) amplia(asiento(a));
    if (def.huella) { h[0] = Math.min(h[0], def.huella[0]); h[1] = Math.min(h[1], def.huella[1]); h[2] = Math.max(h[2], def.huella[2]); h[3] = Math.max(h[3], def.huella[3]); }
    return { h, alto, tipo };
  }
  PL.DECORADO.forEach(construir);
  // Barra alta de la mesa 12: el mueble ya está; aquí solo sus taburetes (vía construir)

  // ---------- Mesas reservables, brillos de selección y zonas de clic ----------
  const texBrilloR = TX.brillo('redondo'), texBrilloC = TX.brillo('cuadrado');
  const mesas3d = new Map();
  const clicables = [];
  const reservables = MESAS.filter((m) => PL.MESAS[m.id]);
  for (const m of reservables) {
    const { h, alto, tipo } = construir(PL.MESAS[m.id]);
    const [x0, z0] = pt(h[0], h[1]), [x1, z1] = pt(h[2], h[3]);
    const hx = x1 - x0, hz = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    // El borde luminoso de la textura queda un poco por fuera de la mesa y sus asientos
    const [hw, hd] = tipo === 'red' ? [(hx / 2 + 0.08) / 0.39, (hz / 2 + 0.08) / 0.39] : [(hx / 2 + 0.1) / 0.344, (hz / 2 + 0.1) / 0.344];
    const halo = malla(new THREE.PlaneGeometry(hw, hd), new THREE.MeshBasicMaterial({
      map: tipo === 'red' ? texBrilloR : texBrilloC, color: 0xffb35c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
      depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    }), cx, 0.015, cz);
    halo.rotation.x = -Math.PI / 2;
    halo.renderOrder = 2;
    halo.visible = false;
    sala.add(halo);
    // Volumen invisible para hacer clic en toda la mesa con sus asientos
    const vol = malla(new THREE.BoxGeometry(hx + 0.1, 1.1, hz + 0.1), new THREE.MeshBasicMaterial({ visible: false }), cx, 0.55, cz);
    vol.userData = { mesa: m.id, zona: m.z };
    sala.add(vol);
    clicables.push(vol);
    mesas3d.set(m.id, { m, halo, centro: new THREE.Vector3(cx, alto, cz), caja: [x0, z0, x1, z1], brillo: 0, objetivo: 0 });
  }
  // Cachimbas expuestas en la barra de shishas
  {
    const [x, y, w, h] = PL.BARRAS.find((b) => b[4] === 'shishas'), [X, Z] = pt(x, y);
    for (let k = 0; k < 3; k++) ponerCachimba(X + 0.2 + k * ((w * S - 0.4) / 2), 1.08, Z + h * S / 2, k);
  }
  const instancias = [];
  for (const [geo, mat] of [[geoCachimba.base, M.vidrio], [geoCachimba.acero, M.acero], [geoCachimba.cazoleta, M.ceramica], [geoCachimba.manguera, M.manguera], [geoCachimba.brasa, M.brasa]]) {
    const im = new THREE.InstancedMesh(geo, mat, cachimbas.length);
    cachimbas.forEach((m4, i) => im.setMatrixAt(i, m4));
    im.castShadow = mat !== M.brasa;
    sala.add(im);
    instancias.push(im);
  }

  // ---------- Humo de cachimba ----------
  const texHumo = TX.humo();
  const humos = [];
  const focosHumo = cachimbas.filter((_, i) => i % 3 === 0).slice(0, alta ? 7 : 3).map((m4) => new THREE.Vector3().setFromMatrixPosition(m4));
  for (const f of focosHumo) for (let k = 0; k < (alta ? 10 : 6); k++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texHumo, color: 0xe8d6c4, transparent: true, opacity: 0, depthWrite: false }));
    s.userData = { f, t: k / (alta ? 10 : 6), giro: Math.random() * 6.28, v: 0.6 + Math.random() * 0.5 };
    sala.add(s);
    humos.push(s);
  }

  // ---------- Luces ----------
  const centro = new THREE.Vector3((X_MIN + RW) / 2, 0.3, RD / 2);
  escena.add(new THREE.HemisphereLight(0xffd9b0, 0x1b100a, 0.55));
  // Luz principal que da las sombras de todo el mobiliario (cubre los 20 m de local)
  const sol = new THREE.DirectionalLight(0xffe6cc, 2.4);
  sol.position.set(centro.x + 3, 14, centro.z + 6);
  sol.target.position.copy(centro);
  sol.castShadow = true;
  sol.shadow.mapSize.set(alta ? 4096 : 2048, alta ? 4096 : 2048);
  Object.assign(sol.shadow.camera, { left: -12, right: 12, top: 9, bottom: -9, near: 2, far: 40 });
  sol.shadow.bias = -0.0004;
  sol.shadow.normalBias = 0.03;
  sol.shadow.radius = 3;
  escena.add(sol, sol.target);
  // Focos de carril: charcos de luz cálida sobre cada mesa y sobre los taburetes de la barra
  if (alta) {
    for (const o of mesas3d.values()) {
      const f = new THREE.SpotLight(0xffc98f, 6, 4.2, 0.4, 0.7, 1.6);
      f.position.set(o.centro.x, ALTO, o.centro.z + 0.2);
      f.target.position.set(o.centro.x, 0, o.centro.z);
      escena.add(f, f.target);
    }
  }
  // Foco que se enciende sobre la mesa elegida
  const focoMesa = new THREE.SpotLight(0xffe0b8, 0, 7, 0.32, 0.55, 1.2);
  if (alta) { focoMesa.castShadow = true; focoMesa.shadow.mapSize.set(1024, 1024); focoMesa.shadow.bias = -0.0004; focoMesa.shadow.radius = 4; }
  escena.add(focoMesa, focoMesa.target);
  let focoObjetivo = 0;

  // ---------- Postproceso ----------
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(escena, camara));
  let ao = null;
  if (alta) {
    ao = new GTAOPass(escena, camara, 1, 1);
    ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16 });
    ao.blendIntensity = 0.85;
    composer.addPass(ao);
  }
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.5, 0.95);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---------- Cámara y controles ----------
  const controles = new OrbitControls(camara, lienzo);
  controles.target.copy(centro);
  controles.enableDamping = true;
  controles.dampingFactor = 0.08;
  // Ampliar y reducir: botones +/−, pellizco con dos dedos en móvil y Ctrl/⌘ + rueda en ordenador.
  // Al ampliar se puede desplazar la vista (botón derecho o dos dedos).
  controles.enablePan = true;
  controles.screenSpacePanning = false;
  controles.enableZoom = false;
  controles.zoomSpeed = 1.2;
  controles.minDistance = 2.2;
  controles.touches = { ONE: -1, TWO: THREE.TOUCH.DOLLY_PAN };
  controles.rotateSpeed = 0.5;
  controles.minPolarAngle = 0.45; controles.maxPolarAngle = 1.1;
  // En móvil un dedo mueve la página; dos dedos amplían, reducen y desplazan el mapa
  if (tactil) { controles.enableZoom = true; controles.enableRotate = false; lienzo.style.touchAction = 'pan-y'; }
  // Desde el lado de la barra; en pantallas estrechas, desde la entrada mirando a lo largo del local
  let AZ = 0.12, POLAR = 0.82;
  const fijarLimites = () => { controles.minAzimuthAngle = AZ - 0.8; controles.maxAzimuthAngle = AZ + 0.8; };
  fijarLimites();

  // Distancia mínima para que una caja (x0, z0, x1, z1) quepa entera en pantalla
  const prueba = new THREE.PerspectiveCamera();
  const v = new THREE.Vector3();
  function encuadre(caja, objetivo, az, polar, margen = 0.9) {
    prueba.fov = camara.fov; prueba.aspect = camara.aspect; prueba.near = 0.1; prueba.far = 300; prueba.updateProjectionMatrix();
    const [x0, z0, x1, z1] = caja, pts = [];
    for (const x of [x0, x1]) for (const z of [z0, z1]) for (const y of [0, 1.2]) pts.push(new THREE.Vector3(x, y, z));
    let lo = 1, hi = 150;
    for (let i = 0; i < 26; i++) {
      const d = (lo + hi) / 2;
      prueba.position.setFromSpherical(new THREE.Spherical(d, polar, az)).add(objetivo);
      prueba.lookAt(objetivo); prueba.updateMatrixWorld();
      const cabe = pts.every((p) => { v.copy(p).project(prueba); return Math.abs(v.x) < margen && Math.abs(v.y) < margen && v.z < 1; });
      if (cabe) hi = d; else lo = d;
    }
    return hi;
  }
  const vista = (objetivo, dist, az = AZ, polar = POLAR) => ({ obj: objetivo.clone(), pos: new THREE.Vector3().setFromSpherical(new THREE.Spherical(dist, polar, az)).add(objetivo) });
  let viaje = null;
  const viajar = (destino) => { viaje = { t0: performance.now(), dur: pocoMovimiento ? 1 : 1300, deO: controles.target.clone(), deP: camara.position.clone(), aO: destino.obj, aP: destino.pos }; };
  const cajaSala = [X_MIN, 0, RW, RD];
  const vistaGeneral = () => vista(centro, encuadre(cajaSala, centro, AZ, POLAR, 0.98));


  function medir() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    composer.setPixelRatio(dpr);
    if (ao) ao.setSize(w * dpr, h * dpr);
    bloom.resolution.set(w * dpr / (alta ? 1 : 2), h * dpr / (alta ? 1 : 2));
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    const estrecha = camara.aspect < 1.25;
    AZ = estrecha ? -1.05 : 0.08; POLAR = estrecha ? 0.72 : 0.64;
    fijarLimites();
    const vg = vistaGeneral();
    controles.maxDistance = vg.pos.distanceTo(vg.obj) * 1.35;
    if (!zonaActual && !viaje) { camara.position.copy(vg.pos); controles.target.copy(vg.obj); }
  }

  // ---------- Capa HTML: marcadores de zona y números de mesa ----------
  const capa = document.createElement('div');
  capa.className = 'mapa3d-capa';
  contenedor.append(capa);
  const zonasVisibles = ZONAS.filter((z) => reservables.some((m) => m.z === z));
  const marcadores = zonasVisibles.map((z) => {
    const ms = reservables.filter((m) => m.z === z);
    const p = ms.reduce((a, m) => a.add(mesas3d.get(m.id).centro), new THREE.Vector3()).divideScalar(ms.length);
    p.y = z === 'barra' ? 1.35 : 1.0;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mapa3d-zona'; b.dataset.zona = z;
    const pax = ms.reduce((s, m) => s + m.pax, 0);
    b.setAttribute('aria-label', `${T.zonas[z].nombre}: ${T.resumen(ms.length, pax)}`);
    const n = document.createElement('b'); n.textContent = T.zonas[z].nombre;
    const s = document.createElement('span'); s.textContent = T.resumen(ms.length, pax);
    b.append(n, s);
    b.addEventListener('click', () => api.elegir(z));
    capa.append(b);
    return { b, p, z };
  });
  const numeros = reservables.map((m) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mapa3d-num'; b.dataset.zona = m.z; b.dataset.mesa = m.id;
    b.textContent = m.id.replace(/^TE/, 'T');
    b.setAttribute('aria-label', `${m.taburete ? T.taburete : T.mesa} ${m.id.replace(/^TE/, '')} · ${T.hasta(m.pax)}`);
    b.tabIndex = -1;
    b.addEventListener('click', () => api.elegir(m.z, m.id));
    capa.append(b);
    const c = mesas3d.get(m.id).centro.clone(); c.y += m.taburete ? 0.1 : 0.45;
    return { b, p: c, m };
  });
  const verTodo = document.createElement('button');
  verTodo.type = 'button'; verTodo.className = 'mapa3d-todo'; verTodo.textContent = T.todaSala || '⤢';
  verTodo.addEventListener('click', () => api.elegir(null));
  contenedor.append(verTodo);
  // Botones de ampliar y reducir
  const zoom = (f) => {
    const off = camara.position.clone().sub(controles.target);
    const d = THREE.MathUtils.clamp(off.length() * f, controles.minDistance, controles.maxDistance);
    viajar({ obj: controles.target.clone(), pos: controles.target.clone().add(off.setLength(d)) });
    viaje.dur = pocoMovimiento ? 1 : 450;
  };
  const botonesZoom = document.createElement('div');
  botonesZoom.className = 'mapa3d-zoom';
  for (const [txt, f, et] of [['+', 0.7, T.ampliar || 'Ampliar'], ['−', 1 / 0.7, T.reducir || 'Reducir']]) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = txt; b.setAttribute('aria-label', et); b.title = et;
    b.addEventListener('click', () => zoom(f));
    botonesZoom.append(b);
  }
  contenedor.append(botonesZoom);
  // Ctrl/⌘ + rueda en ordenador (la rueda sola sigue moviendo la página)
  lienzo.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const off = camara.position.clone().sub(controles.target);
    const d = THREE.MathUtils.clamp(off.length() * Math.exp(e.deltaY * 0.0015), controles.minDistance, controles.maxDistance);
    camara.position.copy(controles.target).add(off.setLength(d));
  }, { passive: false });
  if (!tactil && T.girar) {
    const pista = document.createElement('span');
    pista.className = 'mapa3d-pista'; pista.textContent = T.girar;
    contenedor.append(pista);
    lienzo.addEventListener('pointerdown', () => pista.classList.add('oculta'), { once: true });
  }

  function colocarCapa() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    const pon = (el, p) => {
      v.copy(p).project(camara);
      el.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(1)}px, ${((1 - v.y) / 2 * h).toFixed(1)}px)`;
      el.style.zIndex = String(1000 - Math.round(v.z * 1000));
    };
    // Separa en vertical los marcadores de zona que se solapan en pantalla
    const cajas = marcadores.map((mk) => {
      v.copy(mk.p).project(camara);
      mk.w = mk.w || mk.b.offsetWidth; mk.h = mk.h || mk.b.offsetHeight;
      return { mk, x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h };
    }).sort((a, b) => b.y - a.y);
    for (let i = 0; i < cajas.length; i++) for (let j = 0; j < i; j++) {
      const a = cajas[j], c = cajas[i];
      // Si al subirla se saldría por arriba, se coloca debajo
      if (Math.abs(a.x - c.x) < (a.mk.w + c.mk.w) / 2 + 6 && Math.abs(a.y - c.y) < a.mk.h + 6) c.y = a.y - a.mk.h - 6 < c.mk.h + 8 ? a.y + a.mk.h + 6 : a.y - a.mk.h - 6;
    }
    cajas.forEach(({ mk, x, y }) => { mk.b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; });
    numeros.forEach(({ b, p }) => pon(b, p));
  }

  // ---------- Selección ----------
  let zonaActual = null, mesaActual = null;
  function aplicar(z, mesa) {
    zonaActual = z; mesaActual = mesa;
    contenedor.classList.toggle('con-zona', !!z);
    marcadores.forEach(({ b, z: zz }) => b.classList.toggle('activa', zz === z));
    numeros.forEach(({ b, m }) => { const on = m.z === z; b.classList.toggle('visible', on); b.classList.toggle('elegida', m.id === mesa); b.tabIndex = on ? 0 : -1; });
    for (const [id, o] of mesas3d) o.objetivo = id === mesa ? 1 : (o.m.z === z ? 0.45 : 0);
    focoObjetivo = mesa && mesas3d.has(mesa) ? 1 : 0;
    if (focoObjetivo) { const c = mesas3d.get(mesa).centro; focoMesa.position.set(c.x, 4.2, c.z + 0.6); focoMesa.target.position.set(c.x, 0, c.z); }
    if (!z) { viajar(vistaGeneral()); return; }
    const os = mesa && mesas3d.has(mesa) ? [mesas3d.get(mesa)] : [...mesas3d.values()].filter((o) => o.m.z === z);
    if (!os.length) return;
    const caja = os.reduce((a, o) => [Math.min(a[0], o.caja[0]), Math.min(a[1], o.caja[1]), Math.max(a[2], o.caja[2]), Math.max(a[3], o.caja[3])], [Infinity, Infinity, -Infinity, -Infinity]);
    const m = mesa ? 1.6 : 1.1;
    const cajaM = [caja[0] - m, caja[1] - m, caja[2] + m, caja[3] + m];
    const foco = new THREE.Vector3((caja[0] + caja[2]) / 2, 0.3, (caja[1] + caja[3]) / 2);
    const az = THREE.MathUtils.clamp(controles.getAzimuthalAngle(), AZ - 0.5, AZ + 0.5);
    viajar(vista(foco, Math.max(5, encuadre(cajaM, foco, az, 0.9)), az, 0.9));
  }
  api.escuchar(aplicar);

  // Clic o toque sobre una mesa (sin contar los arrastres para girar)
  const ray = new THREE.Raycaster(), puntero = new THREE.Vector2();
  let inicio = null;
  const tocar = (e) => {
    const r = lienzo.getBoundingClientRect();
    puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(puntero, camara);
    return ray.intersectObjects(clicables, false)[0];
  };
  lienzo.addEventListener('pointerdown', (e) => { inicio = [e.clientX, e.clientY]; });
  lienzo.addEventListener('pointerup', (e) => {
    if (!inicio || Math.hypot(e.clientX - inicio[0], e.clientY - inicio[1]) > 6) return;
    const hit = tocar(e);
    if (hit) api.elegir(hit.object.userData.zona, hit.object.userData.mesa);
  });
  let encima = null;
  lienzo.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || e.buttons) return;
    const hit = tocar(e), id = hit ? hit.object.userData.mesa : null;
    if (id === encima) return;
    encima = id;
    lienzo.style.cursor = id ? 'pointer' : 'grab';
  });
  lienzo.style.cursor = 'grab';

  // Baja las paredes que miran a la cámara (y oculta lo que cuelga de ellas)
  const dirCam = new THREE.Vector3();
  function cortar() {
    dirCam.copy(camara.position).sub(controles.target).setY(0).normalize();
    for (const c of cortables) {
      const cara = c.n[0] * dirCam.x + c.n[1] * dirCam.z > 0.35;
      if (c.ocultar) c.o.visible = !cara;
      else c.o.scale.y = cara ? 0.32 / ALTO : 1;
    }
  }

  // ---------- Bucle ----------
  let antes = performance.now();
  let tiempo = 0, cuadros = 0, t0 = performance.now(), ajustado = false;
  function cuadro() {
    const ya = performance.now(), dt = Math.min((ya - antes) / 1000, 0.05);
    antes = ya;
    tiempo += dt;
    if (viaje) {
      const k = Math.min(1, (performance.now() - viaje.t0) / viaje.dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      controles.target.lerpVectors(viaje.deO, viaje.aO, e);
      camara.position.lerpVectors(viaje.deP, viaje.aP, e);
      if (k >= 1) viaje = null;
    } else if (tactil && !pocoMovimiento) {
      // En móvil no se arrastra (para no bloquear el scroll): la cámara se balancea despacio
      const s = new THREE.Spherical().setFromVector3(camara.position.clone().sub(controles.target));
      s.theta += Math.sin(tiempo * 0.25) * 0.0009;
      camara.position.setFromSpherical(s).add(controles.target);
    }
    controles.update();
    // Que al desplazar la vista no se salga del local
    const tx = THREE.MathUtils.clamp(controles.target.x, cajaSala[0], cajaSala[2]), tz = THREE.MathUtils.clamp(controles.target.z, cajaSala[1], cajaSala[3]);
    if (tx !== controles.target.x || tz !== controles.target.z) {
      camara.position.x += tx - controles.target.x; camara.position.z += tz - controles.target.z;
      controles.target.x = tx; controles.target.z = tz;
    }
    cortar();
    for (const o of mesas3d.values()) {
      o.brillo += (o.objetivo - o.brillo) * Math.min(1, dt * 6);
      const pulso = o.objetivo === 1 && !pocoMovimiento ? 0.85 + Math.sin(tiempo * 3) * 0.15 : 1;
      o.halo.material.opacity = o.brillo * pulso;
      o.halo.visible = o.brillo > 0.01;
      o.halo.scale.setScalar(1 + Math.max(0, o.brillo - 0.45) * 0.3);
    }
    focoMesa.intensity += (focoObjetivo * 90 - focoMesa.intensity) * Math.min(1, dt * 4);
    for (const s of humos) {
      const u = s.userData;
      u.t = (u.t + dt * 0.11 * u.v) % 1;
      const t = u.t;
      s.position.set(u.f.x + Math.sin(u.giro + t * 5) * 0.06 * t, u.f.y + 0.68 + t * 1.3, u.f.z + Math.cos(u.giro + t * 4) * 0.06 * t);
      const e = 0.12 + t * 0.55;
      s.scale.set(e, e, e);
      s.material.opacity = Math.sin(Math.PI * t) * 0.16;
      s.material.rotation = u.giro + t * 1.5;
    }
    instancias[4].material.emissiveIntensity = 2.2 + Math.sin(tiempo * 2.3) * 0.6;
    composer.render(dt);
    colocarCapa();
    // Si el equipo va justo, bajamos la resolución una vez
    if (!ajustado && ++cuadros === 90) {
      const fps = 90000 / (performance.now() - t0);
      ajustado = true;
      if (fps < 40 && dpr > 1) { dpr = 1; renderer.setPixelRatio(1); medir(); }
    }
  }

  medir();
  addEventListener('resize', medir);
  new ResizeObserver(medir).observe(contenedor);
  let activo = false;
  const encender = (si) => {
    if (si && !activo) { activo = true; antes = performance.now(); renderer.setAnimationLoop(cuadro); }
    else if (!si && activo) { activo = false; renderer.setAnimationLoop(null); }
  };
  new IntersectionObserver((es) => encender(es[es.length - 1].isIntersecting), { rootMargin: '100px' }).observe(contenedor);
  // Por si el mapa ya estaba en pantalla al cargarse
  requestAnimationFrame(() => { const r = contenedor.getBoundingClientRect(); if (r.bottom > -100 && r.top < innerHeight + 100) encender(true); });
  lienzo.addEventListener('webglcontextlost', (e) => { e.preventDefault(); renderer.setAnimationLoop(null); api.sinTresD(); });

  // Primer cuadro ya pintado (para que el cambio desde el mapa plano no parpadee)
  cuadro();
  return { aplicar };
}
