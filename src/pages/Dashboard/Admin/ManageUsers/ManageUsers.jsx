import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [searchText, setSearchText] = useState("");
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    const params = new URLSearchParams();
    if (searchText) {
        params.append("search", searchText);
    }

    const { data: users = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ["admin-citizens", searchText],
        enabled: role === "admin",
        queryFn: async () => {
            const url = params.toString() ? `/admin/citizens?${params.toString()}` : "/admin/citizens";
            const res = await axiosSecure.get(url);
            return res.data;
        },
    });

    const handleBlockToggle = (user) => {
        const willBlock = !user.isBlocked;

        Swal.fire({
            title: willBlock ? "Block this user?" : "Unblock this user?",
            text: willBlock
                ? "The user will not be able to submit or interact with issues."
                : "The user will regain access to the system.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: willBlock ? "#d33" : "#3085d6",
            confirmButtonText: willBlock ? "Yes, block" : "Yes, unblock",
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const res = await axiosSecure.patch(`/admin/users/${user._id}/block`, { isBlocked: willBlock });
            if (res.data.modifiedCount || res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: willBlock ? "User blocked" : "User unblocked",
                    timer: 1200,
                    showConfirmButton: false,
                });
                refetch();
            }
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        refetch();
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4 items-center">
                <input type="text"
                    placeholder="Search by name or email"
                    className="input input-bordered w-full max-w-xs"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={isFetching}>
                    {
                        isFetching ? "Searching..." : "Search"
                    }
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Subscription</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.map((user, index) => <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    {
                                        user.photoURL && <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img src={user?.photoURL} alt={user?.displayName} />
                                            </div>
                                        </div>
                                    }
                                    <span>{user.displayName}</span>
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                {
                                    user.isPremium ? <>
                                        <span className="badge badge-success">
                                            Premium
                                        </span>
                                    </> : <>
                                        <span className="badge badge-ghost">
                                            Free
                                        </span>
                                    </>
                                }
                            </td>
                            <td>
                                {
                                    user.isBlocked ? <>
                                        <span className="badge badge-error">
                                            Blocked
                                        </span>
                                    </> : <>
                                        <span className="badge badge-success">
                                            Active
                                        </span>
                                    </>
                                }
                            </td>
                            <td className="capitalize">
                                {user.role || "citizen"}
                            </td>
                            <td>
                                <button onClick={() => handleBlockToggle(user)}
                                    className={`btn btn-xs ${user.isBlocked ? "btn-success" : "btn-error"}`}
                                >
                                    {
                                        user.isBlocked ? "Unblock" : "Block"
                                    }
                                </button>
                            </td>
                        </tr>)
                    }

                    {
                        users.length === 0 && <tr>
                            <td colSpan={7} className="text-center">
                                No users found.
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
