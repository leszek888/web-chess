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

let draggedPiece: Piece | null = null;

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
      draggedPiece.setPosition(position);
      setPiecePositionOnBoard(draggedPiece);
    }
  })

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

  queen.domElement!.draggable = true;
  queen.domElement!.querySelector('img')!.style.pointerEvents = 'none';
  queen.domElement!.addEventListener('dragstart', () => {
    draggedPiece = queen;
  })

  queen.domElement!.addEventListener('dragend', () => {
    draggedPiece = null;
  })

  const boardContainer = document.createElement('div');
  boardContainer.classList.add('boardContainer');

  for (let rows = 0; rows !== 8; rows++) {
    for (let cols = 0; cols !== 8; cols++) {
      const isDark = Boolean((rows + cols) % 2);
      const col = Object.keys(COLUMNS_MAP)[rows];
      const row = cols + 1;
      const field = createField({ isDark, position: `${col}${row}` })

      boardContainer.appendChild(field);
    }
  }

  if (queen.domElement) {
    setPiecePositionOnBoard(queen);
    boardContainer.appendChild(queen.domElement);
  }

  return boardContainer;
}
