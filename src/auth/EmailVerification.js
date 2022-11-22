import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import { useParams } from 'react-router-dom'


const EmailVerification = () => {
  const params = useParams()


  const [currentMessage,setCurrentMessage] = useState('')
  
  useEffect(()=>{

    const verifyEmail = async() => {
      try {
       const response = await axiosInstance.get(`/verify/${params.id}/verifyaccount/${params.token}`)
        
       
       setCurrentMessage(response?.data?.message)
      }catch(error){
        setCurrentMessage(error?.response?.data?.message)
      }
      
    }

    verifyEmail()
  },[])



  return (
    <div className='verification-page'>{currentMessage}</div>
  )
}

export default EmailVerification