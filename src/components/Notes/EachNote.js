import React from 'react'
import {format} from 'date-fns'

const EachNote = ({note,setForm,currentNoteId,setCurrentNoteId,setIsSettings}) => {

  
  const updated = new Date(note.updatedAt).toLocaleString('en-US',{day:'numeric',month:'long',hour:'numeric',minute:'numeric'})
  
  const setData = () => {

    const state = { 'page_id': 2, 'user_id': 1 }
    window.history.pushState(state, '')

    setIsSettings(prev => {
      return {...prev,isView:true, createState:false, isChange:false}
    })
    setCurrentNoteId(note._id) 
    setForm(prev => {
      return {...prev, title:note.title, text:note.text}
    })
  }
  


  return (
    <article className='note-container' onClick={setData} style={currentNoteId === note._id ? {backgroundColor: '#e7e7e7'}:{}}>
            <p className='note-title' style={!note.title ? {fontStyle:'italic',color:'#444444'}:{}}>{note.title ? note.title:'no title'}</p>
            <p className='date-format'>{updated}</p>
    </article>
  )
}

export default EachNote