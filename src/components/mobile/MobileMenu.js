import React, { useState,useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate,useLocation } from 'react-router-dom'
import axios from  '../../api/axios'
import useResolution from '../../hooks/useResolution'
import _arrayBufferToBase64 from '../../util/renderImage'


const MobileMenu = () => {
     
 const {isMenuMobile,
        user,setAuth,setUser,
        setUserId,setNotes,
        setIsMenu,setIsMenuMobile,
        setDataImage,dataImage,
        isLoading,setIsLoading,setUserRoles,
        error} = useAuth()

        

 const navigate = useNavigate()
 const location = useLocation()
 const {isMobile} = useResolution()

 const [isDropDown,setIsDropDown] = useState(false)





let loadedImages = null


if(dataImage?.data && isMobile){
    
    const base64String = _arrayBufferToBase64(dataImage.data?.img?.data?.data)
    loadedImages = <img src={`data:image/png;base64,${base64String}`} style={{borderRadius:'50px',height:'50px',width:'50px'}}/> 
  
}

















 const logout = async () => {
 
  try{

    const response = await axios.get('/auth/logout')
    
  
    setAuth('')
    setUser('')
    setUserId('')
    setNotes([])
    setIsMenu(false)
    document.body.style.overflow = "" 
    setIsMenuMobile(false)
    setDataImage('')
    setIsLoading(true)
    setUserRoles([])
    
     
    
    

    navigate('/login',{ state: { from: location }, replace: true })
   
  }catch(error){
    console.log(error)
  }
}


const userSetting = (e) =>{
   
  setIsMenuMobile(false)
  navigate(`/settings/${e.target.ariaValueText}`)
}




const showMobileSon = () => {
  

  document.body.style.overflow = ""
  setIsMenuMobile(false)
  navigate('/setofnotes')
  
}




  return (
    <div className={!isMenuMobile ? 'mobile-mainmenu' : 'mobile-mainmenu active'}>
         <div className={!isMenuMobile ? 'mobile-menu-blur' : 'mobile-menu-blur active' } onClick={()=>{ window.history.back()}}></div>
         <section className='mobile-menu-pane'>
            <article className='mobile-menu-pane-header'>
                <div className='mobile-profile-container'>{isMobile && !isLoading && loadedImages && !error ? loadedImages : isMobile && !isLoading && !error && dataImage.status === 204 && <img src={require('../../images/profile3.jpg')} style={{borderRadius:'50px',height:'50px',width:'50px'}}/>}</div>
                <div className='mobile-username-container'><p className='mobile-username-text'>{user}</p></div>
            </article>
            <article className='mobile-menu-pane-body'>
               <div className='mobile-each-list-settings' style={{position:'relative'}} onClick={()=>{setIsDropDown(prev => !prev)}}><img className='setting' src={require('../../images/menuButtons/setting.png')}/><p>Settings</p><img className='dropdown-icons' style={isDropDown ? {transform:'rotate(-90deg)'}:{}}  src={require('../../images/dropdownsymbol.png')}/> <i style={{fontSize:'0.8em'}}>  &#40;In development&#41;</i></div>
               {isDropDown && <div>
                  <label className='dropdown-choice' aria-valuetext='profile' onClick={userSetting}>Profile</label>
                  <label className='dropdown-choice' aria-valuetext='security' onClick={userSetting}>Security</label>
                  <label className='dropdown-choice' aria-valuetext='appearance' onClick={userSetting}>Appearance</label>
                </div>}
               <div className='mobile-each-list' onClick={showMobileSon}><img className='setofnotes' src={require('../../images/menuButtons/setofnotes.png')}/><p>Set of Notes</p></div>
               <div className='mobile-each-list'><img className='feedback-button' src={require('../../images/menuButtons/feedback.png')}/><p>Feedback</p></div>
               <div className='mobile-logout-container' onClick={logout}><img className='logout-button' src={require('../../images/menuButtons/logout.png')}/><p>logout</p></div>
            </article>
         </section>
      </div>
  )
}

export default MobileMenu