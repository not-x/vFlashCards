import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Home from './components/Home';

const PrivateRoutes = () => {
  const isAuth = true;

  return <>{isAuth ? <Outlet /> : <Navigate to="/" />}</>
}

const RestrictedRoutes = () => {
  const isAuth = true;

  return <>{!isAuth ? <Outlet /> : <Navigate to='profile' />} </>
}




function App() {
  const [token, setToken] = useState();

  // if (!token) {
  //   return <Login setToken={setToken} />
  // }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route element={<PrivateRoutes />} > */}
            <Route path="/profile" element={<Profile />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
