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

export class Piece {
  private kind: PieceKind;
  private color: PieceColor;

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

    console.log('XXX setting position to:', row, column);
    this.position = position
  }

  private _createDomElement () : HTMLDivElement {
    const element = document.createElement('div');
    element.classList.add('pieceContainer');

    const image = document.createElement('img');
    image.src = `src/assets/images/pieces/${this.color}-${this.kind}.svg`;

    element.appendChild(image);
    return element;
  }
}
