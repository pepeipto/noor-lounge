"""Genera las páginas legales de NOOR (aviso legal, privacidad y cookies) en la raíz de E:\\noor-lounge."""
import io, os, sys

RAIZ = sys.argv[1]
TITULAR = 'Ali Yalkharoev'
NIE = 'X9214330R'
DIRECCION = "Carrer Serrano Morales, 3, bajo, 46004 València (Valencia)"
TEL = '963 12 07 54'
EMAIL = 'info@noorloungevalencia.com'
WEB = 'www.noorloungevalencia.com'
FECHA = '22 de octubre de 2026'


def pagina(archivo, titulo, descripcion, cuerpo):
    html = f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{titulo} | NOOR КАЛЬЯН Lounge</title>
  <meta name="description" content="{descripcion}">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://{WEB}/{archivo}">
  <meta name="theme-color" content="#0a0706">
  <link rel="icon" href="favicon.ico" sizes="32x32">
  <link rel="icon" href="icon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=Manrope:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css?v=16">
</head>
<body class="pagina-legal">
  <header class="cabecera con-fondo">
    <a class="logo" href="/">NOOR<small>КАЛЬЯН LOUNGE</small></a>
    <span></span>
    <div class="acciones"><a class="boton boton-secundario" href="/">Volver a la web</a></div>
  </header>
  <main class="legal">
    <div class="contenedor">
      <span class="etiqueta">Información legal</span>
      <h1>{titulo}</h1>
      <p class="legal-fecha">Última actualización: {FECHA}</p>
{cuerpo}
      <nav class="legal-otras" aria-label="Otros textos legales">
        <a href="aviso-legal.html">Aviso legal</a> · <a href="privacidad.html">Política de privacidad</a> · <a href="cookies.html">Política de cookies</a>
      </nav>
    </div>
  </main>
  <footer>
    <div class="contenedor">
      <p class="aviso">Prohibida la venta de tabaco y alcohol a menores de 18 años. El consumo de tabaco perjudica gravemente la salud. © 2026 NOOR Lounge</p>
    </div>
  </footer>
</body>
</html>
'''
    io.open(os.path.join(RAIZ, archivo), 'w', encoding='utf-8', newline='\n').write(html)


IDENTIDAD = f'''      <ul class="legal-datos">
        <li><b>Titular:</b> {TITULAR}</li>
        <li><b>NIE:</b> {NIE}</li>
        <li><b>Nombre comercial:</b> NOOR КАЛЬЯН Lounge</li>
        <li><b>Domicilio:</b> {DIRECCION}</li>
        <li><b>Teléfono:</b> <a href="tel:+34963120754">{TEL}</a></li>
        <li><b>Correo electrónico:</b> <a href="mailto:{EMAIL}">{EMAIL}</a></li>
        <li><b>Sitio web:</b> https://{WEB}</li>
      </ul>'''

pagina('aviso-legal.html', 'Aviso legal', 'Aviso legal de NOOR КАЛЬЯН Lounge, shisha lounge en Valencia.', f'''
      <h2>1. Datos identificativos</h2>
      <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:</p>
{IDENTIDAD}

      <h2>2. Objeto</h2>
      <p>Este sitio web informa sobre el establecimiento NOOR КАЛЬЯН Lounge (shisha lounge y coctelería), su carta, horario y ubicación, y permite contactar o solicitar una reserva por teléfono, WhatsApp o a través de la plataforma de reservas de terceros enlazada.</p>

      <h2>3. Condiciones de uso</h2>
      <p>El acceso a la web es gratuito y atribuye la condición de usuario, que acepta este aviso legal. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe.</p>
      <p>Los precios, horarios y productos que se muestran son orientativos y pueden variar. La información vigente es la que se facilita en el local.</p>

      <h2>4. Menores de edad</h2>
      <p>El establecimiento ofrece productos de tabaco y bebidas alcohólicas, cuya venta y consumo está prohibida a menores de 18 años. El acceso al servicio de cachimbas y a la barra está reservado a mayores de edad. El consumo de tabaco perjudica gravemente la salud.</p>

      <h2>5. Propiedad intelectual e industrial</h2>
      <p>Los textos, fotografías, logotipos, diseño y código de esta web pertenecen a su titular o se utilizan con autorización de sus autores. Queda prohibida su reproducción, distribución o transformación sin autorización expresa, salvo para uso personal y privado.</p>

      <h2>6. Enlaces a terceros</h2>
      <p>La web contiene enlaces a servicios de terceros (WhatsApp, Instagram, Google Maps y la plataforma de reservas Scennio). El titular no se responsabiliza de los contenidos ni de las políticas de privacidad de esos sitios, que se rigen por sus propias condiciones.</p>

      <h2>7. Asistente automático</h2>
      <p>El asistente de la web ofrece respuestas automáticas a partir de la información del establecimiento. Puede contener errores; para reservas y consultas importantes, contacta por teléfono o WhatsApp.</p>

      <h2>8. Responsabilidad</h2>
      <p>El titular no garantiza la ausencia de interrupciones o errores en el acceso a la web y no se hace responsable de los daños que pudieran derivarse de un uso indebido de la misma.</p>

      <h2>9. Legislación aplicable</h2>
      <p>Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios.</p>
