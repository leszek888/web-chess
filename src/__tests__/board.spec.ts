import {
  boardState,
  createBoard,
  updatePiecePositionOnBoard,
  getFreeDiagonalSquares,
  getFreeVerticalSquares,
  getFreeHorizontalSquares
} from '../board'
import { Piece, PieceKind, PieceColor } from '../piece'
import { describe, it, expect } from 'vitest'

function clearBoard () {
  for (let row = 0; row !== 8; row++) {
    for (let col = 0; col !== 8; col++) {
      boardState[row][col] = null;
    }
  }
}

beforeEach(() => {
  clearBoard();
})

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

  describe('updatePiecePositionOnBoard', () => {
    it(`Sets style attribute 'top' and 'left' for valid position`, () => {
      const piece = new Piece({
        kind: PieceKind.Bishop,
        color: PieceColor.Light
      });

      piece.setPosition('H8');

      const expectedTop = (12.5625 * 7) + '%';
      const expectedLeft = (12.5625 * 7) + '%';

      updatePiecePositionOnBoard(piece);

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

  describe('getFreeVerticalSquares', () => {
    it('Should return all vertical squares except own', () => {
      const availableSquares = getFreeVerticalSquares('D4')

      expect(availableSquares.sort()).toEqual([
        'A4', 'B4', 'C4', 'E4', 'F4', 'G4', 'H4'
      ].sort())
    })

    it('Should return all vertical squares up until other piece is on the way', () => {
      const piece = new Piece({
        kind: PieceKind.Bishop,
        color: PieceColor.Light
      });

      boardState[1][3] = piece;
      boardState[6][3] = piece;
      const availableSquares = getFreeVerticalSquares('D4')

      expect(availableSquares.sort()).toEqual([
        'C4', 'E4', 'F4'
      ].sort())
    })
  })

  describe('getFreeHorizontalSquares', () => {
    it('Should return all horizontal squares except own', () => {
      const availableSquares = getFreeHorizontalSquares('D4')

      expect(availableSquares.sort()).toEqual([
        'D1', 'D2', 'D3', 'D5', 'D6', 'D7', 'D8'
      ].sort())
    })

    it('Should return all horizontal squares up until other piece is on the way', () => {
      const piece = new Piece({
        kind: PieceKind.Bishop,
        color: PieceColor.Light
      });

      boardState[3][1] = piece;
      boardState[3][7] = piece;
      const availableSquares = getFreeHorizontalSquares('D4')

      expect(availableSquares.sort()).toEqual([
        'D3', 'D5', 'D6', 'D7'
      ].sort())
    })
  })

  describe('getFreeDiagonalSquares', () => {
    it('Should return all diagonal squares except own', () => {
      const availableSquares = getFreeDiagonalSquares('D4')

      expect(availableSquares.sort()).toEqual([
          'A1',
          'A7',
          'B2',
          'B6',
          'C3',
          'C5',
          'E3',
          'E5',
          'F2',
          'F6',
          'G1',
          'G7',
          'H8',
      ].sort())
    })
    it('Should return all diagonal squares up until other piece is on the way', () => {
      const piece = new Piece({
        kind: PieceKind.Bishop,
        color: PieceColor.Light
      });

      boardState[0][0] = piece;
      boardState[7][7] = piece;
      boardState[6][0] = piece;
      boardState[0][6] = piece;
      const availableSquares = getFreeDiagonalSquares('D4')

      expect(availableSquares.sort()).toEqual([
          'B2',
          'B6',
          'C3',
          'C5',
          'E3',
          'E5',
          'F2',
          'F6',
          'G7',
      ].sort())
    })
  })
})
