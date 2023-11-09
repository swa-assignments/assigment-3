export type Generator<T> = { next: () => T }

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type Board<T> = {
    width: number,
    height: number,
    board: T[][],
};

export type Effect<T> = {
    kind: 'Match' | 'Refill',
    match?: Match<T>;
    board?: Board<T>,
};

export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {

    let isBoardOk = false;
    let grid = [];

    // while (!isBoardOk) {
    for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
            row.push({value: generator.next()});
        }
        grid.push(row);
    }

    // isBoardOk = isBoardWithoutAnyMatches(grid);
    // }

    const board: Board<T> = {
        width: width,
        height: height,
        board: grid,
    }

    return board;
}

export function piece<T>(board: Board<T>, p: Position): T | undefined {
    if (p.row < 0 || p.row >= board.height || p.col < 0 || p.col >= board.width) {
        return undefined;
    }
    return board.board[p.row][p.col]['value'];
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
    let boardCopy = JSON.parse(JSON.stringify(board));

    //checks out of bounds
    if (first.row < 0 || first.row >= boardCopy.height || first.col < 0 || first.col >= boardCopy.width ||
        second.row < 0 || second.row >= boardCopy.height || second.col < 0 || second.col >= boardCopy.width) {
        return false;
    }

    //checks if the tiles are either in the same column or same row
    let isRule1Ok = (first.row === second.row) || (first.col === second.col);


    if (isRule1Ok) {
        //swaps the tiles
        let tempTile = boardCopy.board[first.row][first.col];
        boardCopy.board[first.row][first.col] = boardCopy.board[second.row][second.col];
        boardCopy.board[second.row][second.col] = tempTile;

        // check if any rows with 3 same consecutive tiles
        for (let row of boardCopy.board) {
            if (is3SameTilesInRow(row)) {
                return true;
            }
        }

        //check if any columns with 3 same consecutive tiles
        let transposedGrid = transpose(boardCopy.board);
        for (let row of transposedGrid) {
            if (is3SameTilesInRow(row)) {
                return true;
            }
        }
    }
    return false;
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
    let boardCopy = JSON.parse(JSON.stringify(board));

    if (canMove(boardCopy, first, second)) {
        console.log('--------BEFORE MOVE')
        console.table(boardCopy.board);

        let tempTile = boardCopy.board[first.row][first.col];
        boardCopy.board[first.row][first.col] = boardCopy.board[second.row][second.col];
        boardCopy.board[second.row][second.col] = tempTile;

        console.log('--------AFTER MOVE')
        console.table(boardCopy.board);


        let initialMoveResult: MoveResult<T> = {
            board: boardCopy,
            effects: [],
        }

        return afterMove(generator, initialMoveResult);
    }

    return {
        board: board,
        effects: [],
    }
}

function afterMove<T>(generator: Generator<T>, moveResult: MoveResult<T>): MoveResult<T> {
    let moveResultLocal = moveResult;
    let shouldCheckForMatches = true;

    while (shouldCheckForMatches) {
        let moveResultAfterCheckForMatchesInRows = checkForMatchesInRows(moveResultLocal);
        let moveResultAfterCheckForMatchesInColumns = checkForMatchesInColumns(moveResultAfterCheckForMatchesInRows);

        console.log('--------AFTER FLAGGING ALL ELEMENTS THAT HAVE MATCHES')
        console.table(moveResultAfterCheckForMatchesInColumns.board.board);

        let moveAllMatchedElementsToTheTopResult = moveAllMatchedElementsToTheTop(moveResultAfterCheckForMatchesInColumns);
        let refillResult = refill(generator, moveAllMatchedElementsToTheTopResult);

        console.log('--------CHECK AGAIN FOR MATCHES AFTER REFILL')
        let moveResultAfterCheckForMatchesInRowsAfterRefill = checkForMatchesInRows(refillResult, false);
        let moveResultAfterCheckForMatchesInColumnsAfterRefill = checkForMatchesInColumns(moveResultAfterCheckForMatchesInRowsAfterRefill, false);

        shouldCheckForMatches = moveResultAfterCheckForMatchesInColumnsAfterRefill.board.board.some(row => row.some(tile => tile['isAMatch']));

        moveResultLocal = moveResultAfterCheckForMatchesInColumnsAfterRefill;
    }

    console.log(moveResultLocal.effects)

    return moveResultLocal;
}

function checkForMatchesInRows<T>(moveResult: MoveResult<T>, fireEvents = true): MoveResult<T> {
    let moveResultCopy = JSON.parse(JSON.stringify(moveResult));

    //check for any matches in rows, flag tiles that will be removed, fire event if match
    for (let i = 0; i < moveResultCopy.board.board.length; i++) {
        let flaggedRowCopyAndMatches = getArrayWithFlaggedElementsThatRepeatAtLeast3TimesInRowAndListOfMatches(moveResultCopy.board.board[i], i, false)
        moveResultCopy.board.board[i] = flaggedRowCopyAndMatches.array;
        for (let j = 0; j < flaggedRowCopyAndMatches.matches.length; j++) {

            if (fireEvents) {
                moveResultCopy.effects.push({kind: 'Match', match: flaggedRowCopyAndMatches.matches[j]});

                console.log('--------A ROW MATCH EVENT')
                console.log(flaggedRowCopyAndMatches.matches[j].matched)
                console.log(flaggedRowCopyAndMatches.matches[j].positions)
            }

        }
    }

    return moveResultCopy;
}

