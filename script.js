function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function arraysAreEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
};

Number.prototype.mod = function (n) {
    "use strict";
    return ((this % n) + n) % n;
};
function compareNumeric(a, b) {
    if (a > b) return 1;
    if (a == b) return 0;
    if (a < b) return -1;
}

class CellsUtilits {
    swappingNow = false;
    async TrySwapCellAndEmptyCell(cell, gameField, animateDuration = 200) {
        let emptyCell = gameField.emptyCell;
        if (await this.CellsIsNearby(cell, emptyCell)) {
            await this.SwapCells(cell, emptyCell, gameField, animateDuration);
            return true;
        }
        else {
            return false;
        }
    }

    async SwapCells(cell1, cell2, gameField, animateDuration = 1000) {
        if (this.swappingNow)
            return;
        this.swappingNow = true;
        let i1 = cell1.row;
        let j1 = cell1.column;
        let node1 = cell1.bindingNode;
        let i2 = cell2.row;
        let j2 = cell2.column;
        let node2 = cell2.bindingNode;
        let array = gameField.cells;



        let temp = array[i1][j1];
        array[i1][j1] = array[i2][j2];
        array[i2][j2] = temp;

        let animator = new Animator(cell1, cell2, animateDuration);
        await animator.waitAnimation();

        cell1.setNewNodeAndCoordinates(node2, i2, j2, gameField);
        cell2.setNewNodeAndCoordinates(node1, i1, j1, gameField);
        if (cell1.textContent == '') {
            gameField.emptyCell = cell1;
        }
        if (cell2.textContent == '') {
            gameField.emptyCell = cell2;
        }
        gameField.CheckWin();
        this.swappingNow = false;

    }

    async CellsIsNearby(cell1, cell2) {
        let i1 = cell1.row;
        let j1 = cell1.column;
        let i2 = cell2.row;
        let j2 = cell2.column;
        if (i1 == i2 && (j1 + 1 == j2 || j1 - 1 == j2)) {
            return true;
        }
        if (j1 == j2 && (i1 + 1 == i2 || i1 - 1 == i2)) {
            return true;
        }
        return false;
    }
    lastDirection;
    async GetRandomCellAroundEmptyCell(gameField) {
        let emptyCell = gameField.emptyCell;
        let i = emptyCell.row;
        let j = emptyCell.column;
        let randomedCell;
        let directionsArray = ['up', 'right', 'down', 'left']
        let direction;
        while (randomedCell == undefined || randomedCell == emptyCell) {
            let randomNum = getRandomIntInclusive(0, 3);
            if (directionsArray[(randomNum + 2).mod(4)] == this.lastDirection)
                continue;
            direction = directionsArray[randomNum];
            switch (direction) {
                case 'up':
                    randomedCell = gameField.cells[i - 1];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j];
                    break;
                case 'right':
                    randomedCell = gameField.cells[i];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j + 1];
                    break;
                case 'down':
                    randomedCell = gameField.cells[i + 1];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j];
                    break;
                case 'left':
                    randomedCell = gameField.cells[i];
                    if (randomedCell != undefined)
                        randomedCell = randomedCell[j - 1];
                    break;
                default:
                    throw new Error();
            }
        }
        this.lastDirection = direction;
        return randomedCell;
    }
}


let globalCellUtilits = new CellsUtilits();


