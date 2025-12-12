import useRole from "../../../hooks/useRole.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import AdminProfile from "../Admin/AdminProfile/AdminProfile.jsx";
import StaffProfile from "../Staff/StaffProfile/StaffProfile.jsx";
import CitizenProfile from "../Citizen/CitizenProfile/CitizenProfile.jsx";

const Profile = () => {
    const { role, roleLoading } = useRole();

    if (roleLoading) {
        return <Loading />;
    }

    if (role === "admin") {
        return <AdminProfile />
    } else if (role === "staff") {
        return <StaffProfile />;
    } else {
        return <CitizenProfile />;
    }
};

export default Profile;