import React from "react";
import { Routes, Route, Link, NavLink, useOutlet, Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";


function Navigation() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/profile">
          vFlashCards
        </Link>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile/lib">
              Personal Library
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile/pub_lib">
              Public Library
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/profile/new">
              Create New Card Set
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/logout">
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

const Profile = () => {
  const outlet = useOutlet();
  const { token } = useAuth();

  // console.log("token value?: " + (token))
  if (!token) {
    console.log("no token found(" + token + "). Nav to /login")
    return <Navigate to="/login" />;
  }


  return (
    // NavPane - Top
    // 1. Private library
    //  a. Individual card set (1 by 1)
    // 2. Public library
    //  a. Individual card set (1 by 1)
    // 3. Create new library
    //  a. Create new set (title)
    //   i. Create new card
    //    - Save
    //    - Continue creating card under EXISTING set
    
    <div>
      <Navigation />
      {outlet}
    </div>
  );
}
export default Profile;