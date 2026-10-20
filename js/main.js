// NOOR Kalyan Lounge — efectos de scroll, humo, ascuas, WhatsApp y asistente.
(() => {
  'use strict';
  const DATOS = window.NOOR || {};
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raiz = document.documentElement;

  // ---------- Enlaces de WhatsApp ----------
  const enlaceWhatsApp = (texto) =>
    `https://wa.me/${DATOS.whatsapp}?text=${encodeURIComponent(texto || DATOS.textoWhatsApp || '')}`;
  document.querySelectorAll('[data-whatsapp]').forEach((a) => {
    a.href = enlaceWhatsApp(a.dataset.whatsapp || undefined);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  const globo = document.querySelector('.whatsapp-globo');
  if (globo) setTimeout(() => globo.classList.add('visible'), 4000);
  if (globo) setTimeout(() => globo.classList.remove('visible'), 12000);

  // ---------- Titulares que entran palabra a palabra ----------
  document.querySelectorAll('[data-palabras]').forEach((el) => {
    const palabras = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    palabras.forEach((p, i) => {
      const caja = document.createElement('span');
      caja.className = 'palabra';
      const dentro = document.createElement('span');
      dentro.style.setProperty('--i', i);
      dentro.textContent = p;
      caja.append(dentro);
      el.append(caja, i < palabras.length - 1 ? ' ' : '');
    });
  });

  // ---------- Apariciones al entrar en pantalla ----------
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('dentro'); observador.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.aparece').forEach((el) => observador.observe(el));

  // ---------- Menú móvil ----------
  const botonMenu = document.querySelector('.boton-menu');
  const menu = document.querySelector('.menu');
  botonMenu?.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
  });
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) menu.classList.remove('abierto'); });

  // ---------- Scroll: hero pegado, cabecera, progreso y parallax ----------
  const hero = document.querySelector('.hero');
  const fotosHero = [...document.querySelectorAll('.hero-foto')];
  const frases = [...document.querySelectorAll('.hero-frase')];
  const cabecera = document.querySelector('.cabecera');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const ritual = document.querySelector('.ritual');
  const escena = { abre: 0, brasa: 0 };
  let objetivo = 0, suave = 0, ultimoY = scrollY;

  function alHacerScroll() {
    const y = scrollY;
    const alto = document.body.scrollHeight - innerHeight;
    raiz.style.setProperty('--leido', alto > 0 ? (y / alto).toFixed(4) : 0);
    if (hero) {
      const r = hero.getBoundingClientRect();
      objetivo = Math.min(Math.max(-r.top / (hero.offsetHeight - innerHeight), 0), 1);
    }
    cabecera.classList.toggle('con-fondo', y > 40);
    cabecera.classList.toggle('oculta', y > ultimoY && y > innerHeight * .8 && !menu.classList.contains('abierto'));
    ultimoY = y;
  }
  addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  function bucle() {
    suave += (objetivo - suave) * (sinMovimiento ? 1 : .1);
    if (hero) {
      hero.style.setProperty('--p', suave.toFixed(4));
      hero.style.setProperty('--intro', Math.max(0, 1 - suave / .16).toFixed(3));
      // La pieza: el arco pasa del primer plano del humo a la shisha entera, se avivan las brasas y aparece la placa.
      const tramo = (a, b) => Math.min(Math.max((suave - a) / (b - a), 0), 1);
      const x = tramo(.02, .7);
      const abre = x * x * (3 - 2 * x);
      escena.abre = abre;
      escena.brasa = tramo(.1, .65);
      hero.style.setProperty('--abre', abre.toFixed(4));
      hero.style.setProperty('--brasa', escena.brasa.toFixed(4));
      hero.style.setProperty('--placa', tramo(.78, .9).toFixed(4));
      // Tramos del recorrido: cada frase y cada foto de fondo tiene el suyo.
      frases.forEach((f) => {
        const [a, b] = f.dataset.tramo.split(',').map(Number);
        f.classList.toggle('activa', suave >= a && suave < b);
      });
      fotosHero.forEach((f) => {
        if (!f.dataset.desde) return;
        f.classList.toggle('visible', suave >= Number(f.dataset.desde));
      });
    }
    if (ritual) {
      const r = ritual.getBoundingClientRect();
      ritual.style.setProperty('--ritual', Math.min(Math.max(-r.top / Math.max(r.height - innerHeight, 1), 0), 1).toFixed(4));
    }
    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const centro = r.top + r.height / 2 - innerHeight / 2;
      el.style.setProperty('--desplaza', (centro * -.12 * Number(el.dataset.parallax || 1)).toFixed(1));
    }
    requestAnimationFrame(bucle);
  }
  requestAnimationFrame(bucle);

  // ---------- Humo: shader WebGL a pantalla completa ----------
  function iniciarHumo() {
    const lienzo = document.getElementById('humo');
    const gl = lienzo?.getContext('webgl', { premultipliedAlpha: false, antialias: false });
    if (!gl || sinMovimiento) { lienzo?.remove(); return; }
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision mediump float;uniform vec2 r;uniform float t;uniform float s;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){vec2 uv=gl_FragCoord.xy/r.y;float T=t*.045;
        uv.y-=s*.35;
        vec2 q=vec2(fbm(uv*1.6+vec2(0.,-T*2.)),fbm(uv*1.6+vec2(5.2,1.3-T*1.6)));
        float f=fbm(uv*1.4+q*1.8+vec2(T*.6,-T*2.4));
        float m=smoothstep(.42,1.,f);
        vec3 c=mix(vec3(.10,.06,.04),vec3(.89,.62,.32),m*m)*m;
        gl_FragColor=vec4(c,m*.9);}`;
    const prog = gl.createProgram();
    for (const [tipo, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const sh = gl.createShader(tipo);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { lienzo.remove(); return; }
      gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't'), uS = gl.getUniformLocation(prog, 's');
    const escala = .5; // se pinta a media resolución: el humo es borroso y así va fluido en móvil
    function ajustar() {
      lienzo.width = Math.ceil(innerWidth * escala);
      lienzo.height = Math.ceil(innerHeight * escala);
      gl.viewport(0, 0, lienzo.width, lienzo.height);
    }
    addEventListener('resize', ajustar);
    ajustar();
    let sScroll = 0;
    (function pintar(ms) {
      sScroll += (scrollY / innerHeight - sScroll) * .06;
      gl.uniform2f(uR, lienzo.width, lienzo.height);
      gl.uniform1f(uT, ms / 1000);
      gl.uniform1f(uS, sScroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(pintar);
    })(0);
  }

  // ---------- Ascuas que suben ----------
  function iniciarAscuas() {
    const lienzo = document.getElementById('ascuas');
    if (!lienzo || sinMovimiento) { lienzo?.remove(); return; }
    const ctx = lienzo.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let ancho, alto;
    const cuantas = innerWidth < 700 ? 18 : 34;
    const nueva = (inicio) => ({
      x: Math.random() * ancho, y: inicio ? Math.random() * alto : alto + 10,
      r: Math.random() * 1.6 + .5, v: Math.random() * .45 + .15,
      osc: Math.random() * Math.PI * 2, vida: Math.random() * .6 + .4,
    });
    function ajustar() {
      ancho = innerWidth; alto = innerHeight;
      lienzo.width = ancho * dpr; lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    addEventListener('resize', ajustar);
    ajustar();
    const ascuas = Array.from({ length: cuantas }, () => nueva(true));
    (function pintar(ms) {
      ctx.clearRect(0, 0, ancho, alto);
      ctx.globalCompositeOperation = 'lighter';
      for (const a of ascuas) {
        a.y -= a.v; a.osc += .015; a.x += Math.sin(a.osc) * .35;
        if (a.y < -10) Object.assign(a, nueva(false));
        const brillo = (.55 + .45 * Math.sin(ms / 400 + a.osc * 3)) * a.vida * Math.min(1, a.y / (alto * .4));
        const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 5);
        g.addColorStop(0, `rgba(255,205,140,${brillo})`);
        g.addColorStop(.35, `rgba(240,150,70,${brillo * .5})`);
        g.addColorStop(1, 'rgba(240,120,50,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 5, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(pintar);
    })(0);
  }
  // ---------- La pieza: foto real animada en WebGL ----------
  // El humo de la foto se deforma con ruido (se mueve como humo de verdad), salen volutas nuevas
  // de la cazoleta y las brasas laten. Coordenadas de la foto (0–1, y hacia abajo): brasas en (.54, .215),
  // cazoleta y vástago en x≈.515, nube de humo alrededor de (.5, .42).
  function iniciarCachimba(listo) {
    const arco = document.querySelector('.arco');
    const lienzo = document.getElementById('cachimba-gl');
    const foto = new Image();
    foto.src = 'img/cachimba-humo.webp';
    foto.decode().then(() => listo(), () => listo());
    const gl = !sinMovimiento && lienzo?.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { lienzo?.remove(); return; }
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;
      uniform sampler2D img;uniform vec2 res,centro,cubre;uniform float t,zoom,brasa,luz;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.07+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 uv=gl_FragCoord.xy/res;uv.y=1.-uv.y;
        vec2 iu=(uv-.5)*cubre/zoom+centro;
        vec3 base=texture2D(img,iu).rgb;
        float lum=dot(base,vec3(.299,.587,.114));
        float sat=max(base.r,max(base.g,base.b))-min(base.r,min(base.g,base.b));
        float region=1.-smoothstep(.6,1.2,length((iu-vec2(.5,.42))/vec2(.40,.20)));
        float ancho=iu.y<.38?.075:.045;
        float pilar=(1.-smoothstep(ancho-.02,ancho,abs(iu.x-.515)))*step(.18,iu.y);
        float m=smoothstep(.22,.6,lum)*(1.-smoothstep(.12,.32,sat))*region*(1.-pilar);
        float T=t*.35;
        vec2 flujo=vec2(fbm(iu*7.+vec2(T*.3,-T)),fbm(iu*7.+vec2(3.1,1.7-T*1.2)))-.5;
        vec3 col=texture2D(img,iu+flujo*m*.045).rgb;
        col+=m*(fbm(iu*5.+flujo*3.+vec2(0.,-T*.6))-.45)*.22;
        vec2 q=iu-vec2(.515,.33);
        float nube=fbm(vec2(q.x*4.,q.y*5.)+vec2(-sign(q.x)*T*.5,T*.4)+flujo);
        float forma=exp(-pow(q.y/.13,2.))*smoothstep(.45,.08,abs(q.x));
        float vol=smoothstep(.45,.85,nube)*forma*(.35+.5*brasa)*(1.-pilar);
        col=mix(col,vec3(.86,.82,.78),vol*.55);
        vec2 b=(iu-vec2(.54,.215))/vec2(.05,.025);
        float parp=.75+.25*sin(t*3.1)*sin(t*1.7+1.3);
        col+=vec3(1.,.45,.12)*exp(-dot(b,b))*(.25+.6*brasa)*parp;
        col*=luz;
        col*=mix(.55,1.,smoothstep(1.2,.35,length(uv-vec2(.5,.45))));
        gl_FragColor=vec4(col,1.);
      }`;
    const prog = gl.createProgram();
    for (const [tipo, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const sh = gl.createShader(tipo);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(sh)); lienzo.remove(); return; }
      gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(['res', 'centro', 'cubre', 't', 'zoom', 'brasa', 'luz'].map((k) => [k, gl.getUniformLocation(prog, k)]));
    const aspectoFoto = 853 / 1280;

    foto.decode().then(() => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, foto);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      arco.classList.add('gl-listo');
      requestAnimationFrame(pintar);
    }, () => lienzo.remove());

    function pintar(ms) {
      requestAnimationFrame(pintar);
      if (hero.getBoundingClientRect().bottom < 0) return; // fuera de pantalla no se pinta
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(lienzo.clientWidth * dpr), h = Math.round(lienzo.clientHeight * dpr);
      if (lienzo.width !== w || lienzo.height !== h) { lienzo.width = w; lienzo.height = h; gl.viewport(0, 0, w, h); }
      const aspecto = w / h;
      const cubre = aspecto > aspectoFoto ? [1, aspectoFoto / aspecto] : [aspecto / aspectoFoto, 1];
      const zoom = 2 - escena.abre;
      const medio = cubre.map((c) => c / 2 / zoom);
      const cx = Math.min(Math.max(.5, medio[0]), 1 - medio[0]);
      const cy = Math.min(Math.max(.36 + escena.abre * .14, medio[1]), 1 - medio[1]);
      gl.uniform2f(u.res, w, h);
      gl.uniform2f(u.cubre, cubre[0], cubre[1]);
      gl.uniform2f(u.centro, cx, cy);
      gl.uniform1f(u.zoom, zoom);
      gl.uniform1f(u.t, ms / 1000);
      gl.uniform1f(u.brasa, escena.brasa);
      gl.uniform1f(u.luz, .72 + escena.abre * .33);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  // Pantalla de carga: se va cuando la foto de la pieza está lista (o a los 3 s como mucho).
  let cargado = false;
  const terminarCarga = () => { if (!cargado) { cargado = true; setTimeout(() => raiz.classList.add('cargado'), 500); } };
  setTimeout(terminarCarga, 3000);
  iniciarCachimba(terminarCarga);
  iniciarHumo();
  iniciarAscuas();

  // ---------- Asistente ----------
  // En esta demo responde con las preguntas frecuentes del local (DATOS.respuestas, en datos.js).
  // Para una IA de verdad basta con poner DATOS.asistenteApi: se le envía { mensajes } y devuelve { respuesta }.
  const abrir = document.getElementById('asistente-abrir');
  const panel = document.getElementById('asistente');
  const lista = document.getElementById('asistente-mensajes');
  const form = document.getElementById('asistente-form');
  const campo = document.getElementById('asistente-texto');
  const sugerencias = document.getElementById('asistente-sugerencias');
  if (!abrir || !panel) return;
  const historial = [];

  const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function burbuja(rol, texto, conWhatsApp) {
    const li = document.createElement('li');
    li.className = `burbuja ${rol === 'usuario' ? 'usuario' : 'asistente-msg'}`;
    const p = document.createElement('p');
    p.textContent = texto;
    li.append(p);
    if (conWhatsApp) {
      const a = document.createElement('a');
      a.href = enlaceWhatsApp(conWhatsApp);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Escribir por WhatsApp →';
      a.style.display = 'inline-block';
      a.style.marginTop = '8px';
      li.append(a);
    }
    lista.append(li);
    lista.scrollTop = lista.scrollHeight;
  }

  function respuestaLocal(pregunta) {
    const t = normalizar(pregunta);
    let mejor = null, puntos = 0;
    for (const r of DATOS.respuestas || []) {
      // Cada clave cuenta si una palabra empieza por ella («reserv» → reservar); las cortas («te») deben ser la palabra entera.
      const p = r.claves.reduce((n, c) => {
        const k = normalizar(c);
        return n + (new RegExp(`(^|[^a-z])${k}${k.length <= 3 ? '($|[^a-z])' : ''}`).test(t) ? 1 : 0);
      }, 0);
      if (p > puntos) { mejor = r; puntos = p; }
    }
    return mejor || {
      texto: 'Esa pregunta prefiero que te la responda el equipo directamente. Escríbenos por WhatsApp y te contestan enseguida.',
      whatsapp: `Hola, tengo una pregunta: ${pregunta}`,
    };
  }

  async function responder(pregunta) {
    if (DATOS.asistenteApi) {
      try {
        const r = await fetch(DATOS.asistenteApi, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ mensajes: historial.slice(-12) }),
        });
        const j = await r.json();
        if (r.ok && typeof j.respuesta === 'string') return { texto: j.respuesta };
      } catch { /* sin conexión: se usa la respuesta local */ }
    }
    await new Promise((ok) => setTimeout(ok, 650 + Math.random() * 500));
    return respuestaLocal(pregunta);
  }

  async function enviar(texto) {
    texto = texto.trim().slice(0, 500);
    if (!texto) return;
    burbuja('usuario', texto);
    historial.push({ rol: 'usuario', texto });
    const pensando = document.createElement('li');
    pensando.className = 'burbuja asistente-msg escribiendo';
    pensando.innerHTML = '<span></span><span></span><span></span>';
    lista.append(pensando);
    lista.scrollTop = lista.scrollHeight;
    const r = await responder(texto);
    pensando.remove();
    burbuja('asistente', r.texto, r.whatsapp);
    historial.push({ rol: 'asistente', texto: r.texto });
  }

  function abrirPanel() {
    if (!lista.children.length) burbuja('asistente', DATOS.saludo || '¡Hola! ¿En qué te ayudo?');
    panel.showModal ? panel.showModal() : panel.setAttribute('open', '');
    abrir.setAttribute('aria-expanded', 'true');
    campo.focus();
  }
  abrir.addEventListener('click', abrirPanel);
  document.querySelectorAll('[data-abrir-asistente]').forEach((b) => b.addEventListener('click', abrirPanel));
  document.getElementById('asistente-cerrar').addEventListener('click', () => panel.close ? panel.close() : panel.removeAttribute('open'));
  panel.addEventListener('close', () => { abrir.setAttribute('aria-expanded', 'false'); abrir.focus(); });
  panel.addEventListener('click', (e) => { if (e.target === panel) panel.close(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); const t = campo.value; campo.value = ''; enviar(t); });
  for (const s of DATOS.sugerencias || []) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = s;
    b.addEventListener('click', () => enviar(s));
    sugerencias.append(b);
  }
})();
