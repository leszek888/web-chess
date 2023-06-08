import { Piece, PieceKind, PieceColor } from './piece'

const COLUMNS_MAP = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3,
  'E': 4,
  'F': 5,
  'G': 6,
  'H': 7
}

function createField ({ isDark } : { isDark: boolean }) {
  const field = document.createElement('div');
  field.classList.add('boardField');

  if (isDark) field.classList.add('dark');

  return field
}

export function setPiecePositionOnBoard (piece: Piece) {
  if (!piece.position || !piece.domElement) return;

  const [ row, column ] = piece.position;

  const rowOffset = COLUMNS_MAP[row as keyof typeof COLUMNS_MAP];
  const columnOffset = Number(column) - 1;

  if (!isNaN(rowOffset)
    && !isNaN(columnOffset)
    && rowOffset < 8 && rowOffset >= 0
    && columnOffset < 8 && columnOffset >= 0
  ) {
    piece.domElement.style.top = (rowOffset * 12.5625) + '%';
    piece.domElement.style.left = (columnOffset * 12.5625) + '%';
  }
}

export function createBoard () {
  const queen = new Piece({ kind: PieceKind.Queen, color: PieceColor.Dark });
  queen.setPosition('A8');

  const boardContainer = document.createElement('div');
  boardContainer.classList.add('boardContainer');

  for (let rows = 0; rows !== 8; rows++) {
    for (let cols = 0; cols !== 8; cols++) {
      const isDark = Boolean((rows + cols) % 2);
      const field = createField({ isDark })

      boardContainer.appendChild(field);
    }
  }

  if (queen.domElement) {
    setPiecePositionOnBoard(queen);
    boardContainer.appendChild(queen.domElement);
  }

  return boardContainer;
}
