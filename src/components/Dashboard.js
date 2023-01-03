import React, { useEffect, useRef, useState } from 'react'
import axios, { axiosPrivateInstance} from '../api/axios'
import useAuth from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import useScroll from '../hooks/useScroll'
import useResolution from '../hooks/useResolution'
import useError from '../hooks/useError'
import EachNote from './Notes/EachNote'
import Setofnotes from './Setofnotes/Setofnotes'
import { createNoteLocally, deleteNoteLocally, updateNoteLocally } from '../util/setter'
import MobileMenu from './mobile/MobileMenu'
import MobileSetOfNotes from './mobile/MobileSetOfNotes'
import FadeLoader from "react-spinners/FadeLoader";




const Dashboard = () => {


  const {isMobile} = useResolution()
  const {errorHandler} = useError()

 
 const {fetch,refreshToken} = useAxios()


 const {error,setError,
        isLoading,setIsLoading,
        isForbidden,setIsForbidden,
        notes,setNotes,
        userId,setIsMenu,
        isSetOfNotes,
        setAllSetsOfNotes,currentSetofNotes,
        toggler,
        firstFetch,setFirstFetch,
        isMenuMobile,setIsMenuMobile,
        setUserId,setUser,
        setAuth,
        isMobileSonVisible, setIsMobileSonVisible,
        historyState,setHistoryState,
        dataImage,setDataImage
      }
         = useAuth()


const [updateToggle,setUpdateToggle] = useState(false)
const [createToggle,setCreateToggle] = useState(false)
const [deleteToggle,setDeleteToggle] = useState(false) 




 const {width,onMouseMove,setActives,setInactive} = useScroll()
 

 //body note
 const [currentForm,setCurrentForm] = useState({title:'',text:''})
 const [isSettings,setIsSettings] = useState({isChange:false ,isView:false, createState:false,isDelete:false})
 const [currentNoteId,setCurrentNoteId] = useState('')
 const [noteSearch,setNoteSearch] = useState('')
 const [sort,setSort] = useState('creation')
 const ref = useRef()








 



  useEffect(()=>{
   
  const fetchData = async() => {
   
    try {
 
      const item = await fetch('/notes/active-notes','POST',{activeSetofNotes:currentSetofNotes})
      const SON = await fetch('/setofnotes','GET')
      const image = await fetch('/upload/profileId','POST',{id:userId})
     
      
      setNotes(item?.data)
      setAllSetsOfNotes(SON?.data)
      setDataImage(image)
      
    }catch(error){  
     
      errorHandler(error)
                          
   }finally{     
       setIsLoading(false)
     }    
  } 
  

    fetchData() // fetch notes when logged in 
   
   return ()=> {
       setFirstFetch(true)
       setNotes([])
       setAllSetsOfNotes([])
   }
  },[toggler]) // get notes















  useEffect(()=> {

  if(isForbidden) refreshToken() // if error 403, request a new token 
   
  },[isForbidden])

 



 



let datas = null;
 if(notes?.length){

  datas = notes
    if(noteSearch.length) {
      datas = notes.filter((item)=> item.title.includes(noteSearch))
    }


    if(sort === 'creation'){
      datas = datas.sort((a,b) => b.createdAt.localeCompare(a.createdAt))
    }
    else if(sort === 'modified'){
      datas = datas.sort((a,b) => b.updatedAt.localeCompare(a.updatedAt))
    }
    else if(sort === 'name'){
     
      datas = datas.sort((a,b)=> {

        if(a.title < b.title){
          return -1
        }

        if(a.title > b.title){
          return 1
        }

        return 0
      })
    }

    datas = datas.map((item) => {
    return <EachNote setIsSettings={setIsSettings} currentNoteId={currentNoteId} setCurrentNoteId={setCurrentNoteId} setForm={setCurrentForm} note={item} key={item._id}/>
   })
 }




 const changeValue = (e) => {

   const {name,value} = e.target
   setCurrentForm(prev => {
     return {...prev, [name]:value}
   }) 
   
   setIsSettings(prev => {return {...prev,isChange:true}})
                      //  forcely show the saveFile button after the any changes is made in the currentForm value
                      //  to avoid delay in changes of value after changes is made in currentForm

 }



// UPDATE IN DB
// RETURNS UPDATED DATA
// UPDATE THE NOTES STATE
 const updateFile = async () => {
 
 if(isSettings.isChange){

     try{   
      const response = await fetch('/notes','PATCH',{id:currentNoteId, title:currentForm.title, text:currentForm.text})
      updateNoteLocally(setNotes,response.data)

      setIsSettings(prev => {return {...prev,isChange:false}})  
     }catch(error){
      setUpdateToggle(true)
     }    
   }
 }

 useEffect(()=> {

  
  const retryUpdate = async () => {
   
    try {
      const token = await refreshToken(true) // set to true to not automatically refetch notes and setofnotes
      console.log('retrying....')
      const response = await fetch('/notes','PATCH',{id:currentNoteId, title:currentForm.title, text:currentForm.text},token)
      updateNoteLocally(setNotes,response.data)
      setIsSettings(prev => {return {...prev,isChange:false}}) 
      setUpdateToggle(false)
      console.log('success!')
    } catch(error){

      setUpdateToggle(false)
      
    }
  }

  if(updateToggle) retryUpdate()

 },[updateToggle])






// CREATE A NEW NOTE IN DB
// RETURNS CREATED NOTE
// UPDATE THE NOTES STATE
 

 const createFile = async () => {
 
   if(isSettings.isChange){ 
    
    try{   
     const response = await fetch('/notes','POST',{user:userId, title:currentForm.title, text:currentForm.text})    
     
     createNoteLocally(setNotes,response?.data)

     setIsSettings(prev => {return {...prev,isChange:false}})
     setCurrentNoteId(response.data._id)
     setIsSettings(prev => {return {...prev,createState:false}}) // change the state of form to updateMode
                                                                 // createState:false = update mode                                                               // createState:true = create mode
    }catch(error){
      console.log(error)
      setCreateToggle(true)
    }    
  }
}


useEffect(()=> {

  const retryCreate = async () => {
    
    try {
      const token = await refreshToken(true) // set to true to not automatically refetch notes and setofnotes  
      console.log('retrying....')  
      const response = await fetch('/notes','POST',{user:userId, title:currentForm.title, text:currentForm.text},token)    
     
     createNoteLocally(setNotes,response.data)
     setIsSettings(prev => {return {...prev,isChange:false}})
     setCurrentNoteId(response.data._id)
     setIsSettings(prev => {return {...prev,createState:false}})
     console.log('success!')

    } catch(error){

      setCreateToggle(false)
      
    }
  }

  if(createToggle) retryCreate()

 },[createToggle])



// DELETE A NEW NOTE IN DB
// RETURNS DELETED NOTE
// DELETE THE NOTE RECEIVED IN NOTES STATE
 const deleteFile = async () => { 
   
  if(!isSettings.createState){
    try{
     
       await fetch('/notes','DELETE',currentNoteId)

       deleteNoteLocally(setNotes,currentNoteId)
       setIsSettings(prev => {return {...prev,isView:false}}) // unmount the form
       setCurrentForm({title:'',text:''})
       setCurrentNoteId('')
    }
     catch(error){
       setDeleteToggle(true)
     }
  }
 }



 useEffect(()=> {

  const retryDelete = async () => {
    try {
      
      const token = await refreshToken(true) // set to true to not automatically refetch notes and setofnotes 
      console.log('retrying....')
      await fetch('/notes','DELETE',currentNoteId,token)
      
      deleteNoteLocally(setNotes,currentNoteId)
       setIsSettings(prev => {return {...prev,isView:false}}) // unmount the form
       setCurrentForm({title:'',text:''})
       setCurrentNoteId('')
       setDeleteToggle(false)   
       console.log('success!')
    } catch(error){
      console.log(error)
      setDeleteToggle(false)     
    }
  }

  if(deleteToggle) retryDelete()

 },[deleteToggle])






 const showEditor = () => { 
  
  const state = { createState: true, name: 'createState' }
  setHistoryState(prev => {
     return {...prev,currentState:state.name}
  })
  window.history.pushState(state, 'createState')
  
  setCurrentNoteId('')
  setIsSettings(prev => {return {...prev,createState:true}}) // set createState to true. which means the note the current note that is being edited is a newNote and note an existing one,
                                                              // therefore the saveButton knows if it is creating a note or just updating an existing note in the server. 
  setIsSettings(prev => {return {...prev,isView:true}}) // mount the form
 }
 
 const closeEditor = () => {
 
  window.history.go(-1)

  
 }





 useEffect(()=> {


  const windowPop = () => {
    
    if(historyState.currentState === 'mobileMenu'){
      setIsMenuMobile(false)
      document.body.style.overflow = ""
      setHistoryState(prev => {
        return {...prev,currentState:prev.previousState, previousState:prev.currentState}
     })
    }
  
  
    if(historyState.currentState === 'createState' || historyState.currentState === 'editMode'){
      setCurrentForm({title:'',text:''})
      setCurrentNoteId('')
      setIsSettings(prev => {return {...prev,createState:false}})
      setIsSettings(prev => {return {...prev,isView:false}}) // unmount the form


      setHistoryState(prev => {
        return {...prev,currentState:'', previousState:''}
     })
     
    }

    
  }

  window.addEventListener('popstate',windowPop);
   


  return ()=> window.removeEventListener('popstate',windowPop)
},[historyState])









  return (
    <>
   
      {/* only show error when fetch is failed for the second time */}
     {error && error}
     {isSetOfNotes && !isMobile && <div className='main-setofnotes-container'><Setofnotes/></div>}
     
     
     <MobileMenu/>
     {!isMobileSonVisible && <div className='Dashboard' onMouseMove={onMouseMove}  onMouseDown={setActives} onMouseUp={setInactive} onClick={()=>{setIsMenu(false)}}> 
     
     
    


     {isLoading  ? <FadeLoader
        color={'#575757'}
        loading={isLoading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      : !error 
      && <>
      {(isMobile && !isSettings.isView || !isMobile) &&
      <div className={!isMenuMobile ? 'drag-purpose' : 'drag-purpose active'} style={width && !isMobile ?  {width:width} : {}} >
            <article className='toolbar'>
                    <input disabled={!datas} 
                           placeholder='search' 
                           className='search' 
                           type='text' 
                           value={noteSearch} 
                           onChange={(e)=>{setNoteSearch(e.target.value)}}
                           />

                    <select disabled={!datas} defaultValue='creation' name='sort' className='sort' onChange={(e)=>{setSort(e.target.value)}}>
                      <option value='creation'>sort by date created</option>
                      <option value='modified'>sort by date modified</option>
                      <option value='name'>sort by name</option>
                    </select>
                    {isMobile && <div className='createnote-mobile' onClick={showEditor}><img className='createnote-image' name='createNote' src={require('../images/createnote.png')}/>
                    <label className='createnote-text' htmlFor="createNote">Create Note</label>
                    </div>}
            </article>
            
            <section className={datas ? 'left-section':'left-section inactive'} >
              {datas ? datas : <p className='nonotes'>no note in the list</p>}
            </section>
          </div>}
    
        
          {(!isMobile || isMobile && isSettings.isView) && <form className={!isSettings.isView ? 'right-section blank':'right-section'} onSubmit={(e)=>{e.preventDefault()}}>
          {!isSettings.isView && !isMobile && <button className='createNote' onClick={showEditor}><label className='addnote-text'>Create new note</label><img className='addnote-icon' src={require('../images/addnote.png')}/> </button>}
          
          {isSettings.isView && <><img className='exitButton' src={require('../images/closebutton.png')} onClick={closeEditor}/>
          <div className='SDicons'>
            <img className={!isSettings.isChange ? 'saveFile':'saveFile on'} src={require('../images/saveFile.png')} onClick={isSettings.createState ? createFile : updateFile}/>
            <img className={isSettings.createState ? 'deleteFile':'deleteFile on'} src={require('../images/deleteFile.png')} onClick={deleteFile}/>
          </div>
            <label className='title-label'>Title </label>
            <input className='titleform'
            name='title'
            type='text'
            value={currentForm.title}
            onChange={changeValue}
            autoComplete="off"
            onKeyPress={(e)=>{e.key === 'Enter' && ref.current.focus()}}
           />
           
            <textarea className='bodyform'
            name='text'
            type='text'
            value={currentForm.text}
            onChange={changeValue}
            autoComplete="off"
            ref={ref}/>
            </> } 
        </form>}   
     </>}
    </div> }   
   
    </>  
  )
}

export default Dashboard