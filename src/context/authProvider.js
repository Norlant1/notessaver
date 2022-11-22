import { createContext, useState } from "react";


const AuthContext = createContext({})


export const AuthProvider  = ({children}) =>{
  const [user,setUser] = useState('')
  const [notes,setNotes] = useState([])
  const [error,setError] = useState(null)
  const [isRefresh,setIsRefresh] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const [auth,setAuth] = useState('')
  const [userId,setUserId] = useState('')
  const [isMenu,setIsMenu] = useState(false)
  
  

  return(
    <AuthContext.Provider value={{
      auth,setAuth,
      user,setUser,
      notes,setNotes,
      error,setError,
      isRefresh,setIsRefresh,
      isLoading,setIsLoading,
      userId,setUserId,
      isMenu,setIsMenu
      }} >
       {children}
    </AuthContext.Provider>
  )

}

export default AuthContext