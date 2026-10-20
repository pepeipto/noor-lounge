// Datos del local y respuestas del asistente. Fuentes: ficha de Google Maps, Instagram @noorloungevlc
// y la carta publicada en scennio.com/es/noor-lounge/menu (octubre de 2026). Revisar con el cliente.
window.NOOR = {
  whatsapp: '34963120754',
  textoWhatsApp: 'Hola NOOR, me gustaría reservar una mesa.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '', // p. ej. 'https://servidor/api/asistente' para conectar una IA real
  saludo: '¡Hola! Soy el asistente de NOOR Lounge ✦\nPregúntame por el horario, la carta de shishas, los cócteles, cómo reservar o cómo llegar.',
  sugerencias: ['¿Qué horario tenéis?', 'Precios de las shishas', 'Quiero reservar', '¿Dónde estáis?'],
  respuestas: [
    {
      claves: ['horario', 'hora', 'abierto', 'abris', 'abren', 'cierra', 'cerrais', 'hoy', 'domingo', 'lunes'],
      texto: 'Abrimos todos los días, de lunes a domingo, de 16:00 a 04:00.',
    },
    {
      claves: ['shisha', 'cachimba', 'hookah', 'kalyan', 'sabor', 'cazoleta', 'kazan', 'precio', 'cuesta', 'vale'],
      texto: 'Nuestras shishas:\n· Rubio 16 € · Josh 16 €\n· Fusion 17 €\n· Full Black 19 €\n· Kazan 22 €\n· Especial 25 €\n· Kazan Especial 30 €\n· Fruta 40 €\nEl equipo te recomienda sabores en mesa según lo que te guste.',
    },
    {
      claves: ['coctel', 'cocktail', 'mojito', 'copa', 'beber', 'bebida', 'gin', 'margarita', 'martini', 'spritz'],
      texto: 'Coctelería de autor desde 12 €: mojitos (clásico, fresa, mango, maracuyá), Aperol Spritz, Margarita, Negroni, Piña colada, Whiskey Sour… y a 13 € Espresso Martini, PornStar Martini, Gin Fit o Blue Whisky. Cóctel Premium 15 €.',
    },
    {
      claves: ['te', 'chai', 'cafe', 'caliente', 'infusion'],
      texto: 'Tenemos tés para compartir: chai latte, cítrico con jengibre y frutos rojos, desde 8 € (0,5 l) hasta 14 € (1,5 l). También café con leche (3,50 €) y cortado (2,50 €).',
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
      texto: 'Estamos en Carrer Serrano Morales, 3, L\'Eixample, 46004 València, junto a la Plaza Cánovas. Tienes el mapa más abajo en la web.',
    },
    {
      claves: ['telefono', 'llamar', 'contacto', 'whatsapp', 'email', 'correo'],
      texto: 'Llámanos al 963 12 07 54 o escríbenos por WhatsApp, te respondemos enseguida.',
      whatsapp: 'Hola NOOR, tengo una consulta.',
    },
    {
      claves: ['terraza', 'fuera', 'aire libre', 'musica', 'dj', 'bailar', 'playstation', 'ps5', 'consola', 'ambiente'],
      texto: 'Tenemos mesas al aire libre, música y buen ambiente para bailar. Y si te apetece, PlayStation 5 en tu mesa (40 €).',
    },
    {
      claves: ['comida', 'comer', 'cenar', 'picar', 'snack'],
      texto: 'NOOR es un lounge de shisha y coctelería: para picar tenemos patatas (3 €), no servimos cocina.',
    },
    {
      claves: ['precio medio', 'caro', 'barato', 'por persona', 'gastar'],
      texto: 'El gasto medio está entre 10 y 20 € por persona.',
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
      texto: '¡A ti! Te esperamos en NOOR ✦',
    },
  ],
};
