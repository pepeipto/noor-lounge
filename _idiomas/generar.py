"""Genera las 8 versiones de la web de NOOR a partir de plantilla.html (español) y de los textos de cada idioma.

Uso:  python _idiomas/generar.py
Escribe index.html (español), va/, en/, fr/, de/, it/, ru/ y ar/index.html, y sitemap.xml.
Para cambiar un texto: edítalo en plantilla.html y, si está en fuentes.txt, actualiza también esa línea
y la misma línea de cada <idioma>.txt. El script avisa si un fragmento ya no se encuentra.
"""
import io, json, os, re, sys
from urllib.parse import quote

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
BASE = 'https://www.noorloungevalencia.com/'  # dominio: si cambia, cambiarlo también en robots.txt y CNAME
FECHA = '2026-10-20'

# carpeta, lang de <html>, hreflang, og:locale, nombre propio, código, «Idioma» en ese idioma, <title>
IDIOMAS = [
    ('', 'es', 'es-ES', 'es_ES', 'Español', 'ES', 'Idioma', 'Shisha Lounge en Valencia · Cachimbas y cócteles | NOOR КАЛЬЯН Lounge'),
    ('va', 'ca-ES-valencia', 'ca', 'ca_ES', 'Valencià', 'VA', 'Idioma', 'Shisha lounge a València · Cachimbes i còctels | NOOR КАЛЬЯН Lounge'),
    ('en', 'en', 'en', 'en_GB', 'English', 'EN', 'Language', 'Shisha Lounge in Valencia · Hookah & Cocktails | NOOR КАЛЬЯН Lounge'),
    ('fr', 'fr', 'fr', 'fr_FR', 'Français', 'FR', 'Langue', 'Lounge à chicha à Valence · Chichas et cocktails | NOOR КАЛЬЯН Lounge'),
    ('de', 'de', 'de', 'de_DE', 'Deutsch', 'DE', 'Sprache', 'Shisha-Lounge in Valencia · Shishas & Cocktails | NOOR КАЛЬЯН Lounge'),
    ('it', 'it', 'it', 'it_IT', 'Italiano', 'IT', 'Lingua', 'Shisha lounge a Valencia · Narghilè e cocktail | NOOR КАЛЬЯН Lounge'),
    ('ru', 'ru', 'ru', 'ru_RU', 'Русский', 'RU', 'Язык', 'Кальянная в Валенсии · Кальяны и коктейли | NOOR КАЛЬЯН Lounge'),
    ('ar', 'ar', 'ar', 'ar_AR', 'العربية', 'AR', 'اللغة', 'صالة شيشة في فالنسيا · شيشة وكوكتيلات | NOOR КАЛЬЯН Lounge'),
]
TITULO_ES = IDIOMAS[0][7]
WA_ES = 'Hola%20NOOR%2C%20me%20gustar%C3%ADa%20reservar%20una%20mesa.'
FUENTES_ARABE = ('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Manrope:wght@400;600',
                 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Manrope:wght@400;600'
                 '&family=Noto+Naskh+Arabic:wght@400;600&family=Noto+Sans+Arabic:wght@400;600')


def leer(nombre):
    return io.open(os.path.join(AQUI, nombre), encoding='utf-8').read()


def lineas(nombre):
    """Lee un archivo «número | texto» y devuelve {número: texto}."""
    datos = {}
    for n, linea in enumerate(leer(nombre).splitlines(), 1):
        if not linea or linea.startswith('#'):
            continue
        m = re.match(r'(\d+) \| (.*)$', linea)
        if not m:
            sys.exit(f'{nombre}:{n}: línea sin formato «número | texto»')
        datos[int(m.group(1))] = m.group(2).replace('\\n', '\n').replace('\\\\', '\\')
    return datos


def ruta(desde, hacia):
    """Enlace relativo de la carpeta «desde» a la carpeta «hacia» ('' = raíz)."""
    if desde == hacia:
        return './'
    return ('../' if desde else '') + (f'{hacia}/' if hacia else '')


