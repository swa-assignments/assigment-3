'use client'
import React, { useState } from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const submitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (username.trim().length === 0 || password.trim().length === 0) {
            alert('Username and password cannot be empty');
        } else {
            fetch('http://localhost:9090/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json().then((data) => data);
                    }
                    throw {};
                })
                .then((body) => {
                    sessionStorage.setItem('token', body.token);
                    sessionStorage.setItem('userId', body.userId);
                    router.push('/board');
                    // navigate here
                })
                .catch(() => {
                    alert('Error logging in');
                });
        }
    };

    return (<div className={styles.loginContainer}>
<form onSubmit={submitLogin}>
            <label className={styles.label}>
                Username:
                <input className={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label className={styles.label}>
                Password:
                <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button className={styles.button} type="submit">Login</button>
            <button className={styles.button} onClick={() => router.push("/register")} type='button'>Register</button>
        </form>
    </div>
    );
}

export default Login;
