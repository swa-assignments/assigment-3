import {createSlice} from '@reduxjs/toolkit'

import * as Board from "@/app/model/board";
import {GeneratorFake2} from "@/app/model/generator";

const generator = new GeneratorFake2();

const initialState = {
    score: 0,
    tile:
        {
            row: -1,
            col: -1
        },
    board:
        {board: []},
    secondsLeft: 60,
    gameId: -1
}

export const candyCrushSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setScore: (state, action) => {
            state.score = action.payload
        },
        setTile: (state, action) => {
            state.tile = action.payload
        },
        setBoard: (state, action) => {
            state.board = action.payload
        },
        setSecondsLeft: (state, action) => {
            state.secondsLeft = action.payload
        },
        setGameId: (state, action) => {
            state.gameId = action.payload
        }
    }
})

export const {setScore, setTile, setBoard, setSecondsLeft, setGameId} = candyCrushSlice.actions

export const startNewGame = () => dispatch => {
    dispatch(setBoard(Board.create(generator, 6, 6)));
    dispatch(setSecondsLeft(60));
    dispatch(setScore(0));
    return fetch('http://localhost:9090/games?token=' + sessionStorage.getItem('token'), {
        method: 'POST'
    }).then((response) => {
        if (response.ok) {
            return response.json().then((_body) => {
                dispatch(setGameId(_body.id));
            });
        }
        throw {
            status: response.status,
        };
    });
}

export const handleSelectTile = (row, col) => (dispatch, state) => {
    if (state().game.tile.row === -1) {
        dispatch(setTile({row, col}));
    } else {
        if (Board.canMove(state().game.board,
            {
                row: state().game.tile.row,
                col: state().game.tile.col
            },
            {row, col})) {

            let moveResult = Board.move(generator, state().game.board,
                {
                    row: state().game.tile.row,
                    col: state().game.tile.col
                },
                {row, col});

            dispatch(setBoard(moveResult.board));
            dispatch(setScore(state().game.score + moveResult.effects.filter(effect => effect.kind === 'Match').length));
            dispatch(setTile({row: -1, col: -1}));

            return fetch('http://localhost:9090/games/' + state().game.gameId + '?token=' + sessionStorage.getItem('token'), {
                method: 'PATCH', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    score: state().game.score,
                }),
            })

        } else {
            dispatch(setTile({row, col}));
        }
    }
}

export const finishGame = () => (dispatch, state) => {
    return fetch('http://localhost:9090/games/' + state().game.gameId + '?token=' + sessionStorage.getItem('token'), {
        method: 'PATCH', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({
            score: state().game.score,
            completed: true,
        }),
    });
}

export default candyCrushSlice.reducer
