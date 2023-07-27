// Factory function
const playerFactory = (mark) => {
  // private
  let _mark = mark;

  // public
  function getMark() {
    return _mark;
  }

  function setMark(mark) {
    _mark = mark;
  }

  function newDraw(event, changePlayer, mark) {
    event.target.textContent = mark;
    changePlayer();
    gameBoard.checkWin();
  }

  return {
    getMark,
    setMark,
    newDraw,
  };
};

// Module pattern
const gameBoard = (() => {
  // Private funcs and vars
  const nodeList = document.querySelectorAll('.item');
  const canvas = [...nodeList];

  const player1 = playerFactory('X');
  const player2 = playerFactory('O');

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  function comparing(board, conditions) {
    if (board.length < 3) return;
    const strGrid = board.toString();
    const [a, b, c] = conditions.sort();
    const result =
      strGrid.includes(a) && strGrid.includes(b) && strGrid.includes(c);
    return result;
  }

  function availableMovements() {
    const result = canvas
      .filter((item) => !item.textContent)
      .map((element) => element.id);
    return result;
  }

  function modalStyles() {
    document.querySelector('.selector').classList.remove('hide');
    document.querySelector('.selector').classList.add('modal');
  }

  function winingStyles(arr) {
    const [a, b, c] = arr;
    const conditions = [canvas[a], canvas[b], canvas[c]];
    conditions.forEach((item) => {
      item.classList.add('bg-light');
    });
  }

  let victory = false;

  function checkWin() {
    const arr = [...canvas];
    const xAnswers = [];
    const oAnswers = [];
    arr.forEach((item, index) => {
      if (item.textContent === 'X') {
        xAnswers.push(index);
      } else if (item.textContent === 'O') {
        oAnswers.push(index);
      }
    });

    winningConditions.forEach((item) => {
      if (comparing(xAnswers, item)) {
        const el = document.querySelector('footer');
        const display = '<p>Player wins!</p>';
        el.insertAdjacentHTML('beforeend', display);
        modalStyles();
        winingStyles(item);
        gameBoard.victory = true;
      }
      if (comparing(oAnswers, item)) {
        const el = document.querySelector('footer');
        const display = '<p>Computer wins!</p>';
        el.insertAdjacentHTML('beforeend', display);
        modalStyles();
        winingStyles(item);
      }
    });
  }

  // Return public funcs and vars
  return { canvas, player1, player2, checkWin, availableMovements, victory };
})();

const displayController = (() => {
  // Private funcs and vars
  let currentPlayer = gameBoard.player1;

  function switchPlayer() {
    currentPlayer === gameBoard.player1
      ? (currentPlayer = gameBoard.player2)
      : (currentPlayer = gameBoard.player1);
  }

  function computerTurn(arr) {
    const index = Math.floor(Math.random() * arr.length);
    arr.length >= 1 ? (gameBoard.canvas[arr[index]].textContent = 'O') : '';
    switchPlayer();
    gameBoard.checkWin();
  }

  gameBoard.canvas.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (currentPlayer === gameBoard.player1) {
        currentPlayer.newDraw(e, switchPlayer, gameBoard.player1.getMark());
        const movements = gameBoard.availableMovements();
        setTimeout(() => {
          !gameBoard.victory ? computerTurn(movements) : '';
        }, 1000);
      }
    });
  });

  function restart() {
    gameBoard.canvas.forEach((item) => {
      item.textContent = '';
      currentPlayer = gameBoard.player1;
    });
    document.querySelector('.selector').classList.add('hide');
    document.querySelector('.selector').classList.remove('modal');
    gameBoard.canvas.forEach((item) => item.classList.remove('bg-light'));
    const element = document.querySelector('footer p');
    element ? element.remove() : '';
    gameBoard.victory = false;
  }

  // Return public funcs and vars
  return {
    restart,
  };
})();
