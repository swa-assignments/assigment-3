"use client";
import {useRouter} from "next/navigation";

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import styles from './styles.module.css';
import {finishGame, handleSelectTile, setSecondsLeft, startNewGame} from "@/app/redux/gameSlice";

const BoardView = () => {
    const router = useRouter();

    const dispatch = useDispatch();

    const score = useSelector(state => state.game.score);
    const tile = useSelector(state => state.game.tile);
    const board = useSelector(state => state.game.board);
    const secondsLeft = useSelector(state => state.game.secondsLeft);

    useEffect(() => {
        // Redirect to log in if not logged in
        if (!sessionStorage.getItem('token')) {
            router.push('/login');
        }

        // Start the game on first render
        dispatch(startNewGame());
    }, []);

    useEffect(() => {
        console.log(board)
    }, [board]);


    return (
        (sessionStorage.getItem('token'))
            ? <div className={styles.boardContainer}>
                <h1>Candy Crush from Wish.com</h1>

                <div style={{
                    margin: '2rem',
                }}>
                    {board.board.map((row, rowIndex) =>
                        <div className={styles.boardTableContainer} key={'row' + rowIndex}>
                            {row.map((cell, colIndex) => (
                                <div
                                    key={'tile' + colIndex}
                                    className={`${styles.tile} ${rowIndex === tile.row && colIndex === tile.col ? styles.active : ''}`}
                                    onClick={() => {
                                        dispatch(handleSelectTile(rowIndex, colIndex));
                                        console.log(cell)
                                    }}>
                                    {cell}
                                </div>
                            ))}
                        </div>)}
                </div>

                {/*<button onClick={() => router.push("/profile")}*/}
                {/*        type='button'>*/}
                {/*    View Profile*/}
                {/*</button>*/}
            </div> : <></>
    )
}

export default BoardView;