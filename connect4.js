/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const playerspan = document.getElementById('playerNumber');

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) { //create HEIGHT number of rows(arrays)
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) { //fill each row with WIDTH cells
      board[y][x] = null; //initializes them as null
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board"); //get the table with id "board" to update
  const top = document.createElement("tr"); //create the top row where pieces are placed from
  top.setAttribute("id", "column-top"); //sets the id of the top row
  top.addEventListener("click", handleClick); //adds the event listener

  for (let x = 0; x < WIDTH; x++) { //creates the headcells for each column of the board
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x); //sets each cell to have the same id as its column placement
    top.append(headCell); //places the cell in the top row
  }
  htmlBoard.append(top); //appends the top row to the html table

  for (let y = 0; y < HEIGHT; y++) { //for each row of the board
    const row = document.createElement("tr"); //create a table row
    for (let x = 0; x < WIDTH; x++) { //then fill each row with WIDTH cells
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`); //gives each cell the id of its place in the board matrix
      row.append(cell);
    }
    htmlBoard.append(row); //append the row to the html table
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) { //starting at the bottom row
    if (board[y][x] === null) { //if there is no piece in the cell, return that cell row, otherwise continue checking the cells above
      return y;
    }
  }
  return null; //if no open cell is found, return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div"); //creates the div to be placed
  const tdCell = document.getElementById(`${y}-${x}`) //gets the td to place the div in, which should have the id of its row and column
  piece.classList.add("piece", `player${currPlayer}`); //gives the div the classes piece and playernumber(1 or 2) for css
  tdCell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x); //places the piece in the HTML board
  board[y][x] = currPlayer; //sets the actual board cell to the current player number

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every((val) => val.every((cell) => cell !== null))) { //if every cell in every array is not null, the game is a tie
    return endGame('Tie Game...');
  }
  // switch players
  currPlayer === 1 ? currPlayer++ : currPlayer--;
  playerspan.innerText = currPlayer;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  /* creates arrays for each possible win condition for every cell on the board*/
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //if any win condition is true, currPlayer has won
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
const resetbutton = document.getElementById('reset');
resetbutton.addEventListener('click',(e)=>{
  currPlayer = 1;
  playerspan.innerText = 1;
  makeBoard();
  const htmlBoard = document.getElementById("board");
  htmlBoard.innerHTML = '';
  makeHtmlBoard();
})
