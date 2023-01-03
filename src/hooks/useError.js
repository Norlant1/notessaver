import useAuth from "./useAuth"

const useError = () => {


  const {setError,setIsForbidden,firstFetch} = useAuth()


  const errorHandler = (error) => {
    // 403 errors
   if(error?.response?.status === 403 && firstFetch){
     setIsForbidden(true)
    
     // error 403 which means the token is expired in first fetch, therefore we will refetch access token by setting isForbiden to true. 
   } 
   else if(error?.response?.status === 403 && !firstFetch){
     setIsForbidden(false)
     //somehow error is still 403 even after getting a new token, therefore we need set it to false to avoid further request token
   }
  
  
  
  
  
   // 2 CONDITIONS TO SET ERROR AND RENDER IT 
   // first condition is for error that is not 403 in which we want to render error immediately and not request a new token 
   // second condition is 403 error, when it refreshed new token but somehow it still throwing 403 error. one example of this is delay in hook and using still using the expired token   
   // meeting of any conditions will set an error to render in page
   if(error?.response?.status !== 403 && firstFetch || error?.response?.status === 403 && !firstFetch){
     
  
   console.log('error has been set')
   if(error?.response?.status === 403){
     setError(error?.response?.statusText)
             
   }
   else if(error?.response?.status && !error?.message !== 'Network Error'){
     setError(error?.response?.statusText)
         
       // if not 403, which means the token is not the problem and so we do not need to request a new token just to render error.
   }
   else if(error?.message){
       setError(error.message)
     
       console.log('this')
   } 
   else {
     setError('error')
   } 
   }
  }
  

  return {errorHandler}

}



export default useError