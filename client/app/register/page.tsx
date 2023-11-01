"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './styles.module.css';

const RegisterUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

        const submitCreateUser = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (username.trim().length === 0 || password.trim().length === 0) {
            alert('Username and password cannot be empty');
        } else {
            fetch('http://localhost:9090/users', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    username: username.trim(), password: password.trim()
                }),
            }).then((response) => {
                if (response.ok) {
                    return response.json().then((data) => data);
                }
                throw {};
            }).then((_body) => {
                return fetch('http://localhost:9090/login', {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({
                        username: _body.username, password: _body.password,
                    }),
                }).then((response) => {
                    if (response.ok) {
                        return response.json().then((data) => data);
                    }
                    throw {};
                }).then((_body) => {
                    sessionStorage.setItem('token', _body.token);
                    sessionStorage.setItem('userId', _body.userId);
                    router.push("/board")
                }).catch(() => {
                    alert('Error logging in');
                });
            }).catch(() => {
                alert('Error creating user');
            });
        }
    }

    return (
        <div className={ styles.registerUserContainer }>
            <h1 className = { styles.pageTitle }>Register page</h1>
            <form onSubmit={submitCreateUser}>
                <label className={ styles.label }>Username
                    <input className={ styles.input } value={ username } onChange={(e) => setUsername(e.target.value)} type="text" />
                </label>
                <br/>
                <label className={ styles.label }>Password
                    <input className={ styles.input } value={ password } onChange={(e) => setPassword(e.target.value)} type="password"/>
                </label>
                <br/>
                <button className={ styles.button } type="submit">Create profile</button>
            </form>
        </div>
    )
};

export default RegisterUser;