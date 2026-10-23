// Datos del local y respuestas del asistente. Fuentes: ficha de Google Maps, Instagram @noorloungevlc
// y la carta publicada en scennio.com/es/noor-lounge/menu (octubre de 2026). Revisar con el cliente.
// Versiones en otros idiomas: datos-en.js (/en/) y datos-ru.js (/ru/). Si cambia un dato, cambiarlo en los tres.
window.NOOR = {
  idioma: 'es-ES',
  whatsapp: '34963120754',
  textoWhatsApp: 'Hola NOOR, tengo una consulta.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '', // p. ej. 'https://servidor/api/asistente' para conectar una IA real
  // Textos de la interfaz que pinta main.js (menú, estado, reserva rápida y asistente).
  textos: {
    mapa: {
      aria: "Mapa interactivo de la sala de NOOR", entrada: "ENTRADA", aseos: "ASEOS",
      barras: { barra: "BARRA", bebida: "BARRA DE BEBIDA", shishas: "SHISHAS" },
      mesa: "Mesa", taburete: "Taburete", mesaCorta: "Mesa", tab: "Taburete",
      todaSala: "Toda la sala", girar: "Arrastra para girar la sala",
      elige: "Elige una zona", ayuda: "Toca una zona del mapa o elígela aquí para ver sus mesas.", reservar: "Reservar en esta zona", nota: "Eliges día, hora y personas en nuestro sistema de reservas; el equipo de sala te asigna la mesa según disponibilidad.",
      hasta: (n) => `hasta ${n} ${n === 1 ? 'persona' : 'personas'}`,
      resumen: (m, p) => `${m} ${m === 1 ? 'mesa' : 'mesas'} · ${p} plazas`,
      reservarMesa: (id) => `Reservar · mesa ${id}`,
      zonas: {
        terraza: { nombre: "Terraza", desc: "Dos mesas redondas junto a la entrada, para empezar la noche al aire libre." },
        play: { nombre: "Zona PlayStation", desc: "Asientos junto a la pantalla con PlayStation 5: juega mientras fumas." },
        cine: { nombre: "Pantalla 98″", desc: "Mesas frente a la pantalla grande, perfectas para partidos y grupos." },
        fondo: { nombre: "Sofás del fondo", desc: "Las mesas más amplias, entre columnas de luz y la pantalla de 75″." },
        centro: { nombre: "Centro", desc: "En el corazón de la sala, con vistas a todo el local." },
        barra: { nombre: "Barra", desc: "Taburetes frente a la barra de bebida y la de shishas: mira cómo preparamos tu cachimba." },
      },
    },
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    abiertoAhora: 'Abierto ahora · hasta las 04:00',
    abrimosHoy: 'Hoy abrimos a las 16:00',
    hoy: 'Hoy', manana: 'Mañana',
    hoyFrase: 'hoy', mananaFrase: 'mañana',
    diaFrase: (fecha) => `el ${fecha}`,
    personas: (n) => (n === 1 ? '1 persona' : `${n} personas`),
    resumen: (quien, dia, hora) => `Mesa para ${quien}, ${dia} ${hora.startsWith('01') ? 'a la' : 'a las'} ${hora}.`,
    mensajeReserva: (quien, dia, hora) => `Hola NOOR, me gustaría reservar mesa para ${quien} ${dia} ${hora.startsWith('01') ? 'a la' : 'a las'} ${hora}.`,
    tituloMapa: 'Mapa de NOOR Lounge',
    reservarOnline: "Reservar mesa online →",
    escribirWhatsApp: 'Escribir por WhatsApp →',
    escribiendo: 'El asistente está escribiendo',
    sinRespuesta: 'Esa pregunta prefiero que te la responda el equipo directamente. Escríbenos por WhatsApp y te contestan enseguida.',
    pregunta: (texto) => `Hola, tengo una pregunta: ${texto}`,
  },
  saludo: 'Hola, soy el asistente de NOOR. Te ayudo con el horario, la carta, las reservas o cómo llegar.',
  sugerencias: ['¿Qué horario tenéis?', 'Precios de las shishas', 'Quiero reservar', '¿Dónde estáis?'],
  respuestas: [
    {
      claves: ['horario', 'hora', 'abierto', 'abris', 'abren', 'cierra', 'cerrais', 'hoy', 'domingo', 'lunes'],
      texto: 'Abrimos todos los días, de lunes a domingo, de 16:00 a 04:00.',
    },
    {
      claves: ['shisha', 'cachimba', 'hookah', 'kalyan', 'sabor', 'cazoleta', 'kazan', 'precio', 'cuesta', 'vale'],
      texto: 'Nuestras shishas:\n· Rubio 16 € · Josh 16 €\n· Fusion 17 €\n· Full Black 19 €\n· Kazan 22 €\n· Especial 25 €\n· Kazan Especial 30 €\n· Fruta 40 €\nTe recomendamos el sabor en mesa, según tus gustos.',
    },
    {
      claves: ['coctel', 'cocktail', 'mojito', 'copa', 'beber', 'bebida', 'gin', 'margarita', 'martini', 'spritz'],
      texto: 'Coctelería desde 12 €: mojitos (clásico, fresa, mango, maracuyá), Aperol Spritz, Margarita, Negroni, Piña colada, Whiskey Sour… y a 13 € Espresso Martini, PornStar Martini, Gin Fit o Blue Whisky. Cóctel Premium 15 €.',
    },
    {
      claves: ['te', 'chai', 'cafe', 'caliente', 'infusion'],
      texto: 'Tenemos tés para compartir: chai latte, cítrico con jengibre o frutos rojos, de 8 € (0,5 l) a 14 € (1,5 l). También café con leche (3,50 €) y cortado (2,50 €).',
    },
    {
      claves: ['cerveza', 'vino', 'cava', 'champagne', 'champan', 'refresco', 'chupito'],
      texto: 'Cervezas desde 3,50 €, vino por copa a 5 € (blanco, rosado y tinto de Rioja), refrescos a 4 €, chupitos a 4 € y para celebrar, cava, Veuve Clicquot o Dom Pérignon.',
    },
    {
      claves: ['carta', 'menu'],
      texto: 'Puedes ver la carta completa aquí: scennio.com/es/noor-lounge/menu\nShishas desde 16 €, cócteles desde 12 € y tés para compartir desde 8 €.',
    },
    {
      claves: ['reserv', 'mesa', 'grupo', 'personas', 'cumpleanos', 'celebrar', 'evento'],
      texto: "Reserva tu mesa online aquí abajo, de 1 a 10 personas: entra directamente en el sistema de mesas del local. Para grupos de más de 10, llámanos al 963 12 07 54.",
      reservar: true,
    },
    {
      claves: ['donde', 'direccion', 'llegar', 'ubicacion', 'calle', 'metro', 'aparcar', 'parking', 'zona'],
      texto: 'Estamos en Carrer Serrano Morales, 3, L\'Eixample, 46004 València, junto a la Plaza Cánovas. Tienes el mapa en la sección Visítanos.',
    },
    {
      claves: ['telefono', 'llamar', 'contacto', 'whatsapp', 'email', 'correo'],
      texto: 'Llámanos al 963 12 07 54 o escríbenos por WhatsApp, te respondemos lo antes posible.',
      whatsapp: 'Hola NOOR, tengo una consulta.',
    },
    {
      claves: ['terraza', 'fuera', 'aire libre', 'musica', 'playstation', 'ps5', 'consola', 'ambiente'],
      texto: 'Buena música cada noche y, si te apetece, PlayStation 5 en tu mesa (40 €). Para cualquier otra cosa, escríbenos por WhatsApp.',
    },
    {
      claves: ['comida', 'comer', 'cenar', 'picar', 'snack'],
      texto: 'Aquí mandan la shisha y la coctelería; para picar, patatas (3 €).',
    },
    {
      claves: ['precio medio', 'caro', 'barato', 'por persona', 'gastar'],
      texto: 'Entre 10 y 20 € por persona, según lo que pidas.',
    },
    {
      claves: ['instagram', 'tiktok', 'redes', 'insta', 'seguir', 'video', 'fotos'],
      texto: "Síguenos en Instagram @noorloungevlc: ahí subimos el ambiente de cada noche.",
    },
    {
      claves: ['hola', 'buenas', 'hey', 'saludos'],
      texto: '¡Hola! ¿Qué te gustaría saber? Horario, carta, reservas o cómo llegar.',
    },
    {
      claves: ['gracias', 'genial', 'perfecto'],
      texto: 'Un placer. Te esperamos en NOOR.',
    },
  ],
};
