"use client";

import React, {useEffect} from 'react';

import {useRouter} from "next/navigation";

import styles from './styles.module.css';

const BoardView = () => {
    const router = useRouter();

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            router.push('/login');
        }
    }, []);


    return (
        (sessionStorage.getItem('token')) ? <div className={styles.boardContainer}>
            <h1>Play the game</h1>

            <button onClick={() => router.push("/profile")}
                    type='button'>
                View Profile
            </button>
        </div> : <></>
    )
}

export default BoardView;