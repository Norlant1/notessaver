import { Routes,Route } from "react-router-dom";
import Public from "./components/Public";
import Layout from './components/Layout'
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./components/Dashboard";
import ProtectedLayout from "./components/ProtectedLayout";
import EmailVerification from './auth/EmailVerification'

function App() {


 
  return (
    <Routes>
      <Route path="" element={<Layout/>} >

         {/* Public Routes */}
        <Route index element={<Public/>} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        {/* Public Routes */}
        
        <Route path="verify/:id/verifyaccount/:token" element={<EmailVerification/>}/>

 
        {/* Protected Routes */}  
        <Route path="dashboard" element={<ProtectedLayout/>} >
           <Route index element={<Dashboard/>} />     
           
            
        </Route>
         {/* Protected Routes */}  
      </Route>   
    </Routes>
  );
}

export default App;
