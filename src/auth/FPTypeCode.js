
import { useNavigate,useLocation } from 'react-router-dom';
import React,{ useState, useEffect } from 'react';
import axios from '../api/axios'
import useAuth from '../hooks/useAuth';

const FPTypeCode = () => {

  const {setChangedPasswordNotice} = useAuth()
  const [resetCode,setResetCode] = useState('');
  const navigate = useNavigate() 
  const [userId,setUserId] = useState('')
  const location = useLocation()
  const [isChangingPassword,setIsChangingPassword] = useState(false)
  


  const [newPassword,setNewPassword] = useState('')
  const [confirmNewPassword,setConfirmNewPassword] = useState('')
  const [error,setError] = useState(null)

  console.log(resetCode)
  console.log(userId)

  useEffect(()=> { 
    
    const checkUser = async() => {
    
      try{
        const response = await axios.get(`/recovery/code/${location.search}`)
        setUserId(response.data)

         
      }
      catch(error){
        console.log(error)

        navigate('/forgotpassword',{ state: { from: location }, replace: true })
      }
    

      
    }

    checkUser()

  },[])



  const confirmCode = async (e) => {
     
    e.preventDefault()

    try{
      const foundRecoveryToken = await axios.post('/recovery/compareToken',{resetCode,userId})
      setError(null)
      console.log(foundRecoveryToken)

      setIsChangingPassword(true)
    }
    catch(error){

      console.log(error?.response?.data?.message)
      setError(error?.response?.data?.message)
    }
  }

  const changePassword = async (e) => { 

    e.preventDefault()

   
    if(newPassword === confirmNewPassword){
      try {
        
        const response = await axios.post('/recovery/changePassword',{resetCode,userId,newPassword,confirmNewPassword})
        setError(null)
        console.log(response)
        setChangedPasswordNotice(response?.data?.message)
        navigate('/login',{ state: { from: location }, replace: true })
    
      }catch(error){
        console.log(error) 
        setError(error?.response.data?.message)
      }
    }else {
       setError('password does not match')
    }
  }


  console.log(error)

  return (
    <div className="Main-forgot-Password"> 

        {userId && <form className="forgot-password-container" htmlFor='submitbutton' onSubmit={!isChangingPassword ? confirmCode : changePassword}>
          <div className="first-container">
             <h3>Reset password</h3>
          </div>
         
          
          <div className="first-container" style={{boxSizing:'border-box',flexDirection:'column',padding:'20px 0px 40px 30px'}}>
            <label style={{marginBottom:'20px',fontWeight:'300'}}>{!isChangingPassword ? 'We have sent a recovery code to your email, please verify it.' : 'Choose a new password' }</label>
            {!isChangingPassword ?<div style={{position:'relative'}}> <input className='code-container'
                        value={resetCode}
                        onChange={(e)=>{setResetCode(e.target.value)}}
                        name='resetCode'
                        placeholder='Enter your code here'
                />
                 <p style={{position:'absolute',bottom:'-40px',left:'55px',color:'red',fontSize:'0.8em'}}>{error}</p>
                 </div>: 
                <div style={{position:'relative'}}>
                  <input className='code-container'
                        value={newPassword}
                        onChange={(e)=>{setNewPassword(e.target.value)}}
                        name='newPassword'
                        placeholder='new password'
                        style={{marginBottom:'15px'}}
                        type='password'
                  />
                  <input className='code-container'
                        value={confirmNewPassword}
                        onChange={(e)=>{setConfirmNewPassword(e.target.value)}}
                        name='confirmNewPassword'
                        placeholder='Confirm new password'
                        type='password'
                  />
                  <p style={{position:'absolute',bottom:'-40px',left:'55px',color:'red',fontSize:'0.8em'}}>{error}</p>
                </div>               
                }   

          </div>
                 
      
          <div className="buttons-container">
               <button className="cancel-button" onClick={()=>{navigate('/login')}}>Cancel</button>
               <button name="submitbutton" className="search-button">Confirm</button>
          </div>          
        </form>}
    </div>
  )
}

export default FPTypeCode