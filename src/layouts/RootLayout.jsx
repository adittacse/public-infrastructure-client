import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-base-200 sticky top-0 z-20">
                <Navbar />
            </nav>
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default RootLayout;