def selector(carpeta, etiqueta, nombre):
    flecha = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>'
    lista, menu = [], []
    for c, lang, hl, _, nom, cod, _, _ in IDIOMAS:
        actual = ' aria-current="page"' if c == carpeta else ''
        lista.append(f'          <li><a href="{ruta(carpeta, c)}" hreflang="{hl}" lang="{lang}"{actual}><b>{cod}</b>{nom}</a></li>')
        menu.append(f'<a href="{ruta(carpeta, c)}" hreflang="{hl}" lang="{lang}" aria-label="{nom}"{actual}>{cod}</a>')
    cod = next(i[5] for i in IDIOMAS if i[0] == carpeta)
    cabecera = (f'      <div class="idiomas">\n'
                f'        <button class="idiomas-boton" type="button" aria-expanded="false" aria-controls="idiomas-lista" aria-label="{etiqueta}: {nombre}">{cod}{flecha}</button>\n'
                f'        <ul class="idiomas-lista" id="idiomas-lista" hidden>\n' + '\n'.join(lista) + '\n        </ul>\n      </div>')
    en_menu = f'      <div class="menu-idiomas" role="group" aria-label="{etiqueta}">' + ''.join(menu) + '</div>'
    return cabecera, en_menu


def cambia(s, viejo, nuevo, idioma, veces=None):
    if viejo not in s:
        sys.exit(f'[{idioma or "es"}] no encontrado en la plantilla: {viejo[:90]!r}')
    if veces is not None and s.count(viejo) != veces:
        sys.exit(f'[{idioma or "es"}] se esperaban {veces} apariciones de {viejo[:60]!r}')
    return s.replace(viejo, nuevo)


