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
      if (gameOver || icon.classList.contains('active')) return;
      console.log('Current Move: ', map[JSON.stringify(gameBoard)]);
      gameBoard[yIdx][xIdx] = crossTurn ? 'x' : 'o';
      console.log('Next Move: ', map[JSON.stringify(gameBoard)]);
      icon.classList.add('active');

      let winner = checkBoard(gameBoard);
      if (winner || boardIsFull(gameBoard)) {
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
    });
  });
});

restartBtn.addEventListener('click', () => {
  crossTurn = true;
  gameOver = false;
  gameBoard = getEmptyBoard();
  icons.forEach((icon) => (icon.className = crossClass));
  info.innerText = `${crossTurn ? 'X' : 'O'}'s turn`;
  localStorage.removeItem('tictactoe');
});

function checkBoard(board) {
  // diagonals
  if (board[1][1]) {
    if (board[1][1] === board[0][0] && board[1][1] === board[2][2])
      return board[1][1];
    if (board[1][1] === board[0][2] && board[1][1] === board[2][0])
      return board[1][1];
  }

  for (let i = 0; i < board.length; i++) {
    // rows
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    )
      return board[i][0];
    // cols
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    )
      return board[0][i];
  }
  return null;
}

function boardIsFull(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j]) return false;
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

// AI Code
const map = localStorage.getItem('tictactoe')
  ? JSON.parse(localStorage.getItem('tictactoe'))
  : {};
function computeBestMoves() {
  if (localStorage.getItem('tictactoe')) return;
  const startTime = performance.now();
  minimax(getEmptyBoard(), 0, true, map);
  const endTime = performance.now();
  console.log(
    `Call to computeBestMoves took ${endTime - startTime} milliseconds`
  );
  localStorage.setItem('tictactoe', JSON.stringify(map));
}

function minimax(position, depth, maximizingPlayer, map) {
  const winner = checkBoard(position);
  if (winner) {
    return winner === 'x' ? 1 / depth : -1 / depth;
  } else if (boardIsFull(position)) {
    return 0;
  }

  const key = JSON.stringify(position);

  if (maximizingPlayer) {
    let maxEval = null;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!position[i][j]) {
          const copy = copyBoard(position);
          copy[i][j] = 'x';
          const eval = minimax(copy, depth + 1, false, map);
          if (maxEval === null || maxEval < eval) {
            maxEval = eval;
            map[key] = [{ move: [i, j], value: eval }];
          } else if (maxEval !== null && maxEval === eval) {
            map[key].push({ move: [i, j], value: eval });
          }
        }
      }
    }
    return maxEval;
  } else {
    let minEval = null;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!position[i][j]) {
          const copy = copyBoard(position);
          copy[i][j] = 'o';
          const eval = minimax(copy, depth + 1, true, map);
          if (minEval === null || minEval > eval) {
            minEval = eval;
            map[key] = [{ move: [i, j], value: eval }];
          } else if (minEval !== null && minEval === eval) {
            map[key].push({ move: [i, j], value: eval });
          }
        }
      }
    }
    return minEval;
  }
}

computeBestMoves();

function copyBoard(board) {
  return [[...board[0]], [...board[1]], [...board[2]]];
}
