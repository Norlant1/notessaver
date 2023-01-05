import React from 'react'
import useResolution from '../../hooks/useResolution'
import {Outlet, NavLink,useNavigate } from 'react-router-dom'



const AdminContent = () => {

  const {isMobile} = useResolution()
  const navigate = useNavigate()
  


  return (
    <div className='admin-content-container'>
        <img className='backarrow-img' onClick={()=>{navigate('/dashboard')}} src={require('../../images/backarrow3.png')} />
        {!isMobile && <section className='admin-list'>
          <NavLink to='API-documentation' className={({isActive})=>{ return isActive ? 'each-list active' : 'each-list'}} >API Documentation</NavLink>
          <NavLink to='token-Handler' className={({isActive})=>{ return isActive ? 'each-list active' : 'each-list'}}>Token Handler</NavLink>
          <NavLink to='API-manual-request' className={({isActive})=>{ return isActive ? 'each-list active' : 'each-list'}}>API manual request</NavLink>
        </section>}
        <section className='admin-left-content' style={isMobile ? {padding:'70px 20px 0px 20px'}:{padding:'30px 40px'}}>
           <Outlet/>
        </section>
    </div>
  )
}

export default AdminContent