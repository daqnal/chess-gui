import { Chess } from "./chess.js"

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



// export function Logic() {
let possibleMoves = game.moves();


// game over
// if (possibleMoves.length === 0) return

console.log(possibleMoves);

var botMove = Math.floor(Math.random() * possibleMoves.length);
    
export {botMove};