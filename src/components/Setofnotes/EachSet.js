import React from 'react'
import useAuth from '../../hooks/useAuth'

const EachSet = ({item,changeSON}) => {

  const {currentSetofNotes} = useAuth()

  const created = new Date(item.createdAt).toLocaleString('en-US',{day:'numeric',month:'long',hour:'numeric',minute:'numeric'})
  




  return (
    <article className='Each-SON' key={item._id} onClick={()=>{changeSON(item)}}>
      <p className='SON-title'>{item.title}</p>
     
        <p className='date'>{created}{currentSetofNotes === item._id && <label className='active-SON'>• active</label>}</p>
        
   
     
      
    </article>
  )
}

export default EachSet