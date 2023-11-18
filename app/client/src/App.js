import './App.css';
// import React, { useState } from 'react';
import React from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';

const PrivateRoutes = () => {
  const isAuth = true;

  return <>{isAuth ? <Outlet /> : <Navigate to="/" />}</>
}

const RestrictedRoutes = () => {
  const isAuth = true;

  return <>{!isAuth ? <Outlet /> : <Navigate to='profile' />} </>
}


function App() {
  // const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoutes />} >
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
