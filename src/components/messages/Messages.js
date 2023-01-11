import React,{useState,useRef} from 'react'
import useAuth from '../../hooks/useAuth'
import EachFriends from './EachFriends'
import axios from '../../api/axios'
import { useEffect } from 'react'
import useAxios from '../../hooks/useAxios'
import Chatbox from './Chatbox'
import MoonLoader from "react-spinners/MoonLoader";


const Messages = () => {
  

  const [userMessage,setUserMessage] = useState('') 
  const {isMessage,setIsMessage,userId,foundUsers,setFoundUsers} = useAuth()
  const {fetch,refreshToken} = useAxios()
  const [search,setSearch] = useState('');


  const [currentChatId,setCurrentChatId] = useState('') // id of Messages
  const [currentChatUser,setCurrentChatUser] = useState('') // id of user chatting with 
  const [isLoading,setIsLoading] = useState(true); 
  const inputMessageElement = useRef()  

  const searchUser = (e) =>  {
    e.preventDefault()
     
  }




  useEffect(()=>{
  let refresh
   const getUsersData = async () =>  {
    try{
      const response = await fetch('/messages/allMessagesById','POST',{userId})
      console.log(response)
      setFoundUsers(response.data)
      
     const load = async(callback)=>{
      const response = await fetch('/messages/allMessagesById','POST',{userId})
      console.log(response)
      setFoundUsers(response.data)
      refresh = setTimeout(load,3000)
     }


       refresh = setTimeout(load,3000)

    }catch(error){
      console.log(error)
    }
    finally{
       setIsLoading(false)
    }
    
   }

  if(isMessage)getUsersData()



  return ()=>{
     clearTimeout(refresh)
  }
  },[isMessage])

 
  
  
  




  const sendMessage = async(e)=> {
     e.preventDefault()

   if(userMessage){
    try{    
       const response = await fetch('/messages/updateUsersMessages','POST',
                                    {senderId:userId,recipientId:currentChatUser,messageContent:userMessage,type:'text'})
      
      setFoundUsers(oldFoundUsers => {       
        const newFoundUsers = oldFoundUsers.map(user => {
          return currentChatId !== user._id ? user : {...user,messages:response.data.messages,updatedAt:response.data.updatedAt}
        })
        return newFoundUsers
      })

      setUserMessage('') 
      inputMessageElement.current.blur()
 
     }
     catch(error){
 
     }
   }
  }


  let datas = null 

  if(foundUsers?.length){
  
   datas = foundUsers.sort((a,b) => b.updatedAt.localeCompare(a.updatedAt))

   datas = datas.map(foundUser => {
   return <EachFriends key={foundUser._id} 
                       foundUser={foundUser} 
                       setCurrentChatId={setCurrentChatId} 
                       setCurrentChatUser={setCurrentChatUser} 
                       />
  })
  }

  


  return (
    <div className='main-messages'>
       <section className='main-messages-header'>
        <button onClick={()=>{setIsMessage(false)}} className='closebutton'><img className='messages-closebutton-image' src={require('../../images/closebutton.png')}/></button>
       </section>
       <section className='main-messages-body'>
         <div className='message-body-left-section'>
           <form className='messages-search' onSubmit={searchUser}>
              <input className='search-user'
                     type="text" 
                     name="search"
                     value={search}
                     onChange={(e)=>{setSearch(e.target.value)}}
                    placeholder="Search"
                     />
              <button className='search-user-button'><img className='search-img' src={require('../../images/messages/search.png')}/></button>
           </form>
           <section className={foundUsers ? 'found-users-container' : 'found-users-container noflex'}>
              {isLoading ? <MoonLoader
                color={'#1f1f1f'}
                loading={isLoading}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
                cssOverride={{position:'absolute',left:'calc(50% - 10px)',top:'30%'}}
              /> : foundUsers && !isLoading ? datas : !foundUsers && !isLoading && <p className='no-user-found'>No results found</p> }
           </section>
         </div>
         <div className='message-body-right-section'>
            {currentChatId && foundUsers && <Chatbox currentUserMessages={foundUsers.find(foundUser =>{return currentChatId === foundUser._id})}/>}
            {currentChatId && foundUsers && <form className='main-chat' onSubmit={sendMessage}>
                <input className='input-message'
                       value={userMessage}
                       onChange={(e)=>{setUserMessage(e.target.value)}}
                       autoComplete='off'
                       ref={inputMessageElement}   
                       placeholder='Type a message...'                  
                />
            </form>}
         </div>
       </section>
    </div>
  )
}

export default Messages