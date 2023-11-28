import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './hook/useAuth';

// const PrivateRoutes = () => {
//   const isAuth = true;

//   return <>{isAuth ? <Outlet /> : <Navigate to="/" />}</>
// }

// const RestrictedRoutes = () => {
//   const isAuth = true;

//   return <>{!isAuth ? <Outlet /> : <Navigate to='profile' />} </>
// }




function App() {
  // const [token, setToken] = useState();

  // if (!token) {
  //   return <Login setToken={setToken} />
  // }
  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
