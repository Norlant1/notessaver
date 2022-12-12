import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate,useLocation } from 'react-router-dom'
import axios from  '../../api/axios'

const MobileMenu = () => {
     
 const {isMenuMobile,user,setAuth,setUser,setUserId,setNotes,setIsMenu,setIsMenuMobile,setIsMobileSonVisible} = useAuth()
 const navigate = useNavigate()
 const location = useLocation()

 const logout = async () => {
 
  try{

    const response = await axios.get('/auth/logout')
    
  
    setAuth('')
    setUser('')
    setUserId('')
    setNotes([])
    document.body.style.overflow = "" 
    setIsMenuMobile(false)
    
     
    
    

    navigate('/login',{ state: { from: location }, replace: true })
   
  }catch(error){
    console.log(error)
  }
}


const userSetting = () =>{
  
  setIsMenuMobile(false)
  navigate('/settings',{ state:{name: 'Settings' }, replace: true })

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
                <div className='mobile-profile-container'><img className='mobile-profile-pic' src={require('../../images/profile3.jpg')}/></div>
                <div className='mobile-username-container'><p className='mobile-username-text'>{user}</p></div>
            </article>
            <ul className='mobile-menu-pane-body'>
               <div className='mobile-each-list' onClick={userSetting}><img className='setting' src={require('../../images/menuButtons/setting.png')}/><p>Settings</p></div>
               <div className='mobile-each-list' onClick={showMobileSon}><img className='setofnotes' src={require('../../images/menuButtons/setofnotes.png')}/><p>Set of Notes</p></div>
               <div className='mobile-each-list'><img className='feedback-button' src={require('../../images/menuButtons/feedback.png')}/><p>Feedback</p></div>
               <div className='mobile-logout-container' onClick={logout}><img className='logout-button' src={require('../../images/menuButtons/logout.png')}/><p>logout</p></div>
            </ul>
         </section>
      </div>
  )
}

export default MobileMenu