import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import EachSet from '../Setofnotes/EachSet'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { updateSetsOfNotesLocally } from '../../util/setter'

const MobileSetOfNotes = () => {

   const [title,setTitle] = useState('')
   const [isCreateMode,setIsCreateMode] = useState(false) 
   const [sonError,setSonError] = useState('')
   const [allSetsOfNotes,setAllSetsOfNotes] = useState('')
   const [temp,setTemp] = useState('')
   const [updateSONToggle,setUpdateSONToggle] = useState(false)
   const [createSONToggle,setCreateSONToggle] = useState(false)

   const navigate = useNavigate()
   


   const {currentSetofNotes,setCurrentSetofNotes,
          auth,
          firstFetch,setFirstFetch,
          isForbidden,setIsForbidden,
          error,setError,
          isLoading,setIsLoading,
        toggler,userId
         } = useAuth()
   
   
   const {fetch,refreshToken} = useAxios()

   

   
   useEffect(()=> {
     
    const getSetOfNotes = async () => { 
     try{
      
        const SON = await fetch('/setofnotes','GET')
        setAllSetsOfNotes(SON)
      

     }catch(error){
       
      if(error?.response?.status === 403 && firstFetch){
        setIsForbidden(true)
      } // to rerender component
      else if(error?.response?.status === 403 && !firstFetch){
        setIsForbidden(false)
      }
      // 403 errors
 
      // first condition is for error that is not 403 in which we want to render error immediately and not request a new token 
      // second condition is 403 error, when it refreshed new token but somehow it still throwing 403 error. one example of this is delay in hook
      
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

     finally{
      setIsLoading(false)
     }
  

    }
    

    getSetOfNotes()

   },[toggler])




   useEffect(()=> {
  

    if(isForbidden) refreshToken()

   },[isForbidden])











   const changeSON = async ({_id},value) => {
     
    
    try{
      setTemp(_id)
      const currentSON = await fetch('/user','PATCH',{SetOfNotesId:_id})
      setCurrentSetofNotes(currentSON.activeSetofNotes) 
      navigate('/dashboard')
      
    }
    catch(error){

      if(error?.response?.status === 403) setUpdateSONToggle(true)
    }
   
  }



  useEffect(()=> {

    const reRequest = async () => {
      
       try{
         const token = await refreshToken(true) // the parameter to true to not automatically rerender notes and setofnotes
          
         
          const currentSON = await fetch('/user','PATCH',{SetOfNotesId:temp},token)        
          setCurrentSetofNotes(currentSON.activeSetofNotes)  
          navigate('/dashboard')
          console.log('2nd attemp success')
         
       }
       catch{
          console.log('2nd attempt failed')
       }
       finally {
         setUpdateSONToggle(false)
       }
    }
     if(updateSONToggle) reRequest()
    },[updateSONToggle])


  
 










   const showCreate = () => {
    setIsCreateMode(true)
  }

  const cancelCreate = () => {
    setIsCreateMode(false)
    setError('')
  }


  const createSOT = async() => {

    try{
      const created = await fetch('/setofnotes','POST',{id:userId,title})
      updateSetsOfNotesLocally(setAllSetsOfNotes,created)
      setSonError('')
      setIsCreateMode(false)
      setTitle('')
      setIsCreateMode(false)
    }catch(error){
     
     if(error?.response?.status === 409){
       setSonError(error?.response?.data.message)
     }
     else if(error?.response.status === 400){
      setSonError(error?.response?.data.message)
     }
     
     setCreateSONToggle(true)
    }
   }




   useEffect(()=> {

    const retryCreateSON = async () => {
       try{

        const token = await refreshToken(true) // refresh token when error 403,
        const created = await fetch('/setofnotes','POST',{id:userId,title},token) // manually set the token to fix 403 even after new token is refreshed due to delay in hooks
        updateSetsOfNotesLocally(setAllSetsOfNotes,created)
        setSonError('')
        setTitle('')
        setIsCreateMode(false)

       }catch(error){
           
        if(error?.response?.status === 409){
          setSonError(error?.response?.data.message)
        }
        else if(error?.response.status === 400){
         setSonError(error?.response?.data.message)
        }
         
         console.log(error)
       }
       finally{
        setCreateSONToggle(false)
       }
    }

    if(createSONToggle) retryCreateSON()
     
   },[createSONToggle])








  let datas = null
  
  if(allSetsOfNotes){

    datas = allSetsOfNotes.sort((a,b) => b.createdAt.localeCompare(a.createdAt))

     
      datas = datas.sort((a,b)=> {
  
        if(a._id === currentSetofNotes){
          return -1
        }
        else {
          return 1
        }
      
      })
    



     datas = datas.map((item,index)=>{

     return <EachSet item={item} key={index} changeSON={changeSON}/>
 
    })
  }

  return (

    <>
    {error && error}
    <div className='Mobile-SON'>

      {isLoading ? 'loading..' : !error &&<>
       <section className={!isCreateMode ? 'Mobile-SON-toolbar' : 'Mobile-SON-toolbar active' }>
       {!isCreateMode && <button onClick={showCreate} className='SON-createbutton'><img className='SON-create-image' src={require('../../images/createset.png')} /><p className='create-folder'>create folder</p></button> }  

          {isCreateMode && <article className='SON-create-form'>
            <div className='input-title-container'>
              <label htmlFor='title' className='title-text'>Title</label> 
              <input className='SON-input-title'
                    value={title}
                    name='title'
                    onChange={(e)=>{setTitle(e.target.value)}}
                    autoComplete='off'  
                                
              /> 
              {sonError && <p className='SON-error'>{sonError}</p>}
            </div>   
            
            <div className='save-cancel-container'>
              <button className='cancel-button' onClick={cancelCreate}>cancel</button>
              <button className='save-button' onClick={createSOT}>save</button>
            </div>
              
              
          </article> }
       </section>
            
       <section className={!isCreateMode ? 'SON-list' : 'SON-list create-mode'}>
          {datas && datas}
      </section> 
      </>}  
    </div>
    </>
  )
}

export default MobileSetOfNotes