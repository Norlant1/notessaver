import { Routes,Route } from "react-router-dom";
import Public from "./components/Public";
import Layout from './components/Layout'
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Admin from "./components/admin/Admin";
import ProtectedLayout from "./components/ProtectedLayout";
import EmailVerification from './auth/EmailVerification'
import Missing from "./components/Missing";
import Setting from "./components/Settings/Setting";
import Account from "./components/Settings/Account";
import MobileSetOfNotes from "./components/mobile/MobileSetOfNotes";
import Profile from "./components/Settings/Profile";
import Security from "./components/Settings/Security";
import Appearance from "./components/Settings/Appearance";
import FPTypeCode from "./auth/FPTypeCode";



function App() {


 
  return (
    <Routes>
      <Route path="" element={<Layout/>} >

         {/* Public Routes */}
        <Route index element={<Public/>} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route path="admin" element={<Admin/>}/>
        <Route path="forgotpassword" >
            <Route index element={<ForgotPassword/>}/>
           <Route path="recovery/code" element={<FPTypeCode/>}/> 
        </Route>
         
        {/* Public Routes */}
        
        <Route path="activate/verify/:id/verifyaccount/:token" element={<EmailVerification/>}/>

 
        {/* Protected Routes */}  
        <Route path="dashboard" element={<ProtectedLayout/>} >
           <Route index element={<Dashboard/>} />           
        </Route>
        <Route path="settings" element={<Setting/>}>
           <Route path="profile" index element={<Profile/>}/>
           <Route path="security" element={<Security/>}/>
           <Route path="appearance" element={<Appearance/>}/>
        </Route>

        <Route path="setofnotes" element={<MobileSetOfNotes/>} />

         {/* Protected Routes */} 

         <Route path="*" element={<Missing/>}/> 
         
      </Route>   
    </Routes>
  );
}

export default App;
