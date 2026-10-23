// English version of datos.js (page /en/). Same venue data: if something changes, update all three files.
window.NOOR = {
  idioma: 'en-GB',
  whatsapp: '34963120754',
  textoWhatsApp: 'Hello NOOR, I have a question.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '', // e.g. 'https://server/api/assistant' to connect a real AI
  textos: {
    mapa: {
      aria: "Interactive map of the NOOR lounge", entrada: "ENTRANCE", aseos: "TOILETS",
      barras: { barra: "BAR", bebida: "DRINKS BAR", shishas: "SHISHA" },
      mesa: "Table", taburete: "Bar stool", mesaCorta: "Table", tab: "Stool",
      todaSala: "Whole room", girar: "Drag to rotate the room",
      elige: "Choose an area", ayuda: "Tap an area on the map, or pick one here, to see its tables.", reservar: "Book in this area", nota: "You choose the day, time and number of guests in our booking system; our floor team assigns your table based on availability.",
      hasta: (n) => `up to ${n} ${n === 1 ? 'guest' : 'guests'}`,
      resumen: (m, p) => `${m} ${m === 1 ? 'table' : 'tables'} · ${p} seats`,
      reservarMesa: (id) => `Book · table ${id}`,
      zonas: {
        terraza: { nombre: "Terrace", desc: "Two round tables by the entrance, to start the night outdoors." },
        play: { nombre: "PlayStation area", desc: "Seats by the screen with a PlayStation 5: play while you smoke." },
        cine: { nombre: "98″ screen", desc: "Tables facing the big screen, perfect for matches and groups." },
        fondo: { nombre: "Back sofas", desc: "Our roomiest tables, between the light columns and the 75″ screen." },
        centro: { nombre: "Centre", desc: "At the heart of the room, with a view of the whole lounge." },
        barra: { nombre: "Bar", desc: "Stools facing the drinks bar and the shisha bar: watch us prepare your hookah." },
      },
    },
    abrirMenu: 'Open menu',
    cerrarMenu: 'Close menu',
    abiertoAhora: 'Open now · until 04:00',
    abrimosHoy: 'Opening today at 16:00',
    hoy: 'Today', manana: 'Tomorrow',
    hoyFrase: 'today', mananaFrase: 'tomorrow',
    formatoDia: { weekday: 'long', day: 'numeric', month: 'long' },
    diaFrase: (fecha) => `on ${fecha}`,
    personas: (n) => (n === 1 ? '1 person' : `${n} people`),
    resumen: (quien, dia, hora) => `Table for ${quien}, ${dia} at ${hora}.`,
    mensajeReserva: (quien, dia, hora) => `Hello NOOR, I would like to book a table for ${quien} ${dia} at ${hora}.`,
    tituloMapa: 'Map of NOOR Lounge',
    reservarOnline: "Book a table online →",
    escribirWhatsApp: 'Message us on WhatsApp →',
    escribiendo: 'The assistant is typing',
    sinRespuesta: 'That one is best answered by our team directly. Send us a WhatsApp message and they will reply shortly.',
    pregunta: (texto) => `Hello, I have a question: ${texto}`,
  },
  saludo: 'Hello, I am the NOOR assistant. I can help with opening hours, the menu, bookings or how to find us.',
  sugerencias: ['What are your opening hours?', 'Shisha prices', 'I want to book', 'Where are you?'],
  respuestas: [
    {
      claves: ['hours', 'hour', 'open', 'opening', 'close', 'closing', 'today', 'tonight', 'sunday', 'monday', 'when'],
      texto: 'We are open every day, Monday to Sunday, from 16:00 to 04:00.',
    },
    {
      claves: ['shisha', 'hookah', 'kalyan', 'cachimba', 'flavour', 'flavor', 'bowl', 'kazan', 'price', 'cost', 'how much'],
      texto: 'Our shishas:\n· Rubio €16 · Josh €16\n· Fusion €17\n· Full Black €19\n· Kazan €22\n· Especial €25\n· Kazan Especial €30\n· Fresh fruit €40\nWe will recommend a flavour at your table, to your taste.',
    },
    {
      claves: ['cocktail', 'mojito', 'drink', 'gin', 'margarita', 'martini', 'spritz', 'negroni'],
      texto: 'Cocktails from €12: mojitos (classic, strawberry, mango, passion fruit), Aperol Spritz, Margarita, Negroni, Piña Colada, Whiskey Sour… and at €13 Espresso Martini, PornStar Martini, Gin Fit or Blue Whisky. Premium cocktail €15.',
    },
    {
      claves: ['tea', 'chai', 'coffee', 'hot', 'infusion'],
      texto: 'We have teas to share: chai latte, citrus with ginger or red berries, from €8 (0.5 l) to €14 (1.5 l). Also café con leche (€3.50) and cortado (€2.50).',
    },
    {
      claves: ['beer', 'wine', 'cava', 'champagne', 'soft drink', 'soda', 'shot'],
      texto: 'Beers from €3.50, wine by the glass at €5 (white, rosé and Rioja red), soft drinks at €4, shots at €4 and, to celebrate, cava, Veuve Clicquot or Dom Pérignon.',
    },
    {
      claves: ['menu', 'carta'],
      texto: 'You can see the full menu here: scennio.com/es/noor-lounge/menu\nShishas from €16, cocktails from €12 and teas to share from €8.',
    },
    {
      claves: ['book', 'reserv', 'table', 'group', 'people', 'birthday', 'celebrat', 'event', 'party'],
      texto: "Book your table online right below, for 1 to 10 people: it goes straight into the venue’s table system. For groups of more than 10, call us on +34 963 12 07 54.",
      reservar: true,
    },
    {
      claves: ['where', 'address', 'location', 'find', 'street', 'metro', 'parking', 'area', 'directions'],
      texto: 'We are at Carrer Serrano Morales, 3, L\'Eixample, 46004 València, next to Plaza Cánovas. You will find the map in the Visit us section.',
    },
    {
      claves: ['phone', 'call', 'contact', 'whatsapp', 'email'],
      texto: 'Call us on +34 963 12 07 54 or send us a WhatsApp message; we will reply as soon as possible.',
      whatsapp: 'Hello NOOR, I have a question.',
    },
    {
      claves: ['terrace', 'outside', 'outdoor', 'music', 'playstation', 'ps5', 'console', 'atmosphere', 'vibe'],
      texto: 'Good music every night and, if you fancy it, a PlayStation 5 at your table (€40). For anything else, send us a WhatsApp message.',
    },
    {
      claves: ['food', 'eat', 'dinner', 'snack'],
      texto: 'Shisha and cocktails take centre stage here; to nibble on, crisps (€3).',
    },
    {
      claves: ['average', 'expensive', 'cheap', 'per person', 'spend'],
      texto: 'Between €10 and €20 per person, depending on what you order.',
    },
    {
      claves: ['instagram', 'tiktok', 'social', 'insta', 'follow', 'video', 'photos'],
      texto: "Follow us on Instagram @noorloungevlc: that is where we share the atmosphere of every night.",
    },
    {
      claves: ['hello', 'hi', 'hey', 'good evening'],
      texto: 'Hello! What would you like to know? Opening hours, the menu, bookings or how to find us.',
    },
    {
      claves: ['thanks', 'thank', 'great', 'perfect'],
      texto: 'Our pleasure. See you at NOOR.',
    },
  ],
};
