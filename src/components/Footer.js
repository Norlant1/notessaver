import React from 'react'
import useAuth from '../hooks/useAuth'

const Footer = () => {

  const {isMenuMobile} = useAuth()


  return (
    <footer className="public-footer" style={isMenuMobile ? {filter:'blur(3px)'} : {}} >
    ©2022 Joseph Benjamin Barrera.  All rights reserved.
   </footer>
  )
}

export default Footer