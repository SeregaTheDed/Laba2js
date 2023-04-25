function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

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

class CellWithCoordinates extends Cell{
    column;
    row;
    constructor(bindingNode, value, column, row){
        super(bindingNode, value);
        this.column = column;
        this.row = row;
    }
    setNewNodeAndCoordinates(node, i, j) {
        this.bindingNode = node;
        this.column = i;
        this.row = j;
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

    get cells(){
        return this.#cells;
    }

    get emptyCell(){
        return this.#emptyCell;
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
                    currentCell = new CellWithCoordinates(currentNode, null, i, j);
                    this.#emptyCell = currentCell;
                    currentNode.classList.add('game-field-container__cell_empty');
                }
                else{
                    currentCell = new CellWithCoordinates(currentNode, rowsCount*i+j+1, i, j);
                }
                cellsRow.push(currentCell);
                
            }
            this.#cells.push(cellsRow);
        }
    }
}

class CellsUtilits{
    static #lock;

    static SwapCells(cell1, cell2){
        let cell1_i = cell1.column;
        let cell1_j = cell1.row;
        let cell1_node = cell1.bindingNode;
        let cell2_i = cell2.column;
        let cell2_j = cell2.row;
        let cell2_node = cell2.bindingNode;
        cell1.setNewNodeAndCoordinates(cell2_node, cell2_i, cell2_j);
        cell2.setNewNodeAndCoordinates(cell1_node, cell1_i, cell1_j);
    }

    static GetRandomCellAroundEmptyCell(gameField){
        let emptyCell = gameField.emptyCell;
        let i = emptyCell.column;
        let j = emptyCell.row;
        let randomedCell;
        while(randomedCell == undefined || randomedCell == emptyCell){
            let direction = ['up', 'right', 'down', 'left'][getRandomIntInclusive(0, 3)];
            switch (direction) {
                case 'up':
                    randomedCell = gameField.cells[i-1];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j];
                    break;
                case 'right':
                    randomedCell = gameField.cells[i];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j+1];
                    break;
                case 'down':
                    randomedCell = gameField.cells[i+1];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j];
                    break;
                case 'left':
                    randomedCell = gameField.cells[i];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j-1];
                    break;
                default:
                    throw new Error();
            }
        }
        return randomedCell;
    }
}

let gameFieldNode = document.getElementById('parentNode');
let gameField = new GameField(gameFieldNode);

let a = gameField.cells[0][1]; 
let b = gameField.cells[0][3];
CellsUtilits.SwapCells(a, b);
let c = CellsUtilits.GetRandomCellAroundEmptyCell(gameField);
console.log(c.bindingNode);
 