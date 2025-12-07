import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default RootLayout;