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
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile/AdminProfile.jsx";
import CitizenProfile from "../pages/Dashboard/Citizen/CitizenProfile/CitizenProfile.jsx";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess.jsx";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled.jsx";
import Payments from "../pages/Dashboard/Admin/Payments/Payments.jsx";
import PaymentInvoice from "../pages/Dashboard/Admin/Payments/PaymentInvoice.jsx";

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
        hydrateFallbackElement: <Loading />,
        children: [
            {
                index: true,
                element: <DashboardHome />
            },
            {
                path: "invoice/:id",
                loader: ({ params }) => fetch(`/invoice/${params.id}`),
                element: <PaymentInvoice />
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
                path: "citizen-profile",
                element: <CitizenRoute><CitizenProfile /></CitizenRoute>
            },
            {
                path: "payment-success",
                element: <CitizenRoute><PaymentSuccess /></CitizenRoute>
            },
            {
                path: "payment-cancelled",
                element: <CitizenRoute><PaymentCancelled /></CitizenRoute>
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
                path: "payments",
                element: <AdminRoute><Payments /></AdminRoute>
            },
            {
                path: "admin-profile",
                element: <AdminRoute><AdminProfile /></AdminRoute>
            },
            // staff dashboard
            {
                path: "assigned-issues",
                element: <StaffRoute><StaffAssignedIssues /></StaffRoute>
            },
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default Router;