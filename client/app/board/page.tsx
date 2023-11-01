"use client";
import React from 'react';
import { useRouter} from "next/navigation";
import styles from './styles.module.css';

const BoardView = () => {

  const router = useRouter();


  return(
    <div className = { styles.boardContainer} >
    <h1>Play the game </h1>
    
    <button onClick={()=>router.push("/profile")}
            type='button'>
            View Profile
    </button>
    
    
    </div> )
  

}

export default BoardView;