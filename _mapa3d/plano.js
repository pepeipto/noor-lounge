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
export const ALICATADOS = [];

// Tabiques interiores (cortados a 1,1 m para ver dentro) y mampara de vidrio del cortavientos
export const TABIQUES = [
  [[184, 366], [258, 366]], [[332, 235], [332, 297]],
  [[952, 377], [952, 455]], [[1122, 377], [1122, 455]], [[1317, 365], [1317, 432]],
];
export const MAMPARAS = [[[288, 366], [430, 366]]];
// Pilar alicatado junto a la puerta acristalada (con la consola al lado)
export const PILAR_AZULEJO = [258, 358, 30, 24];
// Mesa negra de la consola PlayStation
export const CONSOLA = [192, 376, 64, 22];

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
  { x: 1207, y: 93, ancho: 1.6, mira: 's', alto: 1.65 },     // tele sobre el sofá largo del fondo
];
export const ESPEJOS = [{ x: 477, y: 273, mira: 's', r: 0.45 }, { x: 625, y: 273, mira: 's', r: 0.45 }, { x: 1100, y: 93, mira: 's', r: 0.36 }, { x: 1312, y: 93, mira: 's', r: 0.36 }];
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
  // Pantalla 98″: sofá rojo capitoné en L bajo la ventana, con mesas de madera rústica
  1: { rect: [238, 488, 80, 58], tapa: 'rustica', huella: [184, 470, 378, 607], asientos: [] },
  2: { rect: [238, 412, 62, 44], tapa: 'rustica', huella: [184, 395, 304, 462], asientos: [] },
  // Zona PlayStation: dos sillones de cuero con una mesita de mármol verde, frente al sofá
  // Una sola mesita de mármol verde con dos sillones (vídeo 6/11/2026)
  4: { red: [362, 430, 0.25], tapa: 'verde', asientos: [as('sillon', 322, 402, 'o'), as('sillon', 322, 458, 'o')] },
  // Junto a la pared de los espejos: sofá gris de una pieza, mesa-puf y sillones de cuero
  3: { red: [477, 345, 0.3], tapa: 'puf', asientos: [{ t: 'sofaCurvo', x: 477, y: 294, largo: 116, mira: 's' }, as('sillon', 425, 352, 'e'), as('sillon', 529, 352, 'o')] },
  13: { red: [625, 345, 0.3], tapa: 'puf', asientos: [{ t: 'sofaCurvo', x: 625, y: 294, largo: 116, mira: 's' }, as('sillon', 573, 352, 'e'), as('sillon', 677, 352, 'o')] },
  // Barra: fila de taburetes del frente
  ...Object.fromEntries([527, 572, 615, 700, 745, 787, 830].map((x, i) => [`T${i + 1}`, { taburete: [x, 440], mira: 's' }])),
  // Reservados grises del medio (vídeo 6/11/2026): sofás grises, sillón gris envolvente de tela y mesa redonda gris con pata en X
  9: { red: [975, 160, 0.27], tapa: 'grisX', asientos: [sofa(919, 150, 95, 'e'), sofa(1030, 150, 95, 'o'), sillonTela(975, 237, 'n')] },
  6: { red: [1128, 180, 0.27], tapa: 'grisX', huella: [1088, 98, 1172, 276], asientos: [sillonTela(1128, 248, 'n')] },
  7: { red: [1263, 180, 0.27], tapa: 'grisX', huella: [1222, 98, 1306, 276], asientos: [sillonTela(1263, 248, 'n')] },
  // Fondo: sofá rosa capitoné en L, mesa ovalada gris oscuro y mesa de madera clara, sillones terracota
  11: { red: [1470, 190, 0.3], tapa: 'oval', huella: [1430, 98, 1520, 278], asientos: [sillonTela(1455, 252, 'n', 'terracota'), sillonTela(1500, 252, 'n', 'terracota')] },
  10: { rect: [1515, 172, 41, 53], tapa: 'clara', huella: [1510, 98, 1628, 248], asientos: [sofa(1598, 198, 95, 'o', 'rosa')] },
  // Junto a la barra, contra el azulejo: sofá gris y otro en ángulo, con mesa ovalada gris oscuro
  8: { red: [1045, 368, 0.28], tapa: 'oval', huella: [952, 330, 1122, 432], asientos: [sofa(1050, 410, 100, 'n'), sofa(976, 362, 50, 'e')] },
  // Centro: barra alta de granito pegada a la pared
  12: { barraAlta: true, taburetes: [[720, 322], [765, 322], [808, 322], [852, 322]], mira: 'n' },
};
// Sofás corridos contra la pared del fondo (se reparten entre varias mesas)
export const BANCOS = [sofa(1207, 125, 262, 's'), sofa(1532, 124, 185, 's', 'rosa')];
// Muebles sin número de mesa en el TPV (se dibujan pero no se reservan)
export const DECORADO = [
  // Mesa táctil de juego con LED (tab.at), en la pared de los espejos justo antes del sofá rosa del fondo:
  // reservado gris en L detrás, el sofá rosa al lado y sillas beige delante
  { rect: [1366, 152, 66, 42], tapa: 'juego', asientos: [sofa(1392, 125, 90, 's'), sofa(1355, 185, 50, 'e'),
    as('silla', 1382, 228, 'n'), as('silla', 1414, 228, 'n')] },
  // Junto a la puerta de emergencia: sillón de cuero marrón con mesitas nido verdes
  { asientos: [as('sillon', 1440, 400, 'n')], nidos: [[1480, 395]] },
  // Banco gris corrido con mesitas nido de mármol verde, tras el tabique bajo
  { banco: [1220, 412, 160, 'n'], nidos: [[1185, 378], [1255, 378]] },
  { taburetes: [[488, 487], [488, 530]], mira: 'e' },
];
// Sofá rojo en L de la entrada: tramo a lo largo de la fachada y brazo junto a la pared de abajo
// y un tercer sofá suelto enfrente que cierra la U
export const SOFA_ROJO = [{ t: 'sofa', x: 206, y: 498, largo: 212, mira: 'e', tapiz: 'rojo' }, { t: 'sofa', x: 279, y: 585, largo: 102, mira: 'n', tapiz: 'rojo' },
  { t: 'sofa', x: 352, y: 532, largo: 118, mira: 'o', tapiz: 'rojo' }];