''')

pagina('privacidad.html', 'Política de privacidad', 'Política de privacidad de NOOR КАЛЬЯН Lounge.', f'''
      <h2>1. Responsable del tratamiento</h2>
{IDENTIDAD}

      <h2>2. Qué datos tratamos</h2>
      <p>Esta web no tiene formularios ni crea cuentas de usuario. Solo tratamos los datos que tú nos facilitas cuando te pones en contacto con nosotros:</p>
      <ul>
        <li><b>WhatsApp, teléfono o correo:</b> tu nombre, número de teléfono o email y lo que nos cuentes en tu consulta.</li>
        <li><b>Reservas online:</b> se hacen en la plataforma Scennio, que es el sistema de mesas del local. Allí facilitas tu nombre, teléfono, día, hora y número de personas; Scennio los trata como encargado del tratamiento para gestionar tu reserva.</li>
        <li><b>Asistente:</b> funciona dentro de tu navegador con la información del local. Tus preguntas no se envían ni se guardan en ningún servidor.</li>
      </ul>

      <h2>3. Para qué los usamos y base legal</h2>
      <ul>
        <li>Responder a tus consultas y gestionar tus reservas: aplicación de medidas precontractuales a petición tuya y tu consentimiento (artículo 6.1.b y 6.1.a del Reglamento General de Protección de Datos, RGPD).</li>
      </ul>
      <p>No usamos tus datos para enviarte publicidad ni para elaborar perfiles.</p>

      <h2>4. Cuánto tiempo los conservamos</h2>
      <p>Durante el tiempo necesario para atender tu consulta o reserva y, después, durante los plazos legales que puedan corresponder.</p>

      <h2>5. Destinatarios</h2>
      <p>No cedemos tus datos a terceros salvo obligación legal. Los mensajes de WhatsApp los trata también WhatsApp (Meta), y las reservas online las gestiona Scennio, cada uno según su propia política de privacidad. La web está alojada en GitHub Pages (GitHub, Inc.), que puede registrar datos técnicos de conexión como la dirección IP por motivos de seguridad.</p>

      <h2>6. Tus derechos</h2>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a <a href="mailto:{EMAIL}">{EMAIL}</a>, por correo postal a la dirección indicada arriba o en el propio local, acompañando una copia de tu documento de identidad. Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
''')

pagina('cookies.html', 'Política de cookies', 'Política de cookies de NOOR КАЛЬЯН Lounge.', '''
      <h2>1. Qué son las cookies</h2>
      <p>Las cookies son pequeños archivos que algunas webs guardan en tu dispositivo para recordar información sobre tu visita.</p>

      <h2>2. Cookies de esta web</h2>
      <p>Esta web <b>no instala cookies propias</b> ni utiliza herramientas de analítica o publicidad. Por eso no te mostramos un aviso de cookies al entrar.</p>

      <h2>3. Servicios de terceros</h2>
      <ul>
        <li><b>Google Maps:</b> el mapa de la sección «Visítanos» no se carga hasta que pulsas «Ver mapa interactivo». A partir de ese momento, Google puede instalar sus propias cookies. Más información en la política de privacidad de Google.</li>
        <li><b>Google Fonts:</b> las tipografías de la web se cargan desde los servidores de Google, que recibe datos técnicos de conexión como tu dirección IP. No instala cookies.</li>
        <li><b>Enlaces externos:</b> WhatsApp, Instagram y Scennio aplican sus propias cookies cuando visitas sus sitios desde nuestros enlaces.</li>
      </ul>

      <h2>4. Cómo gestionar las cookies</h2>
      <p>Puedes bloquear o eliminar las cookies desde la configuración de tu navegador (Chrome, Safari, Firefox, Edge…). Si no quieres que Google instale cookies, basta con no abrir el mapa interactivo.</p>
''')
print('3 páginas legales creadas')
