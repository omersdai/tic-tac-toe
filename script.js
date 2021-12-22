const game = document.querySelector('.tic-tac-toe');
const icons = game.querySelectorAll('i');
const info = document.getElementById('info');
const restartBtn = document.getElementById('restartBtn');

// TODO: Add scoreboard for x and o. Improve UI. Add AI gameplay with difficulties. Draw a line when a player wins

const crossClass = 'fas fa-times fa-10x icon';
const circleClass = 'far fa-circle fa-8x icon';

let crossTurn = true;
let gameOver = false;

let gameBoard = getEmptyBoard();

game.querySelectorAll('.row').forEach((row, yIdx) => {
  Array.from(row.children).forEach((square, xIdx) => {
    const icon = square.querySelector('i');

    square.addEventListener('click', () => {
      if (!gameOver && !icon.classList.contains('active')) {
        gameBoard[yIdx][xIdx] = crossTurn ? 'x' : 'o';
        icon.classList.add('active');

        let winner = checkBoard();
        if (winner || boardIsFull()) {
          gameOver = true;
          info.innerText = winner ? `${winner.toUpperCase()} wins!` : 'Draw!';
          // remove hover of empty squares
          icons.forEach((icon) => {
            if (!icon.classList.contains('active')) icon.className = '';
          });
        } else {
          crossTurn = !crossTurn;
          switchTurns();
        }
      }
    });
  });
});

restartBtn.addEventListener('click', () => {
  crossTurn = true;
  gameOver = false;
  gameBoard = getEmptyBoard();
  icons.forEach((icon) => (icon.className = crossClass));
  info.innerText = `${crossTurn ? 'X' : 'O'}'s turn`;
});

function checkBoard() {
  // diagonals
  if (gameBoard[1][1]) {
    if (
      gameBoard[1][1] === gameBoard[0][0] &&
      gameBoard[1][1] === gameBoard[2][2]
    )
      return gameBoard[1][1];
    if (
      gameBoard[1][1] === gameBoard[0][2] &&
      gameBoard[1][1] === gameBoard[2][0]
    )
      return gameBoard[1][1];
  }

  for (let i = 0; i < gameBoard.length; i++) {
    // rows
    if (
      gameBoard[i][0] &&
      gameBoard[i][0] === gameBoard[i][1] &&
      gameBoard[i][0] === gameBoard[i][2]
    )
      return gameBoard[i][0];
    // cols
    if (
      gameBoard[0][i] &&
      gameBoard[0][i] === gameBoard[1][i] &&
      gameBoard[0][i] === gameBoard[2][i]
    )
      return gameBoard[0][i];
  }
  return null;
}

function boardIsFull() {
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      if (!gameBoard[i][j]) return false;
    }
  }
  return true;
}

function switchTurns() {
  info.innerText = `${crossTurn ? 'X' : 'O'}'s turn`;
  const turnClass = crossTurn ? crossClass : circleClass;
  icons.forEach((icon) => {
    if (!icon.classList.contains('active')) icon.className = turnClass;
  });
}

function getEmptyBoard() {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}
