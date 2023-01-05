import React, { useState,useEffect } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { CSSTransition } from 'react-transition-group'
import axios from  '../api/axios'
import useResolution from '../hooks/useResolution'
import useAxios from '../hooks/useAxios'
import useError from '../hooks/useError'
import _arrayBufferToBase64 from '../util/renderImage'


const Header = () => {
  const location = useLocation()
  const {user,setAuth,
         setUser,setUserId,
         setNotes,
         isMenu,setIsMenu,
         setSetOfNotes,
         setIsMenuMobile,isMenuMobile,
         setHistoryState,
         dataImage,setDataImage,error,
         setIsLoading,isLoading,setUserRoles,userRoles
        } = useAuth()

  const navigate = useNavigate()
  const {isMobile} = useResolution()

  const {fetch,refreshToken} = useAxios()
  const {errorHandler} = useError()
  





 













  let loadedImages = null


  if(dataImage?.data){
      
    
      const base64String = _arrayBufferToBase64(dataImage.data?.img?.data?.data)
      loadedImages = <img src={`data:image/png;base64,${base64String}`} style={{marginLeft:'20px',borderRadius:'50px',height:'32px',width:'32px'}}/> 
    
  }











 

  const logout = async () => {
    try{

      const response = await axios.get('/auth/logout')
   
      setAuth('')
      setUser('')
      setUserId('')
      setNotes([])
      setIsMenu(false)
      setDataImage('')
      setIsLoading(true)
      setUserRoles([])
      

      navigate('/login',{ state: { from: location }, replace: true })
     
    }catch(error){
      console.log(error)
    }
  }


  const userSetting = () =>{
    setIsMenu(false)
    navigate('/settings/profile')
  }
   
  
  const mobileSettings = () => {


    if(!isMenuMobile){ 
      const state = { 'mobileMenu': true, name: 'mobileMenu' }
      setHistoryState(prev => {
         return {...prev,currentState:state.name,previousState:prev.currentState}
      })
      window.history.pushState(state, 'mobileMenu')
      setIsMenuMobile(true)
      document.body.style.overflow = "hidden"   
    }else{
      window.history.back()
    }
   
    
  }


  const pcSettings = () => {
    setIsMenu(prev => !prev)
  }

  const SetofNotes = () => {
    setSetOfNotes(true)
    setIsMenu(false)
  }

  const adminRoute = () => {
    navigate('/admin')
  }


  let current = location.pathname.length <= 1 

  return (
  
    <header className="public-header" >
         {userRoles.indexOf('admin') !== -1 && location.pathname === '/dashboard' && <div className='admin-box' style={!isMobile ? {}:{right:'110px'}} onClick={adminRoute}>
           <img className='admin-image' src={require('../images/admins.png')} />
           <label htmlFor="" className='admin-text'>admin</label>
         </div>}
         <article className='public-header-left'>
          <img className='note-header-icon' src={require('../images/main.png')} />
          <ul className='note-header-left-text'>NotePad Online_</ul>
         </article>
        
        {location.pathname === '/' && <h1 className="notes-saver-header" >Notes Saver</h1>}
         {current &&
         <div className='auth-link' >
           <Link className='header-link1' to='/login'><div>Sign In</div></Link>
           <Link className='header-link2' to='/register'><div>Sign Up</div></Link>
         </div>}



        {(user && location.pathname === '/dashboard' || location.pathname === '/dashboard/') && 
         <div className='auth-link'>
           {!isMobile && <p className='header-username'>{user}</p>}
           {!isMobile && !isLoading && loadedImages && !error ? loadedImages : !isMobile && !isLoading && !error && dataImage.status === 204 && <img src={require('../images/profile3.jpg')} style={{border:'5px solid #272727',borderRadius:'50px',marginLeft:'20px',borderRadius:'50px',height:'32px',width:'32px'}}/>}
            <button className='menu-button' onClick={!isMobile ? pcSettings : mobileSettings }><img className='profile-menu' src={require('../images/menuButton.png')}/></button>
                       
            <CSSTransition  
                classNames='user-setting'
                timeout={{exit:500}}
                in={isMenu}
                unmountOnExit
                             
                >
                 <nav className='user-setting'>
                    <div className='user-setting-container1' onClick={userSetting}><img className='setting' src={require('../images/menuButtons/setting.png')}/><ul className='user-setting-1'>Settings<i style={{fontSize:'0.8em'}}>&#40;In development&#41;</i></ul></div>
                    <div className='user-setting-container2' onClick={SetofNotes}><img className='setofnotes' src={require('../images/menuButtons/setofnotes.png')}/><ul className='user-setting-2'>Set of Notes</ul></div>
                    <div className='user-setting-container3'><img className='feedback-button' src={require('../images/menuButtons/feedback.png')}/><ul className='user-setting-3'>Feedback<i style={{fontSize:'0.8em'}}>  &#40;In development&#41;</i></ul></div>
                    <div className='user-setting-container4' onClick={logout}><img className='logout-button' src={require('../images/menuButtons/logout.png')}/><ul className='user-setting-3'>Sign out</ul></div>
                 
                 </nav>
           </CSSTransition>
          
         </div>
        }

      
     </header>
  )
}

export default Header