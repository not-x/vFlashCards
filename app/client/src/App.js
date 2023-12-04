import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Home from './pages/Home';
import PrivateLib from './pages/profile/PrivateLib';
import PublicLib from './pages/profile/PublicLib';
import AddNewSet from './pages/profile/AddNewSet';
import Logout from './pages/profile/Logout'
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './hook/useAuth';

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}

          <Route element={<Home />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          <Route element={<Profile />}>
            <Route path="/profile" element={< PrivateLib />} />
            <Route path="/profile/lib" element={<PrivateLib />} />
            <Route path="/profile/pub_lib" element={<PublicLib />} />
            <Route path="/profile/new" element={<AddNewSet />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
