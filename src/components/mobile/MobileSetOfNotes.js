import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import useAxios from '../../hooks/useAxios'
import EachSet from '../Setofnotes/EachSet'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { updateSetsOfNotesLocally,deleteSetOfNotesLocally } from '../../util/setter'
import useError from '../../hooks/useError'

const MobileSetOfNotes = () => {

   const [title,setTitle] = useState('')
   const [isCreateMode,setIsCreateMode] = useState(false) 
   const [sonError,setSonError] = useState('')
   const [allSetsOfNotes,setAllSetsOfNotes] = useState('')
   const [temp,setTemp] = useState('')
   const [updateSONToggle,setUpdateSONToggle] = useState(false)
   const [createSONToggle,setCreateSONToggle] = useState(false)
   const [deleteSONToggle,setDeleteSONToggle] = useState(false)
   const [deletedTemp,setDeletedTemp] = useState('')
   


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
   const {errorHandler} = useError()
   

   
   useEffect(()=> {
     
    const getSetOfNotes = async () => { 
     try{
      
        const response = await fetch('/setofnotes','GET')
        setAllSetsOfNotes(response.data)
      

     }catch(error){
      errorHandler(error)
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
      const response = await fetch('/user','PATCH',{SetOfNotesId:_id})
      setCurrentSetofNotes(response.data.activeSetofNotes) 
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
          
         
          const response = await fetch('/user','PATCH',{SetOfNotesId:temp},token)        
          setCurrentSetofNotes(response.data.activeSetofNotes)  
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
      const response = await fetch('/setofnotes','POST',{id:userId,title})
      updateSetsOfNotesLocally(setAllSetsOfNotes,response.data)
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
        const response = await fetch('/setofnotes','POST',{id:userId,title},token) // manually set the token to fix 403 even after new token is refreshed due to delay in hooks
        updateSetsOfNotesLocally(setAllSetsOfNotes,response.data)
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
     

    return ()=> {
      setFirstFetch(true)
    }
   },[createSONToggle])





   const deleteSON = async (id) => {
        
    try{
       
       const response = await fetch('/setofnotes','DELETE',id)
       deleteSetOfNotesLocally(setAllSetsOfNotes,response.data)

    }catch(error){
     
     console.log(error)
     setDeletedTemp(id)
    setDeleteSONToggle(true)
    }
 }


 useEffect(()=> {
  const retryDeleteSON = async () => {
   try{
     
     const token = await refreshToken(true)
     const response = await fetch('/setofnotes','DELETE',deletedTemp,token)
     deleteSetOfNotesLocally(setAllSetsOfNotes,response.data)
   }
   catch(error){
     console.log(error)
   }
   finally {
     setDeletedTemp('')
     setDeleteSONToggle(false)
   }
  }

  if(deleteSONToggle) retryDeleteSON()
   
 },[deleteSONToggle])














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

     return <EachSet item={item} key={index} changeSON={changeSON} deleteSON={deleteSON}/>
 
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