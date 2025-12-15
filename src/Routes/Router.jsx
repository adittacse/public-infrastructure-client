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
import ManageCategories from "../pages/Dashboard/Admin/ManageCategories/ManageCategories.jsx";
import StaffRoute from "./StaffRoute.jsx";
import StaffAssignedIssues from "../pages/Dashboard/Staff/StaffAssignedIssues/StaffAssignedIssues.jsx";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess.jsx";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled.jsx";
import AdminAllPayments from "../pages/Dashboard/Admin/AdminAllPayments/AdminAllPayments.jsx";
import CitizenPayments from "../pages/Dashboard/Citizen/CitizenPayments/CitizenPayments.jsx";
import Profile from "../pages/Dashboard/Profile/Profile.jsx";
import AllIssues from "../pages/Issues/AllIssues.jsx";
import Pricing from "../pages/Pricing/Pricing.jsx";
import HelpCenter from "../pages/HelpCenter/HelpCenter.jsx";
import ManageAdmins from "../pages/Dashboard/Admin/ManageAdmins/ManageAdmins.jsx";

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
                path: "all-issues",
                element: <AllIssues />
            },
            {
                path: "issues/:id",
                loader: ({ params }) => fetch(`/issues/${params.id}`),
                element: <PrivateRoute><IssueDetails /></PrivateRoute>
            },
            {
                path: "pricing",
                element: <Pricing />
            },
            {
                path: "help",
                element: <HelpCenter />
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <DashboardHome />
            },
            {
                path: "profile",
                element: <Profile />
            },
            // citizen dashboard
            {
                path: "report-issue",
                element: <CitizenRoute><ReportIssue /></CitizenRoute>
            },
            {
                path: "my-issues",
                element: <CitizenRoute><MyIssues /></CitizenRoute>
            },
            {
                path: "payment-success",
                element: <CitizenRoute><PaymentSuccess /></CitizenRoute>
            },
            {
                path: "payment-cancelled",
                element: <CitizenRoute><PaymentCancelled /></CitizenRoute>
            },
            {
                path: "citizen-payments",
                element: <CitizenRoute><CitizenPayments /></CitizenRoute>
            },
            // admin dashboard
            {
                path: "all-issues",
                element: <AdminRoute><AdminAllIssues /></AdminRoute>
            },
            {
                path: "manage-categories",
                element: <AdminRoute><ManageCategories /></AdminRoute>
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>
            },
            {
                path: "manage-staff",
                element: <AdminRoute><ManageStaff /></AdminRoute>
            },
            {
                path: "manage-admins",
                element: <AdminRoute><ManageAdmins /></AdminRoute>
            },
            {
                path: "all-payments",
                element: <AdminRoute><AdminAllPayments /></AdminRoute>
            },
            // staff dashboard
            {
                path: "assigned-issues",
                element: <StaffRoute><StaffAssignedIssues /></StaffRoute>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default Router;