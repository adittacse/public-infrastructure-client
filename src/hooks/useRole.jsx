import useAuth from "./useAuth.jsx";
import useAxiosSecure from "./useAxiosSecure.jsx";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: role = {}, isLoading: roleLoading } = useQuery({
        queryKey: ["user-role", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        }
    });

    return {
        role: role.role,
        roleLoading,
        isPremium: !!role.isPremium,
        isBlocked: !!role.isBlocked
    };
};

export default useRole;