import React from 'react'
import { useState } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import axios, { setToken } from '../api/axios'
import { decoded } from '../api/axios'


const Login = () => {
  
  const {setAuth} = useAuth()
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  const [error,setError] = useState('')
  const [counter,setCounter] = useState(0)
  const [LoggingIn,setLoggingIn] = useState(false)


  let isLoading = ['Log In','Logging In.','Logging In..','Logging In...']


  const handleLogin = async (e) => {
    e.preventDefault()
    
    
    if(!LoggingIn){
      setError('')
      setLoggingIn(true)  

    var animationInterval = setInterval(()=>{     
          setCounter(prev => prev <= 2 ? prev+1 : 1)    
      },500)
   
      }



    try{
      const response = await axios.post('/auth',{username,password})
      setAuth(response.data)
 
        
      setError(null)
      navigate('/dashboard')     
    }catch(error){

       clearInterval(animationInterval)
       setCounter(0)
       setLoggingIn(false)
       console.log(error?.response?.data)
       
       setError(error?.response?.data?.message)
    }
  }



  return (
    <div className='login' >    
       <form className='login-form' onSubmit={handleLogin}>
          <div className='login-header'><span>Notes Saver</span></div>
          <div className='first-login-content'>
            <label className='input-label' htmlFor="username">Email or Username</label><br/>
            <input type='text'
                  name="username"
                  value={username}
                  onChange={e=> setUsername(e.target.value)}
                  className='form-input'
                  autoFocus={true}
            />
          </div>
          <div className='second-login-content'>
            <label className='input-label' htmlFor="username">Password</label><br/>
            <input type='password'
                  name="password"
                  value={password}
                  onChange={e=> setPassword(e.target.value)}
                  className='form-input'
                  
            /> <br/>
            <Link  className='forgot-password' ><i>Forgot password?</i></Link> <br/>
            {error && <p className='errorLogin'>{error}</p>}
            <button className={!LoggingIn ? 'login-button':'login-button loggingIn'} >{isLoading[counter]}</button>
            <p className='dont-have'>Don't have an account?<Link to='/register' className='create-account' > Create an account</Link></p>
          </div>
       </form>
    </div>
  )
}

export default Login