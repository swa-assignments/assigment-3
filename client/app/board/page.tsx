"use client";
import {useRouter} from "next/navigation";

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import styles from './styles.module.css';
import {finishGame, handleSelectTile, setSecondsLeft, startNewGame} from "@/app/redux/gameSlice";

import * as Toast from "@radix-ui/react-toast";

const BoardView = () => {
    // Modal - Game over
    const [game, setGame] = useState<string>('');
    // Errors state
    const [error, setError] = useState<string>('');
    // Toast state
    const [open, setOpen] = useState(false);

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

    // useEffect(() => {
    //     console.log(board)
    // }, [board]);

    useEffect(() => {
        if (secondsLeft > 0) {
            setTimeout(() =>
                dispatch(setSecondsLeft(secondsLeft - 1)), 1000);
        } else {
            dispatch(finishGame())
                .then(() => {
                    setGame('Game over');
                });
        }
    }, [secondsLeft]);

    function logout() {
        fetch('http://localhost:9090/logout?token='
            + sessionStorage.getItem('token'),
            {
                method: 'POST'
            }).then((response) => {

            if (response.ok) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userId');
                router.push('/login');
                return;
            }
        }).catch(() => {
            setError('Logging out failed');
        });
    }

    function openModal() {
        setOpen(true)

        setTimeout(() => {
            setOpen(false)
        }, 4000);
    }


    return (
        (sessionStorage.getItem('token')) ? <div className={styles.boardPage}>
            {/*<h1>Candy Crush from Wish.com</h1>*/}

            <div className={`${styles.boardContainer} ${secondsLeft <= 0 ? styles.active : ''}`}>
                {board.board.map((row, rowIndex) =>
                    <div className={styles.boardTableContainer}
                         key={'row' + rowIndex}>
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

            <div className={styles.statsContainer}>
                <div>
                    <div className={styles.secondsContainer}>
                        <span>Seconds left: </span>
                        {secondsLeft}
                    </div>

                    <div className={styles.scoreContainer}>
                        <span>Score: </span>
                        {score}
                    </div>
                </div>

                <div className={styles.buttonsContainer}>
                    <button
                        className={styles.boardButton}
                        onClick={() => router.push("/leaderboard")}
                        type='button'>
                        View high scores
                    </button>

                    <button
                        className={styles.boardButton}
                        onClick={() => router.push("/profile")}
                        type='button'>
                        View Profile
                    </button>
                </div>

            </div>

            {(secondsLeft <= 0) &&
                <button className={styles.playAgainButton} type="button" onClick={() => dispatch(startNewGame())}>
                    Play again
                </button>
            }

            {secondsLeft <= 0 && (
                <div className={styles.gameOver}>
                    <h1>{game}</h1>
                </div>
            )}
            <Toast.Provider swipeDirection="right">
                <div className={styles.logout}>
                    <button onClick={logout}
                            className={styles.logoutButton}
                            type='button'>
                        Log out
                    </button>
                </div>

                <Toast.Root className={styles.ToastRoot} open={open} onOpenChange={openModal}>
                    <Toast.Title className={styles.ToastTitle}>
                        {(error != null && error !== '') && (
                            <>
                                            <span className={styles.ToastTitleErrorText}>
                                                Error: <b/>
                                            </span>
                                {error ? error : ''}
                            </>
                        )}
                        {/*{(game !== '') && (*/}
                        {/*    <>*/}
                        {/*                <span className={styles.ToastTitleErrorText}>*/}
                        {/*                    GAME OVER: <b/>*/}
                        {/*                </span>*/}
                        {/*        {game ? game : ''}*/}
                        {/*    </>*/}
                        {/*)}*/}
                    </Toast.Title>
                </Toast.Root>

                <Toast.Viewport className={styles.ToastViewport}/>
            </Toast.Provider>

        </div> : <></>
    )
}

export default BoardView;