// Version française de datos.js (page /fr/). Mêmes données : si quelque chose change, le modifier dans tous les fichiers.
window.NOOR = {
  idioma: 'fr-FR',
  whatsapp: '34963120754',
  textoWhatsApp: 'Bonjour NOOR, je souhaiterais réserver une table.',
  reservas: 'https://www.scennio.com/es/noor-lounge/calendar',
  carta: 'https://www.scennio.com/es/noor-lounge/menu',
  asistenteApi: '',
  textos: {
    abrirMenu: 'Ouvrir le menu',
    cerrarMenu: 'Fermer le menu',
    abiertoAhora: 'Ouvert maintenant · jusqu’à 04:00',
    abrimosHoy: 'Ouverture aujourd’hui à 16:00',
    hoy: 'Aujourd’hui', manana: 'Demain',
    hoyFrase: 'aujourd’hui', mananaFrase: 'demain',
    diaFrase: (fecha) => `le ${fecha}`,
    personas: (n) => (n === 1 ? '1 personne' : `${n} personnes`),
    resumen: (quien, dia, hora) => `Table pour ${quien}, ${dia} à ${hora}.`,
    mensajeReserva: (quien, dia, hora) => `Bonjour NOOR, je souhaiterais réserver une table pour ${quien} ${dia} à ${hora}.`,
    tituloMapa: 'Plan d’accès à NOOR Lounge',
    escribirWhatsApp: 'Nous écrire sur WhatsApp →',
    escribiendo: 'L’assistant est en train d’écrire',
    sinRespuesta: 'Pour cette question, mieux vaut que notre équipe vous réponde directement. Écrivez-nous sur WhatsApp, elle vous répondra rapidement.',
    pregunta: (texto) => `Bonjour, j’ai une question : ${texto}`,
  },
  saludo: 'Bonjour, je suis l’assistant de NOOR. Je peux vous renseigner sur les horaires, la carte, les réservations ou l’accès.',
  sugerencias: ['Quels sont vos horaires ?', 'Prix des chichas', 'Je veux réserver', 'Où êtes-vous ?'],
  respuestas: [
    {
      claves: ['horaire', 'heure', 'ouvert', 'ouvre', 'ferme', 'aujourd', 'ce soir', 'dimanche', 'lundi', 'quand'],
      texto: 'Nous sommes ouverts tous les jours, du lundi au dimanche, de 16:00 à 04:00.',
    },
    {
      claves: ['chicha', 'shisha', 'narguil', 'hookah', 'cachimba', 'saveur', 'gout', 'foyer', 'kazan', 'prix', 'combien', 'coute'],
      texto: 'Nos chichas :\n· Rubio 16 € · Josh 16 €\n· Fusion 17 €\n· Full Black 19 €\n· Kazan 22 €\n· Especial 25 €\n· Kazan Especial 30 €\n· Fruit frais 40 €\nNous vous conseillons la saveur à table, selon vos goûts.',
    },
    {
      claves: ['cocktail', 'mojito', 'boire', 'boisson', 'verre', 'gin', 'margarita', 'martini', 'spritz'],
      texto: 'Cocktails à partir de 12 € : mojitos (classique, fraise, mangue, fruit de la passion), Aperol Spritz, Margarita, Negroni, Piña colada, Whiskey Sour… et à 13 € Espresso Martini, PornStar Martini, Gin Fit ou Blue Whisky. Cocktail Premium 15 €.',
    },
    {
      claves: ['the', 'chai', 'cafe', 'chaud', 'infusion'],
      texto: 'Nous proposons des thés à partager : chai latte, agrumes et gingembre ou fruits rouges, de 8 € (0,5 l) à 14 € (1,5 l). Également café au lait (3,50 €) et cortado (2,50 €).',
    },
    {
      claves: ['biere', 'vin', 'cava', 'champagne', 'soda', 'shot'],
      texto: 'Bières à partir de 3,50 €, vin au verre à 5 € (blanc, rosé et rouge de Rioja), sodas à 4 €, shots à 4 € et, pour célébrer, cava, Veuve Clicquot ou Dom Pérignon.',
    },
    {
      claves: ['carte', 'menu'],
      texto: 'La carte complète est ici : scennio.com/es/noor-lounge/menu\nChichas à partir de 16 €, cocktails à partir de 12 € et thés à partager à partir de 8 €.',
    },
    {
      claves: ['reserv', 'table', 'groupe', 'personnes', 'anniversaire', 'fete', 'celebrer', 'evenement'],
      texto: 'Vous pouvez réserver une table en ligne (de 1 à 10 personnes) sur scennio.com/es/noor-lounge/calendar, nous appeler au +34 963 12 07 54 ou nous écrire sur WhatsApp. Pour les grands groupes ou les célébrations, WhatsApp est préférable.',
      whatsapp: 'Bonjour NOOR, je souhaiterais réserver une table pour __ personnes le __ à __.',
    },
    {
      claves: ['ou etes', 'adresse', 'venir', 'acces', 'rue', 'metro', 'garer', 'parking', 'quartier'],
      texto: 'Nous sommes au Carrer Serrano Morales, 3, L\'Eixample, 46004 València, à côté de la Plaza Cánovas. Le plan se trouve dans la rubrique Nous trouver.',
    },
    {
      claves: ['telephone', 'appeler', 'contact', 'whatsapp', 'mail', 'courriel'],
      texto: 'Appelez-nous au +34 963 12 07 54 ou écrivez-nous sur WhatsApp : nous vous répondrons au plus vite.',
      whatsapp: 'Bonjour NOOR, j’ai une question.',
    },
    {
      claves: ['terrasse', 'dehors', 'musique', 'playstation', 'ps5', 'console', 'ambiance'],
      texto: 'De la bonne musique chaque soir et, si l’envie vous prend, une PlayStation 5 à votre table (40 €). Pour toute autre demande, écrivez-nous sur WhatsApp.',
    },
    {
      claves: ['manger', 'diner', 'nourriture', 'grignoter', 'snack'],
      texto: 'Ici, la chicha et les cocktails sont à l’honneur ; pour grignoter, des chips (3 €).',
    },
    {
      claves: ['prix moyen', 'cher', 'par personne', 'budget', 'depenser'],
      texto: 'Entre 10 et 20 € par personne, selon votre commande.',
    },
    {
      claves: ['instagram', 'tiktok', 'reseaux', 'insta', 'suivre', 'video', 'photos'],
      texto: 'Suivez-nous sur Instagram @noorloungevlc et sur TikTok @noorpub : nous y partageons l’ambiance de chaque soirée.',
    },
    {
      claves: ['bonjour', 'bonsoir', 'salut', 'hello'],
      texto: 'Bonjour ! Que souhaitez-vous savoir ? Horaires, carte, réservations ou accès.',
    },
    {
      claves: ['merci', 'super', 'parfait'],
      texto: 'Avec plaisir. À bientôt chez NOOR.',
    },
  ],
};
