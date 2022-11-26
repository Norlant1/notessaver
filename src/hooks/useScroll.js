import React from 'react'
import { useState } from 'react'

const useScroll = () => {
  const [active,setActive] = useState(false)
  const [width,setWidth] = useState('')


  const onMouseMove = (e) => {
    if(active){
     setWidth(e.clientX)
   }
}
 

const setActives = (e) =>{
  if(e.target.className === 'drag-purpose' ){
    setActive(true)
  }
}

const setInactive = () =>{
  
  if(active){
    setActive(false)
  }
}


return {active,setActive,width,setWidth, onMouseMove,setActives,setInactive}


}

export default useScroll