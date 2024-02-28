import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./utility/theme";
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Auth/Login'
import ContactsTable from "./components/Contacts/ContactsTable";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SendEmail from "./components/Contacts/SendEmail";
import CommunicationEmails from "./page/CommunicationEmails";
import SendSms from "./components/phone/SendSms";
import SMScommunication from "./page/SMScommunication";
import { useState } from "react";
import AllServiceRequest from "./components/ServiceRequest/AllServiceRequest";

function App() {
// //  const token = localStorage.getItem('userToken')
//  const authenticated = localStorage.getItem('isAdminAuthenticated')
 const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('isAdminAuthenticated')));

  const handleLogin = () => {
    
    setIsLoggedIn(true);
  };

  return (
    <>

    <ToastContainer
        position="top-right"
        autoClose={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />

<ThemeProvider theme={theme}>
  <Routes>
    {/* <Route path='/' element={<Login/>}/> */}
    {isLoggedIn ?
    <>
      <Route path='/' element={<ContactsTable/>}/> 
      <Route path='/sendEmail' element={<SendEmail/>}/>
      <Route path='/sendSms' element={<SendSms/>} />
      <Route path='/emails' element={<CommunicationEmails/>}/>
      <Route path='/sms' element={<SMScommunication/>}/>
      <Route path='/service-request' element={<AllServiceRequest/>}/>
      </>: <Route path='/' element={<Login  handleLogin={handleLogin}/>}/>}

      <Route path="*" element={<Navigate to="/" />} />
  </Routes>
  </ThemeProvider>
    </>
  )
}

export default App
