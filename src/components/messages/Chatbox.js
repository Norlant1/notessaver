import React from 'react'
import useAuth from '../../hooks/useAuth'

const Chatbox = ({currentUserMessages}) => {

  const {userId} = useAuth()

     



  const Chats = currentUserMessages?.messages.map((message,index) => {

    //reminder
    //add unique id later for each message
            const value = message.sender === userId;
    return <div className={value ? 'each-message-container user-message':'each-message-container'} key={index}>
             <p className={value ? 'each-message-text user-text' :'each-message-text'}>{message?.messageContent}</p>
          </div>
  })



  return (
    <div className='all-messages-container'>
        {currentUserMessages ? Chats.reverse() : ''}
    </div>
  )
}

export default Chatbox