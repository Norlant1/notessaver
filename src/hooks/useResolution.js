import React from 'react'
import { useState,useEffect } from 'react'


const useResolution = () => {


  const [isMobile,setIsMobile] = useState(false)
  const [resolution,setResolution] = useState(window.innerWidth)

  const updateReso = () => {
    setResolution(window.innerWidth)
  }

  useEffect(()=> {
    
    window.addEventListener('resize',updateReso)

    return ()=> window.removeEventListener('resize',updateReso)
  },[])


    
  useEffect(()=> {

    const changeDevice = () => {
    
      if(resolution <= 800 && !isMobile){
        setIsMobile(true)
        console.log('true limit')
      }
      
      if(resolution > 800 && isMobile){
        setIsMobile(false)
        console.log('false limit')
      }
  
     }
  
  
     changeDevice()
    
  },[resolution])
   



  return {isMobile}
}

export default useResolution