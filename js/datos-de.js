// Deutsche Fassung von datos.js (Seite /de/). Gleiche Daten: Wenn sich etwas ändert, in allen Dateien ändern.
window.NOOR = {
  idioma: 'de-DE',
  whatsapp: '34963120754',
  textoWhatsApp: 'Hallo NOOR, ich habe eine Frage.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '',
  textos: {
    abrirMenu: 'Menü öffnen',
    cerrarMenu: 'Menü schließen',
    abiertoAhora: 'Jetzt geöffnet · bis 04:00 Uhr',
    abrimosHoy: 'Heute ab 16:00 Uhr geöffnet',
    hoy: 'Heute', manana: 'Morgen',
    hoyFrase: 'heute', mananaFrase: 'morgen',
    diaFrase: (fecha) => `am ${fecha}`,
    personas: (n) => (n === 1 ? '1 Person' : `${n} Personen`),
    resumen: (quien, dia, hora) => `Tisch für ${quien}, ${dia} um ${hora} Uhr.`,
    mensajeReserva: (quien, dia, hora) => `Hallo NOOR, ich möchte gern einen Tisch für ${quien} ${dia} um ${hora} Uhr reservieren.`,
    tituloMapa: 'Karte: NOOR Lounge',
    reservarOnline: "Tisch online reservieren →",
    escribirWhatsApp: 'Per WhatsApp schreiben →',
    escribiendo: 'Der Assistent schreibt',
    sinRespuesta: 'Diese Frage beantwortet Ihnen am besten unser Team direkt. Schreiben Sie uns per WhatsApp, wir melden uns umgehend.',
    pregunta: (texto) => `Hallo, ich habe eine Frage: ${texto}`,
  },
  saludo: 'Hallo, ich bin der Assistent von NOOR. Ich helfe Ihnen gern bei Öffnungszeiten, Karte, Reservierungen oder der Anfahrt.',
  sugerencias: ['Wann haben Sie geöffnet?', 'Shisha-Preise', 'Ich möchte reservieren', 'Wo finde ich Sie?'],
  respuestas: [
    {
      claves: ['offnungszeit', 'uhrzeit', 'geoffnet', 'offen', 'offnet', 'schliess', 'heute', 'sonntag', 'montag', 'wann'],
      texto: 'Wir haben täglich geöffnet, von Montag bis Sonntag, von 16:00 bis 04:00 Uhr.',
    },
    {
      claves: ['shisha', 'wasserpfeife', 'hookah', 'kalyan', 'geschmack', 'sorte', 'kopf', 'kazan', 'preis', 'kostet', 'wie viel'],
      texto: 'Unsere Shishas:\n· Rubio 16 € · Josh 16 €\n· Fusion 17 €\n· Full Black 19 €\n· Kazan 22 €\n· Especial 25 €\n· Kazan Especial 30 €\n· Frische Frucht 40 €\nDen Geschmack empfehlen wir Ihnen gern am Tisch, ganz nach Ihrem Wunsch.',
    },
    {
      claves: ['cocktail', 'mojito', 'trinken', 'getrank', 'drink', 'gin', 'margarita', 'martini', 'spritz'],
      texto: 'Cocktails ab 12 €: Mojitos (klassisch, Erdbeere, Mango, Maracuja), Aperol Spritz, Margarita, Negroni, Piña Colada, Whiskey Sour … und für 13 € Espresso Martini, PornStar Martini, Gin Fit oder Blue Whisky. Premium-Cocktail 15 €.',
    },
    {
      claves: ['tee', 'chai', 'kaffee', 'heiss', 'warm'],
      texto: 'Wir haben Tee zum Teilen: Chai Latte, Zitrus mit Ingwer oder Beeren, von 8 € (0,5 l) bis 14 € (1,5 l). Außerdem Milchkaffee (3,50 €) und Cortado (2,50 €).',
    },
    {
      claves: ['bier', 'wein', 'cava', 'champagner', 'softdrink', 'limo', 'shot'],
      texto: 'Bier ab 3,50 €, Wein glasweise für 5 € (weiß, rosé und roter Rioja), Softdrinks für 4 €, Shots für 4 € und zum Feiern Cava, Veuve Clicquot oder Dom Pérignon.',
    },
    {
      claves: ['karte', 'speisekarte', 'menu'],
      texto: 'Die vollständige Karte finden Sie hier: scennio.com/es/noor-lounge/menu\nShishas ab 16 €, Cocktails ab 12 € und Tee zum Teilen ab 8 €.',
    },
    {
      claves: ['reserv', 'tisch', 'gruppe', 'personen', 'geburtstag', 'feier', 'event'],
      texto: "Reservieren Sie Ihren Tisch direkt hier unten online, für 1 bis 10 Personen: Die Reservierung landet direkt in unserem Tischsystem. Für Gruppen ab 11 Personen rufen Sie uns unter +34 963 12 07 54 an.",
      reservar: true,
    },
    {
      claves: ['wo', 'adresse', 'anfahrt', 'lage', 'strasse', 'metro', 'parken', 'parkplatz', 'viertel'],
      texto: 'Sie finden uns in der Carrer Serrano Morales, 3, L\'Eixample, 46004 València, direkt an der Plaza Cánovas. Die Karte finden Sie im Abschnitt „Besuchen Sie uns“.',
    },
    {
      claves: ['telefon', 'anrufen', 'kontakt', 'whatsapp', 'mail'],
      texto: 'Rufen Sie uns an unter +34 963 12 07 54 oder schreiben Sie uns per WhatsApp – wir antworten so schnell wie möglich.',
      whatsapp: 'Hallo NOOR, ich habe eine Frage.',
    },
    {
      claves: ['terrasse', 'draussen', 'musik', 'playstation', 'ps5', 'konsole', 'atmosphare', 'ambiente'],
      texto: 'Jeden Abend gute Musik und, wenn Sie mögen, eine PlayStation 5 an Ihrem Tisch (40 €). Für alles andere schreiben Sie uns per WhatsApp.',
    },
    {
      claves: ['essen', 'abendessen', 'snack', 'knabber'],
      texto: 'Bei uns stehen Shisha und Cocktails im Mittelpunkt; zum Knabbern gibt es Chips (3 €).',
    },
    {
      claves: ['durchschnitt', 'teuer', 'gunstig', 'pro person', 'ausgeben'],
      texto: 'Zwischen 10 und 20 € pro Person, je nach Bestellung.',
    },
    {
      claves: ['instagram', 'tiktok', 'social', 'insta', 'folgen', 'video', 'fotos'],
      texto: "Folgen Sie uns auf Instagram @noorloungevlc: Dort zeigen wir die Stimmung jedes Abends.",
    },
    {
      claves: ['hallo', 'guten abend', 'guten tag', 'servus', 'hi'],
      texto: 'Hallo! Was möchten Sie wissen? Öffnungszeiten, Karte, Reservierungen oder Anfahrt.',
    },
    {
      claves: ['danke', 'super', 'perfekt'],
      texto: 'Sehr gern. Wir freuen uns auf Ihren Besuch im NOOR.',
    },
  ],
};
