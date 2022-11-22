
import axios from '../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from './useAuth'
import jwtDecode from 'jwt-decode'

const useAxios = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { setError,
          isRefresh,setIsRefresh,
          setIsLoading,
          auth,setAuth,
          setUser,user,
          userId,setUserId
        } = useAuth() 



        
  const config = {
    headers:{
     Authorization: `Bearer ${auth.accessToken}`
    } // setting config
 }





 
  const fetch = async (authRoute,method,data) => {   
    
    try {
      if(method === 'GET'){
        var response = await axios.get(authRoute,config)
      }
      else if(method === 'POST'){
        var response = await axios.post(authRoute,data,config)
      }
       else if(method === 'PATCH'){
        var response = await axios.patch(authRoute,data,config)
       }
       else if(method === 'DELETE'){
        console.log(config)
        var response = await axios.delete(authRoute,{...config,data:{id:data}})
       }
        else{
         await Promise.reject('method is not recognized')
        }
        
        
        console.log(response?.data)
      

        const userInfo = jwtDecode(auth.accessToken)
        setUser(userInfo.userInfo.username) // set user if the page is rerendered
        setUserId(userInfo.userInfo.id)
       
        return response?.data    // return the data from response
    }catch(error){  
      
        setError(error)
        if(error?.response?.status !== 403){
          setIsRefresh(true) // if not 403, which means the token is not the problem and so we do not need to request a new token just to render error.
        }                    
      

        
    }finally{
      
        setIsLoading(false)
  
      }

    }

    const refreshToken = async ()=> {
        
      try{

        const response = await axios.get('/auth/refresh')
        setAuth(response?.data)
        console.log('refreshed')
        
        
     
        

        setError(null)
       
        setIsRefresh(true) 
         // set refresh to true after setting a new token to rerun the useEffect to refetch @Dashboard---codeline #25
        return response.data 
      }catch(error){

          navigate('/login',{ state: { from: location }, replace: true })
         //send back to login page when token is refresh expired
      }
    }


  return {fetch,refreshToken}

}

export default useAxios