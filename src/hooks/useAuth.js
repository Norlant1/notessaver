import AuthContext from "../context/authProvider";
import { useContext } from "react";


const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;