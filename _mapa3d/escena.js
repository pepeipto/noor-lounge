// Mapa de reservas en 3D: la sala de NOOR con luz, sombras y materiales realistas.
// Lo carga js/mapa.js solo si el navegador tiene WebGL2; si algo falla, se queda el mapa plano (SVG).
// Datos y textos llegan en `api` (window.NOOR_MAPA), así que sirve para los 8 idiomas.
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

export function iniciar(api, contenedor) {
  const { MESAS, PANTALLAS, COLUMNAS, BARRAS, ZONAS, O, W, H, T } = api;
  const tactil = matchMedia('(pointer: coarse)').matches;
  const pocoMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alta = !tactil && (navigator.hardwareConcurrency || 4) >= 4;

  // ---------- Escala: unidades del plano del TPV → metros ----------
  const K = 0.0068, RW = W * K, RD = H * K, ALTO = 2.9;
  const P = (x, y) => [(x - O[0]) * K, (y - O[1]) * K];
  const rect = (d) => { const [x, z] = P(d[0], d[1]); return { x0: x, z0: z, x1: x + d[2] * K, z1: z + d[3] * K, cx: x + d[2] * K / 2, cz: z + d[3] * K / 2 }; };

  // ---------- Renderizador ----------
  const lienzo = document.createElement('canvas');
  contenedor.prepend(lienzo);
  const renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x120c09, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  let dpr = Math.min(devicePixelRatio || 1, alta ? 1.75 : 1.5);
  renderer.setPixelRatio(dpr);
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.15;
  escena.fog = new THREE.Fog(0x120c09, 14, 30);

  const camara = new THREE.PerspectiveCamera(28, 1.6, 0.5, 60);

  // ---------- Materiales ----------
  const conRep = (t, rx, ry) => { const c = t.clone(); c.repeat.set(rx, ry); c.needsUpdate = true; return c; };
  const pack = (m, rx, ry, extra = {}) => {
    const col = TX.aTextura(m.col, { color: true, aniso }), rug = TX.aTextura(m.rug, { aniso }), nor = TX.aTextura(m.nor, { aniso });
    return (rx2 = rx, ry2 = ry) => new THREE.MeshStandardMaterial({
      map: conRep(col, rx2, ry2), roughnessMap: conRep(rug, rx2, ry2), normalMap: conRep(nor, rx2, ry2), ...extra,
    });
  };
  const azulejo = pack(TX.azulejo(alta ? 1024 : 768), 1, 1, { metalness: 0.35, roughness: 1, normalScale: new THREE.Vector2(0.9, 0.9) });
  const baldosa = pack(TX.baldosa(alta ? 1024 : 768), 1, 1, { metalness: 0, roughness: 1, normalScale: new THREE.Vector2(0.6, 0.6) });
  const madera = pack(TX.madera(alta ? 1024 : 768), 1, 1, { metalness: 0.05, roughness: 1, normalScale: new THREE.Vector2(1.2, 1.2) });
  const marmol = pack(TX.marmol(512), 1, 1, { metalness: 0.05, roughness: 1, envMapIntensity: 1.6 });

  const M = {
    terciopeloGris: new THREE.MeshPhysicalMaterial({ color: 0x48423e, roughness: 0.85, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(0x5a524c) }),
    terciopeloNaranja: new THREE.MeshPhysicalMaterial({ color: 0x9a3f15, roughness: 0.82, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xc0602a) }),
    terciopeloCamel: new THREE.MeshPhysicalMaterial({ color: 0x6e4529, roughness: 0.85, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(0x8a6040) }),
    negroMate: new THREE.MeshStandardMaterial({ color: 0x0d0b0a, roughness: 0.55, metalness: 0.6 }),
    mesaNegra: new THREE.MeshStandardMaterial({ color: 0x141110, roughness: 0.32, metalness: 0.1 }),
    acero: new THREE.MeshStandardMaterial({ color: 0xc9c4bd, roughness: 0.22, metalness: 1 }),
    cobre: new THREE.MeshStandardMaterial({ color: 0xd08a4a, roughness: 0.3, metalness: 1 }),
    ceramica: new THREE.MeshStandardMaterial({ color: 0xe9e2d6, roughness: 0.45 }),
    manguera: new THREE.MeshStandardMaterial({ color: 0x151313, roughness: 0.6, metalness: 0.2 }),
    brasa: new THREE.MeshStandardMaterial({ color: 0x220a00, emissive: 0xff5a10, emissiveIntensity: 2.4 }),
    vidrio: alta
      ? new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, transmission: 1, thickness: 0.05, ior: 1.5, envMapIntensity: 1.4 })
      : new THREE.MeshPhysicalMaterial({ color: 0xbfd4d8, roughness: 0.05, transparent: true, opacity: 0.35, envMapIntensity: 1.6 }),
    oscuroPared: new THREE.MeshStandardMaterial({ color: 0x15100d, roughness: 0.7 }),
    led: new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffa04a, emissiveIntensity: 4 }),
    espejo: new THREE.MeshStandardMaterial({ color: 0x8a8580, roughness: 0.03, metalness: 1, envMapIntensity: 2 }),
    botella: new THREE.MeshPhysicalMaterial({ roughness: 0.08, metalness: 0, transparent: true, opacity: 0.88, clearcoat: 1, envMapIntensity: 1.8 }),
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

  // ---------- La sala ----------
  const sala = new THREE.Group();
  escena.add(sala);
  const suelo = malla(new THREE.PlaneGeometry(RW, RD), baldosa(RW / 1.2, RD / 1.2), RW / 2, 0, RD / 2);
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  sala.add(suelo);
  // Zócalo bajo el suelo para que la sala "flote" como una maqueta
  sala.add(malla(new THREE.BoxGeometry(RW + 0.12, 0.3, RD + 0.12), M.oscuroPared, RW / 2, -0.152, RD / 2));
  sala.add(malla(new THREE.BoxGeometry(RW + 0.14, 0.012, RD + 0.14), M.cobre, RW / 2, -0.004, RD / 2));

  // Paredes altas del fondo (barra: azulejo cobre; derecha: madera con relieve) y paredes bajas delante (corte de maqueta)
  const pared = (largo, alto, mat, x, z, ry) => {
    const g = new THREE.Group();
    const m = malla(new THREE.BoxGeometry(largo, alto, 0.12), mat, 0, alto / 2, 0);
    g.add(m, malla(new THREE.BoxGeometry(largo, 0.025, 0.14), M.cobre, 0, alto, 0));
    g.position.set(x, 0, z); g.rotation.y = ry;
    return sombra(g, false, true);
  };
  sala.add(pared(RW + 0.12, ALTO, azulejo(RW / 1.2, ALTO / 1.2), RW / 2, RD + 0.06, 0));
  sala.add(pared(RD, ALTO, madera(RD / 1.2, ALTO / 1.2), RW + 0.06, RD / 2, Math.PI / 2));
  // Delante, solo un murete con remate de cobre; en la pared izquierda queda el hueco de la entrada
  const ent = rect([313, 176, 103, 135]);
  sala.add(pared(RW + 0.12, 0.32, azulejo(RW / 1.2, 0.3), RW / 2, -0.06, 0));
  sala.add(pared(RD - ent.z1, 0.32, azulejo((RD - ent.z1) / 1.2, 0.3), -0.06, (ent.z1 + RD) / 2, Math.PI / 2));
  sala.add(pared(ent.z0, 0.32, azulejo(0.2, 0.3), -0.06, ent.z0 / 2, Math.PI / 2));
  // Felpudo de entrada con el texto traducido
  {
    const t = TX.cartel(T.entrada, { ancho: 512, alto: 256, fondo: '#20160f', tam: 64 });
    const f = malla(new THREE.PlaneGeometry(ent.z1 - ent.z0 - 0.1, 0.62), new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }), 0.38, 0.004, (ent.z0 + ent.z1) / 2);
    f.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    f.receiveShadow = true;
    sala.add(f);
  }
  // Espejo redondo con aro de LED naranja en la pared de madera
  {
    const g = new THREE.Group();
    g.add(malla(new THREE.CircleGeometry(0.42, 64), M.espejo));
    const aro = malla(new THREE.TorusGeometry(0.44, 0.018, 16, 96), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xff7a2a, emissiveIntensity: 6 }));
    g.add(aro);
    g.position.set(RW - 0.005, 1.65, RD * 0.55); g.rotation.y = -Math.PI / 2;
    sala.add(g);
  }

  // ---------- Ocupación (para que los asientos no se pisen) ----------
  const ocupado = [];
  const choca = (r) => r.x0 < 0.02 || r.z0 < 0.02 || r.x1 > RW - 0.02 || r.z1 > RD - 0.02 ||
    ocupado.some((o) => r.x0 < o.x1 - 0.02 && r.x1 > o.x0 + 0.02 && r.z0 < o.z1 - 0.02 && r.z1 > o.z0 + 0.02);
  const reservar = (r) => ocupado.push(r);

  // ---------- Barras ----------
  for (const [x, y, w, h, k] of BARRAS) {
    const r = rect([x, y, w, h]), ancho = r.x1 - r.x0, fondo = r.z1 - r.z0, alto = 1.08;
    const g = new THREE.Group();
    g.add(malla(new THREE.BoxGeometry(ancho - 0.04, alto - 0.05, fondo - 0.04), M.mesaNegra, 0, (alto - 0.05) / 2, 0));
    g.add(malla(rbox(ancho + 0.06, 0.05, fondo + 0.06, 0.012), marmol(ancho / 1.4, fondo / 1.4), 0, alto - 0.025, 0));
    // Tira de LED al pie de la barra (como en el local)
    const pie = (k === 'barra') ? [0.012, 0.012, fondo - 0.08, -(ancho / 2) + 0.004, 0] : [ancho - 0.08, 0.012, 0.012, 0, -(fondo / 2) + 0.004];
    g.add(malla(new THREE.BoxGeometry(pie[0], pie[1], pie[2]), M.led, pie[3], 0.05, pie[4]));
    g.position.set(r.cx, 0, r.cz);
    sala.add(sombra(g));
    reservar({ ...r, x0: r.x0 - 0.05, z0: r.z0 - 0.05, x1: r.x1 + 0.05, z1: r.z1 + 0.05 });
    if (k === 'barra') continue;
    // Cachimbas preparadas sobre la barra de shishas, botellas y vasos en la de bebidas
  }
  // Estanterías de botellas en la pared del fondo, detrás de la barra de bebidas
  const bb = rect(BARRAS.find((b) => b[4] === 'bebida'));
  {
    const x0 = bb.x0 + 0.05, x1 = bb.x1 - 0.05, largo = x1 - x0, zEst = RD - 0.16;
    const alturas = [1.2, 1.58, 1.96];
    for (const y of alturas) {
      sala.add(sombra(malla(new THREE.BoxGeometry(largo, 0.025, 0.26), M.vidrio, (x0 + x1) / 2, y, zEst), false, true));
      sala.add(malla(new THREE.BoxGeometry(largo, 0.01, 0.01), M.led, (x0 + x1) / 2, y - 0.02, zEst - 0.11));
    }
    // Botellas: una sola malla instanciada con colores y alturas distintas
    const perfil = [[0, 0], [0.036, 0], [0.038, 0.01], [0.038, 0.2], [0.032, 0.24], [0.012, 0.27], [0.012, 0.33], [0.014, 0.335], [0, 0.335]].map(([a, b]) => new THREE.Vector2(a, b));
    const gb = new THREE.LatheGeometry(perfil, 18);
    const porBalda = Math.floor(largo / 0.085), n = porBalda * alturas.length;
    const botellas = new THREE.InstancedMesh(gb, M.botella, n);
    const tonos = [0x7a3c0f, 0xa65c12, 0x2f4a1f, 0xd9d2c0, 0x4a1b12, 0x8f6a1a, 0x1d2a26, 0xb88a3a];
    const azar = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(9);
    const m4 = new THREE.Matrix4(), c = new THREE.Color();
    let i = 0;
    for (const y of alturas) for (let j = 0; j < porBalda; j++) {
      const e = 0.8 + azar() * 0.45;
      m4.compose(new THREE.Vector3(x0 + 0.045 + j * 0.085, y + 0.0125, zEst + (azar() - 0.5) * 0.08), new THREE.Quaternion(), new THREE.Vector3(1, e, 1));
      botellas.setMatrixAt(i, m4);
      botellas.setColorAt(i, c.setHex(tonos[Math.floor(azar() * tonos.length)]));
      i++;
    }
    botellas.castShadow = true;
    sala.add(botellas);
    const luz = (x) => { const l = new THREE.PointLight(0xffa860, 1.4, 2.4, 2); l.position.set(x, 1.75, RD - 0.35); sala.add(l); };
    luz(x0 + largo * 0.25); luz(x0 + largo * 0.75);
  }

  // ---------- Aseos ----------
  {
    const r = rect([1236, 562, 128, 128]), g = new THREE.Group(), alto = 2.4;
    g.add(malla(new THREE.BoxGeometry(r.x1 - r.x0, alto, r.z1 - r.z0), madera(0.8, 2), 0, alto / 2, 0));
    g.add(malla(new THREE.BoxGeometry(r.x1 - r.x0 + 0.02, 0.025, r.z1 - r.z0 + 0.02), M.cobre, 0, alto, 0));
    const puerta = malla(new THREE.BoxGeometry(0.02, 2.05, 0.78), M.mesaNegra, -(r.x1 - r.x0) / 2 - 0.006, 1.03, 0);
    g.add(puerta);
    const cartel = malla(new THREE.PlaneGeometry(0.62, 0.155), new THREE.MeshStandardMaterial({ map: TX.cartel(T.aseos), emissive: 0xffffff, emissiveMap: TX.cartel(T.aseos), emissiveIntensity: 0.6 }), -(r.x1 - r.x0) / 2 - 0.02, 2.2, 0);
    cartel.rotation.y = -Math.PI / 2;
    g.add(cartel);
    g.position.set(r.cx, 0, r.cz);
    sala.add(sombra(g));
    reservar(r);
  }

  // ---------- Columnas de luz ----------
  const perf = TX.perforado();
  for (const [x, y] of COLUMNAS) {
    const [cx, cz] = P(x, y), g = new THREE.Group(), alto = 2.5;
    const mat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: perf, emissiveIntensity: 1.6, roughness: 0.6 });
    g.add(malla(new THREE.CylinderGeometry(0.16, 0.16, alto, 48, 1, true), mat, 0, alto / 2, 0));
    g.add(malla(new THREE.CylinderGeometry(0.175, 0.175, 0.05, 48), M.negroMate, 0, 0.025, 0));
    g.add(malla(new THREE.CylinderGeometry(0.175, 0.175, 0.05, 48), M.negroMate, 0, alto, 0));
    const l = new THREE.PointLight(0xff9c45, 2.2, 3.5, 2);
    l.position.y = 1.2;
    g.add(l);
    g.position.set(cx, 0, cz);
    sala.add(g);
    reservar({ x0: cx - 0.2, x1: cx + 0.2, z0: cz - 0.2, z1: cz + 0.2 });
  }

  // ---------- Pantallas (con fotos del local en la imagen) ----------
  const fotos = ['cachimba-1-800.webp', 'coctel-1-800.webp', 'ritual-800.webp', 'interior-2-800.webp', 'ambiente-1.webp'];
  const cargador = new THREE.TextureLoader();
  const centroSala = new THREE.Vector2(RW / 2, RD / 2);
  PANTALLAS.forEach(([x, y, w, h], i) => {
    const r = rect([x, y, w, h]), vertical = h > w, largo = Math.min(vertical ? r.z1 - r.z0 : r.x1 - r.x0, 2.4);
    const ancho = largo * 0.92, altoP = ancho * 0.5625, base = largo > 2 ? 0.55 : 0.85;
    const g = new THREE.Group();
    g.add(malla(rbox(ancho + 0.04, altoP + 0.04, 0.05, 0.01), M.negroMate, 0, base + altoP / 2, 0));
    const tex = cargador.load(new URL(`../img/${fotos[i % fotos.length]}`, import.meta.url).href, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; });
    tex.colorSpace = THREE.SRGBColorSpace;
    const pantalla = malla(new THREE.PlaneGeometry(ancho, altoP), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.55, roughness: 0.15, metalness: 0.2 }), 0, base + altoP / 2, 0.027);
    g.add(pantalla);
    // Pie: dos patas finas hasta el suelo
    for (const s of [-1, 1]) g.add(malla(new THREE.BoxGeometry(0.035, base + 0.1, 0.035), M.negroMate, s * ancho * 0.32, (base + 0.1) / 2, -0.02));
    g.add(malla(new THREE.BoxGeometry(ancho * 0.7, 0.025, 0.35), M.negroMate, 0, 0.0125, 0));
    // Orientación: la cara mira hacia el centro de la sala
    const n = vertical ? new THREE.Vector2(Math.sign(centroSala.x - r.cx) || 1, 0) : new THREE.Vector2(0, Math.sign(centroSala.y - r.cz) || 1);
    g.rotation.y = Math.atan2(n.x, n.y);
    g.position.set(r.cx, 0, r.cz);
    sala.add(sombra(g));
    const glow = new THREE.PointLight(0x9fb6ff, 0.9, 2.2, 2);
    glow.position.set(r.cx + n.x * 0.5, base + altoP / 2, r.cz + n.y * 0.5);
    sala.add(glow);
    reservar({ x0: r.cx - (vertical ? 0.2 : ancho / 2), x1: r.cx + (vertical ? 0.2 : ancho / 2), z0: r.cz - (vertical ? ancho / 2 : 0.2), z1: r.cz + (vertical ? ancho / 2 : 0.2) });
  });

  // ---------- Mobiliario ----------
  // Sofá con respaldo capitoné en canales verticales (como el del local). Mira hacia +z en local.
  function sofa(largo, mat = M.terciopeloGris) {
    const fondo = 0.62, n = Math.max(2, Math.round(largo / 0.24)), cw = largo / n;
    const piezas = [[rbox(largo, 0.22, fondo, 0.03), 0, 0.15, 0], [rbox(largo - 0.03, 0.13, fondo - 0.2, 0.05), 0, 0.32, 0.08]];
    for (let i = 0; i < n; i++) piezas.push([rbox(cw - 0.012, 0.44, 0.17, 0.07, 4), -largo / 2 + cw * (i + 0.5), 0.48, -fondo / 2 + 0.1, 0, -0.12]);
    const g = new THREE.Group();
    g.add(unir(piezas, mat));
    g.add(malla(new THREE.BoxGeometry(largo - 0.06, 0.04, fondo - 0.06), M.negroMate, 0, 0.02, 0));
    return { g: sombra(g), fondo };
  }
  function puf(mat = M.terciopeloCamel) {
    const g = new THREE.Group();
    g.add(unir([[new THREE.CylinderGeometry(0.2, 0.19, 0.36, 40), 0, 0.2, 0], [new THREE.TorusGeometry(0.17, 0.035, 12, 40), 0, 0.38, 0, 0, Math.PI / 2]], mat));
    g.add(malla(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 40), M.negroMate, 0, 0.015, 0));
    return sombra(g);
  }
  // Taburete alto: asiento naranja, respaldo envolvente camel, patas negras finas y aro reposapiés
  const geoTaburete = (() => {
    const respaldo = new THREE.CylinderGeometry(0.22, 0.2, 0.3, 32, 1, true, -1.2, 2.4);
    const patas = [];
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const p = new THREE.CylinderGeometry(0.011, 0.011, 0.74, 8);
      patas.push([p, sx * 0.16, 0.37, sz * 0.16, 0, sz * 0.08, -sx * 0.08]);
    }
    patas.push([new THREE.TorusGeometry(0.18, 0.009, 8, 40), 0, 0.27, 0, 0, Math.PI / 2]);
    return { asiento: rbox(0.44, 0.09, 0.42, 0.04), respaldo, patas };
  })();
  const camelDoble = M.terciopeloCamel.clone(); camelDoble.side = THREE.DoubleSide;
  function taburete() {
    const g = new THREE.Group();
    g.add(malla(geoTaburete.asiento, M.terciopeloNaranja, 0, 0.77, 0));
    const r = malla(geoTaburete.respaldo, camelDoble, 0, 0.97, -0.02);
    r.rotation.y = Math.PI;
    g.add(r);
    g.add(unir(geoTaburete.patas, M.negroMate));
    return sombra(g);
  }
  function mesaRect(w, d) {
    const g = new THREE.Group(), alto = 0.46;
    g.add(malla(rbox(w, 0.035, d, 0.012), M.mesaNegra, 0, alto - 0.0175, 0));
    const patas = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) patas.push([new THREE.BoxGeometry(0.03, alto - 0.035, 0.03), sx * (w / 2 - 0.07), (alto - 0.035) / 2, sz * (d / 2 - 0.07)]);
    g.add(unir(patas, M.negroMate));
    return { g: sombra(g), alto };
  }
  function mesaRed(r, alto = 0.5) {
    const g = new THREE.Group();
    g.add(malla(new THREE.CylinderGeometry(r, r, 0.03, 56), M.mesaNegra, 0, alto - 0.015, 0));
    const pz = [];
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2 + Math.PI / 4, l = Math.hypot(r * 0.6, alto);
      pz.push([new THREE.CylinderGeometry(0.012, 0.012, l, 8), Math.cos(a) * r * 0.3, alto / 2 - 0.015, Math.sin(a) * r * 0.3, -a, 0, Math.atan2(r * 0.6, alto)]);
    }
    pz.push([new THREE.CylinderGeometry(r * 0.32, r * 0.32, 0.02, 24), 0, alto - 0.04, 0]);
    g.add(unir(pz, M.negroMate));
    return { g: sombra(g), alto };
  }

  // Cachimbas: cuatro mallas instanciadas (vidrio, acero, cazoleta, manguera) + brasas
  const cachimbas = [];
  const geoCachimba = (() => {
    const s = 1;
    const base = new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.085, 0.03], [0.09, 0.08], [0.07, 0.15], [0.035, 0.2], [0.02, 0.23], [0.02, 0.245], [0, 0.245]].map(([a, b]) => new THREE.Vector2(a * s, b * s)), 40);
    const acero = mergeGeometries([
      new THREE.CylinderGeometry(0.014, 0.016, 0.42, 16).translate(0, 0.45, 0),
      new THREE.CylinderGeometry(0.1, 0.1, 0.006, 40).translate(0, 0.6, 0),
      ...[0.3, 0.38, 0.5].map((y) => new THREE.TorusGeometry(0.022, 0.006, 8, 24).rotateX(Math.PI / 2).translate(0, y, 0)),
      new THREE.CylinderGeometry(0.03, 0.022, 0.03, 20).translate(0, 0.255, 0),
    ].map((g) => g.toNonIndexed()));
    const cazoleta = new THREE.LatheGeometry([[0, 0], [0.02, 0], [0.035, 0.05], [0.04, 0.06], [0, 0.06]].map(([a, b]) => new THREE.Vector2(a, b)), 28).translate(0, 0.605, 0);
    // Manguera en espiral alrededor del tubo que cae hacia la mesa
    const pts = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40, a = t * Math.PI * 6; pts.push(new THREE.Vector3(Math.cos(a) * 0.05, 0.5 - t * 0.18, Math.sin(a) * 0.05)); }
    pts.push(new THREE.Vector3(0.12, 0.25, 0.04), new THREE.Vector3(0.22, 0.08, 0.06), new THREE.Vector3(0.3, 0.012, 0.1), new THREE.Vector3(0.42, 0.012, 0.1));
    const manguera = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.007, 8);
    const brasa = mergeGeometries([0, 1, 2].map((k) => new THREE.BoxGeometry(0.022, 0.012, 0.022).rotateY(k).translate(Math.cos(k * 2.1) * 0.016, 0.668, Math.sin(k * 2.1) * 0.016).toNonIndexed()));
    return { base, acero, cazoleta, manguera, brasa };
  })();
  const ponerCachimba = (x, y, z, ry = 0) => cachimbas.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1)));

  // ---------- Mesas, asientos y brillos de selección ----------
  const texBrilloR = TX.brillo('redondo'), texBrilloC = TX.brillo('cuadrado');
  const mesas3d = new Map();   // id → { grupo, halo, centro, z }
  const clicables = [];
  const azarA = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(3);
  // Primero reservar el sitio de todas las mesas, después los asientos
  const info = MESAS.map((m) => {
    if (m.f === 'rect') return { m, r: rect(m.d) };
    const [cx, cz] = P(m.d[0], m.d[1]), rr = m.taburete ? 0.21 : Math.max(0.26, m.d[2] * K * 0.9);
    return { m, r: { x0: cx - rr, x1: cx + rr, z0: cz - rr, z1: cz + rr, cx, cz }, rr };
  });
  // Sofás del fondo: un banco corrido contra la pared delantera y las mesas justo delante
  const FONDO_BANCO = 0.64;
  const enBanco = info.filter(({ m, r }) => m.z === 'fondo' && r.z0 < 0.7);
  for (const it of info.filter(({ m }) => m.z === 'fondo')) {
    const dz = FONDO_BANCO + 0.1 - it.r.z0;
    if (dz > 0) { it.r.z0 += dz; it.r.z1 += dz; it.r.cz += dz; }
  }
  enBanco.forEach((it) => { it.banco = true; });
  const cortes = PANTALLAS.map((d) => rect(d)).filter((q) => q.z0 < FONDO_BANCO).map((q) => [q.x0 - 0.04, q.x1 + 0.04]);
  let tramos = enBanco.map(({ r }) => [r.x0 - 0.14, r.x1 + 0.14]).sort((a, b) => a[0] - b[0]);
  tramos = tramos.reduce((acc, t) => { const u = acc[acc.length - 1]; if (u && t[0] - u[1] < 0.45) u[1] = Math.max(u[1], t[1]); else acc.push([...t]); return acc; }, []);
  for (const [c0, c1] of cortes) tramos = tramos.flatMap(([a0, a1]) => (c1 <= a0 || c0 >= a1) ? [[a0, a1]] : [[a0, c0], [c1, a1]].filter(([x0, x1]) => x1 - x0 > 0.5));
  tramos = tramos.map(([a0, a1]) => [Math.max(0.03, a0), Math.min(RW - 0.03, a1)]);
  info.forEach(({ r }) => reservar(r));

  for (const [a0, a1] of tramos) {
    const so = sofa(a1 - a0);
    so.g.position.set((a0 + a1) / 2, 0, 0.02 + so.fondo / 2);
    sala.add(so.g);
    reservar({ x0: a0, x1: a1, z0: 0, z1: 0.02 + so.fondo });
  }
  for (const { m, r, rr, banco } of info) {
    const g = new THREE.Group();
    g.position.set(r.cx, 0, r.cz);
    const huella = { x0: r.x0, x1: r.x1, z0: r.z0, z1: r.z1 };
    const amplia = (q) => { huella.x0 = Math.min(huella.x0, q.x0); huella.x1 = Math.max(huella.x1, q.x1); huella.z0 = Math.min(huella.z0, q.z0); huella.z1 = Math.max(huella.z1, q.z1); };
    let altoMesa = 0;
    if (m.taburete) {
      const t = taburete();
      // El respaldo mira hacia fuera de la barra
      t.rotation.y = r.cz > RD * 0.7 ? 0 : (r.cz > bb.z0 - 1.6 ? 0 : Math.PI);
      g.add(t);
    } else if (m.f === 'rect') {
      const w = r.x1 - r.x0, d = r.z1 - r.z0, largoX = w >= d;
      const mt = mesaRect(w, d); g.add(mt.g); altoMesa = mt.alto;
      // Lados largos: sofá donde quepa (primero el que da a la pared más cercana); lados libres: pufs
      const lados = largoX
        ? [{ eje: 'z', s: -1, dist: r.z0 }, { eje: 'z', s: 1, dist: RD - r.z1 }]
        : [{ eje: 'x', s: -1, dist: r.x0 }, { eje: 'x', s: 1, dist: RW - r.x1 }];
      lados.sort((a, b) => a.dist - b.dist);
      let sofas = 0;
      if (banco) { sofas = 1; amplia({ x0: r.x0 - 0.1, x1: r.x1 + 0.1, z0: 0.02, z1: r.z0 }); }
      for (const l of banco ? [] : lados) {
        if (sofas && m.pax < 5) break;
        const largo = Math.max(largoX ? w : d, 0.9) + 0.1;
        const so = sofa(largo);
        const off = (largoX ? d : w) / 2 + 0.1 + so.fondo / 2;
        const px = l.eje === 'x' ? l.s * off : 0, pz = l.eje === 'z' ? l.s * off : 0;
        const q = l.eje === 'x'
          ? { x0: r.cx + px - so.fondo / 2, x1: r.cx + px + so.fondo / 2, z0: r.cz - largo / 2, z1: r.cz + largo / 2 }
          : { x0: r.cx - largo / 2, x1: r.cx + largo / 2, z0: r.cz + pz - so.fondo / 2, z1: r.cz + pz + so.fondo / 2 };
        if (choca(q)) continue;
        so.g.position.set(px, 0, pz);
        so.g.rotation.y = l.eje === 'z' ? (l.s < 0 ? 0 : Math.PI) : (l.s < 0 ? Math.PI / 2 : -Math.PI / 2);
        g.add(so.g); reservar(q); amplia(q); sofas++;
      }
      // Pufs para completar las plazas
      let plazas = sofas * Math.max(2, Math.round(Math.max(w, d) / 0.55));
      const huecos = [];
      const lx = largoX ? w : d;
      for (const s of [-1, 1]) for (let k = 0; k < Math.max(1, Math.round(lx / 0.55)); k++) {
        const t = -lx / 2 + lx * (k + 0.5) / Math.max(1, Math.round(lx / 0.55));
        const off = (largoX ? d : w) / 2 + 0.26;
        huecos.push(largoX ? [t, s * off] : [s * off, t]);
      }
      for (const s of [-1, 1]) huecos.push(largoX ? [s * (w / 2 + 0.26), 0] : [0, s * (d / 2 + 0.26)]);
      for (const [hx, hz] of huecos) {
        if (plazas >= m.pax) break;
        const q = { x0: r.cx + hx - 0.2, x1: r.cx + hx + 0.2, z0: r.cz + hz - 0.2, z1: r.cz + hz + 0.2 };
        if (choca(q)) continue;
        const p = puf(); p.position.set(hx, 0, hz); g.add(p); reservar(q); amplia(q); plazas++;
      }
      ponerCachimba(r.cx + (azarA() - 0.5) * w * 0.3, altoMesa, r.cz + (azarA() - 0.5) * d * 0.3, azarA() * 6.28);
    } else {
      const mt = mesaRed(rr, 0.52); g.add(mt.g); altoMesa = mt.alto;
      const n = Math.min(4, Math.max(1, m.pax)), a0 = azarA() * 6.28;
      for (let k = 0; k < n + 3 && g.children.length - 1 < n; k++) {
        const a = a0 + k * (Math.PI * 2 / n), dx = Math.cos(a) * (rr + 0.3), dz = Math.sin(a) * (rr + 0.3);
        const q = { x0: r.cx + dx - 0.2, x1: r.cx + dx + 0.2, z0: r.cz + dz - 0.2, z1: r.cz + dz + 0.2 };
        if (choca(q)) continue;
        const p = puf(m.z === 'play' ? M.terciopeloNaranja : M.terciopeloCamel); p.position.set(dx, 0, dz); g.add(p); reservar(q); amplia(q);
      }
      ponerCachimba(r.cx, altoMesa, r.cz, azarA() * 6.28);
    }
    sala.add(g);
    // Halo en el suelo para resaltar la mesa elegida o su zona
    // El borde luminoso de la textura queda un poco por fuera de la mesa y sus asientos
    const hx = huella.x1 - huella.x0, hz = huella.z1 - huella.z0;
    let [hw, hd] = m.f === 'red' ? [(hx / 2 + 0.08) / 0.39, (hz / 2 + 0.08) / 0.39] : [(hx / 2 + 0.1) / 0.344, (hz / 2 + 0.1) / 0.344];
    // Que el halo no se salga de la sala
    let hcx = (huella.x0 + huella.x1) / 2, hcz = (huella.z0 + huella.z1) / 2;
    const recorta = (c, t, max) => { const a = Math.max(0, c - t / 2), b = Math.min(max, c + t / 2); return [(a + b) / 2, b - a]; };
    [hcx, hw] = recorta(hcx, hw, RW); [hcz, hd] = recorta(hcz, hd, RD);
    const halo = malla(new THREE.PlaneGeometry(hw, hd), new THREE.MeshBasicMaterial({
      map: m.f === 'red' ? texBrilloR : texBrilloC, color: 0xffb35c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    }), hcx, 0.015, hcz);
    halo.rotation.x = -Math.PI / 2;
    halo.renderOrder = 2;
    sala.add(halo);
    // Volumen invisible para hacer clic en toda la mesa con sus asientos
    const caja = malla(new THREE.BoxGeometry(hx + 0.1, m.taburete ? 1.2 : 0.8, hz + 0.1), new THREE.MeshBasicMaterial({ visible: false }), (huella.x0 + huella.x1) / 2, m.taburete ? 0.6 : 0.4, (huella.z0 + huella.z1) / 2);
    caja.userData = { mesa: m.id, zona: m.z };
    sala.add(caja);
    clicables.push(caja);
    mesas3d.set(m.id, { m, halo, centro: new THREE.Vector3((huella.x0 + huella.x1) / 2, altoMesa || 1.1, (huella.z0 + huella.z1) / 2), brillo: 0, objetivo: 0 });
  }
  // Cachimbas expuestas en la barra de shishas
  {
    const r = rect(BARRAS.find((b) => b[4] === 'shishas'));
    for (let k = 0; k < 3; k++) ponerCachimba(r.x0 + 0.15 + k * ((r.x1 - r.x0 - 0.3) / 2), 1.08, r.cz, k);
  }
  const instancias = [];
  for (const [geo, mat] of [[geoCachimba.base, M.vidrio], [geoCachimba.acero, M.acero], [geoCachimba.cazoleta, M.ceramica], [geoCachimba.manguera, M.manguera], [geoCachimba.brasa, M.brasa]]) {
    const im = new THREE.InstancedMesh(geo, mat, cachimbas.length);
    cachimbas.forEach((m4, i) => im.setMatrixAt(i, m4));
    im.castShadow = mat !== M.brasa;
    sala.add(im);
    instancias.push(im);
  }

  // ---------- Humo de cachimba (partículas suaves que suben) ----------
  const texHumo = TX.humo();
  const humos = [];
  const focosHumo = cachimbas.filter((_, i) => i % 3 === 0).slice(0, alta ? 6 : 3).map((m4) => new THREE.Vector3().setFromMatrixPosition(m4));
  for (const f of focosHumo) for (let k = 0; k < (alta ? 10 : 6); k++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: texHumo, color: 0xe8d6c4, transparent: true, opacity: 0, depthWrite: false }));
    s.userData = { f, t: k / (alta ? 10 : 6), giro: Math.random() * 6.28, v: 0.6 + Math.random() * 0.5 };
    sala.add(s);
    humos.push(s);
  }

  // ---------- Luces ----------
  escena.add(new THREE.HemisphereLight(0xffcf9e, 0x1b100a, 0.22));
  // Luz principal cenital que da las sombras de todo el mobiliario
  const principal = new THREE.SpotLight(0xffe2c2, 70, 0, 0.6, 0.9, 1.2);
  principal.position.set(RW * 0.45, 9, RD * 0.4);
  principal.target.position.set(RW / 2, 0, RD / 2);
  principal.castShadow = true;
  principal.shadow.mapSize.set(alta ? 2048 : 1024, alta ? 2048 : 1024);
  principal.shadow.bias = -0.0003;
  principal.shadow.normalBias = 0.02;
  principal.shadow.radius = 4;
  principal.shadow.camera.near = 4; principal.shadow.camera.far = 14;
  escena.add(principal, principal.target);
  // Focos de carril sobre los taburetes: dibujan círculos de luz en el suelo como en las fotos
  const focos = MESAS.filter((m) => m.taburete && m.d[1] > 700);
  focos.forEach((m, i) => {
    const [x, z] = P(m.d[0], m.d[1]);
    const f = new THREE.SpotLight(0xffd2a0, 9, 4.5, 0.3, 0.55, 1.6);
    f.position.set(x, ALTO, z - 0.3);
    f.target.position.set(x, 0, z - 0.45);
    if (alta && i % 2 === 0) { f.castShadow = true; f.shadow.mapSize.set(512, 512); f.shadow.bias = -0.0005; f.shadow.radius = 3; }
    escena.add(f, f.target);
  });

  for (const it of info) {
    if (it.m.taburete || !alta) continue;
    const f = new THREE.SpotLight(0xffc98f, alta ? 7 : 5, 4.2, 0.36, 0.7, 1.6);
    f.position.set(it.r.cx, ALTO, it.r.cz + 0.2);
    f.target.position.set(it.r.cx, 0, it.r.cz);
    escena.add(f, f.target);
  }

  // Foco que se enciende sobre la mesa elegida
  const focoMesa = new THREE.SpotLight(0xffe0b8, 0, 7, 0.3, 0.55, 1.2);
  focoMesa.position.set(RW / 2, 4.2, RD / 2);
  if (alta) { focoMesa.castShadow = true; focoMesa.shadow.mapSize.set(1024, 1024); focoMesa.shadow.bias = -0.0004; focoMesa.shadow.radius = 4; }
  escena.add(focoMesa, focoMesa.target);
  let focoObjetivo = 0;

  // ---------- Postproceso: brillo (bloom) suave en luces y brasas ----------
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(escena, camara));
  // Oclusión ambiental: sombras de contacto entre muebles, suelo y paredes (solo en equipos potentes)
  let ao = null;
  if (alta) {
    ao = new GTAOPass(escena, camara, 1, 1);
    ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.1, samples: 16 });
    ao.blendIntensity = 0.85;
    composer.addPass(ao);
  }
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.45, 0.5, 0.95);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ---------- Cámara y controles ----------
  const centro = new THREE.Vector3(RW / 2, 0.3, RD / 2);
  const controles = new OrbitControls(camara, lienzo);
  controles.target.copy(centro);
  controles.enableDamping = true;
  controles.dampingFactor = 0.08;
  controles.enablePan = false;
  controles.enableZoom = false;
  controles.rotateSpeed = 0.55;
  controles.minPolarAngle = 0.55; controles.maxPolarAngle = 1.12;
  const AZ = Math.atan2(-RW * 0.62, -RD) ; // desde la entrada, mirando hacia la barra
  controles.minAzimuthAngle = AZ - 0.75; controles.maxAzimuthAngle = AZ + 0.75;
  if (tactil) { controles.enabled = false; lienzo.style.touchAction = 'pan-y'; }

  const radio = Math.hypot(RW, RD) / 2 + 0.6;
  let distBase = 16;
  const ponerVista = (objetivo, dist, az = AZ, polar = 0.86) => {
    const s = new THREE.Spherical(dist, polar, az);
    return { obj: objetivo.clone(), pos: new THREE.Vector3().setFromSpherical(s).add(objetivo) };
  };
  let vista = ponerVista(centro, distBase);
  camara.position.copy(vista.pos);
  let viaje = null;
  const viajar = (destino) => {
    const ahora = performance.now();
    viaje = { t0: ahora, dur: pocoMovimiento ? 1 : 1300, deO: controles.target.clone(), deP: camara.position.clone(), aO: destino.obj, aP: destino.pos };
  };

  function medir() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    composer.setPixelRatio(dpr);
    if (ao) ao.setSize(w * dpr, h * dpr);
    bloom.resolution.set(w * dpr / (alta ? 1 : 2), h * dpr / (alta ? 1 : 2));
    camara.aspect = w / h;
    // Distancia para que la sala entera quepa en el encuadre
    const fovV = THREE.MathUtils.degToRad(camara.fov), fovH = 2 * Math.atan(Math.tan(fovV / 2) * camara.aspect);
    distBase = radio / Math.sin(Math.min(fovV, fovH) / 2) * (camara.aspect > 1.2 ? 0.6 : 0.78);
    camara.updateProjectionMatrix();
    if (!zonaActual) { vista = ponerVista(centro, distBase); if (!viaje) { camara.position.copy(vista.pos); controles.target.copy(centro); } }
  }

  // ---------- Capa HTML: marcadores de zona y números de mesa ----------
  const capa = document.createElement('div');
  capa.className = 'mapa3d-capa';
  contenedor.append(capa);
  const marcadores = ZONAS.map((z) => {
    const ms = info.filter((i) => i.m.z === z);
    const p = ms.reduce((a, i) => a.add(mesas3d.get(i.m.id).centro), new THREE.Vector3()).divideScalar(ms.length);
    p.y = z === 'barra' ? 1.25 : 0.85;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mapa3d-zona'; b.dataset.zona = z;
    const pax = ms.reduce((s, i) => s + i.m.pax, 0);
    b.setAttribute('aria-label', `${T.zonas[z].nombre}: ${T.resumen(ms.length, pax)}`);
    const n = document.createElement('b'); n.textContent = T.zonas[z].nombre;
    const s = document.createElement('span'); s.textContent = T.resumen(ms.length, pax);
    b.append(n, s);
    b.addEventListener('click', () => api.elegir(z));
    capa.append(b);
    return { b, p, z };
  });
  const numeros = MESAS.map((m) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mapa3d-num'; b.dataset.zona = m.z; b.dataset.mesa = m.id;
    b.textContent = m.id.replace(/^TE/, 'T');
    b.setAttribute('aria-label', `${m.taburete ? T.taburete : T.mesa} ${m.id.replace(/^TE/, '')} · ${T.hasta(m.pax)}`);
    b.tabIndex = -1;
    b.addEventListener('click', () => api.elegir(m.z, m.id));
    capa.append(b);
    const c = mesas3d.get(m.id).centro.clone(); c.y += m.taburete ? 0.05 : 0.45;
    return { b, p: c, m };
  });
  const verTodo = document.createElement('button');
  verTodo.type = 'button'; verTodo.className = 'mapa3d-todo'; verTodo.textContent = T.todaSala || '⤢';
  verTodo.addEventListener('click', () => api.elegir(null));
  contenedor.append(verTodo);
  if (!tactil && T.girar) {
    const pista = document.createElement('span');
    pista.className = 'mapa3d-pista'; pista.textContent = T.girar;
    contenedor.append(pista);
    lienzo.addEventListener('pointerdown', () => pista.classList.add('oculta'), { once: true });
  }

  const v = new THREE.Vector3();
  function colocarCapa() {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    const pon = (el, p) => {
      v.copy(p).project(camara);
      el.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(1)}px, ${((1 - v.y) / 2 * h).toFixed(1)}px)`;
      el.style.zIndex = String(1000 - Math.round(v.z * 1000));
    };
    marcadores.forEach(({ b, p }) => pon(b, p));
    // Separa en vertical los marcadores que se solapan en pantalla
    const cajas = marcadores.map((mk) => {
      v.copy(mk.p).project(camara);
      mk.w = mk.w || mk.b.offsetWidth; mk.h = mk.h || mk.b.offsetHeight;
      return { mk, x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h };
    }).sort((a, b) => b.y - a.y);
    for (let i = 0; i < cajas.length; i++) for (let j = 0; j < i; j++) {
      const a = cajas[j], c = cajas[i];
      if (Math.abs(a.x - c.x) < (a.mk.w + c.mk.w) / 2 + 6 && Math.abs(a.y - c.y) < a.mk.h + 6) c.y = a.y - a.mk.h - 6;
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
    focoObjetivo = mesa ? 1 : 0;
    if (mesa) { const c = mesas3d.get(mesa).centro; focoMesa.position.set(c.x, 4.2, c.z + 0.6); focoMesa.target.position.set(c.x, 0, c.z); }
    if (!z) { viajar(ponerVista(centro, distBase, controles.getAzimuthalAngle())); return; }
    const ms = [...mesas3d.values()].filter((o) => o.m.z === z);
    const foco = mesa ? mesas3d.get(mesa).centro.clone() : ms.reduce((a, o) => a.add(o.centro), new THREE.Vector3()).divideScalar(ms.length);
    foco.y = 0.3;
    viajar(ponerVista(foco, distBase * (mesa ? 0.5 : 0.62), THREE.MathUtils.clamp(controles.getAzimuthalAngle(), AZ - 0.5, AZ + 0.5), 0.9));
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
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !activo) { activo = true; antes = performance.now(); renderer.setAnimationLoop(cuadro); }
    else if (!e.isIntersecting && activo) { activo = false; renderer.setAnimationLoop(null); }
  }, { rootMargin: '100px' }).observe(contenedor);
  lienzo.addEventListener('webglcontextlost', (e) => { e.preventDefault(); renderer.setAnimationLoop(null); api.sinTresD(); });

  // Primer cuadro ya pintado (para que el cambio desde el mapa plano no parpadee)
  cuadro();
  return { aplicar };
}
