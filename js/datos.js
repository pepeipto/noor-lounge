// Datos del local y respuestas del asistente. Fuentes: ficha de Google Maps, Instagram @noorloungevlc
// y la carta publicada en scennio.com/es/noor-lounge/menu (octubre de 2026). Revisar con el cliente.
// Versiones en otros idiomas: datos-en.js (/en/) y datos-ru.js (/ru/). Si cambia un dato, cambiarlo en los tres.
window.NOOR = {
  idioma: 'es-ES',
  whatsapp: '34963120754',
  textoWhatsApp: 'Hola NOOR, me gustaría reservar una mesa.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '', // p. ej. 'https://servidor/api/asistente' para conectar una IA real
  // Textos de la interfaz que pinta main.js (menú, estado, reserva rápida y asistente).
  textos: {
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    abiertoAhora: 'Abierto ahora · hasta las 04:00',
    abrimosHoy: 'Hoy abrimos a las 16:00',
    hoy: 'Hoy', manana: 'Mañana',
    hoyFrase: 'hoy', mananaFrase: 'mañana',
    diaFrase: (fecha) => `el ${fecha}`,
    personas: (n) => (n === 1 ? '1 persona' : `${n} personas`),
    resumen: (quien, dia, hora) => `Mesa para ${quien}, ${dia} a las ${hora}.`,
    mensajeReserva: (quien, dia, hora) => `Hola NOOR, me gustaría reservar mesa para ${quien} ${dia} a las ${hora}.`,
    tituloMapa: 'Mapa de NOOR Lounge',
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
      texto: 'Puedes reservar mesa online (de 1 a 10 personas) en scennio.com/es/noor-lounge/calendar, llamarnos al 963 12 07 54 o escribirnos por WhatsApp. Para grupos grandes o celebraciones, mejor por WhatsApp.',
      whatsapp: 'Hola NOOR, quiero reservar una mesa para __ personas el día __ a las __.',
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
      texto: 'Síguenos en Instagram @noorloungevlc y en TikTok @noorpub: ahí subimos el ambiente de cada noche.',
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
