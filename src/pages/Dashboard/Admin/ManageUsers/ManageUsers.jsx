import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import UserAvatar from "../../../../components/UserAvatar/UserAvatar.jsx";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [usersFiltered, setUsersFiltered] = useState([]);
    const [searchText, setSearchText] = useState("");
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ["all-users", searchText],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get(`/admin/users?searchText=${searchText}`);
            setUsersFiltered(res.data);
            return res.data;
        },
    });

    const handleChangeRole = (user, newRole) => {
        if (user.role === newRole) {
            return;
        }

        const titleMap = {
            admin: "Make this user Admin?",
            staff: "Make this user Staff?",
            citizen: "Make this user Citizen?",
        };

        Swal.fire({
            title: titleMap[newRole],
            text: `Current role: ${user?.role} → New role: ${newRole}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes, change it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.patch(`/admin/users/${user._id}/role`, { role: newRole })
                    .then(async (res) => {
                        if (res.data.modifiedCount) {
                            Swal.fire({
                                icon: "success",
                                title: "Role updated",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                            await refetch();
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error.message}`,
                        });
                    });
            }
        });
    };

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
            if (result.isConfirmed) {
                await axiosSecure.patch(`/admin/citizens/${user._id}/block`, {
                    isBlocked: willBlock
                })
                    .then(async (res) => {
                        if (res.data.modifiedCount) {
                            Swal.fire({
                                icon: "success",
                                title: willBlock ? "User blocked" : "User unblocked",
                                timer: 1500,
                                showConfirmButton: false,
                            });
                            await refetch();
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error.message}`
                        });
                    });
            }
        });
    };

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete user!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/admin/users/${id}`)
                    .then(async (res) => {
                        if (res.data.deletedCount) {
                            await refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Citizen has been deleted.",
                                icon: "success"
                            });
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error?.message}`
                        });
                    });
            }
        });
    }

    if (isLoading || !users) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-10">Manage Users</h1>

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
                        <th>User</th>
                        <th>Subscription</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Role Actions</th>
                        <th>Other Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        usersFiltered.length === 0 && <tr>
                            <td colSpan={7} className="text-center">
                                No users found.
                            </td>
                        </tr>
                    }
                    {
                        usersFiltered.map((user, index) => <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <UserAvatar photoURL={user?.photoURL} name={user?.displayName} />
                                    <div>
                                        <div className="font-bold">{user?.displayName}</div>
                                        <div className="text-sm opacity-50">{user?.email}</div>
                                    </div>
                                </div>
                            </td>
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
                            <td className="capitalize">{user?.role}</td>
                            <td>
                                {
                                    user?.role === "admin" && <>
                                        <button onClick={() => handleChangeRole(user, "staff")} className="btn btn-xs btn-primary mr-2">Make Staff</button>
                                        <button onClick={() => handleChangeRole(user, "citizen")} className="btn btn-xs btn-success">Make Citizen</button>
                                    </>
                                }
                                {
                                    user?.role === "staff" && <>
                                        <button onClick={() => handleChangeRole(user, "admin")} className="btn btn-xs btn-warning mr-2">Make Admin</button>
                                        <button onClick={() => handleChangeRole(user, "citizen")} className="btn btn-xs btn-success">Make Citizen</button>
                                    </>
                                }
                                {
                                    user?.role === "citizen" && <>
                                        <button onClick={() => handleChangeRole(user, "admin")} className="btn btn-sm btn-warning mr-2">Make Admin</button>
                                        <button onClick={() => handleChangeRole(user, "staff")} className="btn btn-sm btn-primary">Make Staff</button>
                                    </>
                                }
                            </td>
                            <td>
                                <button onClick={() => handleBlockToggle(user)} className={`btn btn-sm btn-outline mr-2 ${user.isBlocked ? "btn-success" : "btn-error"}`}>
                                    {
                                        user.isBlocked ? "Unblock" : "Block"
                                    }
                                </button>
                                <button onClick={() => handleDeleteUser(user._id)} className="btn btn-sm btn-outline btn-error">Delete</button>
                            </td>
                        </tr>)
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
