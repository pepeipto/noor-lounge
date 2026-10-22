// Versió en valencià de datos.js (pàgina /va/), segons la normativa de l'AVL. Mateixes dades: si canvia alguna cosa, canviar-la en tots els fitxers.
window.NOOR = {
  idioma: 'ca-ES-valencia',
  whatsapp: '34963120754',
  textoWhatsApp: 'Hola NOOR, tinc una consulta.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '',
  textos: {
    abrirMenu: 'Obrir el menú',
    cerrarMenu: 'Tancar el menú',
    abiertoAhora: 'Obert ara · fins a les 04:00',
    abrimosHoy: 'Hui obrim a les 16:00',
    hoy: 'Hui', manana: 'Demà',
    hoyFrase: 'hui', mananaFrase: 'demà',
    diaFrase: (fecha) => `el ${fecha}`,
    personas: (n) => (n === 1 ? '1 persona' : `${n} persones`),
    resumen: (quien, dia, hora) => `Taula per a ${quien}, ${dia} ${hora.startsWith('01') ? 'a la' : 'a les'} ${hora}.`,
    mensajeReserva: (quien, dia, hora) => `Hola NOOR, m’agradaria reservar taula per a ${quien} ${dia} ${hora.startsWith('01') ? 'a la' : 'a les'} ${hora}.`,
    tituloMapa: 'Mapa de NOOR Lounge',
    reservarOnline: "Reservar taula en línia →",
    escribirWhatsApp: 'Escriu-nos per WhatsApp →',
    escribiendo: 'L’assistent està escrivint',
    sinRespuesta: 'Eixa pregunta preferim que te la responga l’equip directament. Escriu-nos per WhatsApp i et contestaran de seguida.',
    pregunta: (texto) => `Hola, tinc una pregunta: ${texto}`,
  },
  saludo: 'Hola, soc l’assistent de NOOR. T’ajude amb l’horari, la carta, les reserves o com arribar.',
  sugerencias: ['Quin horari teniu?', 'Preus de les shishes', 'Vull reservar', 'On esteu?'],
  respuestas: [
    {
      claves: ['horari', 'hora', 'obert', 'obriu', 'obri', 'tanca', 'tanqueu', 'hui', 'diumenge', 'dilluns', 'quan'],
      texto: 'Obrim tots els dies, de dilluns a diumenge, de 16:00 a 04:00.',
    },
    {
      claves: ['shisha', 'xixa', 'cachimba', 'hookah', 'narguil', 'sabor', 'cassoleta', 'kazan', 'preu', 'costa', 'val'],
      texto: 'Les nostres shishes:\n· Rubio 16 € · Josh 16 €\n· Fusion 17 €\n· Full Black 19 €\n· Kazan 22 €\n· Especial 25 €\n· Kazan Especial 30 €\n· Fruita 40 €\nEt recomanem el sabor en taula, segons els teus gustos.',
    },
    {
      claves: ['coctel', 'cocktail', 'mojito', 'copa', 'beure', 'beguda', 'gin', 'margarita', 'martini', 'spritz'],
      texto: 'Cocteleria des de 12 €: mojitos (clàssic, maduixa, mango, maracujà), Aperol Spritz, Margarita, Negroni, Piña colada, Whiskey Sour… i a 13 € Espresso Martini, PornStar Martini, Gin Fit o Blue Whisky. Còctel Premium 15 €.',
    },
    {
      claves: ['te', 'tes', 'chai', 'cafe', 'calent', 'infusio'],
      texto: 'Tenim tes per a compartir: chai latte, cítric amb gingebre o fruits roigs, de 8 € (0,5 l) a 14 € (1,5 l). També café amb llet (3,50 €) i tallat (2,50 €).',
    },
    {
      claves: ['cervesa', 'vi', 'cava', 'xampany', 'refresc', 'xopet', 'xupit'],
      texto: 'Cerveses des de 3,50 €, vi per copa a 5 € (blanc, rosat i negre de Rioja), refrescos a 4 €, xopets a 4 € i, per a celebrar, cava, Veuve Clicquot o Dom Pérignon.',
    },
    {
      claves: ['carta', 'menu'],
      texto: 'Pots veure la carta completa ací: scennio.com/es/noor-lounge/menu\nShishes des de 16 €, còctels des de 12 € i tes per a compartir des de 8 €.',
    },
    {
      claves: ['reserv', 'taula', 'grup', 'persones', 'aniversari', 'celebrar', 'esdeveniment', 'festa'],
      texto: "Reserva la teua taula en línia ací baix, d’1 a 10 persones: entra directament en el sistema de taules del local. Per a grups de més de 10, crida’ns al 963 12 07 54.",
      reservar: true,
    },
    {
      claves: ['on', 'adreca', 'arribar', 'ubicacio', 'carrer', 'metro', 'aparcar', 'parking', 'zona'],
      texto: 'Estem al Carrer Serrano Morales, 3, l’Eixample, 46004 València, al costat de la plaça de Cánovas. Tens el mapa en la secció Visita’ns.',
    },
    {
      claves: ['telefon', 'telefonar', 'cridar', 'contacte', 'whatsapp', 'correu', 'email'],
      texto: 'Telefona’ns al 963 12 07 54 o escriu-nos per WhatsApp: et responem al més prompte possible.',
      whatsapp: 'Hola NOOR, tinc una consulta.',
    },
    {
      claves: ['terrassa', 'fora', 'musica', 'playstation', 'ps5', 'consola', 'ambient'],
      texto: 'Bona música cada nit i, si et ve de gust, PlayStation 5 en la teua taula (40 €). Per a qualsevol altra cosa, escriu-nos per WhatsApp.',
    },
    {
      claves: ['menjar', 'sopar', 'picar', 'snack'],
      texto: 'Ací manen la shisha i la cocteleria; per a picar, creïlles (3 €).',
    },
    {
      claves: ['preu mitja', 'car', 'barat', 'per persona', 'gastar'],
      texto: 'Entre 10 i 20 € per persona, segons el que demanes.',
    },
    {
      claves: ['instagram', 'tiktok', 'xarxes', 'insta', 'seguir', 'video', 'fotos'],
      texto: 'Segueix-nos en Instagram @noorloungevlc i en TikTok @noorpub: allí pugem l’ambient de cada nit.',
    },
    {
      claves: ['hola', 'bones', 'bona nit', 'bona vesprada'],
      texto: 'Hola! Què t’agradaria saber? Horari, carta, reserves o com arribar.',
    },
    {
      claves: ['gracies', 'genial', 'perfecte'],
      texto: 'Un plaer. T’esperem a NOOR.',
    },
  ],
};
