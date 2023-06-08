import {
  createBoard,
  setPiecePositionOnBoard
} from '../board'
import { Piece, PieceKind, PieceColor } from '../piece'
import { describe, it, expect } from 'vitest'

describe('Board', () => {
  describe('createBoard', () => {
    it(`Creates div with 'boardContainer' class`, () => {
      const board = createBoard();

      expect(board).toBeInstanceOf(HTMLDivElement);
      expect(board.classList.contains('boardContainer')).toBe(true);
    })

    it(`Creates 64 fields`, () => {
      const board = createBoard();
      const fields = board.querySelectorAll('.boardField');

      expect(fields).toHaveLength(64);
    })

    describe(`All fields are colored correctly`, () => {
      const board = createBoard();
      const fields = board.querySelectorAll('.boardField');

      for (let row = 0; row !== 8; row++) {
        for (let col = 0; col !== 8; col++) {
          it(`Correctly sets color for field ${row}-${col}`, () => {
            const shouldFieldBeDark = (((row) + col) % 2 === 1);

            expect(fields[(row * 8) + col].classList.contains('dark'))
              .toBe(shouldFieldBeDark);
          })
        }
      }
    })
  })

  describe('setPiecePositionOnBoard', () => {
    it(`Sets style attribute 'top' and 'left' for valid position`, () => {
      const piece = new Piece({
        kind: PieceKind.Bishop,
        color: PieceColor.Light
      });

      piece.setPosition('H8');

      const expectedTop = (12.5625 * 7) + '%';
      const expectedLeft = (12.5625 * 7) + '%';

      setPiecePositionOnBoard(piece);

      expect(piece.domElement!.style.top).toBe(expectedTop);
      expect(piece.domElement!.style.left).toBe(expectedLeft);
    })

    it(`Doesn't set style attribute for invalid position`, () => {
      const piece = new Piece({
        kind: PieceKind.Bishop,
        color: PieceColor.Light
      });

      piece.setPosition('I6');

      expect(piece.domElement!.style.top).toBe('');
      expect(piece.domElement!.style.left).toBe('');
    })
  })
})
