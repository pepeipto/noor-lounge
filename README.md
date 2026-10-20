# NOOR КАЛЬЯН Lounge — web (plantilla de demostración)

Web estática (HTML + CSS + JS, sin dependencias) para NOOR Lounge, Carrer Serrano Morales, 3, 46004 València.

## Ver en local

```bash
python -m http.server 8090
```

Y abrir http://localhost:8090

## Qué tiene

- **Hero con scroll**: la foto real de la shisha (cristal tallado, `img/cachimba-humo.webp`) en un arco con filo dorado, animada en WebGL: el humo de la foto se mueve, salen volutas nuevas de la cazoleta y laten las brasas. Con el scroll pasa del primer plano del humo a la pieza entera y aparece la placa «Edición limitada». Detrás, la barra desenfocada; humo y ascuas en toda la página. Sin WebGL o con «reducir movimiento», se ve la foto fija.
- **El ritual**: la segunda foto (`img/ritual.webp`) se queda fija mientras pasan los tres pasos.
- **Redes**: Instagram @noorloungevlc y TikTok @noorpub.
- **Secciones**: el lounge, carta (shishas, coctelería, tés), galería con parallax, visítanos con mapa y llamada a reservar.
- **WhatsApp**: botón flotante y botones de reserva a `wa.me/34963120754` con mensaje prerrellenado.
- **Asistente**: chat flotante que responde con los datos del local (`js/datos.js`). Para conectar una IA real, poner la URL de un servidor en `asistenteApi` (recibe `{ mensajes }` y devuelve `{ respuesta }`).

## Fuentes de datos y fotos

- Fotos: ficha de Google Maps del local e Instagram @noorloungevlc. Originales en `_fotos-originales/` (fuera de git).
- Horario, valoración (4,7 / 139 opiniones) y precio medio: Google Maps. Carta y precios: scennio.com/es/noor-lounge/menu.

## Pendiente con el cliente

- Confirmar que el 963 12 07 54 tiene WhatsApp (es un fijo: necesita WhatsApp Business) o darnos un móvil.
- Confirmar el texto «Edición limitada · Cristal tallado» de la pieza del hero.
- Permiso para usar las fotos y logo oficial en vectorial.
- Dominio y textos legales (aviso legal, privacidad, cookies).
