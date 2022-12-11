import React, { useEffect, useRef, useState } from 'react'
import axios, { axiosPrivateInstance} from '../api/axios'
import useAuth from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import useScroll from '../hooks/useScroll'
import useResolution from '../hooks/useResolution'
import EachNote from './Notes/EachNote'
import Setofnotes from './Setofnotes/Setofnotes'
import { createNoteLocally, deleteNoteLocally, updateNoteLocally } from '../util/setter'
import MobileMenu from './mobile/MobileMenu'


const Dashboard = () => {


  const {isMobile} = useResolution()

 
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
        isMenuMobile,
        setUserId,setUser,
        setAuth} = useAuth()


const [updateToggle,setUpdateToggle] = useState(false)
const [createToggle,setCreateToggle] = useState(false)
const [deleteToggle,setDeleteToggle] = useState(false) 
const [isWindowPop,setIsWindowPop] = useState(false)



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

      if(item)setNotes(item)
      if(SON)setAllSetsOfNotes(SON)
 
      
      console.log(item)
      console.log(SON)
    }catch(error){  
     
      if(error?.response?.status === 403 && firstFetch){
        setIsForbidden(true)
      } // to rerender component
      else if(error?.response?.status === 403 && !firstFetch){
        setFirstFetch(false)
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
                          
   }finally{     
       setIsLoading(false)
     }    
  } 
  

    fetchData() // fetch notes when logged in 
   
   return ()=> {
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
      const data = await fetch('/notes','PATCH',{id:currentNoteId, title:currentForm.title, text:currentForm.text})
      updateNoteLocally(setNotes,data)

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
      const data = await fetch('/notes','PATCH',{id:currentNoteId, title:currentForm.title, text:currentForm.text},token)
      updateNoteLocally(setNotes,data)
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
     const data = await fetch('/notes','POST',{user:userId, title:currentForm.title, text:currentForm.text})    
     
     createNoteLocally(setNotes,data)

     setIsSettings(prev => {return {...prev,isChange:false}})
     setCurrentNoteId(data._id)
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
      const data = await fetch('/notes','POST',{user:userId, title:currentForm.title, text:currentForm.text},token)    
     
     createNoteLocally(setNotes,data)
     setIsSettings(prev => {return {...prev,isChange:false}})
     setCurrentNoteId(data._id)
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

  const state = { 'page_id': 1, 'user_id': 1 }
  window.history.pushState(state, '')

  setCurrentNoteId('')
  setIsSettings(prev => {return {...prev,createState:true}}) // set createState to true. which means the note the current note that is being edited is a newNote and note an existing one,
                                                              // therefore the saveButton knows if it is creating a note or just updating an existing note in the server. 
  setIsSettings(prev => {return {...prev,isView:true}}) // mount the form
 }

 const closeEditor = () => {

  setCurrentForm({title:'',text:''})
  setCurrentNoteId('')
  setIsSettings(prev => {return {...prev,createState:false}})
  setIsSettings(prev => {return {...prev,isView:false}}) // unmount the form
 }


 useEffect(()=> {
 
  window.onpopstate = (event) => {

        closeEditor()
    
    
  };

},[])









  return (
    <>
     {/* // chain ternary */}
      {/* only show error when fetch is failed for the second time */}
     {error && error}
     {isSetOfNotes && !isMobile && <div className='main-setofnotes-container'><Setofnotes/></div>}
     
     
     <MobileMenu/>
     <div className='Dashboard' onMouseMove={onMouseMove}  onMouseDown={setActives} onMouseUp={setInactive} onClick={()=>{setIsMenu(false)}}> 
     
     



     {isLoading  ? 'loading...' : !error &&
     <>
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
    </div>    
   
    </>  
  )
}

export default Dashboard