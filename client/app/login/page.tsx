'use client'

import React, {useState} from 'react';

import * as Toast from '@radix-ui/react-toast';

import styles from './styles.module.css';
import {useRouter} from 'next/navigation';


function Login() {
    // Toast state
    const [open, setOpen] = useState(false);
    // Errors state
    const [error, setError] = useState<string>('');

    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const submitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (username.trim().length === 0 || password.trim().length === 0) {
            setError('Username and password cannot be empty');
        } else {
            fetch('http://localhost:9090/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                })
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json().then((data) => data);
                    }
                })
                .then((body) => {
                    sessionStorage.setItem('token', body.token);
                    sessionStorage.setItem('userId', body.userId);
                    router.push('/board');
                })
                .catch(() => {
                    setError('Wrong username or password');
                });
        }
    };

    function openModal() {
        setTimeout(() => {
            setOpen(false)
        }, 500);

        setTimeout(() => {
            setOpen(false)
        }, 4000);
    }

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.pageTitle}>Login</h1>
            <form onSubmit={submitLogin}>
                <label className={styles.label}>
                    Username
                    <input
                        className={styles.input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br/>
                <label className={styles.label}>
                    Password
                    <input
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <br/>

                <div className={styles.buttonsContainer}>
                    <Toast.Provider swipeDirection="right">
                        <button className={styles.button} type="submit" onClick={openModal}>
                            Login
                        </button>

                        <Toast.Root className={styles.ToastRoot} open={open} onOpenChange={openModal}>
                            <Toast.Title className={styles.ToastTitle}>
                                <span className={styles.ToastTitleErrorText}>ERROR:</span> {error ? error : ''}
                            </Toast.Title>
                        </Toast.Root>

                        <Toast.Viewport className={styles.ToastViewport}/>
                    </Toast.Provider>

                    <button className={styles.buttonText} type="button" onClick={() => router.push("/register")}>
                        Create account
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
