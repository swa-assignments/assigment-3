'use client'
import React, { useState } from 'react';
import styles from './styles.module.css';

function LoginView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // handle login logic here
    };

    return (<div className={styles.loginContainer}>
<form onSubmit={handleSubmit}>
            <label className={styles.label}>
                Username:
                <input className={styles.input} type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <br />
            <label className={styles.label}>
                Password:
                <input className={styles.input} type="password" value={password} onChange={handlePasswordChange} />
            </label>
            <br />
            <button className={styles.button} type="submit">Login</button>
        </form>

    </div>
            );
}

export default LoginView;
