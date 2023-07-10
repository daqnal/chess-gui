// var board = Chessboard('myBoard', 'start')
// import "./script.js"
import { Chess } from "./chess.js"
// import { saveAs } from "./FileSaver.js"


var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

let wPVal = 10;
let wNVal = 30;
let wBVal = 30;
let wRVal = 50;
let wQVal = 90;
let wKVal = 900;
let bPVal = -10;
let bNVal = -30;
let bBVal = -30;
let bRVal = -50;
let bQVal = -90;
let bKVal = -900;

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function engineMove () {

  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  // check if any of its moves can capture a piece
  let takeMoves = [];
  possibleMoves.forEach(checkTakeMoves);

  function checkTakeMoves(item) {
    // check if its a take
    if (item.indexOf("x") === 1) {
      // check if the take leads to a check
      if (item.slice(-1) === "+") {
        takeMoves.push({
          key: item,
          value: 100
        })
        // all other captures (excluding castling)
      } else if (parseInt(item.slice(-1)) !== NaN) {
        if (item.indexOf("=") !== -1) {
          console.log(item.slice(item.indexOf("=")-2, item.indexOf("=")));
          let pieceType = Object.values(game.get(item.slice(item.indexOf("=")-2, item.indexOf("="))))[0];
          console.log(pieceType);
        }
        // add if, else if, else here
        // instead of checking if the move is a check above, do it here

        let pieceType = Object.values(game.get(item.slice(-2)))[0];
        
        // assign a weight to each piece
        if (pieceType === "p") {
          takeMoves.push({
            key: item,
            value: 10
          })
        } else if (pieceType === "n") {
          takeMoves.push({
            key: item,
            value: 30
          })
        } else if (pieceType === "b") {
          takeMoves.push({
            key: item,
            value: 30
          })
        } else if (pieceType === "r") {
          takeMoves.push({
            key: item,
            value: 50
          })
        } else if (pieceType === "q") {
          takeMoves.push({
            key: item,
            value: 90
          })
        }
      }
    }
    
  }
  // if there is no move with taking, then play a random move
  if (takeMoves.length === 0) {
    var randomIdx = Math.floor(Math.random() * possibleMoves.length);


    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
  } else {
    let largestTake = {
      key: null,
      value: 0
    };

    // console.log(takeMoves);
    takeMoves.forEach(findLargestTake);

    function findLargestTake(value) {
      // console.log(Object.values(value)[1])
      if (Object.values(value)[1] > Object.values(largestTake)[1]) {
        largestTake = value;
      }
    }

    let idxOfLargestTake = possibleMoves.indexOf(Object.values(largestTake)[0]);
    
    console.log(possibleMoves);
    console.log(idxOfLargestTake);
    game.move(possibleMoves[idxOfLargestTake]);
    board.position(game.fen());
    
  }
  

  
  
  

}


function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  // make random legal move for black
  window.setTimeout(engineMove, 250)

  updateStatus()

  // MY LINES OF CODE SO PROBABLY BREAKS
  console.log(board.fen());

}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    if (moveColor === 'Black') {
      status = 'You win o_o'
    }
    else {
      status = 'HAHA I WIN!! ^V^'
    }
    header.innerHTML = status
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
    header.innerHTML = status
  }

  // game still on
  else {
    status = moveColor + ' to move'
    header.innerHTML = status

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
      header.innerHTML = status
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  pieceTheme: './../img/chesspieces/lichess/{piece}.png',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config);
$(window).resize(board.resize)

// $('#reset-button').on('click', board.start)
// myBoard_parent.addEventListener('contextmenu', event => event.preventDefault());

updateStatus()