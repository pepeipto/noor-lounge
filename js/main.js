// NOOR Kalyan Lounge — efectos de scroll, humo, ascuas, WhatsApp y asistente.
(() => {
  'use strict';
  const DATOS = window.NOOR || {};
  const T = DATOS.textos || {}; // textos de la interfaz en el idioma de la página (datos.js, datos-en.js, datos-ru.js)
  const IDIOMA = DATOS.idioma || 'es-ES';
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
  const cerrarMenu = () => {
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', T.abrirMenu);
  };
  botonMenu?.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.setAttribute('aria-label', abierto ? T.cerrarMenu : T.abrirMenu);
    if (abierto) menu.querySelector('a')?.focus();
  });
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarMenu(); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) { cerrarMenu(); botonMenu.focus(); }
  });

  // ---------- Selector de idioma: desplegable accesible (Intro/Espacio abre, flechas recorren, Escape cierra) ----------
  const idiomas = document.querySelector('.idiomas');
  const idiomasBoton = idiomas?.querySelector('.idiomas-boton');
  const idiomasLista = idiomas?.querySelector('.idiomas-lista');
  if (idiomasBoton && idiomasLista) {
    const enlaces = [...idiomasLista.querySelectorAll('a')];
    const mostrarIdiomas = (si, enfocar) => {
      idiomasLista.hidden = !si;
      idiomasBoton.setAttribute('aria-expanded', String(si));
      if (si && enfocar) (idiomasLista.querySelector('[aria-current]') || enlaces[0]).focus();
    };
    idiomasBoton.addEventListener('click', (e) => mostrarIdiomas(idiomasLista.hidden, e.detail === 0));
    idiomasBoton.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); mostrarIdiomas(true, true); }
    });
    idiomasLista.addEventListener('keydown', (e) => {
      const i = enlaces.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        enlaces[(i + (e.key === 'ArrowDown' ? 1 : -1) + enlaces.length) % enlaces.length].focus();
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        enlaces[e.key === 'Home' ? 0 : enlaces.length - 1].focus();
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        mostrarIdiomas(false);
        idiomasBoton.focus();
      }
    });
    idiomas.addEventListener('focusout', (e) => { if (!idiomas.contains(e.relatedTarget)) mostrarIdiomas(false); });
    document.addEventListener('click', (e) => { if (!idiomas.contains(e.target)) mostrarIdiomas(false); });
  }

  // ---------- Abierto ahora (hora de València): abre a las 16:00 y cierra a las 04:00 ----------
  function horaValencia() {
    const partes = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date());
    const v = (t) => Number(partes.find((x) => x.type === t)?.value || 0);
    return v('hour') + v('minute') / 60;
  }
  function pintarEstado() {
    const h = horaValencia();
    const abierto = h >= 16 || h < 4;
    const texto = abierto ? T.abiertoAhora : T.abrimosHoy;
    document.querySelectorAll('[data-abierto]').forEach((el) => {
      el.textContent = texto;
      el.classList.toggle('abierto', abierto);
    });
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);

  // ---------- Reserva rápida: día, personas y hora → mensaje de WhatsApp ----------
  const reserva = document.getElementById('reserva-rapida');
  if (reserva) {
    const enviarReserva = document.getElementById('rr-enviar');
    const resumen = document.getElementById('rr-resumen');
    const salida = document.getElementById('rr-personas');
    const fmtDia = new Intl.DateTimeFormat(IDIOMA, { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric' });
    const fmtLargo = new Intl.DateTimeFormat(IDIOMA, { timeZone: 'Europe/Madrid', ...(T.formatoDia || { weekday: 'long', day: 'numeric', month: 'long' }) });
    // Antes de las 04:00 la noche sigue siendo la de «hoy» para el local.
    const base = new Date(Date.now() - (horaValencia() < 4 ? 864e5 : 0));
    const dias = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base.getTime() + i * 864e5);
      return { corto: i === 0 ? T.hoy : i === 1 ? T.manana : fmtDia.format(d), largo: i === 0 ? T.hoyFrase : i === 1 ? T.mananaFrase : T.diaFrase(fmtLargo.format(d)) };
    });
    const horas = ['17:00', '19:00', '21:00', '23:00', '01:00'];
    let personas = 2;

    function chips(grupo, opciones) {
      const caja = reserva.querySelector(`[data-grupo="${grupo}"]`);
      opciones.forEach((o, i) => {
        const etiqueta = document.createElement('label');
        etiqueta.className = 'chip';
        const radio = document.createElement('input');
        Object.assign(radio, { type: 'radio', name: `rr-${grupo}`, value: o.largo ?? o, checked: i === (grupo === 'hora' ? 2 : 0) });
        const texto = document.createElement('span');
        texto.textContent = o.corto ?? o;
        etiqueta.append(radio, texto);
        caja.append(etiqueta);
      });
    }
    chips('dia', dias);
    chips('hora', horas);

    function actualizarReserva() {
      const dia = reserva.querySelector('input[name="rr-dia"]:checked').value;
      const hora = reserva.querySelector('input[name="rr-hora"]:checked').value;
      salida.textContent = personas;
      const quien = T.personas(personas);
      resumen.textContent = T.resumen(quien, dia, hora);
      enviarReserva.href = enlaceWhatsApp(T.mensajeReserva(quien, dia, hora));
    }
    reserva.addEventListener('change', actualizarReserva);
    reserva.querySelectorAll('[data-paso]').forEach((b) => b.addEventListener('click', () => {
      personas = Math.min(20, Math.max(1, personas + Number(b.dataset.paso)));
      actualizarReserva();
    }));
    reserva.addEventListener('submit', (e) => e.preventDefault());
    actualizarReserva();
  }

  // ---------- Mapa: el iframe de Google solo se carga al pulsar ----------
  document.querySelector('[data-mapa]')?.addEventListener('click', (e) => {
    const boton = e.currentTarget, marco = document.createElement('iframe');
    Object.assign(marco, { title: T.tituloMapa, src: boton.dataset.mapa, referrerPolicy: 'no-referrer-when-downgrade' });
    boton.replaceWith(marco);
    marco.focus();
  });

  // ---------- Scroll: cabecera con el arco, progreso y parallax ----------
  const hero = document.querySelector('.hero');
  const fijo = hero?.querySelector('.hero-fijo');
  const arcoEl = document.querySelector('.arco');
  const filo = document.querySelector('.arco-filo');
  const fotoArco = document.querySelector('.arco-foto');
  const finalEl = document.querySelector('.hero-final');
  const cabecera = document.querySelector('.cabecera');
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  const ritual = document.querySelector('.ritual');
  // rect: zona del arco en píxeles CSS (x, y, ancho, alto) sin el recorte de la entrada; la usa el shader.
  const escena = { abre: 0, brasa: 0, intro: sinMovimiento ? 1 : 0, inicio: 0, rect: [0, 0, 1, 1], mx: 0, my: 0 };
  let objetivo = 0, suave = 0, ultimoY = scrollY, ratonX = 0, ratonY = 0;
  const lerp = (a, b, t) => a + (b - a) * t;
  const suaviza = (x) => x * x * (3 - 2 * x);
  const limita = (x) => Math.min(Math.max(x, 0), 1);

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    ratonX = e.clientX / innerWidth * 2 - 1;
    ratonY = e.clientY / innerHeight * 2 - 1;
  }, { passive: true });

  // Arco en reposo: en escritorio, centrado y alto; en móvil, más arriba para dejar sitio al texto.
  function arcoBase(vw, vh) {
    const proporcion = 853 / 1280;
    if (vw > 900) {
      const h = Math.min(vh * .74, 800), w = h * proporcion;
      return [(vw - w) / 2, (vh - h) / 2 + vh * .035, w, h];
    }
    const w = Math.min(vw * .68, vh * .5 * proporcion), h = w / proporcion;
    return [(vw - w) / 2, vh * .2, w, h];
  }

  function alHacerScroll() {
    const y = scrollY;
    const alto = document.body.scrollHeight - innerHeight;
    raiz.style.setProperty('--leido', alto > 0 ? (y / alto).toFixed(4) : 0);
    if (hero) objetivo = limita(-hero.getBoundingClientRect().top / (hero.offsetHeight - fijo.clientHeight));
    cabecera.classList.toggle('con-fondo', y > 40);
    cabecera.classList.toggle('oculta', y > ultimoY && y > innerHeight * .8 && !menu.classList.contains('abierto'));
    ultimoY = y;
  }
  addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  function bucle(ahora) {
    suave += (objetivo - suave) * (sinMovimiento ? 1 : .12);
    if (hero && hero.getBoundingClientRect().bottom <= 0) raiz.classList.remove('en-cabecera');
    if (hero && hero.getBoundingClientRect().bottom > 0) {
      if (!escena.inicio && raiz.classList.contains('cargado')) escena.inicio = ahora + 100;
      if (escena.inicio && !sinMovimiento) escena.intro = suaviza(limita((ahora - escena.inicio) / 1000));
      escena.mx += (ratonX - escena.mx) * .05;
      escena.my += (ratonY - escena.my) * .05;
      // El arco se abre a pantalla completa en el primer 80 % del recorrido; la frase final llega al final.
      const e = suaviza(limita(suave / .8));
      escena.abre = e;
      escena.brasa = .45 + .55 * e;
      const vw = fijo.clientWidth, vh = fijo.clientHeight;
      const [bx, by, bw, bh] = arcoBase(vw, vh);
      const x = lerp(bx, 0, e), y = lerp(by, 0, e), w = lerp(bw, vw, e), h = lerp(bh, vh, e);
      escena.rect = [x, y, w, h];
      const arriba = y + h - h * escena.intro; // la entrada descubre el arco de abajo arriba
      const rt = lerp(bw / 2, 0, e), rb = lerp(18, 0, e);
      arcoEl.style.clipPath = `inset(${arriba}px ${vw - x - w}px ${vh - y - h}px ${x}px round ${rt}px ${rt}px ${rb}px ${rb}px)`;
      if (!arcoEl.classList.contains('gl-listo')) Object.assign(fotoArco.style, {
        left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, objectFit: 'cover', objectPosition: '50% 40%',
      });
      const m = 14;
      Object.assign(filo.style, {
        left: `${bx - m}px`, top: `${by - m}px`, width: `${bw + 2 * m}px`, height: `${bh + 2 * m}px`,
        borderRadius: `${bw / 2 + m}px ${bw / 2 + m}px ${18 + m / 2}px ${18 + m / 2}px`,
        opacity: (escena.intro * (1 - e * 3)).toFixed(3),
      });
      const fin = limita((suave - .72) / .23);
      hero.style.setProperty('--abre', e.toFixed(4));
      hero.style.setProperty('--final', fin.toFixed(4));
      hero.style.setProperty('--mx', escena.mx.toFixed(4));
      hero.style.setProperty('--my', escena.my.toFixed(4));
      hero.style.setProperty('--medio', `${bw / 2}px`);
      hero.style.setProperty('--arco-arriba', `${by}px`);
      hero.style.setProperty('--arco-abajo', `${by + bh}px`);
      finalEl.classList.toggle('activo', fin > .5);
      raiz.classList.toggle('en-cabecera', suave < .55);
    }
    if (ritual) {
      const r = ritual.getBoundingClientRect();
      ritual.style.setProperty('--ritual', limita(-r.top / Math.max(r.height - innerHeight, 1)).toFixed(4));
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
    const movil = innerWidth < 900;
    const escala = movil ? .35 : .5; // el humo es borroso: se pinta a baja resolución y así va fluido en móvil
    function ajustar() {
      lienzo.width = Math.ceil(innerWidth * escala);
      lienzo.height = Math.ceil(innerHeight * escala);
      gl.viewport(0, 0, lienzo.width, lienzo.height);
    }
    addEventListener('resize', ajustar);
    ajustar();
    let sScroll = 0, ultimo = 0;
    (function pintar(ms) {
      requestAnimationFrame(pintar);
      if (document.hidden || (movil && ms - ultimo < 33)) return;
      ultimo = ms;
      sScroll += (scrollY / innerHeight - sScroll) * .1;
      gl.uniform2f(uR, lienzo.width, lienzo.height);
      gl.uniform1f(uT, ms / 1000);
      gl.uniform1f(uS, sScroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    })(0);
  }

  // ---------- Ascuas que suben ----------
  function iniciarAscuas() {
    const lienzo = document.getElementById('ascuas');
    if (!lienzo || sinMovimiento) { lienzo?.remove(); return; }
    const ctx = lienzo.getContext('2d');
    const dpr = 1; // las ascuas son puntos de luz: no necesitan retina
    let ancho, alto;
    const chispa = document.createElement('canvas');
    chispa.width = chispa.height = 32;
    const c2 = chispa.getContext('2d'), grad = c2.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,205,140,1)');
    grad.addColorStop(.35, 'rgba(240,150,70,.5)');
    grad.addColorStop(1, 'rgba(240,120,50,0)');
    c2.fillStyle = grad;
    c2.fillRect(0, 0, 32, 32);
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
      requestAnimationFrame(pintar);
      if (document.hidden) return;
      ctx.clearRect(0, 0, ancho, alto);
      ctx.globalCompositeOperation = 'lighter';
      for (const a of ascuas) {
        a.y -= a.v; a.osc += .015; a.x += Math.sin(a.osc) * .35;
        if (a.y < -10) Object.assign(a, nueva(false));
        const brillo = (.55 + .45 * Math.sin(ms / 400 + a.osc * 3)) * a.vida * Math.min(1, a.y / (alto * .4));
        ctx.globalAlpha = Math.max(0, Math.min(1, brillo));
        ctx.drawImage(chispa, a.x - a.r * 5, a.y - a.r * 5, a.r * 10, a.r * 10);
      }
    })(0);
  }
  // ---------- La pieza: foto real animada en WebGL ----------
  // Lienzo a pantalla completa; la foto se encaja (cover) en el rectángulo del arco (escena.rect) y el clip-path
  // de .arco recorta el resto. El humo de la foto se deforma con ruido, salen volutas de la cazoleta y las brasas
  // laten. Coordenadas de la foto (0–1, y hacia abajo): brasas (.54, .215), vástago x≈.515, humo hacia (.5, .42).
  function iniciarCachimba(listo) {
    const lienzo = document.getElementById('cachimba-gl');
    const foto = new Image();
    foto.src = fotoArco.currentSrc || fotoArco.src; // misma foto que el <img>: la ruta vale también en /en/ y /ru/
    foto.decode().then(() => listo(), () => listo());
    const gl = !sinMovimiento && lienzo?.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { lienzo?.remove(); return; }
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;
      uniform sampler2D img;uniform vec2 res,centro,cubre,raton;uniform vec4 rect;uniform float t,zoom,brasa;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.07+vec2(1.7,9.2);a*=.5;}return v;}
      void main(){
        vec2 px=vec2(gl_FragCoord.x,res.y-gl_FragCoord.y);
        vec2 uv=(px-rect.xy)/rect.zw;
        vec2 iu=(uv-.5)*cubre/zoom+centro+raton*.01;
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
        col*=mix(.6,1.,smoothstep(1.15,.35,length((uv-vec2(.5,.45))*vec2(1.,.8))));
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
    const u = Object.fromEntries(['res', 'rect', 'centro', 'cubre', 'raton', 't', 'zoom', 'brasa'].map((k) => [k, gl.getUniformLocation(prog, k)]));
    const aspectoFoto = 853 / 1280;

    foto.decode().then(() => {
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, foto);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      arcoEl.classList.add('gl-listo');
      requestAnimationFrame(pintar);
    }, () => lienzo.remove());

    function pintar(ms) {
      requestAnimationFrame(pintar);
      if (document.hidden || hero.getBoundingClientRect().bottom < 0) return; // fuera de pantalla no se pinta
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.round(lienzo.clientWidth * dpr), h = Math.round(lienzo.clientHeight * dpr);
      if (lienzo.width !== w || lienzo.height !== h) { lienzo.width = w; lienzo.height = h; gl.viewport(0, 0, w, h); }
      const [rx, ry, rw, rh] = escena.rect;
      const aspecto = rw / rh;
      const cubre = aspecto > aspectoFoto ? [1, aspectoFoto / aspecto] : [aspecto / aspectoFoto, 1];
      const zoom = 1 + escena.abre * .1;
      const medio = cubre.map((c) => c / 2 / zoom);
      const cx = Math.min(Math.max(.5, medio[0]), 1 - medio[0]);
      const cy = Math.min(Math.max(.5 - escena.abre * .1, medio[1]), 1 - medio[1]);
      gl.uniform2f(u.res, w, h);
      gl.uniform4f(u.rect, rx * dpr, ry * dpr, rw * dpr, rh * dpr);
      gl.uniform2f(u.cubre, cubre[0], cubre[1]);
      gl.uniform2f(u.centro, cx, cy);
      gl.uniform2f(u.raton, escena.mx, escena.my);
      gl.uniform1f(u.zoom, zoom);
      gl.uniform1f(u.t, ms / 1000);
      gl.uniform1f(u.brasa, escena.brasa);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  // Pantalla de carga: se va cuando la foto de la pieza está lista (o a los 0,35 s como mucho).
  let cargado = false;
  const terminarCarga = () => { if (!cargado) { cargado = true; requestAnimationFrame(() => raiz.classList.add('cargado')); } };
  setTimeout(terminarCarga, 350);
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

  // Las reservas van siempre al sistema de mesas del local (Scennio); WhatsApp queda solo para consultas.
  function burbuja(rol, texto, conWhatsApp, reservar) {
    const li = document.createElement('li');
    li.className = `burbuja ${rol === 'usuario' ? 'usuario' : 'asistente-msg'}`;
    const p = document.createElement('p');
    p.textContent = texto;
    li.append(p);
    const enlace = reservar ? [DATOS.reservas, T.reservarOnline] : conWhatsApp ? [enlaceWhatsApp(conWhatsApp), T.escribirWhatsApp] : null;
    if (enlace) {
      const a = document.createElement('a');
      a.href = enlace[0];
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = enlace[1];
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
        return n + (new RegExp(`(^|[^\\p{L}])${k}${k.length <= 3 ? '($|[^\\p{L}])' : ''}`, 'u').test(t) ? 1 : 0);
      }, 0);
      if (p > puntos) { mejor = r; puntos = p; }
    }
    return mejor || {
      texto: T.sinRespuesta,
      whatsapp: T.pregunta(pregunta),
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
    pensando.setAttribute('aria-label', T.escribiendo);
    pensando.innerHTML = '<span></span><span></span><span></span>';
    lista.append(pensando);
    lista.scrollTop = lista.scrollHeight;
    const r = await responder(texto);
    pensando.remove();
    burbuja('asistente', r.texto, r.whatsapp, r.reservar);
    historial.push({ rol: 'asistente', texto: r.texto });
  }

  function abrirPanel() {
    if (!lista.children.length) burbuja('asistente', DATOS.saludo);
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