function checkForMatchesInColumns<T>(moveResult: MoveResult<T>, fireEvents = true): MoveResult<T> {
    let moveResultCopy = JSON.parse(JSON.stringify(moveResult));


    //check for any matches in columns and flag tiles that will be removed
    moveResultCopy.board.board.forEach(row => row.reverse());
    moveResultCopy.board.board = transpose(moveResultCopy.board.board);
    for (let i = 0; i < moveResultCopy.board.board.length; i++) {
        let flaggedRowCopyAndMatches = getArrayWithFlaggedElementsThatRepeatAtLeast3TimesInRowAndListOfMatches(
            moveResultCopy.board.board[i],
            moveResultCopy.board.board.length - 1 - i,
            true)
        moveResultCopy.board.board[i] = flaggedRowCopyAndMatches.array;
        for (let j = 0; j < flaggedRowCopyAndMatches.matches.length; j++) {
            if (fireEvents) {
                moveResultCopy.effects.push({kind: 'Match', match: flaggedRowCopyAndMatches.matches[j]});

                console.log('--------A COL MATCH EVENT')
                console.log(flaggedRowCopyAndMatches.matches[j].matched)
                console.log(flaggedRowCopyAndMatches.matches[j].positions)
            }
        }
    }
    moveResultCopy.board.board = transpose(moveResultCopy.board.board);
    moveResultCopy.board.board.forEach(row => row.reverse());

    return moveResultCopy;
}

function moveAllMatchedElementsToTheTop<T>(moveResult: MoveResult<T>): MoveResult<T> {
    let moveResultCopy = JSON.parse(JSON.stringify(moveResult));

    //make sure all tiles that have been matched are at the top
    moveResultCopy.board.board = transpose(moveResultCopy.board.board);
    for (let i = 0; i < moveResultCopy.board.board.length; i++) {
        let tempArray = [];
        for (let j = 0; j < moveResultCopy.board.board[i].length; j++) {
            if (moveResultCopy.board.board[i][j]['isAMatch']) {
                tempArray.push(moveResultCopy.board.board[i][j]);
                moveResultCopy.board.board[i].splice(j, 1);
                j--;
            }
        }
        moveResultCopy.board.board[i] = [...tempArray, ...moveResultCopy.board.board[i]];
    }
    moveResultCopy.board.board = transpose(moveResultCopy.board.board);

    console.log('--------AFTER MOVING ALL MATCHED ELEMENTS TO THE TOP')
    console.table(moveResultCopy.board.board);

    return moveResultCopy;
}

function refill<T>(generator: Generator<T>, moveResult: MoveResult<T>): MoveResult<T> {
    //replace all flagged tiles with new tiles from generator
    //TODO (i dont really understand the way it should be refilled, seems like refilling each row from bottom to top
    // , from left to right result in most test passing)

    let moveResultCopy = JSON.parse(JSON.stringify(moveResult));
    let anyRefillHappened = false;
    for (let i = moveResultCopy.board.board.length - 1; i >= 0; i--) {
        for (let j = 0; j < moveResultCopy.board.board[i].length; j++) {
            if (moveResultCopy.board.board[i][j]['isAMatch']) {
                delete moveResultCopy.board.board[i][j]['isAMatch'];
                moveResultCopy.board.board[i][j]['value'] = generator.next();
                anyRefillHappened = true;
            }
        }
    }

    if (anyRefillHappened) {
        moveResultCopy.effects.push({kind: 'Refill', board: moveResultCopy.board});
        console.log('--------REFILL EVENT')

        console.log('--------AFTER REFILL')
        console.table(moveResultCopy.board.board);
    }

    return moveResultCopy;
}

function is3SameTilesInRow(array): boolean {
    return array.some(function (a, i, aa) {
        return i > 1 && a.value === aa[i - 2].value && a.value === aa[i - 1].value;
    });
}

function transpose(array) {
    return array[0].map((col, c) => array.map((row, r) => array[r][c]));
}

function getArrayWithFlaggedElementsThatRepeatAtLeast3TimesInRowAndListOfMatches(array, otherColOrRowIndex, isCol = false) {
    let arrayCopy = JSON.parse(JSON.stringify(array));
    arrayCopy.push({value: 'rightBound'});

    let counter = 1;
    let checkedItem = arrayCopy[0];

    let allMatches = [];

    for (let i = 1; i < arrayCopy.length; i++) {
        if (arrayCopy[i].value === checkedItem.value) {
            checkedItem = arrayCopy[i];
            counter++;
            //
        } else {
            if (counter >= 3) {
                let arrayLoopedSoFar = arrayCopy.slice(0, i);
                let j = arrayLoopedSoFar.length - 1;

                let match = {
                    matched: arrayLoopedSoFar[j].value,
                    positions: []
                }

                while (j >= 0) {
                    if (arrayLoopedSoFar[j].value === checkedItem.value) {
                        arrayLoopedSoFar[j].isAMatch = true;
                        if (isCol) {
                            match.positions.push({row: j, col: otherColOrRowIndex});
                        } else {
                            match.positions.push({row: otherColOrRowIndex, col: j});
                        }
                        if (j === 0) {
                            match.positions.reverse();
                            allMatches.push(match);
                            break;
                        }
                        j--;
                    } else {
                        match.positions.reverse();
                        allMatches.push(match);
                        break;
                    }
                }
                arrayCopy.splice(0, arrayLoopedSoFar.length, ...arrayLoopedSoFar)
            }
            checkedItem = arrayCopy[i];
            counter = 1;
        }
    }
    arrayCopy.pop();
    return {array: arrayCopy, matches: allMatches};
}

function isBoardWithoutAnyMatches(grid) {
    let boardCopy = JSON.parse(JSON.stringify(grid));

    for (let row of boardCopy) {
        if (is3SameTilesInRow(row)) {
            return false;
        }
    }

    //check if any columns with 3 same consecutive tiles
    let transposedGrid = transpose(boardCopy);
    for (let row of transposedGrid) {
        if (is3SameTilesInRow(row)) {
            return false;
        }
    }

    return true;
}
