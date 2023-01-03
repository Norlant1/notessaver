import React from 'react'
import useAuth from '../../hooks/useAuth'

const EachSet = ({item,changeSON,deleteSON}) => {

  const {currentSetofNotes} = useAuth()

  const created = new Date(item.createdAt).toLocaleString('en-US',{day:'numeric',month:'long',hour:'numeric',minute:'numeric'})
  




  return (
    <article className='Each-SON' key={item._id}>
      <p className='SON-title'>{item.title}</p>

      {currentSetofNotes !== item._id && <>
      <p className='delete-text' onClick={()=>{deleteSON(item._id)}}>delete</p>
      <p className='edit-text' onClick={()=>{changeSON(item)}}>edit</p>
      </>}
      
        <p className='date'>{created}{currentSetofNotes === item._id && <label className='active-SON'>• active</label>}</p>
        
   
     
      
    </article>
  )
}

export default EachSet