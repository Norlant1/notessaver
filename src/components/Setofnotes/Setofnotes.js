import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import { updateSetsOfNotesLocally,deleteSetOfNotesLocally } from '../../util/setter'
import EachSet from './EachSet'
import {animcaller,ClassNameMaker,startAnim,finishAnim} from '../../util/animation'


const Setofnotes = () => {


  const {fetch,refreshToken} = useAxios()

  const [title,setTitle] = useState('')
  const [createSONToggle,setCreateSONToggle] = useState(false)
  const [updateSONToggle,setUpdateSONToggle] = useState(false)
  const [deleteSONToggle,setDeleteSONToggle] = useState(false)
  const [currentTemp,setCurrentTemp] = useState('')
  const [deletedTemp,setDeletedTemp] = useState('')
  const [isCreateMode,setIsCreateMode] = useState(false)
  const [error,setError] = useState('')
  

  
  const {setSetOfNotes,userId,
    allSetsOfNotes,setAllSetsOfNotes,setCurrentSetofNotes,
    currentSetofNotes,setToggler,setIsLoading,auth,setFirstFetch} = useAuth()

 
   const frames = ClassNameMaker('input-title-container',3)
   const [counter,setCounter] = useState(0)
   const [isAnim,setIsAnim] = useState(true)


  

 const animStart = async () => {
  
  if(isAnim === true){  
    await startAnim(setIsAnim);
    await animcaller(150,setCounter,1);
    await animcaller(150,setCounter,2);
    await animcaller(150,setCounter,1);
    await animcaller(150,setCounter,2);
    await animcaller(150,setCounter,0);
    await finishAnim(setIsAnim); 
  }
 }






  

  const changeSON = async ({_id},value) => {


      

    try{
      setIsLoading(true)
      setCurrentTemp(_id) // storing id of clicked SON, which will be used in reattempting after new token is recevied due to 403 error. --linecode #90
      const response = await fetch('/user','PATCH',{SetOfNotesId:_id})
      value !== 'asd' && setSetOfNotes(false)
      setCurrentSetofNotes(response.data.activeSetofNotes)
      setToggler(prev => !prev) 
      setIsLoading(false)
      

    }catch(error){
       
      console.log(error)
      if(error?.response?.status === 403) setUpdateSONToggle(true)
    }
  
  }
 
  // when access token expires and fails to change the activeSetOfnotes in DB
  // request new token and try to change activeSetOfnotes in DB for the second time
  // refetch notes and list of setofnotes
  useEffect(()=> {

    const reRequest = async () => {
      
       try{
         const token = await refreshToken(true) // the parameter to true to not automatically rerender notes and setofnotes
          
         
          const response = await fetch('/user','PATCH',{SetOfNotesId:currentTemp},token) 
          setSetOfNotes(false)  
          setCurrentSetofNotes(response.data.activeSetofNotes)  
          setToggler(prev => !prev)  
          console.log('2nd attemp success')
         
       }
       catch{
          console.log('2nd attempt failed')
       }
       finally {
         setUpdateSONToggle(false)
         setIsLoading(false)
       }
    }
     if(updateSONToggle) reRequest()
    },[updateSONToggle])





    const createSOT = async() => {
  
      try{
        const response = await fetch('/setofnotes','POST',{id:userId,title})
        updateSetsOfNotesLocally(setAllSetsOfNotes,response.data)
        setError('')
        setIsCreateMode(false)
        setTitle('')
        changeSON({_id:response.data._id},'asd')
      }catch(error){
       
       if(error?.response?.status === 409){
         setError(error?.response?.data.message)
       }
       else if(error?.response.status === 400){
        setError(error?.response?.data.message)
        animStart()
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
          setError('')
          setIsCreateMode(false)
          setTitle('')
          changeSON({_id:response.data._id},'asd')
         }catch(error){
             
          setFirstFetch(true)
          if(error?.response?.status === 409){
            setError(error?.response?.data.message)
          }
          else if(error?.response.status === 400){
           setError(error?.response?.data.message)
           animStart()
          }
           
           console.log(error)
         }
         finally{
          setCreateSONToggle(false)
         }
      }

      if(createSONToggle) retryCreateSON()
       
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














     const showCreate = () => {
       setIsCreateMode(true)
     }












  
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

  const cancelCreate = () => {
    setIsCreateMode(false)
    setError('')
  }


 



  return (
    <div className='main-setofnotes'>
     <div className='SON-toolbar-relative'>    
      <section className={!isCreateMode ? 'SON-toolbar' : 'SON-toolbar create-mode'}>  
        <button onClick={()=>{setSetOfNotes(false)}} className='SON-closebutton'><img className='SON-closebutton-image' src={require('../../images/closebutton.png')}/></button>


           {!isCreateMode && <button onClick={showCreate} className='SON-createbutton'><img className='SON-create-image' src={require('../../images/createset.png')} /><p className='create-folder'>create folder</p></button> }  

        {isCreateMode && <article className='SON-create-form'>
          <div className={frames[counter]}>
            <label htmlFor='title' className='title-text'>Title</label> 
            <input className='SON-input-title'
                  value={title}
                  name='title'
                  onChange={(e)=>{setTitle(e.target.value)}}
                  autoComplete='off'  
                               
            /> 
            {error && <p className='SON-error'>{error}</p>}
          </div>   
          
          <div className='save-cancel-container'>
            <button className='cancel-button' onClick={cancelCreate}>cancel</button>
            <button className='save-button' onClick={createSOT}>save</button>
          </div>
            
            
        </article> } 
      </section>
     </div>

      <section className={!isCreateMode ? 'SON-list' : 'SON-list create-mode'}>
          {datas && datas}
      </section>    
       
    </div>
  )
}

export default Setofnotes


