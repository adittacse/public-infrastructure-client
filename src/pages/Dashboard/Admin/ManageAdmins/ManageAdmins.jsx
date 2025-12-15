import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar.jsx";

const ManageAdmins = () => {
    const [adminsFiltered, setAdminsFiltered] = useState([]);
    const [searchText, setSearchText] = useState("");
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    const { data: admins = [] } = useQuery({
        queryKey: ["all-users", searchText],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/admins?searchText=${searchText}`);
            setAdminsFiltered(res.data);
            return res.data;
        },
    });

    if (!admins) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">See Admins</h1>

            <label className="input mb-5">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="search" placeholder="Search by name or email" />
            </label>

            <div className="overflow-x-auto bg-base-100 shadow-2xl rounded-2xl">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Sl.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        adminsFiltered.length === 0 && <tr>
                            <td colSpan={7} className="text-center">
                                No admin found.
                            </td>
                        </tr>
                    }
                    {
                        adminsFiltered.map((admin, index) => <tr key={admin._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <UserAvatar photoURL={admin?.photoURL} name={admin?.displayName} />
                                </div>
                            </td>
                            <td className="font-medium">{admin?.displayName}</td>
                            <td>{admin?.email}</td>
                            <td className="capitalize">{admin?.role}</td>
                        </tr>)
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAdmins;
