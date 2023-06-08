import { Piece, PieceKind, PieceColor } from './piece'

function createField ({ isDark } : { isDark: boolean }) {
  const field = document.createElement('div');
  field.classList.add('boardField');

  if (isDark) field.classList.add('dark');

  return field
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
      if (queen.domElement) boardContainer.appendChild(queen.domElement);
    }
  }

  return boardContainer;
}
