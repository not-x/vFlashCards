import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Home from './pages/Home';
import PrivateLib from './pages/profile/PrivateLib.js';
import PublicLib from './pages/profile/PublicLib.js';
import PrivSet from './pages/profile/PrivSet.js'
import PubSet from './pages/profile/PubSet.js'
import NewCardSet from './pages/profile/NewCardSet';
import NewCard from './pages/profile/NewCard.js'
import Logout from './pages/profile/Logout'
// import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './hook/useAuth';
import Test from './pages/profile/PrivateLibTest';

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
            <Route path="/profile/lib/:id/" element={<PrivSet/>} />
            <Route path="/profile/test" element={<Test />} />
            <Route path="/profile/pub_lib" element={<PublicLib />} />
            <Route path="/profile/pub_lib/:id/" element={<PubSet/>} />
            <Route path="/profile/new" element={<NewCardSet />} />
            <Route path="/profile/new/:id" element={<NewCard />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
