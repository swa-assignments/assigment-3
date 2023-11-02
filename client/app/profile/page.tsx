"use client"

import React, {useEffect} from 'react';
// import {useDispatch} from "react-redux";

import styles from './styles.module.css';
import {useRouter} from "next/navigation";

function Profile() {
    // const dispatch = useDispatch();
    const router = useRouter();

    /* ------------------------------------------- */

    useEffect(() => {
        fetchUserInfo();
    }, [])

    /* ------------------------------------------- */

    function fetchUserInfo() {
        console.log('fetchUserInfo');
    }

    function updateUserLocal() {
        console.log('updateUserLocal');
    }

    function logout() {
        fetch('http://localhost:9090/logout?token=' + sessionStorage.getItem('token'), {
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
            // TODO: add a popoup instead of alert
            alert('Error logging out');
        });
    }

    return (
        <div className={styles.profileContainer}>
            <h1 className={styles.profileText}><b>Profile</b></h1>

            <form onSubmit={updateUserLocal} className={styles.profileForm}>
                <span><b>Id: </b>1 </span>
                <span><b>Username: </b>Boierul</span>
                <span style={{
                    marginBottom: '10px',
                }}><b>Is an admin?: </b> No
                </span>

                <label className={styles.label} htmlFor="input-firstName">First name</label>
                <input value="Dan"
                       className={styles.input} id='input-firstName' type="text"/>
                <label className={styles.label} htmlFor="input-lastName">Last name</label>
                <input value="Pintea"
                       className={styles.input} id='input-firstName' type="text"/>

                {/*<label htmlFor="input-favoriteGame">Favorite game</label>*/}
                {/*<input onChange={(e) => dispatch(setFavoriteGame(e.target.value))}*/}
                {/*       value={useSelector(state => state.profile.favoriteGame)}*/}
                {/*       className='border border-solid border-black mb-5' id='input-favoriteGame' type="text"/>*/}

                <div className={styles.profileButtonGroup}>
                    <button onClick={updateUserLocal}
                            className={styles.profileButton}
                            type='button'>
                        Update profile
                    </button>
                    <button onClick={() => window.location.href = '/board'}
                            className={styles.profileButton}
                            type='button'>
                        Back to the game
                    </button>
                    <button onClick={logout}
                            className={styles.profileButton}
                            type='button'>
                        Log out
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile;