import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    score: 0, tile: {row: -1, col: -1}, board: {board: []}, secondsLeft: 60, gameId: -1,
}

export const candyCrushSlice = createSlice({
    name: 'game', initialState, reducers: {
        setScore: (state, action) => {
            state.score = action.payload
        }, setTile: (state, action) => {
            state.tile = action.payload
        }, setBoard: (state, action) => {
            state.board = action.payload
        }, setSecondsLeft: (state, action) => {
            state.secondsLeft = action.payload
        }, setGameId: (state, action) => {
            state.gameId = action.payload
        }
    },
})