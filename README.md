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

## Fuentes de datos y fotos

- Fotos: ficha de Google Maps del local e Instagram @noorloungevlc. Originales en `_fotos-originales/` (fuera de git).
- Horario, valoración (4,7 / 139 opiniones) y precio medio: Google Maps. Carta y precios: scennio.com/es/noor-lounge/menu.

## Antes de publicar

- Sustituir el dominio provisional `https://www.noorlounge.es/` por el definitivo en `index.html` (canonical, og, JSON-LD), `robots.txt` y `sitemap.xml`.
- Servir con compresión (gzip/brotli) y caché larga para `img/`, `css/` y `js/` (llevan `?v=`). No subir `_fotos-originales/`.
- Dar de alta en Search Console y enlazar la web desde la ficha de Google Business Profile.

## Pendiente con el cliente

- Confirmar que el 963 12 07 54 tiene WhatsApp (es un fijo: necesita WhatsApp Business) o darnos un móvil.
- Confirmar el texto «Edición limitada · Cristal tallado» de la pieza del hero.
- Permiso para usar las fotos (también el de la persona que sale en `ritual.webp`) y logo oficial en vectorial.
- Confirmar los precios de la carta y si hay mesas al aire libre (sale en Google; el asistente ya no lo afirma).
- Dominio y textos legales (aviso legal, privacidad, cookies).
