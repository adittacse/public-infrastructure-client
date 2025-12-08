import useRole from "../../../hooks/useRole.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import AdminOverview from "../Admin/AdminOverview/AdminOverview.jsx";
import StaffOverview from "../Staff/StaffOverview/StaffOverview.jsx";
import CitizenOverview from "../Citizen/CitizenOverview/CitizenOverview.jsx";

const DashboardHome = () => {
    const { role, roleLoading } = useRole();

    if (roleLoading) {
        return <Loading />;
    }

    if (role === "admin") {
        return <AdminOverview />;
    } else if (role === "staff") {
        return <StaffOverview />;
    } else {
        return <CitizenOverview />;
    }
};

export default DashboardHome;