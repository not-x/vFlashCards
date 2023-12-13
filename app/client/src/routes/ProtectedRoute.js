import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { redirect } from "react-router-dom";
import Profile from "../pages/Profile";

const ProtectedRoute = ({children}) => {
    // const ProtectedRoute = () => {   
const { token } = useAuth();

    // console.log("token value?: " + (token))
    if (!token) {
        // console.log("no token found(" + token + "). Nav to /login")
        console.log("no token found");
        return <Navigate to="/login" />;
    }
    // console.log("token: " + token);
    console.log("token set.");
    console.log("Redirecting to /profile");
    // return <Navigate to="/profile" />;   // returns a blank page?
    // return <Profile />;      // redirect to profile
    // return redirect("/profile");    // runtime error
    return children;
};

export default ProtectedRoute;