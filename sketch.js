//TIC TAC TOE GAME

/**
 * @type Board
 */
let board;
let AI = 'O', human = AI == 'X' ? 'O' : 'X';
let AIthinking = false;
/**
 * @type Timer
 */
let timer;

let totalGamesPlayed = 0, curStatus = 'Human Turn', humanWon = 0;

function setup() {
    createCanvas(600, 600);
    background(255);
    Board.gridWidth = width / Board.width;
    Board.gridHeight = height / Board.height;

    board = new Board(human);
    timer = new Timer(20);
}

function draw() {
    background(150);
    board.drawBoard();
    curStatus = 'Playing!!';
    if (board.checkWinner().winner != '') {
        if (board.checkWinner().winner == human) {
            curStatus = 'Human Won!';
            humanWon++;
        } else if (board.checkWinner().winner == AI) {
            curStatus = 'AI Won!';
        } else {
            curStatus = 'Draw!!!!';
        }
        totalGamesPlayed++;
        updateAllText();
        noLoop();
    }
    else if (board.curPlayer == AI) {
        timer.stop();
        timer.reset();
        AIMakesMove();
    } else if (timer.started == -999) {
        timer.start();
    } else if (timer.done) {
        curStatus = 'Human time ran out. I won.';
        totalGamesPlayed++;
        updateAllText();
        noLoop();
    }
    updateAllText();
}

function mousePressed() {
    //check if mouse is in the board area
    if (mouseX < width && mouseY < height && mouseX >= 0 && mouseY >= 0 && board.curPlayer != AI && !AIthinking) {
        let x = Math.floor(mouseX / (width / 3));
        let y = Math.floor(mouseY / (width / 3));
        if (board.getBoard(x, y) == ' ' && board.curPlayer != AI) {
            //if on valid square draw appropriate symbol
            board.setBoard(x, y, board.curPlayer);
            board.changePlayer();
        }
    }
}

function AIMakesMove() {
    //find best move
    AIthinking = true;
    curStatus = 'AI Thinking';
    updateAllText();
    let bestMove = { score: -Infinity, move: [-1, -1] };
    let nextStates = board.getAllNextStates();
    let allMoves = Object.keys(nextStates);
    for (let i = 0; i < allMoves.length; i++) {
        let totalIter = 10000;
        let nextState = nextStates[allMoves[i]];
        let wins = nextState.evalTillEnd(totalIter);
        let score = (wins[AI] / totalIter) - (wins[human] / totalIter) + (wins['D'] / totalIter);
        if (score > bestMove.score) {
            bestMove = { score: score, move: allMoves[i].split(',').map(Number) };
        }
        console.log(allMoves[i], wins, score);
    }
    console.log("-------------------------");
    board.setBoard(bestMove.move[0], bestMove.move[1], board.curPlayer);
    board.changePlayer();
    AIthinking = false;
}

function resetAll() {
    board = new Board(human);
    timer.reset();
    loop();
}

function updateAllText() {
    document.getElementById("winnings").innerHTML = humanWon + '/' + totalGamesPlayed;
    document.getElementById("timer").innerHTML = timer.time + '/' + timer.duration;
    document.getElementById("gameStatus").innerHTML = curStatus;
}