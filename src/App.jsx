// src/App.jsx

import { Routes, Route } from 'react-router-dom'; 

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Properties from './components/Properties/Properties';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';
import RequireRole from "./components/auth/RequireRole";
import PropertiesDetails from './components/Properties/PropertiesDetails/PropertyDetails';
// import PropertiesEdit from './components/Properties/PropertiesEdit/PropertiesEdit';
import PropertiesList from './components/Dashboard/PropertiesList';
import PropertyDetails from './components/Properties/PropertiesDetails/PropertyDetails';
import Booking from './components/Booking/Booking';
import OwnerBookings from './components/Booking/OwnerBookings';
import './App.css';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<PropertiesList/>}/>
            <Route path='/sign-up' element={<SignUpForm />} />
             <Route path='/Properties' element={<PropertiesList/>}/> {/*for list single proparty  */}
            <Route path='/Properties/new' element={<Properties />} />
            <Route path='/Properties/:id' element={<PropertiesDetails />} />
            {/* <Route path='/Properties/:PropertiesId/' element={<PropertiesEdit />}/> */}
            <Route path="/properties/new" element={ <RequireRole allowedRoles={["owner", "admin"]}> <Properties/> </RequireRole>} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/booking/:propertyId" element={<Booking />} />
            <Route path="/bookings/owner" element={<OwnerBookings />} />

          </>
            :
            <Route path='/' element={<Landing/>}/>
        }
        
        <Route path='/sign-in' element={<SignInForm />} />
        
      </Routes>
    </>
  );
};

export default App;

