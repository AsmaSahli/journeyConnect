
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';
import AuthentificationRoute from "./components/AuthentificationRoute";
import Header from "./components/Header";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Messages from "./Pages/Messages";
import DashboardTabs from "./Pages/DashboardTabs";
import Dashboard from "./Pages/Dashboard";



function App() {
  return (
    <BrowserRouter >
        <Header/>
      <Routes>
      <Route element={<AuthentificationRoute/>} >
        <Route path="/signin" element={< SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Route>
      <Route path="/" element={<Home/>} />

        <Route element={<PrivateRoute/>} >
        <Route path="/messages" element={<Messages/>} />
        <Route path="/Profile" element={<DashboardTabs/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />



        </Route>
      </Routes>
      
      
    </BrowserRouter>
  );
}

export default App;
