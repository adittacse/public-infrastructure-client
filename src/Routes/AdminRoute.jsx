import useAuth from "../hooks/useAuth.jsx";
import useRole from "../hooks/useRole.jsx";
import Loading from "../components/Loading/Loading.jsx";
import Forbidden from "../components/Forbidden/Forbidden.jsx";

const AdminRoute = ({ children }) => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (role !== "admin") {
        return <Forbidden />;
    }

    return children;
};

export default AdminRoute;