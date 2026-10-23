// Mapa isométrico interactivo de la sala de NOOR para elegir zona y reservar.
// La distribución sale del plano del TPV del local (sin nombres de clientes). Los textos vienen de
// window.NOOR.textos.mapa (js/datos*.js), así el mismo mapa sirve para los 8 idiomas.
// No muestra disponibilidad: la reserva y la asignación de mesa se hacen en Scennio.
(() => {
  'use strict';
  const SCRIPT = document.currentScript && document.currentScript.src;
  const caja = document.getElementById('mapa-sala');
  const DATOS = window.NOOR || {};
  const T = (DATOS.textos || {}).mapa;
  if (!caja || !T) return;

  // ---------- Plano (unidades del TPV, origen en la esquina de la sala) ----------
  const W = 1180, H = 840, O = [300, 160];
  const p = (x, y) => [x - O[0], y - O[1]];
  const MESAS = [
    { id: '6', f: 'rect', d: [524, 181, 203, 99], pax: 5, z: 'fondo' },
    { id: '7', f: 'rect', d: [818, 182, 97, 165], pax: 5, z: 'fondo' },
    { id: '8', f: 'rect', d: [976, 182, 66, 165], pax: 2, z: 'fondo' },
    { id: '9', f: 'rect', d: [1066, 251, 161, 98], pax: 6, z: 'fondo' },
    { id: '10', f: 'rect', d: [1274, 200, 66, 98], pax: 3, z: 'fondo' },
    { id: '11', f: 'rect', d: [1370, 193, 96, 130], pax: 6, z: 'fondo' },
    { id: '12', f: 'rect', d: [1122, 435, 97, 128], pax: 6, z: 'centro' },
    { id: '13', f: 'red', d: [1417, 523, 47], pax: 2, z: 'centro' },
    { id: '1', f: 'rect', d: [439, 705, 67, 193], pax: 4, z: 'cine' },
    { id: '3', f: 'rect', d: [695, 701, 67, 193], pax: 3, z: 'cine' },
    { id: '2', f: 'rect', d: [501, 908, 198, 63], pax: 4, z: 'cine' },
    { id: '4', f: 'red', d: [541, 612, 49], pax: 1, z: 'play' },
    { id: '5', f: 'red', d: [652, 611, 49], pax: 1, z: 'play' },
    { id: 'TE1', f: 'red', d: [371, 395, 50], pax: 3, z: 'terraza' },
    { id: 'TE2', f: 'red', d: [373, 535, 50], pax: 3, z: 'terraza' },
    ...[['T1', 885, 748], ['T2', 963, 748], ['T3', 1086, 748], ['T4', 1158, 748], ['T5', 1235, 748], ['T6', 888, 615], ['T7', 991, 615]]
      .map(([id, x, y]) => ({ id, f: 'red', d: [x, y, 30], pax: 1, z: 'barra', taburete: true })),
  ];
  const PANTALLAS = [[742, 181, 66, 200], [1153, 186, 98, 64], [1406, 344, 63, 96], [495, 472, 201, 64], [347, 598, 74, 393]];
  const COLUMNAS = [[946, 317], [1252, 318]];
  const BARRAS = [[853, 804, 66, 192, 'barra'], [938, 795, 322, 63, 'bebida'], [1329, 797, 126, 63, 'shishas']];
  const ZONAS = ['terraza', 'play', 'cine', 'fondo', 'centro', 'barra'];

  // ---------- Proyección isométrica (girada para que la entrada quede delante) ----------
  const S = 0.62, C = Math.cos(Math.PI / 6), SN = 0.5;
  const iso = (x, y, z = 0) => { const a = W - x, b = H - y; return [(a - b) * C * S, (a + b) * SN * S - z]; };
  const pts = (l) => l.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const prof = (x, y) => (W - x) + (H - y); // más grande = más cerca del espectador
  const svgNS = 'http://www.w3.org/2000/svg';
  const el = (tag, at = {}, hijos = []) => {
    const e = document.createElementNS(svgNS, tag);
    for (const [k, v] of Object.entries(at)) e.setAttribute(k, v);
    for (const h of [].concat(hijos)) e.append(h);
    return e;
  };

  // Caja (mesa, barra, pantalla) extruida: caras visibles = superior, frontal (y=fin) e izquierda (x=inicio)
  function caja3d(x, y, w, h, alto, cls) {
    const g = el('g', { class: cls });
    const [x0, y0] = p(x, y), x1 = x0 + w, y1 = y0 + h;
    const A = (xx, yy, zz) => iso(xx, yy, zz);
    // Con el giro de 180°, las caras que miran al espectador son las de x=x0 e y=y0.
    g.append(el('polygon', { class: 'lado-a', points: pts([A(x0, y0, 0), A(x1, y0, 0), A(x1, y0, alto), A(x0, y0, alto)]) }));
    g.append(el('polygon', { class: 'lado-b', points: pts([A(x0, y0, 0), A(x0, y1, 0), A(x0, y1, alto), A(x0, y0, alto)]) }));
    g.append(el('polygon', { class: 'tapa', points: pts([A(x0, y0, alto), A(x1, y0, alto), A(x1, y1, alto), A(x0, y1, alto)]) }));
    return { g, cx: x0 + w / 2, cy: y0 + h / 2, prof: prof(x0 + w / 2, y0 + h / 2) };
  }
  // Cilindro (mesa redonda, taburete, columna de luz)
  function cilindro(cx, cy, r, alto, cls) {
    const [x, y] = p(cx, cy);
    const [ax, ay] = iso(x, y, 0), [bx, by] = iso(x, y, alto);
    const rx = r * S * C * Math.SQRT2 * 0.82, ry = rx * 0.5;
    const g = el('g', { class: cls });
    g.append(el('path', { class: 'lado-a', d: `M${ax - rx},${ay} A${rx},${ry} 0 0 0 ${ax + rx},${ay} L${bx + rx},${by} A${rx},${ry} 0 0 1 ${bx - rx},${by} Z` }));
    g.append(el('ellipse', { class: 'tapa', cx: bx, cy: by, rx, ry }));
    return { g, cx: x, cy: y, prof: prof(x, y), tx: bx, ty: by };
  }

  // ---------- Construcción ----------
  const esquinas = [iso(0, 0), iso(W, 0), iso(W, H), iso(0, H)];
  const xs = esquinas.map((q) => q[0]), ys = esquinas.map((q) => q[1]);
  const M = 60, ALTO_PARED = 120;
  const vb = [Math.min(...xs) - M, Math.min(...ys) - ALTO_PARED - 90, Math.max(...xs) - Math.min(...xs) + 2 * M, Math.max(...ys) - Math.min(...ys) + ALTO_PARED + 150];
  const svg = el('svg', { viewBox: vb.map((v) => v.toFixed(0)).join(' '), class: 'mapa-svg', role: 'group', 'aria-label': T.aria });
  svg.append(el('defs', {}, [
    el('linearGradient', { id: 'm-suelo', x1: 0, y1: 0, x2: 1, y2: 1 }, [el('stop', { offset: 0, 'stop-color': '#2a1c15' }), el('stop', { offset: 1, 'stop-color': '#120c09' })]),
    el('linearGradient', { id: 'm-azulejo', x1: 0, y1: 0, x2: 0, y2: 1 }, [el('stop', { offset: 0, 'stop-color': '#a8582a' }), el('stop', { offset: 1, 'stop-color': '#4a2412' })]),
    el('linearGradient', { id: 'm-cobre', x1: 0, y1: 0, x2: 1, y2: 0 }, [el('stop', { offset: 0, 'stop-color': '#d38b4a' }), el('stop', { offset: 1, 'stop-color': '#8a4a22' })]),
    el('radialGradient', { id: 'm-luz' }, [el('stop', { offset: 0, 'stop-color': '#ffd28a', 'stop-opacity': '.55' }), el('stop', { offset: 1, 'stop-color': '#e3a24f', 'stop-opacity': '0' })]),
    el('filter', { id: 'm-brillo', x: '-50%', y: '-50%', width: '200%', height: '200%' }, [el('feGaussianBlur', { stdDeviation: 6 })]),
  ]));
  // Paredes del fondo con azulejo vertical (lado de la barra y lado derecho del plano)
  const pared = (a, b) => {
    const [ax, ay] = iso(...a, 0), [bx, by] = iso(...b, 0);
    const g = el('g', { class: 'pared' });
    g.append(el('polygon', { points: pts([[ax, ay], [bx, by], [bx, by - ALTO_PARED], [ax, ay - ALTO_PARED]]) }));
    const n = Math.round(Math.hypot(bx - ax, by - ay) / 16);
    for (let i = 1; i < n; i++) {
      const t = i / n, x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      g.append(el('line', { x1: x, y1: y, x2: x, y2: y - ALTO_PARED, class: 'junta' }));
    }
    g.append(el('line', { x1: ax, y1: ay - ALTO_PARED, x2: bx, y2: by - ALTO_PARED, class: 'remate' }));
    return g;
  };
  svg.append(pared([0, H], [W, H]), pared([W, 0], [W, H]));
  // Suelo con baldosa
  const suelo = el('g', { class: 'suelo' });
  suelo.append(el('polygon', { points: pts(esquinas) }));
  for (let x = 70; x < W; x += 70) suelo.append(el('line', { x1: iso(x, 0)[0], y1: iso(x, 0)[1], x2: iso(x, H)[0], y2: iso(x, H)[1] }));
  for (let y = 70; y < H; y += 70) suelo.append(el('line', { x1: iso(0, y)[0], y1: iso(0, y)[1], x2: iso(W, y)[0], y2: iso(W, y)[1] }));
  suelo.append(el('polygon', { class: 'borde', points: pts(esquinas) }));
  svg.append(suelo);
  // Halos de luz en el suelo
  for (const [x, y] of COLUMNAS) {
    const [cx, cy] = iso(...p(x, y));
    svg.append(el('ellipse', { cx, cy, rx: 120, ry: 60, fill: 'url(#m-luz)' }));
  }

  const objetos = [];
  // Entrada (marca en el suelo)
  {
    const [x0, y0] = p(313, 176), [x1, y1] = [x0 + 103, y0 + 135];
    const g = el('g', { class: 'entrada' });
    g.append(el('polygon', { points: pts([iso(x0, y0), iso(x1, y0), iso(x1, y1), iso(x0, y1)]) }));
    const [tx, ty] = iso(x0 + 52, y0 + 68);
    g.append(el('text', { x: tx, y: ty + 5 }, T.entrada));
    objetos.push({ g, prof: -1 });
  }
  // Aseos
  { const o = caja3d(1236, 562, 128, 128, 90, 'aseos'); const [tx, ty] = iso(o.cx, o.cy, 90); o.g.append(el('text', { x: tx, y: ty + 4 }, T.aseos)); objetos.push(o); }
  // Barras
  for (const [x, y, w, h, k] of BARRAS) {
    const o = caja3d(x, y, w, h, 62, 'barra-obj');
    const [tx, ty] = iso(o.cx, o.cy, 62);
    o.g.append(el('text', { x: tx, y: ty + 4 }, T.barras[k]));
    objetos.push(o);
  }
  // Pantallas
  for (const [x, y, w, h] of PANTALLAS) {
    // Pantalla de pie: panel fino de 8 unidades en el centro del hueco que marca el TPV
    const vertical = h > w;
    const d = vertical ? [x + w / 2 - 4, y, 8, h] : [x, y + h / 2 - 4, w, 8];
    const o = caja3d(...d, Math.min(70, Math.max(w, h) * 0.45), 'pantalla');
    objetos.push(o);
  }
  // Columnas de luz
  for (const [x, y] of COLUMNAS) {
    const o = cilindro(x, y, 22, 110, 'columna');
    o.g.prepend(el('ellipse', { cx: o.tx, cy: o.ty + 55, rx: 26, ry: 70, class: 'columna-halo', filter: 'url(#m-brillo)' }));
    objetos.push(o);
  }
  // Mesas
  const porMesa = new Map();
  for (const m of MESAS) {
    const alto = m.taburete ? 34 : 30;
    const o = m.f === 'rect' ? caja3d(...m.d, alto, 'mesa') : cilindro(m.d[0], m.d[1], m.d[2], alto, 'mesa');
    o.g.classList.add(`zona-${m.z}`);
    if (m.taburete) o.g.classList.add('taburete');
    const [tx, ty] = m.f === 'rect' ? iso(o.cx, o.cy, alto) : [o.tx, o.ty];
    o.g.append(el('text', { x: tx, y: ty + 5, class: 'num' }, m.id.replace(/^TE/, 'T')));
    const etiqueta = `${m.taburete ? T.taburete : T.mesa} ${m.id.replace(/^TE/, '')} · ${T.zonas[m.z].nombre} · ${T.hasta(m.pax)}`;
    Object.entries({ tabindex: 0, role: 'button', 'aria-label': etiqueta, 'data-mesa': m.id, 'data-zona': m.z }).forEach(([k, v]) => o.g.setAttribute(k, v));
    objetos.push(o);
    porMesa.set(m.id, { m, g: o.g });
  }
  objetos.sort((a, b) => a.prof - b.prof).forEach((o) => svg.append(o.g));

  // Marcadores de zona
  const marcadores = el('g', { class: 'marcadores' });
  for (const z of ZONAS) {
    const ms = MESAS.filter((m) => m.z === z);
    const cx = ms.reduce((s, m) => s + p(m.d[0], m.d[1])[0] + (m.f === 'rect' ? m.d[2] / 2 : 0), 0) / ms.length;
    const cy = ms.reduce((s, m) => s + p(m.d[0], m.d[1])[1] + (m.f === 'rect' ? m.d[3] / 2 : 0), 0) / ms.length;
    const [x, y] = iso(cx, cy, z === 'barra' ? 70 : 40);
    const alto = 70;
    const g = el('g', { class: 'marcador', 'data-zona': z, tabindex: 0, role: 'button', 'aria-label': `${T.zonas[z].nombre}: ${T.resumen(ms.length, ms.reduce((s, m) => s + m.pax, 0))}` });
    g.append(el('line', { x1: x, y1: y, x2: x, y2: y - alto + 26 }));
    g.append(el('circle', { cx: x, cy: y, r: 4 }));
    const texto = el('text', { x, y: y - alto, class: 'mk-nombre' }, T.zonas[z].nombre);
    const sub = el('text', { x, y: y - alto + 16, class: 'mk-sub' }, T.resumen(ms.length, ms.reduce((s, m) => s + m.pax, 0)));
    g.append(el('rect', { class: 'mk-fondo', rx: 10 }), texto, sub);
    marcadores.append(g);
  }
  svg.append(marcadores);

  // ---------- Panel lateral ----------
  const panel = document.createElement('div');
  panel.className = 'mapa-panel';
  panel.setAttribute('aria-live', 'polite');
  caja.replaceChildren(svg, panel);
  // Ajusta el fondo de cada marcador al ancho del texto (cuando ya hay fuentes)
  const ajustarMarcadores = () => marcadores.querySelectorAll('.marcador').forEach((g) => {
    const b = [...g.querySelectorAll('text')].map((t) => t.getBBox()).reduce((a, c) => ({
      x: Math.min(a.x, c.x), y: Math.min(a.y, c.y), x2: Math.max(a.x2, c.x + c.width), y2: Math.max(a.y2, c.y + c.height),
    }), { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    Object.entries({ x: b.x - 14, y: b.y - 8, width: b.x2 - b.x + 28, height: b.y2 - b.y + 16 })
      .forEach(([k, v]) => g.querySelector('.mk-fondo').setAttribute(k, v.toFixed(1)));
  });
  (document.fonts?.ready || Promise.resolve()).then(ajustarMarcadores);

  let zonaActual = null, mesaActual = null;
  function pintarPanel() {
    panel.replaceChildren();
    const h = document.createElement('h3');
    const pdesc = document.createElement('p');
    if (!zonaActual) {
      h.textContent = T.elige;
      pdesc.textContent = T.ayuda;
      panel.append(h, pdesc);
      const lista = document.createElement('div');
      lista.className = 'mapa-zonas';
      for (const z of ZONAS) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = T.zonas[z].nombre;
        b.addEventListener('click', () => elegir(z));
        lista.append(b);
      }
      panel.append(lista);
      return;
    }
    const zona = T.zonas[zonaActual];
    const ms = MESAS.filter((m) => m.z === zonaActual);
    const etq = document.createElement('span');
    etq.className = 'mapa-etq';
    etq.textContent = T.resumen(ms.length, ms.reduce((s, m) => s + m.pax, 0));
    h.textContent = zona.nombre;
    pdesc.textContent = zona.desc;
    panel.append(etq, h, pdesc);
    const chips = document.createElement('div');
    chips.className = 'mapa-mesas';
    for (const m of ms) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = m.id === mesaActual ? 'activa' : '';
      b.setAttribute('aria-pressed', String(m.id === mesaActual));
      const n = document.createElement('b');
      n.textContent = `${m.taburete ? T.tab : T.mesaCorta} ${m.id.replace(/^TE/, '')}`;
      const s = document.createElement('span');
      s.textContent = T.hasta(m.pax);
      b.append(n, s);
      b.addEventListener('click', () => elegir(zonaActual, m.id));
      chips.append(b);
    }
    panel.append(chips);
    const a = document.createElement('a');
    a.className = 'boton boton-principal';
    a.href = DATOS.reservas || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = mesaActual ? T.reservarMesa(mesaActual.replace(/^TE/, '')) : T.reservar;
    const nota = document.createElement('p');
    nota.className = 'mapa-nota';
    nota.textContent = T.nota;
    panel.append(a, nota);
  }

  function elegir(z, mesa = null) {
    zonaActual = z;
    mesaActual = mesa;
    svg.classList.toggle('con-zona', !!z);
    svg.querySelectorAll('[data-zona]').forEach((g) => g.classList.toggle('activa', g.dataset.zona === z));
    svg.querySelectorAll('[data-mesa]').forEach((g) => g.classList.toggle('elegida', g.dataset.mesa === mesa));
    pintarPanel();
    oyentes.forEach((f) => f(z, mesa));
  }
  const oyentes = [];
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('[data-mesa], .marcador');
    if (g) elegir(g.dataset.zona, g.dataset.mesa || null);
  });
  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = e.target.closest('[data-mesa], .marcador');
    if (g) { e.preventDefault(); elegir(g.dataset.zona, g.dataset.mesa || null); }
  });
  pintarPanel();

  // ---------- Versión 3D (js/mapa3d.js): solo con WebGL2 y cuando la sección se acerca a la pantalla ----------
  window.NOOR_MAPA = {
    MESAS, PANTALLAS, COLUMNAS, BARRAS, ZONAS, O, W, H, T, elegir,
    escuchar: (f) => oyentes.push(f),
    sinTresD: () => { caja.classList.remove('con-3d'); caja.querySelector('.mapa3d')?.remove(); },
  };
  const webgl2 = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
  if (!webgl2 || !SCRIPT || !('IntersectionObserver' in window)) return;
  const cargar = () => {
    const zona = document.createElement('div');
    zona.className = 'mapa3d';
    caja.prepend(zona);
    import(new URL('mapa3d.js?v=6', SCRIPT).href)
      .then((mod) => {
        caja.classList.add('con-3d');
        mod.iniciar(window.NOOR_MAPA, zona);
        if (zonaActual) oyentes.forEach((f) => f(zonaActual, mesaActual));
        requestAnimationFrame(() => zona.classList.add('lista'));
      })
      .catch((e) => { console.warn('Mapa 3D no disponible:', e); window.NOOR_MAPA.sinTresD(); });
  };
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); cargar(); } }, { rootMargin: '900px' });
  io.observe(caja);
})();
