import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const ProtectedRoute = () => {
    const {token} = useAuth();

    if (!token) {
        return <Navigate to ="/login"/>;
    }
    return <Outlet />;
};

export default ProtectedRoute;