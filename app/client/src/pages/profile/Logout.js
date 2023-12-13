import React from "react";
import { Navigate } from "react-router-dom";
import { token, useAuth } from "../../hook/useAuth"

const Logout = () => {
    // const {logoutUser} = useAuth().Logout;
    const auth = useAuth();
    auth.logout();
    // console.log(auth);
    console.log("Logging out...");
    return (
        <>
            <h1>Logout</h1>
            return <Navigate to="/" />;
        </>
    );
}
export default Logout