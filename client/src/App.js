
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';
import AuthentificationRoute from "./components/AuthentificationRoute";
import Header from "./components/Header";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import PrivateRoute from "./components/PrivateRoute";


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


        </Route>
      </Routes>
      
      
    </BrowserRouter>
  );
}

export default App;
