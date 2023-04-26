function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
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
    #lastClickHandler;
    #lastNode;
    constructor(bindingNode, value, column, row, cellsArray){
        super(bindingNode, value);
        this.column = column;
        this.row = row;
        this.cellsArray = cellsArray;
    }

    setNewClickEventListener(clickHandler){
        if (this.#lastClickHandler != undefined){
            this.bindingNode.removeEventListener('click', this.#lastClickHandler);
            if (this.#lastNode != undefined)
                this.#lastNode.removeEventListener('click', this.#lastClickHandler);
        }
        this.#lastClickHandler = clickHandler;
        this.bindingNode.addEventListener('click', clickHandler);
    }

    setNewNodeAndCoordinates(node, i, j) {
        this.#lastNode = this.bindingNode;
        if (node.textContent != ''){
            node.classList.add('game-field-container__cell_empty');
        }
        else{
            node.classList.remove('game-field-container__cell_empty');
        }
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

    set emptyCell(value){
        this.#emptyCell = value;
    }

    get emptyCell(){
        return this.#emptyCell;
    }

    #initCells() {
        const rowsCount = this.#rowsCount;
        const columnsCount = this.#columnsCount;
        let currentNode = document.createElement('div');
        for (let i = 0; i < columnsCount; i++) {
            let cellsRow = [];
            for (let j = 0; j < rowsCount; j++) {
                let currentCell;
                currentNode = document.createElement('div');
                currentNode.classList.add('game-field-container__cell');
                if (i==rowsCount-1 && j==columnsCount-1){
                    currentCell = new CellWithCoordinates(currentNode, null, i, j);
                    this.#emptyCell = currentCell;
                    currentNode.classList.add('game-field-container__cell_empty');
                }
                else{
                    currentCell = new CellWithCoordinates(currentNode, rowsCount*i+j+1, i, j);
                }
                const f = (event)=> {CellsUtilits.TrySwapCellAndEmptyCell(currentCell, gameField)};
                currentCell.setNewClickEventListener(f);
                cellsRow.push(currentCell);
                
            }
            this.cells.push(cellsRow);
        }
    }
}

class CellsUtilits{
    static TrySwapCellAndEmptyCell(cell, gameField){
        let emptyCell = gameField.emptyCell;
        if (this.CellsIsNearby(cell, emptyCell)){
            this.SwapCells(cell, emptyCell, gameField);
            return true;
        }
        else{
            return false;
        }
    }
    
    static SwapCells(cell1, cell2, gameField){
        let i1 = cell1.column;
        let j1 = cell1.row;
        let node1 = cell1.bindingNode;
        let i2 = cell2.column;
        let j2 = cell2.row;
        let node2 = cell2.bindingNode;
        let array = gameField.cells;
        
        let temp = array[i1][j1];
        array[i1][j1] = array[i2][j2];
        array[i2][j2] = temp;
        
        cell1.setNewNodeAndCoordinates(node2, i2, j2);
        cell2.setNewNodeAndCoordinates(node1, i1, j1);
        const f1 = (event)=> {CellsUtilits.TrySwapCellAndEmptyCell(cell1, gameField) };
        const f2 = (event)=> {CellsUtilits.TrySwapCellAndEmptyCell(cell2, gameField) };
        cell1.setNewClickEventListener(f1);
        cell2.setNewClickEventListener(f2);
        if (cell1.textContent == ''){
            gameField.emptyCell = cell1;
        }
        if (cell2.textContent == ''){
            gameField.emptyCell = cell2;
        }
    }

    static CellsIsNearby(cell1, cell2){
        let i1 = cell1.column;
        let j1 = cell1.row;
        let i2 = cell2.column;
        let j2 = cell2.row;
        if (i1==i2){
            if (j1+1==j2){
                return true;
            }
            if (j1-1==j2){
                return true;
            }
        }
        if (j1==j2){
            if (i1+1==i2){
                return true;
            }
            if (i1-1==i2){
                return true;
            }
        }
        return false;
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