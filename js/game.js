
import { Chess } from "./chess.js"
import { easyMode, mediumMode, hardMode, evalPosition } from "./bot.js"


var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var whiteSquareGrey = '#999999'
var blackSquareGrey = '#494949'


function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

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
  var difficulty = document.getElementById("engineType").options.selectedIndex

  if (difficulty === 1) {
    easyMode(game, board) 
  } else if (difficulty === 2) {
    mediumMode(game, board)
  } else if (difficulty === 3) {
    hardMode(game, board)
  } else {
    mediumMode(game, board)
  }
}

function onDrop (source, target) {
  removeGreySquares()

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

}

function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare (square, piece) {
  removeGreySquares()
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
  pieceTheme: '/img/chesspieces/{piece}.png',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config);
$(window).resize(board.resize)
// $('#clearBoardBtn').on('click', board.clear)
$('#flipOrientationBtn').on('click', board.flip)
// $('#setStartBtn').on('click', board.start)


updateStatus()