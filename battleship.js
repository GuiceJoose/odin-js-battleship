const Ship = (length) => {
  let hits = 0;
  function hit() {
    if (hits < length) {
      ++hits;
    }
  }
  function isSunk() {
    if (hits === length) {
      return true;
    } else {
      return false;
    }
  }
  return { length, hits, hit, isSunk };
};

const Gameboard = () => {
  let board = [...Array(10)].map((_) => Array(10));

  function placeShipHorizontally(length, xCoord, yCoord) {
    ship = Ship(length);
    for (i = 0; i < length; i++) {
      board[xCoord + i][yCoord] = ship;
    }
  }
  function placeShipVertically(length, xCoord, yCoord) {
    ship = Ship(length);
    for (i = 0; i < length; i++) {
      board[xCoord][yCoord + i] = ship;
    }
  }
  function recieveAttack(xCoord, yCoord) {
    if (board[xCoord][yCoord] === undefined) {
      board[xCoord][yCoord] = "miss";
    }
    if (board[xCoord][yCoord].hits !== undefined) {
      board[xCoord][yCoord].hit();
    }
  }
  function allSunk() {
    const flatBoard = board.flat();
    const ships = flatBoard.filter((el) => el.hits !== undefined);
    const remainingShips = ships.filter((ship) => ship.isSunk() !== true);
    if (remainingShips.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  return {
    board,
    placeShipHorizontally,
    placeShipVertically,
    recieveAttack,
    allSunk,
  };
};

const Player = (playerType) => {
  let playerBoard = Gameboard();
  let isTurn = false;
  let hits = [];
  let possibleAttacks = [];
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) possibleAttacks.push([i, j]);
  }

  function pickRandomAttack() {
    const attackIndex = Math.floor(Math.random() * possibleAttacks.length);
    const attack = possibleAttacks[attackIndex];
    possibleAttacks.splice(attackIndex, 1);
    return attack;
  }

  return {
    playerBoard,
    isTurn,
    possibleAttacks,
    pickRandomAttack,
    playerType,
    hits,
  };
};

const GameController = () => {
  let board1 = player1.playerBoard.board;
  let board2 = player2.playerBoard.board;
  function checkGameOver() {
    if (player1.playerBoard.allSunk() === true) {
      return alert("player 2 wins");
    }
    if (player2.playerBoard.allSunk() === true) {
      return alert("player 1 wins");
    }
  }
  function switchTurns() {
    if (player1.isTurn === true) {
      player1.isTurn = false;
      player2.isTurn = true;
      return;
    }
    if (player2.isTurn === true) {
      player2.isTurn = false;
      player1.isTurn = true;
      return;
    }
  }
  function addClickListener() {
    let squares = document.querySelectorAll(".computer-tile");
    squares.forEach((square) =>
      square.addEventListener("click", handleAttackClick)
    );
  }

  function handleAttackClick(event) {
    let x = parseInt(event.target.attributes.xcoord.value);
    let y = parseInt(event.target.attributes.ycoord.value);
    if (
      // attack is a hit
      player2.playerBoard.board[x][y] !== undefined &&
      player2.playerBoard.board[x][y] !== "miss" &&
      isArray1InArray2([x, y], player1.hits) === false
    ) {
      player1.hits.push([x, y]);
      player2.playerBoard.recieveAttack(x, y);
      switchTurns();
      GameController();
    }
    if (
      // attack is a miss
      player2.playerBoard.board[x][y] === undefined
    ) {
      player2.playerBoard.recieveAttack(x, y);
      switchTurns();
      GameController();
    }
    if (
      // attack has already been selected -> do nothing
      player2.playerBoard.board[x][y] === "miss" ||
      isArray1InArray2([x, y], player1.hits) === true
    ) {
      return;
    }

    console.log(player1.hits);
  }

  renderGameBoards(board1, board2);
  addClickListener();
  checkGameOver();

  if (player2.isTurn === true) {
    let player2Attack = player2.pickRandomAttack();
    player1.playerBoard.recieveAttack(player2Attack[0], player2Attack[1]);
    if (player1.playerBoard.allSunk() === true) {
      renderGameBoards(board1, board2);
      return;
    }
    player2.isTurn = false;
    player1.isTurn = true;
    setTimeout(GameController, 100);
  }
};

const renderGameBoards = (board1, board2) => {
  p1BoardArea = document.querySelector(".p1-board");
  p1BoardArea.innerHTML = "";
  for (i = 0; i < board1.length; i++) {
    for (j = 0; j < board1[i].length; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      if (
        // Uses stringify in helper function to check if coords of square being rendered
        // are missing from possible attacks array, indicating a hit ship
        isArray1InArray2([i, j], player2.possibleAttacks) === false &&
        board1[j][i] !== undefined &&
        board1[j][i] !== "miss"
      ) {
        square.classList.add("hit");
      }
      if (board1[j][i] !== undefined && board1[j][i] !== "miss") {
        square.classList.add("ship");
      }
      if (board1[j][i] === "miss") {
        square.classList.add("miss");
      }
      p1BoardArea.appendChild(square);
    }
  }

  p2BoardArea = document.querySelector(".p2-board");
  p2BoardArea.innerHTML = "";
  for (i = 0; i < board2.length; i++) {
    for (j = 0; j < board2[i].length; j++) {
      const square = document.createElement("div");
      square.setAttribute("xcoord", j);
      square.setAttribute("ycoord", i);
      square.classList.add("square");
      square.classList.add("computer-tile");
      if (
        // Uses stringify in helper function to check if coords of square being rendered
        // are missing from possible attacks array, indicating a hit ship
        isArray1InArray2([j, i], player1.hits) === true &&
        board2[j][i] !== undefined &&
        board2[j][i] !== "miss"
      ) {
        square.classList.add("hit");
      }
      if (board2[j][i] === "miss") {
        square.classList.add("miss");
      }
      p2BoardArea.appendChild(square);
    }
  }
};

let player1 = Player("human");
let player2 = Player("computer");

player1.playerBoard.placeShipHorizontally(5, 0, 0);
player1.playerBoard.placeShipHorizontally(4, 0, 4);
player1.playerBoard.placeShipVertically(3, 7, 0);
player1.playerBoard.placeShipVertically(2, 9, 6);
player2.playerBoard.placeShipVertically(5, 0, 0);
player2.playerBoard.placeShipVertically(4, 3, 0);
player2.playerBoard.placeShipHorizontally(3, 0, 7);
player2.playerBoard.placeShipHorizontally(2, 3, 9);

player1.isTurn = true;

GameController();
//module.exports = { Ship, Gameboard, Player, GameController };

function isArray1InArray2(arr1, arr2) {
  const stringyArr1 = JSON.stringify(arr1);
  const stringyArr2 = JSON.stringify(arr2);
  const result = stringyArr2.indexOf(stringyArr1);
  if (result === -1) {
    return false;
  } else {
    return true;
  }
}
