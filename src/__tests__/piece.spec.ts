import { Piece, PieceKind, PieceColor } from '../piece'
import { describe, it, expect } from 'vitest'

describe('Piece', () => {
  describe('constructor', () => {
    const pieceColor = PieceColor.Dark;
    const pieceKind = PieceKind.Bishop;

    const piece = new Piece({ kind: pieceKind, color: pieceColor });

    it('creates DOM Element', () => {
      expect(piece.domElement).toBeInstanceOf(HTMLDivElement);
    })

    it('loads correct image for DOM Element', () => {
      const image = piece.domElement?.querySelector('img');
      
      expect(image).toBeDefined();
      expect(image!.src).toContain(`src/assets/images/pieces/${pieceColor}-${pieceKind}.svg`);
    })
  })

  describe('setPosition', () => {
    const pieceColor = PieceColor.Dark;
    const pieceKind = PieceKind.Bishop;

    const piece = new Piece({ kind: pieceKind, color: pieceColor });

    it('sets position to provided existing position', () => {
      const position = 'A5';
      piece.setPosition(position);

      expect(piece.position).toBe(position);
    })

    it.each([
      {
        errorType: 'too long',
        value: 'A5G'
      },
      {
        errorType: 'row too big',
        value: 'A9'
      },
      {
        errorType: 'column too big',
        value: 'I5'
      }
    ])(`doesn't set position if provided position is $errorType`,
      ({ value }: { value: string }) => {
      piece.position = null;

      piece.setPosition(value);
      expect(piece.position).toBe(null);
    })
  })
})
