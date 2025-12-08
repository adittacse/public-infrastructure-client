import { Link, NavLink, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth.jsx";
import useRole from "../../hooks/useRole.jsx";
import { useEffect, useState } from "react";
import { IoMdMoon } from "react-icons/io";
import { IoSunnySharp } from "react-icons/io5";
import Swal from "sweetalert2";

const Navbar = () => {
    const [theme, setTheme] = useState("light");
    const { user, logOut } = useAuth();
    const { role, isPremium } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
         const saved = localStorage.getItem("app-theme");
        // eslint-disable-next-line react-hooks/set-state-in-effect
         setTheme(saved || "light");
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("app-theme", theme);
    }, [theme]);

    const handleToggleTheme = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    }

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

    const menuItems = <>
        <li>
            <NavLink to="/">Home</NavLink>
        </li>
        <li>
            <NavLink to="/all-issues">All Issues</NavLink>
        </li>
        <li>
            <NavLink to="/about">About</NavLink>
        </li>
        <li>
            <NavLink to="/help">Help</NavLink>
        </li>
    </>;

    return (
        <div className="navbar bg-base-100 shadow-lg sticky top-0 z-20">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        {menuItems}
                    </ul>
                </div>
                <Link to="/" className="font-bold text-xl flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        PI
                    </span>
                    <span>Public Issue Portal</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {menuItems}
                </ul>
            </div>

            <div className="navbar-end">
                <button onClick={handleToggleTheme}
                        className="btn btn-ghost btn-circle hidden md:flex justify-center mr-2"
                        aria-label="Toggle theme"
                        title="Toggle theme"
                >
                    {
                        theme === "light" ? <IoMdMoon className="w-6 h-6" />
                            : <IoSunnySharp className="w-6 h-6" />
                    }
                </button>

                {
                    user ? <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost btn-circle avatar mr-2">
                            <div className="w-10 rounded-full border">
                                <img src={user?.photoURL} alt="user"/>
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li className="mb-1 px-2">
                                <p className="font-semibold">
                                    {user?.displayName || "Citizen"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email}
                                </p>
                                <p className="text-xs mt-1">
                                    {
                                        role  && <span>Role: {role}</span>
                                    }
                                    {
                                        isPremium && <span>{isPremium && " • PREMIUM"}</span>
                                    }
                                </p>
                            </li>
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-primary">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div> : <>
                        <Link to="/login" className="btn btn-sm btn-primary mr-2">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-sm btn-primary">
                            Register
                        </Link>
                    </>
                }
            </div>
        </div>
    );
};

export default Navbar;