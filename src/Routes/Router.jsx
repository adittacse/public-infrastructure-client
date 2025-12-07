import { createBrowserRouter } from "react-router";
import Loading from "../components/Loading/Loading.jsx";
import RootLayout from "../layouts/RootLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Auth/Login/Login.jsx";
import Register from "../pages/Auth/Register/Register.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import CitizenOverview from "../pages/Dashboard/Citizen/CitizenOverview/CitizenOverview.jsx";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues/MyIssues.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";

const Router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        hydrateFallbackElement: <Loading />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <CitizenOverview />
            },
            {
                path: "my-issues",
                element: <MyIssues />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default Router;