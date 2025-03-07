import React, { useEffect, useState } from 'react'

// import {useOnlineStatus} from '@tanstack/react-query';  // i can use this also if my mood changes both work same 

const InternetStatus = () => {
    const [ isOnline , setIsOnline] = useState(navigator.onLine);

    useEffect(()=>{
        const updateOnlineStatus = () =>{
            setIsOnline(navigator.onLine);
        }

        window.addEventListener('online',updateOnlineStatus);
        window.addEventListener('offline',updateOnlineStatus);

        return () =>{
            window.removeEventListener('online',updateOnlineStatus);
            window.removeEventListener('offline',updateOnlineStatus);   
        }

    },[])

    // const isOnline = useOnlineStatus();  //  i just perefer the above way for now for understanding the background working

  return (
   <>
     {!isOnline && (
        <div className='bg-red-500 text-white text-center p-2 fixed top-0 w-full z-50'>
            No Internet Connection
        </div>
     )}
   </>
  )
}

export default InternetStatus