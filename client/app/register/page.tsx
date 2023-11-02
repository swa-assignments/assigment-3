"use client"

import React, {useState} from "react";

import * as Toast from '@radix-ui/react-toast';

import styles from './styles.module.css';
import {useRouter} from "next/navigation";

const RegisterUser = () => {
    // Toast state
    const [open, setOpen] = useState(false);
    // Errors state
    const [error, setError] = useState<string>('');

    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submitCreateUser = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (username.trim().length === 0 || password.trim().length === 0) {
            setError('Username and password cannot be empty');
            // alert('Username and password cannot be empty'   );
        } else {
            fetch('http://localhost:9090/users', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(), password: password.trim()
                }),
            }).then((response) => {
                if (response.ok) {
                    return response.json().then((data) => data);
                }
            }).then((_body) => {
                return fetch('http://localhost:9090/login', {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: _body.username, password: _body.password,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        return response.json().then((data) => data);
                    }
                }).then((_body) => {
                    sessionStorage.setItem('token', _body.token);
                    sessionStorage.setItem('userId', _body.userId);
                    router.push("/board")
                }).catch(() => {
                    setError('Can not log in');
                });
            }).catch(() => {
                setError('Something is wrong');
            });
        }
    }

    function openModal() {
        setOpen(true)

        setTimeout(() => {
            setOpen(false)
        }, 4000);
    }

    return (
        <div className={styles.registerUserContainer}>
            <h1 className={styles.pageTitle}>Register</h1>
            <form onSubmit={submitCreateUser}>
                <label className={styles.label}>Username
                    <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)}
                           type="text"/>
                </label>
                <br/>
                <label className={styles.label}>Password
                    <input className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)}
                           type="password"/>
                </label>
                <br/>
                <div className={styles.buttonsContainer}>
                    <Toast.Provider swipeDirection="right">
                        <button className={styles.button} type="submit" onClick={openModal}>
                            Create profile
                        </button>

                        <Toast.Root className={styles.ToastRoot} open={open} onOpenChange={openModal}>
                            <Toast.Title className={styles.ToastTitle}>
                                <span className={styles.ToastTitleErrorText}>ERROR:</span> {error ? error : ''}
                            </Toast.Title>
                        </Toast.Root>

                        <Toast.Viewport className={styles.ToastViewport}/>
                    </Toast.Provider>
                </div>
            </form>
        </div>
    )
};

export default RegisterUser;