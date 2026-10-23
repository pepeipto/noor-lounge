// Versione italiana di datos.js (pagina /it/). Stessi dati: se cambia qualcosa, aggiornarlo in tutti i file.
window.NOOR = {
  idioma: 'it-IT',
  whatsapp: '34963120754',
  textoWhatsApp: 'Ciao NOOR, ho una domanda.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '',
  textos: {
    mapa: {
      aria: "Mappa interattiva della sala del NOOR", entrada: "INGRESSO", aseos: "BAGNI",
      barras: { barra: "BANCONE", bebida: "BAR BEVANDE", shishas: "SHISHA" },
      mesa: "Tavolo", taburete: "Sgabello", mesaCorta: "Tavolo", tab: "Sgabello",
      todaSala: "Tutta la sala", girar: "Trascina per ruotare · Ctrl + rotella per ingrandire", ampliar: "Ingrandisci", reducir: "Riduci",
      elige: "Scegli una zona", ayuda: "Tocca una zona della mappa, o sceglila qui, per vedere i suoi tavoli.", reservar: "Prenota in questa zona", nota: "Scegli giorno, ora e numero di persone nel nostro sistema di prenotazione; lo staff di sala ti assegna il tavolo in base alla disponibilità.",
      hasta: (n) => `fino a ${n} ${n === 1 ? 'persona' : 'persone'}`,
      resumen: (m, p) => `${m} ${m === 1 ? 'tavolo' : 'tavoli'} · ${p} posti`,
      reservarMesa: (id) => `Prenota · tavolo ${id}`,
      zonas: {
        terraza: { nombre: "Terrazza", desc: "Due tavoli rotondi vicino all’ingresso, per iniziare la serata all’aperto." },
        play: { nombre: "Zona PlayStation", desc: "Posti vicino allo schermo con PlayStation 5: gioca mentre fumi." },
        cine: { nombre: "Schermo 98″", desc: "Tavoli davanti al grande schermo, perfetti per le partite e i gruppi." },
        fondo: { nombre: "Divani in fondo", desc: "I tavoli più ampi, tra colonne di luce e lo schermo da 75″." },
        centro: { nombre: "Centro", desc: "Nel cuore della sala, con vista su tutto il locale." },
        barra: { nombre: "Bancone", desc: "Sgabelli davanti al bar delle bevande e a quello delle shisha: guarda come prepariamo il tuo narghilè." },
      },
    },
    abrirMenu: 'Apri il menu',
    cerrarMenu: 'Chiudi il menu',
    abiertoAhora: 'Aperto ora · fino alle 04:00',
    abrimosHoy: 'Oggi apriamo alle 16:00',
    hoy: 'Oggi', manana: 'Domani',
    hoyFrase: 'oggi', mananaFrase: 'domani',
    diaFrase: (fecha) => fecha,
    personas: (n) => (n === 1 ? '1 persona' : `${n} persone`),
    resumen: (quien, dia, hora) => `Tavolo per ${quien}, ${dia} alle ${hora}.`,
    mensajeReserva: (quien, dia, hora) => `Ciao NOOR, vorrei prenotare un tavolo per ${quien} ${dia} alle ${hora}.`,
    tituloMapa: 'Mappa di NOOR Lounge',
    reservarOnline: "Prenota un tavolo online →",
    escribirWhatsApp: 'Scrivici su WhatsApp →',
    escribiendo: 'L’assistente sta scrivendo',
    sinRespuesta: 'A questa domanda preferiamo che risponda direttamente il nostro staff. Scrivici su WhatsApp e ti risponderanno subito.',
    pregunta: (texto) => `Ciao, ho una domanda: ${texto}`,
  },
  saludo: 'Ciao, sono l’assistente di NOOR. Posso aiutarti con orari, menù, prenotazioni o indicazioni per arrivare.',
  sugerencias: ['Che orari avete?', 'Prezzi dei narghilè', 'Voglio prenotare', 'Dove siete?'],
  respuestas: [
    {
      claves: ['orari', 'orario', 'aperto', 'aprite', 'apre', 'chiude', 'chiudete', 'oggi', 'domenica', 'lunedi', 'quando'],
      texto: 'Siamo aperti tutti i giorni, dal lunedì alla domenica, dalle 16:00 alle 04:00.',
    },
    {
      claves: ['shisha', 'narghil', 'narghile', 'hookah', 'cachimba', 'sapor', 'gusto', 'braciere', 'kazan', 'prezz', 'costa', 'quanto'],
      texto: 'I nostri narghilè:\n· Rubio 16 € · Josh 16 €\n· Fusion 17 €\n· Full Black 19 €\n· Kazan 22 €\n· Especial 25 €\n· Kazan Especial 30 €\n· Frutta fresca 40 €\nTi consigliamo il gusto al tavolo, in base alle tue preferenze.',
    },
    {
      claves: ['cocktail', 'mojito', 'bere', 'bevanda', 'drink', 'gin', 'margarita', 'martini', 'spritz'],
      texto: 'Cocktail da 12 €: mojito (classico, fragola, mango, frutto della passione), Aperol Spritz, Margarita, Negroni, Piña colada, Whiskey Sour… e a 13 € Espresso Martini, PornStar Martini, Gin Fit o Blue Whisky. Cocktail Premium 15 €.',
    },
    {
      claves: ['te', 'tè', 'chai', 'caffe', 'caldo', 'infuso', 'tisana'],
      texto: 'Abbiamo tè da condividere: chai latte, agrumi e zenzero o frutti rossi, da 8 € (0,5 l) a 14 € (1,5 l). Anche caffellatte (3,50 €) e cortado (2,50 €).',
    },
    {
      claves: ['birra', 'vino', 'cava', 'champagne', 'bibita', 'shot', 'chupito'],
      texto: 'Birre da 3,50 €, vino al calice a 5 € (bianco, rosato e rosso Rioja), bibite a 4 €, shot a 4 € e, per festeggiare, cava, Veuve Clicquot o Dom Pérignon.',
    },
    {
      claves: ['menu', 'carta', 'listino'],
      texto: 'Puoi vedere il menù completo qui: scennio.com/es/noor-lounge/menu\nNarghilè da 16 €, cocktail da 12 € e tè da condividere da 8 €.',
    },
    {
      claves: ['prenot', 'tavolo', 'gruppo', 'persone', 'compleanno', 'festegg', 'evento', 'festa'],
      texto: "Prenota il tuo tavolo online qui sotto, da 1 a 10 persone: la prenotazione entra direttamente nel nostro sistema dei tavoli. Per più di 10 persone, chiamaci al +34 963 12 07 54.",
      reservar: true,
    },
    {
      claves: ['dove', 'indirizzo', 'arrivare', 'posizione', 'via', 'metro', 'parcheggi', 'zona'],
      texto: 'Siamo in Carrer Serrano Morales, 3, L\'Eixample, 46004 València, accanto a Plaza Cánovas. Trovi la mappa nella sezione Vieni a trovarci.',
    },
    {
      claves: ['telefono', 'chiamare', 'contatto', 'contatti', 'whatsapp', 'email', 'mail'],
      texto: 'Chiamaci al +34 963 12 07 54 o scrivici su WhatsApp: ti rispondiamo il prima possibile.',
      whatsapp: 'Ciao NOOR, ho una domanda.',
    },
    {
      claves: ['terrazza', 'all aperto', 'fuori', 'musica', 'playstation', 'ps5', 'console', 'atmosfera'],
      texto: 'Buona musica ogni sera e, se ti va, una PlayStation 5 al tuo tavolo (40 €). Per qualsiasi altra cosa, scrivici su WhatsApp.',
    },
    {
      claves: ['mangiare', 'cena', 'cibo', 'stuzzic', 'snack'],
      texto: 'Qui i protagonisti sono il narghilè e i cocktail; da stuzzicare, patatine (3 €).',
    },
    {
      claves: ['prezzo medio', 'caro', 'economico', 'a persona', 'spendere'],
      texto: 'Tra 10 e 20 € a persona, a seconda di cosa ordini.',
    },
    {
      claves: ['instagram', 'tiktok', 'social', 'insta', 'seguire', 'video', 'foto'],
      texto: "Seguici su Instagram @noorloungevlc: lì condividiamo l’atmosfera di ogni sera.",
    },
    {
      claves: ['ciao', 'salve', 'buonasera', 'buongiorno'],
      texto: 'Ciao! Cosa vorresti sapere? Orari, menù, prenotazioni o come arrivare.',
    },
    {
      claves: ['grazie', 'perfetto', 'ottimo'],
      texto: 'È un piacere. Ti aspettiamo da NOOR.',
    },
  ],
};
