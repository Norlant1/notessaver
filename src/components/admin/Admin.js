import React from 'react'
import { useState,useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import useAxios from '../../hooks/useAxios'
import useError from '../../hooks/useError'
import AdminContent from './AdminContent'

const Admin = () => {

  const {userRoles,setFirstFetch} = useAuth()
  const {refreshToken} = useAxios()
  const [isLoading,setIsLoading] = useState(true)



  
  useEffect(()=> {

     refreshToken(true,setIsLoading,setFirstFetch) // first parameter set to true to not toggle 'Toggler'
                                     // second and third parameter are changes in after refreshToken is called regardless of the result   
     
    },[])
  




   return( 
    <div className='main-admin'>
      {userRoles.indexOf('admin') !== -1 && !isLoading && <AdminContent/>}
      {userRoles.indexOf('admin') === -1 && !isLoading && <p>Unauthorized</p>}
    </div>
   )
}

export default Admin