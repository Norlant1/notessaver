export const updateNoteLocally = (setNotes,data) => {
  setNotes(allNotes => {
    const newNotes = allNotes.map((item)=> {
       
         return data?._id !== item?._id ? item : {...item, title:data.title ? data.title:'', text:data.text ? data.text:''}  
       })
     return newNotes
   } )
}


export const createNoteLocally = (setNotes,data) => {
  setNotes(allNotes => {
    return [...allNotes,data]
   })
}

export const deleteNoteLocally = (setNotes,currentNoteId) => {
  setNotes(allNotes => {
    const newNotes = allNotes.filter(note => {         
       return note._id !== currentNoteId
      })
      return newNotes
    })
}


export const updateSetsOfNotesLocally = (setAllSetsOfNotes,created) => {
  setAllSetsOfNotes(setsOfNotes => {
    return [...setsOfNotes,created]
  })
}
