import { upload } from '@testing-library/user-event/dist/upload'
import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import useAxios from '../../hooks/useAxios'
import useError from '../../hooks/useError'
import _arrayBufferToBase64 from '../../util/renderImage'


const Profile = () => {

  const {fetch,refreshToken} = useAxios()
  const {errorHandler} = useError()
  

  const [dataImage,setDataImage] = useState('')
  const {userId,isForbidden,toggler,error} = useAuth()
  const [isLoading,setIsLoading] = useState(true)
  const [uploadImage,setUploadImage] = useState(undefined)



  useEffect(()=> {
   
    const fetchImage = async() => {
      try{
        
        const response = await fetch('/upload/profileId','POST',{id:userId})

        
        setDataImage(response)

      } 
      catch(error){
        errorHandler(error)
      }
      finally {
        setIsLoading(false)
      }


    }

    fetchImage()

  },[toggler])





  useEffect(()=> {

    if(isForbidden) refreshToken() // if error 403, request a new token 
     
    },[isForbidden])









  let loadedImages = null


  if(dataImage?.data){
      const base64String = _arrayBufferToBase64(dataImage.data?.img?.data?.data)
      loadedImages = <img src={`data:image/png;base64,${base64String}`} style={{borderRadius:'50px',height:'100px',width:'100px'}}/> 
    
  }

 
  const uploadProfile = async (e) => { 
    e.preventDefault()

    const config = {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
     };

    try{
      const response = await axios.post('/upload/uploadProfile',{name:`profile${userId}`,id:userId,'profile-image':uploadImage},config)
       
        setDataImage(response)
        setUploadImage(undefined)
        
      
    }catch(error){
      console.log(error)
    }

  } 

 
  const setImage = (e) =>  {
    setUploadImage(e.target.files[0])
  }


  return (
    <>
    {error && error }
    <div className='setting-profile-container'>
        <div className='profile-pic-container'>
        {!isLoading && loadedImages && !error ? loadedImages : !isLoading && !error && dataImage.status === 204 && <img className='main-Profile' src={require('../../images/profile3.jpg')}/>}
        </div>
         <form encType="multiform/form-data" onSubmit={uploadProfile}>
           <input type="file" name="profile-image" accept="image/*" onChange={setImage}/>
           {uploadImage && <input type="submit" value='save'/> }           
         </form>
    </div>
    </>
  )
}

export default Profile