function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

function arraysAreEqual (a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

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

    setNewNodeAndCoordinates(node, i, j, gameField) {
        this.#lastNode = this.bindingNode;
        this.bindingNode = node;
        if (node.textContent == ''){
            node.classList.add('game-field-container__cell_empty');
        }
        else{
            node.classList.remove('game-field-container__cell_empty');
        }
        this.column = i;
        this.row = j;
        const f1 = (event)=> {CellsUtilits.TrySwapCellAndEmptyCell(this, gameField) };
        this.setNewClickEventListener(f1);
    }
}

class GameVariation{
    winWordArray;
    rowsCount;
    columnsCount;
    getDisctiption(){}
}

class StandartGameVariation4x4 extends GameVariation{
    constructor(){
        super();
        this.columnsCount = 4;
        this.rowsCount = 4;
        this.winWordArray = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']
    }
    getDisctiption(){return '4х4, от 1 до 15';}
}

class ElephantGameVariation4x4 extends GameVariation{
    constructor(){
        super();
        this.columnsCount = 4;
        this.rowsCount = 4;
        this.winWordArray = ['С','Л','О','Н','С','П','И','Т','С','Т','О','Я','А','В','Ы']
    }
    getDisctiption(){return '4х4, собрать фразу "Слон спит стоя. А вы?"';}
}
class StandartGameVariation5x5 extends GameVariation{
    constructor(){
        super();
        this.columnsCount = 5;
        this.rowsCount = 5;
        this.winWordArray = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
    }
    getDisctiption(){return '5х5, от 1 до 24';}
}

let gameVariations = [
    new StandartGameVariation4x4(),
    new ElephantGameVariation4x4(),
    new StandartGameVariation5x5(),
];
class Animator{
    cell1;
    cell2;
    constructor(cell1, cell2, speed){
        this.cell1 = cell1;
        this.cell2 = cell2;
        this.speed = speed;
    }
    #test(object){
        let current;
        let last;
        let direction;
    }
    #AnimateSwapCells(node1, node2, lastLeft1, lastTop1, lastLeft2, lastTop2){
        let topEnd1 = false;
        let topEnd2 = false;
        let leftEnd1 = false;
        let leftEnd2 = false;
        //debugger;
        node1.style.position = 'absolute';
        node2.style.position = 'absolute';
            let rect1 = node1.getBoundingClientRect();
            let rect2 = node2.getBoundingClientRect();
            let currentLeft1 = rect1.left;
            let currentTop1 = rect1.top;
            let currentLeft2 = rect2.left;
            let currentTop2 = rect2.top;
            //
            if (currentLeft1 < lastLeft2){
                currentLeft1 = Math.min(currentLeft1 + this.speed, lastLeft2);
                node1.style.left = currentLeft1+'px';
            }
            else if (currentLeft1 > lastLeft2){
                currentLeft1 = Math.max(currentLeft1 - this.speed, lastLeft2);
                node1.style.left = currentLeft1+'px';
            }
            if (currentLeft1 == lastLeft2){
                leftEnd1 = true;
            }
            //------------
            if (currentTop1 < lastTop2){
                currentTop1 = Math.min(currentTop1 + this.speed, lastTop2);
                node1.style.top = currentTop1+'px';
            }
            else if (currentTop1 > lastTop2){
                currentTop1 = Math.max(currentTop1 - this.speed, lastTop2);
                node1.style.top = currentTop1+'px';
            }
            if (currentTop1 == lastTop2){
                topEnd1 = true;
            }
            //------------
            if (currentTop2 < lastTop1){
                currentTop2 = Math.min(currentTop2 + this.speed, lastTop1);
                node2.style.top = currentTop2+'px';
            }
            else if (currentTop2 > lastTop1){
                currentTop1 = Math.max(currentTop2 - this.speed, lastTop1);
                node2.style.top = currentTop2+'px';
            }
            if (currentTop2 == lastTop1){
                topEnd2 = true;
            }
            //------------
            if (currentLeft2 < lastLeft1){
                currentLeft2 = Math.min(currentLeft2 + this.speed, lastLeft1);
                node2.style.left = currentLeft2+'px';
            }
            else if (currentLeft2 > lastLeft1){
                currentLeft2 = Math.max(currentLeft2 - this.speed, lastLeft1);
                node2.style.left = currentLeft2+'px';
            }
            if (currentLeft2 == lastLeft1){
                leftEnd2 = true;
            }
            //------------

        
            console.log(topEnd1, leftEnd1, leftEnd2, topEnd2);
        return topEnd1 == true && leftEnd1 == true && leftEnd2 == true && topEnd2 == true;
    }
    //(node1, node2, lastLeft1, lastTop1, lastLeft2, lastTop2)
    async waitAnimation() {//TODO
        let node1 = this.cell1.bindingNode;
        let node2 = this.cell2.bindingNode;
        let rect1 = node1.getBoundingClientRect();
        let rect2 = node2.getBoundingClientRect();
        let lastLeft1 = rect1.left;
        let lastTop1 = rect1.top;
        let lastLeft2 = rect2.left;
        let lastTop2 = rect2.top;
        await new Promise(resolve => {
          const interval = setInterval(() => {
            let animationIsEnd = this.#AnimateSwapCells(node1, node2, lastLeft1, lastTop1, lastLeft2, lastTop2);
            if (animationIsEnd) {
              resolve();
              clearInterval(interval);
            };
          }, 100);
        });
        node1.style = '';
        node2.style = '';
      }
}

class GameField{
    #parentNode;
    #rowsCount = 4;
    #columnsCount = 4;
    #emptyCell;
    #cells = [];
    #winWordArray
    constructor(parentNode, gameVariation = new ElephantGameVariation4x4()){
        
        this.#winWordArray = gameVariation.winWordArray;
        this.#rowsCount = gameVariation.rowsCount;
        this.#columnsCount = gameVariation.columnsCount;
        this.#parentNode = parentNode;
        this.#parentNode.style.gridTemplateColumns = 'repeat('+this.#columnsCount+', 1fr)';
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

    CheckWin(){
        let cellsTextContent = [];
        for (let i = 0; i < this.#columnsCount; i++) {
            
            for (let j = 0; j < this.#rowsCount; j++) {
                if (i==this.#rowsCount-1 && j==this.#columnsCount-1){
                    break;
                }
                let currentCell = this.cells[i][j];
                cellsTextContent.push(currentCell.bindingNode.textContent);
            }
        }
        let result = arraysAreEqual(cellsTextContent, this.#winWordArray);
        console.log(result);
        return result;
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
                    currentCell = new CellWithCoordinates(currentNode, this.#winWordArray[rowsCount*i+j], i, j);
                }
                const f = (event)=> {CellsUtilits.TrySwapCellAndEmptyCell(currentCell, this)};
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
    
    static SwapCells(cell1, cell2, gameField, speed = 50){
        let i1 = cell1.column;
        let j1 = cell1.row;
        let node1 = cell1.bindingNode;
        let i2 = cell2.column;
        let j2 = cell2.row;
        let node2 = cell2.bindingNode;
        let array = gameField.cells;

        // let animator = new Animator(cell1, cell2, speed);
        // animator.waitAnimation();
        
        let temp = array[i1][j1];
        array[i1][j1] = array[i2][j2];
        array[i2][j2] = temp;
        
        cell1.setNewNodeAndCoordinates(node2, i2, j2, gameField);
        cell2.setNewNodeAndCoordinates(node1, i1, j1, gameField);
        if (cell1.textContent == ''){
            gameField.emptyCell = cell1;
        }
        if (cell2.textContent == ''){
            gameField.emptyCell = cell2;
        }
        gameField.CheckWin();
    }

    static CellsIsNearby(cell1, cell2){
        let i1 = cell1.column;
        let j1 = cell1.row;
        let i2 = cell2.column;
        let j2 = cell2.row;
        if (i1==i2 && (j1+1==j2 || j1-1==j2)){
            return true;
        }
        if (j1==j2 && (i1+1==i2 || i1-1==i2)){
            return true;
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
let gameField1 = new GameField(gameFieldNode);