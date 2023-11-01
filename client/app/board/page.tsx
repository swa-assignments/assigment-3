"use client";
import React from 'react';
import { useRouter} from "next/navigation";

const BoardView = () => {

  const router = useRouter();


  return(
  <div>
    <h1>Play the game </h1>
    
    <button onClick={()=>router.push("/profile")}
            type='button'>
            View Profile
    </button>
    </div>

  )
  

}

export default BoardView;