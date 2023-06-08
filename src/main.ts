import { createBoard } from './board'

function setup () {
  const appElement = document.getElementById('app');

  if (!appElement) return;

  const board = createBoard();
  appElement.appendChild(board);
}

window.addEventListener('load', setup);
