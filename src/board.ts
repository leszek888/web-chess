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

let draggedPiece: Piece | null = null;

const boardState = new Array(8).fill(0).map(x => Array(8).fill(null));
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
  console.log('XXX boardState', boardState[row][column])

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
  console.log('XXX boardState', row, column)

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

export function getFreeVerticalSquares ([ row, column ]
  : Coords) {
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
  console.log(validVerticalSquares)

  return validVerticalSquares;
}

export function getFreeHorizontalSquares ([ row, column ]
  : Coords) {
  console.log(`Horizontal check for ${row}-${column}`)
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
  console.log(validVerticalSquares)

  return validVerticalSquares;
}

export function getFreeDiagonalSquares ([ row, column ] : Coords) {
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

export function getValidSquaresForPiece (piece: Piece) {
  if (!piece.position) return [];

  const coords = convertPositionToNumericCoords(piece.position);
  if (!coords) return [];

  let validSquares: string[] = [];

  switch (piece.kind) {
    case PieceKind.Queen:
      validSquares = validSquares.concat(getFreeVerticalSquares(coords) as string[]);
      validSquares = validSquares.concat(getFreeHorizontalSquares(coords) as string[]);
      validSquares = validSquares.concat(getFreeDiagonalSquares(coords) as string[]);
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
  queen.setPosition('A8');
  king.setPosition('C5');

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
  return boardContainer;
}
