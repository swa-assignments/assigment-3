"use client"

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";

import styles from './styles.module.css';
import {fetchUserInformation, setFirstName, setLastName, updateUserInformation} from "@/app/redux/profileSlice";

import * as Toast from "@radix-ui/react-toast";

function Profile() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Toast state
    const [open, setOpen] = useState(false);
    // Errors state
    const [error, setError] = useState<string>('');
    // Success state
    const [success, setSuccess] = useState<string>('');

    // Check if the user is logged in on page load and fetch info on the first render
    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            router.push('/login');
        }

        fetchUserInfo();
    }, [])

    // Fetch user information on page load from the server
    function fetchUserInfo() {
        // If there is no token, do not fetch user information and redirect to login page (to avoid alert)
        if (!sessionStorage.getItem('token')) return;

        dispatch(fetchUserInformation()).catch(() => {
            setError('Failed fetching user information');
        });
    }

    // Update user information locally and on the server via Redux
    const updateUserLocal = (e) => {
        e?.preventDefault();

        openModal();

        dispatch(updateUserInformation())
            .then(() => {
                setSuccess('User information updated')
            })
            .catch(() => {
                setError('Something occurred while updating user information');
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
        (sessionStorage.getItem('token')) ? <div className={styles.profileContainer}>
                <h1 className={styles.profileText}><b>Profile</b></h1>

                <form onSubmit={updateUserLocal} className={styles.profileForm}>
                    <div className={styles.profileTexts}>
                        <span><b>Id</b> {sessionStorage.getItem('userId')} </span>
                        <span><b>Username</b> {useSelector(state => state.profile.username)} </span>
                        <span><b>Admin </b> {useSelector(state => state.profile.isAdmin).toString()} </span>
                    </div>

                    <label className={styles.label} htmlFor="input-firstName">
                        First name
                    </label>
                    <input
                        onChange={(e) => dispatch(setFirstName(e.target.value))}
                        value={useSelector(state => state.profile.firstName)}
                        className={styles.input} id='input-firstName'
                        type="text"/>

                    <label className={styles.label} htmlFor="input-lastName">
                        Last name
                    </label>
                    <input
                        onChange={(e) => dispatch(setLastName(e.target.value))}
                        value={useSelector(state => state.profile.lastName)}
                        className={styles.input} id='input-lastName' type="text"/>

                    <div className={styles.profileButtonGroup}>
                        <Toast.Provider swipeDirection="right">
                            <button onClick={updateUserLocal}
                                    className={styles.button}
                                    type='button'>
                                Update profile
                            </button>

                            <Toast.Root className={styles.ToastRoot} open={open} onOpenChange={openModal}>
                                <Toast.Title className={styles.ToastTitle}>
                                    {(error !== undefined || error !== null || error === '') && (
                                        <span className={styles.ToastTitleErrorText}>
                                            {error}
                                        </span>
                                    )}
                                    {(success !== undefined || success !== null || success !== '') && (
                                        <span className={styles.ToastTitleSuccessText}>
                                            {success}
                                        </span>
                                    )}
                                    {/*<span className={styles.ToastTitleErrorText}>ERROR:</span> {error ? error : ''}*/}
                                    {/*<span className={styles.ToastTitleSuccessText}>SUCCESS:</span> {success ? success : ''}*/}
                                </Toast.Title>
                            </Toast.Root>

                            <Toast.Viewport className={styles.ToastViewport}/>
                        </Toast.Provider>
                        <button onClick={() => router.push('/board')}
                                className={styles.button}
                                type='button'>
                            Back to the game
                        </button>
                    </div>

                    <div className={styles.logout}>
                        <button onClick={logout}
                                className={styles.logoutButton}
                                type='button'>
                            Log out
                        </button>
                    </div>
                </form>
            </div>
            :
            <></>
    );
}

export default Profile;