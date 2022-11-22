import React, { useEffect, useRef, useState } from 'react'
import axios, { axiosPrivateInstance} from '../api/axios'
import useAuth from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import useScroll from '../hooks/useScroll'
import useResolution from '../hooks/useResolution'
import EachNote from './Notes/EachNote'



const Dashboard = () => {


  const {isMobile} = useResolution()

 
 const {fetch,refreshToken} = useAxios()
 const {error,isLoading,isRefresh,notes,setNotes,setError,userId,setIsMenu} = useAuth()
 const {width,onMouseMove,setActives,setInactive} = useScroll()
 
 const [currentForm,setCurrentForm] = useState({title:'',text:''})
 const [isSettings,setIsSettings] = useState({isChange:false ,isView:false, createState:false,isDelete:false})
 const [currentNoteId,setCurrentNoteId] = useState('')
 const [noteSearch,setNoteSearch] = useState('')
 const [sort,setSort] = useState('creation')
 const ref = useRef()
 








  useEffect(()=>{
   
  const fetchData = async() => {
   
      const item = await fetch('/notes/notes','GET')
      setNotes(item)
       
  } 

   fetchData() // fetch notes when logged in 
   
   return ()=> {
       setNotes({})
   }
  },[isRefresh]) 
  

  useEffect(()=> {

  if(error?.response?.status == 403) refreshToken() // if error 403, request a new token 
 
  },[error])

 











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
  console.log('updating')
    setIsSettings(prev => { return {...prev,isChange:false}})
     try{   
      const data = await fetch('/notes','PATCH',{id:currentNoteId, title:currentForm.title, text:currentForm.text})    
      setNotes(allNotes => {
       const newNotes = allNotes.map((item)=> {
          
            return data._id !== item._id ? item : {...item, title:data.title ? data.title:'', text:data.text ? data.text:''}  
          })
        return newNotes
      } )
           
     }catch(error){
       setError(error)
     }    
  }
 }





// CREATE A NEW NOTE IN DB
// RETURNS CREATED NOTE
// UPDATE THE NOTES STATE
 
 const createFile = async () => {
 
   if(isSettings.isChange){
    setIsSettings(prev => {return {...prev,isChange:false}})
    
    try{   
     const data = await fetch('/notes','POST',{user:userId, title:currentForm.title, text:currentForm.text})    
    
     setNotes(allNotes => {
      return [...allNotes,data]
     })
     
     console.log(data)   
  
     
     setCurrentNoteId(data._id)
     setIsSettings(prev => {return {...prev,createState:false}}) // change the state of form to updateMode
    }catch(error){
      setError(error)
    }    
    console.log('note has been created')
 }
}


// DELETE A NEW NOTE IN DB
// RETURNS DELETED NOTE
// DELETE THE NOTE RECEIVED IN NOTES STATE
 const deleteFile = async () => { 
   
  if(!isSettings.createState){
    try{
       const data = await fetch('/notes','DELETE',currentNoteId)
      
       console.log(data)

       setNotes(allNotes => {
       const newNotes = allNotes.filter(note => {         
          return note._id !== currentNoteId
         })
         return newNotes
       })

       setIsSettings(prev => {return {...prev,isView:false}}) // unmount the form
       setCurrentForm({title:'',text:''})
       setCurrentNoteId('')
    }
     catch(error){
       setError(error)
     }

  }
 }















 const showEditor = () => { 
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


  // console.log(isMobile)
  // console.log(!isSettings.isView)


  return (
    <>
     {/* // chain ternary */}
      {/* only show error when fetch is failed for the second time */}
     {error?.response?.statusText && isRefresh ? error?.response?.statusText : 
      error?.message && isRefresh ?  (error?.message) :
     !error?.response?.statusText && isRefresh && error
     }

     <div className='Dashboard' onMouseMove={onMouseMove}  onMouseDown={setActives} onMouseUp={setInactive} onClick={()=>{setIsMenu(false)}}> 
     {isLoading  ? 'loading...' : !error &&
     
     <>
      {(isMobile && !isSettings.isView || !isMobile) &&
      <div className='drag-purpose' style={width && !isMobile ?  {width:width} : {}} >
            <article className='toolbar'>
                    <input disabled={!datas} 
                           placeholder='search' 
                           className='search' 
                           type='text' 
                           value={noteSearch} 
                           onChange={(e)=>{setNoteSearch(e.target.value)}}
                           />

                    <select disabled={!datas} defaultValue='creation' name='sort' className='sort' onChange={(e)=>{setSort(e.target.value)}}>
                      <option value='creation'>sort by date create</option>
                      <option value='modified'>sort by date modify</option>
                      <option value='name'>sort by name</option>
                    </select>
                    {isMobile && <div className='createnote-mobile' onClick={showEditor}><img className='createnote-image' name='createNote' src={require('../images/createnote.png')}/>
                    <label className='createnote-text' htmlFor="createNote">Create Note</label>
                    </div>}
            </article>
            
            <section className={datas ? 'left-section':'left-section inactive'}>
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
            ref={ref}

            /></> } 
        </form> }   
     </>}
    </div>    
    </>  
  )
}

export default Dashboard