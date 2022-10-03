const Ship = (length) => {
  let hits = 0;
  function hit() {
    if (this.hits < this.length) {
      ++this.hits;
    }
  }
  function isSunk() {
    if (this.hits === this.length) {
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

module.exports = { Ship, Gameboard };
