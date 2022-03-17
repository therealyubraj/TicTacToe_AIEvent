//TIC TAC TOE GAME

/**
 * @type Board
 */
let board;
let AI = 'O';
function preload() {

}

function setup() {
    createCanvas(600, 600);
    background(255);
    Board.gridWidth = width / Board.width;
    Board.gridHeight = height / Board.height;

    board = new Board('X');
}

function draw() {
    background(255);
    board.drawBoard();
    if (board.curPlayer == AI) {
        AIMakesMove();
    }
    if (board.checkWinner().winner != '') {
        board.drawBoard();
        noLoop();
    }
}

function mousePressed() {
    //check if mouse is in the board area
    if (mouseX < width && mouseY < height && mouseX >= 0 && mouseY >= 0) {
        let x = Math.floor(mouseX / (width / 3));
        let y = Math.floor(mouseY / (width / 3));
        if (board.getBoard(x, y) == ' ' && board.curPlayer != AI) { }
        board.setBoard(x, y, board.curPlayer);
        board.changePlayer();
    }
}

function AIMakesMove() {
    //find best move
    let bestMove = { score: -Infinity, move: [-1, -1] };
    let nextStates = board.getAllNextStates();
    let allMoves = Object.keys(nextStates);
    for (let i = 0; i < allMoves.length; i++) {
        let totalIter = 10000;
        let nextState = nextStates[allMoves[i]];
        let wins = nextState.evalTillEnd(totalIter);
        let score = (wins[board.curPlayer] / totalIter) - (wins[board.curPlayer == 'X' ? 'O' : 'X'] / totalIter);
        if (score > bestMove.score) {
            bestMove = { score: score, move: allMoves[i].split(',').map(Number) };
        }
        console.log(allMoves[i], wins);
    }
    console.log("-------------------------");
    board.setBoard(bestMove.move[0], bestMove.move[1], board.curPlayer);
    board.changePlayer();
}