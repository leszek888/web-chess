import DarkPawn from './assets/images/pieces/d-pawn.svg'
import DarkBishop from './assets/images/pieces/d-bishop.svg'
import DarkKnight from './assets/images/pieces/d-knight.svg'
import DarkRook from './assets/images/pieces/d-rook.svg'
import DarkQueen from './assets/images/pieces/d-queen.svg'
import DarkKing from './assets/images/pieces/d-king.svg'

export enum PieceKind {
  Pawn = 'pawn',
  Bishop = 'bishop',
  Knight = 'knight',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king',
}

export enum PieceColor {
  Light = 'l',
  Dark = 'd',
}

const PieceImage = {
  [`${PieceColor.Dark}-${PieceKind.Pawn}`]: DarkPawn,
  [`${PieceColor.Dark}-${PieceKind.Bishop}`]: DarkBishop,
  [`${PieceColor.Dark}-${PieceKind.Knight}`]: DarkKnight,
  [`${PieceColor.Dark}-${PieceKind.Rook}`]: DarkRook,
  [`${PieceColor.Dark}-${PieceKind.Queen}`]: DarkQueen,
  [`${PieceColor.Dark}-${PieceKind.King}`]: DarkKing,
}

export class Piece {
  public kind: PieceKind;
  public color: PieceColor;

  public position: string | null = null;
  public domElement: HTMLDivElement | null = null;

  constructor({ kind, color } : { kind: PieceKind, color: PieceColor }) {
    this.kind = kind;
    this.color = color;
    this.domElement = this._createDomElement();
  }

  public setPosition (position: string) {
    if (position?.length !== 2) {
      return;
    }

    const [ row, column ] = position
    if (!['A','B','C','D','E','F','G','H'].includes(row)
      || !['1','2','3','4','5','6','7','8'].includes(column)) {
      return;
    }

    this.position = position
  }

  private _createDomElement () : HTMLDivElement {
    const element = document.createElement('div');
    element.classList.add('pieceContainer');
    element.style.backgroundImage = `url('${PieceImage[`${this.color}-${this.kind}`]}')`;
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center';

    return element;
  }
}
