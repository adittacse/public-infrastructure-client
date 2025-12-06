import useAuth from "../hooks/useAuth.jsx";
import { Navigate, useLocation } from "react-router";
import Loading from "../components/Loading/Loading.jsx";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    if (user && user?.email) {
        return children;
    }

    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRoute;