import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { redirect } from "react-router-dom";

const ProtectedRoute = () => {
    const {token} = useAuth();

    console.log("token empty?: " + (!token))
    if (!token) {   // k
        return <Navigate to ="/login"/>;
        // return redirect("/profile");
    }
    return <Outlet />;
    // return redirect("/");
};

export default ProtectedRoute;