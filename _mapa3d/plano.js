// Distribución real de NOOR sacada del plano de reforma del arquitecto
// (38_SP_25_cocktail_bar_valencia.pdf, hoja 2 «План реконструкции») y de los vídeos del local.
// Coordenadas en píxeles de esa hoja renderizada a 2000 px de ancho; S las pasa a metros
// (taburetes de 0,4 m y sillones de 0,7 m → ~1,38 cm por píxel; el local mide unos 25 × 7,5 m).
// Calle a la izquierda, fondo a la derecha; «n» = arriba en el plano, «s» = abajo.
export const S = 0.0138;
export const ORIGEN = [171, 92];

// Contorno de la zona de clientes, en orden (el interior queda a la derecha de cada tramo).
// Aseos y trastienda se dejan fuera: no se reservan.
export const CONTORNO = [[171, 235], [430, 235], [430, 272], [707, 272], [707, 280], [884, 280], [884, 92], [1630, 92],
  [1630, 255], [1511, 255], [1511, 432], [1240, 432], [1240, 455], [1007, 455], [1007, 607], [493, 607], [493, 567],
  [430, 567], [430, 610], [184, 610], [184, 366], [171, 366]];
// Tramos bajos (los que dan al espectador: la maqueta se ve "cortada" por delante)
export const BAJOS = [8, 10, 11, 12, 13, 14, 15, 16, 17, 18];
// Tramos de vidrio: [índice, desde, hasta] en fracción del tramo (fachada del cortavientos y ventana)
export const VIDRIOS = [[21, 0, 1], [19, 0.3, 0.61]];
// Tramos de pared alicatados con el azulejo naranja (la barra alta)
export const ALICATADOS = [4];
// Paños de azulejo naranja sobre la pared de rayas: [x0, x1, y] (reservado gris 2)
export const PANOS = [[1080, 1176, 92]];

// Tabiques interiores (cortados a 1,1 m para ver dentro) y mampara de vidrio del cortavientos
export const TABIQUES = [
  [[184, 366], [258, 366]], [[332, 235], [332, 297]],
  [[952, 377], [952, 455]], [[1122, 377], [1122, 455]], [[1317, 365], [1317, 432]],
];
// Donde el plano marcaba una mampara de vidrio hay un murete alicatado con la tele y la PlayStation (Carlos, 6/11/2026)
export const MAMPARAS = [];
export const MURETE_TV = [[288, 366], [430, 366]];
// Pilar alicatado junto a la puerta acristalada (con la consola al lado)
export const PILAR_AZULEJO = [258, 358, 30, 24];
// Mesa negra de la consola PlayStation, bajo la tele del murete
export const CONSOLA = [356, 368, 66, 20];

export const PILARES = [[1007, 220, 63, 62, 'verde'], [1316, 220, 61, 62, 'espejo']];
// Columnas de luz de acero perforado (los círculos con punto rojo del plano)
export const COLUMNAS_LUZ = [[412, 595], [551, 285], [696, 282], [975, 110], [1364, 110], [1335, 405], [1492, 405]];

// Barra en U (la caja roja del plano): tramos [x, y, ancho, fondo, tipo]. La de shishas es el tramo de arriba a la derecha.
export const BARRAS = [
  [500, 455, 367, 30, 'bebida'], [500, 485, 30, 82, 'bebida'], [500, 567, 510, 33, 'trasera'],
  [910, 455, 100, 30, 'shishas'], [980, 485, 30, 82, 'bebida'],
];
// Barra alta pegada a la pared, con cuatro taburetes (mesa 12)
export const BARRA_ALTA = [700, 282, 184, 28];

