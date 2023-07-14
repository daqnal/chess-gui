import { Chess } from "./chess.js"


export function evalPosition(game, board) {
    
    // first, evaluate material

    const position = board.position();
    let netMaterial = 0;

    for (const [key, value] of Object.entries(position)) {
        if (value[0] === "w") {
            if (value[1] === "P") {
                netMaterial += 1;
            } else if (value[1] === "N") {
                netMaterial += 3;
            } else if (value[1] === "B") {
                netMaterial += 3;
            } else if (value[1] === "R") {
                netMaterial += 5;
            } else if (value[1] === "Q") {
                netMaterial += 9;
            }
        } else if (value[0] === "b") {
            if (value[1] === "P") {
                netMaterial += -1;
            } else if (value[1] === "N") {
                netMaterial += -3;
            } else if (value[1] === "B") {
                netMaterial += -3;
            } else if (value[1] === "R") {
                netMaterial += -5;
            } else if (value[1] === "Q") {
                netMaterial += -9;
            }
        }
    }

    console.log(netMaterial);

    let score = (netMaterial);
}

export function easyMode(game, board) {


    var possibleMoves = game.moves()

    // game over
    if (possibleMoves.length === 0) return

    // check if any of its moves can capture a piece
    let pieceType = null;
    let addedValue = 0;
    let takeMoves = [];

    evalPosition(game, board);

    
    possibleMoves.forEach(checkTakeMoves);

    function checkTakeMoves(item) {
        // check if its a take
        if (item.indexOf("x") === 1) {
        // check if the take leads to a check
        if (item.slice(-1) === "+" && item.indexOf("=") === -1) {
            pieceType = Object.values(game.get(item.slice(-3, -1)))[0];
            addedValue = 10;
        } else if (item.indexOf("=") !== -1) {
            
            pieceType = Object.values(game.get(item.slice(item.indexOf("=")-2, item.indexOf("="))))[0];
            addedValue = 90;
        } else {
            pieceType = Object.values(game.get(item.slice(-2)))[0];
        }
        
        // assign a weight to each piece
        if (pieceType === "p") {
            takeMoves.push({
            key: item,
            value: 10 + addedValue
            })
        } else if (pieceType === "n") {
            takeMoves.push({
            key: item,
            value: 30 + addedValue
            })
        } else if (pieceType === "b") {
            takeMoves.push({
            key: item,
            value: 30 + addedValue
            })
        } else if (pieceType === "r") {
            takeMoves.push({
            key: item,
            value: 50 + addedValue
            })
        } else if (pieceType === "q") {
            takeMoves.push({
            key: item,
            value: 90 + addedValue
            })
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

        takeMoves.forEach(findLargestTake);

        function findLargestTake(value) {
            if (Object.values(value)[1] > Object.values(largestTake)[1]) {
                largestTake = value;
            }
        }

        let idxOfLargestTake = possibleMoves.indexOf(Object.values(largestTake)[0]);
        
        // actually make the move here
        game.move(possibleMoves[idxOfLargestTake]);
        board.position(game.fen());
        
    }
}

export function mediumMode(game, board) {
    return 0
}


export function hardMode(game, board) {
    return 0
}