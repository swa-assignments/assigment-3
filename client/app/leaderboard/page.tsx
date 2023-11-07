"use client"

import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";

import styles from './styles.module.css';
import * as Toast from "@radix-ui/react-toast";

function Leaderboard() {
    const [games, setGames] = useState([]);
    const [username, setUsername] = useState('');

    // Toast state
    const [open, setOpen] = useState(false);
    // Errors state
    const [error, setError] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        // Redirect to log in if not logged in
        if (!sessionStorage.getItem('token')) {
            router.push('/login');
        }

        // Fetch the scores from the DB
        fetchAllGames();
    }, [])

    const fetchAllGames = () => {
        fetch('http://localhost:9090/games?token=' + sessionStorage.getItem('token'))
            .then((response) => {
                if (response.ok) {
                    return response.json().then((_body) => {
                        setGames(_body);
                    });
                }
            })
            .catch(() => {
                alert('Failed to fetch high scores');
            });
    }

    const fetchUserUsername = () => {
        fetch('http://localhost:9090/users/' + sessionStorage.getItem('userId') + '?token=' + sessionStorage.getItem('token'))
            .then((response) => {
                if (response.ok) {
                    return response.json().then((_body) => {
                        setUsername(_body.username);
                    });
                }
            })
            .catch(() => {
                alert('Failed to fetch username');
            });
    }

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
        setTimeout(() => {
            setOpen(true)
        }, 500);

        setTimeout(() => {
            setOpen(false)
        }, 4000);
    }

    return (
        games.length > 0
            ? <div className={styles.leaderboardsContainer}>

                <div className={styles.leaderboardsTable}>
                    <div className={styles.leaderboardsTableTop}>
                        <h2 className={styles.leaderboardsText}>World Top 10</h2>

                        <div className={styles.leaderboardsScores}>
                            {games.filter(game => game.completed)
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 10)
                                .map((game) => {
                                    return <span key={game.id} className={styles.leaderboardsTextTable}>
                                        <span className={styles.leaderboardsTextSecondaryTitle}>Score</span>
                                        <span className={styles.leaderboardsTextSecondary}>{game.score}</span>
                            </span>
                                })}
                        </div>
                    </div>

                    <div className={styles.leaderboardsTableTop}>
                        <h2 className={styles.leaderboardsText}>Personal Top 3</h2>

                        <div className={styles.leaderboardsScores}>
                            {games.filter(game => game.user === parseInt(sessionStorage.getItem('userId')) && game.completed)
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 3)
                                .map((game) => {
                                    return <span key={game.id} className={styles.leaderboardsTextTable}>
                                        <span className={styles.leaderboardsTextSecondaryTitle}>Score</span>
                                        <span className={styles.leaderboardsTextSecondary}>{game.score}</span>
                        </span>
                                })}
                        </div>
                    </div>

                    <Toast.Provider swipeDirection="right">

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
                            </Toast.Title>
                        </Toast.Root>

                        <Toast.Viewport className={styles.ToastViewport}/>
                    </Toast.Provider>

                    <div className={styles.logout}>
                        <button onClick={logout}
                                className={styles.logoutButton}
                                type='button'>
                            Log out
                        </button>
                    </div>
                </div>

                <div className={styles.leaderboardsButtonGroup}>
                    <button onClick={() => router.push('/board')}
                            className={styles.button}
                            type='button'>
                        Back to the game
                    </button>
                </div>
            </div> : <></>
    )
        ;
}

export default Leaderboard;