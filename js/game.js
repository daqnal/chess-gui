
import { Chess } from "./chess.js"
import { easyMode, evalPosition } from "./bot.js"


var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

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

  easyMode(game, board)
  // var possibleMoves = game.moves()

  // // game over
  // if (possibleMoves.length === 0) return

  // // check if any of its moves can capture a piece
  // let pieceType = null;
  // let addedValue = 0;
  // let takeMoves = [];

  
  // possibleMoves.forEach(checkTakeMoves);

  // function checkTakeMoves(item) {
  //   // check if its a take
  //   if (item.indexOf("x") === 1) {
  //     // check if the take leads to a check
  //     if (item.slice(-1) === "+" && item.indexOf("=") === -1) {
  //       console.log(item.slice(-3, -1));
  //       pieceType = Object.values(game.get(item.slice(-3, -1)))[0];
  //       addedValue = 10;
  //     } else if (item.indexOf("=") !== -1) {
        
  //       pieceType = Object.values(game.get(item.slice(item.indexOf("=")-2, item.indexOf("="))))[0];
  //       addedValue = 90;
  //     } else {
  //       console.log(item.slice(-2));
  //       pieceType = Object.values(game.get(item.slice(-2)))[0];
  //     }

  //     // add if, else if, else here
  //     // instead of checking if the move is a check above, do it here
      
  //     // assign a weight to each piece
  //     if (pieceType === "p") {
  //       takeMoves.push({
  //         key: item,
  //         value: 10 + addedValue
  //       })
  //     } else if (pieceType === "n") {
  //       takeMoves.push({
  //         key: item,
  //         value: 30 + addedValue
  //       })
  //     } else if (pieceType === "b") {
  //       takeMoves.push({
  //         key: item,
  //         value: 30 + addedValue
  //       })
  //     } else if (pieceType === "r") {
  //       takeMoves.push({
  //         key: item,
  //         value: 50 + addedValue
  //       })
  //     } else if (pieceType === "q") {
  //       takeMoves.push({
  //         key: item,
  //         value: 90 + addedValue
  //       })
  //     }
      
  //   }
    
  // }

  // // if there is no move with taking, then play a random move
  // if (takeMoves.length === 0) {
  //   var randomIdx = Math.floor(Math.random() * possibleMoves.length);
  //   game.move(possibleMoves[randomIdx]);
  //   board.position(game.fen());
  // } else {
  //   let largestTake = {
  //     key: null,
  //     value: 0
  //   };

  //   takeMoves.forEach(findLargestTake);

  //   function findLargestTake(value) {
  //     if (Object.values(value)[1] > Object.values(largestTake)[1]) {
  //       largestTake = value;
  //     }
  //   }

  //   let idxOfLargestTake = possibleMoves.indexOf(Object.values(largestTake)[0]);
    
  //   // actually make the move here
  //   game.move(possibleMoves[idxOfLargestTake]);
  //   board.position(game.fen());
    
  // }
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
  pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config);
$(window).resize(board.resize)
$('#clearBoardBtn').on('click', board.clear)
$('#flipOrientationBtn').on('click', board.flip)

updateStatus()