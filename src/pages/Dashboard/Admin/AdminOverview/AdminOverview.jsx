import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure.jsx";
import useRole from "../../../../hooks/useRole.jsx";
import Loading from "../../../../components/Loading/Loading.jsx";
import AdminChart from "./AdminChart.jsx";
import StatsCards from "./StatsCards.jsx";
import LatestIssues from "./LatestIssues.jsx";
import LatestPayments from "./LatestPayments.jsx";
import LatestUsers from "./LatestUsers.jsx";

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();
    const { role } = useRole();

    const { data, isLoading } = useQuery({
        queryKey: ["admin-overview"],
        enabled: role === "admin",
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/overview");
            return res.data;
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    const stats = data?.stats || {};
    const latestIssues = data?.latestIssues || [];
    const latestPayments = data?.latestPayments || [];
    const latestUsers = data?.latestUsers || [];

    const totalIssues = stats.totalIssues || 0;
    const pending = stats.pending || 0;
    const inProgress = stats.inProgress || 0;
    const working = stats.working || 0;
    const resolved = stats.resolved || 0;
    const closed = stats.closed || 0;
    const rejected = stats.rejected || 0;
    const totalPayments = stats.totalPayments || 0;

    const statusChartData = [
        { name: "Pending", count: pending },
        { name: "In Progress", count: inProgress },
        { name: "Working", count: working },
        { name: "Resolved", count: resolved },
        { name: "Closed", count: closed },
        { name: "Rejected", count: rejected },
    ];

    const paymentsChartData = (latestPayments || [])
        .slice()
        .reverse()
        .map((p) => ({
            name: new Date(p?.paidAt || p?.createdAt).toLocaleDateString("en-BD", {
                day: "2-digit",
                month: "short",
            }),
            amount: p?.amount || 0,
        }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>

            {/* stats cards */}
            <StatsCards
                totalIssues={totalIssues}
                pending={pending}
                inProgress={inProgress}
                working={working}
                resolved={resolved}
                closed={closed}
                rejected={rejected}
                totalPayments={totalPayments} />

            <AdminChart statusChartData={statusChartData} paymentsChartData={paymentsChartData} />

            {/* latest data */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* latest issues */}
                <LatestIssues latestIssues={latestIssues} />

                {/* latest payments */}
                <LatestPayments latestPayments={latestPayments} />

                {/* latest users */}
                <LatestUsers latestUsers={latestUsers} />
            </div>
        </div>
    );
};

export default AdminOverview;
