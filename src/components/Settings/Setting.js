import React from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import useResolution from '../../hooks/useResolution'

const Setting = () => {

  const [currentLocation,setCurrentLocation] = useState('profile')
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const {isMobile} = useResolution()

 

  const changeLocation = (e) => {
   
  }

  const activeStyle = {opacity:'50%'}

  return (
    <div className='Main-Settings'>
        <img className='backarrow-img' onClick={()=>{navigate('/dashboard')}} src={require('../../images/backarrow3.png')} />
        {!isMobile && <section className='settings-list'>
          <NavLink to='profile' className={({isActive})=>{ return isActive ? 'each-list active' : 'each-list'}} >Profile</NavLink>
          <NavLink to='security' className={({isActive})=>{ return isActive ? 'each-list active' : 'each-list'}}>Security</NavLink>
          <NavLink to='appearance' className={({isActive})=>{ return isActive ? 'each-list active' : 'each-list'}}>Appearance</NavLink>
        </section>}
        <section className='setting-content' style={isMobile ? {padding:'70px 20px 0px 20px'}:{padding:'30px 40px'}}>
           <Outlet/>
        </section>
    </div>
  )
}

export default Setting