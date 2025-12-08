import { useRef, useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading/Loading.jsx";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [usersFiltered, setUsersFiltered] = useState([]);
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();
    const searchRef = useRef(null);

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ["all-users"],
        enabled: role === "admin",
        queryFn: async () => {
            // const res = await axiosSecure.get(`/admin/citizens?search=${searchText}`);
            const res = await axiosSecure.get("/admin/users");
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
            if (!result.isConfirmed) return;

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
                                text: "User has been deleted.",
                                icon: "success"
                            });
                        }
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${error?.response?.data?.message}` || `${error.message}`
                        });
                    });
            }
        });
    }

    const handleSearch = () => {
        const text = searchRef.current.value.trim().toLowerCase();
        setTimeout(() => {
            if (text === "") {
                setUsersFiltered(users);
            } else {
                const result = users.filter(user => user.displayName.toLowerCase().includes(text));
                setUsersFiltered(result);
            }
        }, 0);
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

            <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input ref={searchRef} onChange={handleSearch} type="search" placeholder="Search by name or email" />
            </label>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>#</th>
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
                                    <div className="avatar">
                                        <div className="w-8 rounded-full">
                                            <img src={user?.photoURL} alt={user?.displayName} />
                                        </div>
                                    </div>
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
                                        <button onClick={() => handleChangeRole(user, "admin")} className="btn btn-xs btn-warning mr-2">Make Admin</button>
                                        <button onClick={() => handleChangeRole(user, "staff")} className="btn btn-xs btn-primary">Make Staff</button>
                                    </>
                                }
                            </td>
                            <td>
                                <button onClick={() => handleBlockToggle(user)} className={`btn btn-xs mr-2 ${user.isBlocked ? "btn-success" : "btn-error"}`}>
                                    {
                                        user.isBlocked ? "Unblock" : "Block"
                                    }
                                </button>
                                <button onClick={() => handleDeleteUser(user._id)} className="btn btn-xs btn-error">Delete</button>
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
