
import axios from '../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import jwtDecode from 'jwt-decode'

const useAxios = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { setError,setNotes,setIsMenu,
          setIsForbidden,
          auth,setAuth,
          setUser,setUserId,
          setCurrentSetofNotes,
          currentSetofNotes,
          setToggler,setFirstFetch,setUserRoles,setDataImage
        } = useAuth() 



        
  const config = {
    headers:{
     Authorization: `Bearer ${auth.accessToken}`
    } // setting config
 }
 


 

 
  const fetch = async (authRoute,method,data,token) => {   
    // setFirstFetch(false) // set firstFetch to true to not show error during loading of component

    const manualConfig = {
      headers:{
       Authorization: `Bearer ${token?.accessToken}`
      } // setting config
    }

    const mainConfig = token ? manualConfig : config
    
    
      if(method === 'GET'){
        var response = await axios.get(authRoute,mainConfig)
      }
      else if(method === 'POST'){
        var response = await axios.post(authRoute,data,mainConfig)
      }
       else if(method === 'PATCH'){
        var response = await axios.patch(authRoute,data,mainConfig)
       }
       else if(method === 'DELETE'){
        var response = await axios.delete(authRoute,{...mainConfig,data:{id:data}})
       }
        else{
         await Promise.reject('method is not recognized')
        }
        
        
       
        setIsForbidden(false)
        setError(null)
        setFirstFetch(true)
        


        return response  // return the data from response
    

    }

    const refreshToken = async (value,firstState,secondState)=> {
        
      try{

        const response = await axios.get('/auth/refresh')
        setAuth(response?.data)
        console.log('token refreshed')
        
        const userInfo = jwtDecode(response?.data?.accessToken)
        setUser(userInfo.userInfo.username) // set user if the page is rerendered
        setUserId(userInfo.userInfo.id)
        setUserRoles(userInfo.userInfo.roles)

        setCurrentSetofNotes(currentSetofNotes ? currentSetofNotes :userInfo.userInfo.activeSetofNotes) 
        // if rerendered, the currentSetofNotes will be empty and so we need to get the value from the decoded token
        
        
        
         
        

       
        
        setFirstFetch(false)
       
        !value && setToggler(prev => !prev) // refetch and rerender notes when request token succeeded

 
         
        return response.data 
      }catch(error){

        // clean state here


        console.log(error)
        const response = await axios.get('/auth/logout')
   
        console.log(response)
        setAuth('')
        setUser('')
        setUserId('')
        setNotes([])
        setIsMenu(false)
        setDataImage('')
        setUserRoles([])
        
    



        console.log(error)
          navigate('/login',{ state: { from: location }, replace: true })
         //send back to login page when token is refresh expired
      }
      finally {
         
        firstState && firstState(prev => !prev)
        secondState && secondState(prev => !prev)
      }
    }

    
    

  return {fetch,refreshToken}

}

export default useAxios