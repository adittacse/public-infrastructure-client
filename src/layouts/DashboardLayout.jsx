import { Link, NavLink, Outlet, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth.jsx";
import useRole from "../hooks/useRole.jsx";
import Swal from "sweetalert2";

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const { role, isPremium, isBlocked } = useRole();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut()
            .then(() => {
                // user logged out
                navigate("/", { replace: true });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                });
            });
    }

    return (
        <div className="min-h-screen flex bg-base-200">
            <aside className="w-64 bg-base-100 border-r hidden md:block">
                <div className="p-4 border-b">
                    <Link to="/" className="font-bold text-xl flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                            PI
                        </span>
                        <span>Public Issue Dashboard</span>
                    </Link>

                    <h2 className="font-bold text-lg">

                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {role && role.toUpperCase()}
                        {isPremium && " • PREMIUM"}
                        {isBlocked && " • BLOCKED"}
                    </p>
                </div>

                <nav className="p-4 space-y-2">
                    {/* citizen menu */}
                    {
                        role === "citizen" && <>
                            <NavLink end to="/dashboard"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Overview
                            </NavLink>

                            <NavLink to="/dashboard/my-issues"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                My Issues
                            </NavLink>

                            <NavLink to="/dashboard/report-issue"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Report Issue
                            </NavLink>

                            <NavLink to="/dashboard/citizen-payments"
                                     className={({ isActive }) =>
                                         `btn btn-sm btn-block justify-start ${
                                             isActive ? "btn-primary" : "btn-ghost"
                                         }`
                                     }
                            >
                                My Payments
                            </NavLink>
                        </>
                    }

                    {/* staff menu */}
                    {
                        role === "staff" && <>
                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Staff Overview
                            </NavLink>

                            <NavLink
                                to="/dashboard/assigned-issues"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Assigned Issues
                            </NavLink>
                        </>
                    }

                    {/* admin menu */}
                    {
                        role === "admin" && <>
                            <NavLink to="/dashboard" end
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Admin Overview
                            </NavLink>

                            <NavLink
                                to="/dashboard/all-issues"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                All Issues
                            </NavLink>

                            <NavLink
                                to="/dashboard/manage-categories"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Manage Categories
                            </NavLink>

                            <NavLink
                                to="/dashboard/manage-users"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Manage Users
                            </NavLink>

                            <NavLink
                                to="/dashboard/manage-staff"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                Manage Staff
                            </NavLink>

                            <NavLink
                                to="/dashboard/all-payments"
                                className={({ isActive }) =>
                                    `btn btn-sm btn-block justify-start ${
                                        isActive ? "btn-primary" : "btn-ghost"
                                    }`
                                }
                            >
                                All Payments
                            </NavLink>
                        </>
                    }

                    <NavLink to="/dashboard/profile"
                        className={({ isActive }) =>
                            `btn btn-sm btn-block justify-start ${
                                isActive ? "btn-primary" : "btn-ghost"
                            }`
                        }
                    >
                        Profile
                    </NavLink>

                    <button onClick={handleLogout} className="btn btn-sm btn-error btn-block mt-4">
                        Logout
                    </button>
                </nav>
            </aside>

            <div className="flex-1">
                <div className="md:hidden bg-base-100 border-b px-4 py-3 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Dashboard</h3>
                        <p className="text-xs text-gray-500">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <div className="p-4 md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
