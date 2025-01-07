
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
import PublishRidePage from "./Pages/PublishRidePage";
import YourRides from "./Pages/YourRides";
import EditRide from "./Pages/EditRide";
import SearchRides from "./Pages/SearchRides";
import Inbox from "./components/Inbox";



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
        <Route path="/publish-ride" element={<PublishRidePage/>} />
        <Route path="/your-rides" element={<YourRides/>} />
        <Route path="/edit-ride/:rideId" element={<EditRide/>} />
        <Route path="/search-car-sharing" element={<SearchRides/>} />
        <Route path="/inbox" element={<Inbox/>} />



        </Route>
      </Routes>
      
      
    </BrowserRouter>
  );
}

export default App;
