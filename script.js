class Cell{
    #value;
    #bindingNode;
    constructor(bindingNode, value){
        this.#value = value;
        this.bindingNode = bindingNode;
    }

    get bindingNode() {
        return this.#bindingNode;
    }

    set bindingNode(node) {
        this.#bindingNode = node;
        this.#bindingNode.textContent = this.#value;
    }
}

class GameField{
    #parentNode;
    #rowsCount = 4;
    #columnsCount = 4;
    #emptyCell;
    #cells = [];
    constructor(parentNode){
        this.#parentNode = parentNode;
        this.#initCells();
        for (let i = 0; i < this.#rowsCount * this.#columnsCount; i++){
            let column = i % this.#columnsCount;
            let row = Math.floor(i/this.#rowsCount);
            this.#parentNode.append(this.#cells[row][column].bindingNode);
        }
    }

    #initCells() {
        const rowsCount = this.#rowsCount;
        const columnsCount = this.#columnsCount;
        for (let i = 0; i < columnsCount; i++) {
            let cellsRow = [];
            for (let j = 0; j < rowsCount; j++) {
                let currentCell;
                let currentNode = document.createElement('div');
                currentNode.classList.add('game-field-container__cell');
                if (i==rowsCount-1 && j==columnsCount-1){
                    currentCell = new Cell(currentNode, null);
                    this.#emptyCell = currentCell;
                    currentNode.classList.add('game-field-container__cell_empty');
                }
                else{
                    currentCell = new Cell(currentNode, rowsCount*i+j+1);
                }
                cellsRow.push(currentCell);
                
            }
            console.log(cellsRow);
            this.#cells.push(cellsRow);
        }
    }
}

let gameFieldNode = document.getElementById('parentNode');
document.body.append(gameFieldNode);
let gameField = new GameField(gameFieldNode);
