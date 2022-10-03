const Ship = require("./battleship").Ship;
const Gameboard = require("./battleship").Gameboard;

test("Ship created with length=3 has length of 3", () => {
  const ship3 = Ship(3);
  expect(ship3.length).toBe(3);
});

test("Ship initially has 0 hits", () => {
  const ship3 = Ship(3);
  expect(ship3.hits).toBe(0);
});

test("Ship has one hit after running hit() once", () => {
  const ship3 = Ship(3);
  ship3.hit();
  expect(ship3.hits).toBe(1);
});

test("Ship has three hits after running hit() three times", () => {
  const ship3 = Ship(3);
  ship3.hit();
  ship3.hit();
  ship3.hit();
  expect(ship3.hits).toBe(3);
});

test("Ship's hits don't go up after running hit() more times than Ship's length", () => {
  const ship3 = Ship(3);
  ship3.hit();
  ship3.hit();
  ship3.hit();
  ship3.hit();
  expect(ship3.hits).toBe(3);
});

test("Ship with no hits is not sunk", () => {
  const ship3 = Ship(3);
  expect(ship3.isSunk()).toBe(false);
});

test("Ship with one hit less than length is not sunk", () => {
  const ship3 = Ship(3);
  ship3.hit();
  ship3.hit();
  expect(ship3.isSunk()).toBe(false);
});

test("Ship with length of three is sunk after running hit() three times", () => {
  const ship3 = Ship(3);
  ship3.hit();
  ship3.hit();
  ship3.hit();
  expect(ship3.isSunk()).toBe(true);
});

test("ship with length of three placed horizontally at 0,0 exists on gameboard only at [0][0],[1][0], and [2][0]", () => {
  gameboard = Gameboard();
  gameboard.placeShipHorizontally(3, 0, 0);
  expect(gameboard.board[0][0]).toBeTruthy();
  expect(gameboard.board[1][0]).toBeTruthy();
  expect(gameboard.board[2][0]).toBeTruthy();
  expect(gameboard.board[3][0]).toBeFalsy();
});

test("ship with length of three placed horizontally at 0,0 exists on gameboard only at [0][0],[1][0], and [2][0]", () => {
  gameboard = Gameboard();
  gameboard.placeShipVertically(3, 0, 0);
  expect(gameboard.board[0][0]).toBeTruthy();
  expect(gameboard.board[0][1]).toBeTruthy();
  expect(gameboard.board[0][2]).toBeTruthy();
  expect(gameboard.board[0][3]).toBeFalsy();
});

test("gameboard records miss from missed attack", () => {
  gameboard = Gameboard();
  gameboard.placeShipVertically(3, 0, 0);
  gameboard.recieveAttack(9, 9);
  expect(gameboard.board[9][9]).toBe("miss");
});

test("gameboard records hit in ship object", () => {
  gameboard = Gameboard();
  gameboard.placeShipVertically(3, 0, 0);
  gameboard.recieveAttack(0, 0);
  expect(gameboard.board[0][0].hits).toBe(1);
});

test("gameboard records multiple hits in ship object", () => {
  gameboard = Gameboard();
  gameboard.placeShipVertically(3, 0, 0);
  gameboard.recieveAttack(0, 0);
  gameboard.recieveAttack(0, 1);
  expect(gameboard.board[0][0].hits).toBe(2);
});

test("gameboard.allSunk returns true when all ships are sunk", () => {
  gameboard = Gameboard();
  gameboard.placeShipVertically(3, 0, 0);
  gameboard.placeShipVertically(3, 4, 0);
  gameboard.recieveAttack(0, 0);
  gameboard.recieveAttack(0, 1);
  gameboard.recieveAttack(0, 2);
  gameboard.recieveAttack(4, 0);
  gameboard.recieveAttack(4, 1);
  gameboard.recieveAttack(4, 2);
  expect(gameboard.allSunk()).toBe(true);
});

test("gameboard.allSunk returns false when all ships are  not sunk", () => {
  gameboard = Gameboard();
  gameboard.placeShipVertically(3, 0, 0);
  gameboard.placeShipVertically(3, 4, 0);
  gameboard.recieveAttack(0, 0);
  gameboard.recieveAttack(0, 1);
  gameboard.recieveAttack(0, 2);
  expect(gameboard.allSunk()).toBe(false);
});
