import { createBrowserRouter } from "react-router";
import Loading from "../components/Loading/Loading.jsx";
import RootLayout from "../layouts/RootLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Auth/Login/Login.jsx";
import Register from "../pages/Auth/Register/Register.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import MyIssues from "../pages/Dashboard/Citizen/MyIssues/MyIssues.jsx";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome.jsx";
import ReportIssue from "../pages/Dashboard/Citizen/ReportIssue/ReportIssue.jsx";
import IssueDetails from "../pages/Issues/IssueDetails.jsx";
import CitizenRoute from "./CitizenRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import AdminAllIssues from "../pages/Dashboard/Admin/AdminAllIssues/AdminAllIssues.jsx";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers/ManageUsers.jsx";
import ManageStaff from "../pages/Dashboard/Admin/ManageStaff/ManageStaff.jsx";

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
            },
            {
                path: "issues/:id",
                loader: ({ params }) => fetch(`/issues/${params.id}`),
                element: <PrivateRoute><IssueDetails /></PrivateRoute>
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // citizen dashboard
            {
                index: true,
                element: <DashboardHome />
            },
            {
                path: "report-issue",
                element: <CitizenRoute><ReportIssue /></CitizenRoute>
            },
            {
                path: "my-issues",
                element: <CitizenRoute><MyIssues /></CitizenRoute>
            },
            // admin dashboard
            {
                path: "all-issues",
                element: <AdminRoute><AdminAllIssues /></AdminRoute>
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: "manage-staff",
                element: <AdminRoute><ManageStaff /></AdminRoute>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default Router;