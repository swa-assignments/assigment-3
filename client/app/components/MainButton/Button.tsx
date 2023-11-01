import React from 'react';
import styles from "./styles.module.css"

function Button({ text, onClick }) {
    return (
        <button
            className={styles.mainButton}
            type="button"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;