class Cell {
    #value;
    #bindingNode;
    constructor(bindingNode, value) {
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

class CellWithCoordinates extends Cell {
    column;
    row;
    #lastClickHandler;
    #lastNode;
    constructor(bindingNode, value, row, column, cellsArray) {
        super(bindingNode, value);
        this.column = column;
        this.row = row;
        this.cellsArray = cellsArray;
    }

    setNewClickEventListener(clickHandler) {
        if (this.#lastClickHandler != undefined) {
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
        if (node.textContent == '') {
            node.classList.add('game-field-container__cell_empty');
        }
        else {
            node.classList.remove('game-field-container__cell_empty');
        }
        this.row = i;
        this.column = j;
        const f1 = (event) => { globalCellUtilits.TrySwapCellAndEmptyCell(this, gameField) };
        this.setNewClickEventListener(f1);
    }
}

class GameVariation {
    winWordArray;
    rowsCount;
    columnsCount;
    getDisctiption() { }
}

class StandartGameVariation4x4 extends GameVariation {
    constructor() {
        super();
        this.columnsCount = 4;
        this.rowsCount = 4;
        this.winWordArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    }
    getDisctiption() { return '4х4, от 1 до 15'; }
}

class ElephantGameVariation4x4 extends GameVariation {
    constructor() {
        super();
        this.columnsCount = 4;
        this.rowsCount = 4;
        this.winWordArray = ['С', 'Л', 'О', 'Н', 'С', 'П', 'И', 'Т', 'С', 'Т', 'О', 'Я', 'А', 'В', 'Ы']
    }
    getDisctiption() { return '4х4, собрать фразу "Слон спит стоя. А вы?"'; }
}
class StandartGameVariation5x5 extends GameVariation {
    constructor() {
        super();
        this.columnsCount = 5;
        this.rowsCount = 5;
        this.winWordArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
    }
    getDisctiption() { return '5х5, от 1 до 24'; }
}
class EngToRusTranslate{
    static dictionary = {
        'StandartGameVariation4x4':'Вариация "1..15". Поле 4х4',
        'StandartGameVariation5x5':'Вариация "1..24". Поле 5х5',
        'ElephantGameVariation4x4':'Вариация "Слон". Поле 4х4',
    }
    static translate(engWord){
        let rusWord = this.dictionary[engWord];
        if (rusWord == undefined)
            return engWord;
        return rusWord;
    }
}
let gameVariations = [
    new StandartGameVariation4x4(),
    new ElephantGameVariation4x4(),
    new StandartGameVariation5x5(),
];
let selectorNode = document.getElementById('selectID');
for (let i = 0; i < gameVariations.length; i++) {
    let selectVariationNode = document.createElement('option');
    selectVariationNode.value = i + '';
    selectVariationNode.textContent = gameVariations[i].getDisctiption();
    selectorNode.append(selectVariationNode);
}
class Animator {
    constructor(cell1, cell2, animateDuration) {
        this.cell1 = cell1;
        this.cell2 = cell2;
        this.animateDuration = animateDuration;
    }

    // Метод для ожидания окончания анимации
    waitAnimation() {
        // Получаем элементы div ячеек
        let node1 = this.cell1.bindingNode;
        let node2 = this.cell2.bindingNode;

        // Получаем текущее положение элементов
        let startRect1 = node1.getBoundingClientRect();
        let startRect2 = node2.getBoundingClientRect();

        // Вычисляем расстояние, на которое должны переместиться элементы
        let xDiff = startRect2.left - startRect1.left;
        let yDiff = startRect2.top - startRect1.top;

        // Применяем начальное положение элементов
        node1.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
        node2.style.transform = `translate(${-xDiff}px, ${-yDiff}px)`;

        // Включаем анимацию
        node1.style.transition = `transform ${this.animateDuration}ms`;
        node2.style.transition = `transform ${this.animateDuration}ms`;

        // Возвращаем промис, который будет выполнен после окончания анимации
        return new Promise(resolve => {
            setTimeout(() => {
                node1.style.transition = "";
                node2.style.transition = "";
                node1.style.transform = "";
                node2.style.transform = "";
                resolve();
            }, this.animateDuration);
        });
    }
}

class ScoreSaver {
    gameField;
    constructor(gameField) {
        this.gameField = gameField;
    }
    SaveScore() {
        let name = '';
        while (true) {
            name = prompt('Enter your nickname:', 'user');
            if (name.trim() == '' || name == undefined) {
                alert('Bad name!');
                continue;
            }
            if (name.length > 8) {
                alert('Name lenght must be less or equal then 8!');
                continue;
            }
            break;
        }

        let attempts = ScoreLoader.GetAttemptsByNameAndVariation(name, this.gameField.gameVariationName);
        if (attempts == undefined)
            attempts = [];
        attempts.push(this.gameField.stepCount);
        let scoresByGamevariation = JSON.parse(localStorage.getItem(this.gameField.gameVariationName));
        if (scoresByGamevariation == undefined)
            scoresByGamevariation = new Object();
        scoresByGamevariation[`${name}`] = attempts;
        localStorage.setItem(this.gameField.gameVariationName, JSON.stringify(scoresByGamevariation))
    }
}

class ScoreLoader {
    static GetScores() {
        let scores = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let score = { key: key, players: JSON.parse(localStorage.getItem(key)) };
            scores.push(score);
        }
        return scores;
    }
    static GetAttemptsByNameAndVariation(name, gameVariation) {
        let scoresByGameVariation = JSON.parse(localStorage.getItem(gameVariation));
        if (scoresByGameVariation == undefined)
            return undefined
        return scoresByGameVariation[`${name}`];
    }
    static GetTopByGameVariations(gameVariation) {
        let gameVariationName = gameVariation.constructor.name;
        let scoresByGameVariation = JSON.parse(localStorage.getItem(gameVariationName));
        if (scoresByGameVariation == undefined)
            return undefined
        let attempsAndUserNames = []
        for (var key in scoresByGameVariation) {
            if (scoresByGameVariation.hasOwnProperty(key) == false)
                continue;
            for (var stepCount in scoresByGameVariation[key])
                attempsAndUserNames.push({ stepCount: scoresByGameVariation[key][stepCount], userName: key });
        }
        attempsAndUserNames.sort((a, b) => a.stepCount - b.stepCount);
        return attempsAndUserNames;
    }
    static GetTopByGameVariationsAndName(gameVariation, userName) {
        let gameVariationName = gameVariation.constructor.name;
        let scoresByGameVariationAndName = JSON.parse(localStorage.getItem(gameVariationName));
        if (scoresByGameVariationAndName == undefined)
            return undefined
        let attempsList = []
        let key = scoresByGameVariationAndName[userName];
        for (var stepCount in key)
            attempsList.push(key[stepCount]);
        attempsList.sort(compareNumeric);
        return attempsList;
    }
}

class GameField {
    #parentNode;
    #rowsCount;
    #columnsCount;
    #emptyCell;
    #cells = [];
    #winWordArray
    #gameStarted = false;
    #gameEnd = false;
    #stepCount = false;
    gameVariationName;
    constructor(parentNode, gameVariation = new StandartGameVariation4x4()) {
        this.gameVariationName = gameVariation.constructor.name;
        this.#winWordArray = gameVariation.winWordArray;
        this.#rowsCount = gameVariation.rowsCount;
        this.#columnsCount = gameVariation.columnsCount;
        this.#parentNode = parentNode;
        this.#parentNode.style.gridTemplateColumns = 'repeat(' + this.#columnsCount + ', 1fr)';
        this.#initCells();
        for (let i = 0; i < this.#rowsCount * this.#columnsCount; i++) {
            let column = i % this.#columnsCount;
            let row = Math.floor(i / this.#rowsCount);
            this.#parentNode.append(this.#cells[row][column].bindingNode);
        }
        let keyboardControl = new KeyboardControl(this);
        keyboardControl.Start();
    }

    get rowsCount() {
        return this.#rowsCount;
    }

    get stepCount() {
        return this.#stepCount;
    }

    get columnsCount() {
        return this.#columnsCount;
    }

    get cells() {
        return this.#cells;
    }

    set emptyCell(value) {
        this.#emptyCell = value;
    }

    get emptyCell() {
        return this.#emptyCell;
    }
    async StartGame() {
        await sleep(2000);
        for (let i = -0.5; i <= 0.5; i += 0.03) {
            let randomCell = await globalCellUtilits.GetRandomCellAroundEmptyCell(this);
            let animateDuration = (-(-i * i - 0.1)) * 1000;
            await globalCellUtilits.TrySwapCellAndEmptyCell(randomCell, this, animateDuration);
        }
        this.#gameStarted = true;
    }
    CheckWin() {
        if (this.#gameStarted !== true)
            return;
        if (this.#gameEnd === true) {
            alert('Game over!');
            return;
        }
        this.#stepCount++;
        let cellsTextContent = [];
        for (let i = 0; i < this.#columnsCount; i++) {

            for (let j = 0; j < this.#rowsCount; j++) {
                if (i == this.#rowsCount - 1 && j == this.#columnsCount - 1) {
                    break;
                }
                let currentCell = this.cells[i][j];
                cellsTextContent.push(currentCell.bindingNode.textContent);
            }
        }
        let result = arraysAreEqual(cellsTextContent, this.#winWordArray);
        if (result === true) {

            let scoreSaver = new ScoreSaver(this);
            scoreSaver.SaveScore();
            this.#gameEnd = true;
        }
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
                if (i == rowsCount - 1 && j == columnsCount - 1) {
                    currentCell = new CellWithCoordinates(currentNode, null, i, j);
                    this.#emptyCell = currentCell;
                    currentNode.classList.add('game-field-container__cell_empty');
                }
                else {
                    currentCell = new CellWithCoordinates(currentNode, this.#winWordArray[rowsCount * i + j], i, j);
                }
                const f = (event) => { globalCellUtilits.TrySwapCellAndEmptyCell(currentCell, this) };
                currentCell.setNewClickEventListener(f);
                cellsRow.push(currentCell);

            }
            this.cells.push(cellsRow);
        }
    }
}

class KeyboardControl {
    gameField;
    constructor(gameField) {
        this.gameField = gameField;
    }
    Start() {
        let keys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];
        document.onkeydown = (function (e) {
            if (keys.includes(e.key) === false)
                return;
            if (e.key == 'ArrowUp') {
                if (this.gameField.emptyCell.row <= 0)
                    return;
                let row = this.gameField.emptyCell.row - 1;
                let column = this.gameField.emptyCell.column;
                let swappingCell = this.gameField.cells[row][column];
                globalCellUtilits.TrySwapCellAndEmptyCell(swappingCell, this.gameField);
            }
            else if (e.key == 'ArrowRight') {
                if (this.gameField.emptyCell.column + 1 >= this.gameField.columnsCount)
                    return;
                let row = this.gameField.emptyCell.row;
                let column = this.gameField.emptyCell.column + 1;
                let swappingCell = this.gameField.cells[row][column];
                globalCellUtilits.TrySwapCellAndEmptyCell(swappingCell, this.gameField);
            }
            else if (e.key == 'ArrowDown') {
                if (this.gameField.emptyCell.row + 1 >= this.gameField.rowsCount)
                    return;
                let row = this.gameField.emptyCell.row + 1;
                let column = this.gameField.emptyCell.column;
                let swappingCell = this.gameField.cells[row][column];
                globalCellUtilits.TrySwapCellAndEmptyCell(swappingCell, this.gameField);
            }
            else if (e.key == 'ArrowLeft') {
                if (this.gameField.emptyCell.column <= 0)
                    return;
                let row = this.gameField.emptyCell.row;
                let column = this.gameField.emptyCell.column - 1;
                let swappingCell = this.gameField.cells[row][column];
                globalCellUtilits.TrySwapCellAndEmptyCell(swappingCell, this.gameField);
            }

        }).bind(this);
    }
}

class CanvasPointer {

    static renderChart(canvas, ctx, items) {
        let MAX_PERCENTAGE = items.at(-1).value;
        let Gap = {
            HORIZONTAL: 50,
            VERTICAL: 30
        }
        let BarCoordinate = {
            INITIAL_X: 80,
            INITIAL_Y: 220
        }
        let BarSize = {
            MAX_HEIGHT: 200,
            WIDTH: 30
        };
        let LabelCoordinate = {
            INITIAL_X: 30,
            INITIAL_Y: 100
        }
        let Font = {
            SIZE: `12px`,
            FAMILY: `Tahoma`
        };
        // Очищаем всю область холста
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.canvas.width  = '500';
        ctx.canvas.height = '300';

        //рисуем горизонталньые полоски
        let steps = 4;
        let heightStep = Math.floor(ctx.canvas.height / steps);
        let percentStep = Math.floor(MAX_PERCENTAGE / steps);
        ctx.fillStyle = '#000';
        ctx.font = `${Font.SIZE} ${Font.FAMILY}`;
        let currentHeight = 0;
        let currentPercent = 0;
        let startX = 20;
        for (; currentPercent <= MAX_PERCENTAGE; currentPercent+=percentStep, currentHeight+=heightStep) {
            const barHeight = (currentPercent * BarSize.MAX_HEIGHT) / MAX_PERCENTAGE;
            let currentY = BarCoordinate.INITIAL_Y-barHeight;
            ctx.fillRect(startX, currentY, ctx.canvas.width, -2);
            ctx.fillText(currentPercent, startX, currentY-4);
        }
        //Текст попытки
        ctx.translate(0, canvas.height);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Количество ходов', canvas.height/2.3, startX-5);
        ctx.rotate(Math.PI / 2);
        ctx.translate(0, -canvas.height);
        //ctx.restore();
        //
        let currentBarX = BarCoordinate.INITIAL_X;
        let currentLabelY = LabelCoordinate.INITIAL_Y;
        const gapBetweenBars = BarSize.WIDTH + Gap.HORIZONTAL;
        for (const item of items) {
            const barHeight = (item.value * BarSize.MAX_HEIGHT) / MAX_PERCENTAGE;
            ctx.fillStyle = item.color;
            ctx.font = `${Font.SIZE} ${Font.FAMILY}`;
            ctx.save();
            ctx.translate(0, canvas.height);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(item.name.toUpperCase(), LabelCoordinate.INITIAL_X, currentLabelY);
            ctx.restore();
            ctx.fillRect(currentBarX, BarCoordinate.INITIAL_Y, BarSize.WIDTH, -barHeight);
            currentBarX += gapBetweenBars;
            currentLabelY += gapBetweenBars;
        }
    }
    static getData(inputElements){
        return Array.from(inputElements).map((input, index) => ({
          name: input.userName,
          value: input.stepCount,
          color: `#9e297d`
        }));
    };
    static getDiagramNode(gameVariation) {
        let currentCanvasNode = document.createElement('canvas');
        const ctx = currentCanvasNode.getContext(`2d`);
        
        let a = ScoreLoader.GetTopByGameVariations(gameVariation);
        if (a == undefined || a == null)
            return '';
        let elements = this.getData(a.slice(0, 5));
        this.renderChart(currentCanvasNode, ctx, elements);
        //-------------
        return currentCanvasNode;
    }
}
let canvasContainer = document.getElementById('canvasContainer');
// for (let i = 0; i < gameVariations.length; i++) {
//     let gameVariation = gameVariations[i];
//     let diagramNode = CanvasPointer.getDiagramNode(gameVariation);
//     canvasContainer.append(diagramNode);

// }
let gameFieldNode = document.getElementById('parentNode');
let gameField1;
function startGameByButton() {
    let index = document.querySelector('#selectID').selectedIndex;
    document.querySelector('body > div.game-selector-container').style.display = 'none';
    gameField1 = new GameField(gameFieldNode, gameVariations[index]);
    gameField1.StartGame();
}

function fillStats() {
    let statContainer = document.querySelector('body > div.stat-container');
    let stats = ScoreLoader.GetScores();
    for (let i = 0; i < stats.length; i++) {
        let currentVariationStat = stats[i];
        let currentGameVariationNode = document.createElement('div');
        currentGameVariationNode.classList.add('stat-container__variation');
        let title = document.createElement('h2');
        title.textContent = EngToRusTranslate.translate(currentVariationStat.key);
        currentGameVariationNode.append(title);
        for (var userName in currentVariationStat.players) {
            if (currentVariationStat.hasOwnProperty(userName) == false) {
                let currentUserState = document.createElement('div');
                currentUserState.classList.add('man-and-attempts');
                let name = document.createElement('h1');
                name.textContent = userName;
                currentUserState.append(name);
                let attempts = currentVariationStat.players[userName]
                attempts.sort(compareNumeric);
                for (let j = 0; j < attempts.length; j++) {
                    let currentAttempNode = document.createElement('div');
                    currentAttempNode.textContent = attempts[j];
                    currentUserState.append(currentAttempNode);
                }
                currentGameVariationNode.append(currentUserState);
            }
        }
        statContainer.append(currentGameVariationNode);
        //debugger;
        let diagramNode = CanvasPointer.getDiagramNode(gameVariations[i]);
        statContainer.append(diagramNode);
    }
}

fillStats();