# NOOR КАЛЬЯН Lounge — web (plantilla de demostración)

Web estática (HTML + CSS + JS, sin dependencias) para NOOR Lounge, Carrer Serrano Morales, 3, 46004 València.

## Ver en local

```bash
python -m http.server 8090
```

Y abrir http://localhost:8090

## Qué tiene

- **Cabecera**: logo partido «NO ∩ OR» alrededor de un arco dorado con la foto real de la shisha (`img/cachimba-humo.webp`), animada en WebGL (el humo se mueve, salen volutas, laten las brasas, la imagen sigue al ratón). Entra sola al cargar; con una sola pantalla de scroll el arco se abre a pantalla completa y aparece «Aquí la noche empieza con luz». Sin WebGL o con «reducir movimiento», foto fija.
- **El ritual**: la segunda foto (`img/ritual.webp`) se queda fija mientras pasan los tres pasos.
- **Redes**: Instagram @noorloungevlc y TikTok @noorpub.
- **Secciones**: el lounge, el ritual, carta con precios en HTML (indexable), galería con parallax, preguntas frecuentes, visítanos (el mapa de Google solo se carga al pulsar) y llamada a reservar.
- **SEO**: title y description con «shisha lounge en Valencia», Open Graph/Twitter con `img/og-noor.jpg` (1200×630), JSON-LD (BarOrPub + WebSite + FAQPage, sin aggregateRating propio), `robots.txt`, `sitemap.xml`, iconos y `site.webmanifest`.
- **WhatsApp**: botón flotante y botones de reserva a `wa.me/34963120754` con mensaje prerrellenado.
- **Asistente**: chat flotante que responde con los datos del local (`js/datos.js`). Para conectar una IA real, poner la URL de un servidor en `asistenteApi` (recibe `{ mensajes }` y devuelve `{ respuesta }`).

## Idiomas

Ocho versiones: español (raíz), valenciano (`va/`), inglés (`en/`), francés (`fr/`), alemán (`de/`), italiano (`it/`), ruso (`ru/`) y árabe (`ar/`, de derecha a izquierda). Cada una lleva su canonical, `hreflang` hacia las ocho (más `x-default`), `og:locale`, JSON-LD y asistente propio (`js/datos-xx.js`); el selector de idioma está en la cabecera y, en móvil, dentro del menú.

Las páginas **no se editan a mano**: se generan con

```bash
python _idiomas/generar.py
```

a partir de `_idiomas/plantilla.html` (español) y de los textos de `_idiomas/<idioma>.txt` (una línea por texto, con el número de `_idiomas/fuentes.txt`). El script también rehace `sitemap.xml` y avisa si un fragmento ya no se encuentra. Si cambia un precio o un dato, cambiarlo en la plantilla, en `fuentes.txt`, en cada `<idioma>.txt` y en los `js/datos*.js`.

## Fuentes de datos y fotos

- Fotos: ficha de Google Maps del local e Instagram @noorloungevlc. Originales en `_fotos-originales/` (fuera de git).
- Horario, valoración (4,7 / 139 opiniones) y precio medio: Google Maps. Carta y precios: scennio.com/es/noor-lounge/menu.

## Publicación

- Hosting: GitHub Pages del repositorio `pepeipto/noor-lounge` (rama `main`, carpeta raíz). Cada push a `main` publica.
- Dominio: `www.noorloungevalencia.com` (lo registra Carlos y se factura al cliente).
  1. Comprar el dominio en el registrador.
  2. DNS en el registrador:
     - `CNAME` `www` → `pepeipto.github.io`
     - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  3. Crear el archivo `CNAME` con `www.noorloungevalencia.com`, hacer push, y activar «Enforce HTTPS» en Settings → Pages cuando GitHub emita el certificado.
- Si el dominio cambia: `BASE` en `_idiomas/generar.py`, el comentario de `_idiomas/plantilla.html`, `robots.txt` y `CNAME`; después `python _idiomas/generar.py`.
- Después: Search Console (enviar `sitemap.xml`) y enlazar la web desde la ficha de Google Business Profile.

## Pendiente con el cliente

- Confirmar que el 963 12 07 54 tiene WhatsApp (es un fijo: necesita WhatsApp Business) o darnos un móvil.
- Confirmar el texto «Edición limitada · Cristal tallado» de la pieza del hero.
- Permiso para usar las fotos (también el de la persona que sale en `ritual.webp`) y logo oficial en vectorial.
- Confirmar los precios de la carta y si hay mesas al aire libre (sale en Google; el asistente ya no lo afirma).
- Dominio y textos legales (aviso legal, privacidad, cookies).
- Que un nativo revise las traducciones (sobre todo árabe y ruso). La carta completa y la reserva de Scennio solo existen en español.
