import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const ProtectedLayout = () => {



  

  return (
     <Outlet/>
  )
}

export default ProtectedLayout