import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from '../api/axios'
import { useRef } from "react"
import Profile from "../components/Settings/Profile"
import useAxios from "../hooks/useAxios"
import RotateLoader from "react-spinners/RotateLoader";

const ForgotPassword = () =>  {
   
  const {fetch} = useAxios()

  const [email,setEmail] = useState('')
  const navigate = useNavigate()
  const [userData,setUserData] = useState('')
  const [recoveryMethod,setRecoveryMethod] = useState({name:'',recoveryValue:''})
  const [firstScreen,setFirstScreen] = useState(false)
  const [isLoadingComponent,setIsLoadingComponent] = useState(false)

  const emailSelector = useRef(null)
  const smsSelector = useRef(null)

  const [dataImage,setDataImage] = useState('')
  const [isLoading,setIsLoading] = useState(true)
  const [error,setError] = useState(null)
  const [codeSent,setCodeSent] = useState(false)






  useEffect(()=> {
   
    const fetchImage = async() => {
      console.log('test')
      try{
        
        const response = await fetch('/upload/profileOptions','POST',{email:recoveryMethod?.recoveryValue})  
        setDataImage(response)

        console.log(response)
      } 
      catch(error){
        console.log(error)
         setError(error)
      }
      finally {
        setIsLoading(false)
      }


    }

    if(firstScreen)fetchImage()

  },[firstScreen])



console.log(firstScreen)




  const searchAccount = async (e) => { 

    try {
      
      e.preventDefault()
      const response = await axios.post('/user/user-email',{email})

      setUserData(response?.data)
      
      setRecoveryMethod(prev => {
         return {...prev,name:'email',recoveryValue:response?.data?.email}
      })
      setFirstScreen(true)
    }
    catch(error){
       
      console.log(error)
    }
  }

  
 const sendCode = async (e) => { 
  e.preventDefault()
   console.log('verification code sent')
  setIsLoadingComponent(true)
   
   try{
     const response = await axios.post('/recovery',{method:recoveryMethod.name,value:recoveryMethod.recoveryValue})
     
     setCodeSent(true)
     console.log(response)
     
     navigate(`recovery/code/?username=${response?.data?.username}&hash=${response?.data?._id}`)
     
   }catch(error){
     
    console.log(error)
   }
 }


console.log(codeSent)
  

  const setMethod = (e) => { 
           const {value,name} = e.target
    setRecoveryMethod(prev => {
       
      return {...prev,name,recoveryValue:value}
    })
  }


  const selector = () =>  { 
    smsSelector.current.focus()
   
  }

  const selector2 = () => {
    emailSelector.current.focus()
  }

  
 useEffect(()=> { 
  
 },[])



 let loadedImages = null


 if(dataImage?.data){
     
     const base64String = btoa(String.fromCharCode(...new Uint8Array(dataImage.data.img.data.data)))
     loadedImages = <img src={`data:image/png;base64,${base64String}`} style={{borderRadius:'50px',height:'100px',width:'100px'}}/> 
   
 }




  
  return( 
    <div className="Main-forgot-Password"> 
       
        <form className="forgot-password-container" htmlFor='submitbutton' onSubmit={!firstScreen ? searchAccount : sendCode}>
         {isLoadingComponent && 
         <div className="loading">
            <RotateLoader
              color={'#575757'}
              loading={isLoadingComponent}
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
              margin={1}
              cssOverride={{height:'10px'}}
            />
        </div>}
          <div className="first-container">
             <h3>{!userData ? 'Forgot Password?':'Reset your password'}</h3>
          </div>
          {!userData ? <>
          <div className="second-container">
             <p className="search-account">search your account</p>
          </div>
           
          <div className="input-container">
            <input type='text'
                   className="forgot-password-input"
                   value={email}
                   onChange={(e)=>{setEmail(e.target.value)}}
                   placeholder='Enter your email'
            />
          </div></>  

           : userData && !codeSent ? <div className="resetpassword-body">
            <fieldset className="choose-method">
             <legend style={{margin:'0px 0px 20px 10px',paddingTop:'10px',opacity:'95%'}}>Choose a recovery method</legend>
             <div className="email-recovery" onClick={selector2}>           
             <input className="recovery-option" 
                   name="email"
                   ref={emailSelector}                  
                   type='radio' 
                   value={userData?.email} 
                   onChange={setMethod}
                   onFocus={setMethod}
                   checked={recoveryMethod.recoveryValue === userData?.email}        
                  />

               <label style={{marginLeft:'40px',fontWeight:'300'}} htmlFor='email'>Send code via email</label>
               <p>{userData?.email}</p>
              </div>
  
              <div className="SMS-recovery"  onClick={selector} >       
                <input className="recovery-option" 
                  name="number"
                  ref={smsSelector}
                  type='radio' 
                  value={userData?.username}
                  onChange={setMethod} 
                  onFocus={setMethod}
                  checked={recoveryMethod.recoveryValue === userData?.username}
                  disabled
                  />
                    <label style={{marginLeft:'40px',opacity:'50%',fontWeight:'300'}} htmlFor='number'>Send code via SMS</label><br/>
                    <i style={{fontSize:'0.8em',marginLeft:'45px',opacity:'50%'}}> &#40;In development&#41;</i>
              </div>
              </fieldset>
              <div className="user-preview">
                {!isLoading && loadedImages && !error ? loadedImages : !isLoading && !error && dataImage.status === 204 && 
                <img src={require('../images/profile3.jpg')} style={{borderRadius:'50px',height:'100px',width:'100px'}}/>               
                }
                 <p>{userData?.username}</p>
              </div>
            </div>

            :<div>
                type your code
            </div>
          }
      
          <div className="buttons-container">
               <button className="cancel-button" onClick={()=>{navigate('/login')}}>Cancel</button>
               <button name="submitbutton" className="search-button">{!firstScreen ? 'Search':'Continue'}</button>
          </div>          
        </form>
        
    </div>
  )

}



export default ForgotPassword