import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { CSSTransition } from 'react-transition-group'
import axios from  '../api/axios'
import { useNavigate } from 'react-router-dom'



const Header = () => {
  const location = useLocation()
  const {user,setAuth,setUser,setUserId,setNotes,isMenu,setIsMenu} = useAuth()
  const navigate = useNavigate()
  


  const logout = async () => {
    try{

      const response = await axios.get('/auth/logout')
   
      setAuth('')
      setUser('')
      setUserId('')
      setNotes([])
      setIsMenu(false)

      navigate('/login',{ state: { from: location }, replace: true })
     
    }catch(error){
      console.log(error)
    }
  }
   
  






  let current = location.pathname.length <= 1 

  return (
    <header className="public-header" >
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



        {user && location.pathname === '/dashboard' && 
         <div className='auth-link'>
            <p className='header-username'>{user}</p>
            <img className='profile-pic' src={require('../images/profile3.jpg')}/>
            <button className='menu-button' onClick={()=>{setIsMenu(prev => !prev)}}><img className='profile-menu' src={require('../images/menuButton.png')}/></button>
                       
            <CSSTransition  
                classNames='user-setting'
                timeout={{exit:500}}
                in={isMenu}
                unmountOnExit
                             
                >
                 <article className='user-setting'>
                    <div className='user-setting-container1'><img className='setting' src={require('../images/menuButtons/setting.png')}/><ul className='user-setting-1'>Settings</ul></div>
                    <div className='user-setting-container2'><img className='setofnotes' src={require('../images/menuButtons/setofnotes.png')}/><ul className='user-setting-2'>Set of Notes</ul></div>
                    <div className='user-setting-container3'><img className='feedback-button' src={require('../images/menuButtons/feedback.png')}/><ul className='user-setting-3'>Feedback</ul></div>
                    <div className='user-setting-container4' onClick={logout}><img className='logout-button' src={require('../images/menuButtons/logout.png')}/><ul className='user-setting-3'>Sign out</ul></div>
                 
                 </article>
           </CSSTransition>
          
         </div>
        }
     </header>
  )
}

export default Header