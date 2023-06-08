import { Piece, PieceKind, PieceColor } from './piece'

const ROWS_MAP = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7
}

export const boardState = new Array(8).fill(0).map(() => Array(8).fill(null));
let draggedPiece: Piece | null = null;
let boardContainer : HTMLDivElement | null = null;

export type Coords = [
  number,
  number
]

function movePiece (piece: Piece, position: string) {
  const validSquares = getValidSquaresForPiece(piece);

  if (!validSquares.includes(position)) {
    console.log(`[movePiece] position ${position} not valid for ${piece.kind}`);
    return;
  }

  if (piece.position) {
    const oldCoords = convertPositionToNumericCoords(piece.position);

    if (oldCoords) {
      const [ row, column ] = oldCoords;
      boardState[row][column] = null;
    }
  }

  const coords = convertPositionToNumericCoords(position);
  if (!coords) return;

  const [ row, column ] = coords;
  boardState[row][column] = piece;

  piece.setPosition(position);
  updatePiecePositionOnBoard(piece);
}

function createField ({ isDark, position }
  : { isDark: boolean, position: string }) {
  const field = document.createElement('div');
  field.classList.add('boardField');
  field.addEventListener('dragover', (event) => event?.preventDefault());
  field.addEventListener('dragenter', (event) => {
    event?.preventDefault()
    field.style.filter = 'brightness(0.5)';
  });
  field.addEventListener('dragleave', () => {
    field.style.filter = 'brightness(1)';
  })
  field.addEventListener('drop', () => {
    field.style.filter = 'brightness(1)';
    if (draggedPiece) {
      movePiece(draggedPiece, position);
    }
  })

  if (isDark) field.classList.add('dark');

  return field
}

export function updatePiecePositionOnBoard (piece: Piece) {
  if (!piece.position || !piece.domElement) return;

  const coords = convertPositionToNumericCoords(piece.position);
  if (!coords) return;

  const [ row, column ] = coords;

  if (isNaN(row) || isNaN(column)) return;

  boardState[row][column] = piece;

  piece.domElement.style.top = (row * 12.5625) + '%';
  piece.domElement.style.left = (column * 12.5625) + '%';
}

function convertPositionToNumericCoords (position: string) {
  if (position.length !== 2) return null;

  const [ row, col ] = position;
  const rowIndex = Number(ROWS_MAP[row as keyof typeof ROWS_MAP]);
  const colIndex = Number(col) - 1;

  if (isNaN(rowIndex)
    || isNaN(colIndex)
    || rowIndex > 7 || rowIndex < 0
    || colIndex > 7 || colIndex < 0
  ) {
    return null;
  }

  return [ rowIndex, colIndex ] as Coords;
}

function convertNumericCoordsToPosition ([ row, col ]
  : Coords) {
  if (isNaN(row)
    || isNaN(col)
    || row > 7 || row < 0
    || col > 7 || col < 0
  ) {
    return null;
  }

  return `${Object.keys(ROWS_MAP)[row]}${col+1}`;
}

export function getFreeVerticalSquares (position: string) {
  const coords = convertPositionToNumericCoords(position);
  if (!coords) return [];
  const [ row, column ] = coords;

  let x = row;
  let validVerticalSquares = [];

  while (--x >= 0) {
    if (boardState[x][column]) {
      break;
    }

    const position = convertNumericCoordsToPosition([x, column])
    if (position) {
      validVerticalSquares.push(position)
    }
  }

  x = row;
  while (++x <= 7) {
    if (boardState[x][column]) {
      break;
    }

    const position = convertNumericCoordsToPosition([x, column])
    if (position) {
      validVerticalSquares.push(position)
    }
  }

  return validVerticalSquares;
}

export function getFreeHorizontalSquares (position: string) {
  const coords = convertPositionToNumericCoords(position);
  if (!coords) return [];
  const [ row, column ] = coords;

  let y = column;
  let validVerticalSquares = [];

  while (--y >= 0) {
    if (boardState[row][y]) {
      break;
    }

    const position = convertNumericCoordsToPosition([row, y])
    if (position) {
      validVerticalSquares.push(position)
    }
  }

  y = column;
  while (++y <= 7) {
    if (boardState[row][y]) {
      break;
    }

    const position = convertNumericCoordsToPosition([row, y])
    if (position) {
      validVerticalSquares.push(position)
    }
  }
  return validVerticalSquares;
}

export function getFreeDiagonalSquares (position: string) {
  const coords = convertPositionToNumericCoords(position);
  if (!coords) return [];
  const [ row, column ] = coords;

  let y = column;
  let x = row;
  const validSquares = [];

  while (--y >= 0 && --x >= 0) {
    if (boardState[x][y]) {
      break;
    }

    const position = convertNumericCoordsToPosition([ x, y ])
    if (position) {
      validSquares.push(position);
    }
  }

  y = column;
  x = row;

  while (++y <= 7 && ++x <= 7) {
    if (boardState[x][y]) {
      break;
    }

    const position = convertNumericCoordsToPosition([ x, y ])
    if (position) {
      validSquares.push(position);
    }
  }

  y = column;
  x = row;

  while (++y <= 7 && --x >= 0) {
    if (boardState[x][y]) {
      break;
    }

    const position = convertNumericCoordsToPosition([ x, y ])
    if (position) {
      validSquares.push(position);
    }
  }

  y = column;
  x = row;

  while (--y >= 0 && ++x <= 7) {
    if (boardState[x][y]) {
      break;
    }

    const position = convertNumericCoordsToPosition([ x, y ])
    if (position) {
      validSquares.push(position);
    }
  }

  return validSquares;
}