export const PANTALLAS = [
  { x: 185, y: 500, ancho: 2.0, mira: 'e', alto: 1.75 },     // tele grande sobre la ventana de la fachada
  { x: 359, y: 366, ancho: 1.25, mira: 's', alto: 1.55 },    // tele de la PlayStation sobre el murete alicatado
  { x: 960, y: 93, ancho: 1.4, mira: 's', alto: 1.7 },      // tele grande del reservado gris 1
  { x: 886, y: 190, ancho: 1.1, mira: 'e', alto: 1.6 },     // tele en la mampara de espejo tras la barra alta
  { x: 1283, y: 93, ancho: 1.0, mira: 's', alto: 1.75 },    // tele (Eurosport) sobre la mesa de juego
];
export const ESPEJOS = [{ x: 445, y: 273, mira: 's', r: 0.4 }, { x: 535, y: 273, mira: 's', r: 0.4 }, { x: 1128, y: 93, mira: 's', r: 0.36 }, { x: 1312, y: 93, mira: 's', r: 0.36 }];
export const CUADRO = { x: 1629, y: 190, mira: 'o' };
// Puerta negra de emergencia con el extintor al lado: [x, y, mira]
export const PUERTA_EMERGENCIA = [1476, 432, 'n'];
export const FELPUDO = { x: 182, y: 300 };
// Acera de la calle (terraza) delante de la fachada y franja de calzada
export const ACERA = [[30, 200], [171, 200], [171, 366], [184, 366], [184, 610], [30, 610]];
export const CALZADA = [-70, 200, 100, 410];

