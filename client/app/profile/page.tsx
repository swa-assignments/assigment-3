"use client"

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import styles from './styles.module.css';
import {useRouter} from "next/navigation";
import {fetchUserInformation, setFirstName, setLastName, updateUserInformation} from "@/app/redux/profileSlice";

function Profile() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Fetch info on the first render
    useEffect(() => {
        fetchUserInfo();
    }, [])

    // Fetch user information on page load from the server
    function fetchUserInfo() {
        dispatch(fetchUserInformation()).catch(() => {
            alert('An error occurred while fetching user information');
        });
    }

    // Update user information locally and on the server via Redux
    const updateUserLocal = (e) => {
        e?.preventDefault();

        dispatch(updateUserInformation())
            .then(() => {
                alert('User information updated');
            })
            .catch(() => {
                alert('An error occurred while updating user information');
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

            throw {
                message: 'Error logging out'
            };
        }).catch(() => {
            // TODO: add a pop-up instead of alert
            alert('Error logging out');
        });
    }

    return (
        <div className={styles.profileContainer}>
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
                    <button onClick={updateUserLocal}
                            className={styles.button}
                            type='button'>
                        Update profile
                    </button>
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
    );
}

export default Profile;