def generar():
    plantilla = leer('plantilla.html')
    fuentes = lineas('fuentes.txt')
    for carpeta, lang, hl, og, nombre, cod, etiqueta, titulo in IDIOMAS:
        s = plantilla
        url = BASE + (f'{carpeta}/' if carpeta else '')
        if carpeta:
            trad = lineas(f'{carpeta}.txt')
            faltan = sorted(set(fuentes) - set(trad))
            if faltan:
                sys.exit(f'[{carpeta}] faltan traducciones: {faltan}')
            for i in sorted(fuentes):
                t = trad[i]
                if carpeta == 'fr':  # espacio fino antes de ? ! ; :
                    t = re.sub(r' ([?!;:])', ' \\1', t)
                s = cambia(s, fuentes[i], t, carpeta)
            if carpeta == 'en':  # «16 €» → «€16» en la carta
                s = re.sub(r'<b>(\d+(?:,\d+)?) €</b>', lambda m: '<b>€%s</b>' % m.group(1).replace(',', '.'), s)
                s = s.replace('<b>8 / 14 €</b>', '<b>€8 / €14</b>')
        # Cabeza: idioma, título, canonical, og y JSON-LD de la página
        direccion = ' dir="rtl"' if lang == 'ar' else ''
        s = cambia(s, '<html lang="es" class="no-js">', f'<html lang="{lang}"{direccion} class="no-js">', carpeta, 1)
        s = cambia(s, f'<title>{TITULO_ES}</title>', f'<title>{titulo}</title>', carpeta, 1)
        s = cambia(s, f'<link rel="canonical" href="{BASE}">', f'<link rel="canonical" href="{url}">', carpeta, 1)
        s = cambia(s, f'<meta property="og:url" content="{BASE}">', f'<meta property="og:url" content="{url}">', carpeta, 1)
        locales = [og] + [i[3] for i in IDIOMAS if i[3] != og]
        bloque = re.search(r'  <meta property="og:locale" content="es_ES">\n(?:  <meta property="og:locale:alternate" content="[^"]+">\n)+', s).group(0)
        s = s.replace(bloque, f'  <meta property="og:locale" content="{locales[0]}">\n' +
                      ''.join(f'  <meta property="og:locale:alternate" content="{l}">\n' for l in locales[1:]))
        s = cambia(s, f'"menu": "{BASE}#carta"', f'"menu": "{url}#carta"', carpeta, 1)
        s = cambia(s, f'"hasMenu": "{BASE}#carta"', f'"hasMenu": "{url}#carta"', carpeta, 1)
        s = cambia(s, f'{{ "@type": "WebPage", "@id": "{BASE}#pagina", "url": "{BASE}", "name": "{TITULO_ES}", "inLanguage": "es-ES",',
                   f'{{ "@type": "WebPage", "@id": "{url}#pagina", "url": "{url}", "name": "{titulo}", "inLanguage": "{lang}",', carpeta, 1)
        # Selector de idioma (cabecera y menú móvil)
        cabecera, en_menu = selector(carpeta, etiqueta, nombre)
        s = cambia(s, '<!--SELECTOR-->', cabecera, carpeta, 1)
        s = cambia(s, '<!--SELECTOR-MENU-->', en_menu, carpeta, 1)
        # Datos del asistente y WhatsApp prerrellenado (por si no carga el JS)
        datos = 'datos.js' if not carpeta else f'datos-{carpeta}.js'
        s = cambia(s, 'js/datos.js?v=', f'js/{datos}?v=', carpeta, 1)
        texto_wa = re.search(r"textoWhatsApp: '(.*?)',", io.open(os.path.join(RAIZ, 'js', datos), encoding='utf-8').read()).group(1)
        s = s.replace(WA_ES, quote(texto_wa, safe=''))
        if lang == 'ar':
            s = cambia(s, FUENTES_ARABE[0], FUENTES_ARABE[1], carpeta, 2)
            for viejo in ('<a class="logo"', '<h1 class="marca"', '<div class="cargador-logo"'):
                s = s.replace(viejo, viejo + ' dir="ltr"')
        if carpeta:
            s = re.sub(r'(?<=["\s(,])(img|css|js)/', r'../\1/', s)
            for f in ('favicon.ico', 'icon.svg', 'apple-touch-icon.png', 'site.webmanifest'):
                s = cambia(s, f'href="{f}"', f'href="../{f}"', carpeta, 1)
        s = s.replace('<!-- Dominio (', f'<!-- Página generada por _idiomas/generar.py ({lang}): no editar a mano.\n       Dominio (', 1)
        # Comprobaciones
        ld = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S).group(1)
        json.loads(ld)
        if carpeta:
            visible = re.sub(r'<script.*?</script>|<!--.*?-->|https?://\S+', '', s, flags=re.S)
            restos = [w for w in ('Reserva tu', 'Abrimos', 'Cócteles', 'Preguntas', 'Visítanos', 'Todos los días', 'Desliza', 'Galería', 'Dirección', 'Teléfono') if w in visible]
            if restos:
                print(f'  aviso [{carpeta}] posibles restos en español: {restos}')
        destino = os.path.join(RAIZ, carpeta, 'index.html') if carpeta else os.path.join(RAIZ, 'index.html')
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        io.open(destino, 'w', encoding='utf-8', newline='\n').write(s)
        print(f'{lang:15} {os.path.relpath(destino, RAIZ)}  ({len(s)} caracteres, JSON-LD válido)')
    sitemap()


def sitemap():
    alternos = '\n'.join(f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{BASE}{c + "/" if c else ""}"/>' for c, _, hl, *_ in IDIOMAS)
    alternos += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{BASE}"/>'
    imagenes = '\n'.join(f'    <image:image><image:loc>{BASE}img/{i}.webp</image:loc></image:image>'
                         for i in ('cachimba-humo', 'ritual', 'interior-1', 'fachada-1', 'cachimba-1', 'coctel-1'))
    urls = [f'  <url>\n    <loc>{BASE}{c + "/" if c else ""}</loc>\n    <lastmod>{FECHA}</lastmod>\n{alternos}\n{imagenes}\n  </url>' for c, *_ in IDIOMAS]
    contenido = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
           + '\n'.join(urls) + '\n</urlset>\n')
    import xml.dom.minidom
    xml.dom.minidom.parseString(contenido.encode('utf-8'))
    io.open(os.path.join(RAIZ, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n').write(contenido)
    print(f'sitemap.xml     {len(IDIOMAS)} URL con alternates')


if __name__ == '__main__':
    generar()