export function getFreeSquaresForKing (position: string) {
  const coords = convertPositionToNumericCoords(position);
  if (!coords) return [];

  const [ row, column ] = coords;

  const validSquares: string[] = [];

  const addSquare = (x: number, y: number) => {
    const position = convertNumericCoordsToPosition([ x, y ]);
    if (position) {
      validSquares.push(position);
    }
  }

  let x = row;
  let y = column;

  if (!boardState[x-1]?.[y]) addSquare(x-1, y)
  if (!boardState[x-1]?.[y-1]) addSquare(x-1, y-1)
  if (!boardState[x-1]?.[y+1]) addSquare(x-1, y+1)
  if (!boardState[x][y-1]) addSquare(x, y-1)
  if (!boardState[x][y+1]) addSquare(x, y+1)
  if (!boardState[x+1]?.[y]) addSquare(x+1, y)
  if (!boardState[x+1]?.[y-1]) addSquare(x+1, y-1)
  if (!boardState[x+1]?.[y+1]) addSquare(x+1, y+1)

  return validSquares;
}

export function getFreeSquaresForKnight (position: string) {
  const coords = convertPositionToNumericCoords(position);
  if (!coords) return [];

  const [ row, column ] = coords;

  const validSquares: string[] = [];

  const addSquare = (x: number, y: number) => {
    const position = convertNumericCoordsToPosition([ x, y ]);
    if (position) {
      validSquares.push(position);
    }
  }

  let x = row;
  let y = column;

  if (!boardState[x+2]?.[y-1]) addSquare(x+2, y-1);
  if (!boardState[x+2]?.[y+1]) addSquare(x+2, y+1);
  if (!boardState[x-2]?.[y-1]) addSquare(x-2, y-1);
  if (!boardState[x-2]?.[y+1]) addSquare(x-2, y+1);
  if (!boardState[x-1]?.[y+2]) addSquare(x-1, y+2);
  if (!boardState[x+1]?.[y+2]) addSquare(x+1, y+2);
  if (!boardState[x+1]?.[y-2]) addSquare(x+1, y-2);
  if (!boardState[x-1]?.[y-2]) addSquare(x-1, y-2);

  return validSquares;
}

export function getValidSquaresForPiece (piece: Piece) {
  if (!piece.position) return [];

  let validSquares: string[] = [];

  switch (piece.kind) {
    case PieceKind.Queen:
      validSquares = validSquares.concat(getFreeVerticalSquares(piece.position) as string[]);
      validSquares = validSquares.concat(getFreeHorizontalSquares(piece.position) as string[]);
      validSquares = validSquares.concat(getFreeDiagonalSquares(piece.position) as string[]);
      break;

    case PieceKind.Bishop:
      validSquares = validSquares.concat(getFreeDiagonalSquares(piece.position) as string[]);
      break;

    case PieceKind.Rook:
      validSquares = validSquares.concat(getFreeVerticalSquares(piece.position) as string[]);
      validSquares = validSquares.concat(getFreeHorizontalSquares(piece.position) as string[]);
      break;

    case PieceKind.King:
      validSquares = getFreeSquaresForKing(piece.position);
      break;

    case PieceKind.Knight:
      validSquares = getFreeSquaresForKnight(piece.position);
      break;
  }

  return validSquares;
}

function addPiece (piece: Piece) {
  piece.domElement!.draggable = true;
  piece.domElement!.querySelector('img')!.style.pointerEvents = 'none';
  piece.domElement!.addEventListener('dragstart', () => {
    draggedPiece = piece;
  })

  piece.domElement!.addEventListener('dragend', () => {
    draggedPiece = null;
  })

  if (piece.domElement && boardContainer) {
    updatePiecePositionOnBoard(piece);
    boardContainer.appendChild(piece.domElement);
  }
}

export function createBoard () {
  boardContainer = document.createElement('div');
  boardContainer.classList.add('boardContainer');

  const queen = new Piece({ kind: PieceKind.Queen, color: PieceColor.Dark });
  const king = new Piece({ kind: PieceKind.King, color: PieceColor.Dark });
  const bishop1 = new Piece({ kind: PieceKind.Bishop, color: PieceColor.Dark });
  const bishop2 = new Piece({ kind: PieceKind.Bishop, color: PieceColor.Dark });
  const rook1 = new Piece({ kind: PieceKind.Rook, color: PieceColor.Dark });
  const rook2 = new Piece({ kind: PieceKind.Rook, color: PieceColor.Dark });
  const knight1 = new Piece({ kind: PieceKind.Knight, color: PieceColor.Dark });
  const knight2 = new Piece({ kind: PieceKind.Knight, color: PieceColor.Dark });

  queen.setPosition('H5');
  king.setPosition('H4');
  bishop1.setPosition('H3');
  bishop2.setPosition('H6');
  rook1.setPosition('H1');
  rook2.setPosition('H8');
  knight1.setPosition('H2');
  knight2.setPosition('H7');

  for (let rows = 0; rows !== 8; rows++) {
    for (let cols = 0; cols !== 8; cols++) {
      const isDark = Boolean((rows + cols) % 2);
      const col = Object.keys(ROWS_MAP)[rows];
      const row = cols + 1;
      const field = createField({ isDark, position: `${col}${row}` })

      boardContainer.appendChild(field);
    }
  }

  addPiece(queen);
  addPiece(king);
  addPiece(bishop1);
  addPiece(bishop2);
  addPiece(rook1);
  addPiece(rook2);
  addPiece(knight1);
  addPiece(knight2);
  return boardContainer;
}
