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
  { x: 1392, y: 93, ancho: 1.3, mira: 's', alto: 1.75 },    // tele (Eurosport) sobre la mesa de juego
];
export const ESPEJOS = [{ x: 445, y: 273, mira: 's', r: 0.4 }, { x: 535, y: 273, mira: 's', r: 0.4 }, { x: 1128, y: 93, mira: 's', r: 0.36 }, { x: 1312, y: 93, mira: 's', r: 0.36 }];
export const CUADRO = { x: 1629, y: 190, mira: 'o' };
export const FELPUDO = { x: 182, y: 300 };
// Acera de la calle (terraza) delante de la fachada y franja de calzada
export const ACERA = [[30, 200], [171, 200], [171, 366], [184, 366], [184, 520], [30, 520]];
export const CALZADA = [-70, 200, 100, 320];

// Mesas por id del TPV. mira = hacia dónde mira quien se sienta. Sofás con largo en px del plano.
const as = (t, x, y, mira, extra = {}) => ({ t, x, y, mira, ...extra });
const sofa = (x, y, largo, mira, tapiz = 'gris') => ({ t: 'sofa', x, y, largo, mira, tapiz });
// Sillón tapizado en tela (gris en los reservados del medio, terracota en el fondo), según el vídeo del 6/11/2026
const sillonTela = (x, y, mira, tapiz = 'gris') => ({ t: 'sillon', x, y, mira, tapiz });
export const MESAS = {
  // Terraza: en la acera, fuera de la puerta
  TE1: { red: [100, 262, 0.3], asientos: [as('sillaNegra', 74, 262, 'e'), as('sillaNegra', 126, 262, 'o'), as('sillaNegra', 100, 290, 'n')] },
  TE2: { red: [100, 392, 0.3], asientos: [as('sillaNegra', 74, 392, 'e'), as('sillaNegra', 126, 392, 'o'), as('sillaNegra', 100, 420, 'n')] },
  // Pantalla 98″: sofá rosa capitoné en L bajo la ventana, con tres mesas de madera rústica (vídeo 6/11/2026)
  1: { rect: [238, 488, 80, 58], tapa: 'rustica', huella: [184, 470, 378, 607], asientos: [] },
  2: { rect: [238, 412, 62, 44], tapa: 'rustica', huella: [184, 395, 304, 462], asientos: [] },
  3: { rect: [328, 522, 50, 38], tapa: 'rustica', huella: [310, 505, 395, 607], asientos: [] },
  // Delante del sofá: una sola mesita de mármol verde con dos sillones de cuero
  4: { red: [362, 430, 0.25], tapa: 'verde', asientos: [as('sillon', 322, 402, 'o'), as('sillon', 322, 458, 'o')] },
  // Lado izquierdo al entrar: UNA sola mesa, sofá gris de una pieza, mesa-puf y dos sillones de cuero, bajo dos espejos
  13: { red: [490, 345, 0.3], tapa: 'puf', asientos: [{ t: 'sofaCurvo', x: 490, y: 294, largo: 130, mira: 's' }, as('sillon', 420, 352, 'e'), as('sillon', 560, 352, 'o')] },
  // Barra: fila de taburetes del frente
  ...Object.fromEntries([527, 572, 615, 700, 745, 787, 830].map((x, i) => [`T${i + 1}`, { taburete: [x, 440], mira: 's' }])),
  // Lado izquierdo, tras la barra alta y la mampara de espejo con tele:
  // reservado gris 1 (sofá de 2 plazas, sillón gris de tela y mesita redonda gris con pata en X)
  9: { red: [975, 172, 0.24], tapa: 'grisX', huella: [915, 98, 1005, 270], asientos: [sofa(960, 125, 85, 's'), sillonTela(960, 225, 'n')] },
  // reservado gris 2 (sofá de 2 plazas con mesita redonda pata en X) bajo el paño de azulejo con espejo
  6: { red: [1128, 172, 0.24], tapa: 'grisX', huella: [1080, 98, 1176, 230], asientos: [sofa(1128, 125, 85, 's')] },
  // banco gris sin respaldo alto con dos mesitas nido de mármol verde
  7: { banco: [1258, 122, 140, 's'], nidos: [[1225, 168], [1285, 168]], huella: [1186, 98, 1330, 200] },
  // Fondo: sofá rosa capitoné en L con el cuadro en la esquina, 2 mesas ovaladas gris oscuro, sillones terracota
  11: { red: [1462, 188, 0.25], tapa: 'oval', huella: [1430, 98, 1500, 278], asientos: [sillonTela(1450, 250, 'n', 'terracota'), sillonTela(1500, 250, 'n', 'terracota')] },
  // y la mesa de madera clara en la esquina
  10: { rect: [1533, 205, 40, 46], tapa: 'clara', huella: [1505, 98, 1628, 255], asientos: [sofa(1598, 198, 95, 'o', 'rosa'), sillonTela(1550, 268, 'n', 'terracota')] },
  // Lado derecho al volver, junto a la barra: dos sofás grises enfrentados con mesa ovalada gris oscuro de pata en Z
  8: { red: [1037, 392, 0.24], tapa: 'oval', huella: [952, 340, 1122, 432], asientos: [sofa(976, 392, 80, 'e'), sofa(1098, 392, 80, 'o')] },
  // Barra alta de granito pegada al azulejo naranja, con cuatro taburetes
  12: { barraAlta: true, taburetes: [[720, 322], [765, 322], [808, 322], [852, 322]], mira: 'n' },
};
// Sofás corridos contra la pared del fondo (se reparten entre varias mesas)
export const BANCOS = [sofa(1532, 124, 185, 's', 'rosa')];
// Muebles sin número de mesa en el TPV (se dibujan pero no se reservan)
export const DECORADO = [
  // Mesa táctil de juego con LED (tab.at), en la pared de los espejos justo antes del sofá rosa del fondo:
  // reservado gris en L detrás, el sofá rosa al lado y sillas beige delante
  { rect: [1366, 152, 66, 42], tapa: 'juego', asientos: [sofa(1392, 125, 90, 's'), sofa(1355, 185, 50, 'e'),
    as('silla', 1382, 228, 'n'), as('silla', 1414, 228, 'n')] },
  // Segunda mesa ovalada gris oscuro delante del sofá rosa
  { red: [1512, 182, 0.22], tapa: 'oval' },
  // Junto a la puerta negra de emergencia: dos sillones de cuero marrón con mesitas nido verdes
  { asientos: [as('sillon', 1400, 400, 'n'), as('sillon', 1470, 400, 'n')], nidos: [[1435, 410]] },
  { taburetes: [[488, 487], [488, 530]], mira: 'e' },
];
// Sofá rosa en L de la entrada (vídeo 6/11/2026): tramo a lo largo de la fachada y brazo junto a la pared de abajo
export const SOFA_ROJO = [{ t: 'sofa', x: 206, y: 498, largo: 212, mira: 'e', tapiz: 'rosa' }, { t: 'sofa', x: 300, y: 585, largo: 150, mira: 'n', tapiz: 'rosa' }];