// Mesas por id del TPV. mira = hacia dónde mira quien se sienta. Sofás con largo en px del plano.
const as = (t, x, y, mira, extra = {}) => ({ t, x, y, mira, ...extra });
const sofa = (x, y, largo, mira, tapiz = 'gris') => ({ t: 'sofa', x, y, largo, mira, tapiz });
// Sillón tapizado en tela (gris en los reservados del medio, terracota en el fondo), según el vídeo del 6/11/2026
const sillonTela = (x, y, mira, tapiz = 'gris') => ({ t: 'sillon', x, y, mira, tapiz });
export const MESAS = {
  // Terraza: en la acera, a la altura del sofá rosa de dentro (Carlos, 6/11/2026)
  TE1: { red: [100, 440, 0.3], asientos: [as('sillaNegra', 74, 440, 'e'), as('sillaNegra', 126, 440, 'o'), as('sillaNegra', 100, 468, 'n')] },
  TE2: { red: [100, 545, 0.3], asientos: [as('sillaNegra', 74, 545, 'e'), as('sillaNegra', 126, 545, 'o'), as('sillaNegra', 100, 573, 'n')] },
  // Pantalla 98″: sofá rosa capitoné en L bajo la ventana, con tres mesas de madera rústica (vídeo 6/11/2026)
  2: { rect: [238, 404, 62, 44], tapa: 'rustica', huella: [184, 392, 310, 454], asientos: [] },
  1: { rect: [238, 458, 62, 44], tapa: 'rustica', huella: [184, 454, 310, 508], asientos: [] },
  3: { rect: [238, 512, 62, 44], tapa: 'rustica', huella: [184, 508, 380, 607], asientos: [] },
  // Zona PlayStation: una mesita de mármol verde con los dos sillones de cuero mirando a la tele de la Play
  4: { red: [370, 432, 0.22], tapa: 'verde', asientos: [as('sillon', 333, 428, 'n'), as('sillon', 407, 428, 'n')] },
  // Lado izquierdo al entrar: UNA sola mesa, sofá gris de una pieza, mesa-puf y dos sillones de cuero, bajo dos espejos
  13: { red: [490, 345, 0.3], tapa: 'puf', asientos: [{ t: 'sofaCurvo', x: 490, y: 294, largo: 130, mira: 's' }, as('sillon', 420, 352, 'e'), as('sillon', 560, 352, 'o')] },
  // Barra: fila de taburetes del frente
  ...Object.fromEntries([527, 572, 615, 700, 745, 787, 830].map((x, i) => [`T${i + 1}`, { taburete: [x, 440], mira: 's' }])),
  // Lado izquierdo, tras la barra alta y la mampara de espejo con tele:
  // reservado gris 1: un sofá gris a cada lado, sillón gris de tela y mesita redonda gris con pata en X
  9: { red: [975, 160, 0.24], tapa: 'grisX', huella: [890, 98, 1055, 265], asientos: [sofa(919, 150, 95, 'e'), sofa(1030, 150, 95, 'o'), sillonTela(975, 237, 'n')] },
  // mesa 6: mesita redonda gris pata en X con un solo sillón gris a la derecha (Carlos, 6/11/2026)
  6: { red: [1092, 155, 0.24], tapa: 'grisX', huella: [1072, 98, 1158, 210], asientos: [sillonTela(1133, 155, 'o')] },
  // mesa 7: sofá gris largo con dos mesitas nido de mármol verde; después la mesa digital, antes del pilar
  7: { asientos: [sofa(1205, 124, 80, 's')], nidos: [[1188, 165], [1222, 165]], huella: [1162, 98, 1248, 200] },
  // Fondo: sofá rosa capitoné en L con el cuadro en la esquina, 2 mesas ovaladas gris oscuro, sillones terracota
  11: { red: [1462, 188, 0.25], tapa: 'oval', huella: [1335, 98, 1500, 278], asientos: [sillonTela(1450, 250, 'n', 'terracota'), sillonTela(1500, 250, 'n', 'terracota')] },
  // y la mesa de madera clara en la esquina
  10: { rect: [1533, 205, 40, 46], tapa: 'clara', huella: [1505, 98, 1628, 255], asientos: [sofa(1598, 198, 95, 'o', 'rosa'), sillonTela(1550, 268, 'n', 'terracota')] },
  // Lado derecho al volver, junto a la barra: dos sofás grises enfrentados con mesa ovalada gris oscuro de pata en Z
  8: { red: [1037, 392, 0.24], tapa: 'oval', huella: [952, 340, 1122, 432], asientos: [sofa(976, 392, 80, 'e'), sofa(1098, 392, 80, 'o')] },
  // Barra alta de granito pegada al azulejo naranja, con cuatro taburetes
  12: { barraAlta: true, taburetes: [[720, 322], [765, 322], [808, 322], [852, 322]], mira: 'n' },
};
// Sofás corridos contra la pared del fondo (se reparten entre varias mesas)
export const BANCOS = [sofa(1480, 124, 290, 's', 'rosa')];
// Muebles sin número de mesa en el TPV (se dibujan pero no se reservan)
export const DECORADO = [
  // Mesa táctil de juego con LED (tab.at), en la pared de los espejos antes del pilar de espejo:
  // reservado gris en L detrás, el sofá rosa al lado y sillas beige delante
  { rect: [1256, 150, 56, 40], tapa: 'juego', asientos: [sofa(1283, 124, 66, 's'), as('silla', 1270, 214, 'n'), as('silla', 1300, 214, 'n')] },
  // Segunda mesa ovalada gris oscuro delante del sofá rosa
  { red: [1512, 182, 0.22], tapa: 'oval' },
  // Junto a la puerta negra de emergencia: dos sillones de cuero marrón con mesitas nido verdes
  { asientos: [as('sillon', 1345, 400, 'n'), as('sillon', 1400, 400, 'n')], nidos: [[1372, 410]] },
  // Sillón rosa pequeño junto a la mesa de la PlayStation
  { asientos: [as('sillon', 462, 418, 'o', { tapiz: 'rosa' })] },
  { taburetes: [[488, 487], [488, 530]], mira: 'e' },
];
// Sofá rosa en U de la entrada: tramo a lo largo de la fachada y brazo junto a la pared de abajo
// y un tercer sofá enfrente, a la derecha, que cierra la U (Carlos, 6/11/2026)
export const SOFA_ROJO = [{ t: 'sofa', x: 206, y: 498, largo: 212, mira: 'e', tapiz: 'rosa' }, { t: 'sofa', x: 279, y: 585, largo: 102, mira: 'n', tapiz: 'rosa' },
  { t: 'sofa', x: 352, y: 532, largo: 118, mira: 'o', tapiz: 'rosa' }];
