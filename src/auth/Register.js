import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from '../api/axios'




const Register = () => {


  const [email,setEmail] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [signingUp,setSigningUp] = useState(false)
  const [counter,setCounter] = useState(0)
  const [isVerify,setVerify] = useState(false)

  let isLoading = ['Sign Up','Signing Up.','Signing Up..','Signing Up...']

  const navigate = useNavigate()
  
  const [error,setError] = useState('')
 

console.log(counter)
   
  const handleRegister = async (e) => {
   setVerify(false) 
   setError(null)
    e.preventDefault()  
 
    if(!signingUp){

      setSigningUp(true)  

    var animationInterval = setInterval(()=>{     
          setCounter(prev => prev <= 2 ? prev+1 : 1)    
      },500)
   
      }
     

    try{
     

       const response = await axios.post('/user',{email,username,password,confirmPassword})
       console.log(response)
       setError(null)

         
  
         setVerify(true)
         clearInterval(animationInterval)
         setCounter(0)
         setEmail('')
         setUsername('')
         setPassword('')
         setConfirmPassword('')
         setSigningUp(false)
      

  
    }catch(error){
  
      clearInterval(animationInterval)
      setCounter(0)
      setSigningUp(false)

      console.log(error)
      if(error?.response?.data?.message){
        setError(error.response.data.message)
      }
      else if(error?.response?.status === 400){

        const err = error?.response?.data
        if(err.includes('username')  && err.includes('alpha-numeric'))setError('username length must be at least 3 characters long')
        if(err.includes('username'))setError('username must not have a symbol')
        if(err.includes('email'))setError('Invalid email')
        if(err.includes('[ref:password]'))setError('password does not match')
        if(err.includes('\"password\" length must be at least 7 characters long'))setError('password length must be at least 7 characters long')

      }



      else if(error?.message === 'Network Error'){
        setError(error?.message)
      }
      else if(error?.message && !error?.response?.data){
        setError('error')
     }

    }

 console.log(error)
    
  }

  return (
  
    <div className='register' >    
       <form className='register-form' onSubmit={handleRegister}>
          <div className='register-header'><span>Notes Saver</span></div>        
          <div className='first-register-content'>
            <label className='input-label' htmlFor="email">Email or Phone number</label><br/>
            <input type='text'
                  name="email"
                  value={email}
                  onChange={e=> setEmail(e.target.value)}
                  className='form-input'
                  autoFocus={true}
                
            />    
          </div>
          <div className='second-register-content'>
            <label className='input-label' htmlFor="username">Username</label><br/>
            <input type='text'
                  name="username"
                  value={username}
                  onChange={e=> setUsername(e.target.value)}
                  className='form-input'
                  
            />
          </div>
          <div className='third-register-content'>
            <label className='input-label' htmlFor="username">Password</label><br/>
              <input type='password'
                    name="password"
                    value={password}
                    onChange={e=> setPassword(e.target.value)}
                    className='form-input'
                    
              /> 
          </div>
          <div className='fourth-register-content'>
            <label className='input-label' htmlFor="confirmPassword">Confirm Password</label><br/>
            <input type='password'
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e=> setConfirmPassword(e.target.value)}
                  className='form-input'
                  autoFocus={true}
            />    
          </div>
          <div className='register-container'>          
            {error && <p className='errorLogin'>{error}</p>}
            {isVerify && <p className='registered'>An Email sent to your account please verify it</p>}
            <button className={signingUp ? 'register-button signingup':'register-button'} >{isLoading[counter]}</button>
            <p className='dont-have'>already have an account?<Link to='/login' className='create-account' > Login my account</Link></p>
          </div>
       </form>
    </div>
  
  )
}

export default Register