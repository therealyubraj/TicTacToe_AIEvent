class Board {
    static width = 3;
    static height = 3;
    static gridWidth = 0;
    static gridHeight = 0;

    constructor(initPlayer) {
        this.board = [];
        for (let i = 0; i < Board.width; i++) {
            for (let j = 0; j < Board.height; j++) {
                this.board.push(' ');
            }
        }
        this.curPlayer = initPlayer;
    }

    setBoard(x, y, val) {
        if (this.board[this.XYToInt(x, y)] == ' ') {
            this.board[this.XYToInt(x, y)] = val;
        }
    }

    getBoard(x, y) {
        return this.board[this.XYToInt(x, y)];
    }

    XYToInt(x, y) {
        return x + y * Board.width;
    }

    IntToXY(i) {
        let x = i % Board.width;
        let y = Math.floor(i / Board.height);
        return { x: x, y: y };
    }

    drawBoard() {
        stroke(0);
        strokeWeight(1);
        line(width / 3, 0, width / 3, height);
        line(2 * width / 3, 0, 2 * width / 3, height);
        line(0, height / 3, width, height / 3);
        line(0, 2 * height / 3, width, 2 * height / 3);

        noFill();
        rect(0, 0, width, height);

        strokeWeight(3);
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] != ' ') {
                let xy = this.IntToXY(i);
                let x = xy.x * Board.gridWidth, y = xy.y * Board.gridHeight;

                if (this.board[i] == 'X') {
                    let gridEndX = x + Board.gridWidth, gridEndY = y + Board.gridHeight;
                    line(x, y, gridEndX, gridEndY);
                    line(x, gridEndY, gridEndX, y);
                } else {
                    let gridCenterX = x + (width / Board.width / 2), gridCenterY = y + (height / Board.height / 2);
                    circle(gridCenterX, gridCenterY, Board.gridWidth);
                }
            }
        }

        //check for winner and draw line if there is one
        let winner = this.checkWinner();
        if (winner.winner != '') {
            strokeWeight(6);
            stroke(255, 0, 0);
            line(winner.x1, winner.y1, winner.x2, winner.y2);
        }
    }

    checkWinner() {
        let winnerObj = {
            winner: '',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };


        //horizontal check for win
        for (let i = 0; i < Board.height; i++) {
            let row = [];
            for (let j = 0; j < Board.width; j++) {
                row.push(this.getBoard(j, i));
            }
            if (row.every(e => e == row[0] && e != ' ')) {
                winnerObj.winner = row[0];
                winnerObj.x1 = 0;
                winnerObj.x2 = width;
                winnerObj.y1 = i * Board.gridHeight + Board.gridHeight / 2;
                winnerObj.y2 = winnerObj.y1;
                return winnerObj;
            }
        }

        //vertical check
        for (let i = 0; i < Board.width; i++) {
            let col = [];
            for (let j = 0; j < Board.height; j++) {
                col.push(this.getBoard(i, j));
            }
            if (col.every(e => e == col[0] && e != ' ')) {
                winnerObj.winner = col[0];
                winnerObj.y1 = 0;
                winnerObj.y2 = height;
                winnerObj.x1 = i * Board.gridWidth + Board.gridWidth / 2;
                winnerObj.x2 = winnerObj.x1;
                return winnerObj;
            }
        }

        //diagonal check
        let diag1 = [];
        for (let i = 0; i < Board.width; i++) {
            diag1.push(this.getBoard(i, i));
        }
        if (diag1.every(e => e == diag1[0] && e != ' ')) {
            winnerObj.winner = diag1[0];
            winnerObj.x1 = 0;
            winnerObj.y1 = 0;
            winnerObj.x2 = width;
            winnerObj.y2 = height;
            return winnerObj;
        }

        //other diagonal check
        let diag2 = [];
        for (let i = 0; i < Board.width; i++) {
            diag2.push(this.getBoard(i, Board.width - i - 1));
        }
        if (diag2.every(e => e == diag2[0] && e != ' ')) {
            winnerObj.winner = diag2[0];
            winnerObj.x1 = 0;
            winnerObj.y1 = height;
            winnerObj.x2 = width;
            winnerObj.y2 = 0;
            return winnerObj;
        }

        //check for draw by checking if all spaces are filled
        let draw = this.board.find(x => x == ' ') == undefined;
        if (draw) {
            winnerObj.winner = 'D';
            return winnerObj;
        }
        
        return winnerObj;
    }

    changePlayer() {
        this.curPlayer = this.curPlayer == 'X' ? 'O' : 'X';
    }

    evalTillEnd(n) {
        let newBoard = this.copyBoard();
        let wins = { 'X': 0, 'O': 0, 'D': 0 };
        for (let i = 0; i < n; i++) {
            newBoard = this.copyBoard();
            while (newBoard.checkWinner().winner == '') {
                let randomX = Math.floor(Math.random() * Board.width);
                let randomY = Math.floor(Math.random() * Board.height);
                while (newBoard.getBoard(randomX, randomY) != ' ') {
                    randomX = Math.floor(Math.random() * Board.width);
                    randomY = Math.floor(Math.random() * Board.height);
                }
                newBoard.setBoard(randomX, randomY, newBoard.curPlayer);
                newBoard.changePlayer();
            }
            wins[newBoard.checkWinner().winner]++;
        }
        return wins;
    }

    /**
     * 
     * @returns {Object.<string, Board>}
     */
    getAllNextStates() {
        let nextStates = {};
        for (let i = 0; i < Board.width; i++) {
            for (let j = 0; j < Board.height; j++) {
                if (this.getBoard(i, j) == ' ') {
                    let newBoard = this.copyBoard();
                    newBoard.setBoard(i, j, newBoard.curPlayer);
                    newBoard.changePlayer();
                    nextStates[i + ',' + j] = newBoard;
                }
            }
        }
        return nextStates;
    }

    copyBoard() {
        let newBoard = new Board(this.curPlayer);
        for (let i = 0; i < this.board.length; i++) {
            newBoard.board[i] = this.board[i];
        }
        return newBoard;
    }
}