// Texturas procedurales (canvas) para la escena 3D: azulejo cobre, baldosa, madera con relieve diagonal,
// mármol marrón, columna perforada, brillos y humo. Sin descargas: todo se dibuja al cargar.
import * as THREE from 'three';

const lienzo = (w, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const azar = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

// Ruido de valor suave en 2D (repetible en el tamaño dado)
function ruido(tam, celdas, semilla) {
  const r = azar(semilla), n = celdas, g = new Float32Array(n * n).map(() => r());
  return (x, y) => {
    const fx = (x / tam) * n, fy = (y / tam) * n, x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const v = (i, j) => g[((j % n + n) % n) * n + ((i % n + n) % n)];
    const a = v(x0, y0) + (v(x0 + 1, y0) - v(x0, y0)) * sx, b = v(x0, y0 + 1) + (v(x0 + 1, y0 + 1) - v(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
}
const fbm = (tam, semilla, base = 4, oct = 4) => {
  const capas = Array.from({ length: oct }, (_, i) => ruido(tam, base << i, semilla + i * 31));
  return (x, y) => capas.reduce((s, f, i) => s + f(x, y) / (1 << i), 0) / (2 - 1 / (1 << (oct - 1)));
};

// Normal map a partir de un mapa de alturas
function normales(alt, w, h, fuerza) {
  const c = lienzo(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    const dx = (alt[y * w + ((x + 1) % w)] - alt[y * w + ((x - 1 + w) % w)]) * fuerza;
    const dy = (alt[((y + 1) % h) * w + x] - alt[((y - 1 + h) % h) * w + x]) * fuerza;
    const l = Math.hypot(dx, dy, 1);
    img.data[i * 4] = (-dx / l * 0.5 + 0.5) * 255;
    img.data[i * 4 + 1] = (dy / l * 0.5 + 0.5) * 255;
    img.data[i * 4 + 2] = (1 / l * 0.5 + 0.5) * 255;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function aTextura(c, { color = false, rep = [1, 1], aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...rep);
  t.anisotropy = aniso;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Genera color + rugosidad + normal desde una función por píxel que devuelve [r,g,b,rugosidad,altura]
function material(tam, fn, fuerza) {
  const col = lienzo(tam), rug = lienzo(tam);
  const cc = col.getContext('2d'), rc = rug.getContext('2d');
  const ic = cc.createImageData(tam, tam), ir = rc.createImageData(tam, tam);
  const alt = new Float32Array(tam * tam);
  for (let y = 0; y < tam; y++) for (let x = 0; x < tam; x++) {
    const [r, g, b, ro, h] = fn(x, y), i = (y * tam + x) * 4;
    ic.data[i] = r; ic.data[i + 1] = g; ic.data[i + 2] = b; ic.data[i + 3] = 255;
    ir.data[i] = ir.data[i + 1] = ir.data[i + 2] = ro * 255; ir.data[i + 3] = 255;
    alt[y * tam + x] = h;
  }
  cc.putImageData(ic, 0, 0); rc.putImageData(ir, 0, 0);
  return { col, rug, nor: normales(alt, tam, tam, fuerza) };
}

// Azulejo vertical esmaltado (7,5 × 30 cm). La textura cubre 1,2 × 1,2 m: 16 columnas × 4 filas.
export function azulejo(tam = 1024) {
  const cols = 16, filas = 4, aw = tam / cols, ah = tam / filas, junta = tam / 340;
  const r = azar(7), tonos = Array.from({ length: cols * filas }, () => ({
    h: 0.045 + r() * 0.03, s: 0.62 + r() * 0.2, l: 0.27 + r() * 0.17, f: r() * 6.28, f2: r() * 6.28, k: 0.6 + r() * 0.8,
  }));
  const n = fbm(tam, 3, 6, 4);
  const hsl = new THREE.Color();
  return material(tam, (x, y) => {
    const c = Math.floor(x / aw), f = Math.floor(y / ah), lx = x - c * aw, ly = y - f * ah;
    const borde = Math.min(lx, aw - lx, ly, ah - ly);
    if (borde < junta) return [34, 20, 14, 0.92, 0];
    const t = tonos[f * cols + c];
    // Esmalte irregular: ondas que recuerdan al vidriado hecho a mano
    const onda = Math.sin(ly / ah * 9 + t.f + Math.sin(lx / aw * 4 + t.f2) * 1.6) * 0.5 + 0.5;
    const v = n(x, y);
    const luz = t.l * (0.72 + onda * 0.38 * t.k + v * 0.25) * (1.08 - ly / ah * 0.25);
    hsl.setHSL(t.h + v * 0.012, t.s, Math.min(luz, 0.62));
    const bisel = Math.min(1, (borde - junta) / (junta * 2.2));
    return [hsl.r * 255, hsl.g * 255, hsl.b * 255, 0.12 + (1 - onda) * 0.16 + v * 0.08, bisel * 0.8 + onda * 0.35 * t.k + v * 0.2];
  }, 2.4);
}

// Baldosa gris oscura mate de 60 × 60 cm. La textura cubre 2 × 2 baldosas.
export function baldosa(tam = 1024) {
  const n = fbm(tam, 11, 8, 5), lado = tam / 2, junta = tam / 600, r = azar(5), tono = [0.9 + r() * 0.2, 0.9 + r() * 0.2, 0.9 + r() * 0.2, 0.9 + r() * 0.2];
  return material(tam, (x, y) => {
    const lx = x % lado, ly = y % lado, borde = Math.min(lx, lado - lx, ly, lado - ly);
    if (borde < junta) return [20, 19, 18, 0.95, 0];
    const t = tono[Math.floor(y / lado) * 2 + Math.floor(x / lado)], v = n(x, y);
    const g = (74 + v * 26) * t;
    return [g * 1.04, g, g * 0.95, 0.42 + v * 0.3, 1 + v * 0.15];
  }, 1.6);
}

// Paneles de madera oscura con ranuras diagonales que cambian de sentido (como los del local)
export function madera(tam = 1024, tono = [70, 42, 26]) {
  const n = fbm(tam, 21, 4, 4), panel = tam / 2, paso = tam / 90;
  return material(tam, (x, y) => {
    const px = Math.floor(x / panel), py = Math.floor(y / panel), lx = x % panel, ly = y % panel;
    const borde = Math.min(lx, panel - lx, ly, panel - ly);
    const sentido = (px + py) % 2 ? 1 : -1;
    const d = (lx + sentido * ly + tam) % paso / paso;
    const ranura = d < 0.22 ? 0 : 1, v = n(x, y), veta = Math.sin((lx + sentido * ly) * 0.05 + v * 8) * 0.5 + 0.5;
    const base = 0.75 + veta * 0.2 + v * 0.15, k = ranura ? 1 : 0.55;
    if (borde < 2) return [18, 11, 7, 0.9, 0];
    return [tono[0] * base * k, tono[1] * base * k, tono[2] * base * k, 0.55 + (1 - ranura) * 0.3, ranura * 0.7 + veta * 0.1];
  }, 3);
}

// Mármol marrón con vetas claras (encimeras de la barra)
export function marmol(tam = 512, base = [78, 44, 26], vet = [150, 110, 80]) {
  const n = fbm(tam, 41, 3, 5), m = fbm(tam, 77, 6, 4);
  return material(tam, (x, y) => {
    const t = n(x, y) * 7 + m(x, y) * 3;
    const veta = Math.pow(1 - Math.abs(Math.sin((x / tam) * 6.28 * 2 + (y / tam) * 6.28 + t)), 9);
    const fina = Math.pow(1 - Math.abs(Math.sin((x / tam) * 6.28 * 5 - (y / tam) * 6.28 * 3 + t * 1.7)), 26) * 0.6;
    const v = Math.min(1, veta + fina), b = 0.85 + m(x, y) * 0.3;
    return [(base[0] + v * vet[0]) * b, (base[1] + v * vet[1]) * b, (base[2] + v * vet[2]) * b, 0.12 + (1 - v) * 0.1, v * 0.2];
  }, 1);
}

// Columna de luz perforada: puntos brillantes sobre fondo ámbar (sirve de color y de emisión)
export function perforado() {
  const w = 256, h = 512, c = lienzo(w, h), x = c.getContext('2d');
  x.fillStyle = '#5a2a08'; x.fillRect(0, 0, w, h);
  for (let j = 0; j < 32; j++) for (let i = 0; i < 16; i++) {
    const cx = i * 16 + (j % 2) * 8 + 8, cy = j * 16 + 8, g = x.createRadialGradient(cx, cy, 0, cx, cy, 7);
    g.addColorStop(0, '#fff6dd'); g.addColorStop(0.5, '#ffc070'); g.addColorStop(1, 'rgba(255,150,50,0)');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 7, 0, 7); x.fill();
  }
  return aTextura(c, { color: true, rep: [4, 4] });
}

export function brillo(tipo = 'redondo') {
  const c = lienzo(256), x = c.getContext('2d');
  if (tipo === 'redondo') {
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,.15)');
    g.addColorStop(0.78, 'rgba(255,255,255,1)'); g.addColorStop(0.86, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  } else {
    // Rectángulo redondeado con borde luminoso (varios trazos con alfa decreciente = desenfoque)
    for (let k = 14; k >= 0; k--) {
      x.strokeStyle = `rgba(255,255,255,${(k === 0 ? 0.9 : 0.05).toFixed(2)})`;
      x.lineWidth = 4 + k * 2.2;
      x.beginPath(); x.roundRect(40, 40, 176, 176, 30); x.stroke();
    }
    x.fillStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.roundRect(44, 44, 168, 168, 28); x.fill();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function humo() {
  const tam = 128, c = lienzo(tam), x = c.getContext('2d'), n = fbm(tam, 5, 4, 4), img = x.createImageData(tam, tam);
  for (let j = 0; j < tam; j++) for (let i = 0; i < tam; i++) {
    const d = Math.hypot(i - tam / 2, j - tam / 2) / (tam / 2), a = Math.max(0, 1 - d) ** 1.6 * (0.45 + n(i, j) * 0.8);
    const k = (j * tam + i) * 4; img.data[k] = img.data[k + 1] = img.data[k + 2] = 255; img.data[k + 3] = Math.min(255, a * 255);
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// Cartel con texto (aseos, entrada)
export function cartel(texto, { ancho = 512, alto = 128, fondo = '#1a110c', color = '#f0c27f', tam = 54 } = {}) {
  const c = lienzo(ancho, alto), x = c.getContext('2d');
  x.fillStyle = fondo; x.fillRect(0, 0, ancho, alto);
  x.font = `600 ${tam}px Inter, system-ui, sans-serif`; x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle';
  if ('letterSpacing' in x) x.letterSpacing = `${tam * 0.22}px`;
  x.fillText(texto.toUpperCase(), ancho / 2, alto / 2 + 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export { aTextura };
