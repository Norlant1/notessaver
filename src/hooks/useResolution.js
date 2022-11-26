import React from 'react'
import { useState,useEffect } from 'react'
import useAuth from './useAuth'

const useResolution = () => {

  const {setIsMenu} = useAuth()
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
        setIsMenu(false)
        
      }
      
      if(resolution > 800 && isMobile){
        setIsMobile(false)
      }
  
     }
  
  
     changeDevice()
    
  },[resolution])
   



  return {isMobile}
}

export default useResolution