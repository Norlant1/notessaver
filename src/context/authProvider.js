import { createContext, useState } from "react";


const AuthContext = createContext({})


export const AuthProvider  = ({children}) =>{
  const [user,setUser] = useState('')
  const [userRoles,setUserRoles] = useState([])
  const [notes,setNotes] = useState([])
  const [currentSetofNotes,setCurrentSetofNotes] = useState('')

  const [error,setError] = useState(null)
  const [isForbidden,setIsForbidden] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const [auth,setAuth] = useState('')
  const [userId,setUserId] = useState('')
  const [isMenu,setIsMenu] = useState(false)
  const [isSetOfNotes,setSetOfNotes] = useState(false)
  const [allSetsOfNotes,setAllSetsOfNotes] = useState([])
  const [toggler,setToggler] = useState(false)
  const [firstFetch,setFirstFetch] = useState(true)
  const [isMenuMobile,setIsMenuMobile] = useState(false)
  const [isMobileSonVisible, setIsMobileSonVisible] = useState(false)
  const [historyState,setHistoryState] = useState({currentState:'s',previousState:''})
  const [changedPasswordNotice,setChangedPasswordNotice] = useState('')
  const [dataImage,setDataImage] = useState('')
  const [isMessage,setIsMessage] = useState(false) 
  const [foundUsers,setFoundUsers] = useState([])

  return(
    <AuthContext.Provider value={{
      auth,setAuth,
      user,setUser,
      notes,setNotes,
      error,setError,
      isForbidden,setIsForbidden,
      isLoading,setIsLoading,
      userId,setUserId,
      isMenu,setIsMenu,
      isSetOfNotes,setSetOfNotes,
      currentSetofNotes,setCurrentSetofNotes,
      allSetsOfNotes,setAllSetsOfNotes,
      toggler,setToggler,
      firstFetch,setFirstFetch,
      isMenuMobile,setIsMenuMobile,
      isMobileSonVisible, setIsMobileSonVisible,
      historyState,setHistoryState,
      changedPasswordNotice,setChangedPasswordNotice,
      dataImage,setDataImage,
      userRoles,setUserRoles,
      isMessage,setIsMessage,
      foundUsers,setFoundUsers
      }} >
       {children}
    </AuthContext.Provider>
  )

}

export default AuthContext