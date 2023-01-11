import React from 'react'
import useAuth from '../../hooks/useAuth'
import _arrayBufferToBase64 from '../../util/renderImage'


const EachFriends = ({foundUser,setCurrentChatId,setCurrentChatUser}) => {

  const {userId} = useAuth();

  const changeChatId = () => {
    setCurrentChatId(foundUser?._id)
    setCurrentChatUser(foundUser?.connectedUser) // set connected user for the recipient ID --Messsages.js-- line 65 
  }

  return (
    <article className='each-friends' onClick={changeChatId}>
        <div className='each-friends-profile-container'>
          <img className='each-friends-profile' src={foundUser?.profileImage ? `data:image/png;base64,${_arrayBufferToBase64(foundUser.profileImage.img.data.data)}` : require('../../images/profile3.jpg')}/>
        </div>
        <div className='each-friends-text-container'>
           <p className='each-friends-name'>{foundUser.username}</p>
           <p className='each-friends-message'> {foundUser?.messages[foundUser.messages.length - 1]?.sender === userId && 'You:'} {foundUser?.messages[foundUser.messages.length - 1]?.messageContent}</p>
        </div>
    </article>
  )
}

export default EachFriends