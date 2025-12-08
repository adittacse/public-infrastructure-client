import useAuth from "../hooks/useAuth.jsx";
import useRole from "../hooks/useRole.jsx";
import Loading from "../components/Loading/Loading.jsx";
import Forbidden from "../components/Forbidden/Forbidden.jsx";

const CitizenRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (role !== "citizen") {
        return <Forbidden />;
    }

    return children;
};

export default CitizenRoute;